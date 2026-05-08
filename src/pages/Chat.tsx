/**
 * Chat Page
 * Main page for the AI chat interface
 */

import React from 'react';
import ChatInterface from '../components/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="w-full h-screen bg-slate-900">
      <ChatInterface />
    </div>
  );
};

export default ChatPage;
