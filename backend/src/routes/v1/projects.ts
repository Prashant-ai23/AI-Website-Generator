import express from 'express';
import projectController from '../../controllers/projectController.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// All project routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/', projectController.createProject.bind(projectController));

/**
 * @route   GET /api/v1/projects
 * @desc    Get user's projects
 * @access  Private
 */
router.get('/', projectController.getUserProjects.bind(projectController));

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id', projectController.getProject.bind(projectController));

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update project
 * @access  Private
 */
router.put('/:id', projectController.updateProject.bind(projectController));

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete project
 * @access  Private
 */
router.delete('/:id', projectController.deleteProject.bind(projectController));

/**
 * @route   POST /api/v1/projects/:id/publish
 * @desc    Publish project
 * @access  Private
 */
router.post('/:id/publish', projectController.publishProject.bind(projectController));

/**
 * @route   POST /api/v1/projects/:id/archive
 * @desc    Archive project
 * @access  Private
 */
router.post('/:id/archive', projectController.archiveProject.bind(projectController));

/**
 * @route   POST /api/v1/projects/:id/duplicate
 * @desc    Duplicate project
 * @access  Private
 */
router.post('/:id/duplicate', projectController.duplicateProject.bind(projectController));

/**
 * @route   POST /api/v1/projects/:id/restore
 * @desc    Restore archived project
 * @access  Private
 */
router.post('/:id/restore', projectController.restoreProject.bind(projectController));

/**
 * @route   POST /api/v1/projects/:id/favorite
 * @desc    Toggle favorite status
 * @access  Private
 */
router.post('/:id/favorite', projectController.toggleFavorite.bind(projectController));

/**
 * @route   GET /api/v1/projects/favorites/list
 * @desc    Get favorite projects
 * @access  Private
 */
router.get('/favorites/list', projectController.getFavorites.bind(projectController));

/**
 * @route   GET /api/v1/projects/recent/list
 * @desc    Get recent projects
 * @access  Private
 */
router.get('/recent/list', projectController.getRecent.bind(projectController));

/**
 * @route   GET /api/v1/projects/stats/dashboard
 * @desc    Get project statistics
 * @access  Private
 */
router.get('/stats/dashboard', projectController.getStats.bind(projectController));

/**
 * @route   GET /api/v1/projects/:id/history
 * @desc    Get project activity history
 * @access  Private
 */
router.get('/:id/history', projectController.getHistory.bind(projectController));

export default router;
