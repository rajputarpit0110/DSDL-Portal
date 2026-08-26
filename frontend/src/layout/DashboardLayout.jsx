import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: 'var(--void)'
    }}>
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <DashboardHeader onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)} />
        <main style={{ padding: '2rem', flex: 1, overflowY: 'auto', backgroundColor: 'var(--void)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
