import React from 'react';
import { Folder, Archive, PlusSquare, CheckCircle2 } from 'lucide-react';

interface ProjectStatProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  onClick?: () => void;
}

const colorMap = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  red: 'bg-red-50 border-red-200',
  purple: 'bg-purple-50 border-purple-200',
};

const colorTextMap = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  red: 'text-red-600',
  purple: 'text-purple-600',
};

export const ProjectStatCard: React.FC<ProjectStatProps> = ({
  icon,
  label,
  value,
  color,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${colorMap[color]} border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:scale-105 transition-transform' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className={`text-3xl font-bold ${colorTextMap[color]}`}>{value}</p>
        </div>
        <div className={`${colorTextMap[color]} opacity-60`}>{icon}</div>
      </div>
    </div>
  );
};

interface RecentProjectsProps {
  projects: any[];
  onProjectClick?: (projectId: string) => void;
  onOpenProject?: (projectId: string) => void;
}

export const RecentProjectsSection: React.FC<RecentProjectsProps> = ({
  projects,
  onProjectClick,
  onOpenProject,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
      <div className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No projects yet</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onProjectClick?.(project._id)}
              >
                <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  project.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : project.status === 'archived'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {project.status}
                </span>
                <button
                  onClick={() => onOpenProject?.(project._id)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Open
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface ActivityItem {
  _id?: string;
  action: string;
  description: string;
  timestamp: string;
  userName?: string;
}

interface ProjectActivityProps {
  activities: ActivityItem[];
}

export const ProjectActivitySection: React.FC<ProjectActivityProps> = ({ activities }) => {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <PlusSquare className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      case 'published':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Folder className="w-4 h-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'archived':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'published':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'updated':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activity yet</p>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity._id || index}
              className={`flex items-start gap-3 p-3 rounded border ${getActivityColor(activity.action)}`}
            >
              <div className="mt-1">{getActivityIcon(activity.action)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(activity.timestamp).toLocaleDateString()} at{' '}
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
