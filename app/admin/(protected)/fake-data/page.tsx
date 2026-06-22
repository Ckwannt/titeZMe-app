'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FakeDataAdminPage() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'siteConfig', 'global'));
        if (!snap.exists()) {
          setEnabled(true);
          return;
        }
        const val = (snap.data() as { showFakeUIData?: boolean }).showFakeUIData;
        setEnabled(val !== false);
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to load setting.');
        setEnabled(true);
      }
    })();
  }, []);

  const handleToggle = async () => {
    if (enabled === null || saving) return;
    const next = !enabled;
    setSaving(true);
    setErrorMsg('');
    try {
      await setDoc(doc(db, 'siteConfig', 'global'), { showFakeUIData: next }, { merge: true });
      setEnabled(next);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to save. Check console.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>
          Fake Data (UI Only)
        </h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 6, lineHeight: 1.5 }}>
          Toggle whether 100 fake barbers and 50 fake shops appear on /barbers and /shops.
          They auto-disappear as real barbers/shops join.
        </p>
      </div>

      {errorMsg && (
        <div
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            background: '#1a0808',
            color: '#EF4444',
            border: '1px solid #EF444440',
          }}
        >
          {errorMsg}
        </div>
      )}

      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>Show Fake Data</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              {enabled === null
                ? 'Loading…'
                : enabled
                  ? 'Fake barbers and shops are visible on the site.'
                  : 'Fake data is hidden. Only real entries appear.'}
            </div>
          </div>

          <button
            onClick={handleToggle}
            disabled={enabled === null || saving}
            aria-pressed={enabled === true}
            style={{
              position: 'relative',
              width: 56,
              height: 32,
              borderRadius: 999,
              border: '1px solid #2a2a2a',
              background: enabled ? '#F5C518' : '#1a1a1a',
              cursor: enabled === null || saving ? 'wait' : 'pointer',
              transition: 'background 0.15s',
              flexShrink: 0,
              opacity: enabled === null || saving ? 0.6 : 1,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                left: enabled ? 26 : 3,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: enabled ? '#0a0a0a' : '#888',
                transition: 'left 0.15s',
              }}
            />
          </button>
        </div>
      </div>

      <div
        className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-5"
        style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}
      >
        Currently 100 fake barbers + 50 fake shops are seeded in the UI.
        Each real barber that joins reduces visible fake barbers by 1 (capped at 100).
        Same for shops (capped at 50).
      </div>
    </div>
  );
}
