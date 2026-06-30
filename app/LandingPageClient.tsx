'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';
import ChallengeHomepageBox from '@/components/ChallengeHomepageBox';

// ─── helpers ─────────────────────────────────────────────────────────────────

function normalizeCity(raw: string): string {
  const c = (raw || '').toLowerCase().trim();
  if (!c) return '';
  if (c.includes('casablanca')) return 'Casablanca';
  if (c.includes('marrakesh') || c.includes('marrakech')) return 'Marrakesh';
  if (c.includes('rabat')) return 'Rabat';
  if (c.includes('tangier') || c.includes('tanger')) return 'Tangier';
  if (c.includes('london') || c.includes('hackney') || c.includes('brixton') ||
      c.includes('camden') || c.includes('islington') || c.includes('lambeth')) return 'London';
  if (c.includes('paris') || c.includes('île-de-france') || c.includes('ile-de-france') ||
      c.includes('boulogne') || c.includes('vincennes') || c.includes('montreuil')) return 'Paris';
  if (c.includes('madrid') || c.includes('alcal') || c.includes('getafe') ||
      c.includes('leganes') || c.includes('alcorcón')) return 'Madrid';
  if (c.includes('barcelona') || c.includes('hospitalet') || c.includes('badalona')) return 'Barcelona';
  if (c.includes('seville') || c.includes('sevilla')) return 'Seville';
  if (c.includes('amsterdam')) return 'Amsterdam';
  if (c.includes('berlin')) return 'Berlin';
  if (c.includes('rome') || c.includes('roma')) return 'Rome';
  if (c.includes('milan') || c.includes('milano')) return 'Milan';
  if (c.includes('dubai')) return 'Dubai';
  return raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function getCurrencySymbol(currency?: string): { sym: string; label: string } {
  switch ((currency ?? '').toUpperCase()) {
    case 'MAD': return { sym: '', label: ' MAD' };
    case 'GBP': return { sym: '£', label: '' };
    case 'USD': return { sym: '$', label: '' };
    default:    return { sym: '€', label: '' };
  }
}

const COMING_SOON = ['Amsterdam', 'Berlin', 'Rome', 'Dubai', 'London', 'Barcelona'];

interface LandingPageClientProps {
  featuredBarbers?: any[];
  featuredShops?: any[];
  citiesData?: { city: string; barbers: number; shops: number }[];
  hideFeaturedSection?: boolean;
}

// ─── component ───────────────────────────────────────────────────────────────

export default function LandingPageClient({
  featuredBarbers = [],
  featuredShops = [],
  citiesData = [],
  hideFeaturedSection = false,
}: LandingPageClientProps) {
  const { t } = useLang();
  const citySlots = [...citiesData];
  for (const cs of COMING_SOON) {
    if (citySlots.length >= 8) break;
    if (!citySlots.some(c => c.city === cs)) {
      citySlots.push({ city: cs, barbers: 0, shops: 0 });
    }
  }

  // Helpers for featured barber cards
  const mainBarber = featuredBarbers[0] as any;
  const smallBarbers = featuredBarbers.slice(1, 3) as any[];

  // Helpers for featured shop cards
  const mainShop = featuredShops[0] as any;
  const smallShops = featuredShops.slice(1, 3) as any[];

  return (
    <div className="bg-[#0A0A0A] text-white pt-16 md:pt-24 min-h-screen font-sans">

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 pt-8 pb-32">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* Left column */}
          <div className="flex-1 animate-fadeUp">
            <div className="inline-flex items-center gap-2 border border-[#2a2a2a] rounded-full px-3 py-1 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
              <span className="text-xs font-bold text-gray-500">{t('landing.statBarbers')}</span>
            </div>

            <h1 className="text-6xl md:text-[88px] font-black leading-[0.95] tracking-tight mb-8">
              {t('landing.heroH1a')} <br className="hidden md:block"/>
              <span className="text-brand-yellow">{t('landing.heroH1b')}</span><br/>
              <span className="text-[#333]">{t('landing.heroH1c')}</span>
            </h1>

            <p className="text-lg text-gray-400 font-bold mb-10 max-w-[480px] leading-relaxed">
              {t('landing.heroDesc')}
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/barbers"
                className="bg-[#F5C518] text-[#0a0a0a] font-black px-7 py-3.5 rounded-full text-[15px] hover:opacity-90 transition-opacity">
                {t('buttons.findBarber')}
              </Link>
              <Link href="/shops"
                className="border-2 border-[#2a2a2a] text-white font-extrabold px-7 py-3.5 rounded-full text-[15px] hover:bg-[#1a1a1a] transition-colors">
                {t('buttons.findBarbershop')}
              </Link>
            </div>


            <div className="flex gap-8 md:gap-12 md:max-w-md justify-between">
              <div>
                <div className="text-[32px] font-black text-brand-yellow leading-tight mb-1">2.4k+</div>
                <div className="text-xs text-gray-500 font-bold">{t('landing.barbersLabel')}</div>
              </div>
              <div>
                <div className="text-[32px] font-black text-white leading-tight mb-1">4.97</div>
                <div className="text-xs text-gray-500 font-bold">{t('landing.avgRatingLabel')}</div>
              </div>
              <div>
                <div className="text-[32px] font-black text-white leading-tight mb-1">551</div>
                <div className="text-xs text-gray-500 font-bold">{t('landing.bookedTodayLabel')}</div>
              </div>
              <div>
                <div className="text-[32px] font-black text-brand-yellow leading-tight mb-1">0%</div>
                <div className="text-xs text-gray-500 font-bold">{t('landing.feesLabel')}</div>
              </div>
            </div>
          </div>

          {/* Right column — Challenge box (replaces featured barbers/shops) */}
          <ChallengeHomepageBox />
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#050505]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-mono tracking-[0.35em] text-brand-yellow uppercase mb-6">
            {t('landing.earlyAccessLabel')}
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            {t('landing.earlyAccessTitle')}
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            {t('landing.earlyAccessDesc')}
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-[#0A0A0A] py-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center mb-20">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t('landing.howItWorks')}</div>
          <h2 className="text-4xl md:text-5xl font-black">{t('landing.bookedIn3Steps')}</h2>
        </div>
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-12 lg:gap-20">
          {[
            { n: '01', t: t('landing.step1Title'), d: t('landing.step1Desc'), i: '📍' },
            { n: '02', t: t('landing.step2Title'), d: t('landing.step2Desc'), i: '✂️' },
            { n: '03', t: t('landing.step3Title'), d: t('landing.step3Desc'), i: '💵' },
          ].map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[180px] font-black text-[#111] leading-none z-0 tracking-tighter" style={{ marginTop: '-60px' }}>{step.n}</div>
              <div className="z-10 relative">
                <div className="w-16 h-16 mx-auto bg-[#141414] border border-[#2a2a2a] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl">{step.i}</div>
                <h3 className="text-xl font-black mb-3">{step.t}</h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed max-w-[280px] mx-auto">{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOR BARBERS ─────────────────────────────────────────────────────── */}
      <section id="for-barbers" className="bg-[#111] py-24 px-6 border-y border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-8 items-center">
          <div>
            <div className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">{t('landing.forBarbers')}</div>
            <h2 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              {t('landing.barberChairTitle')}
            </h2>
            <p className="text-lg font-bold text-gray-400 mb-10 max-w-[420px]">
              {t('landing.barberNoFees')}
            </p>
            <div className="flex flex-col gap-4 mb-10">
              {[t('landing.barberBenefit1'), t('landing.barberBenefit2'), t('landing.barberBenefit3'), t('landing.barberBenefit4')].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-yellow/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-brand-yellow text-xs font-black">✓</span>
                  </div>
                  <span className="font-bold text-gray-300">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90">
                {t('landing.joinFreeBeta')}
              </Link>
              <Link href="/how-it-works" className="border border-[#2a2a2a] text-white font-bold px-8 py-4 rounded-full hover:bg-[#1a1a1a] transition-colors">
                {t('landing.seeHowItWorks')}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] p-4 md:p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-3xl md:text-5xl font-black text-brand-yellow mb-2">0%</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">commission</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 md:p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-3xl md:text-5xl font-black text-white mb-2">10 min</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">to set up your profile</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 md:p-8 rounded-3xl flex flex-col justify-center min-h-[180px] border border-brand-yellow/20">
              <div className="text-3xl md:text-5xl font-black text-white mb-2">400+</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">barbers already joined</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 md:p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-xl md:text-3xl font-black text-brand-orange mb-2">Beta = Free</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Join now, pay nothing during beta</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR SHOPS ───────────────────────────────────────────────────────── */}
      <section id="for-shops" className="bg-[#111] py-24 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-8 items-center">
          <div>
            <div className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">{t('landing.forShops')}</div>
            <h2 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              {t('landing.shopTitle')}
            </h2>
            <p className="text-lg font-bold text-gray-400 mb-10 max-w-[420px]">
              {t('landing.shopDesc')}
            </p>
            <div className="flex flex-col gap-4 mb-10">
              {[t('landing.shopBenefit1'), t('landing.shopBenefit2'), t('landing.shopBenefit3'), t('landing.shopBenefit4')].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-yellow/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-brand-yellow text-xs font-black">✓</span>
                  </div>
                  <span className="font-bold text-gray-300">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90">
                {t('landing.createYourShop')}
              </Link>
              <Link href="/how-it-works" className="border border-[#2a2a2a] text-white font-bold px-8 py-4 rounded-full hover:bg-[#1a1a1a] transition-colors">
                {t('landing.seeHowItWorks')}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] p-4 md:p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-3xl md:text-5xl font-black text-brand-yellow mb-2">Free</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">during beta</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 md:p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-3xl md:text-5xl font-black text-white mb-2">4</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">steps to set up</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 md:p-8 rounded-3xl flex flex-col justify-center min-h-[180px] border border-brand-yellow/20">
              <div className="text-3xl md:text-5xl font-black text-white mb-2">100%</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">data visibility</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 md:p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-xl md:text-3xl font-black text-brand-orange mb-2">24/7</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">booking management</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CITIES ──────────────────────────────────────────────────────────── */}
      <section id="cities" className="bg-[#0A0A0A] py-24 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t('landing.citiesSection')}</div>
          <h2 className="text-4xl md:text-5xl font-black mb-12">{t('landing.liveCities')}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {citySlots.slice(0, 8).map((city, i) => {
              const isLive = city.barbers > 0 || city.shops > 0;
              const isFirst = i === 0 && isLive;
              return (
                <div key={city.city} className={`p-6 rounded-3xl border transition-colors ${isLive ? 'bg-[#111] border-[#2a2a2a] hover:border-brand-yellow/50' : 'bg-[#0f0f0f] border-[#1a1a1a] opacity-60'}`}>
                  {isFirst && <div className="text-[10px] font-black text-black bg-brand-yellow inline-block px-2 py-0.5 rounded mb-3 uppercase tracking-wider">{t('status.mostPopular')}</div>}
                  <h3 className="text-xl font-black text-white mb-1">{city.city}</h3>
                  <div className="text-xs font-bold text-gray-500 mb-6">
                    {isLive
                      ? `${city.barbers} ${t(city.barbers === 1 ? 'landing.cityBarberSingular' : 'landing.cityBarberPlural')}${city.shops > 0 ? ` · ${city.shops} ${t(city.shops === 1 ? 'landing.cityShopSingular' : 'landing.cityShopPlural')}` : ''}`
                      : t('status.comingSoon')}
                  </div>
                  {isLive ? (
                    <Link href="/barbers" className="text-sm font-black text-brand-yellow">{t('buttons.explore')}</Link>
                  ) : (
                    <button className="text-sm font-bold text-gray-600">{t('buttons.requestIt')}</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section id="contact" className="bg-brand-yellow text-black py-32 px-6 text-center">
        <div className="max-w-[800px] mx-auto">
          <div className="text-[11px] font-black uppercase tracking-widest mb-6 opacity-70">{t('landing.oneLastThing')}</div>
          <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
            {t('landing.nextCut')} <br/> {t('landing.nextCut2')}
          </h2>
        </div>
      </section>

    </div>
  );
}
