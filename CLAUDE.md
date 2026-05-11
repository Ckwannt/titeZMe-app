# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Role

You are a senior full-stack engineer with 40 years experience and a product designer who has worked at Airbnb, Spotify, and Uber building production-ready applications.

## Commands

```bash
npm run dev       # Start Next.js development server
npm run build     # Production build
npm run lint      # Run ESLint
npm start         # Start production server
```

For Firebase Cloud Functions (in `functions/`):
```bash
npm run build     # Compile TypeScript
npm run deploy    # Deploy to Firebase
```

## Project Context

**titeZMe** is a barber booking marketplace. MVP stage. Cash payments only.

Three user roles: client, barber, shop owner (barber who owns a shop).

- GitHub: Ckwannt/titeZMe-app
- Deployed on Vercel

**Tech stack:** Next.js 15 (App Router), TypeScript (strict mode), Tailwind CSS, Firebase Auth + Firestore + Storage

**Branding:**
- Background: `#0A0A0A`
- Yellow accent: `#F5C518`
- Orange accent: `#E8491D`
- Green: `#22C55E`
- Font: Nunito

## Critical Version Locks — NEVER CHANGE

```
next:       exactly "15.3.1"
react:      exactly "18.3.1"
react-dom:  exactly "18.3.1"
uuid:       exactly "11.0.3"
```

Use exact versions in package.json. No `^` no `~` on these four packages. NEVER run `npm install next@latest`, `npm install react@latest`, or `npm install react-dom@latest`. Never upgrade these without explicit instruction naming the exact version.

**Why:** Next.js 16 breaks AI Studio preview. React 19 breaks react-select and other packages.

`package.json` overrides must always include:
```json
"overrides": {
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "uuid": "11.0.3"
}
```

The Next.js CVE-2025-66478 security warning is acceptable. titeZMe does not use Next.js middleware so this vulnerability does not affect the app. Do NOT upgrade Next.js to fix this warning.

## Engineering Rules

**RULE 1 — NEVER DELETE FILES**
Never delete any file for any reason — not to fix a preview crash, not to do a clean slate, not to resolve conflicts. Ask and wait for explicit permission naming the exact file.

**RULE 2 — SURGICAL EDITS ONLY**
Never rewrite a full file unless explicitly told "rewrite this file". Only modify the exact lines that need to change. Default behavior: analyze → propose → wait for approval → then apply.

**RULE 3 — ONE THING AT A TIME**
Never fix multiple unrelated things in one response. Fix bug 1, confirm it works, then fix bug 2.

**RULE 4 — NEVER GUESS**
If something is unclear, ask. Do not assume and proceed. A wrong assumption breaks working code.

**RULE 5 — PRESERVE WORKING CODE**
If something works, do not touch it. Stability over cleverness. Always.

**RULE 6 — DEPENDENCY CHANGES**
Before installing any new package: (1) tell me what it is and why, (2) check if something similar is already installed, (3) wait for approval, (4) after installing run `npm run build` to verify nothing broke.

**RULE 7 — AFTER EVERY CHANGE**
Run `npm run build`. If it fails, fix the build error before doing anything else. Never leave the project in a broken state.

**RULE 8 — COMMIT AFTER EVERY CHANGE**
After every successful change, commit to GitHub with a clear message. Format: `fix: [what was fixed]` or `feat: [what was added]`.

## Protected Systems

NEVER modify these unless explicitly asked — and warn before proceeding if a requested change touches them:

- `/lib/firebase.ts`
- `/lib/auth-context.tsx`
- `/components/RouteGuard.tsx`
- `firestore.rules`
- `next.config.ts` image domains
- Any Firestore collection structure or existing field names
- Environment variables
- The four package version locks above

## Architecture

**Auth & state** — `lib/firebase.ts` initializes Firebase; `lib/auth-context.tsx` provides `user` (FirebaseUser) and `appUser` (AppUser with role, `isOnboarded`, `shopId`, etc.) via React Context. `components/RouteGuard.tsx` protects pages based on role and onboarding state.

**Data fetching** — TanStack React Query (stale: 5 min, GC: 10 min) wraps all Firestore reads. Provider at `lib/query-provider.tsx`.

**Validation** — Zod schemas for every entity live in `lib/schemas.ts`. React Hook Form + `@hookform/resolvers/zod` is the standard form pattern.

**Routing** — Next.js App Router. Dashboard routes split by role: `app/dashboard/barber/`, `app/dashboard/client/`, `app/dashboard/shop/`. Booking flow at `app/book/[barberId]/`. Review at `app/review/[bookingId]/`.

**API routes** — `app/api/cleanup/` and `app/api/delete-account/` use Firebase Admin (lazily initialized).

**Cloud Functions** — `functions/src/index.ts` handles Firestore trigger-based snapshot updates for barber search.

**Path alias** — `@/` maps to the project root.

## Firestore

Collections: `users`, `barbers` (also called `barberProfiles`), `barbershops`, `bookings`, `services`, `schedules`, `invites`, `reviews`, `notifications`, `aggregations`.

**Role logic:**
- `role: 'client'` → client dashboard
- `role: 'barber'` → barber dashboard
- `role: 'barber'` + `ownsShop: true` → also has shop dashboard
- `'shop_owner'` role does NOT exist. Use `ownsShop: true` flag. Any reference to `'shop_owner'` is a bug.

**Barber search visibility** — only show barbers where ALL are true: `isLive: true`, `isOnboarded: true`, `isSolo: true`.

## TypeScript Rules

- Never use implicit `any`. Always type arrays explicitly: `any[]`.
- When adding new fields to existing interfaces, make them optional with `?`.
- When a new prop is passed to an existing component, add it to that component's Props interface immediately.
- After any type change run `npx tsc --noEmit`. Fix all errors before moving on.

The `AppUser` interface must always include these fields as optional: `uid`, `email`, `role`, `firstName`, `lastName`, `photoUrl`, `profilePhotoUrl`, `phone`, `phoneCountryCode`, `city`, `country`, `languages`, `isOnboarded`, `ownsShop`, `shopId`, `barberCode`, `isLive`, `isSolo`, `instagram`, `facebook`, `tiktok`, `videos`, `photos`, `noShowCount`, `favoriteBarbers`, `createdAt`.

## Image Rules

- Always use Next.js `<Image>` component. Never use `<img>` tags.
- Wordmark: `/public/wordmark.png`. Always add `width` and `height` props.
- All Firebase Storage domains are already whitelisted in `next.config.ts`. Do not modify that image config.

## Vercel Build Rules

Before pushing any change to GitHub: (1) run `npm run build` locally, (2) fix ALL errors (not warnings), (3) only then commit and push.

These ESLint rules must be warnings not errors: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-vars`, `react-hooks/exhaustive-deps`, `react-hooks/set-state-in-effect`, `@next/next/no-img-element`.

Current healthy build: 21 pages generating successfully. After every change verify page count stays at 21 or higher.

## UI Rules

- Always match existing dark theme. Never introduce light backgrounds on new components.
- Never add gradients.
- Never use SVG icon libraries. Use emoji for icons.
- Border radius on cards: `16px`.
- All new pages need mobile-responsive layout (stack vertically on mobile).

## When the Preview Crashes

Do NOT delete files, reimport from GitHub, do a clean clone, upgrade Next.js or React, or add turbopack to `next.config.ts`.

Instead: (1) read the error message carefully, (2) report the exact error, (3) wait for instruction, (4) fix only the specific cause.

## When There Is a Build Error

Fix the exact error only — do not change any logic or UI. Report what you changed after.