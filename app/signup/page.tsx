'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { userSchema } from '@/lib/schemas';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { PasswordInput } from '@/components/PasswordInput';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [role, setRole] = useState<'client' | 'barber'>('client');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  if (loading) return null;
  if (user && !submitAttempted) {
    router.replace('/'); // if already logged in, go home
    return null;
  }

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          profilePhotoUrl: user.photoURL || '',
          role: 'client',
          isOnboarded: true,
          createdAt: Date.now(),
        });
      }

      const userData = userDoc.exists() ? userDoc.data() : { role: 'client' };

      if (userData.role === 'admin') {
        router.replace('/admin');
      } else if (userData.role === 'barber') {
        router.replace('/dashboard/barber');
      } else {
        router.replace('/dashboard/client');
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorStatus('Google sign in failed. Please try again.');
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!firstName || !lastName || !email || !password) {
      return;
    }

    if (password !== confirmPassword) {
      setErrorStatus("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setErrorStatus('Password must be at least 8 characters');
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

      // 3. Redirect to login or straight to dashboard
      // Immediately redirect without waiting for auth observer
      if (role === 'client') router.push('/onboarding/client');
      else if (role === 'barber') router.push('/onboarding/barber');

    } catch (err: any) {
      console.error("Signup validation or save error:", err);
      setErrorStatus(err.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[440px] mx-auto p-6 mt-10 md:mt-20">
      <div className="animate-fadeUp mb-8 text-center">
        <div className="text-3xl mb-3">🔥</div>
        <h1 className="text-[28px] font-black leading-tight mb-2">Join titeZMe</h1>
        <p className="text-brand-text-secondary text-[15px]">Create an account to get started.</p>
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
          transition: 'all 0.15s',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
        <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
        <span style={{ fontSize: '11px', color: '#444', fontWeight: 700 }}>or</span>
        <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
      </div>

      <form noValidate onSubmit={handleSignup} className="animate-fadeUp !delay-[50ms] flex flex-col gap-4">
        <div>
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-2">I AM A...</label>
          <div className="flex gap-2">
            {[
              { id: 'client', label: 'Client', icon: '👤' },
              { id: 'barber', label: 'Barber', icon: '✂️' },
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

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">FIRST NAME <span className="text-brand-red">*</span></label>
            <input 
              required
              value={firstName} onChange={e => setFirstName(e.target.value)}
              className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
              placeholder="Your name" 
            />
            {submitAttempted && !firstName && <span className="text-brand-red text-xs mt-1 block">This field is required</span>}
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">LAST NAME <span className="text-brand-red">*</span></label>
            <input 
              required
              value={lastName} onChange={e => setLastName(e.target.value)}
              className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
              placeholder="Your last name" 
            />
            {submitAttempted && !lastName && <span className="text-brand-red text-xs mt-1 block">This field is required</span>}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">EMAIL <span className="text-brand-red">*</span></label>
          <input 
            required
            type="email"
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
            placeholder="you@email.com" 
          />
          {submitAttempted && !email && <span className="text-brand-red text-xs mt-1 block">This field is required</span>}
        </div>

        <div>
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">PASSWORD <span className="text-brand-red">*</span></label>
          <PasswordInput
            required
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow"
          />
          {submitAttempted && !password && <span className="text-brand-red text-xs mt-1 block">This field is required</span>}
        </div>

        <div>
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">CONFIRM PASSWORD <span className="text-brand-red">*</span></label>
          <div style={{ position: 'relative' }}>
            <PasswordInput
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                setPasswordMatch(val === password && val.length > 0);
              }}
              placeholder="Confirm password"
              className={`w-full bg-[#141414] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors ${
                passwordMatch === null
                  ? 'border-[1.5px] border-[#2a2a2a]'
                  : passwordMatch
                  ? 'border-[1.5px] border-green-500'
                  : 'border-[1.5px] border-red-500'
              }`}
            />
            {passwordMatch === true && (
              <div style={{
                position: 'absolute',
                right: '44px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#22C55E',
                fontSize: '14px',
              }}>✓</div>
            )}
          </div>
          {passwordMatch === false && (
            <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>
              Passwords don&apos;t match
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
          disabled={isSubmitting}
          className="bg-brand-yellow text-[#0a0a0a] w-full mt-4 px-7 py-3.5 rounded-full font-black text-[15px] transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="text-center mt-6 text-sm text-brand-text-secondary">
          Already have an account? <Link href="/login" className="text-white font-extrabold hover:text-brand-yellow transition-colors">Log In</Link>
        </div>
      </form>
    </div>
  );
}
