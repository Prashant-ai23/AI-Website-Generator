import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import apiGeneratorController from '../../controllers/apiGeneratorController.js';

const router = Router();

/**
 * POST /api/v1/apigen/model
 * Generate MongoDB model
 */
router.post('/model', authenticate, (req, res, next) => {
  apiGeneratorController.generateModel(req as any, res, next);
});

/**
 * POST /api/v1/apigen/service
 * Generate service with CRUD operations
 */
router.post('/service', authenticate, (req, res, next) => {
  apiGeneratorController.generateService(req as any, res, next);
});

/**
 * POST /api/v1/apigen/controller
 * Generate Express controller
 */
router.post('/controller', authenticate, (req, res, next) => {
  apiGeneratorController.generateController(req as any, res, next);
});

/**
 * POST /api/v1/apigen/routes
 * Generate Express routes
 */
router.post('/routes', authenticate, (req, res, next) => {
  apiGeneratorController.generateRoutes(req as any, res, next);
});

/**
 * POST /api/v1/apigen/validation
 * Generate validation schema
 */
router.post('/validation', authenticate, (req, res, next) => {
  apiGeneratorController.generateValidation(req as any, res, next);
});

/**
 * POST /api/v1/apigen/complete
 * Generate complete API (all files)
 */
router.post('/complete', authenticate, (req, res, next) => {
  apiGeneratorController.generateCompleteAPI(req as any, res, next);
});

export default router;
