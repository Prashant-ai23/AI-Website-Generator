import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAppStore } from '@/store/appStore';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - visible on desktop, toggleable on mobile */}
        <Sidebar />

        {/* Main content */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${
            sidebarOpen ? 'lg:w-full' : 'lg:w-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
