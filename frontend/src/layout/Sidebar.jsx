import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Calendar, Users, Award, Briefcase } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const memberLinks = [
    { path: '/member/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/member/events', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/member/teams', label: 'Teams', icon: <Users size={20} /> },
    { path: '/member/projects', label: 'Projects', icon: <Briefcase size={20} /> },
    { path: '/member/achievements', label: 'Achievements', icon: <Award size={20} /> },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Overview', icon: <Home size={20} /> },
    { path: '/admin/users', label: 'Manage Users', icon: <Users size={20} /> },
    { path: '/admin/events', label: 'Manage Events', icon: <Calendar size={20} /> },
    { path: '/admin/projects', label: 'Global Projects', icon: <Briefcase size={20} /> },
  ];

  const links = user?.role === 'admin' ? adminLinks : memberLinks;

  return (
    <aside style={{ width: '250px', backgroundColor: 'var(--color-secondary)', color: 'white', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.25rem' }}>DSDL Portal</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{user?.role.toUpperCase()} VIEW</p>
      </div>
      <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map(link => (
          <Link key={link.path} to={link.path} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: location.pathname === link.path ? 'rgba(255,255,255,0.1)' : 'transparent', color: location.pathname === link.path ? 'white' : '#cbd5e1' }}>
            {link.icon}
            {link.label}
          </Link>
        ))} 
      </nav>
    </aside>
  );
};

export default Sidebar;
