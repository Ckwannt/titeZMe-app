'use client';

import { useState, useEffect } from "react";
import { useAuth } from '@/lib/auth-context';
import { useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ShopTeamTab } from '@/components/ShopTeamTab';
import { ShopPhotosTab } from '@/components/ShopPhotosTab';
import { ShopServicesTab } from '@/components/ShopServicesTab';
import { ShopSettingsTab } from '@/components/ShopSettingsTab';
import { ShopAvailabilityTab } from '@/components/ShopAvailabilityTab';
import { StatCardSkeleton, BookingRowSkeleton } from '@/components/skeletons';

export default function ShopDashboard() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const queryClient = useQueryClient();

  const { data: shop } = useQuery({
    queryKey: ['shop', user?.uid],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'barbershops', user!.uid));
      return snap.exists() ? snap.data() : null;
    },
    enabled: !!user
  });
  const mutateShop = () => queryClient.invalidateQueries({ queryKey: ['shop', user?.uid] });

  const { data: schedule } = useQuery({
    queryKey: ['schedule', user?.uid],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'schedules', user!.uid));
      return snap.exists() ? snap.data() : null;
    },
    enabled: !!user
  });
  const mutateSchedule = () => queryClient.invalidateQueries({ queryKey: ['schedule', user?.uid] });

  const { data: services = [] } = useQuery({
    queryKey: ['shopServices', user?.uid],
    queryFn: async () => {
      const q = query(collection(db, 'services'), where("providerId", "==", user!.uid), where("providerType", "==", "shop"));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    },
    enabled: !!user
  });
  const mutateServices = () => queryClient.invalidateQueries({ queryKey: ['shopServices', user?.uid] });

  // Calculate Open/Closed status
  let shopStatus = { text: "Closed today", color: "text-brand-red", statusId: "closed" };
  if (schedule) {
    const today = new Date();
    const dayOfWeekStr = today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayStr = today.toISOString().split('T')[0];
    
    // Simplistic approach for MVP: checking local time instead of proper shop timezone calculation
    // "blockedDates"
    if (schedule.blockedDates?.includes(todayStr)) {
      shopStatus = { text: "On leave", color: "text-brand-red", statusId: "leave" };
    } else {
      const todayHours = schedule.weeklyHours?.[dayOfWeekStr];
      if (!todayHours?.isOpen) {
        shopStatus = { text: "Closed today", color: "text-brand-red", statusId: "closed" };
      } else {
        const nowMins = today.getHours() * 60 + today.getMinutes();
        const startMins = parseInt(todayHours.start.split(':')[0]) * 60 + parseInt(todayHours.start.split(':')[1]);
        const endMins = parseInt(todayHours.end.split(':')[0]) * 60 + parseInt(todayHours.end.split(':')[1]);
        
        let onBreak = false;
        if (todayHours.breaks) {
          onBreak = todayHours.breaks.some((br: any) => {
            if (!br.start || !br.end) return false;
            const bStart = parseInt(br.start.split(':')[0]) * 60 + parseInt(br.start.split(':')[1]);
            const bEnd = parseInt(br.end.split(':')[0]) * 60 + parseInt(br.end.split(':')[1]);
            return nowMins >= bStart && nowMins < bEnd;
          });
        }

        if (nowMins >= startMins && nowMins < endMins && !onBreak) {
          shopStatus = { text: "Open now", color: "text-brand-green", statusId: "open" };
        } else if (nowMins < startMins) {
          shopStatus = { text: `Closed · Opens at ${todayHours.start}`, color: "text-brand-red", statusId: "closed" };
        } else {
          shopStatus = { text: `Closed`, color: "text-brand-red", statusId: "closed" };
        }
      }
    }
  }

  if (!shop && !loading && user) {
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

  const barbers = [
    { name: "Carlos M.", avatar: "C", color: "bg-brand-orange", cuts: 42, hours: 84, revenue: 1250, rating: 4.9, status: "working" },
    { name: "Jamal A.", avatar: "J", color: "bg-[#4A90D9]", cuts: 35, hours: 70, revenue: 980, rating: 4.7, status: "working" },
    { name: "Diego R.", avatar: "D", color: "bg-brand-green", cuts: 28, hours: 56, revenue: 720, rating: 4.8, status: "off" },
    { name: "Omar B.", avatar: "O", color: "bg-[#a78bfa]", cuts: 19, hours: 38, revenue: 510, rating: 4.5, status: "working" },
  ];

  const pendingInvite = { name: "Samir K.", specialty: "Fades & locs", rating: 4.8 };

  return (
    <div className="flex min-h-[calc(100vh-53px)] flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-[220px] md:border-r border-brand-border p-6 shrink-0 flex flex-col">
        <div className="flex items-center gap-3 mb-6 px-2">
          {shop?.coverPhotoUrl ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={shop.coverPhotoUrl} alt="Shop avatar" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-yellow flex items-center justify-center font-black text-base text-[#0a0a0a]">
              {shop?.name?.[0] || "S"}
            </div>
          )}
          <div>
            <div className="font-extrabold text-sm truncate max-w-[120px]">{shop?.name || "Loading..."}</div>
            <div className="text-[11px] text-brand-text-secondary mt-0.5 truncate max-w-[120px]">
              📍 {shop?.address?.street && shop?.address?.city ? `${shop.address.street}, ${shop.address.city}` : "Address not set"}
            </div>
            <div className={`text-[11px] mt-1 font-bold ${shopStatus.color}`}>
              {shopStatus.statusId === "open" ? "● " : ""}{shopStatus.text}
            </div>
          </div>
        </div>
        
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
          {[
            { icon: "🏪", label: "Overview" },
            { icon: "👥", label: "Team" },
            { icon: "📅", label: "All Bookings" },
            { icon: "⏰", label: "Availability" },
            { icon: "💰", label: "Earnings" },
            { icon: "✂️", label: "Services" },
            { icon: "📸", label: "Shop Photos" },
            { icon: "⭐", label: "Reviews" },
            { icon: "⚙️", label: "Settings" },
          ].map(l => (
            <div 
              key={l.label} 
              onClick={() => setActiveTab(l.label)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer transition-colors shrink-0 ${
              activeTab === l.label ? "bg-[#1a1a1a] text-brand-yellow" : "text-[#888] hover:bg-[#1a1a1a] hover:text-white"
            }`}>
              <span>{l.icon}</span> {l.label}
            </div>
          ))}
        </div>
        
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8 md:px-10 max-h-[calc(100vh-53px)] overflow-y-auto">
        {activeTab === 'Team' ? (
          <ShopTeamTab />
        ) : activeTab === 'Availability' ? (
          <ShopAvailabilityTab schedule={schedule} mutateSchedule={mutateSchedule} />
        ) : activeTab === 'Services' ? (
          <ShopServicesTab services={services} mutateServices={mutateServices} shop={shop} mutateShop={mutateShop} />
        ) : activeTab === 'Shop Photos' ? (
          <ShopPhotosTab shop={shop} mutateShop={mutateShop} />
        ) : activeTab === 'Settings' ? (
          <ShopSettingsTab shop={shop} mutateShop={mutateShop} />
        ) : activeTab === 'Overview' || activeTab === 'All Bookings' || activeTab === 'Earnings' || activeTab === 'Reviews' ? (
          <>
            <div className="animate-fadeUp flex flex-col md:flex-row justify-between items-start mb-7 gap-4">
              <div>
                <h1 className="text-2xl font-black">{activeTab} {activeTab === "Overview" ? "🏪" : ""}</h1>
                {activeTab === "Overview" && <p className="text-brand-text-secondary text-sm mt-1">April 2026 · 4 active barbers</p>}
              </div>
              <button 
                onClick={() => setActiveTab('Team')}
                className="bg-brand-yellow text-[#0a0a0a] px-7 py-3 rounded-full font-black text-sm transition-all hover:opacity-90 hover:-translate-y-px">
                + Invite Barber
              </button>
            </div>

            {/* Shop stats */}
        <div className="animate-fadeUp !delay-[50ms] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
          {[
            { val: "€3,460", label: "Monthly Revenue", delta: "+12% vs last month", color: "text-brand-yellow" },
            { val: "124", label: "Total Cuts", delta: "This month", color: "text-brand-orange" },
            { val: "248h", label: "Total Hours", delta: "Across all barbers", color: "text-[#60a5fa]" },
            { val: "4.8", label: "Shop Rating", delta: "★ 89 reviews", color: "text-brand-green" },
          ].map((s, i) => (
            <div key={i} className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
              <div className={`text-[28px] font-black leading-none ${s.color}`}>{s.val}</div>
              <div className="text-xs text-brand-text-secondary font-bold">{s.label}</div>
              <div className="text-[11px] font-extrabold text-[#444] mt-1">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Pending invite alert */}
        <div className="animate-fadeUp !delay-[100ms] bg-[#1a1500] border border-brand-yellow/30 rounded-[14px] p-3.5 px-4.5 mb-6 flex items-center gap-3.5">
          <span className="text-xl">📨</span>
          <div className="flex-1">
            <div className="font-extrabold text-sm">Invite sent to {pendingInvite.name}</div>
            <div className="text-xs text-brand-text-secondary mt-0.5">Specialty: {pendingInvite.specialty} · ★ {pendingInvite.rating} · Waiting for response</div>
          </div>
          <span className="text-brand-yellow text-[11px] font-extrabold hidden sm:block">PENDING</span>
        </div>

        {/* Barber roster */}
        <div className="animate-fadeUp !delay-[150ms]">
          <div className="font-extrabold text-base mb-4">Your Barbers — April 2026</div>
          <div className="flex flex-col gap-3">
            {barbers.map((b, i) => (
              <div 
                key={i}
                onClick={() => setSelectedBarber(selectedBarber === i ? null : i)}
                className={`bg-brand-surface border rounded-[14px] p-4 px-5 cursor-pointer transition-all ${
                  selectedBarber === i ? "border-brand-yellow" : "border-brand-border hover:border-[#444]"
                }`}
              >
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-xl ${b.color} flex items-center justify-center text-base font-black text-[#0a0a0a] shrink-0`}>
                    {b.avatar}
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-extrabold text-[15px]">{b.name}</span>
                      <span className={`w-1.5 h-1.5 rounded-full inline-block ${b.status === "working" ? "bg-brand-green" : "bg-[#555]"}`} />
                    </div>
                    <div className="text-xs text-brand-text-secondary leading-none">★ {b.rating}</div>
                  </div>
                  {/* Quick stats inline */}
                  <div className="flex gap-4 sm:gap-6 order-last sm:order-none w-full sm:w-auto mt-3 sm:mt-0 justify-around sm:justify-end">
                    {[
                      { val: b.cuts, label: "cuts" },
                      { val: `${b.hours}h`, label: "hours" },
                      { val: `€${b.revenue}`, label: "earned", yellow: true },
                    ].map((stat, j) => (
                      <div key={j} className="text-center min-w-[60px]">
                        <div className={`font-black text-base ${stat.yellow ? "text-brand-yellow" : "text-white"}`}>{stat.val}</div>
                        <div className="text-[10px] text-brand-text-secondary font-bold tracking-wide">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <span className="text-brand-text-muted text-lg hidden sm:block w-4 text-center shrink-0">
                    {selectedBarber === i ? "▲" : "▼"}
                  </span>
                </div>

                {/* Expanded detail */}
                {selectedBarber === i && (
                  <div className="mt-4 pt-4 border-t border-brand-border animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3.5">
                      {[
                        { label: "Avg cut price", val: `€${Math.round(b.revenue / b.cuts)}` },
                        { label: "Bookings this week", val: "11" },
                        { label: "No-shows", val: "0" },
                      ].map((stat, j) => (
                        <div key={j} className="bg-brand-surface2 rounded-[10px] p-3 px-3.5">
                          <div className="font-black text-lg">{stat.val}</div>
                          <div className="text-[11px] text-brand-text-secondary mt-0.5">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    {/* Revenue bar */}
                    <div className="mb-4">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-[11px] text-brand-text-secondary font-bold">Revenue share vs top barber</span>
                        <span className="text-[11px] font-extrabold text-brand-yellow">{Math.round((b.revenue / 1250) * 100)}%</span>
                      </div>
                      <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                        <div className="h-full bg-brand-yellow rounded-full transition-all duration-500 ease-out" style={{ width: `${(b.revenue / 1250) * 100}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3.5">
                      <button className="bg-transparent text-white border-[1.5px] border-[#2a2a2a] px-4 py-2 rounded-full font-extrabold text-xs transition-all hover:border-[#555]">
                        📅 View schedule
                      </button>
                      <button className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-full px-4 py-2 font-extrabold text-xs transition-colors hover:bg-brand-red/20">
                        Remove from shop
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
