import express from 'express';
import aiGenerationController from '../../controllers/aiGenerationController.js';
import { aiController } from '../../controllers/aiController.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// All AI routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/ai/generate
 * @desc    Generate website from prompt
 * @access  Private
 */
router.post('/generate', aiGenerationController.generateWebsite.bind(aiGenerationController));

/**
 * @route   POST /api/v1/ai/analyze/:projectId
 * @desc    Analyze website content
 * @access  Private
 */
router.post('/analyze/:projectId', aiGenerationController.analyzeContent.bind(aiGenerationController));

/**
 * @route   POST /api/v1/ai/optimize/:projectId
 * @desc    Optimize website performance
 * @access  Private
 */
router.post('/optimize/:projectId', aiGenerationController.optimizePerformance.bind(aiGenerationController));

/**
 * @route   POST /api/v1/ai/color-palette
 * @desc    Generate color palette
 * @access  Private
 */
router.post('/color-palette', aiGenerationController.generateColorPalette.bind(aiGenerationController));

/**
 * @route   POST /api/v1/ai/typography
 * @desc    Generate typography scales
 * @access  Private
 */
router.post('/typography', aiGenerationController.generateTypography.bind(aiGenerationController));

/**
 * @route   POST /api/v1/ai/layout-suggestions
 * @desc    Generate layout suggestions
 * @access  Private
 */
router.post('/layout-suggestions', aiGenerationController.generateLayoutSuggestions.bind(aiGenerationController));

// Advanced AI Features Routes

/**
 * @route   POST /api/v1/ai/execute
 * @desc    Execute a single agent
 * @access  Private
 */
router.post('/execute', (req, res, next) =>
  aiController.executeAgent(req, res, next)
);

/**
 * @route   POST /api/v1/ai/workflow
 * @desc    Execute a workflow with multiple agents
 * @access  Private
 */
router.post('/workflow', (req, res, next) =>
  aiController.executeWorkflow(req, res, next)
);

/**
 * @route   POST /api/v1/ai/bug-fix
 * @desc    Auto-fix bugs in code
 * @access  Private
 */
router.post('/bug-fix', (req, res, next) =>
  aiController.autoBugFix(req, res, next)
);

/**
 * @route   POST /api/v1/ai/code-optimize
 * @desc    Optimize code
 * @access  Private
 */
router.post('/code-optimize', (req, res, next) =>
  aiController.optimizeCode(req, res, next)
);

/**
 * @route   POST /api/v1/ai/query
 * @desc    Query context memory with RAG
 * @access  Private
 */
router.post('/query', (req, res, next) =>
  aiController.queryMemory(req, res, next)
);

/**
 * @route   GET /api/v1/ai/templates
 * @desc    Get templates with optional filtering
 * @access  Private
 */
router.get('/templates', (req, res, next) =>
  aiController.getTemplates(req, res, next)
);

/**
 * @route   POST /api/v1/ai/templates/apply
 * @desc    Apply a template with variables
 * @access  Private
 */
router.post('/templates/apply', (req, res, next) =>
  aiController.applyTemplate(req, res, next)
);

/**
 * @route   GET /api/v1/ai/workflows
 * @desc    Get available workflows (preset and custom)
 * @access  Private
 */
router.get('/workflows', (req, res, next) =>
  aiController.getWorkflows(req, res, next)
);

/**
 * @route   GET /api/v1/ai/capabilities
 * @desc    Get available agent capabilities
 * @access  Private
 */
router.get('/capabilities', (req, res, next) =>
  aiController.getAgentCapabilities(req, res, next)
);

/**
 * @route   GET /api/v1/ai/statistics
 * @desc    Get AI system statistics
 * @access  Private
 */
router.get('/statistics', (req, res, next) =>
  aiController.getStatistics(req, res, next)
);

export default router;
