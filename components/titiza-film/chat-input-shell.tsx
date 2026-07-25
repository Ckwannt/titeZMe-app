'use client'

/**
 * ChatInputShell — the simulated chat scene (set-dressing only; no backend, no
 * real input handling). Choreographed entirely from view-relative `elapsed`:
 *
 *   1. the input shell rises in (fade + 10px), then the suggested prompt chips
 *      fade in one by one (`chipStagger` apart);
 *   2. from `typeStartAt` the query types in character by character over
 *      `typeDuration`; the chips clear once typing begins;
 *   3. after the last character, a 250ms pause precedes `sendAt`, when the query
 *      lifts into a right-aligned bubble (300ms). The orb's single subtle pulse
 *      is fired by the sequencer (orbEvents) exactly as the bubble settles;
 *   4. from `replyStartAt`, Titiza's reply reveals one sentence at a time
 *      (`replyHold` apart), each fading up 6px.
 *
 * All copy is passed in from the timeline data (verbatim).
 */
type ChatInputShellProps = {
  placeholder: string
  chips: string[]
  query: string
  replyLines: string[]
  /** View-relative elapsed time in ms (the chat view mounts at its own offset). */
  elapsed: number
  /** Offset at which the suggested prompt chips begin appearing. */
  chipsAt: number
  /** Stagger between consecutive chip reveals. */
  chipStagger: number
  /** Offset at which the query starts typing character by character. */
  typeStartAt: number
  /** How long the query takes to finish typing. */
  typeDuration: number
  /** Offset at which the finished query lifts into the user bubble (send). */
  sendAt: number
  /** Offset at which Titiza's reply starts revealing, sentence by sentence. */
  replyStartAt: number
  /**
   * Gap (ms) AFTER each reply sentence before the next appears — one entry per
   * sentence (the last is unused for reveal, but keeps the array aligned). Sized
   * per sentence so each honors the reading-time floor before the next lands.
   */
  replyHolds: number[]
}

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'
const easeInOut = (p: number) =>
  p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2

export function ChatInputShell({
  placeholder,
  chips,
  query,
  replyLines,
  elapsed,
  chipsAt,
  chipStagger,
  typeStartAt,
  typeDuration,
  sendAt,
  replyStartAt,
  replyHolds,
}: ChatInputShellProps) {
  const typing = elapsed >= typeStartAt && elapsed < sendAt
  const sent = elapsed >= sendAt

  // Character-by-character typing (eased), so the query fills the field.
  const typedChars = typing
    ? Math.round(easeInOut(Math.min(1, (elapsed - typeStartAt) / typeDuration)) * query.length)
    : 0
  const typedText = query.slice(0, typedChars)

  // Chips are only present before the user commits to typing a query.
  const showChips = elapsed < typeStartAt

  // Cumulative reveal time for each reply sentence: sentence i appears after the
  // sum of the preceding sentences' holds, so each gets its own reading window.
  let revealAcc = replyStartAt
  const revealTimes = replyLines.map((_, i) => {
    const at = revealAcc
    revealAcc += replyHolds[i] ?? 0
    return at
  })
  const revealedReplies = replyLines.filter((_, i) => elapsed >= revealTimes[i])

  return (
    <div className="w-full max-w-md">
      {/* Message log */}
      <div className="flex min-h-[1px] flex-col gap-3">
        {sent && (
          <div
            className="flex justify-end"
            style={{ animation: `filmBubbleIn 300ms ${EASE} both` }}
          >
            <p className="max-w-[80%] rounded-2xl rounded-br-md border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm text-foreground">
              {query}
            </p>
          </div>
        )}

        {revealedReplies.map((line, i) => (
          <div
            key={i}
            className="flex justify-start"
            style={{ animation: `filmFadeUp6 250ms ${EASE} both` }}
          >
            <p className="max-w-[85%] text-balance font-serif text-lg font-light leading-snug text-foreground sm:text-xl">
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* Suggested prompt chips — fade in one by one, no scale/pop. */}
      {showChips && (
        <div className="mt-5 flex flex-wrap gap-2">
          {chips.map((chip, i) =>
            elapsed < chipsAt + i * chipStagger ? null : (
              <span
                key={chip}
                className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm sm:text-[13px]"
                style={{ animation: `filmChipIn 300ms ${EASE} both` }}
              >
                {chip}
              </span>
            ),
          )}
        </div>
      )}

      {/* Input shell (non-interactive — set-dressing). */}
      <div
        className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card/70 px-4 py-3 backdrop-blur-md"
        style={{ animation: `filmInputIn 300ms ${EASE} both` }}
      >
        <span
          className={`flex-1 truncate text-sm ${typing ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          {typing ? typedText : placeholder}
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
