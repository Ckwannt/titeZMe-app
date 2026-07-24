'use client'

/**
 * ChatInputShell — the simulated chat scene (set-dressing only; no backend, no
 * real input handling). Choreographed entirely from scene-relative `elapsed`:
 *
 *   1. an input shell shows the placeholder + four suggested prompt chips;
 *   2. at `typeAt` the user's query fills the field (chips fade away);
 *   3. at `sendAt` the query becomes a right-aligned user bubble — this is the
 *      send moment; the orb's ring/brighten is fired by the sequencer at the
 *      same offset (see the scene's orbEvents), NOT when the reply begins;
 *   4. from `replyStartAt`, Titiza's reply reveals line by line, `replyHold`
 *      ms apart.
 *
 * All copy is passed in from the timeline data (verbatim).
 */
type ChatInputShellProps = {
  placeholder: string
  chips: string[]
  query: string
  replyLines: string[]
  /** Scene-relative elapsed time in ms. */
  elapsed: number
  /** Offset at which the query text fills the input. */
  typeAt: number
  /** Offset at which the query becomes a user bubble (the send moment). */
  sendAt: number
  /** Offset at which Titiza's reply starts revealing. */
  replyStartAt: number
  /** Milliseconds between consecutive reply-line reveals. */
  replyHold: number
}

export function ChatInputShell({
  placeholder,
  chips,
  query,
  replyLines,
  elapsed,
  typeAt,
  sendAt,
  replyStartAt,
  replyHold,
}: ChatInputShellProps) {
  const typing = elapsed >= typeAt && elapsed < sendAt
  const sent = elapsed >= sendAt
  const revealed = replyLines.filter((_, i) => elapsed >= replyStartAt + i * replyHold)

  return (
    <div className="w-full max-w-md" style={{ animation: 'fadeUp 0.6s ease both' }}>
      {/* Message log */}
      <div className="flex min-h-[1px] flex-col gap-3">
        {sent && (
          <div className="flex justify-end" style={{ animation: 'fadeUp 0.4s ease both' }}>
            <p className="max-w-[80%] rounded-2xl rounded-br-md border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm text-foreground">
              {query}
            </p>
          </div>
        )}

        {revealed.map((line, i) => (
          <div key={i} className="flex justify-start" style={{ animation: 'fadeUp 0.5s ease both' }}>
            <p className="max-w-[85%] text-balance font-serif text-lg font-light leading-snug text-foreground sm:text-xl">
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* Suggested prompt chips — only before the user commits a query. */}
      {!typing && !sent && (
        <div className="mt-5 flex flex-wrap gap-2" style={{ animation: 'fadeIn 0.5s ease both' }}>
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm sm:text-[13px]"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      {/* Input shell (non-interactive — set-dressing). */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3 backdrop-blur-md">
        <span
          className={`flex-1 truncate text-sm ${typing ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          {typing ? query : placeholder}
        </span>
        <span
          aria-hidden="true"
          className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-sm transition-colors duration-200 ${
            typing
              ? 'border-gold bg-gold/20 text-gold-soft'
              : 'border-gold/30 text-gold-soft/70'
          }`}
        >
          &rarr;
        </span>
      </div>
    </div>
  )
}
