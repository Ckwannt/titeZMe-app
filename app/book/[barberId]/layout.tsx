import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReactNode } from 'react';

export default function BookLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
