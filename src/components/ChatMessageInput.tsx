/**
 * MessageInput Component
 * Input field for sending chat messages
 */

import React from 'react';
import { Send, Loader } from 'lucide-react';

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  onSubmit,
  isLoading,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your app idea or ask for help... (Shift+Enter for new line)"
        disabled={isLoading}
        rows={3}
        className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white p-3 rounded-lg transition-colors flex items-center justify-center min-w-12 h-full"
        title={isLoading ? 'Waiting for response...' : 'Send message (Ctrl+Enter)'}
      >
        {isLoading ? (
          <Loader size={20} className="animate-spin" />
        ) : (
          <Send size={20} />
        )}
      </button>
    </form>
  );
};

export default MessageInput;
