import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import analyzerController from '../../controllers/analyzerController.js';

const router = Router();

/**
 * POST /api/v1/analyzer/analyze
 * Analyze app idea and detect modules
 */
router.post('/analyze', authenticate, (req, res, next) => {
  analyzerController.analyzePrompt(req as any, res, next);
});

/**
 * POST /api/v1/analyzer/quick-analyze
 * Quick analysis without full details
 */
router.post('/quick-analyze', authenticate, (req, res, next) => {
  analyzerController.quickAnalyze(req as any, res, next);
});

/**
 * GET /api/v1/analyzer/suggestions?keyword=ecommerce
 * Get module suggestions for a keyword
 */
router.get('/suggestions', authenticate, (req, res, next) => {
  analyzerController.getSuggestions(req as any, res, next);
});

export default router;
