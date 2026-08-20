import React from 'react';

const Badge = ({ children, color = 'var(--color-primary)' }) => {
  return (
    <span style={{ backgroundColor: `${color}15`, color: color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {children}
    </span>
  );
};

export default Badge;
