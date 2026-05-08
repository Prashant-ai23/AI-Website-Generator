import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Loader,
  AlertCircle,
  Edit,
  Trash2,
  Archive,
  Share2,
  Calendar,
  User,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import ProjectService from '@/services/projectService';
import { MainLayout } from '@/components/layout';
import {
  ProjectActivitySection,
} from '@/components/ProjectDashboard/ProjectStatsCard';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjectDetails();
  }, [id]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const projectData = await ProjectService.getProjectById(id!);
      const historyData = await ProjectService.getProjectHistory(id!, 10);

      setProject(projectData);
      setActivities(historyData.history || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/projects/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await ProjectService.deleteProject(id!);
      navigate('/projects');
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const handleArchive = async () => {
    try {
      await ProjectService.archiveProject(id!);
      loadProjectDetails();
    } catch (err) {
      setError('Failed to archive project');
    }
  };

  const handleRestore = async () => {
    try {
      await ProjectService.restoreProject(id!);
      loadProjectDetails();
    } catch (err) {
      setError('Failed to restore project');
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await ProjectService.toggleFavorite(id!);
      loadProjectDetails();
    } catch (err) {
      setError('Failed to toggle favorite');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
          <div className="text-center">
            <p className="text-gray-600">Project not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-1">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg ${
                  project.isFavorite
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600'
                } hover:scale-110 transition-transform`}
              >
                <Heart className={`w-5 h-5 ${project.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {project.description || 'No description provided'}
              </p>
            </div>

            {/* Tech Stack */}
            {project.techStack && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Technology Stack</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.techStack.frontend && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Frontend</p>
                      <p className="text-lg font-medium text-blue-600">
                        {project.techStack.frontend}
                      </p>
                    </div>
                  )}
                  {project.techStack.backend && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Backend</p>
                      <p className="text-lg font-medium text-green-600">
                        {project.techStack.backend}
                      </p>
                    </div>
                  )}
                  {project.techStack.database && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Database</p>
                      <p className="text-lg font-medium text-purple-600">
                        {project.techStack.database}
                      </p>
                    </div>
                  )}
                  {project.techStack.authentication && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Authentication</p>
                      <p className="text-lg font-medium text-orange-600">
                        {project.techStack.authentication}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Info</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-medium text-gray-900 capitalize">{project.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p
                    className={`font-medium capitalize ${
                      project.status === 'published'
                        ? 'text-green-600'
                        : project.status === 'archived'
                        ? 'text-gray-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {project.status}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Last Modified</p>
                  <p className="font-medium text-gray-900">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity */}
            <ProjectActivitySection activities={activities} />

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <button
                onClick={handleEdit}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                Edit Project
              </button>
              {project.status !== 'archived' && (
                <button
                  onClick={handleArchive}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
              )}
              {project.status === 'archived' && (
                <button
                  onClick={handleRestore}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Edit className="w-4 h-4" />
                  Restore
                </button>
              )}
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectDetailsPage;
