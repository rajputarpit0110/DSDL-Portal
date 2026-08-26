import React, { useState } from 'react';
import { Layers, Type, Link2, FileText, Sparkles, X, Loader2 } from 'lucide-react';
import { apiClient } from '../../utils/apiClient';
import Alert from '../../common/Alert';
import { useToast } from '../../context/ToastContext';

const ICON_PRESETS = [
  'Code',
  'Brain',
  'Smartphone',
  'Shield',
  'Cloud',
  'Database',
  'Cpu',
  'Globe',
  'Terminal',
  'Layers',
  'Box',
  'Radio',
];

const CreateDomainModal = ({ domainToEdit = null, onClose, onSuccess }) => {
  const toast = useToast();
  const isEditing = Boolean(domainToEdit);

  const [formData, setFormData] = useState({
    name: domainToEdit?.name || '',
    slug: domainToEdit?.slug || '',
    description: domainToEdit?.description || '',
    icon: domainToEdit?.icon || 'Code',
    imageUrl: domainToEdit?.imageUrl || '',
  });

  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (e) => {
    const val = e.target.value;
    const updated = { ...formData, name: val };
    if (autoSlug) {
      updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    setFormData(updated);
  };

  const handleSlugChange = (e) => {
    setAutoSlug(false);
    setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') });
  };

  const validate = () => {
    if (!formData.name.trim()) {
      setError('Please provide a domain name.');
      return false;
    }
    if (!formData.slug.trim()) {
      setError('Please provide a unique slug URL.');
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
      if (isEditing) {
        await apiClient.put(`/domains/${domainToEdit.id || domainToEdit._id}`, formData);
        toast.success(`Domain "${formData.name}" updated successfully!`);
      } else {
        await apiClient.post('/domains', formData);
        toast.success(`Domain "${formData.name}" created successfully!`);
      }
      onSuccess();
    } catch (err) {
      const msg = err.message || `Failed to ${isEditing ? 'update' : 'create'} domain.`;
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
          maxWidth: '520px',
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
              <Layers size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-main)', margin: 0 }}>
                {isEditing ? 'Edit Domain' : 'Create New Domain'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                {isEditing ? 'Update domain information and settings.' : 'Add a specialized technical domain / wing to KRIVA.'}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
          {/* Domain Name */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
              Domain Name <span style={{ color: '#f87171' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Type size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                required
                placeholder="e.g. Cloud & DevOps, Blockchain, Game Development"
                value={formData.name}
                onChange={handleNameChange}
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

          {/* Slug */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
                URL Identifier / Slug <span style={{ color: '#f87171' }}>*</span>
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>/domains/{formData.slug || 'cloud-devops'}</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Link2 size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                required
                placeholder="e.g. cloud-devops"
                value={formData.slug}
                onChange={handleSlugChange}
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
                  fontFamily: 'monospace',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
              Description
            </label>
            <div style={{ position: 'relative' }}>
              <FileText size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--color-text-muted)' }} />
              <textarea
                rows={3}
                placeholder="What is the focus of this domain, technologies involved, and learning outcomes?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

          {/* Icon Presets */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
              Domain Icon
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {ICON_PRESETS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={() => setFormData({ ...formData, icon: ic })}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    border: formData.icon === ic ? '1px solid rgba(220, 38, 38, 0.6)' : '1px solid var(--color-border)',
                    backgroundColor: formData.icon === ic ? 'rgba(220, 38, 38, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: formData.icon === ic ? 'var(--color-primary-hover)' : 'var(--color-text-muted)',
                    fontWeight: formData.icon === ic ? '700' : '400',
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {ic}
                </button>
              ))}
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
                  {isEditing ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Create Domain'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDomainModal;
