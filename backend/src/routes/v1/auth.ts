import express from 'express';
import authController from '../../controllers/authController.js';
import { authenticate, optionalAuth } from '../../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register.bind(authController));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authController.login.bind(authController));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user (protected)
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser.bind(authController));

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Private
 */
router.post('/refresh', authenticate, authController.refreshToken.bind(authController));

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout.bind(authController));

export default router;
