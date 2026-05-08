import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import {
  ReactCodeGenerator,
  PageConfig,
  FormConfig,
  TableConfig,
  LayoutConfig,
  RoutingConfig,
} from '../services/reactCodeGenerator.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class CodeGeneratorController {
  /**
   * Generate a React page component
   */
  async generatePage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config } = req.body;

      if (!config || !config.name || !config.title) {
        throw new ApiError(400, 'Page config must include name and title');
      }

      const defaultConfig: Partial<PageConfig> = {
        styling: config.styling || 'tailwind',
      };

      const pageConfig: PageConfig = { ...defaultConfig, ...config } as PageConfig;
      const generatedCode = ReactCodeGenerator.generatePage(pageConfig);

      const response = new ApiResponse(
        200,
        {
          code: generatedCode,
          language: 'typescript',
          framework: 'react',
          styling: pageConfig.styling,
        },
        'Page generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate a React form component
   */
  async generateForm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config } = req.body;

      if (!config || !config.name || !config.fields || config.fields.length === 0) {
        throw new ApiError(400, 'Form config must include name and fields array');
      }

      const defaultConfig: Partial<FormConfig> = {
        styling: config.styling || 'tailwind',
        submitButton: config.submitButton !== false,
      };

      const formConfig: FormConfig = { ...defaultConfig, ...config } as FormConfig;
      const generatedCode = ReactCodeGenerator.generateForm(formConfig);

      const response = new ApiResponse(
        200,
        {
          code: generatedCode,
          language: 'typescript',
          framework: 'react',
          styling: formConfig.styling,
          fieldCount: formConfig.fields.length,
        },
        'Form generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate a React table component
   */
  async generateTable(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config } = req.body;

      if (!config || !config.name || !config.columns || config.columns.length === 0) {
        throw new ApiError(400, 'Table config must include name and columns array');
      }

      const defaultConfig: Partial<TableConfig> = {
        styling: config.styling || 'tailwind',
        sortable: config.sortable !== false,
        pagination: config.pagination !== false,
      };

      const tableConfig: TableConfig = { ...defaultConfig, ...config } as TableConfig;
      const generatedCode = ReactCodeGenerator.generateTable(tableConfig);

      const response = new ApiResponse(
        200,
        {
          code: generatedCode,
          language: 'typescript',
          framework: 'react',
          styling: tableConfig.styling,
          columnCount: tableConfig.columns.length,
        },
        'Table generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate a layout component
   */
  async generateLayout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config } = req.body;

      if (!config || !config.name || !config.type) {
        throw new ApiError(400, 'Layout config must include name and type');
      }

      const validTypes = ['header-footer', 'sidebar', 'two-column', 'three-column'];
      if (!validTypes.includes(config.type)) {
        throw new ApiError(400, `Invalid layout type. Must be one of: ${validTypes.join(', ')}`);
      }

      const defaultConfig: Partial<LayoutConfig> = {
        styling: config.styling || 'tailwind',
        hasNavigation: config.hasNavigation !== false,
      };

      const layoutConfig: LayoutConfig = { ...defaultConfig, ...config } as LayoutConfig;
      const generatedCode = ReactCodeGenerator.generateLayout(layoutConfig);

      const response = new ApiResponse(
        200,
        {
          code: generatedCode,
          language: 'typescript',
          framework: 'react',
          styling: layoutConfig.styling,
          layoutType: layoutConfig.type,
        },
        'Layout generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate React Router configuration
   */
  async generateRouting(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { config } = req.body;

      if (!config || !config.routes || config.routes.length === 0) {
        throw new ApiError(400, 'Routing config must include routes array');
      }

      const defaultConfig: Partial<RoutingConfig> = {
        styling: config.styling || 'tailwind',
        defaultLayout: config.defaultLayout || 'header-footer',
      };

      const routingConfig: RoutingConfig = { ...defaultConfig, ...config } as RoutingConfig;
      const generatedCode = ReactCodeGenerator.generateRouting(routingConfig);

      const response = new ApiResponse(
        200,
        {
          code: generatedCode,
          language: 'typescript',
          framework: 'react',
          routeCount: routingConfig.routes.length,
          protectedRoutes: routingConfig.protectedRoutes?.length || 0,
        },
        'Routing configuration generated successfully'
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new CodeGeneratorController();
