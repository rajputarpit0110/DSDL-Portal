import React, { useState, useEffect } from 'react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { Plus, Trash2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = () => {
    setLoading(true);
    // Passing ?all=true so admin sees both published and draft
    apiClient.get('/announcements?all=true')
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await apiClient.delete(`/announcements/${id}`);
        fetchAnnouncements();
      } catch (error) {
        console.error('Failed to delete announcement:', error);
      }
    }
  };

  const handleTogglePublish = async (id, isPublished) => {
    try {
      await apiClient.patch(`/announcements/${id}/publish`, { publish: !isPublished });
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to publish/unpublish announcement:', error);
    }
  };

  const handleCreateMock = async () => {
    try {
      await apiClient.post('/announcements', {
        title: 'New Announcement ' + Date.now(),
        content: 'This is a test announcement created from the dashboard.',
        summary: 'Test summary',
        type: 'NEWS',
        priority: 'NORMAL',
        status: 'draft'
      });
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  if (loading && announcements.length === 0) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}>Manage Announcements</h2>
        <Button variant="primary" onClick={handleCreateMock} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          <Plus size={16} /> Create Announcement
        </Button>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {announcements.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No announcements found.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Title</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Type</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((ann, i) => (
                  <tr key={ann.id || ann._id} style={{ borderBottom: i === announcements.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: '500' }}>{ann.title}</span>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{ann.summary}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge color={ann.priority === 'URGENT' ? '#e11d48' : '#3b82f6'}>{ann.type}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Badge color={ann.status === 'published' ? 'var(--color-primary)' : '#64748b'}>{ann.status}</Badge>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleTogglePublish(ann.id || ann._id, ann.status === 'published')} style={{ padding: '4px 8px', fontSize: '12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                          {ann.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => handleDelete(ann.id || ann._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ManageAnnouncements;
