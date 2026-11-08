import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../../../stores/ProgressContext.jsx';
import { useCircuit } from '../../../stores/CircuitContext.jsx';
import { LEARNING_PATHS } from '../../../data/learningCurriculum.js';
import BlochSphere, { BlochReadout } from '../../../components/visualizations/BlochSphere.jsx';

export default function LessonPage() {
  const { pathId, lessonId } = useParams();
  const nav = useNavigate();
  const { setCirc } = useCircuit();
  const {
    isLessonCompleted,
    completeLesson,
    isBookmarked,
    toggleBookmark,
    setCurrentPosition
  } = useProgress();

  const path = LEARNING_PATHS.find(p => p.id === pathId) || LEARNING_PATHS[0];
  const lessonIndex = path.lessons.findIndex(l => l.id === lessonId);
  const lesson = path.lessons[lessonIndex !== -1 ? lessonIndex : 0];

  const prevLesson = lessonIndex > 0 ? path.lessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < path.lessons.length - 1 ? path.lessons[lessonIndex + 1] : null;

  // Track position
  useEffect(() => {
    if (path && lesson) {
      setCurrentPosition(path.id, lesson.id);
    }
  }, [path, lesson, setCurrentPosition]);

  // Interactive Bloch Sphere angles state
  const defaultTheta = lesson.interactive?.theta !== undefined ? lesson.interactive.theta : 0;
  const defaultPhi = lesson.interactive?.phi !== undefined ? lesson.interactive.phi : 0;

  const [theta, setTheta] = useState(defaultTheta);
  const [phi, setPhi] = useState(defaultPhi);

  // Reset interactive when lesson changes
  useEffect(() => {
    setTheta(lesson.interactive?.theta !== undefined ? lesson.interactive.theta : 0);
    setPhi(lesson.interactive?.phi !== undefined ? lesson.interactive.phi : 0);
  }, [lesson]);

  // Compute Bloch vector [x, y, z] from (theta, phi)
  const blochVector = useMemo(() => {
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);
    return [x, y, z];
  }, [theta, phi]);

  // Probabilities from theta
  const prob0 = Math.cos(theta / 2) ** 2;
  const prob1 = Math.sin(theta / 2) ** 2;

  const isCompleted = isLessonCompleted(lesson.id);
  const bookmarked = isBookmarked(lesson.id);

  const handleOpenInCircuitStudio = () => {
    if (lesson.demonstration?.circuit) {
      setCirc({
        n: lesson.demonstration.circuit.n || 2,
        ops: [...lesson.demonstration.circuit.ops],
        note: {
          name: `${lesson.title} (Demo)`,
          description: lesson.demonstration.description || lesson.summary,
          expected: lesson.demonstration.expectedState || 'Demonstration Circuit',
          type: 'Curriculum Lesson',
          level: path.level
        }
      });
      nav('/studio');
    }
  };

  const handleCompleteAndNext = () => {
    completeLesson(path.id, lesson.id);
    if (nextLesson) {
      nav(`/learn/path/${path.id}/lesson/${nextLesson.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      nav(`/learn/path/${path.id}`);
    }
  };

  return (
    <div className="w" style={{ maxWidth: 960, paddingBottom: 80 }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }} className="mono">
        <Link to="/learn" style={{ color: 'var(--m)', textDecoration: 'none', fontSize: 12 }}>
          Learn
        </Link>
        <span style={{ color: 'var(--b)' }}>/</span>
        <Link to={`/learn/path/${path.id}`} style={{ color: 'var(--m)', textDecoration: 'none', fontSize: 12 }}>
          PATH {path.number}
        </Link>
        <span style={{ color: 'var(--b)' }}>/</span>
        <span style={{ color: 'var(--c)', fontSize: 12 }}>Lesson {lesson.number}</span>
      </div>

      {/* Lesson Header */}
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
                  color: 'var(--c)',
                  background: 'rgba(169, 154, 255, 0.1)',
                  padding: '2px 7px',
                  borderRadius: 3
                }}
              >
                LESSON {String(lesson.number).padStart(2, '0')} OF {path.lessons.length}
              </span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                ⏱ {lesson.duration} read
              </span>
              {isCompleted && (
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
                  ✓ Completed
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 26, margin: '0 0 8px', color: 'var(--t)', fontWeight: 700 }}>
              {lesson.title}
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--m)', lineHeight: 1.5 }}>
              {lesson.summary}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => toggleBookmark(lesson.id)}
              style={{
                fontSize: 12,
                padding: '6px 12px',
                borderColor: bookmarked ? 'var(--c)' : 'var(--b)',
                color: bookmarked ? 'var(--c)' : 'var(--m)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>{bookmarked ? '★' : '☆'}</span>
              <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section 1: Core Pedagogical Concept */}
      <div
        className="card"
        style={{
          background: 'var(--p)',
          border: '1px solid var(--b)',
          borderRadius: 10,
          padding: 24,
          marginBottom: 24
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>📖</span>
          <h2 style={{ margin: 0, fontSize: 18, color: 'var(--t)' }}>1. Core Quantum Concept</h2>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--t)', whiteSpace: 'pre-line' }}>
          {lesson.concept}
        </div>
      </div>

      {/* Content Section 2: Mathematical Formulation */}
      {lesson.math && (
        <div
          className="card"
          style={{
            background: 'var(--p)',
            border: '1px solid var(--b)',
            borderRadius: 10,
            padding: 24,
            marginBottom: 24
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>📐</span>
            <h2 style={{ margin: 0, fontSize: 18, color: 'var(--t)' }}>2. Mathematical Formulation</h2>
          </div>
          <div
            className="mono"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              borderRadius: 6,
              padding: 16,
              fontSize: 13,
              color: 'var(--c)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              overflowX: 'auto'
            }}
          >
            {lesson.math}
          </div>
        </div>
      )}

      {/* Content Section 3: Interactive Quantum Demonstration (Bloch Sphere & Amplitudes) */}
      <div
        className="card"
        style={{
          background: 'var(--p)',
          border: '1px solid var(--b)',
          borderRadius: 10,
          padding: 24,
          marginBottom: 24
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>🔮</span>
          <h2 style={{ margin: 0, fontSize: 18, color: 'var(--t)' }}>3. Interactive Statevector Visualization</h2>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--m)' }}>
          {lesson.interactive?.label
            ? `Demonstrating state: ${lesson.interactive.label}. Drag to rotate the 3D sphere coordinate frame or adjust angles below.`
            : 'Explore pure state representation on the 3D Bloch sphere.'}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'center' }}>
          {/* Bloch Sphere Canvas */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <BlochSphere v={blochVector} size={240} />
            <BlochReadout v={blochVector} />
          </div>

          {/* Controls & Amplitudes readout */}
          <div style={{ flex: '1 1 280px', minWidth: 260 }}>
            {/* Presets */}
            <div style={{ marginBottom: 16 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 6 }}>STATE PRESETS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <button
                  style={{ fontSize: 11, padding: '4px 8px' }}
                  onClick={() => { setTheta(0); setPhi(0); }}
                >
                  |0⟩
                </button>
                <button
                  style={{ fontSize: 11, padding: '4px 8px' }}
                  onClick={() => { setTheta(Math.PI); setPhi(0); }}
                >
                  |1⟩
                </button>
                <button
                  style={{ fontSize: 11, padding: '4px 8px' }}
                  onClick={() => { setTheta(Math.PI / 2); setPhi(0); }}
                >
                  |+⟩
                </button>
                <button
                  style={{ fontSize: 11, padding: '4px 8px' }}
                  onClick={() => { setTheta(Math.PI / 2); setPhi(Math.PI); }}
                >
                  |-⟩
                </button>
                <button
                  style={{ fontSize: 11, padding: '4px 8px' }}
                  onClick={() => { setTheta(Math.PI / 2); setPhi(Math.PI / 2); }}
                >
                  |+i⟩
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }} className="mono">
                <span style={{ color: 'var(--m)' }}>Polar Angle θ: {(theta * (180 / Math.PI)).toFixed(1)}°</span>
                <span style={{ color: 'var(--c)' }}>{(theta / Math.PI).toFixed(2)}π</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.PI}
                step="0.02"
                value={theta}
                onChange={e => setTheta(parseFloat(e.target.value))}
                style={{ width: '100%', margin: '4px 0' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }} className="mono">
                <span style={{ color: 'var(--m)' }}>Azimuthal Angle φ: {(phi * (180 / Math.PI)).toFixed(1)}°</span>
                <span style={{ color: 'var(--c)' }}>{(phi / Math.PI).toFixed(2)}π</span>
              </div>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.04"
                value={phi}
                onChange={e => setPhi(parseFloat(e.target.value))}
                style={{ width: '100%', margin: '4px 0' }}
              />
            </div>

            {/* Measurement Probabilities */}
            <div style={{ background: 'var(--bg)', padding: 12, borderRadius: 6, border: '1px solid var(--b)' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 8 }}>
                BORN MEASUREMENT PROBABILITIES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="mono">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span>P(|0⟩) = cos²(θ/2)</span>
                    <span style={{ color: 'var(--c)' }}>{(prob0 * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--e)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${prob0 * 100}%`, background: 'var(--c)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                    <span>P(|1⟩) = sin²(θ/2)</span>
                    <span style={{ color: '#f38ba8' }}>{(prob1 * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--e)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${prob1 * 100}%`, background: '#f38ba8' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section 4: Practical Demonstration & Open in Circuit Studio */}
      {lesson.demonstration && (
        <div
          className="card"
          style={{
            background: 'var(--p)',
            border: '1px solid var(--b)',
            borderRadius: 10,
            padding: 24,
            marginBottom: 24
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <h2 style={{ margin: 0, fontSize: 18, color: 'var(--t)' }}>4. Practical Demonstration</h2>
            </div>
            <button
              className="pri"
              onClick={handleOpenInCircuitStudio}
              style={{
                fontSize: 12,
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span>🔬 Open in Circuit Studio</span>
              <span>→</span>
            </button>
          </div>

          <h3 style={{ margin: '0 0 6px', fontSize: 15, color: 'var(--t)' }}>
            {lesson.demonstration.title}
          </h3>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--m)' }}>
            {lesson.demonstration.description}
          </p>

          <div
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              borderRadius: 6,
              padding: '12px 16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12
            }}
            className="mono"
          >
            <div>
              <div style={{ fontSize: 10, color: 'var(--m)', marginBottom: 2 }}>TARGET STATEVECTOR</div>
              <div style={{ fontSize: 12, color: 'var(--c)' }}>{lesson.demonstration.expectedState}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--m)', marginBottom: 2 }}>BORN PROBABILITIES</div>
              <div style={{ fontSize: 12, color: 'var(--ok)' }}>{lesson.demonstration.expectedProbabilities}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--m)', marginBottom: 2 }}>CIRCUIT GATES</div>
              <div style={{ fontSize: 12, color: 'var(--t)' }}>{lesson.demonstration.circuit?.ops?.length || 0} quantum gate(s)</div>
            </div>
          </div>
        </div>
      )}

      {/* Content Section 5: Key Takeaways */}
      {lesson.takeaways && lesson.takeaways.length > 0 && (
        <div
          className="card"
          style={{
            background: 'var(--p)',
            border: '1px solid var(--b)',
            borderRadius: 10,
            padding: 24,
            marginBottom: 32
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <h2 style={{ margin: 0, fontSize: 18, color: 'var(--t)' }}>5. Key Takeaways</h2>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: 'var(--t)', lineHeight: 1.7 }}>
            {lesson.takeaways.map((point, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 6: Lesson Navigation & Complete Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          paddingTop: 16,
          borderTop: '1px solid var(--b)'
        }}
      >
        <div>
          {prevLesson ? (
            <button
              onClick={() => {
                nav(`/learn/path/${path.id}/lesson/${prevLesson.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ fontSize: 13, padding: '8px 16px' }}
            >
              ← Previous: Lesson {prevLesson.number}
            </button>
          ) : (
            <Link
              to={`/learn/path/${path.id}`}
              className="mono"
              style={{ fontSize: 12, color: 'var(--m)', textDecoration: 'none' }}
            >
              ← Back to Path Syllabus
            </Link>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            className="pri"
            onClick={handleCompleteAndNext}
            style={{
              fontSize: 14,
              padding: '10px 22px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span>{isCompleted ? 'Next Lesson' : 'Mark as Completed & Continue'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

