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
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import { toast } from '@/lib/toast';

interface BarberDetailPageProps {
  params: Promise<{ id: string }>;
}

interface BarberProfile {
  approvalStatus?: string;
  isLive?: boolean;
  city?: string;
  country?: string;
  barberCode?: string;
  profilePhotoUrl?: string;
  createdAt?: number;
  bio?: string;
  languages?: string[];
  specialties?: string[];
  photos?: string[];
  rating?: number;
  reviewCount?: number;
  totalCuts?: number;
  rejectionReason?: string;
  approvedAt?: number;
  rejectedAt?: number;
  suspendedAt?: number;
}

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface BookingItem {
  id: string;
  clientId?: string;
  clientName?: string;
  serviceName?: string;
  date?: string;
  status?: string;
  createdAt?: number;
}

interface ReviewItem {
  id: string;
  rating?: number;
  comment?: string;
  createdAt?: number;
  clientName?: string;
}

function StatusBadge({ status, isLive }: { status?: string; isLive?: boolean }) {
  const s = status || '';
  if (s === 'pending')
    return (
      <span className="bg-[#1a1500] text-[#F5C518] px-2.5 py-1 rounded-full text-[11px] font-black">
        Pending
      </span>
    );
  if (s === 'approved' && isLive)
    return (
      <span className="bg-[#0f2010] text-[#22C55E] px-2.5 py-1 rounded-full text-[11px] font-black">
        Live ●
      </span>
    );
  if (s === 'approved' && !isLive)
    return (
      <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">
        Approved (offline)
      </span>
    );
  if (s === 'rejected')
    return (
      <span className="bg-[#1a0808] text-[#EF4444] px-2.5 py-1 rounded-full text-[11px] font-black">
        Rejected
      </span>
    );
  if (s === 'suspended')
    return (
      <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">
        Suspended
      </span>
    );
  return null;
}

function BookingStatusBadge({ status }: { status?: string }) {
  const s = (status || '').toLowerCase();
  if (s === 'confirmed' || s === 'completed')
    return (
      <span className="bg-[#0f2010] text-[#22C55E] px-2.5 py-1 rounded-full text-[11px] font-black">
        {status}
      </span>
    );
  if (s === 'pending')
    return (
      <span className="bg-[#1a1500] text-[#F5C518] px-2.5 py-1 rounded-full text-[11px] font-black">
        {status}
      </span>
    );
  if (s === 'cancelled')
    return (
      <span className="bg-[#1a0808] text-[#EF4444] px-2.5 py-1 rounded-full text-[11px] font-black">
        {status}
      </span>
    );
  return (
    <span className="bg-[#1a1a1a] text-[#888] px-2.5 py-1 rounded-full text-[11px] font-black">
      {status || '—'}
    </span>
  );
}

function StarRating({ rating }: { rating?: number }) {
  const r = Math.round(rating || 0);
  return (
    <span style={{ color: '#F5C518', fontSize: 13 }}>
      {'★'.repeat(r)}
      {'☆'.repeat(5 - r)}
    </span>
  );
}

function formatDate(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getInitials(first?: string, last?: string): string {
  return `${(first || '?')[0]}${(last || '')[0] || ''}`.toUpperCase();
}

export default function AdminBarberDetailPage({ params }: BarberDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [profile, setProfile] = useState<BarberProfile | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [profileSnap, userSnap, bookingsSnap, reviewsSnap] = await Promise.all([
        getDoc(doc(db, 'barberProfiles', id)),
        getDoc(doc(db, 'users', id)),
        getDocs(
          query(
            collection(db, 'bookings'),
            where('barberId', '==', id),
            orderBy('createdAt', 'desc'),
            limit(5)
          )
        ),
        getDocs(
          query(
            collection(db, 'reviews'),
            where('providerId', '==', id),
            orderBy('createdAt', 'desc'),
            limit(5)
          )
        ),
      ]);

      if (profileSnap.exists()) {
        setProfile(profileSnap.data() as BarberProfile);
      }
      if (userSnap.exists()) {
        setUserData(userSnap.data() as UserData);
      }
      setBookings(
        bookingsSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<BookingItem, 'id'>),
        }))
      );
      setReviews(
        reviewsSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ReviewItem, 'id'>),
        }))
      );
    } catch (err) {
      console.error('Barber detail fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleApprove() {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'barberProfiles', id), {
        approvalStatus: 'approved',
        isLive: true,
        approvedAt: Date.now(),
        rejectionReason: null,
      });
      await addDoc(collection(db, 'notifications'), {
        userId: id,
        message:
          "🎉 Your titeZMe profile has been approved. You're now live!",
        read: false,
        linkTo: '/dashboard/barber',
        createdAt: Date.now(),
      });
      await addDoc(collection(db, 'adminLogs'), {
        action: 'approved_barber',
        targetId: id,
        adminId: user.uid,
        timestamp: Date.now(),
      });
      toast.success('Barber approved ✓');
      router.push('/admin/barbers');
    } catch (err) {
      console.error('Approve error:', err);
      toast.error('Failed to approve');
    } finally {
      setSaving(false);
    }
  }

  async function handleReject() {
    if (!user || !rejectionReason.trim()) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'barberProfiles', id), {
        approvalStatus: 'rejected',
        isLive: false,
        rejectionReason: rejectionReason.trim(),
        rejectedAt: Date.now(),
      });
      await addDoc(collection(db, 'notifications'), {
        userId: id,
        message: `Your profile wasn't approved. Reason: ${rejectionReason.trim()}. Please update and resubmit.`,
        read: false,
        linkTo: '/dashboard/barber',
        createdAt: Date.now(),
      });
      await addDoc(collection(db, 'adminLogs'), {
        action: 'rejected_barber',
        targetId: id,
        reason: rejectionReason.trim(),
        adminId: user.uid,
        timestamp: Date.now(),
      });
      toast.success('Barber rejected');
      router.push('/admin/barbers');
    } catch (err) {
      console.error('Reject error:', err);
      toast.error('Failed to reject');
    } finally {
      setSaving(false);
    }
  }

  async function handleSuspend() {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'barberProfiles', id), {
        approvalStatus: 'suspended',
        isLive: false,
        suspendedAt: Date.now(),
      });
      await addDoc(collection(db, 'notifications'), {
        userId: id,
        message: 'Your account has been suspended. Contact support.',
        read: false,
        linkTo: '/dashboard/barber',
        createdAt: Date.now(),
      });
      toast.success('Account suspended');
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
      await updateDoc(doc(db, 'barberProfiles', id), {
        approvalStatus: 'approved',
        isLive: true,
      });
      toast.success('Account reactivated');
      await loadData();
    } catch (err) {
      console.error('Reactivate error:', err);
      toast.error('Failed to reactivate');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteReview(reviewId: string) {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      toast.success('Review deleted');
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error('Delete review error:', err);
      toast.error('Failed to delete review');
    }
  }

  if (loading) {
    return (
      <div style={{ color: '#555', fontSize: 14, padding: 20 }}>Loading…</div>
    );
  }

  if (!profile) {
    return (
      <div style={{ color: '#EF4444', fontSize: 14, padding: 20 }}>
        Barber profile not found.
      </div>
    );
  }

  const status = profile.approvalStatus || 'pending';
  const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'Unknown';

  return (
    <div style={{ maxWidth: 1060 }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24 }}>
        <Link
          href="/admin/barbers"
          style={{
            fontSize: 13,
            color: '#555',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          ← Back to Barbers
        </Link>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          display: 'flex',
          gap: 28,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ flex: 1, minWidth: 280 }}>
          {/* Profile preview card */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            {/* Photo */}
            <div style={{ marginBottom: 16 }}>
              {profile.profilePhotoUrl ? (
                <Image
                  src={profile.profilePhotoUrl}
                  alt={fullName}
                  width={128}
                  height={128}
                  style={{
                    width: 128,
                    height: 128,
                    borderRadius: 16,
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 128,
                    height: 128,
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 40,
                    fontWeight: 900,
                    color: '#F5C518',
                  }}
                >
                  {getInitials(userData?.firstName, userData?.lastName)}
                </div>
              )}
            </div>

            {/* Name, city, country */}
            <div style={{ marginBottom: 8 }}>
              <h2
                style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: 0 }}
              >
                {fullName}
              </h2>
              <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                {[profile.city, profile.country].filter(Boolean).join(', ') || 'No location'}
              </p>
            </div>

            {/* Status badge */}
            <div style={{ marginBottom: 12 }}>
              <StatusBadge status={status} isLive={profile.isLive} />
            </div>

            {/* Rating */}
            {typeof profile.rating === 'number' && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}
              >
                <StarRating rating={profile.rating} />
                <span style={{ fontSize: 13, color: '#888' }}>
                  {profile.rating.toFixed(1)} ({profile.reviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Bio */}
            {profile.bio && (
              <p
                style={{
                  fontSize: 13,
                  color: '#aaa',
                  lineHeight: 1.6,
                  marginBottom: 14,
                }}
              >
                {profile.bio}
              </p>
            )}

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>
                  Languages
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {profile.languages.map((lang) => (
                    <span
                      key={lang}
                      style={{
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                        borderRadius: 20,
                        padding: '3px 10px',
                        fontSize: 12,
                        color: '#ccc',
                      }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {profile.specialties && profile.specialties.length > 0 && (
              <div>
                <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>
                  Specialties
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {profile.specialties.map((s) => (
                    <span
                      key={s}
                      style={{
                        background: '#1a1200',
                        border: '1px solid #F5C51830',
                        borderRadius: 20,
                        padding: '3px 10px',
                        fontSize: 12,
                        color: '#F5C518',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            <h3
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#fff',
                marginBottom: 12,
              }}
            >
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
                        {b.clientName || b.clientId || '—'}
                      </div>
                      <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
                        {b.serviceName || '—'} · {b.date || '—'}
                      </div>
                    </div>
                    <BookingStatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            <h3
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#fff',
                marginBottom: 12,
              }}
            >
              Recent Reviews
            </h3>
            {reviews.length === 0 ? (
              <p style={{ fontSize: 13, color: '#555' }}>No reviews yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      padding: '10px 12px',
                      background: '#0d0d0d',
                      borderRadius: 8,
                      border: '1px solid #1a1a1a',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StarRating rating={r.rating} />
                        <span style={{ fontSize: 11, color: '#555' }}>
                          {formatDate(r.createdAt)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        style={{
                          background: 'none',
                          border: '1px solid #EF444440',
                          borderRadius: 6,
                          padding: '3px 8px',
                          fontSize: 11,
                          color: '#EF4444',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    {r.comment && (
                      <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>
                        {r.comment}
                      </p>
                    )}
                    {r.clientName && (
                      <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
                        — {r.clientName}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: 340, flexShrink: 0 }}>
          {/* Approval Card */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            <div style={{ marginBottom: 14 }}>
              <StatusBadge status={status} isLive={profile.isLive} />
            </div>

            {/* PENDING */}
            {status === 'pending' && (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <button
                    onClick={handleApprove}
                    disabled={saving}
                    className="bg-[#22C55E] text-black font-black px-5 py-2.5 rounded-xl text-sm hover:opacity-90"
                    style={{ flex: 1, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}
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
                        cursor:
                          saving || !rejectionReason.trim()
                            ? 'not-allowed'
                            : 'pointer',
                        opacity: saving || !rejectionReason.trim() ? 0.5 : 1,
                      }}
                    >
                      Send rejection
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* APPROVED / LIVE */}
            {(status === 'approved') && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#22C55E',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontSize: 13, color: '#22C55E', fontWeight: 700 }}>
                    Currently Live
                  </span>
                </div>
                <button
                  onClick={handleSuspend}
                  disabled={saving}
                  className="border border-[#EF4444] text-[#EF4444] font-black px-5 py-2.5 rounded-xl text-sm hover:bg-[#1a0808]"
                  style={{
                    width: '100%',
                    background: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  Suspend account
                </button>
              </div>
            )}

            {/* SUSPENDED */}
            {status === 'suspended' && (
              <div>
                <p style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>
                  This account is currently suspended.
                </p>
                <button
                  onClick={handleReactivate}
                  disabled={saving}
                  className="bg-[#22C55E] text-black font-black px-5 py-2.5 rounded-xl text-sm hover:opacity-90"
                  style={{
                    width: '100%',
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  Reactivate
                </button>
              </div>
            )}

            {/* REJECTED */}
            {status === 'rejected' && (
              <div>
                {profile.rejectionReason && (
                  <div
                    style={{
                      background: '#1a0808',
                      border: '1px solid #EF444430',
                      borderRadius: 10,
                      padding: '10px 12px',
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#EF4444', marginBottom: 4, fontWeight: 700 }}>
                      Rejection reason
                    </div>
                    <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>
                      {profile.rejectionReason}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleApprove}
                  disabled={saving}
                  className="bg-[#22C55E] text-black font-black px-5 py-2.5 rounded-xl text-sm hover:opacity-90"
                  style={{
                    width: '100%',
                    border: 'none',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  Approve instead
                </button>
              </div>
            )}
          </div>

          {/* Profile Info Card */}
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
            <h3
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#fff',
                marginBottom: 14,
              }}
            >
              Profile info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Email', value: userData?.email },
                { label: 'Phone', value: userData?.phone },
                { label: 'Barber code', value: profile.barberCode },
                {
                  label: 'Location',
                  value: [profile.city, profile.country].filter(Boolean).join(', '),
                },
                { label: 'Member since', value: formatDate(profile.createdAt) },
                {
                  label: 'Total cuts',
                  value:
                    profile.totalCuts !== undefined
                      ? String(profile.totalCuts)
                      : undefined,
                },
                {
                  label: 'Rating',
                  value:
                    profile.rating !== undefined
                      ? `${profile.rating.toFixed(1)} / 5.0`
                      : undefined,
                },
              ]
                .filter((row) => row.value)
                .map((row) => (
                  <div key={row.label} style={{ display: 'flex', gap: 8 }}>
                    <span
                      style={{ fontSize: 12, color: '#555', minWidth: 90, flexShrink: 0 }}
                    >
                      {row.label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: '#ccc',
                        fontWeight: 600,
                        wordBreak: 'break-all',
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
