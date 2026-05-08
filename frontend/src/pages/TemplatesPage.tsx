import { MainLayout } from '@/components/layout';
import { Palette } from 'lucide-react';

const templates = [
  {
    id: 1,
    name: 'Landing Page',
    description: 'Perfect for startups and product launches',
    image: '🚀',
  },
  {
    id: 2,
    name: 'Blog',
    description: 'Feature-rich blog with categories and tags',
    image: '📝',
  },
  {
    id: 3,
    name: 'Portfolio',
    description: 'Showcase your work and skills',
    image: '🎨',
  },
  {
    id: 4,
    name: 'E-commerce',
    description: 'Complete online store solution',
    image: '🛒',
  },
  {
    id: 5,
    name: 'SaaS',
    description: 'Software-as-a-Service website',
    image: '☁️',
  },
  {
    id: 6,
    name: 'Agency',
    description: 'Digital agency showcase',
    image: '🏢',
  },
];

export function TemplatesPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Templates</h1>
          <p className="text-gray-600">
            Choose from our collection of professional templates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="card-hover">
              <div className="text-5xl mb-4">{template.image}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                {template.description}
              </p>
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Palette size={18} />
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
