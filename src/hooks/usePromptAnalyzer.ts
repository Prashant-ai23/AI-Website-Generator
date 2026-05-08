import { useState, useCallback } from 'react';
import apiClient from '../utils/apiClient';

export interface Module {
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
  suggestedTechnologies?: string[];
  dependencies?: string[];
  features?: string[];
}

export interface AnalysisResult {
  appName: string;
  appType: string;
  appDescription: string;
  modules: Module[];
  estimatedScope: 'small' | 'medium' | 'large';
  estimatedDuration: string;
  keyTechnologies: string[];
  confidence: number;
}

interface UsePromptAnalyzerReturn {
  analysis: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  analyze: (prompt: string) => Promise<AnalysisResult>;
  quickAnalyze: (prompt: string) => Promise<any>;
  getSuggestions: (keyword: string) => Promise<any>;
  reset: () => void;
}

export const usePromptAnalyzer = (): UsePromptAnalyzerReturn => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (prompt: string): Promise<AnalysisResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<{
        data: AnalysisResult;
        statusCode: number;
        message: string;
      }>('/analyzer/analyze', { prompt });

      const result = response.data.data;
      setAnalysis(result);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to analyze prompt';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const quickAnalyze = useCallback(async (prompt: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/analyzer/quick-analyze', { prompt });
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to quick analyze';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSuggestions = useCallback(async (keyword: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/analyzer/suggestions', {
        params: { keyword },
      });
      return response.data.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to get suggestions';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    loading,
    error,
    analyze,
    quickAnalyze,
    getSuggestions,
    reset,
  };
};
