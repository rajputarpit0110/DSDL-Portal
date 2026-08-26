import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { apiClient } from '../../utils/apiClient';
import { Calendar, MapPin, Clock } from 'lucide-react';

const MemberEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/events')
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>Event Registration & History</h2>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {events.map(event => (
          <Card key={event.id} style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', opacity: event.status === 'COMPLETED' ? 0.7 : 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)' }}>{event.title}</h3>
                <Badge color={event.status === 'UPCOMING' ? 'var(--color-primary)' : '#64748b'}>{event.type}</Badge>
              </div>
              <p style={{ color: 'var(--color-text-main)', fontSize: '0.9375rem', marginBottom: '1rem' }}>{event.description}</p>
              
              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Calendar size={14} /> {new Date(event.date).toLocaleDateString()}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={14} /> {event.startTime}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><MapPin size={14} /> {event.venue}</span>
              </div>
            </div>
            
            <div>
              {event.status !== 'UPCOMING' && (
                <Button onClick={() => alert('This event has already passed.')} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#e2e8f0', color: '#64748b', cursor: 'not-allowed' }}>Past</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemberEvents;
