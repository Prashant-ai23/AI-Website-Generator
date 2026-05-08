import { Agent, CodeGeneratorAgent, CodeAnalyzerAgent, BugFixerAgent, OptimizerAgent } from './agents.js';
import { AgentType, AgentResponse, AgentContext } from './types.js';

/**
 * Orchestrates multiple AI agents to work together
 */
export class AgentOrchestrator {
  private agents: Map<AgentType, Agent> = new Map();
  private agentCounter: number = 0;

  constructor() {
    this.initializeAgents();
  }

  /**
   * Initialize all available agents
   */
  private initializeAgents(): void {
    this.registerAgent(new CodeGeneratorAgent(`agent-${++this.agentCounter}`));
    this.registerAgent(new CodeAnalyzerAgent(`agent-${++this.agentCounter}`));
    this.registerAgent(new BugFixerAgent(`agent-${++this.agentCounter}`));
    this.registerAgent(new OptimizerAgent(`agent-${++this.agentCounter}`));
  }

  /**
   * Register an agent
   */
  registerAgent(agent: Agent): void {
    this.agents.set(agent.getType(), agent);
  }

  /**
   * Get an agent by type
   */
  getAgent(agentType: AgentType): Agent | undefined {
    return this.agents.get(agentType);
  }

  /**
   * Get all agents
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Execute a single agent
   */
  async executeAgent(
    agentType: AgentType,
    input: Record<string, unknown>,
    context?: AgentContext
  ): Promise<AgentResponse> {
    const agent = this.getAgent(agentType);
    if (!agent) {
      throw new Error(`Agent type ${agentType} not found`);
    }

    if (context) {
      agent.setContext(context);
    }

    return agent.execute(input);
  }

  /**
   * Execute multiple agents in sequence
   */
  async executeSequence(
    agentTypes: AgentType[],
    input: Record<string, unknown>,
    context?: AgentContext
  ): Promise<AgentResponse[]> {
    const results: AgentResponse[] = [];
    let currentInput = input;

    for (const agentType of agentTypes) {
      const result = await this.executeAgent(agentType, currentInput, context);
      results.push(result);

      // Use the previous agent's result as input for the next agent
      if (result.result && typeof result.result === 'object') {
        currentInput = { ...currentInput, ...result.result };
      }
    }

    return results;
  }

  /**
   * Execute agents in parallel
   */
  async executeParallel(
    agentTypes: AgentType[],
    input: Record<string, unknown>,
    context?: AgentContext
  ): Promise<AgentResponse[]> {
    const promises = agentTypes.map((agentType) =>
      this.executeAgent(agentType, input, context)
    );

    return Promise.all(promises);
  }

  /**
   * Intelligent workflow: Analyze -> Generate -> Optimize
   */
  async analyzeAndGenerateWorkflow(
    description: string,
    context?: AgentContext
  ): Promise<{
    analysis: AgentResponse;
    generated: AgentResponse;
    optimized: AgentResponse;
  }> {
    // First, analyze the requirements
    const analysis = await this.executeAgent(
      AgentType.CODE_ANALYZER,
      { code: description },
      context
    );

    // Generate code based on analysis
    const generated = await this.executeAgent(
      AgentType.CODE_GENERATOR,
      { description, language: 'typescript' },
      context
    );

    // Optimize the generated code
    const optimized = await this.executeAgent(
      AgentType.OPTIMIZER,
      { code: generated.result },
      context
    );

    return { analysis, generated, optimized };
  }

  /**
   * Bug fixing workflow: Analyze -> Fix -> Optimize
   */
  async bugFixingWorkflow(
    code: string,
    error: string,
    context?: AgentContext
  ): Promise<{
    analysis: AgentResponse;
    fixes: AgentResponse;
    optimized: AgentResponse;
  }> {
    // Analyze the code
    const analysis = await this.executeAgent(
      AgentType.CODE_ANALYZER,
      { code },
      context
    );

    // Fix bugs
    const fixes = await this.executeAgent(
      AgentType.BUG_FIXER,
      { code, error },
      context
    );

    // Optimize the fixed code
    const optimized = await this.executeAgent(
      AgentType.OPTIMIZER,
      { code: fixes.result },
      context
    );

    return { analysis, fixes, optimized };
  }

  /**
   * Collaboration: Get insights from multiple agents
   */
  async collaborateOnCode(
    code: string,
    context?: AgentContext
  ): Promise<Record<string, AgentResponse>> {
    const [analysis, optimization] = await this.executeParallel(
      [AgentType.CODE_ANALYZER, AgentType.OPTIMIZER],
      { code },
      context
    );

    return {
      analysis,
      optimization,
    };
  }

  /**
   * Get agent statistics
   */
  getStatistics(): Record<string, unknown> {
    return {
      totalAgents: this.agents.size,
      agents: Array.from(this.agents.keys()),
      agentCounter: this.agentCounter,
    };
  }
}

// Export singleton instance
export const orchestrator = new AgentOrchestrator();
