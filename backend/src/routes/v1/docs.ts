import { Router, Request, Response } from 'express';
import DocumentationGeneratorController from '../../controllers/documentationGeneratorController.js';
import { authenticate } from '../../middleware/auth.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();

// All documentation routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/docs/readme
 * @desc    Generate README.md
 * @access  Private
 */
router.post('/readme', (req: AuthRequest, res: Response) => {
  DocumentationGeneratorController.generateREADME(req, res);
});

/**
 * @route   POST /api/v1/docs/api
 * @desc    Generate API documentation
 * @access  Private
 */
router.post('/api', (req: AuthRequest, res: Response) => {
  DocumentationGeneratorController.generateAPIDocumentation(req, res);
});

/**
 * @route   POST /api/v1/docs/install
 * @desc    Generate installation guide
 * @access  Private
 */
router.post('/install', (req: AuthRequest, res: Response) => {
  DocumentationGeneratorController.generateInstallationGuide(req, res);
});

/**
 * @route   POST /api/v1/docs/architecture
 * @desc    Generate architecture documentation
 * @access  Private
 */
router.post('/architecture', (req: AuthRequest, res: Response) => {
  DocumentationGeneratorController.generateArchitectureDocumentation(req, res);
});

/**
 * @route   POST /api/v1/docs/modules
 * @desc    Generate module-wise documentation
 * @access  Private
 */
router.post('/modules', (req: AuthRequest, res: Response) => {
  DocumentationGeneratorController.generateModuleDocumentation(req, res);
});

/**
 * @route   POST /api/v1/docs/complete
 * @desc    Generate complete documentation package
 * @access  Private
 */
router.post('/complete', (req: AuthRequest, res: Response) => {
  DocumentationGeneratorController.generateCompleteDocumentation(req, res);
});

/**
 * @route   POST /api/v1/docs/custom
 * @desc    Generate custom documentation based on docType
 * @access  Private
 */
router.post('/custom', (req: AuthRequest, res: Response) => {
  DocumentationGeneratorController.generateCustomDocumentation(req, res);
});

export default router;
