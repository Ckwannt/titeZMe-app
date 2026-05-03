'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

import Select from "react-select";
import { Country, City } from "country-state-city";
import { barberUpdateSchema, userUpdateSchema, barbershopSchema } from "@/lib/schemas";

export default function CreateShopPage() {
  const router = useRouter();
  const { user, appUser, loading } = useAuth();
  
  const [name, setName] = useState('');
  
  const [phoneCode, setPhoneCode] = useState<any>(null);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCityOption, setSelectedCityOption] = useState<any>(null);

  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [floor, setFloor] = useState('');

  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState('');

  const countryOptions = useMemo(() => Country.getAllCountries().map(c => ({
    value: c.isoCode,
    label: `${c.flag} ${c.name}`
  })), []);
  
  const phoneCodeOptions = useMemo(() => Country.getAllCountries().map(c => ({
    value: c.phonecode,
    label: `${c.flag} ${c.name} (+${c.phonecode})`
  })), []);

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      background: '#0a0a0a',
      borderColor: state.isFocused ? '#FFD700' : '#2a2a2a',
      borderRadius: '0.75rem',
      padding: '2px',
      color: 'white',
      boxShadow: 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#FFD700' : '#2a2a2a',
      }
    }),
    menu: (base: any) => ({
      ...base,
      background: '#141414',
      border: '1.5px solid #2a2a2a',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      zIndex: 50
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#2a2a2a' : '#141414',
      color: 'white',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#2a2a2a'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'white'
    }),
    input: (base: any) => ({
      ...base,
      color: 'white'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#444'
    }),
  };

  const googleMapsUrl = useMemo(() => {
    if (!street || !buildingNumber || !postalCode || !selectedCityOption || !selectedCountry) return '';
    const query = `${street} ${buildingNumber} ${postalCode} ${selectedCityOption.value} ${selectedCountry.label.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]\s*/g, '')}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }, [street, buildingNumber, postalCode, selectedCityOption, selectedCountry]);

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
    if (!name || !phoneCode || !phoneNumberInput || !selectedCountry || !selectedCityOption || !street || !buildingNumber || !postalCode) {
      setErrorStatus('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorStatus('');

    try {
      const shopRef = doc(db, 'barbershops', user.uid);
      await setDoc(shopRef, barbershopSchema.parse({
              ownerId: user.uid,
              name: name,
              contactPhone: `+${phoneCode.value} ${phoneNumberInput}`,
              address: {
                street: street,
                number: buildingNumber,
                postalCode: postalCode,
                floor: floor || '',
                city: selectedCityOption.value,
                country: selectedCountry.label.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]\s*/g, '')
              },
              googleMapsUrl: googleMapsUrl,
              description: description,
              photos: [],
              status: 'active',
              barbers: [],
              createdAt: Date.now()
            }));

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, userUpdateSchema.parse({
              ownsShop: true
            }));

      const profileRef = doc(db, 'barberProfiles', user.uid);
      await updateDoc(profileRef, barberUpdateSchema.parse({
              ownsShop: true,
              shopId: user.uid
            }));

      router.push('/dashboard/shop');
    } catch (err: any) {
      console.error("Error creating shop", err);
      setErrorStatus(err.message || 'Failed to create shop.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-53px)] bg-[#0a0a0a] flex items-center justify-center p-6 pb-20">
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
            <div className="flex gap-2">
              <div className="flex-none w-1/3">
                <Select 
                  options={phoneCodeOptions} 
                  value={phoneCode}
                  onChange={setPhoneCode}
                  styles={selectStyles}
                  placeholder="Code"
                />
              </div>
              <div className="flex-1">
                <input 
                  type="text"
                  inputMode="numeric"
                  value={phoneNumberInput}
                  onChange={e => setPhoneNumberInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#0a0a0a] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]" 
                  placeholder="600 000 000" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">COUNTRY <span className="text-brand-red">*</span></label>
              <Select 
                options={countryOptions} 
                value={selectedCountry}
                onChange={(option) => {
                  setSelectedCountry(option);
                  setSelectedCityOption(null);
                }}
                styles={selectStyles}
                placeholder="Country..."
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">CITY <span className="text-brand-red">*</span></label>
              <Select 
                options={selectedCountry ? 
                  City.getCitiesOfCountry(selectedCountry.value)?.map(c => ({
                    value: c.name,
                    label: c.name
                  })) || [] 
                  : []
                } 
                value={selectedCityOption}
                onChange={setSelectedCityOption}
                isDisabled={!selectedCountry}
                styles={selectStyles}
                placeholder="City..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">STREET NAME <span className="text-brand-red">*</span></label>
              <input 
                required
                value={street} onChange={e => setStreet(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
                placeholder="Calle Gran Vía" 
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">NUMBER <span className="text-brand-red">*</span></label>
              <input 
                required
                value={buildingNumber} onChange={e => setBuildingNumber(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
                placeholder="42" 
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">POSTAL CODE <span className="text-brand-red">*</span></label>
              <input 
                required
                value={postalCode} onChange={e => setPostalCode(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
                placeholder="28013" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">FLOOR / SUITE (Optional)</label>
              <input 
                value={floor} onChange={e => setFloor(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" 
                placeholder="Local 3, 2nd floor..." 
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">GOOGLE MAPS LINK</label>
            <input 
              readOnly
              value={googleMapsUrl}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-[#555] text-xs outline-none cursor-not-allowed" 
              placeholder="Auto-generated based on address..." 
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
