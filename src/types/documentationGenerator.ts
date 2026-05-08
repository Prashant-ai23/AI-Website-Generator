/**
 * TypeScript interfaces for Documentation Generator
 */

export interface DocConfig {
  projectName?: string;
  projectDescription?: string;
  projectVersion?: string;
  authorName?: string;
  authorEmail?: string;
  repoUrl?: string;
  docsUrl?: string;
  includeModules?: boolean;
  modules?: string[];
}

export interface GeneratedREADME {
  readme: string;
  fileName: string;
  size: number;
}

export interface GeneratedAPIDocs {
  apiDocs: string;
  fileName: string;
  size: number;
}

export interface GeneratedInstallationGuide {
  installationGuide: string;
  fileName: string;
  size: number;
}

export interface GeneratedArchitecture {
  architecture: string;
  fileName: string;
  size: number;
}

export interface GeneratedModuleDocs {
  modules: Record<string, string>;
  fileCount: number;
  totalSize: number;
}

export interface ModuleDocFile {
  moduleName: string;
  fileName: string;
  size: number;
}

export interface GeneratedDocs {
  readme: GeneratedREADME;
  apiDocs: GeneratedAPIDocs;
  installationGuide: GeneratedInstallationGuide;
  architecture: GeneratedArchitecture;
  modules: {
    files: ModuleDocFile[];
    count: number;
  };
  summary: {
    totalFiles: number;
    totalSize: number;
    timestamp: string;
  };
  readme: string;
  apiDocs: string;
  installationGuide: string;
  architecture: string;
  modules: Record<string, string>;
}

export interface DocGenerationRequest {
  docType?: 'readme' | 'api' | 'install' | 'architecture' | 'modules' | 'complete' | 'custom';
  projectName?: string;
  projectDescription?: string;
  projectVersion?: string;
  authorName?: string;
  authorEmail?: string;
  repoUrl?: string;
  docsUrl?: string;
  modules?: string[];
  includeModules?: boolean;
}

export interface DocGenerationResponse {
  statusCode: number;
  data: any;
  message: string;
  success?: boolean;
}

export interface DocState {
  readme: string | null;
  apiDocs: string | null;
  installationGuide: string | null;
  architecture: string | null;
  modules: Record<string, string> | null;
  allDocs: GeneratedDocs | null;
  loading: boolean;
  error: string | null;
  currentDocType: 'readme' | 'api' | 'install' | 'architecture' | 'modules' | 'complete' | null;
}

export interface DocExportOptions {
  format: 'md' | 'html' | 'pdf';
  includeAll: boolean;
  selectedDocs?: string[];
}
