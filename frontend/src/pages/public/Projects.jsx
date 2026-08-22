import React, { useState, useEffect } from 'react';
import Container from '../../common/Container';
import SectionHeading from '../../common/SectionHeading';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { apiClient } from '../../utils/apiClient';
import { GitBranch, ExternalLink } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/projects')
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '6rem 2rem', backgroundColor: 'var(--color-surface)' }}>
      <Container>
        <SectionHeading title='Our Projects' subtitle='Real-world solutions built by the DSDL community.' />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {projects.map(project => (
            <Card key={project.id} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <Badge color='var(--color-primary)'>{project.domain_name || 'General'}</Badge>
                <span style={{ fontSize: '0.75rem', color: project.status === 'COMPLETED' ? '#10b981' : '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '0.75rem' }}>{project.title}</h3>
              <p style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem', lineHeight: '1.6', flex: 1 }}>{project.description}</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {project.tags && project.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#475569' }}>
                    {tag}
                  </span>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                {project.githubUrl && (
                  <a href={project.githubUrl} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    <GitBranch size={18} /> Source Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                    <ExternalLink size={18} /> Live Demo
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Projects;
