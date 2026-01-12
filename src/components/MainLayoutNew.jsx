import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import Sidebar from './SidebarNew';

/**
 * Main Layout Component
 * Wraps protected pages with top navbar and context-aware sidebar
 */
export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <TopNavBar onMenuClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-56">
        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
