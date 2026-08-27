import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import { apiClient } from '../../utils/apiClient';
import {
  Users,
  Calendar,
  Briefcase,
  Layers,
  Megaphone,
  Activity,
  RefreshCw,
  UserPlus,
  CalendarPlus,
  FolderPlus,
  FileSpreadsheet,
  Shield,
  KeyRound,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  Zap
} from 'lucide-react';
import AddMemberModal from '../../components/admin/AddMemberModal';
import CreateEventModal from '../../components/admin/CreateEventModal';
import CreateProjectModal from '../../components/admin/CreateProjectModal';
import CreateDomainModal from '../../components/admin/CreateDomainModal';
import CreateAnnouncementModal from '../../components/admin/CreateAnnouncementModal';
import { useToast } from '../../context/ToastContext';

const formatActivityText = (log) => {
  const actor = log.actor?.name || 'Admin';
  const meta = log.metadata || {};

  switch (log.action) {
    case 'USER_CREATE':
      return {
        icon: UserPlus,
        color: '#10b981',
        title: `${actor} created a new user`,
        desc: meta.email ? `${meta.email} (${meta.role || 'member'})` : log.entity,
      };
    case 'USER_UPDATE':
      return {
        icon: Edit3,
        color: '#0a66c2',
        title: `${actor} updated user profile`,
        desc: meta.email || log.entity,
      };
    case 'USER_ROLE_CHANGE':
      return {
        icon: Shield,
        color: '#8b5cf6',
        title: `${actor} updated user role`,
        desc: `Role changed to ${(meta.newRole || '').toUpperCase()}`,
      };
    case 'USER_STATUS_CHANGE':
      return {
        icon: meta.isActive ? CheckCircle2 : XCircle,
        color: meta.isActive ? '#10b981' : '#ef4444',
        title: `${actor} changed account status`,
        desc: meta.isActive ? 'Account activated' : 'Account suspended',
      };
    case 'USER_PASSWORD_RESET':
      return {
        icon: KeyRound,
        color: '#f59e0b',
        title: `${actor} reset user password`,
        desc: 'New credentials generated',
      };
    case 'USER_DELETE':
      return {
        icon: Trash2,
        color: '#ef4444',
        title: `${actor} deleted a user`,
        desc: meta.name ? `${meta.name} (${meta.email})` : 'User record removed',
      };
    default:
      return {
        icon: Activity,
        color: '#64748b',
        title: `${actor} performed ${log.action?.toLowerCase()?.replace(/_/g, ' ')}`,
        desc: log.entity || '',
      };
  }
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const past = new Date(dateStr);
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const AdminDashboard = () => {
  const toast = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMembers: 0,
    totalLeads: 0,
    totalAdmins: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalDomains: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalAnnouncements: 0,
    totalTeams: 0,
    unreadNotifications: 0,
    domainDistribution: [],
    recentUsers: []
  });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateDomain, setShowCreateDomain] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);

  const fetchOverviewData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [statsRes, logsRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/audit-logs').catch(() => [])
      ]);

      if (statsRes) {
        setStats(statsRes);
      }
      if (Array.isArray(logsRes)) {
        setActivity(logsRes.slice(0, 7));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load admin overview metrics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const handleExport = () => {
    window.location.href = 'http://localhost:8000/api/admin/reports/export';
  };

  if (loading && !stats.totalUsers) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <RefreshCw size={36} className="spinner" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>Loading Admin Overview...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Modal Dialogs */}
      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onSuccess={() => {
            setShowAddMember(false);
            fetchOverviewData(true);
          }}
        />
      )}

      {showCreateEvent && (
        <CreateEventModal
          onClose={() => setShowCreateEvent(false)}
          onSuccess={() => {
            setShowCreateEvent(false);
            fetchOverviewData(true);
          }}
        />
      )}

      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onSuccess={() => {
            setShowCreateProject(false);
            fetchOverviewData(true);
          }}
        />
      )}

      {showCreateDomain && (
        <CreateDomainModal
          onClose={() => setShowCreateDomain(false)}
          onSuccess={() => {
            setShowCreateDomain(false);
            fetchOverviewData(true);
          }}
        />
      )}

      {showCreateAnnouncement && (
        <CreateAnnouncementModal
          onClose={() => setShowCreateAnnouncement(false)}
          onSuccess={() => {
            setShowCreateAnnouncement(false);
            fetchOverviewData(true);
          }}
        />
      )}

      {/* Header with Live Sync */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '700', color: 'var(--color-secondary)', margin: 0 }}>
              Admin Overview
            </h2>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              <Zap size={12} /> Live Sync
            </span>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
            Real-time telemetry and management metrics across all DSDL engineering operations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => fetchOverviewData(true)}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              color: 'var(--color-secondary)',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
            }}
            title="Sync all overview statistics"
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Sync Overview
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Total Users */}
        <Card style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '500', margin: 0 }}>Total Registered Users</p>
              <h3 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--color-secondary)', margin: '0.4rem 0' }}>
                {stats.totalUsers || stats.totalMembers}
              </h3>
              <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                <span style={{ color: '#8b5cf6', fontWeight: '600' }}>{stats.totalAdmins} Admins</span> • 
                <span style={{ color: '#0a66c2', fontWeight: '600' }}>{stats.totalLeads} Leads</span> • 
                <span style={{ color: '#64748b' }}>{stats.totalMembers} Members</span>
              </div>
            </div>
            <div style={{ padding: '0.85rem', backgroundColor: '#eff6ff', borderRadius: '12px', color: 'var(--color-primary)' }}>
              <Users size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>● {stats.activeUsers} Active</span>
            <Link to="/admin/users" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
              Manage <ArrowRight size={13} />
            </Link>
          </div>
        </Card>

        {/* Technical Domains */}
        <Card style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '500', margin: 0 }}>Technical Domains</p>
              <h3 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--color-secondary)', margin: '0.4rem 0' }}>
                {stats.totalDomains}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Specialized wings & departments
              </p>
            </div>
            <div style={{ padding: '0.85rem', backgroundColor: '#e0f2fe', borderRadius: '12px', color: '#0284c7' }}>
              <Layers size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{stats.totalTeams} Project Teams</span>
            <Link to="/admin/domains" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
              Manage <ArrowRight size={13} />
            </Link>
          </div>
        </Card>

        {/* Active Projects */}
        <Card style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '500', margin: 0 }}>Engineering Projects</p>
              <h3 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--color-secondary)', margin: '0.4rem 0' }}>
                {stats.activeProjects}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Active in production / development
              </p>
            </div>
            <div style={{ padding: '0.85rem', backgroundColor: '#f3e8ff', borderRadius: '12px', color: '#9333ea' }}>
              <Briefcase size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{stats.totalProjects} Total Listed</span>
            <Link to="/admin/projects" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
              Manage <ArrowRight size={13} />
            </Link>
          </div>
        </Card>

        {/* Total Events */}
        <Card style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontWeight: '500', margin: 0 }}>Club Events & Hackathons</p>
              <h3 style={{ fontSize: '1.85rem', fontWeight: '700', color: 'var(--color-secondary)', margin: '0.4rem 0' }}>
                {stats.totalEvents}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600', margin: 0 }}>
                {stats.upcomingEvents} Upcoming Scheduled
              </p>
            </div>
            <div style={{ padding: '0.85rem', backgroundColor: '#dcfce7', borderRadius: '12px', color: '#16a34a' }}>
              <Calendar size={24} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{stats.totalAnnouncements} Broadcasts</span>
            <Link to="/admin/events" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px' }}>
              Manage <ArrowRight size={13} />
            </Link>
          </div>
        </Card>
      </div>

      {/* Middle Section: Domain Distribution & Quick Operations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Domain Distribution */}
        <Card style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--color-primary)" /> Domain Distribution
            </h3>
            <Link to="/admin/domains" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>
              View All
            </Link>
          </div>

          {stats.domainDistribution && stats.domainDistribution.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.domainDistribution.map((domain, i) => {
                const total = stats.totalUsers || 1;
                const pct = Math.min(100, Math.round((domain.count / total) * 100));
                return (
                  <div key={domain.name || i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: '600', color: 'var(--color-secondary)' }}>{domain.name}</span>
                      <span style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}>
                        {domain.count} members ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: '7px', width: '100%', backgroundColor: 'var(--color-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(pct, 5)}%`,
                          backgroundColor: ['#0a66c2', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][i % 5],
                          borderRadius: '4px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Layers size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.875rem' }}>No domain assignment data available yet.</p>
            </div>
          )}
        </Card>

        {/* Quick Operations Panel */}
        <Card style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-secondary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} color="#f59e0b" /> Quick Administration
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }}>
            <button
              onClick={() => setShowAddMember(true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '1rem',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <UserPlus size={16} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-secondary)' }}>Add User</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Create new member/lead</span>
            </button>

            <button
              onClick={() => setShowCreateEvent(true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '1rem',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <CalendarPlus size={16} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-secondary)' }}>New Event</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Schedule workshop/hackathon</span>
            </button>

            <button
              onClick={() => setShowCreateProject(true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '1rem',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <FolderPlus size={16} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-secondary)' }}>Assign Project</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Launch technical build</span>
            </button>

            <button
              onClick={() => setShowCreateAnnouncement(true)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '1rem',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <Megaphone size={16} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-secondary)' }}>Broadcast</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Post announcement</span>
            </button>
          </div>

          <button
            onClick={handleExport}
            style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.65rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              color: 'var(--color-secondary)',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <FileSpreadsheet size={16} color="#16a34a" /> Download Full Portal CSV Report
          </button>
        </Card>
      </div>

      {/* Bottom Section: Recent System Activity & New Registered Users */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Audit & System Activity Feed */}
        <Card style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="var(--color-primary)" /> Live Audit Trail
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Real-time logs</span>
          </div>

          {activity.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Activity size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.875rem' }}>No recent administrative actions recorded yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activity.map((log) => {
                const info = formatActivityText(log);
                const IconComponent = info.icon;
                return (
                  <div
                    key={log.id || log._id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: `1px solid ${info.color}30`,
                        color: info.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {info.title}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                          <Clock size={11} /> {formatTimeAgo(log.createdAt)}
                        </span>
                      </div>
                      {info.desc && (
                        <p style={{ fontSize: '0.775rem', color: 'var(--color-text-muted)', margin: '0.15rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {info.desc}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recently Added Users */}
        <Card style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--color-primary)" /> Latest Users Added
            </h3>
            <Link to="/admin/users" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>
              View All Users
            </Link>
          </div>

          {stats.recentUsers && stats.recentUsers.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recentUsers.map((user) => (
                <div
                  key={user.id || user._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: user.role === 'admin' ? '#ede9fe' : (user.role === 'lead' ? '#e0f2fe' : '#f1f5f9'),
                        color: user.role === 'admin' ? '#7c3aed' : (user.role === 'lead' ? '#0284c7' : '#475569'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                      }}
                    >
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <Badge color={user.role === 'admin' ? '#8b5cf6' : (user.role === 'lead' ? '#0a66c2' : '#64748b')}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <Users size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.875rem' }}>No users recorded yet.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
