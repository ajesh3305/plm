import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  id,
  fullWidth = true,
  ...props
}, ref) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
    width: fullWidth ? '100%' : 'auto'
  };

  const labelStyle = {
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-primary)'
  };

  const inputStyle = {
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={containerStyle}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <input
        ref={ref}
        id={id}
        type={type}
        style={inputStyle}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--brand-primary)';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.2)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border-color)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</span>}
    </div>
  );
});

export default Input;
