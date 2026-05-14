'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { collection, doc, query, where, updateDoc, deleteDoc, setDoc, getDoc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { barberUpdateSchema } from "@/lib/schemas";

function getCurrencySymbol(c?: string) {
  const s: Record<string, string> = { 'EUR': '€', 'GBP': '£', 'USD': '$', 'MAD': 'MAD ', 'DZD': 'DA ', 'SAR': 'SAR ', 'AED': 'AED ', 'SEK': 'kr ', 'CHF': 'CHF ' };
  return s[(c || 'EUR').toUpperCase()] ?? ((c || 'EUR') + ' ');
}

const CURRENCIES = [
  { code: 'EUR', label: 'EUR (€)' }, { code: 'GBP', label: 'GBP (£)' },
  { code: 'USD', label: 'USD ($)' }, { code: 'MAD', label: 'MAD' },
  { code: 'DZD', label: 'DZD (DA)' }, { code: 'SEK', label: 'SEK (kr)' },
  { code: 'CHF', label: 'CHF' }, { code: 'AED', label: 'AED' },
];
const QUICK_CHIPS = [
  { name: 'Skin Fade', duration: 45 }, { name: 'Beard Trim', duration: 20 },
  { name: 'Classic Cut', duration: 30 }, { name: 'Kids Cut', duration: 25 },
  { name: 'Line Up', duration: 15 }, { name: 'Hot Towel Shave', duration: 30 },
  { name: 'Buzz Cut', duration: 20 }, { name: 'Fade & Beard', duration: 60 },
];

export default function ServicesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [titzData, setTitzData] = useState({ duration: '45', price: '20' });
  const [isSavingTitz, setIsSavingTitz] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editSvcData, setEditSvcData] = useState({ name: '', duration: '', price: '', description: '' });
  const [serviceCurrency, setServiceCurrency] = useState('EUR');
  const [toastMessage, setToastMessage] = useState('');

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => { const s = await getDoc(doc(db, 'barberProfiles', user!.uid)); const d = s.exists() ? s.data() : null; if (d?.titeZMeCut) setTitzData({ duration: d.titeZMeCut.durationMinutes?.toString() || '45', price: d.titeZMeCut.price?.toString() || '20' }); return d; },
    enabled: !!user,
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', user?.uid],
    queryFn: async () => { const q = query(collection(db, 'services'), where('providerId', '==', user!.uid)); const snap = await getDocs(q); return snap.docs.map(d => ({ id: d.id, ...d.data() } as any)); },
    enabled: !!user,
  });

  useEffect(() => { if (profile?.currency) setServiceCurrency(profile.currency); }, [profile?.currency]);

  const mutateProfile = () => queryClient.invalidateQueries({ queryKey: ['profile', user?.uid] });
  const mutateServices = () => queryClient.invalidateQueries({ queryKey: ['services', user?.uid] });

  const toast = (msg: string, ms = 3000) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), ms); };

  const saveTitzCut = async () => {
    if (!user) return; setIsSavingTitz(true);
    try { await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({ titeZMeCut: { durationMinutes: parseInt(titzData.duration) || 45, price: parseFloat(titzData.price) || 20, currency: serviceCurrency } })); mutateProfile(); } catch (e) { console.error(e); }
    setIsSavingTitz(false);
  };

  const addService = async () => {
    if (!newServiceName || !newServicePrice || !user) return;
    if ((services as any[]).some((s: any) => s.name.toLowerCase().trim() === newServiceName.toLowerCase().trim())) { toast(`You already have '${newServiceName}'. Edit the existing one instead.`); return; }
    try {
      await setDoc(doc(collection(db, 'services')), { providerId: user.uid, providerType: 'barber', name: newServiceName, duration: parseInt(newServiceDuration) || 30, price: parseFloat(newServicePrice), description: newServiceDescription.trim(), isActive: true, sortOrder: (services as any[]).length });
      setNewServiceName(''); setNewServicePrice(''); setNewServiceDuration(''); setNewServiceDescription('');
      mutateServices();
    } catch (e) { console.error(e); }
  };

  const saveEditService = async (svcId: string) => {
    try { await updateDoc(doc(db, 'services', svcId), { name: editSvcData.name, duration: parseInt(editSvcData.duration) || 30, price: parseFloat(editSvcData.price) || 0, description: editSvcData.description, updatedAt: Date.now() }); setEditingServiceId(null); toast('Service updated ✓'); mutateServices(); } catch (e) { console.error(e); }
  };

  const toggleServiceActive = async (svcId: string, currentIsActive: boolean) => {
    try { await updateDoc(doc(db, 'services', svcId), { isActive: !currentIsActive }); mutateServices(); } catch (e) { console.error(e); }
  };

  const moveService = async (svcId: string, direction: 'up' | 'down') => {
    const sorted = [...(services as any[])].sort((a: any, b: any) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
    const idx = sorted.findIndex((s: any) => s.id === svcId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sorted.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const batch = writeBatch(db);
    batch.update(doc(db, 'services', sorted[idx].id), { sortOrder: swapIdx });
    batch.update(doc(db, 'services', sorted[swapIdx].id), { sortOrder: idx });
    await batch.commit(); mutateServices();
  };

  const updateServiceCurrency = async (newCurrency: string) => {
    if (!user) return; setServiceCurrency(newCurrency);
    try { await updateDoc(doc(db, 'barberProfiles', user.uid), { currency: newCurrency }); mutateProfile(); toast(`Currency updated to ${newCurrency}`); } catch (e) { console.error(e); }
  };

  const svcSym = getCurrencySymbol(serviceCurrency);
  const sortedServices = [...(services as any[])].sort((a: any, b: any) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  const svcActiveList = (services as any[]).filter((s: any) => s.isActive !== false);
  const svcMin = svcActiveList.length > 0 ? Math.min(...svcActiveList.map((s: any) => s.price || 0)) : 0;
  const svcMax = svcActiveList.length > 0 ? Math.max(...svcActiveList.map((s: any) => s.price || 0)) : 0;

  return (
    <div className="animate-fadeUp p-6 md:p-8 max-w-[600px]">
      <h2 className="text-2xl font-black mb-6">Manage Services</h2>

      <div className="flex flex-col gap-3 mb-8">
        <div className="text-[11px] text-[#555] font-bold mb-1">
          {svcActiveList.length === 0 ? 'No services added yet' : `${svcActiveList.length} active service${svcActiveList.length !== 1 ? 's' : ''} · from ${svcSym}${svcMin} to ${svcSym}${svcMax}`}
        </div>

        {/* titeZMe Cut */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-l-4 border-l-brand-yellow">
          <div className="flex-1">
            <div className="font-black flex items-center gap-1.5">⚡ titeZMe Cut</div>
            <div className="text-[11px] text-brand-text-secondary mt-1 max-w-[220px]">The barber chooses the cut for you based on your vibe and your budget.</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-brand-yellow transition-colors">
              <input value={titzData.duration} onChange={e => setTitzData(p => ({ ...p, duration: e.target.value }))} className="w-14 bg-transparent px-2 py-2 text-white text-xs outline-none text-center border-r-[1.5px] border-[#2a2a2a]" type="number" />
              <span className="text-[10px] font-extrabold text-[#888] self-center px-1.5">MIN</span>
            </div>
            <div className="flex bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-brand-yellow transition-colors">
              <span className="text-[#888] self-center pl-2 text-xs font-extrabold">{svcSym}</span>
              <input value={titzData.price} onChange={e => setTitzData(p => ({ ...p, price: e.target.value }))} className="w-12 bg-transparent px-1 py-2 text-white text-xs outline-none text-center" type="number" />
            </div>
            <button onClick={saveTitzCut} disabled={isSavingTitz} className="text-[10px] font-black bg-brand-yellow text-[#0a0a0a] px-3 py-2 rounded-xl ml-1 disabled:opacity-50 hover:opacity-90">{isSavingTitz ? '...' : 'Save'}</button>
            <span className="text-[#555] text-sm ml-2">🔒</span>
          </div>
        </div>

        {sortedServices.map((svc: any, idx: number) => (
          editingServiceId === svc.id ? (
            <div key={svc.id} className="bg-brand-surface border border-brand-border rounded-2xl p-4">
              <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 mb-2">
                <input value={editSvcData.name} onChange={e => setEditSvcData(p => ({ ...p, name: e.target.value }))} className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-yellow" placeholder="Name" />
                <input value={editSvcData.duration} onChange={e => setEditSvcData(p => ({ ...p, duration: e.target.value }))} className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-yellow" type="number" placeholder="Mins" />
                <input value={editSvcData.price} onChange={e => setEditSvcData(p => ({ ...p, price: e.target.value }))} className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-yellow" type="number" placeholder="Price" />
              </div>
              <textarea value={editSvcData.description} onChange={e => setEditSvcData(p => ({ ...p, description: e.target.value }))} maxLength={150} rows={2} placeholder="Description (optional)" className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-yellow resize-none mb-3" />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setEditingServiceId(null)} className="text-[#555] hover:text-white text-xs font-bold px-3 py-1.5">Cancel</button>
                <button onClick={() => saveEditService(svc.id)} className="bg-brand-yellow text-[#0a0a0a] text-xs font-black px-4 py-1.5 rounded-lg hover:opacity-90">Save</button>
              </div>
            </div>
          ) : (
            <div key={svc.id} className={`bg-brand-surface border border-brand-border rounded-2xl p-4 flex items-center gap-3 ${svc.isActive === false ? 'opacity-50' : ''}`}>
              <div className="flex flex-col gap-0.5 shrink-0">
                <button onClick={() => moveService(svc.id, 'up')} disabled={idx === 0} className="text-[#444] hover:text-[#888] text-xs leading-none disabled:opacity-20">↑</button>
                <button onClick={() => moveService(svc.id, 'down')} disabled={idx === sortedServices.length - 1} className="text-[#444] hover:text-[#888] text-xs leading-none disabled:opacity-20">↓</button>
              </div>
              <label className="relative w-8 h-4 cursor-pointer shrink-0">
                <input type="checkbox" checked={svc.isActive !== false} onChange={() => toggleServiceActive(svc.id, svc.isActive !== false)} className="peer sr-only" />
                <span className="absolute inset-0 bg-[#2a2a2a] rounded-full transition-colors peer-checked:bg-brand-yellow" />
                <span className="absolute w-3 h-3 left-0.5 top-0.5 bg-white rounded-full transition-transform peer-checked:translate-x-4 peer-checked:bg-[#0a0a0a]" />
              </label>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-sm truncate">{svc.name}</div>
                  {svc.isActive === false && <span className="text-[9px] font-extrabold text-[#555] bg-[#1a1a1a] px-1.5 py-0.5 rounded">Hidden</span>}
                </div>
                <div className="text-xs text-brand-text-secondary">{svc.duration} mins</div>
                {svc.description && <div className="text-[11px] text-[#555] mt-0.5 truncate">{svc.description}</div>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="font-black text-brand-yellow">{svcSym}{svc.price}</div>
                <button onClick={() => { setEditingServiceId(svc.id); setEditSvcData({ name: svc.name, duration: String(svc.duration || ''), price: String(svc.price || ''), description: svc.description || '' }); }} className="text-[#444] hover:text-[#888] font-bold text-xs p-1.5">✏️</button>
                <button onClick={async () => { await deleteDoc(doc(db, 'services', svc.id)); mutateServices(); }} className="text-[#555] hover:text-brand-red font-bold text-xs p-1.5">✕</button>
              </div>
            </div>
          )
        ))}
      </div>

      <div id="add-service-form">
        <h3 className="font-extrabold text-sm mb-3">Add New Service</h3>
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-2.5 items-end mb-2">
          <div><label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">NAME</label><input value={newServiceName} onChange={e => setNewServiceName(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" placeholder="E.g. Buzz Cut" /></div>
          <div><label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">MINS</label><input value={newServiceDuration} onChange={e => setNewServiceDuration(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" placeholder="30" /></div>
          <div><label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">PRICE {svcSym}</label><input value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" placeholder="0" /></div>
        </div>
        <div className="mb-2"><label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">DESCRIPTION (optional)</label><textarea value={newServiceDescription} onChange={e => setNewServiceDescription(e.target.value)} maxLength={150} rows={2} placeholder="What does this service include?" className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow resize-none" /><div className="text-[10px] text-[#444] text-right mt-0.5">{newServiceDescription.length}/150</div></div>
        <div className="flex items-center gap-2 mb-3"><label className="text-[10px] font-extrabold text-brand-text-secondary uppercase">Currency:</label><select value={serviceCurrency} onChange={e => updateServiceCurrency(e.target.value)} className="bg-[#141414] border border-[#2a2a2a] text-white text-xs rounded-lg px-3 py-1.5 outline-none focus:border-brand-yellow transition-colors">{CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}</select></div>
        <button onClick={addService} className="bg-brand-yellow text-[#0a0a0a] w-full mt-2 px-7 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90">Add Service</button>
        <div className="mt-4"><div className="text-[10px] text-[#555] font-bold mb-2">Quick add:</div><div className="flex flex-wrap gap-2">{QUICK_CHIPS.map(chip => { const exists = (services as any[]).some((s: any) => s.name.toLowerCase() === chip.name.toLowerCase()); return (<button key={chip.name} disabled={exists} onClick={() => { setNewServiceName(chip.name); setNewServiceDuration(String(chip.duration)); setNewServicePrice(''); document.getElementById('add-service-form')?.scrollIntoView({ behavior: 'smooth' }); }} className={`inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-3 py-1 border transition-colors ${exists ? 'border-[#1e1e1e] text-[#444] bg-[#111] cursor-not-allowed' : 'bg-[#141414] border-dashed border-[#2a2a2a] text-[#666] hover:border-brand-yellow hover:text-brand-yellow cursor-pointer'}`}>{exists ? '✓' : '+'} {chip.name}</button>); })}</div></div>
      </div>

      {toastMessage && <div className="fixed bottom-6 right-6 bg-[#1a0808] border border-brand-yellow/30 text-brand-yellow px-6 py-3 rounded-full font-bold text-sm shadow-xl animate-fadeUp z-50">{toastMessage}</div>}
    </div>
  );
}
