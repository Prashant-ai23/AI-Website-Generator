import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Folder,
  Palette,
  Tag,
  Wand2,
  Settings,
  X,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useCallback } from 'react';

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: Folder,
    label: 'Projects',
    path: '/projects',
  },
  {
    icon: Palette,
    label: 'Templates',
    path: '/templates',
  },
  {
    icon: Tag,
    label: 'Categories',
    path: '/templates/categories',
  },
  {
    icon: Wand2,
    label: 'AI Generator',
    path: '/generator',
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
  },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  const handleNavClick = useCallback(() => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [setSidebarOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[73px] bottom-0 w-64 bg-dark-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:relative lg:top-0 lg:transform-none z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button on mobile */}
          <div className="flex justify-end p-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 px-4 py-8 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-dark-800'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer section */}
          <div className="border-t border-gray-800 p-4">
            <p className="text-xs text-gray-500 text-center">
              v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
