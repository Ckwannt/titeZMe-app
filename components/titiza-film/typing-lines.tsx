'use client'

/**
 * TypingLines — a system-style checklist that reveals one line at a time,
 * `stagger` ms apart, starting at `startAt` (scene-relative). Each line rises
 * in with the global `fadeUp` keyframe. Copy + timing come from timeline data.
 */
type TypingLinesProps = {
  lines: string[]
  /** Scene-relative offset (ms) at which the first line appears. */
  startAt: number
  /** Milliseconds between consecutive line reveals. */
  stagger: number
  /** Scene-relative elapsed time in ms. */
  elapsed: number
}

export function TypingLines({ lines, startAt, stagger, elapsed }: TypingLinesProps) {
  return (
    <ul className="flex flex-col items-center gap-2 font-mono text-xs text-muted-foreground sm:text-sm">
      {lines.map((line, i) => {
        const revealAt = startAt + i * stagger
        if (elapsed < revealAt) return null
        return (
          <li
            key={i}
            className="flex items-center gap-2"
            style={{ animation: 'fadeUp 0.5s ease both' }}
          >
            <span
              aria-hidden="true"
              className="size-1 shrink-0 rounded-full bg-gold"
            />
            <span>{line}</span>
          </li>
        )
      })}
    </ul>
  )
}
