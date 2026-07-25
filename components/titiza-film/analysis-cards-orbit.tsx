'use client'

/**
 * AnalysisCardsOrbit — labelled chips absorbed one at a time into the orb (s6).
 * Each chip runs its own sequence, offset `startStagger` ms from the previous:
 *
 *   appear (fade in)  →  brief pause  →  travel toward the orb while shrinking
 *   →  vanish only at the instant it touches the orb.
 *
 * Purely visual: the pulse / brightness / new ring on each absorption is fired
 * by the sequencer (one ring event per arrival), so this component owns no orb
 * state. Because the orb is anchored near the top of the frame by this point,
 * chips converge on (50%, `centerYVh`vh) — the orb's actual center — not the
 * geometric middle of the viewport.
 */
type AnalysisCardsOrbitProps = {
  chips: string[]
  /** Milliseconds between consecutive chips STARTING their sequence. */
  startStagger: number
  /** Fade-in duration for each chip. */
  appearDuration: number
  /** Still pause after a chip appears, before it begins travelling. */
  pause: number
  /** Travel duration from the outer ring to the orb center. */
  travelDuration: number
  /** Vertical center the chips converge on, in vh (matches the anchored orb). */
  centerYVh: number
  /** Scene-relative elapsed time in ms. */
  elapsed: number
}

const easeInCubic = (p: number) => p * p * p
// Golden-angle spread so successive chips depart from well-separated directions.
const GOLDEN = Math.PI * (3 - Math.sqrt(5))
const R_OUT = 34 // outer ring radius, in vmin

export function AnalysisCardsOrbit({
  chips,
  startStagger,
  appearDuration,
  pause,
  travelDuration,
  centerYVh,
  elapsed,
}: AnalysisCardsOrbitProps) {
  const total = appearDuration + pause + travelDuration

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {chips.map((chip, i) => {
        const t = elapsed - i * startStagger
        if (t < 0 || t > total) return null

        // travelP is 0 through the appear + pause phases, then eases 0→1.
        const travelP = Math.max(
          0,
          Math.min(1, (t - appearDuration - pause) / travelDuration),
        )
        const radius = R_OUT * (1 - easeInCubic(travelP))
        const angle = i * GOLDEN + travelP * 0.5
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const scale = 0.6 + (1 - easeInCubic(travelP)) * 0.4

        // Hold full opacity until the very moment of contact, then vanish.
        const opacity =
          t < appearDuration
            ? t / appearDuration
            : travelP > 0.88
              ? Math.max(0, (1 - travelP) / 0.12)
              : 1

        return (
          <div
            key={i}
            className="absolute left-1/2 whitespace-nowrap rounded-full border border-gold/30 bg-card/80 px-3 py-1.5 text-[11px] font-medium tracking-wide text-foreground/90 backdrop-blur-sm sm:text-xs"
            style={{
              top: `${centerYVh}vh`,
              transform: `translate(-50%, -50%) translate(${x}vmin, ${y}vmin) scale(${scale})`,
              opacity,
            }}
          >
            {chip}
          </div>
        )
      })}
    </div>
  )
}
