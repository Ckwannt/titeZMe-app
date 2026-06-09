'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { query, where, orderBy, doc, getDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { DeleteAccountButton } from '@/components/DeleteAccountButton';
import { toast } from '@/lib/toast';
import Link from 'next/link';
import { userUpdateSchema, bookingUpdateSchema } from "@/lib/schemas";
import { cleanupBookingLock } from '@/lib/booking-lock-utils';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import Image from 'next/image';
import { useLang } from '@/lib/i18n/LangContext';

type ShopCache = {
  name?: string;
  logoUrl?: string;
  googleMapsUrl?: string;
  address?: {
    street?: string;
    number?: string;
    city?: string;
    country?: string;
  };
};

export default function ClientDashboard() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();

  const { t } = useLang();
  const [activeTab, setActiveTab] = useState("Bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const shopCacheRef = useRef<Record<string, ShopCache>>({});

  useEffect(() => { document.title = 'My Bookings — titeZMe'; }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (appUser?.role === 'barber') {
      router.replace('/dashboard/barber');
      return;
    }
    if (appUser?.role !== 'client') {
      router.replace('/login');
    }
  }, [user, appUser, loading, router]);

  // Real-time bookings listener — updates immediately when booking is created,
  // accepted, cancelled, or completed without any page refresh needed.
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'bookings'),
      where('clientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      async (snap) => {
        const enriched = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const b = { id: docSnap.id, ...docSnap.data() } as any;
            // Enrich with barber name if not already stored
            if (b.barberId && !b.barberName) {
              try {
                const bProfile = await getDoc(doc(db, 'users', b.barberId));
                if (bProfile.exists()) {
                  const u = bProfile.data();
                  b.barberName = `${u.firstName || ''} ${u.lastName || ''}`.trim();
                }
              } catch (e) {
                console.error('Failed to enrich barber name:', e);
              }
            }
            // Handle old (serviceId) and new (serviceNames) structures
            if (b.serviceNames && Array.isArray(b.serviceNames)) {
              b.serviceName = b.serviceNames.join(', ');
            } else if (b.serviceId && !b.serviceName) {
              try {
                const svc = await getDoc(doc(db, 'services', b.serviceId));
                if (svc.exists()) b.serviceName = svc.data().name;
              } catch (e) {
                console.error('Failed to enrich service name:', e);
              }
            }
            return b;
          })
        );

        for (const b of enriched) {
          if (b.bookingContext === 'shop' && b.shopId) {
            if (!shopCacheRef.current[b.shopId]) {
              try {
                const shopSnap = await getDoc(doc(db, 'barbershops', b.shopId));
                if (shopSnap.exists()) {
                  shopCacheRef.current[b.shopId] = shopSnap.data() as ShopCache;
                }
              } catch {
                // silent fail
              }
            }
            const shopData = shopCacheRef.current[b.shopId];
            if (shopData) {
              b.shopName = shopData.name;
              b.shopLogoUrl = shopData.logoUrl;
              b.shopGoogleMapsUrl = shopData.googleMapsUrl;
              b.shopAddress = shopData.address;
            }
          }
        }

        setBookings(enriched);
        setFetching(false);
      },
      (err) => {
        console.error('Client bookings listener error:', err);
        setFetching(false);
      }
    );

    return () => unsub();
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancelBooking = async (bId: string, dateStr: string, timeStr: string) => {
    // Check if more than 2 hours
    const bDate = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    if ((bDate.getTime() - now.getTime()) < 2 * 60 * 60 * 1000) {
      toast.error(t('clientDash.cannotCancelSoon'));
      return;
    }
    const loadingToast = toast.loading(t('clientDash.cancellingAppt'));
    try {
      const timeNow = Date.now();
      const bookingDoc = bookings.find(b => b.id === bId);
      await updateDoc(doc(db, 'bookings', bId), bookingUpdateSchema.parse({ status: 'cancelled_by_client', updatedAt: timeNow }));
      // Clean up the booking lock so the slot becomes bookable again
      if (bookingDoc) {
        await cleanupBookingLock({
          barberId: bookingDoc.barberId,
          date: bookingDoc.date,
          startTime: bookingDoc.startTime,
          endTime: bookingDoc.endTime,
          id: bId,
        });
      }
      // onSnapshot listener above will auto-refresh the bookings list
      toast.success(t('clientDash.apptCancelled'), { id: loadingToast });
    } catch(e) {
      console.error(e);
      toast.error(t('clientDash.failedToCancel'), { id: loadingToast });
    }
  }

  if (fetching || loading) return <div className="p-10 text-center animate-pulse text-brand-text-secondary">Loading...</div>;

  const now = new Date();
  const upcomingBookings = bookings.filter(b => {
    if (b.status === 'cancelled' || b.status === 'cancelled_by_client') return false;
    const bd = new Date(`${b.date}T${b.startTime}`);
    return bd >= now;
  }).reverse(); // we want soonest first
  
  const pastBookings = bookings.filter(b => {
    if (b.status === 'cancelled' || b.status === 'cancelled_by_client') return true;
    const bd = new Date(`${b.date}T${b.startTime}`);
    return bd < now;
  });

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
            <div className="text-[11px] text-brand-text-secondary font-bold">{t('clientDash.clientRole')}</div>
          </div>
        </div>
        
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          <button 
            onClick={() => setActiveTab("Bookings")}
            className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 bg-[#1a1a1a] text-brand-yellow`}
          >
            <span>📅</span> {t('clientDash.myBookings')}
          </button>
          <button 
            onClick={() => router.push('/dashboard/client/settings')}
            className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 text-[#888] hover:bg-[#1a1a1a] hover:text-white`}
          >
            <span>⚙️</span> {t('clientDash.settings')}
          </button>
        </div>

        <div className="mt-auto hidden md:block">
          <DeleteAccountButton role="client" />
        </div>
      </div>

      <div className="flex-1 p-6 md:p-8 md:px-10 overflow-y-auto max-h-[calc(100vh-53px)]">
        {activeTab === "Bookings" && (
           <div className="animate-fadeUp max-w-[700px]">
             <h2 className="text-2xl font-black mb-6">{t('clientDash.upcomingAppointments')}</h2>
             <div className="flex flex-col gap-3.5 mb-10">
               {upcomingBookings.length === 0 ? (
                 <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 text-center text-sm font-bold text-brand-text-secondary">
                   {t('clientDash.noUpcomingBookings')} <Link href="/barbers" className="text-brand-yellow font-bold no-underline">{t('emptyStates.findABarber')}</Link> · <Link href="/shops" className="text-brand-yellow font-bold no-underline">{t('clientDash.findABarbershop')}</Link>
                 </div>
               ) : (
                 upcomingBookings.map(b => (
                   <div
                     key={b.id}
                     className="bg-brand-surface border border-brand-border rounded-2xl p-5 border-l-[4px] border-l-brand-yellow"
                   >
                     {/* Header row — date/time + price */}
                     <div className="flex justify-between items-start mb-3">
                       <div className="font-black text-lg text-brand-yellow">
                         {new Date(b.date).toLocaleDateString()} at {b.startTime}
                       </div>
                       <div className="text-right">
                         <div className="font-black text-white bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#2a2a2a]">
                           €{b.price}
                         </div>
                         <div className="text-[10px] text-[#555] font-bold mt-1">
                           💵 Cash
                         </div>
                       </div>
                     </div>

                     {/* Shop context block */}
                     {b.bookingContext === 'shop' && b.shopName ? (
                       <div className="mb-3">
                         <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] font-black text-[#F5C518] bg-[#1a1400] border border-[#F5C51830] px-2 py-0.5 rounded-full uppercase tracking-wide">
                             🏪 Shop
                           </span>
                           <span className="font-black text-sm text-white">
                             {b.shopName}
                           </span>
                         </div>
                         <div className="text-xs text-[#666] font-bold mb-1">
                           ✂️ with {b.barberName}
                         </div>
                         <div className="text-xs font-bold text-[#888]">
                           {b.serviceName}
                         </div>
                         {b.shopAddress && (
                           <div className="text-[11px] text-[#555] mt-1.5">
                             📍 {[
                               b.shopAddress.street,
                               b.shopAddress.number,
                               b.shopAddress.city,
                             ].filter(Boolean).join(', ')}
                           </div>
                         )}
                         {b.shopGoogleMapsUrl && (
                           <a
                             href={b.shopGoogleMapsUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-1 text-[11px] font-black text-[#F5C518] hover:underline mt-1.5"
                           >
                             🗺 Open in Google Maps →
                           </a>
                         )}
                       </div>
                     ) : (
                       <div className="mb-3">
                         <div className="font-black text-sm text-white mb-0.5">
                           {b.barberName}
                         </div>
                         <div className="text-xs text-brand-text-secondary font-bold">
                           {b.serviceName}
                         </div>
                       </div>
                     )}

                     {/* Status + actions row */}
                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#2a2a2a]">
                       <span className="text-[11px] font-extrabold text-[#555] uppercase tracking-wide">
                         Status: {b.status}
                       </span>
                       {b.status === 'completed' && (
                         b.hasReview
                           ? <span className="text-[11px] font-black text-[#22C55E]">
                               {t('clientDash.reviewed')}
                             </span>
                           : <button
                               onClick={() => router.push(`/review/${b.id}`)}
                               className="text-[11px] font-black text-brand-yellow border border-brand-yellow hover:bg-[#1a1500] px-3 py-1.5 rounded-lg transition-colors"
                             >
                               {t('clientDash.leaveReview')}
                             </button>
                       )}
                       {(b.status === 'pending' || b.status === 'confirmed') && (
                         <button
                           onClick={() => setConfirmCancel(b.id)}
                           className="text-[11px] font-black text-brand-red hover:bg-[#1a0808] px-3 py-1.5 rounded-lg transition-colors"
                         >
                           {t('clientDash.cancelBooking')}
                         </button>
                       )}
                     </div>
                   </div>
                 ))
               )}
             </div>

             <h2 className="text-2xl font-black mb-6">{t('clientDash.pastCancelled')}</h2>
             <div className="flex flex-col gap-3.5 opacity-70">
               {pastBookings.length === 0 ? (
                 <div className="text-sm font-bold text-[#555]">{t('clientDash.noPastHistory')}</div>
               ) : (
                 pastBookings.map(b => (
                   <div key={b.id} className="bg-transparent border border-[#2a2a2a] rounded-2xl p-4 flex justify-between items-center">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-brand-text-secondary mb-0.5">{b.date} • {b.startTime}</div>
                        {b.bookingContext === 'shop' && b.shopName ? (
                          <div>
                            <div className="font-extrabold text-sm text-white">
                              {b.shopName}
                            </div>
                            <div className="text-xs text-[#555] font-bold">
                              {b.barberName} · {b.serviceName}
                            </div>
                          </div>
                        ) : (
                          <div className="font-extrabold text-sm text-white">
                            {b.barberName} · {b.serviceName}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-white text-sm mb-0.5">€{b.price}</div>
                        <div className="text-[10px] font-black uppercase text-[#666] mb-1">{b.status}</div>
                        {b.status === 'completed' && (
                          b.hasReview
                            ? <span className="text-[10px] font-extrabold text-[#22C55E]">{t('clientDash.reviewed')}</span>
                            : <button onClick={() => router.push(`/review/${b.id}`)} className="text-[10px] font-extrabold text-brand-yellow hover:underline">{t('clientDash.leaveReview')}</button>
                        )}
                      </div>
                   </div>
                 ))
               )}
             </div>
           </div>
        )}
      </div>
      <ConfirmDialog
        isOpen={!!confirmCancel}
        title={t('clientDash.cancelBookingTitle')}
        message={t('clientDash.cancelBookingMsg')}
        confirmText={t('clientDash.yesCancel')}
        cancelText={t('clientDash.keepBooking')}
        confirmColor="#EF4444"
        onCancel={() => setConfirmCancel(null)}
        onConfirm={async () => {
          const booking = bookings.find(b => b.id === confirmCancel);
          if (booking) await cancelBooking(confirmCancel!, booking.date, booking.startTime);
          setConfirmCancel(null);
        }}
      />
    </div>
  );
}
