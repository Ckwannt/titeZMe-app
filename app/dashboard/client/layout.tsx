'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import { useLang } from '@/lib/i18n/LangContext';

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLang();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (appUser?.role === 'barber') {
      router.replace('/dashboard/barber');
      return;
    }
    if (appUser?.role !== 'client') {
      router.replace('/login');
    }
  }, [user, appUser, loading, router]);

  const navItems = [
    { href: '/dashboard/client/bookings', icon: '📅', label: t('clientDash.myBookings') },
    { href: '/dashboard/client/favorites', icon: '♡', label: t('clientDash.favorites') },
    { href: '/dashboard/client/settings', icon: '⚙️', label: t('clientDash.settings') },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className="flex min-h-[calc(100vh-53px)] flex-col md:flex-row">
      <div className="w-full md:w-[220px] md:border-r border-brand-border p-6 shrink-0 flex flex-col">
        <div className="flex items-center gap-3 mb-7 px-2">
          {appUser?.photoUrl ? (
            <Image
              src={appUser.photoUrl}
              alt="Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-xl object-cover"
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#111] flex items-center justify-center font-black text-base text-white">
              {appUser?.firstName?.[0] || "C"}
            </div>
          )}
          <div>
            <div className="font-extrabold text-sm">{appUser?.firstName} {appUser?.lastName?.charAt(0)}.</div>
            <div className="text-[11px] text-brand-text-secondary font-bold">{t('clientDash.clientRole')}</div>
          </div>
        </div>

        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {navItems.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 ${
                isActive(l.href) ? 'bg-[#1a1a1a] text-brand-yellow' : 'text-[#888] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto hidden md:block">
          <DeleteAccountButton role="client" />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto max-h-[calc(100vh-53px)]">
        {children}
      </main>
    </div>
  );
}
