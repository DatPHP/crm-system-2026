import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function CRMLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <div className="hidden lg:block">
        <Sidebar isOpen={sidebarOpen} />
      </div>

      {/* Sidebar — mobile (slide in) */}
      <div className={`
        fixed inset-y-0 left-0 z-30 lg:hidden transition-transform duration-300
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar isOpen={true} />
      </div>

      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onToggleSidebar={() => {
            // Desktop: thu/mở sidebar
            setSidebarOpen(!sidebarOpen);
            // Mobile: slide in/out
            setMobileSidebarOpen(!mobileSidebarOpen);
          }}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}