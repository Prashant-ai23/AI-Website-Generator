import React, { useState } from 'react';
import { Loader, Copy, CheckCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface CodeGeneratorPanelProps {
  conversationId?: string;
}

export const CodeGeneratorPanel: React.FC<CodeGeneratorPanelProps> = ({ conversationId }) => {
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) return;

    setLoading(true);
    try {
      const response = await apiClient.post('/ai/execute', {
        agentType: 'CODE_GENERATOR',
        input: { description, language },
      });

      setResult(response.data.data);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.result?.code) {
      navigator.clipboard.writeText(result.result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">What would you like to generate?</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Create a React component that displays a product card with image, title, price, and add to cart button"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !description.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? 'Generating...' : 'Generate Code'}
      </button>

      {result && (
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Generated Code</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
          <pre className="bg-white p-3 rounded border border-gray-200 overflow-auto max-h-96 text-sm">
            <code>{result.result?.code}</code>
          </pre>
          {result.result?.suggestions && (
            <div>
              <h4 className="font-sm font-medium text-gray-700">Suggestions</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {result.result.suggestions.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
