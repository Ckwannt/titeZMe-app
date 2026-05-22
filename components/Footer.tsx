import Link from 'next/link';
import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="bg-[#050505] py-12 px-6">
       <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-[#1E1E1E] mb-8">
          <div className="flex flex-col items-center md:items-start">
             <div className="mb-2">
               <Wordmark height={20} />
             </div>
             <div className="text-xs font-bold text-[#888580]">Keeping you sharp.</div>
          </div>
          
          <div className="flex gap-6 sm:gap-8 flex-wrap justify-center">
             <Link href="/about" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">About</Link>
             <Link href="/for-barbers" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">For Barbers</Link>
             <Link href="/for-shops" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">For Shops</Link>
             <Link href="/cities" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Cities</Link>
             <Link href="/privacy" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Privacy</Link>
             <Link href="/terms" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Terms</Link>
             <Link href="/contact" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Contact</Link>
             <Link href="/cookies" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors">Cookie settings</Link>
          </div>
          
          <div className="flex gap-4">
             <a href="#" aria-label="Instagram" style={{ color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                 <circle cx="12" cy="12" r="4" />
                 <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
               </svg>
             </a>
             <a href="#" aria-label="TikTok" style={{ color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
               </svg>
             </a>
          </div>
       </div>
       <div className="text-center text-[10px] font-bold text-[#888580]">
          © 2026 titeZMe. All rights reserved.
       </div>
    </footer>
  );
}
