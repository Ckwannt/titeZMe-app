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

  if (pathname === '/') {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        {/* ROW 1: Main Nav */}
        <div className="bg-[#0A0A0A] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
          <div className="flex-1 flex justify-start">
            <Link href="/" className="font-black text-brand-yellow whitespace-nowrap text-2xl tracking-tight flex items-center">
              tite<span className="text-brand-orange">Z</span>Me
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <Link href="/" className="text-sm font-bold text-white hover:text-brand-yellow transition-colors">Home</Link>
            <Link href="#cities" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Cities</Link>
            <Link href="#for-barbers" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">For barbers</Link>
          </div>
          
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-sm font-bold text-gray-400">
              <span>🇺🇸</span> EN
            </div>
            <Link href="/login" className="text-sm font-bold text-white hover:text-gray-300 transition-colors border border-gray-700 px-4 py-2 rounded-full hidden sm:block">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-bold bg-brand-yellow text-[#0A0A0A] px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
              Sign up for free
            </Link>
          </div>
        </div>
        
        {/* ROW 2: Ticker */}
        <div className="bg-[#141414] border-b border-[#2a2a2a] py-2.5 px-6 flex items-center justify-between overflow-hidden">
          <div className="flex-1 overflow-hidden relative flex items-center">
            <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap text-xs font-bold text-gray-400 flex gap-4">
              <span>💈 Trusted by barbers nationwide</span>
              <span>—</span>
              <span>Book your next cut in 30 seconds</span>
              <span>—</span>
              <span>Zero phone calls</span>
              <span>—</span>
              <span>Real availability</span>
              <span>—</span>
              <span>Find barbers near you →</span>
              {/* Duplicate for seamless looping */}
              <span className="ml-4">💈 Trusted by barbers nationwide</span>
              <span>—</span>
              <span>Book your next cut in 30 seconds</span>
              <span>—</span>
              <span>Zero phone calls</span>
              <span>—</span>
              <span>Real availability</span>
              <span>—</span>
              <span>Find barbers near you →</span>
            </div>
          </div>
          <Link href="#browse-barbers" className="ml-4 shrink-0 text-xs font-bold text-brand-orange hover:text-brand-yellow transition-colors bg-[#2a2a2a] px-3 py-1 rounded-full">
            Book now →
          </Link>
        </div>
      </div>
    );
  }

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
