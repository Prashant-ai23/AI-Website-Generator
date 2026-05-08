/**
 * File Generation Engine Service
 * Creates folders, generates files dynamically, updates existing files, maintains project structure
 */

import * as fs from 'fs';
import * as path from 'path';

interface FileSpec {
  fileName: string;
  content: string;
  fileType?: string;
}

interface FolderSpec {
  folderName: string;
  subFolders?: string[];
}

interface ProjectStructure {
  rootFolder: string;
  folders: FolderSpec[];
  files: FileSpec[];
}

interface GeneratedFileInfo {
  filePath: string;
  fileName: string;
  size: number;
  created: boolean;
  updated: boolean;
  timestamp: string;
}

interface ProjectGenerationResult {
  projectPath: string;
  projectName: string;
  files: GeneratedFileInfo[];
  folders: string[];
  totalFiles: number;
  totalSize: number;
  timestamp: string;
  status: 'success' | 'partial' | 'failed';
  errors: string[];
}

export class FileGenerationEngine {
  /**
   * Create folder structure recursively
   */
  static createFolderStructure(basePath: string, folders: FolderSpec[]): string[] {
    const createdFolders: string[] = [];

    try {
      // Ensure base path exists
      if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
        createdFolders.push(basePath);
      }

      // Create all specified folders
      folders.forEach((folderSpec) => {
        const folderPath = path.join(basePath, folderSpec.folderName);

        // Create main folder
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
          createdFolders.push(folderPath);
        }

        // Create subfolders if specified
        if (folderSpec.subFolders && Array.isArray(folderSpec.subFolders)) {
          folderSpec.subFolders.forEach((subFolder) => {
            const subFolderPath = path.join(folderPath, subFolder);
            if (!fs.existsSync(subFolderPath)) {
              fs.mkdirSync(subFolderPath, { recursive: true });
              createdFolders.push(subFolderPath);
            }
          });
        }
      });

      return createdFolders;
    } catch (error) {
      console.error('Error creating folder structure:', error);
      return createdFolders;
    }
  }

  /**
   * Generate file with content
   */
  static generateFile(filePath: string, content: string, overwrite: boolean = true): GeneratedFileInfo {
    try {
      // Create parent directories if they don't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Check if file exists
      const fileExists = fs.existsSync(filePath);

      // Don't overwrite unless specified
      if (fileExists && !overwrite) {
        return {
          filePath,
          fileName: path.basename(filePath),
          size: fs.statSync(filePath).size,
          created: false,
          updated: false,
          timestamp: new Date().toISOString(),
        };
      }

      // Write file
      fs.writeFileSync(filePath, content, 'utf-8');

      const fileSize = Buffer.byteLength(content, 'utf-8');

      return {
        filePath,
        fileName: path.basename(filePath),
        size: fileSize,
        created: !fileExists,
        updated: fileExists,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error generating file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Generate multiple files
   */
  static generateFiles(
    basePath: string,
    files: Array<{ path: string; content: string }>,
    overwrite: boolean = true
  ): GeneratedFileInfo[] {
    const results: GeneratedFileInfo[] = [];

    files.forEach((file) => {
      try {
        const fullPath = path.join(basePath, file.path);
        const info = this.generateFile(fullPath, file.content, overwrite);
        results.push(info);
      } catch (error) {
        console.error(`Failed to generate file ${file.path}:`, error);
      }
    });

    return results;
  }

  /**
   * Update existing file
   */
  static updateFile(filePath: string, content: string): GeneratedFileInfo {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
      }

      fs.writeFileSync(filePath, content, 'utf-8');

      const fileSize = Buffer.byteLength(content, 'utf-8');

      return {
        filePath,
        fileName: path.basename(filePath),
        size: fileSize,
        created: false,
        updated: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error updating file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Update or create file (upsert)
   */
  static upsertFile(filePath: string, content: string): GeneratedFileInfo {
    try {
      // Create parent directories if they don't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const fileExists = fs.existsSync(filePath);
      fs.writeFileSync(filePath, content, 'utf-8');

      const fileSize = Buffer.byteLength(content, 'utf-8');

      return {
        filePath,
        fileName: path.basename(filePath),
        size: fileSize,
        created: !fileExists,
        updated: fileExists,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error upserting file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Append content to file
   */
  static appendToFile(filePath: string, content: string): GeneratedFileInfo {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File does not exist: ${filePath}`);
      }

      const existingContent = fs.readFileSync(filePath, 'utf-8');
      const newContent = existingContent + '\n' + content;
      fs.writeFileSync(filePath, newContent, 'utf-8');

      const fileSize = Buffer.byteLength(newContent, 'utf-8');

      return {
        filePath,
        fileName: path.basename(filePath),
        size: fileSize,
        created: false,
        updated: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error appending to file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  static deleteFile(filePath: string): boolean {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      return false;
    }
  }

  /**
   * Delete folder recursively
   */
  static deleteFolder(folderPath: string): boolean {
    try {
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting folder ${folderPath}:`, error);
      return false;
    }
  }

  /**
   * Generate complete project structure
   */
  static generateProject(
    projectName: string,
    basePath: string,
    structure: ProjectStructure
  ): ProjectGenerationResult {
    const startTime = Date.now();
    const errors: string[] = [];
    const generatedFiles: GeneratedFileInfo[] = [];
    let totalSize = 0;

    try {
      // Create project directory
      const projectPath = path.join(basePath, projectName);
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
      }

      // Create folder structure
      const createdFolders = this.createFolderStructure(
        projectPath,
        structure.folders || []
      );

      // Generate files
      if (structure.files && Array.isArray(structure.files)) {
        structure.files.forEach((fileSpec) => {
          try {
            const filePath = path.join(projectPath, fileSpec.fileName);
            const info = this.generateFile(filePath, fileSpec.content, true);
            generatedFiles.push(info);
            totalSize += info.size;
          } catch (error) {
            const errorMsg = `Failed to generate ${fileSpec.fileName}: ${error}`;
            errors.push(errorMsg);
          }
        });
      }

      const duration = Date.now() - startTime;

      return {
        projectPath,
        projectName,
        files: generatedFiles,
        folders: createdFolders,
        totalFiles: generatedFiles.length,
        totalSize,
        timestamp: new Date().toISOString(),
        status: errors.length === 0 ? 'success' : errors.length < generatedFiles.length ? 'partial' : 'failed',
        errors,
      };
    } catch (error) {
      return {
        projectPath: path.join(basePath, projectName),
        projectName,
        files: generatedFiles,
        folders: [],
        totalFiles: generatedFiles.length,
        totalSize,
        timestamp: new Date().toISOString(),
        status: 'failed',
        errors: [
          ...errors,
          `Project generation failed: ${error}`,
        ],
      };
    }
  }

  /**
   * Read file content
   */
  static readFile(filePath: string): string {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Check if file exists
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Get file size
   */
  static getFileSize(filePath: string): number {
    try {
      if (fs.existsSync(filePath)) {
        return fs.statSync(filePath).size;
      }
      return 0;
    } catch (error) {
      console.error(`Error getting file size for ${filePath}:`, error);
      return 0;
    }
  }

  /**
   * List files in directory
   */
  static listFiles(folderPath: string, recursive: boolean = false): string[] {
    try {
      if (!fs.existsSync(folderPath)) {
        return [];
      }

      if (!recursive) {
        return fs.readdirSync(folderPath);
      }

      const files: string[] = [];
      const walkDir = (dir: string) => {
        fs.readdirSync(dir).forEach((file) => {
          const filePath = path.join(dir, file);
          const relativePath = path.relative(folderPath, filePath);
          if (fs.statSync(filePath).isDirectory()) {
            walkDir(filePath);
          } else {
            files.push(relativePath);
          }
        });
      };

      walkDir(folderPath);
      return files;
    } catch (error) {
      console.error(`Error listing files in ${folderPath}:`, error);
      return [];
    }
  }

  /**
   * Create .gitignore file
   */
  static createGitignore(projectPath: string, entries: string[]): GeneratedFileInfo {
    const gitignorePath = path.join(projectPath, '.gitignore');
    const content = entries.join('\n');
    return this.generateFile(gitignorePath, content, true);
  }

  /**
   * Create package.json file
   */
  static createPackageJson(
    projectPath: string,
    projectName: string,
    packageData: Record<string, any>
  ): GeneratedFileInfo {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const defaultPackage = {
      name: projectName,
      version: '1.0.0',
      description: 'Generated project',
      main: 'index.js',
      scripts: {},
      keywords: [],
      author: '',
      license: 'MIT',
      dependencies: {},
      devDependencies: {},
    };

    const merged = { ...defaultPackage, ...packageData };
    const content = JSON.stringify(merged, null, 2);
    return this.generateFile(packageJsonPath, content, true);
  }

  /**
   * Create tsconfig.json file
   */
  static createTsConfig(projectPath: string, tsConfigData: Record<string, any>): GeneratedFileInfo {
    const tsConfigPath = path.join(projectPath, 'tsconfig.json');
    const defaultTsConfig = {
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        lib: ['ES2020'],
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
      },
      include: ['src'],
      exclude: ['node_modules'],
    };

    const merged = { ...defaultTsConfig, ...tsConfigData };
    const content = JSON.stringify(merged, null, 2);
    return this.generateFile(tsConfigPath, content, true);
  }

  /**
   * Create README.md file
   */
  static createReadme(projectPath: string, projectName: string, content: string): GeneratedFileInfo {
    const readmePath = path.join(projectPath, 'README.md');
    const fullContent = `# ${projectName}\n\n${content}`;
    return this.generateFile(readmePath, fullContent, true);
  }

  /**
   * Copy file
   */
  static copyFile(sourcePath: string, destinationPath: string): GeneratedFileInfo {
    try {
      if (!fs.existsSync(sourcePath)) {
        throw new Error(`Source file does not exist: ${sourcePath}`);
      }

      const content = fs.readFileSync(sourcePath, 'utf-8');
      const destDir = path.dirname(destinationPath);

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      fs.writeFileSync(destinationPath, content, 'utf-8');

      const fileSize = Buffer.byteLength(content, 'utf-8');

      return {
        filePath: destinationPath,
        fileName: path.basename(destinationPath),
        size: fileSize,
        created: true,
        updated: false,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`Error copying file from ${sourcePath} to ${destinationPath}:`, error);
      throw error;
    }
  }

  /**
   * Get project summary
   */
  static getProjectSummary(projectPath: string): {
    projectPath: string;
    totalFiles: number;
    totalSize: number;
    folders: string[];
    files: string[];
  } {
    try {
      if (!fs.existsSync(projectPath)) {
        return {
          projectPath,
          totalFiles: 0,
          totalSize: 0,
          folders: [],
          files: [],
        };
      }

      const files = this.listFiles(projectPath, true);
      let totalSize = 0;

      files.forEach((file) => {
        const filePath = path.join(projectPath, file);
        try {
          totalSize += fs.statSync(filePath).size;
        } catch (error) {
          // Ignore errors getting file size
        }
      });

      const folders: string[] = [];
      const walkDir = (dir: string, prefix: string = '') => {
        fs.readdirSync(dir).forEach((file) => {
          const filePath = path.join(dir, file);
          const relativePath = prefix ? `${prefix}/${file}` : file;
          if (fs.statSync(filePath).isDirectory()) {
            folders.push(relativePath);
            walkDir(filePath, relativePath);
          }
        });
      };

      walkDir(projectPath);

      return {
        projectPath,
        totalFiles: files.length,
        totalSize,
        folders,
        files,
      };
    } catch (error) {
      console.error(`Error getting project summary for ${projectPath}:`, error);
      return {
        projectPath,
        totalFiles: 0,
        totalSize: 0,
        folders: [],
        files: [],
      };
    }
  }
}

export default FileGenerationEngine;
