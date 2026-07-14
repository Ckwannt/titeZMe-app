'use client'

import { useLang } from '@/lib/i18n/LangContext';

export default function ForBarbersPage() {
  const { t } = useLang();

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
          {t('forBarbers.kicker')}
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 64px)',
          fontWeight: 900,
          lineHeight: 1.1,
          margin: '0 0 24px',
          color: '#fff'
        }}>
          {t('forBarbers.heroTitle1')}<br />
          <span style={{ color: '#F5C518' }}>{t('forBarbers.heroTitle2')}</span>
        </h1>
        <p style={{
          fontSize: '18px', color: '#666', lineHeight: 1.8,
          maxWidth: '600px', margin: '0 auto 40px'
        }}>
          {t('forBarbers.heroSubtitle')}
        </p>
        <a href="/onboarding/professional" style={{
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
          {t('forBarbers.joinFree')}
        </a>
        <div style={{ fontSize: '12px', color: '#444', marginTop: '12px' }}>
          {t('forBarbers.freeForever')}
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
              {t('forBarbers.whyKicker')}
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>
              {t('forBarbers.whyTitle')}
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {[
              { icon: '📅', title: t('forBarbers.benefit1Title'), desc: t('forBarbers.benefit1Desc') },
              { icon: '🔔', title: t('forBarbers.benefit2Title'), desc: t('forBarbers.benefit2Desc') },
              { icon: '⭐', title: t('forBarbers.benefit3Title'), desc: t('forBarbers.benefit3Desc') },
              { icon: '📊', title: t('forBarbers.benefit4Title'), desc: t('forBarbers.benefit4Desc') },
              { icon: '🏪', title: t('forBarbers.benefit5Title'), desc: t('forBarbers.benefit5Desc') },
              { icon: '🌍', title: t('forBarbers.benefit6Title'), desc: t('forBarbers.benefit6Desc') }
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
            {t('landing.howItWorks')}
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>{t('forBarbers.howItWorksTitle')}</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { step: '01', title: t('forBarbers.step1Title'), desc: t('forBarbers.step1Desc') },
            { step: '02', title: t('forBarbers.step2Title'), desc: t('forBarbers.step2Desc') },
            { step: '03', title: t('forBarbers.step3Title'), desc: t('forBarbers.step3Desc') }
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
              {t('forBarbers.whatYouGetKicker')}
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>{t('forBarbers.whatYouGetTitle')}</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {[
              t('forBarbers.feature1'),
              t('forBarbers.feature2'),
              t('forBarbers.feature3'),
              t('forBarbers.feature4'),
              t('forBarbers.feature5'),
              t('forBarbers.feature6'),
              t('forBarbers.feature7'),
              t('forBarbers.feature8'),
              t('forBarbers.feature9'),
              t('forBarbers.feature10'),
              t('forBarbers.feature11'),
              t('forBarbers.feature12')
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
            {t('forBarbers.faqKicker')}
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>{t('forBarbers.faqTitle')}</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {[
            { q: t('forBarbers.faq1Q'), a: t('forBarbers.faq1A') },
            { q: t('forBarbers.faq2Q'), a: t('forBarbers.faq2A') },
            { q: t('forBarbers.faq3Q'), a: t('forBarbers.faq3A') },
            { q: t('forBarbers.faq4Q'), a: t('forBarbers.faq4A') },
            { q: t('forBarbers.faq5Q'), a: t('forBarbers.faq5A') },
            { q: t('forBarbers.faq6Q'), a: t('forBarbers.faq6A') }
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
          {t('forBarbers.ctaTitle')}
        </h2>
        <p style={{ fontSize: '15px', color: '#555', marginBottom: '32px' }}>
          {t('forBarbers.ctaSubtitle')}
        </p>
        <a href="/onboarding/professional" style={{
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
          {t('forBarbers.ctaButton')}
        </a>
        <div style={{ fontSize: '12px', color: '#444', marginTop: '12px' }}>
          {t('forBarbers.ctaDisclaimer')}
        </div>
      </div>

    </div>
  )
}
