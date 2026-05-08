/**
 * React hook for File Generation Engine
 * Manages file generation state and API calls
 */

import { useState, useCallback } from 'react';
import { FileState, FileSpec, ProjectStructure, UploadStatus } from '../types/fileGenerator.js';
import apiClient from '../utils/apiClient.js';

export const useFileGenerator = () => {
  const [state, setState] = useState<FileState>({
    generatedFiles: [],
    projectPath: null,
    projectName: null,
    projectSummary: null,
    loading: false,
    error: null,
    uploadProgress: 0,
    lastGeneratedTime: null,
  });

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    totalFiles: 0,
    processedFiles: 0,
    percentage: 0,
    currentFile: '',
    status: 'pending',
  });

  /**
   * Generate files
   */
  const generateFiles = useCallback(async (files: FileSpec[], projectName: string, basePath: string = './generated-projects') => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setUploadStatus({
      totalFiles: files.length,
      processedFiles: 0,
      percentage: 0,
      currentFile: '',
      status: 'processing',
    });

    try {
      const response = await apiClient.post('/filegen/generate-files', {
        files,
        projectName,
        basePath,
      });

      const { files: generatedFiles, projectPath } = response.data.data;

      setState((prev) => ({
        ...prev,
        generatedFiles,
        projectPath,
        projectName,
        loading: false,
        uploadProgress: 100,
        lastGeneratedTime: new Date().toISOString(),
      }));

      setUploadStatus({
        totalFiles: files.length,
        processedFiles: files.length,
        percentage: 100,
        currentFile: 'Completed',
        status: 'completed',
      });

      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate files';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      setUploadStatus((prev) => ({ ...prev, status: 'error' }));
      throw error;
    }
  }, []);

  /**
   * Generate complete project
   */
  const generateProject = useCallback(async (projectName: string, structure: ProjectStructure, basePath: string = './generated-projects') => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    setUploadStatus({
      totalFiles: (structure.files || []).length,
      processedFiles: 0,
      percentage: 0,
      currentFile: 'Generating project...',
      status: 'processing',
    });

    try {
      const response = await apiClient.post('/filegen/generate-project', {
        projectName,
        structure,
        basePath,
      });

      const { projectPath, files, folders, totalFiles } = response.data.data;

      setState((prev) => ({
        ...prev,
        projectPath,
        projectName,
        generatedFiles: files,
        loading: false,
        uploadProgress: 100,
        lastGeneratedTime: new Date().toISOString(),
      }));

      setUploadStatus({
        totalFiles,
        processedFiles: totalFiles,
        percentage: 100,
        currentFile: 'Project generated',
        status: 'completed',
      });

      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate project';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      setUploadStatus((prev) => ({ ...prev, status: 'error' }));
      throw error;
    }
  }, []);

  /**
   * Create single file
   */
  const createFile = useCallback(async (filePath: string, content: string, overwrite: boolean = true) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.post('/filegen/create-file', {
        filePath,
        content,
        overwrite,
      });

      const fileInfo = response.data.data;

      setState((prev) => ({
        ...prev,
        generatedFiles: [...prev.generatedFiles, fileInfo],
        loading: false,
        lastGeneratedTime: new Date().toISOString(),
      }));

      return fileInfo;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create file';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Update existing file
   */
  const updateFile = useCallback(async (filePath: string, content: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.post('/filegen/update-file', {
        filePath,
        content,
      });

      setState((prev) => ({ ...prev, loading: false }));
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update file';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Upsert file (create or update)
   */
  const upsertFile = useCallback(async (filePath: string, content: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.post('/filegen/upsert-file', {
        filePath,
        content,
      });

      const fileInfo = response.data.data;

      setState((prev) => ({
        ...prev,
        generatedFiles: fileInfo.created
          ? [...prev.generatedFiles, fileInfo]
          : prev.generatedFiles.map((f) => (f.filePath === filePath ? fileInfo : f)),
        loading: false,
        lastGeneratedTime: new Date().toISOString(),
      }));

      return fileInfo;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upsert file';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Create package.json
   */
  const createPackageJson = useCallback(async (projectPath: string, projectName: string, packageData: Record<string, any> = {}) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.post('/filegen/create-package-json', {
        projectPath,
        projectName,
        packageData,
      });

      setState((prev) => ({ ...prev, loading: false }));
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create package.json';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Create tsconfig.json
   */
  const createTsConfig = useCallback(async (projectPath: string, tsConfigData: Record<string, any> = {}) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.post('/filegen/create-tsconfig', {
        projectPath,
        tsConfigData,
      });

      setState((prev) => ({ ...prev, loading: false }));
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create tsconfig.json';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Get project summary
   */
  const getProjectSummary = useCallback(async (projectPath: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.post('/filegen/project-summary', {
        projectPath,
      });

      const summary = response.data.data;

      setState((prev) => ({
        ...prev,
        projectSummary: summary,
        loading: false,
      }));

      return summary;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to get project summary';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Delete file
   */
  const deleteFile = useCallback(async (filePath: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.post('/filegen/delete-file', {
        filePath,
      });

      setState((prev) => ({
        ...prev,
        generatedFiles: prev.generatedFiles.filter((f) => f.filePath !== filePath),
        loading: false,
      }));

      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete file';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Delete folder
   */
  const deleteFolder = useCallback(async (folderPath: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.post('/filegen/delete-folder', {
        folderPath,
      });

      setState((prev) => ({ ...prev, loading: false }));
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete folder';
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setState({
      generatedFiles: [],
      projectPath: null,
      projectName: null,
      projectSummary: null,
      loading: false,
      error: null,
      uploadProgress: 0,
      lastGeneratedTime: null,
    });
    setUploadStatus({
      totalFiles: 0,
      processedFiles: 0,
      percentage: 0,
      currentFile: '',
      status: 'pending',
    });
  }, []);

  return {
    // State
    generatedFiles: state.generatedFiles,
    projectPath: state.projectPath,
    projectName: state.projectName,
    projectSummary: state.projectSummary,
    loading: state.loading,
    error: state.error,
    uploadProgress: state.uploadProgress,
    lastGeneratedTime: state.lastGeneratedTime,
    uploadStatus,

    // Methods
    generateFiles,
    generateProject,
    createFile,
    updateFile,
    upsertFile,
    createPackageJson,
    createTsConfig,
    getProjectSummary,
    deleteFile,
    deleteFolder,
    reset,
  };
};

export default useFileGenerator;
