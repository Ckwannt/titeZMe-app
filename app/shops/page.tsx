'use client';

import Link from 'next/link';

export default function ShopsPage() {
  return (
    <div className="bg-[#0A0A0A] text-white pt-24 min-h-screen font-sans">
      <section className="bg-[#0A0A0A] py-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center mb-20">
          <div className="text-xs font-bold text-brand-yellow uppercase tracking-widest mb-4">FOR SHOPS</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Manage your shop.</h1>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-500 mb-12">Track your team. <br/> Grow your business.</h2>
          <Link href="/signup" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90 inline-block text-lg">
            Create your shop →
          </Link>
        </div>
        
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 mb-32 items-center">
          <div>
            <h3 className="text-3xl font-black mb-8">What titeZMe offers shops</h3>
            <div className="flex flex-col gap-6">
              {[
                'Invite your barbers by code',
                'See earnings per barber per month',
                'Manage shop services and prices',
                'Your own public shop profile',
                'Clients book directly with your team'
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-center bg-[#111] border border-[#2a2a2a] p-4 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0">
                    <span className="text-brand-green text-sm font-black">✓</span>
                  </div>
                  <span className="font-bold text-white text-lg">{text}</span>
               </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[#111] p-10 rounded-3xl border border-[#2a2a2a]">
            <h3 className="text-2xl font-black mb-8">How it works for shops</h3>
            <div className="flex flex-col gap-8 relative">
              <div className="absolute top-4 bottom-4 left-[19px] w-0.5 bg-[#2a2a2a] z-0"></div>
              <div className="flex gap-6 items-start relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] shadow-[0_0_0_8px_#111] flex items-center justify-center font-black text-gray-400 shrink-0 border border-[#2a2a2a]">1</div>
                <div>
                  <h4 className="font-bold text-white text-xl">Create your barber account</h4>
                  <p className="text-base font-bold text-gray-500 mt-2">Sign up as a barber first, then upgrade your account to a Shop Owner.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] shadow-[0_0_0_8px_#111] flex items-center justify-center font-black text-gray-400 shrink-0 border border-[#2a2a2a]">2</div>
                <div>
                  <h4 className="font-bold text-white text-xl">Set up your shop profile</h4>
                  <p className="text-base font-bold text-gray-500 mt-2">Add your shop name, logo, location, and global services.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start relative z-10">
                <div className="w-10 h-10 rounded-full bg-brand-yellow shadow-[0_0_0_8px_#111] flex items-center justify-center font-black text-black shrink-0 border border-brand-yellow"><span className="absolute top-0 bottom-0 left-0 right-0 animate-ping rounded-full bg-brand-yellow opacity-20 z-[-1]"></span>3</div>
                <div>
                  <h4 className="font-bold text-white text-xl">Invite your barbers by their code</h4>
                  <p className="text-base font-bold text-gray-500 mt-2">Ask your team to create profiles, then invite them to your shop roster so clients can book them.</p>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-[#2a2a2a] text-center">
               <Link href="/signup" className="text-brand-yellow font-black hover:opacity-80 transition-opacity">
                 Ready to upgrade your shop? Join the beta →
               </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
