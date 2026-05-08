import { Request, Response, NextFunction } from 'express';
import aiGenerationService from '../services/aiGenerationService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export class AIGenerationController {
  /**
   * POST /api/v1/ai/generate
   * Generate website from prompt
   */
  async generateWebsite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { description, type, industry, style } = req.body;

      if (!description) {
        throw new ApiError(400, 'Description is required');
      }

      const generatedWebsite = await aiGenerationService.generateWebsite(req.user.id, {
        description,
        type,
        industry,
        style,
      });

      res.status(200).json(
        new ApiResponse(200, { website: generatedWebsite }, 'Website generated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/ai/analyze/:projectId
   * Analyze website content
   */
  async analyzeContent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { projectId } = req.params;
      const content = req.body;

      const analysis = await aiGenerationService.analyzeContent(
        req.user.id,
        projectId,
        content
      );

      res.status(200).json(
        new ApiResponse(200, { analysis }, 'Content analysis completed')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/ai/optimize/:projectId
   * Optimize website performance
   */
  async optimizePerformance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { projectId } = req.params;

      const optimizations = await aiGenerationService.optimizePerformance(
        req.user.id,
        projectId
      );

      res.status(200).json(
        new ApiResponse(200, { optimizations }, 'Performance optimization completed')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/ai/color-palette
   * Generate color palette
   */
  async generateColorPalette(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { style } = req.body;

      const palette = await aiGenerationService.generateColorPalette(req.user.id, style);

      res.status(200).json(
        new ApiResponse(200, { palette }, 'Color palette generated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/ai/typography
   * Generate typography scales
   */
  async generateTypography(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const typography = await aiGenerationService.generateTypography(req.user.id);

      res.status(200).json(
        new ApiResponse(200, { typography }, 'Typography generated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/ai/layout-suggestions
   * Generate layout suggestions
   */
  async generateLayoutSuggestions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { type } = req.body;

      if (!type) {
        throw new ApiError(400, 'Project type is required');
      }

      const layouts = await aiGenerationService.generateLayoutSuggestions(
        req.user.id,
        type
      );

      res.status(200).json(
        new ApiResponse(200, { layouts }, 'Layout suggestions generated successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AIGenerationController();
