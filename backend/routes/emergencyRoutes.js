import express from 'express';
import { 
  requestEmergency, 
  updateEmergencyStatus,
  getEmergencyHistory 
} from '../controllers/emergencyController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', authMiddleware, requestEmergency);
router.put('/:id/status', authMiddleware, updateEmergencyStatus);
router.get('/history/:patientId', authMiddleware, getEmergencyHistory);

export default router;