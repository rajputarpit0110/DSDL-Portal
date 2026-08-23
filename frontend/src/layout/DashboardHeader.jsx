import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import NotificationBell from '../components/common/NotificationBell';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  return (
    <header style={{ padding: '1.5rem 2rem', backgroundColor: 'white', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Welcome back, {user?.name.split(' ')[0]}</h2>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <NotificationBell />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color='var(--color-primary)' />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user?.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer' }} onClick={logout}>Sign Out</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
