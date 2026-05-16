'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

const PER_PAGE = 20;

type Tab = 'pending' | 'active' | 'suspended' | 'all';

interface EnrichedShop {
  id: string;
  name?: string;
  status: string;
  address?: Record<string, string>;
  city?: string;
  ownerId?: string;
  ownerName?: string;
  barbers?: string[];
  createdAt?: number;
  coverPhotoUrl?: string;
}

interface Counts {
  pending: number;
  active: number;
  suspended: number;
  all: number;
}

function daysAgo(ts?: number): string {
  if (!ts) return 'Unknown';
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'pending')
    return (
      <span className="bg-[#1a1500] text-[#F5C518] px-2.5 py-1 rounded-full text-[11px] font-black">
        Pending
      </span>
    );
  if (status === 'active')
    return (
      <span className="bg-[#0f2010] text-[#22C55E] px-2.5 py-1 rounded-full text-[11px] font-black">
        Active
      </span>
    );
  if (status === 'suspended')
    return (
      <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">
        Suspended
      </span>
    );
  if (status === 'rejected')
    return (
      <span className="bg-[#1a0808] text-[#EF4444] px-2.5 py-1 rounded-full text-[11px] font-black">
        Rejected
      </span>
    );
  return (
    <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">
      {status}
    </span>
  );
}

export default function AdminShopsPage() {
  const router = useRouter();
  const [shops, setShops] = useState<EnrichedShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [counts, setCounts] = useState<Counts>({ pending: 0, active: 0, suspended: 0, all: 0 });

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    async function fetchShops() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'barbershops'));
        const enriched: EnrichedShop[] = await Promise.all(
          snap.docs.map(async (shopDoc) => {
            const data = shopDoc.data() as Record<string, unknown>;
            let ownerName: string | undefined;
            const ownerId = data.ownerId as string | undefined;
            if (ownerId) {
              try {
                const userSnap = await getDoc(doc(db, 'users', ownerId));
                if (userSnap.exists()) {
                  const u = userSnap.data() as Record<string, unknown>;
                  ownerName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || undefined;
                }
              } catch {
                // user not found
              }
            }
            return {
              id: shopDoc.id,
              name: data.name as string | undefined,
              status: (data.status as string) || 'pending',
              address: data.address as Record<string, string> | undefined,
              city: (data.address as Record<string, string> | undefined)?.city || (data.city as string | undefined),
              ownerId,
              ownerName,
              barbers: data.barbers as string[] | undefined,
              createdAt: data.createdAt as number | undefined,
              coverPhotoUrl: data.coverPhotoUrl as string | undefined,
            };
          })
        );

        setShops(enriched);
        setCounts({
          pending: enriched.filter((s) => s.status === 'pending').length,
          active: enriched.filter((s) => s.status === 'active').length,
          suspended: enriched.filter((s) => s.status === 'suspended').length,
          all: enriched.length,
        });
      } catch (err) {
        console.error('Shops fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

  const filtered = useMemo(() => {
    let list = shops;

    if (tab === 'pending') list = list.filter((s) => s.status === 'pending');
    else if (tab === 'active') list = list.filter((s) => s.status === 'active');
    else if (tab === 'suspended') list = list.filter((s) => s.status === 'suspended');

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((s) => {
        const name = (s.name || '').toLowerCase();
        const owner = (s.ownerName || '').toLowerCase();
        const city = (s.city || '').toLowerCase();
        return name.includes(q) || owner.includes(q) || city.includes(q);
      });
    }

    return list;
  }, [shops, tab, debouncedSearch]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pending', label: `Pending (${counts.pending})` },
    { key: 'active', label: `Active (${counts.active})` },
    { key: 'suspended', label: `Suspended (${counts.suspended})` },
    { key: 'all', label: `All (${counts.all})` },
  ];

  function handleTabClick(t: Tab) {
    setTab(t);
    setPage(1);
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>
          Shops
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1e1e1e', marginBottom: 20 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => handleTabClick(t.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: tab === t.key ? '2px solid #F5C518' : '2px solid transparent',
              color: tab === t.key ? '#F5C518' : '#555',
              fontSize: 13,
              fontWeight: 700,
              padding: '10px 16px',
              cursor: 'pointer',
              transition: 'color 0.15s',
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name, owner, or city…"
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

      {/* List */}
      {loading ? (
        <div style={{ color: '#555', fontSize: 14 }}>Loading shops…</div>
      ) : paginated.length === 0 ? (
        <div style={{ color: '#555', fontSize: 14, padding: '20px 0' }}>No shops found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {paginated.map((shop) => (
            <div
              key={shop.id}
              onClick={() => router.push(`/admin/shops/${shop.id}`)}
              style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: 12,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#333')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e1e')}
            >
              {/* Shop icon */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                🏪
              </div>

              {/* Name + city */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>
                  {shop.name || '—'}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {shop.city || shop.address?.city || shop.address?.country || 'No location'}
                </div>
              </div>

              {/* Owner */}
              <div style={{ fontSize: 12, color: '#888', flexShrink: 0, minWidth: 120 }}>
                {shop.ownerName || shop.ownerId || '—'}
              </div>

              {/* Team size */}
              <div style={{ fontSize: 12, color: '#555', flexShrink: 0 }}>
                {(shop.barbers?.length ?? 0)} barber{(shop.barbers?.length ?? 0) !== 1 ? 's' : ''}
              </div>

              {/* Joined */}
              <div style={{ fontSize: 11, color: '#555', flexShrink: 0, minWidth: 80 }}>
                {daysAgo(shop.createdAt)}
              </div>

              {/* Status badge */}
              <div style={{ flexShrink: 0 }}>
                <StatusBadge status={shop.status} />
              </div>

              {/* Review link */}
              <Link
                href={`/admin/shops/${shop.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#F5C518',
                  textDecoration: 'none',
                  flexShrink: 0,
                  padding: '6px 12px',
                  border: '1px solid #F5C51840',
                  borderRadius: 8,
                }}
              >
                Review →
              </Link>
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
