import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../../../stores/ProgressContext.jsx';
import { EXERCISES, EXERCISE_CATEGORIES } from '../../../data/exercisesData.js';

export default function ExercisesLandingPage() {
  const nav = useNavigate();
  const { exerciseResults } = useProgress();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(ex => {
      // Category filter
      if (selectedCategory !== 'all' && ex.category !== selectedCategory) return false;
      // Difficulty filter
      if (selectedDifficulty !== 'all' && !ex.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase())) return false;
      // Status filter
      const res = exerciseResults[ex.id];
      const isCompleted = res?.completed;
      if (selectedStatus === 'completed' && !isCompleted) return false;
      if (selectedStatus === 'incomplete' && isCompleted) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ex.title.toLowerCase().includes(q);
        const matchesDesc = (ex.description || ex.target?.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, selectedStatus, searchQuery, exerciseResults]);

  // Statistics
  const totalExercises = EXERCISES.length;
  const completedCount = Object.values(exerciseResults).filter(r => r.completed).length;
  const totalScoreEarned = Object.values(exerciseResults).reduce((sum, r) => sum + (r.bestScore || 0), 0);
  const maxPossibleScore = EXERCISES.reduce((sum, e) => sum + (e.maxScore || 10), 0);

  return (
    <div className="w" style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ marginBottom: 28, borderBottom: '1px solid var(--b)', paddingBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              color: 'var(--ok)',
              textTransform: 'uppercase',
              background: 'rgba(85, 185, 149, 0.1)',
              padding: '3px 8px',
              borderRadius: 4,
              border: '1px solid rgba(85, 185, 149, 0.25)'
            }}
          >
            Independent Practice &amp; Assessments
          </span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>
            {totalExercises} Challenges Available
          </span>
        </div>
        <h1 style={{ fontSize: 32, margin: '0 0 10px', color: 'var(--t)', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Quantum Computing Exercises
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: 'var(--m)', maxWidth: 840, lineHeight: 1.6 }}>
          Test and solidify your understanding through conceptual quizzes, circuit-building challenges, statevector prediction,
          and quantum algorithm problems. Circuits are mathematically evaluated via quantum state fidelity.
        </p>
      </div>

      {/* Progress & Performance Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 28
        }}
      >
        <div className="card" style={{ padding: '14px 18px', background: 'var(--p)' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4 }}>CHALLENGES COMPLETED</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--ok)' }}>
              {completedCount} / {totalExercises}
            </span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>
              ({totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0}%)
            </span>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px', background: 'var(--p)' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4 }}>TOTAL SCORE EARNED</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--c)' }}>
              {totalScoreEarned}
            </span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>
              / {maxPossibleScore} pts
            </span>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px', background: 'var(--p)' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4 }}>CIRCUIT FIDELITY EVALUATOR</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--t)' }}>
              |⟨ψ|ϕ⟩|² ≥ 0.999
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'pri' : ''}
            style={{ fontSize: 12, padding: '6px 14px' }}
          >
            All Categories ({totalExercises})
          </button>
          {EXERCISE_CATEGORIES.map(cat => {
            const count = EXERCISES.filter(e => e.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={isSelected ? 'pri' : ''}
                style={{ fontSize: 12, padding: '6px 14px' }}
              >
                {cat.title} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Search Row */}
      <div
        className="card"
        style={{
          background: 'var(--p)',
          border: '1px solid var(--b)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', flex: '1 1 300px' }}>
          <input
            type="text"
            placeholder="Search exercises by title or topic..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              fontSize: 13,
              padding: '6px 12px',
              borderRadius: 6,
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              color: 'var(--t)',
              minWidth: 260
            }}
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ fontSize: 11, padding: '4px 8px' }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Difficulty Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              style={{
                fontSize: 12,
                padding: '4px 8px',
                background: 'var(--bg)',
                border: '1px solid var(--b)',
                color: 'var(--t)',
                borderRadius: 4
              }}
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Status Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{
                fontSize: 12,
                padding: '4px 8px',
                background: 'var(--bg)',
                border: '1px solid var(--b)',
                color: 'var(--t)',
                borderRadius: 4
              }}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete / New</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exercises Cards Grid */}
      {filteredExercises.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', background: 'var(--p)' }}>
          <p className="m" style={{ fontSize: 14 }}>No exercises match your current filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            style={{ fontSize: 12, padding: '6px 14px' }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16
          }}
        >
          {filteredExercises.map(ex => {
            const res = exerciseResults[ex.id];
            const isCompleted = res?.completed;
            const categoryMeta = EXERCISE_CATEGORIES.find(c => c.id === ex.category);

            return (
              <div
                key={ex.id}
                className="card"
                style={{
                  background: 'var(--p)',
                  border: isCompleted ? '1px solid rgba(85, 185, 149, 0.35)' : '1px solid var(--b)',
                  borderRadius: 10,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: ex.category === 'circuit' ? 'var(--c)' : 'var(--m)',
                        background: ex.category === 'circuit' ? 'rgba(169, 154, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                        padding: '2px 7px',
                        borderRadius: 3,
                        fontWeight: 600
                      }}
                    >
                      {categoryMeta?.title || ex.category.toUpperCase()}
                    </span>

                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: ex.difficulty.includes('Advanced') ? '#f38ba8' : ex.difficulty.includes('Intermediate') ? '#f9e2af' : 'var(--ok)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        padding: '2px 6px',
                        borderRadius: 3
                      }}
                    >
                      {ex.difficulty}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 8px', fontSize: 16, color: 'var(--t)', lineHeight: 1.4 }}>
                    <Link
                      to={`/exercises/${ex.id}`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {ex.title}
                    </Link>
                  </h3>

                  <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--m)', lineHeight: 1.5 }}>
                    {ex.description || ex.target?.description}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 11,
                      marginBottom: 12,
                      paddingTop: 10,
                      borderTop: '1px solid var(--b)'
                    }}
                    className="mono"
                  >
                    <span style={{ color: 'var(--m)' }}>⏱ {ex.estimatedTime}</span>
                    <span style={{ color: 'var(--t)' }}>Max: {ex.maxScore || 10} pts</span>
                    {isCompleted ? (
                      <span style={{ color: 'var(--ok)', fontWeight: 600 }}>
                        ✓ {res.bestScore}/{res.maxScore || ex.maxScore} pts
                      </span>
                    ) : (
                      <span style={{ color: 'var(--m)' }}>Not attempted</span>
                    )}
                  </div>

                  <button
                    className={!isCompleted ? 'pri' : ''}
                    onClick={() => nav(`/exercises/${ex.id}`)}
                    style={{
                      width: '100%',
                      fontSize: 13,
                      padding: '8px 14px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <span>
                      {isCompleted
                        ? 'Retake Challenge'
                        : ex.category === 'circuit'
                        ? 'Build Circuit Challenge'
                        : 'Start Exercise'}
                    </span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

