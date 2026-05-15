'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, 'users', credential.user.uid));
      const isAdmin = snap.exists() ? snap.data()?.isAdmin === true : false;

      if (!isAdmin) {
        await signOut(auth);
        setError('Access denied. This account is not an admin.');
        setLoading(false);
        return;
      }

      router.push('/admin');
    } catch {
      setError('Invalid credentials.');
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 380,
          backgroundColor: '#111',
          border: '1px solid #222',
          borderRadius: 16,
          padding: 32,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#F5C518' }}>
            tite<span style={{ color: '#E8491D' }}>Z</span>Me
          </div>
          <div style={{ marginTop: 8 }}>
            <span
              style={{
                fontSize: 10,
                color: '#555',
                border: '1px solid #333',
                borderRadius: 999,
                padding: '2px 10px',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              ADMIN
            </span>
          </div>
          <p style={{ color: '#555', fontSize: 13, marginTop: 16, marginBottom: 0 }}>
            Admin access only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: 10,
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: 10,
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#1a0808',
                border: '1px solid #3a1010',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#f87171',
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 0',
              backgroundColor: loading ? '#c9a614' : '#F5C518',
              color: '#000',
              fontWeight: 900,
              fontSize: 15,
              borderRadius: 12,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
