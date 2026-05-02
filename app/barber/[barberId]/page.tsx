'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';

export default function BarberProfilePage({ params }: { params: Promise<{ barberId: string }> }) {
  const resolvedParams = use(params);
  const barberId = resolvedParams.barberId;
  const { user, appUser } = useAuth();
  const router = useRouter();

  const fetchProfileData = async () => {
    const pSnap = await getDoc(doc(db, 'barberProfiles', barberId));
    if (!pSnap.exists()) return null;
    
    const profileData = { id: pSnap.id, ...pSnap.data() } as any;
    
    const uSnap = await getDoc(doc(db, 'users', barberId));
    if (uSnap.exists()) profileData.user = uSnap.data();
    
    const sSnap = await getDoc(doc(db, 'schedules', barberId));
    if (sSnap.exists()) profileData.schedule = sSnap.data();

    // Fetch Services
    const svQ = query(collection(db, 'services'), where('providerId', '==', barberId), where('providerType', '==', 'barber'));
    const svSnap = await getDocs(svQ);
    const services: any[] = svSnap.docs.map(d => ({id: d.id, ...d.data()}));

    // Fetch Reviews
    const rQ = query(collection(db, 'reviews'), where('providerId', '==', barberId), orderBy('createdAt', 'desc'), limit(10));
    const rSnap = await getDocs(rQ);
    const fetchedReviews = [];
    for(const rDoc of rSnap.docs) {
      const rev = { id: rDoc.id, ...rDoc.data() } as any;
      const rUser = await getDoc(doc(db, 'users', rev.clientId));
      if(rUser.exists()) rev.user = rUser.data();
      fetchedReviews.push(rev);
    }
    
    return { profile: profileData, services, reviews: fetchedReviews };
  };

  const { data, isLoading: loading } = useSWR(['barberProfile', barberId], fetchProfileData, { dedupingInterval: 300000 });
  const profile = data?.profile;
  const services = data?.services || [];
  const reviews = data?.reviews || [];

  const toggleFavorite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const isFav = appUser?.favoriteBarbers?.includes(barberId);
    try {
      if (isFav) {
        await updateDoc(doc(db, 'users', user.uid), { favoriteBarbers: arrayRemove(barberId) });
      } else {
        await updateDoc(doc(db, 'users', user.uid), { favoriteBarbers: arrayUnion(barberId) });
      }
    } catch(e) {
      console.error(e);
    }
  }

  if (loading) return <div className="text-center py-20 text-brand-text-secondary animate-pulse">Loading profile...</div>;
  if (!profile) return <div className="text-center py-20 text-brand-text-secondary">Barber not found.</div>;

  const isFav = appUser?.favoriteBarbers?.includes(barberId);
  const today = new Date().toLocaleDateString('en-US', {weekday: 'short'});
  const isOpenToday = profile.schedule?.weeklyHours?.days?.includes(today);

  return (
    <div className="max-w-[800px] mx-auto px-6 py-10 md:py-14 animate-fadeUp">
       
       {/* Header */}
       <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mb-10">
         <div className="w-[120px] h-[120px] rounded-[32px] bg-[#1a1a1a] flex items-center justify-center text-5xl overflow-hidden shrink-0 border border-brand-border">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           {profile.photos?.[0] ? <img src={profile.photos[0]} alt="" className="w-full h-full object-cover" /> : "💈"}
         </div>
         <div className="flex-1">
           <div className="flex items-start justify-between">
             <div>
               <h1 className="text-3xl font-black leading-tight mb-1">{profile.user?.firstName} {profile.user?.lastName}</h1>
               <div className="flex items-center gap-3 mb-2">
                 {(profile.instagram || profile.facebook || profile.tiktok) && (
                   <div className="flex items-center gap-2">
                     {profile.instagram && (
                       <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#E1306C] transition-colors" title="Instagram">
                         📷
                       </a>
                     )}
                     {profile.facebook && (
                       <a href={`https://facebook.com/${profile.facebook}`} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-[#1877F2] transition-colors" title="Facebook">
                         📘
                       </a>
                     )}
                     {profile.tiktok && (
                       <a href={`https://tiktok.com/@${profile.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-white transition-colors" title="TikTok">
                         🎵
                       </a>
                     )}
                     <span className="text-[#333]">|</span>
                   </div>
                 )}
                 <div className="text-brand-text-secondary font-bold text-sm">
                   📍 {profile.city} • 🌍 {profile.languages?.join(', ') || 'English'}
                 </div>
               </div>
             </div>
             <button onClick={toggleFavorite} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${isFav ? 'border-brand-yellow text-brand-yellow bg-[#1a1500]' : 'border-[#2a2a2a] text-[#888] hover:border-white hover:text-white'}`}>
               <span className="text-lg">⭐</span>
             </button>
           </div>
           
           <div className="flex flex-wrap gap-2 mb-4">
             {profile.vibes?.map((v:string) => <span key={v} className="bg-[#1a1a1a] px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide text-[#aaaaaa] uppercase">{v}</span>)}
             {profile.specialties?.map((s:string) => <span key={s} className="bg-brand-yellow/10 text-brand-yellow px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide uppercase">{s}</span>)}
             {profile.clientele?.map((c:string) => <span key={c} className="bg-brand-blue/10 text-blue-400 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide uppercase">{c}</span>)}
           </div>

           <div className="flex items-center gap-4 text-sm font-bold">
             <div className="flex items-center gap-1.5"><span className="text-brand-yellow">★</span> {profile.rating > 0 ? profile.rating.toFixed(1) : 'New'} ({profile.totalCuts} cuts)</div>
             <div className="w-1 h-1 bg-[#333] rounded-full" />
             {isOpenToday ? (
               <div className="text-brand-green">Open Today</div>
             ) : (
               <div className="text-brand-text-secondary">Closed Today</div>
             )}
           </div>
         </div>
       </div>

       {/* About */}
       {profile.bio && (
         <div className="mb-10">
           <h3 className="font-extrabold text-[11px] tracking-widest text-[#666] uppercase mb-4">About</h3>
           <p className="text-[#bbb] text-[15px] font-medium leading-relaxed bg-[#111] p-5 rounded-[20px] border border-[#222]">
             {profile.bio}
           </p>
         </div>
       )}

       {/* Services */}
       <div className="mb-12">
         <h3 className="font-extrabold text-[11px] tracking-widest text-[#666] uppercase mb-4">Services</h3>
         <div className="flex flex-col gap-3">
           {services.length === 0 ? (
             <div className="text-sm font-bold text-brand-text-secondary border-2 border-dashed border-[#2a2a2a] rounded-2xl p-6 text-center">No services listed.</div>
           ) : (
             services.map(s => (
               <div key={s.id} className="group bg-brand-surface border border-brand-border rounded-2xl p-5 flex justify-between items-center hover:border-brand-yellow transition-colors">
                 <div>
                   <div className="font-black text-lg text-white mb-0.5">{s.name}</div>
                   <div className="text-xs font-bold text-brand-text-secondary">{s.duration} mins</div>
                 </div>
                 <div className="flex items-center gap-5">
                   <div className="font-black text-xl text-brand-yellow">€{s.price}</div>
                   <Link href={`/book/${barberId}?service=${s.id}`} className="bg-[#1a1a1a] text-white hover:text-[#0a0a0a] hover:bg-brand-yellow transition-colors px-4 py-2 rounded-xl text-xs font-bold border border-[#333] group-hover:border-brand-yellow group-hover:bg-brand-yellow group-hover:text-[#0a0a0a]">
                     Book
                   </Link>
                 </div>
               </div>
             ))
           )}
         </div>
       </div>

       {/* Reviews */}
       <div>
         <h3 className="font-extrabold text-[11px] tracking-widest text-[#666] uppercase mb-4">Recent Reviews</h3>
         <div className="flex flex-col gap-4">
           {reviews.length === 0 ? (
             <div className="text-sm font-bold text-brand-text-secondary border border-[#2a2a2a] bg-[#111] rounded-2xl p-6 text-center">No reviews yet.</div>
           ) : (
             reviews.map(r => (
               <div key={r.id} className="bg-transparent border-t border-[#2a2a2a] pt-4 first:border-0 first:pt-0">
                 <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                     <div className="w-7 h-7 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[10px] font-black text-white">
                       {r.user?.firstName?.[0] || "C"}
                     </div>
                     <div className="font-bold text-sm text-white">{r.user?.firstName}</div>
                     <div className="text-[10px] font-bold text-[#666]">{new Date(r.createdAt).toLocaleDateString()}</div>
                   </div>
                   <div className="text-brand-yellow text-sm font-black">★ {r.rating}</div>
                 </div>
                 <p className="text-[#999] text-[13px] font-medium pl-9 leading-relaxed">
                   {r.comment}
                 </p>
               </div>
             ))
           )}
         </div>
       </div>

    </div>
  );
}
