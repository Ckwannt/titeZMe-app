'use client'

/**
 * BeforeAfterSwap — neutral placeholder frames used for the "today's hair"
 * upload (scene s7, mode 'single') and the recommendation reveal (scene s8,
 * mode 'swap', where an old-style frame cross-fades into a new-style frame).
 * No real imagery — deliberately abstract placeholder panels.
 */
type BeforeAfterSwapProps = {
  mode: 'single' | 'swap'
  /** Scene-relative elapsed time in ms. */
  elapsed: number
  /** For 'swap': scene-relative offset at which the cross-fade begins. */
  swapAt?: number
  /** Cross-fade duration in ms (mode 'swap'). */
  swapDuration?: number
}

function Frame({
  tone,
  opacity,
}: {
  tone: 'before' | 'after'
  opacity: number
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center rounded-2xl border border-border bg-card/70 backdrop-blur-sm"
      style={{ opacity }}
    >
      <div
        aria-hidden="true"
        className={`size-16 rounded-full ${
          tone === 'before' ? 'bg-gold-muted/20' : 'bg-gold/25'
        }`}
      />
    </div>
  )
}

export function BeforeAfterSwap({
  mode,
  elapsed,
  swapAt = 0,
  swapDuration = 1200,
}: BeforeAfterSwapProps) {
  const p =
    mode === 'swap'
      ? Math.min(1, Math.max(0, (elapsed - swapAt) / swapDuration))
      : 0

  return (
    <div
      className="relative aspect-[4/5] w-40 sm:w-48"
      style={{ animation: 'fadeIn 0.6s ease both' }}
    >
      {mode === 'single' ? (
        <Frame tone="before" opacity={1} />
      ) : (
        <>
          <Frame tone="before" opacity={1 - p} />
          <Frame tone="after" opacity={p} />
        </>
      )}
    </div>
  )
}
