import React from 'react';
import Container from '../../common/Container';
import SectionHeading from '../../common/SectionHeading';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { mockProjects } from '../../data/mockProjects';
import { GitBranch, ExternalLink } from 'lucide-react';

const Projects = () => {
  return (
    <div style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-surface)' }}>
      <Container>
        <SectionHeading title='Our Projects' subtitle='Real-world solutions built by the DSDL community.' />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {mockProjects.map(project => (
            <Card key={project.id} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <Badge color='var(--color-primary)'>{project.domain}</Badge>
                <span style={{ fontSize: '0.75rem', color: project.status === 'Completed' ? '#10b981' : '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {project.status}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '0.75rem' }}>{project.title}</h3>
              <p style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem', lineHeight: '1.6', flex: 1 }}>{project.description}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#475569' }}>
                    {tag}
                  </span>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                <a href={project.github} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                  <GitBranch size={18} /> Source Code
                </a>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Projects;
