'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { collection, doc, query, where, updateDoc, writeBatch, increment, onSnapshot, orderBy, addDoc, arrayUnion, arrayRemove, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingUpdateSchema, notificationSchema, barberUpdateSchema } from "@/lib/schemas";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { getLocalDateString, getTimezoneFromLocation } from '@/lib/schedule-utils';
import { cleanupBookingLock } from '@/lib/booking-lock-utils';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import type { Booking, Notification } from '@/lib/types';
import { useLang } from '@/lib/i18n/LangContext';

function getCurrencySymbol(currency?: string): string {
  const s: Record<string, string> = {
    'EUR': '€', 'GBP': '£', 'USD': '$', 'MAD': 'MAD ', 'DZD': 'DA ',
    'TND': 'DT ', 'SAR': 'SAR ', 'AED': 'AED ', 'SEK': 'kr ', 'NOK': 'kr ', 'DKK': 'kr ', 'CHF': 'CHF ',
  };
  return s[(currency || 'EUR').toUpperCase()] ?? ((currency || 'EUR') + ' ');
}

function timeAgo(ts: number, t: (path: string) => string): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return t('misc.justNow');
  if (mins < 60) return t('misc.minsAgo').replace('{n}', String(mins));
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('misc.hoursAgo').replace('{n}', String(hours));
  if (hours < 48) return t('settings.yesterday');
  return t('misc.daysAgo').replace('{n}', String(Math.floor(hours / 24)));
}

function generateDateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const current = new Date(from + 'T00:00:00');
  const end = new Date(to + 'T00:00:00');
  while (current <= end) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function BarberDashboardPage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { t, lang } = useLang();
  const dateLocale = lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-US';
  const [now, setNow] = useState(new Date());
  const [recentNotifs, setRecentNotifs] = useState<(Notification & { id: string })[]>([]);
  const [bookings, setBookings] = useState<(Booking & { id: string })[]>([]);
  const [myAppointments, setMyAppointments] = useState<any[]>([]);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockFrom, setBlockFrom] = useState('');
  const [blockTo, setBlockTo] = useState('');
  const [blockReason, setBlockReason] = useState<string | null>(null);
  const [blockRecurring, setBlockRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const [blockLoading, setBlockLoading] = useState(false);
  const [rangeError, setRangeError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

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
      const q = query(collection(db, 'services'), where("providerId", "==", user!.uid));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
    enabled: !!user
  });

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'bookings'),
      where('barberId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookings(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Booking & { id: string })));
    });
    return () => unsubscribe();
  }, [user?.uid]);

  // Bookings the barber made AS A CLIENT (booking another barber).
  // Requires composite index: clientId ASC + status ASC + date ASC.
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'bookings'),
      where('clientId', '==', user.uid),
      where('status', 'in', ['pending', 'confirmed']),
      orderBy('date', 'asc')
    );
    const unsub = onSnapshot(q, snap => {
      setMyAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    });
    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setRecentNotifs(snap.docs.slice(0, 10).map(d => ({ id: d.id, ...d.data() } as Notification & { id: string })));
    });
    return () => unsub();
  }, [user?.uid]);

  const mutateSchedule = () => queryClient.invalidateQueries({ queryKey: ['schedule', user?.uid] });

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const timeNow = Date.now();
      const booking = bookings.find((b: any) => b.id === id);

      const batch = writeBatch(db);
      batch.update(doc(db, 'bookings', id), bookingUpdateSchema.parse({ status, updatedAt: timeNow }));

      await batch.commit();

      // Clean up the booking lock slot so the time becomes bookable again
      if (status.startsWith('cancelled') && booking) {
        await cleanupBookingLock({
          barberId: booking.barberId || user!.uid,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          id,
        });
      }

      if (booking?.clientId && (status === 'confirmed' || status === 'cancelled_by_barber')) {
        const message = status === 'confirmed'
          ? `Your booking on ${booking.date} at ${booking.startTime} has been confirmed by your barber. See you there!`
          : `Your booking on ${booking.date} at ${booking.startTime} was cancelled by your barber.`;
        await addDoc(collection(db, 'notifications'), notificationSchema.parse({
          userId: booking.clientId,
          message,
          read: false,
          linkTo: '/dashboard/client',
          createdAt: Date.now()
        }));
        updateDoc(doc(db, 'users', booking.clientId), { unreadCount: increment(1) }).catch(console.error);
      }
    } catch (e: any) { console.error('Error updating status', e); }
  };

  const closeBlockModal = () => {
    setBlockModalOpen(false);
    setBlockFrom(''); setBlockTo('');
    setBlockReason(null); setBlockRecurring(false);
    setRecurringDays([]); setRangeError('');
  };

  const handleBlockDay = async () => {
    if (!blockFrom || !user) return;

    let datesToBlock: string[] = [blockFrom];
    if (blockTo && blockTo !== blockFrom) {
      if (blockTo < blockFrom) { setRangeError(t('barberDash.blockEndBeforeStart')); return; }
      datesToBlock = generateDateRange(blockFrom, blockTo);
      if (datesToBlock.length > 30) { setRangeError(t('barberDash.blockMaxPeriod')); return; }
    }
    setRangeError('');

    const rawBlocked: any[] = (schedule as any)?.blockedDates || [];
    const existingDates = rawBlocked.map((item: any) => typeof item === 'string' ? item : item.date);
    const dupes = datesToBlock.filter(d => existingDates.includes(d));
    if (dupes.length > 0) {
      setToastMessage(t('barberDash.alreadyBlocked').replace('{date}', dupes.join(', ')));
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    const conflicts = bookings.filter(b =>
      datesToBlock.includes(b.date) && ['pending', 'confirmed'].includes(b.status)
    );
    if (conflicts.length > 0) {
      const times = conflicts.map(b => `${b.date} ${b.startTime}`).join(', ');
      setToastMessage(t('barberDash.activeBookingsBlock').replace('{date}', times));
      setTimeout(() => setToastMessage(''), 5000);
      return;
    }

    setBlockLoading(true);
    try {
      const items = datesToBlock.map(d => ({ date: d, reason: blockReason || null }));
      await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { blockedDates: arrayUnion(...items) });
      if (blockRecurring && recurringDays.length > 0) {
        await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { recurringBlocked: arrayUnion(...recurringDays) });
      }
      setToastMessage(datesToBlock.length === 1
        ? t('barberDash.dayBlocked').replace('{date}', blockFrom)
        : t('barberDash.nDaysBlocked').replace('{n}', String(datesToBlock.length)));
      setTimeout(() => setToastMessage(''), 4000);
      closeBlockModal();
      mutateSchedule();
    } catch (e) {
      setToastMessage(t('barberDash.failedBlockDates'));
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblockDay = async (rawItem: any) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { blockedDates: arrayRemove(rawItem) });
      setToastMessage(t('barberDash.dayUnblocked'));
      setTimeout(() => setToastMessage(''), 3000);
      mutateSchedule();
    } catch (e) {
      setToastMessage(t('barberDash.failedUnblock'));
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleUnblockRecurring = async (day: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { recurringBlocked: arrayRemove(day) });
      setToastMessage(t('barberDash.namedDayUnblocked').replace('{day}', day));
      setTimeout(() => setToastMessage(''), 3000);
      mutateSchedule();
    } catch (e) {
      setToastMessage(t('barberDash.failedUnblockGeneral'));
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const todayStr = getLocalDateString(getTimezoneFromLocation(appUser?.city, appUser?.country));
  const hasAvailability = !!(schedule?.availableSlots &&
    Object.keys(schedule.availableSlots as Record<string, any>).some(date => {
      const d = new Date(date); const t = new Date(); t.setHours(0, 0, 0, 0);
      return d >= t && ((schedule.availableSlots as any)[date]?.length || 0) > 0;
    }));

  const currSym = getCurrencySymbol(profile?.currency);

  const todayCompletedBookings = bookings.filter(b => b.date === todayStr && b.status === 'completed');
  const todayEarnings = todayCompletedBookings.reduce((s, b) => s + (b.price || 0), 0);
  const totalCompleted = bookings.filter(b => b.status === 'completed').length;

  const nowDate = new Date();
  const monthStr = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}`;
  const thisMonthCompleted = bookings.filter(b => b.status === 'completed' && b.date?.startsWith(monthStr)).length;

  const totalFinished = bookings.filter(b => ['completed', 'cancelled_by_barber', 'cancelled_by_client'].includes(b.status)).length;
  const showRate = totalFinished > 0 ? Math.round((totalCompleted / totalFinished) * 100) : 100;

  const todayActiveBookings = bookings.filter(b =>
    b.date === todayStr && b.status !== 'cancelled_by_client' && b.status !== 'cancelled_by_barber'
  );
  const motivatingText = todayActiveBookings.length === 0
    ? t('barberDash.scheduleOpen')
    : todayActiveBookings.length === 1 ? t('barberDash.oneCutToday')
    : t('barberDash.nCutsToday').replace('{n}', String(todayActiveBookings.length));

  const nextBooking = [...bookings]
    .filter(b => b.status === 'confirmed' && new Date(`${b.date}T${b.startTime}`) > now)
    .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())[0];

  const getCountdownLabel = (bk: any) => {
    const bt = new Date(`${bk.date}T${bk.startTime}`);
    const diff = bt.getTime() - now.getTime();
    const diffDays = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const day = diffDays === 0 ? t('buttons.today') : diffDays === 1 ? t('misc.tomorrow') : bt.toLocaleDateString(dateLocale, { weekday: 'long' });
    const countdown = diffDays === 0
      ? (hrs > 0
          ? t('misc.inHoursMin').replace('{h}', String(hrs)).replace('{m}', String(mins))
          : t('misc.inMin').replace('{m}', String(mins)))
      : '';
    return { day, countdown };
  };

  const weekStart = (() => {
    const d = new Date(); const wd = d.getDay();
    d.setDate(d.getDate() - wd + (wd === 0 ? -6 : 1)); d.setHours(0, 0, 0, 0); return d;
  })();
  const weeklyChartData = [t('misc.dayMon'), t('misc.dayTue'), t('misc.dayWed'), t('misc.dayThu'), t('misc.dayFri'), t('misc.daySat'), t('misc.daySun')].map((name, i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const earnings = bookings.filter(b => b.date === ds && b.status === 'completed').reduce((s, b) => s + (b.price || 0), 0);
    return { name, earnings, isToday: ds === todayStr };
  });
  const weeklyTotal = weeklyChartData.reduce((s, d) => s + d.earnings, 0);

  const profileItems = [
    { label: '📸 Add a profile photo', tab: 'Settings', done: !!(profile?.profilePhotoUrl || appUser?.photoUrl), pct: 15 },
    { label: '📝 Fill your bio', tab: 'Settings', done: (profile?.bio?.length || 0) > 20, pct: 10 },
    { label: '✂️ Add your services', tab: 'Services', done: (services as any[]).length > 0, pct: 15 },
    { label: '⚡ Set titeZMe Cut price', tab: 'Services', done: !!(profile?.titeZMeCut?.price), pct: 10 },
    { label: '⏰ Set your availability', tab: 'Availability', done: hasAvailability, pct: 15 },
    { label: '🗣 Add your languages', tab: 'Settings', done: (profile?.languages?.length || 0) > 0, pct: 10 },
    { label: '✂️ Add specialties', tab: 'Settings', done: (profile?.specialties?.length || 0) > 0, pct: 10 },
    { label: '😎 Set your vibe', tab: 'Settings', done: (profile?.vibes?.length || 0) > 0, pct: 10 },
    { label: '🔑 Barber code generated', tab: 'Settings', done: !!(profile?.barberCode), pct: 5 },
  ];
  const profilePct = profileItems.filter(item => item.done).reduce((s, item) => s + item.pct, 0);
  const missingItems = profileItems.filter(item => !item.done).slice(0, 3);
  const completedOver24hAgo = !!profile?.profileCompletedAt && Date.now() - (profile.profileCompletedAt as number) > 86400000;

  useEffect(() => {
    if (!user?.uid || !profile || profilePct < 100 || profile.profileCompletedAt) return;
    updateDoc(doc(db, 'barberProfiles', user.uid), { profileCompletedAt: Date.now() }).catch(console.error);
  }, [user?.uid, profile, profilePct]);

  const tabPaths: Record<string, string> = {
    'Settings': '/dashboard/barber/settings',
    'Services': '/dashboard/barber/services',
    'Availability': '/dashboard/barber/availability',
    'Portfolio': '/dashboard/barber/portfolio',
  };

  const recentActivity = [
    ...bookings.slice(0, 5).map(b => ({
      icon: '💈',
      text: t('barberDash.activityBooked')
        .replace('{name}', b.clientName || t('barberDash.clientFallback'))
        .replace('{service}', b.serviceNames?.[0] ? ` ${b.serviceNames[0]}` : '')
        .replace('{date}', b.date),
      ts: b.createdAt || 0,
    })),
    ...recentNotifs.slice(0, 5).map(n => ({
      icon: n.type === 'review_request' ? '⭐' : n.message?.includes('invite') ? '🏪' : '📅',
      text: n.message || '',
      ts: n.createdAt || 0,
    })),
  ].sort((a, b) => b.ts - a.ts).slice(0, 5);

  const todaySchedule = bookings
    .filter(b => b.date === todayStr && !['cancelled_by_client', 'cancelled_by_barber'].includes(b.status))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // ── Approval gate ────────────────────────────────────────────────────────────
  const approvalStatus = (profile as any)?.approvalStatus;

  if (approvalStatus === 'pending') {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <div className="max-w-[500px] w-full bg-[#111] border border-[#F5C51833] rounded-[16px] p-8 text-center">
          <div className="text-[40px] mb-4">⏳</div>
          <h2 className="text-[18px] font-black mb-3">{t('barberDash.profileUnderReview')}</h2>
          <p className="text-[13px] text-[#666] leading-[1.7] mb-6">
            {t('barberDash.profileReviewDesc')}
          </p>
          <div className="h-px bg-[#1e1e1e] mb-5" />
          <p className="text-[11px] text-[#555] font-extrabold uppercase tracking-wider mb-4">{t('barberDash.whileYouWait')}</p>
          <div className="flex flex-col gap-2 items-center">
            {[
              { label: t('barberDash.addServicesLink'), href: '/dashboard/barber/services' },
              { label: t('barberDash.setAvailability'), href: '/dashboard/barber/availability' },
              { label: t('barberDash.writeBio'), href: '/dashboard/barber/settings' },
              { label: t('barberDash.addSocialLinks'), href: '/dashboard/barber/settings' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-[13px] font-bold text-brand-yellow hover:underline">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (approvalStatus === 'rejected') {
    const rejectionReason = (profile as any)?.rejectionReason;
    const handleResubmit = async () => {
      if (!user) return;
      try {
        await updateDoc(doc(db, 'barberProfiles', user.uid), {
          approvalStatus: 'pending',
          rejectionReason: null,
        });
        queryClient.invalidateQueries({ queryKey: ['profile', user.uid] });
        setToastMessage(t('barberDash.profileResubmitted'));
        setTimeout(() => setToastMessage(''), 4000);
      } catch (e) { console.error(e); }
    };
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
        <div className="max-w-[500px] w-full bg-[#111] border border-[#EF444433] rounded-[16px] p-8 text-center">
          <div className="text-[40px] mb-4">❌</div>
          <h2 className="text-[18px] font-black text-brand-red mb-3">{t('barberDash.profileNotApproved')}</h2>
          {rejectionReason && (
            <p className="text-[13px] text-[#888] bg-[#1a0808] border border-[#3b1a1a] rounded-xl px-4 py-3 mb-5 text-left">
              <span className="font-extrabold text-[#aaa]">{t('barberDash.rejectionReason')}</span>{rejectionReason}
            </p>
          )}
          <p className="text-[13px] text-[#666] mb-6">{t('barberDash.updateAndResubmit')}</p>
          <button onClick={handleResubmit} className="bg-brand-yellow text-black font-black px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity">
            {t('barberDash.fixAndResubmit')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeUp p-6 md:p-8 md:px-10 pb-20 md:pb-8">
      {/* Availability warning */}
      {!hasAvailability && (
        <div className="flex items-center justify-between bg-[#1a1500] border border-[#F5C51844] rounded-[12px] px-[18px] py-[14px] mb-5">
          <div>
            <div className="text-[13px] font-extrabold text-brand-yellow">{t('barberDash.availabilityWarning')}</div>
            <div className="text-[11px] text-[#888] font-bold mt-0.5">{t('barberDash.availabilityWarningDesc')}</div>
          </div>
          <Link
            href="/dashboard/barber/availability"
            className="shrink-0 ml-4 bg-brand-yellow text-[#0a0a0a] font-extrabold text-[12px] px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
          >
            {t('barberDash.setAvailability')}
          </Link>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start mb-7 gap-4">
        <div>
          <h1 className="text-2xl font-black">{t('barberDash.goodMorning').replace('{name}', appUser?.firstName || '')}</h1>
          <p className="text-brand-text-secondary text-sm mt-1">{new Date().toLocaleDateString(dateLocale, {weekday: 'long', month: 'long', day: 'numeric'})} · {motivatingText}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`/barber/${user?.uid}`}
            target="_blank" rel="noopener noreferrer"
            className="border border-[#2a2a2a] text-[#888] hover:border-[#F5C518] hover:text-[#F5C518] rounded-full text-[13px] font-extrabold px-5 py-2.5 transition-colors inline-flex items-center"
          >
            {t('barberDash.viewPublicProfile')}
          </a>
          <button onClick={() => setBlockModalOpen(true)} className="bg-brand-orange text-white px-7 py-3 rounded-full font-black text-sm transition-all hover:opacity-90 hover:-translate-y-px">
            {t('barberDash.blockTimeOffBtn')}
          </button>
        </div>
        {/* Upcoming blocked days preview */}
        {(() => {
          const today = getLocalDateString(getTimezoneFromLocation(appUser?.city, appUser?.country));
          const rawBlocked: any[] = (schedule as any)?.blockedDates || [];
          const upcoming = rawBlocked
            .filter((item: any) => (typeof item === 'string' ? item : item.date) >= today)
            .sort((a: any, b: any) => {
              const da = typeof a === 'string' ? a : a.date;
              const db2 = typeof b === 'string' ? b : b.date;
              return da.localeCompare(db2);
            });
          if (upcoming.length === 0) return null;
          const shown = upcoming.slice(0, 3);
          const extra = upcoming.length - 3;
          return (
            <div className="mt-3">
              <div className="text-[11px] font-extrabold text-[#555] uppercase tracking-wide mb-1.5">{t('barberDash.upcomingDaysOff')}</div>
              <div className="flex flex-col gap-1">
                {shown.map((item: any, i: number) => {
                  const d = typeof item === 'string' ? item : item.date;
                  const reason = typeof item === 'string' ? null : item.reason;
                  const [y, m, day] = d.split('-');
                  return (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="text-[#888]">📅 {day}/{m}/{y}{reason ? ` · ${reason}` : ''}</span>
                      <button onClick={() => handleUnblockDay(item)} className="text-brand-orange hover:underline font-bold text-[11px] ml-3">{t('buttons.remove')}</button>
                    </div>
                  );
                })}
                {extra > 0 && (
                  <button onClick={() => setBlockModalOpen(true)} className="text-[11px] text-[#555] hover:text-white transition-colors text-left mt-0.5">
                    {t('barberDash.extraMore').replace('{n}', String(extra))}
                  </button>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Profile completion checklist */}
      {profilePct < 100 && !completedOver24hAgo && (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>{t('barberDash.completeProfile')}</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#F5C518' }}>{profilePct}%</div>
          </div>
          <div style={{ background: '#1e1e1e', borderRadius: '99px', height: '4px', marginBottom: '16px', overflow: 'hidden' }}>
            <div style={{ background: '#F5C518', height: '100%', width: `${profilePct}%`, borderRadius: '99px', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {profileItems.filter((item: any) => !item.done).map((item: any) => (
              <Link
                key={item.label}
                href={tabPaths[item.tab] || '/dashboard/barber/settings'}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888', textDecoration: 'none', padding: '6px 0' }}
              >
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #333', flexShrink: 0 }} />
                {item.label} →
              </Link>
            ))}
          </div>
        </div>
      )}
      {profilePct === 100 && !completedOver24hAgo && (
        <div style={{ background: '#0f2010', border: '1px solid #22C55E33', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🎉</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#22C55E' }}>{t('barberDash.profileComplete')}</div>
            <div style={{ fontSize: '11px', color: '#555' }}>{t('barberDash.readyForBookings')}</div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
          <div className="text-[28px] font-black leading-none text-brand-yellow">{currSym}{todayEarnings}</div>
          <div className="text-xs text-brand-text-secondary font-bold">{t('barberDash.todaysEarnings')}</div>
          <div className="text-[11px] font-extrabold text-[#444] mt-1">{t('barberDash.nCutsTodayKpi').replace('{n}', String(todayCompletedBookings.length))}</div>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
          <div className="text-[28px] font-black leading-none text-brand-orange">{profile?.totalCuts ?? 0}</div>
          <div className="text-xs text-brand-text-secondary font-bold">{t('barberDash.totalCutsLabel')}</div>
          <div className="text-[11px] font-extrabold text-[#444] mt-1">{t('barberDash.cutsThisMonth').replace('{n}', String(thisMonthCompleted))}</div>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
          <div className={`text-[28px] font-black leading-none ${(profile?.rating || 0) > 0 ? 'text-brand-yellow' : 'text-brand-green'}`}>
            {(profile?.rating || 0) > 0 ? `★ ${(profile!.rating as number).toFixed(1)}` : t('status.newBadge')}
          </div>
          <div className="text-xs text-brand-text-secondary font-bold">{t('barberDash.ratingLabel')}</div>
          <div className="text-[11px] font-extrabold text-[#444] mt-1">
            {(profile?.reviewCount || 0) > 0 ? t('barberDash.nReviews').replace('{n}', String(profile!.reviewCount)) : t('barberDash.noReviewsYetShort')}
          </div>
        </div>
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
          <div className="text-[28px] font-black leading-none text-brand-green">{showRate}%</div>
          <div className="text-xs text-brand-text-secondary font-bold">{t('barberDash.showRate')}</div>
          <div className="text-[11px] font-extrabold text-[#444] mt-1">
            {totalFinished > 0 ? t('barberDash.nBookingsTotal').replace('{n}', String(totalFinished)) : t('barberDash.noShows').replace('{n}', '0')}
          </div>
        </div>
      </div>

      {/* Services empty state */}
      {(services as any[]).length === 0 && (
        <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>✂️</div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{t('barberDash.noServicesYet')}</div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px' }}>{t('barberDash.addServicesDesc')}</div>
          <Link href="/dashboard/barber/services" style={{ color: '#F5C518', fontSize: '11px', fontWeight: 800, textDecoration: 'none' }}>{t('barberDash.addServicesLink')}</Link>
        </div>
      )}

      {/* Next appointment countdown */}
      {nextBooking && (() => {
        const { day, countdown } = getCountdownLabel(nextBooking);
        return (
          <div className="flex items-center justify-between bg-[#111] border border-[#1e1e1e] rounded-[12px] px-5 py-[14px] mb-5">
            <div>
              <div className="text-[11px] font-bold text-[#555] mb-0.5">{t('barberDash.nextCutLabel')}</div>
              <div className="font-extrabold text-[14px]">{nextBooking.clientName || t('barberDash.clientFallback')}{nextBooking.serviceNames?.[0] ? ` — ${nextBooking.serviceNames[0]}` : ''}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-bold text-white">{t('barberDash.slotAt').replace('{day}', day).replace('{time}', nextBooking.startTime)}</div>
              {countdown && <div className="text-[12px] font-extrabold text-brand-yellow">{countdown}</div>}
            </div>
          </div>
        );
      })()}

      {/* My Appointments — bookings the barber made as a client */}
      {myAppointments.length > 0 && (
        <div style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {t('barberDash.myAppointments')}
            <span style={{
              background: '#F5C51822',
              color: '#F5C518',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '99px'
            }}>
              {myAppointments.length}
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {myAppointments.map(booking => (
              <div
                key={booking.id}
                style={{
                  background: '#0d0d0d',
                  border: '1px solid #1a1a1a',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#fff',
                    marginBottom: '4px'
                  }}>
                    {booking.barberName || t('booking.yourBarber')}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#555'
                  }}>
                    {booking.date} · {booking.startTime}
                  </div>
                </div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '99px',
                  background: booking.status === 'confirmed' ? '#0f2010' : '#1a1400',
                  color: booking.status === 'confirmed' ? '#22C55E' : '#F5C518'
                }}>
                  {booking.status === 'confirmed' ? t('barberDash.confirmedCheck') : t('status.pending')}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/client"
            style={{
              display: 'block',
              textAlign: 'center',
              fontSize: '11px',
              color: '#555',
              textDecoration: 'none',
              fontWeight: 800,
              marginTop: '12px'
            }}
          >
            {t('barberDash.viewBookingHistory')}
          </Link>
        </div>
      )}

      {/* Today's schedule timeline */}
      <ErrorBoundary section="today's schedule">
      <div className="mb-8">
        <div className="text-[13px] font-extrabold text-white mb-4">{t('barberDash.todaysSchedule')}</div>
        {todaySchedule.length === 0 ? (
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-8 text-center">
            <div className="text-3xl mb-3">💈</div>
            <div className="font-extrabold text-white mb-1">{t('barberDash.noCutsToday')}</div>
            <div className="text-[#555] text-sm mb-4">{t('barberDash.shareProfileToBook')}</div>
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/barber/${user?.uid}`); setToastMessage(t('profile.linkCopiedToast')); setTimeout(() => setToastMessage(''), 2000); }}
              className="text-brand-orange text-sm font-bold hover:underline">
              {t('barberDash.shareProfileLink')}
            </button>
          </div>
        ) : (
          <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
            {todaySchedule.map((b, i) => {
              const dotColor = b.status === 'pending' ? '#F5C518' : b.status === 'confirmed' ? '#22C55E' : '#555';
              return (
                <div key={b.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 px-5 py-3.5 ${i < todaySchedule.length - 1 ? 'border-b border-[#141414]' : ''}`}>
                  <div className="w-12 shrink-0 text-right">
                    <div className="text-[12px] font-bold text-white">{b.startTime}</div>
                    {b.endTime && <div className="text-[11px] text-[#555]">{b.endTime}</div>}
                  </div>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-[14px] text-white truncate">{b.clientName || t('barberDash.clientFallback')}</div>
                    <div className="text-[12px] text-[#666] truncate">{b.serviceNames?.join(', ') || b.serviceName || t('barberDash.serviceFallback')}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {b.status === 'pending' && <span className="text-[10px] font-extrabold text-brand-yellow bg-[#1a1500] border border-brand-yellow/30 px-2 py-0.5 rounded-full">{t('status.pending')}</span>}
                    {b.status === 'confirmed' && <span className="text-[10px] font-extrabold text-[#22C55E] bg-[#0f2010] border border-[#22C55E]/30 px-2 py-0.5 rounded-full">{t('status.confirmed')}</span>}
                    {b.status === 'completed' && <span className="text-[10px] font-extrabold text-[#555] bg-[#141414] border border-[#222] px-2 py-0.5 rounded-full">{t('barberDash.doneStatus')}</span>}
                    <span className="font-black text-brand-yellow text-[13px]">{currSym}{b.price}</span>
                    {b.status === 'pending' && (
                      <>
                        <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="bg-[#0f2010] border border-brand-green/30 text-brand-green rounded-lg px-2.5 py-1.5 text-xs font-extrabold hover:bg-brand-green/20">✓</button>
                        <button onClick={() => updateBookingStatus(b.id, 'cancelled_by_barber')} className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-lg px-2.5 py-1.5 text-xs font-extrabold hover:bg-brand-red/20">✕</button>
                      </>
                    )}
                    {b.status === 'confirmed' && (
                      <button onClick={() => updateBookingStatus(b.id, 'completed')} className="bg-brand-surface border border-brand-border text-white rounded-lg px-2.5 py-1.5 text-xs font-extrabold hover:border-[#444]">{t('barberDash.doneStatus')}</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </ErrorBoundary>

      {/* Recent activity feed */}
      <ErrorBoundary section="recent activity">
      <div className="mt-4">
        <div className="text-[13px] font-extrabold mb-3">{t('barberDash.recentActivity')}</div>
        {recentActivity.length === 0 ? (
          <div className="text-[#555] text-sm text-center py-6">{t('barberDash.noRecentActivity')}</div>
        ) : (
          <div>
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-[10px] py-[10px] border-b border-[#141414] last:border-0">
                <span className="text-base shrink-0">{a.icon}</span>
                <span className="flex-1 text-[13px] text-[#aaa] leading-snug">{a.text}</span>
                <span className="text-[11px] text-[#555] shrink-0">{a.ts ? timeAgo(a.ts, t) : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      </ErrorBoundary>

      {/* Reviews empty state */}
      {(profile?.reviewCount || 0) === 0 && (
        <div style={{ padding: '16px', textAlign: 'center', color: '#444', fontSize: '12px', marginTop: '8px' }}>
          {t('barberDash.noReviewsGetFirst')}
        </div>
      )}

      {/* Weekly earnings chart */}
      <ErrorBoundary section="earnings chart">
      <div className="mt-8 bg-[#111] border border-[#1e1e1e] rounded-[12px] p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px] font-extrabold">{t('barberDash.thisWeeksEarnings')}</span>
          <span className="text-[13px] font-black text-brand-yellow">{currSym}{weeklyTotal}</span>
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={weeklyChartData} barCategoryGap="20%">
            <XAxis dataKey="name" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
              {weeklyChartData.map((entry, index) => (
                <Cell key={index} fill={entry.isToday ? '#F5C518' : '#2a2a2a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      </ErrorBoundary>

      {/* Block time off modal */}
      {blockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-6 w-full max-w-md animate-fadeUp overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-black mb-1">{t('barberDash.blockTimeOffModal')}</h3>
            <p className="text-xs text-[#888] font-bold mb-5">{t('barberDash.blockTimeOffModalDesc')}</p>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="text-[10px] font-extrabold text-brand-text-secondary uppercase tracking-wider block mb-1.5">{t('barberDash.fromLabel')}</label>
                <input type="date" min={getLocalDateString(getTimezoneFromLocation(appUser?.city, appUser?.country))} value={blockFrom}
                  onChange={e => { setBlockFrom(e.target.value); setRangeError(''); }}
                  className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-brand-yellow transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-brand-text-secondary uppercase tracking-wider block mb-1.5">{t('barberDash.toOptional')}</label>
                <input type="date" min={blockFrom || getLocalDateString(getTimezoneFromLocation(appUser?.city, appUser?.country))} value={blockTo}
                  onChange={e => { setBlockTo(e.target.value); setRangeError(''); }}
                  className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-brand-yellow transition-colors" />
              </div>
            </div>
            {rangeError && <div className="text-[11px] text-brand-red font-bold mb-3">{rangeError}</div>}

            <div className="mb-4 mt-3">
              <label className="text-[10px] font-extrabold text-brand-text-secondary uppercase tracking-wider block mb-2">{t('forms.reason')}</label>
              <div className="flex flex-wrap gap-2">
                {[t('barberDash.reasonVacation'), t('barberDash.reasonSick'), t('barberDash.reasonPersonal'), t('barberDash.reasonHoliday'), t('barberDash.reasonOther')].map(r => (
                  <button key={r} onClick={() => setBlockReason(prev => prev === r ? null : r)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${blockReason === r ? 'bg-[#1a1500] border-brand-yellow text-brand-yellow' : 'border-[#2a2a2a] text-[#888] hover:border-[#444] hover:text-white'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold text-brand-text-secondary uppercase tracking-wider">{t('barberDash.recurringBlock')}</span>
                <label className="relative w-10 h-5 cursor-pointer shrink-0">
                  <input type="checkbox" checked={blockRecurring} onChange={e => setBlockRecurring(e.target.checked)} className="peer sr-only" />
                  <span className="absolute inset-0 bg-[#2a2a2a] rounded-full transition-colors peer-checked:bg-brand-yellow" />
                  <span className="absolute w-4 h-4 left-0.5 top-0.5 bg-white rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-[#0a0a0a]" />
                </label>
              </div>
              {blockRecurring && (
                <div className="flex flex-wrap gap-1.5">
                  {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map((day, i) => {
                    const labels = [t('misc.dayMon'), t('misc.dayTue'), t('misc.dayWed'), t('misc.dayThu'), t('misc.dayFri'), t('misc.daySat'), t('misc.daySun')];
                    return (
                      <button key={day} onClick={() => setRecurringDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${recurringDays.includes(day) ? 'bg-[#1a1500] border-brand-yellow text-brand-yellow' : 'border-[#2a2a2a] text-[#888] hover:border-[#444] hover:text-white'}`}>
                        {labels[i]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {(() => {
              const count = !blockFrom ? 0 : (!blockTo || blockTo === blockFrom) ? 1 : generateDateRange(blockFrom, blockTo).length;
              const label = blockLoading ? '...' : count > 1 ? t('barberDash.blockNDays').replace('{n}', String(count)) : t('barberDash.blockThisDay');
              return (
                <button onClick={handleBlockDay} disabled={!blockFrom || blockLoading}
                  className="w-full bg-brand-yellow text-[#0a0a0a] font-black py-3 rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-40 mb-5">
                  {label}
                </button>
              );
            })()}

            <div className="h-px bg-[#1e1e1e] mb-4" />

            {(() => {
              const rawBlocked: any[] = (schedule as any)?.blockedDates || [];
              const rawRecurring: string[] = (schedule as any)?.recurringBlocked || [];
              if (rawBlocked.length === 0 && rawRecurring.length === 0) return null;
              return (
                <div className="mb-5">
                  <div className="text-[11px] font-bold text-[#555] mb-2">{t('barberDash.currentlyBlockedDays')}</div>
                  <div className="flex flex-wrap gap-2">
                    {rawBlocked.map((item: any, i: number) => {
                      const d = typeof item === 'string' ? item : item.date;
                      const reason = typeof item === 'string' ? null : item.reason;
                      const [y, m, day] = d.split('-');
                      return (
                        <span key={i} className="inline-flex items-center gap-1.5 bg-[#1a0808] border border-[#EF444433] rounded-full px-[10px] py-1 text-[11px] text-[#EF4444]">
                          {day}/{m}/{y}{reason ? ` ${reason}` : ''}
                          <button onClick={() => handleUnblockDay(item)} className="text-[#EF4444] hover:text-white transition-colors leading-none">✕</button>
                        </span>
                      );
                    })}
                    {rawRecurring.map((day: string) => (
                      <span key={day} className="inline-flex items-center gap-1.5 bg-[#1a0808] border border-[#EF444433] rounded-full px-[10px] py-1 text-[11px] text-[#EF4444]">
                        🔄 Every {day}
                        <button onClick={() => handleUnblockRecurring(day)} className="text-[#EF4444] hover:text-white transition-colors leading-none">✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            <button onClick={closeBlockModal} disabled={blockLoading}
              className="w-full border border-[#2a2a2a] text-[#888] font-bold py-3 rounded-full text-sm hover:border-[#444] hover:text-white transition-colors">
              {t('buttons.cancel')}
            </button>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#1a0808] border border-brand-yellow/30 text-brand-yellow px-6 py-3 rounded-full font-bold text-sm shadow-xl animate-fadeUp z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
