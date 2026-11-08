import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../../../stores/ProgressContext.jsx';
import { useCircuit } from '../../../stores/CircuitContext.jsx';
import { EXERCISES, EXERCISE_CATEGORIES } from '../../../data/exercisesData.js';
import { simulate, GATES, nextId } from '@qubitry/quantum-core';

export default function ExerciseRunnerPage() {
  const { exerciseId } = useParams();
  const nav = useNavigate();
  const { saveExerciseResult, exerciseResults } = useProgress();
  const { setCirc } = useCircuit();

  const exercise = EXERCISES.find(e => e.id === exerciseId) || EXERCISES[0];
  const categoryMeta = EXERCISE_CATEGORIES.find(c => c.id === exercise.category);

  // Existing result
  const existingResult = exerciseResults[exercise.id];

  // ==========================================
  // QUESTION-BASED RUNNER STATE
  // ==========================================
  const questions = exercise.questions || [];
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionIdx }
  const [submittedQuestions, setSubmittedQuestions] = useState({}); // { [qId]: boolean }
  const [showFinalSummary, setShowFinalSummary] = useState(false);

  // ==========================================
  // CIRCUIT CHALLENGE RUNNER STATE
  // ==========================================
  const isCircuitChallenge = exercise.category === 'circuit';
  const qubitCount = exercise.qubits || 1;
  const [circuitOps, setCircuitOps] = useState(() => exercise.initialOps ? [...exercise.initialOps] : []);
  const [selectedTool, setSelectedTool] = useState('H');
  const [selectedControl, setSelectedControl] = useState(null); // for CX/CZ
  const [showHint, setShowHint] = useState(false);
  const [challengeSolved, setChallengeSolved] = useState(false);

  // Compute live user statevector
  const userSim = useMemo(() => {
    if (!isCircuitChallenge) return null;
    try {
      return simulate(qubitCount, circuitOps);
    } catch (e) {
      console.warn('Simulation error:', e);
      return null;
    }
  }, [isCircuitChallenge, qubitCount, circuitOps]);

  // Compute Quantum State Fidelity: F = |<psi_target | psi_user>|^2
  const fidelity = useMemo(() => {
    if (!isCircuitChallenge || !userSim || !exercise.target?.targetState) return 0;
    const tgt = exercise.target.targetState;
    const usr = userSim;
    const N = 1 << qubitCount;

    let dotRe = 0;
    let dotIm = 0;

    for (let i = 0; i < N; i++) {
      const tr = tgt.re[i] || 0;
      const ti = tgt.im[i] || 0;
      const ur = usr.re[i] || 0;
      const ui = usr.im[i] || 0;

      // (tr - i*ti) * (ur + i*ui) = (tr*ur + ti*ui) + i*(tr*ui - ti*ur)
      dotRe += tr * ur + ti * ui;
      dotIm += tr * ui - ti * ur;
    }

    const F = dotRe * dotRe + dotIm * dotIm;
    return Math.min(1.0, Math.max(0, F));
  }, [isCircuitChallenge, userSim, exercise.target, qubitCount]);

  // Check if target fidelity reached (>= 0.999)
  useEffect(() => {
    if (isCircuitChallenge && fidelity >= 0.999 && !challengeSolved) {
      setChallengeSolved(true);
      const max = exercise.maxScore || 15;
      saveExerciseResult(exercise.id, max, max, true);
    }
  }, [isCircuitChallenge, fidelity, challengeSolved, exercise, saveExerciseResult]);

  // Add gate to circuit wire
  const handleAddGate = (wireIdx) => {
    if (selectedTool === 'CX' || selectedTool === 'CZ') {
      if (selectedControl === null) {
        setSelectedControl(wireIdx);
        return;
      }
      if (selectedControl === wireIdx) {
        setSelectedControl(null);
        return;
      }
      // Add two-qubit gate
      const newOp = {
        id: nextId(),
        g: selectedTool,
        q: [selectedControl, wireIdx],
        s: circuitOps.length
      };
      setCircuitOps(prev => [...prev, newOp]);
      setSelectedControl(null);
      return;
    }

    const newOp = {
      id: nextId(),
      g: selectedTool,
      q: [wireIdx],
      s: circuitOps.length
    };
    setCircuitOps(prev => [...prev, newOp]);
  };

  const handleRemoveOp = (opId) => {
    setCircuitOps(prev => prev.filter(op => op.id !== opId));
    setChallengeSolved(false);
  };

  const handleResetCircuit = () => {
    setCircuitOps([]);
    setSelectedControl(null);
    setChallengeSolved(false);
  };

  const handleOpenInStudio = () => {
    setCirc({
      n: qubitCount,
      ops: [...circuitOps],
      note: {
        name: exercise.title,
        description: exercise.target?.description || exercise.description,
        expected: `Target: ${exercise.target?.description}`,
        type: 'Challenge Circuit',
        level: exercise.difficulty
      }
    });
    nav('/studio');
  };

  // Question submission handling
  const handleSelectOption = (qId, optionIdx) => {
    if (submittedQuestions[qId]) return; // locked after submission
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuestion = (qId) => {
    if (selectedAnswers[qId] === undefined) return;
    setSubmittedQuestions(prev => ({ ...prev, [qId]: true }));
  };

  const handleFinishQuiz = useCallback(() => {
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });
    const max = exercise.maxScore || 10;
    const earned = Math.round((correctCount / (questions.length || 1)) * max);
    const passed = correctCount >= Math.ceil(questions.length * 0.7);
    saveExerciseResult(exercise.id, earned, max, passed);
    setShowFinalSummary(true);
  }, [questions, selectedAnswers, exercise, saveExerciseResult]);

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setCurrentQIdx(0);
    setShowFinalSummary(false);
  };

  return (
    <div className="w" style={{ maxWidth: 960, paddingBottom: 80 }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }} className="mono">
        <Link to="/exercises" style={{ color: 'var(--m)', textDecoration: 'none', fontSize: 12 }}>
          ← Back to All Exercises
        </Link>
        <span style={{ color: 'var(--b)' }}>/</span>
        <span style={{ color: 'var(--c)', fontSize: 12 }}>
          {categoryMeta?.title || exercise.category.toUpperCase()}
        </span>
      </div>

      {/* Exercise Header */}
      <div
        className="card"
        style={{
          background: 'var(--p)',
          border: '1px solid var(--b)',
          borderRadius: 12,
          padding: '24px 28px',
          marginBottom: 28
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: isCircuitChallenge ? 'var(--c)' : 'var(--ok)',
                  background: isCircuitChallenge ? 'rgba(169, 154, 255, 0.1)' : 'rgba(85, 185, 149, 0.1)',
                  padding: '2px 8px',
                  borderRadius: 3
                }}
              >
                {categoryMeta?.title || exercise.category.toUpperCase()}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  color: exercise.difficulty.includes('Advanced') ? '#f38ba8' : exercise.difficulty.includes('Intermediate') ? '#f9e2af' : 'var(--ok)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 6px',
                  borderRadius: 3
                }}
              >
                {exercise.difficulty}
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                ⏱ {exercise.estimatedTime}
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                ⭐ {exercise.maxScore} points
              </span>
              {existingResult?.completed && (
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: 'var(--ok)',
                    background: 'rgba(85, 185, 149, 0.15)',
                    padding: '2px 7px',
                    borderRadius: 3
                  }}
                >
                  ✓ Passed ({existingResult.bestScore}/{existingResult.maxScore} pts)
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 24, margin: '0 0 8px', color: 'var(--t)', fontWeight: 700 }}>
              {exercise.title}
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--m)', lineHeight: 1.5 }}>
              {exercise.description || exercise.target?.description}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* MODE 1: CIRCUIT BUILDING CHALLENGE                         */}
      {/* ========================================================== */}
      {isCircuitChallenge ? (
        <div>
          {/* Target Requirement Card */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(24, 33, 49, 0.95), rgba(15, 23, 42, 0.95))',
              border: challengeSolved ? '1px solid var(--ok)' : '1px solid var(--c)',
              borderRadius: 10,
              padding: 22,
              marginBottom: 24
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🎯</span>
                <h3 style={{ margin: 0, fontSize: 17, color: 'var(--t)' }}>Target Requirement</h3>
              </div>
              {exercise.target?.hint && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  style={{ fontSize: 11, padding: '4px 10px' }}
                >
                  {showHint ? 'Hide Hint' : '💡 Show Hint'}
                </button>
              )}
            </div>

            <p style={{ margin: '0 0 14px', fontSize: 14, color: 'var(--t)' }}>
              {exercise.target?.description}
            </p>

            {showHint && exercise.target?.hint && (
              <div
                style={{
                  background: 'rgba(255, 180, 50, 0.08)',
                  border: '1px solid rgba(255, 180, 50, 0.3)',
                  padding: 12,
                  borderRadius: 6,
                  marginBottom: 14,
                  fontSize: 13,
                  color: '#f9e2af'
                }}
              >
                <b>Hint:</b> {exercise.target.hint}
              </div>
            )}

            {/* Fidelity & Expected Probabilities */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 14,
                background: 'var(--bg)',
                padding: 14,
                borderRadius: 6,
                border: '1px solid var(--b)'
              }}
              className="mono"
            >
              <div>
                <div style={{ fontSize: 10, color: 'var(--m)', marginBottom: 2 }}>STATE FIDELITY F = |⟨ψ_tgt|ψ_usr⟩|²</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: challengeSolved ? 'var(--ok)' : 'var(--c)' }}>
                    {(fidelity * 100).toFixed(2)}%
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--m)' }}>
                    {challengeSolved ? '(Target satisfied!)' : '(Goal: ≥ 99.9%)'}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 6, background: 'var(--e)', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${fidelity * 100}%`,
                      background: challengeSolved ? 'var(--ok)' : 'var(--c)',
                      transition: 'width 0.2s ease'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--m)', marginBottom: 4 }}>TARGET PROBABILITIES</div>
                <div style={{ fontSize: 12, color: 'var(--t)' }}>
                  {Object.entries(exercise.target?.expectedProbabilities || {}).map(([bs, p]) => (
                    <span key={bs} style={{ marginRight: 10 }}>
                      P(|{bs}⟩) = {(p * 100).toFixed(0)}%
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {challengeSolved && (
            <div
              className="card"
              style={{
                background: 'rgba(85, 185, 149, 0.15)',
                border: '1px solid var(--ok)',
                borderRadius: 10,
                padding: 20,
                marginBottom: 24,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>🎉</div>
              <h3 style={{ margin: '0 0 6px', fontSize: 18, color: 'var(--ok)' }}>
                Challenge Successfully Solved!
              </h3>
              <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--t)' }}>
                Your quantum circuit state matches the target wavefunction with 100% mathematical fidelity.
                Score awarded: <b>{exercise.maxScore} points</b>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button
                  className="pri"
                  onClick={() => nav('/exercises')}
                  style={{ fontSize: 13, padding: '8px 20px' }}
                >
                  Explore Next Challenge →
                </button>
              </div>
            </div>
          )}

          {/* Interactive Circuit Builder Canvas */}
          <div
            className="card"
            style={{
              background: 'var(--p)',
              border: '1px solid var(--b)',
              borderRadius: 10,
              padding: 20,
              marginBottom: 24
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: 16, color: 'var(--t)' }}>Circuit Workspace</h3>
                <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                  {circuitOps.length} gates placed · {qubitCount} wire(s)
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleResetCircuit}
                  style={{ fontSize: 11, padding: '5px 10px' }}
                >
                  Clear Wires
                </button>
                <button
                  onClick={handleOpenInStudio}
                  style={{ fontSize: 11, padding: '5px 12px' }}
                >
                  🔬 Open in Circuit Studio
                </button>
              </div>
            </div>

            {/* Gate Palette */}
            <div style={{ marginBottom: 16 }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--m)', marginBottom: 6 }}>
                GATE TOOLBOX (SELECT GATE THEN CLICK WIRE TO INSERT)
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['H', 'X', 'Y', 'Z', 'S', 'T', 'CX', 'CZ'].map(g => (
                  <button
                    key={g}
                    className={selectedTool === g ? 'pri' : ''}
                    onClick={() => {
                      setSelectedTool(g);
                      setSelectedControl(null);
                    }}
                    style={{ fontSize: 12, padding: '5px 10px', minWidth: 38 }}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {(selectedTool === 'CX' || selectedTool === 'CZ') && (
                <div className="mono" style={{ fontSize: 11, color: 'var(--c)', marginTop: 6 }}>
                  {selectedControl === null
                    ? `Click the control wire for ${selectedTool}`
                    : `Control selected on q${selectedControl}. Now click target wire!`}
                </div>
              )}
            </div>

            {/* Wires Display */}
            <div
              style={{
                background: 'var(--bg)',
                borderRadius: 8,
                padding: '16px 20px',
                border: '1px solid var(--b)',
                overflowX: 'auto'
              }}
            >
              {Array.from({ length: qubitCount }).map((_, wireIdx) => {
                const wireOps = circuitOps.filter(op => op.q.includes(wireIdx));

                return (
                  <div
                    key={wireIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: 52,
                      position: 'relative',
                      marginBottom: 8
                    }}
                  >
                    {/* Wire Label */}
                    <div
                      className="mono"
                      style={{
                        width: 50,
                        fontSize: 12,
                        color: 'var(--c)',
                        flexShrink: 0
                      }}
                    >
                      q[{wireIdx}] |0⟩
                    </div>

                    {/* Wire Line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 55,
                        right: 0,
                        height: 2,
                        background: selectedControl === wireIdx ? 'var(--c)' : 'var(--b)',
                        zIndex: 1
                      }}
                    />

                    {/* Ops along wire */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        paddingLeft: 20,
                        position: 'relative',
                        zIndex: 2,
                        flex: 1
                      }}
                    >
                      {wireOps.map(op => {
                        const isTarget = op.q[op.q.length - 1] === wireIdx;
                        const isCtrl = op.q[0] === wireIdx && op.q.length > 1;

                        return (
                          <div
                            key={op.id}
                            onClick={() => handleRemoveOp(op.id)}
                            title="Click to remove gate"
                            className="mono"
                            style={{
                              background: isCtrl ? 'var(--c)' : 'var(--p)',
                              border: '1px solid var(--c)',
                              borderRadius: 4,
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isCtrl ? '#0d121c' : 'var(--t)',
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                            }}
                          >
                            {isCtrl ? '●' : op.g}
                          </div>
                        );
                      })}

                      {/* Add Gate Button on wire */}
                      <button
                        onClick={() => handleAddGate(wireIdx)}
                        style={{
                          fontSize: 11,
                          padding: '3px 8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderColor: 'var(--b)',
                          borderRadius: 4,
                          cursor: 'pointer'
                        }}
                      >
                        + Place {selectedTool}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Probabilities Readout */}
            {userSim && (
              <div style={{ marginTop: 16 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 8 }}>
                  CURRENT WAVEFUNCTION MEASUREMENT PROBABILITIES
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} className="mono">
                  {Array.from({ length: 1 << qubitCount }).map((_, i) => {
                    const bs = i.toString(2).padStart(qubitCount, '0');
                    const re = userSim.re[i];
                    const im = userSim.im[i];
                    const prob = re * re + im * im;
                    if (prob < 0.001) return null;

                    return (
                      <div
                        key={bs}
                        style={{
                          background: 'var(--bg)',
                          border: '1px solid var(--b)',
                          borderRadius: 4,
                          padding: '6px 10px',
                          fontSize: 11
                        }}
                      >
                        <span style={{ color: 'var(--m)' }}>|{bs}⟩: </span>
                        <span style={{ color: 'var(--c)', fontWeight: 600 }}>{(prob * 100).toFixed(1)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================== */
        /* MODE 2: QUESTION-BASED RUNNER (QUIZ, PREDICTION, MATH)     */
        /* ========================================================== */
        <div>
          {showFinalSummary ? (
            /* Final Score Banner */
            <div
              className="card"
              style={{
                background: 'var(--p)',
                border: '1px solid var(--c)',
                borderRadius: 12,
                padding: 32,
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, color: 'var(--t)' }}>
                Assessment Complete!
              </h2>

              {(() => {
                let correctCount = 0;
                questions.forEach(q => {
                  if (selectedAnswers[q.id] === q.correct) correctCount++;
                });
                const percentage = Math.round((correctCount / (questions.length || 1)) * 100);

                return (
                  <div>
                    <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--c)', margin: '12px 0 6px' }}>
                      {correctCount} / {questions.length} Correct
                    </div>
                    <p style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--m)' }}>
                      Accuracy: {percentage}% · Score recorded: {Math.round((correctCount / questions.length) * (exercise.maxScore || 10))} points
                    </p>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button
                  onClick={handleRetakeQuiz}
                  style={{ fontSize: 13, padding: '8px 18px' }}
                >
                  Retake Questions
                </button>
                <button
                  className="pri"
                  onClick={() => nav('/exercises')}
                  style={{ fontSize: 13, padding: '8px 20px' }}
                >
                  Back to All Exercises →
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Card */
            <div>
              {/* Question progress */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }} className="mono">
                <span style={{ fontSize: 12, color: 'var(--m)' }}>
                  Question {currentQIdx + 1} of {questions.length}
                </span>
                <span style={{ fontSize: 12, color: 'var(--c)' }}>
                  {Object.keys(submittedQuestions).length} of {questions.length} Answered
                </span>
              </div>

              {(() => {
                const q = questions[currentQIdx];
                if (!q) return null;
                const isSubmitted = !!submittedQuestions[q.id];
                const selectedOpt = selectedAnswers[q.id];
                const isCorrect = selectedOpt === q.correct;

                return (
                  <div
                    className="card"
                    style={{
                      background: 'var(--p)',
                      border: '1px solid var(--b)',
                      borderRadius: 10,
                      padding: 24,
                      marginBottom: 20
                    }}
                  >
                    <h3 style={{ margin: '0 0 18px', fontSize: 17, color: 'var(--t)', lineHeight: 1.5 }}>
                      {q.prompt}
                    </h3>

                    {/* Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedOpt === optIdx;
                        let optBorder = '1px solid var(--b)';
                        let optBg = 'var(--bg)';
                        let optColor = 'var(--t)';

                        if (isSubmitted) {
                          if (optIdx === q.correct) {
                            optBorder = '1px solid var(--ok)';
                            optBg = 'rgba(85, 185, 149, 0.15)';
                            optColor = 'var(--ok)';
                          } else if (isSelected && !isCorrect) {
                            optBorder = '1px solid #f38ba8';
                            optBg = 'rgba(243, 139, 168, 0.15)';
                            optColor = '#f38ba8';
                          }
                        } else if (isSelected) {
                          optBorder = '1px solid var(--c)';
                          optBg = 'rgba(169, 154, 255, 0.1)';
                        }

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            style={{
                              border: optBorder,
                              background: optBg,
                              color: optColor,
                              padding: '12px 16px',
                              borderRadius: 6,
                              cursor: isSubmitted ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span
                              className="mono"
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid currentColor',
                                fontSize: 11,
                                flexShrink: 0
                              }}
                            >
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span style={{ fontSize: 14 }}>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {isSubmitted && (
                      <div
                        style={{
                          background: isCorrect ? 'rgba(85, 185, 149, 0.1)' : 'rgba(243, 139, 168, 0.1)',
                          border: `1px solid ${isCorrect ? 'var(--ok)' : '#f38ba8'}`,
                          borderRadius: 6,
                          padding: 14,
                          marginBottom: 20
                        }}
                      >
                        <div style={{ fontWeight: 600, color: isCorrect ? 'var(--ok)' : '#f38ba8', marginBottom: 4 }}>
                          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--t)', lineHeight: 1.5 }}>
                          {q.explanation}
                        </div>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <button
                        disabled={currentQIdx === 0}
                        onClick={() => setCurrentQIdx(prev => Math.max(0, prev - 1))}
                        style={{ fontSize: 12, padding: '6px 14px', opacity: currentQIdx === 0 ? 0.4 : 1 }}
                      >
                        ← Previous
                      </button>

                      <div style={{ display: 'flex', gap: 10 }}>
                        {!isSubmitted ? (
                          <button
                            className="pri"
                            disabled={selectedOpt === undefined}
                            onClick={() => handleSubmitQuestion(q.id)}
                            style={{
                              fontSize: 13,
                              padding: '7px 18px',
                              opacity: selectedOpt === undefined ? 0.5 : 1
                            }}
                          >
                            Submit Answer
                          </button>
                        ) : currentQIdx < questions.length - 1 ? (
                          <button
                            className="pri"
                            onClick={() => setCurrentQIdx(prev => prev + 1)}
                            style={{ fontSize: 13, padding: '7px 18px' }}
                          >
                            Next Question →
                          </button>
                        ) : (
                          <button
                            className="pri"
                            onClick={handleFinishQuiz}
                            style={{ fontSize: 13, padding: '7px 20px', fontWeight: 600 }}
                          >
                            Finish &amp; View Results →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

