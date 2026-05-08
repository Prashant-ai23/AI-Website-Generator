import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function TemplateCategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/templates/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data.data.categories || []);
      setError(null);
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : 'Failed to load categories';
      setError(message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/v1/templates/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Category deleted successfully');
      setShowDeleteConfirm(null);
      fetchCategories();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : 'Failed to delete category';
      setError(message || 'Failed to delete category');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/templates/categories/edit/${id}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading categories...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Template Categories</h1>
            <p className="text-gray-600 mt-2">Manage template categories</p>
          </div>
          <button
            onClick={() => navigate('/templates/categories/new')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Category
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4"
                style={{ borderLeftColor: category.color || '#3b82f6' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: category.color || '#3b82f6' }}
                    >
                      {category.icon || '📁'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-xs text-gray-500">@{category.slug}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {category.description && (
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-500">Order: {category.order}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category._id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(category._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm === category._id && (
                  <div className="mt-4 pt-4 border-t bg-red-50 p-3 rounded">
                    <p className="text-sm text-red-900 mb-3">Are you sure you want to delete this category?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 px-3 py-2 bg-gray-300 text-gray-800 text-sm rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">No categories found</p>
                <button
                  onClick={() => navigate('/templates/categories/new')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Create First Category
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
