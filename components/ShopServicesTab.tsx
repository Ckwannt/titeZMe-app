'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { barbershopUpdateSchema, serviceSchema } from "@/lib/schemas";

interface ShopServicesTabProps {
  services: any[];
  mutateServices: () => void;
  shop: any;
  mutateShop: () => void;
}

export function ShopServicesTab({ services = [], mutateServices, shop, mutateShop }: ShopServicesTabProps) {
  const { user } = useAuth();
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("");
  const [isSavingTitz, setIsSavingTitz] = useState(false);

  const [titzData, setTitzData] = useState({
    duration: shop?.titeZMeCut?.durationMinutes?.toString() || "45",
    price: shop?.titeZMeCut?.price?.toString() || "20"
  });

  const handleCreateService = async () => {
    if (!newServiceName || !newServicePrice || !newServiceDuration || !user) return;
    try {
      await addDoc(collection(db, 'services'), serviceSchema.parse({
              providerId: user.uid,
              providerType: 'shop',
              name: newServiceName,
              price: Number(newServicePrice),
              currency: 'EUR',
              durationMinutes: Number(newServiceDuration),
              createdAt: new Date().toISOString()
            }));
      setNewServiceName("");
      setNewServicePrice("");
      setNewServiceDuration("");
      mutateServices();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      mutateServices();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveTitzCut = async () => {
    if (!user) return;
    setIsSavingTitz(true);
    try {
      await updateDoc(doc(db, 'barbershops', user.uid), barbershopUpdateSchema.parse({
              titeZMeCut: {
                durationMinutes: Number(titzData.duration),
                price: Number(titzData.price),
                currency: 'EUR'
              }
            }));
      mutateShop();
    } catch (e) {
      console.error(e);
    }
    setIsSavingTitz(false);
  };

  return (
    <div className="animate-fadeUp max-w-2xl">
      <h1 className="text-2xl font-black mb-2">Services ✂️</h1>
      <p className="text-brand-text-secondary text-sm mb-8">Manage the services offered by your shop.</p>

      {/* LOCKED TITEZME CUT */}
      <div className="bg-[#141414] border border-[#2a2a2a] border-l-4 border-l-brand-yellow rounded-xl p-5 mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-lg text-brand-yellow">titeZMe Cut</span>
              <span className="text-brand-text-secondary text-xs">🔒 Locked</span>
            </div>
            <p className="text-[#888] text-xs max-w-sm">
              The barber chooses the cut based on the client&apos;s vibe and budget. You can only edit the duration and price.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-end gap-3 mt-4">
          <div>
            <label className="text-[10px] font-bold text-[#888] uppercase block mb-1">Duration (min)</label>
            <input 
              type="number" 
              value={titzData.duration}
              onChange={(e) => setTitzData({...titzData, duration: e.target.value})}
              className="bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg px-3 py-2 w-20 text-sm"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#888] uppercase block mb-1">Price (€)</label>
            <input 
              type="number" 
              value={titzData.price}
              onChange={(e) => setTitzData({...titzData, price: e.target.value})}
              className="bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg px-3 py-2 w-20 text-sm"
            />
          </div>
          <button 
            onClick={handleSaveTitzCut}
            disabled={isSavingTitz}
            className="ml-auto bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors"
          >
            {isSavingTitz ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <h2 className="font-black text-lg mb-4">Shop Services</h2>
      <div className="flex flex-col gap-3 mb-8">
        {services.length === 0 ? (
          <div className="text-brand-text-secondary text-sm">No regular services added yet.</div>
        ) : (
          services.map(s => (
            <div key={s.id} className="bg-brand-surface border border-brand-border rounded-xl p-4 flex justify-between items-center group">
              <div>
                <div className="font-bold text-base mb-1">{s.name}</div>
                <div className="text-xs font-medium text-brand-text-secondary">{s.durationMinutes} mins · {s.currency === 'EUR' ? '€' : s.currency}{s.price}</div>
              </div>
              <button 
                onClick={() => handleDeleteService(s.id)}
                className="w-8 h-8 rounded-full border border-transparent flex items-center justify-center text-xl text-[#555] hover:text-brand-red hover:bg-[#1a0808] transition-colors"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5">
        <h3 className="font-extrabold text-sm mb-4">Add New Service</h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
          <div className="sm:col-span-6">
            <input 
              type="text" 
              placeholder="Service Name (e.g. Skin Fade)" 
              value={newServiceName}
              onChange={e => setNewServiceName(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            />
          </div>
          <div className="sm:col-span-3">
            <input 
              type="number" 
              placeholder="Mins" 
              value={newServiceDuration}
              onChange={e => setNewServiceDuration(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            />
          </div>
          <div className="sm:col-span-3 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888] font-medium text-sm">€</span>
            <input 
              type="number" 
              placeholder="Price" 
              value={newServicePrice}
              onChange={e => setNewServicePrice(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-8 pr-4 py-3 text-white text-sm"
            />
          </div>
        </div>
        <button 
          onClick={handleCreateService}
          disabled={!newServiceName || !newServicePrice || !newServiceDuration}
          className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Add Service
        </button>
      </div>
    </div>
  );
}
