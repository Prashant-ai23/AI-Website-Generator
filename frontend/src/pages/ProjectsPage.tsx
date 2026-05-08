import { MainLayout } from '@/components/layout';

export function ProjectsPage() {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
        <p className="text-gray-600 mb-8">Manage your projects and collaborations</p>
        
        <div className="card">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">Projects feature is coming soon</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
