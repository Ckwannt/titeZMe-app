'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, appUser, authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
          router.replace('/login');
        }
      } else if (appUser) {
        if ((!appUser.isOnboarded && !pathname.startsWith('/onboarding') && pathname !== '/' && pathname !== '/login' && pathname !== '/signup')) {
          if (appUser.role === 'client') {
            router.replace('/onboarding/client');
          } else if (appUser.role === 'barber') {
            router.replace('/onboarding/barber');
          }
        }
      }
    }
  }, [user, appUser, authLoading, pathname, router]);

  // Block ALL rendering until Firebase Auth confirms identity.
  // This eliminates the flash of protected/wrong content.
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #1e1e1e',
          borderTop: '3px solid #F5C518',
          borderRadius: '50%',
          animation: 'rg-spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes rg-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
