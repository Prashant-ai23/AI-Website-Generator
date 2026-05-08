/**
 * React hook for Documentation Generator
 * Manages documentation generation state and API calls
 */

import { useState, useCallback } from 'react';
import { DocConfig, DocState, DocExportOptions } from '../types/documentationGenerator.js';
import apiClient from '../utils/apiClient.js';

export const useDocumentationGenerator = () => {
  const [state, setState] = useState<DocState>({
    readme: null,
    apiDocs: null,
    installationGuide: null,
    architecture: null,
    modules: null,
    allDocs: null,
    loading: false,
    error: null,
    currentDocType: null,
  });

  /**
   * Generate README.md
   */
  const generateREADME = useCallback(async (config: DocConfig) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.post('/docs/readme', config);
      setState((prev) => ({
        ...prev,
        readme: response.data.data.readme,
        currentDocType: 'readme',
        loading: false,
      }));
      return response.data.data.readme;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate README';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Generate API Documentation
   */
  const generateAPIDocumentation = useCallback(async (config: DocConfig) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.post('/docs/api', config);
      setState((prev) => ({
        ...prev,
        apiDocs: response.data.data.apiDocs,
        currentDocType: 'api',
        loading: false,
      }));
      return response.data.data.apiDocs;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate API documentation';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Generate Installation Guide
   */
  const generateInstallationGuide = useCallback(async (config: DocConfig) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.post('/docs/install', config);
      setState((prev) => ({
        ...prev,
        installationGuide: response.data.data.installationGuide,
        currentDocType: 'install',
        loading: false,
      }));
      return response.data.data.installationGuide;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate installation guide';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Generate Architecture Documentation
   */
  const generateArchitectureDocumentation = useCallback(async (config: DocConfig) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.post('/docs/architecture', config);
      setState((prev) => ({
        ...prev,
        architecture: response.data.data.architecture,
        currentDocType: 'architecture',
        loading: false,
      }));
      return response.data.data.architecture;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate architecture documentation';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Generate Module-wise Documentation
   */
  const generateModuleDocumentation = useCallback(async (config: DocConfig) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.post('/docs/modules', config);
      setState((prev) => ({
        ...prev,
        modules: response.data.data.modules,
        currentDocType: 'modules',
        loading: false,
      }));
      return response.data.data.modules;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate module documentation';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Generate Complete Documentation Package
   */
  const generateCompleteDocumentation = useCallback(async (config: DocConfig) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.post('/docs/complete', config);
      const { readme, apiDocs, installationGuide, architecture, modules } = response.data.data;
      
      setState((prev) => ({
        ...prev,
        readme,
        apiDocs,
        installationGuide,
        architecture,
        modules,
        allDocs: response.data.data,
        currentDocType: 'complete',
        loading: false,
      }));
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate complete documentation';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Generate custom documentation
   */
  const generateCustomDocumentation = useCallback(async (config: DocConfig & { docType?: string }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiClient.post('/docs/custom', config);
      setState((prev) => ({
        ...prev,
        allDocs: response.data.data,
        loading: false,
      }));
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate documentation';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Copy content to clipboard
   */
  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  /**
   * Download documentation as Markdown file
   */
  const downloadAsMarkdown = useCallback((content: string, fileName: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, []);

  /**
   * Download all documentation as JSON
   */
  const downloadAllAsJSON = useCallback((docs: any, projectName: string = 'project') => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(docs, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${projectName}-docs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, []);

  /**
   * Export documentation with selected format and options
   */
  const exportDocumentation = useCallback(
    async (docs: any, projectName: string, options: DocExportOptions) => {
      if (options.format === 'md') {
        if (options.includeAll) {
          // Export all as separate files
          if (docs.readme) downloadAsMarkdown(docs.readme, `${projectName}-README.md`);
          if (docs.apiDocs) downloadAsMarkdown(docs.apiDocs, `${projectName}-API_DOCS.md`);
          if (docs.installationGuide) downloadAsMarkdown(docs.installationGuide, `${projectName}-INSTALLATION.md`);
          if (docs.architecture) downloadAsMarkdown(docs.architecture, `${projectName}-ARCHITECTURE.md`);
          if (docs.modules) {
            Object.entries(docs.modules).forEach(([moduleName, content]: [string, any]) => {
              downloadAsMarkdown(content, `${projectName}-${moduleName}-MODULE.md`);
            });
          }
        } else if (options.selectedDocs) {
          // Export selected docs
          options.selectedDocs.forEach((docType) => {
            const content = docs[docType];
            if (content) {
              downloadAsMarkdown(content, `${projectName}-${docType}.md`);
            }
          });
        }
      } else if (options.format === 'json') {
        downloadAllAsJSON(docs, projectName);
      }
    },
    [downloadAsMarkdown, downloadAllAsJSON]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setState({
      readme: null,
      apiDocs: null,
      installationGuide: null,
      architecture: null,
      modules: null,
      allDocs: null,
      loading: false,
      error: null,
      currentDocType: null,
    });
  }, []);

  return {
    // State
    readme: state.readme,
    apiDocs: state.apiDocs,
    installationGuide: state.installationGuide,
    architecture: state.architecture,
    modules: state.modules,
    allDocs: state.allDocs,
    loading: state.loading,
    error: state.error,
    currentDocType: state.currentDocType,
    
    // Methods
    generateREADME,
    generateAPIDocumentation,
    generateInstallationGuide,
    generateArchitectureDocumentation,
    generateModuleDocumentation,
    generateCompleteDocumentation,
    generateCustomDocumentation,
    copyToClipboard,
    downloadAsMarkdown,
    downloadAllAsJSON,
    exportDocumentation,
    reset,
  };
};

export default useDocumentationGenerator;
