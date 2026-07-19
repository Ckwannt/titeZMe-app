'use client'

/**
 * TitizaDecisionFlow — the Phase 2 selection surface shown (behind the feature
 * flag) after "Let's Begin" / on a returning visit. This is what replaces the
 * direct jump to the Phase 1 dashboard block for flagged users only.
 *
 * Built up across the six Phase 2 checkpoints. Checkpoint 1 establishes:
 *   - the orb repositioned to a fixed upper anchor (CSS/wrapper only —
 *     Frozen Decision #2, no titiza-core-scene internals touched);
 *   - the first message + seed line greeting beats (UX spec §4).
 *
 * Category tiles, the thinking moment, and Path A/B live in later checkpoints.
 */

import { useEffect, useRef, useState } from 'react'
import { TitizaCore, type TitizaCoreApi } from './titiza-core'

interface TitizaDecisionFlowProps {
  /** First name for future personalized beats; unused copy in CP1. */
  userName?: string
}

export function TitizaDecisionFlow({ userName = 'there' }: TitizaDecisionFlowProps) {
  void userName // reserved for later checkpoints
  const apiRef = useRef<TitizaCoreApi | null>(null)
  const timersRef = useRef<number[]>([])

  // Reposition the orb from a centered-ish spot up to the fixed upper anchor.
  // Pure CSS transform on the wrapper (Frozen Decision #2). Reduced motion
  // snaps straight to the anchor (no travel).
  const [anchored, setAnchored] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // §4 greeting beats.
  const [line1Shown, setLine1Shown] = useState(false)
  const [seedShown, setSeedShown] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    setReducedMotion(prefersReduced)
    const timers = timersRef.current

    // Trigger the reposition on the next frame so the transition actually runs.
    const raf = requestAnimationFrame(() => setAnchored(true))

    // First message at 1.2s; seed line ~300ms after (§4). Reduced motion shows
    // both immediately.
    timers.push(
      window.setTimeout(
        () => {
          setLine1Shown(true)
          apiRef.current?.reactEyeContact() // gentle orb brighten on the ask
        },
        prefersReduced ? 0 : 1200,
      ),
    )
    timers.push(
      window.setTimeout(() => setSeedShown(true), prefersReduced ? 0 : 1500),
    )

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach((id) => clearTimeout(id))
    }
  }, [])

  return (
    <div className="flex flex-col items-center text-center animate-titiza-fade-in">
      {/* Orb at the fixed upper anchor (~20-25% from top). Smaller than the
          genesis stage so the decision content has room below it. */}
      <div
        className="w-full max-w-[280px] sm:max-w-[320px]"
        style={{
          transform:
            reducedMotion || anchored ? 'translateY(0)' : 'translateY(18vh)',
          transition: reducedMotion
            ? 'none'
            : 'transform 700ms cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      >
        <TitizaCore genesis={false} apiRef={apiRef} />
      </div>

      {/* Titiza speaks. */}
      <div className="-mt-2 flex max-w-xl flex-col items-center">
        {line1Shown && (
          <h2 className="animate-titiza-fade-in font-serif text-3xl font-light text-foreground sm:text-4xl">
            What would you like us to work on today?
          </h2>
        )}
        {seedShown && (
          <div className="mt-3 animate-titiza-fade-in">
            <p className="text-sm font-light leading-relaxed text-muted-foreground opacity-70">
              Your Beauty Profile becomes more personal over time.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
