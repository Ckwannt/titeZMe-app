'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, query, where, getDocs, doc, getDoc, runTransaction, setDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AvailabilityGrid } from '@/components/AvailabilityGrid';
import { BarberProfileSkeleton } from '@/components/skeletons';
import { toast } from 'react-hot-toast';

import { useRouter } from 'next/navigation';

export default function BookingPage({ params }: { params: Promise<{ barberId: string }> }) {
  const resolvedParams = use(params);
  const barberId = resolvedParams.barberId;
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<any>(null);

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [bookingContext, setBookingContext] = useState<'solo'|'shop'>('solo');
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Available slots logic
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    const initData = async () => {
      try {
        const pSnap = await getDoc(doc(db, 'barberProfiles', barberId));
        if (pSnap.exists()) {
          const pData = pSnap.data();
          const uSnap = await getDoc(doc(db, 'users', barberId));
          setProfile({ id: pSnap.id, ...pData, user: uSnap.exists() ? uSnap.data() : null });
          
          if (pData.isSolo && pData.shopId) {
             // Let user choose context
             setStep(1);
          } else {
             // Skip to step 2
             setBookingContext(pData.shopId && !pData.isSolo ? 'shop' : 'solo');
             setStep(2);
          }
        }
        


      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    initData();
  }, [barberId, user, router]);

  useEffect(() => {
    // Fetch services when context is known
    if ((step >= 2) && profile) {
      const fetchServices = async () => {
         const providerId = bookingContext === 'shop' && profile.shopId ? profile.shopId : barberId;
         const pType = bookingContext === 'shop' ? 'shop' : 'barber';
         
         const qSvc = query(collection(db, 'services'), where('providerId', '==', providerId), where('providerType', '==', pType));
         const snap = await getDocs(qSvc);
         const fetchedServices = snap.docs.map(d => ({id: d.id, ...d.data()}));
         
         const titzCut = {
           id: 'titezme-cut',
           name: 'titeZMe Cut',
           description: 'The barber chooses the cut for you based on your vibe and your budget.',
           duration: profile?.titeZMeCut?.durationMinutes || 45,
           price: profile?.titeZMeCut?.price || 20,
           isTitz: true
         };
         
         setServices([titzCut, ...fetchedServices]);
      }
      fetchServices();
    }
  }, [step, bookingContext, profile, barberId]);

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
    setIsSubmitting(true);
    
    try {
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
        t.set(bookingRef, {
          clientId: user.uid,
          barberId: barberId,
          shopId: profile.shopId || null,
          bookingContext,
          serviceIds: selectedServices.map(s => s.id),
          serviceNames: selectedServices.map(s => s.name),
          totalDuration,
          date: selectedDate,
          startTime: selectedTime,
          endTime: new Date(reqEnd).toLocaleTimeString('en-US', {hour12:false, hour:'2-digit', minute:'2-digit'}),
          status: 'pending',
          paymentMethod: 'cash',
          price: totalPrice,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      });

      // After transaction success
      // Notify barber
      await addDoc(collection(db, 'notifications'), {
        userId: barberId,
        message: `New booking request for ${selectedDate} at ${selectedTime}.`,
        read: false,
        linkTo: '/dashboard/barber',
        createdAt: Date.now()
      });
      
      // Notify client
      await addDoc(collection(db, 'notifications'), {
        userId: user.uid,
        message: `Your booking for ${selectedDate} at ${selectedTime} is pending confirmation.`,
        read: false,
        linkTo: '/dashboard/client',
        createdAt: Date.now()
      });

      router.push('/dashboard/client');

    } catch (e: any) {
      console.error(e);
      if (e.message === "OVERLAP") {
         toast.error("Oh no! This slot was just taken. Please choose another time.");
         setSelectedTime('');
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
             {services.map((svc) => {
               const isSelected = selectedServices.some(s => s.id === svc.id);
               return (
                 <label key={svc.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-brand-yellow bg-[#1a1500]' : 'border-[#2a2a2a] bg-[#141414] hover:border-[#444]'} ${svc.isTitz ? '!border-l-4 !border-l-brand-yellow' : ''}`}>
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
         <div className="animate-fadeUp w-full col-span-1 md:col-span-12 lg:col-span-12 xl:col-span-12">
           <h1 className="text-3xl font-black mb-6">Choose Date & Time</h1>
           
           <AvailabilityGrid 
             mode="client" 
             barberId={barberId} 
             totalDuration={totalDuration} 
             onSlotSelect={(date, time) => {
               setSelectedDate(date);
               setSelectedTime(time);
             }}
             selectedDate={selectedDate}
             selectedTime={selectedTime}
           />

           <div className="flex justify-between mt-10">
             <button onClick={() => setStep(2)} className="text-[#888] font-bold text-sm hover:text-white">← Back</button>
             <button 
               onClick={() => setStep(4)}
               disabled={!selectedDate || !selectedTime}
               className="bg-brand-yellow text-[#0a0a0a] px-8 py-3.5 rounded-full font-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
             >
               Review Booking →
             </button>
           </div>
         </div>
       )}

       {step === 4 && (
         <div className="animate-fadeUp">
            <h1 className="text-3xl font-black mb-6">Confirm Booking</h1>
            
            <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 mb-8">
               <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#2a2a2a]">
                 <div className="w-12 h-12 rounded-xl bg-[#2a2a2a] flex items-center justify-center text-xl">✂️</div>
                 <div>
                   <div className="font-black text-lg text-white mb-0.5">{profile?.user?.firstName} {profile?.user?.lastName}</div>
                   <div className="text-xs font-bold text-brand-text-secondary">{bookingContext === 'solo' ? 'Independent Barber' : 'Shop Booking'}</div>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-6">
                 <div>
                   <div className="text-[10px] font-extrabold text-[#666] tracking-widest uppercase mb-1">Date</div>
                   <div className="font-bold text-[15px]">{new Date(selectedDate).toLocaleDateString()}</div>
                 </div>
                 <div>
                   <div className="text-[10px] font-extrabold text-[#666] tracking-widest uppercase mb-1">Time</div>
                   <div className="font-bold text-[15px]">{selectedTime}</div>
                 </div>
                 <div className="col-span-2">
                   <div className="text-[10px] font-extrabold text-[#666] tracking-widest uppercase mb-1">Services</div>
                   <div className="font-bold text-[15px]">{selectedServices.map(s => s.name).join(', ')}</div>
                 </div>
               </div>

               <div className="bg-[#141414] rounded-xl p-4 flex justify-between items-center border border-[#222]">
                  <div>
                    <div className="text-[10px] font-extrabold text-[#666] tracking-widest uppercase mb-0.5">Total to pay in cash</div>
                    <div className="text-2xl font-black text-brand-yellow">€{totalPrice}</div>
                  </div>
                  <div className="text-right text-xs font-extrabold text-brand-text-secondary">
                    {totalDuration} mins total
                  </div>
               </div>
            </div>

            <button 
               onClick={handleConfirm}
               disabled={isSubmitting}
               className="w-full bg-brand-yellow text-[#0a0a0a] py-4 rounded-full font-black text-[15px] transition-all hover:opacity-90 disabled:opacity-50"
             >
               {isSubmitting ? "Confirming..." : "Confirm Booking"}
             </button>
             <button disabled={isSubmitting} onClick={() => setStep(3)} className="w-full mt-4 text-[#888] font-bold text-sm hover:text-white">← Change Time</button>
         </div>
       )}

    </div>
  );
}
