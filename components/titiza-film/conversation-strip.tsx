'use client'

/**
 * ConversationStrip — a subtle continuity cue pinned near the top edge of the
 * frame, echoing the chat exchange (the user's line + Titiza's closing line)
 * in small, low-opacity type. Persists through the beauty-profile-check (s3)
 * and analyst-search (s4) scenes and fades out as the Dr. Sarah card appears.
 * Deliberately understated so it never competes with each scene's content.
 */
type ConversationStripProps = {
  userLine: string
  titizaLine: string
  /** Overall layer opacity, driven by the sequencer (fades at the card). */
  opacity: number
}

export function ConversationStrip({ userLine, titizaLine, opacity }: ConversationStripProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-6 pt-5 transition-opacity duration-500 sm:pt-7"
      style={{ opacity }}
    >
      <div className="flex max-w-full items-center gap-3 rounded-full border border-border bg-card/40 px-4 py-1.5 text-[11px] backdrop-blur-sm sm:text-xs">
        <span className="truncate text-muted-foreground/70">{userLine}</span>
        <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-gold/50" />
        <span className="truncate font-serif italic text-foreground/60">{titizaLine}</span>
      </div>
    </div>
  )
}
