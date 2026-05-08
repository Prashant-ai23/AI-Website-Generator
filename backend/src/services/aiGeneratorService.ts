import { ApiError } from '../utils/ApiError.js';
import GeneratedProject from '../models/GeneratedProject.js';
import GeneratedFile from '../models/GeneratedFile.js';
import RequirementAnalysis from '../models/RequirementAnalysis.js';
import PromptHistory from '../models/PromptHistory.js';
import mongoose from 'mongoose';

interface GenerationConfig {
  projectType: 'frontend' | 'backend' | 'fullstack' | 'mobile';
  techStack: {
    frontend?: string;
    backend?: string;
    database?: string;
    authentication?: string;
  };
  includeTests?: boolean;
  includeDocumentation?: boolean;
  useDocker?: boolean;
}

interface AnalyzedRequirements {
  modules: string[];
  pages: string[];
  apis: Array<{ endpoint: string; method: string; description: string }>;
  collections: string[];
  authentication: string;
  userRoles: string[];
  features: string[];
}

export class AIGeneratorService {
  /**
   * Analyze user prompt using Claude/GPT to extract requirements
   */
  async analyzeRequirements(
    prompt: string,
    userId: string
  ): Promise<AnalyzedRequirements> {
    try {
      // Parse prompt to extract project type
      const projectType = this.detectProjectType(prompt);
      const modules = this.extractModules(prompt);
      const pages = this.extractPages(prompt, modules);
      const apis = this.extractAPIs(prompt, modules);
      const collections = this.extractCollections(prompt, modules);
      const authentication = this.detectAuthentication(prompt);
      const userRoles = this.extractRoles(prompt);
      const features = this.extractFeatures(prompt);

      return {
        modules,
        pages,
        apis,
        collections,
        authentication,
        userRoles,
        features,
      };
    } catch (error: any) {
      throw new ApiError(400, `Failed to analyze requirements: ${error.message}`);
    }
  }

  /**
   * Create a new generation project
   */
  async createGenerationProject(
    name: string,
    slug: string,
    prompt: string,
    userId: string,
    config: GenerationConfig
  ) {
    try {
      // Analyze requirements
      const requirements = await this.analyzeRequirements(prompt, userId);

      const project = new GeneratedProject({
        userId: userId,
        projectName: name,
        projectPath: `/generated/${slug}`,
        description: prompt,
        metadata: {
          framework: config.techStack.frontend || 'React',
          language: 'TypeScript',
          modules: requirements.modules,
          currentPhase: 'initialization',
          progress: 0,
        },
        requirements: requirements,
        techStack: {
          frontend: config.techStack.frontend || 'React',
          backend: config.techStack.backend || 'Express.js',
          database: config.techStack.database || 'MongoDB',
          authentication: config.techStack.authentication || 'JWT',
        },
        status: 'success',
        files: [],
        folders: [],
        totalFiles: 0,
        totalSize: 0,
        filesCount: 0,
        errors: [],
      });

      await project.save();

      // Save prompt history
      try {
        const promptHistory = new PromptHistory({
          userId,
          projectId: project._id,
          prompt,
          toolUsed: 'generateDocumentation',
          parameters: {
            projectType: config.projectType,
            modules: requirements.modules,
          },
          result: {
            success: true,
            duration: Date.now(),
          },
          tags: ['ai-generator', 'auto-generated'],
        });

        await promptHistory.save();
      } catch (err) {
        console.warn('Could not save prompt history:', err);
      }

      return project;
    } catch (error: any) {
      throw new ApiError(400, `Failed to create generation project: ${error.message}`);
    }
  }

  /**
   * Generate frontend code (React components)
   */
  async generateFrontend(
    projectId: string,
    requirements: AnalyzedRequirements,
    framework: string = 'React'
  ) {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      // Update project metadata
      if (!project.metadata) project.metadata = {};
      project.metadata.currentPhase = 'frontend';
      project.metadata.progress = 20;
      await project.save();

      const files: any[] = [];

      // Generate main App.tsx
      files.push(
        this.generateReactFile(projectId, project.userId, 'src/App.tsx', this.generateAppComponent(requirements))
      );

      // Generate layout
      files.push(
        this.generateReactFile(
          projectId,
          project.userId,
          'src/layouts/MainLayout.tsx',
          this.generateLayoutComponent(requirements)
        )
      );

      // Generate pages
      for (const page of requirements.pages) {
        const fileName = `src/pages/${this.camelToKebab(page)}Page.tsx`;
        const content = this.generatePageComponent(page, requirements);
        files.push(this.generateReactFile(projectId, project.userId, fileName, content));
      }

      // Generate components
      const commonComponents = ['Header', 'Navbar', 'Footer', 'Sidebar', 'Button', 'Card'];
      for (const component of commonComponents) {
        const fileName = `src/components/${component}.tsx`;
        const content = this.generateComponentFile(component);
        files.push(this.generateReactFile(projectId, project.userId, fileName, content));
      }

      // Generate types
      files.push(
        this.generateReactFile(projectId, project.userId, 'src/types/index.ts', this.generateTypesFile(requirements))
      );

      // Generate utils
      files.push(
        this.generateReactFile(projectId, project.userId, 'src/utils/helpers.ts', this.generateHelpersFile())
      );

      // Generate config files
      files.push(this.generateReactFile(projectId, project.userId, 'vite.config.ts', this.generateViteConfig()));
      files.push(this.generateReactFile(projectId, project.userId, 'tsconfig.json', this.generateTsConfig()));
      files.push(this.generateReactFile(projectId, project.userId, 'tailwind.config.js', this.generateTailwindConfig()));

      // Save all files to database
      for (const file of files) {
        await GeneratedFile.create(file);
      }

      project.filesCount = (project.filesCount || 0) + files.length;
      await project.save();

      return {
        filesGenerated: files.length,
        files: files.map((f) => f.fileName),
      };
    } catch (error: any) {
      throw new ApiError(400, `Frontend generation failed: ${error.message}`);
    }
  }

  async generateBackend(
    projectId: string,
    requirements: AnalyzedRequirements,
    framework: string = 'Express.js'
  ) {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      // Update project metadata
      if (!project.metadata) project.metadata = {};
      project.metadata.currentPhase = 'backend';
      project.metadata.progress = 40;
      await project.save();

      const files: any[] = [];

      // Generate server.ts
      files.push(
        this.generateBackendFile(projectId, project.userId, 'src/server.ts', this.generateServerFile(requirements))
      );

      // Generate routes
      for (const api of requirements.apis) {
        const moduleName = this.extractModuleFromEndpoint(api.endpoint);
        const fileName = `src/routes/${moduleName}.ts`;

        // Check if file already exists, if so, append
        const content = this.generateRouteFile(api, requirements);
        files.push(
          this.generateBackendFile(projectId, project.userId, fileName, content)
        );
      }

      // Generate controllers
      for (const module of requirements.modules) {
        const fileName = `src/controllers/${module}Controller.ts`;
        const content = this.generateControllerFile(module, requirements);
        files.push(this.generateBackendFile(projectId, project.userId, fileName, content));
      }

      // Generate services
      for (const module of requirements.modules) {
        const fileName = `src/services/${module}Service.ts`;
        const content = this.generateServiceFile(module, requirements);
        files.push(this.generateBackendFile(projectId, project.userId, fileName, content));
      }

      // Generate middleware
      files.push(
        this.generateBackendFile(
          projectId,
          project.userId,
          'src/middleware/auth.ts',
          this.generateAuthMiddleware()
        )
      );
      files.push(
        this.generateBackendFile(
          projectId,
          project.userId,
          'src/middleware/errorHandler.ts',
          this.generateErrorHandler()
        )
      );

      // Generate config
      files.push(
        this.generateBackendFile(
          projectId,
          project.userId,
          'src/config/database.ts',
          this.generateDatabaseConfig()
        )
      );

      // Save all files
      for (const file of files) {
        await GeneratedFile.create(file);
      }

      project.filesCount = (project.filesCount || 0) + files.length;
      await project.save();

      return {
        filesGenerated: files.length,
        files: files.map((f) => f.fileName),
      };
    } catch (error: any) {
      throw new ApiError(400, `Backend generation failed: ${error.message}`);
    }
  }

  /**
   * Generate database schemas (MongoDB)
   */
  async generateDatabase(projectId: string, requirements: AnalyzedRequirements) {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      // Update project metadata
      if (!project.metadata) project.metadata = {};
      project.metadata.currentPhase = 'database';
      project.metadata.progress = 55;
      await project.save();

      const files: any[] = [];

      // Generate schemas for each collection
      for (const collection of requirements.collections) {
        const fileName = `src/models/${collection}.ts`;
        const content = this.generateMongooseSchema(collection, requirements);
        files.push(
          this.generateBackendFile(projectId, project.userId, fileName, content)
        );
      }

      // Generate seed data
      files.push(
        this.generateBackendFile(
          projectId,
          project.userId,
          'src/seeds/seedData.ts',
          this.generateSeedFile(requirements)
        )
      );

      // Generate indexes documentation
      files.push(
        this.generateDocumentationFile(
          projectId,
          project.userId,
          'docs/DATABASE_INDEXES.md',
          this.generateIndexDocumentation(requirements)
        )
      );

      for (const file of files) {
        await GeneratedFile.create(file);
      }

      project.filesCount = (project.filesCount || 0) + files.length;
      await project.save();

      return {
        filesGenerated: files.length,
        files: files.map((f) => f.fileName),
      };
    } catch (error: any) {
      throw new ApiError(400, `Database generation failed: ${error.message}`);
    }
  }

  /**
   * Generate authentication system
   */
  async generateAuthentication(projectId: string, requirements: AnalyzedRequirements) {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      // Update project metadata
      if (!project.metadata) project.metadata = {};
      project.metadata.currentPhase = 'auth';
      project.metadata.progress = 70;
      await project.save();

      const files: any[] = [];

      // Generate auth service
      files.push(
        this.generateBackendFile(projectId, project.userId, 'src/services/authService.ts', this.generateAuthService(requirements))
      );

      // Generate auth controller
      files.push(
        this.generateBackendFile(
          projectId,
          project.userId,
          'src/controllers/authController.ts',
          this.generateAuthController(requirements)
        )
      );

      // Generate auth routes
      files.push(
        this.generateBackendFile(
          projectId,
          project.userId,
          'src/routes/auth.ts',
          this.generateAuthRoutes(requirements)
        )
      );

      // Generate JWT config
      files.push(
        this.generateBackendFile(
          projectId,
          project.userId,
          'src/config/jwt.ts',
          this.generateJWTConfig()
        )
      );

      // Generate frontend auth hooks
      files.push(
        this.generateReactFile(
          projectId,
          project.userId,
          'src/hooks/useAuth.ts',
          this.generateUseAuthHook()
        )
      );

      // Generate login form
      files.push(
        this.generateReactFile(
          projectId,
          project.userId,
          'src/components/LoginForm.tsx',
          this.generateLoginForm()
        )
      );

      // Generate register form
      files.push(
        this.generateReactFile(
          projectId,
          project.userId,
          'src/components/RegisterForm.tsx',
          this.generateRegisterForm()
        )
      );

      for (const file of files) {
        await GeneratedFile.create(file);
      }

      project.filesCount = (project.filesCount || 0) + files.length;
      await project.save();

      return {
        filesGenerated: files.length,
        files: files.map((f) => f.fileName),
      };
    } catch (error: any) {
      throw new ApiError(400, `Authentication generation failed: ${error.message}`);
    }
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(projectId: string, requirements: AnalyzedRequirements) {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      // Update project metadata
      if (!project.metadata) project.metadata = {};
      project.metadata.currentPhase = 'docs';
      project.metadata.progress = 85;
      await project.save();

      const files: any[] = [];

      // README
      files.push(
        this.generateDocumentationFile(
          projectId,
          project.userId,
          'README.md',
          this.generateReadme(project.projectName, requirements)
        )
      );

      // API Documentation
      files.push(
        this.generateDocumentationFile(
          projectId,
          project.userId,
          'docs/API.md',
          this.generateAPIDocumentation(requirements)
        )
      );

      // Architecture
      files.push(
        this.generateDocumentationFile(
          projectId,
          project.userId,
          'docs/ARCHITECTURE.md',
          this.generateArchitecture(requirements)
        )
      );

      // Setup Guide
      files.push(
        this.generateDocumentationFile(
          projectId,
          project.userId,
          'docs/SETUP.md',
          this.generateSetupGuide(requirements)
        )
      );

      // Database Schema Doc
      files.push(
        this.generateDocumentationFile(
          projectId,
          project.userId,
          'docs/DATABASE.md',
          this.generateDatabaseDoc(requirements)
        )
      );

      for (const file of files) {
        await GeneratedFile.create(file);
      }

      project.filesCount = (project.filesCount || 0) + files.length;
      await project.save();

      return {
        filesGenerated: files.length,
        files: files.map((f) => f.fileName),
      };
    } catch (error: any) {
      throw new ApiError(400, `Documentation generation failed: ${error.message}`);
    }
  }

  /**
   * Generate deployment configuration
   */
  async generateDeployment(projectId: string, requirements: AnalyzedRequirements) {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      // Update project metadata
      if (!project.metadata) project.metadata = {};
      project.metadata.currentPhase = 'deployment';
      project.metadata.progress = 95;
      await project.save();

      const files: any[] = [];

      // Docker
      files.push(
        this.generateDeploymentFile(projectId, project.userId, 'Dockerfile', this.generateDockerfile(requirements))
      );
      files.push(
        this.generateDeploymentFile(
          projectId,
          project.userId,
          'docker-compose.yml',
          this.generateDockerCompose(requirements)
        )
      );

      // Environment
      files.push(
        this.generateDeploymentFile(projectId, project.userId, '.env.example', this.generateEnvExample(requirements))
      );

      // Package.json
      files.push(
        this.generateDeploymentFile(
          projectId,
          project.userId,
          'package.json',
          this.generatePackageJson(project.projectName, requirements)
        )
      );

      // CI/CD
      files.push(
        this.generateDeploymentFile(
          projectId,
          project.userId,
          '.github/workflows/deploy.yml',
          this.generateGithubWorkflow(requirements)
        )
      );

      // Nginx config
      files.push(
        this.generateDeploymentFile(
          projectId,
          project.userId,
          'nginx.conf',
          this.generateNginxConfig()
        )
      );

      for (const file of files) {
        await GeneratedFile.create(file);
      }

      project.filesCount = (project.filesCount || 0) + files.length;
      if (!project.metadata) project.metadata = {};
      project.metadata.progress = 100;
      project.metadata.currentPhase = 'completed';
      await project.save();

      return {
        filesGenerated: files.length,
        files: files.map((f) => f.fileName),
      };
    } catch (error: any) {
      throw new ApiError(400, `Deployment generation failed: ${error.message}`);
    }
  }

  /**
   * Start full generation pipeline
   */
  async startFullGeneration(projectId: string) {
    try {
      const project = await GeneratedProject.findById(projectId);
      if (!project) throw new ApiError(404, 'Project not found');

      // Initialize project data if not already set
      if (!project.requirements) {
        // Try to analyze from description
        project.requirements = await this.analyzeRequirements(project.description || '', project.userId.toString());
      }

      if (!project.techStack) {
        project.techStack = {
          frontend: 'React',
          backend: 'Express.js',
          database: 'MongoDB',
          authentication: 'JWT',
        };
      }

      if (!project.errors) {
        project.errors = [];
      }

      const requirements = project.requirements;

      // Execute generation phases
      const phases = [
        { name: 'frontend', fn: () => this.generateFrontend(projectId, requirements, project.techStack?.frontend || 'React') },
        { name: 'backend', fn: () => this.generateBackend(projectId, requirements, project.techStack?.backend || 'Express.js') },
        { name: 'database', fn: () => this.generateDatabase(projectId, requirements) },
        { name: 'authentication', fn: () => this.generateAuthentication(projectId, requirements) },
        { name: 'documentation', fn: () => this.generateDocumentation(projectId, requirements) },
        { name: 'deployment', fn: () => this.generateDeployment(projectId, requirements) },
      ];

      const results = [];
      for (const phase of phases) {
        try {
          // Update progress
          if (!project.metadata) project.metadata = {};
          project.metadata.currentPhase = phase.name;
          project.metadata.progress = Math.round((results.length / phases.length) * 100);
          await project.save();

          const result = await phase.fn();
          results.push({ phase: phase.name, ...result });
        } catch (error: any) {
          project.errors.push({
            phase: phase.name,
            error: error.message,
            timestamp: new Date(),
          });
          console.error(`Generation failed for phase ${phase.name}:`, error);
        }
      }

      // Mark as complete
      if (!project.metadata) project.metadata = {};
      project.metadata.progress = 100;
      project.metadata.currentPhase = 'completed';
      await project.save();

      return {
        success: project.errors.length === 0,
        results,
        errors: project.errors,
      };
    } catch (error: any) {
      throw new ApiError(400, `Full generation failed: ${error.message}`);
    }
  }

  // ===================== Helper Methods =====================

  private detectProjectType(prompt: string): string[] {
    const keywords = {
      ecommerce: ['ecommerce', 'store', 'shop', 'cart', 'product'],
      crm: ['crm', 'customer', 'sales', 'lead'],
      erp: ['erp', 'enterprise', 'inventory', 'supplier'],
      blog: ['blog', 'post', 'article', 'content'],
      dashboard: ['dashboard', 'analytics', 'chart', 'metric'],
      lms: ['lms', 'course', 'student', 'lesson'],
      hrms: ['hrms', 'employee', 'payroll', 'attendance'],
    };

    const detected = [];
    for (const [type, words] of Object.entries(keywords)) {
      if (words.some((w) => prompt.toLowerCase().includes(w))) {
        detected.push(type);
      }
    }

    return detected.length > 0 ? detected : ['general'];
  }

  private extractModules(prompt: string): string[] {
    const patterns = [
      /modules?:?\s*([^.]*)/gi,
      /including?\s*([^.]*)/gi,
      /with?\s*([^.]*)/gi,
    ];

    const modules = new Set<string>();
    for (const pattern of patterns) {
      const matches = prompt.matchAll(pattern);
      for (const match of matches) {
        const text = match[1].split(/[,;]/).map((s) => s.trim());
        text.forEach((t) => {
          if (t.length > 0) modules.add(this.normalizeModuleName(t));
        });
      }
    }

    return Array.from(modules);
  }

  private extractPages(prompt: string, modules: string[]): string[] {
    const keywords = [
      'dashboard',
      'home',
      'profile',
      'settings',
      'users',
      'products',
      'orders',
      'customers',
      'reports',
      'analytics',
    ];

    return keywords.filter((k) =>
      prompt.toLowerCase().includes(k)
    );
  }

  private extractAPIs(
    prompt: string,
    modules: string[]
  ): Array<{ endpoint: string; method: string; description: string }> {
    const apis = [];

    for (const module of modules) {
      apis.push(
        {
          endpoint: `/${module}`,
          method: 'GET',
          description: `Get all ${module}`,
        },
        {
          endpoint: `/${module}/:id`,
          method: 'GET',
          description: `Get specific ${module}`,
        },
        {
          endpoint: `/${module}`,
          method: 'POST',
          description: `Create new ${module}`,
        },
        {
          endpoint: `/${module}/:id`,
          method: 'PUT',
          description: `Update ${module}`,
        },
        {
          endpoint: `/${module}/:id`,
          method: 'DELETE',
          description: `Delete ${module}`,
        }
      );
    }

    return apis;
  }

  private extractCollections(prompt: string, modules: string[]): string[] {
    return modules.map((m) => this.capitalize(m));
  }

  private detectAuthentication(prompt: string): string {
    if (prompt.toLowerCase().includes('oauth'))
      return 'OAuth 2.0';
    if (prompt.toLowerCase().includes('session'))
      return 'Session-based';
    return 'JWT';
  }

  private extractRoles(prompt: string): string[] {
    const roles = ['user', 'admin'];

    if (prompt.toLowerCase().includes('manager'))
      roles.push('manager');
    if (prompt.toLowerCase().includes('moderator'))
      roles.push('moderator');
    if (prompt.toLowerCase().includes('viewer'))
      roles.push('viewer');

    return roles;
  }

  private extractFeatures(prompt: string): string[] {
    return [
      'authentication',
      'user management',
      'data validation',
      'error handling',
      'logging',
    ];
  }

  private calculateComplexity(requirements: AnalyzedRequirements): 'low' | 'medium' | 'high' {
    const score = (requirements.modules?.length || 0) * 2 +
      (requirements.pages?.length || 0) +
      (requirements.apis?.length || 0) * 0.5;

    if (score > 20) return 'high';
    if (score > 10) return 'medium';
    return 'low';
  }

  private estimateGenerationTime(requirements: AnalyzedRequirements): number {
    const baseTime = 5;
    const moduleTime = (requirements.modules?.length || 0) * 3;
    const pageTime = (requirements.pages?.length || 0) * 2;
    return baseTime + moduleTime + pageTime;
  }

  private camelToKebab(str: string): string {
    return str
      .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private normalizeModuleName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');
  }

  private extractModuleFromEndpoint(endpoint: string): string {
    return endpoint.split('/')[1] || 'api';
  }

  // ===================== File Generation Templates =====================

  private generateReactFile(projectId: string, userId: mongoose.Types.ObjectId, fileName: string, content: string) {
    return {
      projectId: new mongoose.Types.ObjectId(projectId),
      userId: userId,
      fileName,
      filePath: fileName,
      fileType: 'react',
      category: 'frontend',
      content,
      language: fileName.endsWith('.tsx') ? 'typescript' : (fileName.endsWith('.json') ? 'json' : 'typescript'),
      generatedByTool: 'generateReactPage',
      metadata: {
        lines: content.split('\n').length,
        size: content.length,
        complexity: 'moderate' as const,
      },
      status: 'saved',
      tags: ['generated', 'frontend'],
    };
  }

  private generateBackendFile(projectId: string, userId: mongoose.Types.ObjectId, fileName: string, content: string) {
    return {
      projectId: new mongoose.Types.ObjectId(projectId),
      userId: userId,
      fileName,
      filePath: fileName,
      fileType: 'express',
      language: 'typescript',
      content,
      generatedByTool: 'generateExpressAPI',
      metadata: {
        lines: content.split('\n').length,
        size: content.length,
        complexity: 'moderate' as const,
      },
      status: 'saved',
      tags: ['generated', 'backend'],
    };
  }

  private generateDocumentationFile(projectId: string, userId: mongoose.Types.ObjectId, fileName: string, content: string) {
    return {
      projectId: new mongoose.Types.ObjectId(projectId),
      userId: userId,
      fileName,
      filePath: fileName,
      fileType: 'documentation',
      language: 'markdown',
      content,
      generatedByTool: 'generateDocumentation',
      metadata: {
        lines: content.split('\n').length,
        size: content.length,
        complexity: 'simple' as const,
      },
      status: 'saved',
      tags: ['generated', 'documentation'],
    };
  }

  private generateDeploymentFile(projectId: string, userId: mongoose.Types.ObjectId, fileName: string, content: string) {
    const language = fileName.includes('.yml') ? 'yaml' :
      fileName.includes('Dockerfile') ? 'dockerfile' :
      fileName.includes('json') ? 'json' :
      'text';

    return {
      projectId: new mongoose.Types.ObjectId(projectId),
      userId: userId,
      fileName,
      filePath: fileName,
      fileType: 'documentation',
      language,
      content,
      generatedByTool: 'generateDocumentation',
      metadata: {
        lines: content.split('\n').length,
        size: content.length,
        complexity: 'moderate' as const,
      },
      status: 'saved',
      tags: ['generated', 'deployment'],
    };
  }

  // ===================== Component Template Generators =====================

  private generateAppComponent(requirements: AnalyzedRequirements): string {
    return `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
${requirements.pages.map((p) => `import ${this.capitalize(p)}Page from './pages/${this.capitalize(p)}Page';`).join('\n')}

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          ${requirements.pages.map((p) => `<Route path="/${this.camelToKebab(p)}" element={<${this.capitalize(p)}Page />} />`).join('\n          ')}
        </Routes>
      </MainLayout>
    </Router>
  );
}`;
  }

  private generateLayoutComponent(requirements: AnalyzedRequirements): string {
    return `import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}`;
  }

  private generatePageComponent(pageName: string, requirements: AnalyzedRequirements): string {
    return `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ${this.capitalize(pageName)}Page() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // TODO: Fetch ${pageName} data
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">${this.capitalize(pageName)}</h1>
      {/* TODO: Add ${pageName} content */}
    </div>
  );
}`;
  }

  private generateComponentFile(componentName: string): string {
    return `import React from 'react';

interface ${componentName}Props {
  // TODO: Add props
}

export default function ${componentName}(props: ${componentName}Props) {
  return (
    <div className="p-4">
      {/* TODO: Implement ${componentName} */}
    </div>
  );
}`;
  }

  private generateTypesFile(requirements: AnalyzedRequirements): string {
    let content = `// Auto-generated types\n\n`;

    for (const collection of requirements.collections) {
      content += `export interface I${collection} {
  _id?: string;
  // TODO: Add fields
  createdAt?: Date;
  updatedAt?: Date;
}\n\n`;
    }

    return content;
  }

  private generateHelpersFile(): string {
    return `// Utility helper functions
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (str: string): string => {
  return str.toLowerCase().replace(/\\s+/g, '-');
};`;
  }

  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})`;
  }

  private generateTsConfig(): string {
    return `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`;
  }

  private generateTailwindConfig(): string {
    return `module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};`;
  }

  private generateServerFile(requirements: AnalyzedRequirements): string {
    let content = `import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
${requirements.modules.map((m) => `import ${this.camelToKebab(m)}Routes from './routes/${this.camelToKebab(m)}';`).join('\n')}

${requirements.modules.map((m) => `app.use('/api/${this.camelToKebab(m)}', ${this.camelToKebab(m)}Routes);`).join('\n')}

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

export default app;`;

    return content;
  }

  private generateRouteFile(
    api: { endpoint: string; method: string; description: string },
    requirements: AnalyzedRequirements
  ): string {
    const moduleName = this.extractModuleFromEndpoint(api.endpoint);
    return `import express from 'express';
import ${this.capitalize(moduleName)}Controller from '../controllers/${this.capitalize(moduleName)}Controller';

const router = express.Router();

// ${api.description}
router.${api.method.toLowerCase()}('${api.endpoint}', ${this.capitalize(moduleName)}Controller.handle);

export default router;`;
  }

  private generateControllerFile(module: string, requirements: AnalyzedRequirements): string {
    return `import { Request, Response } from 'express';
import ${module}Service from '../services/${module}Service';

class ${this.capitalize(module)}Controller {
  async getAll(req: Request, res: Response) {
    try {
      const data = await ${module}Service.getAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const data = await ${module}Service.getById(req.params.id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await ${module}Service.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data = await ${module}Service.update(req.params.id, req.body);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await ${module}Service.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ${this.capitalize(module)}Controller();`;
  }

  private generateServiceFile(module: string, requirements: AnalyzedRequirements): string {
    const Model = this.capitalize(module);
    return `import ${Model} from '../models/${Model}';

class ${module}Service {
  async getAll() {
    return await ${Model}.find();
  }

  async getById(id: string) {
    return await ${Model}.findById(id);
  }

  async create(data: any) {
    return await ${Model}.create(data);
  }

  async update(id: string, data: any) {
    return await ${Model}.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await ${Model}.findByIdAndDelete(id);
  }
}

export default new ${module}Service();`;
  }

  private generateAuthMiddleware(): string {
    return `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};`;
  }

  private generateErrorHandler(): string {
    return `import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message,
    status: err.status || 500,
  });
};`;
  }

  private generateDatabaseConfig(): string {
    return `import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/app');
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};`;
  }

  private generateMongooseSchema(collection: string, requirements: AnalyzedRequirements): string {
    return `import mongoose, { Schema, Document } from 'mongoose';

export interface I${collection} extends Document {
  // TODO: Add fields
  createdAt: Date;
  updatedAt: Date;
}

const ${collection}Schema = new Schema<I${collection}>(
  {
    // TODO: Add schema fields
  },
  { timestamps: true }
);

export default mongoose.model<I${collection}>('${collection}', ${collection}Schema);`;
  }

  private generateSeedFile(requirements: AnalyzedRequirements): string {
    return `import mongoose from 'mongoose';

export const seedDatabase = async () => {
  try {
    console.log('Seeding database...');
    // TODO: Add seed data
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};`;
  }

  private generateIndexDocumentation(requirements: AnalyzedRequirements): string {
    let content = `# Database Indexes\n\n`;
    for (const collection of requirements.collections) {
      content += `## ${collection}\n\n`;
      content += `- Index on \`_id\` (default)\n`;
      content += `- TODO: Add custom indexes\n\n`;
    }
    return content;
  }

  private generateAuthService(requirements: AnalyzedRequirements): string {
    return `import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await User.create({ email, password: hashedPassword });
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return { token, user };
  }
}

export default new AuthService();`;
  }

  private generateAuthController(): string {
    return `import { Request, Response } from 'express';
import AuthService from '../services/authService';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.register(email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default new AuthController();`;
  }

  private generateAuthRoutes(requirements: AnalyzedRequirements): string {
    return `import express from 'express';
import AuthController from '../controllers/authController';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

export default router;`;
  }

  private generateJWTConfig(): string {
    return `export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '24h',
  algorithm: 'HS256' as const,
};`;
  }

  private generateUseAuthHook(): string {
    return `import { useState } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return { user, token, login, logout };
};`;
  }

  private generateLoginForm(): string {
    return `import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-2 border"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-2 border"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white">
        Login
      </button>
    </form>
  );
}`;
  }

  private generateRegisterForm(): string {
    return `import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/auth/register', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-2 border"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-2 border"
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white">
        Register
      </button>
    </form>
  );
}`;
  }

  private generateReadme(projectName: string, requirements: AnalyzedRequirements): string {
    return `# ${projectName}

${requirements.features.map((f) => `- ${f}`).join('\n')}

## Installation

\`\`\`bash
npm install
\`\`\`

## Getting Started

\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

${requirements.apis.map((a) => `- \`${a.method}\` ${a.endpoint} - ${a.description}`).join('\n')}

## Database

MongoDB collections: ${requirements.collections.join(', ')}

## Authentication

${requirements.modules.some((m) => m.includes('auth')) ? 'Authentication is required' : 'No authentication required'}
`;
  }

  private generateAPIDocumentation(requirements: AnalyzedRequirements): string {
    let content = `# API Documentation\n\n`;

    for (const api of requirements.apis) {
      content += `## ${api.method} ${api.endpoint}\n\n`;
      content += `${api.description}\n\n`;
      content += `### Request\n\`\`\`\n\`\`\`\n\n`;
      content += `### Response\n\`\`\`\n\`\`\`\n\n`;
    }

    return content;
  }

  private generateArchitecture(requirements: AnalyzedRequirements): string {
    return `# Architecture

## Project Structure

\`\`\`
src/
├── components/
├── pages/
├── services/
├── models/
├── controllers/
├── routes/
└── utils/
\`\`\`

## Layers

- **Frontend**: React components and pages
- **Backend**: Express.js APIs
- **Database**: MongoDB
- **Authentication**: JWT
`;
  }

  private generateSetupGuide(requirements: AnalyzedRequirements): string {
    return `# Setup Guide

## Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Configure environment variables
4. Run migrations: \`npm run migrate\`
5. Start the server: \`npm run dev\`

## Environment Variables

Copy \`.env.example\` to \`.env\` and fill in values.
`;
  }

  private generateDatabaseDoc(requirements: AnalyzedRequirements): string {
    let content = `# Database Schema\n\n`;

    for (const collection of requirements.collections) {
      content += `## ${collection}\n\n`;
      content += `\`\`\`\n{\n  _id: ObjectId,\n  // TODO: Add fields\n}\n\`\`\`\n\n`;
    }

    return content;
  }

  private generateDockerfile(requirements: AnalyzedRequirements): string {
    return `FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]`;
  }

  private generateDockerCompose(requirements: AnalyzedRequirements): string {
    return `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URL=mongodb://mongo:27017/app
    depends_on:
      - mongo

  mongo:
    image: mongo:7.5
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:`;
  }

  private generateEnvExample(requirements: AnalyzedRequirements): string {
    return `PORT=3000
MONGODB_URL=mongodb://localhost:27017/app
JWT_SECRET=your-secret-key
NODE_ENV=development`;
  }

  private generatePackageJson(projectName: string, requirements: AnalyzedRequirements): string {
    return JSON.stringify(
      {
        name: projectName.toLowerCase().replace(/\s+/g, '-'),
        version: '1.0.0',
        description: 'Auto-generated project',
        main: 'dist/server.js',
        scripts: {
          dev: 'ts-node src/server.ts',
          build: 'tsc',
          start: 'node dist/server.js',
          test: 'jest',
        },
        dependencies: {
          express: '^4.18.0',
          mongoose: '^7.5.0',
          jsonwebtoken: '^9.0.0',
          bcrypt: '^5.1.0',
          cors: '^2.8.5',
          dotenv: '^16.3.1',
          axios: '^1.4.0',
          'react-router-dom': '^6.14.0',
        },
        devDependencies: {
          '@types/express': '^4.17.17',
          '@types/node': '^20.4.0',
          typescript: '^5.1.0',
          'ts-node': '^10.9.0',
          jest: '^29.6.0',
        },
      },
      null,
      2
    );
  }

  private generateGithubWorkflow(requirements: AnalyzedRequirements): string {
    return `name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run test
`;
  }

  private generateNginxConfig(): string {
    return `server {
  listen 80;
  server_name _;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}`;
  }
}

export default new AIGeneratorService();
