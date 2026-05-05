'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { NotificationBell } from './NotificationBell';

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, appUser, logout } = useAuth();
  
  const screens = [
    { id: "/", label: "🏠 Home" },
    { id: "/barber/carlos", label: "💈 Profile" },
    { id: "/book/carlos", label: "✅ Booking" },
  ];

  if (appUser?.role === 'client') {
    screens.push({ id: "/dashboard/client", label: "📅 Client Dash" });
  } else if (appUser?.role === 'barber') {
    if (!appUser?.isOnboarded) screens.push({ id: "/onboarding/barber", label: "🚀 Onboarding" });
    screens.push({ id: "/dashboard/barber", label: "⚡ Barber Dash" });
  } else if (appUser?.role === 'shop_owner') {
    screens.push({ id: "/dashboard/shop", label: "🏪 Shop Dash" });
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-brand-border px-6 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Link href="/" className="font-black text-brand-yellow mr-4 whitespace-nowrap text-lg tracking-tight">
          tite<span className="text-brand-orange">Z</span>Me
        </Link>
        {screens.map(s => {
          const isActive = pathname === s.id;
          return (
            <Link
              key={s.id}
              href={s.id}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap border ${
                isActive 
                  ? "bg-brand-yellow border-brand-yellow text-[#0a0a0a]" 
                  : "bg-[#1a1a1a] border-[#2a2a2a] text-brand-text-secondary hover:bg-[#222] hover:text-white"
              }`}
            >
              {s.label}
            </Link>
          )
        })}
      </div>
      
      <div className="flex items-center gap-3 shrink-0 ml-4">
        {user ? (
          <>
            <NotificationBell />
            <button 
              onClick={handleLogout}
              className="text-[11px] font-extrabold text-[#777] hover:text-brand-red transition-colors"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-[11px] font-extrabold text-[#777] hover:text-white transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="text-[11px] font-extrabold bg-white text-black px-3 py-1.5 rounded-full transition-colors hover:bg-brand-yellow">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
