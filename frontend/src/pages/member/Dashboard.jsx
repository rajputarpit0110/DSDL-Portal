import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { apiClient } from '../../utils/apiClient';
import { Calendar, Bell, ChevronRight, Megaphone, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const MemberDashboard = () => {
  const { user } = useAuth();
  const { openAnnouncement } = useNotifications();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eRes, aRes] = await Promise.all([
          apiClient.get('/events'),
          apiClient.get('/announcements'),
        ]);
        setEvents(eRes || []);
        setAnnouncements(aRes || []);
      } catch (error) {
        toast.error(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcomingEvent = events.find((e) => e.status === 'UPCOMING' || e.status === 'published');
  const latestAnnouncement = announcements[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', fontWeight: 700, margin: 0 }}>
          Member Dashboard
        </h2>
        <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
          Welcome to your technical domain command center and notices feed.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Domain Hero Card */}
        <Card style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.22) 0%, rgba(20, 5, 5, 0.95) 100%)',
          border: '1px solid rgba(220, 38, 38, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary-hover)', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Sparkles size={16} /> Assigned Vertical
          </div>
          <h2 style={{ fontSize: '2.1rem', margin: '0 0 0.5rem 0', color: '#ffffff', fontWeight: 800 }}>
            {user?.domainName || 'General Engineering'}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Active Contributor • {user?.role === 'lead' ? 'Domain Lead' : 'Club Member'}
          </span>
        </Card>

        {/* Latest Announcement Card */}
        <Card
          style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            cursor: latestAnnouncement ? 'pointer' : 'default',
            transition: 'all 0.2s ease',
            border: '1px solid var(--color-border)'
          }}
          onClick={() => {
            if (latestAnnouncement) {
              openAnnouncement(latestAnnouncement);
            }
          }}
          onMouseOver={(e) => {
            if (latestAnnouncement) {
              e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.transform = 'none';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', color: 'var(--color-primary-hover)' }}>
                <Megaphone size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-text-main)', fontWeight: 700 }}>
                Latest Announcement
              </h3>
            </div>
            {latestAnnouncement && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-hover)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                Read <ArrowUpRight size={14} />
              </span>
            )}
          </div>
          {latestAnnouncement ? (
            <>
              <p style={{ color: 'var(--color-text-main)', fontSize: '0.925rem', lineHeight: '1.5', flex: 1, margin: '0 0 1rem 0', fontWeight: 500 }}>
                "{latestAnnouncement.summary || latestAnnouncement.title}"
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Posted {new Date(latestAnnouncement.publishedAt || latestAnnouncement.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>No recent announcements broadcasted.</p>
          )}
        </Card>
      </div>

      {/* Upcoming Event Box */}
      <Card style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, margin: 0 }}>
            <Calendar size={20} color="var(--color-primary-hover)" /> Next Scheduled Event
          </h3>
          <Link to="/member/events" style={{ fontSize: '0.875rem', color: 'var(--color-primary-hover)', textDecoration: 'none', display: 'flex', alignItems: 'center', fontWeight: 600, gap: '0.2rem' }}>
            View All <ChevronRight size={16} />
          </Link>
        </div>
        
        {loading ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Loading scheduled events...</p>
        ) : upcomingEvent ? (
          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Badge color="var(--color-primary)">{upcomingEvent.type || 'WORKSHOP'}</Badge>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>
                {new Date(upcomingEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {upcomingEvent.startTime || '10:00 AM'}
              </span>
            </div>
            <h4 style={{ fontSize: '1.2rem', color: 'var(--color-text-main)', margin: '0 0 0.4rem 0', fontWeight: 700 }}>
              {upcomingEvent.title}
            </h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '0 0 1.25rem 0' }}>
              Venue: {upcomingEvent.venue || 'Main Auditorium / Online'}
            </p>
            <Button
              variant="primary"
              onClick={() => toast.info(`Viewing details for ${upcomingEvent.title}`)}
              style={{ padding: '0.5rem 1.15rem', fontSize: '0.875rem' }}
            >
              Event Details
            </Button>
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No upcoming events currently scheduled.</p>
        )}
      </Card>
    </div>
  );
};

export default MemberDashboard;
