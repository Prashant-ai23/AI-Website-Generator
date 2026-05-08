import React, { useState, useRef } from 'react';
import {
  Copy,
  Download,
  Save,
  X,
  ChevronLeft,
  Loader,
} from 'lucide-react';

interface CodeFile {
  _id: string;
  fileName: string;
  content: string;
  language: string;
  fileType: string;
  category: string;
  size: number;
}

interface CodeEditorProps {
  file: CodeFile;
  projectId?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ file, projectId }) => {
  const [code, setCode] = useState(file.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/v1/ai-generator/files/${file._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: code }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      // Show success message
      alert('File saved successfully');
    } catch (error) {
      alert('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file_blob = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file_blob);
    element.download = file.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">
                {file.language.substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{file.fileName}</h3>
            <p className="text-xs text-gray-500 truncate">{file.filePath}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Copy to clipboard"
          >
            <Copy className={`w-4 h-4 ${isCopied ? 'text-green-600' : 'text-gray-600'}`} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Download file"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 hover:bg-blue-100 rounded transition-colors disabled:opacity-50"
            title="Save changes"
          >
            {isSaving ? (
              <Loader className="w-4 h-4 text-blue-600 animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-blue-600" />
            )}
          </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>Language: <strong>{file.language}</strong></span>
          <span>Type: <strong className="capitalize">{file.fileType}</strong></span>
          <span>Lines: <strong>{lineCount}</strong></span>
          <span>Size: <strong>{(file.size / 1024).toFixed(1)} KB</strong></span>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line numbers */}
        <div className="bg-gray-900 text-gray-500 p-4 text-right font-mono text-xs select-none overflow-hidden">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-6 leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code */}
        <textarea
          ref={editorRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none border-0"
          spellCheck="false"
        />
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
        <div>
          {code !== file.content && (
            <span className="text-orange-600 font-medium">
              • Unsaved changes (click Save to persist)
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || code === file.content}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs font-medium"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
