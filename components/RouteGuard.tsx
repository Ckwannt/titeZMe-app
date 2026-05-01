'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
          router.replace('/login');
        }
      } else if (appUser) {
        if (!appUser.isOnboarded && !pathname.startsWith('/onboarding') && pathname !== '/login' && pathname !== '/signup') {
          if (appUser.role === 'client') {
            router.replace('/onboarding/client');
          } else if (appUser.role === 'barber') {
            router.replace('/onboarding/barber');
          }
        }
      }
    }
  }, [user, appUser, loading, pathname, router]);

  if (loading) {
    return <div className="p-8 text-center text-brand-text-secondary animate-pulse">Loading...</div>;
  }

  return <>{children}</>;
}
