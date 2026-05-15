'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage, auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import Select from "react-select";
import { Country, City } from "country-state-city";
import ISO6391 from "iso-639-1";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { userUpdateSchema, barberUpdateSchema } from "@/lib/schemas";
import { sanitizeText, sanitizeHandle } from '@/lib/sanitize';

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
    setTimeout(() => {
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
    }, 0);
  }, [initPhoneCodeStr, profile?.country, profile?.languages, phoneCodeOptions, countryOptions, languageOptions]);

  useEffect(() => {
    setTimeout(() => {
      if (profile?.city && selectedCountry) {
        const cities = City.getCitiesOfCountry(selectedCountry.value) || [];
        const match = cities.find(c => c.name === profile.city);
        if (match) {
          setSelectedCityOption({ value: match.name, label: match.name });
        } else if (profile.city) {
          setSelectedCityOption({ value: profile.city, label: profile.city });
        }
      }
    }, 0);
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

  // Section C — Barber profile chips
  const [specialties, setSpecialties] = useState<string[]>(profile?.specialties || []);
  const [vibe, setVibe] = useState<string[]>(profile?.vibes || []);
  const [clientele, setClientele] = useState<string[]>(profile?.clientele || []);
  const [savingProfile, setSavingProfile] = useState(false);

  // Sections E, F — Preferences & privacy
  const [notifyEmail, setNotifyEmail] = useState(profile?.notifyEmail !== false);
  const [notifyCancel, setNotifyCancel] = useState(profile?.notifyCancel !== false);
  const [showPhone, setShowPhone] = useState(profile?.showPhone === true);
  const [pwResetSent, setPwResetSent] = useState(false);

  useEffect(() => {
    setSpecialties(profile?.specialties || []);
    setVibe(profile?.vibes || []);
    setClientele(profile?.clientele || []);
    setNotifyEmail(profile?.notifyEmail !== false);
    setNotifyCancel(profile?.notifyCancel !== false);
    setShowPhone(profile?.showPhone === true);
  }, [profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg('Only jpg, png, and webp images are allowed.');
      return;
    }

    setPhotoLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      
      const storageRef = ref(storage, `profile-photos/${user.uid}/profile.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile, { cacheControl: 'public, max-age=31536000' });

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
            await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse({ photoUrl: downloadURL }));
            await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({ profilePhotoUrl: downloadURL }));
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
    } catch (error) {
      console.error(error);
      setErrorMsg('Image compression failed.');
      setPhotoLoading(false);
    }
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

      await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse({
              firstName: formData.firstName,
              lastName: formData.lastName,
              phone: phoneStr,
              phoneCountryCode: phoneCode ? phoneCode.value : null,
              city: cityStr,
              country: countryStr,
              languages: langArr
            }));
      await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({
              phone: phoneStr,
              city: cityStr,
              country: countryStr,
              bio: sanitizeText(formData.bio, 500),
              languages: langArr,
            }));
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
      await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({
              instagram: sanitizeHandle(socialData.instagram),
              facebook: sanitizeHandle(socialData.facebook),
              tiktok: sanitizeHandle(socialData.tiktok),
            }));
      mutateProfile();
      setSuccessMsg('Social links saved!');
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to save social links.');
    }
    setSavingSocial(false);
  };

  // Section C — save barber profile chips
  const handleSaveBarberProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateDoc(doc(db, 'barberProfiles', user.uid), { specialties, vibes: vibe, clientele });
      mutateProfile();
      setSuccessMsg('Barber profile updated ✓');
    } catch (e) { console.error(e); setErrorMsg('Failed to save barber profile.'); }
    setSavingProfile(false);
  };

  // Sections E, F — toggle handlers (auto-save)
  const handleToggleNotifEmail = async (val: boolean) => {
    if (!user) return;
    setNotifyEmail(val);
    try { await updateDoc(doc(db, 'users', user.uid), { notifyEmail: val }); } catch (e) { console.error(e); }
  };
  const handleToggleNotifCancel = async (val: boolean) => {
    if (!user) return;
    setNotifyCancel(val);
    try { await updateDoc(doc(db, 'users', user.uid), { notifyCancel: val }); } catch (e) { console.error(e); }
  };
  const handleToggleShowPhone = async (val: boolean) => {
    if (!user) return;
    setShowPhone(val);
    try { await updateDoc(doc(db, 'barberProfiles', user.uid), { showPhone: val }); } catch (e) { console.error(e); }
  };

  // Section G — password reset
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setPwResetSent(true);
      setSuccessMsg('Password reset email sent ✓ Check your inbox.');
    } catch (e) { console.error(e); setErrorMsg('Failed to send reset email.'); }
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
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] shrink-0">
            {currentPhoto ? (
              <>
                <Image src={currentPhoto} alt={appUser?.firstName || 'Profile'} fill className="object-cover" referrerPolicy="no-referrer" />
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

      {/* SECTION C: BARBER PROFILE */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">Barber Profile</h2>

        {/* Specialties */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[#888] block mb-2 uppercase">Specialties</label>
          <div className="flex flex-wrap gap-2">
            {['Skin Fade / Bald Fade','Low Fade','Mid Fade','High Fade','Taper','Classic Cut / Scissor Cut','Textured Crop','Buzz Cut','Line Up / Edge Up','Beard Trim & Shape','Hot Towel Shave / Straight Razor','Locs / Dreadlocks','Curly Hair / Afro','Kids Cut','Design / Pattern Cut','Colour & Bleach','Hair & Beard Combo'].map(s => (
              <button key={s} onClick={() => setSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors ${specialties.includes(s) ? 'border-brand-yellow bg-[#1a1500] text-brand-yellow' : 'border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Vibe */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[#888] block mb-2 uppercase">Vibe</label>
          <div className="flex flex-wrap gap-2">
            {['😶 Silent','💬 Chatty','😎 Cool & chill','⚡ Hype','🎯 Professional','🤝 Friendly'].map(v => (
              <button key={v} onClick={() => setVibe(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors ${vibe.includes(v) ? 'border-brand-yellow bg-[#1a1500] text-brand-yellow' : 'border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white'}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Clientele */}
        <div className="mb-6">
          <label className="text-xs font-bold text-[#888] block mb-2 uppercase">Who do you work with?</label>
          <div className="flex flex-wrap gap-2">
            {['👶 Babies (0–2 years)','🧒 Kids (3–12 years)','🧑 Teenagers','🧔 Adults','🧓 Elderly','♿ People with disabilities','😰 Anxious clients (extra patience)','🧠 Autism-friendly','🧏 Deaf / Hard of hearing','💺 Wheelchair accessible cuts','🏠 Home visits available'].map(c => (
              <button key={c} onClick={() => setClientele(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors ${clientele.includes(c) ? 'border-brand-yellow bg-[#1a1500] text-brand-yellow' : 'border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSaveBarberProfile} disabled={savingProfile}
          className="bg-brand-yellow text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-500 disabled:opacity-50">
          {savingProfile ? 'Saving...' : 'Save Barber Profile'}
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

      {/* SECTION D: SHOP & SOLO BOOKINGS */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6 relative">
        <h2 className="text-lg font-black mb-4">Shop & Solo Bookings</h2>
        
        {profile?.shopId ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-2xl mb-6 flex justify-between items-center flex-col sm:flex-row gap-4">
            <div>
              <div className="font-bold text-white mb-1">Assigned to a Shop</div>
              <div className="text-xs text-[#888]">You receive bookings through your shop.</div>
            </div>
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to leave your shop?')) {
                  try {
                    const { writeBatch, doc } = await import('firebase/firestore');
                    const batch = writeBatch(db);
                    batch.update(doc(db, 'barberProfiles', user!.uid), {
                      shopId: null,
                      isSolo: true
                    });
                    await batch.commit();
                    alert('You are now visible in barber search');
                    // Force refresh or reload profile
                    window.location.reload();
                  } catch (e) {
                    console.error('Failed to leave shop', e);
                  }
                }
              }}
              className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#3b1a1a] transition-colors whitespace-nowrap"
            >
              Leave Shop
            </button>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-2xl mb-6">
            <div className="font-bold text-white mb-1">Independent Barber</div>
            <div className="text-xs text-[#888]">You are working independently. Provide your code to a shop owner if you want to join them.</div>
          </div>
        )}

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-5 rounded-2xl flex items-start justify-between gap-4">
          <div>
            <div className="font-bold text-white mb-1">Accept solo bookings</div>
            <div className="text-xs text-[#888] leading-relaxed max-w-sm">
              When ON, you appear in barber search for direct bookings. When OFF, you only receive bookings through your shop.
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={profile?.isSolo ?? true}
              onChange={async (e) => {
                const checked = e.target.checked;
                if (!checked) {
                  // Count pending solo bookings
                  try {
                    const { collection, query, where, getDocs } = await import('firebase/firestore');
                    const q = query(
                      collection(db, 'bookings'), 
                      where('barberId', '==', user!.uid),
                      where('bookingContext', '==', 'solo'),
                      where('status', 'in', ['pending', 'confirmed'])
                    );
                    const snap = await getDocs(q);
                    const count = snap.size;
                    
                    if (confirm(`Are you sure? You have ${count} pending solo bookings that will still be honoured. New solo bookings will stop coming in.`)) {
                       const { updateDoc, doc } = await import('firebase/firestore');
                       await updateDoc(doc(db, 'barberProfiles', user!.uid), { isSolo: false });
                       window.alert('Solo bookings turned off');
                       window.location.reload();
                    }
                  } catch (err) {
                    console.error(err);
                  }
                } else {
                  // Turn ON
                  const { updateDoc, doc } = await import('firebase/firestore');
                  await updateDoc(doc(db, 'barberProfiles', user!.uid), { isSolo: true });
                  window.alert('Solo bookings turned on');
                  window.location.reload();
                }
              }}
            />
            <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-yellow"></div>
          </label>
        </div>
      </section>

      {/* SECTION E: NOTIFICATION PREFERENCES */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">Notification Preferences</h2>
        {[
          { label: 'Email me when I get a new booking', val: notifyEmail, fn: handleToggleNotifEmail },
          { label: 'Email me when a booking is cancelled', val: notifyCancel, fn: handleToggleNotifCancel },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-[#1e1e1e] last:border-0">
            <span className="text-sm font-bold text-white">{item.label}</span>
            <label className="relative w-11 h-6 cursor-pointer shrink-0">
              <input type="checkbox" checked={item.val} onChange={e => item.fn(e.target.checked)} className="peer sr-only" />
              <span className="absolute inset-0 bg-[#2a2a2a] rounded-full transition-colors peer-checked:bg-brand-yellow" />
              <span className="absolute w-[18px] h-[18px] left-[3px] top-[3px] bg-white rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-[#0a0a0a]" />
            </label>
          </div>
        ))}
      </section>

      {/* SECTION F: PRIVACY */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">Privacy</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">Show my phone number on my public profile</div>
            <div className="text-xs text-[#555] mt-0.5">When off, clients won&apos;t see your phone on your profile page.</div>
          </div>
          <label className="relative w-11 h-6 cursor-pointer shrink-0 ml-4">
            <input type="checkbox" checked={showPhone} onChange={e => handleToggleShowPhone(e.target.checked)} className="peer sr-only" />
            <span className="absolute inset-0 bg-[#2a2a2a] rounded-full transition-colors peer-checked:bg-brand-yellow" />
            <span className="absolute w-[18px] h-[18px] left-[3px] top-[3px] bg-white rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-[#0a0a0a]" />
          </label>
        </div>
      </section>

      {/* SECTION G: ACCOUNT */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">Account</h2>
        <div className="mb-5">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Your login email</label>
          <input value={user?.email || ''} readOnly className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl px-4 py-3 text-[#555] text-sm cursor-not-allowed" />
          <p className="text-[11px] text-[#444] mt-1.5">To change your email, contact support.</p>
        </div>
        <button onClick={handlePasswordReset} disabled={pwResetSent}
          className="text-sm font-bold text-[#888] hover:text-white transition-colors underline disabled:text-[#555] disabled:cursor-default disabled:no-underline">
          {pwResetSent ? '✓ Reset email sent — check your inbox' : 'Change password →'}
        </button>
      </section>

      {/* SECTION E: DANGER ZONE */}
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
