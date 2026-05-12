import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-[#050505] py-12 px-6">
       <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-[#1E1E1E] mb-8">
          <div className="flex flex-col items-center md:items-start">
             <div className="mb-2">
               <Image 
                 src="/wordmark.png"
                 alt="titeZMe"
                 height={28}
                 width={100}
                 style={{ objectFit: 'contain' }}
                 priority
               />
             </div>
             <div className="text-xs font-bold text-[#888580]">Keeping you sharp.</div>
          </div>
          
          <div className="flex gap-6 sm:gap-8 flex-wrap justify-center">
             <span className="text-xs font-bold text-[#888580] cursor-default">About</span>
             <span className="text-xs font-bold text-[#888580] cursor-default">For Barbers</span>
             <span className="text-xs font-bold text-[#888580] cursor-default">Cities</span>
             <Link href="/privacy" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Privacy</Link>
             <Link href="/terms" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Terms</Link>
             <Link href="/cookies" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Cookie settings</Link>
          </div>
          
          <div className="flex gap-4 opacity-50">
             {/* Placeholders for social icons */}
             <div className="w-8 h-8 rounded-full border border-[#1E1E1E] flex items-center justify-center text-xs text-[#888580]">IG</div>
             <div className="w-8 h-8 rounded-full border border-[#1E1E1E] flex items-center justify-center text-xs text-[#888580]">TT</div>
          </div>
       </div>
       <div className="text-center text-[10px] font-bold text-[#888580]">
          © 2026 titeZMe. All rights reserved.
       </div>
    </footer>
  );
}
