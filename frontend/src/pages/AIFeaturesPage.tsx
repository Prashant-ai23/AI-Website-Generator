import React, { useState } from 'react';
import { Code2, Bug, Zap, BarChart3, Workflow } from 'lucide-react';
import { CodeGeneratorPanel } from '../components/AIFeatures/CodeGeneratorPanel';
import { BugFixerPanel } from '../components/AIFeatures/BugFixerPanel';
import { CodeOptimizerPanel } from '../components/AIFeatures/CodeOptimizerPanel';
import { CodeAnalyzerPanel } from '../components/AIFeatures/CodeAnalyzerPanel';

type TabType = 'generate' | 'analyze' | 'bugfix' | 'optimize' | 'workflows';

export const AIFeaturesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('generate');

  const tabs = [
    { id: 'generate', label: 'Code Generator', icon: Code2 },
    { id: 'analyze', label: 'Code Analyzer', icon: BarChart3 },
    { id: 'bugfix', label: 'Bug Fixer', icon: Bug },
    { id: 'optimize', label: 'Code Optimizer', icon: Zap },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced AI Features</h1>
          <p className="text-gray-600 mt-2">
            Leverage AI-powered tools to generate, analyze, fix, and optimize your code
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px gap-1 md:gap-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`py-4 px-3 md:px-0 border-b-2 font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'generate' && <CodeGeneratorPanel />}
          {activeTab === 'analyze' && <CodeAnalyzerPanel />}
          {activeTab === 'bugfix' && <BugFixerPanel />}
          {activeTab === 'optimize' && <CodeOptimizerPanel />}
          {activeTab === 'workflows' && (
            <div className="text-center py-12">
              <Workflow className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Orchestration</h3>
              <p className="text-gray-600 mb-6">
                Chain multiple AI agents together to create powerful automation workflows
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Generate & Optimize</h4>
                  <p className="text-sm text-gray-600">Generate code and automatically optimize it</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Fix & Verify</h4>
                  <p className="text-sm text-gray-600">Fix bugs and verify the fixes work correctly</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Analyze & Improve</h4>
                  <p className="text-sm text-gray-600">Analyze code and get improvement suggestions</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Code Generation</h3>
            <p className="text-sm text-blue-800">
              Describe what you want to build and let AI generate production-ready code
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-900 mb-2">📊 Code Analysis</h3>
            <p className="text-sm text-purple-800">
              Get detailed metrics on code complexity, maintainability, and performance
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-900 mb-2">⚡ Optimization</h3>
            <p className="text-sm text-green-800">
              Automatically optimize algorithms and improve code performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
