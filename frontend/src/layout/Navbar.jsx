import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

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
        <Link to="/login" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          Admin Portal
        </Link>
        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ borderRadius: 'var(--color-radius-xl)' }}>
          Register Now →
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

