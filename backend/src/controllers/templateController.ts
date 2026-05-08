import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import templateService from '../services/templateService.js';

export class TemplateController {
  /**
   * POST /api/v1/templates
   * Create a new template
   */
  async createTemplate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const template = await templateService.createTemplate(
        req.body,
        req.user.id,
        req.user.name
      );

      res.status(201).json(
        new ApiResponse(201, { template }, 'Template created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/templates
   * Get all templates with filters
   */
  async getTemplates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        category: req.query.category,
        search: req.query.search,
        tags: req.query.tags ? (Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags]) : [],
        minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      };

      const result = await templateService.getTemplates(page, limit, filters);

      res.status(200).json(
        new ApiResponse(200, result, 'Templates retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/templates/featured
   * Get featured templates
   */
  async getFeaturedTemplates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const templates = await templateService.getFeaturedTemplates(limit);

      res.status(200).json(
        new ApiResponse(200, { templates }, 'Featured templates retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/templates/recommended
   * Get AI recommended templates
   */
  async getRecommendedTemplates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const templates = await templateService.getRecommendedTemplates(limit);

      res.status(200).json(
        new ApiResponse(200, { templates }, 'Recommended templates retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/templates/recent
   * Get recently used templates
   */
  async getRecentTemplates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const templates = await templateService.getRecentTemplates(limit);

      res.status(200).json(
        new ApiResponse(200, { templates }, 'Recent templates retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/templates/trending
   * Get trending templates
   */
  async getTrendingTemplates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const templates = await templateService.getTrendingTemplates(limit);

      res.status(200).json(
        new ApiResponse(200, { templates }, 'Trending templates retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/templates/:id
   * Get template by ID
   */
  async getTemplate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const template = await templateService.getTemplateById(id);

      res.status(200).json(
        new ApiResponse(200, { template }, 'Template retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/templates/:id
   * Update template
   */
  async updateTemplate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const template = await templateService.updateTemplate(id, req.body, req.user.id);

      res.status(200).json(
        new ApiResponse(200, { template }, 'Template updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/templates/:id
   * Delete template
   */
  async deleteTemplate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const result = await templateService.deleteTemplate(id, req.user.id);

      res.status(200).json(
        new ApiResponse(200, result, 'Template deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/templates/:id/publish
   * Publish template
   */
  async publishTemplate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const template = await templateService.publishTemplate(id, req.user.id);

      res.status(200).json(
        new ApiResponse(200, { template }, 'Template published successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/templates/:id/clone
   * Clone template
   */
  async cloneTemplate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const template = await templateService.cloneTemplate(id, req.user.id, req.user.name);

      res.status(201).json(
        new ApiResponse(201, { template }, 'Template cloned successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/templates/:id/rate
   * Rate template
   */
  async rateTemplate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const { rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, 'Rating must be between 1 and 5');
      }

      const template = await templateService.rateTemplate(id, req.user.id, rating, comment);

      res.status(200).json(
        new ApiResponse(200, { template }, 'Template rated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/templates/:id/favorite
   * Toggle favorite status
   */
  async toggleFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const template = await templateService.toggleFavorite(id, req.user.id);

      res.status(200).json(
        new ApiResponse(200, { template }, 'Favorite status updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/templates/favorites
   * Get user's favorite templates
   */
  async getFavoriteTemplates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const templates = await templateService.getFavoriteTemplates(req.user.id);

      res.status(200).json(
        new ApiResponse(200, { templates }, 'Favorite templates retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/templates/:id/download
   * Increment download count
   */
  async downloadTemplate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const template = await templateService.incrementDownloadCount(id);

      res.status(200).json(
        new ApiResponse(200, { template }, 'Download count incremented')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/templates/:id/versions
   * Get template versions
   */
  async getTemplateVersions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const versions = await templateService.getTemplateVersions(id);

      res.status(200).json(
        new ApiResponse(200, { versions }, 'Template versions retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/templates/:id/versions
   * Create template version
   */
  async createTemplateVersion(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const version = await templateService.createTemplateVersion(
        id,
        req.body,
        req.user.id,
        req.user.name
      );

      res.status(201).json(
        new ApiResponse(201, { version }, 'Template version created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/templates/categories
   * Get all categories
   */
  async getCategories(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const categories = await templateService.getCategories();

      res.status(200).json(
        new ApiResponse(200, { categories }, 'Categories retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/templates/categories
   * Create category (admin only)
   */
  async createCategory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const category = await templateService.createCategory(req.body);

      res.status(201).json(
        new ApiResponse(201, { category }, 'Category created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/templates/creator/:creatorId
   * Get templates by creator
   */
  async getTemplatesByCreator(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { creatorId } = req.params;
      const templates = await templateService.getTemplatesByCreator(creatorId);

      res.status(200).json(
        new ApiResponse(200, { templates }, 'Templates retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/templates/:id/check-compatibility
   * Check template compatibility with user stack
   */
  async checkCompatibility(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userStack } = req.body;

      if (!userStack) {
        throw new ApiError(400, 'User stack is required');
      }

      const compatibility = await templateService.checkCompatibility(id, userStack);

      res.status(200).json(
        new ApiResponse(200, { compatibility }, 'Compatibility check completed')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new TemplateController();
