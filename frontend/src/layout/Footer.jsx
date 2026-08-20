import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-text-inverse)', padding: '4rem 2rem 2rem 2rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* Left Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '4px', display: 'inline-flex', marginBottom: '1rem' }}>
            <img src="/logo/kiet-logo.webp" alt="KIET" style={{ height: '30px' }} />
            <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--color-border)' }}></div>
            <img src="/logo/dsdl-logo.webp" alt="DSDL" style={{ height: '30px' }} />
          </div>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>DSDL Technical Club</h3>
          <p style={{ color: '#FF7043', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>KIET GROUP OF INSTITUTIONS • RECRUITMENT 2026</p>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.6' }}>
            The student technical community at KIET University dedicated to practical software engineering, machine learning, data science, and collaborative building.
          </p>
        </div>

        {/* Middle Column */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem' }}>QUICK NAVIGATION</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#94a3b8' }}>
            <Link to="/" style={{ hover: { color: 'white' }}}>Home</Link>
            <Link to="/about">About DSDL</Link>
            <Link to="/why-join">Why Join</Link>
            <Link to="/developer">Meet the Developer</Link>
            <Link to="/register">Register for Recruitment</Link>
            <Link to="/login">Admin Login</Link>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem' }}>CONNECT WITH US</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', border: '1px solid #10b981', borderRadius: '4px', color: '#10b981', fontSize: '0.875rem' }}>
              <span>Join Official WhatsApp Group</span>
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', border: '1px solid #e11d48', borderRadius: '4px', color: '#e11d48', fontSize: '0.875rem' }}>
              <span>Follow DSDL on Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2rem', fontSize: '0.875rem', color: '#64748b', alignItems: 'center' }}>
        <p>© 2026 DSDL Technical Club, KIET Group of Institutions. All rights reserved.</p>
        <p>Developed by <span style={{ color: 'white' }}>Arpit Rajput</span></p>
      </div>
    </footer>
  );
};

export default Footer;

