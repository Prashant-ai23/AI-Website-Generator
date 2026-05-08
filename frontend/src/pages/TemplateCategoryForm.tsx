import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const ICONS = ['📁', '🎨', '🚀', '📝', '🛒', '☁️', '🏢', '📊', '🎯', '⚡', '🔧', '💡'];
const COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#6366f1', // indigo
];

interface Category {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
}

export function TemplateCategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Category>({
    name: '',
    description: '',
    icon: '📁',
    color: '#3b82f6',
    order: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      fetchCategory();
    }
  }, [isEdit, id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/v1/templates/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { name, description, icon, color, order, isActive } = response.data.data.category;
      setFormData({
        name,
        description: description || '',
        icon: icon || '📁',
        color: color || '#3b82f6',
        order: order || 0,
        isActive: isActive !== false,
      });
      setError(null);
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : 'Failed to load category';
      setError(message || 'Failed to load category');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : name === 'order' 
          ? (value === '' ? 0 : parseInt(value, 10))
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const token = localStorage.getItem('token');

      const payload = {
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        icon: formData.icon,
        color: formData.color,
        order: formData.order,
        isActive: formData.isActive,
      };

      if (isEdit && id) {
        await axios.put(`/api/v1/templates/categories/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setSuccess('Category updated successfully');
      } else {
        await axios.post('/api/v1/templates/categories', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setSuccess('Category created successfully');
      }

      setTimeout(() => {
        navigate('/templates/categories');
      }, 1500);
    } catch (err) {
      console.error('Submit error:', err);
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.response?.data?.error || err.message;
        setError(message || 'Failed to save category');
      } else {
        setError('Failed to save category');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/templates/categories')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Categories
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Category' : 'Create New Category'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update category details' : 'Add a new template category'}
          </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Business"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              maxLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.name.length} / 50 characters</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Brief description of this category"
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">{(formData.description || '').length} / 200 characters</p>
          </div>

          {/* Icon */}
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-900 mb-2">
              Icon
            </label>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{formData.icon}</div>
              <div className="grid grid-cols-6 gap-2">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                    className={`w-10 h-10 flex items-center justify-center text-2xl rounded-lg border-2 transition-colors ${
                      formData.icon === icon
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Color */}
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-900 mb-2">
              Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-16 rounded-lg border-2 border-gray-300"
                style={{ backgroundColor: formData.color }}
              ></div>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-lg border-2 transition-colors ${
                      formData.color === color ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order */}
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-900 mb-2">
              Display Order
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-900">
              Active Category
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate('/templates/categories')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
