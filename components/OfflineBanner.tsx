'use client';

import { useState, useEffect } from 'react';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    // Initialise from current state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowBackOnline(true);
        setTimeout(() => {
          setShowBackOnline(false);
          setWasOffline(false);
        }, 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowBackOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  if (isOnline && !showBackOnline) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      padding: '10px 20px',
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: 700,
      background: isOnline ? '#0f2010' : '#1a0808',
      color: isOnline ? '#22C55E' : '#EF4444',
      borderBottom: `1px solid ${isOnline ? '#22C55E33' : '#EF444433'}`,
      transition: 'all 0.3s ease',
    }}>
      {isOnline
        ? '✓ Back online — your changes are being saved'
        : '⚠ No internet connection — changes will not be saved'}
    </div>
  );
}
