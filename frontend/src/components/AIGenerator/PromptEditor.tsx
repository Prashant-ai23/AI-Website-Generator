import React, { useState } from 'react';
import { Send, Sparkles, Settings } from 'lucide-react';

interface PromptEditorProps {
  onGenerate: (prompt: string, config: any) => void;
  isGenerating: boolean;
}

interface GenerationConfig {
  projectType: 'frontend' | 'backend' | 'fullstack' | 'mobile';
  name: string;
  slug: string;
  includeTests: boolean;
  includeDocumentation: boolean;
  useDocker: boolean;
  techStack: {
    frontend?: string;
    backend?: string;
    database?: string;
  };
}

export const PromptEditor: React.FC<PromptEditorProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config, setConfig] = useState<GenerationConfig>({
    projectType: 'fullstack',
    name: '',
    slug: '',
    includeTests: false,
    includeDocumentation: true,
    useDocker: true,
    techStack: {
      frontend: 'React',
      backend: 'Express.js',
      database: 'MongoDB',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onGenerate(prompt, config);
  };

  const suggestions = [
    'Create ecommerce website',
    'Build CRM system',
    'Generate ERP application',
    'Build blog platform',
    'Create admin dashboard',
  ];

  const handleSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    setTimeout(() => {
      document.querySelector('textarea')?.focus();
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Suggestions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">Quick Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestion(suggestion)}
              className="text-left px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Editor */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Describe your project</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-4 h-4" />
              Advanced
            </button>
          </div>

          {/* Prompt Input */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your project in detail. Example: Create an ecommerce website with product catalog, shopping cart, user accounts, payment processing, and admin dashboard..."
            className="w-full p-4 min-h-40 border-0 resize-none focus:outline-none focus:ring-0 font-mono text-sm"
          />

          {/* Character count */}
          <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 flex justify-between">
            <span>{prompt.length} characters</span>
            <span className={prompt.length < 20 ? 'text-red-600' : 'text-green-600'}>
              {prompt.length < 20 ? 'Too short' : 'Good'}
            </span>
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                  placeholder="My Project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Slug
                </label>
                <input
                  type="text"
                  value={config.slug}
                  onChange={(e) => setConfig({ ...config, slug: e.target.value })}
                  placeholder="my-project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type
              </label>
              <select
                value={config.projectType}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    projectType: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="frontend">Frontend Only</option>
                <option value="backend">Backend Only</option>
                <option value="fullstack">Full Stack</option>
                <option value="mobile">Mobile</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frontend Framework
                </label>
                <select
                  value={config.techStack.frontend || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      techStack: { ...config.techStack, frontend: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  <option value="React">React</option>
                  <option value="Vue">Vue</option>
                  <option value="Angular">Angular</option>
                  <option value="Next.js">Next.js</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backend Framework
                </label>
                <select
                  value={config.techStack.backend || ''}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      techStack: { ...config.techStack, backend: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  <option value="Express.js">Express.js</option>
                  <option value="Django">Django</option>
                  <option value="FastAPI">FastAPI</option>
                  <option value="Spring Boot">Spring Boot</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeDocumentation}
                  onChange={(e) =>
                    setConfig({ ...config, includeDocumentation: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Include Documentation</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeTests}
                  onChange={(e) => setConfig({ ...config, includeTests: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Include Tests</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.useDocker}
                  onChange={(e) => setConfig({ ...config, useDocker: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Dockerize Project</span>
              </label>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-medium"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Generate Project
              </>
            )}
          </button>
        </div>

        {/* Info */}
        <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-900">
          💡 Pro tip: Be specific about your project requirements for better generation results.
        </div>
      </form>
    </div>
  );
};

export default PromptEditor;
