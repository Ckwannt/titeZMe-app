# titeZMe — Objective inconsistencies

Audit date: 2026-10-01 (Europe/Madrid). Existing implementation only. Source occurrences do not establish live data, runtime reachability or design intent. No production code changed.

These are implementation/documentation discrepancies and parallel treatments, without corrective recommendations. Equivalent literal spellings are preserved but are not called visually different.


| Finding | Evidence / exact difference |
|---|---|
| Next.js version | Supplied instructions lock15.3.1; package.json has next15.3.6, override15.3.6 and eslint-config-next15.3.6. React18.3.1 and uuid11.0.3 remain exact. No package changed. |
| Middleware | Instructions say no middleware; middleware.ts exists and rate-limits requests. [middleware.ts:1](../middleware.ts#L1). No security applicability conclusion inferred. |
| Role/data terminology | Guide says barber/barbers/barbershops; AppUser uses client/professional/admin; runtime code uses professionalProfiles/businesses with legacy fields also present. [lib/auth-context.tsx:1](../lib/auth-context.tsx#L1); [lib/types.ts:1](../lib/types.ts#L1) |
| Font loading versus application | Nunito variable is declared, body font-sans remains the framework system stack; inline areas separately request Nunito. [app/layout.tsx:1](../app/layout.tsx#L1) |
| Titiza serif scope | Protected route loads Cormorant; public films use font-serif without that route variable. [app/dashboard/client/titiza/page.tsx:1](../app/dashboard/client/titiza/page.tsx#L1); [app/preview/titiza-film/page.tsx:1](../app/preview/titiza-film/page.tsx#L1) |
| Parallel accent colors | #F5C518 brand, #FFD600 navigation/cookies/selection, OKLCH gold and #e8c47a/#f7e6b4 orb. Exact uses in token ledger. |
| Dark/text variations | #111/#111111/#141414/#181818/#1a1a1a/#1A1A1B; #888/#888888 versus #888580; white versus #F0EDE8. |
| Undefined brand-primary | Referenced in EmptyStates/404 with no --color-brand-primary definition. [components/EmptyStates.tsx:1](../components/EmptyStates.tsx#L1); [app/not-found.tsx:1](../app/not-found.tsx#L1) |
| Card radii | Guide16px; barber-card skeleton rounded-3xl24px, booking16px, ComingSoon24px, for-shops comparison20px. [components/skeletons.tsx:1](../components/skeletons.tsx#L1); [components/ComingSoon.tsx:1](../components/ComingSoon.tsx#L1); [app/for-shops/page.tsx:1](../app/for-shops/page.tsx#L1) |
| Independent button treatments | Cookie rounded-xl12px versus full/99px pills; Titiza outlined medium uppercase versus marketplace filled black-weight. No common Button variant API. |
| Booking status meaning | Professional confirmed yellow/pending orange; shop confirmed blue#60a5fa/pending yellow. [app/dashboard/barber/bookings/page.tsx:40](../app/dashboard/barber/bookings/page.tsx#L40); [app/dashboard/shop/bookings/page.tsx:19](../app/dashboard/shop/bookings/page.tsx#L19) |
| Input override | Global16px!important overrides local13/14px declared input sizes. [app/globals.css:74](../app/globals.css#L74) |
| Headings | Login32px/signup28px, admin28px, different marketplace scales and billing bold versus dashboard black. Typography source ledger. |
| Spacing/container values | 1200/1000/800px/max-w-3xl containers; for-shops48→20px gutters versus common24px; dialog28px padding versusp6/p8. |
| Icon sizing/stroke | Eye18px/stroke2, chevron8×6/stroke2.5, Titiza24px base/call-site1.5 stroke, category32px and differently sized emoji. |
| Existing gradients | Titiza/avatar/hero gradients are present despite guidance against adding gradients. All preserved. |
| Logo source | Documented public/wordmark.png absent; inline SVG Wordmark and separate404 text logo. [components/Wordmark.tsx:1](../components/Wordmark.tsx#L1) |
| Motion names | pulse .6s token versus for-shops3s scale animation/keyframe-name collision. [app/globals.css:1](../app/globals.css#L1); [app/for-shops/page.tsx:1](../app/for-shops/page.tsx#L1) |
| Breakpoint boundary | for-shops max-width768px overlaps Tailwind md min-width768px; globals uses max-width767px for its mobile rule. |
| Stacking | z40/50/100/110/999/9998/9999; no shared overlay-level token. [components/TopNav.tsx:1](../components/TopNav.tsx#L1); [components/CookieBanner.tsx:1](../components/CookieBanner.tsx#L1); [components/ConfirmDialog.tsx:1](../components/ConfirmDialog.tsx#L1) |
| Titiza gating | Comments default OFF versus TEMP_ENABLE_GLOBALLY=true. [lib/titiza-phase2-flag.ts:1](../lib/titiza-phase2-flag.ts#L1) |
| CTA capability | BeautyProfileCard primary CTA has no handler; phase-two paths log no-op; film pressed/booked states are timed simulations. |
| Public challenge | Anonymous branches exist in campaign source, but challenge/terms-challenge are absent from guard public list. [app/challenge/page.tsx:1](../app/challenge/page.tsx#L1); [components/RouteGuard.tsx:1](../components/RouteGuard.tsx#L1) |
| Unknown-route behavior | Custom404 body exists; anonymous unknown URL can redirect before it is visible. Screenshot index records the actual URL/body rather than claiming404 coverage. |
| Image configuration/runtime | Shop search threw Invalid src randomuser.me hostname not configured. Static fixture origins and current image configuration disagree. Configuration unchanged. |
| Fake-data default | showFakeUIData defaults true unless false; existing fixture paths may render without audit injection. [hooks/useShowFakeUIData.ts:1](../hooks/useShowFakeUIData.ts#L1) |
| README | AI Studio/GEMINI_API_KEY guidance versus Next/Firebase/Algolia implementation; no live Titiza conversation API found. [README.md:1](../README.md#L1) |
| Baseline count | Supplied21-generated-page baseline versus75 page modules; production generation count recorded separately. |


Full literal variations and sources: [tokens](02-design-tokens.md), [typography](03-typography.md), [components](05-component-inventory.md), [responsive](04-responsive-system.md), [motion](08-motion.md).
