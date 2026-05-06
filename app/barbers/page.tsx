'use client';

import Link from 'next/link';

export default function BarbersPage() {
  return (
    <div className="bg-[#0A0A0A] text-white pt-24 min-h-screen font-sans border-t border-[#1a1a1a]">
      <section className="bg-[#111] py-32 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-8 items-center">
          <div>
            <div className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">FOR BARBERS</div>
            <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Join thousands of barbers already on titeZMe
            </h1>
            <h2 className="text-3xl md:text-4xl font-black leading-[1.05] tracking-tight mb-6 mt-12 text-gray-400">
              Your chair. <br/>
              <span className="text-brand-yellow">Your rules.</span> <br/>
              <span className="text-brand-yellow">Your money.</span>
            </h2>
            <p className="text-lg font-bold text-gray-400 mb-10 max-w-[420px]">
              No commission fees during beta. Set your hours, set your price, keep everything. We send clients to your chair.
            </p>
            
            <div className="flex flex-col gap-4 mb-10">
              {['0% commission — keep every dirham/euro', 'Profile live in under 10 minutes', 'Your own schedule — no one owns your time', 'Clients find you — you just cut'].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-yellow/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-brand-yellow text-xs font-black">✓</span>
                  </div>
                  <span className="font-bold text-gray-300">{text}</span>
               </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-12">
              <Link href="/signup" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90">
                Join free during beta →
              </Link>
            </div>
          </div>
          
          <div>
            <div className="grid grid-cols-2 gap-4 mb-12">
               <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
                 <div className="text-5xl font-black text-brand-yellow mb-2">0%</div>
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">commission</div>
               </div>
               <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
                 <div className="text-5xl font-black text-white mb-2">10 min</div>
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">to set up your profile</div>
               </div>
               <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px] border border-brand-yellow/20">
                 <div className="text-5xl font-black text-white mb-2">400+</div>
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">barbers already joined</div>
               </div>
               <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
                 <div className="text-3xl font-black text-brand-orange mb-2">Beta = Free</div>
                 <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Join now, pay nothing during beta</div>
               </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#2a2a2a] p-8 rounded-3xl mt-4">
               <h3 className="text-2xl font-black mb-6">How to get started</h3>
               <div className="flex flex-col gap-6">
                 <div className="flex gap-4 items-start">
                   <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center font-black text-gray-400 shrink-0">1</div>
                   <div>
                     <h4 className="font-bold text-white text-lg">Create your profile (10 minutes)</h4>
                     <p className="text-sm font-bold text-gray-500 mt-1">Add your photos, services, and location.</p>
                   </div>
                 </div>
                 <div className="flex gap-4 items-start">
                   <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center font-black text-gray-400 shrink-0">2</div>
                   <div>
                     <h4 className="font-bold text-white text-lg">Set your availability</h4>
                     <p className="text-sm font-bold text-gray-500 mt-1">Decide when you want to work.</p>
                   </div>
                 </div>
                 <div className="flex gap-4 items-start">
                   <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center font-black text-black shrink-0 relative"><span className="absolute top-0 bottom-0 left-0 right-0 animate-ping rounded-full bg-brand-yellow opacity-20"></span>3</div>
                   <div>
                     <h4 className="font-bold text-white text-lg">Clients find you and book</h4>
                     <p className="text-sm font-bold text-gray-500 mt-1">Receive bookings directly. Paid in cash.</p>
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-3xl p-8 mt-4 border border-[#2a2a2a]">
               <div className="text-brand-yellow mb-4 text-xs font-black tracking-widest uppercase">Testimonial</div>
               <p className="text-lg font-bold text-gray-300 leading-relaxed mb-6 italic">&quot;Since joining titeZMe, my schedule has been fully booked. The app gives me total control over my hours and my clients directly.&quot;</p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#0A0A0A] flex items-center justify-center text-sm font-black text-gray-400">AM</div>
                 <div className="text-sm font-bold text-white uppercase tracking-wider">Ayoub M. - Master Barber</div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
