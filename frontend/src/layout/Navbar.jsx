import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogIn, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/#about' },
    { label: 'Domains', path: '/#domains' },
    { label: 'Events', path: '/#events' },
    { label: 'Projects', path: '/#projects' },
    { label: 'Achievements', path: '/#achievements' },
    { label: 'Team', path: '/#team' },
  ];

  return (
    <>
      <nav style={{
        padding: '0.85rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        transform: 'translateZ(0)'
      }}>
        {/* Brand Logos */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="/logo/kiet-logo.webp" alt="KIET" style={{ height: '36px', objectFit: 'contain' }} />
          <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--color-border)' }}></div>
          <img src="/logo/kriva-logo.webp" alt="KRIVA" style={{ height: '36px', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav-links" style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', fontWeight: '600', fontSize: '0.925rem' }}>
          {navLinks.map((link) => (
            link.path.startsWith('/#') ? (
              <a
                key={link.label}
                href={link.path}
                style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.path}
                style={{ color: location.pathname === link.path ? 'var(--color-primary)' : 'var(--color-text-muted)', transition: 'color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = location.pathname === link.path ? 'var(--color-primary)' : 'var(--color-text-muted)'}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="desktop-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="var(--color-primary)" />
                </div>
                <span style={{ color: 'var(--color-text-main)', fontWeight: '600', fontSize: '0.875rem' }}>
                  {user.name?.split(' ')[0]}
                </span>
              </div>

              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="btn btn-outline" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  Admin Portal
                </Link>
              )}
              {user.role !== 'admin' && (
                <Link to="/member/dashboard" className="btn btn-outline" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="btn" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-secondary)', border: '1px solid var(--color-border)', padding: '0.45rem 0.9rem', fontSize: '0.85rem', fontWeight: 600 }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.9rem', padding: '0.45rem 0.85rem' }}>
                <LogIn size={16} /> Login
              </Link>

            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
          style={{
            display: 'none',
            padding: '0.5rem',
            color: 'var(--color-secondary)',
            borderRadius: '8px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div
          className="mobile-nav-drawer"
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(12px)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1.5rem',
            overflowY: 'auto',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {navLinks.map((link) => (
              link.path.startsWith('/#') ? (
                <a
                  key={link.label}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-secondary)',
                    textDecoration: 'none',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-secondary)',
                    textDecoration: 'none',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--color-border)'
                  }}
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>

          {/* Mobile User Actions */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-secondary)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user.role}</div>
                  </div>
                </div>

                {user.role === 'admin' ? (
                  <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ textAlign: 'center', padding: '0.75rem' }}>
                    Admin Portal
                  </Link>
                ) : (
                  <Link to="/member/dashboard" onClick={() => setMobileOpen(false)} className="btn btn-outline" style={{ textAlign: 'center', padding: '0.75rem' }}>
                    Dashboard
                  </Link>
                )}

                <button onClick={handleLogout} className="btn" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.75rem' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-outline"
                  style={{ textAlign: 'center', padding: '0.75rem', fontSize: '1rem', fontWeight: 600 }}
                >
                  Login to Portal
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
