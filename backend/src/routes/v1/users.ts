import express from 'express';
import userController from '../../controllers/userController.js';
import { authenticate } from '../../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/', userController.getAllUsers.bind(userController));

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', userController.getProfile.bind(userController));

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', userController.getUser.bind(userController));

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user profile
 * @access  Private
 */
router.put('/:id', userController.updateUser.bind(userController));

/**
 * @route   POST /api/v1/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', userController.changePassword.bind(userController));

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/:id', userController.deleteUser.bind(userController));

export default router;
