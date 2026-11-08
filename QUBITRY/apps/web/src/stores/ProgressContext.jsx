import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LEARNING_PATHS } from '../data/learningCurriculum.js';
import { EXERCISES } from '../data/exercisesData.js';

const ProgressContext = createContext(null);

export const ACHIEVEMENTS = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first quantum lesson.',
    icon: '🌱'
  },
  {
    id: 'superposition-explorer',
    title: 'Superposition Explorer',
    description: 'Master the principles of quantum superposition and state vectors.',
    icon: '🔮'
  },
  {
    id: 'circuit-builder',
    title: 'Circuit Builder',
    description: 'Successfully construct your first quantum circuit challenge.',
    icon: '⚡'
  },
  {
    id: 'entangled',
    title: 'Entangled',
    description: 'Construct a maximally entangled Bell state in Circuit Studio.',
    icon: '🔗'
  },
  {
    id: 'algorithm-explorer',
    title: 'Algorithm Explorer',
    description: 'Complete your first quantum algorithm challenge.',
    icon: '🚀'
  },
  {
    id: 'learning-milestone',
    title: 'Learning Milestone',
    description: 'Complete an entire learning path curriculum.',
    icon: '🏆'
  }
];

const STORAGE_KEY = 'qubitry_progress_v1';

export function ProgressProvider({ children }) {
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_lessons`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentPosition, setCurrentPositionState] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_pos`);
      return saved ? JSON.parse(saved) : { pathId: 'path-1', lessonId: 'p1-l1' };
    } catch {
      return { pathId: 'path-1', lessonId: 'p1-l1' };
    }
  });

  const [bookmarkedLessons, setBookmarkedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_bookmarks`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [exerciseResults, setExerciseResults] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_exercises`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_achievements`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentActivity, setRecentActivity] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activity`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_lessons`, JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_pos`, JSON.stringify(currentPosition));
  }, [currentPosition]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bookmarks`, JSON.stringify(bookmarkedLessons));
  }, [bookmarkedLessons]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_exercises`, JSON.stringify(exerciseResults));
  }, [exerciseResults]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_achievements`, JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_activity`, JSON.stringify(recentActivity));
  }, [recentActivity]);

  const addActivity = useCallback((type, title, detail) => {
    setRecentActivity(prev => [
      {
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type,
        title,
        detail,
        timestamp: new Date().toISOString()
      },
      ...prev.slice(0, 49) // Keep last 50 activities
    ]);
  }, []);

  const unlockAchievement = useCallback((achievementId) => {
    setUnlockedAchievements(prev => {
      if (prev.includes(achievementId)) return prev;
      const meta = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (meta) {
        addActivity('achievement', `Unlocked Achievement: ${meta.title}`, meta.description);
      }
      return [...prev, achievementId];
    });
  }, [addActivity]);

  const setCurrentPosition = useCallback((pathId, lessonId) => {
    setCurrentPositionState({ pathId, lessonId });
  }, []);

  const completeLesson = useCallback((pathId, lessonId) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev;
      const updated = [...prev, lessonId];

      // Find lesson title for activity feed
      const path = LEARNING_PATHS.find(p => p.id === pathId);
      const lesson = path?.lessons.find(l => l.id === lessonId);
      addActivity('lesson', `Completed Lesson: ${lesson?.title || lessonId}`, path?.title || 'Learning Path');

      // Check for first steps achievement
      if (updated.length === 1) {
        unlockAchievement('first-steps');
      }

      // Check for superposition explorer achievement
      if (lessonId === 'p1-l4') {
        unlockAchievement('superposition-explorer');
      }

      // Check if full path is complete
      if (path && path.lessons.every(l => updated.includes(l.id))) {
        unlockAchievement('learning-milestone');
      }

      return updated;
    });
  }, [addActivity, unlockAchievement]);

  const isLessonCompleted = useCallback((lessonId) => {
    return completedLessons.includes(lessonId);
  }, [completedLessons]);

  const toggleBookmark = useCallback((lessonId) => {
    setBookmarkedLessons(prev => {
      if (prev.includes(lessonId)) {
        return prev.filter(id => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  }, []);

  const isBookmarked = useCallback((lessonId) => {
    return bookmarkedLessons.includes(lessonId);
  }, [bookmarkedLessons]);

  const saveExerciseResult = useCallback((exerciseId, score, maxScore, passed) => {
    setExerciseResults(prev => {
      const existing = prev[exerciseId] || { attempts: 0, bestScore: 0 };
      const attempts = existing.attempts + 1;
      const bestScore = Math.max(existing.bestScore, score);
      const completed = existing.completed || passed;

      const exercise = EXERCISES.find(e => e.id === exerciseId);
      addActivity(
        'exercise',
        `Completed Exercise: ${exercise?.title || exerciseId}`,
        `Scored ${score}/${maxScore} points`
      );

      // Check achievements
      if (exercise?.category === 'circuit' && passed) {
        unlockAchievement('circuit-builder');
        if (exerciseId.includes('bell')) {
          unlockAchievement('entangled');
        }
      }

      if (exercise?.category === 'algorithm' && passed) {
        unlockAchievement('algorithm-explorer');
      }

      return {
        ...prev,
        [exerciseId]: {
          attempts,
          bestScore,
          latestScore: score,
          maxScore,
          completed,
          lastAttemptAt: new Date().toISOString()
        }
      };
    });
  }, [addActivity, unlockAchievement]);

  const getPathProgress = useCallback((pathId) => {
    const path = LEARNING_PATHS.find(p => p.id === pathId);
    if (!path) return { total: 0, completed: 0, percentage: 0 };
    const total = path.lessons.length;
    const completed = path.lessons.filter(l => completedLessons.includes(l.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [completedLessons]);

  const getOverallProgress = useCallback(() => {
    const totalLessons = LEARNING_PATHS.reduce((sum, p) => sum + p.lessons.length, 0);
    const completedLessonsCount = completedLessons.length;
    const totalExercises = EXERCISES.length;
    const completedExercisesCount = Object.values(exerciseResults).filter(r => r.completed).length;

    const pathsStarted = LEARNING_PATHS.filter(p =>
      p.lessons.some(l => completedLessons.includes(l.id))
    ).length;

    const overallPercentage = totalLessons > 0
      ? Math.round((completedLessonsCount / totalLessons) * 100)
      : 0;

    return {
      totalLessons,
      completedLessons: completedLessonsCount,
      lessonsRemaining: Math.max(0, totalLessons - completedLessonsCount),
      totalExercises,
      completedExercises: completedExercisesCount,
      pathsStarted,
      overallPercentage
    };
  }, [completedLessons, exerciseResults]);

  return (
    <ProgressContext.Provider
      value={{
        completedLessons,
        currentPosition,
        bookmarkedLessons,
        exerciseResults,
        unlockedAchievements,
        recentActivity,
        completeLesson,
        isLessonCompleted,
        toggleBookmark,
        isBookmarked,
        setCurrentPosition,
        saveExerciseResult,
        getPathProgress,
        getOverallProgress,
        unlockAchievement
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}

