import React from 'react';

const Stats = ({ stats }) => (
  <section className='container' style={{ padding: '2rem 2rem 4rem 2rem', display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '2rem' }}>
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.75rem', color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>First-Year</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Recruitment Open</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>{stats.domains}+</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Technical Domains</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.75rem', color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>Hands-on</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Project Mentorship</p>
    </div>
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.75rem', color: '#f59e0b', marginBottom: '0.25rem' }}>100%</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Beginner Friendly</p>
    </div>
  </section>
);

export default Stats;
