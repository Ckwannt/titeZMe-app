import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReactNode } from 'react';

export default function ShopProfileLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
