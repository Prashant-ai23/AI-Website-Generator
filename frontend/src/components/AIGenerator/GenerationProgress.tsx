import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Loader } from 'lucide-react';

interface Project {
  _id: string;
  progress: number;
  status: string;
  currentPhase?: string;
  filesCount: number;
}

interface GenerationProgressProps {
  project: Project;
  children?: React.ReactNode;
}

const PHASES = [
  { id: 'requirements', label: 'Analyzing Requirements', icon: 'analysis' },
  { id: 'frontend', label: 'Generating Frontend', icon: 'react' },
  { id: 'backend', label: 'Generating Backend', icon: 'server' },
  { id: 'database', label: 'Creating Database', icon: 'database' },
  { id: 'auth', label: 'Setting Authentication', icon: 'lock' },
  { id: 'docs', label: 'Generating Documentation', icon: 'docs' },
  { id: 'deployment', label: 'Deployment Config', icon: 'deploy' },
];

export const GenerationProgress: React.FC<GenerationProgressProps> = ({ project, children }) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const diff = project.progress - prev;
        if (diff === 0) return prev;
        return prev + Math.ceil(diff / 10);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [project.progress]);

  const getCurrentPhaseIndex = () => {
    return PHASES.findIndex((p) => p.id === project.currentPhase);
  };

  const phaseIndex = getCurrentPhaseIndex();

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Generation Progress</h3>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : project.status === 'failed'
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {project.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
            {project.status === 'generating' && <Loader className="w-4 h-4 animate-spin" />}
            {project.status === 'failed' && <AlertCircle className="w-4 h-4" />}
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-semibold text-gray-900">{Math.min(displayProgress, 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(displayProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Phase Info */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 rounded p-3">
            <p className="text-gray-600">Files Generated</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{project.filesCount}</p>
          </div>
          <div className="bg-purple-50 rounded p-3">
            <p className="text-gray-600">Current Phase</p>
            <p className="text-lg font-semibold text-purple-600 mt-1">
              {phaseIndex >= 0 ? `${phaseIndex + 1}/7` : 'N/A'}
            </p>
          </div>
          <div className="bg-green-50 rounded p-3">
            <p className="text-gray-600">Overall Progress</p>
            <p className="text-lg font-semibold text-green-600 mt-1">
              {Math.min(displayProgress, 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Phases</h3>
        <div className="space-y-3">
          {PHASES.map((phase, index) => {
            const isActive = phase.id === project.currentPhase;
            const isCompleted = phaseIndex >= index && project.currentPhase;
            const isFailed = project.status === 'failed' && isActive;

            return (
              <div
                key={phase.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isActive
                    ? 'bg-blue-50 border-blue-300'
                    : isCompleted
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted && !isFailed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : isActive ? (
                    <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : isFailed ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    isActive || isCompleted ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {phase.label}
                  </p>
                </div>
                <div className="text-xs">
                  {isCompleted && <span className="text-green-600 font-medium">Done</span>}
                  {isActive && <span className="text-blue-600 font-medium">In Progress</span>}
                  {!isCompleted && !isActive && <span className="text-gray-500">Pending</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Children Content */}
      {children}
    </div>
  );
};

export default GenerationProgress;
