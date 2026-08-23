import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await apiClient.get('/notifications/unread-count');
        setUnreadCount(response.count || 0);
      } catch (error) {
        console.error('Failed to fetch unread notifications', error);
      }
    };
    fetchUnreadCount();
  }, []);

  return (
    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => window.location.href = '/notifications'}>
      <Bell size={20} color='var(--color-text-muted)' />
      {unreadCount > 0 && (
        <div style={{ 
          position: 'absolute', top: '-6px', right: '-6px', 
          backgroundColor: '#e11d48', color: 'white', fontSize: '10px', 
          borderRadius: '50%', padding: '2px 5px', fontWeight: 'bold' 
        }}>
          {unreadCount}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
