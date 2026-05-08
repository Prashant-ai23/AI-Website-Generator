/**
 * Preview types and interfaces
 */

export interface PreviewFile {
  filename: string;
  content: string;
  language: string;
  type: 'component' | 'page' | 'style' | 'config';
}

export interface PreviewProject {
  projectId: string;
  projectName: string;
  files: PreviewFile[];
  entryPoint: string; // Main file to render
  dependencies?: Record<string, string>;
}

export interface PreviewRequest {
  projectId?: string;
  projectName: string;
  files: PreviewFile[];
  entryPoint: string;
  autoRefresh?: boolean;
}

export interface PreviewResponse {
  success: boolean;
  html: string;
  errors: PreviewError[];
  warnings: string[];
  timestamp: Date;
}

export interface PreviewError {
  type: 'syntax' | 'runtime' | 'compilation';
  message: string;
  file: string;
  line?: number;
  column?: number;
}

export interface PreviewState {
  html: string | null;
  isLoading: boolean;
  errors: PreviewError[];
  warnings: string[];
  lastUpdate: Date | null;
  autoRefresh: boolean;
}
