'use client';

import { useState, useMemo, useEffect, useRef } from "react";
import Link from 'next/link';
import { track } from '@vercel/analytics';

import { useRouter } from "next/navigation";
import { doc, collection, setDoc, updateDoc, deleteDoc, query, where, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import Select from "react-select";
// country-state-city loaded dynamically to avoid bundling ~2 MB on initial load
import { userUpdateSchema, scheduleSchema, professionalProfileSchema } from "@/lib/schemas";
import { sanitizeText } from '@/lib/sanitize';
import { getLanguageOptions } from '@/lib/languages';
import { useLang } from '@/lib/i18n/LangContext';
import { categories, professions, getProfession } from '@/lib/professions';

export default function BarberOnboarding() {
  const router = useRouter();
  const { user, appUser } = useAuth();
  const { t } = useLang();
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Funnel tracking. launchedRef flips true only on a successful launch so the
  // unmount cleanup can tell a genuine abandon from a completed flow. stepRef
  // mirrors `step` so the mount-only cleanup reads the latest step without
  // re-subscribing the effect on every step change (which would misfire).
  const launchedRef = useRef(false);
  const stepRef = useRef(step);
  useEffect(() => { stepRef.current = step; }, [step]);
  useEffect(() => {
    return () => {
      if (!launchedRef.current) {
        track('onboarding_abandoned', { step: stepRef.current, role: 'professional' });
      }
    };
  }, []);

  // Step 1
  // firstName / lastName are editable so barbers coming in via Google with no
  // displayName aren't permanently stuck in the onboarding loop (mirror of the
  // client onboarding fix).
  const [firstName, setFirstName] = useState(appUser?.firstName || '');
  const [lastName, setLastName] = useState(appUser?.lastName || '');
  const [bio, setBio] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCityOption, setSelectedCityOption] = useState<any>(null);
  const [phoneCode, setPhoneCode] = useState<any>(null);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<any>([]);

  // Step 2 — capability cards (flow-control only; not persisted as profile fields)
  const [offersServices, setOffersServices] = useState(false);
  const [partOfBusiness, setPartOfBusiness] = useState(false);
  // Step 6 — business choice (null = not yet chosen; gates Continue on that step)
  const [createBusinessNow, setCreateBusinessNow] = useState<boolean | null>(null);

  // Step 3 — profession picker (drives dynamic specialties + persisted profession/tier)
  const [selectedProfession, setSelectedProfession] = useState<string>('');

  // Step 3
  const [vibe, setVibe] = useState<string[]>([]);
  const [days, setDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [specialty, setSpecialty] = useState<string[]>([]);
  const [clientele, setClientele] = useState<string[]>([]);
  // Step 4
  const [servicesData, setServicesData] = useState([
    { name: "Skin Fade", duration: "45", price: "18" }, 
    { name: "Classic Cut", duration: "30", price: "14" }
  ]);
  const [titzData, setTitzData] = useState({ duration: "45", price: "20" });
  const [csc, setCsc] = useState<any>(null);
  const [languageOptions, setLanguageOptions] = useState<{value: string; label: string}[]>([]);

  const saveDraftAndGoToStep = async (newStep: number) => {
    if (user) {
      try {
        await setDoc(doc(db, 'onboardingDrafts', user.uid), {
          firstName, lastName, bio,
          selectedCountry, selectedState, selectedCityOption,
          phoneCode, phoneNumberInput, selectedLanguages,
          offersServices, partOfBusiness, createBusinessNow,
          selectedProfession,
          vibe, days, specialty, clientele,
          servicesData, titzData,
          lastStep: newStep,
          updatedAt: Date.now(),
        }, { merge: true });
      } catch (err) {
        console.error('Draft autosave failed:', err);
        // Non-blocking — don't stop navigation if the autosave fails
      }
    }
    setStep(newStep);
  };

  // Conditional flow: Vibe (3) and Services (4) only exist when the pro offers
  // services. If they don't, Step 2 jumps straight to Go Live (5), and Back
  // from 5 returns to 4 (if services) or 2 (if not).
  const getNextStep = (current: number): number => {
    if (current === 2) {
      if (offersServices) return 3;
      if (partOfBusiness) return 6;
      return 7;
    }
    if (current === 5) return partOfBusiness ? 6 : 7;
    return current + 1;
  };

  const getPrevStep = (current: number): number => {
    if (current === 7) {
      if (partOfBusiness) return 6;
      if (offersServices) return 5;
      return 2;
    }
    if (current === 6) return offersServices ? 5 : 2;
    if (current === 3 && !offersServices) return 2;
    return current - 1;
  };

  useEffect(() => { import('country-state-city').then(m => setCsc(m)); }, []);
  useEffect(() => { getLanguageOptions().then(setLanguageOptions); }, []);

  // Pre-fill names once appUser resolves (initial useState fires before context loads)
  useEffect(() => {
    if (appUser?.firstName && !firstName) setFirstName(appUser.firstName);
    if (appUser?.lastName && !lastName) setLastName(appUser.lastName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appUser?.firstName, appUser?.lastName]);

  useEffect(() => {
    const loadDraft = async () => {
      if (!user) return;
      try {
        const draftSnap = await getDoc(doc(db, 'onboardingDrafts', user.uid));
        if (draftSnap.exists()) {
          const d = draftSnap.data();
          if (d.firstName) setFirstName(d.firstName);
          if (d.lastName) setLastName(d.lastName);
          if (d.bio) setBio(d.bio);
          if (d.selectedCountry) setSelectedCountry(d.selectedCountry);
          if (d.selectedState) setSelectedState(d.selectedState);
          if (d.selectedCityOption) setSelectedCityOption(d.selectedCityOption);
          if (d.phoneCode) setPhoneCode(d.phoneCode);
          if (d.phoneNumberInput) setPhoneNumberInput(d.phoneNumberInput);
          if (d.selectedLanguages) setSelectedLanguages(d.selectedLanguages);
          if (typeof d.offersServices === 'boolean') setOffersServices(d.offersServices);
          if (typeof d.partOfBusiness === 'boolean') setPartOfBusiness(d.partOfBusiness);
          if (typeof d.createBusinessNow === 'boolean') setCreateBusinessNow(d.createBusinessNow);
          if (d.selectedProfession) setSelectedProfession(d.selectedProfession);
          if (d.vibe) setVibe(d.vibe);
          if (d.days) setDays(d.days);
          if (d.specialty) setSpecialty(d.specialty);
          if (d.clientele) setClientele(d.clientele);
          if (d.servicesData) setServicesData(d.servicesData);
          if (d.titzData) setTitzData(d.titzData);
          if (d.lastStep) setStep(d.lastStep);
        }
      } catch (err) {
        console.error('Draft load failed:', err);
        // Non-blocking — onboarding still starts fresh if this fails
      }
    };
    loadDraft();
  }, [user]);

  const toggleVibe = (v: string) => setVibe(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const toggleSpec = (s: string) => setSpecialty(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleClientele = (c: string) => setClientele(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  // Specialties are driven by the chosen profession (registry) — store IDs.
  const currentProfession = getProfession(selectedProfession);
  const specialtyOptions = currentProfession?.specialties || [];

  const countryOptions = useMemo(() => {
    if (!csc) return [];
    return csc.Country.getAllCountries().map((c: any) => ({ value: c.isoCode, label: `${c.flag} ${c.name}` }));
  }, [csc]);

  const phoneCodeOptions = useMemo(() => {
    if (!csc) return [];
    return csc.Country.getAllCountries().map((c: any) => ({ value: c.phonecode, label: `${c.flag} ${c.name} (+${c.phonecode})` }));
  }, [csc]);


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

  const handleLaunch = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const profileRef = doc(db, 'professionalProfiles', user.uid);
      const existingProfileSnap = await getDoc(profileRef);
      const existingProfile = existingProfileSnap.exists()
        ? existingProfileSnap.data() : null;
      const existingBarberCode =
        existingProfile?.professionalCode ?? null;
      const existingApprovalStatus =
        existingProfile?.approvalStatus === 'approved'
          ? 'approved'
          : 'pending';
      const existingIsLive =
        existingProfile?.isLive ?? false;

      // 0. Data Integrity Fix
      const userRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userRef, userUpdateSchema.parse({
                  role: 'professional'
                }), { merge: true });
      } catch (e: any) { 
        throw new Error("Step 0: Data Integrity Setup failed - " + e.message); 
      }

      // Generate Unique Barber Code (reuse existing if already set)
      let uniqueCode = existingBarberCode;
      if (!uniqueCode) {
        let isUnique = false;
        while (!isUnique) {
          const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
          uniqueCode = `TZB-${randomString}`;
          const q = query(collection(db, 'professionalProfiles'), where('professionalCode', '==', uniqueCode));
          const qs = await getDocs(q);
          if (qs.empty) {
            isUnique = true;
          }
        }
      }

      // 1. BarberProfile
      // [DEBUG] Build payload separately so we can log it BEFORE the write attempt.
      const profileData = professionalProfileSchema.parse({
        userId: user.uid,
        bio: sanitizeText(bio || "Professional barber.", 2000),
        city: selectedCityOption ? selectedCityOption.value : "Unknown",
        country: selectedCountry ? selectedCountry.value : "Unknown",
        ...(selectedState ? { state: selectedState.value } : {}),
        phone: phoneCode && phoneNumberInput ? `+${phoneCode.value} ${phoneNumberInput}` : null,
        languages: selectedLanguages.length ? selectedLanguages.map((l: any) => l.value) : ["English"],
        vibe: vibe,
        specialties: specialty,
        clientele: clientele,
        professionalCode: uniqueCode,
        titeZMeCut: {
          durationMinutes: parseInt(titzData.duration || "45"),
          price: parseFloat(titzData.price || "20")
        },
        businessId: null,
        rating: 0,
        totalCuts: 0,
        reviewCount: 0,
        photos: [],
        isLive: false,
        isOnboarded: true,
        approvalStatus: 'pending',
        profession: selectedProfession,
        professionTier: getProfession(selectedProfession)?.tier || 'artist',
        isBookable: false,
        videos: [],
        canManage: true,
        ownsBusiness: false,
        currency: 'EUR',
        createdAt: Date.now()
      });
      try {
        await setDoc(
          profileRef,
          {
            ...profileData,
            approvalStatus: existingApprovalStatus,
            isLive: existingIsLive,
            firstName: firstName.trim() || appUser?.firstName || '',
            lastName: lastName.trim() || appUser?.lastName || '',
            photoUrl: appUser?.photoUrl || '',
            createdAt: appUser?.createdAt || Date.now(),
          },
          { merge: true }
        );
      } catch (e: any) {
        console.error('Barber onboarding failed');
        throw new Error("Step 1: Profile creation failed - " + e.message);
      }

      // 2. Schedule
      const scheduleRef = doc(db, 'schedules', `${user.uid}_shard_0`);
      const existingScheduleSnap = await getDoc(scheduleRef);
      if (!existingScheduleSnap.exists()) {
        try {
          await setDoc(scheduleRef, scheduleSchema.parse({
                    userId: user.uid,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Madrid',
                    weeklyHours: {
                      days: [], // Closed on all days by default
                      opensAt: "09:00",
                      closesAt: "18:00",
                      lunchBreak: true,
                      slotDuration: 30,
                      cleanupBuffer: 0
                    },
                    blockedDates: []
                  }));
        } catch (e: any) { throw new Error("Step 2: Schedule creation failed - " + e.message); }
      }

      // 3. Services
      const existingServicesSnap = await getDocs(
        query(collection(db, 'services'),
        where('providerId', '==', user.uid))
      );
      if (existingServicesSnap.empty) {
        for (const svc of servicesData) {
          if (!svc.name) continue;
          const newServiceRef = doc(collection(db, 'services'));
          try {
            await setDoc(newServiceRef, {
              providerId: user.uid,
              providerType: 'barber',
              // NOTE: providerType literal stays as 'barber' for now — Service.providerType
              // enum is out of scope for the Professional/Business migration (Phase 2 Q5).
              name: sanitizeText(svc.name, 100),
              duration: parseInt((svc as any).duration || (svc as any).dur || "30"),
              price: parseFloat(svc.price || "0"),
              isActive: true
            });
          } catch (e: any) { throw new Error(`Step 3: Service creation failed (${svc.name}) - ` + e.message); }
        }
      }

      // 4. User update — write all profile-complete fields to the users doc.
      //    Without this, RouteGuard's isProfileComplete() check fails on the
      //    users doc (which is missing phone/city/country) and the barber
      //    loops back into onboarding forever.
      try {
        await updateDoc(userRef, userUpdateSchema.parse({
          isOnboarded: true,
          firstName: firstName.trim() || appUser?.firstName || '',
          lastName: lastName.trim() || appUser?.lastName || '',
          ...(phoneCode && phoneNumberInput ? { phone: `+${phoneCode.value} ${phoneNumberInput}` } : {}),
          ...(phoneCode?.value ? { phoneCountryCode: phoneCode.value } : {}),
          city: selectedCityOption?.value || 'Unknown',
          country: selectedCountry?.value || 'Unknown',
          state: selectedState?.value || undefined,
        }));
      } catch(e: any) { throw new Error("Step 4: User confirmation flag failed - " + e.message); }

      // await batch.commit(); // Batch replaced to help debug
      try {
        await deleteDoc(doc(db, 'onboardingDrafts', user.uid));
      } catch (err) {
        console.error('Draft cleanup failed (non-blocking):', err);
      }

      launchedRef.current = true;
      track('profile_launched', {
        time_to_launch_seconds: appUser?.createdAt
          ? Math.round((Date.now() - appUser.createdAt) / 1000)
          : 0,
        role: 'professional',
      });
      window.location.href = createBusinessNow
        ? '/dashboard/barber/create-shop'
        : '/dashboard/barber';

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || String(err));
      setIsSubmitting(false);
    }
  };

  const stepTitles = [t('onboarding.basicInfo'), t('onboarding.howWouldYouUse'), t('onboarding.chooseProfession'), t('onboarding.yourVibe'), t('booking.services'), t('onboarding.yourBusiness'), t('onboarding.goLive')];

  return (
    <div className="max-w-[560px] mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="animate-fadeUp text-center mb-9">
        <div className="text-3xl mb-2">💈</div>
        <h1 className="text-2xl font-black">{t('onboarding.setupProfile')}</h1>
        <p className="text-brand-text-secondary text-sm mt-1.5">
          Step {step} of {totalSteps} — {stepTitles[step - 1]}
        </p>
        <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-brand-yellow rounded-full transition-all duration-400 ease-out" 
            style={{ width: `${(step / totalSteps) * 100}%` }} 
          />
        </div>
      </div>

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <div className="animate-fadeUp flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.firstName').toUpperCase()}</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First name"
                maxLength={100}
                style={{
                  background: '#141414',
                  border: '1px solid #2a2a2a',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '16px',
                  fontFamily: 'Nunito, sans-serif',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.lastName').toUpperCase()}</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last name"
                maxLength={100}
                style={{
                  background: '#141414',
                  border: '1px solid #2a2a2a',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#fff',
                  fontSize: '16px',
                  fontFamily: 'Nunito, sans-serif',
                  outline: 'none',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.phone').toUpperCase()}</label>
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
                  maxLength={20}
                  className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]"
                  placeholder="600 000 000" 
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('onboarding.location')}</label>
            <div className="grid grid-cols-3 gap-3">
              <Select
                options={countryOptions}
                value={selectedCountry}
                onChange={(option) => {
                  setSelectedCountry(option);
                  setSelectedState(null);
                  setSelectedCityOption(null);
                }}
                styles={selectStyles}
                placeholder="Country..."
              />
              <Select
                options={selectedCountry && csc ?
                  (csc.State.getStatesOfCountry(selectedCountry.value) ?? []).map((s: any) => ({
                    value: s.isoCode,
                    label: s.name
                  }))
                  : []
                }
                value={selectedState}
                onChange={(option) => {
                  setSelectedState(option);
                  setSelectedCityOption(null);
                }}
                isDisabled={!selectedCountry || !csc}
                isLoading={!csc}
                styles={selectStyles}
                placeholder="Region..."
              />
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
                isDisabled={!selectedCountry || !csc}
                isLoading={!csc}
                styles={selectStyles}
                placeholder="City..."
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.bio').toUpperCase()}</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={2000} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] resize-y" rows={3} placeholder="Tell clients who you are, your style, your experience..." />
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-2">{t('forms.languages').toUpperCase()}</label>
            <Select 
              isMulti
              options={languageOptions} 
              value={selectedLanguages}
              onChange={setSelectedLanguages}
              styles={selectStyles}
              placeholder="Select languages..."
            />
          </div>
        </div>
      )}

      {/* STEP 2: How would you like to use titeZMe? (capability cards) */}
      {step === 2 && (
        <div className="animate-fadeUp">
          <p className="text-brand-text-secondary text-sm mb-5 leading-[1.7]">
            {t('onboarding.howWouldYouUse')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => setOffersServices(!offersServices)}
              className={`rounded-[10px] p-4 text-left border-2 transition-all cursor-pointer ${
                offersServices
                  ? "border-brand-yellow bg-[#1a1500] text-brand-yellow"
                  : "border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white"
              }`}
            >
              <div className="text-sm mb-1 font-extrabold">💼 {t('onboarding.offerServices')}</div>
              <div className="text-[11px] opacity-70 font-bold">{t('onboarding.offerServicesDesc')}</div>
            </button>
            <button
              onClick={() => setPartOfBusiness(!partOfBusiness)}
              className={`rounded-[10px] p-4 text-left border-2 transition-all cursor-pointer ${
                partOfBusiness
                  ? "border-brand-yellow bg-[#1a1500] text-brand-yellow"
                  : "border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white"
              }`}
            >
              <div className="text-sm mb-1 font-extrabold">🏢 {t('onboarding.partOfBusiness')}</div>
              <div className="text-[11px] opacity-70 font-bold">{t('onboarding.partOfBusinessDesc')}</div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Choose profession */}
      {step === 3 && (
        <div className="animate-fadeUp">
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-2">{t('onboarding.chooseProfession').toUpperCase()}</label>
          <select
            value={selectedProfession}
            onChange={(e) => setSelectedProfession(e.target.value)}
            className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow cursor-pointer"
          >
            <option value="">{t('onboarding.selectOne')}</option>
            {categories.map((cat) => {
              const catProfessions = professions.filter(p => p.categoryId === cat.id && p.enabled);
              if (catProfessions.length === 0) return null;
              return (
                <optgroup key={cat.id} label={`${cat.emoji} ${t(`category.${cat.id}`)}`}>
                  {catProfessions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.emoji} {t(`profession.${p.id}`)}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
        </div>
      )}

      {/* STEP 4: Vibe */}
      {step === 4 && (
        <div className="animate-fadeUp">
          <p className="text-brand-text-secondary text-sm mb-5 leading-[1.7]">
            {t('onboarding.vibeDesc')}
          </p>
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {[
              { label: "😶 Silent", sub: "We work, not talk" },
              { label: "💬 Chatty", sub: "Let's talk about everything" },
              { label: "😎 Cool & chill", sub: "Relaxed energy only" },
              { label: "⚡ Hype", sub: "Music loud, vibes high" },
              { label: "🎯 Professional", sub: "In and out, clean result" },
              { label: "🤝 Friendly", sub: "Welcoming to everyone" },
            ].map(v => (
              <button 
                key={v.label} 
                onClick={() => toggleVibe(v.label)}
                className={`rounded-[10px] p-3 text-center border-2 transition-all cursor-pointer ${
                  vibe.includes(v.label) 
                    ? "border-brand-yellow bg-[#1a1500] text-brand-yellow" 
                    : "border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white"
                }`}
              >
                <div className="text-sm mb-1 font-extrabold">{v.label}</div>
                <div className="text-[10px] opacity-70 font-bold">{v.sub}</div>
              </button>
            ))}
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-2">{t('forms.specialties').toUpperCase()}</label>
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map(specId => (
                <button
                  key={specId}
                  onClick={() => toggleSpec(specId)}
                  className={`rounded-[10px] px-3.5 py-2 text-xs font-extrabold text-center border-2 transition-all cursor-pointer ${
                    specialty.includes(specId)
                      ? "border-brand-yellow bg-[#1a1500] text-brand-yellow"
                      : "border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white"
                  }`}
                >
                  {t(`profession.specialties.${specId}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-2">{t('forms.whoDoYouWorkWith').toUpperCase()}</label>
            <div className="flex flex-wrap gap-2">
              {[
                "👶 Babies (0–2 years)",
                "🧒 Kids (3–12 years)",
                "🧑 Teenagers",
                "🧔 Adults",
                "🧓 Elderly",
                "♿ People with disabilities",
                "😰 Anxious clients (extra patience)",
                "🧠 Autism-friendly",
                "🧏 Deaf / Hard of hearing",
                "👁️ Visually impaired",
                "💺 Wheelchair accessible cuts",
                "🏠 Home visits available"
              ].map(c => (
                <button 
                  key={c} 
                  onClick={() => toggleClientele(c)}
                  className={`rounded-[10px] px-3.5 py-2 text-xs font-extrabold text-center border-2 transition-all cursor-pointer ${
                    clientele.includes(c) 
                      ? "border-brand-yellow bg-[#1a1500] text-brand-yellow" 
                      : "border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Services */}
      {step === 5 && (
        <div className="animate-fadeUp flex flex-col gap-3.5">
          <div className="bg-[#0d1a2e] border border-[#1e3a5f] rounded-xl p-3.5 text-[13px] text-[#93c5fd]">
            ℹ️ Add the services you offer. You can edit these anytime from your dashboard.
          </div>
          
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 border-l-4 border-l-brand-yellow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-yellow text-[#0a0a0a] text-[9px] font-black px-2 py-0.5 rounded-bl-lg">{t('onboarding.requiredBadge')}</div>
            <div className="mb-2">
              <div className="font-black flex items-center gap-1.5 text-base">⚡ titeZMe Cut</div>
              <div className="text-[11px] text-brand-text-secondary mt-0.5 max-w-[240px]">The barber chooses the cut for you based on your vibe and budget.</div>
            </div>
            <div className="grid grid-cols-[1fr_1fr] gap-2.5 items-end max-w-[250px]">
              <div>
                <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">MINS</label>
                <input value={titzData.duration} onChange={e => setTitzData(p => ({...p, duration: e.target.value}))} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">PRICE €</label>
                <input value={titzData.price} onChange={e => setTitzData(p => ({...p, price: e.target.value}))} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" />
              </div>
            </div>
          </div>

          {servicesData.map((s, i) => (
            <div key={i} className="bg-brand-surface border border-brand-border rounded-2xl p-5">
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2.5 items-end">
                <div>
                  <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">{t('onboarding.serviceName')}</label>
                  <input value={s.name} onChange={e => setServicesData(prev => prev.map((x, j) => j === i ? {...x, name: e.target.value} : x))} maxLength={100} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">MINS</label>
                  <input value={s.duration || (s as any).dur} onChange={e => setServicesData(prev => prev.map((x, j) => j === i ? {...x, duration: e.target.value, dur: e.target.value} : x))} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" />
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">PRICE €</label>
                  <input value={s.price} onChange={e => setServicesData(prev => prev.map((x, j) => j === i ? {...x, price: e.target.value} : x))} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" />
                </div>
                <button onClick={() => setServicesData(prev => prev.filter((_, j) => j !== i))} className="bg-transparent border border-[#2a2a2a] text-[#555] rounded-xl w-9 h-[42px] cursor-pointer text-base hover:text-white hover:border-[#555] transition-colors">×</button>
              </div>
            </div>
          ))}
          <button onClick={() => setServicesData(prev => [...prev, {name: '', duration: '30', price: '0'}])} className="bg-transparent border-2 border-dashed border-[#2a2a2a] text-brand-text-secondary rounded-[14px] p-3.5 cursor-pointer font-bold text-sm transition-all hover:border-brand-yellow hover:text-brand-yellow">
            {t('onboarding.addServiceBtn')}
          </button>
        </div>
      )}

      {/* STEP 6: Your Business (only when part of a business) */}
      {step === 6 && partOfBusiness && (
        <div className="animate-fadeUp">
          <h2 className="text-2xl font-black mb-2.5">{t('onboarding.yourBusiness')}</h2>
          <p className="text-brand-text-secondary text-sm mb-5 leading-[1.7]">
            {t('onboarding.businessQuestion')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={() => setCreateBusinessNow(true)}
              className={`rounded-[10px] p-4 text-left border-2 transition-all cursor-pointer ${
                createBusinessNow === true
                  ? "border-brand-yellow bg-[#1a1500] text-brand-yellow"
                  : "border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white"
              }`}
            >
              <div className="text-sm mb-1 font-extrabold">🏢 {t('onboarding.createNow')}</div>
            </button>
            <button
              onClick={() => setCreateBusinessNow(false)}
              className={`rounded-[10px] p-4 text-left border-2 transition-all cursor-pointer ${
                createBusinessNow === false
                  ? "border-brand-yellow bg-[#1a1500] text-brand-yellow"
                  : "border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white"
              }`}
            >
              <div className="text-sm mb-1 font-extrabold">⏱️ {t('onboarding.setUpLater')}</div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Go Live */}
      {step === 7 && (
        <div className="animate-fadeUp text-center">
          <div className="text-[56px] mb-4">🚀</div>
          <h2 className="text-2xl font-black mb-2.5">{t('onboarding.readyToGoLive')}</h2>
          <p className="text-brand-text-secondary text-sm leading-[1.7] mb-7">
            {t('onboarding.profileVisibleDesc')}
          </p>
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 text-left mb-6">
            {[
              { icon: "✓", label: "Basic Info", done: true },
              { icon: "✓", label: "Vibe & Specialties", done: true },
              { icon: "✓", label: "Services & Prices", done: true },
            ].map((item, i) => (
              <div key={i} className={`flex gap-3 py-2.5 ${i < 2 ? "border-b border-brand-border" : ""}`}>
                <div className="w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center text-xs font-black shrink-0">✓</div>
                <span className="font-bold text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          {errorMsg && (
            <div className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-xl px-4 py-3 text-xs font-bold mb-4">
              {errorMsg}
            </div>
          )}

          <div className="flex justify-between mt-7">
            <button
              className="bg-transparent text-white border-[1.5px] border-[#2a2a2a] px-6 py-3 rounded-full font-extrabold text-sm transition-all hover:border-[#555]"
              onClick={() => saveDraftAndGoToStep(getPrevStep(7))}
            >
              {t('booking.back')}
            </button>
            <button
              disabled={isSubmitting}
              onClick={handleLaunch}
              className="bg-brand-yellow text-[#0a0a0a] flex justify-center text-base px-7 py-4 rounded-full font-black transition-all hover:-translate-y-px disabled:opacity-50"
            >
              {isSubmitting ? t('onboarding.launching') : t('onboarding.launchProfile')}
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      {step < 7 && (
        <div className="flex justify-between mt-7">
          {step > 1 ? (
            <button className="bg-transparent text-white border-[1.5px] border-[#2a2a2a] px-6 py-3 rounded-full font-extrabold text-sm transition-all hover:border-[#555]" onClick={() => saveDraftAndGoToStep(getPrevStep(step))}>{t('booking.back')}</button>
          ) : <div />}
          <button
            disabled={(step === 2 && !offersServices && !partOfBusiness) || (step === 3 && !selectedProfession) || (step === 6 && createBusinessNow === null)}
            className="bg-brand-yellow text-[#0a0a0a] px-7 py-3 rounded-full font-black text-sm transition-all hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            onClick={() => {
              track('onboarding_step_completed', { step, role: 'professional' });
              saveDraftAndGoToStep(getNextStep(step));
            }}
          >
            {getNextStep(step) === 7 ? t('onboarding.reviewLaunch') : t('onboarding.continueStep')}
          </button>
        </div>
      )}
    </div>
  );
}
