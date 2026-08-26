import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { User, Menu, LogOut } from 'lucide-react';
import NotificationBell from '../components/common/NotificationBell';
import AnnouncementDetailModal from '../components/common/AnnouncementDetailModal';

const DashboardHeader = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { selectedAnnouncement, isAnnouncementModalOpen, closeAnnouncementModal } = useNotifications();

  return (
    <>
      <header
        style={{
          padding: '1rem 1.75rem',
          backgroundColor: 'rgba(10, 3, 3, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            aria-label="Open Sidebar"
            className="mobile-sidebar-toggle"
            style={{
              display: 'none',
              padding: '0.45rem',
              color: 'var(--color-text-main)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--color-border)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Menu size={20} />
          </button>

          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-text-main)', fontWeight: 700 }}>
              Welcome back, <span style={{ color: 'var(--color-primary-hover)' }}>{user?.name ? user.name.split(' ')[0] : 'Member'}</span>
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'capitalize', fontWeight: 500 }}>
              {user?.role === 'lead' ? 'Domain Lead' : user?.role === 'admin' ? 'Administrator' : 'Member Portal'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <NotificationBell />

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <User size={18} color="var(--color-primary)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-main)', lineHeight: 1.2 }}>
                {user?.name}
              </span>
              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'color 0.2s',
                  marginTop: '0.2rem'
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#f87171')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Announcement Detail Modal */}
      <AnnouncementDetailModal
        isOpen={isAnnouncementModalOpen}
        announcement={selectedAnnouncement}
        onClose={closeAnnouncementModal}
      />
    </>
  );
};

export default DashboardHeader;
