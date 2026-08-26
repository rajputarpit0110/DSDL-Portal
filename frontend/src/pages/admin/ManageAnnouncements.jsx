import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import ConfirmModal from '../../common/ConfirmModal';
import CreateAnnouncementModal from '../../components/admin/CreateAnnouncementModal';
import { Plus, Trash2, Edit3, Megaphone } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useToast } from '../../context/ToastContext';

const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case 'URGENT': return '#e11d48';
    case 'HIGH': return '#f97316';
    case 'LOW': return '#64748b';
    default: return '#3b82f6';
  }
};

const ManageAnnouncements = () => {
  const toast = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAnnouncements = () => {
    setLoading(true);
    apiClient.get('/announcements?all=true')
      .then(setAnnouncements)
      .catch((err) => toast.error(err.message || 'Failed to load announcements'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await apiClient.delete(`/announcements/${deleteTarget.id || deleteTarget._id}`);
      toast.success('Announcement deleted successfully.');
      setDeleteTarget(null);
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.message || 'Failed to delete announcement.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublish = async (id, isPublished) => {
    try {
      await apiClient.patch(`/announcements/${id}/publish`, { publish: !isPublished });
      toast.success(`Announcement ${!isPublished ? 'published' : 'unpublished'} successfully.`);
      fetchAnnouncements();
    } catch (error) {
      toast.error(error.message || 'Failed to publish/unpublish announcement.');
    }
  };

  if (loading && announcements.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading announcements...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Create / Edit Announcement Modal */}
      {(showCreateModal || announcementToEdit) && (
        <CreateAnnouncementModal
          announcementToEdit={announcementToEdit}
          onClose={() => {
            setShowCreateModal(false);
            setAnnouncementToEdit(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setAnnouncementToEdit(null);
            fetchAnnouncements();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        confirmText="Delete Announcement"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', fontWeight: 700, margin: 0 }}>
            Manage Announcements
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Publish alerts, opportunities, news, and notifications to club members.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.15rem' }}
        >
          <Plus size={16} /> Create Announcement
        </Button>
      </div>

      <Card style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          {announcements.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Megaphone size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>No announcements found.</p>
              <p style={{ fontSize: '0.875rem' }}>Click "Create Announcement" to post your first update.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Title</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Type & Priority</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((ann, i) => (
                  <tr
                    key={ann.id || ann._id}
                    style={{
                      borderBottom: i === announcements.length - 1 ? 'none' : '1px solid var(--color-border)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1.125rem 1.5rem' }}>
                      <span style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '0.95rem' }}>{ann.title}</span>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.2rem', maxWidth: '380px' }}>
                        {ann.summary || ann.content}
                      </div>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <Badge color={getPriorityBadgeColor(ann.priority)}>{ann.type}</Badge>
                        {ann.priority === 'URGENT' && <Badge color="#f87171">URGENT</Badge>}
                      </div>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem' }}>
                      <Badge color={ann.status === 'published' ? '#34d399' : '#a1a1aa'}>
                        {ann.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td style={{ padding: '1.125rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          onClick={() => handleTogglePublish(ann.id || ann._id, ann.status === 'published')}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            backgroundColor: ann.status === 'published' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                            color: ann.status === 'published' ? '#fbbf24' : '#34d399',
                            borderColor: ann.status === 'published' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {ann.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => setAnnouncementToEdit(ann)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: 'var(--color-text-main)',
                            padding: '6px 8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.15s ease'
                          }}
                          title="Edit Announcement"
                          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-primary-hover)')}
                          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-main)')}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(ann)}
                          style={{
                            background: 'rgba(220, 38, 38, 0.1)',
                            border: '1px solid rgba(220, 38, 38, 0.3)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#f87171',
                            padding: '6px 8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.15s ease'
                          }}
                          title="Delete Announcement"
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

export default ManageAnnouncements;
