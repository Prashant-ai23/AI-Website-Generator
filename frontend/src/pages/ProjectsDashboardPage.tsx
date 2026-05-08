import React, { useState, useEffect } from 'react';
import { Plus, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { MainLayout } from '@/components/layout';
import ProjectService from '@/services/projectService';
import { ProjectSearch } from '@/components/Project/ProjectSearch';
import { ProjectFilter } from '@/components/Project/ProjectSearch';
import {
  ProjectStatCard,
  RecentProjectsSection,
  ProjectActivitySection,
} from '@/components/ProjectDashboard/ProjectStatsCard';
import { ProjectList } from '@/components/Project/ProjectCard';
import { Folder, Archive, PlusSquare, CheckCircle2 } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export const ProjectsDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Data state
  const [projects, setProjects] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState({ page: 1, limit: 9 });

  // Tabs
  const tabs: Tab[] = [
    { id: 'all', label: 'All Projects', icon: <Folder className="w-4 h-4" /> },
    { id: 'favorites', label: 'Favorites', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'active', label: 'Active' },
    { id: 'archived', label: 'Archived', icon: <Archive className="w-4 h-4" /> },
  ];

  // Load data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load filtered projects when search or filters change
  useEffect(() => {
    if (!loading) {
      loadProjects();
    }
  }, [searchQuery, filters, pagination.page]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, recentData, favoriteData] = await Promise.all([
        ProjectService.getProjectStats(),
        ProjectService.getRecentProjects(5),
        ProjectService.getFavoriteProjects(5),
      ]);

      setStats(statsData);
      setRecentProjects(recentData.projects || []);
      setFavoriteProjects(favoriteData.projects || []);

      // Mock activities for now
      setActivities([
        {
          action: 'created',
          description: 'You created a new project',
          timestamp: new Date().toISOString(),
        },
      ]);

      await loadProjects();
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const allFilters: any = { ...filters, search: searchQuery };

      if (activeTab === 'archived') {
        allFilters.status = 'archived';
      } else if (activeTab === 'active') {
        allFilters.status = 'published';
      } else if (activeTab === 'favorites') {
        allFilters.isFavorite = true;
      }

      const result = await ProjectService.getProjects(
        pagination.page,
        pagination.limit,
        allFilters
      );

      setProjects(result.projects || []);
    } catch (err: any) {
      console.error('Failed to load projects:', err);
    }
  };

  const handleCreateProject = () => {
    navigate('/projects/create');
  };

  const handleOpenProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await ProjectService.deleteProject(projectId);
      loadDashboardData();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    try {
      await ProjectService.duplicateProject(projectId);
      loadDashboardData();
    } catch (err) {
      console.error('Failed to duplicate project:', err);
    }
  };

  const handleArchiveProject = async (projectId: string) => {
    try {
      await ProjectService.archiveProject(projectId);
      loadDashboardData();
    } catch (err) {
      console.error('Failed to archive project:', err);
    }
  };

  const handleToggleFavorite = async (projectId: string) => {
    try {
      await ProjectService.toggleFavorite(projectId);
      loadDashboardData();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">Manage and organize your projects</p>
            </div>
            <button
              onClick={handleCreateProject}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Dashboard Stats */}
            {activeTab === 'all' && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <ProjectStatCard
                    icon={<Folder className="w-8 h-8" />}
                    label="Total Projects"
                    value={stats?.total || 0}
                    color="blue"
                    onClick={() => setActiveTab('all')}
                  />
                  <ProjectStatCard
                    icon={<CheckCircle2 className="w-8 h-8" />}
                    label="Published"
                    value={stats?.published || 0}
                    color="green"
                    onClick={() => setActiveTab('active')}
                  />
                  <ProjectStatCard
                    icon={<PlusSquare className="w-8 h-8" />}
                    label="Draft"
                    value={stats?.draft || 0}
                    color="yellow"
                  />
                  <ProjectStatCard
                    icon={<Archive className="w-8 h-8" />}
                    label="Archived"
                    value={stats?.archived || 0}
                    color="red"
                    onClick={() => setActiveTab('archived')}
                  />
                  <ProjectStatCard
                    icon={<Folder className="w-8 h-8" />}
                    label="Active"
                    value={stats?.active || 0}
                    color="purple"
                  />
                </div>
              </div>
            )}

            {/* Recent & Activity */}
            {activeTab === 'all' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <RecentProjectsSection
                    projects={recentProjects}
                    onOpenProject={handleOpenProject}
                  />
                </div>
                <ProjectActivitySection activities={activities} />
              </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-6 border-b border-gray-200">
              <nav className="flex gap-4 -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Search & Filter */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex-1">
                <ProjectSearch onSearch={setSearchQuery} />
              </div>
              <ProjectFilter onFilterChange={setFilters} />
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
              <div className="text-center py-16">
                <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || Object.keys(filters).length > 0
                    ? 'Try adjusting your search or filters'
                    : 'Create your first project to get started'}
                </p>
                {!searchQuery && Object.keys(filters).length === 0 && (
                  <button
                    onClick={handleCreateProject}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                    Create Project
                  </button>
                )}
              </div>
            ) : (
              <ProjectList
                projects={projects}
                onDelete={handleDeleteProject}
                onDuplicate={handleDuplicateProject}
                onArchive={handleArchiveProject}
                onToggleFavorite={handleToggleFavorite}
                onOpen={handleOpenProject}
              />
            )}

            {/* Pagination */}
            {projects.length > 0 && (
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
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: p.page + 1 }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectsDashboardPage;
