import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-background)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src="/logo/kiet-logo.webp" alt="KIET" style={{ height: '40px' }} />
        <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--color-border)' }}></div>
        <img src="/logo/dsdl-logo.webp" alt="DSDL" style={{ height: '40px' }} />
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontWeight: '500', color: 'var(--color-text-muted)' }}>
        <Link to="/" style={{ color: 'var(--color-text-main)' }}>Home</Link>
        <a href="/#about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
        <a href="/#domains" style={{ color: 'inherit', textDecoration: 'none' }}>Domains</a>
        <a href="/#events" style={{ color: 'inherit', textDecoration: 'none' }}>Events</a>
        <a href="/#projects" style={{ color: 'inherit', textDecoration: 'none' }}>Projects</a>
        <a href="/#team" style={{ color: 'inherit', textDecoration: 'none' }}>Team</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <span style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Hello, {user.name}</span>
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', textDecoration: 'none' }}>
                Admin Portal
              </Link>
            )}
            {user.role !== 'admin' && (
              <Link to="/member/dashboard" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', textDecoration: 'none' }}>
                Dashboard
              </Link>
            )}
            <button onClick={handleLogout} className="btn btn-outline" style={{ borderRadius: 'var(--color-radius-xl)', padding: '0.5rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              Login
            </Link>
            <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ borderRadius: 'var(--color-radius-xl)' }}>
              Register Now →
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

