'use client';

import { useState } from 'react';
import { useLang } from '@/lib/i18n/LangContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const INITIAL_FORM = {
  name: '',
  email: '',
  role: 'client',
  subject: 'bug',
  message: '',
  honeypot: '',
};

export default function ContactPage() {
  const { t } = useLang();
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setIsSending(true);
    setError('');
    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: form.name.trim().slice(0, 100),
        email: form.email.trim().slice(0, 200),
        role: form.role,
        subject: form.subject,
        message: form.message.trim().slice(0, 2000),
        createdAt: serverTimestamp(),
        read: false,
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error('Contact form error:', err);
      setError(t('contactPage.errorGeneric'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white pt-24 min-h-screen font-sans">
      <section className="bg-[#0A0A0A] py-24 px-6">
        <div className="max-w-[1200px] mx-auto mb-16 text-center">
          <h1 className="text-3xl md:text-7xl font-black tracking-tight mb-6">{t('contactPage.title')}</h1>
          <p className="text-xl font-bold text-gray-400">{t('contactPage.subtitle')}<br/>{t('contactPage.respond')}</p>
          <p style={{ fontSize: 13, color: '#888', marginTop: 8, fontWeight: 600 }}>
            {t('contactPage.socialProof')}
          </p>
        </div>

        <div className="max-w-[1000px] mx-auto grid md:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24">
          <div className="bg-[#111] border border-[#2a2a2a] p-8 md:p-10 rounded-3xl">
             {isSubmitted ? (
               <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-fadeUp">
                  <div className="w-20 h-20 bg-brand-yellow/10 rounded-full flex items-center justify-center mb-6">
                     <span className="text-4xl">📨</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">{t('contactPage.thanks')}</h3>
                  <p className="text-gray-400 font-bold mb-8">{t('contactPage.thanksBody')}</p>
                  <button
                    onClick={() => { setForm(INITIAL_FORM); setIsSubmitted(false); }}
                    className="text-sm font-bold text-brand-yellow hover:opacity-80"
                  >
                    {t('contactPage.another')}
                  </button>
               </div>
             ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fadeUp">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('contactPage.nameLabel')}</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-gray-600"
                      placeholder={t('contactPage.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('contactPage.emailLabel')}</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-gray-600"
                      placeholder={t('contactPage.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('contactPage.roleLabel')}</label>
                    <select
                      required
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors appearance-none cursor-pointer"
                    >
                      <option value="client">{t('contactPage.roleClient')}</option>
                      <option value="barber">{t('contactPage.roleBarber')}</option>
                      <option value="shop_owner">{t('contactPage.roleShopOwner')}</option>
                      <option value="barber_school">{t('contactPage.roleBarberSchool')}</option>
                      <option value="brand_sponsor">{t('contactPage.roleBrandSponsor')}</option>
                      <option value="city_partner">{t('contactPage.roleCityPartner')}</option>
                      <option value="investor">{t('contactPage.roleInvestor')}</option>
                      <option value="press">{t('contactPage.rolePress')}</option>
                      <option value="other">{t('contactPage.roleOther')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('contactPage.subjectLabel')}</label>
                    <select
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors appearance-none cursor-pointer"
                    >
                      <option value="bug">{t('contactPage.subjectBug')}</option>
                      <option value="booking">{t('contactPage.subjectBookingHelp')}</option>
                      <option value="partnership">{t('contactPage.subjectPartnership')}</option>
                      <option value="press">{t('contactPage.subjectPress')}</option>
                      <option value="demo">{t('contactPage.subjectDemo')}</option>
                      <option value="billing">{t('contactPage.subjectBilling')}</option>
                      <option value="other">{t('contactPage.subjectOther')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t('contactPage.messageLabel')}</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-gray-600 resize-none"
                      placeholder={t('contactPage.messagePlaceholder')}
                    ></textarea>
                  </div>
                  <div style={{ position: 'relative', overflow: 'hidden', height: 0 }}>
                    <input
                      type="text"
                      name="website"
                      value={form.honeypot}
                      onChange={e => setForm(f => ({ ...f, honeypot: e.target.value }))}
                      style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-brand-yellow text-black font-black py-4 rounded-xl hover:opacity-90 transition-opacity mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSending ? t('contactPage.sending') : t('contactPage.submit')}
                  </button>
                  {error && (
                    <p style={{ color: '#E8491D', fontSize: 13 }}>{error}</p>
                  )}
                </form>
             )}
          </div>

          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-black mb-10">{t('contactPage.directContact')}</h3>

            <div className="flex flex-col gap-8">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#111] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-xl">📧</div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t('contactPage.emailUs')}</div>
                  <a href="mailto:hello@titezme.com" className="text-lg font-black text-brand-yellow hover:underline">hello@titezme.com</a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#111] border border-[#2a2a2a] flex items-center justify-center shrink-0 text-xl">📍</div>
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t('contactPage.basedIn')}</div>
                  <div className="text-lg font-black text-white">{t('contactPage.basedValue')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
