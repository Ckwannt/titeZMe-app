'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

const POSITIVE_WORDS = ['clean', 'fade', 'professional', 'friendly', 'best', 'amazing', 'perfect', 'recommend', 'great', 'fast', 'precise', 'skilled'];

export default function ShopReviewsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [barbers, setBarbers] = useState<any[]>([]);
  const [barberNames, setBarberNames] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [barberFilter, setBarberFilter] = useState('all');
  const [starFilter, setStarFilter] = useState(0); // 0 = all
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Fetch barbers + their names
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'barberProfiles'), where('shopId', '==', user.uid));
    const unsub = onSnapshot(q, async (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setBarbers(list);
      const names: Record<string, string> = {};
      await Promise.all(list.map(async (b: any) => {
        const uSnap = await getDoc(doc(db, 'users', b.userId || b.id));
        if (uSnap.exists()) {
          const u = uSnap.data();
          names[b.id] = `${u.firstName} ${u.lastName}`;
        }
      }));
      setBarberNames(names);
    });
    return () => unsub();
  }, [user]);

  // Fetch reviews for all shop barbers + shop itself
  useEffect(() => {
    if (!user) return;
    const fetchReviews = async () => {
      setFetching(true);
      try {
        // Shop-level reviews
        const shopRevsSnap = await getDocs(query(
          collection(db, 'reviews'),
          where('providerType', '==', 'shop'),
          where('providerId', '==', user.uid)
        ));
        const shopRevs = shopRevsSnap.docs.map(d => ({ id: d.id, ...d.data(), isShopReview: true } as any));

        // Barber reviews (for all current team barbers)
        let barberRevs: any[] = [];
        if (barbers.length > 0) {
          const results = await Promise.all(barbers.map(b =>
            getDocs(query(collection(db, 'reviews'), where('providerId', '==', b.id)))
          ));
          results.forEach((snap, i) => {
            snap.docs.forEach(d => {
              barberRevs.push({ id: d.id, ...d.data(), barberId: barbers[i].id });
            });
          });
        }

        const all = [...shopRevs, ...barberRevs];
        all.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setReviews(all);
      } catch (e) {
        console.error(e);
      }
      setFetching(false);
    };
    fetchReviews();
  }, [user, barbers]);

  // Filter
  const filtered = useMemo(() => {
    return reviews.filter(r => {
      if (barberFilter !== 'all' && r.barberId !== barberFilter) return false;
      if (starFilter > 0 && r.rating !== starFilter) return false;
      return true;
    });
  }, [reviews, barberFilter, starFilter]);

  // Rating breakdown
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / totalReviews
    : 0;

  const starCounts = [5, 4, 3, 2, 1].map(n => ({
    star: n,
    count: reviews.filter(r => r.rating === n).length,
  }));

  // Word frequency
  const wordFreqs = useMemo(() => {
    const text = reviews.map(r => (r.comment || r.text || '')).join(' ').toLowerCase();
    return POSITIVE_WORDS
      .map(w => ({ word: w, count: (text.match(new RegExp(`\\b${w}`, 'g')) || []).length }))
      .filter(w => w.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [reviews]);

  if (loading || fetching) return <div className="p-10 text-center animate-pulse text-[#555]">Loading reviews...</div>;

  return (
    <div className="animate-fadeUp p-6 md:p-8 md:px-10 max-w-[800px]">
      <h1 className="text-2xl font-black mb-6">Reviews ⭐</h1>

      {totalReviews === 0 ? (
        /* Empty state */
        <div>
          <div className="bg-brand-surface border border-brand-border rounded-3xl p-8 text-center mb-6">
            <div className="text-5xl mb-4">⭐</div>
            <div className="font-extrabold text-lg mb-2">No reviews yet</div>
            <p className="text-sm text-[#888]">Reviews from clients will appear here after completed bookings.</p>
          </div>
          {/* Placeholder preview */}
          <div className="flex flex-col gap-3 opacity-30 pointer-events-none">
            {[4, 5, 5].map((stars, i) => (
              <div key={i} className="bg-brand-surface border border-brand-border rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#2a2a2a]" />
                  <div>
                    <div className="h-3 w-24 bg-[#2a2a2a] rounded mb-1" />
                    <div className="h-2.5 w-16 bg-[#1a1a1a] rounded" />
                  </div>
                  <div className="ml-auto text-brand-yellow">{'★'.repeat(stars)}</div>
                </div>
                <div className="h-2.5 bg-[#1a1a1a] rounded w-3/4 mb-1" />
                <div className="h-2.5 bg-[#1a1a1a] rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Rating summary */}
          <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 mb-6 flex flex-col sm:flex-row gap-6 items-start">
            <div className="text-center shrink-0">
              <div className="text-[56px] font-black leading-none text-brand-yellow">{avgRating.toFixed(1)}</div>
              <div className="text-lg text-brand-yellow mt-1">{'★'.repeat(Math.round(avgRating))}</div>
              <div className="text-xs text-[#888] mt-1">{totalReviews} total review{totalReviews !== 1 ? 's' : ''} across all barbers</div>
            </div>
            <div className="flex-1 w-full">
              {starCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] text-[#888] w-4 text-right shrink-0">{star}</span>
                  <span className="text-brand-yellow text-[10px]">★</span>
                  <div className="flex-1 h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                    <div className="h-full bg-brand-yellow rounded-full transition-all"
                      style={{ width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : '0%' }} />
                  </div>
                  <span className="text-[11px] text-[#555] w-5 shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <select value={barberFilter} onChange={e => setBarberFilter(e.target.value)}
              className="bg-[#141414] border border-[#2a2a2a] text-white rounded-xl px-3 py-2 text-sm outline-none">
              <option value="all">All barbers</option>
              {barbers.map(b => (
                <option key={b.id} value={b.id}>{barberNames[b.id] || b.id}</option>
              ))}
            </select>
            {[0, 5, 4, 3].map(star => (
              <button key={star} onClick={() => setStarFilter(star)}
                className={`text-[12px] font-bold px-4 py-2 rounded-full transition-colors ${starFilter === star ? 'bg-brand-yellow text-black' : 'bg-[#1a1a1a] text-[#888] hover:text-white'}`}>
                {star === 0 ? 'All' : `${star}★`}
              </button>
            ))}
          </div>

          {/* Word tags */}
          {wordFreqs.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {wordFreqs.map(({ word, count }) => (
                <span key={word} className="text-[10px] font-bold bg-[#0f2010] text-brand-green px-[10px] py-[3px] rounded-full capitalize">
                  ✓ {word} ({count})
                </span>
              ))}
            </div>
          )}

          {/* Review cards */}
          <div className="flex flex-col gap-3">
            {filtered.slice(0, visibleCount).map(r => {
              const clientInitial = (r.clientName || r.reviewerName || '?')[0]?.toUpperCase();
              const clientDisplay = (() => {
                const name = r.clientName || r.reviewerName || 'Client';
                const parts = name.trim().split(' ');
                return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
              })();
              const barberName = r.barberId ? barberNames[r.barberId] : null;
              const comment = r.comment || r.text || '';

              return (
                <div key={r.id} className="bg-brand-surface border border-brand-border rounded-2xl p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center font-black text-sm text-white shrink-0">
                      {clientInitial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-[14px]">{clientDisplay}</span>
                        {barberName && (
                          <span className="text-[10px] text-[#666] font-bold bg-[#1a1a1a] px-2 py-0.5 rounded-full">
                            via {barberName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-brand-yellow text-xs">{'★'.repeat(r.rating || 0)}</span>
                        <span className="text-[10px] text-[#555]">{timeAgo(r.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  {comment && (
                    <p className="text-[13px] text-[#aaa] italic leading-relaxed pl-12">&ldquo;{comment}&rdquo;</p>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length > visibleCount && (
            <div className="text-center mt-5">
              <button onClick={() => setVisibleCount(v => v + 10)}
                className="text-[13px] font-bold text-brand-yellow border border-brand-yellow/40 hover:bg-[#1a1500] px-6 py-2.5 rounded-full transition-colors">
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
