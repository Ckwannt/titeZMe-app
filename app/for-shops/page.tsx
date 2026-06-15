'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/lib/i18n/LangContext'

export default function ForShopsPage() {
  const { t } = useLang()

  useEffect(() => {
    document.title = t('forShops.pageTitle')
  }, [t])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )
    const elements = document.querySelectorAll(
      '.reveal, .reveal-left, .section-title'
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const stats = [
    { number: t('forShops.stat1Number'), label: t('forShops.stat1Label') },
    { number: t('forShops.stat2Number'), label: t('forShops.stat2Label') },
    { number: t('forShops.stat3Number'), label: t('forShops.stat3Label') },
    { number: t('forShops.stat4Number'), label: t('forShops.stat4Label') },
  ]

  const beforeItems = [
    t('forShops.before1'),
    t('forShops.before2'),
    t('forShops.before3'),
    t('forShops.before4'),
    t('forShops.before5'),
    t('forShops.before6'),
  ]

  const afterItems = [
    t('forShops.after1'),
    t('forShops.after2'),
    t('forShops.after3'),
    t('forShops.after4'),
    t('forShops.after5'),
    t('forShops.after6'),
  ]

  const chairBullets = [
    t('forShops.chairBullet1'),
    t('forShops.chairBullet2'),
    t('forShops.chairBullet3'),
    t('forShops.chairBullet4'),
  ]

  const howSteps = [
    { step: '01', title: t('forShops.step1Title'), desc: t('forShops.step1Desc') },
    { step: '02', title: t('forShops.step2Title'), desc: t('forShops.step2Desc') },
    { step: '03', title: t('forShops.step3Title'), desc: t('forShops.step3Desc') },
  ]

  const pricingCards = [
    { label: t('forShops.card1Label'), price: t('forShops.card1Price'), desc: t('forShops.card1Desc'), highlight: false },
    { label: t('forShops.card2Label'), price: t('forShops.card2Price'), desc: t('forShops.card2Desc'), highlight: true },
    { label: t('forShops.card3Label'), price: t('forShops.card3Price'), desc: t('forShops.card3Desc'), highlight: false },
  ]

  const faqItems = [
    { q: t('forShops.faq1Q'), a: t('forShops.faq1A') },
    { q: t('forShops.faq2Q'), a: t('forShops.faq2A') },
    { q: t('forShops.faq3Q'), a: t('forShops.faq3A') },
    { q: t('forShops.faq4Q'), a: t('forShops.faq4A') },
    { q: t('forShops.faq5Q'), a: t('forShops.faq5A') },
  ]

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

        /* HERO VIDEO */
        .hero-video-wrap {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          overflow: hidden;
          padding: 160px 48px 100px;
        }
        @media (max-width: 768px) {
          .hero-video-wrap {
            padding: 140px 20px 80px;
          }
        }
        .hero-video {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.18;
          z-index: 0;
        }
        .hero-poster {
          display: none;
        }
        @media (max-width: 768px) {
          .hero-video {
            display: none;
          }
          .hero-poster {
            display: block;
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-image: url('https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0539007834.firebasestorage.app/o/videos%2FScreenshot%202026-06-15%20053753.png?alt=media&token=de0e3317-4c59-423a-a3b1-6c3d7c72c686');
            background-size: cover;
            background-position: center;
            opacity: 0.18;
            z-index: 0;
          }
        }
        .hero-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(10,10,10,0.3) 0%,
            rgba(10,10,10,0.5) 60%,
            rgba(10,10,10,1) 100%
          );
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
        }

        /* COMPARE GRID */
        .compare-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          border-radius: 20px;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .compare-grid {
            grid-template-columns: 1fr;
          }
        }

        /* HOW STEPS */
        .how-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        @media (max-width: 768px) {
          .how-steps {
            grid-template-columns: 1fr;
          }
        }

        /* STATS BAR */
        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 80px;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .stats-bar {
            gap: 40px;
          }
        }

        /* BENEFITS GRID */
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2px;
        }

        /* WHATSAPP BUTTON */
        .whatsapp-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: #25D366;
          color: #fff;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          text-decoration: none;
          z-index: 999;
          box-shadow: 0 4px 20px rgba(37,211,102,0.4);
        }
        @media (max-width: 768px) {
          .whatsapp-btn {
            bottom: 20px;
            right: 20px;
          }
        }

        /* FAQ */
        .faq-answer {
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        /* PULSE ANIMATION */
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .btn-pulse {
          animation: pulse 3s ease-in-out infinite;
          display: inline-block;
        }

        /* Hero text fade + slide up */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-kicker {
          animation: fadeSlideUp 0.5s ease forwards;
          animation-delay: 0.1s;
          opacity: 0;
        }
        .hero-h1 {
          animation: fadeSlideUp 0.5s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }
        .hero-sub {
          animation: fadeSlideUp 0.5s ease forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }
        .hero-cta {
          animation: fadeSlideUp 0.5s ease forwards;
          animation-delay: 0.7s;
          opacity: 0;
        }

        /* Chair rental slow zoom */
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.04); }
        }
        .chair-icon {
          animation: slowZoom 8s ease-in-out infinite alternate;
          display: inline-block;
        }

        /* Chair rental text slide in from left */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .chair-text {
          animation: slideInLeft 0.6s ease forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }

        /* Chair rental button underline hover */
        .chair-btn {
          position: relative;
          display: inline-block;
          text-decoration: none;
          color: #F5C518;
          font-weight: 800;
          font-size: 14px;
        }
        .chair-btn::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: #F5C518;
          transition: width 0.3s ease, left 0.3s ease;
        }
        .chair-btn:hover::after {
          width: 100%;
          left: 0;
        }

        /* Card hover — lift + glow */
        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          cursor: default;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(245, 197, 24, 0.08);
          border-color: #2a2a2a !important;
        }

        /* Pricing card hover */
        .pricing-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pricing-card:hover {
          transform: translateY(-6px) rotateX(1deg);
          box-shadow: 0 12px 40px rgba(245, 197, 24, 0.1);
        }

        /* Final CTA text fade + slide up */
        .cta-final-text {
          animation: fadeSlideUp 0.6s ease forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }

        /* Final CTA button aggressive pulse */
        @keyframes pulseFast {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .btn-pulse-fast {
          animation: pulseFast 2s ease-in-out infinite;
          display: inline-block;
        }

        /* Chair rental mobile fix */
        .chair-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .chair-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* Scroll-triggered base states */
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-left {
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal-left.visible {
          opacity: 1;
          transform: translateX(0);
        }

        /* Staggered delays */
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .delay-5 { transition-delay: 0.5s; }
        .delay-6 { transition-delay: 0.6s; }

        /* Section title underline animation */
        .section-title {
          position: relative;
          display: inline-block;
        }
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0;
          height: 3px;
          background: #F5C518;
          transition: width 0.6s ease;
        }
        .section-title.visible::after {
          width: 100%;
        }
      `}</style>

      {/* WHATSAPP FIXED BUTTON */}
      <a
        href="https://wa.me/34692736281"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        title="Habla con nosotros"
      >
        💬
      </a>

      <div style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        fontFamily: 'Nunito, sans-serif',
        color: '#fff'
      }}>

        {/* ── HERO ── */}
        <div className="hero-video-wrap">
          <video
            className="hero-video"
            src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0539007834.firebasestorage.app/o/videos%2F4177973-hd_1920_1080_30fps.mp4?alt=media&token=aeb725ff-2f17-44bc-9740-0b0e3d47509b"
            poster="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0539007834.firebasestorage.app/o/videos%2FScreenshot%202026-06-15%20053753.png?alt=media&token=de0e3317-4c59-423a-a3b1-6c3d7c72c686"
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hero-poster" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-kicker" style={{
              fontSize: '11px', fontWeight: 800,
              color: '#F5C518', letterSpacing: '0.2em',
              textTransform: 'uppercase', marginBottom: '28px'
            }}>
              {t('forShops.kicker')}
            </div>
            <h1 className="hero-h1" style={{
              fontSize: 'clamp(44px, 7vw, 88px)',
              fontWeight: 900,
              lineHeight: 1.0,
              margin: '0 0 28px',
              letterSpacing: '-2px'
            }}>
              {t('forShops.heroLine1')}<br />
              <span style={{ color: '#F5C518' }}>{t('forShops.heroLine2')}</span>
            </h1>
            <p className="hero-sub" style={{
              fontSize: '18px', color: '#888',
              lineHeight: 1.8, maxWidth: '520px',
              margin: '0 auto 48px'
            }}>
              {t('forShops.heroSub')}
            </p>
            <div className="btn-pulse hero-cta">
              <a href="/dashboard/barber" style={{
                background: '#F5C518',
                color: '#0a0a0a',
                padding: '18px 44px',
                borderRadius: '99px',
                fontSize: '17px',
                fontWeight: 900,
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                {t('forShops.heroCta')}
              </a>
            </div>
            <div style={{
              fontSize: '12px', color: '#444',
              marginTop: '16px'
            }}>
              {t('forShops.heroFootnote')}
            </div>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="fs-section" style={{
          background: '#0d0d0d',
          borderTop: '1px solid #141414',
          borderBottom: '1px solid #141414',
          paddingTop: '48px',
          paddingBottom: '48px'
        }}>
          <div className="stats-bar">
            {stats.map((s, i) => (
              <div key={s.label} className={`reveal delay-${i + 1}`} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '42px', fontWeight: 900,
                  color: '#F5C518', lineHeight: 1,
                  marginBottom: '8px'
                }}>
                  {s.number}
                </div>
                <div style={{
                  fontSize: '12px', color: '#444',
                  fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BEFORE / AFTER ── */}
        <div className="fs-section" style={{
          paddingTop: '120px',
          paddingBottom: '120px'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{
              fontSize: '11px', fontWeight: 800, color: '#555',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              marginBottom: '24px', textAlign: 'center'
            }}>
              {t('forShops.compareKicker')}
            </div>
            <h2 className="reveal" style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 900, textAlign: 'center',
              marginBottom: '64px', letterSpacing: '-1px',
              margin: '0 0 64px'
            }}>
              <span className="section-title">{t('forShops.compareTitle')}</span>
            </h2>
            <div className="compare-grid reveal delay-2">
              <div className="card-hover" style={{
                background: '#0d0d0d',
                padding: '48px'
              }}>
                <div style={{
                  fontSize: '13px', fontWeight: 800,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#333', marginBottom: '32px'
                }}>
                  {t('forShops.beforeTitle')}
                </div>
                {beforeItems.map(item => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'flex-start',
                    gap: '14px', marginBottom: '18px',
                    fontSize: '14px', color: '#444', lineHeight: 1.5
                  }}>
                    <span style={{
                      width: '6px', height: '6px',
                      borderRadius: '50%', background: '#2a2a2a',
                      flexShrink: 0, marginTop: '7px'
                    }} />
                    {item}
                  </div>
                ))}
              </div>
              <div className="card-hover" style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                padding: '48px'
              }}>
                <div style={{
                  fontSize: '13px', fontWeight: 800,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#F5C518', marginBottom: '32px'
                }}>
                  {t('forShops.afterTitle')}
                </div>
                {afterItems.map(item => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'flex-start',
                    gap: '14px', marginBottom: '18px',
                    fontSize: '14px', color: '#ccc', lineHeight: 1.5
                  }}>
                    <span style={{
                      color: '#F5C518', fontSize: '16px',
                      flexShrink: 0, marginTop: '1px'
                    }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CHAIR RENTAL ── */}
        <div className="fs-section" style={{
          background: '#0d0d0d',
          borderTop: '1px solid #141414',
          borderBottom: '1px solid #141414',
          paddingTop: '120px',
          paddingBottom: '120px'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="chair-grid">
              <div className="chair-text">
                <div style={{
                  fontSize: '11px', fontWeight: 800,
                  color: '#F5C518', letterSpacing: '0.2em',
                  textTransform: 'uppercase', marginBottom: '24px'
                }}>
                  {t('forShops.chairKicker')}
                </div>
                <h2 style={{
                  fontSize: 'clamp(32px, 3vw, 48px)',
                  fontWeight: 900, lineHeight: 1.1,
                  marginBottom: '24px', letterSpacing: '-1px'
                }}>
                  <span className="section-title">{t('forShops.chairLine1')}</span><br />
                  <span style={{ color: '#F5C518' }}>
                    {t('forShops.chairLine2')}
                  </span>
                </h2>
                <p style={{
                  fontSize: '16px', color: '#555',
                  lineHeight: 1.8, marginBottom: '32px'
                }}>
                  {t('forShops.chairSub')}
                </p>
                {chairBullets.map(item => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'center',
                    gap: '12px', marginBottom: '14px',
                    fontSize: '14px', color: '#888'
                  }}>
                    <span style={{ color: '#F5C518' }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <div style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                borderRadius: '20px',
                padding: '48px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '72px', marginBottom: '24px'
                }}>
                  <span className="chair-icon">✂️</span>
                </div>
                <div style={{
                  fontSize: '15px', fontWeight: 900,
                  color: '#fff', marginBottom: '12px'
                }}>
                  {t('forShops.chairCardTitle')}
                </div>
                <div style={{
                  fontSize: '13px', color: '#555',
                  lineHeight: 1.7, marginBottom: '24px'
                }}>
                  {t('forShops.chairCardDesc')}
                </div>
                <a href="/dashboard/barber" className="chair-btn">
                  {t('forShops.chairBadge')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <div className="fs-section" style={{
          paddingTop: '120px',
          paddingBottom: '120px'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{
              fontSize: '11px', fontWeight: 800, color: '#555',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              marginBottom: '24px', textAlign: 'center'
            }}>
              {t('forShops.howKicker')}
            </div>
            <h2 className="reveal" style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 900, textAlign: 'center',
              marginBottom: '80px', letterSpacing: '-1px'
            }}>
              <span className="section-title">{t('forShops.howTitle')}</span>
            </h2>
            <div className="how-steps">
              {howSteps.map((item, i) => (
                <div key={item.step} className={`card-hover reveal delay-${i + 1}`} style={{
                  padding: '48px 40px',
                  background: '#0d0d0d',
                  border: '1px solid #1a1a1a'
                }}>
                  <div style={{
                    fontSize: '72px', fontWeight: 900,
                    color: '#F5C518', lineHeight: 1,
                    marginBottom: '24px'
                  }}>
                    {item.step}
                  </div>
                  <div style={{
                    fontSize: '18px', fontWeight: 900,
                    color: '#fff', marginBottom: '12px'
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: '14px', color: '#555',
                    lineHeight: 1.8
                  }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              textAlign: 'center', marginTop: '48px',
              fontSize: '14px', color: '#333',
              fontWeight: 700
            }}>
              {t('forShops.howTagline')}
            </div>
          </div>
        </div>

        {/* ── PRICING ── */}
        <div className="fs-section" style={{
          background: '#0d0d0d',
          borderTop: '1px solid #141414',
          borderBottom: '1px solid #141414',
          paddingTop: '120px',
          paddingBottom: '120px'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              fontSize: '11px', fontWeight: 800, color: '#555',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              marginBottom: '24px'
            }}>
              {t('forShops.pricingKicker')}
            </div>
            <h2 className="reveal" style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 900, marginBottom: '24px',
              letterSpacing: '-1px'
            }}>
              <span className="section-title">{t('forShops.pricingLine1')}</span><br />
              <span style={{ color: '#F5C518' }}>{t('forShops.pricingLine2')}</span>
            </h2>
            <p style={{
              fontSize: '16px', color: '#555',
              lineHeight: 1.8, maxWidth: '560px',
              margin: '0 auto 64px'
            }}>
              {t('forShops.pricingSub')}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '48px'
            }}>
              {pricingCards.map((card, i) => (
                <div key={card.label} className={`pricing-card reveal delay-${i + 1}`} style={{
                  background: card.highlight ? '#F5C518' : '#111',
                  border: card.highlight ? 'none' : '1px solid #1e1e1e',
                  borderRadius: '16px',
                  padding: '36px 28px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '12px', fontWeight: 800,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: card.highlight ? '#0a0a0a' : '#555',
                    marginBottom: '16px'
                  }}>
                    {card.label}
                  </div>
                  <div style={{
                    fontSize: '48px', fontWeight: 900,
                    color: card.highlight ? '#0a0a0a' : '#fff',
                    marginBottom: '16px', lineHeight: 1
                  }}>
                    {card.price}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: card.highlight ? '#333' : '#555',
                    lineHeight: 1.6
                  }}>
                    {card.desc}
                  </div>
                </div>
              ))}
            </div>
            <div className="btn-pulse">
              <a href="/dashboard/barber" style={{
                background: '#F5C518',
                color: '#0a0a0a',
                padding: '18px 44px',
                borderRadius: '99px',
                fontSize: '17px',
                fontWeight: 900,
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                {t('forShops.pricingCta')}
              </a>
            </div>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="fs-section" style={{
          maxWidth: '760px',
          margin: '0 auto',
          paddingTop: '120px',
          paddingBottom: '120px'
        }}>
          <div style={{
            fontSize: '11px', fontWeight: 800, color: '#555',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: '24px', textAlign: 'center'
          }}>
            {t('forShops.faqKicker')}
          </div>
          <h2 className="reveal" style={{
            fontSize: 'clamp(28px, 3vw, 42px)',
            fontWeight: 900, textAlign: 'center',
            marginBottom: '64px', letterSpacing: '-1px'
          }}>
            <span className="section-title">{t('forShops.faqTitle')}</span>
          </h2>
          {faqItems.map((item, i) => (
            <div key={item.q} style={{
              borderBottom: '1px solid #141414'
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '24px 0',
                  textAlign: 'left',
                  gap: '16px'
                }}
              >
                <span style={{
                  fontSize: '15px', fontWeight: 900,
                  color: '#fff'
                }}>
                  {item.q}
                </span>
                <span style={{
                  color: '#F5C518', fontSize: '20px',
                  flexShrink: 0,
                  transform: openFaq === i
                    ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  display: 'inline-block'
                }}>
                  +
                </span>
              </button>
              {openFaq === i && (
                <div style={{
                  fontSize: '14px', color: '#555',
                  lineHeight: 1.8, paddingBottom: '24px'
                }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── FINAL CTA ── */}
        <div className="fs-section" style={{
          background: '#0a0a0a',
          borderTop: '1px solid #141414',
          paddingTop: '160px',
          paddingBottom: '160px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0,
            right: 0, bottom: 0,
            background: 'radial-gradient(ellipse 600px 400px at 50% 50%, rgba(245,197,24,0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div className="cta-final-text" style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(36px, 6vw, 76px)',
              fontWeight: 900, lineHeight: 1.0,
              letterSpacing: '-2px', marginBottom: '24px',
              maxWidth: '800px', margin: '0 auto 24px'
            }}>
              <span className="section-title">{t('forShops.ctaLine1')}</span><br />
              <span style={{ color: '#F5C518' }}>
                {t('forShops.ctaLine2')}
              </span>
            </h2>
            <p style={{
              fontSize: '16px', color: '#444',
              marginBottom: '48px'
            }}>
              {t('forShops.ctaSub')}
            </p>
            <div className="btn-pulse-fast">
              <a href="/dashboard/barber" style={{
                background: '#F5C518',
                color: '#0a0a0a',
                padding: '20px 52px',
                borderRadius: '99px',
                fontSize: '18px',
                fontWeight: 900,
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                {t('forShops.ctaBtn')}
              </a>
            </div>
            <div style={{
              fontSize: '12px', color: '#333',
              marginTop: '20px'
            }}>
              {t('forShops.ctaFootnote')}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
