'use client'

/**
 * AnalysisCardsOrbit — small labelled chips that spawn around the orb and
 * travel inward to its center, fading out as they arrive (scene s6). Purely
 * visual: the ring-pulse-on-arrival is fired by the sequencer via timeline
 * data (one ring event per arrival), so this component owns no orb state.
 *
 * Each chip i departs at `i * interval` and reaches the center `travel` ms
 * later. Chips are absolutely positioned relative to the full-viewport stage,
 * converging on (50%, 50%) — the orb's center.
 */
type AnalysisCardsOrbitProps = {
  chips: string[]
  /** Milliseconds between consecutive chip departures. */
  interval: number
  /** Milliseconds each chip takes to travel from the ring to the center. */
  travel: number
  /** Scene-relative elapsed time in ms. */
  elapsed: number
}

const easeInCubic = (p: number) => p * p * p

export function AnalysisCardsOrbit({
  chips,
  interval,
  travel,
  elapsed,
}: AnalysisCardsOrbitProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {chips.map((chip, i) => {
        const p = (elapsed - i * interval) / travel
        if (p < 0 || p >= 1) return null

        // Depart from an evenly-spaced point on a ring, spiral gently inward.
        const angle = (i / chips.length) * Math.PI * 2 + p * 0.6
        const radius = (1 - easeInCubic(p)) * 40 // % of viewport min-axis
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const opacity =
          p < 0.12 ? p / 0.12 : p > 0.82 ? Math.max(0, (1 - p) / 0.18) : 1
        const scale = 0.7 + (1 - easeInCubic(p)) * 0.3

        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-gold/30 bg-card/80 px-3 py-1.5 text-[11px] font-medium tracking-wide text-foreground/90 backdrop-blur-sm sm:text-xs"
            style={{
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
