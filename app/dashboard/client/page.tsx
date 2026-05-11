'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import { BookingRowSkeleton } from '@/components/skeletons';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { collection } from 'firebase/firestore';
import { userUpdateSchema, bookingUpdateSchema } from "@/lib/schemas";
import Image from 'next/image';

export default function ClientDashboard() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("Bookings");

  useEffect(() => {
    if (!loading && (!user || appUser?.role !== 'client')) {
      router.replace('/login');
    }
  }, [user, appUser, loading, router]);

  const fetchClientData = async () => {
    // Bookings
    const bq = query(collection(db, 'bookings'), where('clientId', '==', user!.uid));
    const bs = await getDocs(bq);
    const bResults = [];
    for (const docSnap of bs.docs) {
      const bData = { id: docSnap.id, ...docSnap.data() } as any;
      // get barber details
      const bProfile = await getDoc(doc(db, 'users', bData.barberId));
      if (bProfile.exists()) {
         bData.barberName = `${bProfile.data().firstName} ${bProfile.data().lastName}`;
      }
      // handle old and new service structures
      if (bData.serviceNames && Array.isArray(bData.serviceNames)) {
         bData.serviceName = bData.serviceNames.join(', ');
      } else if (bData.serviceId) {
         const bSvc = await getDoc(doc(db, 'services', bData.serviceId));
         if (bSvc.exists()) {
            bData.serviceName = bSvc.data().name;
         }
      }
      bResults.push(bData);
    }
    bResults.sort((a,b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime());

    return { bookings: bResults };
  };

  const queryClient = useQueryClient();
  const { data, isLoading: fetching } = useQuery({
    queryKey: ['clientData', user?.uid],
    queryFn: fetchClientData,
    enabled: !!user && appUser?.role === 'client'
  });
  const bookings = data?.bookings || [];

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
      await updateDoc(doc(db, 'bookings', bId), bookingUpdateSchema.parse({ status: 'cancelled_by_client', updatedAt: timeNow }));
      queryClient.invalidateQueries({ queryKey: ['clientData', user?.uid] });
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
             <h2 className="text-2xl font-black mb-6">Upcoming Appointments</h2>
             <div className="flex flex-col gap-3.5 mb-10">
               {upcomingBookings.length === 0 ? (
                 <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 text-center text-sm font-bold text-brand-text-secondary">
                   No upcoming bookings. <Link href="/" className="text-brand-yellow underline">Find a barber</Link>
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
                           <button onClick={() => router.push(`/review/${b.id}`)} className="text-[11px] font-black text-brand-yellow border border-brand-yellow hover:bg-[#1a1500] px-3 py-1.5 rounded-lg transition-colors">Leave Review</button>
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
                           <button onClick={() => router.push(`/review/${b.id}`)} className="text-[10px] font-extrabold text-brand-yellow hover:underline">Review</button>
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
