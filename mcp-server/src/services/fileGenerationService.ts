import { promises as fs } from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

interface FileGenerationOptions {
  fileName: string;
  content: string;
  outputDir?: string;
  overwrite?: boolean;
}

interface FileGenerationResult {
  filePath: string;
  fileName: string;
  size: number;
  success: boolean;
  message: string;
}

/**
 * File Generation Service
 * Handles writing generated code to disk
 */
class FileGenerationService {
  private defaultOutputDir: string;

  constructor(defaultOutputDir: string = './generated') {
    this.defaultOutputDir = defaultOutputDir;
  }

  /**
   * Generate and write a file to disk
   */
  async generateFile(options: FileGenerationOptions): Promise<FileGenerationResult> {
    const { fileName, content, outputDir = this.defaultOutputDir, overwrite = false } = options;

    try {
      logger.info('Starting file generation', { fileName });

      // Ensure output directory exists
      await this.ensureDirectoryExists(outputDir);

      const filePath = path.join(outputDir, fileName);

      // Check if file exists
      try {
        await fs.access(filePath);
        if (!overwrite) {
          logger.warn('File already exists', { filePath });
          return {
            filePath,
            fileName,
            size: content.length,
            success: false,
            message: `File already exists: ${fileName}. Use overwrite: true to replace.`,
          };
        }
      } catch {
        // File doesn't exist, which is fine
      }

      // Write file
      await fs.writeFile(filePath, content, 'utf-8');

      logger.info('File generated successfully', { filePath, size: content.length });

      return {
        filePath,
        fileName,
        size: content.length,
        success: true,
        message: `File generated successfully: ${filePath}`,
      };
    } catch (error) {
      logger.error('File generation failed', { fileName, error });
      throw error;
    }
  }

  /**
   * Generate multiple files at once
   */
  async generateFiles(
    files: FileGenerationOptions[],
    outputDir: string = this.defaultOutputDir
  ): Promise<FileGenerationResult[]> {
    logger.info('Generating multiple files', { count: files.length });

    const results: FileGenerationResult[] = [];

    for (const file of files) {
      try {
        const result = await this.generateFile({
          ...file,
          outputDir,
        });
        results.push(result);
      } catch (error) {
        logger.error('Failed to generate file', { fileName: file.fileName, error });
      }
    }

    logger.info('Batch file generation completed', { successful: results.filter(r => r.success).length, total: results.length });

    return results;
  }

  /**
   * Read a generated file
   */
  async readFile(filePath: string): Promise<string> {
    try {
      logger.info('Reading file', { filePath });
      const content = await fs.readFile(filePath, 'utf-8');
      logger.info('File read successfully', { filePath });
      return content;
    } catch (error) {
      logger.error('Failed to read file', { filePath, error });
      throw error;
    }
  }

  /**
   * Delete a generated file
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      logger.info('Deleting file', { filePath });
      await fs.unlink(filePath);
      logger.info('File deleted successfully', { filePath });
    } catch (error) {
      logger.error('Failed to delete file', { filePath, error });
      throw error;
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(dirPath: string): Promise<string[]> {
    try {
      logger.info('Listing files', { dirPath });
      const files = await fs.readdir(dirPath);
      logger.info('Files listed successfully', { dirPath, count: files.length });
      return files;
    } catch (error) {
      logger.error('Failed to list files', { dirPath, error });
      throw error;
    }
  }

  /**
   * Ensure directory exists, create if not
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      logger.info('Creating directory', { dirPath });
      await fs.mkdir(dirPath, { recursive: true });
      logger.info('Directory created successfully', { dirPath });
    }
  }

  /**
   * Set default output directory
   */
  setDefaultOutputDir(dirPath: string): void {
    this.defaultOutputDir = dirPath;
    logger.info('Default output directory updated', { dirPath });
  }

  /**
   * Get default output directory
   */
  getDefaultOutputDir(): string {
    return this.defaultOutputDir;
  }
}

// Export singleton instance
export const fileGenerationService = new FileGenerationService();

export default FileGenerationService;
