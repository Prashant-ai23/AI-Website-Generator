import archiver from 'archiver';
import { Stream } from 'stream';
import { GeneratedFile } from '../models/GeneratedFile.js';
import GeneratedProject from '../models/GeneratedProject.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Service for exporting generated projects as ZIP files or individual downloads
 */
export class ProjectExportService {
  /**
   * Export project as ZIP file
   */
  static async exportProjectAsZip(projectId: string): Promise<Stream> {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      const files = await GeneratedFile.find({ projectId });
      if (files.length === 0) {
        throw new ApiError(404, 'No files found in project');
      }

      // Create archive
      const archive = archiver('zip', { zlib: { level: 9 } });

      // Add files to archive
      for (const file of files) {
        const relativePath = file.filePath.startsWith('/') 
          ? file.filePath.slice(1) 
          : file.filePath;
        archive.append(file.content, { name: relativePath });
      }

      // Add package.json if not exists
      const hasPackageJson = files.some(f => f.filePath === 'package.json');
      if (!hasPackageJson) {
        const packageJson = this.generatePackageJson(project);
        archive.append(JSON.stringify(packageJson, null, 2), { name: 'package.json' });
      }

      // Add .env.example
      const envExample = this.generateEnvExample(project);
      archive.append(envExample, { name: '.env.example' });

      // Add README if not exists
      const hasReadme = files.some(f => f.filePath === 'README.md');
      if (!hasReadme) {
        const readme = this.generateBasicReadme(project);
        archive.append(readme, { name: 'README.md' });
      }

      // Finalize the archive
      await archive.finalize();

      return archive as any;
    } catch (error: any) {
      throw new ApiError(500, `Failed to export project: ${error.message}`);
    }
  }

  /**
   * Get individual file content
   */
  static async getFileContent(projectId: string, filePath: string): Promise<string> {
    try {
      const file = await GeneratedFile.findOne({
        projectId,
        filePath,
      });

      if (!file) {
        throw new ApiError(404, `File not found: ${filePath}`);
      }

      return file.content;
    } catch (error: any) {
      throw new ApiError(500, `Failed to get file content: ${error.message}`);
    }
  }

  /**
   * Get all files in project
   */
  static async getProjectFiles(projectId: string): Promise<any[]> {
    try {
      const files = await GeneratedFile.find({ projectId }).select('filePath fileType size');
      return files;
    } catch (error: any) {
      throw new ApiError(500, `Failed to retrieve project files: ${error.message}`);
    }
  }

  /**
   * Update file content
   */
  static async updateFileContent(projectId: string, filePath: string, content: string): Promise<any> {
    try {
      const file = await GeneratedFile.findOneAndUpdate(
        { projectId, filePath },
        { content, updatedAt: new Date() },
        { new: true }
      );

      if (!file) {
        throw new ApiError(404, `File not found: ${filePath}`);
      }

      return file;
    } catch (error: any) {
      throw new ApiError(500, `Failed to update file: ${error.message}`);
    }
  }

  /**
   * Delete file from project
   */
  static async deleteFile(projectId: string, filePath: string): Promise<void> {
    try {
      const result = await GeneratedFile.deleteOne({
        projectId,
        filePath,
      });

      if (result.deletedCount === 0) {
        throw new ApiError(404, `File not found: ${filePath}`);
      }
    } catch (error: any) {
      throw new ApiError(500, `Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Generate package.json for project
   */
  private static generatePackageJson(project: any): object {
    return {
      name: project.projectName?.replace(/\s+/g, '-').toLowerCase() || 'generated-project',
      version: '1.0.0',
      description: project.description || 'AI-generated website',
      main: 'dist/server.js',
      scripts: {
        dev: 'cross-env NODE_ENV=development ts-node-dev src/server.ts',
        build: 'tsc',
        start: 'node dist/server.js',
        test: 'jest',
        lint: 'eslint src --ext .ts',
      },
      dependencies: {
        express: '^4.18.2',
        mongoose: '^7.0.0',
        'jsonwebtoken': '^9.0.0',
        bcryptjs: '^2.4.3',
        dotenv: '^16.0.3',
        cors: '^2.8.5',
        'express-validator': '^7.0.0',
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@types/node': '^20.0.0',
        '@types/express': '^4.17.17',
        'ts-node-dev': '^2.0.0',
        'cross-env': '^7.0.3',
      },
      engines: {
        node: '>=16.0.0',
      },
    };
  }

  /**
   * Generate .env.example file
   */
  private static generateEnvExample(project: any): string {
    return `# Environment Configuration
# Copy this file to .env and fill in your values

# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/${project.projectName?.replace(/\s+/g, '-').toLowerCase() || 'generated-db'}

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

# API
API_VERSION=v1

# Logging
LOG_LEVEL=debug
`;
  }

  /**
   * Generate basic README.md
   */
  private static generateBasicReadme(project: any): string {
    return `# ${project.projectName || 'Generated Project'}

${project.description ? `${project.description}\n` : ''}

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB 5.0+
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd ${project.projectName?.replace(/\s+/g, '-').toLowerCase() || 'project'}
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Configure environment
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

4. Start MongoDB
\`\`\`bash
mongod
\`\`\`

5. Run development server
\`\`\`bash
npm run dev
\`\`\`

Server runs on \`http://localhost:3000\`

## 📁 Project Structure

\`\`\`
src/
├── server.ts           # Express app setup
├── config/            # Configuration files
├── controllers/       # Route handlers
├── services/          # Business logic
├── models/            # Database schemas
├── middleware/        # Custom middleware
├── routes/            # API routes
└── utils/             # Utility functions
\`\`\`

## 🔧 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm start\` - Run production server
- \`npm run test\` - Run tests
- \`npm run lint\` - Run linter

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Setup Guide](./docs/SETUP.md)

## 📝 License

MIT License - feel free to use this project

---

Generated with AI Website Generator
`;
  }
}
