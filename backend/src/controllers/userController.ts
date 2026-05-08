import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export class UserController {
  /**
   * GET /api/v1/users/:id
   * Get user by ID
   */
  async getUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      res.status(200).json(
        new ApiResponse(200, { user }, 'User retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users
   * Get all users (admin only)
   */
  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await userService.getAllUsers(skip, limit);
      res.status(200).json(
        new ApiResponse(200, result, 'Users retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/profile
   * Get current user profile with stats
   */
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const profile = await userService.getUserProfile(req.user.id);
      res.status(200).json(
        new ApiResponse(200, profile, 'Profile retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/:id
   * Update user profile
   */
  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;

      // Users can only update their own profile
      if (req.user.id !== id && req.user.email !== 'admin@example.com') {
        throw new ApiError(403, 'Unauthorized to update this user');
      }

      const user = await userService.updateUser(id, req.body);
      res.status(200).json(
        new ApiResponse(200, { user }, 'User updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/users/change-password
   * Change user password
   */
  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        throw new ApiError(400, 'Old password and new password are required');
      }

      const result = await userService.changePassword(
        req.user.id,
        oldPassword,
        newPassword
      );

      res.status(200).json(
        new ApiResponse(200, result, 'Password changed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/users/:id
   * Delete user account
   */
  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;

      // Users can only delete their own account
      if (req.user.id !== id) {
        throw new ApiError(403, 'Unauthorized to delete this user');
      }

      const result = await userService.deleteUser(id);
      res.status(200).json(
        new ApiResponse(200, result, 'User account deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
