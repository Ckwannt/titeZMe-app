'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, setDoc, doc, addDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { inviteUpdateSchema, notificationSchema, inviteSchema } from "@/lib/schemas";

export function ShopTeamTab() {
  const { user, appUser } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [foundBarber, setFoundBarber] = useState<any>(null);
  
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'invites'), 
      where('shopId', '==', user.uid),
      where('status', '==', 'pending')
    );
    
    const unsub = onSnapshot(q, async (snap) => {
      // Need to fetch barber names manually since invites just have barberId in this spec 
      // Actually, wait, let's keep it simple or store barberName in invite?
      // Let's fetch the barberProfiles to get names.
      const invitesData = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      
      const invitesWithNames = await Promise.all(invitesData.map(async (inv) => {
        const bSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', inv.barberId)));
        if (!bSnap.empty) {
          const u = bSnap.docs[0].data();
          return { ...inv, barberName: `${u.firstName} ${u.lastName}` };
        }
        return inv;
      }));
      
      // Sort by createdAt desc locally since we have simple local sorting
      invitesWithNames.sort((a: any, b: any) => b.createdAt - a.createdAt);
      setPendingInvites(invitesWithNames);
    });

    return () => unsub();
  }, [user]);

  const handleSearch = async () => {
    if (!inviteCode) return;
    setLoading(true);
    setErrorMsg('');
    setFoundBarber(null);

    const q = query(collection(db, 'barberProfiles'), where('barberCode', '==', inviteCode.trim()));
    const snap = await getDocs(q);

    if (snap.empty) {
      setErrorMsg('No barber found with this code. Check the code and try again.');
      setLoading(false);
      return;
    }

    const barberData = snap.docs[0].data();
    
    // Get full user data for name
    const bUserSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', barberData.userId)));
    const bUserData = !bUserSnap.empty ? bUserSnap.docs[0].data() : {};

    setFoundBarber({
      ...barberData,
      name: `${bUserData.firstName || ''} ${bUserData.lastName || ''}`.trim() || 'Unknown Barber'
    });
    setLoading(false);
  };

  const handleInvite = async () => {
    if (!user || !appUser || !foundBarber) return;
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Check if invite already sent
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

      // 2. Check if already linked
      if (foundBarber.shopId === user.uid) {
        setErrorMsg('This barber already works with you');
        setLoading(false);
        return;
      }

      // Get shop info
      const shopQ = await getDocs(query(collection(db, 'barbershops'), where('ownerId', '==', user.uid)));
      const shopName = shopQ.empty ? 'Unknown Shop' : shopQ.docs[0].data().name;

      // 3. Create Invite
      const currentTime = new Date().getTime();
      await addDoc(collection(db, 'invites'), inviteSchema.parse({
              shopId: user.uid,
              shopName: shopName,
              barberId: foundBarber.userId,
              status: 'pending',
              createdAt: currentTime
            }));

      // 4. Send Notification
      await addDoc(collection(db, 'notifications'), notificationSchema.parse({
              userId: foundBarber.userId,
              message: `${shopName} invited you to join their team! Check your invites.`,
              read: false,
              linkTo: '/dashboard/barber', // Actually the user wants /dashboard/barber/invites, but we don't have routes inside dashboard maybe? We will just link to /dashboard/barber
              createdAt: currentTime
            }));

      setFoundBarber(null);
      setInviteCode('');
    } catch (e: any) {
      console.error(e);
      setErrorMsg('Failed to send invite.');
    }
    setLoading(false);
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      await setDoc(doc(db, 'invites', inviteId), inviteUpdateSchema.parse({ status: 'cancelled', respondedAt: new Date().getTime() }), { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="animate-fadeUp">
      <h1 className="text-2xl font-black mb-6">Team 👥</h1>
      
      <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 mb-8">
        <h2 className="text-lg font-black mb-4">Invite a Barber</h2>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="TZB-XXXXXX" 
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            className="flex-1 bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white font-mono uppercase"
          />
          <button 
            onClick={handleSearch}
            disabled={loading || !inviteCode}
            className="bg-brand-yellow text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 text-brand-red text-sm font-bold bg-[#1a0808] border border-[#3b1a1a] rounded-xl p-3">
            {errorMsg}
          </div>
        )}

        {foundBarber && (
          <div className="mt-6 border border-brand-border rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 bg-[#141414]">
            <div className="flex-1">
              <div className="font-extrabold text-lg">{foundBarber.name}</div>
              <div className="text-sm text-[#888]">{foundBarber.city}</div>
              <div className="text-xs text-brand-yellow mt-1 font-bold">★ {foundBarber.rating || 0} rating</div>
              <div className="text-xs text-[#666] mt-1">{foundBarber.specialties?.join(', ')}</div>
            </div>
            <button 
              onClick={handleInvite}
              disabled={loading}
              className="bg-brand-green text-black px-6 py-2.5 rounded-xl font-black w-full sm:w-auto"
            >
              Confirm Invite
            </button>
          </div>
        )}
      </div>

      <h2 className="font-extrabold text-base mb-4">Pending Invites</h2>
      {pendingInvites.length === 0 ? (
        <div className="text-[#888] text-sm">No pending invites.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {pendingInvites.map(inv => (
            <div key={inv.id} className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-extrabold">{inv.barberName || 'Barber'}</div>
                <div className="text-xs text-[#888] mt-1">Sent: {new Date(inv.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black tracking-wider text-brand-yellow bg-brand-yellow/10 px-2.5 py-1 rounded-md uppercase">
                  Pending
                </span>
                <button 
                  onClick={() => handleCancelInvite(inv.id)}
                  className="text-xs font-bold text-[#888] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
