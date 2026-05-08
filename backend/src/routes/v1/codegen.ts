import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import codeGeneratorController from '../../controllers/codeGeneratorController.js';

const router = Router();

/**
 * POST /api/v1/codegen/page
 * Generate a React page component
 */
router.post('/page', authenticate, (req, res, next) => {
  codeGeneratorController.generatePage(req as any, res, next);
});

/**
 * POST /api/v1/codegen/form
 * Generate a React form component
 */
router.post('/form', authenticate, (req, res, next) => {
  codeGeneratorController.generateForm(req as any, res, next);
});

/**
 * POST /api/v1/codegen/table
 * Generate a React table component
 */
router.post('/table', authenticate, (req, res, next) => {
  codeGeneratorController.generateTable(req as any, res, next);
});

/**
 * POST /api/v1/codegen/layout
 * Generate a layout component
 */
router.post('/layout', authenticate, (req, res, next) => {
  codeGeneratorController.generateLayout(req as any, res, next);
});

/**
 * POST /api/v1/codegen/routing
 * Generate React Router configuration
 */
router.post('/routing', authenticate, (req, res, next) => {
  codeGeneratorController.generateRouting(req as any, res, next);
});

export default router;
