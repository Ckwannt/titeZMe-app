'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, onSnapshot, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

export function BarberInvitesTab() {
  const { user } = useAuth();
  const [invites, setInvites] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = useState<any>(null); // holds invite object if modal is open

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'invites'), 
      where('barberId', '==', user.uid)
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const invitesData = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      invitesData.sort((a: any, b: any) => b.createdAt - a.createdAt);
      setInvites(invitesData);
    });

    return () => unsub();
  }, [user]);

    const [showSoloModal, setShowSoloModal] = useState<any>(null); // holds invite object if solo modal is open

  const processAccept = async (invite: any) => {
    if (!user) return;
    setActionLoading(invite.id);
    try {
      const batch = writeBatch(db);
      const currentTime = new Date().getTime();

      // Update invite
      batch.update(doc(db, 'invites', invite.id), {
        status: 'accepted',
        respondedAt: currentTime
      });

      // Update barber profile (isSolo stays true by default)
      batch.update(doc(db, 'barberProfiles', user.uid), {
        shopId: invite.shopId,
      });

      // Notify shop owner
      const notifRef = doc(collection(db, 'notifications'));
      batch.set(notifRef, {
        userId: invite.shopId,
        message: `Your invite was accepted! A barber has joined ${invite.shopName}.`,
        read: false,
        createdAt: currentTime
      });

      await batch.commit();
      setShowWarningModal(null);
      // Immediately ask if they want to keep solo bookings
      setShowSoloModal(invite);
    } catch (e) {
      console.error("Failed to accept", e);
    }
    setActionLoading(null);
  };

  const handleKeepSolo = async (keep: boolean) => {
    if (!user || !showSoloModal) return;
    setActionLoading(showSoloModal.id);
    try {
      if (!keep) {
        // Toggle isSolo to false
        const batch = writeBatch(db);
        batch.update(doc(db, 'barberProfiles', user.uid), {
          isSolo: false
        });
        await batch.commit();
      }
      setShowSoloModal(null);
    } catch (e) {
      console.error("Failed to update solo preference", e);
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
      const currentTime = new Date().getTime();

      batch.update(doc(db, 'invites', invite.id), {
        status: 'declined',
        respondedAt: currentTime
      });

      const notifRef = doc(collection(db, 'notifications'));
      batch.set(notifRef, {
        userId: invite.shopId,
        message: `Your invite was declined.`,
        read: false,
        createdAt: currentTime
      });

      await batch.commit();
    } catch (e) {
      console.error("Failed to decline", e);
    }
    setActionLoading(null);
  };

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-black mb-6">Invites 📨</h1>

      {invites.length === 0 ? (
         <div className="bg-brand-surface border border-brand-border rounded-3xl p-8 text-center text-[#888]">
           No invites yet. Share your Barber Code with shops!
         </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {invites.map(inv => (
            <div key={inv.id} className="bg-brand-surface border border-brand-border rounded-3xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <div className="font-black text-lg">{inv.shopName}</div>
                <div className="text-xs text-[#888] mt-1">Sent: {new Date(inv.createdAt).toLocaleDateString()}</div>
                <div className="mt-2">
                  <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md uppercase ${
                    inv.status === 'pending' ? 'text-brand-yellow bg-brand-yellow/10' :
                    inv.status === 'accepted' ? 'text-brand-green bg-brand-green/10' :
                    'text-brand-red bg-brand-red/10'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
              
              {inv.status === 'pending' && (
                <div className="flex gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => handleDecline(inv)}
                    disabled={actionLoading === inv.id}
                    className="flex-1 md:flex-none bg-[#1a0808] border border-[#3b1a1a] text-brand-red px-5 py-2.5 rounded-xl font-bold hover:bg-brand-red/20 disabled:opacity-50"
                  >
                    Decline
                  </button>
                  <button 
                    onClick={() => handleAccept(inv)}
                    disabled={actionLoading === inv.id}
                    className="flex-1 md:flex-none bg-brand-green text-black px-5 py-2.5 rounded-xl font-bold hover:bg-green-500 disabled:opacity-50"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 max-w-sm w-full relative">
            <h2 className="text-xl font-black text-white mb-2">Change Shop?</h2>
            <p className="text-[#888] text-sm mb-6 leading-relaxed">
              You are currently linked to another shop. Accepting this will remove you from that shop. Your existing bookings will not be affected. Continue?
            </p>
            <div className="flex gap-3">
              <button 
                disabled={actionLoading === showWarningModal.id}
                onClick={() => setShowWarningModal(null)}
                className="flex-1 bg-[#2a2a2a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={actionLoading === showWarningModal.id}
                onClick={() => processAccept(showWarningModal)}
                className="flex-[1.5] bg-brand-green text-black py-3 rounded-xl font-bold text-sm hover:bg-green-500 transition-colors disabled:opacity-50"
              >
                {actionLoading === showWarningModal.id ? 'Accepting...' : 'Yes, link new shop'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSoloModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-6 max-w-sm w-full relative">
            <h2 className="text-xl font-black text-white mb-2">Solo Bookings</h2>
            <p className="text-[#888] text-sm mb-6 leading-relaxed">
              You joined {showSoloModal.shopName}. Do you still want to accept solo bookings outside the shop?
            </p>
            <div className="flex flex-col gap-3">
              <button 
                disabled={actionLoading === showSoloModal.id}
                onClick={() => handleKeepSolo(true)}
                className="w-full bg-brand-yellow text-black py-3 rounded-xl font-bold text-sm hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
                Yes, keep solo bookings
              </button>
              <button 
                disabled={actionLoading === showSoloModal.id}
                onClick={() => handleKeepSolo(false)}
                className="w-full bg-[#2a2a2a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                No, shop bookings only
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
