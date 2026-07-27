'use client'

/**
 * LaunchDateCard — the film's closing chapter, after the end card. Three
 * centered serif lines reveal in sequence over black, hold together, then the
 * whole composition fades slowly to black (a longer, gentler fade than the
 * film's other transitions, since this is the actual close).
 *
 * A dedicated component rather than IntroTitle because IntroTitle fades its
 * lines together on one shared timeline; here each line has its OWN fade-in
 * offset, plus a separate slow whole-composition fade-out. Same conventions as
 * the rest of components/titiza-film/ (elapsed-driven, eased, serif on black).
 * Not a call-to-action: no links, buttons, or interactive elements.
 */
type LaunchDateCardProps = {
  line1: string
  line2: string
  line3: string
  /** Scene-relative elapsed time in ms. */
  elapsed: number
  /** Total scene duration in ms (the final fade anchors to the end). */
  duration: number
  /** Scene-relative offset at which each line begins fading in. */
  line1At: number
  line2At: number
  line3At: number
  /** Per-line fade-in duration in ms. */
  lineFade: number
  /** Slow whole-composition fade-out duration in ms. */
  finalFadeOut: number
}

const easeInOut = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

const lineOpacity = (elapsed: number, at: number, fade: number) =>
  easeInOut(Math.min(1, Math.max(0, (elapsed - at) / fade)))

export function LaunchDateCard({
  line1,
  line2,
  line3,
  elapsed,
  duration,
  line1At,
  line2At,
  line3At,
  lineFade,
  finalFadeOut,
}: LaunchDateCardProps) {
  // The full composition fades to black over the final `finalFadeOut` ms.
  const composition =
    elapsed > duration - finalFadeOut
      ? easeInOut(Math.max(0, (duration - elapsed) / finalFadeOut))
      : 1

  return (
    <div
      className="absolute inset-0 z-[120] flex flex-col items-center justify-center gap-5 bg-black px-6 text-center"
      style={{ opacity: composition }}
    >
      <p
        className="font-serif text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl"
        style={{ opacity: lineOpacity(elapsed, line1At, lineFade) }}
      >
        {line1}
      </p>
      <p
        className="font-serif text-2xl font-light tracking-wide text-white/90 sm:text-3xl"
        style={{ opacity: lineOpacity(elapsed, line2At, lineFade) }}
      >
        {line2}
      </p>
      <p
        className="font-serif text-lg font-light tracking-wide text-white/70 sm:text-xl"
        style={{ opacity: lineOpacity(elapsed, line3At, lineFade) }}
      >
        {line3}
      </p>
    </div>
  )
}
