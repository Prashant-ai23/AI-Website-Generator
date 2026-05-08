import { AgentType, AgentStatus, AgentResponse, AgentContext } from './types.js';

/**
 * Base class for all AI agents
 */
export abstract class Agent {
  protected agentId: string;
  protected agentType: AgentType;
  protected status: AgentStatus = AgentStatus.IDLE;
  protected context?: AgentContext;

  constructor(agentId: string, agentType: AgentType) {
    this.agentId = agentId;
    this.agentType = agentType;
  }

  /**
   * Get agent ID
   */
  getId(): string {
    return this.agentId;
  }

  /**
   * Get agent type
   */
  getType(): AgentType {
    return this.agentType;
  }

  /**
   * Get current status
   */
  getStatus(): AgentStatus {
    return this.status;
  }

  /**
   * Set context for agent
   */
  setContext(context: AgentContext): void {
    this.context = context;
  }

  /**
   * Execute agent task - must be implemented by subclasses
   */
  abstract execute(input: Record<string, unknown>): Promise<AgentResponse>;

  /**
   * Process and analyze input
   */
  protected async process(input: Record<string, unknown>): Promise<unknown> {
    this.status = AgentStatus.PROCESSING;
    try {
      const result = await this.analyze(input);
      this.status = AgentStatus.COMPLETED;
      return result;
    } catch (error) {
      this.status = AgentStatus.ERROR;
      throw error;
    }
  }

  /**
   * Analyze input - implement in subclasses
   */
  protected abstract analyze(input: Record<string, unknown>): Promise<unknown>;

  /**
   * Create response object
   */
  protected createResponse(
    result: unknown,
    reasoning?: string,
    confidence?: number,
    metadata?: Record<string, unknown>
  ): AgentResponse {
    return {
      agentId: this.agentId,
      agentType: this.agentType,
      result,
      reasoning,
      confidence,
      status: this.status,
      metadata,
    };
  }

  /**
   * Validate agent input
   */
  protected validateInput(input: Record<string, unknown>, required: string[]): boolean {
    return required.every((key) => key in input && input[key] != null);
  }
}

/**
 * Code Generation Agent
 */
export class CodeGeneratorAgent extends Agent {
  constructor(agentId: string) {
    super(agentId, AgentType.CODE_GENERATOR);
  }

  async execute(input: Record<string, unknown>): Promise<AgentResponse> {
    if (!this.validateInput(input, ['description'])) {
      throw new Error('Missing required input: description');
    }

    const startTime = Date.now();
    const result = await this.process(input);
    const executionTime = Date.now() - startTime;

    return {
      ...this.createResponse(result, 'Code generated successfully', 0.95),
      executionTime,
    };
  }

  protected async analyze(input: Record<string, unknown>): Promise<unknown> {
    const description = input.description as string;
    const language = (input.language as string) || 'javascript';

    // Simulate code generation with AI
    return {
      code: `// Generated from: ${description}\n// Language: ${language}\n\n// TODO: Implement the above description`,
      language,
      suggestions: ['Add error handling', 'Add comments', 'Add type definitions'],
    };
  }
}

/**
 * Code Analysis Agent
 */
export class CodeAnalyzerAgent extends Agent {
  constructor(agentId: string) {
    super(agentId, AgentType.CODE_ANALYZER);
  }

  async execute(input: Record<string, unknown>): Promise<AgentResponse> {
    if (!this.validateInput(input, ['code'])) {
      throw new Error('Missing required input: code');
    }

    const startTime = Date.now();
    const result = await this.process(input);
    const executionTime = Date.now() - startTime;

    return {
      ...this.createResponse(result, 'Code analysis completed', 0.92),
      executionTime,
    };
  }

  protected async analyze(input: Record<string, unknown>): Promise<unknown> {
    const code = input.code as string;

    return {
      metrics: {
        complexity: 'medium',
        maintainability: 75,
        readability: 82,
        performance: 78,
      },
      issues: [
        'Consider breaking down long functions',
        'Add JSDoc comments',
        'Consider using constants for magic numbers',
      ],
      suggestions: [
        'Extract repeated code into functions',
        'Use design patterns where appropriate',
        'Add unit tests',
      ],
    };
  }
}

/**
 * Bug Fix Agent
 */
export class BugFixerAgent extends Agent {
  constructor(agentId: string) {
    super(agentId, AgentType.BUG_FIXER);
  }

  async execute(input: Record<string, unknown>): Promise<AgentResponse> {
    if (!this.validateInput(input, ['code', 'error'])) {
      throw new Error('Missing required input: code and error');
    }

    const startTime = Date.now();
    const result = await this.process(input);
    const executionTime = Date.now() - startTime;

    return {
      ...this.createResponse(result, 'Bug fix analysis completed', 0.88),
      executionTime,
    };
  }

  protected async analyze(input: Record<string, unknown>): Promise<unknown> {
    const code = input.code as string;
    const error = input.error as string;

    return {
      issue: error,
      rootCause: 'Analyzing root cause...',
      fixes: [
        {
          description: 'Fix 1: Add null check',
          code: '// if (value === null) return;',
          explanation: 'Prevent null pointer exceptions',
        },
        {
          description: 'Fix 2: Validate input',
          code: '// if (!isValid(input)) throw new Error(...)',
          explanation: 'Validate input before processing',
        },
      ],
      recommendations: [
        'Add type checking',
        'Implement error boundaries',
        'Add comprehensive logging',
      ],
    };
  }
}

/**
 * Code Optimizer Agent
 */
export class OptimizerAgent extends Agent {
  constructor(agentId: string) {
    super(agentId, AgentType.OPTIMIZER);
  }

  async execute(input: Record<string, unknown>): Promise<AgentResponse> {
    if (!this.validateInput(input, ['code'])) {
      throw new Error('Missing required input: code');
    }

    const startTime = Date.now();
    const result = await this.process(input);
    const executionTime = Date.now() - startTime;

    return {
      ...this.createResponse(result, 'Code optimization completed', 0.85),
      executionTime,
    };
  }

  protected async analyze(input: Record<string, unknown>): Promise<unknown> {
    const code = input.code as string;

    return {
      originalComplexity: 'O(n²)',
      optimizedComplexity: 'O(n log n)',
      improvements: [
        {
          metric: 'Time Complexity',
          from: 'O(n²)',
          to: 'O(n log n)',
          improvement: '50-90% faster',
        },
        {
          metric: 'Memory Usage',
          from: '2n + 1000',
          to: 'n + 500',
          improvement: '40-50% less memory',
        },
      ],
      optimizedCode: '// Optimized version of the code',
      explanation: 'Using binary search instead of linear search',
    };
  }
}
