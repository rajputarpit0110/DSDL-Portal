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
        <h3 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 700 }}>Why Join a Domain?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{ backgroundColor: 'var(--panel-solid)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}>
            <h4 style={{ color: 'var(--color-primary-hover)', marginBottom: '0.75rem', fontSize: '1.2rem', fontWeight: 700 }}>Specialized Learning</h4>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>Dive deep into specific tech stacks with targeted roadmaps, curated resources, and dedicated mentors who are experts in their fields.</p>
          </div>
          <div style={{ backgroundColor: 'var(--panel-solid)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}>
            <h4 style={{ color: 'var(--color-primary-hover)', marginBottom: '0.75rem', fontSize: '1.2rem', fontWeight: 700 }}>Collaborative Projects</h4>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>Apply what you learn by collaborating with peers in your domain on real-world projects, building a strong portfolio for internships.</p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Domains;
