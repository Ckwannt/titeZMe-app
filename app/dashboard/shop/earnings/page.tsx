'use client';
export default function ShopEarningsPage() {
  return (
    <div className="animate-fadeUp p-6 md:p-8 md:px-10">
      <h1 className="text-2xl font-black mb-6">Earnings 💰</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
        {[
          { val: "€3,460", label: "Monthly Revenue", delta: "+12% vs last month", color: "text-brand-yellow" },
          { val: "€41,520", label: "Annual Revenue", delta: "Projected", color: "text-brand-orange" },
          { val: "124", label: "Total Cuts", delta: "This month", color: "text-[#60a5fa]" },
          { val: "4.8", label: "Avg per cut", delta: "Revenue per service", color: "text-brand-green" },
        ].map((s, i) => (
          <div key={i} className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col gap-1.5">
            <div className={`text-[28px] font-black leading-none ${s.color}`}>{s.val}</div>
            <div className="text-xs text-brand-text-secondary font-bold">{s.label}</div>
            <div className="text-[11px] font-extrabold text-[#444] mt-1">{s.delta}</div>
          </div>
        ))}
      </div>
      <div className="bg-brand-surface border border-brand-border rounded-3xl p-8 text-center text-[#888]">
        <div className="text-5xl mb-4">💰</div>
        <div className="font-extrabold text-lg mb-2">Detailed earnings analytics coming soon</div>
        <p className="text-sm">Per-barber breakdowns, charts, and export will be available here.</p>
      </div>
    </div>
  );
}
