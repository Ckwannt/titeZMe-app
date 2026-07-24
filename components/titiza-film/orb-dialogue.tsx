'use client'

/**
 * OrbDialogue — Titiza's spoken lines in Cormorant Garamond, centered beneath
 * the orb. Shows one line at a time; each line is held `hold` ms before the
 * next replaces it. Re-keying on the line index re-runs the `fadeIn` keyframe,
 * giving the fade-out/in beat between lines. Copy comes from timeline data.
 */
type OrbDialogueProps = {
  lines: string[]
  /** Milliseconds each line is held before advancing. */
  hold: number
  /** Scene-relative elapsed time in ms. */
  elapsed: number
}

export function OrbDialogue({ lines, hold, elapsed }: OrbDialogueProps) {
  if (lines.length === 0) return null
  const idx = Math.min(lines.length - 1, Math.max(0, Math.floor(elapsed / hold)))

  return (
    <p
      key={idx}
      className="text-balance px-2 text-center font-serif text-3xl font-light leading-tight text-foreground sm:text-4xl"
      style={{ animation: 'fadeIn 0.6s ease both' }}
    >
      {lines[idx]}
    </p>
  )
}
