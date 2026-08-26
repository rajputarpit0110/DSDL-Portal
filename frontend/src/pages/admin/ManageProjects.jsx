import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import ConfirmModal from '../../common/ConfirmModal';
import CreateProjectModal from '../../components/admin/CreateProjectModal';
import { Plus, Trash2, Edit3, Check, X, FolderGit2, GitBranch, Globe } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useToast } from '../../context/ToastContext';

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'ACTIVE': return '#34d399';
    case 'IN_PROGRESS': return '#60a5fa';
    case 'PROPOSED': return '#fbbf24';
    case 'COMPLETED': return '#c084fc';
    case 'CANCELLED': return '#f87171';
    default: return '#a1a1aa';
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

  if (loading && projects.length === 0) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
        Loading global projects...
      </div>
    );
  }

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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', fontWeight: 700, margin: 0 }}>
            Global Projects
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Assign, monitor, and manage cross-domain engineering projects.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.15rem' }}
        >
          <Plus size={16} /> Assign Project
        </Button>
      </div>

      <Card style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          {projects.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <FolderGit2 size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>No projects found.</p>
              <p style={{ fontSize: '0.875rem' }}>Click "Assign Project" to create your first global project.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Project Title</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Domain</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, i) => (
                  <tr
                    key={project.id || project._id}
                    style={{
                      borderBottom: i === projects.length - 1 ? 'none' : '1px solid var(--color-border)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1.125rem 1.5rem' }}>
                      <span style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '0.95rem' }}>{project.title}</span>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.2rem', maxWidth: '380px' }}>
                        {project.description || 'No description provided.'}
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.8rem' }}>
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-hover)', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                            <GitBranch size={13} /> GitHub
                          </a>
                        )}
                        {project.liveUrl && (
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                            <Globe size={13} /> Live Demo
                          </a>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem', color: 'var(--color-text-main)' }}>
                      <Badge color="#94a3b8">{project.domain_name || 'Cross-Domain'}</Badge>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem' }}>
                      <Badge color={getStatusBadgeColor(project.status)}>{project.status}</Badge>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          title="Mark Active"
                          onClick={() => handleUpdateStatus(project.id || project._id, 'ACTIVE')}
                          style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer', color: '#34d399', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          title="Mark Cancelled"
                          onClick={() => handleUpdateStatus(project.id || project._id, 'CANCELLED')}
                          style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.35)', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer', color: '#f87171', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <X size={14} />
                        </button>
                        <button
                          title="Edit Project"
                          onClick={() => setProjectToEdit(project)}
                          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '0.4rem 0.55rem', cursor: 'pointer', color: 'var(--color-text-main)', display: 'inline-flex', alignItems: 'center' }}
                          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary-hover)')}
                          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-main)')}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          title="Delete Project"
                          onClick={() => setDeleteTarget(project)}
                          style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '6px', padding: '0.4rem 0.55rem', cursor: 'pointer', color: '#f87171', display: 'inline-flex', alignItems: 'center' }}
                        >
                          <Trash2 size={14} />
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
