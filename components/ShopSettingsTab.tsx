'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import Select from "react-select";
import { Country, City } from "country-state-city";
import { useRouter } from "next/navigation";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { barbershopUpdateSchema } from "@/lib/schemas";

interface ShopSettingsTabProps {
  shop: any;
  mutateShop: () => void;
}

export function ShopSettingsTab({ shop, mutateShop }: ShopSettingsTabProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [photoLoading, setPhotoLoading] = useState(false);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [localPhotoUrl, setLocalPhotoUrl] = useState('');

  const [formData, setFormData] = useState({
    name: shop?.name || '',
    street: shop?.address?.street || '',
    buildingNumber: shop?.address?.buildingNumber || '',
    postalCode: shop?.address?.postalCode || '',
    floorSuite: shop?.address?.floorSuite || '',
    description: shop?.description || '',
  });

  const existingPhoneParts = (shop?.contactPhone || '').split(' ');
  const initPhoneCodeStr = existingPhoneParts[0]?.replace('+', '') || '';
  const initPhoneNumStr = existingPhoneParts.length > 1 ? existingPhoneParts.slice(1).join('') : (existingPhoneParts[0] && !existingPhoneParts[0].startsWith('+') ? existingPhoneParts[0] : '');

  const [phoneNumberInput, setPhoneNumberInput] = useState(initPhoneNumStr);
  const [phoneCode, setPhoneCode] = useState<any>(null);
  
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedCityOption, setSelectedCityOption] = useState<any>(null);

  const countryOptions = useMemo(() => Country.getAllCountries().map(c => ({
    value: c.isoCode,
    label: `${c.flag} ${c.name}`
  })), []);
  
  const phoneCodeOptions = useMemo(() => Country.getAllCountries().map(c => ({
    value: c.phonecode,
    label: `${c.flag} ${c.name} (+${c.phonecode})`
  })), []);
  
  useEffect(() => {
    setTimeout(() => {
      if (initPhoneCodeStr) {
        const match = phoneCodeOptions.find(o => o.value === initPhoneCodeStr);
        if (match) setPhoneCode(match);
      }
      if (shop?.address?.country) {
        const match = countryOptions.find(o => o.value === shop.address.country);
        if (match) setSelectedCountry(match);
      }
    }, 0);
  }, [initPhoneCodeStr, shop?.address?.country, phoneCodeOptions, countryOptions]);

  useEffect(() => {
    setTimeout(() => {
      if (shop?.address?.city && selectedCountry) {
        const cities = City.getCitiesOfCountry(selectedCountry.value) || [];
        const match = cities.find(c => c.name === shop.address.city);
        if (match) {
          setSelectedCityOption({ value: match.name, label: match.name });
        } else if (shop.address.city) {
          setSelectedCityOption({ value: shop.address.city, label: shop.address.city });
        }
      }
    }, 0);
  }, [shop?.address?.city, selectedCountry]);

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
    instagram: shop?.instagram || '',
    facebook: shop?.facebook || '',
    tiktok: shop?.tiktok || ''
  });

  const [googleMapsUrl, setGoogleMapsUrl] = useState(shop?.googleMapsUrl || '');
  const [savingMaps, setSavingMaps] = useState(false);
  const [notifyInviteResponse, setNotifyInviteResponse] = useState(shop?.notifyInviteResponse !== false);
  const [notifyNewBooking, setNotifyNewBooking] = useState(shop?.notifyNewBooking !== false);

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
        maxSizeMB: 1, // Shop profile max 1MB
        maxWidthOrHeight: 1200, // Shop profile max 1200px
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);

      const storageRef = ref(storage, `shop-profile/${user.uid}/cover.jpg`);
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
            await updateDoc(doc(db, 'barbershops', user.uid), barbershopUpdateSchema.parse({ coverPhotoUrl: downloadURL }));
            setLocalPhotoUrl(downloadURL);
            mutateShop();
            setSuccessMsg('Shop photo updated!');
          } catch (err) {
             console.error("Database Update Error:", err);
             setErrorMsg('Failed to update shop photo URL in database.');
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
    if (!formData.name || !formData.street || !formData.buildingNumber || !formData.postalCode) {
      setErrorMsg("Please fill in all required fields marked with *");
      return;
    }

    setSavingGlobal(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const phoneStr = phoneCode && phoneNumberInput ? `+${phoneCode.value} ${phoneNumberInput}` : null;
      const cityStr = selectedCityOption ? selectedCityOption.value : "";
      const countryStr = selectedCountry ? selectedCountry.value : "";

      await updateDoc(doc(db, 'barbershops', user.uid), barbershopUpdateSchema.parse({
              name: formData.name,
              contactEmail: shop.contactEmail,
              contactPhone: phoneStr,
              address: {
                country: countryStr,
                city: cityStr,
                street: formData.street,
                buildingNumber: formData.buildingNumber,
                postalCode: formData.postalCode,
                floorSuite: formData.floorSuite
              },
              description: formData.description,
            }));
      mutateShop();
      setSuccessMsg('Shop info saved!');
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to save shop info.');
    }
    setSavingGlobal(false);
  };

  const handleSaveSocial = async () => {
    if (!user) return;
    setSavingSocial(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updateDoc(doc(db, 'barbershops', user.uid), barbershopUpdateSchema.parse({
              instagram: socialData.instagram,
              facebook: socialData.facebook,
              tiktok: socialData.tiktok
            }));
      mutateShop();
      setSuccessMsg('Social links saved!');
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to save social links.');
    }
    setSavingSocial(false);
  };

  const handleSaveMaps = async () => {
    if (!user) return;
    setSavingMaps(true);
    setErrorMsg(''); setSuccessMsg('');
    try {
      await updateDoc(doc(db, 'barbershops', user.uid), barbershopUpdateSchema.parse({ googleMapsUrl }));
      mutateShop();
      setSuccessMsg('Maps link saved!');
    } catch (e) {
      console.error(e);
      setErrorMsg('Failed to save maps link.');
    }
    setSavingMaps(false);
  };

  const handleToggleNotif = async (field: 'notifyInviteResponse' | 'notifyNewBooking', value: boolean) => {
    if (!user) return;
    if (field === 'notifyInviteResponse') setNotifyInviteResponse(value);
    else setNotifyNewBooking(value);
    try {
      await updateDoc(doc(db, 'users', user.uid), { [field]: value });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteShop = async () => {
    if(!confirm("Are you sure you want to permanently delete your shop profile? All your team members will be removed from the shop.")) return;
    setDeleting(true);
    try {
      // Deleting a shop requires a complex set of operations. We'll do it using a cloud function normally, 
      // but here we just update the user's status since this is an MVP. Wait, prompt says:
      // "On confirm: 1. Update all barbers where shopId == uid ... 6. Update users... 8. Redirect"
      // we'll hit the /api/shop/delete endpoint if it existed, or we do it directly.
      // But we can't easily query and delete everything blindly without batch. Let's do the minimum requested for MVP.
      
      const { collection, getDocs, query, where, writeBatch } = await import('firebase/firestore');
      const batch = writeBatch(db);
      
      // 1. Update all barbers
      const barbersSnap = await getDocs(query(collection(db, 'barberProfiles'), where('shopId', '==', user?.uid)));
      barbersSnap.docs.forEach(d => batch.update(d.ref, { shopId: null, isSolo: true }));

      // 2. Delete services
      const servicesSnap = await getDocs(query(collection(db, 'services'), where('providerId', '==', user?.uid), where('providerType', '==', 'shop')));
      servicesSnap.docs.forEach(d => batch.delete(d.ref));

      // 3. Delete invites
      const invitesSnap = await getDocs(query(collection(db, 'invites'), where('shopId', '==', user?.uid)));
      invitesSnap.docs.forEach(d => batch.delete(d.ref));

      // 4. Delete schedule
      batch.delete(doc(db, 'schedules', `${user!.uid}_shard_0`));

      // 5. Delete shop
      batch.delete(doc(db, 'barbershops', user!.uid));

      // 6 & 7. Update users and barbers collection for owner
      batch.update(doc(db, 'users', user!.uid), { ownsShop: false });
      batch.update(doc(db, 'barberProfiles', user!.uid), { ownsShop: false, shopId: null });

      await batch.commit();

      router.push('/dashboard/barber');
    } catch(e) {
      console.error(e);
      setErrorMsg("Failed to delete shop.");
      setDeleting(false);
    }
  }

  const currentPhoto = localPhotoUrl || shop?.coverPhotoUrl;

  return (
    <div className="animate-fadeUp max-w-2xl">
      <h1 className="text-2xl font-black mb-2">Shop Settings ⚙️</h1>
      <p className="text-brand-text-secondary text-sm mb-8">Manage your shop&apos;s public profile and preferences.</p>

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

      {/* SECTION B: SHOP PHOTO */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">Shop Photo</h2>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] shrink-0">
            {currentPhoto ? (
              <Image src={currentPhoto} alt={shop?.name || 'Shop'} fill className="object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-[#555] uppercase">
                {shop?.name?.[0] || 'S'}
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

      {/* SECTION A: SHOP INFO */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4">Shop Info</h2>
        
        <div className="mb-4">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Shop Name *</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
          />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Street Name *</label>
            <input 
              type="text" 
              value={formData.street}
              onChange={e => setFormData({...formData, street: e.target.value})}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
              placeholder="Calle Mayor"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Building Number *</label>
            <input 
              type="text" 
              value={formData.buildingNumber}
              onChange={e => setFormData({...formData, buildingNumber: e.target.value})}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
              placeholder="12"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Postal Code *</label>
            <input 
              type="text" 
              value={formData.postalCode}
              onChange={e => setFormData({...formData, postalCode: e.target.value})}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
              placeholder="28013"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Floor / Suite (Optional)</label>
            <input 
              type="text" 
              value={formData.floorSuite}
              onChange={e => setFormData({...formData, floorSuite: e.target.value})}
              className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm"
              placeholder="2º B"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Description</label>
          <textarea 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm h-24 resize-none focus:border-brand-yellow outline-none"
            placeholder="Tell clients about your shop..."
          />
        </div>

        <button 
          onClick={handleSaveInfo}
          disabled={savingGlobal}
          className="bg-brand-yellow text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-500 disabled:opacity-50"
        >
          {savingGlobal ? 'Saving...' : 'Save Shop Info'}
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

      {/* SECTION D: GOOGLE MAPS */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-1">Google Maps link</h2>
        <p className="text-[#888] text-xs mb-5">Help clients find your exact location.</p>

        {/* Auto-generated link from address */}
        {shop?.address?.street && (
          <div className="mb-4">
            <div className="text-[10px] font-bold text-[#555] uppercase mb-1.5">Auto-generated from your address</div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([shop.address.street, shop.address.buildingNumber, shop.address.city, shop.address.country].filter(Boolean).join(' '))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-brand-yellow hover:underline break-all"
            >
              🗺️ Preview auto-generated map link →
            </a>
          </div>
        )}

        <div className="mb-4">
          <label className="text-xs font-bold text-[#888] block mb-1.5 uppercase">Or paste your own Google Maps URL</label>
          <input
            type="url"
            value={googleMapsUrl}
            onChange={e => setGoogleMapsUrl(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:border-brand-yellow outline-none"
            placeholder="https://maps.google.com/..."
          />
        </div>
        <button
          onClick={handleSaveMaps}
          disabled={savingMaps}
          className="bg-brand-yellow text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-400 disabled:opacity-50"
        >
          {savingMaps ? 'Saving...' : 'Save Maps link'}
        </button>
      </section>

      {/* SECTION E: NOTIFICATIONS */}
      <section className="mb-10 bg-brand-surface border border-brand-border rounded-3xl p-6">
        <h2 className="text-lg font-black mb-5">Notification preferences</h2>
        {[
          {
            field: 'notifyInviteResponse' as const,
            label: 'Email me when a barber accepts or declines an invite',
            value: notifyInviteResponse,
          },
          {
            field: 'notifyNewBooking' as const,
            label: 'Email me when a new booking is made at my shop',
            value: notifyNewBooking,
          },
        ].map(({ field, label, value }) => (
          <div key={field} className="flex items-center justify-between gap-4 mb-4">
            <span className="text-sm font-bold text-[#aaa] flex-1">{label}</span>
            <button
              onClick={() => handleToggleNotif(field, !value)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? 'bg-brand-yellow' : 'bg-[#2a2a2a]'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </section>

      {/* SECTION F: DANGER ZONE */}
      <section className="bg-[#1a0808] border border-brand-red/30 rounded-3xl p-6">
        <h2 className="text-lg font-black text-brand-red mb-2">Delete Shop Profile</h2>
        <p className="text-[#888] text-sm mb-6">This permanently deletes your shop profile, removes all barbers from your team, and deletes all shop data. Your personal barber account will NOT be deleted.</p>
        <div className="w-max">
           <button 
             onClick={handleDeleteShop}
             disabled={deleting}
             className="bg-brand-red text-white px-6 py-3 rounded-xl font-bold text-[13px] tracking-wide transition-colors hover:bg-red-700 disabled:opacity-50"
           >
             {deleting ? 'Deleting...' : 'Delete Shop Profile'}
           </button>
        </div>
      </section>
    </div>
  );
}
