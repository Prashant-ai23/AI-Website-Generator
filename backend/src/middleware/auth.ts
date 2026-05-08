import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
    role?: 'user' | 'admin';
  };
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Sets req.user with decoded token data
 */
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
        id: string;
        email: string;
        name?: string;
        role?: 'user' | 'admin';
      };

      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || 'user',
      };

      next();
    } catch (tokenError) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware
 * Similar to authenticate but doesn't throw if no token
 */
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
          id: string;
          email: string;
          name?: string;
          role?: 'user' | 'admin';
        };

        req.user = {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role || 'user',
        };
      } catch (tokenError) {
        // Silently fail for optional auth
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Role-based authorization middleware
 * Checks if user has required role(s)
 */
export function authorize(...allowedRoles: ('user' | 'admin')[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Authentication required');
      }

      const userRole = req.user.role || 'user';
      
      if (!allowedRoles.includes(userRole)) {
        throw new ApiError(403, `Access denied. Required role(s): ${allowedRoles.join(', ')}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
