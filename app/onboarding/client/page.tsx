'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { track } from '@vercel/analytics';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import Select from 'react-select';
// country-state-city loaded dynamically to avoid bundling ~2 MB on initial load
import { userUpdateSchema } from "@/lib/schemas";
import { getLanguageOptions } from '@/lib/languages';
import { useLang } from '@/lib/i18n/LangContext';

export default function ClientOnboarding() {
  const router = useRouter();
  const { user, appUser } = useAuth();
  
  const { t } = useLang();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Funnel tracking. Client onboarding is a single step, so there is no
  // step_completed event here — only abandon (unmount before completion) and
  // launch. launchedRef flips true on success so the unmount cleanup can tell
  // a genuine abandon from a completed flow.
  const launchedRef = useRef(false);
  useEffect(() => {
    return () => {
      if (!launchedRef.current) {
        track('onboarding_abandoned', { step: 1, role: 'client' });
      }
    };
  }, []);

  // firstName / lastName are editable so users coming in via Google with no
  // displayName aren't permanently stuck in the onboarding loop.
  const [firstName, setFirstName] = useState(appUser?.firstName || '');
  const [lastName, setLastName] = useState(appUser?.lastName || '');

  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCityOption, setSelectedCityOption] = useState<any>(null);
  const [phoneCode, setPhoneCode] = useState<any>(null);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<any>([]);
  const [csc, setCsc] = useState<any>(null);
  const [languageOptions, setLanguageOptions] = useState<{value: string; label: string}[]>([]);

  // Pre-fill names once appUser resolves (initial useState fires before context loads)
  useEffect(() => {
    if (appUser?.firstName) setFirstName(appUser.firstName);
    if (appUser?.lastName) setLastName(appUser.lastName);
  }, [appUser?.firstName, appUser?.lastName]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !phoneCode ||
      !phoneNumberInput ||
      !selectedCountry ||
      !selectedCityOption
    ) {
      return;
    }

    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, userUpdateSchema.parse({
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              phone: `+${phoneCode.value} ${phoneNumberInput}`,
              phoneCountryCode: phoneCode.value,
              country: selectedCountry.value,
              city: selectedCityOption.value,
              languages: selectedLanguages.length ? selectedLanguages.map((l: any) => l.value) : ["English"],
              isOnboarded: true
            }));
      
      // Reload so that AuthContext fetches the updated isOnboarded state
      launchedRef.current = true;
      track('profile_launched', {
        time_to_launch_seconds: appUser?.createdAt
          ? Math.round((Date.now() - appUser.createdAt) / 1000)
          : 0,
        role: 'client',
      });
      window.location.href = '/dashboard/client';
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || String(err));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[560px] mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="animate-fadeUp text-center mb-9">
        <div className="text-3xl mb-2">👋</div>
        <h1 className="text-2xl font-black">{t('onboarding.justFewDetails')}</h1>
        <p className="text-brand-text-secondary text-sm mt-1.5">
          {t('onboarding.completeToBook')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="animate-fadeUp flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.firstName').toUpperCase()} <span className="text-brand-red">*</span></label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="First name"
              maxLength={100}
              style={{
                background: '#141414',
                border: `1px solid ${submitAttempted && !firstName.trim() ? '#EF4444' : '#2a2a2a'}`,
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
            {submitAttempted && !firstName.trim() && (
              <span className="text-brand-red text-xs mt-1 block">{t('onboarding.required')}</span>
            )}
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.lastName').toUpperCase()} <span className="text-brand-red">*</span></label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Last name"
              maxLength={100}
              style={{
                background: '#141414',
                border: `1px solid ${submitAttempted && !lastName.trim() ? '#EF4444' : '#2a2a2a'}`,
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
            {submitAttempted && !lastName.trim() && (
              <span className="text-brand-red text-xs mt-1 block">{t('onboarding.required')}</span>
            )}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('forms.phone').toUpperCase()} <span className="text-brand-red">*</span></label>
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
                    borderColor: (submitAttempted && !phoneCode) ? '#ef4444' : state.isFocused ? '#FFD700' : '#2a2a2a',
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
                className={`w-full bg-[#141414] border-[1.5px] ${submitAttempted && !phoneNumberInput ? 'border-brand-red' : 'border-[#2a2a2a]'} rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]`} 
                placeholder="600 000 000" 
              />
            </div>
          </div>
          {submitAttempted && (!phoneCode || !phoneNumberInput) && (
            <span className="text-brand-red text-xs mt-1 block">{t('onboarding.validPhone')}</span>
          )}
        </div>

        <div>
          <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('onboarding.location')} <span className="text-brand-red">*</span></label>
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
                    borderColor: (submitAttempted && !selectedCountry) ? '#ef4444' : state.isFocused ? '#FFD700' : '#2a2a2a',
                    borderRadius: '0.75rem',
                    padding: '8px',
                    color: 'white',
                    boxShadow: 'none',
                  })
                }}
                placeholder="Country..."
              />
              {submitAttempted && !selectedCountry && (
                <span className="text-brand-red text-xs mt-1 block">{t('onboarding.required')}</span>
              )}
            </div>
            <div>
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
                styles={{
                  ...selectStyles,
                  control: (base: any, state: any) => ({
                    ...base,
                    background: '#141414',
                    borderColor: (submitAttempted && !selectedCityOption) ? '#ef4444' : state.isFocused ? '#FFD700' : '#2a2a2a',
                    borderRadius: '0.75rem',
                    padding: '8px',
                    color: 'white',
                    boxShadow: 'none',
                  })
                }}
                placeholder="City..."
              />
              {submitAttempted && !selectedCityOption && (
                <span className="text-brand-red text-xs mt-1 block">{t('onboarding.required')}</span>
              )}
            </div>
          </div>
        </div>

        <div>
           <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">{t('onboarding.languagesSpoken')}</label>
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
          className="bg-brand-yellow text-black w-full mt-2 px-7 py-4 rounded-full font-black text-base transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? t('onboarding.saving') : t('onboarding.letsFind')}
        </button>
      </form>
    </div>
  );
}
