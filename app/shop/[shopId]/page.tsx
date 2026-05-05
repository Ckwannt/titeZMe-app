'use client';

import { useState, useEffect, use } from 'react';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ShopProfilePage({ params }: { params: Promise<{ shopId: string }> }) {
  const resolvedParams = use(params);
  const shopId = resolvedParams.shopId;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState<any>(null);
  const [shopSchedule, setShopSchedule] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Static fetch: services
    const fetchStatic = async () => {
      try {
        const sQ = query(
          collection(db, 'services'),
          where('providerId', '==', shopId), // providerId is shopId for shop services
          where('providerType', '==', 'shop'),
          where('isActive', '==', true)
        );
        const sSnap = await getDocs(sQ);
        setServices(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error("Static fetch error:", e);
      }
    };
    fetchStatic();
  }, [shopId]);

  useEffect(() => {
    // 2. Real-time: barbershops/{shopId}
    const unsubShop = onSnapshot(doc(db, 'barbershops', shopId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status !== 'active') {
          setShopData({ _notActive: true });
        } else {
          setShopData({ id: docSnap.id, ...data });
        }
      } else {
        setShopData({ _notActive: true }); // not found
      }
      setLoading(false);
    });

    // 3. Real-time: schedules/{shopId}
    const unsubSchedule = onSnapshot(doc(db, 'schedules', `${shopId}_shard_0`), (docSnap) => {
      if (docSnap.exists()) {
        setShopSchedule(docSnap.data());
      }
    });

    // 4. Real-time: barbers - using 'barberProfiles' assuming it maps to 'barbers' logically since 'barbers/{barberId}' is where the user asked to read.
    const bQ = query(collection(db, 'barberProfiles'), where('shopId', '==', shopId), where('isLive', '==', true));
    const unsubBarbers = onSnapshot(bQ, async (bSnap) => {
      const barbersData: any[] = [];
      for (const d of bSnap.docs) {
        const bInfo = { id: d.id, ...d.data() };
        // Fetch user data for each barber
        const uSnap = await getDoc(doc(db, 'users', d.id));
        if (uSnap.exists()) {
          bInfo.user = uSnap.data();
        }
        
        // Fetch individual barber schedule for "open/closed" badge
        const bsSnap = await getDoc(doc(db, 'schedules', `${d.id}_shard_0`));
        if (bsSnap.exists()) {
          bInfo.schedule = bsSnap.data();
        }
        
        barbersData.push(bInfo);
      }
      setBarbers(barbersData);
    });

    return () => {
      unsubShop();
      unsubSchedule();
      unsubBarbers();
    };
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse">
        <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!shopData || shopData._notActive) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fadeUp text-center">
         <div className="text-6xl mb-6">🔒</div>
         <h1 className="text-3xl font-black mb-4">This shop is not available</h1>
         <p className="text-[#888] font-medium mb-8 max-w-sm mx-auto leading-relaxed">The owner may have deactivated it or it doesn't exist.</p>
         <button onClick={() => router.back()} className="px-8 py-3.5 bg-[#1a1a1a] text-white hover:bg-white hover:text-black font-extrabold rounded-[14px] transition-colors border border-[#333]">Go Back</button>
       </div>
    );
  }

  // Compute Open/Closed status
  const getBadgeStatus = (scheduleData: any, city: string | undefined, country: string | undefined) => {
    let status = { text: "On leave", color: "text-brand-yellow", dot: "🟡" };
    const tz = scheduleData?.timezone || undefined;
    
    if (scheduleData?.weeklyHours) {
      const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', timeZone: tz }).toLowerCase();
      const todayHours = scheduleData.weeklyHours[todayStr];
      if (todayHours?.isOpen) {
        const now = new Date();
        const timeZoneNow = new Date(now.toLocaleString('en-US', { timeZone: tz }));
        const currentMinutes = timeZoneNow.getHours() * 60 + timeZoneNow.getMinutes();
        
        const [startH, startM] = todayHours.openTime.split(':').map(Number);
        const openMinutes = startH * 60 + startM;
        
        const [endH, endM] = todayHours.closeTime.split(':').map(Number);
        const closeMinutes = endH * 60 + endM;

        if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
          status = { text: `Open now · Closes at ${todayHours.closeTime}`, color: "text-brand-green", dot: "🟢" };
        } else if (currentMinutes < openMinutes) {
          status = { text: `Closed · Opens today at ${todayHours.openTime}`, color: "text-red-500", dot: "🔴" };
        } else {
          status = { text: "Closed now", color: "text-red-500", dot: "🔴" };
        }
      } else {
        status = { text: "Closed today", color: "text-red-500", dot: "🔴" };
      }
    }
    return status;
  };

  const shopBadgeStatus = getBadgeStatus(shopSchedule, shopData.address?.city, shopData.address?.country);

  return (
    <div className="bg-brand-bg min-h-screen pb-16">
      <title>{`${shopData.name} — titeZMe`}</title>
      <meta name="description" content={`Book at ${shopData.name} in ${shopData.address?.city || ''}. ${barbers.length} barbers available. Book instantly on titeZMe.`} />

      {/* SECTION 1 — SHOP HEADER */}
      <div className="relative w-full h-[200px] sm:h-[300px] bg-gradient-to-r from-[#111] to-[#222]">
        {shopData.coverPhotoUrl ? (
          <Image src={shopData.coverPhotoUrl} alt={`${shopData.name} cover`} fill className="object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30">
             <span className="text-6xl sm:text-8xl font-black text-white">{shopData.name?.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent"></div>
      </div>

      <div className="max-w-[800px] mx-auto px-5 -mt-16 sm:-mt-24 relative z-10">
        <div className="mb-8 animate-fadeUp">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-md">{shopData.name}</h1>
          <div className="flex flex-col gap-3">
             <div className={`text-[12px] font-extrabold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111] border border-[#222] w-fit shadow-md ${shopBadgeStatus.color}`}>
                <span className="text-[10px]">{shopBadgeStatus.dot}</span> <span className="tracking-wide uppercase">{shopBadgeStatus.text}</span>
             </div>
             {shopData.address && (
                <div className="flex items-center gap-2 text-[#aaa] font-medium text-sm">
                   📍 {shopData.address.street} {shopData.address.number}, {shopData.address.city}
                   {shopData.googleMapsUrl && (
                     <a href={shopData.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-brand-yellow hover:underline font-bold text-xs uppercase tracking-wide">
                        Get Directions ↗
                     </a>
                   )}
                </div>
             )}
             {shopData.contactPhone && (
                <div className="flex items-center gap-2 text-[#aaa] font-medium text-sm">
                   📞 {shopData.contactPhone}
                </div>
             )}
          </div>
          {shopData.description && (
             <p className="mt-5 text-[#ccc] leading-relaxed text-[15px] font-medium max-w-[600px]">
               {shopData.description}
             </p>
          )}

          {/* Socials */}
          <div className="flex items-center gap-2 mt-5">
            {shopData.instagram && (
              <a href={`https://instagram.com/${shopData.instagram.replace('@', '')}`} target="_blank" className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-sm hover:border-[#E1306C] hover:text-[#E1306C] transition-colors shadow-sm">📷</a>
            )}
            {shopData.tiktok && (
              <a href={`https://tiktok.com/@${shopData.tiktok.replace('@', '')}`} target="_blank" className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-sm hover:border-white hover:text-white transition-colors shadow-sm">🎵</a>
            )}
            {shopData.facebook && (
              <a href={`https://facebook.com/${shopData.facebook}`} target="_blank" className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-sm hover:border-[#1877F2] hover:text-[#1877F2] transition-colors shadow-sm">📘</a>
            )}
          </div>
        </div>

        {/* SECTION 2 — OUR BARBERS */}
        <div className="mb-14 animate-fadeUp">
           <h2 className="text-2xl font-black mb-5 tracking-tight">Our Team</h2>
           {barbers.length === 0 ? (
             <div className="text-[#666] text-center py-12 font-bold text-sm bg-[#111] rounded-[24px] border border-dashed border-[#222]">No barbers yet.<br/>Check back soon.</div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {barbers.map(b => {
                   const barberBadge = getBadgeStatus(b.schedule, shopData.address?.city, shopData.address?.country);
                   return (
                     <div key={b.id} className="bg-[#141414] border border-[#222] rounded-[24px] p-5 flex flex-col justify-between hover:border-[#444] transition-colors shadow-sm">
                       <div className="flex items-start gap-4 mb-5">
                          <div className="relative w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#222] to-[#333] flex items-center justify-center text-2xl font-black shrink-0 overflow-hidden border border-[#333]">
                            {b.profilePhotoUrl || b.user?.photoUrl ? (
                              <Image src={b.profilePhotoUrl || b.user?.photoUrl} alt="Photo" fill className="object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <span className="text-brand-yellow drop-shadow-md">{b.user?.firstName?.[0] || 'B'}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-black text-white text-[17px] mb-1 tracking-tight">{b.user?.firstName} {b.user?.lastName}</h3>
                            <div className="flex items-center gap-1.5 mb-2">
                               <span className="text-brand-yellow text-sm leading-none">★</span>
                               <span className="font-extrabold text-[13px]">{b.rating > 0 ? b.rating.toFixed(1) : 'New'}</span>
                               {b.rating > 0 && <span className="text-[#888] font-bold text-xs">({b.totalReviews || b.reviewCount || 0})</span>}
                            </div>
                            <div className="flex items-center gap-1">
                               <span className={`w-2 h-2 rounded-full ${barberBadge.dot === '🟢' ? 'bg-brand-green' : barberBadge.dot === '🟡' ? 'bg-brand-yellow' : 'bg-red-500'}`}></span>
                               <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">{barberBadge.dot === '🟢' ? 'Available' : 'Unavailable'}</span>
                            </div>
                          </div>
                       </div>
                       
                       <div className="mb-5 flex-1">
                          {b.specialties?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                               {b.specialties.slice(0, 3).map((s: string) => (
                                 <span key={s} className="bg-[#1a1a1a] text-[#aaa] px-2 py-1 rounded-md text-[10px] font-bold">{s}</span>
                               ))}
                               {b.specialties.length > 3 && (
                                 <span className="bg-[#1a1a1a] text-[#888] px-2 py-1 rounded-md text-[10px] font-bold">+{b.specialties.length - 3} more</span>
                               )}
                            </div>
                          )}
                          {b.languages?.length > 0 && (
                             <div className="mt-3 text-[11px] font-bold text-[#666] flex items-center gap-1">
                               🗣 {b.languages.join(' · ')}
                             </div>
                          )}
                       </div>
                       
                       <Link href={`/book/${b.id}?context=shop`} className="block w-full py-3.5 bg-[#1a1a1a] hover:bg-white hover:text-black text-center text-white rounded-xl text-[13px] font-black tracking-wide uppercase transition-all border border-[#333] hover:border-white shadow-sm">
                          Book {b.user?.firstName}
                       </Link>
                     </div>
                   );
                })}
             </div>
           )}
        </div>

        {/* SECTION 3 — SHOP SERVICES */}
        <div className="mb-14 animate-fadeUp" style={{animationDelay: '0.1s'}}>
           <h2 className="text-2xl font-black mb-5 tracking-tight">Our Services</h2>
           <div className="flex flex-col gap-3">
             {/* titeZMe Cut */}
             {shopData.titeZMeCut && shopData.titeZMeCut.price && (
               <div className="bg-[#141414] border-l-4 border-l-brand-yellow border-t-[#222] border-r-[#222] border-b-[#222] border rounded-r-[20px] p-5 sm:p-6 flex justify-between items-center hover:bg-[#1a1a1a] transition-colors shadow-sm">
                  <div>
                    <div className="font-black text-[17px] text-white mb-1.5 flex items-center gap-2">titeZMe Cut ⚡</div>
                    <div className="text-[13px] font-medium text-[#aaa] mb-3 max-w-[280px]">The barber chooses the cut based on your vibe and budget.</div>
                    <div className="text-[11px] font-extrabold text-[#777] uppercase tracking-widest bg-[#222] px-3 py-1.5 rounded-lg w-fit">⏱ {shopData.titeZMeCut.duration} mins</div>
                  </div>
                  <div className="font-black text-xl text-white">{shopData.currency || '€'}{shopData.titeZMeCut.price}</div>
               </div>
             )}

             {services.length === 0 && !shopData.titeZMeCut ? (
               <div className="text-[#666] text-center py-12 font-bold text-sm bg-[#111] rounded-[24px] border border-dashed border-[#222]">No services listed yet</div>
             ) : (
               services.map(s => (
                  <div key={s.id} className="bg-brand-surface border border-brand-border rounded-[20px] p-5 sm:p-6 flex justify-between items-center hover:bg-[#111] transition-all shadow-sm">
                     <div>
                       <div className="font-black text-[17px] text-white mb-2">{s.name}</div>
                       <div className="text-[12px] font-bold text-[#777] bg-[#1a1a1a] px-3 py-1 rounded-lg w-fit">⏱ {s.duration} mins</div>
                     </div>
                     <div className="font-black text-xl text-white">{shopData.currency||'€'}{s.price}</div>
                  </div>
               ))
             )}
           </div>
        </div>

        {/* SECTION 4 — SHOP PHOTOS & VIDEOS */}
        {(shopData.photos?.length > 0 || shopData.videos?.length > 0) && (
          <div className="mb-14 animate-fadeUp" style={{animationDelay: '0.2s'}}>
             <h2 className="text-2xl font-black mb-5 tracking-tight">Gallery</h2>
             {shopData.photos?.length > 0 && (
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {shopData.photos.map((p:string, i:number) => (
                    <div key={i} onClick={() => setFullscreenImage(p)} className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#111] border border-[#222] group cursor-pointer shadow-sm">
                      <Image src={p} alt="Shop Portfolio" fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ))}
               </div>
             )}
             {shopData.videos?.length > 0 && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {shopData.videos.map((v:string, i:number) => (
                    <div key={i} className="relative aspect-[16/9] rounded-[20px] overflow-hidden bg-[#111] border border-[#222] shadow-sm">
                       <video src={v} controls className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}

      </div>

      {/* Lightbox for photos */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setFullscreenImage(null)}>
           <div className="relative w-full max-w-4xl h-full max-h-[85vh] flex items-center justify-center animate-fadeIn">
             <Image src={fullscreenImage} alt="Fullscreen" fill className="object-contain" unoptimized referrerPolicy="no-referrer" />
             <button className="absolute top-4 right-4 w-12 h-12 bg-[#111]/80 rounded-full flex items-center justify-center text-white text-2xl font-black border border-[#333] hover:bg-white hover:text-black transition-colors shadow-lg" onClick={() => setFullscreenImage(null)}>×</button>
           </div>
        </div>
      )}
    </div>
  );
}
