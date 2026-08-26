import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Home, Calendar, Users, Award, Briefcase, Bell, X, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const memberLinks = [
    { path: '/member/dashboard', label: 'Dashboard', icon: <Home size={19} /> },
    { path: '/member/notifications', label: 'Notifications', icon: <Bell size={19} />, badge: unreadCount },
    { path: '/member/events', label: 'Events', icon: <Calendar size={19} /> },
    { path: '/member/teams', label: 'Teams', icon: <Users size={19} /> },
    { path: '/member/projects', label: 'Projects', icon: <Briefcase size={19} /> },
    { path: '/member/achievements', label: 'Achievements', icon: <Award size={19} /> },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Overview', icon: <Home size={19} /> },
    { path: '/admin/notifications', label: 'Notifications', icon: <Bell size={19} />, badge: unreadCount },
    { path: '/admin/users', label: 'Manage Users', icon: <Users size={19} /> },
    { path: '/admin/events', label: 'Manage Events', icon: <Calendar size={19} /> },
    { path: '/admin/projects', label: 'Global Projects', icon: <Briefcase size={19} /> },
    { path: '/admin/domains', label: 'Manage Domains', icon: <Users size={19} /> },
    { path: '/admin/announcements', label: 'Announcements', icon: <Award size={19} /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : memberLinks;

  const getRoleBadge = () => {
    if (user?.role === 'admin') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--color-primary-hover)',
          backgroundColor: 'rgba(220, 38, 38, 0.15)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          padding: '0.2rem 0.55rem',
          borderRadius: '9999px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          <ShieldCheck size={12} /> Administrator
        </span>
      );
    }
    if (user?.role === 'lead') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#fb923c',
          backgroundColor: 'rgba(251, 146, 60, 0.15)',
          border: '1px solid rgba(251, 146, 60, 0.3)',
          padding: '0.2rem 0.55rem',
          borderRadius: '9999px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          <Sparkles size={12} /> Domain Lead
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontSize: '0.72rem',
        fontWeight: 700,
        color: '#4ade80',
        backgroundColor: 'rgba(74, 222, 128, 0.12)',
        border: '1px solid rgba(74, 222, 128, 0.25)',
        padding: '0.2rem 0.55rem',
        borderRadius: '9999px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em'
      }}>
        <UserCheck size={12} /> Member
      </span>
    );
  };

  const sidebarContent = (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--panel-solid)',
      borderRight: '1px solid var(--color-border)',
      color: 'var(--color-text-main)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '0.6rem' }}>
            <img src="/logo/kriva-logo.webp" alt="KRIVA" style={{ height: '28px', objectFit: 'contain' }} />
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.01em' }}>
              KRIVA <span style={{ color: 'var(--color-primary)' }}>Portal</span>
            </span>
          </Link>
          <div>{getRoleBadge()}</div>
        </div>

        {mobileOpen && (
          <button
            onClick={onClose}
            aria-label="Close Sidebar"
            style={{
              padding: '0.4rem',
              color: 'var(--color-text-muted)',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: '1rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => {
                if (onClose) onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? 'rgba(220, 38, 38, 0.16)' : 'transparent',
                border: isActive ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid transparent',
                color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'all 0.18s ease'
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: isActive ? 'var(--color-primary-hover)' : 'inherit', display: 'flex' }}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </div>
              {link.badge > 0 && (
                <span
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(220, 38, 38, 0.4)'
                  }}
                >
                  {link.badge > 99 ? '99+' : link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer info */}
      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid var(--color-border)',
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>KRIVA System v2.6</span>
        <Link to="/" style={{ color: 'var(--color-primary-hover)', textDecoration: 'none', fontWeight: 600 }}>
          Public Site →
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="desktop-sidebar" style={{ height: '100%', display: 'flex' }}>
        {sidebarContent}
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex'
          }}
          onClick={onClose}
        >
          <div style={{ width: '280px', height: '100%', animation: 'scaleIn 0.18s ease-out' }} onClick={(e) => e.stopPropagation()}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
