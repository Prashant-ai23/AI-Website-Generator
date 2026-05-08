import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { BackendAPIGenerator, APIResourceConfig, APIGenerationOptions } from '../services/backendAPIGenerator.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class APIGeneratorController {
  /**
   * Generate MongoDB model
   */
  async generateModel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config } = req.body;

      if (!config || !config.name || !config.pluralName || !config.fields) {
        throw new ApiError(400, 'Config must include name, pluralName, and fields');
      }

      const resourceConfig: APIResourceConfig = config;
      const generatedCode = BackendAPIGenerator.generateModel(resourceConfig);

      const response = new ApiResponse(
        200,
        {
          code: generatedCode,
          language: 'typescript',
          type: 'model',
          framework: 'mongoose',
        },
        'Model generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate service with CRUD operations
   */
  async generateService(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config, options } = req.body;

      if (!config || !config.name || !config.pluralName || !config.fields) {
        throw new ApiError(400, 'Config must include name, pluralName, and fields');
      }

      const resourceConfig: APIResourceConfig = config;
      const generationOptions: APIGenerationOptions = options || {
        includePagination: true,
        includeSearch: true,
        includeFiltering: true,
      };

      const generatedCode = BackendAPIGenerator.generateService(resourceConfig, generationOptions);

      const response = new ApiResponse(
        200,
        {
          code: generatedCode,
          language: 'typescript',
          type: 'service',
          framework: 'express',
          features: Object.keys(generationOptions).filter(k => generationOptions[k as keyof APIGenerationOptions]),
        },
        'Service generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate controller with route handlers
   */
  async generateController(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config, options } = req.body;

      if (!config || !config.name || !config.pluralName) {
        throw new ApiError(400, 'Config must include name and pluralName');
      }

      const resourceConfig: APIResourceConfig = config;
      const generationOptions: APIGenerationOptions = options || {
        includeSearch: true,
        routes: ['create', 'read', 'update', 'delete', 'list'],
      };

      const generatedCode = BackendAPIGenerator.generateController(resourceConfig, generationOptions);

      const response = new ApiResponse(
        200,
        {
          code: generatedCode,
          language: 'typescript',
          type: 'controller',
          framework: 'express',
        },
        'Controller generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate Express routes
   */
  async generateRoutes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config, options } = req.body;

      if (!config || !config.name || !config.pluralName) {
        throw new ApiError(400, 'Config must include name and pluralName');
      }

      const resourceConfig: APIResourceConfig = config;
      const generationOptions: APIGenerationOptions = options || {
        includeSearch: true,
        routes: ['create', 'read', 'update', 'delete', 'list'],
      };

      const generatedCode = BackendAPIGenerator.generateRoutes(resourceConfig, generationOptions);

      const response = new ApiResponse(
        200,
        {
          code: generatedCode,
          language: 'typescript',
          type: 'routes',
          framework: 'express',
          endpoints: generationOptions.routes?.length || 5,
        },
        'Routes generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate validation schema (Joi)
   */
  async generateValidation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config } = req.body;

      if (!config || !config.name || !config.fields) {
        throw new ApiError(400, 'Config must include name and fields');
      }

      const resourceConfig: APIResourceConfig = config;
      const generatedCode = BackendAPIGenerator.generateJoiValidation(resourceConfig);

      const response = new ApiResponse(
        200,
        {
          code: generatedCode,
          language: 'typescript',
          type: 'validation',
          library: 'joi',
          fields: resourceConfig.fields.length,
        },
        'Validation schema generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate complete API (model + service + controller + routes + validation)
   */
  async generateCompleteAPI(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config, options } = req.body;

      if (!config || !config.name || !config.pluralName || !config.fields) {
        throw new ApiError(400, 'Config must include name, pluralName, and fields');
      }

      const resourceConfig: APIResourceConfig = config;
      const generationOptions: APIGenerationOptions = options || {
        includePagination: true,
        includeSearch: true,
        includeFiltering: true,
        includeValidation: true,
        includeSorting: true,
        routes: ['create', 'read', 'update', 'delete', 'list'],
      };

      const generated = BackendAPIGenerator.generateCompleteAPI(resourceConfig, generationOptions);

      const response = new ApiResponse(
        200,
        {
          model: generated.model,
          service: generated.service,
          controller: generated.controller,
          routes: generated.routes,
          validation: generated.validation,
          language: 'typescript',
          framework: 'mongoose',
          features: Object.keys(generationOptions).filter(
            k => generationOptions[k as keyof APIGenerationOptions]
          ),
          files: 5,
        },
        'Complete API generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new APIGeneratorController();
