import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { Plus, Check, X } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = () => {
    setLoading(true);
    apiClient.get('/projects')
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await apiClient.put(`/projects/${id}`, { status });
      fetchProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  if (loading && projects.length === 0) return <div>Loading...</div>;

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
              {projects.map((project, i) => (
                <tr key={project.id} style={{ borderBottom: i === projects.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: 'var(--color-secondary)', fontWeight: '500' }}>{project.title}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-main)' }}>
                    <Badge color="#64748b">{project.domain_name || 'Cross-Domain'}</Badge>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Badge color={project.status === 'ACTIVE' ? '#10b981' : '#3b82f6'}>{project.status}</Badge>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button title="Mark Active" onClick={() => handleUpdateStatus(project.id, 'ACTIVE')} style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer', color: '#16a34a' }}>
                        <Check size={18} />
                      </button>
                      <button title="Mark Cancelled" onClick={() => handleUpdateStatus(project.id, 'CANCELLED')} style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '4px', padding: '0.25rem', cursor: 'pointer', color: '#dc2626' }}>
                        <X size={18} />
                      </button>
                    </div>
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
