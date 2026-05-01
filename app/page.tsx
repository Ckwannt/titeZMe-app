'use client';

import { useState } from 'react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import useSWR from 'swr';

const fetchBarbers = async () => {
  const q = query(collection(db, 'barberProfiles'), where('searchSnapshot.isLive', '==', true));
  const snap = await getDocs(q);
  
  return snap.docs.map(d => ({
    userId: d.id,
    ...(d.data().searchSnapshot || {}) // Fallback in case searchSnapshot is missing
  }));
};

export default function Home() {
  const [cityFilter, setCityFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  
  const { data: profiles = [], isLoading: loading } = useSWR('searchBarbers', fetchBarbers, {
    dedupingInterval: 300000, // 5 minute cache
  });

  const filtered = profiles.filter((p: any) => {
    let match = true;
    if (cityFilter && !p.city?.toLowerCase().includes(cityFilter.toLowerCase())) match = false;
    if (specialtyFilter && !p.topSpecialties?.some((s: string) => s.toLowerCase().includes(specialtyFilter.toLowerCase()))) match = false;
    return match;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-16">
      <div className="text-center mb-10 md:mb-16 animate-fadeUp">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-tight">
          Find your perfect <span className="text-brand-yellow">cut</span>.
        </h1>
        <p className="text-brand-text-secondary text-base md:text-lg max-w-[500px] mx-auto">
          Book top-rated barbers and shops in your city instantly. Cash only. Zero hassle.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 max-w-[700px] mx-auto mb-12 animate-fadeUp !delay-[50ms]">
        <div className="flex-1 bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl flex items-center px-4 focus-within:border-brand-yellow transition-colors">
          <span className="text-xl mr-2 opacity-50">📍</span>
          <input 
            value={cityFilter} onChange={e => setCityFilter(e.target.value)}
            className="w-full bg-transparent py-3.5 text-[15px] text-white outline-none placeholder:text-[#555] font-bold" 
            placeholder="Search city (e.g. Madrid)..." 
          />
        </div>
        <div className="flex-1 bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl flex items-center px-4 focus-within:border-brand-yellow transition-colors">
          <span className="text-xl mr-2 opacity-50">✂️</span>
          <input 
             value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)}
             className="w-full bg-transparent py-3.5 text-[15px] text-white outline-none placeholder:text-[#555] font-bold" 
             placeholder="Specialty (e.g. Skin Fade)..." 
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-brand-text-secondary animate-pulse font-bold mt-20">Searching...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fadeUp !delay-[100ms]">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20 text-brand-text-secondary text-sm font-bold border-2 border-dashed border-[#2a2a2a] rounded-3xl">
              No results found. Try a different search.
            </div>
          ) : (
            filtered.map((item, i) => (
              <Link href={`/barber/${item.userId}`} key={i} className="group bg-brand-surface border border-brand-border rounded-3xl overflow-hidden hover:border-[#444] transition-all hover:-translate-y-1 block">
                <div className="h-[180px] bg-[#1a1a1a] relative">
                  {item.photos && item.photos.length > 0 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.photos[0]} alt="Barber" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">💈</div>
                  )}
                  {item.isOpenToday ? (
                     <div className="absolute top-4 left-4 bg-brand-green/90 backdrop-blur-sm text-[#0a0a0a] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md">Open Today</div>
                  ) : (
                     <div className="absolute top-4 left-4 bg-[#1a1a1a]/90 backdrop-blur-sm text-brand-text-secondary px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md">Closed For Today</div>
                  )}
                  {item.isSolo && <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">Independent</div>}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-black text-xl leading-tight group-hover:text-brand-yellow transition-colors">
                        {item.name || 'Barber'}
                      </h3>
                      <div className="text-xs text-brand-text-secondary font-bold mt-0.5">{item.city}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 font-black text-brand-yellow text-sm">
                        <span>★</span> {item.rating > 0 ? item.rating.toFixed(1) : 'New'}
                      </div>
                      <div className="text-[10px] text-brand-text-secondary font-bold">({item.reviewCount || 0} reviews)</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 flex-wrap my-3">
                     {item.vibes?.slice(0,2).map((v: string) => <span key={v} className="bg-[#1a1a1a] text-[#888] px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide">{v}</span>)}
                     {item.topSpecialties?.slice(0,2).map((s: string) => <span key={s} className="bg-[#1a1500] text-brand-yellow px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wide">{s}</span>)}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text-secondary mb-3">
                    <span>🌍</span> {item.languages?.join(', ') || 'English'}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-border">
                    <div className="text-sm font-extrabold text-white">
                      {item.lowestPrice ? `From ${item.currency || '€'}${item.lowestPrice}` : 'Pricing N/A'}
                    </div>
                    <div className="text-xs font-black text-brand-orange group-hover:text-brand-yellow transition-colors">
                      View Profile →
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
