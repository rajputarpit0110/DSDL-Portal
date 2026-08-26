import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger', // 'danger' | 'primary'
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

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
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'var(--panel-solid)',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          width: '100%',
          maxWidth: '440px',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: confirmVariant === 'danger' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                border: `1px solid ${confirmVariant === 'danger' ? 'rgba(220, 38, 38, 0.35)' : 'rgba(59, 130, 246, 0.35)'}`,
                color: confirmVariant === 'danger' ? '#f87171' : '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{title}</h3>
          </div>
          <button
            onClick={onCancel}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: '1.5', marginBottom: '1.75rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--color-text-main)',
              fontWeight: 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: confirmVariant === 'danger' ? '#dc2626' : 'var(--color-primary)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 10px rgba(220, 38, 38, 0.3)',
            }}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
