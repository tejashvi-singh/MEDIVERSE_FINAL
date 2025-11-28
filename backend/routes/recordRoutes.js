import express from 'express';
import {
  createMedicalRecord,
  getMyMedicalRecords,
  getRecordById
} from '../controllers/recordController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createMedicalRecord);
router.get('/my-records', authMiddleware, getMyMedicalRecords);
router.get('/:id', authMiddleware, getRecordById);

export default router;