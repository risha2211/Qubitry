import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProgress } from '../../../stores/ProgressContext.jsx';
import { LEARNING_PATHS } from '../../../data/learningCurriculum.js';

export default function LearningPathPage() {
  const { pathId } = useParams();
  const nav = useNavigate();
  const { completedLessons, isLessonCompleted, currentPosition, getPathProgress } = useProgress();

  const path = LEARNING_PATHS.find(p => p.id === pathId) || LEARNING_PATHS[0];
  const progress = getPathProgress(path.id);

  // Helper to determine lesson status: 'completed' | 'in-progress' | 'available' | 'locked'
  const getLessonStatus = (lesson, idx) => {
    if (isLessonCompleted(lesson.id)) return 'completed';
    if (currentPosition.lessonId === lesson.id) return 'in-progress';
    // Available if it's the first lesson or the previous lesson is completed
    if (idx === 0 || isLessonCompleted(path.lessons[idx - 1].id)) return 'available';
    // By default, allow independent exploration, but mark subsequent unvisited lessons as available
    return 'available';
  };

  return (
    <div className="w" style={{ paddingBottom: 60 }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }} className="mono">
        <Link to="/learn" style={{ color: 'var(--m)', textDecoration: 'none', fontSize: 12 }}>
          ← Back to All Paths
        </Link>
        <span style={{ color: 'var(--b)' }}>/</span>
        <span style={{ color: 'var(--c)', fontSize: 12 }}>PATH {path.number}</span>
      </div>

      {/* Path Header */}
      <div
        className="card"
        style={{
          background: 'var(--p)',
          border: '1px solid var(--b)',
          borderRadius: 12,
          padding: 28,
          marginBottom: 32
        }}
      >
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
          <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>
            ⏱ {path.estimatedDuration}
          </span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>
            📚 {path.lessonCount} Lessons
          </span>
        </div>

        <h1 style={{ fontSize: 28, margin: '0 0 10px', color: 'var(--t)', fontWeight: 700 }}>
          {path.title}
        </h1>
        <p style={{ margin: '0 0 20px', fontSize: 15, color: 'var(--m)', maxWidth: 840, lineHeight: 1.6 }}>
          {path.description}
        </p>

        {/* Visual Progress Bar */}
        <div style={{ maxWidth: 500 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }} className="mono">
            <span style={{ color: 'var(--m)' }}>Path Progress</span>
            <span style={{ color: progress.percentage === 100 ? 'var(--ok)' : 'var(--c)', fontWeight: 600 }}>
              {progress.percentage}% ({progress.completed} of {progress.total} completed)
            </span>
          </div>
          <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress.percentage}%`,
                background: progress.percentage === 100 ? 'var(--ok)' : 'linear-gradient(90deg, var(--c), var(--ok))',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Vertical Structured Roadmap / Lessons List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: 'var(--t)' }}>
            Course Syllabus &amp; Roadmap
          </h2>
          <span className="mono" style={{ fontSize: 12, color: 'var(--m)' }}>
            Sequential or independent progression
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {path.lessons.map((lesson, idx) => {
            const status = getLessonStatus(lesson, idx);
            const isCompleted = status === 'completed';
            const isCurrent = status === 'in-progress';

            return (
              <div
                key={lesson.id}
                className="card"
                style={{
                  background: 'var(--p)',
                  border: isCurrent ? '1px solid var(--c)' : isCompleted ? '1px solid rgba(85, 185, 149, 0.3)' : '1px solid var(--b)',
                  borderRadius: 10,
                  padding: '18px 22px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: '1 1 500px' }}>
                  {/* Status Indicator Circle */}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isCompleted
                        ? 'rgba(85, 185, 149, 0.2)'
                        : isCurrent
                        ? 'rgba(169, 154, 255, 0.2)'
                        : 'var(--bg)',
                      border: isCompleted
                        ? '1px solid var(--ok)'
                        : isCurrent
                        ? '1px solid var(--c)'
                        : '1px solid var(--b)',
                      color: isCompleted ? 'var(--ok)' : isCurrent ? 'var(--c)' : 'var(--m)',
                      fontWeight: 700,
                      fontSize: isCompleted ? 14 : 12,
                      flexShrink: 0,
                      marginTop: 2
                    }}
                    className="mono"
                  >
                    {isCompleted ? '✓' : String(lesson.number).padStart(2, '0')}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                        LESSON {String(lesson.number).padStart(2, '0')}
                      </span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                        ⏱ {lesson.duration}
                      </span>
                      {isCompleted && (
                        <span
                          className="mono"
                          style={{
                            fontSize: 10,
                            color: 'var(--ok)',
                            background: 'rgba(85, 185, 149, 0.15)',
                            padding: '1px 6px',
                            borderRadius: 3
                          }}
                        >
                          Completed
                        </span>
                      )}
                      {isCurrent && (
                        <span
                          className="mono"
                          style={{
                            fontSize: 10,
                            color: 'var(--c)',
                            background: 'rgba(169, 154, 255, 0.15)',
                            padding: '1px 6px',
                            borderRadius: 3
                          }}
                        >
                          In Progress
                        </span>
                      )}
                    </div>

                    <h3 style={{ margin: '0 0 6px', fontSize: 16, color: 'var(--t)' }}>
                      <Link
                        to={`/learn/path/${path.id}/lesson/${lesson.id}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        {lesson.title}
                      </Link>
                    </h3>

                    <p style={{ margin: 0, fontSize: 13, color: 'var(--m)', lineHeight: 1.5 }}>
                      {lesson.summary}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div>
                  <button
                    className={isCurrent || !isCompleted ? 'pri' : ''}
                    onClick={() => nav(`/learn/path/${path.id}/lesson/${lesson.id}`)}
                    style={{
                      fontSize: 13,
                      padding: '7px 16px',
                      minWidth: 120
                    }}
                  >
                    {isCompleted ? 'Review' : isCurrent ? 'Continue' : 'Start Lesson'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

