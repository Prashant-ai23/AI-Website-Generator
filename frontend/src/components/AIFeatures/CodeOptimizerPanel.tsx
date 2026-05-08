import React, { useState } from 'react';
import { Loader, Zap, TrendingDown } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface CodeOptimizerPanelProps {
  conversationId?: string;
}

export const CodeOptimizerPanel: React.FC<CodeOptimizerPanelProps> = ({ conversationId }) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const response = await apiClient.post('/ai/code-optimize', {
        code,
      });

      setResult(response.data.data);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Code to Optimize</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here for optimization suggestions..."
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
          rows={8}
        />
      </div>

      <button
        onClick={handleOptimize}
        disabled={loading || !code.trim()}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? 'Analyzing...' : 'Optimize Code'}
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium">Original Complexity</div>
              <div className="text-lg font-semibold text-blue-900 mt-1">{result.optimized?.originalComplexity}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xs text-green-600 font-medium">Optimized Complexity</div>
              <div className="text-lg font-semibold text-green-900 mt-1">{result.optimized?.optimizedComplexity}</div>
            </div>
          </div>

          {result.optimized?.improvements && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                Performance Improvements
              </h3>
              {result.optimized.improvements.map((imp: any, i: number) => (
                <div key={i} className="p-3 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{imp.metric}</span>
                    <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                      {imp.improvement}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">From:</span> <code className="bg-white px-2 py-1 rounded">{imp.from}</code>
                    </div>
                    <div>
                      <span className="font-medium">To:</span> <code className="bg-white px-2 py-1 rounded">{imp.to}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.optimized?.optimizedCode && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                Optimized Code
              </h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-64 text-sm">
                <code>{result.optimized.optimizedCode}</code>
              </pre>
            </div>
          )}

          {result.optimized?.explanation && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-gray-900 text-sm">How It Works</h4>
              <p className="text-sm text-gray-600 mt-2">{result.optimized.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
