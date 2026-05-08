import { useState, useEffect } from 'react';
import { Plus, Loader, AlertCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { apiClient } from '@/services/apiClient';

interface Website {
  _id: string;
  title: string;
  description: string;
  theme: string;
  isPublished: boolean;
  createdAt: string;
}

export function DashboardPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await apiClient.getWebsites();
      setWebsites(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch websites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your websites and projects</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-sm text-gray-600 mb-2">Total Websites</div>
            <div className="text-3xl font-bold text-gray-900">
              {websites.length}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 mb-2">Published</div>
            <div className="text-3xl font-bold text-green-600">
              {websites.filter((w) => w.isPublished).length}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 mb-2">Drafts</div>
            <div className="text-3xl font-bold text-yellow-600">
              {websites.filter((w) => !w.isPublished).length}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-gray-600 mb-2">Storage Used</div>
            <div className="text-3xl font-bold text-blue-600">
              2.4 GB
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Websites section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Websites</h2>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              New Website
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size={32} className="text-primary-600 animate-spin" />
            </div>
          ) : websites.length === 0 ? (
            <div className="card text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Plus size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No websites yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first website to get started
              </p>
              <button className="btn-primary">
                Create Website
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websites.map((website) => (
                <div key={website._id} className="card-hover group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {website.title}
                    </h3>
                    {website.isPublished ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {website.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Theme: {website.theme}</span>
                    <span>
                      {new Date(website.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex-1 btn-secondary text-sm">
                      Edit
                    </button>
                    <button className="flex-1 btn-ghost text-sm">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
