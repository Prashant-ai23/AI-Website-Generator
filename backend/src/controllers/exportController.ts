import { Request, Response, NextFunction } from 'express';
import { exportService } from '../services/exportService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ExportController {
  /**
   * Export project as ZIP
   */
  async exportProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { projectName, includeFrontend = true, includeBackend = true } =
        req.query;

      // Validate input
      if (!projectName || typeof projectName !== 'string') {
        return next(
          new Error('Project name is required and must be a string')
        );
      }

      // Generate export stream
      const zipStream = await exportService.createExportZip({
        projectName,
        includeFrontend: includeFrontend === 'true',
        includeBackend: includeBackend === 'true',
        includeDocumentation: true,
      });

      // Set response headers for file download
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${projectName}-export-${timestamp}.zip`;

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // Pipe the zip stream to response
      zipStream.pipe(res);

      // Handle stream errors
      zipStream.on('error', (error) => {
        console.error('Export stream error:', error);
        if (!res.headersSent) {
          res.status(500).json(
            new ApiResponse(500, null, 'Failed to export project')
          );
        }
      });

      res.on('error', (error) => {
        console.error('Response stream error:', error);
        zipStream.destroy();
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get export options/info
   */
  async getExportInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const exportInfo = {
        availableFormats: ['zip'],
        options: [
          {
            key: 'projectName',
            label: 'Project Name',
            type: 'string',
            required: true,
            description: 'Name of the exported project',
          },
          {
            key: 'includeFrontend',
            label: 'Include Frontend',
            type: 'boolean',
            default: true,
            description: 'Include frontend source code',
          },
          {
            key: 'includeBackend',
            label: 'Include Backend',
            type: 'boolean',
            default: true,
            description: 'Include backend source code',
          },
        ],
        documentation: 'Export your project as a ZIP file with source code and documentation',
      };

      res.status(200).json(
        new ApiResponse(200, exportInfo, 'Export information retrieved')
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ExportController();
