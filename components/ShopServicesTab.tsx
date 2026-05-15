'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { barbershopUpdateSchema, serviceSchema } from "@/lib/schemas";

function getCurrencySymbol(c?: string): string {
  const m: Record<string, string> = { EUR: '€', GBP: '£', USD: '$', MAD: 'MAD ', DZD: 'DA ', TND: 'DT ', SAR: 'SAR ', AED: 'AED ' };
  return m[(c || 'EUR').toUpperCase()] ?? '€';
}

const QUICK_CHIPS = ['Skin Fade', 'Beard Trim', 'Classic Cut', 'Kids Cut', 'Line Up', 'Hot Towel Shave', 'Buzz Cut', 'Fade & Beard'];

interface ShopServicesTabProps {
  services: any[];
  mutateServices: () => void;
  shop: any;
  mutateShop: () => void;
}

export function ShopServicesTab({ services = [], mutateServices, shop, mutateShop }: ShopServicesTabProps) {
  const { user } = useAuth();
  const currSym = getCurrencySymbol(shop?.currency);

  // Add form
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');
  const [addError, setAddError] = useState('');

  // titeZMe Cut
  const [isSavingTitz, setIsSavingTitz] = useState(false);
  const [titzData, setTitzData] = useState({
    duration: shop?.titeZMeCut?.durationMinutes?.toString() || '45',
    price: shop?.titeZMeCut?.price?.toString() || '20',
  });

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDuration, setEditDuration] = useState('');

  // ── Add service ──────────────────────────────────────────────────────────
  const handleCreateService = async (name = newServiceName, price = newServicePrice, duration = newServiceDuration) => {
    if (!name || !price || !duration || !user) return;
    // Duplicate check
    const exists = services.some(s => s.name.toLowerCase() === name.toLowerCase() && s.isActive !== false);
    if (exists) { setAddError(`"${name}" already exists.`); return; }
    setAddError('');
    try {
      await addDoc(collection(db, 'services'), serviceSchema.parse({
        providerId: user.uid,
        providerType: 'shop',
        name,
        price: Number(price),
        currency: shop?.currency || 'EUR',
        durationMinutes: Number(duration),
        isActive: true,
        createdAt: new Date().toISOString(),
      }));
      setNewServiceName(''); setNewServicePrice(''); setNewServiceDuration('');
      mutateServices();
    } catch (e) { console.error(e); }
  };

  const handleDeleteService = async (id: string) => {
    try { await deleteDoc(doc(db, 'services', id)); mutateServices(); } catch (e) { console.error(e); }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try { await updateDoc(doc(db, 'services', id), { isActive: !current }); mutateServices(); } catch (e) { console.error(e); }
  };

  const startEdit = (s: any) => {
    setEditingId(s.id); setEditName(s.name); setEditPrice(String(s.price)); setEditDuration(String(s.durationMinutes));
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName || !editPrice || !editDuration) return;
    try {
      await updateDoc(doc(db, 'services', id), { name: editName, price: Number(editPrice), durationMinutes: Number(editDuration) });
      setEditingId(null); mutateServices();
    } catch (e) { console.error(e); }
  };

  // ── titeZMe Cut ──────────────────────────────────────────────────────────
  const handleSaveTitzCut = async () => {
    if (!user) return;
    setIsSavingTitz(true);
    try {
      await updateDoc(doc(db, 'barbershops', user.uid), barbershopUpdateSchema.parse({
        titeZMeCut: { durationMinutes: Number(titzData.duration), price: Number(titzData.price), currency: shop?.currency || 'EUR' },
      }));
      mutateShop();
    } catch (e) { console.error(e); }
    setIsSavingTitz(false);
  };

  // Summary line
  const activeServices = services.filter(s => s.isActive !== false);
  const prices = activeServices.map(s => Number(s.price)).filter(p => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;

  return (
    <div className="animate-fadeUp max-w-2xl">
      <h1 className="text-2xl font-black mb-2">Services ✂️</h1>
      <p className="text-brand-text-secondary text-sm mb-8">Manage the services offered by your shop.</p>

      {/* Summary line */}
      {activeServices.length > 0 && (
        <div className="text-[12px] text-[#888] font-bold mb-5">
          {activeServices.length} active service{activeServices.length !== 1 ? 's' : ''}
          {minPrice !== null && ` · from ${currSym}${minPrice} to ${currSym}${maxPrice}`}
        </div>
      )}

      {/* TITEZME CUT */}
      <div className="bg-[#141414] border border-[#2a2a2a] border-l-4 border-l-brand-yellow rounded-xl p-5 mb-8">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-black text-lg text-brand-yellow">titeZMe Cut</span>
              <span className="text-brand-text-secondary text-xs">🔒 Locked</span>
            </div>
            <p className="text-[#888] text-xs max-w-sm">The barber chooses the cut based on the client&apos;s vibe and budget. You can only edit the duration and price.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-3 mt-4">
          <div>
            <label className="text-[10px] font-bold text-[#888] uppercase block mb-1">Duration (min)</label>
            <input type="number" value={titzData.duration} onChange={(e) => setTitzData({ ...titzData, duration: e.target.value })}
              className="bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg px-3 py-2 w-20 text-sm" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-[#888] uppercase block mb-1">Price ({currSym})</label>
            <input type="number" value={titzData.price} onChange={(e) => setTitzData({ ...titzData, price: e.target.value })}
              className="bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg px-3 py-2 w-20 text-sm" />
          </div>
          <button onClick={handleSaveTitzCut} disabled={isSavingTitz}
            className="ml-auto bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors">
            {isSavingTitz ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* SHOP SERVICES LIST */}
      <h2 className="font-black text-lg mb-4">Shop Services</h2>
      <div className="flex flex-col gap-3 mb-8">
        {services.length === 0 ? (
          <div className="text-brand-text-secondary text-sm">No regular services added yet.</div>
        ) : (
          services.map(s => {
            const isActive = s.isActive !== false;
            const isEditing = editingId === s.id;
            return (
              <div key={s.id} className={`bg-brand-surface border rounded-xl p-4 transition-all ${isActive ? 'border-brand-border' : 'border-[#1a1a1a] opacity-50'}`}>
                {isEditing ? (
                  /* Inline edit form */
                  <div className="flex flex-wrap gap-2 items-center">
                    <input value={editName} onChange={e => setEditName(e.target.value)}
                      className="flex-1 min-w-[120px] bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg px-3 py-1.5 text-sm" />
                    <input type="number" value={editDuration} onChange={e => setEditDuration(e.target.value)}
                      className="w-16 bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg px-2 py-1.5 text-sm" placeholder="Min" />
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888] text-xs">{currSym}</span>
                      <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)}
                        className="w-20 bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg pl-6 pr-2 py-1.5 text-sm" />
                    </div>
                    <button onClick={() => handleSaveEdit(s.id)}
                      className="text-[11px] font-black text-brand-green border border-brand-green/40 px-3 py-1.5 rounded-lg hover:bg-[#0f2010] transition-colors">Save</button>
                    <button onClick={() => setEditingId(null)}
                      className="text-[11px] font-bold text-[#888] hover:text-white px-2">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-base mb-0.5">{s.name}</div>
                      <div className="text-xs text-brand-text-secondary">{s.durationMinutes} min · {currSym}{s.price}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Active toggle */}
                      <button onClick={() => handleToggleActive(s.id, isActive)}
                        className={`relative w-9 h-5 rounded-full transition-colors ${isActive ? 'bg-brand-green' : 'bg-[#2a2a2a]'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${isActive ? 'left-4' : 'left-0.5'}`} />
                      </button>
                      {/* Edit */}
                      <button onClick={() => startEdit(s)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-[#555] hover:text-brand-yellow hover:bg-[#1a1500] transition-colors">
                        ✏️
                      </button>
                      {/* Delete */}
                      <button onClick={() => handleDeleteService(s.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#555] hover:text-brand-red hover:bg-[#1a0808] transition-colors text-lg">
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD SERVICE FORM */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5">
        <h3 className="font-extrabold text-sm mb-4">Add New Service</h3>
        {addError && (
          <div className="text-brand-red text-xs font-bold mb-3 bg-[#1a0808] border border-[#3b1a1a] rounded-lg px-3 py-2">{addError}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">
          <div className="sm:col-span-6">
            <input type="text" placeholder="Service Name (e.g. Skin Fade)" value={newServiceName}
              onChange={e => { setNewServiceName(e.target.value); setAddError(''); }}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm" />
          </div>
          <div className="sm:col-span-3">
            <input type="number" placeholder="Mins" value={newServiceDuration}
              onChange={e => setNewServiceDuration(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm" />
          </div>
          <div className="sm:col-span-3 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888] font-medium text-sm">{currSym}</span>
            <input type="number" placeholder="Price" value={newServicePrice}
              onChange={e => setNewServicePrice(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl pl-8 pr-4 py-3 text-white text-sm" />
          </div>
        </div>
        <button onClick={() => handleCreateService()}
          disabled={!newServiceName || !newServicePrice || !newServiceDuration}
          className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors mb-4">
          Add Service
        </button>

        {/* Quick-add chips */}
        <div className="flex flex-wrap gap-2">
          {QUICK_CHIPS.map(chip => {
            const alreadyExists = services.some(s => s.name.toLowerCase() === chip.toLowerCase());
            if (alreadyExists) return null;
            return (
              <button key={chip}
                onClick={() => { setNewServiceName(chip); setAddError(''); }}
                className="text-[11px] font-bold bg-[#1a1a1a] text-[#888] hover:bg-[#222] hover:text-white px-3 py-1.5 rounded-full transition-colors">
                + {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info note */}
      <div className="mt-5 bg-[#0d0d0d] border border-[#1e1e1e] rounded-[10px] px-[14px] py-[10px]">
        <p className="text-[11px] text-[#555]">
          💡 These services and prices apply to all bookings made through your shop. Each barber can also set their own solo prices separately.
        </p>
      </div>
    </div>
  );
}
