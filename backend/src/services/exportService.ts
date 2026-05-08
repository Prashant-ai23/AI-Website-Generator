import archiver from 'archiver';
import { Readable, PassThrough } from 'stream';
import { ApiError } from '../utils/apiError.js';

export interface ExportOptions {
  includeFrontend?: boolean;
  includeBackend?: boolean;
  includeDocumentation?: boolean;
  projectName?: string;
}

export class ExportService {
  /**
   * Generate project documentation
   */
  private generateDocumentation(projectName: string): string {
    const documentation = `# ${projectName || 'AI Website Generator Project'}

## Project Overview
This project was generated using the AI Website Generator.

## Architecture
- **Frontend**: React with TypeScript and Vite
- **Backend**: Express.js with TypeScript
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB installed and running

### Installation

1. Install root dependencies:
\`\`\`bash
npm install
\`\`\`

2. Install backend dependencies:
\`\`\`bash
cd backend
npm install
cd ..
\`\`\`

3. Install frontend dependencies:
\`\`\`bash
cd frontend
npm install
cd ..
\`\`\`

### Environment Setup

Create \`.env\` files in the root and backend directories:

**backend/.env**:
\`\`\`
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai-website-generator
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
\`\`\`

### Running the Application

1. Start MongoDB:
\`\`\`bash
mongod
\`\`\`

2. Start the backend:
\`\`\`bash
npm run dev:backend
\`\`\`

3. Start the frontend:
\`\`\`bash
npm run dev:frontend
\`\`\`

The application will be available at \`http://localhost:5173\`

## Project Structure

### Frontend (\`frontend/\`)
- \`src/pages/\` - Page components
- \`src/components/\` - Reusable components
- \`src/services/\` - API client and services
- \`src/store/\` - Zustand state management
- \`src/hooks/\` - Custom React hooks
- \`src/types/\` - TypeScript type definitions

### Backend (\`backend/\`)
- \`src/server.ts\` - Express server setup
- \`src/routes/\` - API routes
- \`src/controllers/\` - Route handlers
- \`src/services/\` - Business logic
- \`src/models/\` - MongoDB models
- \`src/middleware/\` - Express middleware
- \`src/utils/\` - Utility functions

## Key Features

- User authentication and registration
- Project management
- Real-time updates
- Responsive UI with Tailwind CSS
- Type-safe API communication

## API Endpoints

### Authentication
- \`POST /api/v1/auth/register\` - Register new user
- \`POST /api/v1/auth/login\` - Login user
- \`GET /api/v1/auth/me\` - Get current user

### Projects
- \`GET /api/v1/projects\` - List user projects
- \`POST /api/v1/projects\` - Create new project
- \`GET /api/v1/projects/:id\` - Get project details
- \`PUT /api/v1/projects/:id\` - Update project
- \`DELETE /api/v1/projects/:id\` - Delete project

## Development

### Building for Production

1. Build backend:
\`\`\`bash
cd backend
npm run build
cd ..
\`\`\`

2. Build frontend:
\`\`\`bash
cd frontend
npm run build
cd ..
\`\`\`

### Testing

Run tests for backend:
\`\`\`bash
npm run test
\`\`\`

## Deployment

Instructions for deploying to production will depend on your hosting platform.

## Contributing

Follow these guidelines when contributing:
- Use TypeScript for all code
- Follow the existing code structure
- Write meaningful commit messages
- Create feature branches for new features

## Support

For issues and questions, please refer to the documentation or contact support.

## License

This project is licensed under the MIT License.
`;
    return documentation;
  }

  /**
   * Generate README for frontend
   */
  private generateFrontendReadme(): string {
    return `# Frontend

React + TypeScript frontend application built with Vite.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Build for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Features

- Modern React setup with TypeScript
- Fast build tool (Vite)
- Responsive design with Tailwind CSS
- State management with Zustand
- API integration with Axios
- React Router for navigation

## Project Structure

- \`src/pages/\` - Page components
- \`src/components/\` - Reusable components
- \`src/services/\` - API client
- \`src/store/\` - State management
- \`src/types/\` - TypeScript definitions
`;
  }

  /**
   * Generate README for backend
   */
  private generateBackendReadme(): string {
    return `# Backend

Express.js API server with TypeScript.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Environment Variables

Create \`.env\` file:
\`\`\`
PORT=3000
MONGODB_URI=mongodb://localhost:27017/database-name
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
\`\`\`

## Features

- RESTful API
- MongoDB integration
- JWT authentication
- Error handling
- CORS support
- Request logging

## Project Structure

- \`src/server.ts\` - Express app setup
- \`src/routes/\` - API routes
- \`src/controllers/\` - Route handlers
- \`src/services/\` - Business logic
- \`src/models/\` - Database schemas
- \`src/middleware/\` - Custom middleware
- \`src/utils/\` - Helper functions
`;
  }

  /**
   * Create a ZIP archive of the project
   */
  async createExportZip(
    options: ExportOptions = {}
  ): Promise<PassThrough> {
    const {
      includeFrontend = true,
      includeBackend = true,
      includeDocumentation = true,
      projectName = 'ai-website-generator',
    } = options;

    const output = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Error handling
    archive.on('error', (err) => {
      output.destroy(err);
    });

    output.on('close', () => {
      // ZIP is complete
    });

    // Pipe archive to output stream
    archive.pipe(output);

    try {
      // Add main project files
      archive.file('package.json', { name: 'package.json' });
      archive.file('tsconfig.json', { name: 'tsconfig.json' });
      archive.file('README.md', { name: 'README.md' });

      // Add main documentation
      if (includeDocumentation) {
        const mainReadme = this.generateDocumentation(projectName);
        archive.append(mainReadme, { name: 'PROJECT_README.md' });
      }

      // Add frontend files
      if (includeFrontend) {
        this.addFrontendFiles(archive, includeDocumentation);
      }

      // Add backend files
      if (includeBackend) {
        this.addBackendFiles(archive, includeDocumentation);
      }

      // Add configuration files
      this.addConfigFiles(archive);

      // Finalize archive
      await archive.finalize();
    } catch (error) {
      output.destroy(error as Error);
    }

    return output;
  }

  /**
   * Add frontend files to archive
   */
  private addFrontendFiles(archive: archiver.Archiver, includeReadme: boolean): void {
    try {
      // Add frontend configuration files
      archive.directory('frontend', 'frontend', (data) => {
        // Exclude node_modules, dist, and build artifacts
        if (
          data.name.includes('node_modules') ||
          data.name.includes('dist') ||
          data.name.includes('.vite') ||
          data.name.includes('.turbo')
        ) {
          return false;
        }
        return data;
      });

      if (includeReadme) {
        const frontendReadme = this.generateFrontendReadme();
        archive.append(frontendReadme, { name: 'frontend/SETUP.md' });
      }
    } catch (error) {
      console.error('Error adding frontend files:', error);
    }
  }

  /**
   * Add backend files to archive
   */
  private addBackendFiles(archive: archiver.Archiver, includeReadme: boolean): void {
    try {
      // Add backend configuration files
      archive.directory('backend', 'backend', (data) => {
        // Exclude node_modules, dist, and build artifacts
        if (
          data.name.includes('node_modules') ||
          data.name.includes('dist') ||
          data.name.includes('.turbo')
        ) {
          return false;
        }
        return data;
      });

      if (includeReadme) {
        const backendReadme = this.generateBackendReadme();
        archive.append(backendReadme, { name: 'backend/SETUP.md' });
      }

      // Add .env.example
      const envExample = `PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai-website-generator
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
`;
      archive.append(envExample, { name: 'backend/.env.example' });
    } catch (error) {
      console.error('Error adding backend files:', error);
    }
  }

  /**
   * Add configuration files to archive
   */
  private addConfigFiles(archive: archiver.Archiver): void {
    try {
      // Add root configuration files
      const files = [
        '.gitignore',
        'tsconfig.base.json',
        '.eslintrc.json',
        'prettier.config.js',
      ];

      files.forEach((file) => {
        try {
          archive.file(file, { name: file });
        } catch (error) {
          // File might not exist, skip silently
        }
      });

      // Add docs directory if it exists
      archive.directory('docs', 'docs');
    } catch (error) {
      console.error('Error adding config files:', error);
    }
  }
}

export const exportService = new ExportService();
