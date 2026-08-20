import React from 'react';

const SectionHeading = ({ title, subtitle, badge }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      {badge && <div style={{ marginBottom: '1rem' }}><span style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{badge}</span></div>}
      <h2 style={{ fontSize: '2.5rem', maxWidth: '800px', margin: '0 auto', color: 'var(--color-secondary)' }}>{title}</h2>
      {subtitle && <p style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', maxWidth: '700px', margin: '1rem auto 0 auto' }}>{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;
