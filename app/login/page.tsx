'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
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
            <a href="#" className="text-[10px] font-extrabold text-[#777] hover:text-white transition-colors">Forgot?</a>
          </div>
          <input 
            required
            type="password"
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-[15px] outline-none transition-colors focus:border-brand-yellow" 
            placeholder="••••••••" 
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
