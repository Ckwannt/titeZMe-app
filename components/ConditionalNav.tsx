'use client';

import { usePathname } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { RouteGuard } from '@/components/RouteGuard';

/**
 * Renders TopNav + RouteGuard for all non-admin pages.
 * Admin pages have their own layout (AdminGuard + sidebar).
 */
export function ConditionalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    // Admin pages: skip TopNav and RouteGuard entirely.
    // The admin layout handles its own auth guard (AdminGuard).
    return <>{children}</>;
  }

  return (
    <>
      <TopNav />
      <main className="flex-1 overflow-x-hidden min-h-screen">
        <RouteGuard>
          {children}
        </RouteGuard>
      </main>
    </>
  );
}
