/**
 * Chat Routes
 * /api/v1/chat/*
 */

import { Router, Request, Response } from 'express';
import ChatController from '../../controllers/chatController.js';
import { authenticate } from '../../middleware/auth.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();

// All chat routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/chat/message
 * @desc    Send a chat message and get response
 * @access  Private
 */
router.post('/message', (req: AuthRequest, res: Response) => {
  ChatController.chat(req, res);
});

/**
 * @route   POST /api/v1/chat/stream
 * @desc    Stream chat response for real-time updates
 * @access  Private
 */
router.post('/stream', (req: AuthRequest, res: Response) => {
  ChatController.streamChat(req, res);
});

/**
 * @route   GET /api/v1/chat/history
 * @desc    Get chat history
 * @access  Private
 */
router.get('/history', (req: AuthRequest, res: Response) => {
  ChatController.getHistory(req, res);
});

export default router;
