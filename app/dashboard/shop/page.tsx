'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { StatCardSkeleton } from "@/components/skeletons";

export default function ShopOverviewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  const { data: shop } = useQuery({
    queryKey: ['shop', user?.uid],
    queryFn: async () => { const s = await getDoc(doc(db, 'barbershops', user!.uid)); return s.exists() ? s.data() : null; },
    enabled: !!user,
  });

  if (!shop && !loading && user) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-[700px]">
          <div className="grid grid-cols-2 gap-4 mb-8"><StatCardSkeleton /><StatCardSkeleton /></div>
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
    <div className="p-6 md:p-8 md:px-10">
      <div className="animate-fadeUp flex flex-col md:flex-row justify-between items-start mb-7 gap-4">
        <div>
          <h1 className="text-2xl font-black">Overview 🏪</h1>
          <p className="text-brand-text-secondary text-sm mt-1">April 2026 · 4 active barbers</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={`/shop/${user?.uid}`} target="_blank" rel="noopener noreferrer" className="border border-[#2a2a2a] text-[#888] hover:border-[#F5C518] hover:text-[#F5C518] rounded-full text-[13px] font-extrabold px-5 py-2.5 transition-colors inline-flex items-center">
            👁 View shop profile
          </a>
          <Link href="/dashboard/shop/team" className="bg-brand-yellow text-[#0a0a0a] px-7 py-3 rounded-full font-black text-sm hover:opacity-90 hover:-translate-y-px transition-all">
            + Invite Barber
          </Link>
        </div>
      </div>

      <div className="animate-fadeUp grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
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

      <div className="animate-fadeUp bg-[#1a1500] border border-brand-yellow/30 rounded-[14px] p-3.5 px-4.5 mb-6 flex items-center gap-3.5">
        <span className="text-xl">📨</span>
        <div className="flex-1">
          <div className="font-extrabold text-sm">Invite sent to {pendingInvite.name}</div>
          <div className="text-xs text-brand-text-secondary mt-0.5">Specialty: {pendingInvite.specialty} · ★ {pendingInvite.rating} · Waiting for response</div>
        </div>
        <span className="text-brand-yellow text-[11px] font-extrabold hidden sm:block">PENDING</span>
      </div>

      <div className="animate-fadeUp">
        <div className="font-extrabold text-base mb-4">Your Barbers — April 2026</div>
        <div className="flex flex-col gap-3">
          {barbers.map((b, i) => (
            <div key={i} onClick={() => setSelectedBarber(selectedBarber === i ? null : i)}
              className={`bg-brand-surface border rounded-[14px] p-4 px-5 cursor-pointer transition-all ${selectedBarber === i ? 'border-brand-yellow' : 'border-brand-border hover:border-[#444]'}`}>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5">
                <div className={`w-11 h-11 rounded-xl ${b.color} flex items-center justify-center text-base font-black text-[#0a0a0a] shrink-0`}>{b.avatar}</div>
                <div className="flex-1 min-w-[120px]">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-extrabold text-[15px]">{b.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${b.status === 'working' ? 'bg-brand-green' : 'bg-[#555]'}`} />
                  </div>
                  <div className="text-xs text-brand-text-secondary leading-none">★ {b.rating}</div>
                </div>
                <div className="flex gap-4 sm:gap-6 order-last sm:order-none w-full sm:w-auto mt-3 sm:mt-0 justify-around sm:justify-end">
                  {[{ val: b.cuts, label: 'cuts' }, { val: `${b.hours}h`, label: 'hours' }, { val: `€${b.revenue}`, label: 'earned', yellow: true }].map((stat, j) => (
                    <div key={j} className="text-center min-w-[60px]">
                      <div className={`font-black text-base ${(stat as any).yellow ? 'text-brand-yellow' : 'text-white'}`}>{stat.val}</div>
                      <div className="text-[10px] text-brand-text-secondary font-bold tracking-wide">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <span className="text-brand-text-muted text-lg hidden sm:block w-4 text-center shrink-0">{selectedBarber === i ? '▲' : '▼'}</span>
              </div>
              {selectedBarber === i && (
                <div className="mt-4 pt-4 border-t border-brand-border animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3.5">
                    {[{ label: 'Avg cut price', val: `€${Math.round(b.revenue / b.cuts)}` }, { label: 'Bookings this week', val: '11' }, { label: 'No-shows', val: '0' }].map((stat, j) => (
                      <div key={j} className="bg-brand-surface rounded-[10px] p-3 px-3.5">
                        <div className="font-black text-lg">{stat.val}</div>
                        <div className="text-[11px] text-brand-text-secondary mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[11px] text-brand-text-secondary font-bold">Revenue share vs top barber</span>
                      <span className="text-[11px] font-extrabold text-brand-yellow">{Math.round((b.revenue / 1250) * 100)}%</span>
                    </div>
                    <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                      <div className="h-full bg-brand-yellow rounded-full" style={{ width: `${(b.revenue / 1250) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3.5">
                    <button className="bg-transparent text-white border-[1.5px] border-[#2a2a2a] px-4 py-2 rounded-full font-extrabold text-xs hover:border-[#555]">📅 View schedule</button>
                    <button className="bg-[#1a0808] border border-[#3b1a1a] text-brand-red rounded-full px-4 py-2 font-extrabold text-xs hover:bg-brand-red/20">Remove from shop</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
