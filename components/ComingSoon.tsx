'use client';

import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/i18n/LangContext';
import { toast } from '@/lib/toast';

interface ComingSoonProps {
  icon: string;
  title: string;
  body: string;
  showNotify?: boolean;
  featureKey?: string;
}

export function ComingSoon({ icon, title, body, showNotify = false, featureKey }: ComingSoonProps) {
  const { user } = useAuth();
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  const handleNotify = async () => {
    if (!user || done || sending) return;
    setSending(true);
    try {
      await addDoc(collection(db, 'featureRequests'), {
        userId: user.uid,
        feature: 'clientDashboard',
        subFeature: featureKey || 'unknown',
        requestedAt: Date.now(),
      });
      setDone(true);
      toast.success(t('success.portfolioNotify'));
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border border-dashed border-[#333] rounded-3xl p-8 text-center bg-[#0a0a0a]">
      <div className="text-4xl mb-4">{icon}</div>
      <p className="text-sm font-bold text-[#888] mb-1">{title}</p>
      <p className="text-[11px] text-[#444] italic">{body}</p>
      {showNotify && (
        <button
          onClick={handleNotify}
          disabled={done || sending}
          className="mt-4 text-brand-yellow text-[11px] font-bold hover:underline disabled:cursor-default disabled:text-[#555]"
        >
          {done ? t('buttons.onTheList') : t('buttons.notifyMe')}
        </button>
      )}
    </div>
  );
}
