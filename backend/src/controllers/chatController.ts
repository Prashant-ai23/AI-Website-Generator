/**
 * Chat API Controller
 * Handles AI chat interactions and streaming responses
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import promptAnalyzer from '../services/promptAnalyzer.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

class ChatController {
  /**
   * Send chat message and get AI response
   */
  static async chat(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { message, history = [], projectContext } = req.body;

      if (!message) {
        throw new ApiError(400, 'Message is required');
      }

      // Analyze message to detect intent
      const analysis = promptAnalyzer.analyzePrompt(message);

      // Generate response based on analysis
      let responseText = '';
      const codeBlocks: any[] = [];
      let actionType = 'none';

      if (analysis.modules && analysis.modules.length > 0) {
        // If modules detected, suggest generation
        responseText = `I detected the following modules in your description: ${analysis.modules.join(', ')}\n\n`;
        responseText += `App Type: ${analysis.appType || 'Custom'}\n\n`;
        responseText += 'Would you like me to generate code for these modules? Click the "Generate" button to proceed.';
        actionType = 'generate';
      } else if (message.toLowerCase().includes('analyze')) {
        responseText = 'I can help analyze your project structure and provide insights. Please describe your project or provide more details.';
        actionType = 'analyze';
      } else if (message.toLowerCase().includes('document')) {
        responseText = 'I can help generate documentation for your project. Would you like me to create README, API docs, or architecture documentation?';
        actionType = 'document';
      } else {
        // Generic response
        responseText = `I understand you're interested in: "${message}". \n\nHow can I help? I can:\n- Generate code from your app description\n- Analyze your project structure\n- Generate comprehensive documentation\n- Create file structures and configurations`;
        actionType = 'none';
      }

      const response = new ApiResponse(
        200,
        {
          message: responseText,
          codeBlocks,
          action: actionType,
          actionData: {
            analysis,
            timestamp: new Date().toISOString(),
          },
        },
        'Chat response generated'
      );

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to process chat message'));
      }
    }
  }

  /**
   * Stream chat response for real-time updates
   */
  static async streamChat(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { message, history = [] } = req.body;

      if (!message) {
        throw new ApiError(400, 'Message is required');
      }

      // Set response headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Send opening bracket
      res.write('[\n');

      // Analyze and generate response
      const analysis = promptAnalyzer.analyzePrompt(message);

      // Stream first message
      const initialData = {
        type: 'analysis',
        data: analysis,
        timestamp: new Date().toISOString(),
      };
      res.write(JSON.stringify(initialData) + ',\n');

      // Stream response text
      const responseText = this.generateResponseText(message, analysis);
      for (const chunk of responseText.split(' ')) {
        const data = {
          type: 'message',
          chunk: chunk + ' ',
          timestamp: new Date().toISOString(),
        };
        res.write(JSON.stringify(data) + ',\n');
        await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate streaming
      }

      // Stream action suggestion
      const actionType = this.determineAction(message);
      const finalData = {
        type: 'complete',
        action: actionType,
        timestamp: new Date().toISOString(),
      };
      res.write(JSON.stringify(finalData) + '\n');
      res.write(']\n');
      res.end();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
      } else {
        res.status(500).json(new ApiResponse(500, null, 'Failed to stream chat message'));
      }
    }
  }

  /**
   * Get chat history for user
   */
  static async getHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      // In a real app, fetch from database
      const history = [
        {
          id: '1',
          role: 'user',
          content: 'Create a React e-commerce app',
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'assistant',
          content: 'I can help you create an e-commerce app with React. This would include product listings, shopping cart, and payment integration.',
          timestamp: new Date(),
        },
      ];

      res.status(200).json(new ApiResponse(200, { messages: history }, 'Chat history retrieved'));
    } catch (error) {
      res.status(500).json(new ApiResponse(500, null, 'Failed to retrieve chat history'));
    }
  }

  /**
   * Helper: Generate response text
   */
  private static generateResponseText(message: string, analysis: any): string {
    if (analysis.modules && analysis.modules.length > 0) {
      return `I detected the following modules in your description: ${analysis.modules.join(', ')}. App Type: ${analysis.appType || 'Custom'}. Would you like me to generate code for these modules?`;
    }
    return `I understand you're interested in: "${message}". How can I help? I can generate code, analyze projects, or create documentation.`;
  }

  /**
   * Helper: Determine action type
   */
  private static determineAction(message: string): string {
    if (message.toLowerCase().includes('generate')) return 'generate';
    if (message.toLowerCase().includes('analyze')) return 'analyze';
    if (message.toLowerCase().includes('document')) return 'document';
    return 'none';
  }
}

export default ChatController;
