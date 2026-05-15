'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

function getCurrencySymbol(c?: string): string {
  const m: Record<string, string> = { EUR: '€', GBP: '£', USD: '$', MAD: 'MAD ', DZD: 'DA ' };
  return m[(c || 'EUR').toUpperCase()] ?? '€';
}

function fmtMoney(n: number, sym: string) {
  return `${sym}${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function exportCSV(rows: any[], currSym: string, monthLabel: string) {
  const header = ['Barber', 'Cuts', 'Hours', 'Earned', 'Avg/cut'];
  const data = rows.map(r => [
    r.name, r.cuts, r.hours.toFixed(1),
    `${currSym}${r.earned.toFixed(2)}`,
    r.cuts > 0 ? `${currSym}${(r.earned / r.cuts).toFixed(2)}` : '—',
  ]);
  const csv = [header, ...data].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `earnings-${monthLabel}.csv`; a.click();
  URL.revokeObjectURL(url);
}

export default function ShopEarningsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [barberNames, setBarberNames] = useState<Record<string, string>>({});
  const [shopCurrency, setShopCurrency] = useState('EUR');

  // Month selector — last 6 months
  const monthOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    const d = new Date();
    for (let i = 0; i < 6; i++) {
      const yr = d.getFullYear();
      const mo = d.getMonth();
      const value = `${yr}-${String(mo + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      opts.push({ value, label });
      d.setMonth(mo - 1);
    }
    return opts;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);
  const selectedMonthLabel = monthOptions.find(o => o.value === selectedMonth)?.label || selectedMonth;
  const currentYear = new Date().getFullYear().toString();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Fetch shop info
  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, 'barbershops', user.uid)).then(s => {
      if (s.exists()) setShopCurrency(s.data().currency || 'EUR');
    });
  }, [user]);

  // Real-time bookings
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'bookings'), where('shopId', '==', user.uid));
    const unsub = onSnapshot(q, snap => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    });
    return () => unsub();
  }, [user]);

  // Active barbers
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'barberProfiles'), where('shopId', '==', user.uid));
    const unsub = onSnapshot(q, async snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setBarbers(list);
      // Fetch names
      const names: Record<string, string> = {};
      await Promise.all(list.map(async (b: any) => {
        const uSnap = await getDoc(doc(db, 'users', b.userId || b.id));
        if (uSnap.exists()) {
          const u = uSnap.data();
          names[b.id] = `${u.firstName} ${u.lastName}`;
        }
      }));
      setBarberNames(names);
    });
    return () => unsub();
  }, [user]);

  const currSym = getCurrencySymbol(shopCurrency);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const monthlyCompleted = useMemo(() =>
    bookings.filter(b => b.status === 'completed' && b.date?.startsWith(selectedMonth)),
    [bookings, selectedMonth]
  );

  const yearlyCompleted = useMemo(() =>
    bookings.filter(b => b.status === 'completed' && b.date?.startsWith(currentYear)),
    [bookings, currentYear]
  );

  const monthRevenue = monthlyCompleted.reduce((s, b) => s + (b.price || 0), 0);
  const yearRevenue = yearlyCompleted.reduce((s, b) => s + (b.price || 0), 0);
  const monthCuts = monthlyCompleted.length;
  const avgPerCut = monthCuts > 0 ? monthRevenue / monthCuts : 0;

  // ── Per-barber breakdown ───────────────────────────────────────────────────
  const barberRows = useMemo(() => {
    return barbers.map(b => {
      const completedB = monthlyCompleted.filter(bk => bk.barberId === b.id);
      const earned = completedB.reduce((s, bk) => s + (bk.price || 0), 0);
      const hours = completedB.reduce((s, bk) => s + (bk.totalDuration || 0), 0) / 60;
      return {
        id: b.id,
        name: barberNames[b.id] || 'Barber',
        cuts: completedB.length,
        hours,
        earned,
      };
    }).sort((a, b) => b.earned - a.earned);
  }, [barbers, monthlyCompleted, barberNames]);

  const topEarnerId = barberRows[0]?.id;

  // ── Daily earnings chart ───────────────────────────────────────────────────
  const dailyChartData = useMemo(() => {
    const [yr, mo] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(yr, mo, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dayStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
      const earnings = monthlyCompleted
        .filter(b => b.date === dayStr)
        .reduce((s, b) => s + (b.price || 0), 0);
      return { day: String(day), earnings };
    });
  }, [monthlyCompleted, selectedMonth]);

  if (loading) return <div className="p-10 text-center animate-pulse text-[#555]">Loading...</div>;

  return (
    <div className="animate-fadeUp p-6 md:p-8 md:px-10 max-w-[900px]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black">Earnings 💰</h1>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="bg-[#141414] border border-[#2a2a2a] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-yellow"
        >
          {monthOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
        {[
          { val: fmtMoney(monthRevenue, currSym), label: 'Monthly Revenue', delta: selectedMonthLabel, color: 'text-brand-yellow' },
          { val: fmtMoney(yearRevenue, currSym), label: 'Annual Revenue', delta: 'This year', color: 'text-brand-orange' },
          { val: monthCuts, label: 'Total Cuts', delta: selectedMonthLabel, color: 'text-[#60a5fa]' },
          { val: `${currSym}${avgPerCut.toFixed(2)}`, label: 'Avg per cut', delta: 'Revenue per service', color: 'text-brand-green' },
        ].map((s, i) => (
          <div key={i} className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
            <div className={`text-[28px] font-black leading-none ${s.color}`}>{s.val}</div>
            <div className="text-xs text-brand-text-secondary font-bold">{s.label}</div>
            <div className="text-[11px] font-extrabold text-[#444] mt-1">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Per-barber table */}
      <div className="bg-brand-surface border border-brand-border rounded-3xl p-6 mb-6">
        <div className="flex justify-between items-center mb-5">
          <div className="font-black text-base">Breakdown by barber — {selectedMonthLabel}</div>
          <button
            onClick={() => exportCSV(barberRows, currSym, selectedMonth)}
            className="text-[11px] font-bold border border-[#2a2a2a] text-[#888] hover:border-brand-yellow hover:text-brand-yellow px-3 py-1.5 rounded-full transition-colors"
          >
            ↓ Export CSV
          </button>
        </div>

        {barberRows.length === 0 ? (
          <div className="text-[#555] text-sm">No barbers in your team yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e1e1e]">
                  {['Barber', 'Cuts', 'Hours', 'Earned', 'Avg/cut'].map(h => (
                    <th key={h} className="text-left text-[10px] font-black uppercase text-[#555] pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {barberRows.map(row => (
                  <tr key={row.id} className="border-b border-[#111] hover:bg-[#0f0f0f] transition-colors">
                    <td className="py-3 pr-4 font-extrabold">
                      {row.id === topEarnerId && row.earned > 0 && <span className="mr-1.5">⭐</span>}
                      {row.name}
                    </td>
                    <td className="py-3 pr-4 font-bold">{row.cuts}</td>
                    <td className="py-3 pr-4 text-[#888] font-bold">{row.hours.toFixed(1)}h</td>
                    <td className="py-3 pr-4 font-black text-brand-yellow">{currSym}{row.earned.toFixed(0)}</td>
                    <td className="py-3 text-[#888] font-bold">
                      {row.cuts > 0 ? `${currSym}${(row.earned / row.cuts).toFixed(0)}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Daily chart */}
      <div className="bg-brand-surface border border-brand-border rounded-3xl p-6">
        <div className="font-black text-base mb-5">Daily earnings — {selectedMonthLabel}</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dailyChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
            <Tooltip
              contentStyle={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fff', fontSize: 12 }}
              cursor={{ fill: '#1a1a1a' }}
              formatter={(v: any) => [`${currSym}${v}`, 'Earnings']}
            />
            <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
              {dailyChartData.map((_, i) => (
                <Cell key={i} fill="#F5C518" fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
