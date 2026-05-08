import { Request, Response, NextFunction } from 'express';
import projectService from '../services/projectService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export class ProjectController {
  /**
   * POST /api/v1/projects
   * Create a new project
   */
  async createProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { name, description, type } = req.body;

      if (!name) {
        throw new ApiError(400, 'Project name is required');
      }

      const project = await projectService.createProject(req.user.id, {
        name,
        description,
        type,
      });

      res.status(201).json(
        new ApiResponse(201, { project }, 'Project created successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/projects
   * Get user's projects
   */
  async getUserProjects(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = {
        status: req.query.status,
        type: req.query.type,
        search: req.query.search,
      };

      const result = await projectService.getUserProjects(
        req.user.id,
        skip,
        limit,
        filters
      );

      res.status(200).json(
        new ApiResponse(200, result, 'Projects retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/projects/:id
   * Get project by ID
   */
  async getProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id, req.user?.id);

      res.status(200).json(
        new ApiResponse(200, { project }, 'Project retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/projects/:id
   * Update project
   */
  async updateProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const project = await projectService.updateProject(id, req.user.id, req.body);

      res.status(200).json(
        new ApiResponse(200, { project }, 'Project updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/projects/:id
   * Delete project
   */
  async deleteProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const result = await projectService.deleteProject(id, req.user.id);

      res.status(200).json(
        new ApiResponse(200, result, 'Project deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/projects/:id/publish
   * Publish project
   */
  async publishProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const project = await projectService.publishProject(id, req.user.id);

      res.status(200).json(
        new ApiResponse(200, { project }, 'Project published successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/projects/:id/archive
   * Archive project
   */
  async archiveProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const project = await projectService.archiveProject(id, req.user.id);

      res.status(200).json(
        new ApiResponse(200, { project }, 'Project archived successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/projects/:id/duplicate
   * Duplicate project
   */
  async duplicateProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const project = await projectService.duplicateProject(id, req.user.id);

      res.status(201).json(
        new ApiResponse(201, { project }, 'Project duplicated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/projects/:id/restore
   * Restore archived project
   */
  async restoreProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const project = await projectService.restoreProject(id, req.user.id);

      res.status(200).json(
        new ApiResponse(200, { project }, 'Project restored successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/projects/:id/favorite
   * Toggle favorite status
   */
  async toggleFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const { id } = req.params;
      const project = await projectService.toggleFavorite(id, req.user.id);

      res.status(200).json(
        new ApiResponse(200, { project }, 'Favorite status updated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/projects/favorites/list
   * Get favorite projects
   */
  async getFavorites(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const limit = parseInt(req.query.limit as string) || 5;
      const projects = await projectService.getFavoriteProjects(req.user.id, limit);

      res.status(200).json(
        new ApiResponse(200, { projects }, 'Favorite projects retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/projects/recent/list
   * Get recent projects
   */
  async getRecent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const limit = parseInt(req.query.limit as string) || 5;
      const projects = await projectService.getRecentProjects(req.user.id, limit);

      res.status(200).json(
        new ApiResponse(200, { projects }, 'Recent projects retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/projects/stats/dashboard
   * Get project statistics
   */
  async getStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'User not authenticated');
      }

      const stats = await projectService.getProjectStats(req.user.id);

      res.status(200).json(
        new ApiResponse(200, stats, 'Project statistics retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/projects/:id/history
   * Get project activity history
   */
  async getHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;

      // Verify project access
      const project = await projectService.getProjectById(id, req.user?.id);
      if (!project) {
        throw new ApiError(404, 'Project not found');
      }

      const history = await projectService.getProjectHistory(id, limit);

      res.status(200).json(
        new ApiResponse(200, { history }, 'Project history retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
