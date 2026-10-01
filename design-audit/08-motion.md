# titeZMe — Motion

Audit date: 2026-10-01 (Europe/Madrid). Existing implementation only. Source occurrences do not establish live data, runtime reachability or design intent. No production code changed.

## Implementations

Existing motion uses CSS keyframes/transitions, Tailwind utilities, raw Three.js requestAnimationFrame and a separate film performance clock. For-shops scroll reveals use IntersectionObserver. Recharts provides chart presentation. No Framer Motion/GSAP dependency or route-level page-transition orchestrator found.


| Motion | Duration / easing / delay | Trigger / source |
|---|---|---|
| fadeUp | 400ms ease both; translateY16px→0 | Mount class; globals.css. |
| fadeIn | 400ms ease both; opacity0→1 | Mount/overlay; globals.css. |
| Pulse name collision | --animate-pulse: .6s ease; for-shops pulse scales1→1.03 with3s ease-in-out infinite | Skeleton/loading versus marketing CTA; same keyframe name. |
| Marquee | 20s linear infinite; X0→−50% | TopNav ticker; globals.css. |
| Access spinner | 800ms linear infinite | RouteGuard spin and AdminGuard ag-spin. |
| Language menu | 300ms all ease; chevron350ms cubic(.34,1.2,.64,1), stroke300ms; local langDropIn | TopNav toggle. |
| Regular button/link | Default150ms cubic(.4,0,.2,1), unless overridden | Local hover/color/opacity/transform utilities. |
| Cookie banner/modal | fadeUp/fadeIn400ms | Consent mount/Customize. |
| Titiza float | 7s ease-in-out infinite; Y0→−14px | Hero wrapper. |
| Titiza breathe | 6s ease-in-out infinite; opacity.55→.9, scale1→1.06 | Bloom/fallback; second delay1.5s. |
| Titiza drift | 22/26/30s ease-in-out infinite; delays0/4/8s | Ambient aurora blobs. |
| Titiza shimmer | 8s linear infinite; position−200→200% | Text gradient. |
| Titiza fade-up | 1s cubic(.16,1,.3,1); Y24px→0; delays.45s/.55+i×.12s/tile i×60ms | Cards and tiles mounting. |
| Titiza fade-in | 600ms ease-out both; Begin500ms override | Greeting/phase crossfade. |
| Glass hover | 500ms transform cubic(.16,1,.3,1), border/shadow ease | 6px lift/glow. |
| Beauty Profile timeline | 500ms cubic(.16,1,.3,1) | Grid0fr→1fr, opacity/margin. |
| Category selection | 500ms | Opacity30/100 and selected border/shadow. |
| Decision anchor | 700ms cubic(.65,0,.35,1); none reduced | Next animation frame wrapper travel. |
| Orb | 4.5s normal/1.5s reduced birth;8s heartbeat;1.2s trigger ring; damping6/.5/9 | Continuous Three.js loop; detailed equations in Titiza report. |
| Orbit labels | 1000ms ease-out;1800ms initial,2600ms visible,1400ms pause | Timer cycle; suppressed for reduced motion. |
| Film anchor | 900ms cubic(.4,0,.2,1); starts300ms into conversation scene | Elapsed timeline. |
| Film card/button | 300ms cubic(.4,0,.2,1), button delay120ms, transition200ms | Mount and simulated pressed state. |
| Before/after | 1200ms default crossfade; initial fade600ms | Elapsed swap of neutral panels. |
| Launch card | 500ms lines at1000/2500/3000ms; final fade1800ms | Final scene. |
| For-shops | FAQ max-height/opacity300ms ease; CTA pulse3s; other local reveal values | Observer/FAQ/CTA; embedded CSS. |


## Full exact source evidence

Every motion/hover/duration/easing/delay/keyframe/timer occurrence is in [motion evidence](evidence/motion.md). Multiline authored CSS: [embedded CSS](evidence/embedded-css.md). Installed framework defaults: [theme snapshot](evidence/framework-theme.css). Values remain separate; no timing normalization.

## Film scene/event timeline (milliseconds)


| Source | Exact authored timing / event |
|---|---|
| [components/titiza-film/film-sequencer.tsx:37](../components/titiza-film/film-sequencer.tsx#L37) | \| { at: number; kind: 'ring' } |
| [components/titiza-film/film-sequencer.tsx:38](../components/titiza-film/film-sequencer.tsx#L38) | \| { at: number; kind: 'state'; value: OrbState } |
| [components/titiza-film/film-sequencer.tsx:49](../components/titiza-film/film-sequencer.tsx#L49) | fadeIn: number |
| [components/titiza-film/film-sequencer.tsx:50](../components/titiza-film/film-sequencer.tsx#L50) | fadeOut: number |
| [components/titiza-film/film-sequencer.tsx:58](../components/titiza-film/film-sequencer.tsx#L58) | stagger: number |
| [components/titiza-film/film-sequencer.tsx:79](../components/titiza-film/film-sequencer.tsx#L79) | startStagger: number |
| [components/titiza-film/film-sequencer.tsx:80](../components/titiza-film/film-sequencer.tsx#L80) | appearDuration: number |
| [components/titiza-film/film-sequencer.tsx:81](../components/titiza-film/film-sequencer.tsx#L81) | pause: number |
| [components/titiza-film/film-sequencer.tsx:82](../components/titiza-film/film-sequencer.tsx#L82) | travelDuration: number |
| [components/titiza-film/film-sequencer.tsx:93](../components/titiza-film/film-sequencer.tsx#L93) | chipsAt: number |
| [components/titiza-film/film-sequencer.tsx:94](../components/titiza-film/film-sequencer.tsx#L94) | chipStagger: number |
| [components/titiza-film/film-sequencer.tsx:95](../components/titiza-film/film-sequencer.tsx#L95) | typeStartAt: number |
| [components/titiza-film/film-sequencer.tsx:96](../components/titiza-film/film-sequencer.tsx#L96) | typeDuration: number |
| [components/titiza-film/film-sequencer.tsx:97](../components/titiza-film/film-sequencer.tsx#L97) | sendAt: number |
| [components/titiza-film/film-sequencer.tsx:98](../components/titiza-film/film-sequencer.tsx#L98) | replyStartAt: number |
| [components/titiza-film/film-sequencer.tsx:99](../components/titiza-film/film-sequencer.tsx#L99) | replyHolds: number[] |
| [components/titiza-film/film-sequencer.tsx:111](../components/titiza-film/film-sequencer.tsx#L111) | line1At: number |
| [components/titiza-film/film-sequencer.tsx:112](../components/titiza-film/film-sequencer.tsx#L112) | line2At: number |
| [components/titiza-film/film-sequencer.tsx:113](../components/titiza-film/film-sequencer.tsx#L113) | line3At: number |
| [components/titiza-film/film-sequencer.tsx:114](../components/titiza-film/film-sequencer.tsx#L114) | lineFade: number |
| [components/titiza-film/film-sequencer.tsx:115](../components/titiza-film/film-sequencer.tsx#L115) | finalFadeOut: number |
| [components/titiza-film/film-sequencer.tsx:119](../components/titiza-film/film-sequencer.tsx#L119) | id: string |
| [components/titiza-film/film-sequencer.tsx:120](../components/titiza-film/film-sequencer.tsx#L120) | title: string |
| [components/titiza-film/film-sequencer.tsx:121](../components/titiza-film/film-sequencer.tsx#L121) | duration: number |
| [components/titiza-film/film-sequencer.tsx:137](../components/titiza-film/film-sequencer.tsx#L137) | id: 's1', |
| [components/titiza-film/film-sequencer.tsx:138](../components/titiza-film/film-sequencer.tsx#L138) | title: 'Black Screen', |
| [components/titiza-film/film-sequencer.tsx:139](../components/titiza-film/film-sequencer.tsx#L139) | duration: 3000, |
| [components/titiza-film/film-sequencer.tsx:147](../components/titiza-film/film-sequencer.tsx#L147) | id: 's2', |
| [components/titiza-film/film-sequencer.tsx:148](../components/titiza-film/film-sequencer.tsx#L148) | title: 'The Birth of Titiza', |
| [components/titiza-film/film-sequencer.tsx:149](../components/titiza-film/film-sequencer.tsx#L149) | duration: 11000, |
| [components/titiza-film/film-sequencer.tsx:152](../components/titiza-film/film-sequencer.tsx#L152) | { at: 7500, kind: 'ring' }, |
| [components/titiza-film/film-sequencer.tsx:153](../components/titiza-film/film-sequencer.tsx#L153) | { at: 7500, kind: 'state', value: 'bright' }, |
| [components/titiza-film/film-sequencer.tsx:154](../components/titiza-film/film-sequencer.tsx#L154) | { at: 9000, kind: 'state', value: 'idle' }, |
| [components/titiza-film/film-sequencer.tsx:160](../components/titiza-film/film-sequencer.tsx#L160) | hold: 2500, |
| [components/titiza-film/film-sequencer.tsx:169](../components/titiza-film/film-sequencer.tsx#L169) | id: 's2b', |
| [components/titiza-film/film-sequencer.tsx:170](../components/titiza-film/film-sequencer.tsx#L170) | title: 'First Conversation', |
| [components/titiza-film/film-sequencer.tsx:173](../components/titiza-film/film-sequencer.tsx#L173) | duration: 10600, |
| [components/titiza-film/film-sequencer.tsx:179](../components/titiza-film/film-sequencer.tsx#L179) | { at: 4350, kind: 'ring' }, |
| [components/titiza-film/film-sequencer.tsx:183](../components/titiza-film/film-sequencer.tsx#L183) | { at: 4400, kind: 'state', value: 'bright' }, |
| [components/titiza-film/film-sequencer.tsx:184](../components/titiza-film/film-sequencer.tsx#L184) | { at: 4650, kind: 'state', value: 'idle' }, |
| [components/titiza-film/film-sequencer.tsx:185](../components/titiza-film/film-sequencer.tsx#L185) | { at: 5300, kind: 'state', value: 'bright' }, |
| [components/titiza-film/film-sequencer.tsx:186](../components/titiza-film/film-sequencer.tsx#L186) | { at: 5550, kind: 'state', value: 'idle' }, |
| [components/titiza-film/film-sequencer.tsx:187](../components/titiza-film/film-sequencer.tsx#L187) | { at: 7300, kind: 'state', value: 'bright' }, |
| [components/titiza-film/film-sequencer.tsx:188](../components/titiza-film/film-sequencer.tsx#L188) | { at: 7550, kind: 'state', value: 'idle' }, |
| [components/titiza-film/film-sequencer.tsx:189](../components/titiza-film/film-sequencer.tsx#L189) | { at: 9500, kind: 'state', value: 'bright' }, |
| [components/titiza-film/film-sequencer.tsx:190](../components/titiza-film/film-sequencer.tsx#L190) | { at: 9750, kind: 'state', value: 'idle' }, |
| [components/titiza-film/film-sequencer.tsx:206](../components/titiza-film/film-sequencer.tsx#L206) | chipsAt: 250, |
| [components/titiza-film/film-sequencer.tsx:207](../components/titiza-film/film-sequencer.tsx#L207) | chipStagger: 150, |
| [components/titiza-film/film-sequencer.tsx:208](../components/titiza-film/film-sequencer.tsx#L208) | typeStartAt: 1400, |
| [components/titiza-film/film-sequencer.tsx:209](../components/titiza-film/film-sequencer.tsx#L209) | typeDuration: 900, |
| [components/titiza-film/film-sequencer.tsx:210](../components/titiza-film/film-sequencer.tsx#L210) | sendAt: 2550, |
| [components/titiza-film/film-sequencer.tsx:211](../components/titiza-film/film-sequencer.tsx#L211) | replyStartAt: 3100, |
| [components/titiza-film/film-sequencer.tsx:212](../components/titiza-film/film-sequencer.tsx#L212) | replyHolds: [900, 2000, 2200, 900], |
| [components/titiza-film/film-sequencer.tsx:217](../components/titiza-film/film-sequencer.tsx#L217) | id: 's3', |
| [components/titiza-film/film-sequencer.tsx:218](../components/titiza-film/film-sequencer.tsx#L218) | title: 'Learning About You', |
| [components/titiza-film/film-sequencer.tsx:219](../components/titiza-film/film-sequencer.tsx#L219) | duration: 8000, |
| [components/titiza-film/film-sequencer.tsx:228](../components/titiza-film/film-sequencer.tsx#L228) | stagger: 900, |
| [components/titiza-film/film-sequencer.tsx:229](../components/titiza-film/film-sequencer.tsx#L229) | revealDuration: 250, |
| [components/titiza-film/film-sequencer.tsx:236](../components/titiza-film/film-sequencer.tsx#L236) | hold: 1900, |
| [components/titiza-film/film-sequencer.tsx:242](../components/titiza-film/film-sequencer.tsx#L242) | id: 's4', |
| [components/titiza-film/film-sequencer.tsx:243](../components/titiza-film/film-sequencer.tsx#L243) | title: 'Finding the Right Analyst', |
| [components/titiza-film/film-sequencer.tsx:247](../components/titiza-film/film-sequencer.tsx#L247) | duration: 6500, |
| [components/titiza-film/film-sequencer.tsx:250](../components/titiza-film/film-sequencer.tsx#L250) | { at: 0, kind: 'state', value: 'thinking' }, |
| [components/titiza-film/film-sequencer.tsx:251](../components/titiza-film/film-sequencer.tsx#L251) | { at: 3000, kind: 'state', value: 'idle' }, |
| [components/titiza-film/film-sequencer.tsx:258](../components/titiza-film/film-sequencer.tsx#L258) | stagger: 650, |
| [components/titiza-film/film-sequencer.tsx:269](../components/titiza-film/film-sequencer.tsx#L269) | pressAt: 2400, // scene ~5400ms |
| [components/titiza-film/film-sequencer.tsx:274](../components/titiza-film/film-sequencer.tsx#L274) | id: 's5', |
| [components/titiza-film/film-sequencer.tsx:275](../components/titiza-film/film-sequencer.tsx#L275) | title: 'Time Skip', |
| [components/titiza-film/film-sequencer.tsx:277](../components/titiza-film/film-sequencer.tsx#L277) | duration: 1400, |
| [components/titiza-film/film-sequencer.tsx:284](../components/titiza-film/film-sequencer.tsx#L284) | id: 's6', |
| [components/titiza-film/film-sequencer.tsx:285](../components/titiza-film/film-sequencer.tsx#L285) | title: 'Titiza Learns', |
| [components/titiza-film/film-sequencer.tsx:286](../components/titiza-film/film-sequencer.tsx#L286) | duration: 6200, |
| [components/titiza-film/film-sequencer.tsx:291](../components/titiza-film/film-sequencer.tsx#L291) | { at: 1250, kind: 'ring' }, |
| [components/titiza-film/film-sequencer.tsx:292](../components/titiza-film/film-sequencer.tsx#L292) | { at: 1600, kind: 'ring' }, |
| [components/titiza-film/film-sequencer.tsx:293](../components/titiza-film/film-sequencer.tsx#L293) | { at: 1950, kind: 'ring' }, |
| [components/titiza-film/film-sequencer.tsx:294](../components/titiza-film/film-sequencer.tsx#L294) | { at: 2300, kind: 'ring' }, |
| [components/titiza-film/film-sequencer.tsx:295](../components/titiza-film/film-sequencer.tsx#L295) | { at: 2650, kind: 'ring' }, |
| [components/titiza-film/film-sequencer.tsx:296](../components/titiza-film/film-sequencer.tsx#L296) | { at: 3000, kind: 'ring' }, |
| [components/titiza-film/film-sequencer.tsx:297](../components/titiza-film/film-sequencer.tsx#L297) | { at: 3350, kind: 'ring' }, |
| [components/titiza-film/film-sequencer.tsx:304](../components/titiza-film/film-sequencer.tsx#L304) | startStagger: 350, |
| [components/titiza-film/film-sequencer.tsx:305](../components/titiza-film/film-sequencer.tsx#L305) | appearDuration: 250, |
| [components/titiza-film/film-sequencer.tsx:306](../components/titiza-film/film-sequencer.tsx#L306) | pause: 200, |
| [components/titiza-film/film-sequencer.tsx:307](../components/titiza-film/film-sequencer.tsx#L307) | travelDuration: 800, |
| [components/titiza-film/film-sequencer.tsx:314](../components/titiza-film/film-sequencer.tsx#L314) | hold: 1200, |
| [components/titiza-film/film-sequencer.tsx:320](../components/titiza-film/film-sequencer.tsx#L320) | id: 's7', |
| [components/titiza-film/film-sequencer.tsx:321](../components/titiza-film/film-sequencer.tsx#L321) | title: 'Upload Today\'s Hair', |
| [components/titiza-film/film-sequencer.tsx:322](../components/titiza-film/film-sequencer.tsx#L322) | duration: 9000, |
| [components/titiza-film/film-sequencer.tsx:329](../components/titiza-film/film-sequencer.tsx#L329) | hold: 2400, |
| [components/titiza-film/film-sequencer.tsx:336](../components/titiza-film/film-sequencer.tsx#L336) | stagger: 900, |
| [components/titiza-film/film-sequencer.tsx:342](../components/titiza-film/film-sequencer.tsx#L342) | id: 's8', |
| [components/titiza-film/film-sequencer.tsx:343](../components/titiza-film/film-sequencer.tsx#L343) | title: 'Recommendation', |
| [components/titiza-film/film-sequencer.tsx:346](../components/titiza-film/film-sequencer.tsx#L346) | duration: 6100, |
| [components/titiza-film/film-sequencer.tsx:354](../components/titiza-film/film-sequencer.tsx#L354) | id: 's9', |
| [components/titiza-film/film-sequencer.tsx:355](../components/titiza-film/film-sequencer.tsx#L355) | title: 'Finding the Right Barber', |
| [components/titiza-film/film-sequencer.tsx:359](../components/titiza-film/film-sequencer.tsx#L359) | duration: 9100, |
| [components/titiza-film/film-sequencer.tsx:362](../components/titiza-film/film-sequencer.tsx#L362) | { at: 2800, kind: 'state', value: 'thinking' }, |
| [components/titiza-film/film-sequencer.tsx:363](../components/titiza-film/film-sequencer.tsx#L363) | { at: 6100, kind: 'state', value: 'idle' }, |
| [components/titiza-film/film-sequencer.tsx:370](../components/titiza-film/film-sequencer.tsx#L370) | hold: 1300, |
| [components/titiza-film/film-sequencer.tsx:377](../components/titiza-film/film-sequencer.tsx#L377) | stagger: 600, |
| [components/titiza-film/film-sequencer.tsx:387](../components/titiza-film/film-sequencer.tsx#L387) | pressAt: 1600, // scene ~7700ms |
| [components/titiza-film/film-sequencer.tsx:388](../components/titiza-film/film-sequencer.tsx#L388) | confirmAt: 2000, // scene ~8100ms ("Booked."), then +1000ms hold to 9100 |
| [components/titiza-film/film-sequencer.tsx:394](../components/titiza-film/film-sequencer.tsx#L394) | id: 's10', |
| [components/titiza-film/film-sequencer.tsx:395](../components/titiza-film/film-sequencer.tsx#L395) | title: 'More Than Hair', |
| [components/titiza-film/film-sequencer.tsx:396](../components/titiza-film/film-sequencer.tsx#L396) | duration: 5200, |
| [components/titiza-film/film-sequencer.tsx:404](../components/titiza-film/film-sequencer.tsx#L404) | visibleDuration: 950, |
| [components/titiza-film/film-sequencer.tsx:405](../components/titiza-film/film-sequencer.tsx#L405) | overlap: 150, |
| [components/titiza-film/film-sequencer.tsx:411](../components/titiza-film/film-sequencer.tsx#L411) | id: 's11', |
| [components/titiza-film/film-sequencer.tsx:412](../components/titiza-film/film-sequencer.tsx#L412) | title: 'Final Message', |
| [components/titiza-film/film-sequencer.tsx:417](../components/titiza-film/film-sequencer.tsx#L417) | duration: 3400, |
| [components/titiza-film/film-sequencer.tsx:421](../components/titiza-film/film-sequencer.tsx#L421) | { at: 2100, kind: 'ring' }, |
| [components/titiza-film/film-sequencer.tsx:422](../components/titiza-film/film-sequencer.tsx#L422) | { at: 2100, kind: 'state', value: 'bright' }, |
| [components/titiza-film/film-sequencer.tsx:428](../components/titiza-film/film-sequencer.tsx#L428) | hold: 1100, |
| [components/titiza-film/film-sequencer.tsx:434](../components/titiza-film/film-sequencer.tsx#L434) | id: 'end', |
| [components/titiza-film/film-sequencer.tsx:435](../components/titiza-film/film-sequencer.tsx#L435) | title: 'End Card', |
| [components/titiza-film/film-sequencer.tsx:437](../components/titiza-film/film-sequencer.tsx#L437) | duration: 2800, |
| [components/titiza-film/film-sequencer.tsx:445](../components/titiza-film/film-sequencer.tsx#L445) | fadeIn: 400, |
| [components/titiza-film/film-sequencer.tsx:446](../components/titiza-film/film-sequencer.tsx#L446) | fadeOut: 400, |
| [components/titiza-film/film-sequencer.tsx:454](../components/titiza-film/film-sequencer.tsx#L454) | id: 'launch', |
| [components/titiza-film/film-sequencer.tsx:455](../components/titiza-film/film-sequencer.tsx#L455) | title: 'Launch Date', |
| [components/titiza-film/film-sequencer.tsx:457](../components/titiza-film/film-sequencer.tsx#L457) | duration: 7800, |
| [components/titiza-film/film-sequencer.tsx:465](../components/titiza-film/film-sequencer.tsx#L465) | line1At: 1000, // ~1000ms of black first |
| [components/titiza-film/film-sequencer.tsx:466](../components/titiza-film/film-sequencer.tsx#L466) | line2At: 2500, // ~500ms after line 1 has held ~1000ms |
| [components/titiza-film/film-sequencer.tsx:467](../components/titiza-film/film-sequencer.tsx#L467) | line3At: 3000, // same ~500ms cadence after line 2 |
| [components/titiza-film/film-sequencer.tsx:468](../components/titiza-film/film-sequencer.tsx#L468) | lineFade: 500, |
| [components/titiza-film/film-sequencer.tsx:469](../components/titiza-film/film-sequencer.tsx#L469) | finalFadeOut: 1800, // slower than the film's other fades (this is the close) |


## Reduced-motion implementation

The global reduce rule disables Titiza float/breathe/drift/fade-up/shimmer, but omits fade-in. OrbitLabels suppresses cycling. DecisionFlow and PathAnalysis shorten staged delays. Three.js suppresses quick pulse/thinking and slows dust, while several ongoing rotation/breathing/pointer equations continue. Greeting still adds1/2.7/3.5s after shortened birth. Film has no reduced-motion branch or pause controller. Global marquee/spinner/for-shops suppression: **Not established / not found.**
