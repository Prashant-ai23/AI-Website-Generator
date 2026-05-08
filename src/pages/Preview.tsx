/**
 * Preview Page
 * Full-page live preview with code editor
 */

import React, { useState } from 'react';
import LivePreview from '../components/LivePreview';
import { PreviewFile } from '../types/preview';
import { Plus, Trash2, Copy } from 'lucide-react';

const PreviewPage: React.FC = () => {
  const [projectName, setProjectName] = useState('My Project');
  const [files, setFiles] = useState<PreviewFile[]>([
    {
      filename: 'App.jsx',
      content: `export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Live Preview</h1>
      <p>Edit the code to see changes in real-time</p>
      <button style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#0ea5e9',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Click Me
      </button>
    </div>
  );
}`,
      language: 'javascript',
      type: 'component',
    },
  ]);
  const [entryPoint, setEntryPoint] = useState('App.jsx');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  const handleAddFile = () => {
    const newFile: PreviewFile = {
      filename: `Component${files.length}.jsx`,
      content: 'export default function Component() {\n  return <div>New Component</div>;\n}',
      language: 'javascript',
      type: 'component',
    };
    setFiles([...files, newFile]);
  };

  const handleDeleteFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (selectedFileIndex >= newFiles.length) {
      setSelectedFileIndex(Math.max(0, newFiles.length - 1));
    }
  };

  const handleUpdateFile = (index: number, content: string) => {
    const newFiles = [...files];
    newFiles[index].content = content;
    setFiles(newFiles);
  };

  const currentFile = files[selectedFileIndex];

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar - File Editor */}
      <div className="w-1/3 flex flex-col bg-slate-800 border-r border-slate-700 overflow-hidden">
        {/* File List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold mb-3">Files ({files.length})</h3>
            <button
              onClick={handleAddFile}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm"
            >
              <Plus size={16} />
              Add File
            </button>
          </div>

          <div className="p-2">
            {files.map((file, index) => (
              <div
                key={index}
                className={`p-3 rounded mb-2 cursor-pointer transition-colors ${
                  selectedFileIndex === index
                    ? 'bg-blue-600'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div
                  className="flex items-center justify-between"
                  onClick={() => setSelectedFileIndex(index)}
                >
                  <span className="text-sm font-mono">{file.filename}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(index);
                    }}
                    className="p-1 hover:bg-red-600 rounded text-red-400 hover:text-red-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Settings */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Entry Point</label>
            <select
              value={entryPoint}
              onChange={(e) => setEntryPoint(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            >
              {files.map((file) => (
                <option key={file.filename} value={file.filename}>
                  {file.filename}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-slate-300">Auto Refresh</span>
          </label>
        </div>
      </div>

      {/* Code Editor */}
      <div className="w-1/3 flex flex-col bg-slate-800 border-r border-slate-700">
        {currentFile ? (
          <>
            {/* Editor Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h4 className="font-semibold text-sm">{currentFile.filename}</h4>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(currentFile.content)
                }
                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200"
              >
                <Copy size={16} />
              </button>
            </div>

            {/* Code Input */}
            <textarea
              value={currentFile.content}
              onChange={(e) =>
                handleUpdateFile(selectedFileIndex, e.target.value)
              }
              className="flex-1 px-4 py-3 bg-slate-900 text-slate-100 font-mono text-sm resize-none focus:outline-none border-0"
              spellCheck="false"
              style={{
                lineHeight: '1.6',
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            No files available
          </div>
        )}
      </div>

      {/* Live Preview */}
      <div className="w-1/3 flex flex-col">
        {files.length > 0 ? (
          <LivePreview
            projectName={projectName}
            files={files}
            entryPoint={entryPoint}
            autoRefresh={autoRefresh}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            Add files to see preview
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
