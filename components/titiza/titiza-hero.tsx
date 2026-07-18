'use client'

import { useEffect, useRef, useState } from 'react'
import { TitizaCore, type TitizaCoreApi } from './titiza-core'

type Mode = 'genesis' | 'dashboard'

interface TitizaHeroProps {
  userName?: string
  /** 'genesis' plays the first-meeting birth + greeting; 'dashboard' is resting. */
  mode?: Mode
  /** True only when the user has met Titiza before (repeat visit). */
  isReturning?: boolean
  /** Called by the "Let's Begin" CTA (genesis path only). */
  onBegin?: () => void
}

export function TitizaHero({
  userName = 'there',
  mode = 'dashboard',
  isReturning = false,
  onBegin,
}: TitizaHeroProps) {
  const isGenesis = mode === 'genesis'
  const apiRef = useRef<TitizaCoreApi | null>(null)
  const genesisTimersRef = useRef<number[]>([])

  // Greeting reveal gates. On the dashboard path everything is present at once
  // (no delays). On the genesis path they open on the choreography below.
  // Elements are only MOUNTED once their gate is true, so screen readers get
  // nothing announced until the greeting text actually exists.
  const [line1Shown, setLine1Shown] = useState(!isGenesis)
  const [line2Shown, setLine2Shown] = useState(!isGenesis && !isReturning)
  const [ctaShown, setCtaShown] = useState(false)

  // Genesis greeting choreography, timed against the orb's onGenesisComplete
  // (fires ~4.5s in, or ~1.5s under reduced motion) rather than a standalone
  // hardcoded timer. Offsets reproduce the spec's 5.5s / 7.2s / 8.0s anchors
  // relative to a 4.5s completion.
  const handleGenesisComplete = () => {
    if (!isGenesis) return
    const timers = genesisTimersRef.current
    timers.push(
      window.setTimeout(() => {
        setLine1Shown(true) // "Hi, {userName}."  (~5.5s)
        apiRef.current?.reactEyeContact() // orb brightens ~10-15%
      }, 1000),
    )
    timers.push(
      window.setTimeout(() => {
        setLine2Shown(true) // "I'm Titiza."  (~7.2s)
        apiRef.current?.reactPulse() // quick heartbeat pulse
      }, 2700),
    )
    timers.push(
      window.setTimeout(() => setCtaShown(true), 3500), // CTA (~8.0s)
    )
  }

  // Clear any pending greeting timers on unmount.
  useEffect(() => {
    const timers = genesisTimersRef.current
    return () => timers.forEach((id) => clearTimeout(id))
  }, [])

  return (
    <section className="flex flex-col items-center text-center">
      {/* Header / branding — belongs to the resolved dashboard, not the birth.
          Hidden during genesis so the orb's birth has the stage to itself. */}
      {!isGenesis && (
        <div className="animate-titiza-fade-in">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
            titeZMe
          </p>
          <h1 className="font-serif text-6xl font-light tracking-tight text-foreground sm:text-7xl md:text-8xl">
            <span className="titiza-shimmer-text">Titiza</span>
          </h1>
          <p className="mt-4 text-balance text-base font-light tracking-wide text-muted-foreground sm:text-lg">
            Beauty Intelligence, built around you.
          </p>
        </div>
      )}

      {/* The presence — mounted in both modes. On genesis it plays the birth;
          on dashboard it mounts already in its resting breathing state. */}
      <div className="mt-6 w-full animate-titiza-float">
        <TitizaCore
          genesis={isGenesis}
          onGenesisComplete={handleGenesisComplete}
          apiRef={apiRef}
        />
      </div>

      {/* Below the assistant — Titiza speaks. */}
      <div className="-mt-4 flex max-w-xl flex-col items-center">
        {line1Shown && (
          <p className="animate-titiza-fade-in font-serif text-3xl font-light text-foreground sm:text-4xl">
            {isReturning ? `Welcome back, ${userName}.` : `Hi, ${userName}.`}
          </p>
        )}
        {!isReturning && line2Shown && (
          <p className="mt-2 animate-titiza-fade-in font-serif text-3xl font-light text-foreground sm:text-4xl">
            {"I'm Titiza."}
          </p>
        )}

        {/* Let's Begin — genesis path only. Hairline pill, gold token, no fill,
            no gradient, no shadow, no icon. Real <button> for accessibility. */}
        {isGenesis && ctaShown && (
          <button
            type="button"
            onClick={onBegin}
            className="animate-titiza-fade-in mt-10 rounded-full border border-gold/40 px-8 py-3 text-sm font-medium uppercase tracking-[0.25em] text-gold-soft/90 transition-colors duration-300 hover:border-gold-soft hover:text-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ animationDuration: '0.5s' }}
          >
            Let&apos;s Begin
          </button>
        )}

        {/* Dashboard content that used to live in the greeting — Titiza's line
            about growing, plus the "learning from" cards. These belong to the
            dashboard view (after Let's Begin / on repeat visits), not the
            first-meeting greeting. */}
        {!isGenesis && (
          <>
            <p
              className="mt-5 max-w-md animate-titiza-fade-up text-pretty text-base font-light leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            >
              I grow with every professional beauty analysis and every
              conversation we have.
            </p>

            <div
              className="mt-10 w-full animate-titiza-fade-up"
              style={{ animationDelay: '0.35s', animationFillMode: 'both' }}
            >
              <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Learning from
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  'Professional Beauty Analyses',
                  'Your Beauty Profile',
                  'Our Conversations',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gold/15 bg-card/60 px-4 py-4 text-center backdrop-blur-sm transition-colors hover:border-gold/35"
                  >
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]"
                    />
                    <span className="text-sm font-light text-foreground/90">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
                Every recommendation becomes more personal over time.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
