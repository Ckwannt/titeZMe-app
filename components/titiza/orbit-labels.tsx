'use client'

import { useEffect, useState } from 'react'

/**
 * OrbitLabels — very subtle floating labels that fade in and out around the
 * orb, hinting at what Titiza works with. Positioned toward the edges so they
 * never compete with the glowing core. Respects prefers-reduced-motion.
 */

type Label = {
  text: string
  // position as percentages within the square core container
  top: string
  left: string
}

const LABELS: Label[] = [
  { text: 'Hair Profile', top: '14%', left: '8%' },
  { text: 'Beauty Profile', top: '22%', left: '78%' },
  { text: 'Professional Analysis', top: '68%', left: '4%' },
  { text: 'Recommendations', top: '78%', left: '72%' },
  { text: 'Verified Data', top: '46%', left: '86%' },
]

export function OrbitLabels() {
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    let index = 0
    let timeoutId: ReturnType<typeof setTimeout>

    const cycle = () => {
      setActive(index)
      // visible for ~2.6s, then fade out and pause before the next
      timeoutId = setTimeout(() => {
        setActive(null)
        index = (index + 1) % LABELS.length
        timeoutId = setTimeout(cycle, 1400)
      }, 2600)
    }

    // gentle initial delay so it appears after the orb settles
    timeoutId = setTimeout(cycle, 1800)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {LABELS.map((label, i) => (
        <span
          key={label.text}
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-gold/15 bg-background/40 px-3 py-1 text-[11px] font-light tracking-[0.15em] text-gold-soft/90 uppercase backdrop-blur-sm transition-all duration-1000 ease-out"
          style={{
            top: label.top,
            left: label.left,
            opacity: active === i ? 1 : 0,
            transform: `translate(-50%, -50%) translateY(${active === i ? '0px' : '8px'})`,
          }}
        >
          {label.text}
        </span>
      ))}
    </div>
  )
}
