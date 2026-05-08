import { useState, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import type {
  PageConfig,
  FormConfig,
  TableConfig,
  LayoutConfig,
  RoutingConfig,
  StylingLibrary,
} from '../types/codeGenerator';

export interface GeneratedCode {
  code: string;
  language: 'typescript' | 'javascript';
  framework: string;
  styling: StylingLibrary;
  metadata?: Record<string, any>;
}

interface UseCodeGeneratorReturn {
  code: GeneratedCode | null;
  loading: boolean;
  error: string | null;
  generatePage: (config: PageConfig) => Promise<GeneratedCode>;
  generateForm: (config: FormConfig) => Promise<GeneratedCode>;
  generateTable: (config: TableConfig) => Promise<GeneratedCode>;
  generateLayout: (config: LayoutConfig) => Promise<GeneratedCode>;
  generateRouting: (config: RoutingConfig) => Promise<GeneratedCode>;
  reset: () => void;
  copyToClipboard: (text: string) => void;
}

export const useCodeGenerator = (): UseCodeGeneratorReturn => {
  const [code, setCode] = useState<GeneratedCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = useCallback(
    async (endpoint: string, config: any): Promise<GeneratedCode> => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post<{
          data: GeneratedCode;
          statusCode: number;
          message: string;
        }>(`/codegen${endpoint}`, { config });

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

  const generatePage = useCallback(
    async (config: PageConfig): Promise<GeneratedCode> => {
      return makeRequest('/page', config);
    },
    [makeRequest]
  );

  const generateForm = useCallback(
    async (config: FormConfig): Promise<GeneratedCode> => {
      return makeRequest('/form', config);
    },
    [makeRequest]
  );

  const generateTable = useCallback(
    async (config: TableConfig): Promise<GeneratedCode> => {
      return makeRequest('/table', config);
    },
    [makeRequest]
  );

  const generateLayout = useCallback(
    async (config: LayoutConfig): Promise<GeneratedCode> => {
      return makeRequest('/layout', config);
    },
    [makeRequest]
  );

  const generateRouting = useCallback(
    async (config: RoutingConfig): Promise<GeneratedCode> => {
      return makeRequest('/routing', config);
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
    generatePage,
    generateForm,
    generateTable,
    generateLayout,
    generateRouting,
    reset,
    copyToClipboard,
  };
};
