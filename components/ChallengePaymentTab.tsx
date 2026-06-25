'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/i18n/LangContext';
import { toast } from '@/lib/toast';
import {
  challengeSubmissionUpdateSchema,
  type ChallengeSubmissionData,
  type ChallengeSettingsData,
} from '@/lib/schemas';
import { statusColor, buildPaymentReference } from '@/lib/challenge-utils';

type Mode = 'barber' | 'shop';

interface Props {
  mode: Mode;
}

type LoadedSubmission = ChallengeSubmissionData & { id: string };

export default function ChallengePaymentTab({ mode }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLang();

  const [settings, setSettings] = useState<ChallengeSettingsData | null>(null);
  const [submission, setSubmission] = useState<LoadedSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [declaredAmount, setDeclaredAmount] = useState('');
  const [declaredReference, setDeclaredReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initial load: settings + submission
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [settingsSnap, subSnap] = await Promise.all([
          getDoc(doc(db, 'siteConfig', 'challenge')),
          getDoc(doc(db, 'challengeSubmissions', `${user.uid}_${mode}`)),
        ]);
        if (cancelled) return;
        setSettings(settingsSnap.exists() ? (settingsSnap.data() as ChallengeSettingsData) : null);
        if (subSnap.exists()) {
          const data = subSnap.data() as ChallengeSubmissionData;
          const loaded: LoadedSubmission = { id: subSnap.id, ...data };
          setSubmission(loaded);
          setDeclaredReference(buildPaymentReference(loaded));
        } else {
          setSubmission(null);
        }
      } catch (e) {
        console.error('Failed to load payment data', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, mode]);

  // Redirect when submission missing or in a state that should not see payment page
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (!submission) {
      router.replace(`/dashboard/${mode}/challenge`);
      return;
    }
    if (submission.status === 'rejected') {
      router.replace(`/dashboard/${mode}/challenge`);
    }
  }, [loading, user, submission, mode, router]);

  const copy = useCallback((text: string) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(text);
      toast.success(t('challenge.payment.toastCopied'));
    } catch {
      toast.error(t('challenge.payment.toastCopyFail'));
    }
  }, [t]);

  const handleConfirmPayment = async () => {
    if (!user || !submission) return;
    setErrorMsg(null);

    const amt = Number(declaredAmount);
    if (!declaredAmount.trim() || Number.isNaN(amt) || amt <= 0) {
      setErrorMsg(t('challenge.payment.errAmount'));
      return;
    }
    const ref = declaredReference.trim();
    if (!ref) {
      setErrorMsg(t('challenge.payment.errRefEmpty'));
      return;
    }

    setSubmitting(true);
    try {
      // Race protection: re-check status from server right before write
      const fresh = await getDoc(doc(db, 'challengeSubmissions', submission.id));
      if (!fresh.exists()) {
        setErrorMsg(t('challenge.payment.errNotFound'));
        setSubmitting(false);
        return;
      }
      const freshStatus = (fresh.data() as ChallengeSubmissionData).status;
      if (freshStatus !== 'awaiting_payment') {
        setErrorMsg(t('challenge.payment.errStatusChanged'));
        setSubmitting(false);
        return;
      }

      const update = challengeSubmissionUpdateSchema.parse({
        status: 'pending',
        paidAt: Date.now(),
        declaredAmount: amt,
        declaredReference: ref,
      });
      await updateDoc(doc(db, 'challengeSubmissions', submission.id), update);
      router.push(`/dashboard/${mode}/challenge`);
    } catch (e: any) {
      console.error('Confirm payment failed', e);
      setErrorMsg(e?.message || t('challenge.payment.errRecordFail'));
      setSubmitting(false);
    }
  };

  // ---- Render guards ----

  if (loading || authLoading) {
    return (
      <div className="p-6 md:p-10 animate-fadeUp">
        <div className="text-[#666] text-sm">{t('challenge.public.loading')}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 md:p-10 animate-fadeUp">
        <h1 className="text-2xl font-black mb-2">{t('challenge.payment.title')}</h1>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-8 max-w-[640px]">
          <div className="text-[#888] text-sm">{t('challenge.payment.notSignedIn')}</div>
        </div>
      </div>
    );
  }

  // Redirecting cases — render nothing while router.replace fires
  if (!submission || submission.status === 'rejected') {
    return null;
  }

  const s = statusColor(submission.status);

  if (submission.status === 'pending') {
    return (
      <div className="p-6 md:p-10 animate-fadeUp max-w-[640px]">
        <h1 className="text-2xl font-black mb-2">{t('challenge.payment.title')}</h1>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-8">
          <div className={`inline-block px-3 py-1.5 rounded-full ${s.bg} ${s.text} text-[11px] font-extrabold uppercase mb-4`}>
            {t(`challenge.status.${submission.status}`)}
          </div>
          <p className="text-[#ccc] text-sm mb-6">
            {t('challenge.payment.pendingBody')}
          </p>
          <button
            onClick={() => router.push(`/dashboard/${mode}/challenge`)}
            className="w-full sm:w-auto bg-brand-yellow text-[#0a0a0a] font-black text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            {t('challenge.payment.backBtn')}
          </button>
        </div>
      </div>
    );
  }

  if (submission.status === 'approved') {
    return (
      <div className="p-6 md:p-10 animate-fadeUp max-w-[640px]">
        <h1 className="text-2xl font-black mb-2">{t('challenge.payment.title')}</h1>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-8">
          <div className={`inline-block px-3 py-1.5 rounded-full ${s.bg} ${s.text} text-[11px] font-extrabold uppercase mb-4`}>
            {t(`challenge.status.${submission.status}`)}
          </div>
          <p className="text-[#ccc] text-sm mb-6">
            {t('challenge.payment.approvedBody')}
          </p>
          <button
            onClick={() => router.push(`/dashboard/${mode}/challenge`)}
            className="w-full sm:w-auto bg-brand-yellow text-[#0a0a0a] font-black text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            {t('challenge.payment.backBtn')}
          </button>
        </div>
      </div>
    );
  }

  // Settings missing or incomplete
  if (!settings || !settings.ibanText || !settings.bizumNumber) {
    return (
      <div className="p-6 md:p-10 animate-fadeUp max-w-[640px]">
        <h1 className="text-2xl font-black mb-2">{t('challenge.payment.title')}</h1>
        <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-8">
          <p className="text-[#888] text-sm">
            {t('challenge.payment.notReady')}
          </p>
          <button
            onClick={() => router.push(`/dashboard/${mode}/challenge`)}
            className="mt-6 w-full sm:w-auto bg-[#1a1a1a] text-white font-black text-sm px-6 py-3 rounded-xl hover:bg-[#222] transition-colors"
          >
            {t('challenge.payment.backBtn')}
          </button>
        </div>
      </div>
    );
  }

  // ---- Payment form ----

  const fee = mode === 'barber' ? settings.feeBarber : settings.feeShop;
  const reference = declaredReference || buildPaymentReference(submission);

  const amtNum = Number(declaredAmount);
  const amountValid = declaredAmount.trim() !== '' && !Number.isNaN(amtNum) && amtNum > 0;
  const refValid = declaredReference.trim().length > 0;
  const canSubmit = amountValid && refValid && !submitting;

  return (
    <div className="p-6 md:p-10 animate-fadeUp max-w-[720px]">
      <h1 className="text-2xl font-black mb-2">{t('challenge.payment.title')}</h1>
      <p className="text-brand-text-secondary text-sm mb-8">
        {t('challenge.payment.intro')}
      </p>

      {errorMsg && (
        <div className="mb-6 bg-[#3a1010] border border-brand-red/40 rounded-[16px] p-4 text-brand-red text-sm font-bold">
          {errorMsg}
        </div>
      )}

      {/* Section 1: Entry fee */}
      <section className="mb-8 bg-[#111] border border-[#2a2a2a] rounded-[16px] p-6">
        <div className="text-[11px] font-extrabold text-[#888] uppercase tracking-wider mb-2">
          {t('challenge.payment.feeLabel')}
        </div>
        <div className="text-4xl font-black text-brand-yellow mb-2">
          {typeof fee === 'number' ? `€${fee}` : '—'}
        </div>
        <p className="text-[#888] text-[12px]">
          {t('challenge.payment.feeHint')}
        </p>
      </section>

      {/* Section 2: Bank transfer (IBAN) */}
      <section className="mb-6 bg-[#111] border border-[#2a2a2a] rounded-[16px] p-6">
        <h2 className="text-lg font-black mb-4">{t('challenge.payment.ibanTitle')}</h2>

        <div className="mb-4">
          <div className="text-[10px] font-extrabold text-[#888] uppercase tracking-wider mb-2">{t('challenge.payment.ibanLabel')}</div>
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-3">
            <span className="font-mono text-sm text-white flex-1 break-all">{settings.ibanText}</span>
            <button
              type="button"
              onClick={() => copy(settings.ibanText || '')}
              className="text-brand-yellow text-[11px] font-extrabold px-2 py-1 rounded-lg hover:bg-brand-yellow/10 transition-colors shrink-0"
            >
              {t('challenge.payment.copyBtn')}
            </button>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-extrabold text-[#888] uppercase tracking-wider mb-2">
            {t('challenge.payment.refLabel')}
          </div>
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-3">
            <span className="font-mono text-[13px] text-white flex-1 break-all">{reference}</span>
            <button
              type="button"
              onClick={() => copy(reference)}
              className="text-brand-yellow text-[11px] font-extrabold px-2 py-1 rounded-lg hover:bg-brand-yellow/10 transition-colors shrink-0"
            >
              {t('challenge.payment.copyBtn')}
            </button>
          </div>
          <p className="text-[11px] text-[#666] mt-2">
            {t('challenge.payment.refHint')}
          </p>
        </div>
      </section>

      {/* Section 3: Bizum */}
      <section className="mb-8 bg-[#111] border border-[#2a2a2a] rounded-[16px] p-6">
        <h2 className="text-lg font-black mb-4">{t('challenge.payment.bizumTitle')}</h2>

        <div className="mb-4">
          <div className="text-[10px] font-extrabold text-[#888] uppercase tracking-wider mb-2">{t('challenge.payment.bizumLabel')}</div>
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-3">
            <span className="font-mono text-sm text-white flex-1 break-all">{settings.bizumNumber}</span>
            <button
              type="button"
              onClick={() => copy(settings.bizumNumber || '')}
              className="text-brand-yellow text-[11px] font-extrabold px-2 py-1 rounded-lg hover:bg-brand-yellow/10 transition-colors shrink-0"
            >
              {t('challenge.payment.copyBtn')}
            </button>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-extrabold text-[#888] uppercase tracking-wider mb-2">
            {t('challenge.payment.bizumConceptLabel')}
          </div>
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-3">
            <span className="font-mono text-[13px] text-white flex-1 break-all">{reference}</span>
            <button
              type="button"
              onClick={() => copy(reference)}
              className="text-brand-yellow text-[11px] font-extrabold px-2 py-1 rounded-lg hover:bg-brand-yellow/10 transition-colors shrink-0"
            >
              {t('challenge.payment.copyBtn')}
            </button>
          </div>
          <p className="text-[11px] text-[#666] mt-2">
            {t('challenge.payment.bizumConceptHint')}
          </p>
        </div>
      </section>

      {/* Section 4: Declare your payment */}
      <section className="mb-8 bg-[#111] border border-[#2a2a2a] rounded-[16px] p-6">
        <h2 className="text-lg font-black mb-1">{t('challenge.payment.declareTitle')}</h2>
        <p className="text-[12px] text-[#888] mb-5">
          {t('challenge.payment.declareHint')}
        </p>

        <div className="mb-5">
          <label className="block text-[11px] font-extrabold text-[#888] uppercase tracking-wider mb-2">
            {t('challenge.payment.amountLabel')}
          </label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={declaredAmount}
            onChange={e => setDeclaredAmount(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-3 text-sm text-white placeholder-[#555] focus:border-brand-yellow focus:outline-none transition-colors"
            placeholder={typeof fee === 'number' ? String(fee) : '0.00'}
          />
          <p className="text-[11px] text-[#666] mt-2">
            {t('challenge.payment.amountHint')}{' '}
            {typeof fee === 'number' && (
              <span className="text-white font-bold">
                {t('challenge.payment.amountExpected').replace('{n}', String(fee))}
              </span>
            )}
          </p>
        </div>

        <div>
          <label className="block text-[11px] font-extrabold text-[#888] uppercase tracking-wider mb-2">
            {t('challenge.payment.usedRefLabel')}
          </label>
          <input
            type="text"
            value={declaredReference}
            onChange={e => setDeclaredReference(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-3 text-sm font-mono text-white placeholder-[#555] focus:border-brand-yellow focus:outline-none transition-colors"
            placeholder={buildPaymentReference(submission)}
          />
          <p className="text-[11px] text-[#666] mt-2">
            {t('challenge.payment.usedRefHint')}
          </p>
        </div>
      </section>

      {/* Submit */}
      <button
        type="button"
        onClick={() => void handleConfirmPayment()}
        disabled={!canSubmit}
        className={`w-full sm:w-auto px-8 py-3 rounded-xl font-black text-sm transition-colors ${
          canSubmit
            ? 'bg-brand-yellow text-[#0a0a0a] hover:opacity-90'
            : 'bg-[#1a1a1a] text-[#555] cursor-not-allowed'
        }`}
      >
        {submitting ? t('challenge.payment.recordingBtn') : t('challenge.payment.submitBtn')}
      </button>

      <button
        type="button"
        onClick={() => router.push(`/dashboard/${mode}/challenge`)}
        className="block mt-4 text-[12px] font-bold text-[#666] hover:text-white transition-colors"
      >
        ← {t('challenge.payment.backBtn')}
      </button>
    </div>
  );
}
