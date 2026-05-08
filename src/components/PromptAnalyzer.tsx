import React, { useState } from 'react';
import { usePromptAnalyzer, type AnalysisResult } from '../hooks/usePromptAnalyzer';

export const PromptAnalyzerComponent: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const { analysis, loading, error, analyze } = usePromptAnalyzer();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      await analyze(prompt);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'complex':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">App Idea Analyzer</h1>
          <p className="text-gray-600">Describe your app idea and we'll automatically detect the required modules</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your App
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create an ecommerce app with user authentication, products, shopping cart, and order management"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Analyzing...' : 'Analyze App Idea'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-8">
            {/* App Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{analysis.appName}</h2>
                  <p className="text-gray-600 mb-4">{analysis.appDescription}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Type:</span>
                      <p className="text-gray-900 font-semibold">{analysis.appType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Scope:</span>
                      <p className="text-gray-900 font-semibold capitalize">{analysis.estimatedScope}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded p-4 border border-blue-100">
                    <div className="text-sm font-medium text-gray-700 mb-1">Estimated Duration</div>
                    <div className="text-2xl font-bold text-blue-600">{analysis.estimatedDuration}</div>
                  </div>

                  <div className="bg-white rounded p-4 border border-blue-100">
                    <div className="text-sm font-medium text-gray-700 mb-1">Confidence Score</div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-blue-600">{Math.round(analysis.confidence * 100)}%</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${analysis.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keyTechnologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-purple-100 text-purple-800 border border-purple-300 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modules */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Detected Modules ({analysis.modules.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.modules.map((module) => (
                  <div
                    key={module.name}
                    className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition duration-200"
                  >
                    {/* Module Header */}
                    <div className="mb-3">
                      <h4 className="text-lg font-bold text-gray-900">{module.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-semibold border rounded ${getPriorityColor(module.priority)}`}>
                        {module.priority.charAt(0).toUpperCase() + module.priority.slice(1)} Priority
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold border border-gray-300 rounded bg-gray-100 text-gray-800`}>
                        <span className={getComplexityColor(module.estimatedComplexity)}>
                          {module.estimatedComplexity.charAt(0).toUpperCase() + module.estimatedComplexity.slice(1)} Complexity
                        </span>
                      </span>
                    </div>

                    {/* Features */}
                    {module.features && module.features.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-semibold text-gray-700 mb-2">Features:</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {module.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Technologies */}
                    {module.suggestedTechnologies && module.suggestedTechnologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {module.suggestedTechnologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Export Analysis</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const json = JSON.stringify(analysis, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${analysis.appName.replace(/\s+/g, '-').toLowerCase()}-analysis.json`;
                    a.click();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                >
                  Download JSON
                </button>
                <button
                  onClick={() => {
                    const csv = generateCSV(analysis);
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${analysis.appName.replace(/\s+/g, '-').toLowerCase()}-analysis.csv`;
                    a.click();
                  }}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
                >
                  Download CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!analysis && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Enter an app description above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

function generateCSV(analysis: AnalysisResult): string {
  let csv = 'App Analyzer Report\n';
  csv += `App Name,${analysis.appName}\n`;
  csv += `App Type,${analysis.appType}\n`;
  csv += `Scope,${analysis.estimatedScope}\n`;
  csv += `Duration,${analysis.estimatedDuration}\n`;
  csv += `Confidence,${analysis.confidence}\n`;
  csv += '\n\nModules\n';
  csv += 'Name,Description,Priority,Complexity\n';

  analysis.modules.forEach((module) => {
    csv += `"${module.name}","${module.description}","${module.priority}","${module.estimatedComplexity}"\n`;
  });

  return csv;
}

export default PromptAnalyzerComponent;
