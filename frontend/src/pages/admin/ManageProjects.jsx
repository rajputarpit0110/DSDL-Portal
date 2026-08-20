import React from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { mockProjects } from '../../data/mockProjects';
import { Plus, MoreVertical } from 'lucide-react';

const ManageProjects = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Global Projects</h2>
        <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Assign Project
        </Button>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Project Title</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Domain</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProjects.map((project, i) => (
                <tr key={project.id} style={{ borderBottom: i === mockProjects.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: 'var(--color-secondary)', fontWeight: '500' }}>{project.title}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-main)' }}>
                    <Badge color="#64748b">Cross-Domain</Badge>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Badge color={project.status === 'Active' ? '#10b981' : '#3b82f6'}>{project.status}</Badge>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ManageProjects;
