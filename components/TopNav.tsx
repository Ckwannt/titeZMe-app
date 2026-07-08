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
  const { user, appUser, authLoading, logout } = useAuth();
  const { lang, setLang, t } = useLang();
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
      <style>{`
        @keyframes langDropIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
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
          <Link href="/" className={getLinkClass('/')}>{t('nav.home')}</Link>
          <div className="flex items-center cursor-default">
            <span className="text-sm font-bold text-[#888580] cursor-default">{t('nav.cuts')}</span>
            <span style={{ marginLeft: '4px', background: '#1a1a1a', color: '#F5C518', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '99px', border: '1px solid #2a2a2a', verticalAlign: 'middle' }}>{t('nav.soon')}</span>
          </div>
          <Link href="/barbers" className={getLinkClass('/barbers')}>{t('nav.barbers')}</Link>
          <Link href="/shops" className={getLinkClass('/shops')}>{t('nav.shops')}</Link>
          <Link href="/challenge" className={getLinkClass('/challenge')}>{t('nav.challenge')}</Link>
        </div>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-3 ml-auto flex-shrink-0 z-10">

          {/* Desktop: language dropdown */}
          {/* ── GLASS PANEL LANGUAGE SWITCHER ── */}
          <div
            ref={langMenuRef}
            className="hidden md:block"
            style={{ position: 'relative' }}
          >
            {/* TRIGGER */}
            <button
              onClick={() => setShowLangMenu(v => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 10px 6px 8px',
                borderRadius: 10,
                background: showLangMenu
                  ? 'rgba(245,197,24,0.06)'
                  : 'rgba(255,255,255,0.03)',
                border: showLangMenu
                  ? '1px solid rgba(245,197,24,0.35)'
                  : '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer',
                boxShadow: showLangMenu
                  ? '0 0 20px rgba(245,197,24,0.12)'
                  : 'none',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Flag */}
              <span style={{ fontSize: 16, lineHeight: 1 }}>
                {lang === 'en' ? '🇬🇧'
                 : lang === 'fr' ? '🇫🇷'
                 : '🇪🇸'}
              </span>
              {/* Code */}
              <span style={{
                fontSize: 11,
                fontWeight: 800,
                color: showLangMenu ? '#F5C518' : '#aaa',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease',
              }}>
                {lang.toUpperCase()}
              </span>
              {/* Chevron */}
              <svg
                width="8" height="6"
                viewBox="0 0 10 6"
                fill="none"
                style={{
                  stroke: showLangMenu ? '#F5C518' : '#444',
                  strokeWidth: 2.5,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  transform: showLangMenu
                    ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.35s cubic-bezier(0.34,1.2,0.64,1), stroke 0.3s ease',
                }}
              >
                <polyline points="1,1 5,5 9,1"/>
              </svg>
            </button>

            {/* DROPDOWN */}
            {showLangMenu && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                left: 0,
                width: 210,
                background: 'rgba(14,14,14,0.97)',
                backdropFilter: 'blur(40px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
                border: '1px solid rgba(245,197,24,0.1)',
                borderRadius: 18,
                padding: 8,
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)',
                zIndex: 999,
                animation: 'langDropIn 0.35s cubic-bezier(0.34,1.2,0.64,1) forwards',
              }}>
                {([
                  { code: 'en', flag: '🇬🇧', name: 'English' },
                  { code: 'es', flag: '🇪🇸', name: 'Español' },
                  { code: 'fr', flag: '🇫🇷', name: 'Français' },
                ] as { code: 'en'|'fr'|'es', flag: string, name: string }[]).map((l, i) => (
                  <div key={l.code}>
                    {i > 0 && (
                      <div style={{
                        height: 1,
                        margin: '2px 10px',
                        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)',
                      }}/>
                    )}
                    <div
                      onClick={() => {
                        setLang(l.code);
                        setShowLangMenu(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '11px 12px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        background: lang === l.code
                          ? 'rgba(245,197,24,0.05)'
                          : 'transparent',
                        transition: 'background 0.2s ease',
                        animationDelay: `${i * 0.06}s`,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement)
                          .style.background =
                            lang === l.code
                              ? 'rgba(245,197,24,0.08)'
                              : 'rgba(255,255,255,0.03)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement)
                          .style.background =
                            lang === l.code
                              ? 'rgba(245,197,24,0.05)'
                              : 'transparent';
                      }}
                    >
                      {/* Flag */}
                      <span style={{ fontSize: 22 }}>{l.flag}</span>
                      {/* Name + code */}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: lang === l.code
                            ? '#F5C518' : '#ddd',
                          transition: 'color 0.2s ease',
                        }}>
                          {l.name}
                        </div>
                        <div style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: lang === l.code
                            ? 'rgba(245,197,24,0.5)' : '#444',
                          textTransform: 'uppercase',
                          letterSpacing: '1.5px',
                          marginTop: 1,
                        }}>
                          {l.code.toUpperCase()}
                        </div>
                      </div>
                      {/* Check */}
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: lang === l.code
                          ? 'none'
                          : '1.5px solid #252525',
                        background: lang === l.code
                          ? '#F5C518' : 'transparent',
                        boxShadow: lang === l.code
                          ? '0 0 14px rgba(245,197,24,0.35)'
                          : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                      }}>
                        {lang === l.code && (
                          <svg width="10" height="8"
                            viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6"
                              stroke="#0a0a0a"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {authLoading ? (
            <div className="hidden md:flex items-center gap-4" style={{ minWidth: 200 }} />
          ) : user ? (
            <div className="hidden md:flex items-center gap-4 border-l border-[#1E1E1E] pl-4">
              <NotificationBell />
              <div>
                {appUser?.role === 'client' && <Link href="/dashboard/client" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors mr-4">{t('nav.dashboard')}</Link>}
                {appUser?.role === 'barber' && <Link href="/dashboard/barber" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors mr-4">{t('nav.dashboard')}</Link>}
              </div>
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-[#888580] hover:text-red-500 transition-colors"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-[#F0EDE8] hover:text-[#888580] transition-colors border border-[#1E1E1E] px-4 py-2 rounded-full">
                {t('nav.login')}
              </Link>
              <Link href="/signup" className="text-sm font-bold bg-[#FFD600] text-[#0A0A0A] px-4 py-2 rounded-full hover:opacity-90 transition-opacity">
                {t('nav.signUp')}
              </Link>
            </div>
          )}

          {/* Mobile: notification bell (if logged in) + Login button + hamburger */}
          {!authLoading && user && (
            <div className="show-mobile-only flex items-center gap-3">
              <NotificationBell />
            </div>
          )}
          {!authLoading && !user && (
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
              {t('nav.login')}
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

      {/* ROW 2: Ticker — hidden on dashboard routes to reclaim vertical space */}
      {!pathname.startsWith('/dashboard') && (
      <div className="bg-[#111111] border-b border-[#1E1E1E] py-2.5 px-6 flex items-center justify-between overflow-hidden relative">
        <div className="flex-1 overflow-hidden relative flex items-center">
          <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap text-xs font-bold text-[#888580] flex gap-4">
            <span>{t('ticker.trust')}</span>
            <span>—</span>
            <span>{t('ticker.bookIn30')}</span>
            <span>—</span>
            <span>{t('ticker.noCalls')}</span>
            <span>—</span>
            <span>{t('ticker.realAvail')}</span>
            <span>—</span>
            <span>{t('ticker.findBarbers')}</span>
            {/* Duplicate for seamless looping */}
            <span className="ml-4">{t('ticker.trust')}</span>
            <span>—</span>
            <span>{t('ticker.bookIn30')}</span>
            <span>—</span>
            <span>{t('ticker.noCalls')}</span>
            <span>—</span>
            <span>{t('ticker.realAvail')}</span>
            <span>—</span>
            <span>{t('ticker.findBarbers')}</span>
          </div>
        </div>
      </div>
      )}

      {/* MOBILE DRAWER — full screen, shown when menuOpen */}
      {menuOpen && (
        <div
          className="show-mobile-only"
          style={{
            position: 'fixed',
            inset: 0,
            top: 0,
            background: '#0A0A0A',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '105px',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingBottom: 'env(safe-area-inset-bottom, 24px)',
            overflowY: 'auto'
          }}
        >
          {/* Nav links */}
          {[
            { label: t('nav.home'), href: '/' },
            { label: t('nav.barbers'), href: '/barbers' },
            { label: t('nav.shops'), href: '/shops' },
            { label: t('nav.challenge'), href: '/challenge' },
            { label: t('nav.forBarbers'), href: '/for-barbers' },
            { label: t('nav.forShops'), href: '/for-shops' },
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
            {authLoading ? null : !user ? (
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
                  {t('nav.signUpFree')}
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
                  {t('nav.login')}
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
                  {t('nav.myDashboard')}
                </a>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  style={{
                    fontSize: '15px',
                    fontWeight: 900,
                    textAlign: 'center',
                    padding: '14px',
                    borderRadius: '12px',
                    width: '100%',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.2)',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'Nunito, sans-serif',
                  }}
                >
                  {t('nav.logout')}
                </button>
              </>
            )}
          </div>

          {/* Language switcher */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: '8px 0',
            borderTop: '1px solid #1a1a1a',
            marginTop: 'auto',
            paddingTop: 16,
          }}>
            {([
              { code: 'en', flag: '🇬🇧', name: 'English' },
              { code: 'es', flag: '🇪🇸', name: 'Español' },
              { code: 'fr', flag: '🇫🇷', name: 'Français' },
            ] as { code: 'en'|'fr'|'es', flag: string, name: string }[]).map(l => (
              <div
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  background: lang === l.code
                    ? 'rgba(245,197,24,0.06)'
                    : 'transparent',
                  border: lang === l.code
                    ? '1px solid rgba(245,197,24,0.15)'
                    : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: 22 }}>{l.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: lang === l.code ? '#F5C518' : '#ddd',
                  }}>
                    {l.name}
                  </div>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: lang === l.code
                      ? 'rgba(245,197,24,0.5)' : '#444',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    marginTop: 1,
                  }}>
                    {l.code.toUpperCase()}
                  </div>
                </div>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: lang === l.code
                    ? 'none' : '1.5px solid #252525',
                  background: lang === l.code
                    ? '#F5C518' : 'transparent',
                  boxShadow: lang === l.code
                    ? '0 0 10px rgba(245,197,24,0.3)'
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                }}>
                  {lang === l.code && (
                    <svg width="9" height="7"
                      viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6"
                        stroke="#0a0a0a"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
