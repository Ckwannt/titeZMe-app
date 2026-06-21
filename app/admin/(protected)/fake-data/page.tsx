'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  generateFakeBarbers,
  generateFakeShops,
  type FakeBarber,
  type FakeShop,
} from '@/lib/fakeDataGenerator';

const BATCH_LIMIT = 450; // safely under Firestore's 500-op cap

async function commitInChunks(ops: Array<(batch: ReturnType<typeof writeBatch>) => void>) {
  for (let i = 0; i < ops.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    const chunk = ops.slice(i, i + BATCH_LIMIT);
    for (const apply of chunk) apply(batch);
    await batch.commit();
  }
}

async function deleteDocsWhere(collectionName: string, field: string, value: unknown) {
  const snap = await getDocs(query(collection(db, collectionName), where(field, '==', value)));
  const ops = snap.docs.map((d) => (batch: ReturnType<typeof writeBatch>) => batch.delete(d.ref));
  await commitInChunks(ops);
  return snap.size;
}

export default function FakeDataAdminPage() {
  const [barberCount, setBarberCount] = useState<number | null>(null);
  const [shopCount, setShopCount] = useState<number | null>(null);

  const [genBarbersLoading, setGenBarbersLoading] = useState(false);
  const [delBarbersLoading, setDelBarbersLoading] = useState(false);
  const [genShopsLoading, setGenShopsLoading] = useState(false);
  const [delShopsLoading, setDelShopsLoading] = useState(false);

  const [statusMsg, setStatusMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const refreshCounts = useCallback(async () => {
    try {
      const [barbersSnap, shopsSnap] = await Promise.all([
        getDocs(query(collection(db, 'barberProfiles'), where('isFake', '==', true))),
        getDocs(query(collection(db, 'barbershops'), where('isFake', '==', true))),
      ]);
      setBarberCount(barbersSnap.size);
      setShopCount(shopsSnap.size);
    } catch (err) {
      console.error('Failed to load fake-data counts:', err);
      setErrorMsg('Failed to load counts.');
    }
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  // ── Generate barbers ──────────────────────────────────────────────────────
  const handleGenerateBarbers = async () => {
    if (genBarbersLoading) return;
    setGenBarbersLoading(true);
    setErrorMsg('');
    setStatusMsg('Generating 200 fake barbers…');
    try {
      const barbers: FakeBarber[] = generateFakeBarbers(200);
      const ops: Array<(batch: ReturnType<typeof writeBatch>) => void> = [];

      barbers.forEach((b) => {
        const barberId = b.userId;

        // users/{barberId}
        ops.push((batch) =>
          batch.set(doc(db, 'users', barberId), {
            uid: barberId,
            firstName: b.firstName,
            lastName: b.lastName,
            photoUrl: b.photoUrl,
            role: 'barber',
            isFake: true,
            city: b.city,
            country: b.country,
            createdAt: b.createdAt,
            isOnboarded: true,
          })
        );

        // barberProfiles/{barberId}
        ops.push((batch) =>
          batch.set(doc(db, 'barberProfiles', barberId), {
            userId: barberId,
            firstName: b.firstName,
            lastName: b.lastName,
            photoUrl: b.photoUrl,
            profilePhotoUrl: b.profilePhotoUrl,
            bio: b.bio,
            isLive: true,
            isSolo: true,
            isOnboarded: true,
            approvalStatus: 'approved',
            isFake: true,
            isVisible: true,
            city: b.city,
            country: b.country,
            rating: b.rating,
            reviewCount: b.reviewCount,
            totalReviews: b.reviewCount,
            totalCuts: b.totalCuts,
            experienceStartYear: b.experienceStartYear,
            languages: b.languages,
            specialties: b.specialties,
            currency: b.currency,
            lastActive: b.lastActive,
            location: b.location,
            createdAt: b.createdAt,
          })
        );

        // services/{barberId}_{i}
        b.services.forEach((s, i) => {
          const serviceId = `${barberId}_${i}`;
          ops.push((batch) =>
            batch.set(doc(db, 'services', serviceId), {
              id: serviceId,
              name: s.name,
              price: s.price,
              durationMinutes: s.duration,
              isActive: true,
              providerId: barberId,
              providerType: 'barber',
              isFake: true,
            })
          );
        });

        // schedules/{barberId}_shard_0
        ops.push((batch) =>
          batch.set(doc(db, 'schedules', `${barberId}_shard_0`), {
            weeklyHours: {
              days: b.weeklyHours.days,
              opensAt: b.weeklyHours.opensAt,
              closesAt: b.weeklyHours.closesAt,
            },
            availableSlots: {},
            isFake: true,
          })
        );

        // reviews/{barberId}_review_{i}
        b.reviews.forEach((r, i) => {
          const reviewId = `${barberId}_review_${i}`;
          ops.push((batch) =>
            batch.set(doc(db, 'reviews', reviewId), {
              clientId: 'fake',
              providerId: barberId,
              rating: r.rating,
              comment: r.comment,
              clientName: r.clientName,
              createdAt: r.createdAt,
              isFake: true,
            })
          );
        });
      });

      await commitInChunks(ops);
      setStatusMsg(`Generated ${barbers.length} fake barbers (${ops.length} writes).`);
      await refreshCounts();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to generate barbers. Check console.');
    } finally {
      setGenBarbersLoading(false);
    }
  };

  // ── Generate shops ────────────────────────────────────────────────────────
  const handleGenerateShops = async () => {
    if (genShopsLoading) return;
    setGenShopsLoading(true);
    setErrorMsg('');
    setStatusMsg('Generating 100 fake shops…');
    try {
      const shops: FakeShop[] = generateFakeShops(100);
      const ops: Array<(batch: ReturnType<typeof writeBatch>) => void> = [];

      shops.forEach((s) => {
        ops.push((batch) =>
          batch.set(doc(db, 'barbershops', s.shopId), {
            name: s.name,
            description: s.description,
            status: s.status,
            isFake: true,
            isVisible: true,
            city: s.city,
            country: s.country,
            address: s.address,
            logoUrl: s.logoUrl,
            coverPhotoUrl: s.coverPhotoUrl,
            rating: s.rating,
            reviewCount: s.reviewCount,
            chairsCount: s.chairsCount,
            establishedYear: s.establishedYear,
            isFeatured: false,
            barbers: [],
            createdAt: s.createdAt,
            location: s.location,
          })
        );
      });

      await commitInChunks(ops);
      setStatusMsg(`Generated ${shops.length} fake shops.`);
      await refreshCounts();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to generate shops. Check console.');
    } finally {
      setGenShopsLoading(false);
    }
  };

  // ── Delete all fake barbers (+ services, schedules, reviews, users) ──────
  const handleDeleteBarbers = async () => {
    if (delBarbersLoading) return;
    if (!confirm('Delete ALL fake barbers (profiles, users, services, schedules, reviews)? This cannot be undone.')) return;
    setDelBarbersLoading(true);
    setErrorMsg('');
    setStatusMsg('Deleting fake barbers…');
    try {
      const profilesSnap = await getDocs(
        query(collection(db, 'barberProfiles'), where('isFake', '==', true))
      );
      const ids = profilesSnap.docs.map((d) => d.id);

      const ops: Array<(batch: ReturnType<typeof writeBatch>) => void> = [];
      ids.forEach((id) => {
        ops.push((batch) => batch.delete(doc(db, 'barberProfiles', id)));
        ops.push((batch) => batch.delete(doc(db, 'users', id)));
        ops.push((batch) => batch.delete(doc(db, 'schedules', `${id}_shard_0`)));
      });
      await commitInChunks(ops);

      const svcCount = await deleteDocsWhere('services', 'isFake', true);
      const revCount = await deleteDocsWhere('reviews', 'isFake', true);

      setStatusMsg(`Deleted ${ids.length} barbers, ${svcCount} services, ${revCount} reviews.`);
      await refreshCounts();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete fake barbers. Check console.');
    } finally {
      setDelBarbersLoading(false);
    }
  };

  // ── Delete all fake shops ────────────────────────────────────────────────
  const handleDeleteShops = async () => {
    if (delShopsLoading) return;
    if (!confirm('Delete ALL fake shops? This cannot be undone.')) return;
    setDelShopsLoading(true);
    setErrorMsg('');
    setStatusMsg('Deleting fake shops…');
    try {
      const count = await deleteDocsWhere('barbershops', 'isFake', true);
      setStatusMsg(`Deleted ${count} fake shops.`);
      await refreshCounts();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to delete fake shops. Check console.');
    } finally {
      setDelShopsLoading(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────

  const greenBtn = (disabled: boolean): React.CSSProperties => ({
    background: disabled ? '#1a2a1a' : '#0f2010',
    color: disabled ? '#555' : '#22C55E',
    border: '1px solid #22C55E40',
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 12,
    fontWeight: 800,
    cursor: disabled ? 'wait' : 'pointer',
    fontFamily: 'Nunito, sans-serif',
    transition: 'opacity 0.15s',
    opacity: disabled ? 0.6 : 1,
  });

  const redBtn = (disabled: boolean): React.CSSProperties => ({
    background: disabled ? '#1a0808' : '#1a0808',
    color: disabled ? '#555' : '#EF4444',
    border: '1px solid #EF444440',
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 12,
    fontWeight: 800,
    cursor: disabled ? 'wait' : 'pointer',
    fontFamily: 'Nunito, sans-serif',
    transition: 'opacity 0.15s',
    opacity: disabled ? 0.6 : 1,
  });

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>
          Fake Data Pool
        </h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
          Manage fake barbers and shops used to populate the platform.
        </p>
      </div>

      {(statusMsg || errorMsg) && (
        <div
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 700,
            background: errorMsg ? '#1a0808' : '#0a1f0a',
            color: errorMsg ? '#EF4444' : '#22C55E',
            border: `1px solid ${errorMsg ? '#EF444440' : '#22C55E40'}`,
          }}
        >
          {errorMsg || statusMsg}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        {/* CARD 1 — Fake Barbers */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
          <div style={{ fontSize: 20, marginBottom: 8 }}>✂️</div>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>
            Fake Barbers
          </h2>
          <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
            {barberCount === null
              ? 'Loading…'
              : `${barberCount.toLocaleString()} fake barbers currently visible`}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            <button
              onClick={handleGenerateBarbers}
              disabled={genBarbersLoading || delBarbersLoading}
              style={greenBtn(genBarbersLoading || delBarbersLoading)}
            >
              {genBarbersLoading ? 'Generating…' : 'Generate 200 Fake Barbers'}
            </button>
            <button
              onClick={handleDeleteBarbers}
              disabled={genBarbersLoading || delBarbersLoading}
              style={redBtn(genBarbersLoading || delBarbersLoading)}
            >
              {delBarbersLoading ? 'Deleting…' : 'Delete All Fake Barbers'}
            </button>
          </div>

          {(genBarbersLoading || delBarbersLoading) && (
            <div style={{ marginTop: 12, fontSize: 11, color: '#555' }}>
              Writing to Firestore… do not close this tab.
            </div>
          )}
        </div>

        {/* CARD 2 — Fake Shops */}
        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
          <div style={{ fontSize: 20, marginBottom: 8 }}>🏪</div>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', margin: 0 }}>
            Fake Shops
          </h2>
          <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
            {shopCount === null
              ? 'Loading…'
              : `${shopCount.toLocaleString()} fake shops currently visible`}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            <button
              onClick={handleGenerateShops}
              disabled={genShopsLoading || delShopsLoading}
              style={greenBtn(genShopsLoading || delShopsLoading)}
            >
              {genShopsLoading ? 'Generating…' : 'Generate 100 Fake Shops'}
            </button>
            <button
              onClick={handleDeleteShops}
              disabled={genShopsLoading || delShopsLoading}
              style={redBtn(genShopsLoading || delShopsLoading)}
            >
              {delShopsLoading ? 'Deleting…' : 'Delete All Fake Shops'}
            </button>
          </div>

          {(genShopsLoading || delShopsLoading) && (
            <div style={{ marginTop: 12, fontSize: 11, color: '#555' }}>
              Writing to Firestore… do not close this tab.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
