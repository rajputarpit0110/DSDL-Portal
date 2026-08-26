import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { apiClient } from '../../utils/apiClient';
import { Calendar, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const MemberEvents = () => {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/events')
      .then(setEvents)
      .catch((err) => toast.error(err.message || 'Failed to fetch events'))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = (event) => {
    toast.success(`You are registered for "${event.title}"! We'll send an alert before start.`);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
        Loading club events schedule...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', fontWeight: 700, margin: 0 }}>
          Club Events & Workshops
        </h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Register for technical bootcamps, hackathons, and guest speaker sessions.
        </p>
      </div>
      
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {events.length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No upcoming club events scheduled. Check back soon!
          </Card>
        ) : (
          events.map((event) => {
            const isUpcoming = event.status === 'UPCOMING' || event.status === 'published';
            return (
              <Card
                key={event.id || event._id}
                style={{
                  padding: '1.5rem 1.75rem',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  opacity: isUpcoming ? 1 : 0.65,
                  border: isUpcoming ? '1px solid rgba(220, 38, 38, 0.25)' : '1px solid var(--color-border)'
                }}
              >
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', margin: 0, fontWeight: 700 }}>
                      {event.title}
                    </h3>
                    <Badge color={isUpcoming ? 'var(--color-primary)' : '#71717a'}>
                      {event.type || 'WORKSHOP'}
                    </Badge>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                    {event.description || 'Join us for this interactive workshop session.'}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.825rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text-main)' }}>
                      <Calendar size={15} color="var(--color-primary-hover)" /> {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={15} /> {event.startTime || '10:00 AM'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={15} /> {event.venue || 'Main Auditorium / Online'}
                    </span>
                  </div>
                </div>
                
                <div>
                  {isUpcoming ? (
                    <Button
                      variant="primary"
                      onClick={() => handleRegister(event)}
                      style={{ padding: '0.6rem 1.4rem', fontSize: '0.875rem' }}
                    >
                      Register Now
                    </Button>
                  ) : (
                    <span style={{
                      padding: '0.45rem 1.15rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-muted)',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}>
                      Concluded
                    </span>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MemberEvents;
