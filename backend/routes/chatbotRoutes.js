import express from 'express';
import {
  sendChatMessage,
  getChatHistory,
  getMyChatSessions
} from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/message', authMiddleware, sendChatMessage);
router.get('/history/:sessionId', authMiddleware, getChatHistory);
router.get('/sessions', authMiddleware, getMyChatSessions);

export default router;