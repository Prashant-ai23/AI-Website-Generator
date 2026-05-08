/**
 * Chat types and interfaces
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  codeBlocks?: CodeBlock[];
  generatedProject?: GeneratedProjectInfo;
}

export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

export interface GeneratedProjectInfo {
  projectName: string;
  projectPath: string;
  files: string[];
  folders: string[];
  totalSize: number;
}

export interface ChatRequest {
  message: string;
  history: ChatMessage[];
  projectContext?: Record<string, any>;
}

export interface ChatResponse {
  message: string;
  codeBlocks?: CodeBlock[];
  action?: 'generate' | 'analyze' | 'document' | 'none';
  actionData?: Record<string, any>;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentProject?: GeneratedProjectInfo;
  downloadUrl?: string;
}
