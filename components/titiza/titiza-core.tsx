'use client'

import dynamic from 'next/dynamic'
import { OrbitLabels } from './orbit-labels'

/**
 * TitizaCore — the swappable "center component".
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  SWAP SEAM                                                             │
 * │  To ship a proprietary Titiza 3D model later, replace ONLY the         │
 * │  <TitizaCoreScene /> import below with the new scene component.        │
 * │  The surrounding glow, sizing and layout are stable and reusable.      │
 * └──────────────────────────────────────────────────────────────────────┘
 */
const TitizaCoreScene = dynamic(() => import('./titiza-core-scene'), {
  ssr: false,
  loading: () => <CoreFallback />,
})

function CoreFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="size-40 rounded-full bg-gold/20 blur-2xl animate-titiza-breathe" />
    </div>
  )
}

export function TitizaCore() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[720px]">
      {/* Ambient light bloom behind the presence */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-[90px] animate-titiza-breathe"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-soft/30 blur-[60px] animate-titiza-breathe"
        style={{ animationDelay: '1.5s' }}
      />

      {/* The 3D presence */}
      <div className="absolute inset-0">
        <TitizaCoreScene />
      </div>

      {/* Soft floating context labels around the presence */}
      <OrbitLabels />

      {/* Soft reflection under the presence */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[6%] left-1/2 h-10 w-[55%] -translate-x-1/2 rounded-[50%] bg-gold/15 blur-xl"
      />

      <span className="sr-only">
        Titiza, an abstract living light presence representing your personal
        beauty intelligence.
      </span>
    </div>
  )
}
