'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/lib/toast';

const PER_PAGE = 20;

interface ClientRow {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  city?: string;
  country?: string;
  createdAt?: number;
  bookingCount: number;
  isSuspended?: boolean;
}

interface ClientBooking {
  id: string;
  date?: string;
  startTime?: string;
  barberName?: string;
  serviceNames?: string[];
  totalPrice?: number;
  status?: string;
}

function getInitials(first?: string, last?: string): string {
  return `${(first || '?')[0]}${(last || '')[0] || ''}`.toUpperCase();
}

function formatDate(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedBookings, setExpandedBookings] = useState<Record<string, ClientBooking[]>>({});
  const [loadingBookings, setLoadingBookings] = useState<Record<string, boolean>>({});
  const [suspendingId, setSuspendingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    async function fetchClients() {
      setLoading(true);
      try {
        const [usersSnap, bookingsSnap] = await Promise.all([
          getDocs(query(collection(db, 'users'), where('role', '==', 'client'))),
          getDocs(collection(db, 'bookings')),
        ]);

        // Build booking count map
        const bookingCountMap: Record<string, number> = {};
        bookingsSnap.docs.forEach((d) => {
          const data = d.data() as Record<string, unknown>;
          const clientId = data.clientId as string | undefined;
          if (clientId) {
            bookingCountMap[clientId] = (bookingCountMap[clientId] || 0) + 1;
          }
        });

        const rows: ClientRow[] = usersSnap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            firstName: data.firstName as string | undefined,
            lastName: data.lastName as string | undefined,
            email: data.email as string | undefined,
            city: data.city as string | undefined,
            country: data.country as string | undefined,
            createdAt: data.createdAt as number | undefined,
            bookingCount: bookingCountMap[d.id] || 0,
            isSuspended: Boolean(data.isSuspended),
          };
        });

        setClients(rows);
      } catch (err) {
        console.error('Clients fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return clients;
    const q = debouncedSearch.toLowerCase();
    return clients.filter((c) => {
      const name = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
      const email = (c.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [clients, debouncedSearch]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  async function toggleExpand(clientId: string) {
    const newId = expandedId === clientId ? null : clientId;
    setExpandedId(newId);
    // Lazy-load bookings when first expanding
    if (newId && !expandedBookings[newId]) {
      setLoadingBookings((prev) => ({ ...prev, [newId]: true }));
      try {
        const snap = await getDocs(
          query(
            collection(db, 'bookings'),
            where('clientId', '==', newId),
            orderBy('createdAt', 'desc'),
            limit(5)
          )
        );
        // Enrich with barber names
        const barberIds = [
          ...new Set(
            snap.docs
              .map((d) => d.data().barberId as string | undefined)
              .filter(Boolean) as string[]
          ),
        ];
        const barberMap: Record<string, string> = {};
        await Promise.all(
          barberIds.map(async (bid) => {
            try {
              const userSnap = await getDoc(doc(db, 'users', bid));
              if (userSnap.exists()) {
                const u = userSnap.data() as Record<string, unknown>;
                barberMap[bid] = `${u.firstName || ''} ${u.lastName || ''}`.trim() || bid;
              }
            } catch {
              // skip
            }
          })
        );
        const bookings: ClientBooking[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          const bid = data.barberId as string | undefined;
          return {
            id: d.id,
            date: data.date as string | undefined,
            startTime: data.startTime as string | undefined,
            barberName: bid ? (barberMap[bid] || bid) : '—',
            serviceNames: data.serviceNames as string[] | undefined,
            totalPrice: data.totalPrice as number | undefined,
            status: data.status as string | undefined,
          };
        });
        setExpandedBookings((prev) => ({ ...prev, [newId]: bookings }));
      } catch (err) {
        console.error('Client bookings fetch error:', err);
      } finally {
        setLoadingBookings((prev) => ({ ...prev, [newId]: false }));
      }
    }
  }

  async function handleSuspend(clientId: string, isSuspended: boolean) {
    setSuspendingId(clientId);
    try {
      await updateDoc(doc(db, 'users', clientId), {
        isSuspended: !isSuspended,
        suspendedAt: !isSuspended ? Date.now() : null,
      });
      setClients((prev) =>
        prev.map((c) => (c.id === clientId ? { ...c, isSuspended: !isSuspended } : c))
      );
      toast.success(!isSuspended ? 'Client suspended' : 'Client unsuspended');
    } catch (err) {
      console.error('Suspend error:', err);
      toast.error('Failed to update client');
    } finally {
      setSuspendingId(null);
    }
  }

  async function handleDelete(clientId: string, name: string) {
    setDeletingId(clientId);
    try {
      // Cancel all active bookings first
      const bookingsSnap = await getDocs(
        query(collection(db, 'bookings'), where('clientId', '==', clientId))
      );
      const batch = writeBatch(db);
      bookingsSnap.docs.forEach((d) => {
        const s = d.data().status as string | undefined;
        if (s === 'pending' || s === 'confirmed') {
          batch.update(d.ref, { status: 'cancelled', updatedAt: Date.now() });
        }
      });
      // Delete the user document
      batch.delete(doc(db, 'users', clientId));
      await batch.commit();

      setClients((prev) => prev.filter((c) => c.id !== clientId));
      setDeleteConfirmId(null);
      toast.success(`${name} deleted`);
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete client');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>
          Clients
        </h1>
        <span style={{ fontSize: 13, color: '#555', fontWeight: 700 }}>
          {loading ? '…' : `${clients.length} total`}
        </span>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{
            maxWidth: 340,
            width: '100%',
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: 10,
            padding: '9px 14px',
            fontSize: 13,
            color: '#fff',
            outline: 'none',
          }}
        />
      </div>

      {/* Table header */}
      {!loading && paginated.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1.5fr 1.2fr 80px 80px',
            padding: '8px 16px',
            gap: 12,
            marginBottom: 6,
          }}
        >
          {['Name', 'Email', 'Location', 'Joined', 'Bookings', 'Actions'].map((h) => (
            <div key={h} style={{ fontSize: 11, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {h}
            </div>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ color: '#555', fontSize: 14 }}>Loading clients…</div>
      ) : paginated.length === 0 ? (
        <div style={{ color: '#555', fontSize: 14, padding: '20px 0' }}>No clients found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {paginated.map((client) => (
            <div key={client.id}>
              <div
                style={{
                  background: '#111',
                  border: '1px solid #1e1e1e',
                  borderRadius: expandedId === client.id ? '12px 12px 0 0' : 12,
                  padding: '12px 16px',
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 1.2fr 80px 80px',
                  gap: 12,
                  alignItems: 'center',
                }}
              >
                {/* Name + avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 900,
                      color: '#F5C518',
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(client.firstName, client.lastName)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {client.firstName || client.lastName
                        ? `${client.firstName || ''} ${client.lastName || ''}`.trim()
                        : '—'}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {client.email || '—'}
                </div>

                {/* Location */}
                <div style={{ fontSize: 12, color: '#888' }}>
                  {[client.city, client.country].filter(Boolean).join(', ') || '—'}
                </div>

                {/* Joined */}
                <div style={{ fontSize: 12, color: '#555' }}>
                  {formatDate(client.createdAt)}
                </div>

                {/* Booking count */}
                <div style={{ fontSize: 13, fontWeight: 800, color: client.bookingCount > 0 ? '#F5C518' : '#555', textAlign: 'center' }}>
                  {client.bookingCount}
                </div>

                {/* Actions */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => toggleExpand(client.id)}
                    style={{
                      background: 'none',
                      border: '1px solid #2a2a2a',
                      borderRadius: 8,
                      padding: '5px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      color: expandedId === client.id ? '#F5C518' : '#888',
                      cursor: 'pointer',
                    }}
                  >
                    {expandedId === client.id ? 'Close' : 'View'}
                  </button>
                </div>
              </div>

              {/* Inline expansion */}
              {expandedId === client.id && (
                <div
                  style={{
                    background: '#0d0d0d',
                    border: '1px solid #1e1e1e',
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    padding: '14px 16px',
                  }}
                >
                  {/* Basic info row */}
                  <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#444', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Email</div>
                      <div style={{ fontSize: 13, color: '#ccc' }}>{client.email || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#444', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>City</div>
                      <div style={{ fontSize: 13, color: '#ccc' }}>{client.city || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#444', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Country</div>
                      <div style={{ fontSize: 13, color: '#ccc' }}>{client.country || '—'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#444', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Member Since</div>
                      <div style={{ fontSize: 13, color: '#ccc' }}>{formatDate(client.createdAt)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#444', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Bookings</div>
                      <div style={{ fontSize: 13, color: '#F5C518', fontWeight: 800 }}>{client.bookingCount}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#444', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>UID</div>
                      <div style={{ fontSize: 11, color: '#555', fontFamily: 'monospace' }}>{client.id}</div>
                    </div>
                  </div>

                  {/* Recent bookings */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Recent Bookings</div>
                    {loadingBookings[client.id] ? (
                      <div style={{ fontSize: 12, color: '#555' }}>Loading…</div>
                    ) : (expandedBookings[client.id] || []).length === 0 ? (
                      <div style={{ fontSize: 12, color: '#555' }}>No bookings yet.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {(expandedBookings[client.id] || []).map((b) => (
                          <div
                            key={b.id}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '100px 1fr 1fr 70px 80px',
                              gap: 10,
                              padding: '8px 10px',
                              background: '#111',
                              borderRadius: 8,
                              border: '1px solid #1a1a1a',
                              alignItems: 'center',
                            }}
                          >
                            <div style={{ fontSize: 12, color: '#888' }}>
                              {b.date || '—'}
                              {b.startTime && <span style={{ color: '#555', marginLeft: 4 }}>{b.startTime}</span>}
                            </div>
                            <div style={{ fontSize: 12, color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.barberName || '—'}</div>
                            <div style={{ fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.serviceNames?.[0] || '—'}</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#F5C518' }}>{b.totalPrice !== undefined ? `€${b.totalPrice}` : '—'}</div>
                            <div>
                              {(() => {
                                const s = (b.status || '').toLowerCase();
                                if (s === 'confirmed' || s === 'completed')
                                  return <span className="bg-[#0f2010] text-[#22C55E] px-2 py-0.5 rounded-full text-[10px] font-black">{b.status}</span>;
                                if (s === 'pending')
                                  return <span className="bg-[#1a1500] text-[#F5C518] px-2 py-0.5 rounded-full text-[10px] font-black">{b.status}</span>;
                                if (s === 'cancelled')
                                  return <span className="bg-[#1a0808] text-[#EF4444] px-2 py-0.5 rounded-full text-[10px] font-black">{b.status}</span>;
                                return <span className="bg-[#1a1a1a] text-[#888] px-2 py-0.5 rounded-full text-[10px] font-black">{b.status || '—'}</span>;
                              })()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions row */}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleSuspend(client.id, Boolean(client.isSuspended))}
                      disabled={suspendingId === client.id}
                      style={{
                        background: 'none',
                        border: `1px solid ${client.isSuspended ? '#22C55E' : '#F5C518'}`,
                        borderRadius: 8,
                        padding: '6px 14px',
                        fontSize: 12,
                        fontWeight: 700,
                        color: client.isSuspended ? '#22C55E' : '#F5C518',
                        cursor: suspendingId === client.id ? 'not-allowed' : 'pointer',
                        opacity: suspendingId === client.id ? 0.5 : 1,
                      }}
                    >
                      {client.isSuspended ? '✓ Unsuspend' : 'Suspend'}
                    </button>
                    {client.isSuspended && (
                      <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>🚫 Suspended</span>
                    )}
                    <button
                      onClick={() => setDeleteConfirmId(deleteConfirmId === client.id ? null : client.id)}
                      style={{
                        background: 'none',
                        border: '1px solid #EF444440',
                        borderRadius: 8,
                        padding: '6px 14px',
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#EF4444',
                        cursor: 'pointer',
                        marginLeft: 'auto',
                      }}
                    >
                      Delete account
                    </button>
                  </div>

                  {/* Delete confirm */}
                  {deleteConfirmId === client.id && (
                    <div
                      style={{
                        marginTop: 10,
                        background: '#1a0808',
                        border: '1px solid #EF444430',
                        borderRadius: 10,
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontSize: 13, color: '#aaa', flex: 1 }}>
                        Delete {client.firstName || 'this client'}? This will cancel all their pending bookings.
                      </span>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#555', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(client.id, `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Client')}
                        disabled={deletingId === client.id}
                        style={{
                          background: '#EF4444',
                          border: 'none',
                          borderRadius: 8,
                          padding: '6px 14px',
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#fff',
                          cursor: deletingId === client.id ? 'not-allowed' : 'pointer',
                          opacity: deletingId === client.id ? 0.6 : 1,
                        }}
                      >
                        {deletingId === client.id ? 'Deleting…' : 'Confirm Delete'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
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
