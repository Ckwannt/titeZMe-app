'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAdminData } from '@/components/AdminGuard';
import { toast } from '@/lib/toast';

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
  const [bizumNumber, setBizumNumber] = useState('');
  const [referencePhotos, setReferencePhotos] = useState<string[]>([]);
  const [referencePhotoLabels, setReferencePhotoLabels] = useState<string[]>([
    'back', 'left', 'right', 'front',
  ]);
  const [fakeBarberCount, setFakeBarberCount] = useState(0);
  const [fakeShopCount, setFakeShopCount] = useState(0);
  const [publicLeaderboardEnabled, setPublicLeaderboardEnabled] = useState(false);
  const [feeBarber, setFeeBarber] = useState(19);
  const [feeShop, setFeeShop] = useState(49);
  const [prizeBarberValue, setPrizeBarberValue] = useState(12000);
  const [prizeShopValue, setPrizeShopValue] = useState(100000);

  const [uploadingLabel, setUploadingLabel] = useState<string | null>(null);

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
          if (typeof d.bizumNumber === 'string') setBizumNumber(d.bizumNumber);
          if (Array.isArray(d.referencePhotos)) setReferencePhotos(d.referencePhotos);
          if (Array.isArray(d.referencePhotoLabels)) setReferencePhotoLabels(d.referencePhotoLabels);
          if (typeof d.fakeBarberCount === 'number') setFakeBarberCount(d.fakeBarberCount);
          if (typeof d.fakeShopCount === 'number') setFakeShopCount(d.fakeShopCount);
          if (typeof d.publicLeaderboardEnabled === 'boolean') setPublicLeaderboardEnabled(d.publicLeaderboardEnabled);
          if (typeof d.feeBarber === 'number') setFeeBarber(d.feeBarber);
          if (typeof d.feeShop === 'number') setFeeShop(d.feeShop);
          if (typeof d.prizeBarberValue === 'number') setPrizeBarberValue(d.prizeBarberValue);
          if (typeof d.prizeShopValue === 'number') setPrizeShopValue(d.prizeShopValue);
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
          bizumNumber,
          referencePhotos,
          referencePhotoLabels,
          fakeBarberCount,
          fakeShopCount,
          publicLeaderboardEnabled,
          feeBarber,
          feeShop,
          prizeBarberValue,
          prizeShopValue,
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
        <div style={{ padding: '60px 0', textAlign: 'center', color: '#555', fontSize: 13 }}>
          Submissions manager coming in Step 6.
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
                <label style={fieldLabel}>Bizum number</label>
                <input
                  type="text"
                  maxLength={20}
                  value={bizumNumber}
                  onChange={e => setBizumNumber(e.target.value)}
                  style={inputStyle}
                  placeholder="+34 ..."
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
