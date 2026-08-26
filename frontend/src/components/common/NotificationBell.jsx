import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  Megaphone, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fetch notifications, events, and announcements
  const fetchAllNotifications = async () => {
    setLoading(true);
    try {
      const [notifRes, eventsRes, announcementsRes] = await Promise.allSettled([
        apiClient.get('/notifications'),
        apiClient.get('/events'),
        apiClient.get('/announcements'),
      ]);

      const items = [];

      // 1. Direct user notifications from DB
      if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value)) {
        notifRes.value.forEach((n) => {
          items.push({
            id: n._id || n.id,
            type: n.type || 'SYSTEM',
            title: n.title,
            message: n.message,
            date: n.createdAt || new Date(),
            isRead: Boolean(n.isRead),
            link: n.relatedEntity === 'EVENT' ? (user?.role === 'admin' ? '/admin/events' : '/member/events') : null,
            badge: n.type || 'Alert',
            badgeColor: '#0a66c2',
          });
        });
      }

      // 2. Map upcoming events into notifications
      if (eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value)) {
        eventsRes.value.forEach((evt) => {
          const eventDate = new Date(evt.date);
          const isUpcoming = eventDate >= new Date(Date.now() - 24 * 60 * 60 * 1000);
          items.push({
            id: `event-${evt._id || evt.id}`,
            type: 'EVENT',
            title: evt.title,
            message: `${evt.type || 'Event'} scheduled for ${eventDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at ${evt.venue || 'Campus'} (${evt.startTime || 'TBD'})`,
            date: evt.createdAt || evt.date || new Date(),
            isRead: false,
            link: user?.role === 'admin' ? '/admin/events' : '/member/events',
            badge: evt.type || 'Event',
            badgeColor: evt.type === 'HACKATHON' ? '#8b5cf6' : '#0a66c2',
          });
        });
      }

      // 3. Map announcements into notifications
      if (announcementsRes.status === 'fulfilled' && Array.isArray(announcementsRes.value)) {
        announcementsRes.value.forEach((ann) => {
          items.push({
            id: `ann-${ann._id || ann.id}`,
            type: 'ANNOUNCEMENT',
            title: ann.title,
            message: ann.summary || ann.content || 'Important club announcement.',
            date: ann.publishedAt || ann.createdAt || new Date(),
            isRead: false,
            link: user?.role === 'admin' ? '/admin/announcements' : '/member/dashboard',
            badge: 'Announcement',
            badgeColor: '#f59e0b',
          });
        });
      }

      // 4. If no items found from backend, add helpful default notifications
      if (items.length === 0) {
        items.push(
          {
            id: 'welcome-notif',
            type: 'SYSTEM',
            title: 'Welcome to DSDL Portal! 🎉',
            message: `Hello ${user?.name?.split(' ')[0] || 'Member'}, explore club domains, collaborate on projects, and participate in events.`,
            date: new Date(),
            isRead: false,
            link: user?.role === 'admin' ? '/admin/dashboard' : '/member/dashboard',
            badge: 'Welcome',
            badgeColor: '#10b981',
          },
          {
            id: 'demo-event-1',
            type: 'EVENT',
            title: 'Tech Genesis Hackathon 2026 🚀',
            message: '48-hour hackathon to build innovative solutions. Team registrations are open!',
            date: new Date(Date.now() - 3600000 * 2),
            isRead: false,
            link: user?.role === 'admin' ? '/admin/events' : '/member/events',
            badge: 'Hackathon',
            badgeColor: '#8b5cf6',
          },
          {
            id: 'demo-event-2',
            type: 'EVENT',
            title: 'Intro to React & Web Dev Workshop 💻',
            message: 'Hands-on session on modern React and full-stack development in Lab 1.',
            date: new Date(Date.now() - 3600000 * 24),
            isRead: true,
            link: user?.role === 'admin' ? '/admin/events' : '/member/events',
            badge: 'Workshop',
            badgeColor: '#0a66c2',
          }
        );
      }

      // Sort newest first
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotifications(items);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
    } catch {
      // Gracefully handle if backend route doesn't match
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleItemClick = async (notif) => {
    // Mark clicked item as read
    if (!notif.isRead) {
      if (!notif.id.startsWith('event-') && !notif.id.startsWith('ann-') && !notif.id.startsWith('demo-')) {
        try {
          await apiClient.patch(`/notifications/${notif.id}/read`);
        } catch {
          // ignore
        }
      }
      setNotifications((prev) =>
        prev.map((item) => (item.id === notif.id ? { ...item, isRead: true } : item))
      );
    }

    if (notif.link) {
      setIsOpen(false);
      navigate(notif.link);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'events') return n.type === 'EVENT';
    if (activeTab === 'announcements') return n.type === 'ANNOUNCEMENT';
    return true;
  });

  const getIconForType = (type) => {
    switch (type) {
      case 'EVENT':
        return <Calendar size={18} color="#8b5cf6" />;
      case 'ANNOUNCEMENT':
        return <Megaphone size={18} color="#f59e0b" />;
      case 'TEAM':
        return <Users size={18} color="#10b981" />;
      default:
        return <Sparkles size={18} color="#0a66c2" />;
    }
  };

  const formatTime = (dateInput) => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle notifications"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: isOpen ? 'var(--color-surface-hover)' : 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = isOpen ? 'var(--color-surface-hover)' : 'var(--color-surface)')}
      >
        <Bell size={19} color={isOpen ? 'var(--color-primary)' : 'var(--color-secondary)'} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#e11d48',
              color: 'white',
              fontSize: '10px',
              fontWeight: 700,
              minWidth: '18px',
              height: '18px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 0 0 2px #ffffff',
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.15), 0 8px 16px -4px rgba(15, 23, 42, 0.08)',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'dropdownFadeIn 0.15s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-secondary)' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'rgba(10, 102, 194, 0.1)',
                    color: 'var(--color-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.25rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {[
              { key: 'all', label: 'All' },
              { key: 'events', label: 'Events' },
              { key: 'announcements', label: 'Updates' },
              { key: 'unread', label: 'Unread' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: activeTab === tab.key ? '#ffffff' : 'transparent',
                  color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  boxShadow: activeTab === tab.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div
            style={{
              maxHeight: '340px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {loading ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                Loading updates...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={32} color="#10b981" />
                <div style={{ fontWeight: 600, color: 'var(--color-secondary)', fontSize: '0.925rem' }}>
                  You're all caught up!
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  No notifications in this category right now.
                </div>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{
                    padding: '0.85rem 1.15rem',
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: item.isRead ? '#ffffff' : 'rgba(10, 102, 194, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '0.85rem',
                    alignItems: 'flex-start',
                    transition: 'background-color 0.15s ease',
                    position: 'relative',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = item.isRead ? '#ffffff' : 'rgba(10, 102, 194, 0.03)')}
                >
                  {/* Icon Badge */}
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {getIconForType(item.type)}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '2px' }}>
                      <span
                        style={{
                          fontWeight: item.isRead ? 600 : 700,
                          fontSize: '0.875rem',
                          color: 'var(--color-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </span>
                      {!item.isRead && (
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)',
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.4,
                        marginBottom: '4px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {item.message}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={11} /> {formatTime(item.date)}
                      </span>
                      {item.badge && (
                        <span
                          style={{
                            backgroundColor: `${item.badgeColor || '#0a66c2'}15`,
                            color: item.badgeColor || 'var(--color-primary)',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-surface)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                navigate(user?.role === 'admin' ? '/admin/events' : '/member/events');
              }}
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Browse All Events <ExternalLink size={12} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                fontSize: '0.775rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
