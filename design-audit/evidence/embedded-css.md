# Full authored CSS / embedded styles

## app/globals.css

```css
@import "tailwindcss";

@theme {
  --color-brand-bg: #0A0A0A;
  --color-brand-surface: #111111;
  --color-brand-surface2: #181818;
  --color-brand-border: #1E1E1E;
  --color-brand-border2: #2A2A2A;
  --color-brand-yellow: #F5C518;
  --color-brand-orange: #E8491D;
  --color-brand-green: #22C55E;
  --color-brand-red: #EF4444;
  --color-brand-text-primary: #FFFFFF;
  --color-brand-text-secondary: #888888;
  --color-brand-text-muted: #444444;

  --animate-fadeUp: fadeUp 0.4s ease both;
  --animate-fadeIn: fadeIn 0.4s ease both;
  --animate-pulse: pulse 0.6s ease;
  --animate-marquee: marquee 20s linear infinite;

  /* ---- Titiza page design tokens (scoped in use to /dashboard/client/titiza) ---- */
  --color-background: oklch(0.16 0.008 60);
  --color-foreground: oklch(0.96 0.006 80);
  --color-card: oklch(0.21 0.01 65 / 55%);
  --color-card-foreground: oklch(0.96 0.006 80);
  --color-secondary: oklch(0.26 0.01 65);
  --color-secondary-foreground: oklch(0.96 0.006 80);
  --color-muted-foreground: oklch(0.72 0.02 78);
  --color-border: oklch(0.85 0.09 85 / 12%);
  --color-primary: oklch(0.82 0.13 85);
  --color-primary-foreground: oklch(0.18 0.02 70);
  --color-gold: oklch(0.82 0.13 85);
  --color-gold-soft: oklch(0.88 0.09 88);
  --color-gold-muted: oklch(0.72 0.08 82);

  /* Cormorant Garamond is loaded only on the Titiza route via next/font
     (--font-titiza-serif); elsewhere this degrades to a system serif. */
  --font-serif: var(--font-titiza-serif), ui-serif, Georgia, "Times New Roman", serif;
}

/* Raw custom props for direct var() references inside Titiza CSS below */
:root {
  --gold: oklch(0.82 0.13 85);
  --gold-soft: oklch(0.88 0.09 88);
  --gold-muted: oklch(0.72 0.08 82);
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

body {
  background-color: var(--color-brand-bg);
  color: var(--color-brand-text-primary);
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-brand-border2); border-radius: 99px; }

/* Prevent iOS Safari auto-zoom on input focus (triggered below 16px font-size) */
input,
textarea,
select {
  font-size: 16px !important;
}

/* Mobile-only / desktop-only utility classes used by TopNav */
@media (min-width: 768px) {
  .show-mobile-only {
    display: none !important;
  }
}
@media (max-width: 767px) {
  .hidden-mobile {
    display: none !important;
  }
}

/* ============================================================================
   Titiza page — ambient / breathing animations + glass utilities
   Used only by /dashboard/client/titiza and its components.
   ========================================================================== */
@keyframes titiza-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-14px); }
}

@keyframes titiza-breathe {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.06); }
}

@keyframes titiza-drift {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  33% { transform: translate3d(3%, -4%, 0) scale(1.08); }
  66% { transform: translate3d(-3%, 3%, 0) scale(0.96); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
}

@keyframes titiza-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes titiza-fade-up {
  0% { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Opacity-only reveal — used by the genesis greeting, the "Let's Begin" CTA
   and the genesis→dashboard cross-fade. No slide (spec: opacity only). */
@keyframes titiza-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.animate-titiza-float {
  animation: titiza-float 7s ease-in-out infinite;
}
.animate-titiza-breathe {
  animation: titiza-breathe 6s ease-in-out infinite;
}
.animate-titiza-drift {
  animation: titiza-drift 22s ease-in-out infinite;
}
.animate-titiza-fade-up {
  animation: titiza-fade-up 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.animate-titiza-fade-in {
  animation: titiza-fade-in 0.6s ease-out both;
}

.titiza-shimmer-text {
  background: linear-gradient(
    100deg,
    var(--gold-muted) 0%,
    var(--gold-soft) 25%,
    oklch(0.98 0.02 90) 50%,
    var(--gold-soft) 75%,
    var(--gold-muted) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: titiza-shimmer 8s linear infinite;
}

.titiza-glass {
  background: linear-gradient(
    160deg,
    oklch(0.28 0.012 70 / 45%) 0%,
    oklch(0.19 0.01 65 / 35%) 100%
  );
  backdrop-filter: blur(20px) saturate(120%);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  border: 1px solid oklch(0.85 0.09 85 / 12%);
}

.titiza-glass-hover {
  transition:
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.5s ease,
    box-shadow 0.5s ease;
}
.titiza-glass-hover:hover {
  transform: translateY(-6px);
  border-color: oklch(0.85 0.09 85 / 28%);
  box-shadow: 0 30px 80px -40px oklch(0.82 0.13 85 / 35%);
}

@media (prefers-reduced-motion: reduce) {
  .animate-titiza-float,
  .animate-titiza-breathe,
  .animate-titiza-drift,
  .animate-titiza-fade-up,
  .titiza-shimmer-text {
    animation: none;
  }
}

```

## app/admin/(protected)/users/page.tsx:42

```tsx
<style>{`
        @keyframes tzmPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .tzm-live-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #22C55E;
          box-shadow: 0 0 8px #22C55E;
          animation: tzmPulse 1.6s ease-in-out infinite;
        }
        .tzm-total-number {
          font-size: 48px;
        }
        @media (min-width: 768px) {
          .tzm-total-number {
            font-size: 80px;
          }
        }
      `}</style>
```

## app/cities/page.tsx:101

```tsx
<style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.5 } }`}</style>
```

## app/for-shops/page.tsx:87

```tsx
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

        /* No commission cards */
        .commission-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .commission-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Commission highlight box */
        .commission-box {
          background: #0d0d0d;
          border: 1px solid #F5C518;
          border-radius: 16px;
          padding: 28px 32px;
          text-align: center;
          margin-top: 40px;
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          line-height: 1.7;
        }

        /* Recruit grid */
        .recruit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .recruit-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
```

## components/AdminGuard.tsx:125

```tsx
<style>{`@keyframes ag-spin { to { transform: rotate(360deg); } }`}</style>
```

## components/RouteGuard.tsx:61

```tsx
<style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
```

## components/SmartTimePicker.tsx:250

```tsx
<style>{`@keyframes stp-spin { to { transform: rotate(360deg); } }`}</style>
```

## components/titiza-film/film-sequencer.tsx:587

```tsx
<style>{`
        @keyframes filmFadeUp8 { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes filmFadeUp6 { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes filmInputIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes filmBubbleIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes filmChipIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes filmCardIn { from { opacity: 0; transform: scale(0.97); box-shadow: 0 0 0 rgba(0,0,0,0); } to { opacity: 1; transform: scale(1); box-shadow: 0 24px 60px -24px rgba(0,0,0,0.55); } }
      `}</style>
```

## components/TopNav.tsx:62

```tsx
<style>{`
        @keyframes langDropIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
```
