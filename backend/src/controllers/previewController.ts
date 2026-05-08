/**
 * Preview Controller
 * Handles live preview requests and generates HTML
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import LivePreviewService from '../services/livePreviewService.js';
import { PreviewProject } from '../types/preview.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

class PreviewController {
  /**
   * Generate live preview
   */
  static async generatePreview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectName, files, entryPoint, autoRefresh = false } = req.body;

      if (!projectName) {
        throw new ApiError(400, 'Project name is required');
      }

      if (!files || !Array.isArray(files) || files.length === 0) {
        throw new ApiError(400, 'Files array is required and must not be empty');
      }

      if (!entryPoint) {
        throw new ApiError(400, 'Entry point file is required');
      }

      // Validate files
      const validationErrors = LivePreviewService.validateFiles(files);
      if (validationErrors.length > 0) {
        throw new ApiError(422, `File validation failed: ${validationErrors[0].message}`);
      }

      // Generate preview
      const project: PreviewProject = {
        projectId: `preview-${Date.now()}`,
        projectName,
        files,
        entryPoint,
      };

      const { html, errors, warnings } = LivePreviewService.generatePreview(project);

      res.status(200).json(
        new ApiResponse(
          200,
          {
            html,
            errors,
            warnings,
            projectId: project.projectId,
            timestamp: new Date().toISOString(),
          },
          'Preview generated successfully'
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate preview'));
      }
    }
  }

  /**
   * Stream live preview updates
   */
  static async streamPreview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectName, files, entryPoint } = req.body;

      if (!projectName || !files || !entryPoint) {
        throw new ApiError(400, 'Missing required fields: projectName, files, entryPoint');
      }

      // Set response headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      const project: PreviewProject = {
        projectId: `preview-${Date.now()}`,
        projectName,
        files,
        entryPoint,
      };

      // Send initial preview
      const { html, errors, warnings } = LivePreviewService.generatePreview(project);

      const initialData = {
        type: 'preview',
        html,
        errors,
        warnings,
        timestamp: new Date().toISOString(),
      };

      res.write(`data: ${JSON.stringify(initialData)}\n\n`);

      // Keep connection alive with heartbeat
      const interval = setInterval(() => {
        res.write(`:heartbeat\n\n`);
      }, 30000);

      req.on('close', () => {
        clearInterval(interval);
        res.end();
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to stream preview'));
      }
    }
  }

  /**
   * Get preview for a file/component
   */
  static async previewComponent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { filename, content, language = 'javascript' } = req.body;

      if (!filename || !content) {
        throw new ApiError(400, 'Filename and content are required');
      }

      const project: PreviewProject = {
        projectId: `component-${Date.now()}`,
        projectName: filename,
        files: [
          {
            filename,
            content,
            language,
            type: 'component',
          },
        ],
        entryPoint: filename,
      };

      const { html, errors, warnings } = LivePreviewService.generatePreview(project);

      res.status(200).json(
        new ApiResponse(
          200,
          {
            html,
            errors,
            warnings,
            timestamp: new Date().toISOString(),
          },
          'Component preview generated'
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to generate component preview'));
      }
    }
  }

  /**
   * Validate preview
   */
  static async validatePreview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { files } = req.body;

      if (!files || !Array.isArray(files)) {
        throw new ApiError(400, 'Files array is required');
      }

      const errors = LivePreviewService.validateFiles(files);

      res.status(200).json(
        new ApiResponse(
          200,
          {
            isValid: errors.length === 0,
            errors,
            fileCount: files.length,
          },
          'Validation complete'
        )
      );
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to validate preview'));
      }
    }
  }
}

export default PreviewController;
