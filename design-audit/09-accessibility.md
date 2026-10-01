# titeZMe — Accessibility implementation

Audit date: 2026-10-01 (Europe/Madrid). Existing implementation only. Source occurrences do not establish live data, runtime reachability or design intent. No production code changed.

## Existing evidence


| Area | Implementation |
|---|---|
| Semantics | Native buttons, links, forms, inputs, selects, headings, main and footer coexist with generic div wrappers. Root html lang=en is static. |
| Focus | Auth/forms have local focus styling. Titiza CTAs/tiles use ring2, gold alpha and offset2. PathAnalysis/PathDirect tabIndex−1 containers receive focus on mount. |
| Keyboard | CategoryGrid supports roving tabindex, arrows/Home/End and responsive2/3 column stride. Native button activation and some Enter handlers exist. Password toggle is a named button. |
| ARIA | Category group label/pressed/expanded; polite messages/path regions; timeline expanded; decorative layers hidden; core screen-reader-only description. |
| Image alt | Next Image data-dependent and generic Profile/Barber alternatives. CSS background poster has no alt node. Exact declarations are preserved in ledger. |
| Form labels | Visible labels and some htmlFor/id associations; other labels are separate text/divs. Visible text alone does not prove association. |
| Interactive dimensions | Pagination44×44px; bell36×36px; eye18px/no padding; cookie switch48×24px; Titiza tile padding28px vertically/16px horizontally. No shared minimum target token. |
| Contrast-related styling | Color/alpha choices are evidenced; no contrast enforcement found. No blanket WCAG pass/fail is claimed. |
| Reduced motion | Partial CSS/JS coverage detailed in the motion report. |


## Objective implementation gaps (separate from redesign)

- ConfirmDialog lacks dialog/aria-modal/labelledby, focus trap, Escape handling and focus restoration: [components/ConfirmDialog.tsx:1](../components/ConfirmDialog.tsx#L1).
- Cookie customization lacks dialog semantics/trap/Escape. Preference/analytics switches lack explicit accessible names/switch states: [components/CookieBanner.tsx:1](../components/CookieBanner.tsx#L1).
- Notification bell is emoji-only without explicit aria-label/expanded association: [components/NotificationBell.tsx:1](../components/NotificationBell.tsx#L1).
- PasswordInput accepts no id/aria-invalid/aria-describedby prop; eye SVG18px with padding0: [components/PasswordInput.tsx:1](../components/PasswordInput.tsx#L1).
- TopNav mobile language options are clickable divs without button keyboard semantics: [components/TopNav.tsx:1](../components/TopNav.tsx#L1).
- Root html lang remains en after language selection: [app/layout.tsx:1](../app/layout.tsx#L1).
- Film lacks pause/skip/reduced-motion controller; orb equations are only partly suppressed: [components/titiza-film/film-sequencer.tsx:1](../components/titiza-film/film-sequencer.tsx#L1).
- Wordmark SVG has aria-label, but no explicit role=img/title: [components/Wordmark.tsx:1](../components/Wordmark.tsx#L1).
- Empty/404 components reference undefined brand-primary; no measured contrast conclusion.

A complete authenticated keyboard/screen-reader/contrast assessment was not performed. Behavior beyond source and captured focus: **Not established / not found.**

Every semantic/focus/ARIA/alt/label/interaction occurrence: [accessibility ledger](evidence/accessibility.md).
