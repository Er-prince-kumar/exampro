import React from 'react';
import { Outlet } from 'react-router-dom';
import { DesktopSidebar, MobileBottomNav } from '../components/Navigation';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row text-slate-100">
      {/* Desktop Sidebar Navigation */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

