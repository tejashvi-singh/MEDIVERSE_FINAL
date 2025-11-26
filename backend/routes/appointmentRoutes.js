import express from 'express';
import { 
  createAppointment, 
  getAppointments, 
  updateAppointmentStatus,
  cancelAppointment 
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createAppointment);
router.get('/:patientId', getAppointments);
router.put('/:id/status', authMiddleware, updateAppointmentStatus);
router.put('/:id/cancel', authMiddleware, cancelAppointment);

export default router;