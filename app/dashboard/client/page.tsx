'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { query, where, orderBy, doc, getDoc, updateDoc, onSnapshot, collection, addDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import { toast } from '@/lib/toast';
import Link from 'next/link';
import { userUpdateSchema, bookingUpdateSchema } from "@/lib/schemas";
import { cleanupBookingLock } from '@/lib/booking-lock-utils';
import Image from 'next/image';

export default function ClientDashboard() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("Bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && (!user || appUser?.role !== 'client')) {
      router.replace('/login');
    }
  }, [user, appUser, loading, router]);

  // Real-time bookings listener — updates immediately when booking is created,
  // accepted, cancelled, or completed without any page refresh needed.
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'bookings'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      async (snap) => {
        const enriched = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const b = { id: docSnap.id, ...docSnap.data() } as any;
            // Enrich with barber name if not already stored
            if (b.barberId && !b.barberName) {
              try {
                const bProfile = await getDoc(doc(db, 'users', b.barberId));
                if (bProfile.exists()) {
                  const u = bProfile.data();
                  b.barberName = `${u.firstName || ''} ${u.lastName || ''}`.trim();
                }
              } catch { /* non-critical */ }
            }
            // Handle old (serviceId) and new (serviceNames) structures
            if (b.serviceNames && Array.isArray(b.serviceNames)) {
              b.serviceName = b.serviceNames.join(', ');
            } else if (b.serviceId && !b.serviceName) {
              try {
                const svc = await getDoc(doc(db, 'services', b.serviceId));
                if (svc.exists()) b.serviceName = svc.data().name;
              } catch { /* non-critical */ }
            }
            return b;
          })
        );
        setBookings(enriched);
        setFetching(false);
        autoConfirmCuts(enriched).catch(e => console.error('autoConfirmCuts:', e));
      },
      (err) => {
        console.error('Client bookings listener error:', err);
        setFetching(false);
      }
    );

    return () => unsub();
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const autoConfirmCuts = async (bList: any[]) => {
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    const unconfirmed = bList.filter(
      b => b.status === 'completed' && b.cutConfirmed === false && b.completedAt && b.completedAt < twoHoursAgo
    );
    for (const booking of unconfirmed) {
      await updateDoc(doc(db, 'bookings', booking.id), { cutConfirmed: true });
      await updateDoc(doc(db, 'barberProfiles', booking.barberId), { totalCuts: increment(1) });
    }
  };

  const cancelBooking = async (bId: string, dateStr: string, timeStr: string) => {
    // Check if more than 2 hours
    const bDate = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    if ((bDate.getTime() - now.getTime()) < 2 * 60 * 60 * 1000) {
      toast.error("Cannot cancel within 2 hours of appointment time.");
      return;
    }
    const loadingToast = toast.loading("Cancelling appointment...");
    try {
      const timeNow = Date.now();
      const bookingDoc = bookings.find(b => b.id === bId);
      await updateDoc(doc(db, 'bookings', bId), bookingUpdateSchema.parse({ status: 'cancelled_by_client', updatedAt: timeNow }));
      // Clean up the booking lock so the slot becomes bookable again
      if (bookingDoc) {
        await cleanupBookingLock({
          barberId: bookingDoc.barberId,
          date: bookingDoc.date,
          startTime: bookingDoc.startTime,
          endTime: bookingDoc.endTime,
          id: bId,
        });
      }
      // onSnapshot listener above will auto-refresh the bookings list
      toast.success("Appointment cancelled.", { id: loadingToast });
    } catch(e) {
      console.error(e);
      toast.error("Failed to cancel.", { id: loadingToast });
    }
  }

  if (fetching || loading) return <div className="p-10 text-center animate-pulse text-brand-text-secondary">Loading...</div>;

  const now = new Date();
  const upcomingBookings = bookings.filter(b => {
    if (b.status === 'cancelled' || b.status === 'cancelled_by_client') return false;
    const bd = new Date(`${b.date}T${b.startTime}`);
    return bd >= now;
  }).reverse(); // we want soonest first
  
  const pastBookings = bookings.filter(b => {
    if (b.status === 'cancelled' || b.status === 'cancelled_by_client') return true;
    const bd = new Date(`${b.date}T${b.startTime}`);
    return bd < now;
  });

  return (
    <div className="flex min-h-[calc(100vh-53px)] flex-col md:flex-row">
      <div className="w-full md:w-[220px] md:border-r border-brand-border p-6 shrink-0 flex flex-col">
        <div className="flex items-center gap-3 mb-7 px-2">
          {appUser?.photoUrl ? (
            <Image 
              src={appUser.photoUrl} 
              alt="Profile" 
              width={40} 
              height={40} 
              className="w-10 h-10 rounded-xl object-cover" 
              style={{ objectFit: 'contain' }} 
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#111] flex items-center justify-center font-black text-base text-white">
              {appUser?.firstName?.[0] || "C"}
            </div>
          )}
          <div>
            <div className="font-extrabold text-sm">{appUser?.firstName} {appUser?.lastName?.charAt(0)}.</div>
            <div className="text-[11px] text-brand-text-secondary font-bold">Client</div>
          </div>
        </div>
        
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <button 
            onClick={() => setActiveTab("Bookings")}
            className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 bg-[#1a1a1a] text-brand-yellow`}
          >
            <span>📅</span> My Bookings
          </button>
          <button 
            onClick={() => router.push('/dashboard/client/settings')}
            className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 text-[#888] hover:bg-[#1a1a1a] hover:text-white`}
          >
            <span>⚙️</span> Settings
          </button>
        </div>

        <div className="mt-auto hidden md:block">
          <DeleteAccountButton role="client" />
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 md:px-10 overflow-y-auto max-h-[calc(100vh-53px)]">
        {activeTab === "Bookings" && (
           <div className="animate-fadeUp max-w-[700px]">
             {bookings.filter(b => b.status === 'completed' && b.cutConfirmed === false).length > 0 && (
               <div className="mb-8">
                 <h2 className="text-2xl font-black mb-4">Confirm your cuts</h2>
                 {bookings
                   .filter(b => b.status === 'completed' && b.cutConfirmed === false)
                   .map(booking => (
                     <div key={booking.id} style={{ background: '#111', border: '1px solid #F5C51833', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                       <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>✂️ Did you get your cut?</div>
                       <div style={{ fontSize: '12px', color: '#666', marginBottom: '14px' }}>
                         {booking.barberName} · {booking.date} at {booking.startTime}
                       </div>
                       <div style={{ display: 'flex', gap: '8px' }}>
                         <button
                           onClick={async () => {
                             try {
                               await updateDoc(doc(db, 'bookings', booking.id), { cutConfirmed: true });
                               await updateDoc(doc(db, 'barberProfiles', booking.barberId), { totalCuts: increment(1) });
                               await addDoc(collection(db, 'notifications'), {
                                 userId: user!.uid,
                                 type: 'review_prompt',
                                 message: `How was your cut with ${booking.barberName}? Leave a review!`,
                                 bookingId: booking.id,
                                 barberId: booking.barberId,
                                 read: false,
                                 linkTo: `/review/${booking.id}`,
                                 createdAt: Date.now(),
                               });
                               toast.success('Thanks for confirming! ✓');
                             } catch (e: any) { toast.error(e.message); }
                           }}
                           style={{ flex: 1, background: '#0f2010', color: '#22C55E', border: '1px solid #22C55E44', borderRadius: '99px', padding: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
                         >
                           ✓ Yes I got my cut
                         </button>
                         <button
                           onClick={async () => {
                             try {
                               await updateDoc(doc(db, 'bookings', booking.id), { cutConfirmed: false, status: 'disputed' });
                               toast.success('Got it. Thanks for letting us know.');
                             } catch (e: any) { toast.error(e.message); }
                           }}
                           style={{ flex: 1, background: 'transparent', color: '#EF4444', border: '1px solid #EF444433', borderRadius: '99px', padding: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
                         >
                           ✗ No I didn&apos;t go
                         </button>
                       </div>
                     </div>
                   ))}
               </div>
             )}
             <h2 className="text-2xl font-black mb-6">Upcoming Appointments</h2>
             <div className="flex flex-col gap-3.5 mb-10">
               {upcomingBookings.length === 0 ? (
                 <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 text-center text-sm font-bold text-brand-text-secondary">
                   No upcoming bookings. <Link href="/barbers" className="text-brand-yellow font-bold no-underline">Find a barber</Link> · <Link href="/shops" className="text-brand-yellow font-bold no-underline">Find a barbershop</Link>
                 </div>
               ) : (
                 upcomingBookings.map(b => (
                   <div key={b.id} className="bg-brand-surface border border-brand-border rounded-2xl p-5 border-l-[4px] border-l-brand-yellow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                           <div className="font-black text-lg text-brand-yellow mb-1">{new Date(b.date).toLocaleDateString()} at {b.startTime}</div>
                           <div className="text-sm font-extrabold text-white">{b.barberName}</div>
                           <div className="text-xs text-brand-text-secondary font-bold">{b.serviceName}</div>
                        </div>
                        <div className="font-black text-white bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#2a2a2a]">
                           €{b.price}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#2a2a2a]">
                        <span className="text-[11px] font-extrabold text-[#555] uppercase tracking-wide">Status: {b.status}</span>
                        {b.status === 'completed' && (
                          b.hasReview
                            ? <span className="text-[11px] font-black text-[#22C55E]">✓ Reviewed</span>
                            : <button onClick={() => router.push(`/review/${b.id}`)} className="text-[11px] font-black text-brand-yellow border border-brand-yellow hover:bg-[#1a1500] px-3 py-1.5 rounded-lg transition-colors">Leave Review</button>
                        )}
                        {b.status === 'pending' || b.status === 'confirmed' ? (
                          <button onClick={() => cancelBooking(b.id, b.date, b.startTime)} className="text-[11px] font-black text-brand-red hover:bg-[#1a0808] px-3 py-1.5 rounded-lg transition-colors">Cancel Booking</button>
                        ) : null}
                      </div>
                   </div>
                 ))
               )}
             </div>

             <h2 className="text-2xl font-black mb-6">Past & Cancelled</h2>
             <div className="flex flex-col gap-3.5 opacity-70">
               {pastBookings.length === 0 ? (
                 <div className="text-sm font-bold text-[#555]">No past history.</div>
               ) : (
                 pastBookings.map(b => (
                   <div key={b.id} className="bg-transparent border border-[#2a2a2a] rounded-2xl p-4 flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-brand-text-secondary mb-0.5">{b.date} • {b.startTime}</div>
                        <div className="text-sm font-extrabold text-white">{b.barberName} - {b.serviceName}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-white text-sm mb-0.5">€{b.price}</div>
                        <div className="text-[10px] font-black uppercase text-[#666] mb-1">{b.status}</div>
                        {b.status === 'completed' && (
                          b.hasReview
                            ? <span className="text-[10px] font-extrabold text-[#22C55E]">✓ Reviewed</span>
                            : <button onClick={() => router.push(`/review/${b.id}`)} className="text-[10px] font-extrabold text-brand-yellow hover:underline">Review</button>
                        )}
                      </div>
                   </div>
                 ))
               )}
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
