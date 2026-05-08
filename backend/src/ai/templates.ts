import { Template, AgentType, Workflow, WorkflowStep } from './types.js';

/**
 * Template Manager - Manages reusable templates for AI agents
 */
export class TemplateManager {
  private templates: Map<string, Template> = new Map();
  private templatesByType: Map<AgentType, Template[]> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * Initialize default templates
   */
  private initializeDefaultTemplates(): void {
    // Code generation templates
    this.createTemplate({
      id: 'gen-react-component',
      name: 'React Component',
      description: 'Generate a React component',
      agentType: AgentType.CODE_GENERATOR,
      content: `
import React from 'react';

interface ComponentNameProps {
  // Define props here
}

export function ComponentName(props: ComponentNameProps) {
  return (
    <div className="componentName">
      {/* Component content */}
    </div>
  );
}
      `,
      variables: ['ComponentName', 'componentName'],
      tags: ['react', 'typescript', 'component'],
    });

    this.createTemplate({
      id: 'gen-api-endpoint',
      name: 'API Endpoint',
      description: 'Generate an Express API endpoint',
      agentType: AgentType.CODE_GENERATOR,
      content: `
import { Router, Request, Response } from 'express';

const router = Router();

/**
 * EndpointDescription
 */
router.post('/route', async (req: Request, res: Response) => {
  try {
    // Implementation here
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
      `,
      variables: ['EndpointDescription', 'method', 'route'],
      tags: ['api', 'express', 'typescript'],
    });

    // Analysis templates
    this.createTemplate({
      id: 'analyze-performance',
      name: 'Performance Analysis',
      description: 'Analyze code performance',
      agentType: AgentType.CODE_ANALYZER,
      content: `
Performance Analysis Report

Time Complexity: O(n)
Space Complexity: O(1)

Potential Bottlenecks:
- Loop iteration over large dataset
- Recursive function calls

Recommendations:
- Use memoization for repeated calculations
- Consider iterative approach for recursion
      `,
      variables: ['TimeComplexity', 'SpaceComplexity', 'Bottleneck1', 'Bottleneck2', 'Recommendation1', 'Recommendation2'],
      tags: ['performance', 'analysis'],
    });

    // Optimization templates
    this.createTemplate({
      id: 'optimize-database-query',
      name: 'Database Query Optimization',
      description: 'Optimize database queries',
      agentType: AgentType.OPTIMIZER,
      content: `
// Original Query
db.collection.find({status: 'active'})

// Optimized Query
db.collection.find({status: 'active'}).hint({status: 1})

// Improvements:
// - Added index hint for faster lookups
// - Reduced query execution time
// - Better resource utilization

// Performance Gain: 50% faster
      `,
      variables: ['OriginalQuery', 'OptimizedQuery', 'Improvement1', 'Improvement2', 'Improvement3', 'PerformanceGain'],
      tags: ['optimization', 'database', 'performance'],
    });

    // Bug fix templates
    this.createTemplate({
      id: 'fix-null-reference',
      name: 'Null Reference Fix',
      description: 'Fix null reference exceptions',
      agentType: AgentType.BUG_FIXER,
      content: `
// Issue: Potential null pointer exception

// Original Code:
const value = obj.property.subProperty;

// Fixed Code:
const value = obj?.property?.subProperty;

// Explanation:
Used optional chaining to safely access nested properties

// Prevention:
Use TypeScript strict null checks and optional chaining operators
      `,
      variables: ['Issue', 'OriginalCode', 'FixedCode', 'Explanation', 'Prevention'],
      tags: ['bugfix', 'null-safety', 'error-handling'],
    });
  }

  /**
   * Create a new template
   */
  createTemplate(template: Omit<Template, 'createdAt' | 'updatedAt'>): Template {
    const fullTemplate: Template = {
      ...template,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.templates.set(template.id, fullTemplate);

    // Index by agent type
    if (!this.templatesByType.has(template.agentType)) {
      this.templatesByType.set(template.agentType, []);
    }
    this.templatesByType.get(template.agentType)!.push(fullTemplate);

    return fullTemplate;
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): Template | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Get templates by agent type
   */
  getTemplatesByAgent(agentType: AgentType): Template[] {
    return this.templatesByType.get(agentType) || [];
  }

  /**
   * Get templates by tag
   */
  getTemplatesByTag(tag: string): Template[] {
    return Array.from(this.templates.values()).filter(
      (template) => template.tags?.includes(tag)
    );
  }

  /**
   * Apply template with variables
   */
  applyTemplate(
    templateId: string,
    variables: Record<string, string>
  ): string | undefined {
    const template = this.getTemplate(templateId);
    if (!template) return undefined;

    let content = template.content;

    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
    }

    return content;
  }

  /**
   * List all templates
   */
  listTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  /**
   * Search templates
   */
  searchTemplates(query: string): Template[] {
    const lowerQuery = query.toLowerCase();

    return Array.from(this.templates.values()).filter(
      (template) =>
        template.name.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery) ||
        template.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get template statistics
   */
  getStatistics(): Record<string, unknown> {
    const typeCount: Record<AgentType, number> = {} as Record<AgentType, number>;

    for (const [agentType, templates] of this.templatesByType) {
      typeCount[agentType] = templates.length;
    }

    return {
      totalTemplates: this.templates.size,
      byAgentType: typeCount,
    };
  }
}

/**
 * Workflow Orchestrator - Manages AI workflows
 */
export class WorkflowOrchestrator {
  private workflows: Map<string, Workflow> = new Map();
  private templateManager: TemplateManager;

  constructor(templateManager: TemplateManager) {
    this.templateManager = templateManager;
  }

  /**
   * Create a new workflow
   */
  createWorkflow(
    name: string,
    description: string,
    steps: WorkflowStep[]
  ): Workflow {
    const workflow: Workflow = {
      id: `workflow-${Date.now()}`,
      name,
      description,
      steps,
      status: 'idle',
      createdAt: new Date(),
    };

    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  /**
   * Get workflow by ID
   */
  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  /**
   * Get preset workflows
   */
  getPresetWorkflows(): Map<string, Workflow> {
    const presets = new Map<string, Workflow>();

    // Code generation workflow
    presets.set(
      'generate-and-optimize',
      this.createWorkflow(
        'Generate and Optimize',
        'Generate code and optimize it',
        [
          { id: 'step-1', agentType: AgentType.CODE_GENERATOR, status: 'idle' },
          { id: 'step-2', agentType: AgentType.CODE_ANALYZER, status: 'idle' },
          { id: 'step-3', agentType: AgentType.OPTIMIZER, status: 'idle' },
        ]
      )
    );

    // Bug fixing workflow
    presets.set(
      'fix-and-verify',
      this.createWorkflow(
        'Fix and Verify',
        'Fix bugs and verify the fix',
        [
          { id: 'step-1', agentType: AgentType.CODE_ANALYZER, status: 'idle' },
          { id: 'step-2', agentType: AgentType.BUG_FIXER, status: 'idle' },
          { id: 'step-3', agentType: AgentType.CODE_ANALYZER, status: 'idle' },
        ]
      )
    );

    // Optimization workflow
    presets.set(
      'analyze-optimize-verify',
      this.createWorkflow(
        'Analyze, Optimize, Verify',
        'Analyze code, optimize it, and verify the results',
        [
          { id: 'step-1', agentType: AgentType.CODE_ANALYZER, status: 'idle' },
          { id: 'step-2', agentType: AgentType.OPTIMIZER, status: 'idle' },
          { id: 'step-3', agentType: AgentType.CODE_ANALYZER, status: 'idle' },
        ]
      )
    );

    return presets;
  }

  /**
   * List all workflows
   */
  listWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }

  /**
   * Get workflow statistics
   */
  getStatistics(): Record<string, unknown> {
    return {
      totalWorkflows: this.workflows.size,
      presetWorkflows: Array.from(this.getPresetWorkflows().keys()),
    };
  }
}

// Export singleton instances
export const templateManager = new TemplateManager();
export const workflowOrchestrator = new WorkflowOrchestrator(templateManager);
