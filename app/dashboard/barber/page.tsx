'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { collection, doc, query, where, updateDoc, deleteDoc, setDoc, getDoc, getDocs, writeBatch, increment, onSnapshot, orderBy, addDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AvailabilityGrid } from "@/components/AvailabilityGrid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarberInvitesTab } from '@/components/BarberInvitesTab';
import { BarberPortfolioTab } from '@/components/BarberPortfolioTab';
import { BarberSettingsTab } from '@/components/BarberSettingsTab';
import { BookingRowSkeleton, StatCardSkeleton } from '@/components/skeletons';
import { barberUpdateSchema, bookingUpdateSchema, notificationSchema } from "@/lib/schemas";

export default function BarberDashboard() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [bookingsTab, setBookingsTab] = useState("today");
  
  // Services State
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState("");
  const [titzData, setTitzData] = useState({ duration: "45", price: "20" });
  const [isSavingTitz, setIsSavingTitz] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockDate, setBlockDate] = useState('');
  const [blockLoading, setBlockLoading] = useState(false);

  const handleCopyCode = () => {
    if (profile?.barberCode) {
      navigator.clipboard.writeText(profile.barberCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'barberProfiles', user!.uid));
      const data = snap.exists() ? snap.data() : null;
      if (data?.titeZMeCut) {
        setTitzData({
          duration: data.titeZMeCut.durationMinutes?.toString() || "45",
          price: data.titeZMeCut.price?.toString() || "20"
        });
      }
      return data;
    },
    enabled: !!user
  });

  const { data: schedule } = useQuery({
    queryKey: ['schedule', user?.uid],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'schedules', `${user!.uid}_shard_0`));
      return snap.exists() ? snap.data() : null;
    },
    enabled: !!user
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services', user?.uid],
    queryFn: async () => {
      const q = query(collection(db, 'services'), where("providerId", "==", user!.uid));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
    enabled: !!user
  });

  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, 'bookings'),
      where('barberId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBookings(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const mutateProfile = () => queryClient.invalidateQueries({ queryKey: ['profile', user?.uid] });
  const mutateServices = () => queryClient.invalidateQueries({ queryKey: ['services', user?.uid] });

  const updateBookingStatus = async (id: string, status: string) => {
    try { 
      const timeNow = Date.now();
      const booking = bookings.find((b: any) => b.id === id);
      
      const batch = writeBatch(db);
      batch.update(doc(db, 'bookings', id), bookingUpdateSchema.parse({ status, updatedAt: timeNow })); 
      
      if (status === 'completed' && booking && booking.status !== 'completed' && user) {
        batch.update(doc(db, 'barberProfiles', user.uid), { 
          totalCuts: increment(1)
        });
        
        if (profile?.shopId) {
          batch.update(doc(db, 'barbershops', profile.shopId), {
            totalBookings: increment(1)
          });
        }

        // Monthly Aggregations
        const dateObj = new Date(booking.date || timeNow);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const aggRef = doc(db, 'aggregations', `${user.uid}_${yyyy}_${mm}`);
        
        // Use set with merge: true in batch to handle document creation if it doesn't exist
        batch.set(aggRef, {
          totalCuts: increment(1),
          totalRevenue: increment(Number(booking.price) || 0),
          totalHours: increment((Number(booking.duration) || 30) / 60)
        }, { merge: true });
      }
      
      await batch.commit();
      // onSnapshot listener updates bookings state automatically

      // Notify client on accept or decline
      if (booking?.clientId && (status === 'confirmed' || status === 'cancelled_by_barber')) {
        const message = status === 'confirmed'
          ? `Your booking on ${booking.date} at ${booking.startTime} has been confirmed by your barber. See you there!`
          : `Your booking on ${booking.date} at ${booking.startTime} was cancelled by your barber.`;
        await addDoc(collection(db, 'notifications'), notificationSchema.parse({
          userId: booking.clientId,
          message,
          read: false,
          linkTo: '/dashboard/client',
          createdAt: Date.now()
        }));
      }
    }
    catch (e: any) { console.error('Error updating status', e); }
  };

  const addService = async () => {
    if (!newServiceName || !newServicePrice || !user) return;
    try {
      const ref = doc(collection(db, 'services'));
      await setDoc(ref, {
        providerId: user.uid,
        providerType: 'barber',
        name: newServiceName,
        duration: parseInt(newServiceDuration) || 30,
        price: parseFloat(newServicePrice),
        isActive: true
      });
      setNewServiceName(""); setNewServicePrice(""); setNewServiceDuration("");
      queryClient.invalidateQueries({ queryKey: ['services', user?.uid] });
    } catch (e) {
      console.error(e);
    }
  };

  const saveLiveStatus = async (isLive: boolean) => {
    if (!user) return;
    try { 
      await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({ isLive }));
      queryClient.invalidateQueries({ queryKey: ['profile', user?.uid] });
      setToastMessage(isLive ? "You are now accepting bookings ✓" : "Bookings paused");
      setTimeout(() => setToastMessage(''), 3000);
    }
    catch(e) { console.error(e); }
  }

  const handleBlockDay = async () => {
    if (!blockDate || !user) return;
    const currentBlocked: string[] = (schedule as any)?.blockedDates || [];
    if (currentBlocked.includes(blockDate)) {
      setToastMessage('You already blocked this day.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    setBlockLoading(true);
    try {
      await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), {
        blockedDates: arrayUnion(blockDate)
      });
      setToastMessage(`${blockDate} blocked. No bookings will be accepted that day.`);
      setTimeout(() => setToastMessage(''), 4000);
      setBlockModalOpen(false);
      setBlockDate('');
    } catch (e) {
      setToastMessage('Failed to block date.');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblockDay = async (date: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), {
        blockedDates: arrayRemove(date)
      });
      setToastMessage('Day unblocked successfully.');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (e) {
      setToastMessage('Failed to unblock date.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  if (!profile && !loading && user) {
    return (
      <div className="flex min-h-[calc(100vh-53px)] flex-col md:flex-row">
        <div className="w-full md:w-[220px] md:border-r border-brand-border p-6 shrink-0 flex flex-col">
          <div className="flex items-center gap-3 mb-7 px-2">
             <div className="w-10 h-10 rounded-xl bg-[#2a2a2a] animate-pulse"></div>
             <div>
               <div className="h-4 w-24 bg-[#2a2a2a] rounded animate-pulse mb-1"></div>
               <div className="h-3 w-12 bg-[#2a2a2a] rounded animate-pulse"></div>
             </div>
          </div>
        </div>
        <div className="flex-1 p-6 md:p-8 md:px-10">
          <div className="max-w-[700px]">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <div className="h-8 w-48 bg-[#2a2a2a] rounded-lg animate-pulse mb-6"></div>
            {[1, 2, 3].map((i) => <BookingRowSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const getDateRange = (tab: string) => {
    const now = new Date();
    if (tab === 'today') {
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      const end = new Date(now); end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (tab === 'this week') {
      const start = new Date(now);
      const day = start.getDay();
      start.setDate(start.getDate() - day + (day === 0 ? -6 : 1));
      start.setHours(0, 0, 0, 0);
      const end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    if (tab === 'this month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    return null;
  };

  const displayBookings = bookings.filter(b => {
    const range = getDateRange(bookingsTab);
    if (!range) return true;
    const bookingDate = new Date(`${b.date}T${b.startTime}`);
    return bookingDate >= range.start && bookingDate <= range.end;
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const saveTitzCut = async () => {
    if (!user) return;
    setIsSavingTitz(true);
    try {
      await updateDoc(doc(db, 'barberProfiles', user.uid), barberUpdateSchema.parse({
              titeZMeCut: {
                durationMinutes: parseInt(titzData.duration) || 45,
                price: parseFloat(titzData.price) || 20,
                currency: 'EUR'
              }
            }));
      mutateProfile();
    } catch(e) {
      console.error(e);
    }
    setIsSavingTitz(false);
  };

  // Availability check
  const hasAvailability = schedule &&
    schedule.availableSlots &&
    Object.keys(schedule.availableSlots).length > 0 &&
    Object.values(schedule.availableSlots).some(
      (slots: any) => Array.isArray(slots) && slots.length > 0
    );

  // Stats calc
  const todayEarnings = displayBookings.filter(b => b.status === "completed").reduce((sum, b) => sum + (b.price || 0), 0);
  const totalCompleted = bookings.filter(b => b.status === "completed").length;
  
  const statusMap: Record<string, {text:string, bg:string, border:string}> = {
    completed: { text: "text-brand-green", bg: "bg-[#0f2010]", border: "border-brand-green/30" },
    confirmed: { text: "text-brand-yellow", bg: "bg-[#1a1500]", border: "border-brand-yellow/30" },
    pending: { text: "text-brand-orange", bg: "bg-[#1a0800]", border: "border-brand-orange/30" },
    cancelled: { text: "text-brand-red", bg: "bg-[#1a0808]", border: "border-brand-red/30" },
    cancelled_by_client: { text: "text-brand-red", bg: "bg-[#1a0808]", border: "border-brand-red/30" },
    cancelled_by_barber: { text: "text-brand-red", bg: "bg-[#1a0808]", border: "border-brand-red/30" },
  };
  const borderColorMap: Record<string, string> = {
    completed: "border-l-brand-green",
    confirmed: "border-l-brand-yellow",
    pending: "border-l-brand-orange",
    cancelled: "border-l-brand-red",
    cancelled_by_client: "border-l-brand-red",
    cancelled_by_barber: "border-l-brand-red",
  };

  return (
    <div className="flex min-h-[calc(100vh-53px)] flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-[220px] md:border-r border-brand-border p-6 shrink-0 flex flex-col">
        <div className="flex items-center gap-3 mb-6 px-2">
          {profile?.profilePhotoUrl || appUser?.photoUrl ? (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
               <Image src={profile?.profilePhotoUrl || appUser?.photoUrl as string} alt="Avatar" fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-yellow flex items-center justify-center font-black text-base text-[#0a0a0a]">
              {appUser?.firstName?.[0] || "B"}
            </div>
          )}
          <div>
            <div className="font-extrabold text-sm">{appUser?.firstName} {appUser?.lastName?.charAt(0)}.</div>
            {profile?.isLive ? (
              <div className="text-[11px] text-brand-green font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" /> Live</div>
            ) : (
              <div className="text-[11px] text-brand-text-secondary font-bold flex items-center gap-1">Hidden</div>
            )}
          </div>
        </div>

        {profile?.barberCode && (
          <div className="mb-7 px-2">
            <div className="text-[10px] font-extrabold text-brand-text-secondary uppercase tracking-wider mb-1">Your Barber Code</div>
            <div className="flex items-center justify-between bg-[#141414] border border-[#2a2a2a] rounded-lg p-2">
              <span className="font-mono text-xs font-black text-brand-yellow">{profile.barberCode}</span>
              <button 
                onClick={handleCopyCode} 
                className="text-xs text-[#888] hover:text-white transition-colors p-1"
                title="Copy to clipboard"
              >
                {copiedCode ? '✓' : '📋'}
              </button>
            </div>
            <div className="text-[9px] text-[#555] font-bold mt-1.5 leading-tight">Share this with shops to receive invites</div>
          </div>
        )}
        
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {[
            { id: "Dashboard", icon: "⚡", label: "Dashboard" },
            { id: "Bookings", icon: "📅", label: "Bookings" },
            { id: "Availability", icon: "⏰", label: "Availability" },
            { id: "Services", icon: "✂️", label: "Services" },
            { id: "Portfolio", icon: "📸", label: "Portfolio" },
            { id: "Invites", icon: "📨", label: "Invites" },
            { id: "Settings", icon: "⚙️", label: "Settings" },
          ].map(l => (
            <button 
              key={l.id} 
              onClick={() => setActiveTab(l.id)}
              className={`flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors shrink-0 ${
                activeTab === l.id ? "bg-[#1a1a1a] text-brand-yellow" : "text-[#888] hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <span>{l.icon}</span> {l.label}
            </button>
          ))}
        </div>

        <div className="md:mt-6 border-t border-brand-border pt-6 hidden md:block">
          <div className="text-[10px] font-extrabold text-[#555] uppercase tracking-wider mb-3 px-2">My Shop</div>
          {appUser?.ownsShop ? (
             <Link 
               href="/dashboard/shop"
               className="flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors text-brand-yellow bg-brand-yellow/10 hover:bg-brand-yellow/20"
             >
               <span>🏪</span> Manage My Shop
             </Link>
          ) : (
            <Link 
              href="/dashboard/barber/create-shop"
              className="flex items-center text-left gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors text-white bg-[#1a1a1a] hover:bg-[#2a2a2a]"
            >
              <span>🏪</span> Create Shop Profile
            </Link>
          )}
        </div>

        <div className="hidden md:block mt-auto pt-6 border-t border-brand-border">
          <div className="flex items-center justify-between px-2 mb-4">
            <span className="text-xs font-bold text-brand-text-secondary">Accept bookings</span>
            <label className="relative w-11 h-6 shrink-0 group cursor-pointer">
              <input type="checkbox" checked={profile?.isLive || false} onChange={e => saveLiveStatus(e.target.checked)} className="peer sr-only" />
              <span className="absolute inset-0 bg-[#2a2a2a] rounded-full transition-colors peer-checked:bg-brand-yellow" />
              <span className="absolute w-[18px] h-[18px] left-[3px] top-[3px] bg-white rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-[#0a0a0a]" />
            </label>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-8 md:px-10 overflow-y-auto max-h-[calc(100vh-53px)] relative">
        {activeTab === "Invites" ? (
          <BarberInvitesTab />
        ) : activeTab === "Portfolio" ? (
          <BarberPortfolioTab profile={profile} mutateProfile={mutateProfile} />
        ) : activeTab === "Settings" ? (
          <BarberSettingsTab profile={profile} mutateProfile={mutateProfile} />
        ) : activeTab === "Dashboard" || activeTab === "Bookings" ? (
          <div className="animate-fadeUp">

            {/* Availability warning */}
            {!hasAvailability && (
              <div className="flex items-center justify-between bg-[#1a1500] border border-[#F5C51844] rounded-[12px] px-[18px] py-[14px] mb-5">
                <div>
                  <div className="text-[13px] font-extrabold text-brand-yellow">⚠️ You haven&apos;t set your availability yet.</div>
                  <div className="text-[11px] text-[#888] font-bold mt-0.5">Clients cannot book you until you add your working hours.</div>
                </div>
                <button
                  onClick={() => setActiveTab('Availability')}
                  className="shrink-0 ml-4 bg-brand-yellow text-[#0a0a0a] font-extrabold text-[12px] px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
                >
                  Set availability →
                </button>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start mb-7 gap-4">
              <div>
                <h1 className="text-2xl font-black">Good morning, {appUser?.firstName} ✂️</h1>
                <p className="text-brand-text-secondary text-sm mt-1">{new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'})} · {displayBookings.length} appointments today</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/barber/${user?.uid}`}
                  target="_blank" rel="noopener noreferrer"
                  className="border border-[#2a2a2a] text-[#888] hover:border-[#F5C518] hover:text-[#F5C518] rounded-full text-[13px] font-extrabold px-5 py-2.5 transition-colors inline-flex items-center"
                >
                  👁 View public profile
                </a>
                <button onClick={() => setBlockModalOpen(true)} className="bg-brand-orange text-white px-7 py-3 rounded-full font-black text-sm transition-all hover:opacity-90 hover:-translate-y-px">
                  + Block time off
                </button>
              </div>
            </div>

            {/* Stats */}
            {activeTab === "Dashboard" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
                {[
                  { val: `€${todayEarnings}`, label: "Today's earnings", delta: `${displayBookings.filter(b=>b.status==='completed').length} cuts`, color: "text-brand-yellow" },
                  { val: `${profile?.totalCuts + totalCompleted}`, label: "Total cuts", delta: `This month: ${totalCompleted}`, color: "text-brand-orange" },
                  { val: `${profile?.rating || 'New'}`, label: "Rating", delta: "★ 0 reviews", color: "text-brand-green" },
                  { val: "100%", label: "Show rate", delta: "0 no-shows", color: "text-brand-green" },
                ].map((s, i) => (
                  <div key={i} className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
                    <div className={`text-[28px] font-black leading-none ${s.color}`}>{s.val}</div>
                    <div className="text-xs text-brand-text-secondary font-bold">{s.label}</div>
                    <div className="text-[11px] font-extrabold text-[#444] mt-1">{s.delta}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Bookings List */}
            <div className="flex gap-1 border-b border-brand-border mb-5">
              {["today", "this week", "this month"].map(t => (
                <button 
                  key={t} onClick={() => setBookingsTab(t)} 
                  className={`px-4.5 py-2.5 text-[13px] font-extrabold capitalize transition-all border-b-2 -mb-[1px] ${bookingsTab === t ? "text-brand-yellow border-brand-yellow" : "text-brand-text-secondary border-transparent hover:text-white"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2.5">
              {displayBookings.length === 0 ? (
                <div className="text-center py-10 bg-brand-surface border border-brand-border rounded-2xl text-brand-text-secondary text-sm">No bookings found for {bookingsTab}.</div>
              ) : displayBookings.map((b) => (
                <div key={b.id} className={`flex flex-wrap sm:flex-nowrap items-center gap-3.5 bg-brand-surface border border-brand-border rounded-[14px] p-3.5 px-4.5 border-l-[4px] ${borderColorMap[b.status]}`}>
                  <div className="text-center shrink-0 w-11">
                    <div className="text-base font-black">{b.startTime}</div>
                  </div>
                  <div className="w-px h-9 bg-brand-border hidden sm:block" />
                  <div className="flex-1 min-w-[150px]">
                    <div className="font-extrabold text-sm">Client {b.clientId.substring(0,4)}...</div>
                    <div className="text-xs text-brand-text-secondary">Service ID: {b.serviceId.substring(0,4)}...</div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${statusMap[b.status]?.bg} ${statusMap[b.status]?.text} ${statusMap[b.status]?.border}`}>
                    {b.status}
                  </div>
                  <div className="font-black text-[15px] text-brand-yellow min-w-[32px] sm:ml-2 text-right">
                    €{b.price}
                  </div>
                  {b.status === "pending" && (
                    <div className="flex gap-1.5 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                      <button onClick={() => updateBookingStatus(b.id, 'confirmed')} className="bg-[#0f2010] border border-brand-green/30 text-brand-green rounded-lg px-3 py-1.5 text-xs font-extrabold hover:bg-brand-green/20">✓ Accept</button>
                      <button onClick={() => updateBookingStatus(b.id, 'cancelled_by_barber')} className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-lg px-3 py-1.5 text-xs font-extrabold hover:bg-brand-red/20">✕ Decline</button>
                    </div>
                  )}
                  {b.status === "confirmed" && (
                    <div className="flex gap-1.5 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                      <button onClick={() => updateBookingStatus(b.id, 'completed')} className="bg-brand-surface border border-brand-border text-white rounded-lg px-3 py-1.5 text-xs font-extrabold hover:border-[#444]">Mark Complete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === "Services" ? (
          <div className="animate-fadeUp max-w-[600px]">
            <h2 className="text-2xl font-black mb-6">Manage Services</h2>
            <div className="flex flex-col gap-3 mb-8">
              {/* Locked titeZMe Cut */}
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-l-4 border-l-brand-yellow">
                <div className="flex-1">
                  <div className="font-black flex items-center gap-1.5">⚡ titeZMe Cut</div>
                  <div className="text-[11px] text-brand-text-secondary mt-1 max-w-[220px]">The barber chooses the cut for you based on your vibe and your budget.</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-brand-yellow transition-colors">
                    <input value={titzData.duration} onChange={e=>setTitzData(prev=>({...prev, duration: e.target.value}))} className="w-14 bg-transparent px-2 py-2 text-white text-xs outline-none text-center border-r-[1.5px] border-[#2a2a2a]" type="number" />
                    <span className="text-[10px] font-extrabold text-[#888] self-center px-1.5">MIN</span>
                  </div>
                  <div className="flex bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl overflow-hidden focus-within:border-brand-yellow transition-colors">
                    <span className="text-[#888] self-center pl-2 text-xs font-extrabold">€</span>
                    <input value={titzData.price} onChange={e=>setTitzData(prev=>({...prev, price: e.target.value}))} className="w-12 bg-transparent px-1 py-2 text-white text-xs outline-none text-center" type="number" />
                  </div>
                  <button onClick={saveTitzCut} disabled={isSavingTitz} className="text-[10px] font-black bg-brand-yellow text-[#0a0a0a] px-3 py-2 rounded-xl ml-1 disabled:opacity-50 hover:opacity-90">{isSavingTitz ? "..." : "Save"}</button>
                  <span className="text-[#555] text-sm ml-2">🔒</span>
                </div>
              </div>

              {services.map((svc) => (
                <div key={svc.id} className="bg-brand-surface border border-brand-border rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <div className="font-bold">{svc.name}</div>
                    <div className="text-xs text-brand-text-secondary">{svc.duration} mins</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-black text-brand-yellow">€{svc.price}</div>
                    <button onClick={async () => { await deleteDoc(doc(db, 'services', svc.id)); mutateServices(); }} className="text-[#555] hover:text-brand-red font-bold text-xs p-2">✕</button>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-extrabold text-sm mb-3">Add New Service</h3>
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-2.5 items-end mb-3">
              <div>
                <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">NAME</label>
                <input value={newServiceName} onChange={e=>setNewServiceName(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" placeholder="E.g. Buzz Cut" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">MINS</label>
                <input value={newServiceDuration} onChange={e=>setNewServiceDuration(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" placeholder="30" />
              </div>
              <div>
                <label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5">PRICE €</label>
                <input value={newServicePrice} onChange={e=>setNewServicePrice(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" placeholder="0" />
              </div>
            </div>
            <button onClick={addService} className="bg-brand-yellow text-[#0a0a0a] w-full mt-2 px-7 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90">
              Add Service
            </button>
          </div>
        ) : activeTab === "Availability" ? (
          <div className="animate-fadeUp max-w-[800px]">
             <h2 className="text-2xl font-black mb-6">Weekly Schedule</h2>
             <p className="text-brand-text-secondary text-sm mb-6">Drag across the grid to set your working hours. Click a green block to remove it.</p>
             <AvailabilityGrid mode="barber" barberId={user?.uid || ""} />
          </div>
        ) : (
          <div className="animate-fadeUp flex items-center justify-center min-h-[40vh] border-2 border-dashed border-[#2a2a2a] rounded-3xl text-brand-text-secondary text-sm font-bold">
            {activeTab} content goes here.
          </div>
        )}
        
        {/* Block time off modal */}
        {blockModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="bg-[#111] border border-[#2a2a2a] rounded-[16px] p-6 w-full max-w-sm animate-fadeUp">

              {/* Title */}
              <h3 className="text-lg font-black mb-1">Block a day off</h3>
              <p className="text-xs text-[#888] font-bold mb-5">Clients won&apos;t be able to book you on this day.</p>

              {/* Date input */}
              <label className="text-[10px] font-extrabold text-brand-text-secondary uppercase tracking-wider block mb-2">Select date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={blockDate}
                onChange={e => setBlockDate(e.target.value)}
                className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-yellow transition-colors mb-4"
              />

              {/* Block button */}
              <button
                onClick={handleBlockDay}
                disabled={!blockDate || blockLoading}
                className="w-full bg-brand-yellow text-[#0a0a0a] font-black py-3 rounded-full text-sm hover:opacity-90 transition-opacity disabled:opacity-40 mb-5"
              >
                {blockLoading ? '...' : 'Block this day'}
              </button>

              {/* Divider */}
              <div className="h-px bg-[#1e1e1e] mb-4" />

              {/* Currently blocked dates */}
              {(() => {
                const blocked: string[] = (schedule as any)?.blockedDates || [];
                if (blocked.length === 0) return null;
                return (
                  <div className="mb-5">
                    <div className="text-[11px] font-bold text-[#555] mb-2">Currently blocked days:</div>
                    <div className="flex flex-wrap gap-2">
                      {blocked.map((d: string) => {
                        const [y, m, day] = d.split('-');
                        return (
                          <span key={d} className="inline-flex items-center gap-1.5 bg-[#1a0808] border border-[#EF444433] rounded-full px-[10px] py-1 text-[11px] text-[#EF4444]">
                            {day}/{m}/{y}
                            <button
                              onClick={() => handleUnblockDay(d)}
                              className="text-[#EF4444] hover:text-white transition-colors leading-none"
                              title="Unblock this day"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Cancel */}
              <button
                onClick={() => { setBlockModalOpen(false); setBlockDate(''); }}
                disabled={blockLoading}
                className="w-full border border-[#2a2a2a] text-[#888] font-bold py-3 rounded-full text-sm hover:border-[#444] hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="fixed bottom-6 right-6 bg-[#1a0808] border border-brand-yellow/30 text-brand-yellow px-6 py-3 rounded-full font-bold text-sm shadow-xl animate-fadeUp z-50">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
