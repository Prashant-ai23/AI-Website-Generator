import { Project, IProject } from '../models/Project.js';
import { ProjectActivity } from '../models/ProjectActivity.js';
import { ApiError } from '../utils/apiError.js';

export class ProjectService {
  /**
   * Create a new project
   */
  async createProject(userId: string, projectData: Record<string, any>): Promise<IProject> {
    const project = new Project({
      userId,
      ...projectData,
    });

    await project.save();
    return project;
  }

  /**
   * Get user's projects
   */
  async getUserProjects(userId: string, skip = 0, limit = 10, filters: Record<string, any> = {}): Promise<{ projects: IProject[]; total: number; skip: number; limit: number }> {
    const query: Record<string, any> = { userId };

    // Apply filters
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    return {
      projects,
      total,
      skip,
      limit,
    };
  }

  /**
   * Get project by ID
   */
  async getProjectById(projectId: string, userId?: string): Promise<IProject> {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    // Check authorization if userId provided
    if (userId && project.userId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized to access this project');
    }

    // Increment views
    project.views += 1;
    await project.save();

    return project;
  }

  /**
   * Update project
   */
  async updateProject(projectId: string, userId: string, updates: Record<string, any>): Promise<IProject> {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    if (project.userId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized to update this project');
    }

    // Update fields
    Object.assign(project, updates);
    await project.save();

    return project;
  }

  /**
   * Delete project
   */
  async deleteProject(projectId: string, userId: string): Promise<{ message: string }> {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    if (project.userId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized to delete this project');
    }

    await Project.findByIdAndDelete(projectId);
    return { message: 'Project deleted successfully' };
  }

  /**
   * Publish project
   */
  async publishProject(projectId: string, userId: string): Promise<IProject> {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    if (project.userId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized to publish this project');
    }

    project.status = 'published';
    await project.save();

    return project;
  }

  /**
   * Archive project
   */
  async archiveProject(projectId: string, userId: string): Promise<IProject> {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    if (project.userId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized to archive this project');
    }

    project.status = 'archived';
    await project.save();

    return project;
  }

  /**
   * Duplicate project
   */
  async duplicateProject(projectId: string, userId: string): Promise<IProject> {
    const originalProject = await Project.findById(projectId);

    if (!originalProject) {
      throw new ApiError(404, 'Project not found');
    }

    if (originalProject.userId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized to duplicate this project');
    }

    const newProject = new Project({
      userId,
      name: `${originalProject.name} (Copy)`,
      description: originalProject.description,
      type: originalProject.type,
      content: JSON.parse(JSON.stringify(originalProject.content)),
      settings: JSON.parse(JSON.stringify(originalProject.settings)),
      tags: [...originalProject.tags],
      techStack: originalProject.techStack ? JSON.parse(JSON.stringify(originalProject.techStack)) : {},
    });

    await newProject.save();

    // Log activity
    await this.logActivity(newProject._id.toString(), userId, 'duplicated', `Duplicated from "${originalProject.name}"`);

    return newProject;
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(projectId: string, userId: string): Promise<IProject> {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    if (project.userId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized');
    }

    project.isFavorite = !project.isFavorite;
    await project.save();

    return project;
  }

  /**
   * Get favorite projects
   */
  async getFavoriteProjects(userId: string, limit: number = 5): Promise<IProject[]> {
    return await Project.find({ userId, isFavorite: true })
      .sort('-updatedAt')
      .limit(limit);
  }

  /**
   * Get recent projects
   */
  async getRecentProjects(userId: string, limit: number = 5): Promise<IProject[]> {
    return await Project.find({ userId, status: { $ne: 'archived' } })
      .sort('-updatedAt')
      .limit(limit);
  }

  /**
   * Get project statistics
   */
  async getProjectStats(userId: string): Promise<any> {
    const [total, active, archived, draft, published, byType] = await Promise.all([
      Project.countDocuments({ userId }),
      Project.countDocuments({ userId, status: 'active' }),
      Project.countDocuments({ userId, status: 'archived' }),
      Project.countDocuments({ userId, status: 'draft' }),
      Project.countDocuments({ userId, status: 'published' }),
      Project.collection.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]).toArray(),
    ]);

    const byTypeObj: Record<string, number> = {};
    byType.forEach((item: any) => {
      byTypeObj[item._id] = item.count;
    });

    return {
      total,
      active,
      archived,
      draft,
      published,
      byType: byTypeObj,
    };
  }

  /**
   * Restore archived project
   */
  async restoreProject(projectId: string, userId: string): Promise<IProject> {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    if (project.userId.toString() !== userId) {
      throw new ApiError(403, 'Unauthorized to restore this project');
    }

    project.status = 'draft';
    await project.save();

    await this.logActivity(projectId, userId, 'restored', `Project restored from archive`);

    return project;
  }

  /**
   * Get project activity history
   */
  async getProjectHistory(projectId: string, limit: number = 20): Promise<any[]> {
    return await ProjectActivity.find({ projectId })
      .sort('-timestamp')
      .limit(limit)
      .populate('userId', 'name email');
  }

  /**
   * Log project activity
   */
  private async logActivity(projectId: string, userId: string, action: string, description: string): Promise<void> {
    try {
      const activity = new ProjectActivity({
        projectId,
        userId,
        userName: '',
        action,
        description,
        timestamp: new Date(),
      });

      await activity.save();
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  }
}

export default new ProjectService();
