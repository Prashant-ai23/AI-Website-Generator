import { Request, Response } from 'express';
import FileGenerationEngine from '../services/fileGenerationEngine.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import path from 'path';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

class FileGenerationController {
  /**
   * Generate files from code snippets
   */
  static async generateFiles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { files, projectName, basePath = './generated-projects' } = req.body;

      if (!files || !Array.isArray(files)) {
        throw new ApiError(400, 'files array is required');
      }

      if (!projectName) {
        throw new ApiError(400, 'projectName is required');
      }

      const projectPath = path.join(basePath, projectName);
      const results = FileGenerationEngine.generateFiles(
        projectPath,
        files.map((f: any) => ({
          path: f.path || f.fileName,
          content: f.content,
        })),
        true
      );

      res.status(201).json(
        new ApiResponse(
          201,
          {
            projectPath,
            projectName,
            filesGenerated: results.length,
            files: results,
            totalSize: results.reduce((sum: number, f: any) => sum + f.size, 0),
          },
          'Files generated successfully'
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate files'));
      }
    }
  }

  /**
   * Generate complete project
   */
  static async generateProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectName, structure, basePath = './generated-projects' } = req.body;

      if (!projectName) {
        throw new ApiError(400, 'projectName is required');
      }

      if (!structure) {
        throw new ApiError(400, 'structure is required');
      }

      const result = FileGenerationEngine.generateProject(projectName, basePath, structure);

      res.status(201).json(
        new ApiResponse(
          201,
          {
            projectName: result.projectName,
            projectPath: result.projectPath,
            status: result.status,
            totalFiles: result.totalFiles,
            totalSize: result.totalSize,
            totalFolders: result.folders.length,
            files: result.files,
            errors: result.errors,
            timestamp: result.timestamp,
          },
          `Project generated with status: ${result.status}`
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate project'));
      }
    }
  }

  /**
   * Create folder structure
   */
  static async createFolders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { basePath, folders } = req.body;

      if (!basePath) {
        throw new ApiError(400, 'basePath is required');
      }

      if (!folders || !Array.isArray(folders)) {
        throw new ApiError(400, 'folders array is required');
      }

      const createdFolders = FileGenerationEngine.createFolderStructure(basePath, folders);

      res.status(201).json(
        new ApiResponse(
          201,
          {
            basePath,
            foldersCreated: createdFolders.length,
            folders: createdFolders,
          },
          'Folders created successfully'
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to create folders'));
      }
    }
  }

  /**
   * Create single file
   */
  static async createFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { filePath, content, overwrite = true } = req.body;

      if (!filePath) {
        throw new ApiError(400, 'filePath is required');
      }

      if (!content) {
        throw new ApiError(400, 'content is required');
      }

      const info = FileGenerationEngine.generateFile(filePath, content, overwrite);

      res.status(201).json(
        new ApiResponse(201, info, 'File created successfully')
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to create file'));
      }
    }
  }

  /**
   * Update existing file
   */
  static async updateFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { filePath, content } = req.body;

      if (!filePath) {
        throw new ApiError(400, 'filePath is required');
      }

      if (!content) {
        throw new ApiError(400, 'content is required');
      }

      const info = FileGenerationEngine.updateFile(filePath, content);

      res.status(200).json(
        new ApiResponse(200, info, 'File updated successfully')
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to update file'));
      }
    }
  }

  /**
   * Upsert file (create or update)
   */
  static async upsertFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { filePath, content } = req.body;

      if (!filePath) {
        throw new ApiError(400, 'filePath is required');
      }

      if (!content) {
        throw new ApiError(400, 'content is required');
      }

      const info = FileGenerationEngine.upsertFile(filePath, content);

      res.status(info.created ? 201 : 200).json(
        new ApiResponse(info.created ? 201 : 200, info, info.created ? 'File created' : 'File updated')
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to upsert file'));
      }
    }
  }

  /**
   * Create package.json
   */
  static async createPackageJson(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectPath, projectName, packageData = {} } = req.body;

      if (!projectPath) {
        throw new ApiError(400, 'projectPath is required');
      }

      if (!projectName) {
        throw new ApiError(400, 'projectName is required');
      }

      const info = FileGenerationEngine.createPackageJson(projectPath, projectName, packageData);

      res.status(201).json(
        new ApiResponse(201, info, 'package.json created successfully')
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to create package.json'));
      }
    }
  }

  /**
   * Create tsconfig.json
   */
  static async createTsConfig(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectPath, tsConfigData = {} } = req.body;

      if (!projectPath) {
        throw new ApiError(400, 'projectPath is required');
      }

      const info = FileGenerationEngine.createTsConfig(projectPath, tsConfigData);

      res.status(201).json(
        new ApiResponse(201, info, 'tsconfig.json created successfully')
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to create tsconfig.json'));
      }
    }
  }

  /**
   * Get project summary
   */
  static async getProjectSummary(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectPath } = req.body;

      if (!projectPath) {
        throw new ApiError(400, 'projectPath is required');
      }

      const summary = FileGenerationEngine.getProjectSummary(projectPath);

      res.status(200).json(
        new ApiResponse(200, summary, 'Project summary retrieved successfully')
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to get project summary'));
      }
    }
  }

  /**
   * Delete file
   */
  static async deleteFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { filePath } = req.body;

      if (!filePath) {
        throw new ApiError(400, 'filePath is required');
      }

      const deleted = FileGenerationEngine.deleteFile(filePath);

      if (deleted) {
        res.status(200).json(new ApiResponse(200, { filePath, deleted: true }, 'File deleted successfully'));
      } else {
        res.status(404).json(new ApiResponse(404, null, 'File not found'));
      }
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to delete file'));
      }
    }
  }

  /**
   * Delete folder
   */
  static async deleteFolder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { folderPath } = req.body;

      if (!folderPath) {
        throw new ApiError(400, 'folderPath is required');
      }

      const deleted = FileGenerationEngine.deleteFolder(folderPath);

      if (deleted) {
        res.status(200).json(new ApiResponse(200, { folderPath, deleted: true }, 'Folder deleted successfully'));
      } else {
        res.status(404).json(new ApiResponse(404, null, 'Folder not found'));
      }
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to delete folder'));
      }
    }
  }
}

export default FileGenerationController;
