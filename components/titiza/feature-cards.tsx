/* ---------------------------------------------------------------------------
 * Inline SVG icons (converted from lucide-react to match the app's inline-<svg>
 * convention — see components/TopNav.tsx). No icon library is used.
 * ------------------------------------------------------------------------- */
type IconProps = { className?: string; strokeWidth?: number }

function ShieldCheckIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function MessagesSquareIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </svg>
  )
}

function RouteIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      <circle cx="6" cy="19" r="3" />
      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      <circle cx="18" cy="5" r="3" />
    </svg>
  )
}

type IconComponent = (props: IconProps) => React.ReactElement

const features: { icon: IconComponent; title: string; description: string }[] = [
  {
    icon: ShieldCheckIcon,
    title: 'Beauty Profile',
    description: 'A living record of your verified beauty information.',
  },
  {
    icon: MessagesSquareIcon,
    title: 'AI Conversations',
    description:
      'Personalized recommendations that become smarter over time.',
  },
  {
    icon: RouteIcon,
    title: 'Beauty Journey',
    description:
      'Track how your beauty profile evolves with every professional analysis.',
  },
]

export function FeatureCards() {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {features.map((feature, i) => (
        <div
          key={feature.title}
          className="animate-titiza-fade-up titiza-glass titiza-glass-hover group relative overflow-hidden rounded-3xl p-7"
          style={{ animationDelay: `${0.55 + i * 0.12}s` }}
        >
          {/* subtle top glow */}
          <div className="absolute -top-16 left-1/2 size-32 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-gold/10 ring-1 ring-gold/20 transition-colors duration-500 group-hover:bg-gold/16">
            <feature.icon className="size-6 text-gold" strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-2xl font-light text-foreground">
            {feature.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  )
}
