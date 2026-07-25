'use client'

/**
 * VerticalMontage — a continuous sequence of single words/phrases (scene s10).
 * Each item fades + scales 98%→100% over `fade` ms and out again, and its slot
 * overlaps the next by `overlap` ms so the montage reads as one flowing beat
 * rather than discrete on/off steps. Items are absolutely centered so an
 * outgoing and an incoming word cross-fade in place. Copy is timeline data.
 */
type VerticalMontageProps = {
  words: string[]
  /** How long each word stays fully/at-all present, in ms. */
  visibleDuration: number
  /** Overlap between consecutive words, in ms (the cross-fade window). */
  overlap: number
  /** Scene-relative elapsed time in ms. */
  elapsed: number
}

const FADE = 250
const easeInOut = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

export function VerticalMontage({
  words,
  visibleDuration,
  overlap,
  elapsed,
}: VerticalMontageProps) {
  const step = visibleDuration - overlap

  return (
    <div className="relative flex min-h-[1.4em] items-center justify-center">
      {words.map((word, i) => {
        const local = elapsed - i * step
        if (local < 0 || local > visibleDuration) return null

        const rawOpacity =
          local < FADE
            ? local / FADE
            : local > visibleDuration - FADE
              ? Math.max(0, (visibleDuration - local) / FADE)
              : 1
        const opacity = easeInOut(Math.min(1, rawOpacity))
        const scale = 0.98 + 0.02 * (local < FADE ? easeInOut(local / FADE) : 1)

        return (
          <p
            key={i}
            className="absolute whitespace-nowrap text-center font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl"
            style={{ opacity, transform: `scale(${scale})` }}
          >
            {word}
          </p>
        )
      })}
    </div>
  )
}
