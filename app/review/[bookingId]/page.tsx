'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from '@/lib/toast';
import { notificationSchema } from "@/lib/schemas";
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
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

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
           const canReview = bData.status === 'completed' || bData.status === 'confirmed';
           if (bData.clientId !== user.uid || !canReview) {
              toast.error("You can only review your own bookings.");
              router.push('/dashboard/client');
              return;
           }

           // Check if review already exists — show message instead of redirecting
           const qR = query(collection(db, 'reviews'), where('bookingId', '==', bookingId));
           const rSnap = await getDocs(qR);
           if (!rSnap.empty) {
              setAlreadyReviewed(true);
              setLoading(false);
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
      // 1. Build clientName
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      const clientName = userData
        ? `${userData.firstName || ''} ${(userData.lastName || '').charAt(0)}.`.trim()
        : (booking.clientName || 'A client');

      // 2. Create Review
      await addDoc(collection(db, 'reviews'), {
        bookingId,
        barberId: booking.barberId,
        shopId: booking.shopId || null,
        providerId: booking.bookingContext === 'shop' && booking.shopId ? booking.shopId : booking.barberId,
        providerType: booking.bookingContext === 'shop' ? 'shop' : 'barber',
        clientId: user.uid,
        clientName,
        rating,
        comment: sanitizeText(comment, 1000),
        createdAt: Date.now(),
      });

      // 3. Recalculate barber rating from all reviews
      const reviewsSnap = await getDocs(
        query(collection(db, 'reviews'), where('providerId', '==', booking.barberId))
      );
      const ratings = reviewsSnap.docs.map(d => d.data().rating as number);
      const newCount = ratings.length;
      const newRating = Number((ratings.reduce((a, b) => a + b, 0) / newCount).toFixed(1));
      await updateDoc(doc(db, 'barberProfiles', booking.barberId), {
        rating: newRating,
        reviewCount: newCount,
      });

      // 4. Mark booking as reviewed so the dashboard shows "Reviewed ✓"
      await updateDoc(doc(db, 'bookings', bookingId), { hasReview: true });

      // 5. Notify Barber
      await addDoc(collection(db, 'notifications'), notificationSchema.parse({
        userId: booking.barberId,
        message: `⭐ ${clientName} left you a ${rating}-star review!`,
        read: false,
        linkTo: '/dashboard/barber',
        createdAt: Date.now(),
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

  if (alreadyReviewed) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⭐</div>
        <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>Already reviewed</div>
        <div style={{ fontSize: '12px', color: '#555', marginBottom: '20px' }}>You already left a review for this booking.</div>
        <a href="/dashboard/client" style={{ color: '#F5C518', fontSize: '13px', fontWeight: 800, textDecoration: 'none' }}>← Back to dashboard</a>
      </div>
    </div>
  );

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
