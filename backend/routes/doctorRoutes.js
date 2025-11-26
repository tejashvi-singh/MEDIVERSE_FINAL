import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get available doctors
router.get('/available', async (req, res) => {
  try {
    // Implement available doctors fetch
    res.json({ doctors: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get doctor profile
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    res.json({ message: 'Doctor profile' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;