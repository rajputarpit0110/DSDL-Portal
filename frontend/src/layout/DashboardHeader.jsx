import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { User } from 'lucide-react';
import NotificationBell from '../components/common/NotificationBell';
import AnnouncementDetailModal from '../components/common/AnnouncementDetailModal';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const { selectedAnnouncement, isAnnouncementModalOpen, closeAnnouncementModal } = useNotifications();

  return (
    <>
      <header
        style={{
          padding: '1.25rem 2rem',
          backgroundColor: 'white',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-secondary)' }}>
            Welcome back, {user?.name ? user.name.split(' ')[0] : 'Member'}
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
            {user?.role === 'lead' ? 'Domain Lead' : user?.role === 'admin' ? 'Administrator' : 'Member Portal'}
          </span>
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
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={18} color="var(--color-primary)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                {user?.name}
              </span>
              <span
                style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}
                onClick={logout}
                onMouseOver={(e) => (e.currentTarget.style.color = '#e11d48')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                Sign Out
              </span>
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
