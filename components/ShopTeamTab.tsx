'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, setDoc, doc, addDoc, onSnapshot, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { inviteUpdateSchema, notificationSchema, inviteSchema } from "@/lib/schemas";
import { toast } from '@/lib/toast';
import Image from 'next/image';
import Link from 'next/link';
import { getLocalDateString } from '@/lib/schedule-utils';

export function ShopTeamTab() {
  const { user, appUser } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [foundBarber, setFoundBarber] = useState<any>(null);
  const [searchAttempts, setSearchAttempts] = useState(0);
  const [searchBlockedUntil, setSearchBlockedUntil] = useState<number | null>(null);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [activeBarbers, setActiveBarbers] = useState<any[]>([]);
  const [barberUsers, setBarberUsers] = useState<Record<string, any>>({});
  const [barberSchedules, setBarberSchedules] = useState<Record<string, any>>({});
  const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  const todayDate = getLocalDateString();

  // ── Pending invites (real-time) ────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'invites'),
      where('shopId', '==', user.uid),
      where('status', '==', 'pending')
    );
    const unsub = onSnapshot(q, async (snap) => {
      const invitesData = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      const invitesWithNames = await Promise.all(invitesData.map(async (inv: any) => {
        const bSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', inv.barberId)));
        if (!bSnap.empty) {
          const u = bSnap.docs[0].data();
          return { ...inv, barberName: `${u.firstName} ${u.lastName}` };
        }
        return inv;
      }));
      invitesWithNames.sort((a: any, b: any) => b.createdAt - a.createdAt);
      setPendingInvites(invitesWithNames);
    });
    return () => unsub();
  }, [user]);

  // ── Active team (real-time) ────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'barberProfiles'), where('shopId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const barbers = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setActiveBarbers(barbers);
    });
    return () => unsub();
  }, [user]);

  // ── Fetch user data + schedules for each active barber ────────────────────
  useEffect(() => {
    if (activeBarbers.length === 0) return;
    const fetchBarberDetails = async () => {
      const usersMap: Record<string, any> = {};
      const schedulesMap: Record<string, any> = {};
      await Promise.all(activeBarbers.map(async (b: any) => {
        const barberId = b.userId || b.id;
        // User data
        const uSnap = await getDoc(doc(db, 'users', barberId));
        if (uSnap.exists()) usersMap[b.id] = uSnap.data();
        // Schedule
        const sSnap = await getDoc(doc(db, 'schedules', `${barberId}_shard_0`));
        if (sSnap.exists()) schedulesMap[b.id] = sSnap.data();
      }));
      setBarberUsers(usersMap);
      setBarberSchedules(schedulesMap);
    };
    fetchBarberDetails();
  }, [activeBarbers]);

  // ── Search barber by code ──────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!inviteCode) return;

    // Rate limit check
    if (searchBlockedUntil && Date.now() < searchBlockedUntil) {
      const secondsLeft = Math.ceil((searchBlockedUntil - Date.now()) / 1000);
      toast.error(`Too many searches. Wait ${secondsLeft} seconds.`);
      return;
    }

    // Input format validation
    const codePattern = /^TZB-[A-Z0-9]{6}$/;
    const normalised = inviteCode.trim().toUpperCase();
    if (!codePattern.test(normalised)) {
      setErrorMsg('Barber codes start with TZB- followed by 6 characters (e.g. TZB-ABC123)');
      return;
    }

    // Increment attempt counter
    const newAttempts = searchAttempts + 1;
    setSearchAttempts(newAttempts);
    if (newAttempts >= 10) {
      setSearchBlockedUntil(Date.now() + (5 * 60 * 1000));
      setSearchAttempts(0);
      toast.error('Too many search attempts. Blocked for 5 minutes.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setFoundBarber(null);

    const q = query(collection(db, 'barberProfiles'), where('barberCode', '==', normalised));
    const snap = await getDocs(q);

    if (snap.empty) {
      setErrorMsg('No barber found with this code. Check the code and try again.');
      setLoading(false);
      return;
    }

    const barberData = snap.docs[0].data();
    const barberId = snap.docs[0].id;
    const bUserSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', (barberData.userId || barberId))));
    const bUserData = !bUserSnap.empty ? bUserSnap.docs[0].data() : {};

    setFoundBarber({
      ...barberData,
      id: barberId,
      name: `${bUserData.firstName || ''} ${bUserData.lastName || ''}`.trim() || 'Unknown Barber',
      userId: barberData.userId || barberId,
    });
    setLoading(false);
  };

  // ── Send invite ────────────────────────────────────────────────────────────
  const handleInvite = async () => {
    if (!user || !appUser || !foundBarber) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const inviteQ = query(
        collection(db, 'invites'),
        where('shopId', '==', user.uid),
        where('barberId', '==', foundBarber.userId),
        where('status', '==', 'pending')
      );
      const inviteSnap = await getDocs(inviteQ);
      if (!inviteSnap.empty) {
        setErrorMsg('Invite already sent');
        setLoading(false);
        return;
      }
      if (foundBarber.shopId === user.uid) {
        setErrorMsg('This barber already works with you');
        setLoading(false);
        return;
      }

      const shopQ = await getDocs(query(collection(db, 'barbershops'), where('ownerId', '==', user.uid)));
      const shopName = shopQ.empty ? (appUser?.firstName ? `${appUser.firstName}'s Shop` : 'Unknown Shop') : shopQ.docs[0].data().name;

      const currentTime = Date.now();
      await addDoc(collection(db, 'invites'), inviteSchema.parse({
        shopId: user.uid,
        shopName,
        barberId: foundBarber.userId,
        status: 'pending',
        createdAt: currentTime,
      }));

      await addDoc(collection(db, 'notifications'), notificationSchema.parse({
        userId: foundBarber.userId,
        message: `${shopName} invited you to join their team! Check your invites.`,
        read: false,
        linkTo: '/dashboard/barber/invites',
        createdAt: currentTime,
      }));

      setFoundBarber(null);
      setInviteCode('');
      toast.success('Invite sent!');
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Failed to send invite.');
    }
    setLoading(false);
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await setDoc(doc(db, 'invites', inviteId), inviteUpdateSchema.parse({ status: 'cancelled', respondedAt: Date.now() }), { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  // ── Remove barber from shop ────────────────────────────────────────────────
  const handleRemove = async (barberId: string, barberName: string) => {
    if (!user) return;
    setRemoving(true);
    try {
      await updateDoc(doc(db, 'barberProfiles', barberId), {
        shopId: null,
        isSolo: true,
        ownsShop: false,
      });
      // Cancel any pending invites
      const invQ = query(collection(db, 'invites'), where('shopId', '==', user.uid), where('barberId', '==', barberId));
      const invSnap = await getDocs(invQ);
      await Promise.all(invSnap.docs.map(d => deleteDoc(doc(db, 'invites', d.id))));
      setRemoveConfirmId(null);
      toast.success(`${barberName} removed from team`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to remove barber.');
    }
    setRemoving(false);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const isWorkingToday = (barberId: string) => {
    const sched = barberSchedules[barberId];
    const slots: string[] = sched?.availableSlots?.[todayDate] ?? [];
    return slots.length > 0;
  };

  const getBarberName = (barber: any) => {
    const u = barberUsers[barber.id];
    if (u) return `${u.firstName || ''} ${u.lastName || ''}`.trim();
    return barber.name || 'Barber';
  };

  // ── Invite status label ────────────────────────────────────────────────────
  const getInviteStatus = () => {
    if (!foundBarber) return null;
    if (foundBarber.shopId === user?.uid) return 'already_here';
    if (foundBarber.shopId && foundBarber.shopId !== user?.uid) return 'in_other_shop';
    return 'available';
  };

  return (
    <div className="animate-fadeUp max-w-2xl">
      <h1 className="text-2xl font-black mb-6">Team 👥</h1>

      {/* ── INVITE A BARBER ─────────────────────────────────────────────── */}
      <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 mb-8">
        <h2 className="text-lg font-black mb-1">Invite a Barber</h2>
        <p className="text-xs text-[#888] mb-5">Enter the barber&apos;s titeZMe code to find and invite them.</p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="TZB-XXXXXX"
            value={inviteCode}
            onChange={(e) => { setInviteCode(e.target.value.toUpperCase()); setFoundBarber(null); setErrorMsg(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-mono uppercase text-sm outline-none focus:border-brand-yellow transition-colors"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !inviteCode}
            className="bg-brand-yellow text-black px-6 py-3 rounded-xl font-black text-sm hover:bg-yellow-400 disabled:opacity-50 transition-colors"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 text-brand-red text-sm font-bold bg-[#1a0808] border border-[#3b1a1a] rounded-xl p-3">
            {errorMsg}
          </div>
        )}

        {/* ── BARBER PREVIEW CARD ───────────────────────────────────────── */}
        {foundBarber && (() => {
          const status = getInviteStatus();
          return (
            <div className="mt-5 bg-[#141414] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-yellow flex items-center justify-center font-black text-lg text-black shrink-0">
                  {foundBarber.name?.[0] || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-base">{foundBarber.name}</div>
                  <div className="text-xs text-brand-yellow mt-0.5 font-bold">
                    ★ {foundBarber.rating?.toFixed(1) || '—'}{foundBarber.reviewCount > 0 ? ` · ${foundBarber.reviewCount} reviews` : ''}
                  </div>
                  {foundBarber.specialties?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(foundBarber.specialties as string[]).slice(0, 3).map((s: string) => (
                        <span key={s} className="text-[10px] font-bold bg-[#1a1a1a] text-[#888] px-2 py-0.5 rounded-md">{s}</span>
                      ))}
                    </div>
                  )}
                  {foundBarber.languages?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {(foundBarber.languages as string[]).map((l: string) => (
                        <span key={l} className="text-[10px] font-bold bg-[#1a1a1a] text-[#555] px-2 py-0.5 rounded-md">{l}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {status === 'already_here' && (
                <div className="text-sm font-bold text-brand-green mb-4">
                  ✓ {foundBarber.name} is already on your team.
                </div>
              )}
              {status === 'in_other_shop' && (
                <div className="text-sm font-bold text-brand-orange mb-4">
                  ⚠️ {foundBarber.name} is already in another shop. They must leave that shop first.
                </div>
              )}

              <div className="flex gap-3">
                {status === 'available' && (
                  <button
                    onClick={handleInvite}
                    disabled={loading}
                    className="bg-brand-yellow text-black px-6 py-2.5 rounded-xl font-black text-sm hover:bg-yellow-400 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Sending...' : 'Send Invite'}
                  </button>
                )}
                <button
                  onClick={() => { setFoundBarber(null); setInviteCode(''); }}
                  className="text-[#888] hover:text-white text-sm font-bold px-4 py-2.5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── PENDING INVITES ──────────────────────────────────────────────────── */}
      <h2 className="font-extrabold text-base mb-3">Pending Invites</h2>
      {pendingInvites.length === 0 ? (
        <div className="text-[#555] text-sm mb-8">No pending invites.</div>
      ) : (
        <div className="flex flex-col gap-3 mb-8">
          {pendingInvites.map(inv => (
            <div key={inv.id} className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-extrabold">{inv.barberName || 'Barber'}</div>
                <div className="text-xs text-[#888] mt-0.5">Sent {new Date(inv.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black tracking-wider text-brand-yellow bg-brand-yellow/10 px-2.5 py-1 rounded-md uppercase">
                  Pending
                </span>
                <button onClick={() => handleCancelInvite(inv.id)} className="text-xs font-bold text-[#888] hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ACTIVE TEAM ──────────────────────────────────────────────────────── */}
      <h2 className="font-extrabold text-base mb-3">Your Team ({activeBarbers.length} barbers)</h2>
      {activeBarbers.length === 0 ? (
        <div className="text-[#555] text-sm">No barbers yet. Invite your first barber above.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeBarbers.map((barber: any) => {
            const barberId = barber.id;
            const u = barberUsers[barberId];
            const name = u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : 'Barber';
            const photoUrl = u?.photoUrl || u?.profilePhotoUrl || '';
            const working = isWorkingToday(barberId);
            const isConfirming = removeConfirmId === barberId;

            return (
              <div key={barberId} className={`bg-brand-surface border rounded-2xl p-4 transition-all ${isConfirming ? 'border-brand-red/40' : 'border-brand-border'}`}>
                <div className="flex items-center gap-3.5">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] shrink-0 flex items-center justify-center">
                    {photoUrl ? (
                      <Image src={photoUrl} alt={name} width={44} height={44} className="object-cover w-full h-full" />
                    ) : (
                      <span className="font-black text-base text-white">{name[0] || '?'}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[15px]">{name}</span>
                      <span className={`text-[10px] font-bold ${working ? 'text-brand-green' : 'text-[#555]'}`}>
                        ● {working ? 'Working today' : 'Off today'}
                      </span>
                    </div>
                    {(barber.rating > 0 || barber.reviewCount > 0) && (
                      <div className="text-xs text-[#888] mt-0.5">
                        ★ {barber.rating?.toFixed(1) || '—'}{barber.reviewCount > 0 ? ` · ${barber.reviewCount} reviews` : ''}
                      </div>
                    )}
                    {barber.specialties?.length > 0 && (
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {(barber.specialties as string[]).slice(0, 2).map((s: string) => (
                          <span key={s} className="text-[10px] font-bold bg-[#1a1a1a] text-[#666] px-2 py-0.5 rounded-md">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Link href={`/barber/${barberId}`} className="text-[11px] font-bold text-brand-yellow hover:underline">
                      View profile →
                    </Link>
                    <button
                      onClick={() => setRemoveConfirmId(isConfirming ? null : barberId)}
                      className="text-[11px] font-bold text-brand-red hover:underline"
                    >
                      {isConfirming ? 'Keep' : 'Remove'}
                    </button>
                  </div>
                </div>

                {/* Confirm removal */}
                {isConfirming && (
                  <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
                    <p className="text-xs text-[#888] font-bold mb-3">
                      Remove <span className="text-white">{name}</span> from your team? They will return to solo mode. Their existing bookings will <span className="text-white">NOT</span> be cancelled.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRemove(barberId, name)}
                        disabled={removing}
                        className="bg-brand-red text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        {removing ? 'Removing...' : 'Yes, Remove'}
                      </button>
                      <button
                        onClick={() => setRemoveConfirmId(null)}
                        className="text-[#888] text-xs font-bold px-4 py-2 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
