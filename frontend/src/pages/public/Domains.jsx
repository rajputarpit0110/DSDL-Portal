import React, { useState, useEffect } from 'react';
import Container from '../../common/Container';
import DomainPreview from '../../home/DomainPreview';
import { apiClient } from '../../utils/apiClient';

const Domains = () => {
  const [domains, setDomains] = useState([]);
  
  useEffect(() => {
    apiClient.get('/domains').then(setDomains).catch(console.error);
  }, []);

  return (
    <div style={{ padding: '4rem 0' }}>
      <DomainPreview domains={domains} />
      <Container style={{ marginTop: '4rem' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: '1.5rem', textAlign: 'center' }}>Why Join a Domain?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Specialized Learning</h4>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>Dive deep into specific tech stacks with targeted roadmaps, curated resources, and dedicated mentors who are experts in their fields.</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Collaborative Projects</h4>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>Apply what you learn by collaborating with peers in your domain on real-world projects, building a strong portfolio for internships.</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Domains;
