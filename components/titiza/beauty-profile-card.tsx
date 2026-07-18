'use client'

import { useState } from 'react'

/* ---------------------------------------------------------------------------
 * Inline SVG icons (converted from lucide-react to match the app's inline-<svg>
 * convention — see components/TopNav.tsx). No icon library is used.
 * ------------------------------------------------------------------------- */
type IconProps = { className?: string; strokeWidth?: number }

function ScanFaceIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
    </svg>
  )
}

function ChevronDownIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function MapPinIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function UploadCloudIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M12 13v8" />
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="m8 17 4-4 4 4" />
    </svg>
  )
}

function SparklesIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  )
}

type IconComponent = (props: IconProps) => React.ReactElement

const steps: { icon: IconComponent; title: string; description: string }[] = [
  {
    icon: MapPinIcon,
    title: 'Visit a verified professional',
    description:
      'Book time with a titeZMe-verified beauty professional near you.',
  },
  {
    icon: UploadCloudIcon,
    title: 'The professional uploads your analysis',
    description:
      'Your results are added directly to your Beauty Profile as verified data.',
  },
  {
    icon: SparklesIcon,
    title: 'Titiza personalizes everything',
    description:
      'Titiza combines your Beauty Profile with our conversations to provide personalized recommendations.',
  },
]

export function BeautyProfileCard() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="animate-titiza-fade-up titiza-glass relative overflow-hidden rounded-3xl p-8 sm:p-10"
      style={{ animationDelay: '0.45s' }}
    >
      {/* top gold hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-gold/12 ring-1 ring-gold/20">
          <ScanFaceIcon className="size-7 text-gold" strokeWidth={1.5} />
        </div>

        <h2 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
          Build your Beauty Profile
        </h2>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Before I can give truly personalized recommendations, I need to
          understand you through verified professional analyses. Every new
          analysis becomes part of your Beauty Profile, allowing me to learn
          more about your hair, skin, and other beauty domains over time.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            type="button"
            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-medium tracking-wide text-primary-foreground shadow-[0_18px_50px_-15px_oklch(0.82_0.13_85/0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-15px_oklch(0.82_0.13_85/0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Book Your First Beauty Analysis
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-gold-soft/80 transition-colors hover:text-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
          >
            How Titiza Works
            <ChevronDownIcon
              className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Expandable timeline */}
      <div
        className={`grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'mt-8 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0">
          <div className="border-t border-border pt-8">
            <ol className="relative mx-auto max-w-xl">
              {/* vertical connector */}
              <div className="absolute bottom-6 left-6 top-6 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="relative flex gap-5 pb-8 last:pb-0"
                >
                  <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary ring-1 ring-gold/20">
                    <step.icon className="size-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div className="pt-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gold-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-base font-medium text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
