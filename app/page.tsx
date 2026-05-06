'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { BarberCardSkeleton } from '@/components/skeletons';

const fetchBarbers = async () => {
  const barbersQ = query(
    collection(db, 'barbers'),
    where('isLive', '==', true),
    orderBy('rating', 'desc'),
    limit(6)
  );
  try {
    const snap = await getDocs(barbersQ);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
  } catch (err) {
    // collection might not exist
    return [];
  }
};

const fetchCities = async () => {
  const shopsQ = query(collection(db, 'barbershops'), where('status', '==', 'active'));
  const barbersQ = query(collection(db, 'barberProfiles'), where('isLive', '==', true));
  
  try {
    const [shopsSnap, barbersSnap] = await Promise.all([getDocs(shopsQ), getDocs(barbersQ)]);
    
    const cityCounts: Record<string, number> = {};
    shopsSnap.docs.forEach(doc => {
      const city = doc.data().address?.city;
      if (city) cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    
    // For standalone barbers
    barbersSnap.docs.forEach(doc => {
      const city = doc.data().city;
      if (city) cityCounts[city] = (cityCounts[city] || 0) + 1;
    });

    return cityCounts;
  } catch(err) {
    return {};
  }
};

export default function LandingPage() {
  const router = useRouter();
  const { appUser, loading } = useAuth();
  const [browserCity, setBrowserCity] = useState('Madrid');
  
  // Try to keep it consistent
  const { data: barbers = [], isLoading: loadingBarbers } = useQuery({
    queryKey: ['landing_barbers'],
    queryFn: fetchBarbers,
    staleTime: 5 * 60 * 1000
  });

  const { data: cities = {} } = useQuery({
    queryKey: ['landing_cities'],
    queryFn: fetchCities,
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (!loading && appUser) {
      if (appUser.role === 'client') router.push('/dashboard/client');
      else if (appUser.role === 'barber') router.push('/dashboard/barber');
      else if (appUser.role === 'shop_owner') router.push('/dashboard/shop');
      else router.push('/dashboard/client');
    }
  }, [loading, appUser, router]);

  if (loading || appUser) return <div className="min-h-screen bg-[#0A0A0A]" />;

  const featuredBarber = barbers.length > 0 ? barbers[0] : null;

  return (
    <div className="bg-[#0A0A0A] text-white pt-24 min-h-screen font-sans">
      
      {/* SECTION 2 — HERO */}
      <section className="max-w-[1200px] mx-auto px-6 pt-8 pb-32">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="flex-1 animate-fadeUp">
            <div className="inline-flex items-center gap-2 border border-[#2a2a2a] rounded-full px-3 py-1 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
              <span className="text-xs font-bold text-gray-500">2,400+ barbers · 18 cities · live now</span>
            </div>
            
            <h1 className="text-6xl md:text-[88px] font-black leading-[0.95] tracking-tight mb-8">
              Find your <br className="hidden md:block"/>
              <span className="text-brand-yellow">perfect cut.</span><br/>
              <span className="text-[#333]">Right now.</span>
            </h1>
            
            <p className="text-lg text-gray-400 font-bold mb-10 max-w-[480px] leading-relaxed">
              Top-rated barbers in your city. Real availability. Cash only — no fees, no apps, no nonsense. Book in under 30 seconds.
            </p>

            <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-2 rounded-2xl flex flex-col md:flex-row gap-2 mb-6">
              <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-[#2a2a2a]">
                <span className="text-xl mr-3 opacity-50">☐</span>
                <input type="text" placeholder="Your city..." defaultValue={browserCity} className="bg-transparent w-full text-white font-bold outline-none placeholder:text-gray-600"/>
              </div>
              <div className="flex-1 flex items-center px-4 py-2">
                <span className="text-xl mr-3 opacity-50">☐</span>
                <input type="text" placeholder="Specialty — Skill" className="bg-transparent w-full text-white font-bold outline-none placeholder:text-gray-600"/>
              </div>
              <Link href="/search" className="bg-[#0f0f0f] border border-[#2a2a2a] text-white font-black px-8 py-3.5 rounded-xl transition-colors hover:bg-[#1a1a1a] flex justify-center items-center gap-2">
                <span>☐</span> Find
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 mb-16 items-center">
              <span className="text-xs font-bold text-gray-500 mr-2">Try:</span>
              {['Marrakesh', 'Casablanca', 'Madrid', 'Paris', 'Skin Fade', 'Beard Trim'].map(tag => (
                <span key={tag} className="border border-[#2a2a2a] px-3 py-1.5 rounded-full text-[11px] font-bold text-gray-400 hover:bg-[#1a1a1a] cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-8 md:gap-12 md:max-w-md justify-between">
               <div>
                 <div className="text-[32px] font-black text-brand-yellow leading-tight mb-1">2.4k+</div>
                 <div className="text-xs text-gray-500 font-bold">Barbers</div>
               </div>
               <div>
                 <div className="text-[32px] font-black text-white leading-tight mb-1">4.97</div>
                 <div className="text-xs text-gray-500 font-bold">Avg rating</div>
               </div>
               <div>
                 <div className="text-[32px] font-black text-white leading-tight mb-1">551</div>
                 <div className="text-xs text-gray-500 font-bold">Booked today</div>
               </div>
               <div>
                 <div className="text-[32px] font-black text-brand-yellow leading-tight mb-1">0%</div>
                 <div className="text-xs text-gray-500 font-bold">Fees</div>
               </div>
            </div>
          </div>
          
          <div className="flex-1 lg:max-w-[440px] animate-fadeUp !delay-[100ms] relative mt-10 lg:mt-0">
            <div className="absolute -top-6 right-0 bg-[#1a1a1a] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-orange border border-[#2a2a2a] z-10">
              FEATURED | Open Collection
            </div>
            {featuredBarber ? (
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex gap-4">
                     {featuredBarber.photoUrl ? (
                         <Image src={featuredBarber.photoUrl} alt="Barber" width={64} height={64} className="rounded-2xl object-cover border border-[#2a2a2a]"/>
                      ) : (
                         <div className="w-16 h-16 rounded-2xl bg-brand-yellow flex items-center justify-center font-black text-2xl text-black">
                           {featuredBarber.firstName?.[0] || 'B'}
                         </div>
                      )}
                      <div>
                        <h3 className="text-xl font-black text-white">{featuredBarber.firstName || 'Barber'} {featuredBarber.lastName}</h3>
                        <div className="text-sm font-bold text-gray-400 line-clamp-1">{featuredBarber.city || 'Madrid'}</div>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className="text-brand-yellow font-black">★ {featuredBarber.rating?.toFixed(2) || '4.97'}</div>
                      <div className="text-gray-500 text-[10px] font-bold uppercase mt-1">({featuredBarber.reviewCount || 0} reviews)</div>
                   </div>
                </div>

                <div className="flex gap-2 flex-wrap mb-4">
                   {['Skin Fade', 'Hype'].map(tag => (
                      <span key={tag} className="bg-[#1a1a1a] text-brand-yellow px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wild">{tag}</span>
                   ))}
                </div>
                
                <div className="text-xs font-bold text-gray-400 mb-6">
                   🌍 Arabic · French · +1
                </div>

                <div className="bg-[#0A0A0A] rounded-xl p-4 mb-6">
                   <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-3">NEXT AVAILABLE SLOTS</div>
                   <div className="flex gap-2 mb-2">
                     <span className="border border-brand-yellow text-brand-yellow px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-yellow/10">Today 1:30 PM</span>
                     <span className="border border-[#2a2a2a] text-gray-400 px-3 py-1.5 rounded-lg text-xs font-bold">Today 4:00 PM</span>
                   </div>
                </div>

                <div className="flex justify-between items-center">
                   <div>
                     <div className="text-lg font-black text-white">80-160 MAD</div>
                   </div>
                   <Link href="/search" className="bg-brand-yellow text-black font-black px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                     Book Now →
                   </Link>
                </div>
              </div>
            ) : (
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between" style={{ minHeight: '400px'}}>
                  <div className="flex justify-between items-start mb-6">
                   <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-brand-yellow flex items-center justify-center font-black text-2xl text-black">
                        HF
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">Hassan Fassi</h3>
                        <div className="text-sm font-bold text-gray-400">Madrid, Center</div>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <div className="text-brand-yellow font-black">★ 4.97</div>
                      <div className="text-gray-500 text-[10px] font-bold uppercase mt-1">(214 reviews)</div>
                   </div>
                </div>
                <div className="flex gap-2 flex-wrap mb-4">
                   <span className="bg-[#1a1a1a] text-brand-yellow px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wild">Skin Fade</span>
                   <span className="bg-[#1a1a1a] text-brand-yellow px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wild">Hype</span>
                </div>
                <div className="text-xs font-bold text-gray-400 mb-6">
                   🌍 Arabic · French · EN
                </div>
                <div className="bg-[#0A0A0A] rounded-xl p-4 mb-6 border border-[#1a1a1a]">
                   <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-3">NEXT AVAILABLE SLOTS</div>
                   <div className="flex gap-2">
                     <span className="border border-brand-yellow text-brand-yellow px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-yellow/10">Today 1:30 PM</span>
                     <span className="border border-[#2a2a2a] text-gray-400 px-3 py-1.5 rounded-lg text-xs font-bold">Today 5:00 PM</span>
                   </div>
                </div>
                <div className="flex justify-between items-center">
                   <div className="text-xl font-black text-white h-[38px] flex items-center">
                     80-160 MAD
                   </div>
                   <Link href="/search" className="bg-brand-yellow text-black font-black px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                     Book Now →
                   </Link>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-4 flex gap-3 items-center">
                <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center font-black">KB</div>
                <div>
                  <div className="text-[13px] font-black text-white line-clamp-1">Karim Benali</div>
                  <div className="text-[10px] font-bold text-gray-500">★ 4.9 • 80 MAD</div>
                </div>
              </div>
              <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-4 flex gap-3 items-center opacity-70">
                <div className="w-10 h-10 rounded-xl bg-gray-600 text-white flex items-center justify-center font-black">YA</div>
                <div>
                  <div className="text-[13px] font-black text-white line-clamp-1">Youssef Alami</div>
                  <div className="text-[10px] font-bold text-brand-red">Closed Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — BROWSE BARBERS */}
      <section className="bg-[#0A0A0A] border-t border-[#1a1a1a] py-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <div className="text-sm font-bold text-brand-yellow uppercase tracking-widest mb-3">BROWSE BARBERS</div>
              <h2 className="text-3xl md:text-4xl font-black">
                {browserCity} <span className="text-gray-500 font-bold">— {barbers.length > 0 ? barbers.length : 'X'} available</span>
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
              {['All', 'Clean cut', 'Top rated', 'Skin fade', 'Beard', 'More'].map((tab, i) => (
                <button key={tab} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-[#2a2a2a] text-white' : 'border border-[#2a2a2a] text-gray-400 hover:text-white'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingBarbers ? (
              [1, 2, 3, 4, 5, 6].map(i => <BarberCardSkeleton key={i} />)
            ) : (
              barbers.slice(0,6).map((item: any, i) => (
                <Link href={item.type === 'shop' ? `/shop/${item.id}` : `/barber/${item.id}`} key={i} className="group bg-[#111] border border-[#2a2a2a] rounded-3xl overflow-hidden hover:border-[#444] transition-all hover:-translate-y-1 block">
                <div className="h-[200px] bg-[#1a1a1a] relative">
                  {item.photos && item.photos.length > 0 ? (
                    <Image src={item.photos[0]} alt="Barber" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">💈</div>
                  )}
                  {item.isOpenToday ? (
                     <div className="absolute top-4 left-4 bg-brand-green/90 text-[#0a0a0a] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">Open</div>
                  ) : (
                     <div className="absolute top-4 left-4 bg-[#1a1a1a]/90 text-brand-text-secondary px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">Closed</div>
                  )}
                  {item.isSolo && <div className="absolute top-4 right-4 bg-black/60 text-white px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">Solo</div>}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-xl leading-tight group-hover:text-brand-yellow transition-colors">
                        {item.name || `${item.firstName} ${item.lastName}`}
                      </h3>
                      <div className="text-xs text-brand-text-secondary font-bold mt-0.5">{item.city || 'Madrid'}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 font-black text-brand-yellow text-sm">
                        <span>★</span> {item.rating > 0 ? item.rating.toFixed(1) : 'New'}
                      </div>
                      <div className="text-[10px] text-brand-text-secondary font-bold">({item.reviewCount || 0})</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 flex-wrap my-3">
                     {item.topSpecialties?.slice(0,2).map((s: string) => <span key={s} className="bg-[#1a1a1a] text-brand-yellow px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide">{s}</span>)}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2a2a2a]">
                    <div className="text-sm font-extrabold text-white">
                      {item.lowestPrice ? `From ${item.currency || 'MAD'}${item.lowestPrice}` : 'From 50 MAD'}
                    </div>
                    <div className="text-xs font-black text-brand-orange group-hover:text-brand-yellow transition-colors">
                      Book →
                    </div>
                  </div>
                </div>
              </Link>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/search" className="inline-block border border-[#2a2a2a] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#111] transition-colors">
              See all barbers →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4 — SOCIAL PROOF */}
      <section className="bg-[#050505] py-24 px-6 border-y border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_2.5fr] gap-12">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">SOCIAL PROOF</div>
              <h2 className="text-5xl font-black leading-[1.1] mb-2">Real clients.</h2>
              <h2 className="text-4xl font-bold text-gray-500 mb-8">Real talk.</h2>
              <div className="bg-[#0f0f0f] p-6 rounded-3xl border border-[#1a1a1a] inline-block">
                <div className="text-5xl font-black text-brand-yellow mb-1">4.9</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Overall Rating</div>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-4">
               {[
                 {n:"Annie M.", r: "Booked Hassan in 30 seconds. Best fade I've had in years. No one showed up. This is how it should work.", i: "AM"},
                 {n:"Sofiane K.", r: "Finally a platform that respects the barber AND the client. Carlos moves his slots properly. Top tier service for the app.", i:"SK"},
                 {n:"Younes B.", r: "Found a barber who speaks Arabic AND does proper fades in Madrid. TiteZMe solved something I'd been struggling with for months.", i:"YB"}
               ].map((rev, i) => (
                 <div key={i} className="bg-[#111] border border-[#2a2a2a] p-6 rounded-3xl flex flex-col justify-between">
                   <div>
                     <div className="flex gap-1 text-brand-yellow mb-4 text-xs">★★★★★</div>
                     <p className="text-sm font-bold text-gray-300 leading-relaxed mb-6">&quot;{rev.r}&quot;</p>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[10px] font-black text-gray-400">{rev.i}</div>
                     <div className="text-xs font-bold text-white uppercase tracking-wider">{rev.n}</div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-[#111] border border-[#2a2a2a] p-6 rounded-3xl">
             <div className="flex flex-col items-center justify-center border-r border-[#2a2a2a]/50">
               <div className="text-3xl font-black text-brand-yellow mb-1">4.9</div>
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">avg rating</div>
             </div>
             <div className="flex flex-col items-center justify-center border-r border-[#2a2a2a]/50 px-4 w-full">
               <div className="w-full flex items-center gap-2 mb-1"><span className="text-[10px] text-gray-500">5★</span><div className="h-1.5 flex-1 bg-[#2a2a2a] rounded-full overflow-hidden"><div className="w-[87%] h-full bg-brand-yellow"></div></div></div>
               <div className="w-full flex items-center gap-2 mb-1"><span className="text-[10px] text-gray-500">4★</span><div className="h-1.5 flex-1 bg-[#2a2a2a] rounded-full overflow-hidden"><div className="w-[10%] h-full bg-brand-yellow opacity-50"></div></div></div>
               <div className="w-full flex items-center gap-2"><span className="text-[10px] text-gray-500">3★</span><div className="h-1.5 flex-1 bg-[#2a2a2a] rounded-full overflow-hidden"><div className="w-[3%] h-full bg-brand-yellow opacity-25"></div></div></div>
             </div>
             <div className="flex flex-col items-center justify-center border-r border-[#2a2a2a]/50">
               <div className="text-3xl font-black text-white mb-1">11,400+</div>
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">bookings made</div>
             </div>
             <div className="flex flex-col items-center justify-center">
               <div className="text-3xl font-black text-white mb-1">98%</div>
               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">completion rate</div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW IT WORKS */}
      <section className="bg-[#0A0A0A] py-32 px-6">
         <div className="max-w-[1200px] mx-auto text-center mb-20">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">HOW IT WORKS</div>
            <h2 className="text-4xl md:text-5xl font-black">Booked in 3 steps. No drama.</h2>
         </div>
         
         <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-12 lg:gap-20">
            {[
              { n: '01', t: 'Pick your city', d: 'Open the app on any device or browser. We detect your location automatically, or choose your city and availability.', i: '📍' },
              { n: '02', t: 'Choose your barber', d: "Filter by specialty, language, vibe, price. See who's open right now in real time this very minute.", i: '✂️' },
              { n: '03', t: 'Show up. Pay cash.', d: 'Book in under 30 seconds. Arrive, get the cut you chose directly. Zero drama. 100% real.', i: '💵' }
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[180px] font-black text-[#111] leading-none z-0 tracking-tighter" style={{marginTop: '-60px'}}>{step.n}</div>
                 <div className="z-10 relative">
                   <div className="w-16 h-16 mx-auto bg-[#141414] border border-[#2a2a2a] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl">
                     {step.i}
                   </div>
                   <h3 className="text-xl font-black mb-3">{step.t}</h3>
                   <p className="text-sm font-bold text-gray-400 leading-relaxed max-w-[280px] mx-auto">{step.d}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* SECTION 6 — FOR BARBERS */}
      <section id="for-barbers" className="bg-[#111] py-24 px-6 border-y border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-8 items-center">
          <div>
            <div className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">FOR BARBERS</div>
            <h2 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Your chair. <br/>
              <span className="text-brand-yellow">Your rules.</span> <br/>
              <span className="text-brand-yellow">Your money.</span>
            </h2>
            <p className="text-lg font-bold text-gray-400 mb-10 max-w-[420px]">
              No commission fees during beta. Set your hours, set your price, keep everything. We send clients to your chair.
            </p>
            
            <div className="flex flex-col gap-4 mb-10">
              {['0% commission — keep every dirham/euro', 'Profile live in under 10 minutes', 'Your own schedule — no one owns your time', 'Clients find you — you just cut'].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-yellow/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-brand-yellow text-xs font-black">✓</span>
                  </div>
                  <span className="font-bold text-gray-300">{text}</span>
               </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90">
                Join free during beta →
              </Link>
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="border border-[#2a2a2a] text-white font-bold px-8 py-4 rounded-full hover:bg-[#1a1a1a] transition-colors">
                See how it works
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
               <div className="text-5xl font-black text-brand-yellow mb-2">0%</div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">commission</div>
             </div>
             <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
               <div className="text-5xl font-black text-white mb-2">10 min</div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">to set up your profile</div>
             </div>
             <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px] border border-brand-yellow/20">
               <div className="text-5xl font-black text-white mb-2">400+</div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">barbers already joined</div>
             </div>
             <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
               <div className="text-3xl font-black text-brand-orange mb-2">Beta = Free</div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Join now, pay nothing during beta</div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — CITIES */}
      <section id="cities" className="bg-[#0A0A0A] py-24 px-6 border-b border-[#1a1a1a]">
         <div className="max-w-[1200px] mx-auto">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">CITIES</div>
            <h2 className="text-4xl md:text-5xl font-black mb-12">We&apos;re live where you are</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { c: 'Marrakesh', b: true, badge: 'Most popular', x: cities['Marrakesh'] || 18 },
                 { c: 'Casablanca', b: true, x: cities['Casablanca'] || 32 },
                 { c: 'Madrid', b: true, x: cities['Madrid'] || 46 },
                 { c: 'Paris', b: true, x: cities['Paris'] || 12 },
                 { c: 'Amsterdam', b: false },
                 { c: 'London', b: false },
                 { c: 'Barcelona', b: false },
                 { c: 'Berlin', b: false }
               ].map((city, i) => (
                 <div key={i} className={`p-6 rounded-3xl border transition-colors ${city.b ? 'bg-[#111] border-[#2a2a2a] hover:border-brand-yellow/50' : 'bg-[#0f0f0f] border-[#1a1a1a] opacity-60'}`}>
                    {city.badge && <div className="text-[10px] font-black text-black bg-brand-yellow inline-block px-2 py-0.5 rounded mb-3 uppercase tracking-wider">{city.badge}</div>}
                    <h3 className="text-xl font-black text-white mb-1">{city.c}</h3>
                    <div className="text-xs font-bold text-gray-500 mb-6">{city.b ? `${city.x} active barbers` : 'Coming soon'}</div>
                    {city.b ? (
                      <button className="text-sm font-black text-brand-yellow">Explore →</button>
                    ) : (
                      <button className="text-sm font-bold text-gray-600">Request it →</button>
                    )}
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION 8 — FINAL CTA */}
      <section className="bg-brand-yellow text-black py-32 px-6 text-center">
         <div className="max-w-[800px] mx-auto">
            <div className="text-[11px] font-black uppercase tracking-widest mb-6 opacity-70">ONE LAST THING</div>
            <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight mb-12">
               Your next cut is <br/> 30 seconds away.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/search" className="bg-[#0A0A0A] text-white font-black px-8 py-4 rounded-full transition-opacity hover:bg-[#1a1a1a]">
                  Find a barber now →
               </Link>
               <Link href="/signup" className="border-2 border-black bg-transparent text-black font-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition-colors">
                  Join as a barber
               </Link>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050505] py-12 px-6">
         <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-[#1a1a1a] mb-8">
            <div className="flex flex-col items-center md:items-start">
               <div className="font-black text-brand-yellow text-2xl tracking-tight mb-2">
                 tite<span className="text-brand-orange">Z</span>Me
               </div>
               <div className="text-xs font-bold text-gray-500">Keeping you sharp.</div>
            </div>
            
            <div className="flex gap-6 sm:gap-8">
               <Link href="/about" className="text-xs font-bold text-gray-400 hover:text-white">About</Link>
               <Link href="#for-barbers" className="text-xs font-bold text-gray-400 hover:text-white">For Barbers</Link>
               <Link href="#cities" className="text-xs font-bold text-gray-400 hover:text-white">Cities</Link>
               <Link href="/privacy" className="text-xs font-bold text-gray-400 hover:text-white">Privacy</Link>
               <Link href="/terms" className="text-xs font-bold text-gray-400 hover:text-white">Terms</Link>
            </div>
            
            <div className="flex gap-4 opacity-50">
               {/* Placeholders for social icons */}
               <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-xs">IG</div>
               <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-xs">TT</div>
            </div>
         </div>
         <div className="text-center text-[10px] font-bold text-gray-600">
            © 2026 titeZMe. All rights reserved.
         </div>
      </footer>
    </div>
  );
}
