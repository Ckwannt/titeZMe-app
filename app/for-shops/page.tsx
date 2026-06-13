'use client'

import { useEffect } from 'react'

export default function ForShopsPage() {
  useEffect(() => {
    document.title = 'For Shops — titeZMe'
  }, [])

  return (
    <>
      <style>{`
  .fs-section {
    padding-left: 48px;
    padding-right: 48px;
  }
  @media (max-width: 768px) {
    .fs-section {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
`}</style>
      <div style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        fontFamily: 'Nunito, sans-serif',
        color: '#fff'
      }}>

      {/* HERO */}
      <div className="fs-section" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '120px',
        paddingBottom: '100px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '11px', fontWeight: 800, color: '#555',
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px'
        }}>
          FOR BARBERSHOPS
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 900,
          lineHeight: 1.1,
          margin: '0 0 24px',
          color: '#fff'
        }}>
          Run your shop smarter.<br />
          <span style={{ color: '#F5C518' }}>Fill every chair.</span>
        </h1>
        <p style={{
          fontSize: '18px', color: '#666', lineHeight: 1.8,
          maxWidth: '720px', margin: '0 auto 40px'
        }}>
          titeZMe gives your barbershop a professional online presence, a complete team management
          system, and a steady flow of new clients. All in one place.
        </p>
        <a href="/dashboard/barber" style={{
          background: '#F5C518',
          color: '#0a0a0a',
          padding: '16px 36px',
          borderRadius: '99px',
          fontSize: '16px',
          fontWeight: 900,
          textDecoration: 'none',
          fontFamily: 'Nunito, sans-serif',
          display: 'inline-block'
        }}>
          Create your shop →
        </a>
        <div style={{ fontSize: '12px', color: '#444', marginTop: '12px' }}>
          Free to list. No monthly fees.
        </div>
      </div>

      {/* BENEFITS */}
      <div className="fs-section" style={{
        background: '#0d0d0d',
        borderTop: '1px solid #141414',
        borderBottom: '1px solid #141414',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontSize: '11px', fontWeight: 800, color: '#555',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px'
            }}>
              WHY TITEZME FOR SHOPS
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>
              Your entire shop. One dashboard.
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: '👥',
                title: 'Team management',
                desc: 'Add your barbers to the shop. Each gets their own profile. Clients can book the whole shop or specific barbers.'
              },
              {
                icon: '📅',
                title: 'All bookings in one place',
                desc: 'See every appointment across your entire team from one dashboard. No more scattered WhatsApp groups.'
              },
              {
                icon: '💰',
                title: 'Earnings overview',
                desc: 'Track revenue per barber, per service, and overall. Understand your busiest hours and most popular cuts.'
              },
              {
                icon: '🗺️',
                title: 'Google Maps integration',
                desc: 'Your shop appears with your real location. Clients nearby discover you instantly.'
              },
              {
                icon: '⭐',
                title: 'Shop reviews',
                desc: "Build your shop's reputation with verified reviews from real clients. Honest, trusted feedback."
              },
              {
                icon: '✂️',
                title: 'Shop services',
                desc: 'Set shop-wide services alongside individual barber services. Full control over your menu.'
              }
            ].map(item => (
              <div key={item.title} style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: '16px',
                padding: '28px'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="fs-section" style={{ maxWidth: '860px', margin: '0 auto', paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 800, color: '#555',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px'
          }}>
            HOW IT WORKS
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>Your shop online in minutes</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            {
              step: '01',
              title: 'Create your shop profile',
              desc: 'Sign up as a barber first then create your shop from your dashboard. Add your shop name, address, services, and photos.'
            },
            {
              step: '02',
              title: 'Build your team',
              desc: "Invite your barbers using their titeZMe barber code. Each barber keeps their own profile while appearing in your shop."
            },
            {
              step: '03',
              title: 'Start filling chairs',
              desc: 'Clients find your shop on titeZMe and book directly. You see all bookings in your shop dashboard in real time.'
            }
          ].map((item, index) => (
            <div key={item.step} style={{
              display: 'flex',
              gap: '24px',
              padding: '32px 0',
              borderBottom: index < 2 ? '1px solid #141414' : 'none'
            }}>
              <div style={{
                fontSize: '32px', fontWeight: 900, color: '#F5C518',
                opacity: 0.4, flexShrink: 0, width: '48px'
              }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHAT YOU GET */}
      <div className="fs-section" style={{
        background: '#0d0d0d',
        borderTop: '1px solid #141414',
        borderBottom: '1px solid #141414',
        paddingTop: '80px',
        paddingBottom: '80px'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontSize: '11px', fontWeight: 800, color: '#555',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px'
            }}>
              WHAT YOU GET
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>Everything your shop needs</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {[
              'Professional shop profile page',
              'Team management dashboard',
              'All bookings in one view',
              'Per-barber earnings tracking',
              'Shop-wide service menu',
              'Google Maps location display',
              'Verified client reviews',
              'Real-time availability sync',
              'Instant booking notifications',
              'Shop approval and trust badge',
              'Multiple barber profiles',
              'Booking history and analytics'
            ].map(feature => (
              <div key={feature} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13px', color: '#888', padding: '10px 0',
                borderBottom: '1px solid #141414'
              }}>
                <span style={{ color: '#22C55E', fontSize: '14px', flexShrink: 0 }}>✓</span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="fs-section" style={{ maxWidth: '860px', margin: '0 auto', paddingTop: '80px', paddingBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 800, color: '#555',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px'
          }}>
            FAQ
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>Questions from shop owners</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            {
              q: 'Do my barbers need their own titeZMe accounts?',
              a: "Yes. Each barber needs their own titeZMe profile. This gives them their own booking page while also appearing in your shop. They stay independent while being part of your team."
            },
            {
              q: 'Can clients book the shop directly or only barbers?',
              a: "Both. Clients can book your shop and choose any available barber. Or they can go directly to a specific barber's profile."
            },
            {
              q: 'What happens if a barber leaves my shop?',
              a: 'You can remove them from your team anytime. Their individual profile stays active but they no longer appear in your shop.'
            },
            {
              q: 'Is there an approval process?',
              a: 'Yes. All shops go through a quick review before going live. This ensures quality for clients and protects the titeZMe community.'
            },
            {
              q: 'How many barbers can I add to my shop?',
              a: 'Currently unlimited. Add your entire team. Each barber manages their own schedule and you see all bookings in one place.'
            }
          ].map((item, index, arr) => (
            <div key={item.q} style={{
              padding: '28px 0',
              borderBottom: index < arr.length - 1 ? '1px solid #141414' : 'none'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginBottom: '10px' }}>
                {item.q}
              </div>
              <div style={{ fontSize: '14px', color: '#555', lineHeight: 1.7 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fs-section" style={{
        background: '#111',
        borderTop: '1px solid #1e1e1e',
        paddingTop: '80px',
        paddingBottom: '80px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}>
          Ready to bring your shop online?
        </h2>
        <p style={{ fontSize: '15px', color: '#555', marginBottom: '32px' }}>
          Create your shop profile today. Free to list. No monthly fees.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/dashboard/barber" style={{
            background: '#F5C518',
            color: '#0a0a0a',
            padding: '16px 36px',
            borderRadius: '99px',
            fontSize: '16px',
            fontWeight: 900,
            textDecoration: 'none',
            fontFamily: 'Nunito, sans-serif',
            display: 'inline-block'
          }}>
            Create your shop →
          </a>
          <a href="/for-barbers" style={{
            background: 'transparent',
            color: '#fff',
            padding: '16px 36px',
            borderRadius: '99px',
            fontSize: '16px',
            fontWeight: 900,
            textDecoration: 'none',
            border: '1px solid #2a2a2a',
            fontFamily: 'Nunito, sans-serif',
            display: 'inline-block'
          }}>
            Info for barbers →
          </a>
        </div>
      </div>

      </div>
    </>
  )
}
