import { useState, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import type { APIResourceConfig, APIGenerationOptions, GeneratedAPICode } from '../types/backendGenerator';

interface UseBackendGeneratorReturn {
  code: GeneratedAPICode | null;
  loading: boolean;
  error: string | null;
  generateModel: (config: APIResourceConfig, options?: APIGenerationOptions) => Promise<GeneratedAPICode>;
  generateService: (config: APIResourceConfig, options?: APIGenerationOptions) => Promise<GeneratedAPICode>;
  generateController: (config: APIResourceConfig, options?: APIGenerationOptions) => Promise<GeneratedAPICode>;
  generateRoutes: (config: APIResourceConfig, options?: APIGenerationOptions) => Promise<GeneratedAPICode>;
  generateValidation: (config: APIResourceConfig) => Promise<GeneratedAPICode>;
  generateCompleteAPI: (config: APIResourceConfig, options?: APIGenerationOptions) => Promise<GeneratedAPICode>;
  reset: () => void;
  copyToClipboard: (text: string) => void;
}

export const useBackendGenerator = (): UseBackendGeneratorReturn => {
  const [code, setCode] = useState<GeneratedAPICode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(
    async (endpoint: string, body: any): Promise<GeneratedAPICode> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<{
          data: GeneratedAPICode;
          statusCode: number;
          message: string;
        }>(`/apigen${endpoint}`, body);

        const result = response.data.data;
        setCode(result);
        return result;
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to generate code';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const generateModel = useCallback(
    async (config: APIResourceConfig, options?: APIGenerationOptions): Promise<GeneratedAPICode> => {
      return makeRequest('/model', { config, options });
    },
    [makeRequest]
  );

  const generateService = useCallback(
    async (config: APIResourceConfig, options?: APIGenerationOptions): Promise<GeneratedAPICode> => {
      return makeRequest('/service', { config, options });
    },
    [makeRequest]
  );

  const generateController = useCallback(
    async (config: APIResourceConfig, options?: APIGenerationOptions): Promise<GeneratedAPICode> => {
      return makeRequest('/controller', { config, options });
    },
    [makeRequest]
  );

  const generateRoutes = useCallback(
    async (config: APIResourceConfig, options?: APIGenerationOptions): Promise<GeneratedAPICode> => {
      return makeRequest('/routes', { config, options });
    },
    [makeRequest]
  );

  const generateValidation = useCallback(
    async (config: APIResourceConfig): Promise<GeneratedAPICode> => {
      return makeRequest('/validation', { config });
    },
    [makeRequest]
  );

  const generateCompleteAPI = useCallback(
    async (config: APIResourceConfig, options?: APIGenerationOptions): Promise<GeneratedAPICode> => {
      return makeRequest('/complete', { config, options });
    },
    [makeRequest]
  );

  const reset = useCallback(() => {
    setCode(null);
    setError(null);
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      alert('Failed to copy to clipboard');
    });
  }, []);

  return {
    code,
    loading,
    error,
    generateModel,
    generateService,
    generateController,
    generateRoutes,
    generateValidation,
    generateCompleteAPI,
    reset,
    copyToClipboard,
  };
};
