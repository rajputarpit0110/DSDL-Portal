import React from 'react';
import Button from '../common/Button';

const CommunityCTA = () => (
  <section style={{ backgroundColor: '#00427a', padding: '5rem 2rem', textAlign: 'center', color: 'white' }}>
    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'white' }}>Ready to Take the First Step?</h2>
    <p style={{ fontSize: '1.125rem', marginBottom: '2.5rem', color: '#bae6fd' }}>
      Applications for KIET DSDL Recruitment 2026 are actively being accepted.
    </p>
    <Button variant='primary' style={{ 
      backgroundColor: 'white', 
      color: '#00427a', 
      borderRadius: 'var(--radius-xl)', 
      fontWeight: '600',
      fontSize: '1rem',
      padding: '0.875rem 2rem'
    }}>
      Register for DSDL Recruitment Now
      <svg style={{ marginLeft: '0.5rem' }} width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M5 12h14M12 5l7 7-7 7'/></svg>
    </Button>
  </section>
);

export default CommunityCTA;
