'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminSettingsPage() {
  const [hideFeaturedSection, setHideFeaturedSection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDoc(doc(db, 'siteConfig', 'global'));
        if (snap.exists()) {
          setHideFeaturedSection(snap.data().hideFeaturedSection === true);
        }
      } catch (err) {
        console.error('Failed to load site config:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggle = async () => {
    if (saving) return;
    const next = !hideFeaturedSection;
    setHideFeaturedSection(next);
    setSaving(true);
    try {
      await setDoc(
        doc(db, 'siteConfig', 'global'),
        { hideFeaturedSection: next },
        { merge: true }
      );
    } catch (err) {
      console.error('Failed to update site config:', err);
      setHideFeaturedSection(!next);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>
          Settings
        </h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
          Site-wide configuration
        </p>
      </div>

      {loading ? (
        <div style={{ color: '#555', fontSize: 14 }}>Loading settings…</div>
      ) : (
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-4">
          <h2
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 14,
            }}
          >
            Landing page
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#0d0d0d',
              borderRadius: 10,
              border: '1px solid #1a1a1a',
            }}
          >
            <div style={{ flex: 1, paddingRight: 16 }}>
              <div style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>
                Hide Featured Barbers section on landing page
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                When ON, the featured barbers/shops block is hidden for all visitors.
              </div>
            </div>

            <button
              onClick={handleToggle}
              disabled={saving}
              aria-pressed={hideFeaturedSection}
              style={{
                position: 'relative',
                width: 44,
                height: 24,
                borderRadius: 999,
                border: '1px solid #2a2a2a',
                background: hideFeaturedSection ? '#F5C518' : '#1a1a1a',
                cursor: saving ? 'wait' : 'pointer',
                transition: 'background 0.15s',
                flexShrink: 0,
                padding: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: hideFeaturedSection ? 22 : 2,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: hideFeaturedSection ? '#0a0a0a' : '#666',
                  transition: 'left 0.15s, background 0.15s',
                }}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
