import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import ConfirmModal from '../../common/ConfirmModal';
import { Plus, Trash2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import CreateEventModal from '../../components/admin/CreateEventModal';
import { useToast } from '../../context/ToastContext';

const ManageEvents = () => {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [publishTarget, setPublishTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvents = () => {
    setLoading(true);
    apiClient.get('/events?all=true')
      .then(setEvents)
      .catch((err) => toast.error(err.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await apiClient.delete(`/events/${deleteTarget.id || deleteTarget._id}`);
      toast.success('Event deleted successfully.');
      setDeleteTarget(null);
      fetchEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to delete event.');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmTogglePublish = async () => {
    if (!publishTarget) return;
    setActionLoading(true);
    const newStatus = publishTarget.status !== 'published';
    try {
      await apiClient.patch(`/events/${publishTarget.id || publishTarget._id}/publish`, { publish: newStatus });
      toast.success(`Event ${newStatus ? 'published' : 'unpublished'} successfully.`);
      setPublishTarget(null);
      fetchEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to update publish state.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && events.length === 0) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading events...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {showCreate && (
        <CreateEventModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            fetchEvents();
          }}
        />
      )}

      {/* Modern Confirmation Modals */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Event"
        confirmVariant="danger"
        loading={actionLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        isOpen={Boolean(publishTarget)}
        title={publishTarget?.status === 'published' ? 'Unpublish Event' : 'Publish Event'}
        message={`Are you sure you want to ${publishTarget?.status === 'published' ? 'unpublish' : 'publish'} "${publishTarget?.title}"?`}
        confirmText={publishTarget?.status === 'published' ? 'Unpublish' : 'Publish'}
        confirmVariant="primary"
        loading={actionLoading}
        onConfirm={confirmTogglePublish}
        onCancel={() => setPublishTarget(null)}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Manage Events</h2>
        <Button variant="primary" onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Create Event
        </Button>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {events.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No events found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Event Name</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Date & Time</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, i) => (
                  <tr key={event.id || event._id} style={{ borderBottom: i === events.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: '500' }}>{event.title}</span>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{event.venue || 'No venue specified'}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-main)' }}>
                      {new Date(event.date).toLocaleDateString()} <br/> <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{event.startTime || 'TBD'}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge color={event.status === 'published' ? 'var(--color-primary)' : '#64748b'}>{event.status}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => setPublishTarget(event)}
                          style={{
                            padding: '5px 10px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                          }}
                        >
                          {event.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(event)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#dc2626',
                            padding: '4px',
                            borderRadius: '4px',
                          }}
                          title="Delete Event"
                        >
                          <Trash2 size={18} />
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

export default ManageEvents;
