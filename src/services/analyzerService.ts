import apiClient from '../utils/apiClient';
import type { AnalysisResult } from '../hooks/usePromptAnalyzer';

export interface AnalyzerResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

class AnalyzerService {
  /**
   * Analyze app idea prompt
   */
  async analyzePrompt(prompt: string): Promise<AnalysisResult> {
    try {
      const response = await apiClient.post<AnalyzerResponse<AnalysisResult>>(
        '/analyzer/analyze',
        { prompt }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to analyze prompt');
    }
  }

  /**
   * Quick analysis without full details
   */
  async quickAnalyze(prompt: string): Promise<any> {
    try {
      const response = await apiClient.post<AnalyzerResponse<any>>(
        '/analyzer/quick-analyze',
        { prompt }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to quick analyze');
    }
  }

  /**
   * Get module suggestions for a keyword
   */
  async getSuggestions(keyword: string): Promise<any> {
    try {
      const response = await apiClient.get<AnalyzerResponse<any>>(
        '/analyzer/suggestions',
        { params: { keyword } }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get suggestions');
    }
  }
}

export default new AnalyzerService();
