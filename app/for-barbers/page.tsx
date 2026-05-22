'use client'

import { useEffect } from 'react'

export default function ForBarbersPage() {
  useEffect(() => {
    document.title = 'For Barbers — titeZMe'
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
        maxWidth: '900px',
        margin: '0 auto',
        padding: '100px 24px 80px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '11px', fontWeight: 800, color: '#555',
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px'
        }}>
          FOR BARBERS
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 900,
          lineHeight: 1.1,
          margin: '0 0 24px',
          color: '#fff'
        }}>
          Grow your clientele.<br />
          <span style={{ color: '#F5C518' }}>Keep your freedom.</span>
        </h1>
        <p style={{
          fontSize: '18px', color: '#666', lineHeight: 1.8,
          maxWidth: '600px', margin: '0 auto 40px'
        }}>
          titeZMe gives you a professional booking profile, real-time availability management,
          and a steady stream of new clients. All free. No commissions.
        </p>
        <a href="/onboarding/barber" style={{
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
          Join for free →
        </a>
        <div style={{ fontSize: '12px', color: '#444', marginTop: '12px' }}>
          Free forever. No credit card. No commission.
        </div>
      </div>

      {/* BENEFITS */}
      <div style={{
        background: '#0d0d0d',
        borderTop: '1px solid #141414',
        borderBottom: '1px solid #141414',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontSize: '11px', fontWeight: 800, color: '#555',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px'
            }}>
              WHY TITEZME
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>
              Everything you need. Nothing you don&apos;t.
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: '📅',
                title: 'Smart scheduling',
                desc: "Set your working hours once. Clients see your real availability. No double bookings. No chaos."
              },
              {
                icon: '🔔',
                title: 'Instant notifications',
                desc: 'Get notified the moment a client books. Accept or decline in one tap. You stay in control.'
              },
              {
                icon: '⭐',
                title: 'Verified reviews',
                desc: 'Only clients who actually booked through titeZMe can leave reviews. Real feedback only.'
              },
              {
                icon: '📊',
                title: 'Track your growth',
                desc: "See your total cuts, rating, and profile views. Understand what's working and grow faster."
              },
              {
                icon: '🏪',
                title: 'Work solo or in a shop',
                desc: 'List yourself independently OR join a barbershop. Switch anytime. Your profile, your rules.'
              },
              {
                icon: '🌍',
                title: 'Global reach',
                desc: 'Your profile is visible to clients worldwide. Perfect for barbers in cities with expat communities.'
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
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 800, color: '#555',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px'
          }}>
            HOW IT WORKS
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>Up and running in minutes</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            {
              step: '01',
              title: 'Create your profile',
              desc: 'Sign up and complete your barber profile. Add your bio, services, prices, and a profile photo. Takes 5 minutes.'
            },
            {
              step: '02',
              title: 'Set your availability',
              desc: "Use our visual calendar to paint your working hours. Clients only see slots when you're actually free."
            },
            {
              step: '03',
              title: 'Start getting bookings',
              desc: 'Share your profile link or let clients find you through titeZMe search. Accept bookings and grow your clientele.'
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
      <div style={{
        background: '#0d0d0d',
        borderTop: '1px solid #141414',
        borderBottom: '1px solid #141414',
        padding: '80px 24px'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontSize: '11px', fontWeight: 800, color: '#555',
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px'
            }}>
              WHAT YOU GET
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>Your complete barber toolkit</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {[
              'Professional barber profile page',
              'Real-time availability calendar',
              'Instant booking notifications',
              'Client management dashboard',
              'Verified reviews system',
              'Unique barber code (TZB-XXXXXX)',
              'Profile sharing link',
              'Total cuts counter',
              'Star rating display',
              'Service menu with prices',
              'Shop integration (optional)',
              'Multi-language support'
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
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 800, color: '#555',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px'
          }}>
            FAQ
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>Questions from barbers</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            {
              q: 'Is titeZMe really free?',
              a: 'Yes. Creating your barber profile and receiving bookings is completely free. No commission on bookings. No hidden fees.'
            },
            {
              q: 'Do I need to accept every booking?',
              a: 'No. Every booking request comes to you first. You decide whether to accept or decline. You stay in full control of your schedule.'
            },
            {
              q: "What if a client doesn't show up?",
              a: "You can mark the booking as a no-show. The client's record is updated. Repeat no-shows are flagged on our platform."
            },
            {
              q: 'Can I work solo AND in a shop?',
              a: 'Yes. You can have your own independent profile and also be part of a barbershop on titeZMe. Clients can choose how they want to book you.'
            },
            {
              q: 'How do clients pay?',
              a: 'Currently cash directly to you after the service. Online payment is coming soon.'
            },
            {
              q: 'Can I join from any country?',
              a: 'Yes. titeZMe works worldwide. Wherever you are, you can create a profile and start receiving bookings.'
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
      <div style={{
        background: '#111',
        borderTop: '1px solid #1e1e1e',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}>
          Ready to grow your clientele?
        </h2>
        <p style={{ fontSize: '15px', color: '#555', marginBottom: '32px' }}>
          Join hundreds of barbers already on titeZMe. Free forever.
        </p>
        <a href="/onboarding/barber" style={{
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
          Create your free profile →
        </a>
        <div style={{ fontSize: '12px', color: '#444', marginTop: '12px' }}>
          No credit card. No commission. No bullshit.
        </div>
      </div>

    </div>
  )
}
