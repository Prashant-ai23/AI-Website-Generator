/**
 * Backend API Generator
 * Generates Express controllers, services, models, and routes
 */

export type DBType = 'mongodb' | 'postgresql';
export type ValidationLibrary = 'joi' | 'zod' | 'class-validator';

export interface APIField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'enum' | 'reference';
  required?: boolean;
  unique?: boolean;
  indexed?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: string[];
  reference?: string; // For foreign keys
  description?: string;
  default?: any;
}

export interface APIResourceConfig {
  name: string; // Resource name (e.g., 'User')
  pluralName: string; // Plural form (e.g., 'users')
  fields: APIField[];
  timestamps?: boolean;
  softDelete?: boolean;
  validation?: 'joi' | 'zod' | 'class-validator';
  database?: 'mongodb' | 'postgresql';
  description?: string;
}

export interface APIGenerationOptions {
  includePagination?: boolean;
  includeSearch?: boolean;
  includeFiltering?: boolean;
  includeValidation?: boolean;
  includeSorting?: boolean;
  routes?: Array<'create' | 'read' | 'update' | 'delete' | 'list'>;
}

export class BackendAPIGenerator {
  /**
   * Generate MongoDB Mongoose model
   */
  static generateModel(
    config: APIResourceConfig,
    options: APIGenerationOptions = {}
  ): string {
    const fields = this.generateModelFields(config.fields);
    const indexes = this.generateIndexes(config.fields);
    const methods = this.generateModelMethods(config);

    return `import { Schema, model, Document } from 'mongoose';

export interface I${config.name} extends Document {
${config.fields.map(f => `  ${f.name}: ${this.getTSType(f.type)};`).join('\n')}
${config.timestamps ? '  createdAt?: Date;\n  updatedAt?: Date;' : ''}
${config.softDelete ? '  deletedAt?: Date | null;' : ''}
}

const schema = new Schema<I${config.name}>({
${fields}
}${config.timestamps ? ', { timestamps: true }' : ''});

${indexes}

${methods}

export default model<I${config.name}>('${config.name}', schema);
`;
  }

  /**
   * Generate service with CRUD, filtering, pagination, search
   */
  static generateService(
    config: APIResourceConfig,
    options: APIGenerationOptions = {}
  ): string {
    const searchFields = config.fields.filter(f => f.type === 'string').map(f => f.name);
    const filterFields = config.fields.filter(f => !f.reference).map(f => f.name);

    return `import ${config.name} from '../models/${config.name}.js';
import { QueryOptions, FilterOptions, PaginationOptions } from '../types/api.js';

export class ${config.name}Service {
  /**
   * Create a new ${config.name}
   */
  async create(data: Partial<I${config.name}>): Promise<I${config.name}> {
    const document = new ${config.name}(data);
    return await document.save();
  }

  /**
   * Get ${config.name} by ID
   */
  async getById(id: string): Promise<I${config.name} | null> {
    return await ${config.name}.findById(id)${config.softDelete ? '.where({ deletedAt: null })' : ''};
  }

  /**
   * List all ${config.pluralName}
   */
  async list(options: PaginationOptions & QueryOptions = {}): Promise<{
    data: I${config.name}[];
    total: number;
    page: number;
    pages: number;
    pageSize: number;
  }> {
    const {
      page = 1,
      pageSize = 10,
      sort = '-createdAt',
      search,
      filter,
    } = options;

    let query = ${config.name}.find();

    ${config.softDelete ? '// Exclude soft deleted documents\n    query = query.where({ deletedAt: null });' : ''}

    ${options.includeSearch ? `
    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = query.or([
        ${searchFields.map(f => `{ ${f}: searchRegex }`).join(',\n        ')}
      ]);
    }` : ''}

    ${options.includeFiltering ? `
    // Apply filters
    if (filter) {
      ${filterFields.map(f => `if (filter.${f}) query = query.where('${f}', filter.${f});`).join('\n      ')}
    }` : ''}

    // Count total
    const total = await ${config.name}.countDocuments(query.getFilter());

    // Apply pagination and sorting
    const data = await query
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    return {
      data: data as I${config.name}[],
      total,
      page,
      pages: Math.ceil(total / pageSize),
      pageSize,
    };
  }

  /**
   * Update ${config.name}
   */
  async update(id: string, data: Partial<I${config.name}>): Promise<I${config.name} | null> {
    return await ${config.name}.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Delete ${config.name}
   */
  async delete(id: string): Promise<boolean> {
    ${config.softDelete ? `
    const result = await ${config.name}.findByIdAndUpdate(id, { deletedAt: new Date() });
    return !!result;` : `
    const result = await ${config.name}.findByIdAndDelete(id);
    return !!result;`}
  }

  /**
   * Search ${config.pluralName}
   */
  ${options.includeSearch ? `async search(query: string, limit: number = 20): Promise<I${config.name}[]> {
    const searchRegex = new RegExp(query, 'i');
    return await ${config.name}
      .find()
      .or([
        ${searchFields.map(f => `{ ${f}: searchRegex }`).join(',\n        ')}
      ])
      .limit(limit)
      .lean();
  }` : ''}

  /**
   * Bulk operations
   */
  async bulkCreate(items: Partial<I${config.name}>[]): Promise<I${config.name}[]> {
    return await ${config.name}.insertMany(items);
  }

  async bulkUpdate(ids: string[], data: Partial<I${config.name}>): Promise<{ modifiedCount: number }> {
    const result = await ${config.name}.updateMany(
      { _id: { \\$in: ids } },
      data
    );
    return { modifiedCount: result.modifiedCount };
  }

  async bulkDelete(ids: string[]): Promise<{ deletedCount: number }> {
    ${config.softDelete ? `
    const result = await ${config.name}.updateMany(
      { _id: { \\$in: ids } },
      { deletedAt: new Date() }
    );
    return { deletedCount: result.modifiedCount };` : `
    const result = await ${config.name}.deleteMany({ _id: { \\$in: ids } });
    return { deletedCount: result.deletedCount };`}
  }
}

export default new ${config.name}Service();
`;
  }

  /**
   * Generate Express controller
   */
  static generateController(
    config: APIResourceConfig,
    options: APIGenerationOptions = {}
  ): string {
    return `import { Request, Response, NextFunction } from 'express';
import ${config.name}Service from '../services/${config.name}Service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class ${config.name}Controller {
  /**
   * Create new ${config.name}
   * POST /${config.pluralName}
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const document = await ${config.name}Service.create(data);
      
      const response = new ApiResponse(201, document, '${config.name} created successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get ${config.name} by ID
   * GET /${config.pluralName}/:id
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const document = await ${config.name}Service.getById(id);

      if (!document) {
        throw new ApiError(404, '${config.name} not found');
      }

      const response = new ApiResponse(200, document);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all ${config.pluralName}
   * GET /${config.pluralName}
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const sort = (req.query.sort as string) || '-createdAt';
      const search = req.query.search as string;
      ${options.includeFiltering ? 'const filter = req.query.filter as any;' : ''}

      const result = await ${config.name}Service.list({
        page,
        pageSize,
        sort,
        search,
        ${options.includeFiltering ? 'filter,' : ''}
      });

      const response = new ApiResponse(200, result, '${config.pluralName} retrieved successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update ${config.name}
   * PATCH /${config.pluralName}/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;

      const document = await ${config.name}Service.update(id, data);

      if (!document) {
        throw new ApiError(404, '${config.name} not found');
      }

      const response = new ApiResponse(200, document, '${config.name} updated successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete ${config.name}
   * DELETE /${config.pluralName}/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const success = await ${config.name}Service.delete(id);

      if (!success) {
        throw new ApiError(404, '${config.name} not found');
      }

      const response = new ApiResponse(200, { id }, '${config.name} deleted successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search ${config.pluralName}
   * GET /${config.pluralName}/search?q=query
   */
  ${options.includeSearch ? `async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, limit } = req.query;
      
      if (!q || typeof q !== 'string') {
        throw new ApiError(400, 'Search query is required');
      }

      const results = await ${config.name}Service.search(q, parseInt(limit as string) || 20);
      
      const response = new ApiResponse(200, results, 'Search results');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }` : ''}

  /**
   * Bulk create
   * POST /${config.pluralName}/bulk
   */
  async bulkCreate(req: Request, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, 'Items array is required');
      }

      const documents = await ${config.name}Service.bulkCreate(items);
      
      const response = new ApiResponse(201, { created: documents.length }, 'Bulk creation completed');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new ${config.name}Controller();
`;
  }

  /**
   * Generate Express routes
   */
  static generateRoutes(
    config: APIResourceConfig,
    options: APIGenerationOptions = {}
  ): string {
    const routes = options.routes || ['create', 'read', 'update', 'delete', 'list'];

    return `import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import ${config.name}Controller from '../../controllers/${config.name}Controller.js';
import validate${config.name} from '../../validations/${config.name}Validation.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /${config.pluralName}
 * List all ${config.pluralName} with pagination
 */
${routes.includes('list') ? `router.get('/', ${config.name}Controller.list);` : ''}

/**
 * POST /${config.pluralName}
 * Create new ${config.name}
 */
${routes.includes('create') ? `router.post('/', validate${config.name}.create, ${config.name}Controller.create);` : ''}

/**
 * POST /${config.pluralName}/bulk
 * Bulk create ${config.pluralName}
 */
router.post('/bulk', ${config.name}Controller.bulkCreate);

/**
 * GET /${config.pluralName}/search
 * Search ${config.pluralName}
 */
${options.includeSearch ? `router.get('/search', ${config.name}Controller.search);` : ''}

/**
 * GET /${config.pluralName}/:id
 * Get ${config.name} by ID
 */
${routes.includes('read') ? `router.get('/:id', ${config.name}Controller.getById);` : ''}

/**
 * PATCH /${config.pluralName}/:id
 * Update ${config.name}
 */
${routes.includes('update') ? `router.patch('/:id', validate${config.name}.update, ${config.name}Controller.update);` : ''}

/**
 * DELETE /${config.pluralName}/:id
 * Delete ${config.name}
 */
${routes.includes('delete') ? `router.delete('/:id', ${config.name}Controller.delete);` : ''}

export default router;
`;
  }

  /**
   * Generate Joi validation schema
   */
  static generateJoiValidation(
    config: APIResourceConfig
  ): string {
    const createFields = this.generateJoiFields(config.fields);
    const updateFields = this.generateJoiFields(config.fields, true);

    return `import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const createSchema = Joi.object({
${createFields}
});

const updateSchema = Joi.object({
${updateFields}
}).min(1);

export const validate${config.name} = {
  create: (req: Request, res: Response, next: NextFunction) => {
    const { error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  },

  update: (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  },
};

export default validate${config.name};
`;
  }

  /**
   * Generate complete API (model + service + controller + routes)
   */
  static generateCompleteAPI(
    config: APIResourceConfig,
    options: APIGenerationOptions = {}
  ): { model: string; service: string; controller: string; routes: string; validation: string } {
    return {
      model: this.generateModel(config, options),
      service: this.generateService(config, options),
      controller: this.generateController(config, options),
      routes: this.generateRoutes(config, options),
      validation: this.generateJoiValidation(config),
    };
  }

  // ==================== HELPER METHODS ====================

  private static generateModelFields(fields: APIField[]): string {
    return fields
      .map(f => {
        let fieldDef = this.getMongooseType(f.type);

        if (f.required) fieldDef += ', required: true';
        if (f.unique) fieldDef += ', unique: true';
        if (f.indexed) fieldDef += ', index: true';
        if (f.default !== undefined) fieldDef += `, default: ${JSON.stringify(f.default)}`;

        return `  ${f.name}: { ${fieldDef} },`;
      })
      .join('\n');
  }

  private static generateIndexes(fields: APIField[]): string {
    const indexedFields = fields.filter(f => f.indexed);
    if (indexedFields.length === 0) return '';

    const indexes = indexedFields.map(f => `schema.index({ ${f.name}: 1 });`).join('\n');
    return indexes;
  }

  private static generateModelMethods(config: APIResourceConfig): string {
    let methods = `// Instance methods
schema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};`;

    if (config.softDelete) {
      methods += `

// Query helper to exclude soft-deleted
schema.query.active = function() {
  return this.where({ deletedAt: null });
};`;
    }

    return methods;
  }

  private static getMongooseType(type: string): string {
    const typeMap: Record<string, string> = {
      string: 'String',
      number: 'Number',
      boolean: 'Boolean',
      date: 'Date',
      email: 'String',
      enum: 'String',
      reference: 'Schema.Types.ObjectId',
    };
    return typeMap[type] || 'String';
  }

  private static getTSType(type: string): string {
    const typeMap: Record<string, string> = {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      date: 'Date',
      email: 'string',
      enum: 'string',
      reference: 'string',
    };
    return typeMap[type] || 'string';
  }

  private static generateJoiFields(fields: APIField[], isUpdate: boolean = false): string {
    return fields
      .filter(f => !isUpdate || !f.unique) // Skip unique fields in update
      .map(f => {
        let validation = '';

        switch (f.type) {
          case 'string':
          case 'email':
            validation = 'Joi.string()';
            if (f.minLength) validation += `.min(${f.minLength})`;
            if (f.maxLength) validation += `.max(${f.maxLength})`;
            if (f.type === 'email') validation = 'Joi.string().email()';
            break;
          case 'number':
            validation = 'Joi.number()';
            break;
          case 'boolean':
            validation = 'Joi.boolean()';
            break;
          case 'date':
            validation = 'Joi.date()';
            break;
          case 'enum':
            if (f.enum) {
              validation = `Joi.string().valid(${f.enum.map(e => `'${e}'`).join(', ')})`;
            }
            break;
          case 'reference':
            validation = 'Joi.string().pattern(/^[0-9a-fA-F]{24}$/)'; // MongoDB ObjectId
            break;
          default:
            validation = 'Joi.any()';
        }

        if (f.required && !isUpdate) {
          validation += '.required()';
        } else {
          validation += '.optional()';
        }

        return `  ${f.name}: ${validation},`;
      })
      .join('\n');
  }
}
