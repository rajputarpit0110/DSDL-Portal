import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = () => {
    setLoading(true);
    apiClient.get('/events')
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await apiClient.delete(`/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const handleCreateDummy = async () => {
    try {
      await apiClient.post('/events', {
        title: 'New Event ' + Date.now(),
        slug: 'new-event-' + Date.now(),
        description: 'Test description',
        date: new Date().toISOString(),
        start_time: '10:00 AM',
        end_time: '12:00 PM',
        venue: 'Main Hall',
        capacity: 100,
        type: 'WORKSHOP',
        status: 'UPCOMING'
      });
      fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  if (loading && events.length === 0) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Manage Events</h2>
        <Button variant="primary" onClick={handleCreateDummy} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Create Mock Event
        </Button>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
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
                <tr key={event.id} style={{ borderBottom: i === events.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: 'var(--color-secondary)', fontWeight: '500' }}>{event.title}</span>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{event.venue}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-main)' }}>
                    {new Date(event.date).toLocaleDateString()} <br/> <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{event.startTime}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Badge color={event.status === 'UPCOMING' ? 'var(--color-primary)' : '#64748b'}>{event.status}</Badge>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button onClick={() => handleDelete(event.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                      <Trash2 size={18} />
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

export default ManageEvents;
