import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--void)', color: 'var(--color-text-inverse)', padding: '4rem 2rem 2rem 2rem', position: 'relative', zIndex: 10 }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
        
        {/* Left Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fff', padding: '0.5rem', borderRadius: '4px', display: 'inline-flex', marginBottom: '1rem' }}>
            <img src="/logo/kiet-logo.webp" alt="KIET" style={{ height: '30px' }} />
            <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--color-border)' }}></div>
            <img src="/logo/kriva-logo.webp" alt="KRIVA" style={{ height: '30px' }} />
          </div>
          <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>KRIVA Technical Club</h3>
          <p style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>KIET GROUP OF INSTITUTIONS • RECRUITMENT 2026</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
            The student technical community at KIET University dedicated to practical software engineering, machine learning, data science, and collaborative building.
          </p>
        </div>

        {/* Middle Column */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1rem' }}>QUICK NAVIGATION</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            <Link to="/" style={{ hover: { color: 'white' }}}>Home</Link>
            <Link to="/about">About KRIVA</Link>
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
              <span>Follow KRIVA on Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', alignItems: 'center' }}>
        <p>© 2026 KRIVA Technical Club, KIET Group of Institutions. All rights reserved.</p>
        <p>Developed by <span style={{ color: 'white' }}>Arpit Rajput</span></p>
      </div>
    </footer>
  );
};

export default Footer;

