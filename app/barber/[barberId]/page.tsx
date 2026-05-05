'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, onSnapshot, updateDoc, arrayUnion, arrayRemove, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BarberProfileSkeleton } from '@/components/skeletons';
import { userUpdateSchema } from "@/lib/schemas";
import { AvailabilityGrid } from '@/components/AvailabilityGrid';
import toast from 'react-hot-toast';

export default function BarberProfilePage({ params }: { params: Promise<{ barberId: string }> }) {
  const resolvedParams = use(params);
  const barberId = resolvedParams.barberId;
  const { user, appUser } = useAuth();
  const router = useRouter();

  // state
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [barberServices, setBarberServices] = useState<any[]>([]);
  const [shopData, setShopData] = useState<any>(null);
  const [shopServices, setShopServices] = useState<any[]>([]);
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [lastReview, setLastReview] = useState<any>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [activeTab, setActiveTab] = useState<'Services' | 'Reviews' | 'Availability'>('Services');
  const [bookingContext, setBookingContext] = useState<'solo' | 'shop'>('solo');

  // Load static stuff once
  useEffect(() => {
    const fetchStatic = async () => {
      try {
        const uSnap = await getDoc(doc(db, 'users', barberId));
        if (uSnap.exists()) setUserDoc(uSnap.data());
        
        const rQ = query(collection(db, 'reviews'), where('providerId', '==', barberId), orderBy('createdAt', 'desc'), limit(10));
        const rSnap = await getDocs(rQ);
        fetchReviewsData(rSnap);
      } catch(e) { console.error(e); }
    };
    fetchStatic();
  }, [barberId]);

  const fetchReviewsData = async (rSnap: any) => {
    const fetchedReviews = [];
    for(const rDoc of rSnap.docs) {
      const rev = { id: rDoc.id, ...rDoc.data() } as any;
      const rUser = await getDoc(doc(db, 'users', rev.clientId || rev.userId));
      if(rUser.exists()) rev.user = rUser.data();
      fetchedReviews.push(rev);
    }
    setReviews(prev => {
      // Prevent duplicates
      const newMap = new Map(prev.map(r => [r.id, r]));
      fetchedReviews.forEach(r => newMap.set(r.id, r));
      return Array.from(newMap.values());
    });
    if (rSnap.docs.length > 0) setLastReview(rSnap.docs[rSnap.docs.length - 1]);
  };

  const loadMoreReviews = async () => {
    if (!lastReview) return;
    setLoadingReviews(true);
    const rQ = query(collection(db, 'reviews'), where('providerId', '==', barberId), orderBy('createdAt', 'desc'), startAfter(lastReview), limit(10));
    const rSnap = await getDocs(rQ);
    await fetchReviewsData(rSnap);
    setLoadingReviews(false);
  };

  // Subscriptions
  useEffect(() => {
    const unsubProfile = onSnapshot(doc(db, 'barberProfiles', barberId), async (docSnap) => {
      if (docSnap.exists()) {
        const pData = docSnap.data();
        setProfile({ id: docSnap.id, ...pData });
        
        if (pData.shopId && !shopData) {
          const sSnap = await getDoc(doc(db, 'barbershops', pData.shopId));
          if (sSnap.exists()) setShopData(sSnap.data());

          const ssQ = query(collection(db, 'services'), where('providerId', '==', pData.shopId), where('providerType', '==', 'shop'), where('isActive', '==', true));
          const ssSnap = await getDocs(ssQ);
          setShopServices(ssSnap.docs.map(d=>({id:d.id, ...d.data()})));
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    const unsubSchedule = onSnapshot(doc(db, 'schedules', `${barberId}_shard_0`), (docSnap) => {
      if (docSnap.exists()) setSchedule(docSnap.data());
    });

    const svQ = query(collection(db, 'services'), where('providerId', '==', barberId), where('providerType', '==', 'barber'), where('isActive', '==', true));
    const unsubServices = onSnapshot(svQ, (snap) => {
      setBarberServices(snap.docs.map(d => ({id: d.id, ...d.data()})));
    });

    return () => { unsubProfile(); unsubSchedule(); unsubServices(); };
  }, [barberId, shopData]);

  if (loading) return <BarberProfileSkeleton />;

  if (!profile && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fadeUp">
        <h1 className="text-3xl font-black mb-4 text-center">Barber Not Found</h1>
        <Link href="/" className="px-6 py-3 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] font-bold rounded-xl transition-colors">Back to Home</Link>
      </div>
    );
  }

  if (profile.isLive === false || profile.isOnboarded === false) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fadeUp text-center">
         <div className="text-6xl mb-6">🔒</div>
         <h1 className="text-3xl font-black mb-4">This barber profile is not available</h1>
         <p className="text-[#888] font-medium mb-8 max-w-sm mx-auto leading-relaxed">They may have paused their bookings or are still setting up.</p>
         <button onClick={() => router.back()} className="px-8 py-3.5 bg-[#1a1a1a] text-white hover:bg-white hover:text-black font-extrabold rounded-[14px] transition-colors border border-[#333]">Go Back</button>
       </div>
    );
  }

  const isFav = appUser?.favoriteBarbers?.includes(barberId);
  const toggleFavorite = async () => {
    if (!user) {
      router.push(`/login?redirect=/barber/${barberId}`);
      return;
    }
    if (appUser?.role !== 'client') {
      toast.error('Switch to a client account to save barbers');
      return;
    }
    try {
      if (isFav) {
        await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse({ favoriteBarbers: arrayRemove(barberId) }));
      } else {
        await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse({ favoriteBarbers: arrayUnion(barberId) }));
      }
    } catch(e) { console.error(e); }
  }

  const handleBookClick = (serviceId?: string) => {
    if (!user) {
      router.push(`/login?redirect=/barber/${barberId}`);
      return;
    }
    if (appUser?.role !== 'client') {
      toast.error("You need a client account to book");
      return;
    }
    if (!appUser?.isOnboarded) {
      router.push('/onboarding/client');
      return;
    }
    if (!profile.isLive) {
      toast.error("This barber is not accepting bookings right now");
      return;
    }
    
    let url = `/book/${barberId}`;
    const params = new URLSearchParams();
    if (serviceId) params.set('service', serviceId);
    params.set('context', bookingContext);
    router.push(`${url}?${params.toString()}`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  // Compute Open/Closed status
  let badgeStatus = { text: "On leave", color: "text-brand-yellow", dot: "🟡" };
  const todayStr = new Date().toLocaleDateString('en-US', {weekday: 'long', timeZone: schedule?.timezone || undefined});
  
  if (!profile.isLive) {
    badgeStatus = { text: "Not accepting bookings", color: "text-red-500", dot: "🔴" };
  } else if (schedule?.weeklyHours) {
    const todayHours = schedule.weeklyHours[todayStr.toLowerCase()];
    if (todayHours?.isOpen) {
      const now = new Date();
      const timeZoneNow = new Date(now.toLocaleString('en-US', { timeZone: schedule?.timezone || undefined }));
      const currentMinutes = timeZoneNow.getHours() * 60 + timeZoneNow.getMinutes();
      
      const [startH, startM] = todayHours.openTime.split(':').map(Number);
      const openMinutes = startH * 60 + startM;
      
      const [endH, endM] = todayHours.closeTime.split(':').map(Number);
      const closeMinutes = endH * 60 + endM;

      if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
        badgeStatus = { text: `Open now · Closes at ${todayHours.closeTime}`, color: "text-brand-green", dot: "🟢" };
      } else if (currentMinutes < openMinutes) {
        badgeStatus = { text: `Closed · Opens today at ${todayHours.openTime}`, color: "text-red-500", dot: "🔴" };
      } else {
        badgeStatus = { text: "Closed now", color: "text-red-500", dot: "🔴" };
      }
    } else {
      badgeStatus = { text: "Closed today", color: "text-red-500", dot: "🔴" };
    }
  }

  // Calculate percentage of 5-star etc
  const ratingPercentages = [5,4,3,2,1].map(star => {
    if (!reviews.length) return '0%';
    const count = reviews.filter(r => Math.round(Number(r.rating)) === star).length;
    return `${(count / reviews.length) * 100}%`;
  });

  return (
    <div className="max-w-[700px] mx-auto px-5 py-8 md:py-12 animate-fadeUp">
       
       <title>{`${userDoc?.firstName || 'Barber'} ${userDoc?.lastName || ''} — titeZMe`}</title>
       {(profile.specialties?.[0] || userDoc?.city) && (
          <meta name="description" content={`Book ${userDoc?.firstName} in ${userDoc?.city}. ${profile.specialties?.[0] || ''}. Book instantly on titeZMe.`} />
       )}

       {/* SECTION 1 — HEADER */}
       <div className="flex flex-col sm:flex-row gap-6 items-start justify-between mb-8">
         <div className="flex gap-5 items-center w-full sm:w-auto">
           <div className="relative w-24 h-24 sm:w-[104px] sm:h-[104px] rounded-[28px] bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center text-4xl sm:text-5xl border border-brand-border overflow-hidden shrink-0">
             {profile.profilePhotoUrl || userDoc?.photoUrl ? (
               <Image src={profile.profilePhotoUrl || userDoc?.photoUrl} alt="Photo" fill className="object-cover" referrerPolicy="no-referrer" />
             ) : (
               <span className="font-black text-brand-yellow drop-shadow-md">{userDoc?.firstName?.[0] || 'B'}</span>
             )}
           </div>
           
           <div className="flex-1">
             <h1 className="text-[26px] sm:text-3xl font-black mb-1 leading-tight tracking-tight">{userDoc?.firstName} {userDoc?.lastName}</h1>
             
             <div className="flex items-center gap-1.5 mb-2">
               <span className="text-brand-yellow text-base mb-0.5">★</span>
               <span className="font-extrabold text-[15px]">{profile.rating > 0 ? profile.rating.toFixed(1) : 'New barber'}</span>
               {profile.rating > 0 && <span className="text-[#888] font-bold text-sm">({profile.totalReviews || profile.reviewCount || 0})</span>}
             </div>
             
             <div className="font-bold text-[#888] text-xs uppercase tracking-widest mb-2.5">
               📍 {userDoc?.city}, {userDoc?.country || 'TN'}
             </div>
             
             <div className={`text-[12px] font-extrabold flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111] border border-[#222] w-fit ${badgeStatus.color}`}>
                <span className="text-[10px]">{badgeStatus.dot}</span> <span className="tracking-wide uppercase">{badgeStatus.text}</span>
             </div>
           </div>
         </div>

         {/* Actions Right */}
         <div className="w-full sm:w-auto flex sm:flex-col gap-2.5 sm:gap-3 shrink-0">
           <button onClick={() => handleBookClick()} disabled={!profile.isLive} className={`flex-1 sm:flex-none px-6 py-3 sm:py-3.5 rounded-[16px] font-black tracking-wide text-sm transition-all border-2 border-transparent shadow-sm ${profile.isLive ? 'bg-brand-yellow text-brand-bg hover:bg-yellow-400 focus:scale-[0.98]' : 'bg-[#1a1a1a] text-[#555] cursor-not-allowed border-[#222]'}`}>
             {profile.isLive ? 'Book Now' : 'Not available'}
           </button>
           <div className="flex gap-2.5 sm:gap-3">
             <button onClick={toggleFavorite} className={`flex-1 sm:flex-none h-11 w-full sm:w-12 rounded-[14px] flex items-center justify-center border-2 transition-colors ${isFav ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow' : 'bg-[#141414] border-[#222] hover:border-[#444] text-[#888] hover:text-white'}`}>
               <span className="text-xl leading-none">♥</span>
             </button>
             <button onClick={copyLink} className="flex-1 sm:flex-none h-11 w-full sm:w-12 rounded-[14px] flex items-center justify-center border-2 bg-[#141414] border-[#222] hover:border-[#444] text-[#888] hover:text-white transition-colors">
               <span className="text-lg leading-none">↗</span>
             </button>
           </div>
         </div>
       </div>

       {/* SECTION 2 — INFO PILLS ROW */}
       <div className="flex flex-wrap gap-2 mb-8">
         {profile.languages?.length > 0 && (
           <div className="px-3 py-1.5 rounded-xl bg-[#111] border border-[#222] text-[11px] font-bold text-[#bbb] tracking-wide uppercase">
             <span className="opacity-60 mr-1.5">🗣</span> {profile.languages.join(' · ')}
           </div>
         )}
         {profile.vibes?.map((v:string) => (
           <div key={v} className="px-3 py-1.5 rounded-xl bg-[#141414] border border-[#2a2a2a] text-[11px] font-extrabold text-[#eee] tracking-wide uppercase shadow-sm">
             {v}
           </div>
         ))}
         {profile.shopId && shopData && (
           <Link href={`/shop/${profile.shopId}`} className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] font-extrabold text-blue-400 tracking-wide uppercase hover:bg-blue-500/20 transition-colors">
             <span className="opacity-60 mr-1.5">🏪</span> Works at {shopData.name}
           </Link>
         )}
         {profile.isSolo && (
           <div className="px-3 py-1.5 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 text-[11px] font-extrabold text-brand-yellow tracking-wide uppercase">
             <span className="opacity-60 mr-1.5">👤</span> Solo booking available
           </div>
         )}
         
         {/* Socials */}
         <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto mt-2 sm:mt-0">
           {profile.instagram && (
             <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" className="w-8 h-8 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-sm hover:border-[#E1306C] hover:text-[#E1306C] transition-colors">📷</a>
           )}
           {profile.tiktok && (
             <a href={`https://tiktok.com/@${profile.tiktok.replace('@', '')}`} target="_blank" className="w-8 h-8 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-sm hover:border-white hover:text-white transition-colors">🎵</a>
           )}
           {profile.facebook && (
             <a href={`https://facebook.com/${profile.facebook}`} target="_blank" className="w-8 h-8 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-sm hover:border-[#1877F2] hover:text-[#1877F2] transition-colors">📘</a>
           )}
         </div>
       </div>

       {/* SECTION 3 — SPECIALTIES + CLIENTELE */}
       {(profile.specialties?.length > 0 || profile.clientele?.length > 0) && (
         <div className="flex flex-col sm:flex-row gap-6 mb-10 pb-8 border-b border-[#222]">
           {profile.specialties?.length > 0 && (
             <div className="flex-1">
               <h3 className="font-extrabold text-[10px] tracking-widest text-[#555] uppercase mb-4">Specialties</h3>
               <div className="flex flex-wrap gap-2">
                 {profile.specialties.map((s:string) => (
                   <span key={s} className="bg-[#111] text-[#ccc] px-3 py-1.5 rounded-lg w-fit text-[12px] font-bold">{s}</span>
                 ))}
               </div>
             </div>
           )}
           {profile.clientele?.length > 0 && (
             <div className="flex-1">
               <h3 className="font-extrabold text-[10px] tracking-widest text-[#555] uppercase mb-4">Works with</h3>
               <div className="flex flex-wrap gap-2">
                 {profile.clientele.map((c:string) => (
                   <span key={c} className="bg-[#111] text-[#ccc] px-3 py-1.5 rounded-lg w-fit text-[12px] font-bold">{c}</span>
                 ))}
               </div>
             </div>
           )}
         </div>
       )}

       {/* SECTION 4 — PORTFOLIO PHOTOS */}
       {profile.photos?.length > 0 && (
         <div className="mb-12">
           <h3 className="font-extrabold text-[11px] tracking-widest text-brand-text-secondary uppercase mb-5 ml-1">Portfolio</h3>
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
             {profile.photos.map((p:string, i:number) => (
               <div key={i} className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#111] border border-[#222] group cursor-pointer">
                 <Image src={p} alt="Portfolio" fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized referrerPolicy="no-referrer" />
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
               </div>
             ))}
           </div>
         </div>
       )}

       {/* SECTION 5 — TABS */}
       <div className="mb-16">
         <div className="flex gap-6 border-b border-[#2a2a2a] mb-6 overflow-x-auto no-scrollbar">
           {['Services', 'Reviews', 'Availability'].map(tab => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`pb-3.5 text-[13px] font-black uppercase tracking-widest border-b-[3px] whitespace-nowrap transition-colors ${activeTab === tab ? 'border-brand-yellow text-white' : 'border-transparent text-[#666] hover:text-[#aaa]'}`}
             >
               {tab} {(tab === 'Reviews' && (profile.totalReviews > 0 || profile.reviewCount > 0)) && `(${profile.totalReviews || profile.reviewCount})`}
             </button>
           ))}
         </div>

         {/* TAB: SERVICES */}
         {activeTab === 'Services' && (
           <div className="animate-fadeIn">
             {profile.isSolo && profile.shopId && shopData && (
               <div className="p-1 bg-[#141414] rounded-xl flex gap-1 mb-8 w-fit border border-[#2a2a2a]">
                 <button onClick={() => setBookingContext('solo')} className={`px-5 py-2.5 rounded-[10px] text-[12px] font-bold tracking-wide uppercase transition-colors ${bookingContext === 'solo' ? 'bg-[#2a2a2a] text-white' : 'text-[#666] hover:text-white'}`}>
                   Book {userDoc?.firstName}
                 </button>
                 <button onClick={() => setBookingContext('shop')} className={`px-5 py-2.5 rounded-[10px] text-[12px] font-bold tracking-wide uppercase transition-colors ${bookingContext === 'shop' ? 'bg-[#2a2a2a] text-white' : 'text-[#666] hover:text-white'}`}>
                   Via {shopData.name}
                 </button>
               </div>
             )}

             <div className="flex flex-col gap-3">
               
               {/* titeZMe Cut */}
               {(bookingContext === 'solo' && profile.titeZMeCut) || (bookingContext === 'shop' && shopData?.titeZMeCut) || (!profile.shopId && profile.titeZMeCut) ? (() => {
                 const tCut = bookingContext === 'shop' && shopData?.titeZMeCut ? shopData.titeZMeCut : profile.titeZMeCut;
                 if (!tCut || !tCut.price) return null;
                 return (
                   <div className="bg-[#141414] border-l-4 border-l-brand-yellow border border-r-[#2a2a2a] border-t-[#2a2a2a] border-b-[#2a2a2a] rounded-r-[20px] p-5 sm:p-6 flex justify-between items-center mb-5 hover:bg-[#1a1a1a] transition-colors group cursor-pointer" onClick={() => handleBookClick('titezmecut')}>
                     <div>
                       <div className="font-black text-lg sm:text-xl text-white mb-1.5 flex items-center gap-2">titeZMe Cut ⚡</div>
                       <div className="text-[14px] font-medium text-[#aaa] mb-4 max-w-[280px] leading-relaxed">The barber chooses the cut based on your vibe and budget.</div>
                       <div className="text-[11px] font-extrabold text-[#777] uppercase tracking-widest bg-[#222] px-3 py-1.5 rounded-lg w-fit">⏱ {tCut.duration} mins</div>
                     </div>
                     <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 sm:gap-6">
                       <div className="font-black text-xl sm:text-2xl text-white">{profile.currency || '€'}{tCut.price}</div>
                       <button onClick={(e) => { e.stopPropagation(); handleBookClick('titezmecut'); }} disabled={!profile.isLive} className={`hidden sm:block px-6 py-3 rounded-xl text-xs font-black transition-colors ${profile.isLive ? 'bg-brand-yellow text-brand-bg group-hover:bg-yellow-400' : 'bg-[#222] text-[#555]'}`}>
                         {profile.isLive ? 'Book' : 'N/A'}
                       </button>
                     </div>
                   </div>
                 );
               })() : null}

               {/* Normal Services */}
               {bookingContext === 'solo' ? (
                 barberServices.length === 0 ? (
                   <div className="text-[#666] text-center py-12 font-bold text-sm bg-[#111] rounded-[24px] border border-dashed border-[#222]">No services listed yet</div>
                 ) : (
                   barberServices.map(s => (
                     <div key={s.id} onClick={() => handleBookClick(s.id)} className="bg-brand-surface border border-brand-border rounded-[20px] p-5 sm:p-6 flex justify-between items-center hover:border-[#444] hover:bg-[#111] transition-all cursor-pointer group">
                       <div>
                         <div className="font-black text-[17px] text-white mb-2">{s.name}</div>
                         <div className="text-[12px] font-bold text-[#777] bg-[#1a1a1a] px-3 py-1 rounded-lg w-fit">⏱ {s.duration} mins</div>
                       </div>
                       <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-6">
                         <div className="font-black text-lg text-white">{profile.currency||'€'}{s.price}</div>
                         <button onClick={(e) => { e.stopPropagation(); handleBookClick(s.id); }} disabled={!profile.isLive} className={`px-5 py-2.5 rounded-xl text-[11px] font-black tracking-wide uppercase transition-colors ${profile.isLive ? 'bg-[#1a1a1a] text-white border border-[#333] group-hover:bg-white group-hover:text-black group-hover:border-white' : 'bg-[#111] text-[#444] border border-[#222]'}`}>
                           {profile.isLive ? 'Book' : 'N/A'}
                         </button>
                       </div>
                     </div>
                   ))
                 )
               ) : (
                 shopServices.length === 0 ? (
                   <div className="text-[#666] text-center py-12 font-bold text-sm bg-[#111] rounded-[24px] border border-dashed border-[#222]">No shop services listed yet</div>
                 ) : (
                   shopServices.map(s => (
                     <div key={s.id} onClick={() => handleBookClick(s.id)} className="bg-brand-surface border border-brand-border rounded-[20px] p-5 sm:p-6 flex justify-between items-center hover:border-[#444] hover:bg-[#111] transition-all cursor-pointer group">
                       <div>
                         <div className="font-black text-[17px] text-white mb-2">{s.name}</div>
                         <div className="text-[12px] font-bold text-[#777] bg-[#1a1a1a] px-3 py-1 rounded-lg w-fit">⏱ {s.duration} mins</div>
                       </div>
                       <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-6">
                         <div className="font-black text-lg text-white">{profile.currency||'€'}{s.price}</div>
                         <button onClick={(e) => { e.stopPropagation(); handleBookClick(s.id); }} disabled={!profile.isLive} className={`px-5 py-2.5 rounded-xl text-[11px] font-black tracking-wide uppercase transition-colors ${profile.isLive ? 'bg-[#1a1a1a] text-white border border-[#333] group-hover:bg-white group-hover:text-black group-hover:border-white' : 'bg-[#111] text-[#444] border border-[#222]'}`}>
                           {profile.isLive ? 'Book' : 'N/A'}
                         </button>
                       </div>
                     </div>
                   ))
                 )
               )}

             </div>
           </div>
         )}

         {/* TAB: REVIEWS */}
         {activeTab === 'Reviews' && (
           <div className="animate-fadeIn">
             {(profile.totalReviews > 0 || profile.reviewCount > 0) ? (
               <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 p-6 sm:p-8 bg-[#111] rounded-[24px] border border-[#222]">
                 <div className="text-center shrink-0">
                   <div className="text-5xl sm:text-6xl font-black text-white mb-0.5 tracking-tighter">{profile.rating > 0 ? profile.rating.toFixed(1) : '0'}</div>
                   <div className="text-brand-yellow text-xl tracking-widest mb-1.5">★★★★★</div>
                   <div className="text-[11px] font-extrabold text-[#777] uppercase tracking-widest">{profile.totalReviews || profile.reviewCount || 0} reviews</div>
                 </div>
                 
                 <div className="flex-1 w-full flex flex-col gap-2">
                   {[5,4,3,2,1].map((star, idx) => {
                     return (
                       <div key={star} className="flex items-center gap-3 text-[11px] font-black text-[#555]">
                         <span className="w-2">{star}</span>
                         <div className="flex-1 h-2 bg-[#222] rounded-full overflow-hidden">
                           <div className="h-full bg-brand-yellow rounded-full transition-all duration-1000" style={{width: ratingPercentages[idx]}}></div>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             ) : null}

             <div className="flex flex-col gap-6">
               {reviews.length === 0 ? (
                 <div className="text-[#666] text-center py-12 font-bold text-sm bg-[#111] rounded-[24px] border border-dashed border-[#222]">No reviews yet.<br/>Be the first to book and review.</div>
               ) : (
                 <div className="bg-[#111] rounded-[24px] border border-[#222] overflow-hidden">
                   {reviews.map((r, i) => (
                     <div key={r.id} className={`p-6 ${i !== reviews.length - 1 ? 'border-b border-[#222]' : ''} relative`}>
                       <div className="flex items-start justify-between mb-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-sm font-black text-[#888] shrink-0 border border-[#333]">
                             {r.user?.firstName?.[0] || 'C'}
                           </div>
                           <div>
                             <div className="font-extrabold text-white text-[15px] tracking-tight">{r.user?.firstName} {r.user?.lastName?.[0] ? `${r.user.lastName[0]}.` : ''}</div>
                             <div className="text-[11px] font-bold text-[#666] uppercase tracking-wider mt-0.5">{new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                           </div>
                         </div>
                         <div className="flex gap-0.5 text-brand-yellow text-[13px]">
                           {Array(5).fill(0).map((_, i) => (
                             <span key={i} className={i < r.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                           ))}
                         </div>
                       </div>
                       <p className="text-[#aaa] text-[14px] leading-relaxed font-medium">
                         {r.comment}
                       </p>
                     </div>
                   ))}
                 </div>
               )}
               
               {(profile.totalReviews > reviews.length || profile.reviewCount > reviews.length) && (
                 <button onClick={loadMoreReviews} disabled={loadingReviews} className="mt-2 mx-auto w-fit px-6 py-3 rounded-xl border-2 border-[#222] text-[12px] font-black uppercase tracking-widest text-[#888] hover:text-white hover:border-[#444] transition-colors focus:scale-95 disabled:opacity-50">
                   {loadingReviews ? 'Loading...' : 'Load more'}
                 </button>
               )}
             </div>
           </div>
         )}

         {/* TAB: AVAILABILITY */}
         {activeTab === 'Availability' && (
           <div className="animate-fadeIn">
             <div className="bg-brand-surface border border-brand-border rounded-[24px] p-6 mb-6 overflow-hidden">
                <AvailabilityGrid uid={barberId} mode="client" />
             </div>
             <button onClick={() => handleBookClick()} disabled={!profile.isLive} className={`w-full py-4 rounded-[14px] text-sm font-black transition-all border-2 border-transparent shadow-sm ${profile.isLive ? 'bg-brand-yellow text-brand-bg hover:bg-yellow-400 focus:scale-[0.98]' : 'bg-[#1a1a1a] text-[#555] cursor-not-allowed border-[#222]'}`}>
               Book a slot ⚡
             </button>
           </div>
         )}

       </div>
    </div>
  );
}
