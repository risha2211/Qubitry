import mongoose from 'mongoose';
import { getDBStatus } from '../config/db.js';
import { localDB } from '../config/localStore.js';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: true,
      unique: true
    },
    completedLessons: {
      type: [String],
      default: []
    },
    currentPathId: {
      type: String,
      default: 'path-1'
    },
    currentLessonId: {
      type: String,
      default: 'p1-l1'
    },
    bookmarkedLessons: {
      type: [String],
      default: []
    },
    exerciseResults: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    unlockedAchievements: {
      type: [String],
      default: []
    },
    recentActivity: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const ProgressModel = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

export const ProgressStore = {
  async getByUserId(userId) {
    const status = getDBStatus();
    if (status.connected) {
      try {
        let record = await ProgressModel.findOne({ userId });
        if (!record) {
          record = new ProgressModel({ userId });
          await record.save();
        }
        return record;
      } catch (e) {
        console.warn('[ProgressStore] Fallback to local store:', e.message);
      }
    }

    const current = localDB.getProgress(String(userId));
    if (current) return current;

    const initial = {
      userId: String(userId),
      completedLessons: [],
      currentPathId: 'path-1',
      currentLessonId: 'p1-l1',
      bookmarkedLessons: [],
      exerciseResults: {},
      unlockedAchievements: [],
      recentActivity: []
    };
    return localDB.saveProgress(String(userId), initial);
  },

  async update(userId, updates) {
    const status = getDBStatus();
    if (status.connected) {
      try {
        let record = await ProgressModel.findOne({ userId });
        if (!record) {
          record = new ProgressModel({ userId, ...updates });
        } else {
          Object.assign(record, updates);
        }
        await record.save();
        return record;
      } catch (e) {
        console.warn('[ProgressStore] Fallback to local store:', e.message);
      }
    }

    return localDB.saveProgress(String(userId), updates);
  }
};
