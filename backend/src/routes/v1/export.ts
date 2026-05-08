import { Router } from 'express';
import exportController from '../../controllers/exportController.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Get export information
router.get('/info', exportController.getExportInfo);

// Export project as ZIP (requires authentication)
router.get('/project', authenticate, exportController.exportProject);

export default router;
