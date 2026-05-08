/**
 * ChatInterface Component
 * Main chat UI component with message history and code preview
 */

import React, { useEffect, useState } from 'react';
import useChat from '../hooks/useChat';
import { MessageList } from './ChatMessageList';
import { MessageInput } from './ChatMessageInput';
import { CodePreview } from './CodePreview';
import { Send, Trash2, RefreshCw, Download } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const {
    messages,
    isLoading,
    error,
    currentProject,
    sendMessage,
    streamMessage,
    loadHistory,
    clearMessages,
    deleteMessage,
    editMessage,
    downloadProject,
    messagesEndRef,
  } = useChat();

  const [input, setInput] = useState('');
  const [selectedCodeBlock, setSelectedCodeBlock] = useState<any>(null);
  const [useStreaming, setUseStreaming] = useState(true);

  useEffect(() => {
    // Load chat history on mount
    loadHistory();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');

    if (useStreaming) {
      streamMessage(message);
    } else {
      sendMessage(message);
    }
  };

  const handleDownload = () => {
    if (currentProject?.projectPath) {
      downloadProject(currentProject.projectPath);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 border-b border-slate-600 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Code Generator
              </h1>
              <p className="text-slate-400 mt-1">Chat with AI to generate code and projects</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300 hover:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useStreaming}
                  onChange={(e) => setUseStreaming(e.target.checked)}
                  className="w-4 h-4"
                />
                Streaming
              </label>
              <button
                onClick={() => loadHistory()}
                className="p-2 hover:bg-slate-600 rounded transition-colors"
                title="Refresh history"
              >
                <RefreshCw size={20} />
              </button>
              {messages.length > 0 && (
                <button
                  onClick={clearMessages}
                  className="p-2 hover:bg-red-600 rounded transition-colors text-red-400 hover:text-red-300"
                  title="Clear messages"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-slate-900 p-6">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onCodeBlockClick={setSelectedCodeBlock}
            onDeleteMessage={deleteMessage}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 p-4 m-4">
            <p className="text-red-200">
              <span className="font-bold">Error:</span> {error}
            </p>
          </div>
        )}

        {/* Project Info */}
        {currentProject && (
          <div className="bg-green-900 border-l-4 border-green-500 p-4 m-4">
            <div className="text-green-200">
              <p className="font-bold">Project Generated: {currentProject.projectName}</p>
              <p className="text-sm mt-1">Files: {currentProject.files.length} | Size: {currentProject.totalSize} bytes</p>
              <button
                onClick={handleDownload}
                className="mt-2 bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm flex items-center gap-2"
              >
                <Download size={16} />
                Download Project
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-slate-800 p-4 border-t border-slate-600">
          <MessageInput
            input={input}
            setInput={setInput}
            onSubmit={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Code Preview Sidebar */}
      {selectedCodeBlock && (
        <div className="w-1/2 bg-slate-800 border-l border-slate-600 flex flex-col">
          <CodePreview
            codeBlock={selectedCodeBlock}
            onClose={() => setSelectedCodeBlock(null)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
