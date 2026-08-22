import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import Container from '../../common/Container';
import Card from '../../common/Card';
import { Brain, Sparkles, BarChart, Monitor, ArrowLeft, CheckCircle2 } from 'lucide-react';

const DomainDetail = () => {
  const { slug } = useParams();
  const [domain, setDomain] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/domains/${slug}`)
      .then(setDomain)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>Loading...</div>;

  if (!domain) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>Domain not found</h2>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  const getDomainIcon = (iconName) => {
    switch(iconName) {
      case 'Brain': return <Brain size={48} />;
      case 'Sparkles': return <Sparkles size={48} />;
      case 'BarChart': return <BarChart size={48} />;
      case 'Monitor': return <Monitor size={48} />;
      default: return <Brain size={48} />;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: '6rem', position: 'relative' }}>
      
      {/* Global Subtle Grey Grid Background */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }}></div>

      {/* Banner */}
      <div style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-secondary)', padding: '4rem 2rem 6rem 2rem', position: 'relative', zIndex: 1 }}>
        <Container>
          <Link to="/#domains" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: 'bold' }}>
            <ArrowLeft size={18} /> Back to Domains
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ color: 'var(--color-primary)' }}>
              {getDomainIcon(domain.icon)}
            </div>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{domain.name}</h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', fontWeight: '500' }}>{domain.description}</p>
            </div>
          </div>
        </Container>
      </div>

      <Container style={{ marginTop: '-3rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          <Card style={{ padding: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>About this Domain</h2>
            <p style={{ color: 'var(--color-text-main)', fontSize: '1.125rem', lineHeight: '1.8' }}>
              {domain.description}
            </p>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <Card style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>Why You Should Join</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(domain.whyJoin || ['Specialized Mentorship', 'Collaborative Environment']).map((reason, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--color-text-main)', lineHeight: '1.6' }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '0.125rem' }} />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>Example Projects</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {(domain.examples || ['Coming Soon']).map((example, index) => (
                  <li key={index} style={{ padding: '1rem', backgroundColor: 'var(--color-surface)', borderRadius: '8px', color: 'var(--color-text-main)', borderLeft: '4px solid var(--color-primary)' }}>
                    {example}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default DomainDetail;
