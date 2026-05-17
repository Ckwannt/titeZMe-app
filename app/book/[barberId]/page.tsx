'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, query, where, getDocs, doc, getDoc, runTransaction, setDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarberProfileSkeleton } from '@/components/skeletons';
import { SmartTimePicker } from '@/components/SmartTimePicker';
import { toast } from '@/lib/toast';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { notificationSchema } from "@/lib/schemas";

// ── Helpers ──────────────────────────────────────────────────────────────────

function calcEndTime(startTime: string, durationMins: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const total = h * 60 + m + durationMins;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function formatFullDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, mo, d] = dateStr.split('-').map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function BookingPage({ params }: { params: Promise<{ barberId: string }> }) {
  const resolvedParams = use(params);
  const barberId = resolvedParams.barberId;
  const { user, appUser } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [bookingContext, setBookingContext] = useState<'solo'|'shop'>('solo');
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ['bookProfile', barberId],
    queryFn: async () => {
      const pSnap = await getDoc(doc(db, 'barberProfiles', barberId));
      if (!pSnap.exists()) return null;
      const pData = pSnap.data() as any;
      const uSnap = await getDoc(doc(db, 'users', barberId));
      return { id: pSnap.id, ...pData, user: uSnap.exists() ? uSnap.data() : null };
    },
    enabled: !!user
  });

  useEffect(() => {
    if (profile && step === 1) {
      if (!(profile.isSolo && profile.shopId)) {
        setBookingContext(profile.shopId && !profile.isSolo ? 'shop' : 'solo');
        setStep(2);
      }
    }
  }, [profile, step]);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ['bookServices', barberId, bookingContext, profile?.shopId],
    queryFn: async () => {
      if (!profile) return [];
      const providerId = bookingContext === 'shop' && profile.shopId ? profile.shopId : barberId;
      const pType = bookingContext === 'shop' ? 'shop' : 'barber';
      
      const qSvc = query(collection(db, 'services'), where('providerId', '==', providerId), where('providerType', '==', pType));
      const snap = await getDocs(qSvc);
      const fetchedServices = snap.docs.map(d => ({id: d.id, ...d.data()} as any));
      
      const titzCut = {
        id: 'titezme-cut',
        name: 'titeZMe Cut',
        description: 'The barber chooses the cut for you based on your vibe and your budget.',
        duration: profile?.titeZMeCut?.durationMinutes || 45,
        price: profile?.titeZMeCut?.price || 20,
        isTitz: true
      };
      
      return [titzCut, ...fetchedServices];
    },
    enabled: !!profile && step >= 2
  });

  const loading = loadingProfile || (step >= 2 && loadingServices);

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);



  const toggleService = (svc: any) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.id === svc.id);
      if (isSelected) return prev.filter(s => s.id !== svc.id);
      return [...prev, svc];
    });
  }

  const handleConfirm = async () => {
    if (!user || !selectedDate || !selectedTime || selectedServices.length === 0) return;
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // ── Rate limiting: max 5 bookings per hour ──────────────────────────────
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const recentBookingsQuery = query(
        collection(db, 'bookings'),
        where('clientId', '==', user.uid),
        where('createdAt', '>', oneHourAgo)
      );
      const recentBookings = await getDocs(recentBookingsQuery);
      if (recentBookings.size >= 5) {
        toast.error('Too many booking attempts. Please wait before trying again.');
        setIsSubmitting(false);
        return;
      }

      // ── Offline check ────────────────────────────────────────────────────────
      if (!navigator.onLine) {
        toast.error('No internet connection. Please reconnect before booking.');
        setIsSubmitting(false);
        return;
      }

      // ── Duplicate booking check ──────────────────────────────────────────────
      const existingQuery = query(
        collection(db, 'bookings'),
        where('clientId', '==', user.uid),
        where('barberId', '==', barberId),
        where('date', '==', selectedDate),
        where('startTime', '==', selectedTime),
        where('status', 'in', ['pending', 'confirmed'])
      );
      const existing = await getDocs(existingQuery);
      if (!existing.empty) {
        toast.error('You already have a booking at this time with this barber.');
        setIsSubmitting(false);
        return;
      }

      const lockDocRef = doc(db, 'bookingLocks', `${barberId}_${selectedDate}`);
      const newBookingId = doc(collection(db, 'bookings')).id; 

      await runTransaction(db, async (t) => {
        const lockDoc = await t.get(lockDocRef);
        const bookedSlots = lockDoc.exists() ? lockDoc.data().slots || [] : [];
        
        const reqStart = new Date(`${selectedDate}T${selectedTime}`).getTime();
        const reqEnd = reqStart + (totalDuration * 60 * 1000);

        // Double Booking check against the lock document
        let overlap = false;
        for (const slot of bookedSlots) {
          if (Math.max(reqStart, slot.start) < Math.min(reqEnd, slot.end)) {
             overlap = true;
             break;
          }
        }

        if (overlap) {
           throw new Error("OVERLAP");
        }

        // It's free! Add to lock document
        t.set(lockDocRef, {
           slots: [...bookedSlots, { start: reqStart, end: reqEnd, bookingId: newBookingId }]
        }, { merge: true });

        // Create the booking document
        const bookingRef = doc(db, 'bookings', newBookingId);
        const clientFirst = appUser?.firstName || '';
        const clientLast = appUser?.lastName || '';
        const clientName = clientLast
          ? `${clientFirst} ${clientLast.charAt(0)}.`
          : clientFirst || 'Client';
        t.set(bookingRef, {
          clientId: user.uid,
          clientName,
          barberId: barberId,
          barberName: `${profile?.user?.firstName || ''} ${profile?.user?.lastName || ''}`.trim() || null,
          shopId: profile.shopId || null,
          bookingContext,
          serviceIds: selectedServices.map(s => s.id),
          serviceNames: selectedServices.map(s => s.name),
          totalDuration,
          date: selectedDate,
          startTime: selectedTime,
          endTime: selectedEndTime || new Date(reqEnd).toLocaleTimeString('en-US', {hour12:false, hour:'2-digit', minute:'2-digit'}),
          status: 'pending',
          paymentMethod: 'cash',
          price: totalPrice,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      });

      // After transaction success
      // Notify barber
      await addDoc(collection(db, 'notifications'), notificationSchema.parse({
              userId: barberId,
              message: `New booking request for ${selectedDate} at ${selectedTime}.`,
              read: false,
              linkTo: '/dashboard/barber',
              createdAt: Date.now()
            }));
      
      // Notify client
      await addDoc(collection(db, 'notifications'), notificationSchema.parse({
              userId: user.uid,
              message: `Your booking for ${selectedDate} at ${selectedTime} is pending confirmation.`,
              read: false,
              linkTo: '/dashboard/client',
              createdAt: Date.now()
            }));

      router.push('/dashboard/client');

    } catch (e: any) {
      console.error(e);
      if (e.message === "OVERLAP") {
         toast.error("Oh no! This slot was just taken. Please choose another time.");
         setSelectedTime('');
         setSelectedEndTime('');
         setStep(3); // Go back to slots
      } else {
         toast.error("Failed to book constraint check. " + e.message);
      }
    }
    setIsSubmitting(false);
  }

  if (loading) return <BarberProfileSkeleton />;

  return (
    <div className="max-w-[600px] mx-auto px-6 py-10 md:py-16">
       
       <div className="flex gap-2 mb-8">
         {[1,2,3,4].map((i) => (
           <div key={i} className={`h-2 flex-1 rounded-full bg-[#1a1a1a] overflow-hidden`}>
             <div className={`h-full bg-brand-yellow transition-all duration-300 ${i <= step ? 'w-full' : 'w-0'}`} />
           </div>
         ))}
       </div>

       {step === 1 && (
         <div className="animate-fadeUp">
           <h1 className="text-3xl font-black mb-6">How do you want to book?</h1>
           <div className="flex flex-col gap-4">
             <button onClick={() => {setBookingContext('solo'); setStep(2)}} className="bg-brand-surface border border-brand-border hover:border-brand-yellow p-6 rounded-2xl text-left transition-all group">
               <div className="font-black text-xl mb-1 group-hover:text-brand-yellow transition-colors">Book {profile?.user?.firstName} Directly</div>
               <div className="text-brand-text-secondary text-sm font-bold">Independent booking. Cash only.</div>
             </button>
             <button onClick={() => {setBookingContext('shop'); setStep(2)}} className="bg-brand-surface border border-brand-border hover:border-brand-yellow p-6 rounded-2xl text-left transition-all group">
               <div className="font-black text-xl mb-1 group-hover:text-brand-yellow transition-colors">Book via Shop</div>
               <div className="text-brand-text-secondary text-sm font-bold">Standard shop booking and pricing.</div>
             </button>
           </div>
         </div>
       )}

       {step === 2 && (
         <div className="animate-fadeUp">
           <h1 className="text-3xl font-black mb-2">Select Services</h1>
           <p className="text-brand-text-secondary text-sm mb-6 font-bold">{bookingContext === 'solo' ? `${profile?.user?.firstName}'s direct services` : 'Shop services'}</p>
           
           <div className="flex flex-col gap-3 mb-8">
             {services.map((svc: any) => {
               const isSelected = selectedServices.some(s => s.id === svc.id);
               return (
                 <label key={svc.id} onClick={() => toggleService(svc)} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-brand-yellow bg-[#1a1500]' : 'border-[#2a2a2a] bg-[#141414] hover:border-[#444]'} ${svc.isTitz ? '!border-l-4 !border-l-brand-yellow' : ''}`}>
                    <div className="flex items-center gap-4">
                       <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-brand-yellow bg-brand-yellow' : 'border-[#444]'}`}>
                         {isSelected && <span className="text-[#0a0a0a] text-xs font-black">✓</span>}
                       </div>
                       <div>
                         <div className={`font-black flex items-center gap-1.5 ${isSelected ? 'text-brand-yellow' : 'text-white'}`}>{svc.isTitz && <span>⚡</span>} {svc.name}</div>
                         <div className="text-xs text-brand-text-secondary font-bold">{svc.duration} mins</div>
                         {svc.description && <div className="text-[11px] text-[#888] mt-1 pr-2 max-w-[240px] leading-tight">{svc.description}</div>}
                       </div>
                    </div>
                    <div className="font-black text-lg self-center">€{svc.price}</div>
                 </label>
               )
             })}
           </div>
           
           <div className="flex justify-between items-center border-t border-[#2a2a2a] pt-6">
             <div>
               <div className="text-[11px] font-extrabold text-brand-text-secondary tracking-widest uppercase mb-1">Total</div>
               <div className="text-2xl font-black text-white">€{totalPrice} <span className="text-sm text-[#666] font-extrabold">/ {totalDuration} min</span></div>
             </div>
             <button 
               onClick={() => setStep(3)}
               disabled={selectedServices.length === 0}
               className="bg-brand-yellow text-[#0a0a0a] px-8 py-3.5 rounded-full font-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
             >
               Next →
             </button>
           </div>
         </div>
       )}

       {step === 3 && (
         <div className="animate-fadeUp w-full">
           <h1 className="text-3xl font-black mb-2">Choose Date &amp; Time</h1>
           <p className="text-brand-text-secondary text-sm font-bold mb-6">
             {totalDuration} min · {profile?.user?.firstName}
           </p>

           <SmartTimePicker
             barberId={barberId}
             totalDuration={totalDuration}
             selectedDate={selectedDate}
             selectedTime={selectedTime}
             onSelect={(date, time, endTime) => {
               setSelectedDate(date);
               setSelectedTime(time);
               setSelectedEndTime(endTime);
             }}
           />

           {/* Selected slot confirmation banner */}
           {selectedDate && selectedTime && (
             <div
               className="mt-5 flex items-center gap-3 bg-[#1a0a00] border border-[#E8491D]/40 rounded-xl px-4 py-3"
             >
               <span style={{ color: '#E8491D', fontSize: 16 }}>✓</span>
               <span style={{ fontSize: 13, fontWeight: 700, color: '#E8491D' }}>
                 {selectedDate} · {selectedTime} → {selectedEndTime || calcEndTime(selectedTime, totalDuration)}
               </span>
               <button
                 onClick={() => { setSelectedDate(''); setSelectedTime(''); setSelectedEndTime(''); }}
                 style={{ marginLeft: 'auto', fontSize: 11, color: '#555', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
               >
                 Clear ✕
               </button>
             </div>
           )}

           <div className="flex justify-between mt-8">
             <button onClick={() => setStep(2)} className="text-[#888] font-bold text-sm hover:text-white transition-colors">
               ← Back
             </button>
             <button
               onClick={() => setStep(4)}
               disabled={!selectedDate || !selectedTime}
               className="bg-brand-yellow text-[#0a0a0a] px-8 py-3.5 rounded-full font-black text-sm transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Review Booking →
             </button>
           </div>
         </div>
       )}

       {step === 4 && (
         <div className="animate-fadeUp">
           <h1 className="text-3xl font-black mb-8">Review your booking</h1>

           <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden mb-6">

             {/* Section 1 — Barber */}
             <div className="flex items-center gap-4 p-5 border-b border-[#1e1e1e]">
               <div className="w-11 h-11 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-xl shrink-0">✂️</div>
               <div>
                 <div className="font-black text-white text-[15px]">{profile?.user?.firstName} {profile?.user?.lastName}</div>
                 <div className="text-xs font-bold text-[#555] mt-0.5">{bookingContext === 'solo' ? '👤 Independent booking' : '🏪 Shop booking'}</div>
               </div>
             </div>

             {/* Section 2 — Services */}
             <div className="p-5 border-b border-[#1e1e1e]">
               <div className="text-[10px] font-extrabold text-[#555] tracking-widest uppercase mb-3">Services</div>
               <div className="flex flex-col gap-2">
                 {selectedServices.map(s => (
                   <div key={s.id} className="flex items-center justify-between">
                     <div>
                       <div className="text-sm font-bold text-white">{s.name}</div>
                       <div className="text-[11px] text-[#555]">⏱ {s.duration} min</div>
                     </div>
                     <div className="font-black text-[#F5C518] text-sm">€{s.price}</div>
                   </div>
                 ))}
               </div>
               {selectedServices.length > 1 && (
                 <div className="mt-3 pt-3 border-t border-[#1e1e1e] flex justify-between items-center">
                   <span className="text-xs font-bold text-[#555]">{totalDuration} min total</span>
                   <span className="font-black text-white">€{totalPrice}</span>
                 </div>
               )}
             </div>

             {/* Section 3 — Date & Time */}
             <div className="p-5 border-b border-[#1e1e1e]">
               <div className="text-[10px] font-extrabold text-[#555] tracking-widest uppercase mb-3">Date &amp; Time</div>
               <div className="flex items-center gap-2 mb-1.5">
                 <span style={{ fontSize: 15 }}>📅</span>
                 <span className="font-bold text-white text-sm">{formatFullDate(selectedDate)}</span>
               </div>
               <div className="flex items-center gap-2">
                 <span style={{ fontSize: 15 }}>⏰</span>
                 <span className="font-bold text-white text-sm">
                   {selectedTime} → {calcEndTime(selectedTime, totalDuration)}
                 </span>
                 <span className="text-[11px] text-[#555]">({totalDuration} min)</span>
               </div>
             </div>

             {/* Section 4 — Payment */}
             <div className="p-5">
               <div className="text-[10px] font-extrabold text-[#555] tracking-widest uppercase mb-3">Payment</div>
               <div className="flex items-start gap-3">
                 <span style={{ fontSize: 15 }}>💵</span>
                 <div>
                   <div className="font-black text-[#F5C518] text-lg">€{totalPrice}</div>
                   <div className="text-xs font-bold text-[#555] mt-0.5">Cash only · No fees · No app needed</div>
                   <div className="text-xs text-[#444] mt-0.5">Pay directly to the barber</div>
                 </div>
               </div>
             </div>
           </div>

           <button
             onClick={handleConfirm}
             disabled={isSubmitting}
             className="w-full bg-brand-yellow text-[#0a0a0a] py-4 rounded-full font-black text-[15px] transition-all hover:opacity-90 disabled:opacity-50"
           >
             {isSubmitting ? 'Confirming…' : 'Confirm Booking →'}
           </button>
           <button
             disabled={isSubmitting}
             onClick={() => setStep(3)}
             className="w-full mt-4 text-[#888] font-bold text-sm hover:text-white transition-colors"
           >
             ← Change time
           </button>
         </div>
       )}

    </div>
  );
}
