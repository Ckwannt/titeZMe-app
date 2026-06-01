'use client';

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { barberUpdateSchema } from "@/lib/schemas";
import { useLang } from "@/lib/i18n/LangContext";

function getCurrencySymbol(currency?: string): string {
  const s: Record<string, string> = {
    'EUR': '€', 'GBP': '£', 'USD': '$', 'MAD': 'MAD ', 'DZD': 'DA ',
    'TND': 'DT ', 'SAR': 'SAR ', 'AED': 'AED ', 'SEK': 'kr ', 'NOK': 'kr ', 'DKK': 'kr ', 'CHF': 'CHF ',
  };
  return s[(currency || 'EUR').toUpperCase()] ?? ((currency || 'EUR') + ' ');
}

export default function BarberDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, appUser } = useAuth();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { t } = useLang();
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'barberProfiles', user!.uid));
      return snap.exists() ? snap.data() : null;
    },
    enabled: !!user
  });

  const { data: schedule } = useQuery({
    queryKey: ['schedule', user?.uid],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'schedules', `${user!.uid}_shard_0`));
      return snap.exists() ? snap.data() : null;
    },
    enabled: !!user
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', user?.uid],
    queryFn: async () => {
      const { collection, query, where, getDocs } = await import("firebase/firestore");
      const q = query(collection(db, 'services'), where("providerId", "==", user!.uid));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
    enabled: !!user
  });

  const hasAvailability = !!(schedule?.availableSlots &&
    Object.keys(schedule.availableSlots as Record<string, any>).some(date => {
      const d = new Date(date); const t = new Date(); t.setHours(0, 0, 0, 0);
      return d >= t && ((schedule.availableSlots as any)[date]?.length || 0) > 0;
    }));

  const profileItems = [
    { label: t('barberLayout.profileItemPhoto'), path: '/dashboard/barber/settings', done: !!(profile?.profilePhotoUrl || appUser?.photoUrl), pct: 15 },
    { label: t('barberLayout.profileItemBio'), path: '/dashboard/barber/settings', done: (profile?.bio?.length || 0) > 20, pct: 10 },
    { label: t('barberLayout.profileItemServices'), path: '/dashboard/barber/services', done: (services as any[]).length > 0, pct: 15 },
    { label: t('barberLayout.profileItemTitzCut'), path: '/dashboard/barber/services', done: !!(profile?.titeZMeCut?.price), pct: 10 },
    { label: t('barberLayout.profileItemAvailability'), path: '/dashboard/barber/availability', done: hasAvailability, pct: 15 },
    { label: t('barberLayout.profileItemLanguages'), path: '/dashboard/barber/settings', done: (profile?.languages?.length || 0) > 0, pct: 10 },
    { label: t('barberLayout.profileItemSpecialties'), path: '/dashboard/barber/settings', done: (profile?.specialties?.length || 0) > 0, pct: 10 },
    { label: t('barberLayout.profileItemVibe'), path: '/dashboard/barber/settings', done: (profile?.vibes?.length || 0) > 0, pct: 10 },
    { label: t('barberLayout.profileItemBarberCode'), path: '/dashboard/barber/settings', done: !!(profile?.barberCode), pct: 5 },
  ];
  const profilePct = profileItems.filter(item => item.done).reduce((s, item) => s + item.pct, 0);
  const missingItems = profileItems.filter(item => !item.done).slice(0, 3);

  const handleCopyCode = () => {
    if (profile?.barberCode) {
      navigator.clipboard.writeText(profile.barberCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const saveLiveStatus = async (isLive: boolean) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({ isLive }));
      queryClient.invalidateQueries({ queryKey: ['profile', user?.uid] });
      setToastMessage(isLive ? t('barberLayout.nowAcceptingBookings') : t('barberLayout.bookingsPaused'));
      setTimeout(() => setToastMessage(''), 3000);
    } catch(e) { console.error(e); }
  };

  const navItems = [
    { href: '/dashboard/barber', icon: '⚡', label: t('barberLayout.navDashboard'), exact: true },
    { href: '/dashboard/barber/bookings', icon: '📅', label: t('barberLayout.navBookings'), exact: false },
    { href: '/dashboard/barber/availability', icon: '⏰', label: t('barberLayout.navAvailability'), exact: false },
    { href: '/dashboard/barber/services', icon: '✂️', label: t('barberLayout.navServices'), exact: false },
    { href: '/dashboard/barber/portfolio', icon: '📸', label: t('barberLayout.navPortfolio'), exact: false },
    { href: '/dashboard/barber/invites', icon: '📨', label: t('barberLayout.navInvites'), exact: false },
    { href: '/dashboard/barber/settings', icon: '⚙️', label: t('barberLayout.navSettings'), exact: false },
  ];

  const isActive = (item: { href: string; exact: boolean }) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex min-h-[calc(100vh-53px)] flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-[220px] md:border-r border-brand-border p-6 shrink-0 flex flex-col">
        <div className="flex items-center gap-3 mb-6 px-2">
          {profile?.profilePhotoUrl || appUser?.photoUrl ? (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <Image src={profile?.profilePhotoUrl || appUser?.photoUrl as string} alt="Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-yellow flex items-center justify-center font-black text-base text-[#0a0a0a]">
              {appUser?.firstName?.[0] || "B"}
            </div>
          )}
          <div>
            <div className="font-extrabold text-sm">{appUser?.firstName} {appUser?.lastName?.charAt(0)}.</div>
            {profile?.isLive ? (
              <div className="text-[11px] text-brand-green font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" /> {t('barberLayout.live')}</div>
            ) : (
              <div className="text-[11px] text-brand-text-secondary font-bold flex items-center gap-1">{t('barberLayout.hidden')}</div>
            )}
          </div>
        </div>

        {profile?.barberCode && (
          <div className="mb-7 px-2">
            <div className="text-[10px] font-extrabold text-brand-text-secondary uppercase tracking-wider mb-1">{t('forms.yourBarberCode')}</div>
            <div className="flex items-center justify-between bg-[#141414] border border-[#2a2a2a] rounded-lg p-2">
              <span className="font-mono text-xs font-black text-brand-yellow">{profile.barberCode}</span>
              <button
                onClick={handleCopyCode}
                className="text-xs text-[#888] hover:text-white transition-colors p-1"
                title="Copy to clipboard"
              >
                {copiedCode ? '✓' : '📋'}
              </button>
            </div>
            <div className="text-[9px] text-[#555] font-bold mt-1.5 leading-tight">{t('barberLayout.shareWithShops')}</div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/barber/${user?.uid}`);
                setToastMessage('Profile link copied! 🔗 Share it with your clients.');
                setTimeout(() => setToastMessage(''), 3000);
              }}
              className="mt-2 w-full border border-[#2a2a2a] text-[#888] font-bold text-[11px] px-3 py-[7px] rounded-lg hover:border-[#444] hover:text-white transition-colors"
            >
              {t('barberLayout.shareMyProfile')}
            </button>
          </div>
        )}

        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {navItems.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 ${
                isActive(l) ? "bg-[#1a1a1a] text-brand-yellow" : "text-[#888] hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
        </div>

        <div className="md:mt-6 border-t border-brand-border pt-6 hidden md:block">
          <div className="text-[10px] font-extrabold text-[#555] uppercase tracking-wider mb-3 px-2">{t('barberLayout.myShop')}</div>
          {appUser?.ownsShop ? (
            <Link
              href="/dashboard/shop"
              className="flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors text-brand-yellow bg-brand-yellow/10 hover:bg-brand-yellow/20"
            >
              <span>🏪</span> {t('barberLayout.manageMyShop')}
            </Link>
          ) : (
            <Link
              href="/dashboard/barber/create-shop"
              className="flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors text-white bg-[#1a1a1a] hover:bg-[#2a2a2a]"
            >
              <span>🏪</span> {t('barberLayout.createShopProfile')}
            </Link>
          )}
        </div>

        {/* Profile completion — desktop only */}
        <div className="hidden md:block mt-4 px-2">
          <div className="text-[10px] font-extrabold text-[#555] uppercase tracking-wider mb-2">{t('barberLayout.profileCompletion')}</div>
          <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden mb-1">
            <div className={`h-full rounded-full transition-all ${profilePct === 100 ? 'bg-[#22C55E]' : 'bg-brand-yellow'}`} style={{ width: `${profilePct}%` }} />
          </div>
          <div className={`text-[11px] font-extrabold mb-2 ${profilePct === 100 ? 'text-[#22C55E]' : 'text-brand-yellow'}`}>
            {profilePct === 100 ? t('barberLayout.profileCompleteCheck') : `${profilePct}${t('barberLayout.percentComplete')}`}
          </div>
          {missingItems.length > 0 && (
            <div className="flex flex-col gap-1">
              {missingItems.map((item, i) => (
                <Link key={i} href={item.path}
                  className="text-[10px] text-[#555] hover:text-white text-left transition-colors truncate">
                  {item.label} →
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-brand-border">
          <div className="flex items-center justify-between px-2 mb-4">
            <span className="text-xs font-bold text-brand-text-secondary">{t('barberLayout.acceptBookings')}</span>
            <label className="relative w-11 h-6 shrink-0 group cursor-pointer">
              <input type="checkbox" checked={profile?.isLive || false} onChange={e => saveLiveStatus(e.target.checked)} className="peer sr-only" />
              <span className="absolute inset-0 bg-[#2a2a2a] rounded-full transition-colors peer-checked:bg-brand-yellow" />
              <span className="absolute w-[18px] h-[18px] left-[3px] top-[3px] bg-white rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-[#0a0a0a]" />
            </label>
          </div>

          <Link
            href="/dashboard/client"
            className="block px-2 py-2 text-[11px] font-bold text-[#555] hover:text-[#888] transition-colors"
          >
            {t('barberLayout.myAppointments')}
            <div className="text-[10px] text-[#444] font-normal mt-0.5">{t('barberLayout.bookedAsClient')}</div>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto max-h-[calc(100vh-53px)]">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#1e1e1e] h-[60px] flex md:hidden z-40">
        {[
          { href: '/dashboard/barber', icon: '⚡', label: t('barberLayout.navDashboard'), exact: true },
          { href: '/dashboard/barber/bookings', icon: '📅', label: t('barberLayout.navBookings'), exact: false },
          { href: '/dashboard/barber/availability', icon: '⏰', label: t('barberLayout.navAvailShort'), exact: false },
          { href: '/dashboard/barber/services', icon: '✂️', label: t('barberLayout.navServices'), exact: false },
          { href: '/dashboard/barber/settings', icon: '⚙️', label: t('barberLayout.navMore'), exact: false },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors ${
              isActive(item) ? 'text-brand-yellow' : 'text-[#555]'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#1a0808] border border-brand-yellow/30 text-brand-yellow px-6 py-3 rounded-full font-bold text-sm shadow-xl animate-fadeUp z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
