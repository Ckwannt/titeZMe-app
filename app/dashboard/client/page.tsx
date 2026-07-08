'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientDashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/client/bookings');
  }, [router]);

  return null;
}
