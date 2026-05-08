import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import promptAnalyzer from '../services/promptAnalyzer.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

export class AnalyzerController {
  /**
   * Analyze app idea prompt
   */
  async analyzePrompt(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        throw new ApiError(400, 'Prompt is required and must be a string');
      }

      if (prompt.trim().length < 5) {
        throw new ApiError(400, 'Prompt must be at least 5 characters long');
      }

      const analysis = promptAnalyzer.analyzePrompt(prompt);

      const response = new ApiResponse(200, analysis, 'Prompt analyzed successfully');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate quick analysis (without full details)
   */
  async quickAnalyze(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        throw new ApiError(400, 'Prompt is required');
      }

      const fullAnalysis = promptAnalyzer.analyzePrompt(prompt);

      // Return quick summary
      const quickSummary = {
        appName: fullAnalysis.appName,
        appType: fullAnalysis.appType,
        moduleCount: fullAnalysis.modules.length,
        modules: fullAnalysis.modules.map(m => ({
          name: m.name,
          priority: m.priority,
        })),
        estimatedScope: fullAnalysis.estimatedScope,
        confidence: fullAnalysis.confidence,
      };

      const response = new ApiResponse(200, quickSummary, 'Quick analysis completed');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get module suggestions for a specific keyword
   */
  async getSuggestions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { keyword } = req.query;

      if (!keyword || typeof keyword !== 'string') {
        throw new ApiError(400, 'Keyword is required');
      }

      // Analyze with keyword to get suggestions
      const analysis = promptAnalyzer.analyzePrompt(keyword);

      const suggestions = {
        keyword,
        suggestedModules: analysis.modules.map(m => ({
          name: m.name,
          description: m.description,
          priority: m.priority,
          complexity: m.estimatedComplexity,
        })),
        recommendedTechnologies: analysis.keyTechnologies,
      };

      const response = new ApiResponse(200, suggestions, 'Suggestions retrieved');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyzerController();
