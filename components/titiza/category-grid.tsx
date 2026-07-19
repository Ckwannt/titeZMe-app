'use client'

/**
 * CategoryGrid — the tile surface of the Titiza decision screen (UX spec §5).
 *
 *  - Cards use the existing titiza-glass / titiza-glass-hover vocabulary, an
 *    icon + category name only (no subtext/badges) — §5.3.
 *  - Initial six tiles: the five lowest-`priority` categories + a "More…" tile
 *    (§5.1). "More…" expands the rest in place; the originals don't move (§5.2).
 *  - Selection (§5.5): the chosen tile brightens, the rest fade to ~30%. No
 *    bounce/rotate/scale-snap — opacity/brightness transitions only.
 *  - Arrow-key grid navigation via roving tabindex (§11), not tab-only.
 */

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useLang } from '@/lib/i18n/LangContext'
import { categories as allCategories } from '@/lib/professions'
import { CategoryIcon } from './category-icons'

// Five categories + one "More…" tile = the six initial tiles (§5.1).
const INITIAL_CATEGORY_COUNT = 5

type Tile = { kind: 'category'; id: string } | { kind: 'more' }

interface CategoryGridProps {
  selectedId: string | null
  /** When true, tiles are non-interactive (e.g. during the thinking moment). */
  locked?: boolean
  onSelect: (categoryId: string) => void
}

function MoreGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8 text-gold-soft"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="6" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="18" cy="12" r="1.4" />
    </svg>
  )
}

export function CategoryGrid({
  selectedId,
  locked = false,
  onSelect,
}: CategoryGridProps) {
  const { t } = useLang()

  const sorted = useMemo(
    () =>
      [...allCategories].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999)),
    [],
  )
  const topCategories = sorted.slice(0, INITIAL_CATEGORY_COUNT)
  const restCategories = sorted.slice(INITIAL_CATEGORY_COUNT)

  const [expanded, setExpanded] = useState(false)

  // DOM-ordered focusable tiles. Trailing entry is the "More…" toggle while
  // collapsed; once expanded it's replaced by the remaining category tiles.
  const tiles: Tile[] = [
    ...topCategories.map((c) => ({ kind: 'category' as const, id: c.id })),
    ...(expanded
      ? restCategories.map((c) => ({ kind: 'category' as const, id: c.id }))
      : [{ kind: 'more' as const }]),
  ]

  // Roving tabindex for arrow-key navigation.
  const [focusIndex, setFocusIndex] = useState(0)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [cols, setCols] = useState(2)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const apply = () => setCols(mq.matches ? 3 : 2)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const focusTile = (i: number) => {
    const clamped = Math.max(0, Math.min(tiles.length - 1, i))
    setFocusIndex(clamped)
    btnRefs.current[clamped]?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = focusIndex
    switch (e.key) {
      case 'ArrowRight':
        next = focusIndex + 1
        break
      case 'ArrowLeft':
        next = focusIndex - 1
        break
      case 'ArrowDown':
        next = focusIndex + cols
        break
      case 'ArrowUp':
        next = focusIndex - cols
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = tiles.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    focusTile(next)
  }

  const handleExpand = () => {
    setExpanded(true)
    // Land focus on the first newly revealed tile.
    requestAnimationFrame(() => focusTile(INITIAL_CATEGORY_COUNT))
  }

  return (
    <div
      role="group"
      aria-label="Choose a category to work on"
      onKeyDown={onKeyDown}
      className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
    >
      {tiles.map((tile, i) => {
        const isMore = tile.kind === 'more'
        const catId = isMore ? null : tile.id
        const isSelected = !!catId && catId === selectedId
        const dimmed = !!selectedId && !isSelected

        return (
          <button
            key={isMore ? 'more' : catId}
            ref={(el) => {
              btnRefs.current[i] = el
            }}
            type="button"
            tabIndex={i === focusIndex ? 0 : -1}
            aria-pressed={catId ? isSelected : undefined}
            aria-expanded={isMore ? expanded : undefined}
            disabled={locked && !isSelected}
            onClick={() => {
              if (locked) return
              if (isMore) handleExpand()
              else if (catId) onSelect(catId)
            }}
            style={{ animationDelay: `${i * 60}ms`, transitionDuration: '500ms' }}
            className={[
              'titiza-glass titiza-glass-hover animate-titiza-fade-up',
              'flex flex-col items-center justify-center gap-3 rounded-2xl px-4 py-7',
              'text-center transition-opacity',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              dimmed ? 'opacity-30' : 'opacity-100',
              isSelected
                ? 'border-gold/60 shadow-[0_0_44px_-16px_var(--gold)]'
                : '',
            ].join(' ')}
          >
            {isMore ? (
              <>
                <MoreGlyph />
                <span className="text-sm font-light text-foreground/90">
                  More
                </span>
              </>
            ) : (
              <>
                <CategoryIcon
                  categoryId={catId as string}
                  className="h-8 w-8 text-gold-soft"
                />
                <span className="text-sm font-light text-foreground/90">
                  {t(`category.${catId}`)}
                </span>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
