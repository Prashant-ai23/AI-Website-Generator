import express from 'express';
import templateController from '../../controllers/templateController.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

/**
 * Public routes (no auth required)
 */

/**
 * @route   GET /api/v1/templates
 * @desc    Get all templates with filters
 * @access  Public
 */
router.get('/', templateController.getTemplates.bind(templateController));

/**
 * @route   GET /api/v1/templates/featured
 * @desc    Get featured templates
 * @access  Public
 */
router.get('/featured', templateController.getFeaturedTemplates.bind(templateController));

/**
 * @route   GET /api/v1/templates/trending
 * @desc    Get trending templates
 * @access  Public
 */
router.get('/trending', templateController.getTrendingTemplates.bind(templateController));

/**
 * @route   GET /api/v1/templates/recommended
 * @desc    Get recommended templates
 * @access  Public
 */
router.get('/recommended', templateController.getRecommendedTemplates.bind(templateController));

/**
 * @route   GET /api/v1/templates/recent
 * @desc    Get recent templates
 * @access  Public
 */
router.get('/recent', templateController.getRecentTemplates.bind(templateController));

/**
 * @route   GET /api/v1/templates/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/categories', templateController.getCategories.bind(templateController));

/**
 * @route   GET /api/v1/templates/creator/:creatorId
 * @desc    Get templates by creator
 * @access  Public
 */
router.get('/creator/:creatorId', templateController.getTemplatesByCreator.bind(templateController));

/**
 * @route   GET /api/v1/templates/:id
 * @desc    Get template details
 * @access  Public
 */
router.get('/:id', templateController.getTemplate.bind(templateController));

/**
 * @route   GET /api/v1/templates/:id/versions
 * @desc    Get template versions
 * @access  Public
 */
router.get('/:id/versions', templateController.getTemplateVersions.bind(templateController));

/**
 * @route   POST /api/v1/templates/:id/check-compatibility
 * @desc    Check template compatibility
 * @access  Public
 */
router.post('/:id/check-compatibility', templateController.checkCompatibility.bind(templateController));

/**
 * @route   POST /api/v1/templates/:id/download
 * @desc    Download template (increment count)
 * @access  Public
 */
router.post('/:id/download', templateController.downloadTemplate.bind(templateController));

/**
 * Protected routes (auth required)
 */
router.use(authenticate);

/**
 * @route   POST /api/v1/templates
 * @desc    Create new template
 * @access  Private
 */
router.post('/', templateController.createTemplate.bind(templateController));

/**
 * @route   PUT /api/v1/templates/:id
 * @desc    Update template
 * @access  Private
 */
router.put('/:id', templateController.updateTemplate.bind(templateController));

/**
 * @route   DELETE /api/v1/templates/:id
 * @desc    Delete template
 * @access  Private
 */
router.delete('/:id', templateController.deleteTemplate.bind(templateController));

/**
 * @route   POST /api/v1/templates/:id/publish
 * @desc    Publish template
 * @access  Private
 */
router.post('/:id/publish', templateController.publishTemplate.bind(templateController));

/**
 * @route   POST /api/v1/templates/:id/clone
 * @desc    Clone template
 * @access  Private
 */
router.post('/:id/clone', templateController.cloneTemplate.bind(templateController));

/**
 * @route   POST /api/v1/templates/:id/rate
 * @desc    Rate template
 * @access  Private
 */
router.post('/:id/rate', templateController.rateTemplate.bind(templateController));

/**
 * @route   POST /api/v1/templates/:id/favorite
 * @desc    Toggle favorite status
 * @access  Private
 */
router.post('/:id/favorite', templateController.toggleFavorite.bind(templateController));

/**
 * @route   GET /api/v1/templates/favorites
 * @desc    Get user's favorite templates
 * @access  Private
 */
router.get('/favorites', templateController.getFavoriteTemplates.bind(templateController));

/**
 * @route   POST /api/v1/templates/:id/versions
 * @desc    Create template version
 * @access  Private
 */
router.post('/:id/versions', templateController.createTemplateVersion.bind(templateController));

/**
 * @route   POST /api/v1/templates/categories
 * @desc    Create category (admin only)
 * @access  Private
 */
router.post('/categories', templateController.createCategory.bind(templateController));

export default router;
