'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import Image from 'next/image';

const PER_PAGE = 20;

type Tab = 'pending' | 'live' | 'rejected' | 'suspended' | 'all';

interface EnrichedBarber {
  id: string;
  approvalStatus: string;
  isLive: boolean;
  city?: string;
  barberCode?: string;
  profilePhotoUrl?: string;
  createdAt?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  languages?: string[];
  photos?: string[];
  rating?: number;
  reviewCount?: number;
}

interface Counts {
  pending: number;
  live: number;
  rejected: number;
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

function getInitials(first?: string, last?: string): string {
  return `${(first || '?')[0]}${(last || '')[0] || ''}`.toUpperCase();
}

function StatusBadge({ status, isLive }: { status: string; isLive: boolean }) {
  if (status === 'pending')
    return (
      <span className="bg-[#1a1500] text-[#F5C518] px-2.5 py-1 rounded-full text-[11px] font-black">
        Pending
      </span>
    );
  if (status === 'approved' && isLive)
    return (
      <span className="bg-[#0f2010] text-[#22C55E] px-2.5 py-1 rounded-full text-[11px] font-black">
        Live
      </span>
    );
  if (status === 'approved' && !isLive)
    return (
      <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">
        Approved (offline)
      </span>
    );
  if (status === 'rejected')
    return (
      <span className="bg-[#1a0808] text-[#EF4444] px-2.5 py-1 rounded-full text-[11px] font-black">
        Rejected
      </span>
    );
  if (status === 'suspended')
    return (
      <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">
        Suspended
      </span>
    );
  return (
    <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">
      {status}
    </span>
  );
}

export default function AdminBarbersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [barbers, setBarbers] = useState<EnrichedBarber[]>([]);
  const [loading, setLoading] = useState(true);
  // Initialise tab from URL query param so links like /admin/barbers?tab=suspended work
  const [tab, setTab] = useState<Tab>(() => {
    const urlTab = searchParams.get('tab');
    const valid: Tab[] = ['pending', 'live', 'rejected', 'suspended', 'all'];
    return valid.includes(urlTab as Tab) ? (urlTab as Tab) : 'pending';
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [counts, setCounts] = useState<Counts>({
    pending: 0,
    live: 0,
    rejected: 0,
    suspended: 0,
    all: 0,
  });

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    async function fetchBarbers() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'barberProfiles'));
        const enriched: EnrichedBarber[] = await Promise.all(
          snap.docs.map(async (profileDoc) => {
            const data = profileDoc.data() as Record<string, unknown>;
            let firstName: string | undefined;
            let lastName: string | undefined;
            let email: string | undefined;
            try {
              const userSnap = await getDoc(doc(db, 'users', profileDoc.id));
              if (userSnap.exists()) {
                const u = userSnap.data() as Record<string, unknown>;
                firstName = u.firstName as string | undefined;
                lastName = u.lastName as string | undefined;
                email = u.email as string | undefined;
              }
            } catch {
              // user doc not found — skip enrichment
            }
            return {
              id: profileDoc.id,
              // Fall back based on isLive for barbers created before approvalStatus was added
              approvalStatus: (data.approvalStatus as string) || (data.isLive ? 'approved' : 'pending'),
              isLive: Boolean(data.isLive),
              city: data.city as string | undefined,
              barberCode: data.barberCode as string | undefined,
              profilePhotoUrl: data.profilePhotoUrl as string | undefined,
              createdAt: data.createdAt as number | undefined,
              bio: data.bio as string | undefined,
              languages: data.languages as string[] | undefined,
              photos: data.photos as string[] | undefined,
              rating: data.rating as number | undefined,
              reviewCount: data.reviewCount as number | undefined,
              firstName,
              lastName,
              email,
            };
          })
        );

        setBarbers(enriched);
        setCounts({
          pending: enriched.filter((b) => b.approvalStatus === 'pending').length,
          live: enriched.filter((b) => b.isLive).length,
          rejected: enriched.filter((b) => b.approvalStatus === 'rejected').length,
          suspended: enriched.filter((b) => b.approvalStatus === 'suspended').length,
          all: enriched.length,
        });
      } catch (err) {
        console.error('Barbers fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBarbers();
  }, []);

  const filtered = useMemo(() => {
    let list = barbers;

    // Tab filter
    if (tab === 'pending') list = list.filter((b) => b.approvalStatus === 'pending');
    else if (tab === 'live') list = list.filter((b) => b.isLive);
    else if (tab === 'rejected') list = list.filter((b) => b.approvalStatus === 'rejected');
    else if (tab === 'suspended') list = list.filter((b) => b.approvalStatus === 'suspended');

    // Search filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((b) => {
        const name = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
        const city = (b.city || '').toLowerCase();
        return name.includes(q) || city.includes(q);
      });
    }

    return list;
  }, [barbers, tab, debouncedSearch]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pending', label: `Pending (${counts.pending})` },
    { key: 'live', label: `Live (${counts.live})` },
    { key: 'rejected', label: `Rejected (${counts.rejected})` },
    { key: 'suspended', label: `Suspended (${counts.suspended})` },
    { key: 'all', label: `All (${counts.all})` },
  ];

  function handleTabClick(t: Tab) {
    setTab(t);
    setPage(1);
    router.replace(`/admin/barbers?tab=${t}`, { scroll: false });
  }

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>
          Barbers
        </h1>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid #1e1e1e',
          marginBottom: 20,
        }}
      >
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
          placeholder="Search by name or city…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            maxWidth: 320,
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
        <div style={{ color: '#555', fontSize: 14 }}>Loading barbers…</div>
      ) : paginated.length === 0 ? (
        <div style={{ color: '#555', fontSize: 14, padding: '20px 0' }}>
          No barbers found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {paginated.map((barber) => (
            <div
              key={barber.id}
              onClick={() => router.push(`/admin/barbers/${barber.id}`)}
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
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = '#333')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.borderColor = '#1e1e1e')
              }
            >
              {/* Avatar */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  color: '#F5C518',
                  position: 'relative',
                }}
              >
                {barber.profilePhotoUrl ? (
                  <Image
                    src={barber.profilePhotoUrl}
                    alt={`${barber.firstName || ''} ${barber.lastName || ''}`}
                    width={48}
                    height={48}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  getInitials(barber.firstName, barber.lastName)
                )}
              </div>

              {/* Name + city */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>
                  {barber.firstName || '—'} {barber.lastName || ''}
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  {barber.city || 'No city'}
                </div>
              </div>

              {/* Barber code */}
              <div
                style={{
                  fontSize: 11,
                  color: '#555',
                  fontFamily: 'monospace',
                  flexShrink: 0,
                }}
              >
                {barber.barberCode || '—'}
              </div>

              {/* Joined */}
              <div
                style={{ fontSize: 11, color: '#555', flexShrink: 0, minWidth: 80 }}
              >
                {daysAgo(barber.createdAt)}
              </div>

              {/* Status badge */}
              <div style={{ flexShrink: 0 }}>
                <StatusBadge
                  status={barber.approvalStatus}
                  isLive={barber.isLive}
                />
              </div>

              {/* Review link */}
              <Link
                href={`/admin/barbers/${barber.id}`}
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 20,
          }}
        >
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
          <span style={{ fontSize: 13, color: '#555' }}>
            Page {page} of {totalPages}
          </span>
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
