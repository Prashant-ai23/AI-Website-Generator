import { Request, Response } from 'express';
import DocumentationGenerator from '../services/documentationGenerator.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

interface DocGeneratorRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

class DocumentationGeneratorController {
  /**
   * Generate README.md
   */
  static async generateREADME(req: DocGeneratorRequest, res: Response): Promise<void> {
    try {
      const { projectName, projectDescription, projectVersion, authorName, authorEmail, repoUrl } = req.body;

      if (!projectName) {
        throw new ApiError(400, 'projectName is required');
      }

      const readme = DocumentationGenerator.generateREADME({
        projectName,
        projectDescription,
        projectVersion,
        authorName,
        authorEmail,
        repoUrl,
      });

      res.status(200).json(
        new ApiResponse(200, { readme, fileName: 'README.md', size: readme.length }, 'README generated successfully')
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate README'));
      }
    }
  }

  /**
   * Generate API Documentation
   */
  static async generateAPIDocumentation(req: DocGeneratorRequest, res: Response): Promise<void> {
    try {
      const { projectName, projectDescription } = req.body;

      const apiDocs = DocumentationGenerator.generateAPIDocumentation({
        projectName,
        projectDescription,
      });

      res.status(200).json(
        new ApiResponse(
          200,
          { apiDocs, fileName: 'API_DOCUMENTATION.md', size: apiDocs.length },
          'API documentation generated successfully'
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate API documentation'));
      }
    }
  }

  /**
   * Generate Installation Guide
   */
  static async generateInstallationGuide(req: DocGeneratorRequest, res: Response): Promise<void> {
    try {
      const { projectName, repoUrl, authorEmail, docsUrl } = req.body;

      const installationGuide = DocumentationGenerator.generateInstallationGuide({
        projectName,
        repoUrl,
        authorEmail,
        docsUrl,
      });

      res.status(200).json(
        new ApiResponse(
          200,
          { installationGuide, fileName: 'INSTALLATION.md', size: installationGuide.length },
          'Installation guide generated successfully'
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate installation guide'));
      }
    }
  }

  /**
   * Generate Architecture Documentation
   */
  static async generateArchitectureDocumentation(req: DocGeneratorRequest, res: Response): Promise<void> {
    try {
      const { projectName } = req.body;

      const architecture = DocumentationGenerator.generateArchitectureDocumentation({
        projectName,
      });

      res.status(200).json(
        new ApiResponse(
          200,
          { architecture, fileName: 'ARCHITECTURE.md', size: architecture.length },
          'Architecture documentation generated successfully'
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate architecture documentation'));
      }
    }
  }

  /**
   * Generate Module-wise Documentation
   */
  static async generateModuleDocumentation(req: DocGeneratorRequest, res: Response): Promise<void> {
    try {
      const { modules = [] } = req.body;

      if (!Array.isArray(modules)) {
        throw new ApiError(400, 'modules must be an array');
      }

      const moduleDocs = DocumentationGenerator.generateModuleDocumentation(modules);

      res.status(200).json(
        new ApiResponse(
          200,
          { modules: moduleDocs, fileCount: Object.keys(moduleDocs).length, totalSize: JSON.stringify(moduleDocs).length },
          'Module documentation generated successfully'
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate module documentation'));
      }
    }
  }

  /**
   * Generate Complete Documentation Package
   */
  static async generateCompleteDocumentation(req: DocGeneratorRequest, res: Response): Promise<void> {
    try {
      const {
        projectName = 'AI Website Generator',
        projectDescription = 'An AI-powered website generation platform',
        projectVersion = '1.0.0',
        authorName = 'Development Team',
        authorEmail = 'team@example.com',
        repoUrl = 'https://github.com/example/repo',
        docsUrl = 'https://docs.example.com',
        modules = [],
        includeModules = true,
      } = req.body;

      const config = {
        projectName,
        projectDescription,
        projectVersion,
        authorName,
        authorEmail,
        repoUrl,
        docsUrl,
        includeModules,
      };

      // Generate all documentation
      const readme = DocumentationGenerator.generateREADME(config);
      const apiDocs = DocumentationGenerator.generateAPIDocumentation(config);
      const installationGuide = DocumentationGenerator.generateInstallationGuide(config);
      const architecture = DocumentationGenerator.generateArchitectureDocumentation(config);
      const moduleDocs = includeModules ? DocumentationGenerator.generateModuleDocumentation(modules) : {};

      // Calculate total size
      const totalSize =
        readme.length +
        apiDocs.length +
        installationGuide.length +
        architecture.length +
        JSON.stringify(moduleDocs).length;

      const responseData = {
        readme: { fileName: 'README.md', size: readme.length },
        apiDocs: { fileName: 'API_DOCUMENTATION.md', size: apiDocs.length },
        installationGuide: { fileName: 'INSTALLATION.md', size: installationGuide.length },
        architecture: { fileName: 'ARCHITECTURE.md', size: architecture.length },
        modules: {
          files: Object.keys(moduleDocs).map((name) => ({
            moduleName: name,
            fileName: `${name.toUpperCase()}_MODULE.md`,
            size: moduleDocs[name].length,
          })),
          count: Object.keys(moduleDocs).length,
        },
        summary: {
          totalFiles: 4 + Object.keys(moduleDocs).length,
          totalSize,
          timestamp: new Date().toISOString(),
        },
      };

      // Include full documentation in data for download
      const fullData = {
        ...responseData,
        readme,
        apiDocs,
        installationGuide,
        architecture,
        modules: moduleDocs,
      };

      res.status(200).json(
        new ApiResponse(200, fullData, 'Complete documentation generated successfully')
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate complete documentation'));
      }
    }
  }

  /**
   * Generate documentation for specific resources
   */
  static async generateCustomDocumentation(req: DocGeneratorRequest, res: Response): Promise<void> {
    try {
      const { docType = 'complete', ...config } = req.body;

      if (!['readme', 'api', 'install', 'architecture', 'modules', 'complete'].includes(docType)) {
        throw new ApiError(400, 'Invalid docType. Must be one of: readme, api, install, architecture, modules, complete');
      }

      let documentation: any = {};

      switch (docType) {
        case 'readme':
          documentation.readme = DocumentationGenerator.generateREADME(config);
          break;
        case 'api':
          documentation.apiDocs = DocumentationGenerator.generateAPIDocumentation(config);
          break;
        case 'install':
          documentation.installationGuide = DocumentationGenerator.generateInstallationGuide(config);
          break;
        case 'architecture':
          documentation.architecture = DocumentationGenerator.generateArchitectureDocumentation(config);
          break;
        case 'modules':
          documentation.modules = DocumentationGenerator.generateModuleDocumentation(config.modules || []);
          break;
        case 'complete':
          documentation = DocumentationGenerator.generateCompleteDocumentation(config);
          break;
      }

      res.status(200).json(
        new ApiResponse(
          200,
          { ...documentation, docType, generatedAt: new Date().toISOString() },
          'Documentation generated successfully'
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate documentation'));
      }
    }
  }
}

export default DocumentationGeneratorController;
