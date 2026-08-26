import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const alertStyles = {
  error: {
    bg: 'rgba(220, 38, 38, 0.12)',
    border: 'rgba(220, 38, 38, 0.35)',
    color: '#fca5a5',
    iconColor: '#f87171',
    Icon: AlertCircle,
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    color: '#fde68a',
    iconColor: '#fbbf24',
    Icon: AlertTriangle,
  },
  success: {
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    color: '#86efac',
    iconColor: '#34d399',
    Icon: CheckCircle2,
  },
  info: {
    bg: 'rgba(59, 130, 246, 0.12)',
    border: 'rgba(59, 130, 246, 0.35)',
    color: '#93c5fd',
    iconColor: '#60a5fa',
    Icon: Info,
  },
};

const Alert = ({
  variant = 'error',
  title,
  children,
  onClose,
  style = {},
  className = '',
}) => {
  const current = alertStyles[variant] || alertStyles.error;
  const IconComponent = current.Icon;

  return (
    <div
      role="alert"
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        backgroundColor: current.bg,
        border: `1px solid ${current.border}`,
        borderRadius: '8px',
        color: current.color,
        fontSize: '0.875rem',
        lineHeight: '1.45',
        animation: 'fadeIn 0.2s ease-in-out',
        ...style,
      }}
    >
      <div style={{ color: current.iconColor, flexShrink: 0, marginTop: '2px' }}>
        <IconComponent size={18} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{title}</div>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            color: current.iconColor,
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
