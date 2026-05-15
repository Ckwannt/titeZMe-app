'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useDebounce } from '@/hooks/useDebounce';

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

  function toggleExpand(clientId: string) {
    setExpandedId((prev) => (prev === clientId ? null : clientId));
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
                    display: 'flex',
                    gap: 32,
                    flexWrap: 'wrap',
                  }}
                >
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
