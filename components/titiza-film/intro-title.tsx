'use client'

/**
 * IntroTitle — full-screen black title cards (scenes s1, s5, end).
 * Copy is passed in from the sequencer's timeline data; this file only styles
 * the three variants. Fades in on mount via the global `fadeIn` keyframe.
 */
type IntroTitleProps = {
  variant: 'intro' | 'timeskip' | 'end'
  /** Primary line (verbatim from the timeline). */
  primary: string
  /** Optional secondary line (verbatim from the timeline). */
  secondary?: string
}

export function IntroTitle({ variant, primary, secondary }: IntroTitleProps) {
  return (
    <div
      className="absolute inset-0 z-[120] flex flex-col items-center justify-center bg-black px-6 text-center"
      style={{ animation: 'fadeIn 0.8s ease both' }}
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
