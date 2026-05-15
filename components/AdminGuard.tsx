'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setChecking(false);
      router.replace('/admin/login');
      return;
    }

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const adminFlag = snap.exists() ? snap.data()?.isAdmin === true : false;
        setIsAdmin(adminFlag);
        if (!adminFlag) {
          router.replace('/');
        }
      } catch {
        setIsAdmin(false);
        router.replace('/');
      } finally {
        setChecking(false);
      }
    })();
  }, [loading, user, router]);

  if (loading || checking) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '3px solid #222',
            borderTop: '3px solid #F5C518',
            animation: 'rg-spin 0.8s linear infinite',
          }}
        />
        <style>{`
          @keyframes rg-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) return null;
  if (isAdmin === false) return null;

  return <>{children}</>;
}
