import React, { useState } from 'react';
import { Megaphone, Type, FileText, AlertTriangle, Eye, X, Loader2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import Alert from '../../common/Alert';
import { useToast } from '../../context/ToastContext';

const CreateAnnouncementModal = ({ announcementToEdit = null, onClose, onSuccess }) => {
  const toast = useToast();
  const isEditing = Boolean(announcementToEdit);

  const [formData, setFormData] = useState({
    title: announcementToEdit?.title || '',
    summary: announcementToEdit?.summary || '',
    content: announcementToEdit?.content || '',
    type: announcementToEdit?.type || 'NEWS',
    priority: announcementToEdit?.priority || 'NORMAL',
    status: announcementToEdit?.status || 'published',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!formData.title.trim()) {
      setError('Please provide an announcement title.');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Please provide announcement content.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        summary: formData.summary.trim() || formData.title,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : undefined,
      };

      if (isEditing) {
        await apiClient.put(`/announcements/${announcementToEdit.id || announcementToEdit._id}`, payload);
        toast.success(`Announcement "${formData.title}" updated successfully!`);
      } else {
        await apiClient.post('/announcements', payload);
        toast.success(`Announcement "${formData.title}" published successfully!`);
      }
      onSuccess();
    } catch (err) {
      const msg = err.message || `Failed to ${isEditing ? 'update' : 'create'} announcement.`;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--panel-solid)',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          animation: 'scaleIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(220, 38, 38, 0.12)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: 'var(--color-primary-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Megaphone size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-main)', margin: 0 }}>
                {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                {isEditing ? 'Modify announcement information.' : 'Broadcast news, opportunities, or urgent alerts to club members.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '6px',
            }}
            aria-label="Close dialog"
            onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Inline Error Alert */}
        {error && (
          <div style={{ marginBottom: '1.25rem' }}>
            <Alert variant="error" onClose={() => setError('')}>
              {error}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
              Title <span style={{ color: '#f87171' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Type size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                required
                placeholder="e.g. Hackathon 2026 Registrations Open!"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--color-text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Type, Priority, Status 3-col Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.825rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#1f0d0d',
                  color: 'var(--color-text-main)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="NEWS">News</option>
                <option value="UPDATE">Update</option>
                <option value="ALERT">Alert</option>
                <option value="EVENT">Event</option>
                <option value="OPPORTUNITY">Opportunity</option>
                <option value="ACHIEVEMENT">Achievement</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.825rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#1f0d0d',
                  color: 'var(--color-text-main)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="NORMAL">Normal</option>
                <option value="LOW">Low</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.825rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.5rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#1f0d0d',
                  color: 'var(--color-text-main)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Short Summary */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
              Short Summary / Teaser
            </label>
            <input
              placeholder="One-line summary for banners and dashboard widgets..."
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--color-text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Full Content */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
              Full Announcement Content <span style={{ color: '#f87171' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FileText size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--color-text-muted)' }} />
              <textarea
                required
                rows={4}
                placeholder="Write the full announcement message, details, and guidelines..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--color-text-main)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--color-text-main)',
                fontWeight: '500',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  {isEditing ? 'Saving...' : 'Posting...'}
                </>
              ) : (
                isEditing ? 'Save Changes' : (formData.status === 'published' ? 'Publish Announcement' : 'Save as Draft')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
