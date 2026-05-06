'use client';

import { useState, useEffect } from 'react';

type CookieSettings = {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
};

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true,
    analytics: false,
    preferences: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('titezme_cookie_settings');
    if (!saved) {
      setTimeout(() => setIsVisible(true), 0);
    }
  }, []);

  const saveAndClose = (newSettings: CookieSettings) => {
    localStorage.setItem('titezme_cookie_settings', JSON.stringify(newSettings));
    setIsVisible(false);
    setShowModal(false);
  };

  const acceptAll = () => {
    saveAndClose({ essential: true, analytics: true, preferences: true });
  };

  const rejectAll = () => {
    saveAndClose({ essential: true, analytics: false, preferences: false });
  };

  const savePreferences = () => {
    saveAndClose(settings);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 md:bottom-6 left-0 md:left-6 z-[100] w-full md:max-w-sm md:w-full bg-[#111111] border-t md:border border-[#1E1E1E] p-6 rounded-t-2xl md:rounded-2xl shadow-2xl animate-fadeUp">
        <h3 className="text-base md:text-lg font-black text-white mb-2">We value your privacy</h3>
        <p className="text-xs md:text-sm font-bold text-[#888580] mb-6 leading-relaxed">
          We use cookies to improve your experience. Essential cookies are always on. You can choose to accept others or customize your preferences.
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={acceptAll}
            className="w-full bg-[#FFD600] text-[#0A0A0A] font-black py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Accept all
          </button>
          <div className="flex gap-3">
            <button 
              onClick={rejectAll}
              className="flex-1 bg-transparent border border-[#1E1E1E] text-[#F0EDE8] font-black py-3 rounded-xl hover:bg-[#1E1E1E] transition-colors"
            >
              Reject all
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="flex-1 bg-transparent border border-[#1E1E1E] text-[#F0EDE8] font-black py-3 rounded-xl hover:bg-[#1E1E1E] transition-colors"
            >
              Customize
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[110] bg-black/80 flex flex-col justify-end md:items-center md:justify-center animate-fadeIn">
          <div className="bg-[#111111] border-t md:border border-[#1E1E1E] rounded-t-2xl md:rounded-2xl p-6 md:p-8 w-full md:max-w-md">
            <h3 className="text-xl md:text-2xl font-black text-white mb-6">Cookie Preferences</h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white">Essential</h4>
                  <p className="text-xs md:text-sm text-[#888580] font-bold mt-1">Required for the site to function properly. Cannot be disabled.</p>
                </div>
                <div className="w-12 h-6 rounded-full bg-[#FFD600]/20 flex items-center px-1 shrink-0">
                  <div className="w-4 h-4 rounded-full bg-[#FFD600] translate-x-6"></div>
                </div>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white">Preferences</h4>
                  <p className="text-xs md:text-sm text-[#888580] font-bold mt-1">Remembers your settings like language and city.</p>
                </div>
                <button 
                  onClick={() => setSettings(s => ({ ...s, preferences: !s.preferences }))}
                  className={`w-12 h-6 rounded-full flex items-center px-1 shrink-0 transition-colors ${settings.preferences ? 'bg-[#FFD600]/20' : 'bg-[#1E1E1E]'}`}
                >
                  <div className={`w-4 h-4 rounded-full transition-transform ${settings.preferences ? 'bg-[#FFD600] translate-x-6' : 'bg-gray-500 translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white">Analytics</h4>
                  <p className="text-xs md:text-sm text-[#888580] font-bold mt-1">Helps us understand how visitors interact with the website.</p>
                </div>
                <button 
                  onClick={() => setSettings(s => ({ ...s, analytics: !s.analytics }))}
                  className={`w-12 h-6 rounded-full flex items-center px-1 shrink-0 transition-colors ${settings.analytics ? 'bg-[#FFD600]/20' : 'bg-[#1E1E1E]'}`}
                >
                  <div className={`w-4 h-4 rounded-full transition-transform ${settings.analytics ? 'bg-[#FFD600] translate-x-6' : 'bg-gray-500 translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <button 
              onClick={savePreferences}
              className="w-full bg-[#FFD600] text-[#0A0A0A] font-black py-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              Save preferences
            </button>
          </div>
        </div>
      )}
    </>
  );
}
