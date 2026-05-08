import { Menu, LogOut, Settings, Download } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { ExportModal } from '../common/ExportModal';

export function Header() {
  const { toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu size={24} className="text-gray-700" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                Website Generator
              </h1>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-gray-700">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>

                <button
                  onClick={() => setShowExportModal(true)}
                  className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                  aria-label="Export project"
                  title="Export project as ZIP"
                >
                  <Download size={20} className="text-green-600" />
                </button>

                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Settings"
                >
                  <Settings size={20} className="text-gray-700" />
                </button>

                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Logout"
                >
                  <LogOut size={20} className="text-red-600" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
    </header>
  );
}
