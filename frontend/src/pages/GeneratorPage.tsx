import { MainLayout } from '@/components/layout';
import { Wand2, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function GeneratorPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [industry, setIndustry] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string>('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setProjectId(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated. Please log in.');
        setIsGenerating(false);
        return;
      }

      // Call backend API
      const response = await fetch('/api/v1/ai-generator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${industry || 'Website'} Project`,
          slug: `${industry || 'website'}-project-${Date.now()}`,
          prompt: prompt,
          projectType: industry || 'fullstack',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Generation failed');
      }

      const data = await response.json();
      const newProjectId = data.data.project._id;
      setProjectId(newProjectId);

      // Poll for progress
      let pollInterval: NodeJS.Timeout | null = null;
      let completedOrFailed = false;

      pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(
            `/api/v1/ai-generator/projects/${newProjectId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!statusResponse.ok) throw new Error('Failed to get status');

          const statusData = await statusResponse.json();
          const project = statusData.data.project;

          setProgress(project.metadata?.progress || 0);
          setCurrentPhase(project.metadata?.currentPhase || '');

          if (project.status === 'completed') {
            completedOrFailed = true;
            if (pollInterval) clearInterval(pollInterval);
            setIsGenerating(false);
            // Navigate to projects page to show the generated files
            navigate('/projects');
          } else if (project.status === 'failed') {
            completedOrFailed = true;
            if (pollInterval) clearInterval(pollInterval);
            setError('Generation failed. Please try again.');
            setIsGenerating(false);
          }
        } catch (err) {
          console.error('Poll error:', err);
        }
      }, 2000);

      // Cleanup after 10 minutes
      setTimeout(() => {
        if (pollInterval && !completedOrFailed) {
          clearInterval(pollInterval);
          setIsGenerating(false);
        }
      }, 600000);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsGenerating(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Website Generator
          </h1>
          <p className="text-gray-600">
            Describe your website and let AI create it for you
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {isGenerating && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-blue-800 font-medium">Generating your website...</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-blue-700">
                <span>Progress: {progress}%</span>
                {currentPhase && <span>Phase: {currentPhase}</span>}
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input */}
          <div className="lg:col-span-2">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your website
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., A portfolio website for a freelance designer with dark theme and modern animations..."
                  rows={6}
                  className="input-base resize-none"
                  required
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry/Type
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="input-base"
                  disabled={isGenerating}
                >
                  <option value="">Select an option</option>
                  <option value="Portfolio">Portfolio</option>
                  <option value="Blog">Blog</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Agency">Agency</option>
                  <option value="SaaS">SaaS</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !prompt}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isGenerating && <Sparkles size={20} className="animate-spin" />}
                {isGenerating ? 'Generating...' : 'Generate Website'}
              </button>
            </form>
          </div>

          {/* Examples */}
          <div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wand2 size={20} />
                Examples
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setPrompt(
                      'A modern tech startup landing page with cool animations and pricing section'
                    );
                    setIndustry('SaaS');
                  }}
                  disabled={isGenerating}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  Tech startup
                </button>
                <button
                  onClick={() => {
                    setPrompt(
                      'Professional portfolio website for a graphic designer with portfolio grid and contact form'
                    );
                    setIndustry('Portfolio');
                  }}
                  disabled={isGenerating}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  Designer portfolio
                </button>
                <button
                  onClick={() => {
                    setPrompt(
                      'E-commerce store for selling electronics with shopping cart, product filters, and payment integration'
                    );
                    setIndustry('E-commerce');
                  }}
                  disabled={isGenerating}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  E-commerce store
                </button>
                <button
                  onClick={() => {
                    setPrompt(
                      'Blog for a lifestyle and wellness coach with articles and subscription'
                    );
                    setIndustry('Blog');
                  }}
                  disabled={isGenerating}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  Wellness blog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
