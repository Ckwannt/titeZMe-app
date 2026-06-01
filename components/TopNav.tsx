'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Wordmark } from './Wordmark';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { NotificationBell } from './NotificationBell';
import { useLang } from '@/lib/i18n/LangContext';
import type { Language } from '@/lib/i18n/translations';

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, appUser, logout } = useAuth();
  const { lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getLinkClass = (path: string) => {
    return pathname === path
      ? 'text-sm font-bold text-[#FFD600] transition-colors'
      : 'text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors';
  };

  // Close drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close lang menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <div className="sticky top-0 left-0 right-0 z-50 flex flex-col w-full">
      {/* ROW 1: Main Nav */}
      <div className="bg-[#0A0A0A] border-b border-[#1E1E1E] px-6 py-4 flex items-center relative">

        {/* LEFT — Logo */}
        <div className="flex-shrink-0 z-10">
          <Link href="/" className="flex items-center">
            <Wordmark height={24} />
          </Link>
        </div>

        {/* CENTER — Nav links (desktop + tablet only) */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="/" className={getLinkClass('/')}>Home</Link>
          <div className="flex items-center cursor-default">
            <span className="text-sm font-bold text-[#888580] cursor-default">Cuts</span>
            <span style={{ marginLeft: '4px', background: '#1a1a1a', color: '#F5C518', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '99px', border: '1px solid #2a2a2a', verticalAlign: 'middle' }}>Soon</span>
          </div>
          <Link href="/barbers" className={getLinkClass('/barbers')}>Barbers</Link>
          <Link href="/shops" className={getLinkClass('/shops')}>Shops</Link>
        </div>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-3 ml-auto flex-shrink-0 z-10">

          {/* Desktop: language dropdown */}
          <div ref={langMenuRef} className="relative hidden md:flex items-center">
            <button
              onClick={() => setShowLangMenu(v => !v)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: 800,
                color: '#888580',
                fontFamily: 'Nunito, sans-serif',
                padding: '4px 8px',
                borderRadius: '99px',
              }}
            >
              🌍 {lang.toUpperCase()}
            </button>
            {showLangMenu && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: '#111111',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 9999,
                minWidth: '110px',
              }}>
                {(['en', 'fr', 'es'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setShowLangMenu(false); }}
                    style={{
                      background: lang === l ? '#1a1a1a' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: lang === l ? 900 : 600,
                      color: lang === l ? '#F5C518' : '#888580',
                      fontFamily: 'Nunito, sans-serif',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    {l === 'en' ? '🇬🇧  EN — English' : l === 'fr' ? '🇫🇷  FR — Français' : '🇪🇸  ES — Español'}
                  </button>
                ))}
              </div>
            )}
          </div>
          {user ? (
            <div className="hidden md:flex items-center gap-4 border-l border-[#1E1E1E] pl-4">
              <NotificationBell />
              <div>
                {appUser?.role === 'client' && <Link href="/dashboard/client" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors mr-4">Dashboard</Link>}
                {appUser?.role === 'barber' && <Link href="/dashboard/barber" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors mr-4">Dashboard</Link>}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-[#888580] hover:text-red-500 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm font-bold text-[#888580]">Guest</span>
              <Link href="/login" className="text-sm font-bold text-[#F0EDE8] hover:text-[#888580] transition-colors border border-[#1E1E1E] px-4 py-2 rounded-full">
                Log in
              </Link>
              <Link href="/signup" className="text-sm font-bold bg-[#FFD600] text-[#0A0A0A] px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile: notification bell (if logged in) + Login button + hamburger */}
          {user && (
            <div className="show-mobile-only flex items-center gap-3">
              <NotificationBell />
            </div>
          )}
          {!user && (
            <a
              href="/login"
              className="show-mobile-only"
              style={{
                background: 'transparent',
                border: '1px solid #2a2a2a',
                color: '#fff',
                borderRadius: '99px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 800,
                textDecoration: 'none',
                fontFamily: 'Nunito, sans-serif'
              }}
            >
              Log in
            </a>
          )}

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile-only"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
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
      </div>

      {/* MOBILE DRAWER — full screen, shown when menuOpen */}
      {menuOpen && (
        <div
          className="show-mobile-only"
          style={{
            position: 'fixed',
            inset: 0,
            top: '105px', // below both nav rows (approx 60px row1 + 45px ticker)
            background: '#0A0A0A',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            overflowY: 'auto'
          }}
        >
          {/* Nav links */}
          {[
            { label: 'Home', href: '/' },
            { label: 'Barbers', href: '/barbers' },
            { label: 'Shops', href: '/shops' },
            { label: 'For Barbers', href: '/for-barbers' },
            { label: 'For Shops', href: '/for-shops' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: pathname === link.href ? '#F5C518' : '#fff',
                textDecoration: 'none',
                padding: '16px 0',
                borderBottom: '1px solid #141414',
                fontFamily: 'Nunito, sans-serif'
              }}
            >
              {link.label}
            </a>
          ))}

          {/* Auth buttons */}
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {!user ? (
              <>
                <a
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: '#F5C518',
                    color: '#0a0a0a',
                    borderRadius: '99px',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 900,
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontFamily: 'Nunito, sans-serif'
                  }}
                >
                  Sign up free
                </a>
                <a
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: 'transparent',
                    color: '#fff',
                    border: '1px solid #2a2a2a',
                    borderRadius: '99px',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 900,
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontFamily: 'Nunito, sans-serif'
                  }}
                >
                  Log in
                </a>
              </>
            ) : (
              <>
                <a
                  href={appUser?.role === 'barber' ? '/dashboard/barber' : '/dashboard/client'}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    background: '#F5C518',
                    color: '#0a0a0a',
                    borderRadius: '99px',
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 900,
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontFamily: 'Nunito, sans-serif'
                  }}
                >
                  My dashboard →
                </a>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-colors"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  Log out
                </button>
              </>
            )}
          </div>

          {/* Language switcher */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '24px',
            borderTop: '1px solid #141414',
            display: 'flex',
            gap: '12px'
          }}>
            {(['en', 'fr', 'es'] as const).map((l: Language) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? '#1a1a1a' : 'transparent',
                  border: `1px solid ${lang === l ? '#F5C518' : '#2a2a2a'}`,
                  color: lang === l ? '#F5C518' : '#555',
                  borderRadius: '99px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'Nunito, sans-serif'
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
