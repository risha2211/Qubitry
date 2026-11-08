import { Router } from 'express';
import { getProgress, syncProgress } from '../controllers/progressController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getProgress);
router.post('/sync', requireAuth, syncProgress);

export default router;

