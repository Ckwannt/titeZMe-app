'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { userSchema } from '@/lib/schemas';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { PasswordInput } from '@/components/PasswordInput';
import { toast } from '@/lib/toast';
import { useLang } from '@/lib/i18n/LangContext';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [role, setRole] = useState<'client' | 'barber'>('client');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [errorStatus, setErrorStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [firstNameValid, setFirstNameValid] = useState<boolean | null>(null);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const { t } = useLang();

  if (loading) return null;
  if (user && !submitAttempted) {
    router.replace('/'); // if already logged in, go home
    return null;
  }

  if (emailVerified) {
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
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
            {t('misc.checkEmail')}
          </div>
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.7', marginBottom: '24px' }}>
            {t('misc.sentVerificationTo')}
            <span style={{ color: '#F5C518', display: 'block', marginTop: '4px' }}>
              {email}
            </span>
            {t('misc.clickToActivate')}
          </div>
          <div style={{ fontSize: '11px', color: '#444', marginBottom: '16px' }}>
            {t('misc.didntReceive')}
          </div>
          <button
            onClick={async () => {
              await sendEmailVerification(auth.currentUser!);
              toast.success(t('success.verificationResent'));
            }}
            style={{
              background: 'transparent',
              border: '1px solid #2a2a2a',
              color: '#888',
              borderRadius: '99px',
              padding: '10px 20px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginBottom: '12px',
              width: '100%'
            }}
          >
            {t('buttons.resendVerification')}
          </button>
          <Link
            href="/login"
            style={{ color: '#555', fontSize: '11px', textDecoration: 'none' }}
          >
            {t('buttons.alreadyVerified')} →
          </Link>
        </div>
      </div>
    );
  }

  const validateEmail = (value: string): string => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return t('errors.invalidEmail');
    return '';
  };

  const isValidEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (pass.length === 0) return { score: 0, label: '', color: '#2a2a2a' };

    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: t('forms.passwordWeak'), color: '#EF4444' };
    if (score === 2) return { score: 2, label: t('forms.passwordFair'), color: '#F97316' };
    if (score === 3) return { score: 3, label: t('forms.passwordGood'), color: '#F5C518' };
    if (score >= 4) return { score: 4, label: t('forms.passwordStrong'), color: '#22C55E' };
    return { score: 0, label: '', color: '#2a2a2a' };
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      // Account already exists — do NOT overwrite. Send to login.
      if (userDoc.exists()) {
        await signOut(auth);
        setErrorStatus(t('errors.accountAlreadyExists'));
        setTimeout(() => { router.replace('/login'); }, 2000);
        return;
      }

      // New user — create users doc
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        profilePhotoUrl: user.photoURL || '',
        role: role,
        isOnboarded: false,
        createdAt: Date.now(),
      });

      // Route straight to onboarding — never to dashboard
      if (role === 'barber') {
        router.replace('/onboarding/barber');
      } else {
        router.replace('/onboarding/client');
      }
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        setErrorStatus(t('errors.accountExistsWithEmail'));
        setTimeout(() => { router.replace('/login'); }, 2000);
        return;
      }
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorStatus(t('errors.googleSignInFailed'));
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) {
      console.log('Bot detected via honeypot');
      return;
    }
    setSubmitAttempted(true);

    if (!firstName || !lastName || !email || !password) {
      return;
    }

    if (!confirmPassword) {
      setErrorStatus(t('errors.pleaseConfirmPassword'));
      return;
    }
    if (password !== confirmPassword) {
      setErrorStatus(t('errors.passwordsNoMatch'));
      return;
    }

    setIsSubmitting(true);
    setErrorStatus('');

    try {
      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // 2. Create firestore doc
      const userData = userSchema.parse({
        uid: newUser.uid,
        email: newUser.email,
        role: role,
        firstName: firstName,
        lastName: lastName,
        createdAt: Date.now(),
        isOnboarded: false,
        ownsShop: false
      });
      await setDoc(doc(db, 'users', newUser.uid), userSchema.parse(userData));

      // 3. Send verification email and show verification screen
      await sendEmailVerification(userCredential.user, {
        url: 'https://titezme.com/login',
        handleCodeInApp: false
      });
      setEmailVerified(true);

    } catch (err: any) {
      console.error("Signup validation or save error:", err);
      const getFriendlyError = (code: string): string => {
        switch (code) {
          case 'auth/email-already-in-use':
            return t('errors.emailInUseTryLogin');
          case 'auth/weak-password':
            return t('errors.passwordTooWeak');
          case 'auth/invalid-email':
            return t('errors.invalidCredentials');
          case 'auth/operation-not-allowed':
            return t('errors.signUpDisabled');
          case 'auth/too-many-requests':
            return t('errors.tooManyAttempts');
          case 'auth/network-request-failed':
            return t('errors.connectionError');
          default:
            return t('errors.somethingWentWrong');
        }
      };
      setErrorStatus(getFriendlyError(err.code || ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[440px] mx-auto p-6 mt-10 md:mt-20">
      <div className="animate-fadeUp mb-8 text-center">
        <div className="text-3xl mb-3">🔥</div>
        <h1 className="text-[28px] font-black leading-tight mb-2">{t('headings.joinTitle')}</h1>
        <p className="text-brand-text-secondary text-[15px]">{t('headings.joinSub2')}</p>
      </div>

      {/* Role selection — must be visible BEFORE Google button so user's choice
          is honored by handleGoogleSignIn (which reads the `role` state). */}
      <div className="mb-3">
        <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-2">{t('headings.iAmA')}</label>
        <div className="flex gap-2">
          {[
            { id: 'client', label: t('contactPage.roleClient'), icon: '👤' },
            { id: 'barber', label: t('contactPage.roleBarber'), icon: '✂️' },
          ].map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id as any)}
              className={`flex-1 rounded-xl p-3 text-[13px] font-extrabold transition-all border-2 flex flex-col items-center gap-1 ${
                role === r.id
                  ? "bg-[#1a1500] border-brand-yellow text-brand-yellow"
                  : "bg-[#141414] border-[#2a2a2a] text-[#888] hover:border-[#444] hover:text-white"
              }`}
            >
              <div className="text-xl">{r.icon}</div>
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{
        fontSize: '11px',
        color: '#444',
        textAlign: 'center',
        marginBottom: '16px',
        fontFamily: 'Nunito, sans-serif',
      }}>
        {t('headings.joinSubtitle')}
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        style={{
          width: '100%',
          padding: '12px',
          background: '#fff',
          border: '1px solid #2a2a2a',
          borderRadius: '99px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 800,
          fontFamily: 'Nunito, sans-serif',
          color: '#0a0a0a',
          marginBottom: '16px'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        {t('buttons.continueWithGoogle')}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
        <span style={{ fontSize: '11px', color: '#444', fontWeight: 700 }}>{t('misc.or')}</span>
        <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
      </div>

      <form noValidate onSubmit={handleSignup} className="animate-fadeUp !delay-[50ms] flex flex-col gap-4">
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            opacity: 0,
            pointerEvents: 'none'
          }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.firstName').toUpperCase()} <span className="text-brand-red">*</span></label>
            <input
              required
              value={firstName}
              onChange={e => {
                setFirstName(e.target.value);
                setFirstNameValid(e.target.value.trim().length >= 2);
              }}
              className="w-full bg-[#141414] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow"
              style={{
                border: firstNameValid === true
                  ? '1px solid #22C55E'
                  : firstNameValid === false
                    ? '1px solid #EF4444'
                    : '1px solid #2a2a2a'
              }}
              placeholder={t('forms.firstNamePlaceholder')}
            />
            {submitAttempted && !firstName && <span className="text-brand-red text-xs mt-1 block">{t('errors.fieldRequired')}</span>}
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.lastName').toUpperCase()} <span className="text-brand-red">*</span></label>
            <input 
              required
              value={lastName} onChange={e => setLastName(e.target.value)}
              className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
              placeholder={t('forms.lastNamePlaceholder')}
            />
            {submitAttempted && !lastName && <span className="text-brand-red text-xs mt-1 block">{t('errors.fieldRequired')}</span>}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.email').toUpperCase()} <span className="text-brand-red">*</span></label>
          <div style={{ position: 'relative' }}>
            <input
              required
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setEmailError(validateEmail(e.target.value));
                if (e.target.value.length > 3) {
                  setEmailValid(isValidEmail(e.target.value));
                } else {
                  setEmailValid(null);
                }
              }}
              className="w-full bg-[#141414] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
              style={{
                border: emailValid === true
                  ? '1px solid #22C55E'
                  : emailValid === false
                    ? '1px solid #EF4444'
                    : '1px solid #2a2a2a',
                paddingRight: emailValid === true ? '40px' : undefined
              }}
              placeholder={t('forms.emailPlaceholder')}
            />
            {emailValid === true && (
              <div style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#22C55E',
                fontSize: '14px',
                fontWeight: 900,
                pointerEvents: 'none'
              }}>
                ✓
              </div>
            )}
          </div>
          {emailError && (
            <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>
              {emailError}
            </div>
          )}
          {submitAttempted && !email && <span className="text-brand-red text-xs mt-1 block">{t('errors.fieldRequired')}</span>}
        </div>

        <div>
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.password').toUpperCase()} <span className="text-brand-red">*</span></label>
          <PasswordInput
            required
            value={password}
            onChange={setPassword}
            placeholder={t('forms.passwordPlaceholder')}
            className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow"
          />
          {password.length > 0 && (() => {
            const strength = getPasswordStrength(password);
            return (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        height: '3px',
                        borderRadius: '99px',
                        background: strength.score >= level ? strength.color : '#1e1e1e',
                        transition: 'background 0.3s'
                      }}
                    />
                  ))}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: strength.color,
                  fontWeight: 800,
                  fontFamily: 'Nunito, sans-serif',
                  transition: 'color 0.3s'
                }}>
                  {strength.label}
                  {strength.score < 3 && password.length > 0 && (
                    <span style={{ color: '#444', fontWeight: 700, marginLeft: '6px' }}>
                      {!/[A-Z]/.test(password) && `${t('forms.passwordHintUppercase')} `}
                      {!/[0-9]/.test(password) && `${t('forms.passwordHintNumber')} `}
                      {password.length < 8 && t('forms.passwordHintMoreChars').replace('{count}', String(8 - password.length))}
                    </span>
                  )}
                </div>
              </div>
            );
          })()}
          {submitAttempted && !password && <span className="text-brand-red text-xs mt-1 block">{t('errors.fieldRequired')}</span>}
          {password.length > 0 && password.length < 8 && (
            <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>
              {t('errors.passwordTooShort')} ({password.length}/8)
            </div>
          )}
          {password.length >= 8 && (
            <div style={{ fontSize: '11px', color: '#22C55E', marginTop: '4px' }}>
              {t('misc.passwordLooksGood')}
            </div>
          )}
        </div>

        <div>
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.confirmPassword').toUpperCase()} <span className="text-brand-red">*</span></label>
          <div style={{ position: 'relative' }}>
            <PasswordInput
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                if (val.length > 0) {
                  setPasswordMatch(val === password);
                } else {
                  setPasswordMatch(null);
                }
              }}
              placeholder={t('forms.confirmPasswordPlaceholder')}
              style={{
                background: '#141414',
                border: passwordMatch === null
                  ? '1px solid #2a2a2a'
                  : passwordMatch
                    ? '1px solid #22C55E'
                    : '1px solid #EF4444',
                borderRadius: '10px',
                padding: '12px 44px 12px 16px',
                color: '#fff',
                fontSize: '16px',
                fontFamily: 'Nunito, sans-serif',
                outline: 'none',
                width: '100%',
                transition: 'border-color 0.2s'
              }}
            />
            {passwordMatch === true && (
              <div style={{
                position: 'absolute',
                right: '44px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#22C55E',
                fontSize: '14px',
                fontWeight: 900,
                pointerEvents: 'none'
              }}>
                ✓
              </div>
            )}
          </div>
          {passwordMatch === false && (
            <div style={{
              fontSize: '11px',
              color: '#EF4444',
              marginTop: '4px',
              fontFamily: 'Nunito, sans-serif'
            }}>
              {t('errors.passwordsNoMatch')}
            </div>
          )}
        </div>

        {errorStatus && (
          <div className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-xl px-4 py-3 text-xs font-bold leading-tight">
            {errorStatus}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !!emailError || email.length === 0 || password.length < 8 || firstName.length === 0}
          className="bg-brand-yellow text-[#0a0a0a] w-full mt-4 px-7 py-3.5 rounded-full font-black text-[15px] transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? t('forms.creatingAccount') : t('buttons.createAccount')}
        </button>

        <div style={{
          fontSize: '11px',
          color: '#444',
          textAlign: 'center',
          lineHeight: 1.6,
          fontFamily: 'Nunito, sans-serif',
          marginTop: '12px'
        }}>
          {t('misc.byCreatingAccount')}{' '}
          <a
            href="/terms"
            target="_blank"
            style={{
              color: '#666',
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            }}
          >
            {t('misc.termsOfService')}
          </a>
          {' '}{t('misc.and')}{' '}
          <a
            href="/privacy"
            target="_blank"
            style={{
              color: '#666',
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            }}
          >
            {t('misc.privacyPolicy')}
          </a>
          .
        </div>

        <div className="text-center mt-6 text-sm text-brand-text-secondary">
          {t('headings.alreadyHaveAccount')} <Link href="/login" className="text-white font-extrabold hover:text-brand-yellow transition-colors">{t('nav.login')}</Link>
        </div>
      </form>
    </div>
  );
}
