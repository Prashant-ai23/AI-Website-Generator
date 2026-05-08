import React, { useState } from 'react';
import { Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface BugFixerPanelProps {
  conversationId?: string;
}

export const BugFixerPanel: React.FC<BugFixerPanelProps> = ({ conversationId }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim() || !error.trim()) return;

    setLoading(true);
    try {
      const response = await apiClient.post('/ai/bug-fix', {
        code,
        error,
      });

      setResult(response.data.data);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here..."
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
          rows={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Error Message</label>
        <textarea
          value={error}
          onChange={(e) => setError(e.target.value)}
          placeholder="Paste the error message or describe the bug..."
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={3}
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading || !code.trim() || !error.trim()}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? 'Analyzing...' : 'Find Bug Fixes'}
      </button>

      {result && (
        <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900">Issue</h3>
              <p className="text-sm text-gray-600 mt-1">{result.fixes?.issue}</p>
            </div>
          </div>

          {result.fixes?.rootCause && (
            <div className="mt-3 p-3 bg-white rounded border border-red-100">
              <h4 className="text-sm font-medium text-gray-900">Root Cause</h4>
              <p className="text-sm text-gray-600 mt-1">{result.fixes.rootCause}</p>
            </div>
          )}

          {result.fixes?.fixes && result.fixes.fixes.length > 0 && (
            <div className="mt-3 space-y-2">
              <h4 className="text-sm font-medium text-gray-900">Suggested Fixes</h4>
              {result.fixes.fixes.map((fix: any, i: number) => (
                <div key={i} className="p-3 bg-white rounded border border-green-100">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{fix.description}</p>
                      <pre className="mt-1 bg-gray-50 p-2 rounded text-xs overflow-auto text-gray-600">
                        {fix.code}
                      </pre>
                      <p className="text-xs text-gray-600 mt-1">{fix.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
