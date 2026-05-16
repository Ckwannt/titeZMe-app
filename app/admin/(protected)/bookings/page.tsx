'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/lib/toast';

const PER_PAGE = 20;
const FETCH_LIMIT = 500;

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
type TimeFilter = 'today' | 'week' | 'month' | 'all';

interface BookingRow {
  id: string;
  clientId?: string;
  barberId?: string;
  shopId?: string;
  serviceNames?: string[];
  date?: string;
  startTime?: string;
  totalPrice?: number;
  status?: string;
  createdAt?: number;
  clientName?: string;
  barberName?: string;
}

function formatDate(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function isToday(ts?: number): boolean {
  if (!ts) return false;
  const d = new Date(ts);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function isThisWeek(ts?: number): boolean {
  if (!ts) return false;
  const d = new Date(ts);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  return d >= weekAgo;
}

function isThisMonth(ts?: number): boolean {
  if (!ts) return false;
  const d = new Date(ts);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status || '').toLowerCase();
  if (s === 'confirmed')
    return <span className="bg-[#0f2010] text-[#22C55E] px-2.5 py-1 rounded-full text-[11px] font-black">Confirmed</span>;
  if (s === 'completed')
    return <span className="bg-[#0a1a0a] text-[#22C55E] px-2.5 py-1 rounded-full text-[11px] font-black">Completed</span>;
  if (s === 'pending')
    return <span className="bg-[#1a1500] text-[#F5C518] px-2.5 py-1 rounded-full text-[11px] font-black">Pending</span>;
  if (s === 'cancelled')
    return <span className="bg-[#1a0808] text-[#EF4444] px-2.5 py-1 rounded-full text-[11px] font-black">Cancelled</span>;
  return <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">{status || '—'}</span>;
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl" style={{ padding: '16px 20px', flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 11, color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{value}</div>
    </div>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(FETCH_LIMIT))
        );

        const rawBookings: BookingRow[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<BookingRow, 'id'>),
        }));

        // Collect unique user IDs
        const userIds = new Set<string>();
        rawBookings.forEach((b) => {
          if (b.clientId) userIds.add(b.clientId);
          if (b.barberId) userIds.add(b.barberId);
        });

        // Fetch all users in parallel
        const userMap: Record<string, string> = {};
        await Promise.all(
          Array.from(userIds).map(async (uid) => {
            try {
              const userSnap = await getDoc(doc(db, 'users', uid));
              if (userSnap.exists()) {
                const u = userSnap.data() as Record<string, unknown>;
                userMap[uid] = `${u.firstName || ''} ${u.lastName || ''}`.trim() || uid;
              }
            } catch {
              // skip
            }
          })
        );

        const enriched = rawBookings.map((b) => ({
          ...b,
          clientName: b.clientId ? (userMap[b.clientId] || b.clientId) : '—',
          barberName: b.barberId ? (userMap[b.barberId] || b.barberId) : '—',
        }));

        setBookings(enriched);
      } catch (err) {
        console.error('Bookings fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    let list = bookings;

    if (statusFilter !== 'all') {
      list = list.filter((b) => (b.status || '').toLowerCase() === statusFilter);
    }

    if (timeFilter === 'today') list = list.filter((b) => isToday(b.createdAt));
    else if (timeFilter === 'week') list = list.filter((b) => isThisWeek(b.createdAt));
    else if (timeFilter === 'month') list = list.filter((b) => isThisMonth(b.createdAt));

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((b) => {
        const client = (b.clientName || '').toLowerCase();
        const barber = (b.barberName || '').toLowerCase();
        const service = (b.serviceNames?.[0] || '').toLowerCase();
        return client.includes(q) || barber.includes(q) || service.includes(q);
      });
    }

    return list;
  }, [bookings, statusFilter, timeFilter, debouncedSearch]);

  const stats = useMemo(() => ({
    today: bookings.filter((b) => isToday(b.createdAt)).length,
    week: bookings.filter((b) => isThisWeek(b.createdAt)).length,
    month: bookings.filter((b) => isThisMonth(b.createdAt)).length,
    total: bookings.length,
  }), [bookings]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  async function handleCancel(bookingId: string) {
    setCancelling(true);
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'cancelled',
        updatedAt: Date.now(),
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
      toast.success('Booking cancelled');
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
      setCancelConfirmId(null);
    }
  }

  function exportCSV() {
    const headers = ['ID', 'Client', 'Barber', 'Service', 'Date', 'Time', 'Price', 'Status', 'Created'];
    const rows = filtered.map((b) => [
      b.id,
      b.clientName || '',
      b.barberName || '',
      b.serviceNames?.[0] || '',
      b.date || '',
      b.startTime || '',
      b.totalPrice !== undefined ? `${b.totalPrice}` : '',
      b.status || '',
      b.createdAt ? new Date(b.createdAt).toISOString() : '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const statusOptions: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const timeOptions: { key: TimeFilter; label: string }[] = [
    { key: 'all', label: 'All time' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This week' },
    { key: 'month', label: 'This month' },
  ];

  return (
    <div style={{ maxWidth: 1060 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Bookings</h1>
        <button
          onClick={exportCSV}
          style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: 10,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 700,
            color: '#F5C518',
            cursor: 'pointer',
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <StatCard label="Today" value={stats.today} />
        <StatCard label="This Week" value={stats.week} />
        <StatCard label="This Month" value={stats.month} />
        <StatCard label="All-time" value={stats.total} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Status filter */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1e1e1e' }}>
          {statusOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => { setStatusFilter(opt.key); setPage(1); }}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: statusFilter === opt.key ? '2px solid #F5C518' : '2px solid transparent',
                color: statusFilter === opt.key ? '#F5C518' : '#555',
                fontSize: 12,
                fontWeight: 700,
                padding: '8px 12px',
                cursor: 'pointer',
                marginBottom: -1,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Time filter */}
        <select
          value={timeFilter}
          onChange={(e) => { setTimeFilter(e.target.value as TimeFilter); setPage(1); }}
          style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: 8,
            padding: '7px 12px',
            fontSize: 12,
            color: '#888',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {timeOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="Search client, barber, service…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: 10,
            padding: '7px 14px',
            fontSize: 12,
            color: '#fff',
            outline: 'none',
            minWidth: 220,
          }}
        />
      </div>

      <div style={{ fontSize: 12, color: '#444', marginBottom: 12 }}>
        {filtered.length} booking{filtered.length !== 1 ? 's' : ''} shown
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ color: '#555', fontSize: 14 }}>Loading bookings…</div>
      ) : paginated.length === 0 ? (
        <div style={{ color: '#555', fontSize: 14, padding: '20px 0' }}>No bookings found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1fr 80px 100px 120px',
              padding: '8px 16px',
              gap: 10,
            }}
          >
            {['Client', 'Barber', 'Service', 'Date', 'Price', 'Status', 'Actions'].map((h) => (
              <div key={h} style={{ fontSize: 11, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {h}
              </div>
            ))}
          </div>

          {paginated.map((b) => {
            const isCancellable = b.status === 'pending' || b.status === 'confirmed';
            return (
              <div key={b.id}>
                <div
                  style={{
                    background: '#111',
                    border: '1px solid #1e1e1e',
                    borderRadius: cancelConfirmId === b.id ? '12px 12px 0 0' : 12,
                    padding: '12px 16px',
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1fr 80px 100px 120px',
                    gap: 10,
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: 13, color: '#ccc', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.clientName || '—'}
                  </div>
                  <div style={{ fontSize: 13, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.barberName || '—'}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.serviceNames?.[0] || '—'}
                  </div>
                  <div style={{ fontSize: 12, color: '#555' }}>
                    <div>{b.date || formatDate(b.createdAt)}</div>
                    {b.startTime && <div style={{ fontSize: 11, color: '#444' }}>{b.startTime}</div>}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#F5C518' }}>
                    {b.totalPrice !== undefined ? `€${b.totalPrice}` : '—'}
                  </div>
                  <div>
                    <StatusBadge status={b.status} />
                  </div>
                  <div>
                    {isCancellable ? (
                      <button
                        onClick={() => setCancelConfirmId(cancelConfirmId === b.id ? null : b.id)}
                        style={{
                          background: 'none',
                          border: '1px solid #EF444440',
                          borderRadius: 8,
                          padding: '5px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#EF4444',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span style={{ fontSize: 11, color: '#333' }}>—</span>
                    )}
                  </div>
                </div>

                {/* Confirm dialog */}
                {cancelConfirmId === b.id && (
                  <div
                    style={{
                      background: '#0d0d0d',
                      border: '1px solid #1e1e1e',
                      borderTop: 'none',
                      borderRadius: '0 0 12px 12px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 13, color: '#888', flex: 1 }}>
                      Cancel this booking? This cannot be undone.
                    </span>
                    <button
                      onClick={() => setCancelConfirmId(null)}
                      style={{
                        background: 'none',
                        border: '1px solid #2a2a2a',
                        borderRadius: 8,
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#555',
                        cursor: 'pointer',
                      }}
                    >
                      Keep
                    </button>
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancelling}
                      style={{
                        background: '#EF4444',
                        border: 'none',
                        borderRadius: 8,
                        padding: '6px 14px',
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#fff',
                        cursor: cancelling ? 'not-allowed' : 'pointer',
                        opacity: cancelling ? 0.6 : 1,
                      }}
                    >
                      Confirm Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: 8,
              padding: '7px 14px',
              fontSize: 13,
              fontWeight: 700,
              color: page === 1 ? '#444' : '#fff',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Previous
          </button>
          <span style={{ fontSize: 13, color: '#555' }}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: 8,
              padding: '7px 14px',
              fontSize: 13,
              fontWeight: 700,
              color: page === totalPages ? '#444' : '#fff',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
