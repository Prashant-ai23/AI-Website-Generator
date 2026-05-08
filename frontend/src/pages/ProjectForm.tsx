import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader, AlertCircle, Plus, X } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import ProjectService, { ProjectData } from '@/services/projectService';

const PROJECT_TYPES = [
  { value: 'website', label: 'Website' },
  { value: 'blog', label: 'Blog' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'custom', label: 'Custom' },
];

const TECH_OPTIONS = {
  frontend: [
    'React',
    'Vue',
    'Angular',
    'Next.js',
    'Svelte',
    'Ember',
    'Nuxt',
    'Gatsby',
  ],
  backend: [
    'Node.js',
    'Express',
    'Django',
    'Flask',
    'FastAPI',
    'Spring Boot',
    'Go',
    'Rust',
  ],
  database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'DynamoDB'],
  authentication: ['JWT', 'OAuth 2.0', 'Firebase Auth', 'Auth0', 'Passport.js'],
};

export const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Form state
  const [formData, setFormData] = useState<ProjectData>({
    name: '',
    description: '',
    type: 'website',
    status: 'draft',
    techStack: {
      frontend: '',
      backend: '',
      database: '',
      authentication: '',
    },
    tags: [],
  });

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTechDropdowns, setShowTechDropdowns] = useState({
    frontend: false,
    backend: false,
    database: false,
    authentication: false,
  });

  // Load project data if editing
  useEffect(() => {
    if (isEditMode) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const project = await ProjectService.getProjectById(id!);
      setFormData(project);
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTechStackChange = (field: keyof ProjectData['techStack'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [field]: value,
      },
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        await ProjectService.updateProject(id!, formData);
      } else {
        await ProjectService.createProject(formData);
      }

      navigate('/projects');
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Project' : 'Create Project'}
          </h1>
        </div>

        {/* Form */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="published">Published</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(TECH_OPTIONS) as Array<keyof typeof TECH_OPTIONS>).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {field}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.techStack?.[field as any] || ''}
                      onChange={(e) =>
                        handleTechStackChange(field as any, e.target.value)
                      }
                      onFocus={() =>
                        setShowTechDropdowns((prev) => ({
                          ...prev,
                          [field]: true,
                        }))
                      }
                      placeholder={`Select or enter ${field}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {showTechDropdowns[field as keyof typeof showTechDropdowns] && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {TECH_OPTIONS[field].map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              handleTechStackChange(field as any, option);
                              setShowTechDropdowns((prev) => ({
                                ...prev,
                                [field]: false,
                              }));
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader className="w-4 h-4 animate-spin" />}
              {saving ? 'Saving...' : isEditMode ? 'Update Project' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default ProjectForm;
