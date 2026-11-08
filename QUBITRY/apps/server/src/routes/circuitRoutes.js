import { Router } from 'express';
import {
  createCircuit,
  getCircuits,
  getCircuitById,
  updateCircuit,
  deleteCircuit,
  forkCircuit,
  exportCircuit,
  importCircuit
} from '../controllers/circuitController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getCircuits);
router.post('/', requireAuth, createCircuit);
router.post('/import', requireAuth, importCircuit);

router.get('/:id', optionalAuth, getCircuitById);
router.put('/:id', requireAuth, updateCircuit);
router.delete('/:id', requireAuth, deleteCircuit);
router.post('/:id/fork', requireAuth, forkCircuit);
router.get('/:id/export', optionalAuth, exportCircuit);

export default router;

