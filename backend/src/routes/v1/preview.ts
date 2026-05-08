/**
 * Preview Routes
 * /api/v1/preview/*
 */

import { Router, Request, Response } from 'express';
import PreviewController from '../../controllers/previewController.js';
import { authenticate } from '../../middleware/auth.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();

// All preview routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/preview/generate
 * @desc    Generate live preview from files
 * @access  Private
 */
router.post('/generate', (req: AuthRequest, res: Response) => {
  PreviewController.generatePreview(req, res);
});

/**
 * @route   POST /api/v1/preview/stream
 * @desc    Stream live preview updates
 * @access  Private
 */
router.post('/stream', (req: AuthRequest, res: Response) => {
  PreviewController.streamPreview(req, res);
});

/**
 * @route   POST /api/v1/preview/component
 * @desc    Preview a single component
 * @access  Private
 */
router.post('/component', (req: AuthRequest, res: Response) => {
  PreviewController.previewComponent(req, res);
});

/**
 * @route   POST /api/v1/preview/validate
 * @desc    Validate files for preview
 * @access  Private
 */
router.post('/validate', (req: AuthRequest, res: Response) => {
  PreviewController.validatePreview(req, res);
});

export default router;
