'use client';

import { lazy, Suspense } from 'react';
import { usePathname } from 'next/navigation';

// The import executes only when a legacy route renders this lazy component.
const LegacyShell = lazy(() => import('./LegacyShell'));

export default function LaunchBoundary({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/') return <>{children}</>;
  return <Suspense fallback={<div role="status">Loading…</div>}><LegacyShell>{children}</LegacyShell></Suspense>;
}
