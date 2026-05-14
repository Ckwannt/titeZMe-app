'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export function BarberInvitesTab() {
  const { user, appUser } = useAuth();
  const router = useRouter();
  const [invites, setInvites] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = useState<any>(null);
  const [showSoloModal, setShowSoloModal] = useState<any>(null);
  const [barberCode, setBarberCode] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  // Fetch barber profile for barberCode
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'barberProfiles', user.uid)).then(snap => {
      if (snap.exists()) setBarberCode(snap.data().barberCode || '');
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'invites'), where('barberId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      data.sort((a: any, b: any) => b.createdAt - a.createdAt);
      setInvites(data);
    });
    return () => unsub();
  }, [user]);

  const processAccept = async (invite: any) => {
    if (!user) return;
    setActionLoading(invite.id);
    try {
      const batch = writeBatch(db);
      const currentTime = Date.now();
      batch.update(doc(db, 'invites', invite.id), { status: 'accepted', respondedAt: currentTime });
      batch.update(doc(db, 'barberProfiles', user.uid), { shopId: invite.shopId });
      const notifRef = doc(collection(db, 'notifications'));
      batch.set(notifRef, {
        userId: invite.shopId,
        message: `Your invite was accepted! A barber has joined ${invite.shopName}.`,
        read: false,
        createdAt: currentTime,
      });
      await batch.commit();
      setShowWarningModal(null);
      setShowSoloModal(invite);
    } catch (e) {
      console.error('Failed to accept', e);
    }
    setActionLoading(null);
  };

  const handleKeepSolo = async (keep: boolean) => {
    if (!user || !showSoloModal) return;
    setActionLoading(showSoloModal.id);
    try {
      if (!keep) {
        const batch = writeBatch(db);
        batch.update(doc(db, 'barberProfiles', user.uid), { isSolo: false });
        await batch.commit();
      }
      setShowSoloModal(null);
    } catch (e) {
      console.error(e);
    }
    setActionLoading(null);
  };

  const handleAccept = async (invite: any) => {
    if (!user) return;
    const bSnap = await getDocs(query(collection(db, 'barberProfiles'), where('userId', '==', user.uid)));
    if (!bSnap.empty) {
      const bData = bSnap.docs[0].data();
      if (bData.shopId && bData.shopId !== invite.shopId) {
        setShowWarningModal(invite);
        return;
      }
    }
    await processAccept(invite);
  };

  const handleDecline = async (invite: any) => {
    if (!user) return;
    setActionLoading(invite.id);
    try {
      const batch = writeBatch(db);
      const currentTime = Date.now();
      batch.update(doc(db, 'invites', invite.id), { status: 'declined', respondedAt: currentTime });
      const notifRef = doc(collection(db, 'notifications'));
      batch.set(notifRef, { userId: invite.shopId, message: 'Your invite was declined.', read: false, createdAt: currentTime });
      await batch.commit();
    } catch (e) {
      console.error('Failed to decline', e);
    }
    setActionLoading(null);
  };

  const copyCode = () => {
    if (!barberCode) return;
    navigator.clipboard.writeText(barberCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const daysAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  // Change 2 — if barber owns a shop, show shop owner message
  if (appUser?.ownsShop) {
    return (
      <div className="animate-fadeUp flex flex-col items-center text-center py-16 max-w-md mx-auto">
        <div className="text-5xl mb-4">🏪</div>
        <h2 className="text-[16px] font-extrabold mb-3">You own a shop</h2>
        <p className="text-[13px] text-[#666] mb-8 leading-relaxed">
          Invites are for independent barbers looking to join a team. Since you own a shop, you can invite barbers to YOUR team instead.
        </p>
        <button
          onClick={() => router.push('/dashboard/shop')}
          className="bg-brand-yellow text-[#0a0a0a] font-black px-7 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
        >
          Manage my team →
        </button>
      </div>
    );
  }

  const pending = invites.filter(i => i.status === 'pending');
  const history = invites.filter(i => i.status === 'accepted' || i.status === 'declined');

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-black mb-6">Invites 📨</h1>

      {/* Change 2 — Barber code card */}
      {barberCode && (
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 mb-8">
          <div className="text-[10px] font-extrabold text-[#555] uppercase tracking-wider mb-2">Your barber code</div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[20px] font-black text-brand-yellow">{barberCode}</span>
            <button onClick={copyCode} className="text-xs text-[#888] hover:text-white transition-colors border border-[#2a2a2a] rounded-lg px-3 py-1.5 font-bold">
              {codeCopied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
          <p className="text-[11px] text-[#555]">Share this code with shops so they can invite you to their team.</p>
        </div>
      )}

      {/* Change 2 — Pending invites */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[13px] font-extrabold text-[#888] uppercase tracking-wider mb-4">Pending invites</h2>
          <div className="flex flex-col gap-3">
            {pending.map(inv => (
              <div key={inv.id} className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                  <div className="font-black text-lg">{inv.shopName}</div>
                  {(inv.shopCity || inv.shopCountry) && (
                    <div className="text-xs text-[#888] mt-0.5">📍 {[inv.shopCity, inv.shopCountry].filter(Boolean).join(', ')}</div>
                  )}
                  <div className="text-xs text-[#555] mt-1">Invited {daysAgo(inv.createdAt)}</div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleDecline(inv)}
                    disabled={actionLoading === inv.id}
                    className="flex-1 md:flex-none bg-[#1a0808] border border-[#3b1a1a] text-brand-red px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-red/20 disabled:opacity-50"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(inv)}
                    disabled={actionLoading === inv.id}
                    className="flex-1 md:flex-none bg-brand-green text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-500 disabled:opacity-50"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Change 2 — Invite history */}
      {history.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[13px] font-extrabold text-[#888] uppercase tracking-wider mb-4">Invite history</h2>
          <div className="flex flex-col gap-3">
            {history.map(inv => (
              <div key={inv.id} className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <div className="font-bold">{inv.shopName}</div>
                  <div className="text-xs text-[#555] mt-0.5">{inv.respondedAt ? new Date(inv.respondedAt).toLocaleDateString() : ''}</div>
                </div>
                <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md uppercase ${
                  inv.status === 'accepted' ? 'text-brand-green bg-brand-green/10' : 'text-brand-red bg-brand-red/10'
                }`}>
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {pending.length === 0 && history.length === 0 && (
        <div className="bg-brand-surface border border-brand-border rounded-3xl p-8 text-center text-[#888]">
          No invites yet. Share your Barber Code with shops!
        </div>
      )}

      {/* Modals — unchanged */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-black text-white mb-2">Change Shop?</h2>
            <p className="text-[#888] text-sm mb-6 leading-relaxed">
              You are currently linked to another shop. Accepting this will remove you from that shop. Your existing bookings will not be affected. Continue?
            </p>
            <div className="flex gap-3">
              <button disabled={actionLoading === showWarningModal.id} onClick={() => setShowWarningModal(null)} className="flex-1 bg-[#2a2a2a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#333] disabled:opacity-50">Cancel</button>
              <button disabled={actionLoading === showWarningModal.id} onClick={() => processAccept(showWarningModal)} className="flex-[1.5] bg-brand-green text-black py-3 rounded-xl font-bold text-sm hover:bg-green-500 disabled:opacity-50">
                {actionLoading === showWarningModal.id ? 'Accepting...' : 'Yes, link new shop'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSoloModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-black text-white mb-2">Solo Bookings</h2>
            <p className="text-[#888] text-sm mb-6 leading-relaxed">
              You joined {showSoloModal.shopName}. Do you still want to accept solo bookings outside the shop?
            </p>
            <div className="flex flex-col gap-3">
              <button disabled={actionLoading === showSoloModal.id} onClick={() => handleKeepSolo(true)} className="w-full bg-brand-yellow text-black py-3 rounded-xl font-bold text-sm hover:bg-yellow-500 disabled:opacity-50">Yes, keep solo bookings</button>
              <button disabled={actionLoading === showSoloModal.id} onClick={() => handleKeepSolo(false)} className="w-full bg-[#2a2a2a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#333] disabled:opacity-50">No, shop bookings only</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
