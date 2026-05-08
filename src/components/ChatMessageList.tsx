/**
 * MessageList Component
 * Displays all chat messages with code blocks
 */

import React from 'react';
import { ChatMessage } from '../types/chat';
import { Trash2, Copy, Code } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onCodeBlockClick?: (codeBlock: any) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  onCodeBlockClick,
  onDeleteMessage,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <div className="text-center">
          <Code size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No messages yet</p>
          <p className="text-sm mt-2">Start a conversation to generate code and projects</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="group animate-fadeIn">
          {/* Message Bubble */}
          <div
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`max-w-2xl px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-700 text-slate-100 rounded-bl-none'
              } shadow-lg`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              <p className="text-xs mt-2 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {/* Delete Button */}
            {onDeleteMessage && (
              <button
                onClick={() => onDeleteMessage(message.id)}
                className="ml-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 rounded transition-all text-red-400 hover:text-red-200"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Code Blocks */}
          {message.codeBlocks && message.codeBlocks.length > 0 && (
            <div className="space-y-2 mb-4">
              {message.codeBlocks.map((codeBlock, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-lg overflow-hidden border border-slate-600 hover:border-blue-500 transition-colors group/code"
                >
                  {/* Code Block Header */}
                  <div className="bg-slate-700 px-4 py-2 flex items-center justify-between">
                    <span className="text-sm font-mono text-slate-300">
                      {codeBlock.filename || codeBlock.language}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(codeBlock.code)}
                        className="p-1 hover:bg-slate-600 rounded text-slate-300 hover:text-slate-100"
                        title="Copy code"
                      >
                        <Copy size={16} />
                      </button>
                      {onCodeBlockClick && (
                        <button
                          onClick={() => onCodeBlockClick(codeBlock)}
                          className="p-1 hover:bg-slate-600 rounded text-slate-300 hover:text-slate-100"
                          title="Preview in full screen"
                        >
                          <Code size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Code Block Content */}
                  <div className="max-h-60 overflow-y-auto">
                    <SyntaxHighlighter
                      language={codeBlock.language || 'plaintext'}
                      style={atomOneDark}
                      customStyle={{
                        margin: 0,
                        padding: '16px',
                        backgroundColor: '#1e293b',
                      }}
                    >
                      {codeBlock.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Loading Animation */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-slate-700 px-4 py-3 rounded-lg rounded-bl-none">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
