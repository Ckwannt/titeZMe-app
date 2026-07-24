'use client'

/**
 * VerticalMontage — a quick sequential fade-in/out of single words or short
 * phrases (scene s10), `interval` ms apart, with no surrounding explanation.
 * Copy comes from timeline data.
 */
type VerticalMontageProps = {
  words: string[]
  /** Milliseconds each word occupies before the next replaces it. */
  interval: number
  /** Scene-relative elapsed time in ms. */
  elapsed: number
}

export function VerticalMontage({ words, interval, elapsed }: VerticalMontageProps) {
  const idx = Math.floor(elapsed / interval)
  if (idx < 0 || idx >= words.length) return null

  // Ease opacity up then down within each word's slot.
  const local = elapsed - idx * interval
  const inEnd = interval * 0.25
  const outStart = interval * 0.75
  const opacity =
    local < inEnd
      ? local / inEnd
      : local > outStart
        ? Math.max(0, (interval - local) / (interval - outStart))
        : 1

  return (
    <p
      key={idx}
      className="text-center font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl"
      style={{ opacity }}
    >
      {words[idx]}
    </p>
  )
}
