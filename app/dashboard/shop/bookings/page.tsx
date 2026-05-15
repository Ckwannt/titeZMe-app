'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { bookingUpdateSchema } from '@/lib/schemas';
import { toast } from '@/lib/toast';
import { getLocalDateString, getTimezoneFromLocation } from '@/lib/schedule-utils';

function getCurrencySymbol(c?: string): string {
  const m: Record<string, string> = { EUR: '€', GBP: '£', USD: '$', MAD: 'MAD ', DZD: 'DA ', TND: 'DT ' };
  return m[(c || 'EUR').toUpperCase()] ?? '€';
}

function statusColor(s: string): string {
  if (s === 'completed') return 'text-brand-green bg-[#0f2010]';
  if (s === 'confirmed') return 'text-[#60a5fa] bg-[#0a1628]';
  if (s === 'pending') return 'text-brand-yellow bg-[#1a1500]';
  if (s.startsWith('cancelled')) return 'text-brand-red bg-[#1a0808]';
  return 'text-[#888] bg-[#1a1a1a]';
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function exportCSV(bookings: any[], currSym: string) {
  const rows = [
    ['Date', 'Time', 'Client', 'Barber', 'Service', 'Price', 'Status'],
    ...bookings.map(b => [
      b.date, b.startTime,
      b.clientName || b.clientId || '',
      b.barberName || b.barberId || '',
      b.serviceName || '',
      `${currSym}${b.price || 0}`,
      b.status,
    ]),
  ];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'shop-bookings.csv'; a.click();
  URL.revokeObjectURL(url);
}

export default function ShopBookingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [barberFilter, setBarberFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('month');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [shopCurrency, setShopCurrency] = useState('EUR');
  const [currentPage, setCurrentPage] = useState(1);
  const BOOKINGS_PER_PAGE = 20;

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Fetch shop currency
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'barbershops', user.uid)).then(s => {
      if (s.exists()) setShopCurrency(s.data().currency || 'EUR');
    });
  }, [user]);

  // Real-time bookings
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'bookings'), where('shopId', '==', user.uid));
    const unsub = onSnapshot(q, async (snap) => {
      const raw = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));

      // Enrich with barber + client names
      const enriched = await Promise.all(raw.map(async (b: any) => {
        // Barber name
        if (!b.barberName && b.barberId) {
          const uSnap = await getDoc(doc(db, 'users', b.barberId));
          if (uSnap.exists()) {
            const u = uSnap.data();
            b = { ...b, barberName: `${u.firstName} ${u.lastName}` };
          }
        }
        // Client name
        if (!b.clientName && b.clientId) {
          const cSnap = await getDoc(doc(db, 'users', b.clientId));
          if (cSnap.exists()) {
            const u = cSnap.data();
            b = { ...b, clientName: `${u.firstName} ${u.lastName}` };
          }
        }
        // Service name
        if (!b.serviceName && b.serviceNames) {
          b = { ...b, serviceName: Array.isArray(b.serviceNames) ? b.serviceNames.join(', ') : b.serviceNames };
        }
        return b;
      }));

      enriched.sort((a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime());
      setBookings(enriched);
    });
    return () => unsub();
  }, [user]);

  const now = new Date();
  const todayStr = getLocalDateString();
  const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Compute week range
  const weekStart = (() => {
    const d = new Date(); const wd = d.getDay();
    d.setDate(d.getDate() - wd + (wd === 0 ? -6 : 1)); d.setHours(0, 0, 0, 0); return d;
  })();
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);

  // Unique barbers list for filter
  const barberOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: { id: string; name: string }[] = [];
    bookings.forEach(b => {
      if (b.barberId && !seen.has(b.barberId)) {
        seen.add(b.barberId);
        opts.push({ id: b.barberId, name: b.barberName || b.barberId });
      }
    });
    return opts;
  }, [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      // Barber
      if (barberFilter !== 'all' && b.barberId !== barberFilter) return false;
      // Status
      if (statusFilter !== 'all') {
        if (statusFilter === 'cancelled' && !b.status?.startsWith('cancelled')) return false;
        else if (statusFilter !== 'cancelled' && b.status !== statusFilter) return false;
      }
      // Time
      const bDate = new Date(`${b.date}T${b.startTime}`);
      if (timeFilter === 'today' && b.date !== todayStr) return false;
      if (timeFilter === 'week' && (bDate < weekStart || bDate > weekEnd)) return false;
      if (timeFilter === 'month' && !b.date?.startsWith(monthStr)) return false;
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matches = (b.clientName || '').toLowerCase().includes(q) ||
          (b.barberName || '').toLowerCase().includes(q) ||
          (b.serviceName || '').toLowerCase().includes(q) ||
          (b.date || '').includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [bookings, barberFilter, statusFilter, timeFilter, search, todayStr, monthStr, weekStart, weekEnd]);

  // Stats
  const monthBookings = bookings.filter(b => b.date?.startsWith(monthStr));
  const monthCompleted = monthBookings.filter(b => b.status === 'completed');
  const monthPending = monthBookings.filter(b => b.status === 'pending');
  const monthCancelled = monthBookings.filter(b => b.status?.startsWith('cancelled'));
  const currSym = getCurrencySymbol(shopCurrency);

  const paginatedFiltered = filtered.slice(
    (currentPage - 1) * BOOKINGS_PER_PAGE,
    currentPage * BOOKINGS_PER_PAGE
  );
  const totalPages = Math.ceil(filtered.length / BOOKINGS_PER_PAGE);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const loadingToast = toast.loading('Updating...');
    try {
      await updateDoc(doc(db, 'bookings', bookingId), bookingUpdateSchema.parse({ status: newStatus, updatedAt: Date.now() }));
      toast.success('Booking updated.', { id: loadingToast });
    } catch (e) {
      toast.error('Failed to update.', { id: loadingToast });
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-[#555]">Loading...</div>;

  return (
    <div className="animate-fadeUp p-6 md:p-8 md:px-10">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <h1 className="text-2xl font-black">All Bookings 📅</h1>
        <button
          onClick={() => exportCSV(filtered, currSym)}
          className="text-[12px] font-bold border border-[#2a2a2a] text-[#888] hover:border-brand-yellow hover:text-brand-yellow px-4 py-2 rounded-full transition-colors"
        >
          ↓ Export CSV
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { val: monthBookings.length, label: 'Total this month', color: 'text-white' },
          { val: monthPending.length, label: 'Pending', color: 'text-brand-yellow' },
          { val: monthCompleted.length, label: 'Completed', color: 'text-brand-green' },
          { val: monthCancelled.length, label: 'Cancelled', color: 'text-brand-red' },
        ].map((s, i) => (
          <div key={i} className="bg-brand-surface border border-brand-border rounded-2xl p-4">
            <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
            <div className="text-[11px] text-[#666] font-bold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Search */}
        <input
          type="text"
          placeholder="Search client, barber, service..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-brand-yellow transition-colors flex-1 min-w-[180px]"
        />

        {/* Barber filter */}
        <select
          value={barberFilter}
          onChange={e => setBarberFilter(e.target.value)}
          className="bg-[#141414] border border-[#2a2a2a] text-white rounded-xl px-3 py-2.5 text-sm outline-none"
        >
          <option value="all">All barbers</option>
          {barberOptions.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Time + Status filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['today', 'week', 'month', 'all'] as const).map(t => (
          <button key={t} onClick={() => setTimeFilter(t)}
            className={`text-[12px] font-bold px-4 py-1.5 rounded-full transition-colors capitalize ${timeFilter === t ? 'bg-brand-yellow text-black' : 'bg-[#1a1a1a] text-[#888] hover:text-white'}`}>
            {t === 'all' ? 'All time' : t === 'week' ? 'This Week' : t === 'month' ? 'This Month' : 'Today'}
          </button>
        ))}
        <div className="w-px bg-[#2a2a2a] mx-1" />
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-[12px] font-bold px-4 py-1.5 rounded-full transition-colors capitalize ${statusFilter === s ? 'bg-[#2a2a2a] text-white' : 'text-[#666] hover:text-white'}`}>
            {s === 'all' ? 'All statuses' : s}
          </button>
        ))}
      </div>

      {/* Booking list */}
      {filtered.length === 0 ? (
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-8 text-center text-[#555]">
          <div className="text-3xl mb-3">📅</div>
          <div className="font-bold text-sm">No bookings match your filters</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedFiltered.map(b => (
            <div key={b.id} className="bg-brand-surface border border-brand-border rounded-2xl p-4 hover:border-[#444] transition-colors">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Client avatar */}
                  <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center font-black text-sm text-white shrink-0">
                    {(b.clientName || b.clientId || '?')[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-[14px] leading-tight truncate">{b.clientName || b.clientId || 'Client'}</div>
                    <div className="text-[11px] text-[#666] mt-0.5">
                      via <span className="text-[#888]">{b.barberName || 'Barber'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap shrink-0">
                  <div className="text-right">
                    <div className="font-black text-brand-yellow text-sm">{b.date} {b.startTime}</div>
                    <div className="text-[11px] text-[#666] mt-0.5 truncate max-w-[140px]">{b.serviceName || '—'}</div>
                  </div>
                  <div className="font-black text-white text-sm whitespace-nowrap">{currSym}{b.price || 0}</div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${statusColor(b.status || '')}`}>
                    {b.status?.replace('cancelled_by_', 'cancelled/') || '—'}
                  </span>
                </div>
              </div>

              {/* Accept/Decline for pending */}
              {b.status === 'pending' && (
                <div className="mt-3 pt-3 border-t border-[#2a2a2a] flex gap-2">
                  <button onClick={() => handleStatusChange(b.id, 'confirmed')}
                    className="text-[11px] font-black text-brand-green border border-brand-green/40 hover:bg-[#0f2010] px-3 py-1.5 rounded-lg transition-colors">
                    ✓ Confirm
                  </button>
                  <button onClick={() => handleStatusChange(b.id, 'cancelled_by_barber')}
                    className="text-[11px] font-black text-brand-red border border-brand-red/40 hover:bg-[#1a0808] px-3 py-1.5 rounded-lg transition-colors">
                    ✕ Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5">
          <div className="text-[11px] text-[#555] text-center mb-3">
            Showing {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}–{Math.min(currentPage * BOOKINGS_PER_PAGE, filtered.length)} of {filtered.length} bookings
          </div>
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-3 py-1.5 text-[12px] font-bold text-[#888] hover:text-white disabled:opacity-40">
              ← Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
              return (
                <button key={pageNum} onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-colors ${currentPage === pageNum ? 'bg-brand-yellow text-black' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'}`}>
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-[12px] font-bold text-[#888] hover:text-white disabled:opacity-40">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
