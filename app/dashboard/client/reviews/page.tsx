'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';

function timeAgo(ts: number, t: (k: string) => string): string {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return t('buttons.today');
  if (days === 1) return t('settings.yesterday');
  if (days < 30) return t('misc.daysAgo').replace('{n}', String(days));
  const months = Math.floor(days / 30);
  if (months < 12) return t('shopDash.monthsAgo').replace('{n}', String(months));
  return t('shopDash.yearsAgo').replace('{n}', String(Math.floor(months / 12)));
}

type EnrichedReview = {
  id: string;
  bookingId?: string;
  providerId: string;
  providerType: 'barber' | 'shop';
  rating: number;
  comment?: string;
  createdAt: number;
  providerName?: string;
  providerPhoto?: string;
  providerMissing?: boolean;
};

export default function ClientReviews() {
  const { user } = useAuth();
  const { t } = useLang();
  const [visibleCount, setVisibleCount] = useState(10);

  const { data: reviews = [], isLoading } = useQuery<EnrichedReview[]>({
    queryKey: ['clientReviews', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const snap = await getDocs(query(
        collection(db, 'reviews'),
        where('clientId', '==', user.uid)
      ));
      const raw = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as EnrichedReview[];

      const enriched = await Promise.all(raw.map(async (r) => {
        try {
          if (r.providerType === 'shop') {
            const s = await getDoc(doc(db, 'businesses', r.providerId));
            if (!s.exists()) return { ...r, providerMissing: true };
            const data = s.data() as any;
            return {
              ...r,
              providerName: data.name,
              providerPhoto: data.logoUrl || data.coverPhotoUrl,
            };
          } else {
            const p = await getDoc(doc(db, 'professionalProfiles', r.providerId));
            if (!p.exists()) return { ...r, providerMissing: true };
            const data = p.data() as any;
            const name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
            return {
              ...r,
              providerName: name || undefined,
              providerPhoto: data.profilePhotoUrl || data.photoUrl,
            };
          }
        } catch {
          return { ...r, providerMissing: true };
        }
      }));

      enriched.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      return enriched;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="p-10 text-center animate-pulse text-brand-text-secondary">{t('misc.loading')}</div>;
  }

  return (
    <div className="animate-fadeUp p-6 md:p-8 md:px-10 max-w-[800px]">
      <h2 className="text-2xl font-black mb-6">{t('clientDash.reviewsTitle')}</h2>

      {reviews.length === 0 ? (
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-8 text-center">
          <div className="text-lg font-black text-white mb-2">{t('clientDash.noReviewsWrittenYet')}</div>
          <div className="text-sm font-bold text-brand-text-secondary">{t('clientDash.bookToWriteReview')}</div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {reviews.slice(0, visibleCount).map(r => {
              const fallbackLabel = r.providerType === 'shop'
                ? t('clientDash.shopNoLongerAvailable')
                : t('clientDash.barberNoLongerAvailable');
              const displayName = r.providerMissing || !r.providerName ? fallbackLabel : r.providerName;
              const initial = (r.providerName || '?')[0]?.toUpperCase() || '?';

              return (
                <div key={r.id} className="bg-brand-surface border border-brand-border rounded-2xl p-4">
                  <div className="flex items-start gap-3 mb-2">
                    {r.providerPhoto ? (
                      <Image
                        src={r.providerPhoto}
                        alt={displayName}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-xl object-cover shrink-0"
                        style={{ objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center font-black text-sm text-white shrink-0">
                        {initial}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`font-extrabold text-[14px] truncate ${r.providerMissing ? 'text-[#666]' : 'text-white'}`}>
                        {t('clientDash.reviewFor').replace('{name}', displayName)}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-brand-yellow text-xs">{'★'.repeat(r.rating || 0)}</span>
                        <span className="text-[10px] text-[#555]">{timeAgo(r.createdAt, t)}</span>
                      </div>
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-[13px] text-[#aaa] italic leading-relaxed pl-12">&ldquo;{r.comment}&rdquo;</p>
                  )}
                </div>
              );
            })}
          </div>

          {reviews.length > visibleCount && (
            <div className="text-center mt-5">
              <button
                onClick={() => setVisibleCount(v => v + 10)}
                className="text-[13px] font-bold text-brand-yellow border border-brand-yellow/40 hover:bg-[#1a1500] px-6 py-2.5 rounded-full transition-colors"
              >
                {t('profile.loadMoreReviews')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
