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
    if (appUser?.role === 'professional') {
      router.replace('/dashboard/barber');
      return;
    }
    if (appUser?.role !== 'client') {
      router.replace('/login');
    }
  }, [user, appUser, loading, router]);

  const navItems: { href: string; icon: string; label: string; soon?: boolean }[] = [
    { href: '/dashboard/client/bookings', icon: '', label: t('clientDash.myBookings') },
    { href: '/dashboard/client/messages', icon: '', label: t('clientDash.messagesTitle'), soon: true },
    { href: '/dashboard/client/my-look', icon: '', label: t('clientDash.myLookTitle'), soon: true },
    { href: '/dashboard/client/favorites', icon: '', label: t('clientDash.favorites') },
    { href: '/dashboard/client/titeZMe-artist', icon: '', label: t('clientDash.titeZMeArtistNavLabel'), soon: true },
    { href: '/dashboard/client/gift-a-cut', icon: '', label: t('clientDash.giftACutTitle'), soon: true },
    { href: '/dashboard/client/reviews', icon: '', label: t('clientDash.reviews') },
    { href: '/dashboard/client/badges', icon: '', label: t('clientDash.badgesTitle'), soon: true },
    { href: '/contact', icon: '', label: t('clientDash.support') },
    { href: '/dashboard/client/settings', icon: '', label: t('clientDash.settings') },
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
              className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 whitespace-nowrap ${
                isActive(l.href) ? 'bg-[#1a1a1a] text-brand-yellow' : 'text-[#888] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              {l.label}
              {l.soon && (
                <span className="text-[9px] text-[#555] ml-1 uppercase tracking-wider">
                  {t('nav.soon')}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-auto hidden md:block">
          <DeleteAccountButton role="client" />
        </div>
      </div>

      <main className="flex-1 overflow-y-auto max-h-[calc(100vh-53px)] pb-[60px] md:pb-0">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#1e1e1e] h-[60px] flex md:hidden z-40">
        {[
          { href: '/dashboard/client/bookings', label: t('clientDash.myBookings') },
          { href: '/dashboard/client/favorites', label: t('clientDash.favorites') },
          { href: '/dashboard/client/reviews', label: t('clientDash.reviews') },
          { href: '/dashboard/client/settings', label: t('clientDash.settings') },
          { href: '/contact', label: t('barberLayout.navMore') },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors ${
              isActive(item.href) ? 'text-brand-yellow' : 'text-[#555]'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
