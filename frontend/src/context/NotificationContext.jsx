import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../utils/apiClient';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await apiClient.get('/notifications/unread-count');
      setUnreadCount(res?.count ?? 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get('/notifications');
      const list = Array.isArray(res) ? res : (res?.notifications || []);
      setNotifications(list);
      
      const unread = list.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial load & Polling every 25 seconds when user is logged in
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 25000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  const markAsRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => (n.id === id || n._id === id) ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));

      await apiClient.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      await apiClient.patch('/notifications/read-all');
    } catch (err) {
      console.error('Failed to mark all as read:', err);
      fetchNotifications();
    }
  };

  const deleteNotification = async (id) => {
    try {
      const target = notifications.find(n => n.id === id || n._id === id);
      if (target && !target.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
      await apiClient.delete(`/notifications/${id}`);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      fetchNotifications();
    }
  };

  const openAnnouncement = async (notificationOrAnnouncement) => {
    // If it's a notification, mark it as read first
    if (notificationOrAnnouncement.id || notificationOrAnnouncement._id) {
      const notifId = notificationOrAnnouncement.id || notificationOrAnnouncement._id;
      if (!notificationOrAnnouncement.isRead && notificationOrAnnouncement.type) {
        markAsRead(notifId);
      }
    }

    // Try fetching full announcement data if relatedEntityId exists
    const announcementId = notificationOrAnnouncement.relatedEntityId || notificationOrAnnouncement.id || notificationOrAnnouncement._id;
    if (announcementId && (notificationOrAnnouncement.type === 'ANNOUNCEMENT' || notificationOrAnnouncement.relatedEntity === 'Announcement')) {
      try {
        const fullAnn = await apiClient.get(`/announcements/${announcementId}`);
        if (fullAnn) {
          setSelectedAnnouncement(fullAnn);
          setIsAnnouncementModalOpen(true);
          return;
        }
      } catch (err) {
        console.warn('Could not fetch full announcement from API, fallback to notification payload:', err);
      }
    }

    // Fallback: use the notification data itself
    setSelectedAnnouncement({
      title: notificationOrAnnouncement.title,
      content: notificationOrAnnouncement.message || notificationOrAnnouncement.content || 'No additional content provided.',
      summary: notificationOrAnnouncement.summary || '',
      type: notificationOrAnnouncement.type || 'NEWS',
      priority: notificationOrAnnouncement.priority || 'NORMAL',
      createdAt: notificationOrAnnouncement.createdAt || new Date().toISOString()
    });
    setIsAnnouncementModalOpen(true);
  };

  const closeAnnouncementModal = () => {
    setIsAnnouncementModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const togglePanel = () => {
    if (!isPanelOpen) {
      fetchNotifications();
    }
    setIsPanelOpen(prev => !prev);
  };

  const closePanel = () => setIsPanelOpen(false);
  const openPanel = () => {
    fetchNotifications();
    setIsPanelOpen(true);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        isPanelOpen,
        selectedAnnouncement,
        isAnnouncementModalOpen,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        openAnnouncement,
        closeAnnouncementModal,
        togglePanel,
        closePanel,
        openPanel
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
