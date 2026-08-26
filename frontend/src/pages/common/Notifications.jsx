import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import Card from '../../common/Card';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import {
  Bell,
  Megaphone,
  Calendar,
  Users,
  Search,
  CheckCheck,
  Trash2,
  Filter,
  Sparkles,
  ExternalLink,
  RotateCw
} from 'lucide-react';

const formatFullDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    openAnnouncement,
    fetchNotifications
  } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'ANNOUNCEMENT' | 'UNREAD' | 'EVENT'

  const announcements = notifications.filter(
    (n) => n.type === 'ANNOUNCEMENT' || n.relatedEntity === 'Announcement'
  );
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const eventNotifications = notifications.filter((n) => n.type === 'EVENT');

  const filteredNotifications = notifications.filter((item) => {
    // Category/Tab Filter
    if (filterType === 'ANNOUNCEMENT') {
      if (item.type !== 'ANNOUNCEMENT' && item.relatedEntity !== 'Announcement') return false;
    } else if (filterType === 'UNREAD') {
      if (item.isRead) return false;
    } else if (filterType === 'EVENT') {
      if (item.type !== 'EVENT') return false;
    }

    // Search Filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchMsg = item.message?.toLowerCase().includes(q);
      return matchTitle || matchMsg;
    }

    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Megaphone size={20} color="var(--color-primary)" />
          </div>
        );
      case 'EVENT':
        return (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Calendar size={20} color="#10b981" />
          </div>
        );
      case 'TEAM_REQUEST':
      case 'TEAM':
        return (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Users size={20} color="#f59e0b" />
          </div>
        );
      default:
        return (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sparkles size={20} color="#6366f1" />
          </div>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-secondary)', margin: 0 }}>
            Notifications & Announcements
          </h1>
          <p style={{ color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
            Stay updated with club announcements, events, team activities, and domain notices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              <CheckCheck size={16} /> Mark All as Read
            </Button>
          )}

          <button
            onClick={fetchNotifications}
            disabled={loading}
            style={{
              background: 'white',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)'
            }}
            title="Refresh"
          >
            <RotateCw size={18} />
          </button>
        </div>
      </div>

      {/* Metric / Stat Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <Card style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-primary)' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>TOTAL ALERTS</span>
          <h2 style={{ fontSize: '1.75rem', margin: '0.35rem 0 0 0', color: 'var(--color-secondary)' }}>
            {notifications.length}
          </h2>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid #e11d48' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>UNREAD</span>
          <h2 style={{ fontSize: '1.75rem', margin: '0.35rem 0 0 0', color: '#e11d48' }}>
            {unreadCount}
          </h2>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid #3b82f6' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>ANNOUNCEMENTS</span>
          <h2 style={{ fontSize: '1.75rem', margin: '0.35rem 0 0 0', color: '#3b82f6' }}>
            {announcements.length}
          </h2>
        </Card>

        <Card style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>EVENT UPDATES</span>
          <h2 style={{ fontSize: '1.75rem', margin: '0.35rem 0 0 0', color: '#10b981' }}>
            {eventNotifications.length}
          </h2>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'All', count: notifications.length },
                { id: 'ANNOUNCEMENT', label: '📢 Announcements', count: announcements.length },
                { id: 'UNREAD', label: 'Unread', count: unreadCount },
                { id: 'EVENT', label: 'Events', count: eventNotifications.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: filterType === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: filterType === tab.id ? 'var(--color-primary)' : 'white',
                    color: filterType === tab.id ? 'white' : 'var(--color-secondary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s'
                  }}
                >
                  {tab.label}
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      backgroundColor: filterType === tab.id ? 'rgba(255,255,255,0.25)' : 'var(--color-surface)',
                      color: filterType === tab.id ? 'white' : 'var(--color-text-muted)'
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }}
              />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.25rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredNotifications.length === 0 ? (
          <Card style={{ padding: '3.5rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Bell size={28} color="#94a3b8" />
            </div>
            <h3 style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }}>No notifications found</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
              {searchTerm
                ? `No notifications matching "${searchTerm}". Try a different keyword.`
                : 'You have no notifications in this view.'}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((item) => {
            const isAnnouncement = item.type === 'ANNOUNCEMENT' || item.relatedEntity === 'Announcement';
            const itemId = item.id || item._id;

            return (
              <Card
                key={itemId}
                style={{
                  padding: '1.25rem 1.5rem',
                  borderLeft: item.isRead ? '4px solid transparent' : '4px solid var(--color-primary)',
                  backgroundColor: item.isRead ? 'white' : 'rgba(59, 130, 246, 0.02)',
                  transition: 'box-shadow 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  {getNotificationIcon(item.type)}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '0.4rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h4
                          style={{
                            fontSize: '1rem',
                            fontWeight: item.isRead ? 600 : 700,
                            color: 'var(--color-secondary)',
                            margin: 0
                          }}
                        >
                          {item.title}
                        </h4>
                        {isAnnouncement && (
                          <Badge color="var(--color-primary)">Announcement</Badge>
                        )}
                        {!item.isRead && (
                          <span
                            style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              color: 'var(--color-primary)',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '10px'
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </div>

                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        {formatFullDate(item.createdAt)}
                      </span>
                    </div>

                    <p
                      style={{
                        color: 'var(--color-text-main)',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        margin: '0 0 1rem 0'
                      }}
                    >
                      {item.message}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        {isAnnouncement && (
                          <Button
                            variant="outline"
                            onClick={() => openAnnouncement(item)}
                            style={{
                              padding: '0.35rem 0.85rem',
                              fontSize: '0.82rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            <ExternalLink size={14} /> View Full Announcement
                          </Button>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {!item.isRead && (
                          <button
                            onClick={() => markAsRead(itemId)}
                            style={{
                              background: 'none',
                              border: '1px solid var(--color-border)',
                              borderRadius: '6px',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              color: 'var(--color-text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.color = 'var(--color-primary)';
                              e.currentTarget.style.borderColor = 'var(--color-primary)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.color = 'var(--color-text-muted)';
                              e.currentTarget.style.borderColor = 'var(--color-border)';
                            }}
                          >
                            <CheckCheck size={14} /> Mark as Read
                          </button>
                        )}

                        <button
                          onClick={() => deleteNotification(itemId)}
                          title="Delete notification"
                          style={{
                            background: 'none',
                            border: '1px solid var(--color-border)',
                            borderRadius: '6px',
                            padding: '0.35rem 0.6rem',
                            fontSize: '0.78rem',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.color = '#e11d48';
                            e.currentTarget.style.borderColor = '#e11d48';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.color = 'var(--color-text-muted)';
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notifications;
