import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Register a new user
   */
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      // Validate input
      if (!email || !password || !name) {
        throw new ApiError(400, 'Email, password, and name are required');
      }

      const result = await authService.register(email, password, name);
      res.status(201).json(
        new ApiResponse(201, result, 'User registered successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   * Login user
   */
  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
      }

      const result = await authService.login(email, password);
      res.status(200).json(
        new ApiResponse(200, result, 'Login successful')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Get current user (protected route)
   */
  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const user = await authService.verifyToken(req.headers.authorization?.split(' ')[1] || '');
      res.status(200).json(
        new ApiResponse(200, { user }, 'User retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   * Refresh access token
   */
  async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new ApiError(401, 'No token provided');
      }

      const result = await authService.refreshToken(token);
      res.status(200).json(
        new ApiResponse(200, result, 'Token refreshed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   * Logout user
   */
  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // In production, invalidate token in Redis/blacklist
      res.status(200).json(
        new ApiResponse(200, null, 'Logout successful')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
