'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import Select from "react-select";
import { Country, City } from "country-state-city";
import ISO6391 from "iso-639-1";

interface BarberSettingsTabProps {
  profile: any;
  mutateProfile: () => void;
}

export function BarberSettingsTab({ profile, mutateProfile }: BarberSettingsTabProps) {
  const { user, appUser } = useAuth();
  const [photoLoading, setPhotoLoading] = useState(false);
  const [localPhotoUrl, setLocalPhotoUrl] = useState('');
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    firstName: appUser?.firstName || '',
    lastName: appUser?.lastName || '',
    bio: profile?.bio || '',
  });

  const existingPhoneParts = (profile?.phone || '').split(' ');
  const initPhoneCodeStr = existingPhoneParts[0]?.replace('+', '') || '';
  const initPhoneNumStr = existingPhoneParts.length > 1 ? existingPhoneParts.slice(1).join('') : (existingPhoneParts[0] && !existingPhoneParts[0].startsWith('+') ? existingPhoneParts[0] : '');

  const [phoneNumberInput, setPhoneNumberInput] = useState(initPhoneNumStr);
  const [phoneCode, setPhoneCode] = useState<any>(null);
  
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCityOption, setSelectedCityOption] = useState<any>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<any>([]);

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
  
  useEffect(() => {
    if (initPhoneCodeStr) {
      const match = phoneCodeOptions.find(o => o.value === initPhoneCodeStr);
      if (match) setPhoneCode(match);
    }
    if (profile?.country) {
      const match = countryOptions.find(o => o.value === profile.country);
      if (match) setSelectedCountry(match);
    }
    if (profile?.languages?.length) {
      const matches = languageOptions.filter(o => profile.languages.includes(o.value));
      setSelectedLanguages(matches);
    }
  }, [initPhoneCodeStr, profile?.country, profile?.languages, phoneCodeOptions, countryOptions, languageOptions]);

  useEffect(() => {
    if (profile?.city && selectedCountry) {
      const cities = City.getCitiesOfCountry(selectedCountry.value) || [];
      const match = cities.find(c => c.name === profile.city);
      if (match) {
        setSelectedCityOption({ value: match.name, label: match.name });
      } else if (profile.city) {
        setSelectedCityOption({ value: profile.city, label: profile.city });
      }
    }
  }, [profile?.city, selectedCountry]);

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

  const [socialData, setSocialData] = useState({
    instagram: profile?.instagram || '',
    facebook: profile?.facebook || '',
    tiktok: profile?.tiktok || ''
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Only jpg, png, and webp images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Profile photo size must be less than 5MB.');
      return;
    }

    setPhotoLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Always same filename to overwrite
    const storageRef = ref(storage, `profile-photos/${user.uid}/profile.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      null, 
      (error) => {
        setPhotoLoading(false);
        setErrorMsg('Upload failed. Please try again.');
        console.error("Upload Error:", error);
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, 'users', user.uid), { photoUrl: downloadURL });
          await updateDoc(doc(db, 'barberProfiles', user.uid), { profilePhotoUrl: downloadURL });
          setLocalPhotoUrl(downloadURL);
          mutateProfile();
          setSuccessMsg('Profile photo updated!');
        } catch (err) {
           console.error("Database Update Error:", err);
           setErrorMsg('Failed to update profile photo URL in database.');
        }
        setPhotoLoading(false);
      }
    );
  };

  const handleSaveInfo = async () => {
    if (!user) return;
    setSavingGlobal(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const phoneStr = phoneCode && phoneNumberInput ? `+${phoneCode.value} ${phoneNumberInput}` : null;
      const cityStr = selectedCityOption ? selectedCityOption.value : "";
      const countryStr = selectedCountry ? selectedCountry.value : "";
      const langArr = selectedLanguages.length ? selectedLanguages.map((l: any) => l.value) : [];

      await updateDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: phoneStr,
        phoneCountryCode: phoneCode ? phoneCode.value : null,
        city: cityStr,
        country: countryStr,
        languages: langArr
      });
      await updateDoc(doc(db, 'barberProfiles', user.uid), {
        phone: phoneStr,
        city: cityStr,
        country: countryStr,
        bio: formData.bio,
        languages: langArr,
      });
      mutateProfile();
      setSuccessMsg('Personal info saved!');
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to save personal info.');
    }
    setSavingGlobal(false);
  };

  const handleSaveSocial = async () => {
    if (!user) return;
    setSavingSocial(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updateDoc(doc(db, 'barberProfiles', user.uid), {
        instagram: socialData.instagram,
        facebook: socialData.facebook,
        tiktok: socialData.tiktok
      });
      mutateProfile();
      setSuccessMsg('Social links saved!');
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to save social links.');
    }
    setSavingSocial(false);
  };

  const currentPhoto = localPhotoUrl || profile?.profilePhotoUrl || appUser?.photoUrl;

  return (
    <div className="animate-fadeUp max-w-2xl">
      <h1 className="text-2xl font-black mb-2">Settings ⚙️</h1>
      <p className="text-brand-text-secondary text-sm mb-8">Manage your public profile and preferences.</p>

      {errorMsg && (
        <div className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-xl px-4 py-3 text-sm font-bold mb-6">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-[#0f2010] border border-[#1b3b1c] text-brand-green rounded-xl px-4 py-3 text-sm font-bold mb-6">
          {successMsg}
        </div>
      )}

      {/* SECTION B: PROFILE PHOTO */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] shrink-0">
            {currentPhoto ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentPhoto} alt={appUser?.firstName || 'Profile'} className="w-full h-full object-cover" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-[#555] uppercase">
                {appUser?.firstName?.[0] || 'B'}
              </div>
            )}
          </div>
          <div>
            <label className={`bg-[#1a1a1a] text-white px-5 py-2.5 rounded-full font-bold text-sm cursor-pointer hover:bg-[#2a2a2a] transition-colors inline-block ${photoLoading ? 'opacity-50 pointer-events-none' : ''}`}>
              {photoLoading ? 'Uploading...' : 'Upload New Photo'}
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp" 
                onChange={handlePhotoUpload} 
                className="hidden" 
                disabled={photoLoading}
              />
            </label>
            <p className="text-xs text-[#888] mt-3">JPG, PNG, or WEBP. Max 5MB.</p>
          </div>
        </div>
      </section>

      {/* SECTION A: PERSONAL INFO */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">Personal Info</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">First Name</label>
            <input 
              type="text" 
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Last Name</label>
            <input 
              type="text" 
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Phone Number</label>
          <div className="flex gap-2">
            <div className="flex-[0.8] sm:flex-[0.6] min-w-[120px]">
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
                className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[48px]" 
                placeholder="600 000 000" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Country</label>
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
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">City</label>
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

        <div className="mb-4">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Bio</label>
          <textarea 
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm h-24 resize-none focus:border-brand-yellow outline-none"
            placeholder="Tell your clients a bit about yourself..."
          />
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Languages</label>
          <Select 
              isMulti
              options={languageOptions} 
              value={selectedLanguages}
              onChange={setSelectedLanguages}
              styles={selectStyles}
              placeholder="Select languages..."
            />
        </div>

        <button 
          onClick={handleSaveInfo}
          disabled={savingGlobal}
          className="bg-brand-yellow text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-500 disabled:opacity-50"
        >
          {savingGlobal ? 'Saving...' : 'Save Personal Info'}
        </button>
      </section>

      {/* SECTION C: SOCIAL MEDIA */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">Social Media</h2>
        
        <div className="mb-4">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Instagram Username</label>
          <input 
            type="text" 
            value={socialData.instagram}
            onChange={e => setSocialData({...socialData, instagram: e.target.value})}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            placeholder="@your_username"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Facebook Profile Name</label>
          <input 
            type="text" 
            value={socialData.facebook}
            onChange={e => setSocialData({...socialData, facebook: e.target.value})}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            placeholder="your.profile.name"
          />
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">TikTok Username</label>
          <input 
            type="text" 
            value={socialData.tiktok}
            onChange={e => setSocialData({...socialData, tiktok: e.target.value})}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            placeholder="@your_username"
          />
        </div>

        <button 
          onClick={handleSaveSocial}
          disabled={savingSocial}
          className="bg-[#1a1a1a] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2a2a2a] disabled:opacity-50"
        >
          {savingSocial ? 'Saving...' : 'Save Social Links'}
        </button>
      </section>

      {/* SECTION D: DANGER ZONE */}
      <section className="bg-[#1a0808] border border-brand-red/30 rounded-3xl p-6">
        <h2 className="text-lg font-black text-brand-red mb-2">Delete Account</h2>
        <p className="text-[#888] text-sm mb-6">This permanently deletes your profile, services, bookings and all your data. This cannot be undone.</p>
        <div className="w-max">
          <DeleteAccountButton role="barber" />
        </div>
      </section>
    </div>
  );
}
