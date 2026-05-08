import Template from '../models/Template.js';
import TemplateCategory from '../models/TemplateCategory.js';
import TemplateVersion from '../models/TemplateVersion.js';
import { ApiError } from '../utils/ApiError.js';

export class TemplateService {
  /**
   * Create a new template
   */
  async createTemplate(
    templateData: any,
    userId: string,
    userName: string
  ): Promise<any> {
    const slug = this.generateSlug(templateData.name);
    
    // Check if slug already exists
    const existingTemplate = await Template.findOne({ slug });
    if (existingTemplate) {
      throw new ApiError(400, 'Template slug already exists');
    }

    const newTemplate = new Template({
      ...templateData,
      slug,
      createdBy: userId,
      createdByUser: userName,
      status: 'draft',
    });

    await newTemplate.save();
    return newTemplate;
  }

  /**
   * Get all templates with filters and pagination
   */
  async getTemplates(
    page: number = 1,
    limit: number = 10,
    filters?: any
  ): Promise<any> {
    const query: any = { status: 'published' };

    if (filters?.category) query.category = filters.category;
    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { tags: { $in: [new RegExp(filters.search, 'i')] } },
      ];
    }
    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    if (filters?.minRating) {
      query['rating.average'] = { $gte: filters.minRating };
    }

    const skip = (page - 1) * limit;
    const total = await Template.countDocuments(query);
    const templates = await Template.find(query)
      .populate('category')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      templates,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  /**
   * Get featured templates
   */
  async getFeaturedTemplates(limit: number = 6): Promise<any> {
    return Template.find({ status: 'published', isFeatured: true })
      .populate('category')
      .limit(limit)
      .sort({ downloads: -1 });
  }

  /**
   * Get recommended templates based on AI score
   */
  async getRecommendedTemplates(limit: number = 6): Promise<any> {
    return Template.find({ status: 'published' })
      .populate('category')
      .limit(limit)
      .sort({ aiScore: -1, 'rating.average': -1 });
  }

  /**
   * Get recently used templates
   */
  async getRecentTemplates(limit: number = 5): Promise<any> {
    return Template.find({ status: 'published', isRecent: true })
      .populate('category')
      .limit(limit)
      .sort({ updatedAt: -1 });
  }

  /**
   * Get template by ID
   */
  async getTemplateById(templateId: string): Promise<any> {
    const template = await Template.findById(templateId)
      .populate('category')
      .populate({
        path: 'createdBy',
        select: 'name email',
      });

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    // Increment views
    template.views = (template.views || 0) + 1;
    await template.save();

    return template;
  }

  /**
   * Update template
   */
  async updateTemplate(templateId: string, updates: any, userId: string): Promise<any> {
    const template = await Template.findById(templateId);

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    // Check authorization
    if (template.createdBy.toString() !== userId) {
      throw new ApiError(403, 'Not authorized to update this template');
    }

    Object.assign(template, updates);
    await template.save();

    return template;
  }

  /**
   * Delete template
   */
  async deleteTemplate(templateId: string, userId: string): Promise<any> {
    const template = await Template.findById(templateId);

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    // Check authorization
    if (template.createdBy.toString() !== userId) {
      throw new ApiError(403, 'Not authorized to delete this template');
    }

    await Template.findByIdAndDelete(templateId);
    await TemplateVersion.deleteMany({ templateId });

    return { success: true, message: 'Template deleted successfully' };
  }

  /**
   * Publish template
   */
  async publishTemplate(templateId: string, userId: string): Promise<any> {
    const template = await Template.findById(templateId);

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    if (template.createdBy.toString() !== userId) {
      throw new ApiError(403, 'Not authorized to publish this template');
    }

    template.status = 'published';
    template.publishedAt = new Date();
    template.isFeatured = false;
    await template.save();

    return template;
  }

  /**
   * Clone/duplicate template
   */
  async cloneTemplate(templateId: string, userId: string, userName: string): Promise<any> {
    const original = await Template.findById(templateId);

    if (!original) {
      throw new ApiError(404, 'Template not found');
    }

    const clonedData = {
      name: `${original.name} (Copy)`,
      slug: this.generateSlug(`${original.name} copy`),
      description: original.description,
      category: original.category,
      supportedStack: { ...original.supportedStack },
      components: [...(original.components || [])],
      pages: [...(original.pages || [])],
      tags: [...(original.tags || [])],
      preview: original.preview ? { ...original.preview } : undefined,
      createdBy: userId,
      createdByUser: userName,
      status: 'draft',
      version: '1.0.0',
    };

    const clonedTemplate = new Template(clonedData);
    await clonedTemplate.save();

    return clonedTemplate;
  }

  /**
   * Add rating/review to template
   */
  async rateTemplate(
    templateId: string,
    userId: string,
    rating: number,
    comment?: string
  ): Promise<any> {
    const template = await Template.findById(templateId);

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    // Check if user already rated
    const existingReview = template.reviews?.find(
      (r) => r.userId.toString() === userId
    );

    if (existingReview) {
      // Update existing rating
      const oldRating = existingReview.rating;
      existingReview.rating = rating;
      existingReview.comment = comment;

      template.rating.sum = template.rating.sum - oldRating + rating;
    } else {
      // Add new rating
      template.reviews = template.reviews || [];
      template.reviews.push({
        userId: new (Template as any).schema.path('reviews.0.userId').instance(userId),
        rating,
        comment,
        createdAt: new Date(),
      });

      template.rating.count = (template.rating.count || 0) + 1;
      template.rating.sum = (template.rating.sum || 0) + rating;
    }

    // Calculate average
    template.rating.average = template.rating.sum / template.rating.count;
    await template.save();

    return template;
  }

  /**
   * Toggle template favorite
   */
  async toggleFavorite(templateId: string, userId: string): Promise<any> {
    const template = await Template.findById(templateId);

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    const favoriteIndex = template.favorites?.findIndex(
      (fav) => fav.toString() === userId
    );

    if (favoriteIndex !== undefined && favoriteIndex >= 0) {
      // Remove from favorites
      template.favorites?.splice(favoriteIndex, 1);
    } else {
      // Add to favorites
      template.favorites = template.favorites || [];
      template.favorites.push(new (Template as any).schema.path('favorites.0').instance(userId));
    }

    await template.save();
    return template;
  }

  /**
   * Get user's favorite templates
   */
  async getFavoriteTemplates(userId: string): Promise<any> {
    return Template.find({
      favorites: userId,
      status: 'published',
    })
      .populate('category')
      .sort({ createdAt: -1 });
  }

  /**
   * Increment download count
   */
  async incrementDownloadCount(templateId: string): Promise<any> {
    const template = await Template.findByIdAndUpdate(
      templateId,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    return template;
  }

  /**
   * Get template versions
   */
  async getTemplateVersions(templateId: string): Promise<any> {
    return TemplateVersion.find({ templateId })
      .populate('author', 'name email')
      .sort({ releasedAt: -1 });
  }

  /**
   * Create template version
   */
  async createTemplateVersion(
    templateId: string,
    versionData: any,
    userId: string,
    userName: string
  ): Promise<any> {
    const template = await Template.findById(templateId);

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    const newVersion = new TemplateVersion({
      templateId,
      version: versionData.version,
      description: versionData.description,
      changes: versionData.changes,
      author: userId,
      authorName: userName,
      content: versionData.content || {},
      isMajor: versionData.isMajor || false,
      isMinor: versionData.isMinor || false,
      isPatch: versionData.isPatch !== false,
    });

    await newVersion.save();

    // Update template version
    template.version = versionData.version;
    await template.save();

    return newVersion;
  }

  /**
   * Get template categories
   */
  async getCategories(): Promise<any> {
    return TemplateCategory.find({ isActive: true }).sort({ order: 1 });
  }

  /**
   * Get single category by ID
   */
  async getCategoryById(categoryId: string): Promise<any> {
    const category = await TemplateCategory.findById(categoryId);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
    return category;
  }

  /**
   * Create template category (admin only)
   */
  async createCategory(categoryData: any): Promise<any> {
    const slug = this.generateSlug(categoryData.name);

    const existingCategory = await TemplateCategory.findOne({ slug });
    if (existingCategory) {
      throw new ApiError(400, 'Category slug already exists');
    }

    const newCategory = new TemplateCategory({
      ...categoryData,
      slug,
    });

    await newCategory.save();
    return newCategory;
  }

  /**
   * Update template category (admin only)
   */
  async updateCategory(categoryId: string, updateData: any): Promise<any> {
    const category = await TemplateCategory.findById(categoryId);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    // If name is being updated, regenerate slug
    if (updateData.name && updateData.name !== category.name) {
      const newSlug = this.generateSlug(updateData.name);
      const existingSlug = await TemplateCategory.findOne({ slug: newSlug, _id: { $ne: categoryId } });
      if (existingSlug) {
        throw new ApiError(400, 'Category slug already exists');
      }
      updateData.slug = newSlug;
    }

    Object.assign(category, updateData);
    await category.save();
    return category;
  }

  /**
   * Delete template category (admin only)
   */
  async deleteCategory(categoryId: string): Promise<any> {
    const category = await TemplateCategory.findById(categoryId);
    if (!category) {
      throw new ApiError(404, 'Category not found');
    }

    // Check if any templates use this category
    const Template = (await import('../models/Template.js')).default;
    const templatesWithCategory = await Template.findOne({ category: categoryId });
    if (templatesWithCategory) {
      throw new ApiError(400, 'Cannot delete category that has templates assigned');
    }

    await TemplateCategory.findByIdAndDelete(categoryId);
    return { message: 'Category deleted successfully' };
  }

  /**
   * Get templates by creator
   */
  async getTemplatesByCreator(creatorId: string): Promise<any> {
    return Template.find({ createdBy: creatorId })
      .populate('category')
      .sort({ createdAt: -1 });
  }

  /**
   * Check template compatibility
   */
  async checkCompatibility(templateId: string, userStack: any): Promise<any> {
    const template = await Template.findById(templateId);

    if (!template) {
      throw new ApiError(404, 'Template not found');
    }

    const compatibility = {
      frontend: {
        compatible: template.supportedStack.frontend.includes(userStack.frontend),
        supported: template.supportedStack.frontend,
      },
      backend: {
        compatible: template.supportedStack.backend.includes(userStack.backend),
        supported: template.supportedStack.backend,
      },
      database: {
        compatible: template.supportedStack.database.includes(userStack.database),
        supported: template.supportedStack.database,
      },
      authentication: {
        compatible: template.supportedStack.authentication.includes(userStack.authentication),
        supported: template.supportedStack.authentication,
      },
      overall: true,
    };

    // Check overall compatibility
    compatibility.overall =
      compatibility.frontend.compatible &&
      compatibility.backend.compatible &&
      compatibility.database.compatible &&
      compatibility.authentication.compatible;

    return compatibility;
  }

  /**
   * Get trending templates
   */
  async getTrendingTemplates(limit: number = 6): Promise<any> {
    return Template.find({ status: 'published' })
      .populate('category')
      .limit(limit)
      .sort({ downloads: -1, views: -1 });
  }

  /**
   * Helper: Generate slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}

export default new TemplateService();
