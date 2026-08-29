import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Home, Calendar, Users, Award, Briefcase, Bell } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();

  const memberLinks = [
    { path: '/member/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/member/notifications', label: 'Notifications', icon: <Bell size={20} />, badge: unreadCount },
    { path: '/member/events', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/member/teams', label: 'Teams', icon: <Users size={20} /> },
    { path: '/member/projects', label: 'Projects', icon: <Briefcase size={20} /> },
    { path: '/member/achievements', label: 'Achievements', icon: <Award size={20} /> },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Overview', icon: <Home size={20} /> },
    { path: '/admin/notifications', label: 'Notifications', icon: <Bell size={20} />, badge: unreadCount },
    { path: '/admin/users', label: 'Manage Users', icon: <Users size={20} /> },
    { path: '/admin/events', label: 'Manage Events', icon: <Calendar size={20} /> },
    { path: '/admin/projects', label: 'Global Projects', icon: <Briefcase size={20} /> },
    { path: '/admin/domains', label: 'Manage Domains', icon: <Users size={20} /> },
    { path: '/admin/announcements', label: 'Announcements', icon: <Award size={20} /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : memberLinks;

  return (
    <aside style={{ width: '250px', backgroundColor: 'var(--color-secondary)', color: 'white', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.25rem' }}>KRIVA Portal</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{user?.role.toUpperCase()} VIEW</p>
      </div>
      <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
        {links.map(link => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: isActive ? 'white' : '#cbd5e1',
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {link.icon}
                <span>{link.label}</span>
              </div>
              {link.badge > 0 && (
                <span
                  style={{
                    backgroundColor: '#e11d48',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px'
                  }}
                >
                  {link.badge > 99 ? '99+' : link.badge}
                </span>
              )}
            </Link>
          );
        })} 
      </nav>
    </aside>
  );
};

export default Sidebar;
