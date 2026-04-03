import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  type = 'button',
  fullWidth = false,
  className = '',
  disabled = false,
  ...props 
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    borderRadius: 'var(--radius-md)',
    transition: 'all 0.2s',
    outline: 'none',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--brand-primary)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-sm)'
    },
    secondary: {
      backgroundColor: 'var(--bg-tertiary)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)'
    },
    danger: {
      backgroundColor: 'var(--danger)',
      color: '#ffffff',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid var(--brand-primary)',
      color: 'var(--brand-primary)'
    }
  };

  const sizes = {
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.875rem' },
    md: { padding: '0.5rem 1rem', fontSize: '1rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' }
  };

  // Setup hover effects using inline style events or standard CSS (relying on standard CSS classes if provided, but inline fallback is robust enough for base)
  const combinedStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size]
  };

  return (
    <button
      type={type}
      style={combinedStyle}
      disabled={disabled}
      className={className}
      onMouseOver={(e) => {
        if (!disabled && variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--brand-primary-hover)';
      }}
      onMouseOut={(e) => {
        if (!disabled && variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
