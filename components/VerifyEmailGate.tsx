'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useLang } from '@/lib/i18n/LangContext';
import { track } from '@vercel/analytics';

interface VerifyEmailGateProps {
  /**
   * Called the instant auth.currentUser.emailVerified flips true.
   * The parent decides where to route (onboarding vs dashboard).
   */
  onVerified: () => void;
  /** Email to display in the copy. Falls back to auth.currentUser.email. */
  email?: string;
  /**
   * 'default'    — signed-in but unverified user: auto-detect + resend.
   * 'login-hint' — re-signup case where no user is signed in: static
   *                "you're already signed up, log in to continue" message
   *                (no auto-detect / resend, since there's no currentUser).
   */
  mode?: 'default' | 'login-hint';
}

export function VerifyEmailGate({ onVerified, email, mode = 'default' }: VerifyEmailGateProps) {
  const { t } = useLang();
  const [cooldown, setCooldown] = useState(0);
  const [resendError, setResendError] = useState('');
  const [resendOk, setResendOk] = useState(false);

  const displayEmail = email || auth.currentUser?.email || '';

  // Keep the latest onVerified in a ref so the poll interval is created once
  // (a new inline arrow from the parent must not tear down / reset the timer).
  const onVerifiedRef = useRef(onVerified);
  useEffect(() => { onVerifiedRef.current = onVerified; }, [onVerified]);

  // Funnel: capture when the verify gate first mounted so we can report how
  // long the user took to verify once auto-detect confirms it.
  const gateMountedAtRef = useRef<number>(Date.now());

  // AUTO-DETECT (cross-tab / cross-device): reload the auth user every 4s and
  // fire onVerified() the moment emailVerified flips true. Clears on success
  // and on unmount.
  useEffect(() => {
    if (mode !== 'default') return;
    const id = setInterval(async () => {
      const u = auth.currentUser;
      if (!u) return;
      try {
        await u.reload();
        if (auth.currentUser?.emailVerified) {
          clearInterval(id);
          // Force a fresh ID token so the `email_verified` claim that the
          // Firestore rules read is updated NOW — reload() alone refreshes the
          // local user object but not the cached token's claims, which would
          // otherwise leave the next protected write denied until the token
          // naturally refreshes (~1h) or the user re-logs in.
          try { await auth.currentUser.getIdToken(true); } catch { /* non-fatal */ }
          track('email_verified', {
            time_to_verify_seconds: Math.round((Date.now() - gateMountedAtRef.current) / 1000),
          });
          onVerifiedRef.current();
        }
      } catch {
        // Transient reload failure — ignore; the next tick retries.
      }
    }, 4000);
    return () => clearInterval(id);
  }, [mode]);

  // Resend cooldown countdown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown(c => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = async () => {
    setResendError('');
    setResendOk(false);
    const u = auth.currentUser;
    if (!u) {
      setResendError('Please log in again to resend the verification email.');
      return;
    }
    try {
      await sendEmailVerification(u);
      setResendOk(true);
      setCooldown(60);
    } catch (err: any) {
      if (err?.code === 'auth/too-many-requests') {
        setResendError('Too many attempts, try again in a few minutes.');
      } else {
        setResendError('Could not resend the verification email. Please try again.');
      }
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
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>

        {mode === 'login-hint' ? (
          <>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
              {t('misc.checkEmail')}
            </div>
            <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', marginBottom: '24px' }}>
              You&apos;ve already started signing up with this email. Log in to continue verifying.
              {displayEmail && (
                <span style={{ color: '#F5C518', display: 'block', marginTop: '4px' }}>
                  {displayEmail}
                </span>
              )}
            </div>
            <Link
              href="/login"
              style={{
                display: 'block',
                background: '#F5C518',
                color: '#0a0a0a',
                borderRadius: '99px',
                padding: '12px 20px',
                fontSize: '13px',
                fontWeight: 900,
                textDecoration: 'none',
                marginBottom: '4px'
              }}
            >
              {t('buttons.logIn')}
            </Link>
          </>
        ) : (
          <>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
              {t('misc.checkEmail')}
            </div>
            <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', marginBottom: '24px' }}>
              {t('misc.sentVerificationTo')}
              <span style={{ color: '#F5C518', display: 'block', marginTop: '4px' }}>
                {displayEmail}
              </span>
              {t('misc.clickToActivate')}
            </div>

            <div style={{ fontSize: '11px', color: '#444', marginBottom: '16px' }}>
              {t('misc.didntReceive')}
            </div>

            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              style={{
                background: 'transparent',
                border: '1px solid #2a2a2a',
                color: cooldown > 0 ? '#555' : '#888',
                borderRadius: '99px',
                padding: '10px 20px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: cooldown > 0 ? 'default' : 'pointer',
                fontFamily: 'inherit',
                marginBottom: '12px',
                width: '100%',
                opacity: cooldown > 0 ? 0.6 : 1
              }}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : t('buttons.resendVerification')}
            </button>

            {resendOk && cooldown > 0 && (
              <div style={{ fontSize: '11px', color: '#22C55E', marginBottom: '12px' }}>
                {t('success.verificationResent')}
              </div>
            )}
            {resendError && (
              <div style={{ fontSize: '11px', color: '#EF4444', marginBottom: '12px' }}>
                {resendError}
              </div>
            )}

            <Link
              href="/login"
              style={{ color: '#555', fontSize: '11px', textDecoration: 'none' }}
            >
              {t('buttons.alreadyVerified')} →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
