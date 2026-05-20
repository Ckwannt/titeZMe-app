'use client';

import { useState, useEffect } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Reset password — titeZMe'; }, []);

  const handleReset = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err: any) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-email'
      ) {
        setSent(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Nunito, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '380px'
      }}>
        {!sent ? (
          <>
            <a
              href="/login"
              style={{
                color: '#555',
                fontSize: '12px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '24px'
              }}
            >
              ← Back to login
            </a>

            <div style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#fff',
              marginBottom: '8px'
            }}>
              Reset your password
            </div>

            <div style={{
              fontSize: '12px',
              color: '#555',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              Enter your email and we&apos;ll send you a reset link.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && handleReset()}
                disabled={loading}
                style={{
                  background: '#141414',
                  border: '1px solid #2a2a2a',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '13px',
                  fontFamily: 'Nunito, sans-serif',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              />

              {error && (
                <div style={{
                  background: '#1a0808',
                  border: '1px solid #EF444433',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  color: '#EF4444'
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleReset}
                disabled={loading}
                style={{
                  background: loading ? '#2a2000' : '#F5C518',
                  color: loading ? '#F5C518' : '#0a0a0a',
                  border: 'none',
                  borderRadius: '99px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                  width: '100%'
                }}
              >
                {loading ? 'Sending...' : 'Send reset link →'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
            <div style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#fff',
              marginBottom: '8px'
            }}>
              Check your email
            </div>
            <div style={{
              fontSize: '12px',
              color: '#555',
              lineHeight: '1.7',
              marginBottom: '24px'
            }}>
              If an account exists for{' '}
              <span style={{ color: '#F5C518' }}>{email}</span>
              {', '}you will receive a password reset link shortly.
              Check your spam folder too.
            </div>
            <a
              href="/login"
              style={{
                color: '#F5C518',
                fontSize: '13px',
                fontWeight: 800,
                textDecoration: 'none'
              }}
            >
              ← Back to login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
