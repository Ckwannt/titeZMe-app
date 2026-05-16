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
      // ── Step 1: Firebase Auth ─────────────────────────────────────────────
      console.log('[AdminLogin] Step 1: signing in with email/password...');
      const credential = await signInWithEmailAndPassword(auth, email, password);
      console.log('[AdminLogin] Step 2: auth success, uid =', credential.user.uid);

      // ── Step 2: Firestore read ────────────────────────────────────────────
      const uid = credential.user.uid;
      const ref = doc(db, 'users', uid);
      console.log('[AdminLogin] Step 3: reading Firestore doc users/' + uid);

      const snap = await getDoc(ref);
      console.log('[AdminLogin] Step 4: doc exists =', snap.exists(), '| data =', snap.data());

      if (!snap.exists()) {
        console.error('[AdminLogin] ERROR: users/' + uid + ' document does not exist in Firestore');
        await signOut(auth);
        setError(
          'User document not found. Make sure a Firestore document exists at users/' +
          uid + ' with isAdmin:true'
        );
        setLoading(false);
        return;
      }

      const userData = snap.data();
      const isAdminUser = userData?.isAdmin === true || userData?.role === 'admin';
      console.log('[AdminLogin] Step 5: isAdmin =', userData?.isAdmin, '| role =', userData?.role, '| isAdminUser =', isAdminUser);

      if (!isAdminUser) {
        console.warn('[AdminLogin] Step 6: access denied — not an admin account');
        await signOut(auth);
        setError(
          'Access denied. isAdmin: ' + userData?.isAdmin +
          ', role: ' + userData?.role +
          '. This is not an admin account.'
        );
        setLoading(false);
        return;
      }

      // ── Step 3: Navigate to admin ─────────────────────────────────────────
      // FIX: always clear loading before navigating so if AdminGuard briefly
      // bounces back the button is not stuck in "Signing in..." state.
      console.log('[AdminLogin] Step 7: admin confirmed — navigating to /admin');
      setLoading(false);
      router.replace('/admin');

    } catch (err: any) {
      console.error('[AdminLogin] CAUGHT ERROR — code:', err?.code, '| message:', err?.message, '| full:', err);
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
      } else if (code === 'permission-denied') {
        setError(
          'Firestore permission denied. Check that firestore.rules allows ' +
          'reading users/{uid} for authenticated users, then redeploy rules.'
        );
      } else {
        setError('Error [' + (code || 'unknown') + ']: ' + (err?.message || 'An unexpected error occurred.'));
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
