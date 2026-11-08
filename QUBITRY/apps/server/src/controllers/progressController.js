import { ProgressStore } from '../models/Progress.js';

export async function getProgress(req, res) {
  try {
    const userId = req.user._id || req.user.id;
    const progress = await ProgressStore.getByUserId(userId);
    return res.status(200).json({ success: true, progress });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch progress.' });
  }
}

export async function syncProgress(req, res) {
  try {
    const userId = req.user._id || req.user.id;
    const updates = req.body;
    const progress = await ProgressStore.update(userId, updates);
    return res.status(200).json({ success: true, progress });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to sync progress.' });
  }
}

