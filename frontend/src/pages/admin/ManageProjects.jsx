import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import ConfirmModal from '../../common/ConfirmModal';
import CreateProjectModal from '../../components/admin/CreateProjectModal';
import { Plus, Trash2, Edit3, Check, X, FolderGit2, Github, Globe } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useToast } from '../../context/ToastContext';

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'ACTIVE': return '#10b981';
    case 'IN_PROGRESS': return '#0a66c2';
    case 'PROPOSED': return '#f59e0b';
    case 'COMPLETED': return '#6366f1';
    case 'CANCELLED': return '#ef4444';
    default: return '#64748b';
  }
};

const ManageProjects = () => {
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    apiClient.get('/projects')
      .then(setProjects)
      .catch((err) => toast.error(err.message || 'Failed to load projects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await apiClient.put(`/projects/${id}`, { status });
      toast.success(`Project marked as ${status.toLowerCase()}`);
      fetchProjects();
    } catch (error) {
      toast.error(error.message || 'Failed to update project.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await apiClient.delete(`/projects/${deleteTarget.id || deleteTarget._id}`);
      toast.success(`Project "${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      fetchProjects();
    } catch (error) {
      toast.error(error.message || 'Failed to delete project.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && projects.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading projects...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Create / Edit Project Modal */}
      {(showCreateModal || projectToEdit) && (
        <CreateProjectModal
          projectToEdit={projectToEdit}
          onClose={() => {
            setShowCreateModal(false);
            setProjectToEdit(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setProjectToEdit(null);
            fetchProjects();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Project"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Global Projects</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Assign, monitor, and manage cross-domain engineering projects.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem' }}
        >
          <Plus size={16} /> Assign Project
        </Button>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {projects.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <FolderGit2 size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 500 }}>No projects found.</p>
              <p style={{ fontSize: '0.875rem' }}>Click "Assign Project" to create your first global project.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Project Title</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Domain</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, i) => (
                  <tr key={project.id || project._id} style={{ borderBottom: i === projects.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1.125rem 1.5rem' }}>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: '600', fontSize: '0.95rem' }}>{project.title}</span>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.2rem', maxWidth: '380px' }}>
                        {project.description || 'No description provided.'}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.8rem' }}>
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Github size={12} /> GitHub
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Globe size={12} /> Live Demo
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem', color: 'var(--color-text-main)' }}>
                      <Badge color="#64748b">{project.domain_name || 'Cross-Domain'}</Badge>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem' }}>
                      <Badge color={getStatusBadgeColor(project.status)}>{project.status}</Badge>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          title="Mark Active"
                          onClick={() => handleUpdateStatus(project.id || project._id, 'ACTIVE')}
                          style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '6px', padding: '0.35rem', cursor: 'pointer', color: '#16a34a' }}
                        >
                          <Check size={15} />
                        </button>
                        <button
                          title="Mark Cancelled"
                          onClick={() => handleUpdateStatus(project.id || project._id, 'CANCELLED')}
                          style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', padding: '0.35rem', cursor: 'pointer', color: '#dc2626' }}
                        >
                          <X size={15} />
                        </button>
                        <button
                          title="Edit Project"
                          onClick={() => setProjectToEdit(project)}
                          style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.35rem 0.5rem', cursor: 'pointer', color: 'var(--color-secondary)' }}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          title="Delete Project"
                          onClick={() => setDeleteTarget(project)}
                          style={{ background: 'none', border: '1px solid #fee2e2', borderRadius: '6px', padding: '0.35rem 0.5rem', cursor: 'pointer', color: '#dc2626' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ManageProjects;
