import React, { useState, useEffect } from 'react';
import Container from '../../common/Container';
import SectionHeading from '../../common/SectionHeading';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { apiClient } from '../../utils/apiClient';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/events')
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '6rem 2rem' }}>
      <Container>
        <SectionHeading title='Events & Workshops' subtitle='Join our technical sessions, hackathons, and guest lectures.' />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {events.map(event => (
            <Card key={event.id} style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <Badge color={event.status === 'UPCOMING' ? 'var(--color-primary)' : '#64748b'}>
                  {event.status === 'UPCOMING' ? 'Upcoming' : 'Past Event'}
                </Badge>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{event.type}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}>{event.title}</h3>
              <p style={{ color: 'var(--color-text-main)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{event.description}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.9375rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> {new Date(event.date).toLocaleDateString()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} /> {event.startTime} - {event.endTime}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} /> {event.venue}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Events;
