'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { PasswordInput } from '@/components/PasswordInput';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      const snap = await getDoc(doc(db, 'users', credential.user.uid));

      if (!snap.exists()) {
        await signOut(auth);
        setError('Account not found.');
        setLoading(false);
        return;
      }

      const userData = snap.data();
      const isAdminUser = userData?.isAdmin === true || userData?.role === 'admin';

      if (!isAdminUser) {
        await signOut(auth);
        setError('Access denied. This is not an admin account. Use your personal account to log in at /login');
        setLoading(false);
        return;
      }

      router.replace('/admin');
    } catch (err: any) {
      setLoading(false);
      const code = err?.code || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-email'
      ) {
        setError('Invalid email or password.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Try again in a few minutes.');
      } else {
        setError(err?.message || 'An error occurred. Please try again.');
      }
    }
  };

  const inputStyle: React.CSSProperties = {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Nunito, sans-serif',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Nunito, sans-serif',
      padding: '20px',
    }}>
      <div style={{
        background: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: 20,
        padding: 40,
        width: '100%',
        maxWidth: 380,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#F5C518', marginBottom: 8 }}>
            tite<span style={{ color: '#E8491D' }}>Z</span>Me
          </div>
          <div style={{
            fontSize: 10,
            background: '#141414',
            border: '1px solid #2a2a2a',
            color: '#555',
            borderRadius: 999,
            padding: '3px 12px',
            display: 'inline-block',
            fontWeight: 800,
            letterSpacing: '0.1em',
            marginBottom: 8,
          }}>
            ADMIN
          </div>
          <div style={{ fontSize: 12, color: '#555' }}>Admin access only</div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={inputStyle}
            autoComplete="email"
          />

          <PasswordInput
            placeholder="Password"
            value={password}
            onChange={setPassword}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={inputStyle}
            autoComplete="current-password"
          />

          {error && (
            <div style={{
              background: '#1a0808',
              border: '1px solid #EF444433',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 12,
              color: '#EF4444',
              lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              background: loading ? '#2a2000' : '#F5C518',
              color: loading ? '#F5C518' : '#0a0a0a',
              border: 'none',
              borderRadius: 99,
              padding: '13px 0',
              fontSize: 14,
              fontWeight: 900,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Nunito, sans-serif',
              transition: 'all 0.15s',
              width: '100%',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </div>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: '#333' }}>
          Not an admin?{' '}
          <a href="/login" style={{ color: '#555', textDecoration: 'none' }}>
            Regular login →
          </a>
        </div>
      </div>
    </div>
  );
}
