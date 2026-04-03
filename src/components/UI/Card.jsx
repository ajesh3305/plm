import React from 'react';

export const Card = ({ children, className = '', style = {} }) => {
  return (
    <div className={`glass-panel ${className}`} style={{
      padding: '1.5rem',
      backgroundColor: 'var(--bg-secondary)',
      ...style
    }}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '1rem'
  }}>
    <div>
      <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{title}</h3>
      {subtitle && <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardBody = ({ children }) => (
  <div>{children}</div>
);
