import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { apiClient } from '../../utils/apiClient';
import { Plus, FolderGit2, GitBranch, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const MemberProjects = () => {
  const { user } = useAuth();
  const toast = useToast();
  const isLead = user?.role === 'lead' || user?.role === 'admin';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/projects')
      .then(setProjects)
      .catch((err) => toast.error(err.message || 'Failed to fetch projects'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return '#34d399';
      case 'IN_PROGRESS': return '#60a5fa';
      case 'PROPOSED': return '#fbbf24';
      default: return '#c084fc';
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
        Loading domain projects...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', fontWeight: 700, margin: 0 }}>
            {isLead ? 'Domain Projects Overview' : 'My Projects'}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Build, collaborate, and showcase domain engineering initiatives.
          </p>
        </div>
        <Button variant="primary" onClick={() => toast.info('Project proposal submission is open!')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.15rem' }}>
          <Plus size={16} /> Submit Proposal
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {projects.length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)', gridColumn: '1 / -1' }}>
            <FolderGit2 size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>No projects found.</p>
            <p style={{ fontSize: '0.875rem' }}>Click "Submit Proposal" to pitch your engineering idea.</p>
          </Card>
        ) : (
          projects.filter(p => p.status !== 'COMPLETED').map(project => (
            <Card key={project.id || project._id} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-main)', margin: 0, fontWeight: 700 }}>
                  {project.title}
                </h3>
                <Badge color={getStatusColor(project.status)}>{project.status}</Badge>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                {project.description || 'No description provided.'}
              </p>
              
              <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1.25rem', fontSize: '0.8rem' }}>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-hover)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    <GitBranch size={13} /> Repo
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    <Globe size={13} /> Demo
                  </a>
                )}
              </div>
              
              {isLead ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="primary" onClick={() => toast.success(`Project "${project.title}" approved!`)} style={{ flex: 1, padding: '0.5rem' }}>Approve</Button>
                  <button
                    onClick={() => toast.warning(`Project "${project.title}" rejected.`)}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(220, 38, 38, 0.12)',
                      color: '#f87171',
                      border: '1px solid rgba(220, 38, 38, 0.35)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => toast.info('Status update modal coming soon!')}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--color-text-main)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
                >
                  Update Progress
                </button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MemberProjects;
