/**
 * CodePreview Component
 * Full-screen code preview with syntax highlighting
 */

import React, { useState } from 'react';
import { X, Copy, Download } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface CodePreviewProps {
  codeBlock: {
    language: string;
    code: string;
    filename?: string;
  };
  onClose: () => void;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ codeBlock, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeBlock.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([codeBlock.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = codeBlock.filename || `code.${getFileExtension(codeBlock.language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      go: 'go',
      rust: 'rs',
      html: 'html',
      css: 'css',
      json: 'json',
      xml: 'xml',
      yaml: 'yaml',
      bash: 'sh',
    };
    return extensions[language] || language;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-700 p-4 border-b border-slate-600 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {codeBlock.filename || `${codeBlock.language} Code`}
          </h2>
          <p className="text-sm text-slate-400 mt-1">{codeBlock.language}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-600 rounded transition-colors text-slate-300 hover:text-slate-100"
        >
          <X size={24} />
        </button>
      </div>

      {/* Code Container */}
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language={codeBlock.language || 'plaintext'}
          style={atomOneDark}
          customStyle={{
            margin: 0,
            padding: '20px',
            backgroundColor: '#1e293b',
            fontSize: '14px',
            lineHeight: '1.6',
            height: '100%',
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {codeBlock.code}
        </SyntaxHighlighter>
      </div>

      {/* Footer with Actions */}
      <div className="bg-slate-700 p-4 border-t border-slate-600 flex gap-2">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-slate-600 hover:bg-slate-500 text-slate-200'
          }`}
        >
          <Copy size={18} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          <Download size={18} />
          Download
        </button>
      </div>
    </div>
  );
};

export default CodePreview;
