import React, { useState } from 'react';
import {
  MoreVertical,
  Archive,
  Trash2,
  Copy,
  Heart,
  Share2,
  Calendar,
  User,
} from 'lucide-react';

interface ProjectCardProps {
  project: any;
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  onDuplicate?: (projectId: string) => void;
  onArchive?: (projectId: string) => void;
  onToggleFavorite?: (projectId: string) => void;
  onOpen?: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onToggleFavorite,
  onOpen,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600"
              onClick={() => onOpen?.(project._id)}
            >
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {project.description || 'No description'}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onEdit?.(project._id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDuplicate?.(project._id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
                <button
                  onClick={() => {
                    onArchive?.(project._id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" /> Archive
                </button>
                <button
                  onClick={() => {
                    onDelete?.(project._id);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-700 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tech Stack */}
        {project.techStack && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {project.techStack.frontend && (
                <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                  {project.techStack.frontend}
                </span>
              )}
              {project.techStack.backend && (
                <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                  {project.techStack.backend}
                </span>
              )}
              {project.techStack.database && (
                <span className="inline-block px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">
                  {project.techStack.database}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              project.status === 'published'
                ? 'bg-green-100 text-green-700'
                : project.status === 'archived'
                ? 'bg-gray-100 text-gray-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {project.tags?.map((tag: string) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={() => onToggleFavorite?.(project._id)}
            className={`${project.isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
          >
            <Heart className={`w-5 h-5 ${project.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProjectListProps {
  projects: any[];
  onEdit?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
  onDuplicate?: (projectId: string) => void;
  onArchive?: (projectId: string) => void;
  onToggleFavorite?: (projectId: string) => void;
  onOpen?: (projectId: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onToggleFavorite,
  onOpen,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project._id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onArchive={onArchive}
          onToggleFavorite={onToggleFavorite}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
};

export default ProjectList;
