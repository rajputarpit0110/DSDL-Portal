import React from 'react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { mockEvents } from '../../data/mockEvents';
import { Calendar, MapPin, Clock } from 'lucide-react';

const MemberEvents = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: '1.5rem' }}>Event Registration & History</h2>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {mockEvents.map(event => (
          <Card key={event.id} style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', opacity: event.status === 'past' ? 0.7 : 1 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)' }}>{event.title}</h3>
                <Badge color={event.status === 'upcoming' ? 'var(--color-primary)' : '#64748b'}>{event.type}</Badge>
              </div>
              <p style={{ color: 'var(--color-text-main)', fontSize: '0.9375rem', marginBottom: '1rem' }}>{event.description}</p>
              
              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Calendar size={14} /> {event.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Clock size={14} /> {event.time}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><MapPin size={14} /> {event.location}</span>
              </div>
            </div>
            
            <div>
              {event.status === 'upcoming' ? (
                <Button variant="primary" style={{ padding: '0.5rem 1.5rem' }}>Register</Button>
              ) : (
                <Button style={{ padding: '0.5rem 1.5rem', backgroundColor: '#e2e8f0', color: '#64748b', cursor: 'not-allowed' }}>Attended</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemberEvents;
