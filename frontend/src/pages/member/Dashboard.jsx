import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { mockEvents } from '../../data/mockEvents';
import { Calendar, Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
  const { user } = useAuth();
  const upcomingEvent = mockEvents.find(e => e.status === 'upcoming');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card style={{ padding: '2rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Your Domain</h3>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>{user?.domain || 'App Development'}</h2>
          <p style={{ color: '#bae6fd', fontSize: '0.875rem' }}>Next domain meeting: Friday, 5:00 PM</p>
        </Card>

        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
            <Bell size={20} />
            <h3 style={{ fontSize: '1.125rem' }}>Latest Announcement</h3>
          </div>
          <p style={{ color: 'var(--color-text-main)', fontSize: '0.9375rem', lineHeight: '1.5', flex: 1 }}>
            "Hacktoberfest is here! Make sure to register your profiles and join the Open Source team session this weekend."
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Posted 2 hours ago by Tech Lead</span>
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
        
        {upcomingEvent ? (
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <Badge color="var(--color-primary)">{upcomingEvent.type}</Badge>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>{upcomingEvent.date} • {upcomingEvent.time}</span>
            </div>
            <h4 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>{upcomingEvent.title}</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{upcomingEvent.location}</p>
            <Button variant="primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>View Details</Button>
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)' }}>No upcoming events currently scheduled.</p>
        )}
      </Card>
      
    </div>
  );
};

export default MemberDashboard;
