import React from 'react';
import { Code, Sparkles, Smartphone, Cpu, Database, Share2, Calendar, Paintbrush, Plus } from 'lucide-react';
import Container from '../common/Container';
import SectionHeading from '../common/SectionHeading';

const iconMap = {
  'web-dev': <Code size={20} />,
  'dsa': <Sparkles size={20} />,
  'app-dev': <Smartphone size={20} />,
  'ai-ml': <Cpu size={20} />,
  'data-science': <Database size={20} />,
  'content': <Share2 size={20} />,
  'event-management': <Calendar size={20} />,
  'ui-ux': <Paintbrush size={20} />,
  'other': <Plus size={20} />
};

const DomainPreview = ({ domains }) => (
  <section style={{ backgroundColor: 'var(--color-surface)', padding: '5rem 2rem' }}>
    <Container style={{ textAlign: 'center' }}>
      <SectionHeading badge='TECHNICAL DOMAINS' title='Areas You Can Explore Through DSDL' subtitle='Discover technologies that align with your interests during recruitment and active club workshops.' />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {domains.map((domain) => (
          <div key={domain.id} style={{ 
            backgroundColor: domain.active ? '#f0f9ff' : 'var(--color-background)', 
            border: `1px solid ${domain.active ? '#bae6fd' : 'var(--color-border)'}`,
            borderRadius: '16px',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: domain.active ? '0 4px 6px -1px rgba(2, 132, 199, 0.1)' : 'var(--shadow-sm)'
          }}>
            <div style={{ color: 'var(--color-primary)' }}>{iconMap[domain.id]}</div>
            <span style={{ fontWeight: '500', fontSize: '0.9375rem', color: domain.active ? 'var(--color-primary)' : 'var(--color-text-main)' }}>{domain.name}</span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

export default DomainPreview;
