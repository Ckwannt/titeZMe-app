'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="bg-[#0A0A0A] text-white pt-24 min-h-screen font-sans">
      <section className="bg-[#0A0A0A] py-24 px-6">
        <div className="max-w-[1200px] mx-auto mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Get in touch</h1>
          <p className="text-xl font-bold text-gray-400">Have a question?<br/>We respond within 24 hours.</p>
        </div>
        
        <div className="max-w-[1000px] mx-auto grid md:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24">
          <div className="bg-[#111] border border-[#2a2a2a] p-8 md:p-10 rounded-3xl">
             {isSubmitted ? (
               <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-fadeUp">
                  <div className="w-20 h-20 bg-brand-yellow/10 rounded-full flex items-center justify-center mb-6">
                     <span className="text-4xl">📨</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">Thanks!</h3>
                  <p className="text-gray-400 font-bold mb-8">We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setIsSubmitted(false)} className="text-sm font-bold text-brand-yellow hover:opacity-80">Send another message</button>
               </div>
             ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fadeUp">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
                    <input required type="text" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-gray-600" placeholder="Your name"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                    <input required type="email" className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-gray-600" placeholder="your@email.com"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">I am a...</label>
                    <select required className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors appearance-none cursor-pointer">
                      <option value="client">Client</option>
                      <option value="barber">Barber</option>
                      <option value="shop_owner">Shop owner</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Message</label>
                    <textarea required rows={4} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-gray-600 resize-none" placeholder="How can we help?"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-brand-yellow text-black font-black py-4 rounded-xl hover:opacity-90 transition-opacity mt-2">
                    Send message
                  </button>
                </form>
             )}
          </div>
          
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-black mb-10">Direct contact</h3>
            
            <div className="flex flex-col gap-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#111] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-xl">📧</div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email us</div>
                  <a href="mailto:hello@titezme.com" className="text-lg font-black text-brand-yellow hover:underline">hello@titezme.com</a>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#111] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-xl">📸</div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Instagram</div>
                  <a href="https://instagram.com/titezme" target="_blank" rel="noopener noreferrer" className="text-lg font-black text-brand-yellow hover:underline">@titezme</a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#111] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-xl">🕐</div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Response time</div>
                  <div className="text-lg font-black text-white">Within 24 hours</div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#111] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-xl">📍</div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Based in</div>
                  <div className="text-lg font-black text-white">Madrid & Marrakesh</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
