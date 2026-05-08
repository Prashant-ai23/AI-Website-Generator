/**
 * LivePreview Component
 * Displays live preview of generated code with error handling
 */

import React, { useEffect, useState } from 'react';
import usePreview from '../hooks/usePreview';
import { PreviewFile } from '../types/preview';
import { RefreshCw, Loader, AlertCircle, Zap, XCircle } from 'lucide-react';

interface LivePreviewProps {
  projectName: string;
  files: PreviewFile[];
  entryPoint: string;
  autoRefresh?: boolean;
  onErrors?: (errors: any[]) => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  projectName,
  files,
  entryPoint,
  autoRefresh = false,
  onErrors,
}) => {
  const {
    html,
    isLoading,
    errors,
    warnings,
    lastUpdate,
    generatePreview,
    streamPreview,
    previewComponent,
    stopStreaming,
    refreshPreview,
    clearErrors,
    iframeRef,
  } = usePreview();

  const [showErrors, setShowErrors] = useState(true);
  const [showWarnings, setShowWarnings] = useState(true);

  useEffect(() => {
    if (files.length === 0) return;

    if (autoRefresh) {
      streamPreview(projectName, files, entryPoint);
    } else {
      generatePreview(projectName, files, entryPoint);
    }

    return () => {
      if (autoRefresh) {
        stopStreaming();
      }
    };
  }, [projectName, files, entryPoint, autoRefresh]);

  useEffect(() => {
    if (errors.length > 0 && onErrors) {
      onErrors(errors);
    }
  }, [errors]);

  const handleRefresh = () => {
    refreshPreview(projectName, files, entryPoint);
  };

  const handleToggleAutoRefresh = () => {
    if (!autoRefresh) {
      streamPreview(projectName, files, entryPoint);
    } else {
      stopStreaming();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Live Preview</h3>
          <p className="text-sm text-slate-400">
            {projectName}
            {lastUpdate && ` • Updated ${lastUpdate.toLocaleTimeString()}`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Error Count */}
          {errors.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-900 rounded text-red-200 text-sm">
              <AlertCircle size={16} />
              {errors.length} error{errors.length !== 1 ? 's' : ''}
            </div>
          )}

          {/* Auto Refresh Toggle */}
          <button
            onClick={handleToggleAutoRefresh}
            className={`p-2 rounded transition-colors ${
              autoRefresh
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            title="Toggle auto-refresh"
          >
            <Zap size={18} />
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded transition-colors text-white"
            title="Refresh preview"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && showErrors && (
        <div className="bg-red-900 border-b border-red-800 p-4">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-sm font-semibold text-red-100">Compilation Errors</h4>
            <div className="flex gap-2">
              <button
                onClick={clearErrors}
                className="text-xs text-red-200 hover:text-red-100"
              >
                Clear
              </button>
              <button
                onClick={() => setShowErrors(false)}
                className="text-xs text-red-200 hover:text-red-100"
              >
                Hide
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {errors.slice(0, 5).map((error, index) => (
              <div key={index} className="bg-red-800 rounded p-3 text-sm text-red-100">
                <div className="flex items-start gap-2">
                  <XCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-mono font-semibold">{error.file}</p>
                    {error.line && <p className="text-xs opacity-75">Line {error.line}</p>}
                    <p className="mt-1">{error.message}</p>
                  </div>
                </div>
              </div>
            ))}
            {errors.length > 5 && (
              <p className="text-xs text-red-200 italic">
                +{errors.length - 5} more error{errors.length - 5 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Warning Messages */}
      {warnings.length > 0 && showWarnings && (
        <div className="bg-yellow-900 border-b border-yellow-800 p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold text-yellow-100">Warnings</h4>
            <button
              onClick={() => setShowWarnings(false)}
              className="text-xs text-yellow-200 hover:text-yellow-100"
            >
              Hide
            </button>
          </div>

          <div className="space-y-1">
            {warnings.slice(0, 3).map((warning, index) => (
              <p key={index} className="text-sm text-yellow-100">
                • {warning}
              </p>
            ))}
            {warnings.length > 3 && (
              <p className="text-xs text-yellow-200 italic">
                +{warnings.length - 3} more warning{warnings.length - 3 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center bg-slate-800">
          <div className="text-center">
            <Loader size={48} className="animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-slate-300">Generating preview...</p>
          </div>
        </div>
      )}

      {/* Preview Container */}
      {!isLoading && html && errors.length === 0 && (
        <iframe
          ref={iframeRef}
          className="flex-1 w-full border-0"
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin allow-styles"
          srcDoc={html}
        />
      )}

      {/* Fallback when there are errors */}
      {!isLoading && errors.length > 0 && (
        <div className="flex-1 flex items-center justify-center bg-slate-800">
          <div className="text-center">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
            <p className="text-slate-300">Unable to render preview</p>
            <p className="text-sm text-slate-400 mt-2">Fix the errors above and refresh</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !html && (
        <div className="flex-1 flex items-center justify-center bg-slate-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Zap size={32} className="text-slate-500" />
            </div>
            <p className="text-slate-300">No preview available</p>
            <p className="text-sm text-slate-400 mt-2">Add files and click refresh to generate preview</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePreview;
