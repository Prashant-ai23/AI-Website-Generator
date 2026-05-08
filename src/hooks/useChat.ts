/**
 * React hook for Chat operations
 */

import { useState, useCallback, useRef } from 'react';
import { ChatMessage, ChatState } from '../types/chat.js';
import apiClient from '../utils/apiClient.js';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Send a chat message
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await apiClient.post('/chat/message', {
        message: content,
        history: state.messages,
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: response.data.data.message,
        timestamp: new Date(),
        codeBlocks: response.data.data.codeBlocks,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));

      scrollToBottom();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to get response';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [state.messages]);

  /**
   * Stream chat response
   */
  const streamMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await apiClient.post('/chat/stream', {
        message: content,
        history: state.messages,
      });

      let fullMessage = '';
      let codeBlocks = [];

      if (Array.isArray(response.data)) {
        for (const chunk of response.data) {
          if (chunk.type === 'message' && chunk.chunk) {
            fullMessage += chunk.chunk;
          } else if (chunk.type === 'analysis') {
            // Handle analysis data
          }
        }
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-response`,
        role: 'assistant',
        content: fullMessage,
        timestamp: new Date(),
        codeBlocks,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));

      scrollToBottom();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to stream response';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [state.messages]);

  /**
   * Load chat history
   */
  const loadHistory = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await apiClient.get('/chat/history');
      setState((prev) => ({
        ...prev,
        messages: response.data.data.messages,
        isLoading: false,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to load history',
        isLoading: false,
      }));
    }
  }, []);

  /**
   * Clear messages
   */
  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
      error: null,
    }));
  }, []);

  /**
   * Delete a message
   */
  const deleteMessage = useCallback((messageId: string) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.filter((msg) => msg.id !== messageId),
    }));
  }, []);

  /**
   * Edit a message
   */
  const editMessage = useCallback((messageId: string, newContent: string) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      ),
    }));
  }, []);

  /**
   * Download project
   */
  const downloadProject = useCallback(async (projectPath: string) => {
    try {
      const response = await apiClient.post(
        '/filegen/zip-project',
        { projectPath },
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `project-${Date.now()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: 'Failed to download project',
      }));
    }
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    currentProject: state.currentProject,
    sendMessage,
    streamMessage,
    loadHistory,
    clearMessages,
    deleteMessage,
    editMessage,
    downloadProject,
    messagesEndRef,
  };
};

export default useChat;
