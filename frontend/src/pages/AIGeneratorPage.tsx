import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader,
  AlertCircle,
  Download,
  Copy,
  Trash2,
  Plus,
  Code,
  FileText,
  Zap,
} from 'lucide-react';
import PromptEditor from '@/components/AIGenerator/PromptEditor';
import GenerationProgress from '@/components/AIGenerator/GenerationProgress';
import GeneratedFilesExplorer from '@/components/AIGenerator/GeneratedFilesExplorer';
import CodeEditor from '@/components/AIGenerator/CodeEditor';

interface Project {
  _id: string;
  name: string;
  prompt: string;
  status: 'analyzing' | 'generating' | 'completed' | 'failed';
  progress: number;
  projectType: string;
  filesCount: number;
  createdAt: string;
}

export const AIGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'projects' | 'create' | 'files' | 'code'>('projects');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/ai-generator/projects', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setProjects(data.data.projects || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectFiles = async (projectId: string) => {
    try {
      const response = await fetch(`/api/v1/ai-generator/projects/${projectId}/files`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setGeneratedFiles(data.data.files || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGenerateProject = async (prompt: string, config: any) => {
    try {
      setGenerating(true);
      setError(null);

      const response = await fetch('/api/v1/ai-generator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: config.name || 'Generated Project',
          slug: config.slug || `project-${Date.now()}`,
          prompt,
          projectType: config.projectType || 'fullstack',
          techStack: config.techStack || {},
          options: config.options || {},
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate project');
      }

      const data = await response.json();
      const newProject = data.data.project;

      setProjects([newProject, ...projects]);
      setSelectedProject(newProject);
      setTab('files');
      loadProjectFiles(newProject._id);

      // Poll for updates
      pollProjectStatus(newProject._id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const pollProjectStatus = async (projectId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/v1/ai-generator/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        const project = data.data.project;

        setProjects((prev) =>
          prev.map((p) => (p._id === projectId ? project : p))
        );

        if (selectedProject?._id === projectId) {
          setSelectedProject(project);
          loadProjectFiles(projectId);
        }

        if (project.status === 'completed' || project.status === 'failed') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 5000);

    // Clear after 30 minutes
    setTimeout(() => clearInterval(interval), 1800000);
  };

  const handleDownloadProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/v1/ai-generator/projects/${projectId}/download`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      // TODO: Implement ZIP download
      window.open(data.data.downloadUrl);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await fetch(`/api/v1/ai-generator/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setProjects(projects.filter((p) => p._id !== projectId));
      if (selectedProject?._id === projectId) {
        setSelectedProject(null);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCloneProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/v1/ai-generator/projects/${projectId}/clone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: `${selectedProject?.name} (Clone)`,
          slug: `${selectedProject?.slug}-${Date.now()}`,
        }),
      });

      const data = await response.json();
      setProjects([data.data.project, ...projects]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Zap className="text-yellow-500" />
                AI Generator
              </h1>
              <p className="text-gray-600 mt-1">Generate full-stack applications with AI</p>
            </div>
            <button
              onClick={() => setTab('create')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setTab('projects')}
            className={`px-4 py-2 font-medium ${
              tab === 'projects'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setTab('create')}
            className={`px-4 py-2 font-medium ${
              tab === 'create'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Create New
          </button>
          {selectedProject && (
            <>
              <button
                onClick={() => setTab('files')}
                className={`px-4 py-2 font-medium ${
                  tab === 'files'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Files
              </button>
              <button
                onClick={() => setTab('code')}
                className={`px-4 py-2 font-medium ${
                  tab === 'code'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Code
              </button>
            </>
          )}
        </div>

        {/* Projects Tab */}
        {tab === 'projects' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No projects yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => {
                          setSelectedProject(project);
                          loadProjectFiles(project._id);
                          setTab('files');
                        }}
                      >
                        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{project.prompt}</p>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : project.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <FileText className="w-4 h-4" />
                      {project.filesCount} files generated
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          loadProjectFiles(project._id);
                          setTab('files');
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        <Code className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadProject(project._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handleCloneProject(project._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                      >
                        <Copy className="w-4 h-4" />
                        Clone
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Tab */}
        {tab === 'create' && (
          <PromptEditor
            onGenerate={handleGenerateProject}
            isGenerating={generating}
          />
        )}

        {/* Files Tab */}
        {tab === 'files' && selectedProject && (
          <GenerationProgress project={selectedProject}>
            <GeneratedFilesExplorer
              projectId={selectedProject._id}
              files={generatedFiles}
              onSelectFile={setSelectedFile}
              selectedFile={selectedFile}
            />
          </GenerationProgress>
        )}

        {/* Code Tab */}
        {tab === 'code' && selectedFile && (
          <CodeEditor
            file={selectedFile}
            projectId={selectedProject?._id}
          />
        )}
      </div>
    </div>
  );
};

export default AIGeneratorPage;
