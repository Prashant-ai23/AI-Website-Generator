import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

export class UserService {
  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(skip = 0, limit = 10) {
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return {
      users,
      total,
      skip,
      limit,
    };
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, updates: Record<string, any>) {
    // Don't allow password updates through this method
    delete updates.password;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  /**
   * Delete user account
   */
  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return { message: 'User account deleted successfully' };
  }

  /**
   * Get user profile with stats
   */
  async getUserProfile(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // In a real app, you'd fetch related data (projects, templates, etc.)
    return {
      user,
      stats: {
        projects: 0,
        templates: 0,
        generatedWebsites: 0,
      },
    };
  }
}

export default new UserService();
