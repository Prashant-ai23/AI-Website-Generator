import logger from '../utils/logger.js';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: string;
}

/**
 * Prompt Management Service
 */
class PromptService {
  private prompts: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.initializePrompts();
  }

  private initializePrompts(): void {
    // React Page Prompts
    this.registerPrompt({
      id: 'react-page-dashboard',
      name: 'Dashboard Page',
      description: 'Template for generating a dashboard page',
      template:
        'Generate a React dashboard component with {{features}} showing {{metrics}}. Use {{style}} styling.',
      variables: ['features', 'metrics', 'style'],
      category: 'react',
    });

    this.registerPrompt({
      id: 'react-page-form',
      name: 'Form Page',
      description: 'Template for generating a form component',
      template: 'Generate a React form with fields for {{fields}}. Include validation for {{validation}}.',
      variables: ['fields', 'validation'],
      category: 'react',
    });

    // Express API Prompts
    this.registerPrompt({
      id: 'express-api-crud',
      name: 'CRUD API',
      description: 'Template for generating CRUD API endpoints',
      template: 'Generate Express API routes for {{resource}} with {{operations}} operations.',
      variables: ['resource', 'operations'],
      category: 'express',
    });

    // MongoDB Schema Prompts
    this.registerPrompt({
      id: 'mongo-schema-user',
      name: 'User Schema',
      description: 'Template for generating a user model schema',
      template:
        'Generate a MongoDB schema for users with fields: {{fields}}. Include {{features}} features.',
      variables: ['fields', 'features'],
      category: 'mongodb',
    });

    logger.info('Prompt service initialized with templates');
  }

  /**
   * Register a new prompt template
   */
  registerPrompt(prompt: PromptTemplate): void {
    this.prompts.set(prompt.id, prompt);
    logger.info('Prompt registered', { promptId: prompt.id, name: prompt.name });
  }

  /**
   * Get a prompt template by ID
   */
  getPrompt(id: string): PromptTemplate | undefined {
    return this.prompts.get(id);
  }

  /**
   * Get all prompts or filter by category
   */
  getPrompts(category?: string): PromptTemplate[] {
    const prompts = Array.from(this.prompts.values());
    if (category) {
      return prompts.filter(p => p.category === category);
    }
    return prompts;
  }

  /**
   * Render a prompt template with variables
   */
  renderPrompt(id: string, variables: Record<string, string>): string | null {
    const prompt = this.getPrompt(id);
    if (!prompt) {
      logger.warn('Prompt not found', { promptId: id });
      return null;
    }

    let rendered = prompt.template;
    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(`{{${key}}}`, value);
    }

    logger.info('Prompt rendered', { promptId: id });
    return rendered;
  }

  /**
   * Get all available prompt categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    for (const prompt of this.prompts.values()) {
      categories.add(prompt.category);
    }
    return Array.from(categories);
  }
}

// Export singleton instance
export const promptService = new PromptService();

export default PromptService;
