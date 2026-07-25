'use client'

/**
 * IntroTitle — full-screen black title cards (scenes s1, s5, end). Copy is
 * timeline data; this file styles the three variants and drives their opacity
 * from `elapsed` so each card can fade in, hold, and fade to black on its own
 * schedule (e.g. s5 Time Skip: 250 / 900 / 250; end card: hold 2000 then out).
 */
type IntroTitleProps = {
  variant: 'intro' | 'timeskip' | 'end'
  /** Primary line (verbatim from the timeline). */
  primary: string
  /** Optional secondary line (verbatim from the timeline). */
  secondary?: string
  /** Scene-relative elapsed time in ms. */
  elapsed: number
  /** Total scene duration in ms (fade-out anchors to the end). */
  duration: number
  /** Fade-in duration in ms. */
  fadeIn: number
  /** Fade-out duration in ms (0 = hard cut at scene end). */
  fadeOut: number
}

const easeInOut = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

export function IntroTitle({
  variant,
  primary,
  secondary,
  elapsed,
  duration,
  fadeIn,
  fadeOut,
}: IntroTitleProps) {
  const rawOpacity =
    elapsed < fadeIn
      ? elapsed / fadeIn
      : fadeOut > 0 && elapsed > duration - fadeOut
        ? Math.max(0, (duration - elapsed) / fadeOut)
        : 1
  const opacity = easeInOut(Math.min(1, Math.max(0, rawOpacity)))

  return (
    <div
      className="absolute inset-0 z-[120] flex flex-col items-center justify-center bg-black px-6 text-center"
      style={{ opacity }}
    >
      {variant === 'intro' && (
        <>
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-white/70 sm:text-sm">
            {primary}
          </p>
          {secondary && (
            <p className="mt-4 font-serif text-6xl font-light tracking-tight text-white sm:text-7xl md:text-8xl">
              {secondary}
            </p>
          )}
        </>
      )}

      {variant === 'timeskip' && (
        <p className="font-serif text-3xl font-light tracking-wide text-white sm:text-4xl">
          {primary}
        </p>
      )}

      {variant === 'end' && (
        <>
          <p className="font-serif text-6xl font-light tracking-tight text-gold sm:text-7xl md:text-8xl">
            {primary}
          </p>
          {secondary && (
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground sm:text-sm">
              {secondary}
            </p>
          )}
        </>
      )}
    </div>
  )
}
