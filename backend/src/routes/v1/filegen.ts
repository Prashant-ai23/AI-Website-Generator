import { Router, Request, Response } from 'express';
import FileGenerationController from '../../controllers/fileGenerationController.js';
import { authenticate } from '../../middleware/auth.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();

// All file generation routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/filegen/generate-files
 * @desc    Generate multiple files
 * @access  Private
 */
router.post('/generate-files', (req: AuthRequest, res: Response) => {
  FileGenerationController.generateFiles(req, res);
});

/**
 * @route   POST /api/v1/filegen/generate-project
 * @desc    Generate complete project structure
 * @access  Private
 */
router.post('/generate-project', (req: AuthRequest, res: Response) => {
  FileGenerationController.generateProject(req, res);
});

/**
 * @route   POST /api/v1/filegen/create-folders
 * @desc    Create folder structure
 * @access  Private
 */
router.post('/create-folders', (req: AuthRequest, res: Response) => {
  FileGenerationController.createFolders(req, res);
});

/**
 * @route   POST /api/v1/filegen/create-file
 * @desc    Create single file
 * @access  Private
 */
router.post('/create-file', (req: AuthRequest, res: Response) => {
  FileGenerationController.createFile(req, res);
});

/**
 * @route   POST /api/v1/filegen/update-file
 * @desc    Update existing file
 * @access  Private
 */
router.post('/update-file', (req: AuthRequest, res: Response) => {
  FileGenerationController.updateFile(req, res);
});

/**
 * @route   POST /api/v1/filegen/upsert-file
 * @desc    Create or update file (upsert)
 * @access  Private
 */
router.post('/upsert-file', (req: AuthRequest, res: Response) => {
  FileGenerationController.upsertFile(req, res);
});

/**
 * @route   POST /api/v1/filegen/create-package-json
 * @desc    Create package.json file
 * @access  Private
 */
router.post('/create-package-json', (req: AuthRequest, res: Response) => {
  FileGenerationController.createPackageJson(req, res);
});

/**
 * @route   POST /api/v1/filegen/create-tsconfig
 * @desc    Create tsconfig.json file
 * @access  Private
 */
router.post('/create-tsconfig', (req: AuthRequest, res: Response) => {
  FileGenerationController.createTsConfig(req, res);
});

/**
 * @route   POST /api/v1/filegen/project-summary
 * @desc    Get project summary
 * @access  Private
 */
router.post('/project-summary', (req: AuthRequest, res: Response) => {
  FileGenerationController.getProjectSummary(req, res);
});

/**
 * @route   POST /api/v1/filegen/delete-file
 * @desc    Delete file
 * @access  Private
 */
router.post('/delete-file', (req: AuthRequest, res: Response) => {
  FileGenerationController.deleteFile(req, res);
});

/**
 * @route   POST /api/v1/filegen/delete-folder
 * @desc    Delete folder
 * @access  Private
 */
router.post('/delete-folder', (req: AuthRequest, res: Response) => {
  FileGenerationController.deleteFolder(req, res);
});

export default router;
