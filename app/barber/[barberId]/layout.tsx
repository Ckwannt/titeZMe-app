import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ReactNode } from 'react';

export default function BarberProfileLayout({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}
