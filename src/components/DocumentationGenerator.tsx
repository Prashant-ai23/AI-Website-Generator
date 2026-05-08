/**
 * Documentation Generator Component
 * Comprehensive UI for generating project documentation
 */

import React, { useState, useMemo } from 'react';
import useDocumentationGenerator from '../hooks/useDocumentationGenerator';
import { DocConfig } from '../types/documentationGenerator';
import { Copy, Download, RefreshCw, Loader } from 'lucide-react';

type DocType = 'readme' | 'api' | 'install' | 'architecture' | 'modules' | 'complete';

interface DocTab {
  type: DocType;
  label: string;
  description: string;
}

const docTabs: DocTab[] = [
  { type: 'readme', label: 'README', description: 'Project overview and getting started' },
  { type: 'api', label: 'API Docs', description: 'Complete API documentation' },
  { type: 'install', label: 'Installation', description: 'Setup and installation guide' },
  { type: 'architecture', label: 'Architecture', description: 'System architecture documentation' },
  { type: 'modules', label: 'Modules', description: 'Module-wise documentation' },
  { type: 'complete', label: 'Complete', description: 'All documentation files' },
];

const availableModules = [
  'Authentication',
  'Users',
  'Products',
  'Orders',
  'Payments',
  'Cart',
  'Reviews',
  'Notifications',
  'Dashboard',
  'Reports',
  'Analytics',
];

const DocumentationGenerator: React.FC = () => {
  const {
    readme,
    apiDocs,
    installationGuide,
    architecture,
    modules,
    allDocs,
    loading,
    error,
    currentDocType,
    generateREADME,
    generateAPIDocumentation,
    generateInstallationGuide,
    generateArchitectureDocumentation,
    generateModuleDocumentation,
    generateCompleteDocumentation,
    copyToClipboard,
    downloadAsMarkdown,
    downloadAllAsJSON,
    reset,
  } = useDocumentationGenerator();

  const [activeTab, setActiveTab] = useState<DocType>('complete');
  const [projectConfig, setProjectConfig] = useState<DocConfig>({
    projectName: 'AI Website Generator',
    projectDescription: 'An AI-powered website generation platform',
    projectVersion: '1.0.0',
    authorName: 'Development Team',
    authorEmail: 'team@example.com',
    repoUrl: 'https://github.com/yourusername/ai-website-generator',
    docsUrl: 'https://docs.example.com',
    includeModules: true,
    modules: ['Authentication', 'Users', 'Products'],
  });

  const [selectedModules, setSelectedModules] = useState<string[]>(['Authentication', 'Users', 'Products']);
  const [copied, setCopied] = useState<string | null>(null);
  const [copyCount, setCopyCount] = useState(0);

  /**
   * Handle configuration change
   */
  const handleConfigChange = (key: keyof DocConfig, value: any) => {
    setProjectConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Handle module selection
   */
  const handleModuleToggle = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };

  /**
   * Generate documentation based on tab
   */
  const handleGenerate = async () => {
    const config = {
      ...projectConfig,
      modules: selectedModules,
    };

    try {
      switch (activeTab) {
        case 'readme':
          await generateREADME(config);
          break;
        case 'api':
          await generateAPIDocumentation(config);
          break;
        case 'install':
          await generateInstallationGuide(config);
          break;
        case 'architecture':
          await generateArchitectureDocumentation(config);
          break;
        case 'modules':
          await generateModuleDocumentation(config);
          break;
        case 'complete':
          await generateCompleteDocumentation(config);
          break;
      }
    } catch (error) {
      console.error('Generation error:', error);
    }
  };

  /**
   * Get content for current tab
   */
  const getContent = (): string | Record<string, string> | null => {
    switch (activeTab) {
      case 'readme':
        return readme;
      case 'api':
        return apiDocs;
      case 'install':
        return installationGuide;
      case 'architecture':
        return architecture;
      case 'modules':
        return modules;
      case 'complete':
        return allDocs ? { ...allDocs } : null;
      default:
        return null;
    }
  };

  /**
   * Handle copy
   */
  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(label);
      setCopyCount(copyCount + 1);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  /**
   * Handle download
   */
  const handleDownload = (content: string | null, fileName: string) => {
    if (content) {
      downloadAsMarkdown(content, fileName);
    }
  };

  /**
   * Handle download all
   */
  const handleDownloadAll = () => {
    if (allDocs) {
      downloadAllAsJSON(allDocs, projectConfig.projectName || 'project');
    }
  };

  const content = getContent();
  const contentSize = useMemo(() => {
    if (typeof content === 'string') {
      return (content.length / 1024).toFixed(2);
    } else if (content) {
      return (JSON.stringify(content).length / 1024).toFixed(2);
    }
    return '0';
  }, [content]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Documentation Generator</h1>
          <p className="text-gray-600">Generate comprehensive project documentation automatically</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Configuration</h2>

              {/* Project Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={projectConfig.projectName || ''}
                  onChange={(e) => handleConfigChange('projectName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={projectConfig.projectDescription || ''}
                  onChange={(e) => handleConfigChange('projectDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Version */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                <input
                  type="text"
                  value={projectConfig.projectVersion || ''}
                  onChange={(e) => handleConfigChange('projectVersion', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Author Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                <input
                  type="text"
                  value={projectConfig.authorName || ''}
                  onChange={(e) => handleConfigChange('authorName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Author Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Email</label>
                <input
                  type="email"
                  value={projectConfig.authorEmail || ''}
                  onChange={(e) => handleConfigChange('authorEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Repository URL */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Repository URL</label>
                <input
                  type="url"
                  value={projectConfig.repoUrl || ''}
                  onChange={(e) => handleConfigChange('repoUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Documentation URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Documentation URL</label>
                <input
                  type="url"
                  value={projectConfig.docsUrl || ''}
                  onChange={(e) => handleConfigChange('docsUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    Generate {activeTab}
                  </>
                )}
              </button>
            </div>

            {/* Module Selection */}
            {activeTab === 'modules' || activeTab === 'complete' ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Modules</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableModules.map((module) => (
                    <label key={module} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedModules.includes(module)}
                        onChange={() => handleModuleToggle(module)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{module}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Tabs and Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="overflow-x-auto">
                  <div className="flex">
                    {docTabs.map((tab) => (
                      <button
                        key={tab.type}
                        onClick={() => setActiveTab(tab.type)}
                        className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                          activeTab === tab.type
                            ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        title={tab.description}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Display */}
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <Loader size={32} className="animate-spin text-blue-600 mx-auto mb-3" />
                      <p className="text-gray-600">Generating documentation...</p>
                    </div>
                  </div>
                ) : content ? (
                  <div className="space-y-4">
                    {/* Content Info */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">
                          Size: <span className="font-semibold">{contentSize} KB</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Generated: <span className="font-semibold">{new Date().toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {typeof content === 'string' && (
                          <>
                            <button
                              onClick={() => handleCopy(content, activeTab)}
                              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                                copied === activeTab
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }`}
                            >
                              <Copy size={16} />
                              {copied === activeTab ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                              onClick={() =>
                                handleDownload(
                                  content,
                                  `${projectConfig.projectName || 'project'}-${activeTab}.md`
                                )
                              }
                              className="flex items-center gap-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium text-sm transition-colors"
                            >
                              <Download size={16} />
                              Download
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Code Display */}
                    {typeof content === 'string' ? (
                      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
                        <pre>{content}</pre>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(content).map(([key, value]) => (
                          <div key={key} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">{key}</h3>
                              <button
                                onClick={() => handleCopy(value as string, key)}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                            <div className="bg-gray-50 rounded p-3 text-xs text-gray-600 overflow-auto max-h-48">
                              <pre>{(value as string).substring(0, 500)}...</pre>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={handleDownloadAll}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          <Download size={18} />
                          Download All as JSON
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96 text-gray-500">
                    <p>Select a documentation type and click Generate to create documentation</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Clear All
              </button>
              {allDocs && (
                <button
                  onClick={handleDownloadAll}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Download size={18} />
                  Export All Docs
                </button>
              )}
            </div>

            {/* Stats */}
            {allDocs && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-gray-600 text-sm">Total Files</p>
                  <p className="text-2xl font-bold text-blue-600">{allDocs.summary?.totalFiles || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-gray-600 text-sm">Total Size</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {((allDocs.summary?.totalSize || 0) / 1024).toFixed(2)} KB
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-gray-600 text-sm">Modules</p>
                  <p className="text-2xl font-bold text-blue-600">{allDocs.modules?.count || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-gray-600 text-sm">Copies</p>
                  <p className="text-2xl font-bold text-blue-600">{copyCount}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationGenerator;
