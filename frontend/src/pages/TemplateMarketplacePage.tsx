import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Loader,
  AlertCircle,
  Star,
  Download,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { MainLayout } from '@/components/layout';
import TemplateService from '@/services/templateService';
import { TemplateSearch, TemplateFilter, TemplateCategoryFilter } from '@/components/Template/TemplateFilters';
import TemplateCard from '@/components/Template/TemplateCard';

export const TemplateMarketplacePage: React.FC = () => {
  const navigate = useNavigate();

  // Data
  const [templates, setTemplates] = useState<any[]>([]);
  const [featuredTemplates, setFeaturedTemplates] = useState<any[]>([]);
  const [recommendedTemplates, setRecommendedTemplates] = useState<any[]>([]);
  const [trendingTemplates, setTrendingTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [activeCategory, setActiveCategory] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 12 });
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'recommended' | 'trending'>('all');

  // Load data on mount
  useEffect(() => {
    loadMarketplaceData();
  }, []);

  // Load templates when search/filters change
  useEffect(() => {
    if (!loading) {
      loadTemplates();
    }
  }, [searchQuery, filters, activeCategory, pagination.page, activeTab]);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesData, featured, recommended, trending] = await Promise.all([
        TemplateService.getCategories(),
        TemplateService.getFeaturedTemplates(6),
        TemplateService.getRecommendedTemplates(6),
        TemplateService.getTrendingTemplates(6),
      ]);

      setCategories(categoriesData.categories || []);
      setFeaturedTemplates(featured.templates || []);
      setRecommendedTemplates(recommended.templates || []);
      setTrendingTemplates(trending.templates || []);

      await loadTemplates();
    } catch (err: any) {
      setError(err.message || 'Failed to load marketplace');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const allFilters: any = {
        ...filters,
        search: searchQuery,
        category: activeCategory || filters.category,
      };

      const result = await TemplateService.getTemplates(
        pagination.page,
        pagination.limit,
        allFilters
      );

      setTemplates(result.templates || []);
    } catch (err: any) {
      console.error('Failed to load templates:', err);
    }
  };

  const handleViewTemplate = (templateId: string) => {
    navigate(`/templates/${templateId}`);
  };

  const handleDownloadTemplate = async (templateId: string) => {
    try {
      await TemplateService.downloadTemplate(templateId);
      // Could show toast notification here
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const handleFavoriteTemplate = async (templateId: string) => {
    try {
      await TemplateService.toggleFavorite(templateId);
      loadMarketplaceData();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleCloneTemplate = async (templateId: string) => {
    try {
      const cloned = await TemplateService.cloneTemplate(templateId);
      navigate(`/templates/${cloned.template._id}/edit`);
    } catch (err) {
      console.error('Failed to clone:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const renderTemplateGrid = (templateList: any[], title?: string) => {
    if (templateList.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found</p>
        </div>
      );
    }

    return (
      <div>
        {title && <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templateList.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onView={handleViewTemplate}
              onDownload={handleDownloadTemplate}
              onFavorite={handleFavoriteTemplate}
              onClone={handleCloneTemplate}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Marketplace</h1>
              <p className="text-gray-600 mt-1">Choose from hundreds of professionally designed templates</p>
            </div>
            <button
              onClick={() => navigate('/templates/create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Template
            </button>
          </div>
        </div>

        {/* Content */}
        {loading && !templates.length ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Featured Section */}
            {activeTab === 'all' && (
              <>
                {/* Featured */}
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <h2 className="text-2xl font-bold text-gray-900">Featured Templates</h2>
                  </div>
                  {renderTemplateGrid(featuredTemplates)}
                </div>

                {/* Recommended */}
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                  </div>
                  {renderTemplateGrid(recommendedTemplates)}
                </div>

                {/* Trending */}
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
                  </div>
                  {renderTemplateGrid(trendingTemplates)}
                </div>
              </>
            )}

            {/* Tab Navigation */}
            {activeTab === 'all' && templates.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">All Templates</h2>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <TemplateCategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={(catId) => {
                      setActiveCategory(catId);
                      setPagination({ ...pagination, page: 1 });
                    }}
                  />
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <TemplateSearch onSearch={setSearchQuery} />
                  </div>
                  <TemplateFilter
                    categories={categories}
                    onFilterChange={(f) => {
                      setFilters(f);
                      setPagination({ ...pagination, page: 1 });
                    }}
                  />
                </div>

                {/* Templates Grid */}
                {templates.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No templates found</p>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <>
                    {renderTemplateGrid(templates)}

                    {/* Pagination */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
                        }
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="text-gray-600">Page {pagination.page}</span>
                      <button
                        onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default TemplateMarketplacePage;
