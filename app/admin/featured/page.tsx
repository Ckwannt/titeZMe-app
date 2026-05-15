'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from '@/lib/toast';

interface FeaturedBarber {
  id: string;
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
  city?: string;
  isFeatured?: boolean;
  featuredUntil?: number;
}

interface FeaturedShop {
  id: string;
  name?: string;
  coverPhotoUrl?: string;
  city?: string;
  isFeatured?: boolean;
  featuredUntil?: number;
}

function formatDate(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getInitials(first?: string, last?: string): string {
  return `${(first || '?')[0]}${(last || '')[0] || ''}`.toUpperCase();
}

export default function AdminFeaturedPage() {
  const [featuredBarbers, setFeaturedBarbers] = useState<FeaturedBarber[]>([]);
  const [allBarbers, setAllBarbers] = useState<FeaturedBarber[]>([]);
  const [featuredShops, setFeaturedShops] = useState<FeaturedShop[]>([]);
  const [allShops, setAllShops] = useState<FeaturedShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBarberSearch, setShowBarberSearch] = useState(false);
  const [showShopSearch, setShowShopSearch] = useState(false);
  const [barberSearchQuery, setBarberSearchQuery] = useState('');
  const [shopSearchQuery, setShopSearchQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadFeaturedBarbers(): Promise<FeaturedBarber[]> {
    const snap = await getDocs(
      query(collection(db, 'barberProfiles'), where('isFeatured', '==', true))
    );
    const barbers: FeaturedBarber[] = await Promise.all(
      snap.docs.map(async (d) => {
        const data = d.data() as Record<string, unknown>;
        let firstName: string | undefined;
        let lastName: string | undefined;
        try {
          const userSnap = await getDoc(doc(db, 'users', d.id));
          if (userSnap.exists()) {
            const u = userSnap.data() as Record<string, unknown>;
            firstName = u.firstName as string | undefined;
            lastName = u.lastName as string | undefined;
          }
        } catch {
          // skip
        }
        return {
          id: d.id,
          firstName,
          lastName,
          profilePhotoUrl: data.profilePhotoUrl as string | undefined,
          city: data.city as string | undefined,
          isFeatured: true,
          featuredUntil: data.featuredUntil as number | undefined,
        };
      })
    );
    return barbers;
  }

  async function loadFeaturedShops(): Promise<FeaturedShop[]> {
    const snap = await getDocs(
      query(collection(db, 'barbershops'), where('isFeatured', '==', true))
    );
    return snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        name: data.name as string | undefined,
        coverPhotoUrl: data.coverPhotoUrl as string | undefined,
        city: data.city as string | undefined,
        isFeatured: true,
        featuredUntil: data.featuredUntil as number | undefined,
      };
    });
  }

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [fb, allBarbersSnap, fs, allShopsSnap] = await Promise.all([
          loadFeaturedBarbers(),
          getDocs(query(collection(db, 'barberProfiles'), where('isLive', '==', true))),
          loadFeaturedShops(),
          getDocs(query(collection(db, 'barbershops'), where('status', '==', 'active'))),
        ]);

        setFeaturedBarbers(fb);
        setFeaturedShops(fs);

        // Enrich all live barbers with user names
        const allB: FeaturedBarber[] = await Promise.all(
          allBarbersSnap.docs.map(async (d) => {
            const data = d.data() as Record<string, unknown>;
            let firstName: string | undefined;
            let lastName: string | undefined;
            try {
              const userSnap = await getDoc(doc(db, 'users', d.id));
              if (userSnap.exists()) {
                const u = userSnap.data() as Record<string, unknown>;
                firstName = u.firstName as string | undefined;
                lastName = u.lastName as string | undefined;
              }
            } catch {
              // skip
            }
            return {
              id: d.id,
              firstName,
              lastName,
              profilePhotoUrl: data.profilePhotoUrl as string | undefined,
              city: data.city as string | undefined,
              isFeatured: Boolean(data.isFeatured),
            };
          })
        );
        setAllBarbers(allB);

        const allS: FeaturedShop[] = allShopsSnap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            name: data.name as string | undefined,
            coverPhotoUrl: data.coverPhotoUrl as string | undefined,
            city: data.city as string | undefined,
            isFeatured: Boolean(data.isFeatured),
          };
        });
        setAllShops(allS);
      } catch (err) {
        console.error('Featured load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  // Barber search results (exclude already featured)
  const barberSearchResults = useMemo(() => {
    if (!barberSearchQuery.trim()) return [];
    const q = barberSearchQuery.toLowerCase();
    const featuredIdSet = new Set(featuredBarbers.map((b) => b.id));
    return allBarbers.filter((b) => {
      if (featuredIdSet.has(b.id)) return false;
      const name = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
      const city = (b.city || '').toLowerCase();
      return name.includes(q) || city.includes(q);
    }).slice(0, 8);
  }, [barberSearchQuery, allBarbers, featuredBarbers]);

  // Shop search results (exclude already featured)
  const shopSearchResults = useMemo(() => {
    if (!shopSearchQuery.trim()) return [];
    const q = shopSearchQuery.toLowerCase();
    const featuredIdSet = new Set(featuredShops.map((s) => s.id));
    return allShops.filter((s) => {
      if (featuredIdSet.has(s.id)) return false;
      const name = (s.name || '').toLowerCase();
      const city = (s.city || '').toLowerCase();
      return name.includes(q) || city.includes(q);
    }).slice(0, 8);
  }, [shopSearchQuery, allShops, featuredShops]);

  async function addFeaturedBarber(barber: FeaturedBarber) {
    setSavingId(barber.id);
    try {
      const until = Date.now() + 30 * 24 * 60 * 60 * 1000;
      await updateDoc(doc(db, 'barberProfiles', barber.id), {
        isFeatured: true,
        featuredUntil: until,
      });
      const refreshed = await loadFeaturedBarbers();
      setFeaturedBarbers(refreshed);
      setBarberSearchQuery('');
      setShowBarberSearch(false);
      toast.success(`${barber.firstName || 'Barber'} added to featured`);
    } catch (err) {
      console.error('Add featured barber error:', err);
      toast.error('Failed to feature barber');
    } finally {
      setSavingId(null);
    }
  }

  async function removeFeaturedBarber(barberId: string) {
    setSavingId(barberId);
    try {
      await updateDoc(doc(db, 'barberProfiles', barberId), {
        isFeatured: false,
        featuredUntil: null,
      });
      setFeaturedBarbers((prev) => prev.filter((b) => b.id !== barberId));
      toast.success('Barber removed from featured');
    } catch (err) {
      console.error('Remove featured barber error:', err);
      toast.error('Failed to remove');
    } finally {
      setSavingId(null);
    }
  }

  async function addFeaturedShop(shop: FeaturedShop) {
    setSavingId(shop.id);
    try {
      const until = Date.now() + 30 * 24 * 60 * 60 * 1000;
      await updateDoc(doc(db, 'barbershops', shop.id), {
        isFeatured: true,
        featuredUntil: until,
      });
      const refreshed = await loadFeaturedShops();
      setFeaturedShops(refreshed);
      setShopSearchQuery('');
      setShowShopSearch(false);
      toast.success(`${shop.name || 'Shop'} added to featured`);
    } catch (err) {
      console.error('Add featured shop error:', err);
      toast.error('Failed to feature shop');
    } finally {
      setSavingId(null);
    }
  }

  async function removeFeaturedShop(shopId: string) {
    setSavingId(shopId);
    try {
      await updateDoc(doc(db, 'barbershops', shopId), {
        isFeatured: false,
        featuredUntil: null,
      });
      setFeaturedShops((prev) => prev.filter((s) => s.id !== shopId));
      toast.success('Shop removed from featured');
    } catch (err) {
      console.error('Remove featured shop error:', err);
      toast.error('Failed to remove');
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <div style={{ color: '#555', fontSize: 14, padding: 20 }}>Loading…</div>;
  }

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Featured</h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
          Manage barbers and shops featured on the landing page. Featured slots last 30 days.
        </p>
      </div>

      {/* ─── Featured Barbers ─── */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 mb-6">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0 }}>
            Featured Barbers ({featuredBarbers.length})
          </h2>
          <button
            onClick={() => { setShowBarberSearch((v) => !v); setBarberSearchQuery(''); }}
            style={{
              background: showBarberSearch ? '#1a1200' : '#111',
              border: `1px solid ${showBarberSearch ? '#F5C518' : '#2a2a2a'}`,
              borderRadius: 10,
              padding: '7px 14px',
              fontSize: 12,
              fontWeight: 800,
              color: showBarberSearch ? '#F5C518' : '#888',
              cursor: 'pointer',
            }}
          >
            {showBarberSearch ? '✕ Cancel' : '+ Add featured barber'}
          </button>
        </div>

        {/* Barber search input */}
        {showBarberSearch && (
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search live barbers by name or city…"
              value={barberSearchQuery}
              onChange={(e) => setBarberSearchQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                background: '#0d0d0d',
                border: '1px solid #2a2a2a',
                borderRadius: 10,
                padding: '9px 14px',
                fontSize: 13,
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {barberSearchResults.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#0d0d0d',
                  border: '1px solid #2a2a2a',
                  borderTop: 'none',
                  borderRadius: '0 0 10px 10px',
                  zIndex: 10,
                  overflow: 'hidden',
                }}
              >
                {barberSearchResults.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => addFeaturedBarber(b)}
                    disabled={savingId === b.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid #1a1a1a',
                      padding: '10px 14px',
                      cursor: savingId === b.id ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 900,
                        color: '#F5C518',
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(b.firstName, b.lastName)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                        {`${b.firstName || ''} ${b.lastName || ''}`.trim() || b.id}
                      </div>
                      {b.city && <div style={{ fontSize: 11, color: '#555' }}>{b.city}</div>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Featured barber list */}
        {featuredBarbers.length === 0 ? (
          <p style={{ fontSize: 13, color: '#555' }}>No featured barbers yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {featuredBarbers.map((b) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  background: '#0d0d0d',
                  border: '1px solid #1a1a1a',
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 900,
                    color: '#F5C518',
                    flexShrink: 0,
                  }}
                >
                  {getInitials(b.firstName, b.lastName)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                    {`${b.firstName || ''} ${b.lastName || ''}`.trim() || b.id}
                  </div>
                  <div style={{ fontSize: 11, color: '#555' }}>
                    Featured until {formatDate(b.featuredUntil)}
                    {b.city ? ` · ${b.city}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => removeFeaturedBarber(b.id)}
                  disabled={savingId === b.id}
                  style={{
                    background: 'none',
                    border: '1px solid #EF444440',
                    borderRadius: 8,
                    padding: '5px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#EF4444',
                    cursor: savingId === b.id ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Featured Shops ─── */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0 }}>
            Featured Shops ({featuredShops.length})
          </h2>
          <button
            onClick={() => { setShowShopSearch((v) => !v); setShopSearchQuery(''); }}
            style={{
              background: showShopSearch ? '#1a1200' : '#111',
              border: `1px solid ${showShopSearch ? '#F5C518' : '#2a2a2a'}`,
              borderRadius: 10,
              padding: '7px 14px',
              fontSize: 12,
              fontWeight: 800,
              color: showShopSearch ? '#F5C518' : '#888',
              cursor: 'pointer',
            }}
          >
            {showShopSearch ? '✕ Cancel' : '+ Add featured shop'}
          </button>
        </div>

        {/* Shop search input */}
        {showShopSearch && (
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <input
              type="text"
              placeholder="Search active shops by name or city…"
              value={shopSearchQuery}
              onChange={(e) => setShopSearchQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                background: '#0d0d0d',
                border: '1px solid #2a2a2a',
                borderRadius: 10,
                padding: '9px 14px',
                fontSize: 13,
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {shopSearchResults.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#0d0d0d',
                  border: '1px solid #2a2a2a',
                  borderTop: 'none',
                  borderRadius: '0 0 10px 10px',
                  zIndex: 10,
                  overflow: 'hidden',
                }}
              >
                {shopSearchResults.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => addFeaturedShop(s)}
                    disabled={savingId === s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid #1a1a1a',
                      padding: '10px 14px',
                      cursor: savingId === s.id ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: 20 }}>🏪</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                        {s.name || s.id}
                      </div>
                      {s.city && <div style={{ fontSize: 11, color: '#555' }}>{s.city}</div>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Featured shops list */}
        {featuredShops.length === 0 ? (
          <p style={{ fontSize: 13, color: '#555' }}>No featured shops yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {featuredShops.map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  background: '#0d0d0d',
                  border: '1px solid #1a1a1a',
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  🏪
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
                    {s.name || s.id}
                  </div>
                  <div style={{ fontSize: 11, color: '#555' }}>
                    Featured until {formatDate(s.featuredUntil)}
                    {s.city ? ` · ${s.city}` : ''}
                  </div>
                </div>
                <button
                  onClick={() => removeFeaturedShop(s.id)}
                  disabled={savingId === s.id}
                  style={{
                    background: 'none',
                    border: '1px solid #EF444440',
                    borderRadius: 8,
                    padding: '5px 12px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#EF4444',
                    cursor: savingId === s.id ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
