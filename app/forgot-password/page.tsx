'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useLang } from '@/lib/i18n/LangContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLang();

  const handleReset = async () => {
    if (!email.trim()) {
      setError(t('errors.pleaseEnterEmail'));
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
        setError(t('errors.somethingWentWrong'));
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
              {t('headings.backToLogin')}
            </a>

            <div style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#fff',
              marginBottom: '8px'
            }}>
              {t('headings.resetPassword')}
            </div>

            <div style={{
              fontSize: '12px',
              color: '#555',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              {t('forms.resetPasswordDesc')}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="email"
                placeholder={t('forms.emailAddressPlaceholder')}
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
                {loading ? t('forms.sending') : t('forms.sendResetLink')}
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
              {t('misc.checkEmail')}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#555',
              lineHeight: '1.7',
              marginBottom: '24px'
            }}>
              {t('forms.resetEmailSent').replace('{email}', email)}
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
              {t('headings.backToLogin')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
