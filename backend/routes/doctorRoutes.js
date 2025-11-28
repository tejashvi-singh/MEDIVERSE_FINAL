import express from 'express';
import {
  getAllDoctors,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorPatients
} from '../controllers/doctorController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/profile', authMiddleware, getDoctorProfile);
router.put('/profile', authMiddleware, updateDoctorProfile);
router.get('/patients', authMiddleware, getDoctorPatients);
router.get('/:id', getDoctorProfile);

export default router;