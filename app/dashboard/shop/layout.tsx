'use client';

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ShopDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, appUser } = useAuth();
  const pathname = usePathname();
  const [toastMessage, setToastMessage] = useState('');

  const { data: shop } = useQuery({
    queryKey: ['shop', user?.uid],
    queryFn: async () => { const s = await getDoc(doc(db, 'barbershops', user!.uid)); return s.exists() ? s.data() : null; },
    enabled: !!user,
  });

  const { data: schedule } = useQuery({
    queryKey: ['shopSchedule', user?.uid],
    queryFn: async () => { const s = await getDoc(doc(db, 'schedules', `${user!.uid}_shard_0`)); return s.exists() ? s.data() : null; },
    enabled: !!user,
  });

  // Calculate open/closed status
  let shopStatus = { text: 'Closed today', color: 'text-brand-red' };
  if (schedule) {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if ((schedule as any).blockedDates?.includes(todayStr)) {
      shopStatus = { text: 'On leave', color: 'text-brand-red' };
    } else {
      const h = (schedule as any).weeklyHours?.[dayName];
      if (h?.isOpen) {
        const nowMins = today.getHours() * 60 + today.getMinutes();
        const startMins = parseInt(h.start?.split(':')[0] || '0') * 60 + parseInt(h.start?.split(':')[1] || '0');
        const endMins = parseInt(h.end?.split(':')[0] || '0') * 60 + parseInt(h.end?.split(':')[1] || '0');
        if (nowMins >= startMins && nowMins < endMins) shopStatus = { text: 'Open now', color: 'text-brand-green' };
        else if (nowMins < startMins) shopStatus = { text: `Opens at ${h.start}`, color: 'text-brand-red' };
      }
    }
  }

  const navItems = [
    { href: '/dashboard/shop', icon: '🏪', label: 'Overview', exact: true },
    { href: '/dashboard/shop/team', icon: '👥', label: 'Team', exact: false },
    { href: '/dashboard/shop/bookings', icon: '📅', label: 'All Bookings', exact: false },
    { href: '/dashboard/shop/availability', icon: '⏰', label: 'Availability', exact: false },
    { href: '/dashboard/shop/earnings', icon: '💰', label: 'Earnings', exact: false },
    { href: '/dashboard/shop/services', icon: '✂️', label: 'Services', exact: false },
    { href: '/dashboard/shop/photos', icon: '📸', label: 'Shop Photos', exact: false },
    { href: '/dashboard/shop/reviews', icon: '⭐', label: 'Reviews', exact: false },
    { href: '/dashboard/shop/settings', icon: '⚙️', label: 'Settings', exact: false },
  ];

  const isActive = (item: { href: string; exact: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="flex min-h-[calc(100vh-53px)] flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-[220px] md:border-r border-brand-border p-6 shrink-0 flex flex-col">
        <div className="flex items-center gap-3 mb-6 px-2">
          {(shop as any)?.coverPhotoUrl ? (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <Image src={(shop as any).coverPhotoUrl} alt="Shop" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-yellow flex items-center justify-center font-black text-base text-[#0a0a0a]">
              {(shop as any)?.name?.[0] || 'S'}
            </div>
          )}
          <div>
            <div className="font-extrabold text-sm truncate max-w-[120px]">{(shop as any)?.name || 'My Shop'}</div>
            <div className="text-[11px] text-brand-text-secondary mt-0.5 truncate max-w-[120px]">
              📍 {(shop as any)?.address?.city || 'Location not set'}
            </div>
            <div className={`text-[11px] mt-1 font-bold ${shopStatus.color}`}>{shopStatus.text}</div>
          </div>
        </div>

        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {navItems.map(l => (
            <Link key={l.href} href={l.href}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 ${
                isActive(l) ? 'bg-[#1a1a1a] text-brand-yellow' : 'text-[#888] hover:bg-[#1a1a1a] hover:text-white'
              }`}>
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
        </div>

        {appUser?.role === 'barber' && (
          <div className="hidden md:block mt-6 pt-6 border-t border-brand-border">
            <Link href="/dashboard/barber" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold text-[#888] hover:bg-[#1a1a1a] hover:text-white transition-colors">
              <span>✂️</span> My barber dashboard
            </Link>
          </div>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto max-h-[calc(100vh-53px)] pb-[60px] md:pb-0">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#1e1e1e] h-[60px] flex md:hidden z-40">
        {[
          { href: '/dashboard/shop', icon: '🏪', label: 'Overview', exact: true },
          { href: '/dashboard/shop/team', icon: '👥', label: 'Team', exact: false },
          { href: '/dashboard/shop/bookings', icon: '📅', label: 'Bookings', exact: false },
          { href: '/dashboard/shop/earnings', icon: '💰', label: 'Earnings', exact: false },
          { href: '/dashboard/shop/settings', icon: '⚙️', label: 'More', exact: false },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors ${
              isActive(item) ? 'text-brand-yellow' : 'text-[#555]'
            }`}>
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#1a0808] border border-brand-yellow/30 text-brand-yellow px-6 py-3 rounded-full font-bold text-sm shadow-xl z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
