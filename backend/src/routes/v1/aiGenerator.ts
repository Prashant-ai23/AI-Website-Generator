import { Router } from 'express';
import aiGeneratorController from '../../controllers/aiGeneratorController.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

// Public endpoints
router.post('/analyze', authenticate, aiGeneratorController.analyzePrompt);

// Project management
router.post('/generate', authenticate, aiGeneratorController.generateProject);
router.get('/projects', authenticate, aiGeneratorController.getUserProjects);
router.get('/projects/:projectId', authenticate, aiGeneratorController.getProjectStatus);
router.get('/projects/:projectId/files', authenticate, aiGeneratorController.getProjectFiles);
router.get('/projects/:projectId/download', authenticate, aiGeneratorController.downloadProject);
router.delete('/projects/:projectId', authenticate, aiGeneratorController.deleteProject);
router.post('/projects/:projectId/clone', authenticate, aiGeneratorController.cloneProject);

// File management
router.get('/files/:fileId', authenticate, aiGeneratorController.getFileContent);
router.put('/files/:fileId', authenticate, aiGeneratorController.updateFile);

// Prompt history
router.get('/prompts', authenticate, aiGeneratorController.getPromptHistory);
router.post('/prompts/favorite', authenticate, aiGeneratorController.savePromptAsFavorite);

export default router;
