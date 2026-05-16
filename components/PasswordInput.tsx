'use client';

import { useState } from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Tailwind className — used by login/signup pages */
  className?: string;
  /** Inline style — used by admin login page */
  style?: React.CSSProperties;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  className,
  style,
  onKeyDown,
  required,
  autoComplete,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        required={required}
        autoComplete={autoComplete}
        className={className}
        style={style ? { ...style, paddingRight: '44px', width: '100%', boxSizing: 'border-box' } : undefined}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: show ? '#F5C518' : '#555',
          fontSize: '16px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s',
          lineHeight: 1,
        }}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? '🙈' : '👁'}
      </button>
    </div>
  );
}
