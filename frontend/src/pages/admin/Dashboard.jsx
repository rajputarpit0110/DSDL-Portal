import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import { apiClient } from '../../utils/apiClient';
import { Users, Calendar, Briefcase, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ members: 0, events: 0, projects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, eRes, pRes] = await Promise.all([
          apiClient.get('/members'),
          apiClient.get('/events'),
          apiClient.get('/projects')
        ]);
        setStats({
          members: mRes?.length || 0,
          events: eRes?.length || 0,
          projects: pRes?.length || 0
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>Admin Overview</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>High-level metrics for DSDL operations.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#e0f2fe', borderRadius: '12px', color: '#0284c7' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total Members</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>{stats.members}</h3>
          </div>
        </Card>
        
        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '12px', color: '#16a34a' }}>
            <Calendar size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Total Events</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>{stats.events}</h3>
          </div>
        </Card>

        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f3e8ff', borderRadius: '12px', color: '#9333ea' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Active Projects</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>{stats.projects}</h3>
          </div>
        </Card>

        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '12px', color: '#dc2626' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>System Alerts</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>0</h3>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <Card style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}>Recent Activity</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
            <li style={{ fontSize: '0.9375rem', color: 'var(--color-text-main)', display: 'flex', gap: '0.5rem' }}>
              <span style={{ color: '#0ea5e9' }}>•</span> All services running normally.
            </li>
          </ul>
        </Card>

        <Card style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button style={{ padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-secondary)' }}>+ Create New Event</button>
            <button style={{ padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-secondary)' }}>+ Add New Member</button>
            <button style={{ padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-secondary)' }}>Generate Export Report</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
