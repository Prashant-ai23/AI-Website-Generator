import React, { useState } from 'react';
import { Loader, BarChart3, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface CodeAnalyzerPanelProps {
  conversationId?: string;
}

export const CodeAnalyzerPanel: React.FC<CodeAnalyzerPanelProps> = ({ conversationId }) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const response = await apiClient.post('/ai/execute', {
        agentType: 'CODE_ANALYZER',
        input: { code },
      });

      setResult(response.data.data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricBg = (value: number) => {
    if (value >= 80) return 'bg-green-50';
    if (value >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Code to Analyze</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here for analysis..."
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
          rows={8}
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !code.trim()}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? 'Analyzing...' : 'Analyze Code'}
      </button>

      {result && (
        <div className="space-y-4">
          {result.analysis?.metrics && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Code Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(result.analysis.metrics).map(([key, value]: [string, any]) => (
                  <div key={key} className={`p-3 rounded-lg border ${getMetricBg(value)}`}>
                    <div className="text-xs text-gray-600 capitalize font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className={`text-2xl font-bold mt-1 ${getMetricColor(value)}`}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.analysis?.issues && result.analysis.issues.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                Issues Found ({result.analysis.issues.length})
              </h3>
              <ul className="space-y-2">
                {result.analysis.issues.map((issue: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                    <span className="text-orange-600 font-bold mt-0.5">•</span>
                    <span className="text-sm text-gray-700">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.analysis?.suggestions && result.analysis.suggestions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Improvement Suggestions</h3>
              <ul className="space-y-2">
                {result.analysis.suggestions.map((suggestion: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                    <span className="text-blue-600 font-bold mt-0.5">→</span>
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
