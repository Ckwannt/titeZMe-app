'use client';

import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="bg-[#0A0A0A] text-white pt-24 min-h-screen font-sans">
      <section className="bg-[#0A0A0A] py-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center mb-20">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">HOW IT WORKS</div>
          <h2 className="text-4xl md:text-5xl font-black">Booked in 3 steps. No drama.</h2>
        </div>
        
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-12 lg:gap-20 mb-32">
          <div className="relative flex flex-col items-center text-center">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[180px] font-black text-[#111] leading-none z-0 tracking-tighter" style={{marginTop: '-60px'}}>01</div>
             <div className="z-10 relative">
               <div className="w-16 h-16 mx-auto bg-[#141414] border border-[#2a2a2a] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl">
                 📍
               </div>
               <h3 className="text-xl font-black mb-3">Pick your city</h3>
               <p className="text-sm font-bold text-gray-400 leading-relaxed max-w-[280px] mx-auto">Open the app on any device or browser. We detect your location automatically, or choose your city and availability.</p>
             </div>
          </div>
          <div className="relative flex flex-col items-center text-center">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[180px] font-black text-[#111] leading-none z-0 tracking-tighter" style={{marginTop: '-60px'}}>02</div>
             <div className="z-10 relative">
               <div className="w-16 h-16 mx-auto bg-[#141414] border border-[#2a2a2a] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl">
                 ✂️
               </div>
               <h3 className="text-xl font-black mb-3">Choose your barber</h3>
               <p className="text-sm font-bold text-gray-400 leading-relaxed max-w-[280px] mx-auto">Filter by specialty, language, vibe, price. See who&apos;s open right now in real time this very minute.</p>
             </div>
          </div>
          <div className="relative flex flex-col items-center text-center">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[180px] font-black text-[#111] leading-none z-0 tracking-tighter" style={{marginTop: '-60px'}}>03</div>
             <div className="z-10 relative">
               <div className="w-16 h-16 mx-auto bg-[#141414] border border-[#2a2a2a] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl">
                 💵
               </div>
               <h3 className="text-xl font-black mb-3">Show up. Pay cash.</h3>
               <p className="text-sm font-bold text-gray-400 leading-relaxed max-w-[280px] mx-auto">Book in under 30 seconds. Arrive, get the cut you chose directly. Zero drama. 100% real.</p>
             </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-[800px] mx-auto mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-[#111] border border-[#2a2a2a] p-6 rounded-2xl">
              <h3 className="text-lg font-black text-white mb-2">Q: Is it free to book?</h3>
              <p className="text-gray-400 font-bold">A: Yes. titeZMe is completely free for clients.</p>
            </div>
            <div className="bg-[#111] border border-[#2a2a2a] p-6 rounded-2xl">
              <h3 className="text-lg font-black text-white mb-2">Q: Do I need to create an account?</h3>
              <p className="text-gray-400 font-bold">A: Yes, to manage your bookings and save favourite barbers.</p>
            </div>
            <div className="bg-[#111] border border-[#2a2a2a] p-6 rounded-2xl">
              <h3 className="text-lg font-black text-white mb-2">Q: What if I need to cancel?</h3>
              <p className="text-gray-400 font-bold">A: You can cancel up to 2 hours before your appointment.</p>
            </div>
            <div className="bg-[#111] border border-[#2a2a2a] p-6 rounded-2xl">
              <h3 className="text-lg font-black text-white mb-2">Q: Is payment online?</h3>
              <p className="text-gray-400 font-bold">A: Cash only for now. Online payments coming soon.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-black mb-8">Ready?</h2>
          <Link href="/#browse-barbers" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90 inline-block">
            Find your barber
          </Link>
        </div>
      </section>
    </div>
  );
}
