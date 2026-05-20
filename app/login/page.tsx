'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { PasswordInput } from '@/components/PasswordInput';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');
  const { user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) return null;
  if (user) {
    router.replace('/');
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
          createdAt: Date.now()
        });
      }

      const userData = userDoc.exists() ? userDoc.data() : { role: 'client' };

      const safeRedirect = redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('/admin');
      if (safeRedirect) {
        router.replace(redirectTo);
        return;
      }

      if (userData.role === 'admin') {
        router.replace('/admin');
      } else if (userData.role === 'barber') {
        router.replace('/dashboard/barber');
      } else {
        router.replace('/dashboard/client');
      }
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorStatus('Google sign in failed. Please try again.');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorStatus('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Read role from firestore to redirect
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const udata = docSnap.data();
        // Admin accounts must use /admin/login — block them here
        if (udata.role === 'admin' || udata.isAdmin === true) {
          const { signOut } = await import('firebase/auth');
          await signOut(auth);
          setErrorStatus('This is an admin account. Please use /admin/login instead.');
          setIsSubmitting(false);
          return;
        }
        const safeRedirect = redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('/admin');
        if (safeRedirect) {
          router.replace(redirectTo);
          return;
        }

        if (udata.role === 'client') {
          if (udata.isOnboarded) router.push('/dashboard/client');
          else router.push('/onboarding/client');
        }
        else if (udata.role === 'barber') {
          if (udata.isOnboarded) {
            router.push('/dashboard/barber');
          } else {
            router.push('/onboarding/barber');
          }
        }
        else router.push('/');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || 'Failed to login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto p-6 mt-10 md:mt-24">
      <div className="animate-fadeUp mb-8 text-center">
        <h1 className="text-[32px] font-black tracking-tight mb-2">Welcome Back</h1>
        <p className="text-brand-text-secondary text-[15px]">Log in to your titeZMe account.</p>
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
        Continue with Google
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
        <span style={{ fontSize: '11px', color: '#444', fontWeight: 700 }}>or</span>
        <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
      </div>

      <form onSubmit={handleLogin} className="animate-fadeUp flex flex-col gap-4">
        <div>
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">EMAIL</label>
          <input 
            required
            type="email"
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-[15px] outline-none transition-colors focus:border-brand-yellow" 
            placeholder="you@email.com" 
          />
        </div>

        <div>
          <div className="flex justify-between items-end mb-1.5">
            <label className="text-[11px] font-extrabold text-brand-text-secondary block">PASSWORD</label>
            <a
              href="/forgot-password"
              style={{
                color: '#555',
                fontSize: '11px',
                textDecoration: 'none',
                fontWeight: 700
              }}
            >
              Forgot password?
            </a>
          </div>
          <PasswordInput
            required
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-[15px] outline-none transition-colors focus:border-brand-yellow"
          />
        </div>

        {errorStatus && (
          <div className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-xl px-4 py-3 text-xs font-bold leading-tight mt-1">
            {errorStatus}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-brand-yellow text-[#0a0a0a] w-full mt-3 px-7 py-4 rounded-full font-black text-[15px] transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : 'Log In →'}
        </button>

        <div className="text-center mt-6 text-sm text-brand-text-secondary">
          New here? <Link href="/signup" className="text-white font-extrabold hover:text-brand-yellow transition-colors">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
