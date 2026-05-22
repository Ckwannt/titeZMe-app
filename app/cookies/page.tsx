'use client'

import { useState, useEffect } from 'react'

export default function CookiesPage() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.title = 'Cookie Settings — titeZMe'
    const stored = localStorage.getItem('cookie_analytics')
    if (stored !== null) {
      setAnalyticsEnabled(stored === 'true')
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('cookie_analytics', analyticsEnabled.toString())
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      fontFamily: 'Nunito, sans-serif',
      color: '#fff',
      padding: '80px 24px'
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 800, color: '#555',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px'
          }}>
            PRIVACY
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>
            Cookie Settings
          </h1>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7, margin: 0 }}>
            We use cookies to keep you logged in and understand how titeZMe is used.
            You can manage your preferences below.
          </p>
        </div>

        {/* Essential cookies */}
        <div style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>Essential cookies</div>
                <div style={{
                  background: '#1e1e1e', color: '#555', fontSize: '10px', fontWeight: 800,
                  padding: '2px 8px', borderRadius: '99px', letterSpacing: '0.05em'
                }}>
                  ALWAYS ON
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7, margin: 0 }}>
                These cookies are required for titeZMe to work. They keep you logged in,
                protect your account security, and remember your preferences. They cannot be disabled.
              </p>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { name: 'Firebase Auth', purpose: 'Keeps you logged in securely' },
                  { name: 'Session storage', purpose: 'Remembers your preferences this visit' },
                ].map(c => (
                  <div key={c.name} style={{ fontSize: '12px', color: '#444', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#333', flexShrink: 0 }}>{c.name}:</span>
                    {c.purpose}
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              width: '44px', height: '24px', background: '#22C55E',
              borderRadius: '99px', flexShrink: 0, opacity: 0.5, cursor: 'not-allowed'
            }} />
          </div>
        </div>

        {/* Analytics cookies */}
        <div style={{
          background: '#111',
          border: `1px solid ${analyticsEnabled ? '#F5C51833' : '#1e1e1e'}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          transition: 'border-color 0.2s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
                Analytics cookies
              </div>
              <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7, margin: 0 }}>
                These help us understand how people use titeZMe so we can make it better.
                We use Google Analytics to see which pages are visited and how users navigate
                the platform. No personal data is sold.
              </p>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { name: 'Google Analytics', purpose: 'Page views and usage patterns' },
                  { name: '_ga, _gid', purpose: 'Distinguish unique visitors' },
                ].map(c => (
                  <div key={c.name} style={{ fontSize: '12px', color: '#444', display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#333', flexShrink: 0 }}>{c.name}:</span>
                    {c.purpose}
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle */}
            <button
              onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
              style={{
                width: '44px', height: '24px',
                background: analyticsEnabled ? '#F5C518' : '#2a2a2a',
                borderRadius: '99px', border: 'none', cursor: 'pointer',
                flexShrink: 0, position: 'relative', transition: 'background 0.2s'
              }}
              aria-label="Toggle analytics"
            >
              <div style={{
                position: 'absolute', width: '18px', height: '18px',
                background: '#fff', borderRadius: '50%', top: '3px',
                left: analyticsEnabled ? '23px' : '3px',
                transition: 'left 0.2s'
              }} />
            </button>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleSave}
            style={{
              background: '#F5C518', color: '#0a0a0a', border: 'none',
              borderRadius: '99px', padding: '13px 28px', fontSize: '14px',
              fontWeight: 900, cursor: 'pointer', fontFamily: 'Nunito, sans-serif'
            }}
          >
            Save preferences
          </button>
          {saved && (
            <div style={{ fontSize: '13px', color: '#22C55E', fontWeight: 800 }}>
              ✓ Saved
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #141414' }}>
          <p style={{ fontSize: '12px', color: '#444', lineHeight: 1.7, margin: '0 0 8px' }}>
            For more information about how we handle your data, read our{' '}
            <a href="/privacy" style={{ color: '#F5C518', textDecoration: 'none' }}>Privacy Policy</a>.
          </p>
          <p style={{ fontSize: '12px', color: '#444', lineHeight: 1.7, margin: 0 }}>
            Your preferences are saved in your browser. Clearing your browser data will reset these settings.
          </p>
        </div>

      </div>
    </div>
  )
}
