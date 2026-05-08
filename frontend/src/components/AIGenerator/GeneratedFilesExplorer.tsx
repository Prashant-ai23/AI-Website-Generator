import React, { useState } from 'react';
import {
  ChevronDown,
  File,
  Folder,
  FileJson,
  FileCode,
  FileText,
  Copy,
  Eye,
} from 'lucide-react';

interface GeneratedFile {
  _id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  category: string;
  size: number;
  language: string;
}

interface GeneratedFilesExplorerProps {
  projectId: string;
  files: GeneratedFile[];
  onSelectFile: (file: GeneratedFile) => void;
  selectedFile: GeneratedFile | null;
}

export const GeneratedFilesExplorer: React.FC<GeneratedFilesExplorerProps> = ({
  projectId,
  files,
  onSelectFile,
  selectedFile,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['frontend', 'backend', 'database', 'deployment', 'other'])
  );

  // Group files by category
  const filesByCategory = files.reduce(
    (acc, file) => {
      if (!acc[file.category]) {
        acc[file.category] = [];
      }
      acc[file.category].push(file);
      return acc;
    },
    {} as Record<string, GeneratedFile[]>
  );

  const toggleFolder = (category: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (language: string) => {
    switch (language) {
      case 'json':
        return <FileJson className="w-4 h-4 text-yellow-600" />;
      case 'markdown':
        return <FileText className="w-4 h-4 text-gray-600" />;
      case 'typescript':
      case 'tsx':
        return <FileCode className="w-4 h-4 text-blue-600" />;
      case 'javascript':
      case 'jsx':
        return <FileCode className="w-4 h-4 text-yellow-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      frontend: 'text-blue-600',
      backend: 'text-green-600',
      database: 'text-purple-600',
      deployment: 'text-orange-600',
      other: 'text-gray-600',
    };
    return colors[category] || 'text-gray-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Files List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Generated Files</h3>
            <p className="text-sm text-gray-600 mt-1">
              {files.length} files generated • Click to view code
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {Object.entries(filesByCategory).map(([category, categoryFiles]) => (
              <div key={category} className="border-b border-gray-100 last:border-b-0">
                {/* Category Header */}
                <button
                  onClick={() => toggleFolder(category)}
                  className="w-full px-6 py-3 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedFolders.has(category) ? '' : '-rotate-90'
                    }`}
                  />
                  <Folder className={`w-4 h-4 ${getCategoryColor(category)}`} />
                  <span className="text-sm font-semibold text-gray-900 capitalize">
                    {category}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {categoryFiles.length} files
                  </span>
                </button>

                {/* Files */}
                {expandedFolders.has(category) && (
                  <div className="bg-gray-50">
                    {categoryFiles.map((file) => (
                      <button
                        key={file._id}
                        onClick={() => onSelectFile(file)}
                        className={`w-full px-6 py-2 flex items-center gap-2 text-left hover:bg-gray-100 transition-colors border-l-2 ${
                          selectedFile?._id === file._id
                            ? 'border-l-blue-600 bg-blue-50'
                            : 'border-l-transparent'
                        }`}
                      >
                        <div className="ml-6">
                          {getFileIcon(file.language)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB • {file.language}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {files.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p>No files generated yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* File Info */}
      {selectedFile && (
        <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              {getFileIcon(selectedFile.language)}
              <span className="text-xs font-semibold text-gray-500 uppercase">
                {selectedFile.language}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 break-all">
              {selectedFile.fileName}
            </h4>
            <p className="text-xs text-gray-600 mt-1">{selectedFile.filePath}</p>
          </div>

          <div className="p-4 space-y-3 text-sm border-b border-gray-200">
            <div className="flex justify-between">
              <span className="text-gray-600">File Type</span>
              <span className="font-medium text-gray-900 capitalize">
                {selectedFile.fileType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Category</span>
              <span className={`font-medium capitalize ${getCategoryColor(selectedFile.category)}`}>
                {selectedFile.category}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Size</span>
              <span className="font-medium text-gray-900">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>

          <div className="p-4 space-y-2 flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Eye className="w-4 h-4" />
              View Code
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
            <p>💡 You can view and edit the code in the Code tab</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratedFilesExplorer;
