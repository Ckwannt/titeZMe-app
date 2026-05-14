'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { collection, doc, query, where, updateDoc, deleteDoc, setDoc, getDoc, getDocs, writeBatch, increment, onSnapshot, orderBy, addDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarberInvitesTab } from '@/components/BarberInvitesTab';
import { BarberPortfolioTab } from '@/components/BarberPortfolioTab';
import { BarberSettingsTab } from '@/components/BarberSettingsTab';
import { BookingRowSkeleton, StatCardSkeleton } from '@/components/skeletons';
import { barberUpdateSchema, bookingUpdateSchema, notificationSchema } from "@/lib/schemas";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

function getCurrencySymbol(currency?: string): string {
  const s: Record<string, string> = {
    'EUR': '€', 'GBP': '£', 'USD': '$', 'MAD': 'MAD ', 'DZD': 'DA ',
    'TND': 'DT ', 'SAR': 'SAR ', 'AED': 'AED ', 'SEK': 'kr ', 'NOK': 'kr ', 'DKK': 'kr ', 'CHF': 'CHF ',
  };
  return s[(currency || 'EUR').toUpperCase()] ?? ((currency || 'EUR') + ' ');
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return 'Yesterday';
  return `${Math.floor(hours / 24)}d ago`;
}

function generateDateRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const current = new Date(from + 'T00:00:00');
  const end = new Date(to + 'T00:00:00');
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function BarberDashboard() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [bookingsTab, setBookingsTab] = useState("today");
  
  // Services State
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("");
  const [titzData, setTitzData] = useState({ duration: "45", price: "20" });
  const [isSavingTitz, setIsSavingTitz] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockFrom, setBlockFrom] = useState('');
  const [blockTo, setBlockTo] = useState('');
  const [blockReason, setBlockReason] = useState<string | null>(null);
  const [blockRecurring, setBlockRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const [blockLoading, setBlockLoading] = useState(false);
  const [rangeError, setRangeError] = useState('');
  const [bookingsStatusFilter, setBookingsStatusFilter] = useState('all');
  const [bookingsSearch, setBookingsSearch] = useState('');
  const [now, setNow] = useState(new Date());
  const [recentNotifs, setRecentNotifs] = useState<any[]>([]);

  const handleCopyCode = () => {
    if (profile?.barberCode) {
      navigator.clipboard.writeText(profile.barberCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'barberProfiles', user!.uid));
      const data = snap.exists() ? snap.data() : null;
      if (data?.titeZMeCut) {
        setTitzData({
          duration: data.titeZMeCut.durationMinutes?.toString() || "45",
          price: data.titeZMeCut.price?.toString() || "20"
        });
      }
      return data;
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

  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'bookings'),
      where('barberId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookings(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [user?.uid]);

  // Countdown: tick every minute
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  // Recent notifications (for activity feed)
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, snap => {
      setRecentNotifs(snap.docs.slice(0, 10).map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user?.uid]);

  const mutateProfile = () => queryClient.invalidateQueries({ queryKey: ['profile', user?.uid] });
  const mutateServices = () => queryClient.invalidateQueries({ queryKey: ['services', user?.uid] });
  const mutateSchedule = () => queryClient.invalidateQueries({ queryKey: ['schedule', user?.uid] });

  const updateBookingStatus = async (id: string, status: string) => {
    try { 
      const timeNow = Date.now();
      const booking = bookings.find((b: any) => b.id === id);
      
      const batch = writeBatch(db);
      batch.update(doc(db, 'bookings', id), bookingUpdateSchema.parse({ status, updatedAt: timeNow })); 
      
      if (status === 'completed' && booking && booking.status !== 'completed' && user) {
        batch.update(doc(db, 'barberProfiles', user.uid), { 
          totalCuts: increment(1)
        });
        
        if (profile?.shopId) {
          batch.update(doc(db, 'barbershops', profile.shopId), {
            totalBookings: increment(1)
          });
        }

        // Monthly Aggregations
        const dateObj = new Date(booking.date || timeNow);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const aggRef = doc(db, 'aggregations', `${user.uid}_${yyyy}_${mm}`);
        
        // Use set with merge: true in batch to handle document creation if it doesn't exist
        batch.set(aggRef, {
          totalCuts: increment(1),
          totalRevenue: increment(Number(booking.price) || 0),
          totalHours: increment((Number(booking.duration) || 30) / 60)
        }, { merge: true });
      }
      
      await batch.commit();
      // onSnapshot listener updates bookings state automatically

      // Notify client on accept or decline
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
      }
    }
    catch (e: any) { console.error('Error updating status', e); }
  };

  const addService = async () => {
    if (!newServiceName || !newServicePrice || !user) return;
    try {
      const ref = doc(collection(db, 'services'));
      await setDoc(ref, {
        providerId: user.uid,
        providerType: 'barber',
        name: newServiceName,
        duration: parseInt(newServiceDuration) || 30,
        price: parseFloat(newServicePrice),
        isActive: true
      });
      setNewServiceName(""); setNewServicePrice(""); setNewServiceDuration("");
      queryClient.invalidateQueries({ queryKey: ['services', user?.uid] });
    } catch (e) {
      console.error(e);
    }
  };

  const saveLiveStatus = async (isLive: boolean) => {
    if (!user) return;
    try { 
      await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({ isLive }));
      queryClient.invalidateQueries({ queryKey: ['profile', user?.uid] });
      setToastMessage(isLive ? "You are now accepting bookings ✓" : "Bookings paused");
      setTimeout(() => setToastMessage(''), 3000);
    }
    catch(e) { console.error(e); }
  }

  const closeBlockModal = () => {
    setBlockModalOpen(false);
    setBlockFrom(''); setBlockTo('');
    setBlockReason(null); setBlockRecurring(false);
    setRecurringDays([]); setRangeError('');
  };

  const handleBlockDay = async () => {
    if (!blockFrom || !user) return;

    // Build date list (single or range)
    let datesToBlock: string[] = [blockFrom];
    if (blockTo && blockTo !== blockFrom) {
      if (blockTo < blockFrom) { setRangeError('End date must be after start date.'); return; }
      datesToBlock = generateDateRange(blockFrom, blockTo);
      if (datesToBlock.length > 30) { setRangeError('Maximum block period is 30 days.'); return; }
    }
    setRangeError('');

    // Duplicate check
    const rawBlocked: any[] = (schedule as any)?.blockedDates || [];
    const existingDates = rawBlocked.map((item: any) => typeof item === 'string' ? item : item.date);
    const dupes = datesToBlock.filter(d => existingDates.includes(d));
    if (dupes.length > 0) {
      setToastMessage(`Already blocked: ${dupes.join(', ')}`);
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    // Booking conflict check — uses already-loaded bookings, no extra Firestore read
    const conflicts = bookings.filter(b =>
      datesToBlock.includes(b.date) && ['pending', 'confirmed'].includes(b.status)
    );
    if (conflicts.length > 0) {
      const times = conflicts.map(b => `${b.date} ${b.startTime}`).join(', ');
      setToastMessage(`Active bookings on ${times}. Cancel or complete them first.`);
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
      setToastMessage(datesToBlock.length === 1 ? `${blockFrom} blocked.` : `${datesToBlock.length} days blocked.`);
      setTimeout(() => setToastMessage(''), 4000);
      closeBlockModal();
      mutateSchedule();
    } catch (e) {
      setToastMessage('Failed to block date(s).');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblockDay = async (rawItem: any) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { blockedDates: arrayRemove(rawItem) });
      setToastMessage('Day unblocked.');
      setTimeout(() => setToastMessage(''), 3000);
      mutateSchedule();
    } catch (e) {
      setToastMessage('Failed to unblock date.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleUnblockRecurring = async (day: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { recurringBlocked: arrayRemove(day) });
      setToastMessage(`${day} unblocked.`);
      setTimeout(() => setToastMessage(''), 3000);
      mutateSchedule();
    } catch (e) {
      setToastMessage('Failed to unblock.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  if (!profile && !loading && user) {
    return (
      <div className="flex min-h-[calc(100vh-53px)] flex-col md:flex-row">
        <div className="w-full md:w-[220px] md:border-r border-brand-border p-6 shrink-0 flex flex-col">
          <div className="flex items-center gap-3 mb-7 px-2">
             <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] animate-pulse"></div>
             <div>
               <div className="h-4 w-24 bg-[#2a2a2a] rounded animate-pulse mb-1"></div>
               <div className="h-3 w-12 bg-[#2a2a2a] rounded animate-pulse"></div>
             </div>
          </div>
        </div>
        <div className="flex-1 p-6 md:p-8 md:px-10">
          <div className="max-w-[700px]">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <div className="h-8 w-48 bg-[#2a2a2a] rounded-lg animate-pulse mb-6"></div>
            {[1, 2, 3].map((i) => <BookingRowSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const getDateRange = (tab: string) => {
    const now = new Date();
    if (tab === 'today') {
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      const end = new Date(now); end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (tab === 'this week') {
      const start = new Date(now);
      const day = start.getDay();
      start.setDate(start.getDate() - day + (day === 0 ? -6 : 1));
      start.setHours(0, 0, 0, 0);
      const end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (tab === 'this month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    return null;
  };

  // Dashboard tab: today's schedule timeline
  const todaySchedule = bookings
    .filter(b => b.date === todayStr && !['cancelled_by_client', 'cancelled_by_barber'].includes(b.status))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Bookings tab: filtered list with time + status + search
  const bookingsFilteredList = bookings.filter(b => {
    const range = getDateRange(bookingsTab);
    if (range) {
      const bd = new Date(`${b.date}T${b.startTime}`);
      if (!(bd >= range.start && bd <= range.end)) return false;
    }
    if (bookingsStatusFilter !== 'all') {
      if (bookingsStatusFilter === 'cancelled') {
        if (!['cancelled_by_client', 'cancelled_by_barber', 'cancelled'].includes(b.status)) return false;
      } else if (b.status !== bookingsStatusFilter) return false;
    }
    if (bookingsSearch.trim()) {
      const q = bookingsSearch.trim().toLowerCase();
      const name = (b.clientName || '').toLowerCase();
      const svc = (b.serviceNames?.[0] || b.serviceName || '').toLowerCase();
      if (!name.includes(q) && !svc.includes(q) && !(b.date || '').includes(q)) return false;
    }
    return true;
  }).sort((a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime());

  // Bookings tab stat counts
  const booksThisMonth = bookings.filter(b => b.date?.startsWith(monthStr)).length;
  const booksPending = bookings.filter(b => b.status === 'pending').length;
  const booksCompleted = bookings.filter(b => b.status === 'completed').length;
  const booksCancelled = bookings.filter(b => ['cancelled_by_client', 'cancelled_by_barber', 'cancelled'].includes(b.status)).length;

  // CSV export (currently filtered bookings)
  const exportCSV = () => {
    const headers = ['Date', 'Time', 'Client Name', 'Service', 'Duration', 'Price', 'Currency', 'Status'];
    const rows = bookingsFilteredList.map(b => [
      b.date || '', b.startTime || '', b.clientName || '',
      b.serviceNames?.join(', ') || b.serviceName || '',
      b.totalDuration || '', b.price ?? 0,
      profile?.currency || 'EUR', b.status || '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `bookings-${todayStr}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const saveTitzCut = async () => {
    if (!user) return;
    setIsSavingTitz(true);
    try {
      await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({
              titeZMeCut: {
                durationMinutes: parseInt(titzData.duration) || 45,
                price: parseFloat(titzData.price) || 20,
                currency: 'EUR'
              }
            }));
      mutateProfile();
    } catch(e) {
      console.error(e);
    }
    setIsSavingTitz(false);
  };

  // Availability check — only future dates count
  const todayStr = new Date().toISOString().split('T')[0];
  const hasAvailability = !!(schedule?.availableSlots &&
    Object.keys(schedule.availableSlots as Record<string, any>).some(date => {
      const d = new Date(date); const t = new Date(); t.setHours(0, 0, 0, 0);
      return d >= t && ((schedule.availableSlots as any)[date]?.length || 0) > 0;
    }));

  // Currency
  const currSym = getCurrencySymbol(profile?.currency);

  // Today's stats
  const todayCompletedBookings = bookings.filter(b => b.date === todayStr && b.status === 'completed');
  const todayEarnings = todayCompletedBookings.reduce((s, b) => s + (b.price || 0), 0);
  const totalCompleted = bookings.filter(b => b.status === 'completed').length;

  // Monthly cuts
  const nowDate = new Date();
  const monthStr = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}`;
  const thisMonthCompleted = bookings.filter(b => b.status === 'completed' && b.date?.startsWith(monthStr)).length;

  // Show rate
  const totalFinished = bookings.filter(b => ['completed', 'cancelled_by_barber', 'cancelled_by_client'].includes(b.status)).length;
  const showRate = totalFinished > 0 ? Math.round((totalCompleted / totalFinished) * 100) : 100;

  // Motivating text
  const todayActiveBookings = bookings.filter(b =>
    b.date === todayStr && b.status !== 'cancelled_by_client' && b.status !== 'cancelled_by_barber'
  );
  const motivatingText = todayActiveBookings.length === 0
    ? "Your schedule is open today — share your profile! 💈"
    : todayActiveBookings.length === 1 ? "1 cut today. Let's go! 💈"
    : `${todayActiveBookings.length} cuts today. Let's go! 💈`;

  // Next confirmed booking
  const nextBooking = [...bookings]
    .filter(b => b.status === 'confirmed' && new Date(`${b.date}T${b.startTime}`) > now)
    .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())[0];

  const getCountdownLabel = (bk: any) => {
    const bt = new Date(`${bk.date}T${bk.startTime}`);
    const diff = bt.getTime() - now.getTime();
    const diffDays = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const day = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : bt.toLocaleDateString(undefined, { weekday: 'long' });
    const countdown = diffDays === 0 ? (hrs > 0 ? `in ${hrs}h ${mins}min` : `in ${mins}min`) : '';
    return { day, countdown };
  };

  // Weekly earnings chart data
  const weekStart = (() => {
    const d = new Date(); const wd = d.getDay();
    d.setDate(d.getDate() - wd + (wd === 0 ? -6 : 1)); d.setHours(0, 0, 0, 0); return d;
  })();
  const weeklyChartData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((name, i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
    const ds = d.toISOString().split('T')[0];
    const earnings = bookings.filter(b => b.date === ds && b.status === 'completed').reduce((s, b) => s + (b.price || 0), 0);
    return { name, earnings, isToday: ds === todayStr };
  });
  const weeklyTotal = weeklyChartData.reduce((s, d) => s + d.earnings, 0);

  // Profile completion
  const profileItems = [
    { label: '📸 Add a profile photo', tab: 'Settings', done: !!(profile?.profilePhotoUrl || appUser?.photoUrl), pct: 10 },
    { label: '📝 Fill your bio', tab: 'Settings', done: (profile?.bio?.length || 0) > 20, pct: 10 },
    { label: '✂️ Add your services', tab: 'Services', done: services.length > 0, pct: 10 },
    { label: '⚡ Set titeZMe Cut price', tab: 'Services', done: !!(profile?.titeZMeCut?.price), pct: 10 },
    { label: '⏰ Set your availability', tab: 'Availability', done: hasAvailability, pct: 15 },
    { label: '🖼️ Add portfolio photos', tab: 'Portfolio', done: (profile?.photos?.length || 0) > 0, pct: 10 },
    { label: '🗣 Add your languages', tab: 'Settings', done: (profile?.languages?.length || 0) > 0, pct: 10 },
    { label: '✂️ Add specialties', tab: 'Settings', done: (profile?.specialties?.length || 0) > 0, pct: 10 },
    { label: '😎 Set your vibe', tab: 'Settings', done: (profile?.vibes?.length || 0) > 0, pct: 10 },
    { label: '🔑 Barber code generated', tab: 'Settings', done: !!(profile?.barberCode), pct: 5 },
  ];
  const profilePct = profileItems.filter(item => item.done).reduce((s, item) => s + item.pct, 0);
  const missingItems = profileItems.filter(item => !item.done).slice(0, 3);

  // Recent activity (mix bookings + notifications)
  const recentActivity = [
    ...bookings.slice(0, 5).map(b => ({
      icon: '💈',
      text: `${b.clientName || 'A client'} booked${b.serviceNames?.[0] ? ` a ${b.serviceNames[0]}` : ''} for ${b.date}`,
      ts: b.createdAt || 0,
    })),
    ...recentNotifs.slice(0, 5).map(n => ({
      icon: n.type === 'review_request' ? '⭐' : n.message?.includes('invite') ? '🏪' : '📅',
      text: n.message || '',
      ts: n.createdAt || 0,
    })),
  ].sort((a, b) => b.ts - a.ts).slice(0, 5);
  
  const statusMap: Record<string, {text:string, bg:string, border:string}> = {
    completed: { text: "text-brand-green", bg: "bg-[#0f2010]", border: "border-brand-green/30" },
    confirmed: { text: "text-brand-yellow", bg: "bg-[#1a1500]", border: "border-brand-yellow/30" },
    pending: { text: "text-brand-orange", bg: "bg-[#1a0800]", border: "border-brand-orange/30" },
    cancelled: { text: "text-brand-red", bg: "bg-[#1a0808]", border: "border-brand-red/30" },
    cancelled_by_client: { text: "text-brand-red", bg: "bg-[#1a0808]", border: "border-brand-red/30" },
    cancelled_by_barber: { text: "text-brand-red", bg: "bg-[#1a0808]", border: "border-brand-red/30" },
  };
  const borderColorMap: Record<string, string> = {
    completed: "border-l-brand-green",
    confirmed: "border-l-brand-yellow",
    pending: "border-l-brand-orange",
    cancelled: "border-l-brand-red",
    cancelled_by_client: "border-l-brand-red",
    cancelled_by_barber: "border-l-brand-red",
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
              <div className="text-[11px] text-brand-green font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" /> Live</div>
            ) : (
              <div className="text-[11px] text-brand-text-secondary font-bold flex items-center gap-1">Hidden</div>
            )}
          </div>
        </div>

        {profile?.barberCode && (
          <div className="mb-7 px-2">
            <div className="text-[10px] font-extrabold text-brand-text-secondary uppercase tracking-wider mb-1">Your Barber Code</div>
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
            <div className="text-[9px] text-[#555] font-bold mt-1.5 leading-tight">Share this with shops to receive invites</div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/barber/${user?.uid}`);
                setToastMessage('Profile link copied! 🔗 Share it with your clients.');
                setTimeout(() => setToastMessage(''), 3000);
              }}
              className="mt-2 w-full border border-[#2a2a2a] text-[#888] font-bold text-[11px] px-3 py-[7px] rounded-lg hover:border-[#444] hover:text-white transition-colors"
            >
              Share my profile 🔗
            </button>
          </div>
        )}
        
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {[
            { id: "Dashboard", icon: "⚡", label: "Dashboard" },
            { id: "Bookings", icon: "📅", label: "Bookings" },
            { id: "Availability", icon: "⏰", label: "Availability" },
            { id: "Services", icon: "✂️", label: "Services" },
            { id: "Portfolio", icon: "📸", label: "Portfolio" },
            { id: "Invites", icon: "📨", label: "Invites" },
            { id: "Settings", icon: "⚙️", label: "Settings" },
          ].map(l => (
            <button 
              key={l.id} 
              onClick={() => setActiveTab(l.id)}
              className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 ${
                activeTab === l.id ? "bg-[#1a1a1a] text-brand-yellow" : "text-[#888] hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <span>{l.icon}</span> {l.label}
            </button>
          ))}
        </div>

        <div className="md:mt-6 border-t border-brand-border pt-6 hidden md:block">
          <div className="text-[10px] font-extrabold text-[#555] uppercase tracking-wider mb-3 px-2">My Shop</div>
          {appUser?.ownsShop ? (
             <Link 
               href="/dashboard/shop"
               className="flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors text-brand-yellow bg-brand-yellow/10 hover:bg-brand-yellow/20"
             >
               <span>🏪</span> Manage My Shop
             </Link>
          ) : (
            <Link 
              href="/dashboard/barber/create-shop"
              className="flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors text-white bg-[#1a1a1a] hover:bg-[#2a2a2a]"
            >
              <span>🏪</span> Create Shop Profile
            </Link>
          )}
        </div>

        {/* Profile completion — desktop only */}
        <div className="hidden md:block mt-4 px-2">
          <div className="text-[10px] font-extrabold text-[#555] uppercase tracking-wider mb-2">Profile completion</div>
          <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden mb-1">
            <div className={`h-full rounded-full transition-all ${profilePct === 100 ? 'bg-[#22C55E]' : 'bg-brand-yellow'}`} style={{ width: `${profilePct}%` }} />
          </div>
          <div className={`text-[11px] font-extrabold mb-2 ${profilePct === 100 ? 'text-[#22C55E]' : 'text-brand-yellow'}`}>
            {profilePct === 100 ? 'Profile complete! ✓' : `${profilePct}% complete`}
          </div>
          {missingItems.length > 0 && (
            <div className="flex flex-col gap-1">
              {missingItems.map((item, i) => (
                <button key={i} onClick={() => setActiveTab(item.tab)}
                  className="text-[10px] text-[#555] hover:text-white text-left transition-colors truncate">
                  {item.label} → {item.tab}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:block mt-auto pt-6 border-t border-brand-border">
          <div className="flex items-center justify-between px-2 mb-4">
            <span className="text-xs font-bold text-brand-text-secondary">Accept bookings</span>
            <label className="relative w-11 h-6 shrink-0 group cursor-pointer">
              <input type="checkbox" checked={profile?.isLive || false} onChange={e => saveLiveStatus(e.target.checked)} className="peer sr-only" />
              <span className="absolute inset-0 bg-[#2a2a2a] rounded-full transition-colors peer-checked:bg-brand-yellow" />
              <span className="absolute w-[18px] h-[18px] left-[3px] top-[3px] bg-white rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-[#0a0a0a]" />
            </label>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-8 md:px-10 overflow-y-auto max-h-[calc(100vh-53px)] relative">
        {activeTab === "Invites" ? (
          <BarberInvitesTab />
        ) : activeTab === "Portfolio" ? (
          <BarberPortfolioTab profile={profile} mutateProfile={mutateProfile} />
        ) : activeTab === "Settings" ? (
          <BarberSettingsTab profile={profile} mutateProfile={mutateProfile} />
        ) : activeTab === "Dashboard" ? (
          <div className="animate-fadeUp">

            {/* Availability warning */}
            {!hasAvailability && (
              <div className="flex items-center justify-between bg-[#1a1500] border border-[#F5C51844] rounded-[12px] px-[18px] py-[14px] mb-5">
                <div>
                  <div className="text-[13px] font-extrabold text-brand-yellow">⚠️ You haven&apos;t set your availability yet.</div>
                  <div className="text-[11px] text-[#888] font-bold mt-0.5">Clients cannot book you until you add your working hours.</div>
                </div>
                <button
                  onClick={() => setActiveTab('Availability')}
                  className="shrink-0 ml-4 bg-brand-yellow text-[#0a0a0a] font-extrabold text-[12px] px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                >
                  Set availability →
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start mb-7 gap-4">
              <div>
                <h1 className="text-2xl font-black">Good morning, {appUser?.firstName} ✂️</h1>
                <p className="text-brand-text-secondary text-sm mt-1">{new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'})} · {motivatingText}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/barber/${user?.uid}`}
                  target="_blank" rel="noopener noreferrer"
                  className="border border-[#2a2a2a] text-[#888] hover:border-[#F5C518] hover:text-[#F5C518] rounded-full text-[13px] font-extrabold px-5 py-2.5 transition-colors inline-flex items-center"
                >
                  👁 View public profile
                </a>
                <button onClick={() => setBlockModalOpen(true)} className="bg-brand-orange text-white px-7 py-3 rounded-full font-black text-sm transition-all hover:opacity-90 hover:-translate-y-px">
                  + Block time off
                </button>
              </div>
              {/* Upcoming blocked days preview */}
              {(() => {
                const today = new Date().toISOString().split('T')[0];
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
                    <div className="text-[11px] font-extrabold text-[#555] uppercase tracking-wide mb-1.5">Upcoming days off</div>
                    <div className="flex flex-col gap-1">
                      {shown.map((item: any, i: number) => {
                        const d = typeof item === 'string' ? item : item.date;
                        const reason = typeof item === 'string' ? null : item.reason;
                        const [y, m, day] = d.split('-');
                        return (
                          <div key={i} className="flex items-center justify-between text-[11px]">
                            <span className="text-[#888]">📅 {day}/{m}/{y}{reason ? ` · ${reason}` : ''}</span>
                            <button onClick={() => handleUnblockDay(item)} className="text-brand-orange hover:underline font-bold text-[11px] ml-3">Remove</button>
                          </div>
                        );
                      })}
                      {extra > 0 && (
                        <button onClick={() => setBlockModalOpen(true)} className="text-[11px] text-[#555] hover:text-white transition-colors text-left mt-0.5">
                          + {extra} more
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Stats */}
            {activeTab === "Dashboard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
                {/* Today's earnings */}
                <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
                  <div className="text-[28px] font-black leading-none text-brand-yellow">{currSym}{todayEarnings}</div>
                  <div className="text-xs text-brand-text-secondary font-bold">Today&apos;s earnings</div>
                  <div className="text-[11px] font-extrabold text-[#444] mt-1">{todayCompletedBookings.length} cuts today</div>
                </div>
                {/* Total cuts */}
                <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
                  <div className="text-[28px] font-black leading-none text-brand-orange">{profile?.totalCuts ?? 0}</div>
                  <div className="text-xs text-brand-text-secondary font-bold">Total cuts</div>
                  <div className="text-[11px] font-extrabold text-[#444] mt-1">This month: {thisMonthCompleted}</div>
                </div>
                {/* Rating */}
                <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
                  <div className={`text-[28px] font-black leading-none ${(profile?.rating || 0) > 0 ? 'text-brand-yellow' : 'text-brand-green'}`}>
                    {(profile?.rating || 0) > 0 ? `★ ${(profile!.rating as number).toFixed(1)}` : 'New ✨'}
                  </div>
                  <div className="text-xs text-brand-text-secondary font-bold">Rating</div>
                  <div className="text-[11px] font-extrabold text-[#444] mt-1">
                    {(profile?.reviewCount || 0) > 0 ? `${profile!.reviewCount} reviews` : 'No reviews yet'}
                  </div>
                </div>
                {/* Show rate */}
                <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
                  <div className="text-[28px] font-black leading-none text-brand-green">{showRate}%</div>
                  <div className="text-xs text-brand-text-secondary font-bold">Show rate</div>
                  <div className="text-[11px] font-extrabold text-[#444] mt-1">
                    {totalFinished > 0 ? `${totalFinished} bookings total` : '0 no-shows'}
                  </div>
                </div>
              </div>
            )}

            {/* Next appointment countdown */}
            {activeTab === "Dashboard" && nextBooking && (() => {
              const { day, countdown } = getCountdownLabel(nextBooking);
              return (
                <div className="flex items-center justify-between bg-[#111] border border-[#1e1e1e] rounded-[12px] px-5 py-[14px] mb-5">
                  <div>
                    <div className="text-[11px] font-bold text-[#555] mb-0.5">⏱ Next cut</div>
                    <div className="font-extrabold text-[14px]">{nextBooking.clientName || 'Client'}{nextBooking.serviceNames?.[0] ? ` — ${nextBooking.serviceNames[0]}` : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-white">{day} at {nextBooking.startTime}</div>
                    {countdown && <div className="text-[12px] font-extrabold text-brand-yellow">{countdown}</div>}
                  </div>
                </div>
              );
            })()}

            {/* Today's schedule timeline */}
            <div className="mb-8">
              <div className="text-[13px] font-extrabold text-white mb-4">Today&apos;s schedule</div>
              {todaySchedule.length === 0 ? (
                <div className="bg-brand-surface border border-brand-border rounded-2xl p-8 text-center">
                  <div className="text-3xl mb-3">💈</div>
                  <div className="font-extrabold text-white mb-1">No cuts scheduled for today.</div>
                  <div className="text-[#555] text-sm mb-4">Your schedule is open! Share your profile to get bookings.</div>
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/barber/${user?.uid}`); setToastMessage('Profile link copied!'); setTimeout(() => setToastMessage(''), 2000); }}
                    className="text-brand-orange text-sm font-bold hover:underline">
                    Share profile →
                  </button>
                </div>
              ) : (
                <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden">
                  {todaySchedule.map((b, i) => {
                    const dotColor = b.status === 'pending' ? '#F5C518' : b.status === 'confirmed' ? '#22C55E' : '#555';
                    return (
                      <div key={b.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < todaySchedule.length - 1 ? 'border-b border-[#141414]' : ''}`}>
                        {/* Time */}
                        <div className="w-12 shrink-0 text-right">
                          <div className="text-[12px] font-bold text-white">{b.startTime}</div>
                          {b.endTime && <div className="text-[11px] text-[#555]">{b.endTime}</div>}
                        </div>
                        {/* Dot */}
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-extrabold text-[14px] text-white truncate">{b.clientName || 'Client'}</div>
                          <div className="text-[12px] text-[#666] truncate">{b.serviceNames?.join(', ') || b.serviceName || 'Service'}</div>
                        </div>
                        {/* Status + price + actions */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                          {b.status === 'pending' && <span className="text-[10px] font-extrabold text-brand-yellow bg-[#1a1500] border border-brand-yellow/30 px-2 py-0.5 rounded-full">Pending</span>}
                          {b.status === 'confirmed' && <span className="text-[10px] font-extrabold text-[#22C55E] bg-[#0f2010] border border-[#22C55E]/30 px-2 py-0.5 rounded-full">Confirmed</span>}
                          {b.status === 'completed' && <span className="text-[10px] font-extrabold text-[#555] bg-[#141414] border border-[#222] px-2 py-0.5 rounded-full">Done</span>}
                          <span className="font-black text-brand-yellow text-[13px]">{currSym}{b.price}</span>
                          {b.status === 'pending' && (
                            <>
                              <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="bg-[#0f2010] border border-brand-green/30 text-brand-green rounded-lg px-2.5 py-1.5 text-xs font-extrabold hover:bg-brand-green/20">✓</button>
                              <button onClick={() => updateBookingStatus(b.id, 'cancelled_by_barber')} className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-lg px-2.5 py-1.5 text-xs font-extrabold hover:bg-brand-red/20">✕</button>
                            </>
                          )}
                          {b.status === 'confirmed' && (
                            <button onClick={() => updateBookingStatus(b.id, 'completed')} className="bg-brand-surface border border-brand-border text-white rounded-lg px-2.5 py-1.5 text-xs font-extrabold hover:border-[#444]">Done</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent activity feed */}
            <div className="mt-4">
              <div className="text-[13px] font-extrabold mb-3">Recent activity</div>
              {recentActivity.length === 0 ? (
                <div className="text-[#555] text-sm text-center py-6">No recent activity yet.<br/>Share your profile to get your first booking!</div>
              ) : (
                <div>
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex items-center gap-[10px] py-[10px] border-b border-[#141414] last:border-0">
                      <span className="text-base shrink-0">{a.icon}</span>
                      <span className="flex-1 text-[13px] text-[#aaa] leading-snug">{a.text}</span>
                      <span className="text-[11px] text-[#555] shrink-0">{a.ts ? timeAgo(a.ts) : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly earnings chart */}
            <div className="mt-8 bg-[#111] border border-[#1e1e1e] rounded-[12px] p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-extrabold">This week&apos;s earnings</span>
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
          </div>

        ) : activeTab === "Bookings" ? (
          <div className="animate-fadeUp">

            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">All Bookings</h2>
              <button onClick={exportCSV}
                className="border border-[#2a2a2a] text-[#888] font-bold text-[11px] px-[14px] py-[6px] rounded-full hover:border-[#444] hover:text-white transition-colors">
                Export CSV ↓
              </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'This month', val: booksThisMonth, color: 'text-brand-yellow' },
                { label: 'Pending', val: booksPending, color: 'text-brand-orange' },
                { label: 'Completed', val: booksCompleted, color: 'text-brand-green' },
                { label: 'Cancelled', val: booksCancelled, color: 'text-[#555]' },
              ].map((s, i) => (
                <div key={i} className="bg-[#111] border border-[#1e1e1e] rounded-[12px] px-4 py-[14px] text-center">
                  <div className={`text-2xl font-black leading-none mb-1 ${s.color}`}>{s.val}</div>
                  <div className="text-[11px] text-[#555] font-bold">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Time tabs */}
            <div className="flex gap-1 border-b border-[#1e1e1e] mb-3">
              {['today', 'this week', 'this month'].map(t => (
                <button key={t} onClick={() => setBookingsTab(t)}
                  className={`px-4 py-2 text-[12px] font-extrabold capitalize border-b-2 -mb-px transition-colors ${bookingsTab === t ? 'text-brand-yellow border-brand-yellow' : 'text-[#555] border-transparent hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex gap-1 flex-wrap mb-4">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
                <button key={s} onClick={() => setBookingsStatusFilter(s)}
                  className={`px-4 py-2 text-[12px] font-extrabold capitalize border-b-2 -mb-px transition-colors ${bookingsStatusFilter === s ? 'text-brand-yellow border-brand-yellow' : 'text-[#555] border-transparent hover:text-white'}`}>
                  {s}
                </button>
              ))}
            </div>

            {/* Search bar */}
            <input
              value={bookingsSearch}
              onChange={e => setBookingsSearch(e.target.value)}
              placeholder="Search by client name or date..."
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-full px-4 py-2 text-[12px] text-white outline-none focus:border-brand-yellow transition-colors placeholder:text-[#444] mb-4"
            />

            {/* Booking list */}
            <div className="flex flex-col gap-2">
              {bookingsFilteredList.length === 0 ? (
                <div className="text-center py-10 text-[#555] text-sm">No bookings found.</div>
              ) : bookingsFilteredList.map(b => (
                <div key={b.id} className={`flex flex-wrap sm:flex-nowrap items-center gap-3 bg-brand-surface border border-brand-border rounded-[14px] p-3.5 border-l-[4px] ${borderColorMap[b.status] || 'border-l-[#2a2a2a]'}`}>
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[11px] font-black text-white shrink-0">
                    {(b.clientName?.[0] || 'C').toUpperCase()}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-[120px]">
                    <div className="font-extrabold text-sm">{b.clientName || 'Client'}</div>
                    <div className="text-xs text-brand-text-secondary">{b.serviceNames?.join(', ') || b.serviceName || 'Service'}</div>
                  </div>
                  {/* Date/time */}
                  <div className="text-[12px] text-[#666] shrink-0 hidden sm:block">
                    <div>{b.date}</div>
                    <div>{b.startTime}{b.totalDuration ? ` · ${b.totalDuration}min` : ''}</div>
                  </div>
                  {/* Status */}
                  <div className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${statusMap[b.status]?.bg} ${statusMap[b.status]?.text} ${statusMap[b.status]?.border}`}>
                    {b.status}
                  </div>
                  {/* Price */}
                  <div className="font-black text-[14px] text-brand-yellow shrink-0">{currSym}{b.price}</div>
                  {/* Actions */}
                  {b.status === 'pending' && (
                    <div className="flex gap-1.5 w-full sm:w-auto mt-1 sm:mt-0 justify-end">
                      <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="bg-[#0f2010] border border-brand-green/30 text-brand-green rounded-lg px-3 py-1.5 text-xs font-extrabold hover:bg-brand-green/20">✓ Accept</button>
                      <button onClick={() => updateBookingStatus(b.id, 'cancelled_by_barber')} className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-lg px-3 py-1.5 text-xs font-extrabold hover:bg-brand-red/20">✕ Decline</button>
                    </div>
                  )}
                  {b.status === 'confirmed' && (
                    <div className="flex gap-1.5 w-full sm:w-auto mt-1 sm:mt-0 justify-end">
                      <button onClick={() => updateBookingStatus(b.id, 'completed')} className="bg-brand-surface border border-brand-border text-white rounded-lg px-3 py-1.5 text-xs font-extrabold hover:border-[#444]">Mark Complete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        ) : activeTab === "Services" ? (
          <div className="animate-fadeUp max-w-[600px]">
            <h2 className="text-2xl font-black mb-6">Manage Services</h2>
            <div className="flex flex-col gap-3 mb-8">
              {/* Locked titeZMe Cut */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-l-4 border-l-brand-yellow">
                <div className="flex-1">
                  <div className="font-black flex items-center gap-1.5">⚡ titeZMe Cut</div>
                  <div className="text-[11px] text-brand-text-secondary mt-1 max-w-[220px]">The barber chooses the cut for you based on your vibe and your budget.</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-brand-yellow transition-colors">
                    <input value={titzData.duration} onChange={e=>setTitzData(prev=>({...prev, duration: e.target.value}))} className="w-14 bg-transparent px-2 py-2 text-white text-xs outline-none text-center border-r-[1.5px] border-[#2a2a2a]" type="number" />
                    <span className="text-[10px] font-extrabold text-[#888] self-center px-1.5">MIN</span>
                  </div>
                  <div className="flex bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-brand-yellow transition-colors">
                    <span className="text-[#888] self-center pl-2 text-xs font-extrabold">€</span>
                    <input value={titzData.price} onChange={e=>setTitzData(prev=>({...prev, price: e.target.value}))} className="w-12 bg-transparent px-1 py-2 text-white text-xs outline-none text-center" type="number" />
                  </div>
                  <button onClick={saveTitzCut} disabled={isSavingTitz} className="text-[10px] font-black bg-brand-yellow text-[#0a0a0a] px-3 py-2 rounded-xl ml-1 disabled:opacity-50 hover:opacity-90">{isSavingTitz ? "..." : "Save"}</button>
                  <span className="text-[#555] text-sm ml-2">🔒</span>
                </div>
              </div>

              {services.map((svc) => (
                <div key={svc.id} className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold">{svc.name}</div>
                    <div className="text-xs text-brand-text-secondary">{svc.duration} mins</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-black text-brand-yellow">€{svc.price}</div>
                    <button onClick={async () => { await deleteDoc(doc(db, 'services', svc.id)); mutateServices(); }} className="text-[#555] hover:text-brand-red font-bold text-xs p-2">✕</button>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-extrabold text-sm mb-3">Add New Service</h3>
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-2.5 items-end mb-3">
              <div>
                <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">NAME</label>
                <input value={newServiceName} onChange={e=>setNewServiceName(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" placeholder="E.g. Buzz Cut" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">MINS</label>
                <input value={newServiceDuration} onChange={e=>setNewServiceDuration(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" placeholder="30" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">PRICE €</label>
                <input value={newServicePrice} onChange={e=>setNewServicePrice(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" placeholder="0" />
              </div>
            </div>
            <button onClick={addService} className="bg-brand-yellow text-[#0a0a0a] w-full mt-2 px-7 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90">
              Add Service
            </button>
          </div>
        ) : activeTab === "Availability" ? (
          <div className="animate-fadeUp max-w-[800px]">
             <h2 className="text-2xl font-black mb-6">Weekly Schedule</h2>
             <p className="text-brand-text-secondary text-sm mb-6">Drag across the grid to set your working hours. Click a green block to remove it.</p>
             <AvailabilityGrid mode="barber" barberId={user?.uid || ""} />
          </div>
        ) : (
          <div className="animate-fadeUp flex items-center justify-center min-h-[40vh] border-2 border-dashed border-[#2a2a2a] rounded-3xl text-brand-text-secondary text-sm font-bold">
            {activeTab} content goes here.
          </div>
        )}
        
        {/* Block time off modal */}
        {blockModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-6 w-full max-w-md animate-fadeUp overflow-y-auto max-h-[90vh]">

              {/* 1. Title */}
              <h3 className="text-lg font-black mb-1">Block time off</h3>
              <p className="text-xs text-[#888] font-bold mb-5">Clients cannot book you on blocked days.</p>

              {/* 2. Date range inputs */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <label className="text-[10px] font-extrabold text-brand-text-secondary uppercase tracking-wider block mb-1.5">From</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} value={blockFrom}
                    onChange={e => { setBlockFrom(e.target.value); setRangeError(''); }}
                    className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-brand-yellow transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-brand-text-secondary uppercase tracking-wider block mb-1.5">To (optional)</label>
                  <input type="date" min={blockFrom || new Date().toISOString().split('T')[0]} value={blockTo}
                    onChange={e => { setBlockTo(e.target.value); setRangeError(''); }}
                    className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-brand-yellow transition-colors" />
                </div>
              </div>
              {rangeError && <div className="text-[11px] text-brand-red font-bold mb-3">{rangeError}</div>}

              {/* 3. Reason chips */}
              <div className="mb-4 mt-3">
                <label className="text-[10px] font-extrabold text-brand-text-secondary uppercase tracking-wider block mb-2">Reason (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {['🏖️ Vacation', '🤒 Sick day', '👤 Personal', '🎉 Holiday', '📋 Other'].map(r => (
                    <button key={r} onClick={() => setBlockReason(prev => prev === r ? null : r)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${blockReason === r ? 'bg-[#1a1500] border-brand-yellow text-brand-yellow' : 'border-[#2a2a2a] text-[#888] hover:border-[#444] hover:text-white'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Recurring toggle */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-brand-text-secondary uppercase tracking-wider">🔄 Recurring block</span>
                  <label className="relative w-10 h-5 cursor-pointer shrink-0">
                    <input type="checkbox" checked={blockRecurring} onChange={e => setBlockRecurring(e.target.checked)} className="peer sr-only" />
                    <span className="absolute inset-0 bg-[#2a2a2a] rounded-full transition-colors peer-checked:bg-brand-yellow" />
                    <span className="absolute w-4 h-4 left-0.5 top-0.5 bg-white rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-[#0a0a0a]" />
                  </label>
                </div>
                {blockRecurring && (
                  <div className="flex flex-wrap gap-1.5">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <button key={day} onClick={() => setRecurringDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${recurringDays.includes(day) ? 'bg-[#1a1500] border-brand-yellow text-brand-yellow' : 'border-[#2a2a2a] text-[#888] hover:border-[#444] hover:text-white'}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Block button */}
              {(() => {
                const count = !blockFrom ? 0 : (!blockTo || blockTo === blockFrom) ? 1 : generateDateRange(blockFrom, blockTo).length;
                const label = blockLoading ? '...' : count > 1 ? `Block ${count} days` : 'Block this day';
                return (
                  <button onClick={handleBlockDay} disabled={!blockFrom || blockLoading}
                    className="w-full bg-brand-yellow text-[#0a0a0a] font-black py-3 rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-40 mb-5">
                    {label}
                  </button>
                );
              })()}

              {/* 6. Divider */}
              <div className="h-px bg-[#1e1e1e] mb-4" />

              {/* 7+8. Blocked dates + recurring chips */}
              {(() => {
                const rawBlocked: any[] = (schedule as any)?.blockedDates || [];
                const rawRecurring: string[] = (schedule as any)?.recurringBlocked || [];
                if (rawBlocked.length === 0 && rawRecurring.length === 0) return null;
                return (
                  <div className="mb-5">
                    <div className="text-[11px] font-bold text-[#555] mb-2">Currently blocked days:</div>
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

              {/* 9. Cancel */}
              <button onClick={closeBlockModal} disabled={blockLoading}
                className="w-full border border-[#2a2a2a] text-[#888] font-bold py-3 rounded-full text-sm hover:border-[#444] hover:text-white transition-colors">
                Cancel
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
    </div>
  );
}
