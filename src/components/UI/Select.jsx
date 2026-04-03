import React from 'react';

const Select = React.forwardRef(({
  label,
  error,
  id,
  options = [],
  fullWidth = true,
  placeholder = 'Select an option',
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

  const selectStyle = {
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-md)',
    border: `1px solid ${error ? 'var(--danger)' : 'var(--border-color)'}`,
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23475569%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.7rem top 50%',
    backgroundSize: '0.65rem auto',
  };

  return (
    <div style={containerStyle}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <select
        ref={ref}
        id={id}
        style={selectStyle}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--brand-primary)';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.2)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border-color)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{error}</span>}
    </div>
  );
});

export default Select;
