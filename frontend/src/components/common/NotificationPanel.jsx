import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import {
  Megaphone,
  Bell,
  Calendar,
  Users,
  CheckCheck,
  RotateCw,
  Trash2,
  ExternalLink,
  Info,
  Sparkles
} from 'lucide-react';

const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Recent';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const NotificationPanel = () => {
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    openAnnouncement,
    fetchNotifications,
    closePanel
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'announcements' | 'unread'

  const announcementsList = notifications.filter(
    (n) => n.type === 'ANNOUNCEMENT' || n.relatedEntity === 'Announcement'
  );
  const unreadList = notifications.filter((n) => !n.isRead);

  let displayedList = notifications;
  if (activeTab === 'announcements') {
    displayedList = announcementsList;
  } else if (activeTab === 'unread') {
    displayedList = unreadList;
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Megaphone size={18} color="var(--color-primary)" />
          </div>
        );
      case 'EVENT':
        return (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Calendar size={18} color="#10b981" />
          </div>
        );
      case 'TEAM_REQUEST':
      case 'TEAM':
        return (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Users size={18} color="#f59e0b" />
          </div>
        );
      case 'WELCOME':
      default:
        return (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sparkles size={18} color="#6366f1" />
          </div>
        );
    }
  };

  const handleItemClick = (notification) => {
    if (notification.type === 'ANNOUNCEMENT' || notification.relatedEntity === 'Announcement') {
      openAnnouncement(notification);
    } else {
      if (!notification.isRead) {
        markAsRead(notification.id || notification._id);
      }
    }
  };

  const notificationsRoute = user?.role === 'admin' ? '/admin/notifications' : '/member/notifications';

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: 0,
        width: '380px',
        maxWidth: '90vw',
        backgroundColor: 'var(--panel-solid)',
        borderRadius: '16px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'modalSlideUp 0.15s ease-out'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.02)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bell size={18} color="var(--color-primary-hover)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>
              Notifications
            </h3>
          </div>
          {unreadCount > 0 && (
            <span
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '12px'
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              title="Mark all as read"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-hover)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.12)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <CheckCheck size={15} />
              <span>Read all</span>
            </button>
          )}

          <button
            onClick={fetchNotifications}
            title="Refresh notifications"
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          padding: '0.4rem 0.75rem',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          gap: '0.35rem',
          borderBottom: '1px solid var(--color-border)'
        }}
      >
        <button
          onClick={() => setActiveTab('all')}
          style={{
            flex: 1,
            padding: '0.4rem 0.6rem',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'all' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            color: activeTab === 'all' ? '#ffffff' : 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            transition: 'all 0.15s'
          }}
        >
          All
          <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({notifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          style={{
            flex: 1,
            padding: '0.4rem 0.6rem',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'announcements' ? 'rgba(220, 38, 38, 0.15)' : 'transparent',
            color: activeTab === 'announcements' ? 'var(--color-primary-hover)' : 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            transition: 'all 0.15s'
          }}
        >
          📢 Notices
          <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({announcementsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('unread')}
          style={{
            flex: 1,
            padding: '0.4rem 0.6rem',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'unread' ? 'rgba(220, 38, 38, 0.15)' : 'transparent',
            color: activeTab === 'unread' ? '#f87171' : 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.3rem',
            transition: 'all 0.15s'
          }}
        >
          Unread
          <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({unreadCount})</span>
        </button>
      </div>

      {/* Notifications List */}
      <div
        style={{
          maxHeight: '360px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {displayedList.length === 0 ? (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--color-text-muted)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={22} color="#a1a1aa" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                {activeTab === 'unread'
                  ? 'All caught up!'
                  : activeTab === 'announcements'
                  ? 'No announcements yet'
                  : 'No notifications'}
              </p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {activeTab === 'unread'
                  ? 'You have read all incoming announcements & updates.'
                  : 'New club notices will appear here automatically.'}
              </p>
            </div>
          </div>
        ) : (
          displayedList.map((item, index) => {
            const isAnnouncement = item.type === 'ANNOUNCEMENT' || item.relatedEntity === 'Announcement';
            const itemId = item.id || item._id;

            return (
              <div
                key={itemId || index}
                onClick={() => handleItemClick(item)}
                style={{
                  padding: '0.9rem 1.1rem',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: item.isRead ? 'transparent' : 'rgba(220, 38, 38, 0.05)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = item.isRead ? 'transparent' : 'rgba(220, 38, 38, 0.05)';
                }}
              >
                {/* Unread Glow Dot */}
                {!item.isRead && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '4px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                      boxShadow: '0 0 6px var(--color-primary)'
                    }}
                  />
                )}

                {getNotificationIcon(item.type)}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.2rem'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: item.isRead ? 600 : 700,
                        color: 'var(--color-text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        paddingRight: '0.5rem'
                      }}
                    >
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--color-text-muted)',
                        flexShrink: 0
                      }}
                    >
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--color-text-muted)',
                      margin: '0 0 0.4rem 0',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.message}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {isAnnouncement ? (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--color-primary-hover)',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                      >
                        Read Announcement →
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        {item.type || 'Notice'}
                      </span>
                    )}

                    {/* Quick Action Buttons */}
                    <div
                      style={{ display: 'flex', gap: '0.4rem' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => deleteNotification(itemId)}
                        title="Delete notification"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-muted)',
                          cursor: 'pointer',
                          padding: '3px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#f87171')}
                        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Info size={12} /> Syncs with Announcements
        </span>

        <Link
          to={notificationsRoute}
          onClick={closePanel}
          style={{
            fontSize: '0.78rem',
            color: 'var(--color-primary-hover)',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          View all <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
};

export default NotificationPanel;
