import { apiClient } from './apiClient';

export interface ITemplate {
  _id?: string;
  name: string;
  slug?: string;
  description: string;
  category: string;
  preview?: {
    image: string;
    thumbnail?: string;
    gallery?: string[];
  };
  supportedStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    authentication: string[];
  };
  components?: any[];
  pages?: any[];
  version?: string;
  status?: 'draft' | 'published' | 'deprecated' | 'archived';
  tags?: string[];
  rating?: {
    average: number;
    count: number;
  };
  downloads?: number;
  views?: number;
  isFeatured?: boolean;
}

export class TemplateService {
  /**
   * Create a new template
   */
  static async createTemplate(templateData: ITemplate): Promise<any> {
    const response = await apiClient.post('/templates', templateData);
    return response.data.data;
  }

  /**
   * Get all templates with filters
   */
  static async getTemplates(
    page: number = 1,
    limit: number = 10,
    filters?: { category?: string; search?: string; tags?: string[]; minRating?: number }
  ): Promise<any> {
    const query = new URLSearchParams();
    query.append('page', page.toString());
    query.append('limit', limit.toString());

    if (filters?.category) query.append('category', filters.category);
    if (filters?.search) query.append('search', filters.search);
    if (filters?.tags && filters.tags.length > 0) {
      filters.tags.forEach((tag) => query.append('tags', tag));
    }
    if (filters?.minRating) query.append('minRating', filters.minRating.toString());

    const response = await apiClient.get(`/templates?${query.toString()}`);
    return response.data.data;
  }

  /**
   * Get featured templates
   */
  static async getFeaturedTemplates(limit: number = 6): Promise<any> {
    const response = await apiClient.get(`/templates/featured?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Get recommended templates
   */
  static async getRecommendedTemplates(limit: number = 6): Promise<any> {
    const response = await apiClient.get(`/templates/recommended?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Get recent templates
   */
  static async getRecentTemplates(limit: number = 5): Promise<any> {
    const response = await apiClient.get(`/templates/recent?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Get trending templates
   */
  static async getTrendingTemplates(limit: number = 6): Promise<any> {
    const response = await apiClient.get(`/templates/trending?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Get template by ID
   */
  static async getTemplateById(templateId: string): Promise<any> {
    const response = await apiClient.get(`/templates/${templateId}`);
    return response.data.data;
  }

  /**
   * Update template
   */
  static async updateTemplate(templateId: string, updates: Partial<ITemplate>): Promise<any> {
    const response = await apiClient.put(`/templates/${templateId}`, updates);
    return response.data.data;
  }

  /**
   * Delete template
   */
  static async deleteTemplate(templateId: string): Promise<any> {
    const response = await apiClient.delete(`/templates/${templateId}`);
    return response.data.data;
  }

  /**
   * Publish template
   */
  static async publishTemplate(templateId: string): Promise<any> {
    const response = await apiClient.post(`/templates/${templateId}/publish`, {});
    return response.data.data;
  }

  /**
   * Clone template
   */
  static async cloneTemplate(templateId: string): Promise<any> {
    const response = await apiClient.post(`/templates/${templateId}/clone`, {});
    return response.data.data;
  }

  /**
   * Rate template
   */
  static async rateTemplate(
    templateId: string,
    rating: number,
    comment?: string
  ): Promise<any> {
    const response = await apiClient.post(`/templates/${templateId}/rate`, {
      rating,
      comment,
    });
    return response.data.data;
  }

  /**
   * Toggle favorite
   */
  static async toggleFavorite(templateId: string): Promise<any> {
    const response = await apiClient.post(`/templates/${templateId}/favorite`, {});
    return response.data.data;
  }

  /**
   * Get favorite templates
   */
  static async getFavoriteTemplates(): Promise<any> {
    const response = await apiClient.get('/templates/favorites');
    return response.data.data;
  }

  /**
   * Download template
   */
  static async downloadTemplate(templateId: string): Promise<any> {
    const response = await apiClient.post(`/templates/${templateId}/download`, {});
    return response.data.data;
  }

  /**
   * Get template versions
   */
  static async getTemplateVersions(templateId: string): Promise<any> {
    const response = await apiClient.get(`/templates/${templateId}/versions`);
    return response.data.data;
  }

  /**
   * Create template version
   */
  static async createTemplateVersion(
    templateId: string,
    versionData: any
  ): Promise<any> {
    const response = await apiClient.post(`/templates/${templateId}/versions`, versionData);
    return response.data.data;
  }

  /**
   * Get categories
   */
  static async getCategories(): Promise<any> {
    const response = await apiClient.get('/templates/categories');
    return response.data.data;
  }

  /**
   * Get templates by creator
   */
  static async getTemplatesByCreator(creatorId: string): Promise<any> {
    const response = await apiClient.get(`/templates/creator/${creatorId}`);
    return response.data.data;
  }

  /**
   * Check compatibility
   */
  static async checkCompatibility(
    templateId: string,
    userStack: any
  ): Promise<any> {
    const response = await apiClient.post(`/templates/${templateId}/check-compatibility`, {
      userStack,
    });
    return response.data.data;
  }
}

export default TemplateService;
