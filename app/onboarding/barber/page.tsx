'use client';

import { useState, useMemo } from "react";
import Link from 'next/link';

import { useRouter } from "next/navigation";
import { doc, collection, setDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import Select from "react-select";
import { Country, City } from "country-state-city";
import ISO6391 from "iso-639-1";
import { userUpdateSchema, scheduleSchema, barberSchema } from "@/lib/schemas";

export default function BarberOnboarding() {
  const router = useRouter();
  const { user, appUser } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1
  const [bio, setBio] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCityOption, setSelectedCityOption] = useState<any>(null);
  const [phoneCode, setPhoneCode] = useState<any>(null);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<any>([]);
  
  // Step 2
  const [vibe, setVibe] = useState<string[]>([]);
  const [days, setDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [specialty, setSpecialty] = useState<string[]>([]);
  const [clientele, setClientele] = useState<string[]>([]);
  // Step 3
  const [servicesData, setServicesData] = useState([
    { name: "Skin Fade", duration: "45", price: "18" }, 
    { name: "Classic Cut", duration: "30", price: "14" }
  ]);
  const [titzData, setTitzData] = useState({ duration: "45", price: "20" });
  const toggleVibe = (v: string) => setVibe(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const toggleSpec = (s: string) => setSpecialty(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleClientele = (c: string) => setClientele(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

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

  const handleLaunch = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      // 0. Data Integrity Fix
      const userRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userRef, userUpdateSchema.parse({ 
                  createdAt: Date.now(), 
                  role: 'barber'
                }), { merge: true });
      } catch (e: any) { 
        throw new Error("Step 0: Data Integrity Setup failed - " + e.message); 
      }

      // Generate Unique Barber Code
      let uniqueCode = '';
      let isUnique = false;
      while (!isUnique) {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        uniqueCode = `TZB-${randomString}`;
        const q = query(collection(db, 'barberProfiles'), where('barberCode', '==', uniqueCode));
        const qs = await getDocs(q);
        if (qs.empty) {
          isUnique = true;
        }
      }

      // 1. BarberProfile
      const profileRef = doc(db, 'barberProfiles', user.uid);
      try {
        await setDoc(profileRef, barberSchema.parse({
                  userId: user.uid,
                  bio: bio || "Professional barber.",
                  city: selectedCityOption ? selectedCityOption.value : "Unknown",
                  country: selectedCountry ? selectedCountry.value : "Unknown",
                  phone: phoneCode && phoneNumberInput ? `+${phoneCode.value} ${phoneNumberInput}` : null,
                  languages: selectedLanguages.length ? selectedLanguages.map((l: any) => l.value) : ["English"],
                  vibes: vibe,
                  specialties: specialty,
                  clientele: clientele,
                  barberCode: uniqueCode,
                  titeZMeCut: {
                    durationMinutes: parseInt(titzData.duration || "45"),
                    price: parseFloat(titzData.price || "20")
                  },
                  isSolo: true,
                  shopId: null,
                  rating: 0,
                  totalCuts: 0,
                  reviewCount: 0,
                  photos: [],
                  isLive: false,
                  isOnboarded: true,
                  approvalStatus: 'pending'
                }));
      } catch (e: any) { throw new Error("Step 1: Profile creation failed - " + e.message); }

      // 2. Schedule
      const scheduleRef = doc(db, 'schedules', `${user.uid}_shard_0`);
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

      // 3. Services
      for (const svc of servicesData) {
        if (!svc.name) continue;
        const newServiceRef = doc(collection(db, 'services'));
        try {
          await setDoc(newServiceRef, {
            providerId: user.uid,
            providerType: 'barber',
            name: svc.name,
            duration: parseInt((svc as any).duration || (svc as any).dur || "30"),
            price: parseFloat(svc.price || "0"),
            isActive: true
          });
        } catch (e: any) { throw new Error(`Step 3: Service creation failed (${svc.name}) - ` + e.message); }
      }

      // 4. User update
      try {
        await updateDoc(userRef, userUpdateSchema.parse({ isOnboarded: true }));
      } catch(e: any) { throw new Error("Step 4: User confirmation flag failed - " + e.message); }

      // await batch.commit(); // Batch replaced to help debug
      window.location.href = '/dashboard/barber';

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || String(err));
      setIsSubmitting(false);
    }
  };

  const stepTitles = ["Basic Info", "Your Vibe", "Services", "Go Live 🚀"];

  return (
    <div className="max-w-[560px] mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="animate-fadeUp text-center mb-9">
        <div className="text-3xl mb-2">💈</div>
        <h1 className="text-2xl font-black">Set up your profile</h1>
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
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">FIRST NAME</label>
              <div className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-[#888] text-sm cursor-not-allowed">
                {appUser?.firstName || "—"}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">LAST NAME</label>
              <div className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-[#888] text-sm cursor-not-allowed">
                {appUser?.lastName || "—"}
              </div>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">PHONE NUMBER</label>
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
                  className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]" 
                  placeholder="600 000 000" 
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">LOCATION</label>
            <div className="grid grid-cols-2 gap-3">
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
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-1.5">BIO</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] resize-y" rows={3} placeholder="Tell clients who you are, your style, your experience..." />
          </div>
          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-2">LANGUAGES</label>
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

      {/* STEP 2: Vibe */}
      {step === 2 && (
        <div className="animate-fadeUp">
          <p className="text-brand-text-secondary text-sm mb-5 leading-[1.7]">
            Help clients know what kind of energy to expect. You can pick more than one.
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
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-2">SPECIALTIES</label>
            <div className="flex flex-wrap gap-2">
              {[
                "Skin Fade / Bald Fade",
                "Low Fade",
                "Mid Fade",
                "High Fade",
                "Taper",
                "Classic Cut / Scissor Cut",
                "Textured Crop",
                "Buzz Cut",
                "Line Up / Edge Up",
                "Beard Trim & Shape",
                "Hot Towel Shave / Straight Razor",
                "Locs / Dreadlocks",
                "Curly Hair / Afro",
                "Kids Cut",
                "Design / Pattern Cut",
                "Colour & Bleach",
                "Hair & Beard Combo"
              ].map(s => (
                <button 
                  key={s} 
                  onClick={() => toggleSpec(s)}
                  className={`rounded-[10px] px-3.5 py-2 text-xs font-extrabold text-center border-2 transition-all cursor-pointer ${
                    specialty.includes(s) 
                      ? "border-brand-yellow bg-[#1a1500] text-brand-yellow" 
                      : "border-[#2a2a2a] bg-[#141414] text-[#888] hover:border-[#444] hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-extrabold text-brand-text-secondary block mb-2">WHO DO YOU WORK WITH?</label>
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

      {/* STEP 3: Services */}
      {step === 3 && (
        <div className="animate-fadeUp flex flex-col gap-3.5">
          <div className="bg-[#0d1a2e] border border-[#1e3a5f] rounded-xl p-3.5 text-[13px] text-[#93c5fd]">
            ℹ️ Add the services you offer. You can edit these anytime from your dashboard.
          </div>
          
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 border-l-4 border-l-brand-yellow relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-yellow text-[#0a0a0a] text-[9px] font-black px-2 py-0.5 rounded-bl-lg">REQUIRED</div>
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
                  <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">SERVICE NAME</label>
                  <input value={s.name} onChange={e => setServicesData(prev => prev.map((x, j) => j === i ? {...x, name: e.target.value} : x))} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow" />
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
            + Add service
          </button>
        </div>
      )}

      {/* STEP 4: Go Live */}
      {step === 4 && (
        <div className="animate-fadeUp text-center">
          <div className="text-[56px] mb-4">🚀</div>
          <h2 className="text-2xl font-black mb-2.5">You&apos;re ready to go live!</h2>
          <p className="text-brand-text-secondary text-sm leading-[1.7] mb-7">
            Your profile will be visible to clients searching in your city the moment you hit launch.
            You can always come back and edit anything.
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

          <button 
            disabled={isSubmitting}
            onClick={handleLaunch} 
            className="bg-brand-yellow text-[#0a0a0a] w-full flex justify-center text-base px-7 py-4 rounded-full font-black transition-all hover:-translate-y-px disabled:opacity-50"
          >
            {isSubmitting ? 'Launching... 🚀' : 'Launch My Profile 🚀'}
          </button>
        </div>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex justify-between mt-7">
          {step > 1 ? (
            <button className="bg-transparent text-white border-[1.5px] border-[#2a2a2a] px-6 py-3 rounded-full font-extrabold text-sm transition-all hover:border-[#555]" onClick={() => setStep(s => s - 1)}>← Back</button>
          ) : <div />}
          <button className="bg-brand-yellow text-[#0a0a0a] px-7 py-3 rounded-full font-black text-sm transition-all hover:-translate-y-px" onClick={() => setStep(s => s + 1)}>
            {step === 3 ? "Review & Launch →" : "Continue →"}
          </button>
        </div>
      )}
    </div>
  );
}
