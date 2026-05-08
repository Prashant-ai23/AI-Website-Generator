import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/AuthRequest.js';
import AIGeneratorService from '../services/aiGeneratorService.js';
import GeneratedProject from '../models/GeneratedProject.js';
import { GeneratedFile } from '../models/GeneratedFile.js';
import { PromptHistory } from '../models/PromptHistory.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export class AIGeneratorController {
  /**
   * Analyze user prompt and extract requirements
   */
  async analyzePrompt(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const { prompt } = req.body;
      if (!prompt) throw new ApiError(400, 'Prompt is required');

      const requirements = await AIGeneratorService.analyzeRequirements(prompt, req.user.id);

      res.status(200).json(
        new ApiResponse(200, { requirements }, 'Requirements analyzed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate a new project
   */
  async generateProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const { name, slug, prompt, projectType = 'fullstack', techStack = {}, options = {} } =
        req.body;

      if (!name || !slug || !prompt) {
        throw new ApiError(400, 'name, slug, and prompt are required');
      }

      const config = {
        projectType,
        techStack: {
          frontend: techStack.frontend || 'React',
          backend: techStack.backend || 'Express.js',
          database: techStack.database || 'MongoDB',
          authentication: techStack.authentication || 'JWT',
        },
        includeTests: options.includeTests || false,
        includeDocumentation: options.includeDocumentation !== false,
        useDocker: options.useDocker !== false,
      };

      const project = await AIGeneratorService.createGenerationProject(
        name,
        slug,
        prompt,
        req.user.id,
        config
      );

      // Start generation in background
      AIGeneratorService.startFullGeneration(project._id.toString()).catch((err) =>
        console.error('Generation error:', err)
      );

      res.status(201).json(new ApiResponse(201, { project }, 'Generation started'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get project generation status
   */
  async getProjectStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const { projectId } = req.params;
      const project = await GeneratedProject.findById(projectId);

      if (!project) throw new ApiError(404, 'Project not found');
      if (project.userId.toString() !== req.user.id) {
        throw new ApiError(403, 'Access denied');
      }

      const files = await GeneratedFile.find({ projectId }).select('fileName fileType category');

      res.status(200).json(
        new ApiResponse(
          200,
          {
            project,
            files,
            progress: project.metadata?.progress || 0,
            status: project.status,
          },
          'Project status retrieved'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all user's generation projects
   */
  async getUserProjects(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      const query: any = { creator: req.user.id };
      if (status) query.status = status;

      const projects = await GeneratedProject.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const total = await GeneratedProject.countDocuments(query);

      res.status(200).json(
        new ApiResponse(
          200,
          {
            projects,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit),
            },
          },
          'Projects retrieved'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get generated files for a project
   */
  async getProjectFiles(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const { projectId } = req.params;
      const category = req.query.category as string;
      const fileType = req.query.fileType as string;

      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');
      if (project.userId.toString() !== req.user.id) {
        throw new ApiError(403, 'Access denied');
      }

      const query: any = { projectId };
      if (category) query.category = category;
      if (fileType) query.fileType = fileType;

      const files = await GeneratedFile.find(query).sort({ fileName: 1 });

      res.status(200).json(new ApiResponse(200, { files }, 'Files retrieved'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get specific generated file content
   */
  async getFileContent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const { fileId } = req.params;
      const file = await GeneratedFile.findById(fileId);

      if (!file) throw new ApiError(404, 'File not found');
      if (file.userId.toString() !== req.user.id) {
        throw new ApiError(403, 'Access denied');
      }

      res.status(200).json(new ApiResponse(200, { file }, 'File content retrieved'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get prompt history
   */
  async getPromptHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const history = await PromptHistory.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);

      const total = await PromptHistory.countDocuments({ userId: req.user.id });

      res.status(200).json(
        new ApiResponse(
          200,
          {
            history,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit),
            },
          },
          'Prompt history retrieved'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download generated project
   */
  async downloadProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const { projectId } = req.params;
      const project = await GeneratedProject.findById(projectId);

      if (!project) throw new ApiError(404, 'Project not found');
      if (project.userId.toString() !== req.user.id) {
        throw new ApiError(403, 'Access denied');
      }

      const files = await GeneratedFile.find({ projectId });

      // TODO: Create ZIP file and return
      res.status(200).json(
        new ApiResponse(
          200,
          { projectId, filesCount: files.length, downloadUrl: `/api/v1/ai/generate/download/${projectId}` },
          'Download ready'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update generated file
   */
  async updateFile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const { fileId } = req.params;
      const { content } = req.body;

      const file = await GeneratedFile.findById(fileId);
      if (!file) throw new ApiError(404, 'File not found');
      if (file.userId.toString() !== req.user.id) {
        throw new ApiError(403, 'Access denied');
      }

      file.content = content;
      file.status = 'modified';
      file.lineCount = content.split('\n').length;
      file.size = content.length;
      await file.save();

      res.status(200).json(new ApiResponse(200, { file }, 'File updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete project
   */
  async deleteProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const { projectId } = req.params;
      const project = await GeneratedProject.findById(projectId);

      if (!project) throw new ApiError(404, 'Project not found');
      if (project.userId.toString() !== req.user.id) {
        throw new ApiError(403, 'Access denied');
      }

      await GeneratedProject.deleteOne({ _id: projectId });
      await GeneratedFile.deleteMany({ projectId });

      res.status(200).json(new ApiResponse(200, {}, 'Project deleted'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Clone project
   */
  async cloneProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const { projectId } = req.params;
      const { name, slug } = req.body;

      const sourceProject = await GeneratedProject.findById(projectId);
      if (!sourceProject) throw new ApiError(404, 'Source project not found');

      // Create new project with correct schema fields
      const newProject = new GeneratedProject({
        userId: req.user.id,
        projectName: name,
        projectPath: `/generated/${slug}`,
        description: sourceProject.description,
        metadata: sourceProject.metadata || {},
        status: 'success',
        files: [],
        folders: [],
        totalFiles: 0,
        totalSize: 0,
      });

      await newProject.save();

      // Clone files
      const sourceFiles = await GeneratedFile.find({ projectId });
      for (const file of sourceFiles) {
        await GeneratedFile.create({
          ...file.toObject(),
          _id: undefined,
          projectId: newProject._id,
          userId: req.user.id,
        });
      }

      res.status(201).json(new ApiResponse(201, { project: newProject }, 'Project cloned'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save favorite prompt
   */
  async savePromptAsFavorite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new ApiError(401, 'Not authenticated');

      const { prompt } = req.body;
      if (!prompt) throw new ApiError(400, 'Prompt is required');

      const promptRecord = new PromptHistory({
        userId: req.user.id,
        prompt,
        promptType: 'generation',
        toolUsed: 'generateDocumentation',
        parameters: {},
        result: { success: true },
        tags: ['favorite'],
        isFavorite: true,
        executed: true,
        executedAt: new Date(),
      });

      await promptRecord.save();

      res.status(201).json(new ApiResponse(201, { prompt: promptRecord }, 'Prompt saved'));
    } catch (error) {
      next(error);
    }
  }
}

export default new AIGeneratorController();
