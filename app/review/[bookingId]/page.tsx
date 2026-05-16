'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';
import { notificationSchema, barberUpdateSchema } from "@/lib/schemas";
import { sanitizeText } from '@/lib/sanitize';

export default function ReviewPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.bookingId;
  const { user } = useAuth();
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
      return;
    }

    const initData = async () => {
      try {
        const bSnap = await getDoc(doc(db, 'bookings', bookingId));
        if (bSnap.exists()) {
           const bData = bSnap.data();
           if (bData.clientId !== user.uid || bData.status !== 'completed') {
              toast.error("You can only review completed bookings of your own.");
              router.push('/dashboard/client');
              return;
           }
           
           // Check if review exists
           const qR = query(collection(db, 'reviews'), where('bookingId', '==', bookingId));
           const rSnap = await getDocs(qR);
           if (!rSnap.empty) {
              toast.error("You have already reviewed this booking.");
              router.push('/dashboard/client');
              return;
           }

           const barberSnap = await getDoc(doc(db, 'users', bData.barberId));
           setBooking({ ...bData, barberName: barberSnap.exists() ? barberSnap.data().firstName : 'Barber' });
        } else {
           router.push('/dashboard/client');
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    initData();
  }, [bookingId, user, router]);

  const handleSubmit = async () => {
    if (!user || rating === 0) return;
    setIsSubmitting(true);
    try {
      // 1. Create Review
      const newReviewRef = doc(collection(db, 'reviews'));
      await setDoc(newReviewRef, {
         bookingId,
         providerId: booking.bookingContext === 'shop' && booking.shopId ? booking.shopId : booking.barberId,
         providerType: booking.bookingContext === 'shop' ? 'shop' : 'barber',
         clientId: user.uid,
         rating,
         comment: sanitizeText(comment, 1000),
         createdAt: Date.now()
      });

      // 2. Update BarberProfile (Note: The Rules allow rating/reviewCount updates)
      const pRef = doc(db, 'barberProfiles', booking.barberId);
      const pSnap = await getDoc(pRef);
      if (pSnap.exists()) {
         const pData = pSnap.data();
         const currentRating = pData.rating || 0;
         const currentCount = pData.totalReviews || pData.reviewCount || 0;
         const newCount = currentCount + 1;
         const newRating = ((currentRating * currentCount) + rating) / newCount;
         
         const updateData: any = {
           rating: newRating,
           reviewCount: increment(1)
         };
         
         await updateDoc(pRef, updateData);
      }

      // 3. Mark booking as reviewed so the dashboard shows "Reviewed ✓"
      await updateDoc(doc(db, 'bookings', bookingId), { hasReview: true });

      // 4. Notify Barber
      await addDoc(collection(db, 'notifications'), notificationSchema.parse({
              userId: booking.barberId,
              message: `⭐ ${booking.clientName || 'A client'} left you a ${rating}-star review!`,
              read: false,
              linkTo: `/barber/${booking.barberId}`,
              createdAt: Date.now()
            }));

      toast.success('Review submitted ✓');
      router.push('/dashboard/client');

    } catch (e: any) {
      console.error(e);
      toast.error("Failed to complete review. " + e.message);
    }
    setIsSubmitting(false);
  }

  if (loading) return <div className="p-20 text-center text-brand-text-secondary animate-pulse">Loading...</div>;
  if (!booking) return null;

  return (
    <div className="max-w-[500px] mx-auto px-6 py-10 md:py-20 flex flex-col items-center animate-fadeUp">
       
       <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border-[#2a2a2a] border flex items-center justify-center text-3xl mb-6">⭐</div>
       <h1 className="text-3xl font-black mb-2 text-center">Rate your cut</h1>
       <p className="text-brand-text-secondary text-sm font-bold mb-10 text-center">
         How was your experience with {booking.barberName}?
       </p>

       <div className="flex gap-2 mb-10">
         {[1,2,3,4,5].map(star => (
            <button 
              key={star} 
              onClick={() => setRating(star)}
              className={`text-5xl transition-all ${star <= rating ? 'text-brand-yellow scale-110 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'text-[#2a2a2a] hover:text-[#444]'}`}
            >
              ★
            </button>
         ))}
       </div>

       <div className="w-full mb-8">
         <label className="text-[11px] font-extrabold text-brand-text-secondary tracking-widest uppercase block mb-3 text-left">Leave a comment (Optional)</label>
         <textarea 
           value={comment}
           onChange={e => setComment(e.target.value)}
           placeholder="Fresh fade, great conversation..."
           className="w-full h-[120px] bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl p-4 text-white text-[14px] font-bold outline-none transition-colors focus:border-brand-yellow resize-none"
         />
       </div>

       <button 
         onClick={handleSubmit}
         disabled={rating === 0 || isSubmitting}
         className="w-full bg-brand-yellow text-[#0a0a0a] py-4 rounded-full font-black text-[15px] transition-all hover:opacity-90 disabled:opacity-50"
       >
         {isSubmitting ? "Submitting..." : "Submit Review"}
       </button>
       <button onClick={() => router.push('/dashboard/client')} className="mt-5 text-[#888] font-bold text-sm hover:text-white transition-colors">Skip for now</button>
    </div>
  );
}
