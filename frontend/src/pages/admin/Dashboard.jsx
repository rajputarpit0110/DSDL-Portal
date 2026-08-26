import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import { apiClient } from '../../utils/apiClient';
import { Users, Calendar, Briefcase, Activity, Plus, FileDown, ShieldCheck, Clock } from 'lucide-react';
import AddMemberModal from '../../components/admin/AddMemberModal';
import CreateEventModal from '../../components/admin/CreateEventModal';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    totalMembers: 0, 
    totalEvents: 0, 
    activeProjects: 0, 
    unreadNotifications: 0 
  });
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await apiClient.get('/admin/stats');
        setStats(statsRes || { totalMembers: 0, totalEvents: 0, activeProjects: 0, unreadNotifications: 0 });
        
        try {
          const logsRes = await apiClient.get('/admin/audit-logs');
          setActivity(logsRes?.slice(0, 5) || []);
        } catch (logErr) {
          console.error("Failed to fetch audit logs", logErr);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExport = async () => {
    window.location.href = 'http://localhost:8000/api/admin/reports/export';
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', color: 'var(--color-text-muted)', textAlign: 'center', padding: '3rem' }}>
        Loading overview metrics...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onSuccess={() => {
            setShowAddMember(false);
            window.location.reload();
          }}
        />
      )}
      {showCreateEvent && (
        <CreateEventModal
          onClose={() => setShowCreateEvent(false)}
          onSuccess={() => {
            setShowCreateEvent(false);
            window.location.reload();
          }}
        />
      )}

      <div>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', marginBottom: '0.35rem', fontWeight: 700 }}>
          Admin Overview
        </h2>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.9rem' }}>
          Real-time metrics and administration controls for KRIVA operations.
        </p>
      </div>

      {/* 4 Stat Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {/* Total Members */}
        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            padding: '0.85rem',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '12px',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Total Members
            </p>
            <h3 style={{ fontSize: '1.85rem', color: 'var(--color-text-main)', margin: '0.2rem 0 0 0', fontWeight: 800 }}>
              {stats.totalMembers}
            </h3>
          </div>
        </Card>
        
        {/* Total Events */}
        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            padding: '0.85rem',
            backgroundColor: 'rgba(52, 211, 153, 0.12)',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '12px',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Total Events
            </p>
            <h3 style={{ fontSize: '1.85rem', color: 'var(--color-text-main)', margin: '0.2rem 0 0 0', fontWeight: 800 }}>
              {stats.totalEvents}
            </h3>
          </div>
        </Card>

        {/* Active Projects */}
        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            padding: '0.85rem',
            backgroundColor: 'rgba(192, 132, 252, 0.12)',
            border: '1px solid rgba(192, 132, 252, 0.3)',
            borderRadius: '12px',
            color: '#c084fc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Briefcase size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Active Projects
            </p>
            <h3 style={{ fontSize: '1.85rem', color: 'var(--color-text-main)', margin: '0.2rem 0 0 0', fontWeight: 800 }}>
              {stats.activeProjects}
            </h3>
          </div>
        </Card>

        {/* Unread Notifications */}
        <Card style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            padding: '0.85rem',
            backgroundColor: 'rgba(248, 113, 113, 0.12)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: '12px',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Unread Alerts
            </p>
            <h3 style={{ fontSize: '1.85rem', color: 'var(--color-text-main)', margin: '0.2rem 0 0 0', fontWeight: 800 }}>
              {stats.unreadNotifications}
            </h3>
          </div>
        </Card>
      </div>

      {/* Main Grid: Activity & Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Activity */}
        <Card style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Clock size={18} color="var(--color-primary-hover)" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-main)', margin: 0, fontWeight: 700 }}>
              Recent Audit Log
            </h3>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', listStyle: 'none', padding: 0, margin: 0 }}>
            {activity.length === 0 ? (
              <li style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-text-muted)' }}></span>
                No recent activity logged.
              </li>
            ) : (
              activity.map((log) => (
                <li
                  key={log.id}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', boxShadow: '0 0 6px var(--color-primary)', flexShrink: 0 }}></span>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    <strong style={{ color: 'var(--color-text-main)' }}>{log.actor?.name || 'System'}</strong> {log.action} <span style={{ color: 'var(--color-primary-hover)' }}>{log.entity}</span>
                  </span>
                </li>
              ))
            )}
          </ul>
        </Card>

        {/* Quick Actions */}
        <Card style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <ShieldCheck size={18} color="var(--color-primary-hover)" />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-main)', margin: 0, fontWeight: 700 }}>
              Quick Management
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              onClick={() => setShowCreateEvent(true)}
              style={{
                padding: '0.85rem 1rem',
                textAlign: 'left',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--color-text-main)',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-main)';
              }}
            >
              <Plus size={16} color="var(--color-primary-hover)" /> Create New Event
            </button>

            <button
              onClick={() => setShowAddMember(true)}
              style={{
                padding: '0.85rem 1rem',
                textAlign: 'left',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--color-text-main)',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-main)';
              }}
            >
              <Plus size={16} color="var(--color-primary-hover)" /> Add New Member / Lead
            </button>

            <button
              onClick={handleExport}
              style={{
                padding: '0.85rem 1rem',
                textAlign: 'left',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--color-text-main)',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-main)';
              }}
            >
              <FileDown size={16} color="#38bdf8" /> Generate & Export CSV Report
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
