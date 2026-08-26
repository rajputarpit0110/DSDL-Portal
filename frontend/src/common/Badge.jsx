import React from 'react';

const Badge = ({ children, color = 'var(--color-primary)', style = {}, className = '' }) => {
  // If color is a CSS variable or hex, apply standard theme-safe styles
  const isVar = typeof color === 'string' && color.startsWith('var(');
  
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        backgroundColor: isVar ? 'rgba(220, 38, 38, 0.14)' : `${color}20`,
        color: isVar ? 'var(--color-primary-hover)' : color,
        border: `1px solid ${isVar ? 'rgba(220, 38, 38, 0.35)' : `${color}50`}`,
        padding: '0.25rem 0.7rem',
        borderRadius: '9999px',
        fontSize: '0.72rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        lineHeight: 1.2,
        ...style
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
