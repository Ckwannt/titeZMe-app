'use client';

import { useState, useEffect, use } from 'react';
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/lib/toast';

interface ShopDetailPageProps {
  params: Promise<{ id: string }>;
}

interface ShopData {
  name?: string;
  status?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  ownerId?: string;
  barbers?: string[];
  createdAt?: number;
  coverPhotoUrl?: string;
  approvedAt?: number;
  rejectedAt?: number;
  suspendedAt?: number;
  rejectionReason?: string;
}

interface OwnerData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface BookingItem {
  id: string;
  clientId?: string;
  serviceNames?: string[];
  date?: string;
  startTime?: string;
  status?: string;
  totalPrice?: number;
  createdAt?: number;
}

interface BarberItem {
  id: string;
  firstName?: string;
  lastName?: string;
  isLive?: boolean;
}

function formatDate(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function StatusBadge({ status }: { status?: string }) {
  const s = status || '';
  if (s === 'pending')
    return <span className="bg-[#1a1500] text-[#F5C518] px-2.5 py-1 rounded-full text-[11px] font-black">Pending</span>;
  if (s === 'active')
    return <span className="bg-[#0f2010] text-[#22C55E] px-2.5 py-1 rounded-full text-[11px] font-black">Active</span>;
  if (s === 'suspended')
    return <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">Suspended</span>;
  if (s === 'rejected')
    return <span className="bg-[#1a0808] text-[#EF4444] px-2.5 py-1 rounded-full text-[11px] font-black">Rejected</span>;
  return null;
}

function BookingStatusBadge({ status }: { status?: string }) {
  const s = (status || '').toLowerCase();
  if (s === 'confirmed' || s === 'completed')
    return <span className="bg-[#0f2010] text-[#22C55E] px-2.5 py-1 rounded-full text-[11px] font-black">{status}</span>;
  if (s === 'pending')
    return <span className="bg-[#1a1500] text-[#F5C518] px-2.5 py-1 rounded-full text-[11px] font-black">{status}</span>;
  if (s === 'cancelled')
    return <span className="bg-[#1a0808] text-[#EF4444] px-2.5 py-1 rounded-full text-[11px] font-black">{status}</span>;
  return <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">{status || '—'}</span>;
}

export default function AdminShopDetailPage({ params }: ShopDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [shop, setShop] = useState<ShopData | null>(null);
  const [owner, setOwner] = useState<OwnerData | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [teamBarbers, setTeamBarbers] = useState<BarberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const shopSnap = await getDoc(doc(db, 'barbershops', id));
      if (!shopSnap.exists()) {
        setLoading(false);
        return;
      }
      const shopData = shopSnap.data() as ShopData;
      setShop(shopData);

      const ownerId = shopData.ownerId;

      const [ownerSnap, bookingsSnap, barbersSnap] = await Promise.all([
        ownerId ? getDoc(doc(db, 'users', ownerId)) : Promise.resolve(null),
        getDocs(
          query(
            collection(db, 'bookings'),
            where('shopId', '==', id),
            orderBy('createdAt', 'desc'),
            limit(5)
          )
        ),
        getDocs(query(collection(db, 'barberProfiles'), where('shopId', '==', id))),
      ]);

      if (ownerSnap && ownerSnap.exists()) {
        setOwner(ownerSnap.data() as OwnerData);
      }

      setBookings(
        bookingsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BookingItem, 'id'>) }))
      );

      const barberIds = (shopData.barbers || []);
      const barberList: BarberItem[] = barbersSnap.docs.map((d) => {
        const bd = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          firstName: bd.firstName as string | undefined,
          lastName: bd.lastName as string | undefined,
          isLive: Boolean(bd.isLive),
        };
      });
      // If barberProfiles query returned nothing but barbers array exists, keep it minimal
      if (barberList.length === 0 && barberIds.length > 0) {
        setTeamBarbers(barberIds.map((bid) => ({ id: bid })));
      } else {
        setTeamBarbers(barberList);
      }
    } catch (err) {
      console.error('Shop detail fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleApprove() {
    if (!user || !shop) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'barbershops', id), {
        status: 'active',
        approvedAt: Date.now(),
        rejectionReason: null,
      });
      if (shop.ownerId) {
        await addDoc(collection(db, 'notifications'), {
          userId: shop.ownerId,
          message: '🎉 Your barbershop has been approved and is now active on titeZMe!',
          read: false,
          linkTo: '/dashboard/shop',
          createdAt: Date.now(),
        });
      }
      await addDoc(collection(db, 'adminLogs'), {
        action: 'approved_shop',
        targetId: id,
        adminId: user.uid,
        timestamp: Date.now(),
      });
      toast.success('Shop approved ✓');
      router.push('/admin/shops');
    } catch (err) {
      console.error('Approve error:', err);
      toast.error('Failed to approve');
    } finally {
      setSaving(false);
    }
  }

  async function handleReject() {
    if (!user || !rejectionReason.trim() || !shop) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'barbershops', id), {
        status: 'rejected',
        rejectionReason: rejectionReason.trim(),
        rejectedAt: Date.now(),
      });
      if (shop.ownerId) {
        await addDoc(collection(db, 'notifications'), {
          userId: shop.ownerId,
          message: `Your shop application wasn't approved. Reason: ${rejectionReason.trim()}.`,
          read: false,
          linkTo: '/dashboard/shop',
          createdAt: Date.now(),
        });
      }
      await addDoc(collection(db, 'adminLogs'), {
        action: 'rejected_shop',
        targetId: id,
        reason: rejectionReason.trim(),
        adminId: user.uid,
        timestamp: Date.now(),
      });
      toast.success('Shop rejected');
      router.push('/admin/shops');
    } catch (err) {
      console.error('Reject error:', err);
      toast.error('Failed to reject');
    } finally {
      setSaving(false);
    }
  }

  async function handleSuspend() {
    if (!user || !shop) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'barbershops', id), {
        status: 'suspended',
        suspendedAt: Date.now(),
      });
      if (shop.ownerId) {
        await addDoc(collection(db, 'notifications'), {
          userId: shop.ownerId,
          message: 'Your shop has been suspended. Contact support for more information.',
          read: false,
          linkTo: '/dashboard/shop',
          createdAt: Date.now(),
        });
      }
      toast.success('Shop suspended');
      await loadData();
    } catch (err) {
      console.error('Suspend error:', err);
      toast.error('Failed to suspend');
    } finally {
      setSaving(false);
    }
  }

  async function handleReactivate() {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'barbershops', id), { status: 'active' });
      toast.success('Shop reactivated');
      await loadData();
    } catch (err) {
      console.error('Reactivate error:', err);
      toast.error('Failed to reactivate');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ color: '#555', fontSize: 14, padding: 20 }}>Loading…</div>;
  }

  if (!shop) {
    return <div style={{ color: '#EF4444', fontSize: 14, padding: 20 }}>Shop not found.</div>;
  }

  const status = shop.status || 'pending';
  const ownerFullName = owner
    ? `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Unknown'
    : shop.ownerId || '—';

  return (
    <div style={{ maxWidth: 1060 }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/shops" style={{ fontSize: 13, color: '#555', textDecoration: 'none', fontWeight: 700 }}>
          ← Back to Shops
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* LEFT COLUMN */}
        <div style={{ flex: 1, minWidth: 280 }}>
          {/* Shop info card */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            <div style={{ marginBottom: 8 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>
                {shop.name || 'Unnamed Shop'}
              </h2>
              <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                {[shop.address, shop.city, shop.country].filter(Boolean).join(', ') || 'No location'}
              </p>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* Team barbers */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
              Team ({teamBarbers.length} barber{teamBarbers.length !== 1 ? 's' : ''})
            </h3>
            {teamBarbers.length === 0 ? (
              <p style={{ fontSize: 13, color: '#555' }}>No barbers yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {teamBarbers.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#0d0d0d',
                      borderRadius: 8,
                      border: '1px solid #1a1a1a',
                    }}
                  >
                    <div style={{ fontSize: 13, color: '#ccc', fontWeight: 600 }}>
                      {b.firstName || b.lastName
                        ? `${b.firstName || ''} ${b.lastName || ''}`.trim()
                        : b.id}
                    </div>
                    {b.isLive !== undefined && (
                      <span
                        style={{
                          fontSize: 11,
                          color: b.isLive ? '#22C55E' : '#555',
                          fontWeight: 700,
                        }}
                      >
                        {b.isLive ? '● Live' : '○ Offline'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent bookings */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
              Recent Bookings
            </h3>
            {bookings.length === 0 ? (
              <p style={{ fontSize: 13, color: '#555' }}>No bookings yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#0d0d0d',
                      borderRadius: 8,
                      border: '1px solid #1a1a1a',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, color: '#ccc', fontWeight: 600 }}>
                        {b.serviceNames?.[0] || '—'}
                      </div>
                      <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                        {b.date || '—'} {b.startTime ? `· ${b.startTime}` : ''}
                      </div>
                    </div>
                    <BookingStatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: 340, flexShrink: 0 }}>
          {/* Approval card */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            <div style={{ marginBottom: 14 }}>
              <StatusBadge status={status} />
            </div>

            {/* PENDING */}
            {status === 'pending' && (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <button
                    onClick={handleApprove}
                    disabled={saving}
                    className="bg-[#22C55E] text-black font-black px-5 py-2.5 rounded-xl text-sm hover:opacity-90"
                    style={{ flex: 1, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => setShowRejectForm((v) => !v)}
                    disabled={saving}
                    className="border border-[#EF4444] text-[#EF4444] font-black px-5 py-2.5 rounded-xl text-sm hover:bg-[#1a0808]"
                    style={{ flex: 1, background: 'none', cursor: saving ? 'not-allowed' : 'pointer' }}
                  >
                    ✗ Reject
                  </button>
                </div>
                {showRejectForm && (
                  <div>
                    <textarea
                      placeholder="Reason for rejection…"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        background: '#0d0d0d',
                        border: '1px solid #2a2a2a',
                        borderRadius: 10,
                        padding: '10px 12px',
                        fontSize: 13,
                        color: '#fff',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      onClick={handleReject}
                      disabled={saving || !rejectionReason.trim()}
                      style={{
                        marginTop: 8,
                        width: '100%',
                        background: '#EF4444',
                        border: 'none',
                        borderRadius: 10,
                        padding: '10px',
                        fontSize: 13,
                        fontWeight: 800,
                        color: '#fff',
                        cursor: saving || !rejectionReason.trim() ? 'not-allowed' : 'pointer',
                        opacity: saving || !rejectionReason.trim() ? 0.5 : 1,
                      }}
                    >
                      Send rejection
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ACTIVE */}
            {status === 'active' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                  <span style={{ fontSize: 13, color: '#22C55E', fontWeight: 700 }}>Currently Active</span>
                </div>
                <button
                  onClick={handleSuspend}
                  disabled={saving}
                  className="border border-[#EF4444] text-[#EF4444] font-black px-5 py-2.5 rounded-xl text-sm hover:bg-[#1a0808]"
                  style={{ width: '100%', background: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
                >
                  Suspend shop
                </button>
              </div>
            )}

            {/* SUSPENDED */}
            {status === 'suspended' && (
              <div>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>This shop is currently suspended.</p>
                <button
                  onClick={handleReactivate}
                  disabled={saving}
                  className="bg-[#22C55E] text-black font-black px-5 py-2.5 rounded-xl text-sm hover:opacity-90"
                  style={{ width: '100%', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
                >
                  Reactivate
                </button>
              </div>
            )}

            {/* REJECTED */}
            {status === 'rejected' && (
              <div>
                {shop.rejectionReason && (
                  <div style={{ background: '#1a0808', border: '1px solid #EF444430', borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: '#EF4444', marginBottom: 4, fontWeight: 700 }}>Rejection reason</div>
                    <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>{shop.rejectionReason}</p>
                  </div>
                )}
                <button
                  onClick={handleApprove}
                  disabled={saving}
                  className="bg-[#22C55E] text-black font-black px-5 py-2.5 rounded-xl text-sm hover:opacity-90"
                  style={{ width: '100%', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
                >
                  Approve instead
                </button>
              </div>
            )}
          </div>

          {/* Shop info card */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Shop info</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Owner', value: ownerFullName },
                { label: 'Email', value: owner?.email },
                { label: 'Phone', value: shop.phone || owner?.phone },
                { label: 'Address', value: shop.address },
                { label: 'City', value: shop.city },
                { label: 'Country', value: shop.country },
                { label: 'Barbers', value: String(shop.barbers?.length ?? 0) },
                { label: 'Created', value: formatDate(shop.createdAt) },
                { label: 'Approved', value: shop.approvedAt ? formatDate(shop.approvedAt) : undefined },
              ]
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label} style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#555', minWidth: 70, flexShrink: 0 }}>{row.label}</span>
                    <span style={{ fontSize: 12, color: '#ccc', fontWeight: 600, wordBreak: 'break-all' }}>{row.value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
