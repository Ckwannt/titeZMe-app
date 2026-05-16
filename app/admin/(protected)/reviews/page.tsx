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
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/lib/toast';

const PER_PAGE = 20;
const FETCH_LIMIT = 200;

interface ReviewRow {
  id: string;
  clientId?: string;
  providerId?: string;
  rating?: number;
  comment?: string;
  createdAt?: number;
  barberName?: string;
  isFlagged?: boolean;
}

function StarRating({ rating }: { rating?: number }) {
  const r = Math.round(rating || 0);
  return (
    <span style={{ color: '#F5C518', fontSize: 14, letterSpacing: 1 }}>
      {'★'.repeat(r)}
      <span style={{ color: '#333' }}>{'★'.repeat(5 - r)}</span>
    </span>
  );
}

function formatDate(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function maskClientId(id?: string): string {
  if (!id) return '—';
  return `Client #...${id.slice(-4)}`;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [showFlagged, setShowFlagged] = useState(false);
  const [page, setPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(FETCH_LIMIT))
        );

        const rawReviews: ReviewRow[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            clientId: data.clientId as string | undefined,
            providerId: data.providerId as string | undefined,
            rating: data.rating as number | undefined,
            comment: data.comment as string | undefined,
            createdAt: data.createdAt as number | undefined,
            isFlagged: Boolean(data.isFlagged),
          };
        });

        // Collect unique providerIds to fetch barber names
        const providerIds = new Set<string>();
        rawReviews.forEach((r) => { if (r.providerId) providerIds.add(r.providerId); });

        const barberNameMap: Record<string, string> = {};
        await Promise.all(
          Array.from(providerIds).map(async (pid) => {
            try {
              // Try barberProfiles first, fall back to users
              const profileSnap = await getDoc(doc(db, 'barberProfiles', pid));
              if (profileSnap.exists()) {
                const pd = profileSnap.data() as Record<string, unknown>;
                if (pd.firstName || pd.lastName) {
                  barberNameMap[pid] = `${pd.firstName || ''} ${pd.lastName || ''}`.trim();
                  return;
                }
              }
              const userSnap = await getDoc(doc(db, 'users', pid));
              if (userSnap.exists()) {
                const u = userSnap.data() as Record<string, unknown>;
                barberNameMap[pid] = `${u.firstName || ''} ${u.lastName || ''}`.trim() || pid;
              }
            } catch {
              // skip
            }
          })
        );

        const enriched = rawReviews.map((r) => ({
          ...r,
          barberName: r.providerId ? (barberNameMap[r.providerId] || r.providerId) : '—',
        }));

        setReviews(enriched);
      } catch (err) {
        console.error('Reviews fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const filtered = useMemo(() => {
    let list = reviews;

    if (showFlagged) {
      list = list.filter((r) => r.isFlagged);
    }

    if (ratingFilter !== 0) {
      list = list.filter((r) => Math.round(r.rating || 0) === ratingFilter);
    }

    return list;
  }, [reviews, showFlagged, ratingFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  async function recalculateBarberRating(barberId: string) {
    try {
      const remainingSnap = await getDocs(
        query(collection(db, 'reviews'), where('providerId', '==', barberId))
      );
      const ratings = remainingSnap.docs
        .map((d) => d.data().rating as number)
        .filter((r) => typeof r === 'number');
      const newCount = ratings.length;
      const newRating =
        newCount > 0
          ? Number((ratings.reduce((a, b) => a + b, 0) / newCount).toFixed(1))
          : 0;
      await updateDoc(doc(db, 'barberProfiles', barberId), {
        rating: newRating,
        reviewCount: newCount,
      });
    } catch (err) {
      console.error('Rating recalc error:', err);
    }
  }

  async function handleDelete(reviewId: string) {
    setDeleting(true);
    try {
      const review = reviews.find((r) => r.id === reviewId);
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      // Recalculate the barber's aggregate rating after removal
      if (review?.providerId) {
        await recalculateBarberRating(review.providerId);
      }
      toast.success('Review deleted');
    } catch (err) {
      console.error('Delete review error:', err);
      toast.error('Failed to delete review');
    } finally {
      setDeleting(false);
      setDeleteConfirmId(null);
    }
  }

  async function handleFlag(reviewId: string) {
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;
    const newFlagged = !review.isFlagged;
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { isFlagged: newFlagged });
      // Optimistic update in local state
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isFlagged: newFlagged } : r))
      );
    } catch (err) {
      console.error('Flag error:', err);
      toast.error('Failed to update flag');
    }
  }

  const ratingOptions: Array<0 | 1 | 2 | 3 | 4 | 5> = [0, 1, 2, 3, 4, 5];

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Reviews</h1>
        <span style={{ fontSize: 13, color: '#555', fontWeight: 700 }}>
          {loading ? '…' : `${reviews.length} total`}
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Rating filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {ratingOptions.map((r) => (
            <button
              key={r}
              onClick={() => { setRatingFilter(r); setPage(1); }}
              style={{
                background: ratingFilter === r ? '#1a1200' : '#111',
                border: `1px solid ${ratingFilter === r ? '#F5C518' : '#1e1e1e'}`,
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                color: ratingFilter === r ? '#F5C518' : '#555',
                cursor: 'pointer',
              }}
            >
              {r === 0 ? 'All' : `${r}★`}
            </button>
          ))}
        </div>

        {/* Flagged toggle */}
        <button
          onClick={() => { setShowFlagged((v) => !v); setPage(1); }}
          style={{
            background: showFlagged ? '#1a0f00' : '#111',
            border: `1px solid ${showFlagged ? '#E8491D' : '#1e1e1e'}`,
            borderRadius: 8,
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: 700,
            color: showFlagged ? '#E8491D' : '#555',
            cursor: 'pointer',
          }}
        >
          🚩 Flagged ({reviews.filter((r) => r.isFlagged).length})
        </button>
      </div>

      {/* Reviews */}
      {loading ? (
        <div style={{ color: '#555', fontSize: 14 }}>Loading reviews…</div>
      ) : paginated.length === 0 ? (
        <div style={{ color: '#555', fontSize: 14, padding: '20px 0' }}>No reviews found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {paginated.map((review) => {
            const isFlaggedReview = Boolean(review.isFlagged);
            return (
              <div
                key={review.id}
                className="bg-[#111] border border-[#1e1e1e] rounded-2xl"
                style={{
                  padding: '16px 18px',
                  borderColor: isFlaggedReview ? '#E8491D33' : '#1e1e1e',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                      <StarRating rating={review.rating} />
                      <span style={{ fontSize: 12, color: '#555' }}>{formatDate(review.createdAt)}</span>
                      {isFlaggedReview && (
                        <span style={{ fontSize: 11, color: '#E8491D', fontWeight: 700 }}>🚩 Flagged</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: '#555', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span>
                        <span style={{ color: '#444' }}>Client:</span>{' '}
                        <span style={{ fontFamily: 'monospace', color: '#666' }}>{maskClientId(review.clientId)}</span>
                      </span>
                      <span>
                        <span style={{ color: '#444' }}>Barber:</span>{' '}
                        <span style={{ color: '#888', fontWeight: 600 }}>{review.barberName}</span>
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => handleFlag(review.id)}
                      style={{
                        background: 'none',
                        border: `1px solid ${isFlaggedReview ? '#E8491D' : '#2a2a2a'}`,
                        borderRadius: 8,
                        padding: '5px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        color: isFlaggedReview ? '#E8491D' : '#555',
                        cursor: 'pointer',
                      }}
                    >
                      {isFlaggedReview ? 'Unflag' : '🚩 Flag'}
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(deleteConfirmId === review.id ? null : review.id)}
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
                      Delete
                    </button>
                  </div>
                </div>

                {/* Comment */}
                {review.comment && (
                  <p style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic', margin: '0 0 10px 0', lineHeight: 1.6 }}>
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}

                {/* Delete confirm */}
                {deleteConfirmId === review.id && (
                  <div
                    style={{
                      background: '#1a0808',
                      border: '1px solid #EF444430',
                      borderRadius: 10,
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginTop: 8,
                    }}
                  >
                    <span style={{ fontSize: 13, color: '#888', flex: 1 }}>
                      Permanently delete this review?
                    </span>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
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
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deleting}
                      style={{
                        background: '#EF4444',
                        border: 'none',
                        borderRadius: 8,
                        padding: '6px 14px',
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#fff',
                        cursor: deleting ? 'not-allowed' : 'pointer',
                        opacity: deleting ? 0.6 : 1,
                      }}
                    >
                      Delete
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
