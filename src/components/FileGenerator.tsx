/**
 * FileGenerator Component
 * UI for generating and managing project files
 */

import React, { useState, useEffect } from 'react';
import useFileGenerator from '../hooks/useFileGenerator';
import { FileSpec, ProjectStructure } from '../types/fileGenerator';

export const FileGenerator: React.FC = () => {
  const {
    generatedFiles,
    projectPath,
    projectName,
    projectSummary,
    loading,
    error,
    uploadProgress,
    uploadStatus,
    generateFiles,
    generateProject,
    createFile,
    updateFile,
    deleteFile,
    getProjectSummary,
    reset,
  } = useFileGenerator();

  // Form state
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'generator' | 'explorer' | 'summary'>('generator');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Handle file creation
  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filePath || !fileContent) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await createFile(filePath, fileContent);
      setFilePath('');
      setFileContent('');
      alert('File created successfully!');
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  // Handle project summary fetch
  const handleGetSummary = async () => {
    if (!projectPath) {
      alert('No project path available');
      return;
    }

    try {
      await getProjectSummary(projectPath);
      setActiveTab('summary');
    } catch (error) {
      console.error('Error getting project summary:', error);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(label);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Calculate total size
  const totalSize = generatedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">File Generator</h1>
          <p className="text-slate-400">Generate, manage, and organize your project files</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
            <div className="font-semibold">Error</div>
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'generator'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            File Generator
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'explorer'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            File Explorer
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'summary'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Project Summary
          </button>
        </div>

        {/* Generator Tab */}
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create File Section */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Create New File</h2>

              <form onSubmit={handleCreateFile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">File Path</label>
                  <input
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder="e.g., src/components/Button.tsx"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">File Content</label>
                  <textarea
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    placeholder="Paste your file content here..."
                    rows={8}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 font-mono text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  {loading ? 'Creating...' : 'Create File'}
                </button>
              </form>
            </div>

            {/* Project Info Section */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Project Information</h2>

              {projectName && projectPath ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Project Name</div>
                    <div className="flex items-center justify-between">
                      <code className="text-slate-300 font-mono text-sm break-all">{projectName}</code>
                      <button
                        onClick={() => copyToClipboard(projectName, 'name')}
                        className="ml-2 text-slate-400 hover:text-slate-300"
                      >
                        {copySuccess === 'name' ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-slate-400 mb-1">Project Path</div>
                    <div className="flex items-center justify-between">
                      <code className="text-slate-300 font-mono text-sm break-all">{projectPath}</code>
                      <button
                        onClick={() => copyToClipboard(projectPath, 'path')}
                        className="ml-2 text-slate-400 hover:text-slate-300"
                      >
                        {copySuccess === 'path' ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-slate-700 rounded p-3">
                      <div className="text-xs text-slate-400">Files Generated</div>
                      <div className="text-2xl font-bold text-blue-400">{generatedFiles.length}</div>
                    </div>
                    <div className="bg-slate-700 rounded p-3">
                      <div className="text-xs text-slate-400">Total Size</div>
                      <div className="text-lg font-bold text-green-400">{formatFileSize(totalSize)}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleGetSummary}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-medium py-2 px-4 rounded transition-colors"
                  >
                    {loading ? 'Loading...' : 'Get Project Summary'}
                  </button>

                  <button
                    onClick={reset}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded transition-colors"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <div className="text-slate-400 text-center py-8">
                  <p>No project selected</p>
                  <p className="text-sm mt-2">Generate files or projects to see project information here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Explorer Tab */}
        {activeTab === 'explorer' && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Generated Files</h2>

            {generatedFiles.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {generatedFiles.map((file) => (
                  <div
                    key={file.filePath}
                    className="flex items-center justify-between p-3 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono text-blue-300 truncate">{file.filePath}</div>
                      <div className="text-xs text-slate-400">
                        {formatFileSize(file.size)} · {new Date(file.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {file.created && <span className="text-xs bg-green-900 text-green-200 px-2 py-1 rounded">Created</span>}
                      {file.updated && <span className="text-xs bg-yellow-900 text-yellow-200 px-2 py-1 rounded">Updated</span>}
                      <button
                        onClick={() => copyToClipboard(file.filePath, `file-${file.filePath}`)}
                        className="text-slate-400 hover:text-slate-300"
                      >
                        {copySuccess === `file-${file.filePath}` ? '✓' : '📋'}
                      </button>
                      <button
                        onClick={() => deleteFile(file.filePath)}
                        className="text-red-400 hover:text-red-300"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-center py-12">
                <p>No files generated yet</p>
              </div>
            )}
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Project Summary</h2>

            {projectSummary ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-700 rounded p-4">
                    <div className="text-sm text-slate-400">Total Files</div>
                    <div className="text-3xl font-bold text-blue-400">{projectSummary.totalFiles}</div>
                  </div>
                  <div className="bg-slate-700 rounded p-4">
                    <div className="text-sm text-slate-400">Total Size</div>
                    <div className="text-2xl font-bold text-green-400">{formatFileSize(projectSummary.totalSize)}</div>
                  </div>
                  <div className="bg-slate-700 rounded p-4">
                    <div className="text-sm text-slate-400">Folders</div>
                    <div className="text-3xl font-bold text-purple-400">{projectSummary.folders.length}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Folders</h3>
                  <div className="bg-slate-700 rounded p-3 max-h-48 overflow-y-auto">
                    {projectSummary.folders.length > 0 ? (
                      <ul className="space-y-1">
                        {projectSummary.folders.map((folder) => (
                          <li key={folder} className="text-slate-300 text-sm">
                            📁 {folder}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-slate-400 text-sm">No folders</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Files</h3>
                  <div className="bg-slate-700 rounded p-3 max-h-48 overflow-y-auto">
                    {projectSummary.files.length > 0 ? (
                      <ul className="space-y-1">
                        {projectSummary.files.slice(0, 20).map((file) => (
                          <li key={file} className="text-slate-300 text-sm">
                            📄 {file}
                          </li>
                        ))}
                        {projectSummary.files.length > 20 && (
                          <li className="text-slate-400 text-sm italic">
                            +{projectSummary.files.length - 20} more files...
                          </li>
                        )}
                      </ul>
                    ) : (
                      <div className="text-slate-400 text-sm">No files</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-center py-12">
                <p>No summary available</p>
                <p className="text-sm mt-2">Click "Get Project Summary" to load project information</p>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploadStatus.status === 'processing' && (
          <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-lg p-4 max-w-sm">
            <div className="text-sm font-semibold text-white mb-2">{uploadStatus.currentFile}</div>
            <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadStatus.percentage}%` }}
              />
            </div>
            <div className="text-xs text-slate-400">
              {uploadStatus.processedFiles} of {uploadStatus.totalFiles} files
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileGenerator;
