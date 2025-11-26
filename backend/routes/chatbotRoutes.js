import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatbotController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/message', authMiddleware, sendMessage);
router.get('/history/:sessionId', authMiddleware, getChatHistory);

export default router;