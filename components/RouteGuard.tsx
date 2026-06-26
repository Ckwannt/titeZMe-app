'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { isProfileComplete } from '@/lib/profile-complete';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/barbers',
  '/shops',
  '/about',
  '/for-barbers',
  '/for-shops',
  '/cities',
  '/how-it-works',
  '/contact',
  '/terms',
  '/privacy',
  '/cookies',
  '/admin/login',
];

const PUBLIC_PREFIXES = [
  '/barber/',
  '/shop/',
];

function isPublicRoute(path: string): boolean {
  if (PUBLIC_ROUTES.includes(path)) return true;
  if (PUBLIC_PREFIXES.some(prefix => path.startsWith(prefix))) return true;
  return false;
}

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        border: '3px solid #1e1e1e',
        borderTop: '3px solid #F5C518',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    const isPublic = isPublicRoute(pathname);

    if (isPublic) {
      setAuthorized(true);
      setChecking(false);
      return;
    }

    if (!user) {
      setAuthorized(false);
      setChecking(false);
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Onboarding redirect — preserve existing behaviour
    if (appUser && !appUser.isOnboarded &&
        appUser.role !== 'admin' &&
        !pathname.startsWith('/onboarding') &&
        pathname !== '/' &&
        pathname !== '/login' &&
        pathname !== '/signup') {
      if (appUser.role === 'client') {
        router.replace('/onboarding/client');
      } else if (appUser.role === 'barber') {
        router.replace('/onboarding/barber');
      }
      setAuthorized(false);
      setChecking(false);
      return;
    }

    // Profile-completion enforcement — catches old users AND Google sign-in
    // users who slipped through with isOnboarded: true but are missing
    // required fields (phone, city, country) or have default barber data.
    if (
      appUser?.isOnboarded === true &&
      appUser.role !== 'admin' &&
      !isProfileComplete(appUser) &&
      !pathname.startsWith('/onboarding')
    ) {
      const redirectPath = appUser.role === 'barber'
        ? '/onboarding/barber'
        : '/onboarding/client';
      router.replace(redirectPath);
      setAuthorized(false);
      setChecking(false);
      return;
    }

    setAuthorized(true);
    setChecking(false);
  }, [user, appUser, loading, pathname, router]);

  if (loading || checking) return <LoadingScreen />;
  if (!authorized) return <LoadingScreen />;

  return <>{children}</>;
}
