'use client'

/**
 * PathDirect — Path B (UX spec §7.2). Reached when the selected category's
 * titizaEntryMode is 'direct' (Frozen Decision #1 — branched on the field in
 * the parent, never on the category name).
 *
 * Both actions are inert placeholders (Frozen Decision #6): "Explore
 * Professionals" has no destination yet, and "Notify me" does NOT write to
 * Firestore because that mechanism doesn't exist (Technical Notes §4). The
 * feature flag keeps real users out of this screen, so inert CTAs are fine.
 */

import { useEffect, type MutableRefObject } from 'react'
import type { TitizaCoreApi } from './titiza-core'

interface PathDirectProps {
  /** Localized category label, e.g. "Skin & Facial". */
  categoryName: string
  apiRef: MutableRefObject<TitizaCoreApi | null>
}

export function PathDirect({ categoryName, apiRef }: PathDirectProps) {
  useEffect(() => {
    apiRef.current?.reactEyeContact() // soft brighten as the panel resolves
  }, [apiRef])

  const handleExplore = () => {
    apiRef.current?.reactPulse()
    // eslint-disable-next-line no-console
    console.log(
      `[Titiza Phase 2] Path B "Explore Professionals" (${categoryName}) — no-op placeholder; destination tracked separately.`,
    )
  }

  const handleNotify = () => {
    // eslint-disable-next-line no-console
    console.log(
      `[Titiza Phase 2] Path B "Notify me when this launches" (${categoryName}) — no-op placeholder; no persistence yet (Technical Notes §4).`,
    )
  }

  return (
    <div className="mt-8 flex w-full max-w-md flex-col items-center text-center">
      <div className="titiza-glass w-full animate-titiza-fade-up rounded-2xl px-6 py-8">
        <h3 className="font-serif text-2xl font-light text-foreground">
          Continue with Professionals
        </h3>
        <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">
          Titiza for {categoryName} is being built together with specialists on
          titeZMe.
        </p>

        <button
          type="button"
          onClick={handleExplore}
          className="mt-7 rounded-full border border-gold/40 px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft/90 transition-colors duration-300 hover:border-gold-soft hover:text-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Explore Professionals
        </button>

        {/* Secondary — smaller, text-link weight (§7.2). */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleNotify}
            className="rounded text-sm font-light text-gold-soft/80 underline-offset-4 transition-colors hover:text-gold-soft hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Notify me when this launches
          </button>
        </div>
      </div>
    </div>
  )
}
