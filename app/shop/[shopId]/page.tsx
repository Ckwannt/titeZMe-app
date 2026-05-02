'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function ShopProfilePage() {
  const params = useParams();
  const shopId = params.shopId as string;

  const [shop, setShop] = useState<any>(null);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!shopId) return;

    const fetchShopAndBarbers = async () => {
      try {
        const shopSnap = await getDoc(doc(db, 'barbershops', shopId));
        if (!shopSnap.exists()) {
          setError('Shop not found');
          setLoading(false);
          return;
        }
        setShop({ id: shopSnap.id, ...shopSnap.data() });

        const barbersQuery = query(collection(db, 'barberProfiles'), where('shopId', '==', shopId));
        const barbersSnap = await getDocs(barbersQuery);
        const barbersList = barbersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        
        // Let's also fetch user document for firstName and lastName of the barbers, but for now we only show their names if we have them. 
        // We'll also fetch their user documents:
        const enrichedBarbers = await Promise.all(barbersList.map(async (b) => {
          const uSnap = await getDoc(doc(db, 'users', b.userId));
          if (uSnap.exists()) {
            return { ...b, firstName: uSnap.data().firstName, lastName: uSnap.data().lastName };
          }
          return b;
        }));

        setBarbers(enrichedBarbers);
      } catch (err: any) {
        console.error('Error fetching shop:', err);
        setError('Failed to load shop details.');
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndBarbers();
  }, [shopId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-brand-text-secondary text-sm font-bold">
        Loading...
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🏪</div>
          <h1 className="text-2xl font-black text-white mb-2">Shop Not Found</h1>
          <p className="text-brand-text-secondary text-sm mb-6">{error || "This shop might have moved or closed."}</p>
          <Link href="/" className="text-brand-yellow font-bold text-sm bg-brand-yellow/10 px-6 py-2.5 rounded-full hover:bg-brand-yellow/20 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header Image Area */}
      <div className="h-64 md:h-80 w-full bg-[#141414] border-b border-[#2a2a2a] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-20">🏪</span>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 bg-gradient-to-t from-[#0a0a0a] to-transparent">
          <h1 className="text-3xl md:text-5xl font-black text-white">{shop.name}</h1>
          <p className="text-[#888] text-sm md:text-base mt-2 font-bold">{shop.address.city}, {shop.address.country}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Main Content */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {shop.description && (
            <section>
              <h2 className="text-xs font-extrabold text-brand-text-secondary uppercase tracking-wider mb-3">About Us</h2>
              <p className="text-white text-sm leading-[1.8]">{shop.description}</p>
            </section>
          )}

          <section>
            <h2 className="text-xs font-extrabold text-brand-text-secondary uppercase tracking-wider mb-4">Our Barbers</h2>
            <div className="grid grid-cols-1 gap-4">
              {barbers.length === 0 ? (
                <div className="bg-[#141414] border border-[#2a2a2a] p-6 rounded-2xl text-center text-sm font-bold text-[#888]">
                  No barbers listed yet.
                </div>
              ) : (
                barbers.map(barber => (
                  <div key={barber.id} className="bg-[#141414] border border-[#2a2a2a] p-5 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border border-[#2a2a2a] bg-gradient-to-br from-brand-orange to-brand-yellow flex items-center justify-center text-lg font-black text-[#0a0a0a]">
                        {barber.firstName?.[0] || "B"}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">{barber.firstName} {barber.lastName}</h3>
                        <div className="flex gap-2 text-xs font-bold text-[#888] mt-1 items-center">
                          <span className="text-brand-yellow">★ {barber.rating > 0 ? barber.rating.toFixed(1) : "New"}</span>
                          <span>•</span>
                          <span>{barber.specialties?.[0] || 'Barber'}</span>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={`/book/${barber.id}`}
                      className="bg-[#2a2a2a] text-white px-6 py-2.5 rounded-full font-bold text-xs hover:bg-[#333] transition-colors text-center"
                    >
                      Book cut ✂️
                    </Link>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-6">
            <h3 className="text-xs font-extrabold text-brand-text-secondary uppercase tracking-wider mb-5">Shop Details</h3>
            
            <div className="flex flex-col gap-5">
              <div>
                <div className="text-[10px] font-extrabold text-[#555] mb-1">PHONE</div>
                <div className="text-white text-sm font-bold">{shop.contactPhone}</div>
              </div>
              
              <div>
                <div className="text-[10px] font-extrabold text-[#555] mb-1">ADDRESS</div>
                <div className="text-white text-sm font-bold leading-relaxed">
                  {shop.address.street} {shop.address.number}
                  {shop.address.floor && `, ${shop.address.floor}`}
                  <br />
                  {shop.address.postalCode} {shop.address.city}
                  <br />
                  {shop.address.country}
                </div>
              </div>

              {shop.googleMapsUrl && (
                <a 
                  href={shop.googleMapsUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-brand-yellow text-[#0a0a0a] flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm transition-all hover:opacity-90 mt-2"
                >
                  <span>📍</span> Get Directions
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
