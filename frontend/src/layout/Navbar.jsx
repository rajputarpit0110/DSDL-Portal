import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import GooeyNav from '../components/common/GooeyNav';

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

  const handleNavClick = (href) => {
    if (href === '/' || href === '/#hero' || href === '#') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
      } else {
        navigate('/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (href.startsWith('/#') || href.startsWith('#')) {
      const sectionId = href.replace('/#', '').replace('#', '');
      if (location.pathname === '/') {
        const el = document.getElementById(sectionId);
        if (el) {
          const navHeight = 70;
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navHeight;
          window.scrollTo({
            top: offsetPosition > 0 ? offsetPosition : 0,
            behavior: 'smooth'
          });
          window.history.pushState(null, '', `/#${sectionId}`);
        }
      } else {
        navigate(`/#${sectionId}`);
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            const navHeight = 70;
            const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navHeight;
            window.scrollTo({
              top: offsetPosition > 0 ? offsetPosition : 0,
              behavior: 'smooth'
            });
          }
        }, 150);
      }
      return;
    }

    navigate(href);
  };

  const navItems = [
    { label: 'Home', href: '/', onClick: () => handleNavClick('/') },
    { label: 'About', href: '/#about', onClick: () => handleNavClick('/#about') },
    { label: 'Domains', href: '/#domains', onClick: () => handleNavClick('/#domains') },
    { label: 'Events', href: '/#events', onClick: () => handleNavClick('/#events') },
    { label: 'Projects', href: '/#projects', onClick: () => handleNavClick('/#projects') },
    { label: 'Achievements', href: '/#achievements', onClick: () => handleNavClick('/#achievements') },
    { label: 'Team', href: '/#team', onClick: () => handleNavClick('/#team') },
  ];

  const getActiveIndex = () => {
    if (location.hash) {
      const idx = navItems.findIndex((item) => item.href === `/${location.hash}` || item.href === location.hash);
      if (idx !== -1) return idx;
    }
    if (location.pathname === '/') return 0;
    const pathIdx = navItems.findIndex((item) => item.href === location.pathname);
    return pathIdx !== -1 ? pathIdx : 0;
  };

  return (
    <>
      <nav style={{
        padding: '0.85rem 1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'rgba(10, 3, 3, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        boxSizing: 'border-box',
        transform: 'translateZ(0)'
      }}>
        {/* Brand Logos */}
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              window.history.pushState(null, '', '/');
            }
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
        >
          <img src="/logo/kiet-logo.webp" alt="KIET" style={{ height: '36px', objectFit: 'contain' }} />
          <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--color-border)' }}></div>
          <img src="/logo/kriva-logo.webp" alt="KRIVA" style={{ height: '36px', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Navigation Links with GooeyNav */}
        <div className="desktop-nav-links" style={{ display: 'flex', alignItems: 'center' }}>
          <GooeyNav
            items={navItems}
            initialActiveIndex={getActiveIndex()}
            particleCount={10}
            particleDistances={[35, 6]}
            particleR={60}
            animationTime={450}
            timeVariance={200}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
          />
        </div>

        {/* Desktop Actions */}
        <div className="desktop-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.25rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={16} color="var(--color-primary)" />
                </div>
                <span style={{ color: 'var(--color-text-main)', fontWeight: '600', fontSize: '0.875rem' }}>
                  {user.name?.split(' ')[0]}
                </span>
              </div>

              {user.role === 'admin' ? (
                <Link
                  to="/admin/dashboard"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-main)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  Admin Portal
                </Link>
              ) : (
                <Link
                  to="/member/dashboard"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-main)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary-hover)';
                  e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-main)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-main)';
                }}
              >
                <LogIn size={15} /> Login
              </Link>

              {/* Register Button */}
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 1.15rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(220, 38, 38, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(220, 38, 38, 0.45)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(220, 38, 38, 0.25)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <UserPlus size={15} /> Register
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
            color: 'var(--color-text-main)',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--color-border)',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
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
            backgroundColor: 'rgba(10, 3, 3, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            padding: '1.75rem 1.5rem',
            overflowY: 'auto',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '2rem' }}>
            {navItems.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  handleNavClick(link.href);
                }}
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: (location.pathname === link.href || (location.hash && link.href.includes(location.hash))) ? 'var(--color-primary-hover)' : 'var(--color-text-main)',
                  textDecoration: 'none',
                  padding: '0.75rem 0.5rem',
                  borderBottom: '1px solid var(--color-border)',
                  transition: 'color 0.2s ease'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile User Actions */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={20} color="var(--color-primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{user.role}</div>
                  </div>
                </div>

                {user.role === 'admin' ? (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-main)',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textDecoration: 'none'
                    }}
                  >
                    Admin Portal
                  </Link>
                ) : (
                  <Link
                    to="/member/dashboard"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-main)',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      textDecoration: 'none'
                    }}
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                {/* Mobile Login Button */}
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-main)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textDecoration: 'none'
                  }}
                >
                  <LogIn size={17} /> Login to Portal
                </Link>

                {/* Mobile Register Button */}
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)'
                  }}
                >
                  <UserPlus size={17} /> Register for Recruitment
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
