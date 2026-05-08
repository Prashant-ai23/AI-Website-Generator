import { apiClient } from './apiClient';

export interface ProjectData {
  _id?: string;
  name: string;
  description?: string;
  type: string;
  status?: string;
  techStack?: {
    frontend?: string;
    backend?: string;
    database?: string;
    authentication?: string;
  };
  tags?: string[];
  isFavorite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectStats {
  total: number;
  active: number;
  archived: number;
  draft: number;
  published: number;
  byType: Record<string, number>;
}

export class ProjectService {
  /**
   * Create a new project
   */
  static async createProject(projectData: ProjectData): Promise<any> {
    const response = await apiClient.post('/projects', projectData);
    return response.data.data;
  }

  /**
   * Get all projects with pagination and filters
   */
  static async getProjects(
    page: number = 1,
    limit: number = 10,
    filters?: { status?: string; type?: string; search?: string; tags?: string[] }
  ): Promise<any> {
    const query = new URLSearchParams();
    query.append('skip', ((page - 1) * limit).toString());
    query.append('limit', limit.toString());

    if (filters?.status) query.append('status', filters.status);
    if (filters?.type) query.append('type', filters.type);
    if (filters?.search) query.append('search', filters.search);
    if (filters?.tags && filters.tags.length > 0) {
      filters.tags.forEach((tag) => query.append('tags', tag));
    }

    const response = await apiClient.get(`/projects?${query.toString()}`);
    return response.data.data;
  }

  /**
   * Get project by ID
   */
  static async getProjectById(projectId: string): Promise<any> {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data.data;
  }

  /**
   * Update project
   */
  static async updateProject(projectId: string, updates: Partial<ProjectData>): Promise<any> {
    const response = await apiClient.put(`/projects/${projectId}`, updates);
    return response.data.data;
  }

  /**
   * Delete project
   */
  static async deleteProject(projectId: string): Promise<any> {
    const response = await apiClient.delete(`/projects/${projectId}`);
    return response.data.data;
  }

  /**
   * Duplicate project
   */
  static async duplicateProject(projectId: string): Promise<any> {
    const response = await apiClient.post(`/projects/${projectId}/duplicate`, {});
    return response.data.data;
  }

  /**
   * Archive project
   */
  static async archiveProject(projectId: string): Promise<any> {
    const response = await apiClient.post(`/projects/${projectId}/archive`, {});
    return response.data.data;
  }

  /**
   * Restore archived project
   */
  static async restoreProject(projectId: string): Promise<any> {
    const response = await apiClient.post(`/projects/${projectId}/restore`, {});
    return response.data.data;
  }

  /**
   * Toggle favorite status
   */
  static async toggleFavorite(projectId: string): Promise<any> {
    const response = await apiClient.post(`/projects/${projectId}/favorite`, {});
    return response.data.data;
  }

  /**
   * Get favorite projects
   */
  static async getFavoriteProjects(limit: number = 5): Promise<any> {
    const response = await apiClient.get(`/projects/favorites/list?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Get recent projects
   */
  static async getRecentProjects(limit: number = 5): Promise<any> {
    const response = await apiClient.get(`/projects/recent/list?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Get project statistics
   */
  static async getProjectStats(): Promise<ProjectStats> {
    const response = await apiClient.get('/projects/stats/dashboard');
    return response.data.data;
  }

  /**
   * Get project history
   */
  static async getProjectHistory(projectId: string, limit: number = 20): Promise<any> {
    const response = await apiClient.get(`/projects/${projectId}/history?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Publish project
   */
  static async publishProject(projectId: string): Promise<any> {
    const response = await apiClient.post(`/projects/${projectId}/publish`, {});
    return response.data.data;
  }
}

export default ProjectService;
