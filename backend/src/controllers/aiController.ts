import { Request, Response, NextFunction } from 'express';
import { orchestrator } from '../ai/orchestrator.js';
import { contextMemory, ragSystem } from '../ai/memory.js';
import { templateManager, workflowOrchestrator } from '../ai/templates.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AgentType } from '../ai/types.js';

interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string };
}

/**
 * AI Features Controller
 */
export class AIFeaturesController {
  /**
   * Execute agent
   */
  static async executeAgent(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { agentType, input } = req.body;

      if (!agentType || !input) {
        throw new Error('Missing agentType or input');
      }

      const context = {
        conversationId: `conv-${req.user?.id}-${Date.now()}`,
        userId: req.user?.id || 'anonymous',
        timestamp: new Date(),
      };

      const result = await orchestrator.executeAgent(agentType as AgentType, input, context);

      res.status(200).json(new ApiResponse(200, result, 'Agent executed successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Execute agent workflow
   */
  static async executeWorkflow(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workflowType, input } = req.body;

      const context = {
        conversationId: `conv-${req.user?.id}-${Date.now()}`,
        userId: req.user?.id || 'anonymous',
        timestamp: new Date(),
      };

      let result;

      if (workflowType === 'analyze-generate') {
        result = await orchestrator.analyzeAndGenerateWorkflow(
          input.description,
          context
        );
      } else if (workflowType === 'bug-fixing') {
        result = await orchestrator.bugFixingWorkflow(input.code, input.error, context);
      } else if (workflowType === 'collaborate') {
        result = await orchestrator.collaborateOnCode(input.code, context);
      } else {
        throw new Error(`Unknown workflow type: ${workflowType}`);
      }

      res.status(200).json(new ApiResponse(200, result, 'Workflow executed successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Auto-fix bugs
   */
  static async autoBugFix(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, error } = req.body;

      if (!code || !error) {
        throw new Error('Missing code or error message');
      }

      const context = {
        conversationId: `conv-${req.user?.id}-${Date.now()}`,
        userId: req.user?.id || 'anonymous',
        timestamp: new Date(),
      };

      const result = await orchestrator.bugFixingWorkflow(code, error, context);

      res.status(200).json(
        new ApiResponse(200, result, 'Auto bug fix completed')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Optimize code
   */
  static async optimizeCode(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.body;

      if (!code) {
        throw new Error('Missing code');
      }

      const context = {
        conversationId: `conv-${req.user?.id}-${Date.now()}`,
        userId: req.user?.id || 'anonymous',
        timestamp: new Date(),
      };

      const result = await orchestrator.executeAgent(
        AgentType.OPTIMIZER,
        { code },
        context
      );

      res.status(200).json(
        new ApiResponse(200, result, 'Code optimization completed')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Query context memory with RAG
   */
  static async queryMemory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, conversationId } = req.body;

      if (!query || !conversationId) {
        throw new Error('Missing query or conversationId');
      }

      const result = await ragSystem.query({
        query,
        conversationId,
        topK: 5,
      });

      res.status(200).json(
        new ApiResponse(200, result, 'RAG query executed successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get templates
   */
  static async getTemplates(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { agentType, tag, search } = req.query;

      let templates;

      if (search) {
        templates = templateManager.searchTemplates(search as string);
      } else if (agentType) {
        templates = templateManager.getTemplatesByAgent(agentType as AgentType);
      } else if (tag) {
        templates = templateManager.getTemplatesByTag(tag as string);
      } else {
        templates = templateManager.listTemplates();
      }

      res.status(200).json(
        new ApiResponse(200, { templates }, 'Templates retrieved successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Apply template
   */
  static async applyTemplate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { templateId, variables } = req.body;

      if (!templateId || !variables) {
        throw new Error('Missing templateId or variables');
      }

      const result = templateManager.applyTemplate(templateId, variables);

      if (!result) {
        throw new Error(`Template ${templateId} not found`);
      }

      res.status(200).json(
        new ApiResponse(200, { result }, 'Template applied successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get workflows
   */
  static async getWorkflows(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const presets = workflowOrchestrator.getPresetWorkflows();
      const workflows = workflowOrchestrator.listWorkflows();

      res.status(200).json(
        new ApiResponse(
          200,
          {
            presets: Array.from(presets.values()),
            custom: workflows,
            statistics: workflowOrchestrator.getStatistics(),
          },
          'Workflows retrieved successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get AI system statistics
   */
  static async getStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = {
        agents: orchestrator.getStatistics(),
        memory: contextMemory.getStatistics(),
        templates: templateManager.getStatistics(),
        workflows: workflowOrchestrator.getStatistics(),
      };

      res.status(200).json(
        new ApiResponse(200, stats, 'AI system statistics retrieved')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get agent capabilities
   */
  static async getAgentCapabilities(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const agents = orchestrator.getAllAgents();

      const capabilities = agents.map((agent) => ({
        id: agent.getId(),
        type: agent.getType(),
        status: agent.getStatus(),
      }));

      res.status(200).json(
        new ApiResponse(
          200,
          { capabilities, total: capabilities.length },
          'Agent capabilities retrieved'
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

export const aiController = new AIFeaturesController();
