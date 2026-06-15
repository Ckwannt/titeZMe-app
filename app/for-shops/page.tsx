'use client'

import { useEffect, useState } from 'react'

export default function ForShopsPage() {
  useEffect(() => {
    document.title = 'Para Barberías — titeZMe'
  }, [])

  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
            <div style={{
              fontSize: '11px', fontWeight: 800,
              color: '#F5C518', letterSpacing: '0.2em',
              textTransform: 'uppercase', marginBottom: '28px'
            }}>
              Para barberías — Nacido en Madrid
            </div>
            <h1 style={{
              fontSize: 'clamp(44px, 7vw, 88px)',
              fontWeight: 900,
              lineHeight: 1.0,
              margin: '0 0 28px',
              letterSpacing: '-2px'
            }}>
              Tu barbería está<br />
              <span style={{ color: '#F5C518' }}>perdiendo dinero.</span>
            </h1>
            <p style={{
              fontSize: '18px', color: '#888',
              lineHeight: 1.8, maxWidth: '520px',
              margin: '0 auto 48px'
            }}>
              No-shows. Sillas vacías. WhatsApp a las 11 de la noche.
              Nosotros tapamos cada agujero.
            </p>
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
                Empieza gratis — 6 días →
              </a>
            </div>
            <div style={{
              fontSize: '12px', color: '#444',
              marginTop: '16px'
            }}>
              Sin tarjeta de crédito. Sin compromisos.
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
            {[
              { number: '30s', label: 'Para reservar una cita' },
              { number: '0€', label: 'Cuota mensual' },
              { number: '24/7', label: 'Tu perfil visible' },
              { number: '∞', label: 'Barberos en tu equipo' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
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
              La realidad
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 900, textAlign: 'center',
              marginBottom: '64px', letterSpacing: '-1px',
              margin: '0 0 64px'
            }}>
              Antes y después de titeZMe
            </h2>
            <div className="compare-grid">
              <div style={{
                background: '#0d0d0d',
                padding: '48px'
              }}>
                <div style={{
                  fontSize: '13px', fontWeight: 800,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#333', marginBottom: '32px'
                }}>
                  Sin titeZMe
                </div>
                {[
                  'Clientes llamando mientras estás cortando',
                  'WhatsApp a las 11 de la noche para pedir cita',
                  'No-shows que te hacen perder €80/mes',
                  'Cada barbero gestiona sus propias reservas',
                  'Sin presencia online — invisible para nuevos clientes',
                  'No sabes cuánto gana cada barbero',
                ].map(item => (
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
              <div style={{
                background: '#111',
                border: '1px solid #1e1e1e',
                padding: '48px'
              }}>
                <div style={{
                  fontSize: '13px', fontWeight: 800,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#F5C518', marginBottom: '32px'
                }}>
                  Con titeZMe
                </div>
                {[
                  'Clientes reservan solos — tú cortas tranquilo',
                  'Reservas online 24/7, incluso mientras duermes',
                  'Recordatorios automáticos — no-shows reducidos un 80%',
                  'Todo el equipo en un solo dashboard',
                  'Perfil profesional visible en Madrid y más allá',
                  'Ingresos por barbero, servicio y hora del día',
                ].map(item => (
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
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '80px',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  fontSize: '11px', fontWeight: 800,
                  color: '#F5C518', letterSpacing: '0.2em',
                  textTransform: 'uppercase', marginBottom: '24px'
                }}>
                  Disponible agosto 2026
                </div>
                <h2 style={{
                  fontSize: 'clamp(32px, 3vw, 48px)',
                  fontWeight: 900, lineHeight: 1.1,
                  marginBottom: '24px', letterSpacing: '-1px'
                }}>
                  Silla vacía.<br />
                  <span style={{ color: '#F5C518' }}>
                    Nosotros la llenamos.
                  </span>
                </h2>
                <p style={{
                  fontSize: '16px', color: '#555',
                  lineHeight: 1.8, marginBottom: '32px'
                }}>
                  Barberos independientes alquilan tu silla.
                  Nosotros les enviamos clientes.
                  Tu silla nunca está vacía.
                </p>
                {[
                  'Cero esfuerzo de tu parte',
                  'Nosotros gestionamos reservas y comunicación',
                  'Tú recibes tu parte de cada corte',
                  'Tu silla genera dinero incluso cuando descansas',
                ].map(item => (
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
                  ✂️
                </div>
                <div style={{
                  fontSize: '15px', fontWeight: 900,
                  color: '#fff', marginBottom: '12px'
                }}>
                  Alquiler de sillas
                </div>
                <div style={{
                  fontSize: '13px', color: '#555',
                  lineHeight: 1.7, marginBottom: '24px'
                }}>
                  Conectamos barberos independientes
                  con barberías que tienen sillas libres.
                  Todo gestionado desde titeZMe.
                </div>
                <div style={{
                  display: 'inline-block',
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '99px',
                  padding: '10px 24px',
                  fontSize: '12px',
                  color: '#F5C518',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase'
                }}>
                  Próximamente — Agosto 2026
                </div>
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
              Cómo funciona
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 900, textAlign: 'center',
              marginBottom: '80px', letterSpacing: '-1px'
            }}>
              Tu barbería online en minutos
            </h2>
            <div className="how-steps">
              {[
                {
                  step: '01',
                  title: 'Crea tu perfil',
                  desc: 'Regístrate como barbero y crea tu barbería desde el dashboard. Nombre, dirección, servicios y fotos.'
                },
                {
                  step: '02',
                  title: 'Añade tu equipo',
                  desc: 'Invita a tus barberos con su código titeZMe. Cada uno mantiene su perfil propio.'
                },
                {
                  step: '03',
                  title: 'Llena tus sillas',
                  desc: 'Los clientes te encuentran en titeZMe y reservan directamente. Todo en tiempo real.'
                }
              ].map(item => (
                <div key={item.step} style={{
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
              Sin código. Sin reuniones. Sin complicaciones.
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
              Precio
            </div>
            <h2 style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 900, marginBottom: '24px',
              letterSpacing: '-1px'
            }}>
              Primeras 100 barberías.<br />
              <span style={{ color: '#F5C518' }}>Precio VIP. Sin trampa.</span>
            </h2>
            <p style={{
              fontSize: '16px', color: '#555',
              lineHeight: 1.8, maxWidth: '560px',
              margin: '0 auto 64px'
            }}>
              6 días gratis. Sin tarjeta de crédito.
              El precio exacto aparece en tu dashboard
              después de crear tu barbería.
              No ocultamos números — solo queremos
              que lo veas tú mismo.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '48px'
            }}>
              {[
                {
                  label: '6 días',
                  price: '0€',
                  desc: 'Prueba completa. Sin tarjeta.',
                  highlight: false
                },
                {
                  label: 'Primeras 100 barberías',
                  price: 'VIP',
                  desc: 'Precio especial por 12 meses. Ver en tu dashboard.',
                  highlight: true
                },
                {
                  label: 'Después de 100',
                  price: 'STD',
                  desc: 'Precio estándar. Ver en tu dashboard.',
                  highlight: false
                }
              ].map(card => (
                <div key={card.label} style={{
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
                Crear mi barbería gratis →
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
            FAQ
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 3vw, 42px)',
            fontWeight: 900, textAlign: 'center',
            marginBottom: '64px', letterSpacing: '-1px'
          }}>
            Preguntas frecuentes
          </h2>
          {[
            {
              q: '¿Qué pasa si no consigo más reservas?',
              a: '6 días gratis. Si no ves resultados, no pagas. ¿Justo?'
            },
            {
              q: '¿Puedo cancelar cuando quiera?',
              a: 'Sí. Un clic. Sin preguntas. Tus datos te esperan 90 días.'
            },
            {
              q: '¿Mis barberos necesitan su propia cuenta?',
              a: 'Sí. Cada barbero tiene su propio perfil en titeZMe. Siguen siendo independientes y tú ves todo desde tu dashboard.'
            },
            {
              q: '¿Cuántos barberos puedo añadir?',
              a: 'Sin límite. Añade a todo tu equipo. Cada uno gestiona su agenda y tú ves todas las reservas en un lugar.'
            },
            {
              q: '¿Hay algún coste de configuración?',
              a: 'No. Cero. Nada. Gratis para publicar.'
            }
          ].map((item, i) => (
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
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(36px, 6vw, 76px)',
              fontWeight: 900, lineHeight: 1.0,
              letterSpacing: '-2px', marginBottom: '24px',
              maxWidth: '800px', margin: '0 auto 24px'
            }}>
              Cada día que esperas,<br />
              <span style={{ color: '#F5C518' }}>
                alguien llena sus sillas.
              </span>
            </h2>
            <p style={{
              fontSize: '16px', color: '#444',
              marginBottom: '48px'
            }}>
              Empieza tu prueba de 6 días.
              Ve la diferencia antes que ellos.
            </p>
            <div className="btn-pulse">
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
                Crear mi barbería gratis →
              </a>
            </div>
            <div style={{
              fontSize: '12px', color: '#333',
              marginTop: '20px'
            }}>
              Sin tarjeta de crédito · Sin cuotas mensuales · Nacido en Madrid
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
