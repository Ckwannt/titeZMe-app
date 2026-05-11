'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Select from 'react-select';
import { Country, City } from 'country-state-city';
import ISO6391 from 'iso-639-1';
import { userUpdateSchema } from "@/lib/schemas";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

export default function ClientSettings() {
  const { user, appUser, loading, refreshUser } = useAuth();
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCityOption, setSelectedCityOption] = useState<any>(null);
  const [phoneCode, setPhoneCode] = useState<any>(null);
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<any>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && (!user || appUser?.role !== 'client')) {
      router.replace('/login');
    }
  }, [user, appUser, loading, router]);

  useEffect(() => {
    if (appUser) {
      setFirstName(appUser.firstName || '');
      setLastName(appUser.lastName || '');
      
      if (appUser.phoneCountryCode) {
        setPhoneCode({ value: appUser.phoneCountryCode, label: `+${appUser.phoneCountryCode}` });
      }
      if (appUser.phone) {
        // Strip the country code prefix to get the raw input
        const codeLen = appUser.phoneCountryCode ? appUser.phoneCountryCode.length + 2 : 0;
        const rawPhone = appUser.phone.slice(codeLen).trim();
        setPhoneNumberInput(rawPhone);
      }
      
      if (appUser.country) {
        const c = Country.getCountryByCode(appUser.country);
        if (c) setSelectedCountry({ value: c.isoCode, label: `${c.flag} ${c.name}` });
      }
      if (appUser.city) {
        setSelectedCityOption({ value: appUser.city, label: appUser.city });
      }
      if (appUser.languages && appUser.languages.length > 0) {
        setSelectedLanguages(appUser.languages.map((l: string) => ({ value: l, label: l })));
      }
    }
  }, [appUser]);

  const countryOptions = useMemo(() => Country.getAllCountries().map(c => ({
    value: c.isoCode,
    label: `${c.flag} ${c.name}`
  })), []);
  
  const phoneCodeOptions = useMemo(() => Country.getAllCountries().map(c => ({
    value: c.phonecode,
    label: `${c.flag} ${c.name} (+${c.phonecode})`
  })), []);

  const languageOptions = useMemo(() => ISO6391.getAllNames().map(name => ({
    value: name,
    label: name
  })), []);

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      background: '#141414',
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
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: '#2a2a2a',
      borderRadius: '6px'
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'white'
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: '#888',
      cursor: 'pointer',
      '&:hover': {
        color: '#FFD700',
        backgroundColor: 'transparent'
      }
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !appUser) return;
    
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg("First name and last name are required.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const updateData: any = {
        firstName: firstName.trim(),
        lastName: lastName.trim()
      };

      if (phoneCode && phoneNumberInput) {
        updateData.phone = `+${phoneCode.value} ${phoneNumberInput}`;
        updateData.phoneCountryCode = phoneCode.value;
      }
      if (selectedCountry) updateData.country = selectedCountry.value;
      if (selectedCityOption) updateData.city = selectedCityOption.value;
      if (selectedLanguages.length > 0) {
        updateData.languages = selectedLanguages.map((l: any) => l.value);
      }

      await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse(updateData));
      await refreshUser();
      toast.success("Profile updated ✓");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG and WEBP formats are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading photo...");

    try {
      const storage = getStorage();
      const photoRef = ref(storage, `profile-photos/${user.uid}/profile.jpg`);
      await uploadBytes(photoRef, file);
      const url = await getDownloadURL(photoRef);
      
      await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse({ photoUrl: url }));
      await refreshUser();
      toast.success("Photo uploaded successfully ✓", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-brand-text-secondary">Loading...</div>;

  return (
    <div className="flex min-h-[calc(100vh-53px)] flex-col md:flex-row">
      <div className="w-full md:w-[220px] md:border-r border-brand-border p-6 shrink-0 flex flex-col">
        <div className="flex items-center gap-3 mb-7 px-2">
          {appUser?.photoUrl ? (
            <Image 
              src={appUser.photoUrl} 
              alt="Profile" 
              width={40} 
              height={40} 
              className="w-10 h-10 rounded-xl object-cover" 
              style={{ objectFit: 'contain' }} 
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#111] flex items-center justify-center font-black text-base text-white">
              {appUser?.firstName?.[0] || "C"}
            </div>
          )}
          <div>
            <div className="font-extrabold text-sm">{appUser?.firstName} {appUser?.lastName?.charAt(0)}.</div>
            <div className="text-[11px] text-brand-text-secondary font-bold">Client</div>
          </div>
        </div>
        
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <button 
            onClick={() => router.push('/dashboard/client')}
            className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 text-[#888] hover:bg-[#1a1a1a] hover:text-white`}
          >
            <span>📅</span> My Bookings
          </button>
          <button 
            className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 bg-[#1a1a1a] text-brand-yellow`}
          >
            <span>⚙️</span> Settings
          </button>
        </div>

        <div className="mt-auto hidden md:block">
          <DeleteAccountButton role="client" />
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 md:px-10 overflow-y-auto max-h-[calc(100vh-53px)]">
        <div className="animate-fadeUp max-w-[700px]">
          <h2 className="text-2xl font-black mb-6">Settings</h2>

          <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-lg mb-4">Profile Photo</h3>
            <div className="flex items-center gap-6">
              {appUser?.photoUrl ? (
                <Image 
                  src={appUser.photoUrl} 
                  alt="Profile" 
                  width={80} 
                  height={80} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#2a2a2a]" 
                  style={{ objectFit: 'contain' }} 
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#111] flex items-center justify-center font-black text-2xl text-white border-2 border-[#2a2a2a]">
                  {appUser?.firstName?.[0] || "C"}
                </div>
              )}
              <div>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                />
                <button 
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl text-sm font-bold border border-[#2a2a2a] hover:border-brand-yellow transition-colors"
                >
                  {isUploading ? 'Uploading...' : 'Upload new photo'}
                </button>
                <div className="text-xs text-[#888] mt-2 font-bold">JPG, PNG, WEBP. Max 5MB.</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="bg-brand-surface border border-brand-border rounded-2xl p-6 mb-8 flex flex-col gap-5">
            <h3 className="font-bold text-lg mb-2">Personal Info</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">FIRST NAME <span className="text-brand-red">*</span></label>
                <input 
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]" 
                />
              </div>
              <div>
                <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">LAST NAME <span className="text-brand-red">*</span></label>
                <input 
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]" 
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">PHONE NUMBER</label>
              <div className="flex gap-2">
                <div className="flex-none w-[120px]">
                  <Select 
                    options={phoneCodeOptions} 
                    value={phoneCode}
                    onChange={setPhoneCode}
                    styles={{
                      ...selectStyles, 
                      control: (base: any, state: any) => ({
                        ...base,
                        background: '#141414',
                        borderColor: state.isFocused ? '#FFD700' : '#2a2a2a',
                        borderRadius: '0.75rem',
                        padding: '2px',
                        color: 'white',
                        boxShadow: 'none',
                        minHeight: '52px'
                      })
                    }}
                    placeholder="Code"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text"
                    inputMode="numeric"
                    value={phoneNumberInput}
                    onChange={e => setPhoneNumberInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]" 
                    placeholder="600 000 000" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">LOCATION</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Select 
                    options={countryOptions} 
                    value={selectedCountry}
                    onChange={(option) => {
                      setSelectedCountry(option);
                      setSelectedCityOption(null);
                    }}
                    styles={{
                      ...selectStyles,
                      control: (base: any, state: any) => ({
                        ...base,
                        background: '#141414',
                        borderColor: state.isFocused ? '#FFD700' : '#2a2a2a',
                        borderRadius: '0.75rem',
                        padding: '8px',
                        color: 'white',
                        boxShadow: 'none',
                      })
                    }}
                    placeholder="Country..."
                  />
                </div>
                <div>
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
                    styles={{
                      ...selectStyles,
                      control: (base: any, state: any) => ({
                        ...base,
                        background: '#141414',
                        borderColor: state.isFocused ? '#FFD700' : '#2a2a2a',
                        borderRadius: '0.75rem',
                        padding: '8px',
                        color: 'white',
                        boxShadow: 'none',
                      })
                    }}
                    placeholder="City..."
                  />
                </div>
              </div>
            </div>

            <div>
               <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">LANGUAGES SPOKEN</label>
               <Select 
                  isMulti
                  options={languageOptions} 
                  value={selectedLanguages}
                  onChange={setSelectedLanguages}
                  styles={{
                    ...selectStyles,
                    control: (base: any, state: any) => ({
                      ...base,
                      background: '#141414',
                      borderColor: state.isFocused ? '#FFD700' : '#2a2a2a',
                      borderRadius: '0.75rem',
                      padding: '8px',
                      color: 'white',
                      boxShadow: 'none',
                    })
                  }}
                  placeholder="Select languages..."
               />
            </div>

            {errorMsg && (
              <div className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-xl px-4 py-3 text-xs font-bold leading-tight">
                {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-brand-yellow text-black mt-2 px-7 py-3.5 rounded-full font-black text-sm transition-all hover:opacity-90 disabled:opacity-50 self-start"
            >
              {isSubmitting ? 'Saving...' : "Save changes"}
            </button>
          </form>

          <div className="bg-[#1a0808] border border-brand-red/30 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-brand-red mb-2">Delete Account</h3>
            <p className="text-[#888] text-sm mb-6 max-w-sm font-bold">
              This permanently deletes your account, all your bookings, reviews and data. Cannot be undone.
            </p>
            <div className="inline-block">
              {/* Wrapping inside a container to stylize identically to DeleteAccountButton if necessary or let DeleteAccountButton handle itself */}
              <DeleteAccountButton role="client" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
