'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { userSchema } from '@/lib/schemas';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

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

  if (loading) return null;
  if (user && !submitAttempted) {
    router.replace('/'); // if already logged in, go home
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!firstName || !lastName || !email || !password) {
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
          <input 
            required
            type="password"
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
            placeholder="••••••••" 
          />
          {submitAttempted && !password && <span className="text-brand-red text-xs mt-1 block">This field is required</span>}
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
