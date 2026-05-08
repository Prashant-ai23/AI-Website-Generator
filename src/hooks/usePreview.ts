/**
 * React hook for Live Preview
 */

import { useState, useCallback, useRef } from 'react';
import { PreviewState, PreviewFile, PreviewError } from '../types/preview.js';
import apiClient from '../utils/apiClient.js';

export const usePreview = () => {
  const [state, setState] = useState<PreviewState>({
    html: null,
    isLoading: false,
    errors: [],
    warnings: [],
    lastUpdate: null,
    autoRefresh: false,
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  /**
   * Generate preview from files
   */
  const generatePreview = useCallback(async (projectName: string, files: PreviewFile[], entryPoint: string) => {
    setState((prev) => ({ ...prev, isLoading: true, errors: [], warnings: [] }));

    try {
      const response = await apiClient.post('/preview/generate', {
        projectName,
        files,
        entryPoint,
      });

      const { html, errors, warnings } = response.data.data;

      setState((prev) => ({
        ...prev,
        html,
        errors: errors || [],
        warnings: warnings || [],
        isLoading: false,
        lastUpdate: new Date(),
      }));

      // Render in iframe
      if (iframeRef.current && html) {
        iframeRef.current.srcdoc = html;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate preview';
      setState((prev) => ({
        ...prev,
        errors: [
          {
            type: 'runtime',
            message: errorMessage,
            file: 'unknown',
          },
        ],
        isLoading: false,
      }));
    }
  }, []);

  /**
   * Stream preview updates
   */
  const streamPreview = useCallback((projectName: string, files: PreviewFile[], entryPoint: string) => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setState((prev) => ({ ...prev, isLoading: true, autoRefresh: true }));

    try {
      // For streaming, we'll use regular requests with interval
      let updateInterval: NodeJS.Timeout | null = null;

      const performUpdate = async () => {
        try {
          const response = await apiClient.post('/preview/generate', {
            projectName,
            files,
            entryPoint,
          });

          const { html, errors, warnings } = response.data.data;

          setState((prev) => ({
            ...prev,
            html,
            errors: errors || [],
            warnings: warnings || [],
            isLoading: false,
            lastUpdate: new Date(),
          }));

          if (iframeRef.current && html) {
            iframeRef.current.srcdoc = html;
          }
        } catch (error: any) {
          console.error('Stream update error:', error);
        }
      };

      // Initial update
      performUpdate();

      // Set up auto-refresh interval (every 2 seconds)
      updateInterval = setInterval(performUpdate, 2000);

      // Store interval for cleanup
      eventSourceRef.current = { close: () => clearInterval(updateInterval!) } as any;
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        autoRefresh: false,
      }));
    }
  }, []);

  /**
   * Preview a single component
   */
  const previewComponent = useCallback(async (filename: string, content: string, language: string = 'javascript') => {
    setState((prev) => ({ ...prev, isLoading: true, errors: [], warnings: [] }));

    try {
      const response = await apiClient.post('/preview/component', {
        filename,
        content,
        language,
      });

      const { html, errors, warnings } = response.data.data;

      setState((prev) => ({
        ...prev,
        html,
        errors: errors || [],
        warnings: warnings || [],
        isLoading: false,
        lastUpdate: new Date(),
      }));

      if (iframeRef.current && html) {
        iframeRef.current.srcdoc = html;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to preview component';
      setState((prev) => ({
        ...prev,
        errors: [
          {
            type: 'runtime',
            message: errorMessage,
            file: filename,
          },
        ],
        isLoading: false,
      }));
    }
  }, []);

  /**
   * Validate files
   */
  const validateFiles = useCallback(async (files: PreviewFile[]) => {
    try {
      const response = await apiClient.post('/preview/validate', { files });
      return response.data.data;
    } catch (error: any) {
      return {
        isValid: false,
        errors: [
          {
            type: 'validation',
            message: error.response?.data?.message || 'Validation failed',
            file: 'unknown',
          },
        ],
      };
    }
  }, []);

  /**
   * Stop streaming
   */
  const stopStreaming = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setState((prev) => ({ ...prev, autoRefresh: false }));
  }, []);

  /**
   * Refresh preview
   */
  const refreshPreview = useCallback((projectName: string, files: PreviewFile[], entryPoint: string) => {
    generatePreview(projectName, files, entryPoint);
  }, [generatePreview]);

  /**
   * Clear errors
   */
  const clearErrors = useCallback(() => {
    setState((prev) => ({ ...prev, errors: [], warnings: [] }));
  }, []);

  /**
   * Get iframe reference
   */
  const getIframeRef = useCallback(() => iframeRef, []);

  return {
    html: state.html,
    isLoading: state.isLoading,
    errors: state.errors,
    warnings: state.warnings,
    lastUpdate: state.lastUpdate,
    autoRefresh: state.autoRefresh,
    generatePreview,
    streamPreview,
    previewComponent,
    validateFiles,
    stopStreaming,
    refreshPreview,
    clearErrors,
    iframeRef,
    getIframeRef,
  };
};

export default usePreview;
