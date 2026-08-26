import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { apiClient } from '../../utils/apiClient';
import { Calendar, Bell, ChevronRight, Megaphone, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
  const { user } = useAuth();
  const { openAnnouncement } = useNotifications();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eRes, aRes] = await Promise.all([
          apiClient.get('/events'),
          apiClient.get('/announcements')
        ]);
        setEvents(eRes || []);
        setAnnouncements(aRes || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcomingEvent = events.find(e => e.status === 'UPCOMING');
  const latestAnnouncement = announcements[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card style={{ padding: '2rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Your Domain</h3>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>{user?.domainName || 'General'}</h2>
        </Card>

        <Card
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            cursor: latestAnnouncement ? 'pointer' : 'default',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onClick={() => {
            if (latestAnnouncement) {
              openAnnouncement(latestAnnouncement);
            }
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)' }}>
              <Megaphone size={20} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Latest Announcement</h3>
            </div>
            {latestAnnouncement && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                Read <ArrowUpRight size={14} />
              </span>
            )}
          </div>
          {latestAnnouncement ? (
            <>
              <p style={{ color: 'var(--color-text-main)', fontSize: '0.9375rem', lineHeight: '1.5', flex: 1, margin: '0 0 1rem 0' }}>
                "{latestAnnouncement.summary || latestAnnouncement.title}"
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Posted {new Date(latestAnnouncement.publishedAt || latestAnnouncement.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>No recent announcements.</p>
          )}
        </Card>
      </div>

      <Card style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} /> Next Upcoming Event
          </h3>
          <Link to="/member/events" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            View All <ChevronRight size={16} />
          </Link>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : upcomingEvent ? (
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <Badge color="var(--color-primary)">{upcomingEvent.type}</Badge>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{new Date(upcomingEvent.date).toLocaleDateString()} • {upcomingEvent.startTime}</span>
            </div>
            <h4 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>{upcomingEvent.title}</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{upcomingEvent.venue}</p>
            <Button variant="primary" onClick={() => alert('View Details feature coming soon!')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View Details</Button>
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No upcoming events currently scheduled.</p>
        )}
      </Card>
      
    </div>
  );
};

export default MemberDashboard;
