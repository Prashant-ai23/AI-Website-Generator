import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Loader, Clock } from 'lucide-react';

interface PhaseProgress {
  phase: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress: number;
  message: string;
  filesGenerated?: number;
  duration?: number;
}

interface GenerationProgressProps {
  projectId: string;
  isGenerating: boolean;
  overallProgress: number;
  currentPhase: string;
  phaseProgress?: PhaseProgress[];
  estimatedCompletion?: string;
  errors?: string[];
  onCancel?: () => void;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  projectId,
  isGenerating,
  overallProgress,
  currentPhase,
  phaseProgress = [],
  estimatedCompletion,
  errors = [],
  onCancel,
}) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const phases = [
    { id: 'requirements', name: 'Analyzing Requirements', icon: '📋' },
    { id: 'frontend', name: 'Generating Frontend', icon: '⚛️' },
    { id: 'backend', name: 'Generating Backend', icon: '🔧' },
    { id: 'database', name: 'Generating Database', icon: '🗄️' },
    { id: 'authentication', name: 'Setting Up Auth', icon: '🔐' },
    { id: 'documentation', name: 'Creating Docs', icon: '📚' },
    { id: 'deployment', name: 'Deployment Config', icon: '🚀' },
  ];

  const getPhaseStatus = (phaseId: string): PhaseProgress | undefined => {
    return phaseProgress.find((p) => p.phase === phaseId);
  };

  const getPhaseIcon = (status: string): React.ReactNode => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} className="text-green-500" />;
      case 'in-progress':
        return <Loader size={20} className="text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-400" />;
    }
  };

  const togglePhaseDetails = (phaseId: string): void => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Generation Progress</h2>
        <p className="text-gray-600">Project ID: {projectId}</p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">Overall Progress</span>
          <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Current Phase Display */}
      {isGenerating && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader size={20} className="text-blue-600 animate-spin" />
            <div>
              <p className="font-semibold text-blue-900">Currently Processing</p>
              <p className="text-blue-700">{currentPhase}</p>
            </div>
          </div>
        </div>
      )}

      {/* Estimated Completion */}
      {estimatedCompletion && isGenerating && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
          <Clock size={20} className="text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">Estimated Completion</p>
            <p className="text-amber-700">{estimatedCompletion}</p>
          </div>
        </div>
      )}

      {/* Phases Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Phases</h3>
        <div className="space-y-2">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.id);
            const phaseStatus = status?.status || 'pending';
            const isExpanded = expandedPhases.has(phase.id);

            return (
              <div key={phase.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  onClick={() => togglePhaseDetails(phase.id)}
                  className={`p-4 cursor-pointer flex items-center justify-between transition ${
                    phaseStatus === 'in-progress'
                      ? 'bg-blue-50'
                      : phaseStatus === 'completed'
                      ? 'bg-green-50'
                      : phaseStatus === 'error'
                      ? 'bg-red-50'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getPhaseIcon(phaseStatus)}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {phase.icon} {phase.name}
                      </p>
                      {status?.message && (
                        <p className="text-sm text-gray-600">{status.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {status?.filesGenerated && (
                      <p className="text-sm font-medium text-gray-700">
                        {status.filesGenerated} files
                      </p>
                    )}
                    {status?.duration && (
                      <p className="text-xs text-gray-500">
                        {(status.duration / 1000).toFixed(1)}s
                      </p>
                    )}
                  </div>
                </div>

                {/* Phase Details */}
                {isExpanded && status && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-semibold text-gray-900 capitalize">{phaseStatus}</p>
                      </div>
                      {status.filesGenerated && (
                        <div>
                          <p className="text-sm text-gray-600">Files Generated</p>
                          <p className="font-semibold text-gray-900">{status.filesGenerated}</p>
                        </div>
                      )}
                      {status.progress !== undefined && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600 mb-1">Phase Progress</p>
                          <div className="w-full bg-gray-300 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${status.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{status.progress}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Errors Section */}
      {errors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
            <AlertCircle size={20} />
            Errors ({errors.length})
          </h3>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isGenerating && onCancel && (
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
          >
            Cancel Generation
          </button>
        )}
        {!isGenerating && overallProgress === 100 && (
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 size={24} />
            <span className="font-semibold">Generation Complete!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerationProgress;
