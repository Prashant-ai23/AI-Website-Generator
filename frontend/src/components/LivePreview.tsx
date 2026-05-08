import React, { useState, useEffect } from 'react';
import { Copy, Download, Eye, Code, ChevronDown } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FileItem {
  fileName: string;
  filePath: string;
  content: string;
  fileType: string;
}

interface LivePreviewProps {
  files: FileItem[];
  projectName: string;
  onDownload?: (filePath: string) => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  files,
  projectName,
  onDownload,
}) => {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0]);
    }
  }, [files, selectedFile]);

  const getLanguage = (filePath: string): string => {
    const ext = filePath.split('.').pop() || 'txt';
    const langMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      json: 'json',
      md: 'markdown',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sql: 'sql',
      env: 'bash',
      yml: 'yaml',
      yaml: 'yaml',
    };
    return langMap[ext] || 'text';
  };

  const copyToClipboard = (): void => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadFile = (): void => {
    if (selectedFile && onDownload) {
      onDownload(selectedFile.filePath);
    }
  };

  const buildFileTree = (
    files: FileItem[]
  ): Record<string, FileItem[] | Record<string, any>> => {
    const tree: Record<string, any> = {};

    files.forEach((file) => {
      const parts = file.filePath.split('/');
      let current = tree;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }

      const fileName = parts[parts.length - 1];
      if (!current['__files__']) {
        current['__files__'] = [];
      }
      current['__files__'].push(file);
    });

    return tree;
  };

  const toggleFolder = (folderPath: string): void => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const FileTreeNode: React.FC<{
    name: string;
    node: any;
    path: string;
  }> = ({ name, node, path }) => {
    const fullPath = path ? `${path}/${name}` : name;
    const isFolder = node['__files__'] === undefined && Object.keys(node).length > 0;
    const files = node['__files__'] || [];
    const isExpanded = expandedFolders.has(fullPath);

    if (isFolder) {
      return (
        <div key={fullPath}>
          <div
            onClick={() => toggleFolder(fullPath)}
            className="cursor-pointer flex items-center gap-1 px-2 py-1 hover:bg-gray-700 rounded"
          >
            <ChevronDown
              size={16}
              className={`transform transition ${isExpanded ? '' : '-rotate-90'}`}
            />
            <span className="text-sm text-gray-300">📁 {name}</span>
          </div>
          {isExpanded && (
            <div className="ml-4">
              {Object.entries(node).map(([key, subNode]: [string, any]) => {
                if (key === '__files__') return null;
                return (
                  <FileTreeNode
                    key={key}
                    name={key}
                    node={subNode}
                    path={fullPath}
                  />
                );
              })}
              {files.map((file: FileItem) => (
                <div
                  key={file.filePath}
                  onClick={() => setSelectedFile(file)}
                  className={`cursor-pointer px-2 py-1 text-sm rounded ${'bg-blue-900 text-blue-100'}`}
                >
                  📄 {file.fileName}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const tree = buildFileTree(files);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* File Tree Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto p-4">
        <h3 className="text-lg font-bold mb-4 text-white">{projectName}</h3>
        <div className="space-y-1">
          {Object.entries(tree).map(([key, node]: [string, any]) => (
            <FileTreeNode key={key} name={key} node={node} path="" />
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        {selectedFile && (
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-400">File</p>
                <p className="text-lg font-semibold text-white">{selectedFile.fileName}</p>
              </div>
              <div className="flex gap-2 bg-gray-700 rounded p-1">
                <button
                  onClick={() => setViewMode('code')}
                  className={`p-2 rounded transition ${
                    viewMode === 'code'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Code view"
                >
                  <Code size={18} />
                </button>
                {(selectedFile.fileType === 'react' || selectedFile.fileName.endsWith('.tsx')) && (
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`p-2 rounded transition ${
                      viewMode === 'preview'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Preview"
                  >
                    <Eye size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition"
              >
                <Copy size={16} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={downloadFile}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        )}

        {/* Code Editor */}
        {selectedFile && viewMode === 'code' && (
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language={getLanguage(selectedFile.filePath)}
              style={atomDark}
              showLineNumbers
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '13px',
              }}
            >
              {selectedFile.content}
            </SyntaxHighlighter>
          </div>
        )}

        {/* Preview Area */}
        {selectedFile && viewMode === 'preview' && (
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-white rounded p-4 text-black">
              <iframe
                title="preview"
                srcDoc={selectedFile.content}
                className="w-full h-full border rounded"
              />
            </div>
          </div>
        )}

        {!selectedFile && (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a file to view its contents</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;
