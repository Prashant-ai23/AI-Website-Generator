import { useState } from 'react';
import { Download, Loader, Check, X } from 'lucide-react';
import { apiClient } from '@/services/apiClient';

interface ExportStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string;
}

export function ExportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [projectName, setProjectName] = useState('my-website');
  const [includeFrontend, setIncludeFrontend] = useState(true);
  const [includeBackend, setIncludeBackend] = useState(true);
  const [status, setStatus] = useState<ExportStatus>({
    loading: false,
    success: false,
    error: null,
    message: '',
  });

  const handleExport = async () => {
    setStatus({ loading: true, success: false, error: null, message: 'Preparing export...' });

    try {
      // Create API client instance to make the request
      const response = await fetch(
        `http://localhost:3000/api/v1/export/project?projectName=${encodeURIComponent(projectName)}&includeFrontend=${includeFrontend}&includeBackend=${includeBackend}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Get the blob
      const blob = await response.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${projectName}-export-${new Date().toISOString().split('T')[0]}.zip`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      URL.revokeObjectURL(url);

      setStatus({
        loading: false,
        success: true,
        error: null,
        message: `✓ Project exported successfully as ${link.download}`,
      });

      // Reset form after 2 seconds
      setTimeout(() => {
        setProjectName('my-website');
        setIncludeFrontend(true);
        setIncludeBackend(true);
        onClose();
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setStatus({
        loading: false,
        success: false,
        error: errorMessage,
        message: errorMessage,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Export Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={status.loading}
              placeholder="my-website"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeFrontend}
                onChange={(e) => setIncludeFrontend(e.target.checked)}
                disabled={status.loading}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 font-medium">Include Frontend</span>
              <span className="text-xs text-gray-500">React/TypeScript source</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBackend}
                onChange={(e) => setIncludeBackend(e.target.checked)}
                disabled={status.loading}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 font-medium">Include Backend</span>
              <span className="text-xs text-gray-500">Express/API source</span>
            </label>
          </div>

          {/* Documentation Notice */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              ✓ Documentation and setup files will be automatically included
            </p>
          </div>

          {/* Status Message */}
          {status.message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                status.success
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : status.error
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {status.loading && <Loader size={16} className="animate-spin" />}
                {status.success && <Check size={16} className="text-green-600" />}
                {status.error && <X size={16} className="text-red-600" />}
                {status.message}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={status.loading}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={status.loading || !projectName.trim()}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {status.loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Export as ZIP
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
