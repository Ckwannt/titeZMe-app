'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { collection, doc, query, where, updateDoc, writeBatch, increment, onSnapshot, orderBy, addDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingUpdateSchema, notificationSchema } from "@/lib/schemas";
import { cleanupBookingLock } from '@/lib/booking-lock-utils';
import { safeFirestore } from '@/lib/firebase-helpers';
import { toast } from '@/lib/toast';

function getCurrencySymbol(c?: string) {
  const s: Record<string, string> = { 'EUR': '€', 'GBP': '£', 'USD': '$', 'MAD': 'MAD ', 'DZD': 'DA ', 'SAR': 'SAR ', 'AED': 'AED ', 'SEK': 'kr ', 'CHF': 'CHF ' };
  return s[(c || 'EUR').toUpperCase()] ?? ((c || 'EUR') + ' ');
}

function getDateRange(tab: string) {
  const now = new Date();
  if (tab === 'today') {
    const s = new Date(now); s.setHours(0,0,0,0);
    const e = new Date(now); e.setHours(23,59,59,999);
    return { start: s, end: e };
  }
  if (tab === 'this week') {
    const s = new Date(now); const day = s.getDay();
    s.setDate(s.getDate() - day + (day === 0 ? -6 : 1)); s.setHours(0,0,0,0);
    const e = new Date(s); e.setDate(s.getDate() + 6); e.setHours(23,59,59,999);
    return { start: s, end: e };
  }
  if (tab === 'this month') {
    const s = new Date(now.getFullYear(), now.getMonth(), 1); s.setHours(0,0,0,0);
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 0); e.setHours(23,59,59,999);
    return { start: s, end: e };
  }
  return null;
}

const statusMap: Record<string, { text: string; bg: string; border: string }> = {
  completed: { text: "text-brand-green", bg: "bg-[#0f2010]", border: "border-brand-green/30" },
  confirmed: { text: "text-brand-yellow", bg: "bg-[#1a1500]", border: "border-brand-yellow/30" },
  pending: { text: "text-brand-orange", bg: "bg-[#1a0800]", border: "border-brand-orange/30" },
  cancelled: { text: "text-brand-red", bg: "bg-[#1a0808]", border: "border-brand-red/30" },
  cancelled_by_client: { text: "text-brand-red", bg: "bg-[#1a0808]", border: "border-brand-red/30" },
  cancelled_by_barber: { text: "text-brand-red", bg: "bg-[#1a0808]", border: "border-brand-red/30" },
};
const borderColorMap: Record<string, string> = {
  completed: "border-l-brand-green", confirmed: "border-l-brand-yellow",
  pending: "border-l-brand-orange", cancelled: "border-l-brand-red",
  cancelled_by_client: "border-l-brand-red", cancelled_by_barber: "border-l-brand-red",
};

export default function BookingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsTab, setBookingsTab] = useState('today');
  const [bookingsStatusFilter, setBookingsStatusFilter] = useState('all');
  const [bookingsSearch, setBookingsSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const BOOKINGS_PER_PAGE = 20;

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => { const s = await getDoc(doc(db, 'barberProfiles', user!.uid)); return s.exists() ? s.data() : null; },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, 'bookings'), where('barberId', '==', user.uid), orderBy('createdAt', 'desc'));
    return onSnapshot(q, async snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setBookings(all);

      // Auto-cancel expired pending bookings (> 2 hours old)
      const TWO_HOURS = 2 * 60 * 60 * 1000;
      const expiredPending = all.filter(
        (b: any) => b.status === 'pending' && b.createdAt < Date.now() - TWO_HOURS
      );
      if (expiredPending.length > 0) {
        for (const booking of expiredPending) {
          await safeFirestore(() =>
            updateDoc(doc(db, 'bookings', booking.id), {
              status: 'cancelled',
              updatedAt: Date.now(),
              cancelReason: 'auto_expired',
            })
          );
          await safeFirestore(() =>
            addDoc(collection(db, 'notifications'), {
              userId: booking.clientId,
              message: `Your booking request on ${booking.date} at ${booking.startTime} expired because the barber didn't respond in time. Please book again.`,
              read: false,
              linkTo: '/dashboard/client',
              createdAt: Date.now(),
            })
          );
          await cleanupBookingLock(booking);
        }
        toast.info(`${expiredPending.length} expired booking request${expiredPending.length > 1 ? 's' : ''} were automatically cancelled.`);
      }
    });
  }, [user?.uid]);

  const nowDate = new Date();
  const monthStr = `${nowDate.getFullYear()}-${String(nowDate.getMonth() + 1).padStart(2, '0')}`;
  const currSym = getCurrencySymbol(profile?.currency);

  const booksThisMonth = bookings.filter(b => b.date?.startsWith(monthStr)).length;
  const booksPending = bookings.filter(b => b.status === 'pending').length;
  const booksCompleted = bookings.filter(b => b.status === 'completed').length;
  const booksCancelled = bookings.filter(b => ['cancelled_by_client', 'cancelled_by_barber', 'cancelled'].includes(b.status)).length;

  const filteredBookings = bookings.filter(b => {
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
      const q2 = bookingsSearch.trim().toLowerCase();
      if (!(b.clientName || '').toLowerCase().includes(q2) &&
          !(b.serviceNames?.[0] || b.serviceName || '').toLowerCase().includes(q2) &&
          !(b.date || '').includes(q2)) return false;
    }
    return true;
  }).sort((a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime());

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * BOOKINGS_PER_PAGE,
    currentPage * BOOKINGS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredBookings.length / BOOKINGS_PER_PAGE);

  const resetPage = () => setCurrentPage(1);

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const timeNow = Date.now();
      const booking = bookings.find(b => b.id === id);
      const batch = writeBatch(db);
      batch.update(doc(db, 'bookings', id), bookingUpdateSchema.parse({ status, updatedAt: timeNow }));
      if (status === 'completed' && booking && booking.status !== 'completed' && user) {
        batch.update(doc(db, 'barberProfiles', user.uid), { totalCuts: increment(1) });
        if (profile?.shopId) batch.update(doc(db, 'barbershops', profile.shopId), { totalBookings: increment(1) });
        const dateObj = new Date(booking.date || timeNow);
        const yyyy = dateObj.getFullYear(); const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        batch.set(doc(db, 'aggregations', `${user.uid}_${yyyy}_${mm}`), { totalCuts: increment(1), totalRevenue: increment(Number(booking.price) || 0), totalHours: increment((Number(booking.duration) || 30) / 60) }, { merge: true });
      }
      await batch.commit();

      // Track response time when barber accepts or declines
      if ((status === 'confirmed' || status === 'cancelled_by_barber') && booking && user) {
        const responseTimeMinutes = Math.round((Date.now() - (booking.createdAt || Date.now())) / 60000);
        const avgResponseMinutes = Math.round(
          ((profile?.avgResponseMinutes ?? responseTimeMinutes) * 0.7) + (responseTimeMinutes * 0.3)
        );
        updateDoc(doc(db, 'barberProfiles', user.uid), {
          lastResponseTimeMinutes: responseTimeMinutes,
          avgResponseMinutes,
        }).catch(e => console.error('Response time update failed:', e));
      }

      // Clean up booking lock so the slot becomes bookable again
      if (status.startsWith('cancelled') && booking) {
        await cleanupBookingLock({
          barberId: booking.barberId || user!.uid,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          id,
        });
      }

      if (booking?.clientId && (status === 'confirmed' || status === 'cancelled_by_barber' || status === 'completed')) {
        let message = '';
        let linkTo = '/dashboard/client';
        if (status === 'confirmed') {
          message = `Your booking on ${booking.date} at ${booking.startTime} has been confirmed by your barber. See you there!`;
        } else if (status === 'cancelled_by_barber') {
          message = `Your booking on ${booking.date} at ${booking.startTime} was cancelled by your barber.`;
        } else if (status === 'completed') {
          message = `Your cut is complete! How was it? Leave a review for your barber.`;
          linkTo = `/review/${booking.id}`;
        }
        await addDoc(collection(db, 'notifications'), notificationSchema.parse({ userId: booking.clientId, message, read: false, linkTo, createdAt: Date.now() }));
      }
    } catch (e) { console.error(e); }
  };

  const exportCSV = () => {
    const headers = ['Date', 'Time', 'Client Name', 'Service', 'Duration', 'Price', 'Currency', 'Status'];
    const rows = filteredBookings.map(b => [b.date || '', b.startTime || '', b.clientName || '', b.serviceNames?.join(', ') || b.serviceName || '', b.totalDuration || '', b.price ?? 0, profile?.currency || 'EUR', b.status || ''].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fadeUp p-6 md:p-8 md:px-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black">All Bookings</h2>
        <button onClick={exportCSV} className="border border-[#2a2a2a] text-[#888] font-bold text-[11px] px-[14px] py-[6px] rounded-full hover:border-[#444] hover:text-white transition-colors">Export CSV ↓</button>
      </div>

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

      <div className="flex gap-1 border-b border-[#1e1e1e] mb-3">
        {['today', 'this week', 'this month'].map(t => (
          <button key={t} onClick={() => { setBookingsTab(t); resetPage(); }} className={`px-4 py-2 text-[12px] font-extrabold capitalize border-b-2 -mb-px transition-colors ${bookingsTab === t ? 'text-brand-yellow border-brand-yellow' : 'text-[#555] border-transparent hover:text-white'}`}>{t}</button>
        ))}
      </div>

      <div className="flex gap-1 flex-wrap mb-4">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => { setBookingsStatusFilter(s); resetPage(); }} className={`px-4 py-2 text-[12px] font-extrabold capitalize border-b-2 -mb-px transition-colors ${bookingsStatusFilter === s ? 'text-brand-yellow border-brand-yellow' : 'text-[#555] border-transparent hover:text-white'}`}>{s}</button>
        ))}
      </div>

      <input value={bookingsSearch} onChange={e => setBookingsSearch(e.target.value)} placeholder="Search by client name or date..." className="w-full bg-[#141414] border border-[#2a2a2a] rounded-full px-4 py-2 text-[12px] text-white outline-none focus:border-brand-yellow transition-colors placeholder:text-[#444] mb-4" />

      <div className="flex flex-col gap-2">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-10 text-[#555] text-sm">No bookings found.</div>
        ) : paginatedBookings.map(b => (
          <div key={b.id} className={`flex flex-wrap sm:flex-nowrap items-center gap-3 bg-brand-surface border border-brand-border rounded-[14px] p-3.5 border-l-[4px] ${borderColorMap[b.status] || 'border-l-[#2a2a2a]'}`}>
            <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[11px] font-black text-white shrink-0">{(b.clientName?.[0] || 'C').toUpperCase()}</div>
            <div className="flex-1 min-w-[120px]">
              <div className="font-extrabold text-sm">{b.clientName || 'Client'}</div>
              <div className="text-xs text-brand-text-secondary">{b.serviceNames?.join(', ') || b.serviceName || 'Service'}</div>
            </div>
            <div className="text-[12px] text-[#666] shrink-0 hidden sm:block"><div>{b.date}</div><div>{b.startTime}{b.totalDuration ? ` · ${b.totalDuration}min` : ''}</div></div>
            <div className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${statusMap[b.status]?.bg} ${statusMap[b.status]?.text} ${statusMap[b.status]?.border}`}>{b.status}</div>
            <div className="font-black text-[14px] text-brand-yellow shrink-0">{currSym}{b.price}</div>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5">
          <div className="text-[11px] text-[#555] text-center mb-3">
            Showing {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}–{Math.min(currentPage * BOOKINGS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length} bookings
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[12px] font-bold text-[#888] hover:text-white disabled:opacity-40 transition-colors"
            >
              ← Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-colors ${currentPage === pageNum ? 'bg-brand-yellow text-black' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-[12px] font-bold text-[#888] hover:text-white disabled:opacity-40 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
