# titeZMe — Titiza

Audit date: 2026-10-01. Protected implementation and public film simulations are recorded separately.

## Production interface and access

[/dashboard/client/titiza](../app/dashboard/client/titiza/page.tsx) uses loading, genesis, dashboard and phase2 states. The client layout and RouteGuard require authentication/profile access. appUser.titiza.hasMet selects first versus returning meeting; [markTitizaMet/touchTitizaVisit](../lib/titiza-utils.ts) write user visit markers. Cormorant Garamond weights 300/400/500/600 are loaded only on this route.

[Feature-flag comments](../lib/titiza-phase2-flag.ts) say phase two defaults OFF. The actual TEMP_ENABLE_GLOBALLY boolean is true and bypasses environment/UID gating. Returning users and Begin therefore enter phase2. Phase-one dashboard/BeautyProfileCard/FeatureCards still exist as alternate branches, but are bypassed after Begin with this checked-in flag.

## Procedural orb: exact implementation

[TitizaCore](../components/titiza/titiza-core.tsx) dynamically imports the scene with SSR disabled. Its loading fallback is a 160px gold/20 circle, blur-2xl, breathing. The wrapper is aspect-square, full width, max 720px.

| Layer | Existing values |
|---|---|
| Bloom/reflection | 70% gold/25 circle, blur 90px; 40% gold-soft/30 circle, blur 60px, delay 1.5s. Reflection bottom 6%, height 40px, width 55%, gold/15, blur-xl. |
| Renderer/camera | Raw Three.js WebGLRenderer, antialias/alpha enabled, high-performance preference, transparent clear; DPR capped at 2. Perspective 42°, near 0.1/far 100, camera z=6; resize updates camera and canvas. |
| Palette/lights | GOLD #e8c47a; GOLD_BRIGHT #f7e6b4; rim #8a6a2a. White ambient 0.7, key 2.5, rim 1.2, directional 1.4. |
| Core | IcosahedronGeometry(1,4), metalness .92, roughness .22, emissive intensity .65. Heart scale .55 + sin(t×.7)×.028; inner sphere uses additive glow. |
| Energy shells | Radius 1.3 / intensity 1.7 / displacement .09 / opacity .9. Second: radius 1.55 / intensity .9 / displacement .05 / speed −.4 / opacity .5. Custom Fresnel/additive shaders. |
| Glint/wire | Circle radius .32, 32 segments, position(−.55,.7,1.15), opacity .3. Wire icosahedron scale 1.85, opacity .06. |
| Orbital rings | A: radius1.95, tube .012, opacity .4, speed .16, tilt[π/2.3,.4,0]. B: radius2.45, tube .008, opacity .22, speed −.1, tilt[π/3.2,−.5,.3]. |
| Particle stream | 900 points; radius .6–3.6; speed .12 + random×.22; size .026; opacity .7; additive blending; inward flow and outward respawn. |
| Ambient dust | 10 points; radius 2–2.7; size .03; opacity .55; speed .025, reduced to .01 under reduced motion. |
| Genesis | 140 particles, size .05, target radius1.2–1.9. 0–.8s seed; .8–1.8s spawn; 1.8–2.8s converge; 2.8–4.5s resolve/spring/ring. Reduced sequence 1.5s. |
| Reactions | Heartbeat every 8s; trigger ring 1.2s with scale1+p×2.4 and opacity(1−p)×.5. Glow target .13 (.06 reduced), damping6/release.5; pulse damping9. Thinking sin(t×4) adds .03 scale and .25 emissive. |
| Pointer tracking | Global pointermove; rotation X −.25 / Y .35, damp1.6; position X .22 / Y .16, damp1.4. Orb itself has no click action. |

All equations, shaders, geometry and material values remain in [TitizaCoreScene](../components/titiza/titiza-core-scene.tsx) and the [source inventory](evidence/source-inventory.json).

[OrbitLabels](../components/titiza/orbit-labels.tsx) positions Hair Profile, Beauty Profile, Professional Analysis, Recommendations and Verified Data by explicit percentages. Initial delay1800ms, visible2600ms, pause1400ms, transition1000ms ease-out. Label cycling is skipped under reduced motion.

## Ambient CSS, glass and colors

[AmbientBackground](../components/titiza/ambient-background.tsx) uses a radial base (120% 90% at 50% −10%) with OKLCH stops (.24 .03 75), (.16 .008 60), (.12 .006 55). Three blobs: 42/38/34vw, blur120/130/120px, alpha8/8/6%, duration22/26/30s, delay0/4/8s. Fine grid64px, opacity .04. Vignette is transparent to55%, then OKLCH(.1 .006 55/.7).

[Global CSS](../app/globals.css) defines glass gradient160° from OKLCH(.28 .012 70/45%) to(.19 .01 65/35%), backdrop blur20px/saturate120%, border alpha12%. Hover lifts6px, border alpha28%, shadow0 30px 80px −40px gold/35%, with500ms transform cubic-bezier(.16,1,.3,1). Exact authored color syntax is preserved in [tokens](02-design-tokens.md) and [full CSS](evidence/embedded-css.md).

## Interactive choreography and unfinished exits

[TitizaHero](../components/titiza/titiza-hero.tsx) adds greetings at +1000ms/+2700ms and Begin at +3500ms after birth completion (normal approximately5.5/7.2/8s).

[DecisionFlow](../components/titiza/titiza-decision-flow.tsx) moves the wrapper18vh→0 in700ms cubic-bezier(.65,0,.35,1). Question1200ms, seed1500ms, tiles1800ms. [CategoryGrid](../components/titiza/category-grid.tsx) starts five categories plus More; expansion occurs in place. Selection dims others to30%, locks the grid during thinking, and supports arrows/Home/End. Branching uses category.titizaEntryMode from [professions](../lib/professions.ts).

Thinking holds1000ms first selection,600ms later,0 reduced. [PathAnalysis](../components/titiza/path-analysis.tsx) reveals invitations2200/2800ms and card4200ms; Start exits and logs a no-op after1200ms (0 reduced). [PathDirect](../components/titiza/path-direct.tsx) Explore and Notify log no-ops. [BeautyProfileCard](../components/titiza/beauty-profile-card.tsx) primary booking CTA has no handler; the information timeline expands.

Persisted/editable Beauty Profile, working analysis destination, live chat backend and real recommendation results: **Not implemented.**

## Public film interfaces

English/Spanish preview routes use [FilmSequencer](../components/titiza-film/film-sequencer.tsx) and locale copy from [content.ts](../components/titiza-film/content.ts). Structure/timing is shared. A requestAnimationFrame/performance clock drives greeting, chat, profile-check, analyst, time-skip, analysis chips, checklist/photo, before/after, barber/booking, montage, end and launch-date scenes.

ChatInputShell simulates query/send/replies. ProfessionalCard pressed/confirmed states derive from elapsed time, with tabIndex −1 and no navigation. BeforeAfterSwap renders neutral shapes, not real photographs.

Film uses fixed inset0/z100/black; orb70vmin capped460px; anchor translateY(−26vh)scale(.72) in900ms cubic-bezier(.4,0,.2,1); contentpx6/pb12vh. Films do not load the protected route's Cormorant variable; font-serif falls back. Captures explicitly identify scripted simulation.

All related files are listed in the [repository inventory](evidence/repository-files.md), under components/titiza, components/titiza-film, lib/titiza*, lib/professions and Titiza page/preview routes. No bundled Titiza bitmap/model/video asset found. [Screenshot coverage](12-screenshot-index.md).
