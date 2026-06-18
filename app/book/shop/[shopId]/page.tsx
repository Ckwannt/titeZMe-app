'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  addDoc,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/i18n/LangContext';
import { ShopTimePicker } from '@/components/ShopTimePicker';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { toast } from '@/lib/toast';
import Image from 'next/image';
import { notificationSchema } from '@/lib/schemas';

// ─── Types ────────────────────────────────────────────────────────────────────

type ShopData = {
  id: string;
  name?: string;
  logoUrl?: string;
  coverPhotoUrl?: string;
  address?: { street?: string; city?: string; country?: string };
  ownerId?: string;
  titeZMeCut?: { price?: number; durationMinutes?: number; currency?: string };
};

type BarberData = {
  id: string;
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
  rating?: number;
  reviewCount?: number;
  specialties?: string[];
  languages?: string[];
  experienceStartYear?: number;
  experienceVerified?: boolean;
  totalCuts?: number;
  isLive?: boolean;
};

type ServiceData = {
  id: string;
  name?: string;
  price?: number;
  durationMinutes?: number;
  currency?: string;
  providerType?: string;
  isTitz?: boolean;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcEndTime(startTime: string, durationMins: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const total = h * 60 + m + durationMins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function formatFullDate(dateStr: string, locale: string): string {
  if (!dateStr) return '';
  const [y, mo, d] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString(locale, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopBookingPage() {
  const params = useParams();
  const shopId = params.shopId as string;
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get('serviceId') ?? '';

  const { user, appUser } = useAuth();
  const { t, lang } = useLang();
  const dateLocale = lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [shop, setShop] = useState<ShopData | null>(null);
  const [barbers, setBarbers] = useState<BarberData[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [availableBarberIds, setAvailableBarberIds] = useState<string[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');

  const [confirming, setConfirming] = useState(false);
  const [bookingError, setBookingError] = useState<string>('');
  const [honeypot, setHoneypot] = useState('');

  // ── Auth guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      router.replace(`/login?redirect=/book/shop/${shopId}`);
      return;
    }
    if (appUser?.role === 'admin') {
      toast.error(t('profile.adminCannotBook'));
      router.replace('/');
      return;
    }
    if (appUser && !appUser.isOnboarded) {
      router.replace(appUser?.role === 'barber' ? '/onboarding/barber' : '/onboarding/client');
    }
  }, [user, appUser, router, shopId]);

  // ── Load shop + barbers + services ───────────────────────────────────────────
  useEffect(() => {
    if (!shopId || !user) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        // 1. Shop
        const shopSnap = await getDoc(doc(db, 'barbershops', shopId));
        const shopData: ShopData | null = shopSnap.exists()
          ? ({ id: shopSnap.id, ...(shopSnap.data() as any) })
          : null;

        // 2. Live team barbers
        const barberSnap = await getDocs(query(
          collection(db, 'barberProfiles'),
          where('shopId', '==', shopId),
          where('isLive', '==', true),
        ));
        const rawBarbers = barberSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));

        // Enrich with user data (firstName, lastName, photoUrl)
        const userSnaps = await Promise.all(
          rawBarbers.map(b => getDoc(doc(db, 'users', b.id)))
        );
        const enrichedBarbers: BarberData[] = rawBarbers.map((b, i) => {
          const u = userSnaps[i].exists() ? (userSnaps[i].data() as any) : {};
          return {
            id: b.id,
            firstName: u.firstName,
            lastName: u.lastName,
            profilePhotoUrl: b.profilePhotoUrl ?? u.photoUrl,
            rating: b.rating,
            reviewCount: b.reviewCount,
            specialties: b.specialties,
            languages: b.languages,
            experienceStartYear: b.experienceStartYear,
            experienceVerified: b.experienceVerified,
            totalCuts: b.totalCuts,
            isLive: b.isLive,
          };
        });

        // 3. Shop services
        const svcSnap = await getDocs(query(
          collection(db, 'services'),
          where('providerId', '==', shopId),
          where('providerType', '==', 'shop'),
        ));
        const shopServices: ServiceData[] = svcSnap.docs.map(d => {
          const data = d.data() as any;
          return {
            id: d.id,
            name: data.name,
            price: data.price,
            durationMinutes: data.durationMinutes ?? data.duration,
            currency: data.currency,
            providerType: data.providerType,
          };
        });

        // Prepend titeZMe Cut if shop has it
        const allServices: ServiceData[] = [];
        if (shopData?.titeZMeCut) {
          allServices.push({
            id: 'titeZMeCut',
            name: 'titeZMe Cut',
            price: shopData.titeZMeCut.price ?? 20,
            durationMinutes: shopData.titeZMeCut.durationMinutes ?? 45,
            currency: shopData.titeZMeCut.currency ?? '€',
            isTitz: true,
          });
        }
        allServices.push(...shopServices);

        if (cancelled) return;

        setShop(shopData);
        setBarbers(enrichedBarbers);
        setServices(allServices);

        // Pre-select if URL has serviceId
        if (initialServiceId) {
          const match = allServices.find(s => s.id === initialServiceId);
          if (match) {
            setSelectedServiceIds([match.id]);
            setStep(2);
          }
        }
      } catch (err) {
        console.error('Shop booking load error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [shopId, user, initialServiceId]);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const selectedService = services.find(s => s.id === selectedServiceIds[0]);
  const selectedDuration = selectedService?.durationMinutes ?? 30;
  const selectedPrice = selectedService?.price ?? 0;
  const currency = selectedService?.currency ?? shop?.titeZMeCut?.currency ?? '€';
  const selectedBarber = barbers.find(b => b.id === selectedBarberId);

  // ── Confirm booking ─────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (honeypot) {
      console.log('Bot detected in shop booking');
      return;
    }
    if (!user || !appUser) return;
    if (!selectedService || !selectedBarberId || !selectedDate || !selectedTime) return;
    if (confirming) return;

    setConfirming(true);
    setBookingError('');

    try {
      // Rate limit: max 5 per hour
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      const recentSnap = await getDocs(query(
        collection(db, 'bookings'),
        where('clientId', '==', user.uid),
        where('createdAt', '>', oneHourAgo),
      ));
      if (recentSnap.size >= 5) {
        setBookingError(t('errors.tooManyBookingAttempts'));
        setConfirming(false);
        return;
      }

      // Offline check
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setBookingError(t('booking.noInternetBooking'));
        setConfirming(false);
        return;
      }

      // Duplicate check
      const dupSnap = await getDocs(query(
        collection(db, 'bookings'),
        where('clientId', '==', user.uid),
        where('barberId', '==', selectedBarberId),
        where('date', '==', selectedDate),
        where('startTime', '==', selectedTime),
        where('status', 'in', ['pending', 'confirmed']),
      ));
      if (!dupSnap.empty) {
        setBookingError(t('booking.alreadyHaveBooking'));
        setConfirming(false);
        return;
      }

      const lockDocRef = doc(db, 'bookingLocks', `${selectedBarberId}_${selectedDate}`);
      const newBookingId = doc(collection(db, 'bookings')).id;

      const reqStart = new Date(`${selectedDate}T${selectedTime}`).getTime();
      const reqEnd = reqStart + selectedDuration * 60 * 1000;

      const clientFirst = appUser?.firstName || '';
      const clientLast = appUser?.lastName || '';
      const clientName = clientLast
        ? `${clientFirst} ${clientLast.charAt(0)}.`
        : clientFirst || 'Client';
      const barberName = `${selectedBarber?.firstName ?? ''} ${selectedBarber?.lastName ?? ''}`.trim() || null;
      const endTime = selectedEndTime || calcEndTime(selectedTime, selectedDuration);

      await runTransaction(db, async (tx) => {
        const lockDoc = await tx.get(lockDocRef);
        const bookedSlots = lockDoc.exists() ? (lockDoc.data() as any).slots || [] : [];

        let overlap = false;
        for (const slot of bookedSlots) {
          if (Math.max(reqStart, slot.start) < Math.min(reqEnd, slot.end)) {
            overlap = true;
            break;
          }
        }
        if (overlap) throw new Error('OVERLAP');

        tx.set(lockDocRef, {
          slots: [...bookedSlots, { start: reqStart, end: reqEnd, bookingId: newBookingId }],
        }, { merge: true });

        const bookingRef = doc(db, 'bookings', newBookingId);
        tx.set(bookingRef, {
          clientId: user.uid,
          clientName,
          barberId: selectedBarberId,
          barberName,
          shopId,
          bookingContext: 'shop',
          serviceIds: [selectedService.id],
          serviceNames: [selectedService.name ?? ''],
          totalDuration: selectedDuration,
          date: selectedDate,
          startTime: selectedTime,
          appointmentTimestamp: reqStart,
          endTime,
          status: 'pending',
          paymentMethod: 'cash',
          price: selectedPrice,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      });

      // Best-effort post-write notifications
      try {
        await addDoc(collection(db, 'notifications'), notificationSchema.parse({
          userId: selectedBarberId,
          message: `New booking request for ${selectedDate} at ${selectedTime}.`,
          read: false,
          linkTo: '/dashboard/barber',
          createdAt: Date.now(),
        }));
        updateDoc(doc(db, 'users', selectedBarberId), { unreadCount: increment(1) }).catch(console.error);

        await addDoc(collection(db, 'notifications'), notificationSchema.parse({
          userId: user.uid,
          message: `Your booking for ${selectedDate} at ${selectedTime} is pending confirmation.`,
          read: false,
          linkTo: '/dashboard/client',
          createdAt: Date.now(),
        }));
        updateDoc(doc(db, 'users', user.uid), { unreadCount: increment(1) }).catch(console.error);
      } catch (notifErr) {
        console.error('Post-booking notifications failed:', notifErr);
      }

      toast.success(t('booking.bookingSuccess'));
      await new Promise(r => setTimeout(r, 800));
      router.push(appUser?.role === 'barber' ? '/dashboard/barber/bookings' : '/dashboard/client');
    } catch (e: any) {
      console.error(e);
      if (e?.message === 'OVERLAP') {
        setBookingError(t('booking.slotTaken'));
        setSelectedTime('');
        setSelectedEndTime('');
        setStep(2);
      } else {
        setBookingError(t('booking.bookingFailed'));
      }
      setConfirming(false);
    }
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#666] text-sm font-bold animate-pulse">{t('booking.loadingShop')}</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-5xl mb-3">🏪</div>
          <div className="font-black text-lg mb-1">{t('booking.shopNotFound')}</div>
          <div className="text-[#666] text-sm">{t('booking.shopNotFoundDesc')}</div>
        </div>
      </div>
    );
  }

  const filteredAvailableBarbers = barbers.filter(b => availableBarberIds.includes(b.id));
  const currentYear = new Date().getFullYear();

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-[600px] mx-auto px-6 py-10 md:py-16">

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-2 flex-1 rounded-full bg-[#1a1a1a] overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: i <= step ? '100%' : '0%',
                  background: i < step ? '#F5C518' : i === step ? '#E8491D' : '#1e1e1e',
                }}
              />
            </div>
          ))}
        </div>

        {/* ── STEP 1 — Service selection ────────────────────────────────────── */}
        {step === 1 && (
          <div className="animate-fadeUp">
            <h1 className="text-3xl font-black mb-1">{t('booking.chooseService')}</h1>
            <p className="text-[#888] text-sm font-bold mb-6">{shop.name}</p>

            {services.length === 0 ? (
              <div className="border-2 border-dashed border-[#2a2a2a] rounded-2xl p-8 text-center">
                <div className="text-[#555] text-sm font-bold">{t('emptyStates.noServicesAdded')}</div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mb-8">
                {services.map(svc => {
                  const isSelected = selectedServiceIds[0] === svc.id;
                  return (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedServiceIds([svc.id])}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${isSelected ? 'border-[#E8491D] bg-[#1a0a00]' : 'border-[#2a2a2a] bg-[#141414] hover:border-[#444]'} ${svc.isTitz ? '!border-l-4 !border-l-brand-yellow' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#E8491D] bg-[#E8491D]' : 'border-[#444]'}`}>
                          {isSelected && <span className="text-[#0a0a0a] text-xs font-black">✓</span>}
                        </div>
                        <div>
                          <div className={`font-black flex items-center gap-1.5 ${isSelected ? 'text-[#E8491D]' : 'text-white'}`}>
                            {svc.isTitz && <span>⚡</span>} {svc.name}
                          </div>
                          <div className="text-xs text-[#888] font-bold">{svc.durationMinutes} {t('misc.minShort')}</div>
                        </div>
                      </div>
                      <div className="font-black text-lg">{currency}{svc.price}</div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={selectedServiceIds.length === 0}
                className="bg-brand-yellow text-[#0a0a0a] px-8 py-3.5 rounded-full font-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
              >
                {t('booking.next')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Date & Time ──────────────────────────────────────────── */}
        {step === 2 && (
          <div className="animate-fadeUp">
            <h1 className="text-3xl font-black mb-2">{t('booking.chooseDateTime')}</h1>
            <p className="text-[#888] text-sm font-bold mb-6">
              {selectedDuration} {t('misc.minShort')} · {shop.name}
            </p>

            <ShopTimePicker
              barberIds={barbers.map(b => b.id)}
              totalDuration={selectedDuration}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelect={(date, time, endTime, availIds) => {
                setSelectedDate(date);
                setSelectedTime(time);
                setSelectedEndTime(endTime);
                setAvailableBarberIds(availIds);
                // If barber was previously chosen but is no longer free in this slot, clear it
                if (selectedBarberId && !availIds.includes(selectedBarberId)) {
                  setSelectedBarberId('');
                }
              }}
            />

            {selectedDate && selectedTime && (
              <div className="mt-5 flex items-center gap-3 bg-[#1a0a00] border border-[#E8491D]/40 rounded-xl px-4 py-3">
                <span style={{ color: '#E8491D', fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#E8491D' }}>
                  {selectedDate} · {selectedTime} → {selectedEndTime || calcEndTime(selectedTime, selectedDuration)}
                </span>
                <button
                  onClick={() => { setSelectedDate(''); setSelectedTime(''); setSelectedEndTime(''); setAvailableBarberIds([]); setSelectedBarberId(''); }}
                  style={{ marginLeft: 'auto', fontSize: 11, color: '#555', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {t('booking.clearSlot')}
                </button>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(1)} className="text-[#888] font-bold text-sm hover:text-white transition-colors">
                {t('booking.back')}
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="bg-brand-yellow text-[#0a0a0a] px-8 py-3.5 rounded-full font-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
              >
                {t('booking.next')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Choose barber ────────────────────────────────────────── */}
        {step === 3 && (
          <div className="animate-fadeUp">
            <h1 className="text-3xl font-black mb-2">{t('booking.chooseBarber')}</h1>
            <p className="text-[#888] text-sm font-bold mb-6">
              {t('booking.availableAt').replace('{time}', selectedTime).replace('{date}', formatFullDate(selectedDate, dateLocale))}
            </p>

            {filteredAvailableBarbers.length === 0 ? (
              <div className="border-2 border-dashed border-[#2a2a2a] rounded-2xl p-8 text-center">
                <div className="text-[#555] text-sm font-bold">{t('booking.noBarbersSlot')}</div>
                <button onClick={() => setStep(2)} className="mt-3 text-[#E8491D] text-xs font-black hover:underline">
                  {t('booking.pickDifferentTime')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {filteredAvailableBarbers.map(b => {
                  const isSelected = selectedBarberId === b.id;
                  const name = `${b.firstName ?? ''} ${b.lastName ?? ''}`.trim() || t('misc.barberFallback');
                  const yrs = b.experienceStartYear ? currentYear - b.experienceStartYear : null;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBarberId(b.id)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-[#E8491D] bg-[#1a0a00]' : 'border-[#2a2a2a] bg-[#141414] hover:border-[#444]'}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-[52px] h-[52px] rounded-[14px] overflow-hidden shrink-0 border border-[#2a2a2a] bg-[#1a1a1a]">
                          {b.profilePhotoUrl ? (
                            <Image src={b.profilePhotoUrl} alt={name} fill className="object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-xl text-[#0a0a0a]" style={{ background: '#E8491D' }}>
                              {name[0]}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className={`font-black text-sm truncate ${isSelected ? 'text-[#E8491D]' : 'text-white'}`}>{name}</div>
                          <div className="text-xs font-bold mt-0.5">
                            {(b.reviewCount ?? 0) > 0 ? (
                              <span className="text-brand-yellow">
                                {'★'.repeat(Math.round(b.rating ?? 0))} {b.rating?.toFixed(1)} ({b.reviewCount})
                              </span>
                            ) : (
                              <span className="text-[#555]">{t('status.newBadge')}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {b.specialties && b.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {b.specialties.slice(0, 3).map(s => (
                            <span key={s} className="bg-brand-yellow/10 text-brand-yellow text-[10px] font-black px-1.5 py-0.5 rounded border border-brand-yellow/20">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {b.languages && b.languages.length > 0 && (
                        <div className="text-[11px] text-[#555] font-bold mb-2">
                          {b.languages.join(' · ')}
                        </div>
                      )}

                      {yrs !== null && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#888]">
                          <span>{yrs} {t('misc.yearsExp')}</span>
                          {b.experienceVerified && (
                            <span title="Verified" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between mt-2">
              <button onClick={() => setStep(2)} className="text-[#888] font-bold text-sm hover:text-white transition-colors">
                {t('booking.back')}
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!selectedBarberId}
                className="bg-brand-yellow text-[#0a0a0a] px-8 py-3.5 rounded-full font-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
              >
                {t('booking.next')}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4 — Review & confirm ─────────────────────────────────────── */}
        {step === 4 && (
          <div className="animate-fadeUp">
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none' }}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <h1 className="text-3xl font-black mb-8">{t('booking.reviewYourBooking')}</h1>

            <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden mb-6">

              {/* Shop */}
              <div className="flex items-center gap-4 p-5 border-b border-[#1e1e1e]">
                <div className="relative w-11 h-11 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center">
                  {shop.logoUrl ? (
                    <Image src={shop.logoUrl} alt={shop.name ?? ''} fill className="object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xl">🏪</span>
                  )}
                </div>
                <div>
                  <div className="font-black text-white text-[15px]">{shop.name}</div>
                  <div className="text-xs font-bold text-[#555] mt-0.5">{t('booking.bookingViaShopLabel')}</div>
                </div>
              </div>

              {/* Barber */}
              <div className="flex items-center gap-4 p-5 border-b border-[#1e1e1e]">
                <div className="relative w-11 h-11 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center">
                  {selectedBarber?.profilePhotoUrl ? (
                    <Image src={selectedBarber.profilePhotoUrl} alt="" fill className="object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xl">✂️</span>
                  )}
                </div>
                <div>
                  <div className="font-black text-white text-[15px]">
                    {selectedBarber ? `${selectedBarber.firstName ?? ''} ${selectedBarber.lastName ?? ''}`.trim() : t('misc.barberFallback')}
                  </div>
                  <div className="text-xs font-bold text-[#555] mt-0.5">{t('booking.yourBarber')}</div>
                </div>
              </div>

              {/* Service */}
              <div className="p-5 border-b border-[#1e1e1e]">
                <div className="text-[10px] font-extrabold text-[#555] tracking-widest uppercase mb-3">{t('booking.serviceLabel')}</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">{selectedService?.name}</div>
                    <div className="text-[11px] text-[#555]">⏱ {selectedDuration} {t('misc.minShort')}</div>
                  </div>
                  <div className="font-black text-[#F5C518] text-sm">{currency}{selectedPrice}</div>
                </div>
              </div>

              {/* Date & time */}
              <div className="p-5 border-b border-[#1e1e1e]">
                <div className="text-[10px] font-extrabold text-[#555] tracking-widest uppercase mb-3">{t('booking.dateAndTime')}</div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span style={{ fontSize: 15 }}>📅</span>
                  <span className="font-bold text-white text-sm">{formatFullDate(selectedDate, dateLocale)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 15 }}>⏰</span>
                  <span className="font-bold text-white text-sm">
                    {selectedTime} → {selectedEndTime || calcEndTime(selectedTime, selectedDuration)}
                  </span>
                  <span className="text-[11px] text-[#555]">({selectedDuration} {t('misc.minShort')})</span>
                </div>
              </div>

              {/* Payment */}
              <div className="p-5">
                <div className="text-[10px] font-extrabold text-[#555] tracking-widest uppercase mb-3">{t('booking.payment')}</div>
                <div className="flex items-start gap-3">
                  <span style={{ fontSize: 15 }}>💵</span>
                  <div>
                    <div className="font-black text-[#F5C518] text-lg">{currency}{selectedPrice}</div>
                    <div className="text-xs font-bold text-[#555] mt-0.5">{t('booking.cashOnlyShort')}</div>
                    <div className="text-xs text-[#444] mt-0.5">{t('booking.payDirectly')}</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full bg-brand-yellow text-[#0a0a0a] py-4 rounded-full font-black text-[15px] transition-all hover:opacity-90 disabled:opacity-50"
            >
              {confirming ? t('booking.confirming') : t('booking.confirmBooking')}
            </button>

            {bookingError && (
              <div className="mt-4 p-3 rounded-xl bg-[#1a0808] border border-[#EF4444]/40 text-[#EF4444] text-xs font-bold text-center">
                {bookingError}
              </div>
            )}

            <button
              disabled={confirming}
              onClick={() => setStep(3)}
              className="w-full mt-4 text-[#888] font-bold text-sm hover:text-white transition-colors disabled:opacity-50"
            >
              {t('booking.changeBarber')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
