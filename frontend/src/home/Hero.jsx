import React from 'react';
import Button from '../common/Button';

const Hero = () => (
  <section style={{ textAlign: 'center', padding: '6rem 2rem 4rem 2rem' }}>
    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>BUILD. LEARN. INNOVATE.</h1>
    <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
      Machine Learning • GenAI • Data Science
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
      <Button variant='primary' style={{ borderRadius: 'var(--radius-xl)' }}>Explore the Club</Button>
    </div>
  </section>
);

export default Hero;
