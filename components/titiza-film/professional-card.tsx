'use client'

/**
 * ProfessionalCard — the analyst / barber result card (scenes s4, s9). Fades in
 * on mount; the CTA switches to a pressed state at `pressAt` (a simulated click,
 * no navigation) and an optional confirmation line appears at `confirmAt`.
 * All copy comes from the timeline data.
 */
type ProfessionalCardProps = {
  name: string
  role?: string
  meta: string
  rating: string
  button: string
  /** Scene-relative elapsed time in ms. */
  elapsed: number
  /** Scene-relative offset at which the button shows a pressed state. */
  pressAt?: number
  /** Scene-relative offset at which the confirmation line appears. */
  confirmAt?: number
  /** Confirmation copy shown at `confirmAt` (verbatim). */
  confirmText?: string
}

export function ProfessionalCard({
  name,
  role,
  meta,
  rating,
  button,
  elapsed,
  pressAt,
  confirmAt,
  confirmText,
}: ProfessionalCardProps) {
  const pressed = pressAt != null && elapsed >= pressAt
  const confirmed = confirmAt != null && elapsed >= confirmAt

  return (
    <div
      className="w-full max-w-sm rounded-2xl border border-border bg-card/80 p-5 text-left backdrop-blur-md"
      style={{ animation: 'filmCardIn 300ms cubic-bezier(0.4, 0, 0.2, 1) both' }}
    >
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="size-12 shrink-0 rounded-full border border-gold/30 bg-gold/10"
        />
        <div className="min-w-0">
          <p className="truncate font-serif text-xl font-light text-foreground">
            {name}
          </p>
          {role && (
            <p className="truncate text-xs uppercase tracking-[0.2em] text-gold-muted">
              {role}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
        <span>{meta}</span>
        <span className="text-gold-soft">{rating}</span>
      </div>

      <button
        type="button"
        tabIndex={-1}
        // Fades in 120ms after the card (backwards fill keeps it hidden until then).
        style={{ animation: 'filmChipIn 300ms cubic-bezier(0.4, 0, 0.2, 1) both', animationDelay: '120ms' }}
        className={`mt-5 w-full rounded-full border px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] transition-colors duration-200 ${
          pressed
            ? 'border-gold bg-gold/20 text-gold-soft'
            : 'border-gold/40 text-gold-soft/90'
        }`}
      >
        {button}
      </button>

      {confirmed && confirmText && (
        <p
          className="mt-3 text-center text-sm font-medium text-gold-soft"
          style={{ animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both' }}
        >
          {confirmText}
        </p>
      )}
    </div>
  )
}
