'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage, auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import dynamic from 'next/dynamic';
const Select = dynamic(
  () => import('react-select'),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 bg-white/5 rounded animate-pulse" />
    )
  }
) as any;
// country-state-city loaded dynamically to avoid bundling ~2 MB on initial load
// iso-639-1 is loaded via the @/lib/languages wrapper (handles CJS class interop)
import Image from "next/image";
import Link from "next/link";
import imageCompression from "browser-image-compression";
import { userUpdateSchema, professionalProfileUpdateSchema } from "@/lib/schemas";
import { sanitizeText, sanitizeHandle } from '@/lib/sanitize';
import { invalidateBarber } from '@/lib/invalidate';
import { getLanguageOptions } from '@/lib/languages';
import { useLang } from '@/lib/i18n/LangContext';

interface BarberSettingsTabProps {
  profile: any;
  mutateProfile: () => void;
}

export function BarberSettingsTab({ profile, mutateProfile }: BarberSettingsTabProps) {
  const { user, appUser } = useAuth();
  const { t } = useLang();
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
  const [csc, setCsc] = useState<any>(null);
  const [languageOptions, setLanguageOptions] = useState<{value: string; label: string}[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCityOption, setSelectedCityOption] = useState<any>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<any>([]);

  useEffect(() => { import('country-state-city').then(m => setCsc(m)); }, []);
  useEffect(() => { getLanguageOptions().then(setLanguageOptions); }, []);

  const countryOptions = useMemo(() => {
    if (!csc) return [];
    return csc.Country.getAllCountries().map((c: any) => ({ value: c.isoCode, label: `${c.flag} ${c.name}` }));
  }, [csc]);

  const phoneCodeOptions = useMemo(() => {
    if (!csc) return [];
    return csc.Country.getAllCountries().map((c: any) => ({ value: c.phonecode, label: `${c.flag} ${c.name} (+${c.phonecode})` }));
  }, [csc]);

  
  useEffect(() => {
    setTimeout(() => {
      if (initPhoneCodeStr) {
        const match = phoneCodeOptions.find((o: any) => o.value === initPhoneCodeStr);
        if (match) setPhoneCode(match);
      }
      if (profile?.country) {
        const match = countryOptions.find((o: any) => o.value === profile.country);
        if (match) setSelectedCountry(match);
      }
      if (profile?.languages?.length) {
        const matches = languageOptions.filter((o: any) => profile.languages.includes(o.value));
        setSelectedLanguages(matches);
      }
    }, 0);
  }, [initPhoneCodeStr, profile?.country, profile?.languages, phoneCodeOptions, countryOptions, languageOptions]);

  useEffect(() => {
    setTimeout(() => {
      if (profile?.city && selectedCountry && csc) {
        const cities = csc.City.getCitiesOfCountry(selectedCountry.value) || [];
        const match = cities.find((c: any) => c.name === profile.city);
        if (match) {
          setSelectedCityOption({ value: match.name, label: match.name });
        } else if (profile.city) {
          setSelectedCityOption({ value: profile.city, label: profile.city });
        }
      }
    }, 0);
  }, [profile?.city, selectedCountry, csc]);

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

  // Experience section state
  const [experienceStartYear, setExperienceStartYear] = useState<string>(
    profile?.experienceStartYear != null ? String(profile.experienceStartYear) : ''
  );
  const [dateOfBirth, setDateOfBirth] = useState<string>(profile?.dateOfBirth ?? '');
  const [savingExperience, setSavingExperience] = useState(false);

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

  // Layer 1 — equipment & chair-rental seeking
  const [hasEquipment, setHasEquipment] = useState<boolean>(profile?.hasEquipment ?? false);
  const [lookingForChair, setLookingForChair] = useState<boolean>(profile?.lookingForChair ?? false);
  const [savingSetup, setSavingSetup] = useState(false);
  const [isSolo, setIsSolo] = useState<boolean>(profile?.isSolo ?? true);
  const [savingIsSolo, setSavingIsSolo] = useState(false);

  useEffect(() => {
    setSpecialties(profile?.specialties || []);
    setVibe(profile?.vibes || []);
    setClientele(profile?.clientele || []);
    setNotifyEmail(profile?.notifyEmail !== false);
    setNotifyCancel(profile?.notifyCancel !== false);
    setShowPhone(profile?.showPhone === true);
    setExperienceStartYear(profile?.experienceStartYear != null ? String(profile.experienceStartYear) : '');
    setDateOfBirth(profile?.dateOfBirth ?? '');
    setHasEquipment(profile?.hasEquipment ?? false);
    setLookingForChair(profile?.lookingForChair ?? false);
    setIsSolo(profile?.isSolo ?? true);
  }, [profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMsg(t('errors.invalidImageType'));
      return;
    }

    setPhotoLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: false,
      };

      const compressedFile = await imageCompression(file, options);
      
      const storageRef = ref(storage, `profile-photos/${user.uid}/profile.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile, { cacheControl: 'public, max-age=31536000' });

      uploadTask.on('state_changed', 
        null, 
        (error) => {
          setPhotoLoading(false);
          setErrorMsg(t('errors.uploadFailed'));
          console.error("Upload Error:", error);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse({ photoUrl: downloadURL }));
            await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ profilePhotoUrl: downloadURL }));
            setLocalPhotoUrl(downloadURL);
            mutateProfile();
            invalidateBarber(user.uid);
            setSuccessMsg(t('success.profilePhotoUpdated'));
          } catch (err) {
             console.error("Database Update Error:", err);
             setErrorMsg(t('errors.failedUpdatePhoto'));
          }
          setPhotoLoading(false);
        }
      );
    } catch (error) {
      console.error(error);
      setErrorMsg(t('errors.imageCompressionFailed'));
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
      const stateStr = selectedState ? selectedState.value : undefined;
      const langArr = selectedLanguages.length ? selectedLanguages.map((l: any) => l.value) : [];

      await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse({
              firstName: sanitizeText(formData.firstName, 100),
              lastName: sanitizeText(formData.lastName, 100),
              phone: phoneStr,
              phoneCountryCode: phoneCode ? phoneCode.value : null,
              city: cityStr,
              state: stateStr,
              country: countryStr,
              languages: langArr
            }));
      await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({
              phone: phoneStr,
              city: cityStr,
              state: stateStr,
              country: countryStr,
              bio: sanitizeText(formData.bio, 500),
              languages: langArr,
            }));
      mutateProfile();
      invalidateBarber(user.uid);
      setSuccessMsg(t('success.personalInfoSaved'));
    } catch (e) {
      console.error(e);
      setErrorMsg(t('errors.failedSavePersonalInfo'));
    }
    setSavingGlobal(false);
  };

  const handleSaveSocial = async () => {
    if (!user) return;
    setSavingSocial(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({
              instagram: sanitizeHandle(socialData.instagram),
              facebook: sanitizeHandle(socialData.facebook),
              tiktok: sanitizeHandle(socialData.tiktok),
            }));
      mutateProfile();
      invalidateBarber(user.uid);
      setSuccessMsg(t('success.socialLinksSaved'));
    } catch (e) {
      console.error(e);
      setErrorMsg(t('errors.failedSaveSocialLinks'));
    }
    setSavingSocial(false);
  };

  // Section C — save barber profile chips
  const handleSaveBarberProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateDoc(doc(db, 'professionalProfiles', user.uid), { specialties, vibes: vibe, clientele });
      mutateProfile();
      invalidateBarber(user.uid);
      setSuccessMsg(t('success.barberProfileUpdated'));
    } catch (e) { console.error(e); setErrorMsg(t('errors.failedSaveBarberProfile')); }
    setSavingProfile(false);
  };

  // Experience save — locks fields once saved
  const handleSaveExperience = async () => {
    if (!user || profile?.experienceLocked) return;
    if (!experienceStartYear || !dateOfBirth) return;
    setSavingExperience(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({
        experienceStartYear: Number(experienceStartYear),
        dateOfBirth,
        experienceLocked: true,
      }));
      mutateProfile();
      invalidateBarber(user.uid);
      setSuccessMsg(t('success.experienceSaved'));
    } catch (e) {
      console.error(e);
      setErrorMsg(t('errors.failedSaveExperience'));
    }
    setSavingExperience(false);
  };

  // Layer 1 — save equipment & chair-rental seeking
  const handleSaveSetup = async () => {
    if (!user) return;
    setSavingSetup(true);
    setErrorMsg(''); setSuccessMsg('');
    try {
      await updateDoc(doc(db, 'professionalProfiles', user.uid), { hasEquipment, lookingForChair });
      mutateProfile();
      invalidateBarber(user.uid);
      setSuccessMsg(t('success.barberProfileUpdated'));
    } catch (e) {
      console.error(e);
      setErrorMsg(t('errors.failedSaveBarberProfile'));
    } finally {
      setSavingSetup(false);
    }
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
    try { await updateDoc(doc(db, 'professionalProfiles', user.uid), { showPhone: val }); } catch (e) { console.error(e); }
  };

  // Section G — password reset
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setPwResetSent(true);
      setSuccessMsg(t('success.passwordResetSent'));
    } catch (e) { console.error(e); setErrorMsg(t('errors.failedSendReset')); }
  };

  const currentPhoto = localPhotoUrl || profile?.profilePhotoUrl || appUser?.photoUrl;

  return (
    <div className="animate-fadeUp max-w-2xl">
      <h1 className="text-2xl font-black mb-2">{t('headings.settings')}</h1>
      <p className="text-brand-text-secondary text-sm mb-8">{t('settings.manageBarberDesc')}</p>

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

      {/* Mobile-only shop navigation */}
      <div className="md:hidden mb-4">
        {appUser?.ownsShop ? (
          <Link
            href="/dashboard/shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#1a1a1a',
              borderRadius: '16px',
              border: '1px solid #2a2a2a',
              color: '#F5C518',
              fontWeight: 900,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '20px' }}>🏪</span>
            <div>
              <div>{t('barberLayout.manageShop')}</div>
              <div style={{ fontSize: '11px', color: '#888', fontWeight: 600, marginTop: '2px' }}>
                {t('barberLayout.shopDashboard')}
              </div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#555' }}>→</span>
          </Link>
        ) : profile?.shopId ? (
          <Link
            href={`/shop/${profile.shopId}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#1a1a1a',
              borderRadius: '16px',
              border: '1px solid #2a2a2a',
              color: '#fff',
              fontWeight: 900,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '20px' }}>🏪</span>
            <div>
              <div>{t('barberLayout.myShop')}</div>
              <div style={{ fontSize: '11px', color: '#888', fontWeight: 600, marginTop: '2px' }}>
                {t('barberLayout.viewShopProfile')}
              </div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#555' }}>→</span>
          </Link>
        ) : (
          <Link
            href="/dashboard/barber/create-shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#1a1a1a',
              borderRadius: '16px',
              border: '1px solid #2a2a2a',
              color: '#fff',
              fontWeight: 900,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '20px' }}>🏪</span>
            <div>
              <div>{t('barberLayout.createShop')}</div>
              <div style={{ fontSize: '11px', color: '#888', fontWeight: 600, marginTop: '2px' }}>
                {t('barberLayout.createShopSub')}
              </div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#555' }}>→</span>
          </Link>
        )}
      </div>

      {/* SECTION B: PROFILE PHOTO */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">{t('forms.profilePhoto')}</h2>
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
              {photoLoading ? t('settings.uploading') : t('buttons.uploadNewPhoto')}
              <input 
                type="file" 
                accept="image/jpeg,image/png,image/webp" 
                onChange={handlePhotoUpload} 
                className="hidden" 
                disabled={photoLoading}
              />
            </label>
            <p className="text-xs text-[#888] mt-3">{t('settings.fileTypeHint')}</p>
          </div>
        </div>
      </section>

      {/* SECTION A: PERSONAL INFO */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">{t('headings.personalInfo')}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.firstName')}</label>
            <input 
              type="text" 
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              maxLength={100}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.lastName')}</label>
            <input 
              type="text" 
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              maxLength={100}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.phone')}</label>
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
                maxLength={20}
                className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[48px]"
                placeholder="600 000 000" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.country')}</label>
            <Select
              options={countryOptions}
              value={selectedCountry}
              onChange={(option: any) => {
                setSelectedCountry(option);
                setSelectedState(null);
                setSelectedCityOption(null);
              }}
              styles={selectStyles}
              placeholder="Country..."
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Region</label>
            <Select
              options={selectedCountry && csc ?
                (csc.State.getStatesOfCountry(selectedCountry.value) ?? []).map((s: any) => ({
                  value: s.isoCode,
                  label: s.name
                }))
                : []
              }
              value={selectedState}
              onChange={(option: any) => {
                setSelectedState(option);
                setSelectedCityOption(null);
              }}
              isDisabled={!selectedCountry || !csc}
              isLoading={!csc}
              styles={selectStyles}
              placeholder="Region..."
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.city')}</label>
            <Select 
              options={selectedCountry && csc ?
                (csc.City.getCitiesOfCountry(selectedCountry.value) ?? []).map((c: any) => ({
                  value: c.name,
                  label: c.name
                }))
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
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.bio')}</label>
          <textarea 
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
            maxLength={2000}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm h-24 resize-none focus:border-brand-yellow outline-none"
            placeholder="Tell your clients a bit about yourself..."
          />
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.languages')}</label>
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
          {savingGlobal ? t('settings.saving') : t('buttons.savePersonalInfo')}
        </button>
      </section>

      {/* SECTION A2: EXPERIENCE */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">{t('headings.experience')}</h2>

        {profile?.experienceLocked ? (
          <>
            <div className="bg-[#1a1500] border border-brand-yellow/30 text-brand-yellow rounded-xl px-4 py-3 text-xs font-bold mb-5">
              {t('barberSettings.experienceLocked')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
              <div>
                <div className="text-xs font-bold text-[#888] mb-1.5 uppercase">{t('barberSettings.experienceStartYear')}</div>
                <div className="text-white text-sm font-bold">{profile.experienceStartYear}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#888] mb-1.5 uppercase">{t('headings.experience')}</div>
                <div className="text-white text-sm font-bold">
                  {t('misc.nYears').replace('{n}', String(new Date().getFullYear() - Number(profile.experienceStartYear)))}
                </div>
              </div>
            </div>
            <div className="mt-4">
              {profile?.experienceVerified ? (
                <span className="inline-block bg-[#0f2010] border border-[#1b3b1c] text-brand-green px-3 py-1 rounded-full text-xs font-black">
                  ✓ {t('barberSettings.verified')}
                </span>
              ) : (
                <span className="inline-block bg-[#1a1500] border border-brand-yellow/30 text-brand-yellow px-3 py-1 rounded-full text-xs font-black">
                  ⏳ {t('barberSettings.pendingVerification')}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('barberSettings.dateOfBirth')}</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  max={(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().slice(0, 10); })()}
                  onChange={e => setDateOfBirth(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
                />
                <p className="text-[11px] text-[#555] mt-1.5">{t('barberSettings.dobHint')}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('barberSettings.experienceStartYear')}</label>
                <input
                  type="number"
                  min={1950}
                  max={new Date().getFullYear()}
                  placeholder={t('forms.experienceYearPlaceholder')}
                  value={experienceStartYear}
                  onChange={e => setExperienceStartYear(e.target.value)}
                  className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
                />
                <p className="text-[11px] text-[#555] mt-1.5">{t('barberSettings.experienceHint')}</p>
              </div>
            </div>
            <button
              onClick={handleSaveExperience}
              disabled={savingExperience || !experienceStartYear || !dateOfBirth}
              className="bg-brand-yellow text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-500 disabled:opacity-50"
            >
              {savingExperience ? t('settings.saving') : t('barberSettings.saveExperience')}
            </button>
          </>
        )}
      </section>

      {/* SECTION C: BARBER PROFILE */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">{t('headings.barberProfile')}</h2>

        {/* Specialties */}
        <div className="mb-5">
          <label className="text-xs font-bold text-[#888] block mb-2 uppercase">{t('forms.specialties')}</label>
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
          <label className="text-xs font-bold text-[#888] block mb-2 uppercase">{t('forms.vibe')}</label>
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
          <label className="text-xs font-bold text-[#888] block mb-2 uppercase">{t('forms.whoDoYouWorkWith')}</label>
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
          {savingProfile ? t('settings.saving') : t('buttons.saveBarberProfile')}
        </button>
      </section>

      {/* SECTION C: SOCIAL MEDIA */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">{t('headings.socialMedia')}</h2>
        
        <div className="mb-4">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.instagram')}</label>
          <input 
            type="text" 
            value={socialData.instagram}
            onChange={e => setSocialData({...socialData, instagram: e.target.value})}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            placeholder="@your_username"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.facebook')}</label>
          <input 
            type="text" 
            value={socialData.facebook}
            onChange={e => setSocialData({...socialData, facebook: e.target.value})}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
            placeholder="your.profile.name"
          />
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.tiktok')}</label>
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
          {savingSocial ? t('settings.saving') : t('buttons.saveSocialLinks')}
        </button>
      </section>

      {/* SECTION D: SHOP & SOLO BOOKINGS */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6 relative">
        <h2 className="text-lg font-black mb-4">{t('headings.shopAndSolo')}</h2>
        
        {profile?.shopId ? (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-2xl mb-6 flex justify-between items-center flex-col sm:flex-row gap-4">
            <div>
              <div className="font-bold text-white mb-1">{t('settings.assignedToShop')}</div>
              <div className="text-xs text-[#888]">{t('settings.assignedToShopDesc')}</div>
            </div>
            <button
              onClick={async () => {
                if (!confirm(t('errors.leaveShopConfirm'))) return;

                try {
                  const {
                    writeBatch, doc, collection,
                    query, where, getDocs, arrayRemove
                  } = await import('firebase/firestore');

                  const currentShopId = profile?.shopId;
                  const now = Date.now();
                  const batch = writeBatch(db);

                  if (currentShopId) {
                    // 1. Find active bookings for this barber
                    const bookingsSnap = await getDocs(query(
                      collection(db, 'bookings'),
                      where('barberId', '==', user!.uid),
                      where('status', 'in', ['pending', 'confirmed'])
                    ));

                    // Filter to shop bookings only (client-side)
                    const shopBookings = bookingsSnap.docs.filter(
                      d => d.data().shopId === currentShopId
                    );

                    // 2. Cancel each booking + notify client
                    for (const bookingDoc of shopBookings) {
                      batch.update(bookingDoc.ref, {
                        status: 'cancelled_by_barber',
                        updatedAt: now,
                        cancellationReason: 'barber_left_shop',
                      });
                      batch.set(doc(collection(db, 'notifications')), {
                        userId: bookingDoc.data().clientId,
                        message: `Your booking on ${bookingDoc.data().date} at ${bookingDoc.data().startTime} was cancelled — your barber has left the shop.`,
                        read: false,
                        linkTo: '/dashboard/client',
                        createdAt: now,
                      });
                    }

                    // 3. Remove barber from shop's barbers array
                    batch.update(
                      doc(db, 'businesses', currentShopId),
                      { barbers: arrayRemove(user!.uid) }
                    );

                    // 4. Notify shop owner
                    batch.set(doc(collection(db, 'notifications')), {
                      userId: currentShopId,
                      message: `A barber has left your shop. ${shopBookings.length} booking(s) were cancelled.`,
                      read: false,
                      linkTo: '/dashboard/shop',
                      createdAt: now,
                    });
                  }

                  // 5. Update barber profile
                  batch.update(doc(db, 'professionalProfiles', user!.uid), {
                    shopId: null,
                    isSolo: true,
                  });

                  await batch.commit();
                  alert('You have left the shop.');
                  window.location.reload();
                } catch (e) {
                  console.error('Failed to leave shop', e);
                  alert('Something went wrong. Please try again.');
                }
              }}
              className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#3b1a1a] transition-colors whitespace-nowrap"
            >
              {t('buttons.leaveShop')}
            </button>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-2xl mb-6">
            <div className="font-bold text-white mb-1">{t('settings.independentBarber')}</div>
            <div className="text-xs text-[#888]">{t('settings.independentBarberDesc')}</div>
          </div>
        )}

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-5 rounded-2xl flex items-start justify-between gap-4">
          <div>
            <div className="font-bold text-white mb-1">{t('settings.acceptSoloBookings')}</div>
            <div className="text-xs text-[#888] leading-relaxed max-w-sm">
              {t('settings.acceptSoloDesc')}
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isSolo}
              disabled={savingIsSolo}
              onChange={async (e) => {
                if (savingIsSolo || !user) return;
                const checked = e.target.checked;

                if (!checked) {
                  // Count pending solo bookings first
                  try {
                    const { collection, query, where, getDocs } = await import('firebase/firestore');
                    const q = query(
                      collection(db, 'bookings'),
                      where('barberId', '==', user.uid),
                      where('bookingContext', '==', 'solo'),
                      where('status', 'in', ['pending', 'confirmed'])
                    );
                    const snap = await getDocs(q);
                    const count = snap.size;

                    const confirmed = window.confirm(
                      t('errors.stopSoloConfirm').replace('{n}', String(count))
                    );
                    if (!confirmed) return;

                    // Optimistic update
                    setIsSolo(false);
                    setSavingIsSolo(true);
                    try {
                      const { updateDoc, doc } = await import('firebase/firestore');
                      await updateDoc(doc(db, 'professionalProfiles', user.uid), { isSolo: false });
                      mutateProfile();
                    } catch (err) {
                      console.error(err);
                      // Revert on failure
                      setIsSolo(true);
                    } finally {
                      setSavingIsSolo(false);
                    }
                  } catch (err) {
                    console.error(err);
                  }
                } else {
                  // Turn ON — optimistic update
                  setIsSolo(true);
                  setSavingIsSolo(true);
                  try {
                    const { updateDoc, doc } = await import('firebase/firestore');
                    await updateDoc(doc(db, 'professionalProfiles', user.uid), { isSolo: true });
                    mutateProfile();
                  } catch (err) {
                    console.error(err);
                    // Revert on failure
                    setIsSolo(false);
                  } finally {
                    setSavingIsSolo(false);
                  }
                }
              }}
            />
            <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-yellow"></div>
          </label>
        </div>
      </section>

      {/* SECTION D2: YOUR SETUP (equipment + chair-rental seeking) */}
      {isSolo && (
        <div style={{
          background: '#111',
          border: '1px solid #2a2a2a',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 800,
            color: '#F5C518',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            {t('barberSettings.equipmentTitle')}
          </div>

          {/* hasEquipment toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
          }}>
            <div>
              <div style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 4,
              }}>
                {t('barberSettings.hasEquipment')}
              </div>
              <div style={{
                fontSize: 12,
                color: '#666',
              }}>
                {t('barberSettings.hasEquipmentHint')}
              </div>
            </div>
            <button
              onClick={() => setHasEquipment(v => !v)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: hasEquipment ? '#F5C518' : '#2a2a2a',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
                marginLeft: 16,
                transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 2,
                left: hasEquipment ? 22 : 2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>

          {/* lookingForChair toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 24,
          }}>
            <div>
              <div style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 4,
              }}>
                {t('barberSettings.lookingForChair')}
              </div>
              <div style={{
                fontSize: 12,
                color: '#666',
              }}>
                {t('barberSettings.lookingForChairHint')}
              </div>
            </div>
            <button
              onClick={() => setLookingForChair(v => !v)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                background: lookingForChair ? '#F5C518' : '#2a2a2a',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
                marginLeft: 16,
                transition: 'background 0.2s',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 2,
                left: lookingForChair ? 22 : 2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>

          {/* Save button */}
          <button
            onClick={handleSaveSetup}
            disabled={savingSetup}
            style={{
              background: '#F5C518',
              color: '#0a0a0a',
              fontWeight: 900,
              fontSize: 13,
              padding: '10px 20px',
              borderRadius: 10,
              border: 'none',
              cursor: savingSetup ? 'not-allowed' : 'pointer',
              opacity: savingSetup ? 0.6 : 1,
            }}
          >
            {savingSetup ? '...' : t('barberSettings.saveSetup')}
          </button>
        </div>
      )}

      {/* SECTION E: NOTIFICATION PREFERENCES */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">{t('headings.notifications')}</h2>
        {[
          { label: t('settings.notifyNewBooking'), val: notifyEmail, fn: handleToggleNotifEmail },
          { label: t('settings.notifyCancellation'), val: notifyCancel, fn: handleToggleNotifCancel },
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
        <h2 className="text-lg font-black mb-4">{t('headings.privacy')}</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">{t('settings.showPhone')}</div>
            <div className="text-xs text-[#555] mt-0.5">{t('settings.showPhoneDesc')}</div>
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
        <h2 className="text-lg font-black mb-4">{t('headings.account')}</h2>
        <div className="mb-5">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">{t('forms.loginEmail')}</label>
          <input value={user?.email || ''} readOnly className="w-full bg-[#0a0a0a] border border-[#1e1e1e] rounded-xl px-4 py-3 text-[#555] text-sm cursor-not-allowed" />
          <p className="text-[11px] text-[#444] mt-1.5">{t('settings.changeEmailNote')}</p>
        </div>
        <button onClick={handlePasswordReset} disabled={pwResetSent}
          className="text-sm font-bold text-[#888] hover:text-white transition-colors underline disabled:text-[#555] disabled:cursor-default disabled:no-underline">
          {pwResetSent ? t('success.resetEmailSent') : t('buttons.changePassword')}
        </button>
      </section>

      {/* SECTION E: DANGER ZONE */}
      <section className="bg-[#1a0808] border border-brand-red/30 rounded-3xl p-6">
        <h2 className="text-lg font-black text-brand-red mb-2">{t('headings.deleteAccount')}</h2>
        <p className="text-[#888] text-sm mb-6">{t('settings.deleteBarberAccountDesc')}</p>
        <div className="w-max">
          <DeleteAccountButton role="professional" />
        </div>
      </section>
    </div>
  );
}
