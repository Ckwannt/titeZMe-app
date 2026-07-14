'use client'

import { useEffect } from 'react'

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About — titeZMe'
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      fontFamily: 'Nunito, sans-serif',
      color: '#fff'
    }}>

      {/* HERO */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '100px 24px 80px'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#555',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '20px'
        }}>
          ABOUT TITEZME
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 900,
          lineHeight: 1.1,
          margin: '0 0 24px',
          color: '#fff'
        }}>
          We&apos;re fixing how you book your barber.
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: 1.8,
          maxWidth: '600px'
        }}>
          Getting a haircut should be the easiest thing in the world.
          Yet somehow it still involves WhatsApp messages, missed calls,
          and hoping your barber is free. We built titeZMe to fix that.
        </p>
      </div>

      <div style={{ height: '1px', background: '#141414', maxWidth: '800px', margin: '0 auto' }} />

      {/* THE PROBLEM */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{
          fontSize: '11px', fontWeight: 800, color: '#555',
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px'
        }}>
          THE PROBLEM
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px', color: '#fff' }}>
          Before titeZMe
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {[
            {
              icon: '📱',
              title: 'WhatsApp chaos',
              desc: 'Clients send messages at midnight hoping for a reply. Barbers miss bookings while cutting hair.'
            },
            {
              icon: '❓',
              title: 'No real availability',
              desc: 'You never know if your barber is free until you actually show up and wait.'
            },
            {
              icon: '🏃',
              title: 'Last minute cancellations',
              desc: 'No-shows waste barber time. Clients have no way to cancel easily.'
            },
            {
              icon: '💸',
              title: 'Lost revenue',
              desc: 'Empty slots that could have been filled. Clients who went somewhere else.'
            }
          ].map(item => (
            <div key={item.title} style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>{item.title}</div>
              <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: '#141414', maxWidth: '800px', margin: '0 auto' }} />

      {/* THE SOLUTION */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{
          fontSize: '11px', fontWeight: 800, color: '#555',
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px'
        }}>
          THE SOLUTION
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px', color: '#fff' }}>
          What titeZMe does
        </h2>
        <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8, marginBottom: '32px' }}>
          titeZMe connects clients with independent barbers and barbershops. Clients see real
          availability and book in seconds. Barbers manage everything from one simple dashboard.
          No phone calls. No WhatsApp. No waiting.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { highlight: '✓ Real-time availability', rest: 'see exactly when your barber is free' },
            { highlight: '✓ Book in 30 seconds', rest: 'no calls, no messages, no waiting' },
            { highlight: '✓ Instant confirmation', rest: 'barber accepts, you get notified' },
            { highlight: '✓ Smart reminders', rest: 'never miss an appointment' },
            { highlight: '✓ Honest reviews', rest: 'only verified clients can review' },
            { highlight: '✓ Works everywhere', rest: 'any city, any country' },
          ].map(item => (
            <div key={item.highlight} style={{ fontSize: '15px', color: '#888', lineHeight: 1.6 }}>
              <span style={{ color: '#F5C518', marginRight: '8px' }}>{item.highlight}</span>
              {' — '}
              {item.rest}
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: '#141414', maxWidth: '800px', margin: '0 auto' }} />

      {/* THE VISION */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{
          fontSize: '11px', fontWeight: 800, color: '#555',
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px'
        }}>
          THE VISION
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '24px', color: '#fff' }}>
          Where we&apos;re going
        </h2>
        <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8, marginBottom: '24px' }}>
          We&apos;re starting with barbers because it&apos;s a space we know and love. But the vision is bigger.
          titeZMe is building the infrastructure for service booking across the communities we serve —
          Europe, North Africa, and beyond.
        </p>
        <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.8 }}>
          Every barber deserves a professional digital presence. Every client deserves to find
          the right barber effortlessly. We&apos;re making that happen, one city at a time.
        </p>
      </div>

      <div style={{ height: '1px', background: '#141414', maxWidth: '800px', margin: '0 auto' }} />

      {/* VALUES */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{
          fontSize: '11px', fontWeight: 800, color: '#555',
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px'
        }}>
          OUR VALUES
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '32px', color: '#fff' }}>
          What we believe in
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {[
            {
              title: 'Simplicity first',
              desc: "If it takes more than 30 seconds it's too complicated. We obsess over simplicity."
            },
            {
              title: 'Trust by design',
              desc: 'Only verified clients can review. Only approved barbers go live. Quality over quantity always.'
            },
            {
              title: 'Community driven',
              desc: 'We build for the barber communities we know. Real people, real needs, real solutions.'
            },
            {
              title: 'Always improving',
              desc: 'We ship fast, listen to feedback, and make it better every week. Done is better than perfect.'
            }
          ].map(item => (
            <div key={item.title} style={{ padding: '24px 0', borderTop: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#F5C518', marginBottom: '8px' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: '#111',
        borderTop: '1px solid #1e1e1e',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>
          Ready to get started?
        </h2>
        <p style={{ fontSize: '15px', color: '#555', marginBottom: '32px' }}>
          Find a barber near you or join as a barber today.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/barbers" style={{
            background: '#F5C518',
            color: '#0a0a0a',
            padding: '14px 28px',
            borderRadius: '99px',
            fontSize: '14px',
            fontWeight: 900,
            textDecoration: 'none',
            fontFamily: 'Nunito, sans-serif'
          }}>
            Find a barber →
          </a>
          <a href="/onboarding/professional" style={{
            background: 'transparent',
            color: '#fff',
            padding: '14px 28px',
            borderRadius: '99px',
            fontSize: '14px',
            fontWeight: 900,
            textDecoration: 'none',
            border: '1px solid #2a2a2a',
            fontFamily: 'Nunito, sans-serif'
          }}>
            Join as a barber
          </a>
        </div>
      </div>

    </div>
  )
}
