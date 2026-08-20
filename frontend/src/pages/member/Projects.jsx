import React from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { mockProjects } from '../../data/mockProjects';
import { Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MemberProjects = () => {
  const { user } = useAuth();
  const isLead = user?.role === 'lead';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>
          {isLead ? 'Domain Projects Overview' : 'My Projects'}
        </h2>
        <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Submit Proposal
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {mockProjects.filter(p => p.status !== 'Completed').map(project => (
          <Card key={project.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)' }}>{project.title}</h3>
              <Badge color={project.status === 'Active' ? '#10b981' : '#3b82f6'}>{project.status}</Badge>
            </div>
            <p style={{ color: 'var(--color-text-main)', fontSize: '0.9375rem', marginBottom: '1.5rem', flex: 1 }}>{project.description}</p>
            
            {isLead ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="primary" style={{ flex: 1 }}>Approve</Button>
                <Button style={{ flex: 1, backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5' }}>Reject</Button>
              </div>
            ) : (
              <Button style={{ width: '100%', backgroundColor: 'white', color: 'var(--color-secondary)', border: '1px solid var(--color-border)' }}>Update Status</Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemberProjects;
