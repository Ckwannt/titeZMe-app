'use client'

/**
 * Custom thin gold line-art icon set for the Titiza decision screen — one icon
 * per registry category id (Frozen Decision #4). No icon-library dependency
 * (CLAUDE.md forbids it) and deliberately NOT the registry `emoji` field.
 *
 * All icons share a 24x24 viewBox and stroke = currentColor, so the card
 * controls the gold tint and sizing. Purely decorative → aria-hidden.
 */

import type { ReactElement, ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Svg({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

const HairIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <circle cx="6" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <path d="M7.7 7.3 20 17" />
    <path d="M7.7 16.7 20 7" />
  </Svg>
)

const SkinIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M12 3s5 5.4 5 9a5 5 0 0 1-10 0c0-3.6 5-9 5-9Z" />
    <path d="M12 11v3.4M10.3 12.7h3.4" />
  </Svg>
)

const NailsIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <rect x="9" y="9" width="6" height="11" rx="1.6" />
    <path d="M10.4 9V7.4h3.2V9" />
    <path d="M12 7.4V3.6" />
    <circle cx="12" cy="3.2" r="0.6" />
  </Svg>
)

const DentalIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M12 4.2c-3 0-5 1.4-5 3.8 0 1.9.7 3 1.2 5.4.4 2 .5 4.4 1.8 4.4 1.1 0 1-2 2-2s.9 2 2 2c1.3 0 1.4-2.4 1.8-4.4C16.3 11 17 9.9 17 8c0-2.4-2-3.8-5-3.8Z" />
  </Svg>
)

const FitnessIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M6.5 9v6M4 10.5v3M17.5 9v6M20 10.5v3M6.5 12h11" />
  </Svg>
)

const MakeupIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <rect x="9" y="13" width="6" height="8" rx="1" />
    <path d="M9 13V8l6-1.6V13" />
  </Svg>
)

const TattooIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M4 20l3.5-3.5" />
    <path d="M7 16.5 15 8.5l1.8 1.8L8.8 18.3z" />
    <path d="M15 8.5 17.5 6l1.8 1.8L16.8 10.3z" />
    <path d="M17.5 6 19 4.5" />
  </Svg>
)

const BrowsLashesIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5Z" />
    <circle cx="12" cy="12" r="2.2" />
    <path d="M12 7V5M7.3 8.4 6.2 6.8M16.7 8.4 17.8 6.8" />
  </Svg>
)

const WaxingIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M12 3v9" />
    <rect x="8" y="12" width="8" height="3" rx="1" />
    <path d="M8.8 15v2.2M11 15v2.2M13 15v2.2M15.2 15v2.2" />
  </Svg>
)

const MassageIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M12 4c1.8 2.2 1.8 4.8 0 7-1.8-2.2-1.8-4.8 0-7Z" />
    <path d="M12 11c-1 1.8-3 2.7-5.5 2.3C7 11.6 9 10.7 12 11Z" />
    <path d="M12 11c1 1.8 3 2.7 5.5 2.3C17 11.6 15 10.7 12 11Z" />
    <path d="M5 15c3 3 11 3 14 0" />
  </Svg>
)

const MentalHealthIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M8 21v-3.2A6 6 0 1 1 16.2 12" />
    <path d="M11 12a1.9 1.9 0 0 1 3.4-1.1" />
    <path d="M13.5 15l2-2 2 2-2 2z" />
  </Svg>
)

const MedicalAestheticsIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M13 4l7 7" />
    <path d="M17.5 5.5 19 7" />
    <path d="M16.5 7.5l-9 9" />
    <path d="M9.5 10.5l4 4" />
    <path d="M7 13l3 3" />
    <path d="M4 21l3.5-3.5" />
  </Svg>
)

const AltMedicineIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14Z" />
    <path d="M5 19C9 15 13 11 17 7" />
  </Svg>
)

const PodiatryIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M9.2 3.4c1.4 0 2 1.9 2 4.9v4.5c0 2 1 3 3 3s3 1 3 2.9c0 1.4-1 2.3-3 2.3H8.2c-1.5 0-2.6-1-2.6-2.6C5.6 12.6 6.6 3.4 9.2 3.4Z" />
    <circle cx="15.5" cy="7" r="1" />
  </Svg>
)

const BridalEventsIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <path d="M6 9l3-4h6l3 4-6 9z" />
    <path d="M6 9h12" />
    <path d="M9 5l3 4 3-4" />
    <path d="M9 9l3 9 3-9" />
  </Svg>
)

const FallbackIcon = (p: IconProps): ReactElement => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
  </Svg>
)

/** categoryId → icon component. Keys match lib/professions.ts category ids. */
export const categoryIcons: Record<string, (props: IconProps) => ReactElement> = {
  hair: HairIcon,
  skin: SkinIcon,
  nails: NailsIcon,
  dental: DentalIcon,
  fitness: FitnessIcon,
  makeup: MakeupIcon,
  tattoo: TattooIcon,
  brows_lashes: BrowsLashesIcon,
  waxing: WaxingIcon,
  massage: MassageIcon,
  mental_health: MentalHealthIcon,
  medical_aesthetics: MedicalAestheticsIcon,
  alt_medicine: AltMedicineIcon,
  podiatry: PodiatryIcon,
  bridal_events: BridalEventsIcon,
}

/** Resolve a category id to its line icon (falls back to a plain ring). */
export function CategoryIcon({
  categoryId,
  ...props
}: { categoryId: string } & IconProps) {
  const Icon = categoryIcons[categoryId] ?? FallbackIcon
  return <Icon {...props} />
}
