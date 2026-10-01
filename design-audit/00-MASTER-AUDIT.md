# titeZMe — Master product design audit

Audit date: 2026-10-01 (Europe/Madrid). This is an index and factual record of the existing implementation. No application source, branding, dependencies, configuration, or backend data was changed. Source evidence and observed runtime states are distinguished throughout. Intent that is not evidenced is **Not established / not found**.

## Product areas and routes

**75 page modules** were found across public marketing/discovery, authentication, client and professional onboarding, client/professional/shop dashboards, booking and reviews, administration, challenge participation/payment, Titiza, and public Titiza films. Redirects and placeholder modules are included in this count; API handlers and framework-generated routes are not. The route-by-route map records access, state branches, layout, components, and responsive behavior.

[01 — Product map](01-product-map.md)

## Components

There are **58 component TSX files** containing **62 exported JSX function components**, including guards and wrappers, plus the ErrorBoundary class. This is the shared-component inventory count, not a claim that all components have multiple consumers. Local page components and uppercase arrow functions are separately listed. No general shared Button/Card/Input/Badge API was found. Per-component sizing and state evidence is restricted to that function's source span; external Props declarations and global styles are recorded separately.

[05 — Component inventory](05-component-inventory.md)

## Fonts and typography

Nunito is loaded by the root layout and exposed as a CSS variable. The body uses the framework's system sans stack; a binding from that stack to Nunito was not found. Titiza additionally declares Cormorant Garamond in its route scope. Public film serif utilities use the framework serif stack. Exact sizes, weights, leading, tracking, transformations, and local overrides are preserved.

The development server's Google Fonts download was blocked and reported a fallback during capture. Screenshots therefore do not establish production font availability. The subsequent production build succeeded with network access.

[03 — Typography](03-typography.md)

## Colors, geometry, and tokens

The global stylesheet defines dark surfaces, yellow/orange/green/red accents, text colors, borders, and motion tokens through Tailwind 4's theme. There are **177 distinct authored color spellings** in the scanned source, alongside framework utility colors, inline values, and Titiza's separate OKLCH/glass palette. This spelling count preserves differences instead of normalizing equivalent colors. Spacing, radii, shadows, glows, blur, opacity, grid/flex patterns, widths, and local values are documented with source references.

[02 — Design tokens](02-design-tokens.md)

## Responsive behavior

Installed framework breakpoints are sm 40rem, md 48rem, lg 64rem, xl 80rem, and 2xl 96rem (640/768/1024/1280/1536px at a 16px root). The report distinguishes these definitions from actual usages. Local 767px/768px media rules, JavaScript width checks, drawer navigation, grid changes, and overflow behavior coexist with the utilities.

[04 — Responsive system](04-responsive-system.md)

## Imagery, icons, and assets

Six local raster/icon assets were found: the challenge image and five favicon/install-icon variants. Provider/shop imagery and promotional video also use remote sources. Wordmark renders as inline SVG text; the documented public/wordmark.png was not found. Icons combine inline SVG, emoji, and text; no installed SVG icon-library dependency was found. No local font, 3D model, video, or texture asset was found.

[06 — Imagery and iconography](06-imagery-iconography.md) · [11 — Asset inventory](11-asset-inventory.md)

## Titiza

The protected Titiza route implements a genesis/orb presentation and branching decision interface with CSS and a Three.js scene. Several follow-on actions are placeholders or no-ops. The source feature flag currently enables it globally despite comments describing an off state. Public films implement scripted dialogue and a simulated professional recommendation.

Live conversation, persisted/editable Beauty Profile, live analysis, and real recommendation results: **Not implemented** in the inspected implementation. Scripted film screenshots are identified as previews.

[07 — Titiza](07-titiza.md)

## Motion

Motion uses CSS keyframes/transitions, requestAnimationFrame, timers, IntersectionObserver, Three.js, and chart animation. Films use a shared elapsed-time sequence. Reduced-motion handling exists in selected systems, with gaps documented; no blanket compliance claim is made. Exact timings, easing, triggers, and keyframes are retained.

[08 — Motion](08-motion.md)

## Accessibility

The audit records implemented labels, keyboard handlers, semantics, focus styling, validation, and reduced-motion branches, as well as observable gaps in dialog behavior, controls, language, and motion. It is source/runtime evidence, not a WCAG certification or a redesign proposal.

[09 — Accessibility](09-accessibility.md)

## Screenshot coverage

**62 viewport captures / 106 PNG files**, including **44 full-page variants**, are indexed. Requested viewport dimensions are desktop 1440×1000 and mobile 390×844; verification found zero dimension mismatches and zero unindexed PNGs.

Anonymous public screens, loading/empty/error states, selected menus/forms, cookie preferences, and scripted films were captured. Protected routes are documented from source because no authorized signed-in test session was provided. Successful populated search/provider screens were not established: existing fixture image hosts caused a Next Image exception. Early shells, redirects, consent overlap, and capture timing limits remain explicitly labeled rather than presented as successful destination screens.

[12 — Screenshot index and requested-area coverage](12-screenshot-index.md) · [Screenshot files](screenshots/) · [Capture metadata](evidence/screenshots.json) · [Dimension verification](evidence/screenshot-verification.json)

## Missing and unimplemented areas

A standalone service-detail screen and online booking-payment checkout are **Not implemented**. Cash booking summaries and a separate challenge bank-transfer flow exist. Billing, messages, My Look, gifts, and badges contain coming-soon/placeholder branches where identified in the product map. Missing Titiza capabilities are recorded above. Protected screenshot absence is an access limitation, not evidence that those screens are unimplemented.

[01 — Route-level implementation status](01-product-map.md) · [07 — Titiza implementation status](07-titiza.md) · [12 — Capture limitations](12-screenshot-index.md)

## Objective inconsistencies

Repository guidance specifies Next 15.3.1, while package.json contains 15.3.6. Guidance says middleware is absent, while middleware.ts exists. Documented barber roles/collections differ from professional/admin and professionalProfiles/businesses in source. Other findings include the Nunito/body stack mismatch, an undefined brand-primary token reference, divergent card radii/accent values, gradients and inline SVG despite guidance, duplicated primitives, placeholder actions, and randomuser.me fixture images without a configured image hostname. Both guidance and implementation are documented; none was changed.

[10 — Visual and documentation inconsistencies](10-visual-inconsistencies.md)

## Validation and evidence

Production **npm run build passed (exit 0)** and generated **75/75 pages**. Existing lint, gradient syntax, and Sentry configuration warnings remain recorded. The initial restricted build attempt did not complete; the network-enabled retry succeeded. Only the audit directory was added.

[Build validation](evidence/build-validation.md) · [Source inventory](evidence/source-inventory.json) · [Exact embedded CSS](evidence/embedded-css.md) · [Installed framework theme](evidence/framework-theme.css) · [Audit counts](evidence/audit-metrics.json)

The tools directory contains the source collectors, report generators, and capture scripts used for this record. They are audit utilities and are not imported by the application.

