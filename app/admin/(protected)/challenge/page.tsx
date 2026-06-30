'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  doc, getDoc, setDoc,
  collection, query, orderBy, limit, startAfter, where,
  getDocs, addDoc, updateDoc, increment,
  deleteDoc, writeBatch, deleteField,
} from 'firebase/firestore';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAdminData } from '@/components/AdminGuard';
import { toast } from '@/lib/toast';
import type { ChallengeSubmission } from '@/lib/types';

type TabKey = 'settings' | 'submissions';
const REF_LABELS = ['back', 'left', 'right', 'front'] as const;

function toLocalDatetimeInput(ms: number): string {
  if (!ms || isNaN(ms)) return '';
  return new Date(ms - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function fromLocalDatetimeInput(value: string): number {
  if (!value) return 0;
  return new Date(value).getTime();
}

export default function AdminChallengePage() {
  const adminData = useAdminData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const activeTab: TabKey = tabParam === 'submissions' ? 'submissions' : 'settings';

  const canManage = adminData?.permissions?.canManageChallenge === true;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [submissionsOpenAt, setSubmissionsOpenAt] = useState<number>(
    new Date('2026-06-25T00:00:00+02:00').getTime()
  );
  const [submissionsCloseAt, setSubmissionsCloseAt] = useState<number>(
    new Date('2026-06-28T00:00:00+02:00').getTime()
  );
  const [votingOpenAt, setVotingOpenAt] = useState<number>(
    new Date('2026-06-28T00:00:00+02:00').getTime()
  );
  const [votingCloseAt, setVotingCloseAt] = useState<number>(
    new Date('2026-09-17T00:00:00+02:00').getTime()
  );
  const [ibanText, setIbanText] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [referencePhotos, setReferencePhotos] = useState<string[]>([]);
  const [referencePhotoLabels, setReferencePhotoLabels] = useState<string[]>([
    'back', 'left', 'right', 'front',
  ]);
  const [fakeBarberCount, setFakeBarberCount] = useState(0);
  const [fakeShopCount, setFakeShopCount] = useState(0);
  const [publicLeaderboardEnabled, setPublicLeaderboardEnabled] = useState(false);
  const [feeBarber, setFeeBarber] = useState(19);
  const [feeShop, setFeeShop] = useState(49);
  const [ivaRate, setIvaRate] = useState(21);
  const [prizeBarberValue, setPrizeBarberValue] = useState(12000);
  const [prizeShopValue, setPrizeShopValue] = useState(100000);
  const [eventDate, setEventDate] = useState('2026-09-17T20:00:00+02:00');
  const [showHomepageBox, setShowHomepageBox] = useState(true);
  const [challengeMode, setChallengeMode] = useState(false);
  const [challengeModeEndDate, setChallengeModeEndDate] = useState('');

  const [uploadingLabel, setUploadingLabel] = useState<string | null>(null);

  // Submissions tab state
  const [submissions, setSubmissions] = useState<(ChallengeSubmission & { id: string })[]>([]);
  const [statusFilter, setStatusFilter] = useState<ChallengeSubmission['status']>(
    (searchParams.get('status') as ChallengeSubmission['status']) || 'pending'
  );
  const [loadingList, setLoadingList] = useState(false);
  const [lastCursor, setLastCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showRejectFor, setShowRejectFor] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [actioning, setActioning] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'siteConfig', 'challenge'));
        if (cancelled) return;
        if (snap.exists()) {
          const d = snap.data();
          if (typeof d.submissionsOpenAt === 'number') setSubmissionsOpenAt(d.submissionsOpenAt);
          if (typeof d.submissionsCloseAt === 'number') setSubmissionsCloseAt(d.submissionsCloseAt);
          if (typeof d.votingOpenAt === 'number') setVotingOpenAt(d.votingOpenAt);
          if (typeof d.votingCloseAt === 'number') setVotingCloseAt(d.votingCloseAt);
          if (typeof d.ibanText === 'string') setIbanText(d.ibanText);
          if (typeof d.accountHolderName === 'string') setAccountHolderName(d.accountHolderName);
          if (Array.isArray(d.referencePhotos)) setReferencePhotos(d.referencePhotos);
          if (Array.isArray(d.referencePhotoLabels)) setReferencePhotoLabels(d.referencePhotoLabels);
          if (typeof d.fakeBarberCount === 'number') setFakeBarberCount(d.fakeBarberCount);
          if (typeof d.fakeShopCount === 'number') setFakeShopCount(d.fakeShopCount);
          if (typeof d.publicLeaderboardEnabled === 'boolean') setPublicLeaderboardEnabled(d.publicLeaderboardEnabled);
          if (typeof d.feeBarber === 'number') setFeeBarber(d.feeBarber);
          if (typeof d.feeShop === 'number') setFeeShop(d.feeShop);
          if (typeof d.ivaRate === 'number') setIvaRate(d.ivaRate);
          if (typeof d.prizeBarberValue === 'number') setPrizeBarberValue(d.prizeBarberValue);
          if (typeof d.prizeShopValue === 'number') setPrizeShopValue(d.prizeShopValue);
          if (d.eventDate) setEventDate(d.eventDate);
          setShowHomepageBox(d.showHomepageBox ?? true);
          setChallengeMode(d.challengeMode ?? false);
          setChallengeModeEndDate(d.challengeModeEndDate ?? '');
        }
      } catch (e) {
        console.error('Failed to load challenge settings:', e);
        toast.error('Failed to load challenge settings.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const fetchSubmissions = useCallback(async (reset: boolean) => {
    if (loadingList) return;
    setLoadingList(true);
    try {
      let q = query(
        collection(db, 'challengeSubmissions'),
        where('status', '==', statusFilter),
        orderBy('submittedAt', 'desc'),
        limit(10)
      );
      if (!reset && lastCursor) {
        q = query(q, startAfter(lastCursor));
      }
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...(d.data() as ChallengeSubmission) }));
      if (reset) {
        setSubmissions(docs);
      } else {
        setSubmissions(prev => [...prev, ...docs]);
      }
      setLastCursor(snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : lastCursor);
      setHasMore(snap.docs.length === 10);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load submissions';
      toast.error(msg);
    } finally {
      setLoadingList(false);
    }
  }, [statusFilter, lastCursor, loadingList]);

  useEffect(() => {
    if (activeTab !== 'submissions') return;
    setLastCursor(null);
    setHasMore(true);
    setExpandedId(null);
    setShowRejectFor(null);
    setRejectionReasonInput('');
    fetchSubmissions(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, statusFilter]);

  async function handleApprove(submission: ChallengeSubmission & { id: string }) {
    if (!auth.currentUser) return;
    setActioning(submission.id);
    try {
      const now = Date.now();
      await updateDoc(doc(db, 'challengeSubmissions', submission.id), {
        status: 'approved',
        approvedAt: now,
        rejectionReason: null,
      });
      const linkTo = submission.type === 'shop'
        ? '/dashboard/shop/challenge'
        : '/dashboard/barber/challenge';
      await addDoc(collection(db, 'notifications'), {
        userId: submission.userId,
        type: 'challenge_approved',
        message: `🎉 Your titeZMe Challenge submission has been approved! It will go live when voting opens.`,
        read: false,
        linkTo,
        createdAt: now,
      });
      try {
        await updateDoc(doc(db, 'users', submission.userId), {
          unreadCount: increment(1),
        });
      } catch (e) {
        console.warn('unreadCount increment failed (approve)', e);
      }
      await addDoc(collection(db, 'adminLogs'), {
        action: 'approved_submission',
        targetId: submission.id,
        adminId: auth.currentUser.uid,
        timestamp: now,
      });
      toast.success('Submission approved.');
      setSubmissions(prev => prev.filter(s => s.id !== submission.id));
      setExpandedId(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to approve';
      toast.error(msg);
    } finally {
      setActioning(null);
    }
  }

  async function handleReject(submission: ChallengeSubmission & { id: string }) {
    if (!auth.currentUser) return;
    const reason = rejectionReasonInput.trim();
    if (!reason) {
      toast.error('Please provide a reason.');
      return;
    }
    setActioning(submission.id);
    try {
      const now = Date.now();
      await updateDoc(doc(db, 'challengeSubmissions', submission.id), {
        status: 'rejected',
        rejectedAt: now,
        rejectionReason: reason,
      });
      const linkTo = submission.type === 'shop'
        ? '/dashboard/shop/challenge'
        : '/dashboard/barber/challenge';
      await addDoc(collection(db, 'notifications'), {
        userId: submission.userId,
        type: 'challenge_rejected',
        message: `❌ Your titeZMe Challenge submission needs to be resubmitted. Reason: ${reason}`,
        read: false,
        linkTo,
        createdAt: now,
      });
      try {
        await updateDoc(doc(db, 'users', submission.userId), {
          unreadCount: increment(1),
        });
      } catch (e) {
        console.warn('unreadCount increment failed (reject)', e);
      }
      await addDoc(collection(db, 'adminLogs'), {
        action: 'requested_resubmission',
        targetId: submission.id,
        adminId: auth.currentUser.uid,
        timestamp: now,
        reason,
      });
      toast.success('Resubmission requested.');
      setSubmissions(prev => prev.filter(s => s.id !== submission.id));
      setShowRejectFor(null);
      setRejectionReasonInput('');
      setExpandedId(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to reject';
      toast.error(msg);
    } finally {
      setActioning(null);
    }
  }

  const handleDelete = async (sub: ChallengeSubmission & { id: string }) => {
    if (!confirm('Delete this submission permanently? Votes will also be removed. This cannot be undone.')) return;
    try {
      const votesSnap = await getDocs(
        query(
          collection(db, 'challengeVotes'),
          where('submissionId', '==', sub.id)
        )
      );
      const batch = writeBatch(db);
      votesSnap.docs.forEach(voteDoc => {
        batch.update(doc(db, 'users', voteDoc.data().voterUid), {
          [`challengeVotedFor${sub.type === 'barber' ? 'Barber' : 'Shop'}`]: deleteField()
        });
        batch.delete(voteDoc.ref);
      });

      batch.delete(doc(db, 'challengeSubmissions', sub.id));
      await batch.commit();

      setSubmissions(prev => prev.filter(s => s.id !== sub.id));
    } catch (err) {
      console.error('Failed to delete submission:', err);
      alert('Failed to delete submission. Try again.');
    }
  };

  const switchTab = useCallback((tab: TabKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`/admin/challenge?${params.toString()}`);
  }, [router, searchParams]);

  const handleSave = async () => {
    if (submissionsOpenAt >= submissionsCloseAt) {
      toast.error('Submissions open date must be before submissions close date.');
      return;
    }
    if (votingOpenAt >= votingCloseAt) {
      toast.error('Voting open date must be before voting close date.');
      return;
    }
    if (submissionsCloseAt > votingOpenAt) {
      toast.error('Submissions must close on or before voting opens.');
      return;
    }
    if (feeBarber < 0 || feeShop < 0 || prizeBarberValue < 0 || prizeShopValue < 0) {
      toast.error('Fees and prize values must be 0 or greater.');
      return;
    }
    if (fakeBarberCount < 0 || fakeShopCount < 0) {
      toast.error('Fake counter values must be 0 or greater.');
      return;
    }

    setSaving(true);
    try {
      await setDoc(
        doc(db, 'siteConfig', 'challenge'),
        {
          submissionsOpenAt,
          submissionsCloseAt,
          votingOpenAt,
          votingCloseAt,
          ibanText,
          accountHolderName,
          referencePhotos,
          referencePhotoLabels,
          fakeBarberCount,
          fakeShopCount,
          publicLeaderboardEnabled,
          feeBarber,
          feeShop,
          ivaRate,
          prizeBarberValue,
          prizeShopValue,
          eventDate,
          showHomepageBox,
          challengeMode,
          challengeModeEndDate,
        },
        { merge: true }
      );
      toast.success('Challenge settings saved.');
    } catch (e) {
      console.error(e);
      toast.error('Failed to save challenge settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (label: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }
    setUploadingLabel(label);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        toast.error('Not authenticated.');
        setUploadingLabel(null);
        return;
      }
      const fd = new FormData();
      fd.append('file', file);
      fd.append('label', label);
      const res = await fetch('/api/admin/upload-reference-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.error || 'Upload failed.');
        return;
      }
      const idx = REF_LABELS.indexOf(label as typeof REF_LABELS[number]);
      const next = [...referencePhotos];
      while (next.length < REF_LABELS.length) next.push('');
      if (idx >= 0) next[idx] = json.url;
      setReferencePhotos(next);
      toast.success(`${label} photo uploaded.`);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Upload failed.');
    } finally {
      setUploadingLabel(null);
    }
  };

  // ── Access gate ──────────────────────────────────────────────────────────
  if (adminData && !canManage) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>No access</div>
        <div style={{ color: '#666', fontSize: 13 }}>You don&apos;t have permission to manage the Challenge.</div>
      </div>
    );
  }

  // ── Styles helpers ───────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: '#111',
    border: '1px solid #1e1e1e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  };
  const cardTitle: React.CSSProperties = {
    fontWeight: 900, fontSize: 15, marginBottom: 14, color: '#fff',
  };
  const fieldLabel: React.CSSProperties = {
    display: 'block', fontSize: 12, fontWeight: 700, color: '#aaa', marginBottom: 6,
  };
  const helper: React.CSSProperties = {
    fontSize: 11, color: '#555', marginTop: 6,
  };
  const inputStyle: React.CSSProperties = {
    background: '#141414',
    border: '1px solid #2a2a2a',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Nunito, sans-serif',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };
  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    fontSize: 13,
    fontWeight: active ? 900 : 700,
    color: active ? '#F5C518' : '#555',
    backgroundColor: active ? '#1a1a1a' : 'transparent',
    border: '1px solid ' + (active ? '#F5C51833' : '#1e1e1e'),
    borderRadius: 99,
    cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
  });

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>
          🏆 Challenge
        </h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
          Manage the titeZMe Challenge settings, submissions, and prizes.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button onClick={() => switchTab('settings')} style={tabBtn(activeTab === 'settings')}>
          Settings
        </button>
        <button onClick={() => switchTab('submissions')} style={tabBtn(activeTab === 'submissions')}>
          Submissions
        </button>
      </div>

      {activeTab === 'submissions' && (
        <div>
          {/* SUB-TABS (status filter) */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1e1e1e', marginBottom: 24 }}>
            {(['pending', 'awaiting_payment', 'approved', 'rejected'] as const).map(status => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setLastCursor(null);
                  router.replace(`/admin/challenge?tab=submissions&status=${status}`);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 20px',
                  color: statusFilter === status ? '#F5C518' : '#555',
                  borderBottom: statusFilter === status ? '2px solid #F5C518' : '2px solid transparent',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  fontFamily: 'Nunito, sans-serif',
                  marginBottom: -1,
                }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* EMPTY / LOADING STATES */}
          {loadingList && submissions.length === 0 && (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#555', fontSize: 13 }}>
              Loading...
            </div>
          )}
          {!loadingList && submissions.length === 0 && (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#555', fontSize: 13 }}>
              No submissions in this category.
            </div>
          )}

          {/* LIST */}
          {submissions.map(sub => (
            <div
              key={sub.id}
              style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
              }}
            >
              {/* ROW HEADER */}
              <div
                onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sub.submitterAvatarUrl || '/placeholder-avatar.png'}
                  alt=""
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', background: '#222' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{sub.submitterName}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>
                    {sub.type === 'shop' ? 'Barbershop' : 'Barber'} · {sub.submitterCity} ·{' '}
                    {new Date(sub.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <div style={{ color: '#555', fontSize: 11 }}>
                  {expandedId === sub.id ? '▼' : '▶'}
                </div>
              </div>

              {/* EXPANDED DETAIL */}
              {expandedId === sub.id && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #1e1e1e' }}>
                  {/* PHOTOS */}
                  {sub.photos && sub.photos.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ color: '#888', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Photos ({sub.photos.length})
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                        {sub.photos.map((url, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={i}
                            src={url}
                            alt={`Photo ${i + 1}`}
                            style={{
                              width: '100%',
                              aspectRatio: '1/1',
                              objectFit: 'cover',
                              borderRadius: 10,
                              background: '#222',
                              cursor: 'pointer',
                            }}
                            onClick={() => window.open(url, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VIDEO */}
                  {sub.videoUrl && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ color: '#888', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Video
                      </div>
                      <video
                        src={sub.videoUrl}
                        controls
                        preload="metadata"
                        style={{ width: '100%', maxWidth: 480, borderRadius: 10, background: '#000' }}
                      />
                    </div>
                  )}

                  {/* DESCRIPTION */}
                  {sub.description && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ color: '#888', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Description
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.5, color: '#ddd', whiteSpace: 'pre-wrap' }}>
                        {sub.description}
                      </div>
                    </div>
                  )}

                  {/* PAYMENT INFO */}
                  <div style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <div style={{ color: '#888', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Declared amount
                      </div>
                      <div style={{ fontSize: 14, color: '#fff' }}>
                        {sub.declaredAmount != null ? `€${sub.declaredAmount}` : '—'}
                        {(() => {
                          const expectedFee = sub.type === 'barber' ? feeBarber : feeShop;
                          const expectedTotal = typeof expectedFee === 'number'
                            ? parseFloat((expectedFee + (expectedFee * ivaRate) / 100).toFixed(2))
                            : null;
                          return expectedTotal != null ? (
                            <span style={{ marginLeft: 8, fontSize: 12, color: '#888' }}>
                              (expected €{expectedTotal})
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#888', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Declared reference
                      </div>
                      <div style={{ fontSize: 14, color: '#fff' }}>
                        {sub.declaredReference || '—'}
                      </div>
                    </div>
                  </div>

                  {/* META */}
                  <div style={{ marginBottom: 16, color: '#555', fontSize: 11 }}>
                    User ID: {sub.userId} · Status: {sub.status} · Resubmissions: {sub.resubmissionCount || 0}
                    {sub.barberCode && ` · Barber code: ${sub.barberCode}`}
                    {sub.shopId && ` · Shop ID: ${sub.shopId}`}
                  </div>

                  {/* PREVIOUS REJECTION REASON */}
                  {sub.rejectionReason && (
                    <div style={{ marginBottom: 16, padding: 12, background: '#1a0808', border: '1px solid #4a1f1f', borderRadius: 10 }}>
                      <div style={{ color: '#EF4444', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Previous rejection reason
                      </div>
                      <div style={{ fontSize: 13, color: '#ddd' }}>
                        {sub.rejectionReason}
                      </div>
                    </div>
                  )}

                  {/* ACTIONS — pending only */}
                  {sub.status === 'pending' && (
                    <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => handleApprove(sub)}
                        disabled={actioning === sub.id}
                        style={{
                          background: actioning === sub.id ? '#1a1a1a' : '#22C55E',
                          color: actioning === sub.id ? '#555' : '#000',
                          border: 'none',
                          padding: '10px 24px',
                          borderRadius: 10,
                          fontWeight: 900,
                          fontSize: 13,
                          cursor: actioning === sub.id ? 'not-allowed' : 'pointer',
                          fontFamily: 'Nunito, sans-serif',
                        }}
                      >
                        {actioning === sub.id ? 'Working...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectFor(sub.id);
                          setRejectionReasonInput('');
                        }}
                        style={{
                          background: 'transparent',
                          color: '#EF4444',
                          border: '1px solid #EF4444',
                          padding: '10px 24px',
                          borderRadius: 10,
                          fontWeight: 900,
                          fontSize: 13,
                          cursor: 'pointer',
                          fontFamily: 'Nunito, sans-serif',
                        }}
                      >
                        Request Resubmission
                      </button>
                    </div>
                  )}

                  {/* REJECT FORM */}
                  {showRejectFor === sub.id && (
                    <div style={{ marginTop: 16, padding: 16, background: '#0d0404', border: '1px solid #4a1f1f', borderRadius: 12 }}>
                      <div style={{ color: '#EF4444', fontSize: 12, marginBottom: 8, fontWeight: 700 }}>
                        Reason for resubmission request:
                      </div>
                      <textarea
                        value={rejectionReasonInput}
                        onChange={(e) => setRejectionReasonInput(e.target.value)}
                        placeholder="e.g. Payment not received, photo quality too low, etc."
                        rows={3}
                        style={{
                          width: '100%',
                          background: '#141414',
                          border: '1px solid #2a2a2a',
                          borderRadius: 10,
                          padding: 12,
                          color: '#fff',
                          fontSize: 13,
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleReject(sub)}
                          disabled={!rejectionReasonInput.trim() || actioning === sub.id}
                          style={{
                            background: !rejectionReasonInput.trim() ? '#1a1a1a' : '#EF4444',
                            color: !rejectionReasonInput.trim() ? '#555' : '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: 10,
                            fontWeight: 900,
                            fontSize: 13,
                            cursor: !rejectionReasonInput.trim() ? 'not-allowed' : 'pointer',
                            fontFamily: 'Nunito, sans-serif',
                          }}
                        >
                          {actioning === sub.id ? 'Working...' : 'Send'}
                        </button>
                        <button
                          onClick={() => {
                            setShowRejectFor(null);
                            setRejectionReasonInput('');
                          }}
                          style={{
                            background: 'transparent',
                            color: '#666',
                            border: '1px solid #2a2a2a',
                            padding: '10px 20px',
                            borderRadius: 10,
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: 'pointer',
                            fontFamily: 'Nunito, sans-serif',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* DELETE — all statuses */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleDelete(sub)}
                      className="text-xs text-red-500 hover:text-red-400 underline"
                    >
                      Delete submission permanently
                    </button>
                  </div>

                  {/* AWAITING PAYMENT */}
                  {sub.status === 'awaiting_payment' && (
                    <div style={{ marginTop: 16, padding: 12, background: '#0a0a0a', border: '1px dashed #2a2a2a', borderRadius: 10, color: '#777', fontSize: 12 }}>
                      User has filled the form but has not yet clicked &quot;I paid&quot;.
                      No admin action available until payment is declared.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* LOAD MORE */}
          {hasMore && submissions.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <button
                onClick={() => fetchSubmissions(false)}
                disabled={loadingList}
                style={{
                  background: '#1a1a1a',
                  color: '#F5C518',
                  border: '1px solid #2a2a2a',
                  padding: '10px 28px',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: loadingList ? 'not-allowed' : 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                {loadingList ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        loading ? (
          <div style={{ color: '#555', fontSize: 13 }}>Loading settings…</div>
        ) : (
          <>
            {/* A. Dates */}
            <div style={card}>
              <div style={cardTitle}>Dates</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={fieldLabel}>Submissions open at</label>
                  <input
                    type="datetime-local"
                    value={toLocalDatetimeInput(submissionsOpenAt)}
                    onChange={e => setSubmissionsOpenAt(fromLocalDatetimeInput(e.target.value))}
                    style={inputStyle}
                  />
                  <div style={helper}>Spain time (Europe/Madrid)</div>
                </div>
                <div>
                  <label style={fieldLabel}>Submissions close at</label>
                  <input
                    type="datetime-local"
                    value={toLocalDatetimeInput(submissionsCloseAt)}
                    onChange={e => setSubmissionsCloseAt(fromLocalDatetimeInput(e.target.value))}
                    style={inputStyle}
                  />
                  <div style={helper}>Spain time (Europe/Madrid)</div>
                </div>
                <div>
                  <label style={fieldLabel}>Voting open at</label>
                  <input
                    type="datetime-local"
                    value={toLocalDatetimeInput(votingOpenAt)}
                    onChange={e => setVotingOpenAt(fromLocalDatetimeInput(e.target.value))}
                    style={inputStyle}
                  />
                  <div style={helper}>Spain time (Europe/Madrid)</div>
                </div>
                <div>
                  <label style={fieldLabel}>Voting close at</label>
                  <input
                    type="datetime-local"
                    value={toLocalDatetimeInput(votingCloseAt)}
                    onChange={e => setVotingCloseAt(fromLocalDatetimeInput(e.target.value))}
                    style={inputStyle}
                  />
                  <div style={helper}>Spain time (Europe/Madrid)</div>
                </div>
              </div>

              {/* Event Date */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Live Event Date (Madrid)
                </label>
                <input
                  type="datetime-local"
                  value={eventDate ? new Date(eventDate).toISOString().slice(0,16) : ''}
                  onChange={(e) => setEventDate(new Date(e.target.value).toISOString())}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Shown in the challenge closed screen and terms page.
                </p>
              </div>
            </div>

            {/* B. Payment details */}
            <div style={card}>
              <div style={cardTitle}>Payment details</div>
              <div style={{ marginBottom: 12 }}>
                <label style={fieldLabel}>IBAN</label>
                <input
                  type="text"
                  maxLength={50}
                  value={ibanText}
                  onChange={e => setIbanText(e.target.value)}
                  style={inputStyle}
                  placeholder="ES00 0000 0000 0000 0000 0000"
                />
              </div>
              <div>
                <label style={fieldLabel}>Account holder name</label>
                <input
                  type="text"
                  maxLength={100}
                  value={accountHolderName}
                  onChange={e => setAccountHolderName(e.target.value)}
                  style={inputStyle}
                  placeholder="Ibrahim Mellouli"
                />
              </div>
              <div style={helper}>Only shown to barbers AFTER they submit a proposal.</div>
            </div>

            {/* C. Fees & Prizes */}
            <div style={card}>
              <div style={cardTitle}>Fees &amp; Prizes</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={fieldLabel}>Entry fee — barbers (€)</label>
                  <input type="number" min={0} value={feeBarber}
                    onChange={e => setFeeBarber(Number(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>Entry fee — barbershops (€)</label>
                  <input type="number" min={0} value={feeShop}
                    onChange={e => setFeeShop(Number(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>IVA rate (%)</label>
                  <input
                    type="number"
                    value={ivaRate}
                    onChange={e => setIvaRate(Number(e.target.value))}
                    style={inputStyle}
                    min={0}
                    max={100}
                    step={0.1}
                  />
                  <span style={{ fontSize: 11, color: '#888', marginTop: 4, display: 'block' }}>
                    Applied to both barber and shop fees
                  </span>
                </div>
                <div>
                  <label style={fieldLabel}>Prize value — barbers (€)</label>
                  <input type="number" min={0} value={prizeBarberValue}
                    onChange={e => setPrizeBarberValue(Number(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>Prize value — barbershops (€)</label>
                  <input type="number" min={0} value={prizeShopValue}
                    onChange={e => setPrizeShopValue(Number(e.target.value))} style={inputStyle} />
                </div>
              </div>
              <div style={helper}>
                Prize values shown on homepage and challenge page. The actual prize is 5 years free; the € value represents subscription value over 5 years.
              </div>
            </div>

            {/* D. Fake counters */}
            <div style={card}>
              <div style={cardTitle}>Fake counters</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={fieldLabel}>Fake barbers count</label>
                  <input type="number" min={0} value={fakeBarberCount}
                    onChange={e => setFakeBarberCount(Number(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={fieldLabel}>Fake shops count</label>
                  <input type="number" min={0} value={fakeShopCount}
                    onChange={e => setFakeShopCount(Number(e.target.value))} style={inputStyle} />
                </div>
              </div>
              <div style={helper}>
                Added to real counts on homepage box. Set to 0 once you have enough real participants.
              </div>
            </div>

            {/* E. Public leaderboard */}
            <div style={card}>
              <div style={cardTitle}>Public leaderboard</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#ccc' }}>
                <input
                  type="checkbox"
                  checked={publicLeaderboardEnabled}
                  onChange={e => setPublicLeaderboardEnabled(e.target.checked)}
                  style={{ width: 15, height: 15, accentColor: '#F5C518' }}
                />
                Show public F1 leaderboard on /challenge
              </label>
              <div style={helper}>
                Auto-disabled when voting ends (handled by scheduled function). Turn back on if needed.
              </div>

              {/* Show Homepage Box */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Show Challenge Box on Homepage
                  </p>
                  <p className="text-xs text-gray-500">
                    Toggle the challenge banner on the landing page
                  </p>
                </div>
                <button
                  onClick={() => setShowHomepageBox(!showHomepageBox)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${showHomepageBox ? 'bg-black' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${showHomepageBox ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Challenge Mode (Booking Suspension) */}
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Challenge Mode — Suspend Bookings
                  </p>
                  <p className="text-xs text-gray-500">
                    {challengeMode
                      ? '🔴 Bookings SUSPENDED'
                      : '🟢 Bookings ACTIVE'}
                  </p>
                </div>
                <button
                  onClick={() => setChallengeMode(!challengeMode)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${challengeMode ? 'bg-red-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${challengeMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Challenge Mode End Date */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Suspension End Date (shown to users)
                </label>
                <input
                  type="text"
                  value={challengeModeEndDate}
                  onChange={(e) => setChallengeModeEndDate(e.target.value)}
                  placeholder="e.g. July 1, 2026"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* F. Reference photos */}
            <div style={card}>
              <div style={cardTitle}>Reference photos</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                {REF_LABELS.map((label, i) => {
                  const url = referencePhotos[i] || '';
                  const uploading = uploadingLabel === label;
                  return (
                    <div key={label} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 12, padding: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#aaa', textTransform: 'capitalize', marginBottom: 8 }}>
                        {label}
                      </div>
                      <div style={{
                        width: '100%', aspectRatio: '1 / 1', background: '#141414',
                        borderRadius: 8, marginBottom: 10, overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ fontSize: 11, color: '#444' }}>No photo</div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploading}
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(label, f);
                          e.target.value = '';
                        }}
                        style={{ fontSize: 11, color: '#888', width: '100%' }}
                      />
                      {uploading && <div style={{ fontSize: 11, color: '#F5C518', marginTop: 6 }}>Uploading…</div>}
                    </div>
                  );
                })}
              </div>
              <div style={helper}>
                These 4 face photos are downloadable by participating barbers and shops. Max 5MB per photo, image/* only.
              </div>
            </div>

            {/* Save */}
            <div style={{
              position: 'sticky', bottom: 0, padding: '16px 0',
              background: 'linear-gradient(180deg, rgba(10,10,10,0) 0%, #0A0A0A 40%)',
              display: 'flex', justifyContent: 'flex-end', gap: 10,
            }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: saving ? '#2a2000' : '#F5C518',
                  color: saving ? '#F5C518' : '#0a0a0a',
                  border: 'none', borderRadius: 99,
                  padding: '11px 28px',
                  fontWeight: 900, fontSize: 13,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontFamily: 'Nunito, sans-serif',
                }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}
