'use client'

/**
 * PathAnalysis — Path A (UX spec §7.1 + §7.1a). Reached when the selected
 * category's titizaEntryMode is 'analysis' (Frozen Decision #1 — the branch
 * happens in the parent on the field, never on the category name).
 *
 * Choreography: acknowledgment → silence → invitation → analysis card + CTA →
 * (on CTA) §7.1a exit beat → no-op placeholder (Frozen Decision #6: the real
 * analysis destination is separately-tracked work and does not exist yet).
 */

import { useEffect, useRef, useState, type MutableRefObject } from 'react'
import type { TitizaCoreApi } from './titiza-core'

type Beat = 'ack' | 'invite1' | 'invite2' | 'card' | 'exiting'

interface PathAnalysisProps {
  /** Localized category label, e.g. "Hair". */
  categoryName: string
  reducedMotion: boolean
  apiRef: MutableRefObject<TitizaCoreApi | null>
}

export function PathAnalysis({
  categoryName,
  reducedMotion,
  apiRef,
}: PathAnalysisProps) {
  const [beat, setBeat] = useState<Beat>('ack')
  const [exitLineShown, setExitLineShown] = useState(false)
  const timersRef = useRef<number[]>([])
  // The grid unmounts when this path opens; move focus here so keyboard/AT
  // users aren't dropped to <body> (§11).
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timers = timersRef.current
    const d = (ms: number) => (reducedMotion ? 0 : ms)

    rootRef.current?.focus()
    apiRef.current?.reactEyeContact() // soft brighten as Titiza acknowledges

    // acknowledgment holds through a beat of silence, then the two invitation
    // beats (~600ms apart, §7.1 step 3), then the analysis card resolves in.
    timers.push(window.setTimeout(() => setBeat('invite1'), d(2200)))
    timers.push(window.setTimeout(() => setBeat('invite2'), d(2800)))
    timers.push(window.setTimeout(() => setBeat('card'), d(4200)))

    return () => timers.forEach((id) => clearTimeout(id))
  }, [apiRef, reducedMotion])

  const handleStart = () => {
    // §7.1a exit beat, then the no-op placeholder — NOT a real/fake route.
    // Frozen Decision #6: the flag keeps real users out of this screen, so an
    // acknowledged-but-inert CTA is acceptable until the destination is built.
    setBeat('exiting')
    setExitLineShown(true)
    apiRef.current?.reactEyeContact()
    apiRef.current?.reactPulse()
    timersRef.current.push(
      window.setTimeout(
        () => {
          // eslint-disable-next-line no-console
          console.log(
            `[Titiza Phase 2] Path A CTA "Start Your ${categoryName} Analysis" — no-op placeholder; destination tracked separately.`,
          )
        },
        reducedMotion ? 0 : 1200,
      ),
    )
  }

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      aria-live="polite"
      className="mt-8 flex w-full max-w-md flex-col items-center text-center focus:outline-none"
    >
      {beat !== 'exiting' && (
        <div className="animate-titiza-fade-in">
          <p className="font-serif text-4xl font-light text-foreground">
            {categoryName}.
          </p>
          <p className="mt-2 font-serif text-2xl font-light text-muted-foreground">
            A beautiful choice.
          </p>
        </div>
      )}

      {/* Invitation beats (UX spec §7.1, step 3) — two separate beats ~600ms
          apart, each holding once revealed. */}
      {(beat === 'invite1' || beat === 'invite2' || beat === 'card') && (
        <p className="mt-6 animate-titiza-fade-in text-base font-light leading-relaxed text-muted-foreground">
          The best recommendations start with understanding your{' '}
          {categoryName.toLowerCase()}.
        </p>
      )}
      {(beat === 'invite2' || beat === 'card') && (
        <p className="mt-3 animate-titiza-fade-in text-base font-light leading-relaxed text-muted-foreground">
          Let&apos;s create your Beauty Profile.
        </p>
      )}

      {beat === 'card' && (
        <div className="titiza-glass mt-8 w-full animate-titiza-fade-up rounded-2xl px-6 py-8">
          <h3 className="font-serif text-2xl font-light text-foreground">
            Let&apos;s create your Beauty Profile
          </h3>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Titiza {categoryName} Analysis
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-7 rounded-full border border-gold/40 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft/90 transition-colors duration-300 hover:border-gold-soft hover:text-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Start Your {categoryName} Analysis
          </button>
        </div>
      )}

      {beat === 'exiting' && exitLineShown && (
        <p className="animate-titiza-fade-in font-serif text-2xl font-light text-foreground">
          I&apos;ll help you find the right specialist,
        </p>
      )}
    </div>
  )
}
