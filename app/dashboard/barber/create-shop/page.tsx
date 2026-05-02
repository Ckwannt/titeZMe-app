'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function CreateShopPage() {
  const router = useRouter();
  const { user, appUser, loading } = useAuth();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  if (loading) return null;

  if (!user || appUser?.role !== 'barber') {
    router.replace('/');
    return null;
  }

  if (appUser?.ownsShop) {
    router.replace('/dashboard/shop');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !country || !city || !street) {
      setErrorStatus('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorStatus('');

    try {
      const shopRef = doc(db, 'barbershops', user.uid);
      await setDoc(shopRef, {
        ownerId: user.uid,
        name: name,
        contactPhone: phone,
        address: {
          street: street,
          city: city,
          country: country
        },
        description: description,
        photos: [],
        status: 'active',
        barbers: [],
        createdAt: Date.now()
      });

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ownsShop: true
      });

      const profileRef = doc(db, 'barberProfiles', user.uid);
      await updateDoc(profileRef, {
        ownsShop: true,
        shopId: user.uid
      });

      router.push('/dashboard/shop');
    } catch (err: any) {
      console.error("Error creating shop", err);
      setErrorStatus(err.message || 'Failed to create shop.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-53px)] bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[#141414] border border-[#2a2a2a] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/barber" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#888] hover:text-white transition-colors">
            ←
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white leading-tight">Create Shop Profile</h1>
            <p className="text-[#888] text-sm mt-1">Set up your barbershop on titeZMe</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">SHOP NAME <span className="text-brand-red">*</span></label>
            <input 
              required
              value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
              placeholder="e.g. Fade Factory" 
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">CONTACT PHONE <span className="text-brand-red">*</span></label>
            <input 
              required
              value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
              placeholder="+1 234 567 8900" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">COUNTRY <span className="text-brand-red">*</span></label>
              <input 
                required
                value={country} onChange={e => setCountry(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
                placeholder="Country" 
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">CITY <span className="text-brand-red">*</span></label>
              <input 
                required
                value={city} onChange={e => setCity(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
                placeholder="City" 
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">STREET ADDRESS <span className="text-brand-red">*</span></label>
            <input 
              required
              value={street} onChange={e => setStreet(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
              placeholder="123 Main St" 
            />
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">DESCRIPTION</label>
            <textarea 
              value={description} onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow resize-none" 
              placeholder="Tell clients what makes your shop special..." 
            />
          </div>

          {errorStatus && (
            <div className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-xl px-4 py-3 text-xs font-bold leading-tight">
              {errorStatus}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-brand-yellow text-[#0a0a0a] w-full mt-2 px-7 py-3.5 rounded-xl font-black text-[15px] transition-all hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create My Shop 🏪'}
          </button>
        </form>
      </div>
    </div>
  );
}
