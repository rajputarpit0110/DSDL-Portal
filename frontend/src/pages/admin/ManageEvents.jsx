import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { Plus, Trash2, Edit } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import CreateEventModal from '../../components/admin/CreateEventModal';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const fetchEvents = () => {
    setLoading(true);
    apiClient.get('/events?all=true')
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await apiClient.delete(`/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleTogglePublish = async (id, isPublished) => {
    if (window.confirm(`Are you sure you want to ${isPublished ? 'unpublish' : 'publish'} this event?`)) {
      try {
        await apiClient.patch(`/events/${id}/publish`, { publish: !isPublished });
        fetchEvents();
      } catch (error) {
        console.error('Failed to publish/unpublish event:', error);
      }
    }
  };

  if (loading && events.length === 0) return <div>Loading events...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} onSuccess={() => { setShowCreate(false); fetchEvents(); }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Manage Events</h2>
        <Button variant="primary" onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Create Event
        </Button>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {events.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No events found.</div>
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
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{event.venue}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-main)' }}>
                      {new Date(event.date).toLocaleDateString()} <br/> <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{event.startTime || 'TBD'}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge color={event.status === 'published' ? 'var(--color-primary)' : '#64748b'}>{event.status}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleTogglePublish(event.id || event._id, event.status === 'published')} style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                          {event.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => handleDelete(event.id || event._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
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
