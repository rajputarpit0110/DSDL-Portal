import React, { useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPanel from './NotificationPanel';

const NotificationBell = () => {
  const { unreadCount, isPanelOpen, togglePanel, closePanel } = useNotifications();
  const bellContainerRef = useRef(null);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellContainerRef.current && !bellContainerRef.current.contains(event.target)) {
        closePanel();
      }
    };

    if (isPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPanelOpen, closePanel]);

  return (
    <div ref={bellContainerRef} style={{ position: 'relative' }}>
      <button
        onClick={togglePanel}
        aria-label="Toggle notifications panel"
        style={{
          background: isPanelOpen ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          border: '1px solid',
          borderColor: isPanelOpen ? 'var(--color-primary)' : 'transparent',
          borderRadius: '10px',
          padding: '0.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.2s ease'
        }}
        onMouseOver={(e) => {
          if (!isPanelOpen) e.currentTarget.style.backgroundColor = 'var(--color-surface)';
        }}
        onMouseOut={(e) => {
          if (!isPanelOpen) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Bell
          size={20}
          color={isPanelOpen ? 'var(--color-primary)' : 'var(--color-secondary)'}
          style={{ transition: 'color 0.2s' }}
        />

        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#e11d48',
              color: 'white',
              fontSize: '11px',
              lineHeight: '1',
              borderRadius: '10px',
              padding: '3px 6px',
              fontWeight: '700',
              boxShadow: '0 0 0 2px #ffffff',
              minWidth: '18px',
              textAlign: 'center',
              animation: 'pulse 2s infinite'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isPanelOpen && <NotificationPanel />}
    </div>
  );
};

export default NotificationBell;
