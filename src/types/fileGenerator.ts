/**
 * TypeScript interfaces for File Generation Engine
 */

export interface FileSpec {
  path: string;
  fileName?: string;
  content: string;
  fileType?: string;
}

export interface FolderSpec {
  folderName: string;
  subFolders?: string[];
}

export interface ProjectStructure {
  rootFolder: string;
  folders: FolderSpec[];
  files: FileSpec[];
}

export interface GeneratedFileInfo {
  filePath: string;
  fileName: string;
  size: number;
  created: boolean;
  updated: boolean;
  timestamp: string;
}

export interface ProjectGenerationResult {
  projectPath: string;
  projectName: string;
  files: GeneratedFileInfo[];
  folders: string[];
  totalFiles: number;
  totalSize: number;
  timestamp: string;
  status: 'success' | 'partial' | 'failed';
  errors: string[];
}

export interface ProjectSummary {
  projectPath: string;
  totalFiles: number;
  totalSize: number;
  folders: string[];
  files: string[];
}

export interface FileGenerationRequest {
  files?: FileSpec[];
  projectName?: string;
  basePath?: string;
  structure?: ProjectStructure;
  filePath?: string;
  content?: string;
  overwrite?: boolean;
  folderPath?: string;
  projectPath?: string;
  packageData?: Record<string, any>;
  tsConfigData?: Record<string, any>;
}

export interface FileGenerationResponse {
  statusCode: number;
  data: any;
  message: string;
  success?: boolean;
}

export interface FileState {
  generatedFiles: GeneratedFileInfo[];
  projectPath: string | null;
  projectName: string | null;
  projectSummary: ProjectSummary | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
  lastGeneratedTime: string | null;
}

export interface UploadStatus {
  totalFiles: number;
  processedFiles: number;
  percentage: number;
  currentFile: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface ProjectTemplate {
  name: string;
  description: string;
  structure: ProjectStructure;
  packageData?: Record<string, any>;
}
