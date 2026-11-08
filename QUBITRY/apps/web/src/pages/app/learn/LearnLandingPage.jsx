import { Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../../../stores/ProgressContext.jsx';
import { LEARNING_PATHS, TOPICS } from '../../../data/learningCurriculum.js';

export default function LearnLandingPage() {
  const nav = useNavigate();
  const {
    completedLessons,
    currentPosition,
    getPathProgress,
    getOverallProgress
  } = useProgress();

  const overall = getOverallProgress();

  // Find active path & lesson for "Continue Learning"
  const activePath = LEARNING_PATHS.find(p => p.id === currentPosition.pathId) || LEARNING_PATHS[0];
  const activeLesson = activePath.lessons.find(l => l.id === currentPosition.lessonId) || activePath.lessons[0];
  const activePathProgress = getPathProgress(activePath.id);

  const hasStarted = completedLessons.length > 0;

  // Helper to check if path is unlocked
  const isPathUnlocked = (pathIndex) => {
    if (pathIndex === 0) return true;
    const prevPath = LEARNING_PATHS[pathIndex - 1];
    const prevProgress = getPathProgress(prevPath.id);
    // Unlocked if previous path has at least 50% or 3 lessons completed
    return prevProgress.completed >= 3 || prevProgress.percentage >= 40;
  };

  return (
    <div className="w" style={{ paddingBottom: 60 }}>
      {/* Hero Header */}
      <div style={{ marginBottom: 32, borderBottom: '1px solid var(--b)', paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              color: 'var(--c)',
              textTransform: 'uppercase',
              background: 'rgba(169, 154, 255, 0.1)',
              padding: '3px 8px',
              borderRadius: 4,
              border: '1px solid rgba(169, 154, 255, 0.25)'
            }}
          >
            Structured Curriculum
          </span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>
            44 Lessons · 5 Paths
          </span>
        </div>
        <h1 style={{ fontSize: 32, margin: '0 0 10px', color: 'var(--t)', fontWeight: 700, letterSpacing: '-0.02em' }}>
          Learn Quantum Computing
        </h1>
        <p style={{ margin: 0, fontSize: 16, color: 'var(--m)', maxWidth: 840, lineHeight: 1.6 }}>
          A structured journey through quantum computing, from fundamental concepts to advanced quantum algorithms.
          Master Dirac notation, quantum logic gates, entanglement, and algorithmic speedups with interactive simulations.
        </p>
      </div>

      {/* Continue Learning / Start First Path Panel */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(24, 33, 49, 0.95), rgba(15, 23, 42, 0.95))',
          border: '1px solid var(--c)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 36,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)'
        }}
      >
        {hasStarted ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: 'var(--ok)',
                    background: 'rgba(85, 185, 149, 0.15)',
                    padding: '2px 6px',
                    borderRadius: 3,
                    fontWeight: 600
                  }}
                >
                  RESUME LEARNING
                </span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                  {activePath.title}
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: 20, color: 'var(--t)' }}>
                Lesson {activeLesson.number}: {activeLesson.title}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--m)', lineHeight: 1.5 }}>
                {activeLesson.summary}
              </p>

              {/* Progress bar */}
              <div style={{ marginTop: 14, maxWidth: 440 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }} className="mono">
                  <span style={{ color: 'var(--m)' }}>Path Progress</span>
                  <span style={{ color: 'var(--c)' }}>{activePathProgress.percentage}% ({activePathProgress.completed}/{activePathProgress.total} lessons)</span>
                </div>
                <div style={{ height: 6, background: 'var(--b)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${activePathProgress.percentage}%`,
                      background: 'linear-gradient(90deg, var(--c), var(--ok))',
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                className="pri"
                onClick={() => nav(`/learn/path/${activePath.id}/lesson/${activeLesson.id}`)}
                style={{
                  fontSize: 14,
                  padding: '10px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 600
                }}
              >
                <span>Continue Lesson</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  color: 'var(--c)',
                  background: 'rgba(169, 154, 255, 0.15)',
                  padding: '2px 6px',
                  borderRadius: 3,
                  fontWeight: 600,
                  display: 'inline-block',
                  marginBottom: 8
                }}
              >
                WELCOME TO QUANTUM COMPUTING
              </span>
              <h3 style={{ margin: '0 0 8px', fontSize: 20, color: 'var(--t)' }}>
                Start Your First Learning Path
              </h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--m)', maxWidth: 600, lineHeight: 1.5 }}>
                Begin with <b>PATH 01: Foundations of Quantum Computing</b> to grasp statevectors, Dirac bra-ket notation,
                superposition, and measurement before diving into multi-qubit circuits.
              </p>
            </div>

            <button
              className="pri"
              onClick={() => nav('/learn/path/path-1/lesson/p1-l1')}
              style={{
                fontSize: 14,
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 600
              }}
            >
              <span>Begin Lesson 1</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>

      {/* Overall Progress Quick Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 36
        }}
      >
        <div className="card" style={{ padding: '14px 18px', background: 'var(--p)' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4 }}>OVERALL COMPLETION</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--c)' }}>{overall.overallPercentage}%</span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>({overall.completedLessons}/{overall.totalLessons} lessons)</span>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px', background: 'var(--p)' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4 }}>LEARNING PATHS STARTED</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--t)' }}>{overall.pathsStarted} / 5</span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>active</span>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px', background: 'var(--p)' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4 }}>EXERCISES COMPLETED</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--ok)' }}>{overall.completedExercises} / {overall.totalExercises}</span>
            <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>challenges</span>
          </div>
        </div>
      </div>

      {/* 3.1 Learning Paths Section */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 22, color: 'var(--t)' }}>
              Structured Learning Paths
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--m)' }}>
              Progressive roadmaps arranged by mathematical rigor and practical circuit complexity.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {LEARNING_PATHS.map((path, idx) => {
            const prog = getPathProgress(path.id);
            const unlocked = isPathUnlocked(idx);
            const isCompleted = prog.percentage === 100;
            const isStarted = prog.completed > 0;

            return (
              <div
                key={path.id}
                className="card"
                style={{
                  background: 'var(--p)',
                  border: isStarted ? '1px solid var(--c)' : '1px solid var(--b)',
                  borderRadius: 10,
                  padding: 22,
                  transition: 'all 0.2s ease',
                  opacity: unlocked ? 1 : 0.8
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: '1 1 500px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span
                        className="mono"
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--c)',
                          background: 'rgba(169, 154, 255, 0.1)',
                          padding: '3px 8px',
                          borderRadius: 4
                        }}
                      >
                        PATH {path.number}
                      </span>
                      <span
                        className="mono"
                        style={{
                          fontSize: 11,
                          color: path.level.includes('Advanced') ? '#f38ba8' : path.level.includes('Intermediate') ? '#f9e2af' : 'var(--ok)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '2px 8px',
                          borderRadius: 4
                        }}
                      >
                        {path.level}
                      </span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                        ⏱ {path.estimatedDuration}
                      </span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                        📚 {path.lessonCount} lessons
                      </span>
                      {!unlocked && (
                        <span className="mono" style={{ fontSize: 10, color: 'var(--w)', background: 'rgba(255, 180, 50, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                          🔒 Prerequisites Recommended
                        </span>
                      )}
                    </div>

                    <h3 style={{ margin: '0 0 6px', fontSize: 19, color: 'var(--t)' }}>
                      <Link
                        to={`/learn/path/${path.id}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {path.title}
                      </Link>
                    </h3>

                    <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--m)', lineHeight: 1.5 }}>
                      {path.description}
                    </p>

                    {/* Progress indicator */}
                    <div style={{ maxWidth: 380 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }} className="mono">
                        <span style={{ color: 'var(--m)' }}>
                          {prog.completed} of {prog.total} completed
                        </span>
                        <span style={{ color: isCompleted ? 'var(--ok)' : 'var(--c)' }}>
                          {prog.percentage}%
                        </span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${prog.percentage}%`,
                            background: isCompleted ? 'var(--ok)' : 'var(--c)',
                            transition: 'width 0.4s ease'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', justifyContent: 'center' }}>
                    <button
                      className={isStarted ? 'pri' : ''}
                      onClick={() => {
                        // Navigate to first incomplete lesson or lesson 1
                        const nextLesson = path.lessons.find(l => !completedLessons.includes(l.id)) || path.lessons[0];
                        nav(`/learn/path/${path.id}/lesson/${nextLesson.id}`);
                      }}
                      style={{
                        fontSize: 13,
                        padding: '8px 18px',
                        minWidth: 150
                      }}
                    >
                      {isCompleted ? 'Review Path' : isStarted ? 'Continue Learning' : 'Start Learning'}
                    </button>
                    <Link
                      to={`/learn/path/${path.id}`}
                      className="mono"
                      style={{ fontSize: 11, color: 'var(--c)', textDecoration: 'none', padding: '4px 6px' }}
                    >
                      View Syllabus ({path.lessons.length} lessons) →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3.3 Explore Topics Section */}
      <div>
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, color: 'var(--t)' }}>
            Explore Topics
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--m)' }}>
            Quickly jump directly to specialized quantum concept modules and mathematical disciplines.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 14
          }}
        >
          {TOPICS.map((topic, i) => (
            <div
              key={topic.id}
              onClick={() => nav(`/learn/path/${topic.pathId}/lesson/${topic.lessonId}`)}
              className="card"
              style={{
                background: 'var(--p)',
                border: '1px solid var(--b)',
                borderRadius: 8,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--c)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--b)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="mono" style={{ fontSize: 10, color: 'var(--c)' }}>
                  TOPIC {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--m)' }}>
                  {topic.count} lessons
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t)', marginBottom: 6 }}>
                {topic.title}
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--c)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>Explore Topic</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

