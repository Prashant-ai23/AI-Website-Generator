import { MainLayout } from '@/components/layout';
import { Wand2, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function GeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => setIsGenerating(false), 2000);
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry/Type
                </label>
                <select className="input-base">
                  <option value="">Select an option</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="blog">Blog</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="agency">Agency</option>
                  <option value="saas">SaaS</option>
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
                  onClick={() =>
                    setPrompt(
                      'A modern tech startup landing page with cool animations'
                    )
                  }
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                >
                  Tech startup
                </button>
                <button
                  onClick={() =>
                    setPrompt('Professional portfolio for a graphic designer')
                  }
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                >
                  Designer portfolio
                </button>
                <button
                  onClick={() => setPrompt('E-commerce store for organic products')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                >
                  E-commerce store
                </button>
                <button
                  onClick={() =>
                    setPrompt('Blog for a lifestyle and wellness coach')
                  }
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-sm"
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
