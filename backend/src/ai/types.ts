/**
 * AI Agent System - Types and Interfaces
 */

export enum AgentType {
  CODE_GENERATOR = 'code_generator',
  CODE_ANALYZER = 'code_analyzer',
  BUG_FIXER = 'bug_fixer',
  OPTIMIZER = 'optimizer',
  ARCHITECT = 'architect',
  DOCUMENTATION = 'documentation',
  TEST_GENERATOR = 'test_generator',
}

export enum AgentStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface AgentContext {
  conversationId: string;
  userId: string;
  codeSnippet?: string;
  codeLanguage?: string;
  projectContext?: Record<string, unknown>;
  previousResults?: Record<string, unknown>;
  timestamp: Date;
}

export interface AgentMessage {
  agentId: string;
  agentType: AgentType;
  message: string;
  data?: Record<string, unknown>;
  status: AgentStatus;
  timestamp: Date;
}

export interface AgentResponse {
  agentId: string;
  agentType: AgentType;
  result: unknown;
  reasoning?: string;
  confidence?: number;
  status: AgentStatus;
  executionTime?: number;
  metadata?: Record<string, unknown>;
}

export interface ContextMemoryEntry {
  id: string;
  conversationId: string;
  agentType: AgentType;
  content: string;
  context: Record<string, unknown>;
  embedding?: number[];
  timestamp: Date;
  relevanceScore?: number;
}

export interface RAGQuery {
  query: string;
  conversationId: string;
  topK?: number;
  threshold?: number;
}

export interface RAGResult {
  query: string;
  results: {
    source: string;
    content: string;
    similarity: number;
    metadata?: Record<string, unknown>;
  }[];
  context: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  agentType: AgentType;
  content: string;
  variables?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  agentType: AgentType;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: AgentStatus;
  executionTime?: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: AgentStatus;
  createdAt: Date;
  executionHistory?: {
    startTime: Date;
    endTime: Date;
    totalTime: number;
  }[];
}

export interface BugReport {
  id: string;
  code: string;
  language: string;
  errorMessage: string;
  stackTrace?: string;
  suggestions: string[];
  fixes: string[];
  confidence: number;
}

export interface OptimizationResult {
  originalCode: string;
  optimizedCode: string;
  improvements: {
    metric: string;
    improvement: string;
  }[];
  explanation: string;
  complexity: {
    original: string;
    optimized: string;
  };
}
