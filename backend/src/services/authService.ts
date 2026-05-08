import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

interface AuthPayload {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(email: string, password: string, name: string) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }

    // Create new user
    const user = new User({
      email,
      name,
      password, // Will be hashed by model pre-save hook
    });

    await user.save();

    // Generate token
    const token = this.generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
      },
      token,
    };
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate token
    const token = this.generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    });

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
      },
      token,
    };
  }

  /**
   * Verify token and get user
   */
  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as AuthPayload;

      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      return user;
    } catch (error) {
      throw new ApiError(401, 'Invalid token');
    }
  }

  /**
   * Generate JWT token
   */
  private generateToken(payload: AuthPayload): string {
    const secret = (process.env.JWT_SECRET || 'your-secret-key') as string;
    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    } as any);
  }

  /**
   * Refresh token
   */
  async refreshToken(token: string) {
    const user = await this.verifyToken(token);
    
    const newToken = this.generateToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    });

    return { token: newToken };
  }
}

export default new AuthService();
