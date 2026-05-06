'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { NotificationBell } from './NotificationBell';

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, appUser, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="sticky top-0 left-0 right-0 z-50 flex flex-col w-full">
      {/* ROW 1: Main Nav */}
      <div className="bg-[#0A0A0A] border-b border-[#1E1E1E] px-6 py-4 flex items-center justify-between">
        <div className="flex-1 flex justify-start items-center space-x-8">
          <Link href="/" className="font-black text-[#FFD600] whitespace-nowrap text-2xl tracking-tight flex items-center mr-4">
            titeZMe
          </Link>
          <div className="hidden md:flex flex-1 justify-start space-x-6">
            <Link href="/" className="text-sm font-bold text-[#F0EDE8] hover:text-[#FFD600] transition-colors">Home</Link>
            <Link href="/#how-it-works" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">How it works</Link>
            <Link href="/#cuts" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Cuts</Link>
            <Link href="/#browse-barbers" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Barbers</Link>
            <Link href="/#cities" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Shops</Link>
            <Link href="/#contact" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Contact</Link>
          </div>
        </div>
        
        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-sm font-bold text-[#888580]">
            <span>🌍</span> EN
          </div>
          {user ? (
            <div className="flex items-center gap-4 border-l border-[#1E1E1E] pl-4">
              <NotificationBell />
              <div className="hidden md:block">
                {appUser?.role === 'client' && <Link href="/dashboard/client" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors mr-4">Dashboard</Link>}
                {appUser?.role === 'barber' && <Link href="/dashboard/barber" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors mr-4">Dashboard</Link>}
                {appUser?.role === 'shop_owner' && <Link href="/dashboard/shop" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors mr-4">Dashboard</Link>}
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm font-bold text-[#888580] hover:text-red-500 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-[#888580] hidden md:block">Guest</span>
              <Link href="/login" className="text-sm font-bold text-[#F0EDE8] hover:text-[#888580] transition-colors border border-[#1E1E1E] px-4 py-2 rounded-full hidden sm:block">
                Log in
              </Link>
              <Link href="/signup" className="text-sm font-bold bg-[#FFD600] text-[#0A0A0A] px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* ROW 2: Ticker */}
      <div className="bg-[#111111] border-b border-[#1E1E1E] py-2.5 px-6 flex items-center justify-between overflow-hidden relative">
        <div className="flex-1 overflow-hidden relative flex items-center">
          <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap text-xs font-bold text-[#888580] flex gap-4">
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
        <Link href="/#browse-barbers" className="ml-4 shrink-0 text-xs font-bold text-[#FFD600] hover:text-white transition-colors bg-[#1E1E1E] px-3 py-1 rounded-full">
          Book now →
        </Link>
      </div>
    </div>
  );
}
