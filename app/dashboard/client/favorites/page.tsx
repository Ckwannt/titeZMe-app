'use client';

import { useAuth } from '@/lib/auth-context';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';

type FavBarber = {
  id: string;
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
  photoUrl?: string;
  city?: string;
  country?: string;
  rating?: number;
  reviewCount?: number;
  isLive?: boolean;
  approvalStatus?: string;
};

export default function ClientFavorites() {
  const { user, appUser } = useAuth();
  const { t } = useLang();

  const favoriteIds: string[] = appUser?.favoriteBarbers ?? [];

  const { data: barbers = [], isLoading } = useQuery<FavBarber[]>({
    queryKey: ['favoriteBarbers', user?.uid, favoriteIds.join(',')],
    queryFn: async () => {
      if (favoriteIds.length === 0) return [];
      const snaps = await Promise.all(
        favoriteIds.map(id => getDoc(doc(db, 'professionalProfiles', id)))
      );
      return snaps
        .filter(s => s.exists())
        .map(s => ({ id: s.id, ...(s.data() as any) } as FavBarber));
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="p-10 text-center animate-pulse text-brand-text-secondary">{t('misc.loading')}</div>;
  }

  return (
    <div className="p-6 md:p-8 md:px-10">
      <div className="animate-fadeUp max-w-[900px]">
        <h2 className="text-2xl font-black mb-6">{t('clientDash.favoritesTitle')}</h2>

        {favoriteIds.length === 0 || barbers.length === 0 ? (
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-8 text-center">
            <div className="text-lg font-black text-white mb-2">{t('clientDash.noFavoritesYet')}</div>
            <div className="text-sm font-bold text-brand-text-secondary mb-5">{t('clientDash.findBarbersToSave')}</div>
            <Link
              href="/barbers"
              className="inline-block bg-brand-yellow text-black font-black text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              {t('emptyStates.findABarber')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {barbers.map(b => {
              const unavailable = b.isLive === false || (b.approvalStatus && b.approvalStatus !== 'approved');
              const name = `${b.firstName || ''} ${b.lastName || ''}`.trim() || 'Barber';
              const photo = b.profilePhotoUrl || b.photoUrl;
              const location = [b.city, b.country].filter(Boolean).join(', ');

              return (
                <div
                  key={b.id}
                  className={`bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col ${unavailable ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                        style={{ objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#111] flex items-center justify-center font-black text-lg text-white shrink-0">
                        {b.firstName?.[0] || 'B'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-white truncate">{name}</div>
                      {location && (
                        <div className="text-[11px] text-brand-text-secondary font-bold truncate">📍 {location}</div>
                      )}
                      {typeof b.rating === 'number' && b.rating > 0 && (
                        <div className="text-[11px] text-brand-yellow font-black mt-0.5">
                          ★ {b.rating.toFixed(1)}
                          {typeof b.reviewCount === 'number' && b.reviewCount > 0 && (
                            <span className="text-[#555] font-bold"> ({b.reviewCount})</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {unavailable ? (
                    <span className="text-[11px] font-extrabold text-[#666] uppercase tracking-wide self-start mt-auto">
                      {t('clientDash.notAvailable')}
                    </span>
                  ) : (
                    <Link
                      href={`/barber/${b.id}`}
                      className="text-[12px] font-black text-brand-yellow border border-brand-yellow hover:bg-[#1a1500] px-4 py-2 rounded-lg transition-colors self-start mt-auto"
                    >
                      {t('clientDash.viewProfile')}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
