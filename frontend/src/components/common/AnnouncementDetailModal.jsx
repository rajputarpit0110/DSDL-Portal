import React, { useEffect } from 'react';
import { Megaphone, X, Calendar, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import Badge from '../../common/Badge';
import Button from '../../common/Button';

const AnnouncementDetailModal = ({ isOpen, announcement, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !announcement) return null;

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
        return '#e11d48';
      case 'HIGH':
        return '#ea580c';
      case 'NORMAL':
      default:
        return 'var(--color-primary)';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'ALERT':
        return <AlertTriangle size={18} color="#e11d48" />;
      case 'NEWS':
      default:
        return <Megaphone size={18} color="var(--color-primary)" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: 'var(--color-surface)'
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {getTypeIcon(announcement.type)}
            </div>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: getPriorityColor(announcement.priority)
                  }}
                >
                  {announcement.priority || 'NORMAL'} PRIORITY
                </span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <Badge color={announcement.type === 'ALERT' ? '#e11d48' : 'var(--color-primary)'}>
                  {announcement.type || 'ANNOUNCEMENT'}
                </Badge>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', margin: 0, fontWeight: 700, lineHeight: 1.3 }}>
                {announcement.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '0.25rem',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.75rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {announcement.summary && (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(59, 130, 246, 0.06)',
                borderRadius: '8px',
                borderLeft: '3px solid var(--color-primary)',
                marginBottom: '1.25rem',
                fontSize: '0.925rem',
                fontWeight: 500,
                color: 'var(--color-secondary)'
              }}
            >
              {announcement.summary}
            </div>
          )}

          <div
            style={{
              fontSize: '0.95rem',
              lineHeight: '1.7',
              color: 'var(--color-text-main)',
              whiteSpace: 'pre-line'
            }}
          >
            {announcement.content}
          </div>

          {/* Meta Info footer */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} />
              <span>
                Posted {announcement.publishedAt ? new Date(announcement.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary)' }}>
              <CheckCircle2 size={14} />
              <span>Official DSDL Broadcast</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}
        >
          <Button variant="primary" onClick={onClose} style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
            Got It, Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetailModal;
