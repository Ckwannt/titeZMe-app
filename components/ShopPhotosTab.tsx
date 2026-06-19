'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/lib/toast';
import { useLang } from '@/lib/i18n/LangContext';

interface ShopPhotosTabProps {
  shop: any;
  mutateShop: () => void;
}

export function ShopPhotosTab({ shop, mutateShop }: ShopPhotosTabProps) {
  const { user } = useAuth();
  const { t } = useLang();
  const [notified, setNotified] = useState(false);
  const [notifying, setNotifying] = useState(false);

  const handleNotify = async () => {
    if (!user || notified) return;
    setNotifying(true);
    try {
      await addDoc(collection(db, 'featureRequests'), {
        userId: user.uid,
        shopId: user.uid,
        feature: 'shop_photos',
        requestedAt: Date.now(),
      });
      setNotified(true);
      toast.success(t('shop.notifyToast'));
    } catch (e) {
      console.error(e);
    }
    setNotifying(false);
  };

  return (
    <div className="animate-fadeUp max-w-2xl">
      <h1 className="text-2xl font-black mb-2">{t('shopDash.shopPhotosNav')} 📸</h1>
      <p className="text-brand-text-secondary text-sm mb-8">{t('shop.photosShowcase')}</p>

      {/* SECTION A: PHOTOS */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-black">{t('shop.photosLabel')}</h2>
            <p className="text-xs text-[#888]">{t('shop.photosLimit')}</p>
          </div>
          {/* Coming soon badge instead of upload button */}
          <span className="text-[11px] font-black text-[#888] bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1.5 rounded-full">
            {t('shop.comingSoon')}
          </span>
        </div>

        <div className="border border-dashed border-[#2a2a2a] rounded-3xl p-8 text-center bg-[#0a0a0a] mb-4">
          <div className="text-4xl mb-4">📸</div>
          <p className="text-sm font-bold text-[#888] mb-1">{t('shop.photosComingSoonDesc')}</p>
          <p className="text-[11px] text-[#444] italic">{t('shop.comingSoonShort')}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleNotify}
            disabled={notified || notifying}
            className="text-[11px] font-bold text-brand-yellow hover:underline disabled:opacity-60 disabled:no-underline transition-colors"
          >
            {notified ? t('shop.onTheList') : notifying ? t('shop.addingYou') : t('shop.notifyReady')}
          </button>
        </div>
      </section>

      {/* SECTION B: VIDEOS */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-black">{t('shop.videosLabel')}</h2>
            <p className="text-xs text-[#888]">{t('shop.videosLimit')}</p>
          </div>
          <span className="text-[11px] font-black text-[#888] bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1.5 rounded-full">
            {t('shop.comingSoon')}
          </span>
        </div>
        <div className="border border-dashed border-[#2a2a2a] rounded-3xl p-8 text-center bg-[#0a0a0a]">
          <div className="text-4xl mb-3">🎬</div>
          <p className="text-[11px] text-[#444] italic">{t('shop.videosComingSoonDesc')}</p>
        </div>
      </section>

      {/* TIPS */}
      <section className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-2xl p-5 mb-6">
        <h3 className="text-[12px] font-black mb-3">{t('shop.preparePhotos')}</h3>
        <ul className="flex flex-col gap-1.5">
          {[
            t('shop.photoTip1'),
            t('shop.photoTip2'),
            t('shop.photoTip3'),
            t('shop.photoTip4'),
            t('shop.photoTip5'),
          ].map(tip => (
            <li key={tip} className="text-[11px] text-[#666] flex items-start gap-1.5">
              <span className="text-brand-green shrink-0 mt-px">✓</span>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* PREVIEW MOCKUP */}
      <section>
        <div className="grid grid-cols-4 gap-2 mb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{ aspectRatio: '1 / 1' }}
              className="bg-[#141414] border border-dashed border-[#2a2a2a] rounded-[10px]"
            />
          ))}
        </div>
        <p className="text-[10px] text-[#333] text-center">{t('shop.galleryPreview')}</p>
      </section>
    </div>
  );
}
