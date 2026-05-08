/**
 * Preview Types
 */

export interface PreviewFile {
  filename: string;
  content: string;
  language?: string;
  type?: 'component' | 'page' | 'style' | 'config';
}

export interface PreviewProject {
  projectId: string;
  projectName: string;
  files: PreviewFile[];
  entryPoint: string;
}

export interface PreviewRequest {
  projectId?: string;
  projectName: string;
  files: PreviewFile[];
  entryPoint: string;
  autoRefresh?: boolean;
}

export interface PreviewError {
  type: 'syntax' | 'runtime' | 'compilation' | 'validation';
  message: string;
  file?: string;
  line?: number;
  column?: number;
}

export interface PreviewResponse {
  success: boolean;
  html?: string;
  errors?: PreviewError[];
  warnings?: string[];
  timestamp?: string;
}

export interface PreviewState {
  html: string | null;
  isLoading: boolean;
  errors: PreviewError[];
  warnings: string[];
  lastUpdate: Date | null;
  autoRefresh: boolean;
}
