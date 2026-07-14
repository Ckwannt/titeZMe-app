'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, deleteObject } from 'firebase/storage';
import Image from 'next/image';
import { professionalProfileUpdateSchema } from "@/lib/schemas";
import { toast } from '@/lib/toast';
import { useLang } from '@/lib/i18n/LangContext';

interface BarberPortfolioTabProps {
  profile: any;
  mutateProfile: () => void;
}

export function BarberPortfolioTab({ profile, mutateProfile }: BarberPortfolioTabProps) {
  const { user } = useAuth();
  const { t } = useLang();
  const [notifyPhotoDone, setNotifyPhotoDone] = useState(false);
  const [notifyVideoDone, setNotifyVideoDone] = useState(false);

  const photos = profile?.photos || [];
  const videos = profile?.videos || [];

  const handlePhotoDelete = async (photoUrl: string) => {
    if (!user) return;
    const newPhotos = photos.filter((url: string) => url !== photoUrl);
    try {
      const fileRef = ref(storage, photoUrl);
      await deleteObject(fileRef).catch(console.error);
      await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ photos: newPhotos }));
      mutateProfile();
    } catch (e) {
      console.error(e);
    }
  };

  const handleVideoDelete = async (videoUrl: string) => {
    if (!user) return;
    const newVideos = videos.filter((url: string) => url !== videoUrl);
    try {
      const fileRef = ref(storage, videoUrl);
      await deleteObject(fileRef).catch(console.error);
      await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ videos: newVideos }));
      mutateProfile();
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotify = async (feature: 'photos' | 'videos') => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'featureRequests'), {
        userId: user.uid,
        feature: 'portfolio',
        subFeature: feature,
        requestedAt: Date.now(),
      });
      if (feature === 'photos') setNotifyPhotoDone(true);
      else setNotifyVideoDone(true);
      toast.success(t('success.portfolioNotify'));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-black mb-2">{t('headings.portfolio')}</h1>
      <p className="text-brand-text-secondary text-sm mb-8">{t('settings.portfolioShowcase')}</p>

      {/* SECTION A: PHOTOS */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-black">{t('forms.photos')}</h2>
            <p className="text-xs text-[#888]">{t('settings.maxPhotos')}</p>
          </div>
          {/* Change 1 — Coming soon badge (replaces + Add Photo button) */}
          <span className="bg-[#141414] border border-[#2a2a2a] text-[#555] rounded-full px-4 py-[6px] text-[11px] font-extrabold cursor-default select-none">
            {t('status.comingSoon')}
          </span>
        </div>

        {photos.length === 0 ? (
          <div className="border border-dashed border-[#333] rounded-3xl p-8 text-center bg-[#0a0a0a]">
            <div className="text-[#888] mb-3">{t('emptyStates.noPhotosYet')}</div>
            <p className="text-[11px] text-[#444] italic mb-3">
              {t('emptyStates.portfolioComingSoon')}
            </p>
            <button
              onClick={() => handleNotify('photos')}
              disabled={notifyPhotoDone}
              className="text-brand-yellow text-[11px] font-bold hover:underline disabled:cursor-default disabled:text-[#555]"
            >
              {notifyPhotoDone ? t('buttons.onTheList') : t('buttons.notifyMe')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((url: string, i: number) => (
              <div key={i} className="aspect-square bg-[#141414] rounded-2xl overflow-hidden relative group border border-[#2a2a2a]">
                <Image src={url} alt={`Portfolio ${i}`} fill className="object-cover" referrerPolicy="no-referrer" />
                <button
                  onClick={() => handlePhotoDelete(url)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all hover:bg-brand-red hover:text-white pointer-events-auto"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION B: VIDEOS */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-black">{t('forms.videos')}</h2>
            <p className="text-xs text-[#888]">{t('settings.maxVideos')}</p>
          </div>
          {/* Change 1 — Coming soon badge (replaces + Add Video button) */}
          <span className="bg-[#141414] border border-[#2a2a2a] text-[#555] rounded-full px-4 py-[6px] text-[11px] font-extrabold cursor-default select-none">
            {t('status.comingSoon')}
          </span>
        </div>

        {videos.length === 0 ? (
          <div className="border border-dashed border-[#333] rounded-3xl p-8 text-center bg-[#0a0a0a]">
            <div className="text-[#888] mb-3">{t('emptyStates.noVideosYet')}</div>
            <p className="text-[11px] text-[#444] italic mb-3">
              {t('emptyStates.portfolioComingSoon')}
            </p>
            <button
              onClick={() => handleNotify('videos')}
              disabled={notifyVideoDone}
              className="text-brand-yellow text-[11px] font-bold hover:underline disabled:cursor-default disabled:text-[#555]"
            >
              {notifyVideoDone ? t('buttons.onTheList') : t('buttons.notifyMe')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((url: string, i: number) => (
              <div key={i} className="aspect-[4/5] bg-[#141414] rounded-2xl overflow-hidden relative group border border-[#2a2a2a]">
                <video src={url} className="w-full h-full object-cover" controls preload="metadata" />
                <button
                  onClick={() => handleVideoDelete(url)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex z-10 items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all hover:bg-brand-red hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
