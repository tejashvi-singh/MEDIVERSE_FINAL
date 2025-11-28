import express from 'express';
import {
  getPatientProfile,
  updatePatientProfile
} from '../controllers/patientController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getPatientProfile);
router.put('/profile', authMiddleware, updatePatientProfile);
