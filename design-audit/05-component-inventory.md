# titeZMe — Component inventory

Audit date: 2026-10-01 (Europe/Madrid). Existing implementation only. Source occurrences do not establish live data, runtime reachability or design intent. No production code changed.

## Counting convention

58 TSX files; 62 exported JSX function components including guards/wrappers, plus ErrorBoundary class. PresenceTracker has no visual body. Not all are reused in multiple routes. No common general Button/Card/Input/Badge API found.

## Summary


| Component/source | Variants/states | JSX consumers |
|---|---|---|
| AdminGuard — [components/AdminGuard.tsx:36](../components/AdminGuard.tsx#L36) | Guard/wrapper; exact props/state below. | [app/admin/(protected)/layout.tsx:123](../app/admin/(protected)/layout.tsx#L123) |
| AvailabilityGrid — [components/AvailabilityGrid.tsx:33](../components/AvailabilityGrid.tsx#L33) | Weekly availability editor; barber/shop/client modes, drag selection, buffer/blocked dates, loading/saving/autosave. | [app/dashboard/barber/availability/page.tsx:14](../app/dashboard/barber/availability/page.tsx#L14) |
| BarberInvitesTab — [components/BarberInvitesTab.tsx:10](../components/BarberInvitesTab.tsx#L10) | Invitation acceptance/decline and connection state. | [app/dashboard/barber/invites/page.tsx:6](../app/dashboard/barber/invites/page.tsx#L6) |
| BarberPortfolioTab — [components/BarberPortfolioTab.tsx:18](../components/BarberPortfolioTab.tsx#L18) | Existing media removal; additions use coming-soon notification. | [app/dashboard/barber/portfolio/page.tsx:18](../app/dashboard/barber/portfolio/page.tsx#L18) |
| BarberSettingsTab — [components/BarberSettingsTab.tsx:36](../components/BarberSettingsTab.tsx#L36) | Profile, location, languages, biography, specialty and vibe. | [app/dashboard/barber/settings/page.tsx:18](../app/dashboard/barber/settings/page.tsx#L18) |
| ChallengeHomepageBox — [components/ChallengeHomepageBox.tsx:16](../components/ChallengeHomepageBox.tsx#L16) | Configuration, phase, countdown and CTA. | [app/LandingPageClient.tsx:133](../app/LandingPageClient.tsx#L133) |
| ChallengeLocationGate — [components/ChallengeLocationGate.tsx:40](../components/ChallengeLocationGate.tsx#L40) | Spain eligibility or child content. | [app/dashboard/barber/challenge/page.tsx:19](../app/dashboard/barber/challenge/page.tsx#L19); [app/dashboard/shop/challenge/page.tsx:31](../app/dashboard/shop/challenge/page.tsx#L31) |
| ChallengePaymentTab — [components/ChallengePaymentTab.tsx:25](../components/ChallengePaymentTab.tsx#L25) | Barber/shop role, fee, reference, IBAN, declaration and status. | [app/dashboard/barber/challenge/payment/page.tsx:6](../app/dashboard/barber/challenge/payment/page.tsx#L6); [app/dashboard/shop/challenge/payment/page.tsx:6](../app/dashboard/shop/challenge/payment/page.tsx#L6) |
| ChallengeSubmissionTab — [components/ChallengeSubmissionTab.tsx:222](../components/ChallengeSubmissionTab.tsx#L222) | Barber/shop role, uploads, validation, phase, rejection, editing and status. | [app/dashboard/barber/challenge/page.tsx:23](../app/dashboard/barber/challenge/page.tsx#L23); [app/dashboard/shop/challenge/page.tsx:35](../app/dashboard/shop/challenge/page.tsx#L35) |
| ComingSoon — [components/ComingSoon.tsx:18](../components/ComingSoon.tsx#L18) | Emoji/title/body, optional notify, sending/done. | [app/dashboard/client/badges/page.tsx:12](../app/dashboard/client/badges/page.tsx#L12); [app/dashboard/client/gift-a-cut/page.tsx:12](../app/dashboard/client/gift-a-cut/page.tsx#L12); [app/dashboard/client/messages/page.tsx:12](../app/dashboard/client/messages/page.tsx#L12); [app/dashboard/client/my-look/page.tsx:12](../app/dashboard/client/my-look/page.tsx#L12) |
| ConditionalNav — [components/ConditionalNav.tsx:28](../components/ConditionalNav.tsx#L28) | Guard/wrapper; exact props/state below. | [app/layout.tsx:69](../app/layout.tsx#L69) |
| ConfirmDialog — [components/ConfirmDialog.tsx:14](../components/ConfirmDialog.tsx#L14) | Open/closed, labels/title/message and confirm color. | [app/dashboard/barber/bookings/page.tsx:340](../app/dashboard/barber/bookings/page.tsx#L340); [app/dashboard/barber/services/page.tsx:224](../app/dashboard/barber/services/page.tsx#L224); [app/dashboard/client/bookings/page.tsx:307](../app/dashboard/client/bookings/page.tsx#L307) |
| CookieBanner — [components/CookieBanner.tsx:12](../components/CookieBanner.tsx#L12) | Consent card, Customize, switches and local persistence. | [app/layout.tsx:72](../app/layout.tsx#L72) |
| CountdownTimer — [components/CountdownTimer.tsx:10](../components/CountdownTimer.tsx#L10) | Target/date segments. | [app/challenge/page.tsx:274](../app/challenge/page.tsx#L274); [components/ChallengeHomepageBox.tsx:115](../components/ChallengeHomepageBox.tsx#L115) |
| DeleteAccountButton — [components/DeleteAccountButton.tsx:46](../components/DeleteAccountButton.tsx#L46) | Client/professional, confirmation, reauthentication, Google/password, deleting/error. | [app/dashboard/client/layout.tsx:91](../app/dashboard/client/layout.tsx#L91); [app/dashboard/client/settings/page.tsx:468](../app/dashboard/client/settings/page.tsx#L468); [components/BarberSettingsTab.tsx:1221](../components/BarberSettingsTab.tsx#L1221) |
| EmptySearch — [components/EmptyStates.tsx:4](../components/EmptyStates.tsx#L4) | Optional city; no results. | No direct JSX consumer found; dynamic/export use requires separate check. |
| EmptyClientBookings — [components/EmptyStates.tsx:14](../components/EmptyStates.tsx#L14) | No bookings; discovery link. | No direct JSX consumer found; dynamic/export use requires separate check. |
| EmptyBarberBookings — [components/EmptyStates.tsx:30](../components/EmptyStates.tsx#L30) | No appointments. | No direct JSX consumer found; dynamic/export use requires separate check. |
| EmptyFavourites — [components/EmptyStates.tsx:40](../components/EmptyStates.tsx#L40) | No favorites. | No direct JSX consumer found; dynamic/export use requires separate check. |
| Footer — [components/Footer.tsx:7](../components/Footer.tsx#L7) | Legal/acquisition/cookie links. | [components/ConditionalNav.tsx:50](../components/ConditionalNav.tsx#L50) |
| NotificationBell — [components/NotificationBell.tsx:10](../components/NotificationBell.tsx#L10) | Badge, unread dropdown, empty state; opening writes count. | [components/TopNav.tsx:294](../components/TopNav.tsx#L294) |
| OfflineBanner — [components/OfflineBanner.tsx:6](../components/OfflineBanner.tsx#L6) | Online/offline banner. | [app/layout.tsx:68](../app/layout.tsx#L68) |
| PasswordInput — [components/PasswordInput.tsx:18](../components/PasswordInput.tsx#L18) | Controlled value/style, show/hide, required/autocomplete. | [app/admin/login/page.tsx:159](../app/admin/login/page.tsx#L159); [app/login/page.tsx:291](../app/login/page.tsx#L291); [app/signup/page.tsx:447](../app/signup/page.tsx#L447) |
| RouteGuard — [components/RouteGuard.tsx:70](../components/RouteGuard.tsx#L70) | Guard/wrapper; exact props/state below. | [components/ConditionalNav.tsx:46](../components/ConditionalNav.tsx#L46) |
| ShopAvailabilityTab — [components/ShopAvailabilityTab.tsx:64](../components/ShopAvailabilityTab.tsx#L64) | Opening hours, breaks, copy weekdays, holidays, closures and saving. | [app/dashboard/shop/availability/page.tsx:23](../app/dashboard/shop/availability/page.tsx#L23) |
| ShopPhotosTab — [components/ShopPhotosTab.tsx:15](../components/ShopPhotosTab.tsx#L15) | Gallery/upload/removal. | [app/dashboard/shop/photos/page.tsx:16](../app/dashboard/shop/photos/page.tsx#L16) |
| ShopServicesTab — [components/ShopServicesTab.tsx:25](../components/ShopServicesTab.tsx#L25) | CRUD, editing, active status, presets and titeZMe Cut. | [app/dashboard/shop/services/page.tsx:22](../app/dashboard/shop/services/page.tsx#L22) |
| ShopSettingsTab — [components/ShopSettingsTab.tsx:32](../components/ShopSettingsTab.tsx#L32) | Business/location/profile. | [app/dashboard/shop/settings/page.tsx:16](../app/dashboard/shop/settings/page.tsx#L16) |
| ShopTeamTab — [components/ShopTeamTab.tsx:14](../components/ShopTeamTab.tsx#L14) | Code search, throttling, invitations, team and removal. | [app/dashboard/shop/team/page.tsx:4](../app/dashboard/shop/team/page.tsx#L4) |
| ShopTimePicker — [components/ShopTimePicker.tsx:128](../components/ShopTimePicker.tsx#L128) | Date/week/time and shop union/available barber selection. | [app/book/shop/[shopId]/page.tsx:493](../app/book/shop/[shopId]/page.tsx#L493) |
| BarberCardSkeleton — [components/skeletons.tsx:3](../components/skeletons.tsx#L3) | Card/photo/text loader. | No direct JSX consumer found; dynamic/export use requires separate check. |
| BookingRowSkeleton — [components/skeletons.tsx:34](../components/skeletons.tsx#L34) | Booking loader. | No direct JSX consumer found; dynamic/export use requires separate check. |
| StatCardSkeleton — [components/skeletons.tsx:53](../components/skeletons.tsx#L53) | Stats loader. | No direct JSX consumer found; dynamic/export use requires separate check. |
| BarberProfileSkeleton — [components/skeletons.tsx:62](../components/skeletons.tsx#L62) | Responsive profile/services loader. | [app/barber/[barberId]/BarberProfileClient.tsx:379](../app/barber/[barberId]/BarberProfileClient.tsx#L379); [app/book/[barberId]/page.tsx:334](../app/book/[barberId]/page.tsx#L334) |
| SmartTimePicker — [components/SmartTimePicker.tsx:145](../components/SmartTimePicker.tsx#L145) | Date/week/time and duration-fit slots. | [app/book/[barberId]/page.tsx:521](../app/book/[barberId]/page.tsx#L521) |
| SuspendedBookingBanner — [components/SuspendedBookingBanner.tsx:9](../components/SuspendedBookingBanner.tsx#L9) | Suspension/challenge restriction. | [app/barber/[barberId]/BarberProfileClient.tsx:685](../app/barber/[barberId]/BarberProfileClient.tsx#L685); [app/book/shop/[shopId]/page.tsx:410](../app/book/shop/[shopId]/page.tsx#L410); [app/book/[barberId]/page.tsx:439](../app/book/[barberId]/page.tsx#L439); [app/shop/[shopId]/page.tsx:632](../app/shop/[shopId]/page.tsx#L632) |
| AmbientBackground — [components/titiza/ambient-background.tsx:1](../components/titiza/ambient-background.tsx#L1) | Fixed aurora/grid/vignette. | [app/dashboard/client/titiza/page.tsx:67](../app/dashboard/client/titiza/page.tsx#L67) |
| BeautyProfileCard — [components/titiza/beauty-profile-card.tsx:107](../components/titiza/beauty-profile-card.tsx#L107) | Inert primary CTA and expandable timeline. | [app/dashboard/client/titiza/page.tsx:84](../app/dashboard/client/titiza/page.tsx#L84) |
| CategoryGrid — [components/titiza/category-grid.tsx:47](../components/titiza/category-grid.tsx#L47) | Five plus More, expansion, selection/dimming/locking and keyboard. | [components/titiza/titiza-decision-flow.tsx:165](../components/titiza/titiza-decision-flow.tsx#L165) |
| CategoryIcon — [components/titiza/category-icons.tsx:179](../components/titiza/category-icons.tsx#L179) | Category SVG. | [components/titiza/category-grid.tsx:176](../components/titiza/category-grid.tsx#L176) |
| FeatureCards — [components/titiza/feature-cards.tsx:69](../components/titiza/feature-cards.tsx#L69) | Three hover/glow cards. | [app/dashboard/client/titiza/page.tsx:92](../app/dashboard/client/titiza/page.tsx#L92) |
| OrbitLabels — [components/titiza/orbit-labels.tsx:26](../components/titiza/orbit-labels.tsx#L26) | Five timed labels with reduced-motion suppression. | [components/titiza/titiza-core.tsx:78](../components/titiza/titiza-core.tsx#L78) |
| PathAnalysis — [components/titiza/path-analysis.tsx:25](../components/titiza/path-analysis.tsx#L25) | Acknowledgment, invitation, card and no-op exit. | [components/titiza/titiza-decision-flow.tsx:177](../components/titiza/titiza-decision-flow.tsx#L177) |
| PathDirect — [components/titiza/path-direct.tsx:23](../components/titiza/path-direct.tsx#L23) | Explore/Notify both no-op. | [components/titiza/titiza-decision-flow.tsx:186](../components/titiza/titiza-decision-flow.tsx#L186) |
| TitizaCoreScene — [components/titiza/titiza-core-scene.tsx:207](../components/titiza/titiza-core-scene.tsx#L207) | Three.js orb, shells, particles, rings, idle/bright/thinking. | [components/titiza/titiza-core.tsx:68](../components/titiza/titiza-core.tsx#L68) |
| TitizaCore — [components/titiza/titiza-core.tsx:46](../components/titiza/titiza-core.tsx#L46) | Dynamic fallback, genesis/held-state/ring/bloom. | [components/titiza/titiza-decision-flow.tsx:138](../components/titiza/titiza-decision-flow.tsx#L138); [components/titiza/titiza-hero.tsx:87](../components/titiza/titiza-hero.tsx#L87); [components/titiza-film/film-sequencer.tsx:610](../components/titiza-film/film-sequencer.tsx#L610) |
| TitizaDecisionFlow — [components/titiza/titiza-decision-flow.tsx:29](../components/titiza/titiza-decision-flow.tsx#L29) | Anchor, greeting, choice, thinking and paths. | [app/dashboard/client/titiza/page.tsx:72](../app/dashboard/client/titiza/page.tsx#L72) |
| TitizaHero — [components/titiza/titiza-hero.tsx:18](../components/titiza/titiza-hero.tsx#L18) | Genesis/dashboard, first/returning and Begin. | [app/dashboard/client/titiza/page.tsx:75](../app/dashboard/client/titiza/page.tsx#L75) |
| AnalysisCardsOrbit — [components/titiza-film/analysis-cards-orbit.tsx:37](../components/titiza-film/analysis-cards-orbit.tsx#L37) | Film chips/convergence. | [components/titiza-film/film-sequencer.tsx:623](../components/titiza-film/film-sequencer.tsx#L623) |
| BeforeAfterSwap — [components/titiza-film/before-after-swap.tsx:41](../components/titiza-film/before-after-swap.tsx#L41) | Single/swap neutral frames. | [components/titiza-film/film-sequencer.tsx:690](../components/titiza-film/film-sequencer.tsx#L690) |
| ChatInputShell — [components/titiza-film/chat-input-shell.tsx:50](../components/titiza-film/chat-input-shell.tsx#L50) | Scripted query/send/reply. | [components/titiza-film/film-sequencer.tsx:697](../components/titiza-film/film-sequencer.tsx#L697) |
| ConversationStrip — [components/titiza-film/conversation-strip.tsx:17](../components/titiza-film/conversation-strip.tsx#L17) | Film continuity cue. | [components/titiza-film/film-sequencer.tsx:722](../components/titiza-film/film-sequencer.tsx#L722) |
| FilmSequencer — [components/titiza-film/film-sequencer.tsx:483](../components/titiza-film/film-sequencer.tsx#L483) | Locale/shared timeline/orb reactions. | [app/preview/titiza-film/page.tsx:18](../app/preview/titiza-film/page.tsx#L18); [app/preview/titiza-film-es/page.tsx:19](../app/preview/titiza-film-es/page.tsx#L19) |
| IntroTitle — [components/titiza-film/intro-title.tsx:28](../components/titiza-film/intro-title.tsx#L28) | Intro/time-skip/end fades. | [components/titiza-film/film-sequencer.tsx:732](../components/titiza-film/film-sequencer.tsx#L732) |
| LaunchDateCard — [components/titiza-film/launch-date-card.tsx:39](../components/titiza-film/launch-date-card.tsx#L39) | Cascade/hold/fade. | [components/titiza-film/film-sequencer.tsx:748](../components/titiza-film/film-sequencer.tsx#L748) |
| OrbDialogue — [components/titiza-film/orb-dialogue.tsx:17](../components/titiza-film/orb-dialogue.tsx#L17) | Timed lines. | [components/titiza-film/film-sequencer.tsx:659](../components/titiza-film/film-sequencer.tsx#L659) |
| ProfessionalCard — [components/titiza-film/professional-card.tsx:25](../components/titiza-film/professional-card.tsx#L25) | Simulated pressed/confirmed states. | [components/titiza-film/film-sequencer.tsx:675](../components/titiza-film/film-sequencer.tsx#L675) |
| TypingLines — [components/titiza-film/typing-lines.tsx:24](../components/titiza-film/typing-lines.tsx#L24) | Checklist/reveal. | [components/titiza-film/film-sequencer.tsx:663](../components/titiza-film/film-sequencer.tsx#L663) |
| VerticalMontage — [components/titiza-film/vertical-montage.tsx:24](../components/titiza-film/vertical-montage.tsx#L24) | Timed words. | [components/titiza-film/film-sequencer.tsx:643](../components/titiza-film/film-sequencer.tsx#L643) |
| TopNav — [components/TopNav.tsx:12](../components/TopNav.tsx#L12) | Auth/role/active route/language/drawer/marquee. | [components/ConditionalNav.tsx:44](../components/ConditionalNav.tsx#L44) |
| VerifyEmailGate — [components/VerifyEmailGate.tsx:27](../components/VerifyEmailGate.tsx#L27) | Verification, resend, cooldown, detection and destination. | [app/login/page.tsx:50](../app/login/page.tsx#L50); [app/signup/page.tsx:68](../app/signup/page.tsx#L68) |
| Wordmark — [components/Wordmark.tsx:1](../components/Wordmark.tsx#L1) | SVG text; default height28. | [components/Footer.tsx:14](../components/Footer.tsx#L14); [components/TopNav.tsx:80](../components/TopNav.tsx#L80) |


### AdminGuard

[components/AdminGuard.tsx:36](../components/AdminGuard.tsx#L36)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|
| minHeight | '100vh' — [components/AdminGuard.tsx:108](../components/AdminGuard.tsx#L108) |
| gap | 16 — [components/AdminGuard.tsx:114](../components/AdminGuard.tsx#L114) |
| width | 32 — [components/AdminGuard.tsx:117](../components/AdminGuard.tsx#L117) |
| height | 32 — [components/AdminGuard.tsx:118](../components/AdminGuard.tsx#L118) |
| borderRadius | '50%' — [components/AdminGuard.tsx:121](../components/AdminGuard.tsx#L121) |
| fontSize | 11 — [components/AdminGuard.tsx:124](../components/AdminGuard.tsx#L124) |

Variants/state evidence:

- [components/AdminGuard.tsx:39](../components/AdminGuard.tsx#L39) — const [adminData, setAdminData] = useState<AdminData | null>(null);
- [components/AdminGuard.tsx:40](../components/AdminGuard.tsx#L40) — const [checking, setChecking] = useState(true);

Responsive: No explicit breakpoint; inherited/container behavior only.

### AvailabilityGrid

[components/AvailabilityGrid.tsx:33](../components/AvailabilityGrid.tsx#L33)

Sizes/geometry/type: `text-brand-text-secondary`, `text-sm`, `gap-2`, `gap-[5px]`, `rounded-full`, `px-3`, `py-[5px]`, `text-[11px]`, `text-[#888]`, `px-[14px]`, `py-[6px]`, `hover:text-brand-yellow`, `text-[#666]`, `hover:text-[#EF4444]`, `text-xl`, `px-4`, `py-2`, `hover:text-white`, `rounded-lg`, `text-xs`, `rounded-xl`, `p-3`, `p-2`, `sm:p-3`, `text-center`, `text-[#EF4444]/80`, `sm:text-base`, `text-[#EF4444]/60`, `text-[9px]`, `text-[#22C55E]`, `text-[#444]`, `max-h-[60vh]`, `py-3`, `px-2`, `text-[10px]`, `sm:text-xs`, `w-full`, `h-full`, `text-white`, `text-brand-yellow`, `hover:text-[#888]`, `gap-3`, `text-brand-green`, `text-[#0a0a0a]`, `px-8`, `py-3.5`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/AvailabilityGrid.tsx:33](../components/AvailabilityGrid.tsx#L33) — export function AvailabilityGrid({ mode = 'barber', barberId = '', totalDuration = 0, onSlotSelect, selectedDate, selectedTime, initialData, onSave }: AvailabilityGridProps) {
- [components/AvailabilityGrid.tsx:34](../components/AvailabilityGrid.tsx#L34) — const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
- [components/AvailabilityGrid.tsx:35](../components/AvailabilityGrid.tsx#L35) — const [availableSlots, setAvailableSlots] = useState<Record<string, string[]>>({});
- [components/AvailabilityGrid.tsx:36](../components/AvailabilityGrid.tsx#L36) — const [bookings, setBookings] = useState<any[]>([]);
- [components/AvailabilityGrid.tsx:37](../components/AvailabilityGrid.tsx#L37) — const [isDragging, setIsDragging] = useState(false);
- [components/AvailabilityGrid.tsx:38](../components/AvailabilityGrid.tsx#L38) — const [dragAction, setDragAction] = useState<'add' | 'remove' | null>(null);
- [components/AvailabilityGrid.tsx:39](../components/AvailabilityGrid.tsx#L39) — const [loading, setLoading] = useState(true);
- [components/AvailabilityGrid.tsx:40](../components/AvailabilityGrid.tsx#L40) — const [saving, setSaving] = useState(false);
- [components/AvailabilityGrid.tsx:41](../components/AvailabilityGrid.tsx#L41) — const [lastSaved, setLastSaved] = useState<Date | null>(null);
- [components/AvailabilityGrid.tsx:42](../components/AvailabilityGrid.tsx#L42) — const [bufferMinutes, setBufferMinutes] = useState(10);
- [components/AvailabilityGrid.tsx:43](../components/AvailabilityGrid.tsx#L43) — const [blockedDates, setBlockedDates] = useState<string[]>([]);
- [components/AvailabilityGrid.tsx:44](../components/AvailabilityGrid.tsx#L44) — const [recurringBlocked, setRecurringBlocked] = useState<string[]>([]);
- [components/AvailabilityGrid.tsx:45](../components/AvailabilityGrid.tsx#L45) — const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
- [components/AvailabilityGrid.tsx:46](../components/AvailabilityGrid.tsx#L46) — const [autoSavedMsg, setAutoSavedMsg] = useState('');
- [components/AvailabilityGrid.tsx:52](../components/AvailabilityGrid.tsx#L52) — const uid = mode === 'barber' && user ? user.uid : barberId;
- [components/AvailabilityGrid.tsx:76](../components/AvailabilityGrid.tsx#L76) — if (mode === 'barber') setLoading(false);
- [components/AvailabilityGrid.tsx:79](../components/AvailabilityGrid.tsx#L79) — if (mode === 'barber') setLoading(false);
- [components/AvailabilityGrid.tsx:84](../components/AvailabilityGrid.tsx#L84) — if (mode === 'client') {
- [components/AvailabilityGrid.tsx:377](../components/AvailabilityGrid.tsx#L377) — {mode === 'barber' && (
- [components/AvailabilityGrid.tsx:392](../components/AvailabilityGrid.tsx#L392) — {mode === 'barber' && (
- [components/AvailabilityGrid.tsx:439](../components/AvailabilityGrid.tsx#L439) — const isDayBlocked = mode === 'barber' && (
- [components/AvailabilityGrid.tsx:450](../components/AvailabilityGrid.tsx#L450) — {mode === 'barber' && (
- [components/AvailabilityGrid.tsx:478](../components/AvailabilityGrid.tsx#L478) — if (mode === 'barber') {
- [components/AvailabilityGrid.tsx:546](../components/AvailabilityGrid.tsx#L546) — {mode === 'barber' && (
- [components/AvailabilityGrid.tsx:577](../components/AvailabilityGrid.tsx#L577) — disabled={saving}

Responsive: [components/AvailabilityGrid.tsx:443](../components/AvailabilityGrid.tsx#L443) <div key={i} className={`p-2 sm:p-3 text-center border-r-[1.5px] border-[#2a2a2a] last:border-r-0 ${isDayBlocked ? 'bg-[#1a0808]/40' : ''}`}>; [components/AvailabilityGrid.tsx:447](../components/AvailabilityGrid.tsx#L447) <div className={`text-sm sm:text-base font-black mt-0.5 ${isDayBlocked ? 'text-[#EF4444]/60' : ''}`}>; [components/AvailabilityGrid.tsx:465](../components/AvailabilityGrid.tsx#L465) <div className="py-3 px-2 border-r-[1.5px] border-b-[1.5px] border-[#2a2a2a] text-[10px] sm:text-xs font-bold text-center text-brand-text-secondary bg-[#0a0a0a] sticky left-0">

### BarberInvitesTab

[components/BarberInvitesTab.tsx:10](../components/BarberInvitesTab.tsx#L10)

Sizes/geometry/type: `text-center`, `py-16`, `max-w-md`, `text-5xl`, `text-[16px]`, `text-[13px]`, `text-[#666]`, `text-[#0a0a0a]`, `px-7`, `py-3`, `rounded-full`, `text-sm`, `text-2xl`, `rounded-2xl`, `p-5`, `text-[10px]`, `text-[#555]`, `gap-3`, `text-[20px]`, `text-brand-yellow`, `text-xs`, `text-[#888]`, `hover:text-white`, `rounded-lg`, `px-3`, `py-1.5`, `text-[11px]`, `gap-4`, `text-lg`, `gap-2`, `w-full`, `md:w-auto`, `text-brand-red`, `px-5`, `py-2.5`, `rounded-xl`, `text-black`, `p-4`, `px-2.5`, `py-1`, `rounded-md`, `text-brand-green`, `rounded-3xl`, `p-8`, `p-6`, `max-w-sm`, `text-xl`, `text-white`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/BarberInvitesTab.tsx:14](../components/BarberInvitesTab.tsx#L14) — const [invites, setInvites] = useState<any[]>([]);
- [components/BarberInvitesTab.tsx:15](../components/BarberInvitesTab.tsx#L15) — const [actionLoading, setActionLoading] = useState<string | null>(null);
- [components/BarberInvitesTab.tsx:16](../components/BarberInvitesTab.tsx#L16) — const [showWarningModal, setShowWarningModal] = useState<any>(null);
- [components/BarberInvitesTab.tsx:17](../components/BarberInvitesTab.tsx#L17) — const [showSoloModal, setShowSoloModal] = useState<any>(null);
- [components/BarberInvitesTab.tsx:18](../components/BarberInvitesTab.tsx#L18) — const [barberCode, setBarberCode] = useState('');
- [components/BarberInvitesTab.tsx:19](../components/BarberInvitesTab.tsx#L19) — const [codeCopied, setCodeCopied] = useState(false);
- [components/BarberInvitesTab.tsx:183](../components/BarberInvitesTab.tsx#L183) — disabled={actionLoading === inv.id}
- [components/BarberInvitesTab.tsx:190](../components/BarberInvitesTab.tsx#L190) — disabled={actionLoading === inv.id}
- [components/BarberInvitesTab.tsx:240](../components/BarberInvitesTab.tsx#L240) — <button disabled={actionLoading === showWarningModal.id} onClick={() => setShowWarningModal(null)} className="flex-1 bg-[#2a2a2a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#333] disabled:opacity-50">{t('buttons.cancel')}</button>
- [components/BarberInvitesTab.tsx:241](../components/BarberInvitesTab.tsx#L241) — <button disabled={actionLoading === showWarningModal.id} onClick={() => processAccept(showWarningModal)} className="flex-[1.5] bg-brand-green text-black py-3 rounded-xl font-bold text-sm hover:bg-green-500 disabled:opacity-50">
- [components/BarberInvitesTab.tsx:257](../components/BarberInvitesTab.tsx#L257) — <button disabled={actionLoading === showSoloModal.id} onClick={() => handleKeepSolo(true)} className="w-full bg-brand-yellow text-black py-3 rounded-xl font-bold text-sm hover:bg-yellow-500 disabled:opacity-50">{t('buttons.keepSoloBookings')}</button>
- [components/BarberInvitesTab.tsx:258](../components/BarberInvitesTab.tsx#L258) — <button disabled={actionLoading === showSoloModal.id} onClick={() => handleKeepSolo(false)} className="w-full bg-[#2a2a2a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#333] disabled:opacity-50">{t('buttons.shopBookingsOnly')}</button>

Responsive: [components/BarberInvitesTab.tsx:172](../components/BarberInvitesTab.tsx#L172) <div key={inv.id} className="bg-brand-surface border border-brand-border rounded-2xl p-5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">; [components/BarberInvitesTab.tsx:180](../components/BarberInvitesTab.tsx#L180) <div className="flex gap-2 w-full md:w-auto">; [components/BarberInvitesTab.tsx:184](../components/BarberInvitesTab.tsx#L184) className="flex-1 md:flex-none bg-[#1a0808] border border-[#3b1a1a] text-brand-red px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-red/20 disabled:opacity-50"; [components/BarberInvitesTab.tsx:191](../components/BarberInvitesTab.tsx#L191) className="flex-1 md:flex-none bg-brand-green text-black px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-500 disabled:opacity-50"

### BarberPortfolioTab

[components/BarberPortfolioTab.tsx:18](../components/BarberPortfolioTab.tsx#L18)

Sizes/geometry/type: `text-2xl`, `text-brand-text-secondary`, `text-sm`, `text-lg`, `text-xs`, `text-[#888]`, `text-[#555]`, `rounded-full`, `px-4`, `py-[6px]`, `text-[11px]`, `rounded-3xl`, `p-8`, `text-center`, `text-[#444]`, `text-brand-yellow`, `disabled:text-[#555]`, `gap-4`, `rounded-2xl`, `w-8`, `h-8`, `text-white`, `hover:text-white`, `w-full`, `h-full`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/BarberPortfolioTab.tsx:21](../components/BarberPortfolioTab.tsx#L21) — const [notifyPhotoDone, setNotifyPhotoDone] = useState(false);
- [components/BarberPortfolioTab.tsx:22](../components/BarberPortfolioTab.tsx#L22) — const [notifyVideoDone, setNotifyVideoDone] = useState(false);
- [components/BarberPortfolioTab.tsx:96](../components/BarberPortfolioTab.tsx#L96) — disabled={notifyPhotoDone}
- [components/BarberPortfolioTab.tsx:140](../components/BarberPortfolioTab.tsx#L140) — disabled={notifyVideoDone}

Responsive: [components/BarberPortfolioTab.tsx:103](../components/BarberPortfolioTab.tsx#L103) <div className="grid grid-cols-2 md:grid-cols-3 gap-4">; [components/BarberPortfolioTab.tsx:147](../components/BarberPortfolioTab.tsx#L147) <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

### BarberSettingsTab

[components/BarberSettingsTab.tsx:36](../components/BarberSettingsTab.tsx#L36)

Sizes/geometry/type: `max-w-2xl`, `text-2xl`, `text-brand-text-secondary`, `text-sm`, `text-brand-red`, `rounded-xl`, `px-4`, `py-3`, `text-brand-green`, `rounded-3xl`, `p-6`, `text-lg`, `gap-6`, `w-24`, `h-24`, `rounded-full`, `w-full`, `h-full`, `text-3xl`, `text-[#555]`, `text-white`, `px-5`, `py-2.5`, `text-xs`, `text-[#888]`, `gap-4`, `gap-2`, `min-w-[120px]`, `placeholder:text-[#444]`, `h-[48px]`, `text-black`, `px-6`, `text-brand-yellow`, `px-3`, `py-1`, `text-[11px]`, `rounded-lg`, `py-1.5`, `hover:text-white`, `p-4`, `rounded-2xl`, `p-5`, `max-w-sm`, `w-11`, `h-6`, `after:rounded-full`, `after:h-5`, `after:w-5`, `w-[18px]`, `h-[18px]`, `text-[#444]`, `disabled:text-[#555]`, `w-max`
| Dimension/property | Exact value/source |
|---|---|
| borderRadius | '0.75rem' — [components/BarberSettingsTab.tsx:116](../components/BarberSettingsTab.tsx#L116) |
| padding | '2px' — [components/BarberSettingsTab.tsx:117](../components/BarberSettingsTab.tsx#L117) |
| borderRadius | '0.75rem' — [components/BarberSettingsTab.tsx:128](../components/BarberSettingsTab.tsx#L128) |
| borderRadius | '6px' — [components/BarberSettingsTab.tsx:148](../components/BarberSettingsTab.tsx#L148) |
| gap | '12px' — [components/BarberSettingsTab.tsx:442](../components/BarberSettingsTab.tsx#L442) |
| padding | '16px' — [components/BarberSettingsTab.tsx:443](../components/BarberSettingsTab.tsx#L443) |
| borderRadius | '16px' — [components/BarberSettingsTab.tsx:445](../components/BarberSettingsTab.tsx#L445) |
| fontSize | '14px' — [components/BarberSettingsTab.tsx:449](../components/BarberSettingsTab.tsx#L449) |
| fontSize | '20px' — [components/BarberSettingsTab.tsx:453](../components/BarberSettingsTab.tsx#L453) |
| fontSize | '11px' — [components/BarberSettingsTab.tsx:456](../components/BarberSettingsTab.tsx#L456) |
| gap | '12px' — [components/BarberSettingsTab.tsx:468](../components/BarberSettingsTab.tsx#L468) |
| padding | '16px' — [components/BarberSettingsTab.tsx:469](../components/BarberSettingsTab.tsx#L469) |
| borderRadius | '16px' — [components/BarberSettingsTab.tsx:471](../components/BarberSettingsTab.tsx#L471) |
| fontSize | '14px' — [components/BarberSettingsTab.tsx:475](../components/BarberSettingsTab.tsx#L475) |
| fontSize | '20px' — [components/BarberSettingsTab.tsx:479](../components/BarberSettingsTab.tsx#L479) |
| fontSize | '11px' — [components/BarberSettingsTab.tsx:482](../components/BarberSettingsTab.tsx#L482) |
| gap | '12px' — [components/BarberSettingsTab.tsx:494](../components/BarberSettingsTab.tsx#L494) |
| padding | '16px' — [components/BarberSettingsTab.tsx:495](../components/BarberSettingsTab.tsx#L495) |
| borderRadius | '16px' — [components/BarberSettingsTab.tsx:497](../components/BarberSettingsTab.tsx#L497) |
| fontSize | '14px' — [components/BarberSettingsTab.tsx:501](../components/BarberSettingsTab.tsx#L501) |
| fontSize | '20px' — [components/BarberSettingsTab.tsx:505](../components/BarberSettingsTab.tsx#L505) |
| fontSize | '11px' — [components/BarberSettingsTab.tsx:508](../components/BarberSettingsTab.tsx#L508) |
| borderRadius | 16 — [components/BarberSettingsTab.tsx:1030](../components/BarberSettingsTab.tsx#L1030) |
| padding | 24 — [components/BarberSettingsTab.tsx:1031](../components/BarberSettingsTab.tsx#L1031) |
| fontSize | 13 — [components/BarberSettingsTab.tsx:1035](../components/BarberSettingsTab.tsx#L1035) |
| fontSize | 14 — [components/BarberSettingsTab.tsx:1054](../components/BarberSettingsTab.tsx#L1054) |
| fontSize | 12 — [components/BarberSettingsTab.tsx:1062](../components/BarberSettingsTab.tsx#L1062) |
| width | 44 — [components/BarberSettingsTab.tsx:1071](../components/BarberSettingsTab.tsx#L1071) |
| height | 24 — [components/BarberSettingsTab.tsx:1072](../components/BarberSettingsTab.tsx#L1072) |
| borderRadius | 12 — [components/BarberSettingsTab.tsx:1073](../components/BarberSettingsTab.tsx#L1073) |
| width | 20 — [components/BarberSettingsTab.tsx:1087](../components/BarberSettingsTab.tsx#L1087) |
| height | 20 — [components/BarberSettingsTab.tsx:1088](../components/BarberSettingsTab.tsx#L1088) |
| borderRadius | '50%' — [components/BarberSettingsTab.tsx:1089](../components/BarberSettingsTab.tsx#L1089) |
| fontSize | 14 — [components/BarberSettingsTab.tsx:1105](../components/BarberSettingsTab.tsx#L1105) |
| fontSize | 12 — [components/BarberSettingsTab.tsx:1113](../components/BarberSettingsTab.tsx#L1113) |
| width | 44 — [components/BarberSettingsTab.tsx:1122](../components/BarberSettingsTab.tsx#L1122) |
| height | 24 — [components/BarberSettingsTab.tsx:1123](../components/BarberSettingsTab.tsx#L1123) |
| borderRadius | 12 — [components/BarberSettingsTab.tsx:1124](../components/BarberSettingsTab.tsx#L1124) |
| width | 20 — [components/BarberSettingsTab.tsx:1138](../components/BarberSettingsTab.tsx#L1138) |
| height | 20 — [components/BarberSettingsTab.tsx:1139](../components/BarberSettingsTab.tsx#L1139) |
| borderRadius | '50%' — [components/BarberSettingsTab.tsx:1140](../components/BarberSettingsTab.tsx#L1140) |
| fontSize | 13 — [components/BarberSettingsTab.tsx:1155](../components/BarberSettingsTab.tsx#L1155) |
| padding | '10px 20px' — [components/BarberSettingsTab.tsx:1156](../components/BarberSettingsTab.tsx#L1156) |
| borderRadius | 10 — [components/BarberSettingsTab.tsx:1157](../components/BarberSettingsTab.tsx#L1157) |

Variants/state evidence:

- [components/BarberSettingsTab.tsx:39](../components/BarberSettingsTab.tsx#L39) — const [photoLoading, setPhotoLoading] = useState(false);
- [components/BarberSettingsTab.tsx:40](../components/BarberSettingsTab.tsx#L40) — const [localPhotoUrl, setLocalPhotoUrl] = useState('');
- [components/BarberSettingsTab.tsx:41](../components/BarberSettingsTab.tsx#L41) — const [savingGlobal, setSavingGlobal] = useState(false);
- [components/BarberSettingsTab.tsx:42](../components/BarberSettingsTab.tsx#L42) — const [savingSocial, setSavingSocial] = useState(false);
- [components/BarberSettingsTab.tsx:43](../components/BarberSettingsTab.tsx#L43) — const [errorMsg, setErrorMsg] = useState('');
- [components/BarberSettingsTab.tsx:44](../components/BarberSettingsTab.tsx#L44) — const [successMsg, setSuccessMsg] = useState('');
- [components/BarberSettingsTab.tsx:46](../components/BarberSettingsTab.tsx#L46) — const [formData, setFormData] = useState({
- [components/BarberSettingsTab.tsx:56](../components/BarberSettingsTab.tsx#L56) — const [phoneNumberInput, setPhoneNumberInput] = useState(initPhoneNumStr);
- [components/BarberSettingsTab.tsx:57](../components/BarberSettingsTab.tsx#L57) — const [phoneCode, setPhoneCode] = useState<any>(null);
- [components/BarberSettingsTab.tsx:58](../components/BarberSettingsTab.tsx#L58) — const [csc, setCsc] = useState<any>(null);
- [components/BarberSettingsTab.tsx:59](../components/BarberSettingsTab.tsx#L59) — const [languageOptions, setLanguageOptions] = useState<{value: string; label: string}[]>([]);
- [components/BarberSettingsTab.tsx:61](../components/BarberSettingsTab.tsx#L61) — const [selectedCountry, setSelectedCountry] = useState<any>(null);
- [components/BarberSettingsTab.tsx:62](../components/BarberSettingsTab.tsx#L62) — const [selectedState, setSelectedState] = useState<any>(null);
- [components/BarberSettingsTab.tsx:63](../components/BarberSettingsTab.tsx#L63) — const [selectedCityOption, setSelectedCityOption] = useState<any>(null);
- [components/BarberSettingsTab.tsx:64](../components/BarberSettingsTab.tsx#L64) — const [selectedLanguages, setSelectedLanguages] = useState<any>([]);
- [components/BarberSettingsTab.tsx:173](../components/BarberSettingsTab.tsx#L173) — const [socialData, setSocialData] = useState({
- [components/BarberSettingsTab.tsx:180](../components/BarberSettingsTab.tsx#L180) — const [experienceStartYear, setExperienceStartYear] = useState<string>(
- [components/BarberSettingsTab.tsx:183](../components/BarberSettingsTab.tsx#L183) — const [dateOfBirth, setDateOfBirth] = useState<string>(profile?.dateOfBirth ?? '');
- [components/BarberSettingsTab.tsx:184](../components/BarberSettingsTab.tsx#L184) — const [savingExperience, setSavingExperience] = useState(false);
- [components/BarberSettingsTab.tsx:187](../components/BarberSettingsTab.tsx#L187) — const [specialties, setSpecialties] = useState<string[]>(profile?.specialties || []);
- [components/BarberSettingsTab.tsx:188](../components/BarberSettingsTab.tsx#L188) — const [vibe, setVibe] = useState<string[]>(profile?.vibes || []);
- [components/BarberSettingsTab.tsx:189](../components/BarberSettingsTab.tsx#L189) — const [clientele, setClientele] = useState<string[]>(profile?.clientele || []);
- [components/BarberSettingsTab.tsx:190](../components/BarberSettingsTab.tsx#L190) — const [savingProfile, setSavingProfile] = useState(false);
- [components/BarberSettingsTab.tsx:193](../components/BarberSettingsTab.tsx#L193) — const [notifyEmail, setNotifyEmail] = useState(profile?.notifyEmail !== false);
- [components/BarberSettingsTab.tsx:194](../components/BarberSettingsTab.tsx#L194) — const [notifyCancel, setNotifyCancel] = useState(profile?.notifyCancel !== false);
- [components/BarberSettingsTab.tsx:195](../components/BarberSettingsTab.tsx#L195) — const [showPhone, setShowPhone] = useState(profile?.showPhone === true);
- [components/BarberSettingsTab.tsx:196](../components/BarberSettingsTab.tsx#L196) — const [pwResetSent, setPwResetSent] = useState(false);
- [components/BarberSettingsTab.tsx:199](../components/BarberSettingsTab.tsx#L199) — const [hasEquipment, setHasEquipment] = useState<boolean>(profile?.hasEquipment ?? false);
- [components/BarberSettingsTab.tsx:200](../components/BarberSettingsTab.tsx#L200) — const [lookingForChair, setLookingForChair] = useState<boolean>(profile?.lookingForChair ?? false);
- [components/BarberSettingsTab.tsx:201](../components/BarberSettingsTab.tsx#L201) — const [savingSetup, setSavingSetup] = useState(false);
- [components/BarberSettingsTab.tsx:202](../components/BarberSettingsTab.tsx#L202) — const [isSolo, setIsSolo] = useState<boolean>(profile?.isSolo ?? true);
- [components/BarberSettingsTab.tsx:203](../components/BarberSettingsTab.tsx#L203) — const [savingIsSolo, setSavingIsSolo] = useState(false);
- [components/BarberSettingsTab.tsx:540](../components/BarberSettingsTab.tsx#L540) — disabled={photoLoading}
- [components/BarberSettingsTab.tsx:681](../components/BarberSettingsTab.tsx#L681) — disabled={savingGlobal}
- [components/BarberSettingsTab.tsx:751](../components/BarberSettingsTab.tsx#L751) — disabled={savingExperience || !experienceStartYear || !dateOfBirth}
- [components/BarberSettingsTab.tsx:803](../components/BarberSettingsTab.tsx#L803) — <button onClick={handleSaveBarberProfile} disabled={savingProfile}
- [components/BarberSettingsTab.tsx:848](../components/BarberSettingsTab.tsx#L848) — disabled={savingSocial}
- [components/BarberSettingsTab.tsx:962](../components/BarberSettingsTab.tsx#L962) — disabled={savingIsSolo}
- [components/BarberSettingsTab.tsx:1150](../components/BarberSettingsTab.tsx#L1150) — disabled={savingSetup}
- [components/BarberSettingsTab.tsx:1210](../components/BarberSettingsTab.tsx#L1210) — <button onClick={handlePasswordReset} disabled={pwResetSent}

Responsive: [components/BarberSettingsTab.tsx:435](../components/BarberSettingsTab.tsx#L435) <div className="md:hidden mb-4">; [components/BarberSettingsTab.tsx:552](../components/BarberSettingsTab.tsx#L552) <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">; [components/BarberSettingsTab.tsx:578](../components/BarberSettingsTab.tsx#L578) <div className="flex-[0.8] sm:flex-[0.6] min-w-[120px]">; [components/BarberSettingsTab.tsx:601](../components/BarberSettingsTab.tsx#L601) <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">; [components/BarberSettingsTab.tsx:697](../components/BarberSettingsTab.tsx#L697) <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">; [components/BarberSettingsTab.tsx:723](../components/BarberSettingsTab.tsx#L723) <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">; [components/BarberSettingsTab.tsx:860](../components/BarberSettingsTab.tsx#L860) <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-2xl mb-6 flex justify-between items-center flex-col sm:flex-row gap-4">

### ChallengeHomepageBox

[components/ChallengeHomepageBox.tsx:16](../components/ChallengeHomepageBox.tsx#L16)

Sizes/geometry/type: `w-full`, `rounded-2xl`, `p-6`, `text-center`, `text-2xl`, `text-sm`, `text-gray-700`, `lg:max-w-[440px]`, `rounded-[16px]`, `text-[10px]`, `text-brand-orange`, `text-[#888]`, `text-xs`, `text-brand-yellow`, `text-3xl`, `md:text-4xl`, `text-[11px]`, `md:text-3xl`, `rounded-[10px]`, `p-3`, `text-white`, `text-[#0a0a0a]`, `px-5`, `py-3`, `rounded-xl`, `text-[#666]`, `hover:text-[#888]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/ChallengeHomepageBox.tsx:103](../components/ChallengeHomepageBox.tsx#L103) <div className="flex-1 lg:max-w-[440px] animate-fadeUp mt-10 lg:mt-0">; [components/ChallengeHomepageBox.tsx:132](../components/ChallengeHomepageBox.tsx#L132) <div className="text-brand-yellow text-3xl md:text-4xl font-black leading-none">; [components/ChallengeHomepageBox.tsx:140](../components/ChallengeHomepageBox.tsx#L140) <div className="text-brand-yellow text-2xl md:text-3xl font-black leading-none">

### ChallengeLocationGate

[components/ChallengeLocationGate.tsx:40](../components/ChallengeLocationGate.tsx#L40)

Sizes/geometry/type: `min-h-[60vh]`, `px-6`, `text-center`, `text-6xl`, `text-2xl`, `text-white`, `text-[#888]`, `text-sm`, `max-w-sm`, `px-4`, `py-2`, `text-black`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### ChallengePaymentTab

[components/ChallengePaymentTab.tsx:25](../components/ChallengePaymentTab.tsx#L25)

Sizes/geometry/type: `p-6`, `md:p-10`, `text-[#666]`, `text-sm`, `text-2xl`, `rounded-[16px]`, `p-8`, `max-w-[640px]`, `text-[#888]`, `px-3`, `py-1.5`, `rounded-full`, `text-[11px]`, `text-[#ccc]`, `w-full`, `sm:w-auto`, `text-[#0a0a0a]`, `px-6`, `py-3`, `rounded-xl`, `text-white`, `max-w-[720px]`, `text-brand-text-secondary`, `p-4`, `text-brand-red`, `gap-2`, `max-w-xs`, `text-gray-300`, `pt-2`, `text-base`, `text-brand-yellow`, `text-[12px]`, `text-lg`, `text-[10px]`, `p-3`, `px-2`, `py-1`, `rounded-lg`, `text-[13px]`, `px-8`, `text-[#555]`, `hover:text-white`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/ChallengePaymentTab.tsx:30](../components/ChallengePaymentTab.tsx#L30) — const [settings, setSettings] = useState<ChallengeSettingsData | null>(null);
- [components/ChallengePaymentTab.tsx:31](../components/ChallengePaymentTab.tsx#L31) — const [submission, setSubmission] = useState<LoadedSubmission | null>(null);
- [components/ChallengePaymentTab.tsx:32](../components/ChallengePaymentTab.tsx#L32) — const [loading, setLoading] = useState(true);
- [components/ChallengePaymentTab.tsx:33](../components/ChallengePaymentTab.tsx#L33) — const [declaredAmount, setDeclaredAmount] = useState('');
- [components/ChallengePaymentTab.tsx:34](../components/ChallengePaymentTab.tsx#L34) — const [declaredReference, setDeclaredReference] = useState('');
- [components/ChallengePaymentTab.tsx:35](../components/ChallengePaymentTab.tsx#L35) — const [submitting, setSubmitting] = useState(false);
- [components/ChallengePaymentTab.tsx:36](../components/ChallengePaymentTab.tsx#L36) — const [errorMsg, setErrorMsg] = useState<string | null>(null);
- [components/ChallengePaymentTab.tsx:236](../components/ChallengePaymentTab.tsx#L236) — const fee = mode === 'barber' ? settings.feeBarber : settings.feeShop;
- [components/ChallengePaymentTab.tsx:385](../components/ChallengePaymentTab.tsx#L385) — disabled={!canSubmit}

Responsive: [components/ChallengePaymentTab.tsx:146](../components/ChallengePaymentTab.tsx#L146) <div className="p-6 md:p-10 animate-fadeUp">; [components/ChallengePaymentTab.tsx:154](../components/ChallengePaymentTab.tsx#L154) <div className="p-6 md:p-10 animate-fadeUp">; [components/ChallengePaymentTab.tsx:172](../components/ChallengePaymentTab.tsx#L172) <div className="p-6 md:p-10 animate-fadeUp max-w-[640px]">; [components/ChallengePaymentTab.tsx:183](../components/ChallengePaymentTab.tsx#L183) className="w-full sm:w-auto bg-brand-yellow text-[#0a0a0a] font-black text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"; [components/ChallengePaymentTab.tsx:194](../components/ChallengePaymentTab.tsx#L194) <div className="p-6 md:p-10 animate-fadeUp max-w-[640px]">; [components/ChallengePaymentTab.tsx:205](../components/ChallengePaymentTab.tsx#L205) className="w-full sm:w-auto bg-brand-yellow text-[#0a0a0a] font-black text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"; [components/ChallengePaymentTab.tsx:217](../components/ChallengePaymentTab.tsx#L217) <div className="p-6 md:p-10 animate-fadeUp max-w-[640px]">; [components/ChallengePaymentTab.tsx:225](../components/ChallengePaymentTab.tsx#L225) className="mt-6 w-full sm:w-auto bg-[#1a1a1a] text-white font-black text-sm px-6 py-3 rounded-xl hover:bg-[#222] transition-colors"; [components/ChallengePaymentTab.tsx:248](../components/ChallengePaymentTab.tsx#L248) <div className="p-6 md:p-10 animate-fadeUp max-w-[720px]">; [components/ChallengePaymentTab.tsx:386](../components/ChallengePaymentTab.tsx#L386) className={`w-full sm:w-auto px-8 py-3 rounded-xl font-black text-sm transition-colors ${

### ChallengeSubmissionTab

[components/ChallengeSubmissionTab.tsx:222](../components/ChallengeSubmissionTab.tsx#L222)

Sizes/geometry/type: `p-6`, `md:p-10`, `text-[#666]`, `text-sm`, `text-2xl`, `rounded-[16px]`, `p-8`, `max-w-[640px]`, `text-[#888]`, `text-brand-text-secondary`, `gap-2`, `px-4`, `py-2`, `rounded-xl`, `text-[12px]`, `text-[#0a0a0a]`, `hover:text-white`, `text-4xl`, `px-3`, `py-1.5`, `rounded-full`, `text-[11px]`, `text-xl`, `text-[#ccc]`, `w-full`, `sm:w-auto`, `px-6`, `py-3`, `text-[#aaa]`, `gap-3`, `px-5`, `py-2.5`, `text-white`, `rounded-[10px]`, `max-w-[400px]`, `text-[#ddd]`, `max-w-[840px]`, `text-lg`, `text-[#555]`, `text-xs`, `text-center`, `p-2`, `text-brand-yellow`, `w-8`, `h-8`, `hover:text-brand-yellow`, `max-w-[420px]`, `h-full`, `p-4`, `text-right`, `w-4`, `h-4`, `text-brand-red`, `px-8`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/ChallengeSubmissionTab.tsx:229](../components/ChallengeSubmissionTab.tsx#L229) — const [submitMode, setSubmitMode] = useState<Mode>(mode);
- [components/ChallengeSubmissionTab.tsx:230](../components/ChallengeSubmissionTab.tsx#L230) — const [settings, setSettings] = useState<ChallengeSettingsData | null>(null);
- [components/ChallengeSubmissionTab.tsx:232](../components/ChallengeSubmissionTab.tsx#L232) — useState<(ChallengeSubmissionData & { id: string }) | null>(null);
- [components/ChallengeSubmissionTab.tsx:233](../components/ChallengeSubmissionTab.tsx#L233) — const [loading, setLoading] = useState(true);
- [components/ChallengeSubmissionTab.tsx:235](../components/ChallengeSubmissionTab.tsx#L235) — const [photos, setPhotos] = useState<PhotoSlot[]>(EMPTY_SLOTS);
- [components/ChallengeSubmissionTab.tsx:236](../components/ChallengeSubmissionTab.tsx#L236) — const [videoFile, setVideoFile] = useState<File | null>(null);
- [components/ChallengeSubmissionTab.tsx:237](../components/ChallengeSubmissionTab.tsx#L237) — const [videoUrl, setVideoUrl] = useState<string | null>(null);
- [components/ChallengeSubmissionTab.tsx:238](../components/ChallengeSubmissionTab.tsx#L238) — const [videoUploading, setVideoUploading] = useState(false);
- [components/ChallengeSubmissionTab.tsx:239](../components/ChallengeSubmissionTab.tsx#L239) — const [description, setDescription] = useState('');
- [components/ChallengeSubmissionTab.tsx:240](../components/ChallengeSubmissionTab.tsx#L240) — const [termsAccepted, setTermsAccepted] = useState(false);
- [components/ChallengeSubmissionTab.tsx:241](../components/ChallengeSubmissionTab.tsx#L241) — const [submitting, setSubmitting] = useState(false);
- [components/ChallengeSubmissionTab.tsx:242](../components/ChallengeSubmissionTab.tsx#L242) — const [errorMsg, setErrorMsg] = useState<string | null>(null);
- [components/ChallengeSubmissionTab.tsx:975](../components/ChallengeSubmissionTab.tsx#L975) — disabled={!canSubmit}

Responsive: [components/ChallengeSubmissionTab.tsx:492](../components/ChallengeSubmissionTab.tsx#L492) <div className="p-6 md:p-10 animate-fadeUp">; [components/ChallengeSubmissionTab.tsx:500](../components/ChallengeSubmissionTab.tsx#L500) <div className="p-6 md:p-10 animate-fadeUp">; [components/ChallengeSubmissionTab.tsx:516](../components/ChallengeSubmissionTab.tsx#L516) <div className="p-6 md:p-10 animate-fadeUp">; [components/ChallengeSubmissionTab.tsx:529](../components/ChallengeSubmissionTab.tsx#L529) <div className="p-6 md:p-10 animate-fadeUp">; [components/ChallengeSubmissionTab.tsx:557](../components/ChallengeSubmissionTab.tsx#L557) <div className="p-6 md:p-10 animate-fadeUp">; [components/ChallengeSubmissionTab.tsx:599](../components/ChallengeSubmissionTab.tsx#L599) className="w-full sm:w-auto bg-brand-yellow text-[#0a0a0a] font-black text-sm px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"; [components/ChallengeSubmissionTab.tsx:738](../components/ChallengeSubmissionTab.tsx#L738) <div className="p-6 md:p-10 animate-fadeUp max-w-[840px]">; [components/ChallengeSubmissionTab.tsx:799](../components/ChallengeSubmissionTab.tsx#L799) <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">; [components/ChallengeSubmissionTab.tsx:831](../components/ChallengeSubmissionTab.tsx#L831) <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">; [components/ChallengeSubmissionTab.tsx:976](../components/ChallengeSubmissionTab.tsx#L976) className={`w-full sm:w-auto px-8 py-3 rounded-xl font-black text-sm transition-colors ${

### ComingSoon

[components/ComingSoon.tsx:18](../components/ComingSoon.tsx#L18)

Sizes/geometry/type: `rounded-3xl`, `p-8`, `text-center`, `text-4xl`, `text-sm`, `text-[#888]`, `text-[11px]`, `text-[#444]`, `text-brand-yellow`, `disabled:text-[#555]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/ComingSoon.tsx:21](../components/ComingSoon.tsx#L21) — const [done, setDone] = useState(false);
- [components/ComingSoon.tsx:22](../components/ComingSoon.tsx#L22) — const [sending, setSending] = useState(false);
- [components/ComingSoon.tsx:51](../components/ComingSoon.tsx#L51) — disabled={done || sending}

Responsive: No explicit breakpoint; inherited/container behavior only.

### ConditionalNav

[components/ConditionalNav.tsx:28](../components/ConditionalNav.tsx#L28)

Sizes/geometry/type: `min-h-screen`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### ConfirmDialog

[components/ConfirmDialog.tsx:14](../components/ConfirmDialog.tsx#L14)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|
| padding | '20px' — [components/ConfirmDialog.tsx:35](../components/ConfirmDialog.tsx#L35) |
| borderRadius | '16px' — [components/ConfirmDialog.tsx:40](../components/ConfirmDialog.tsx#L40) |
| padding | '28px' — [components/ConfirmDialog.tsx:41](../components/ConfirmDialog.tsx#L41) |
| maxWidth | '360px' — [components/ConfirmDialog.tsx:42](../components/ConfirmDialog.tsx#L42) |
| width | '100%' — [components/ConfirmDialog.tsx:43](../components/ConfirmDialog.tsx#L43) |
| fontSize | '16px' — [components/ConfirmDialog.tsx:46](../components/ConfirmDialog.tsx#L46) |
| fontSize | '13px' — [components/ConfirmDialog.tsx:55](../components/ConfirmDialog.tsx#L55) |
| lineHeight | '1.6' — [components/ConfirmDialog.tsx:57](../components/ConfirmDialog.tsx#L57) |
| gap | '10px' — [components/ConfirmDialog.tsx:63](../components/ConfirmDialog.tsx#L63) |
| padding | '11px' — [components/ConfirmDialog.tsx:68](../components/ConfirmDialog.tsx#L68) |
| borderRadius | '99px' — [components/ConfirmDialog.tsx:71](../components/ConfirmDialog.tsx#L71) |
| fontSize | '13px' — [components/ConfirmDialog.tsx:73](../components/ConfirmDialog.tsx#L73) |
| padding | '11px' — [components/ConfirmDialog.tsx:85](../components/ConfirmDialog.tsx#L85) |
| borderRadius | '99px' — [components/ConfirmDialog.tsx:88](../components/ConfirmDialog.tsx#L88) |
| fontSize | '13px' — [components/ConfirmDialog.tsx:90](../components/ConfirmDialog.tsx#L90) |

Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### CookieBanner

[components/CookieBanner.tsx:12](../components/CookieBanner.tsx#L12)

Sizes/geometry/type: `w-full`, `md:max-w-sm`, `md:w-full`, `p-6`, `rounded-t-2xl`, `md:rounded-2xl`, `text-base`, `md:text-lg`, `text-white`, `text-xs`, `md:text-sm`, `text-[#888580]`, `gap-3`, `text-[#0A0A0A]`, `py-3`, `rounded-xl`, `text-[#F0EDE8]`, `md:p-8`, `md:max-w-md`, `text-xl`, `md:text-2xl`, `gap-4`, `w-12`, `h-6`, `rounded-full`, `px-1`, `w-4`, `h-4`, `py-4`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/CookieBanner.tsx:14](../components/CookieBanner.tsx#L14) — const [isVisible, setIsVisible] = useState(false);
- [components/CookieBanner.tsx:15](../components/CookieBanner.tsx#L15) — const [showModal, setShowModal] = useState(false);
- [components/CookieBanner.tsx:16](../components/CookieBanner.tsx#L16) — const [settings, setSettings] = useState<CookieSettings>({

Responsive: [components/CookieBanner.tsx:51](../components/CookieBanner.tsx#L51) <div className="fixed bottom-0 md:bottom-6 left-0 md:left-6 z-[100] w-full md:max-w-sm md:w-full bg-[#111111] border-t md:border border-[#1E1E1E] p-6 rounded-t-2xl md:rounded-2xl shadow-2xl animate-fadeUp">; [components/CookieBanner.tsx:52](../components/CookieBanner.tsx#L52) <h3 className="text-base md:text-lg font-black text-white mb-2">{t('cookies.title')}</h3>; [components/CookieBanner.tsx:53](../components/CookieBanner.tsx#L53) <p className="text-xs md:text-sm font-bold text-[#888580] mb-6 leading-relaxed">; [components/CookieBanner.tsx:81](../components/CookieBanner.tsx#L81) <div className="fixed inset-0 z-[110] bg-black/80 flex flex-col justify-end md:items-center md:justify-center animate-fadeIn">; [components/CookieBanner.tsx:82](../components/CookieBanner.tsx#L82) <div className="bg-[#111111] border-t md:border border-[#1E1E1E] rounded-t-2xl md:rounded-2xl p-6 md:p-8 w-full md:max-w-md">; [components/CookieBanner.tsx:83](../components/CookieBanner.tsx#L83) <h3 className="text-xl md:text-2xl font-black text-white mb-6">{t('cookies.prefsTitle')}</h3>; [components/CookieBanner.tsx:89](../components/CookieBanner.tsx#L89) <p className="text-xs md:text-sm text-[#888580] font-bold mt-1">{t('cookies.essentialDesc')}</p>; [components/CookieBanner.tsx:99](../components/CookieBanner.tsx#L99) <p className="text-xs md:text-sm text-[#888580] font-bold mt-1">{t('cookies.preferencesDesc')}</p>; [components/CookieBanner.tsx:112](../components/CookieBanner.tsx#L112) <p className="text-xs md:text-sm text-[#888580] font-bold mt-1">{t('cookies.analyticsDesc')}</p>

### CountdownTimer

[components/CountdownTimer.tsx:10](../components/CountdownTimer.tsx#L10)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/CountdownTimer.tsx:11](../components/CountdownTimer.tsx#L11) — const [now, setNow] = useState<number>(() => Date.now());

Responsive: No explicit breakpoint; inherited/container behavior only.

### DeleteAccountButton

[components/DeleteAccountButton.tsx:46](../components/DeleteAccountButton.tsx#L46)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|
| borderRadius | '99px' — [components/DeleteAccountButton.tsx:124](../components/DeleteAccountButton.tsx#L124) |
| padding | '10px 20px' — [components/DeleteAccountButton.tsx:125](../components/DeleteAccountButton.tsx#L125) |
| fontSize | '13px' — [components/DeleteAccountButton.tsx:126](../components/DeleteAccountButton.tsx#L126) |
| padding | '20px' — [components/DeleteAccountButton.tsx:146](../components/DeleteAccountButton.tsx#L146) |
| borderRadius | '20px' — [components/DeleteAccountButton.tsx:153](../components/DeleteAccountButton.tsx#L153) |
| padding | '32px' — [components/DeleteAccountButton.tsx:154](../components/DeleteAccountButton.tsx#L154) |
| maxWidth | '400px' — [components/DeleteAccountButton.tsx:155](../components/DeleteAccountButton.tsx#L155) |
| width | '100%' — [components/DeleteAccountButton.tsx:156](../components/DeleteAccountButton.tsx#L156) |
| fontSize | '18px' — [components/DeleteAccountButton.tsx:161](../components/DeleteAccountButton.tsx#L161) |
| fontSize | '13px' — [components/DeleteAccountButton.tsx:173](../components/DeleteAccountButton.tsx#L173) |
| lineHeight | 1.8 — [components/DeleteAccountButton.tsx:175](../components/DeleteAccountButton.tsx#L175) |
| borderRadius | '10px' — [components/DeleteAccountButton.tsx:189](../components/DeleteAccountButton.tsx#L189) |
| padding | '10px 14px' — [components/DeleteAccountButton.tsx:190](../components/DeleteAccountButton.tsx#L190) |
| fontSize | '12px' — [components/DeleteAccountButton.tsx:191](../components/DeleteAccountButton.tsx#L191) |
| gap | '10px' — [components/DeleteAccountButton.tsx:201](../components/DeleteAccountButton.tsx#L201) |
| borderRadius | '99px' — [components/DeleteAccountButton.tsx:209](../components/DeleteAccountButton.tsx#L209) |
| padding | '13px' — [components/DeleteAccountButton.tsx:210](../components/DeleteAccountButton.tsx#L210) |
| fontSize | '14px' — [components/DeleteAccountButton.tsx:211](../components/DeleteAccountButton.tsx#L211) |
| width | '100%' — [components/DeleteAccountButton.tsx:215](../components/DeleteAccountButton.tsx#L215) |
| borderRadius | '99px' — [components/DeleteAccountButton.tsx:231](../components/DeleteAccountButton.tsx#L231) |
| padding | '13px' — [components/DeleteAccountButton.tsx:232](../components/DeleteAccountButton.tsx#L232) |
| fontSize | '14px' — [components/DeleteAccountButton.tsx:233](../components/DeleteAccountButton.tsx#L233) |
| width | '100%' — [components/DeleteAccountButton.tsx:237](../components/DeleteAccountButton.tsx#L237) |
| padding | '20px' — [components/DeleteAccountButton.tsx:258](../components/DeleteAccountButton.tsx#L258) |
| borderRadius | '20px' — [components/DeleteAccountButton.tsx:265](../components/DeleteAccountButton.tsx#L265) |
| padding | '32px' — [components/DeleteAccountButton.tsx:266](../components/DeleteAccountButton.tsx#L266) |
| maxWidth | '380px' — [components/DeleteAccountButton.tsx:267](../components/DeleteAccountButton.tsx#L267) |
| width | '100%' — [components/DeleteAccountButton.tsx:268](../components/DeleteAccountButton.tsx#L268) |
| fontSize | '16px' — [components/DeleteAccountButton.tsx:273](../components/DeleteAccountButton.tsx#L273) |
| fontSize | '13px' — [components/DeleteAccountButton.tsx:284](../components/DeleteAccountButton.tsx#L284) |
| lineHeight | 1.6 — [components/DeleteAccountButton.tsx:287](../components/DeleteAccountButton.tsx#L287) |
| borderRadius | '10px' — [components/DeleteAccountButton.tsx:299](../components/DeleteAccountButton.tsx#L299) |
| padding | '10px 14px' — [components/DeleteAccountButton.tsx:300](../components/DeleteAccountButton.tsx#L300) |
| fontSize | '12px' — [components/DeleteAccountButton.tsx:301](../components/DeleteAccountButton.tsx#L301) |
| width | '100%' — [components/DeleteAccountButton.tsx:316](../components/DeleteAccountButton.tsx#L316) |
| borderRadius | '99px' — [components/DeleteAccountButton.tsx:319](../components/DeleteAccountButton.tsx#L319) |
| padding | '12px' — [components/DeleteAccountButton.tsx:320](../components/DeleteAccountButton.tsx#L320) |
| fontSize | '13px' — [components/DeleteAccountButton.tsx:321](../components/DeleteAccountButton.tsx#L321) |
| gap | '8px' — [components/DeleteAccountButton.tsx:328](../components/DeleteAccountButton.tsx#L328) |
| width | '100%' — [components/DeleteAccountButton.tsx:354](../components/DeleteAccountButton.tsx#L354) |
| borderRadius | '10px' — [components/DeleteAccountButton.tsx:357](../components/DeleteAccountButton.tsx#L357) |
| padding | '12px 16px' — [components/DeleteAccountButton.tsx:358](../components/DeleteAccountButton.tsx#L358) |
| fontSize | '16px' — [components/DeleteAccountButton.tsx:360](../components/DeleteAccountButton.tsx#L360) |
| width | '100%' — [components/DeleteAccountButton.tsx:371](../components/DeleteAccountButton.tsx#L371) |
| borderRadius | '99px' — [components/DeleteAccountButton.tsx:374](../components/DeleteAccountButton.tsx#L374) |
| padding | '12px' — [components/DeleteAccountButton.tsx:375](../components/DeleteAccountButton.tsx#L375) |
| fontSize | '13px' — [components/DeleteAccountButton.tsx:376](../components/DeleteAccountButton.tsx#L376) |
| width | '100%' — [components/DeleteAccountButton.tsx:396](../components/DeleteAccountButton.tsx#L396) |
| fontSize | '12px' — [components/DeleteAccountButton.tsx:400](../components/DeleteAccountButton.tsx#L400) |
| padding | '8px' — [components/DeleteAccountButton.tsx:404](../components/DeleteAccountButton.tsx#L404) |

Variants/state evidence:

- [components/DeleteAccountButton.tsx:50](../components/DeleteAccountButton.tsx#L50) — const [showConfirm, setShowConfirm] = useState(false);
- [components/DeleteAccountButton.tsx:51](../components/DeleteAccountButton.tsx#L51) — const [showReauth, setShowReauth] = useState(false);
- [components/DeleteAccountButton.tsx:52](../components/DeleteAccountButton.tsx#L52) — const [deleting, setDeleting] = useState(false);
- [components/DeleteAccountButton.tsx:53](../components/DeleteAccountButton.tsx#L53) — const [reauthPassword, setReauthPassword] = useState('');
- [components/DeleteAccountButton.tsx:54](../components/DeleteAccountButton.tsx#L54) — const [error, setError] = useState('');
- [components/DeleteAccountButton.tsx:204](../components/DeleteAccountButton.tsx#L204) — disabled={deleting}
- [components/DeleteAccountButton.tsx:226](../components/DeleteAccountButton.tsx#L226) — disabled={deleting}
- [components/DeleteAccountButton.tsx:314](../components/DeleteAccountButton.tsx#L314) — disabled={deleting}
- [components/DeleteAccountButton.tsx:369](../components/DeleteAccountButton.tsx#L369) — disabled={deleting || !reauthPassword}

Responsive: No explicit breakpoint; inherited/container behavior only.

### EmptySearch

[components/EmptyStates.tsx:4](../components/EmptyStates.tsx#L4)

Sizes/geometry/type: `rounded-[16px]`, `p-[48px]`, `text-center`, `text-5xl`, `text-xl`, `text-[#888888]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### EmptyClientBookings

[components/EmptyStates.tsx:14](../components/EmptyStates.tsx#L14)

Sizes/geometry/type: `rounded-[16px]`, `p-[48px]`, `text-center`, `text-5xl`, `text-xl`, `text-[#888888]`, `text-black`, `px-6`, `py-2.5`, `rounded-full`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### EmptyBarberBookings

[components/EmptyStates.tsx:30](../components/EmptyStates.tsx#L30)

Sizes/geometry/type: `rounded-[16px]`, `p-[48px]`, `text-center`, `text-5xl`, `text-xl`, `text-[#888888]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### EmptyFavourites

[components/EmptyStates.tsx:40](../components/EmptyStates.tsx#L40)

Sizes/geometry/type: `rounded-[16px]`, `p-[48px]`, `text-center`, `text-5xl`, `text-xl`, `text-[#888888]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### Footer

[components/Footer.tsx:7](../components/Footer.tsx#L7)

Sizes/geometry/type: `py-12`, `px-6`, `max-w-[1200px]`, `gap-6`, `pb-12`, `text-xs`, `text-[#888580]`, `sm:gap-8`, `hover:text-[#F0EDE8]`, `gap-4`, `text-center`, `text-[10px]`
| Dimension/property | Exact value/source |
|---|---|
| gap | '6px' — [components/Footer.tsx:45](../components/Footer.tsx#L45) |
| fontSize | '11px' — [components/Footer.tsx:45](../components/Footer.tsx#L45) |

Variants/state evidence:

Not established / not found.

Responsive: [components/Footer.tsx:11](../components/Footer.tsx#L11) <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-[#1E1E1E] mb-8">; [components/Footer.tsx:12](../components/Footer.tsx#L12) <div className="flex flex-col items-center md:items-start">; [components/Footer.tsx:19](../components/Footer.tsx#L19) <div className="flex gap-6 sm:gap-8 flex-wrap justify-center">

### NotificationBell

[components/NotificationBell.tsx:10](../components/NotificationBell.tsx#L10)

Sizes/geometry/type: `w-9`, `h-9`, `rounded-full`, `text-[15px]`, `w-4`, `h-4`, `text-[9px]`, `w-[300px]`, `rounded-2xl`, `p-3.5`, `text-[13px]`, `max-h-[300px]`, `p-4`, `text-center`, `text-xs`, `text-brand-text-secondary`, `w-full`, `text-left`, `gap-1`, `text-[10px]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/NotificationBell.tsx:13](../components/NotificationBell.tsx#L13) — const [notifications, setNotifications] = useState<any[]>([]);
- [components/NotificationBell.tsx:14](../components/NotificationBell.tsx#L14) — const [showDropdown, setShowDropdown] = useState(false);
- [components/NotificationBell.tsx:18](../components/NotificationBell.tsx#L18) — const [localUnreadCount, setLocalUnreadCount] = useState(appUser?.unreadCount || 0);

Responsive: No explicit breakpoint; inherited/container behavior only.

### OfflineBanner

[components/OfflineBanner.tsx:6](../components/OfflineBanner.tsx#L6)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|
| padding | '10px 20px' — [components/OfflineBanner.tsx:51](../components/OfflineBanner.tsx#L51) |
| fontSize | '13px' — [components/OfflineBanner.tsx:53](../components/OfflineBanner.tsx#L53) |

Variants/state evidence:

- [components/OfflineBanner.tsx:8](../components/OfflineBanner.tsx#L8) — const [isOnline, setIsOnline] = useState(true);
- [components/OfflineBanner.tsx:9](../components/OfflineBanner.tsx#L9) — const [wasOffline, setWasOffline] = useState(false);
- [components/OfflineBanner.tsx:10](../components/OfflineBanner.tsx#L10) — const [showBackOnline, setShowBackOnline] = useState(false);

Responsive: No explicit breakpoint; inherited/container behavior only.

### PasswordInput

[components/PasswordInput.tsx:18](../components/PasswordInput.tsx#L18)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|
| width | '100%' — [components/PasswordInput.tsx:31](../components/PasswordInput.tsx#L31) |
| paddingRight | '44px' — [components/PasswordInput.tsx:43](../components/PasswordInput.tsx#L43) |
| width | '100%' — [components/PasswordInput.tsx:43](../components/PasswordInput.tsx#L43) |
| padding | '0' — [components/PasswordInput.tsx:58](../components/PasswordInput.tsx#L58) |
| lineHeight | 1 — [components/PasswordInput.tsx:62](../components/PasswordInput.tsx#L62) |

Variants/state evidence:

- [components/PasswordInput.tsx:28](../components/PasswordInput.tsx#L28) — const [show, setShow] = useState(false);

Responsive: No explicit breakpoint; inherited/container behavior only.

### RouteGuard

[components/RouteGuard.tsx:70](../components/RouteGuard.tsx#L70)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/RouteGuard.tsx:74](../components/RouteGuard.tsx#L74) — const [authorized, setAuthorized] = useState(false);
- [components/RouteGuard.tsx:75](../components/RouteGuard.tsx#L75) — const [checking, setChecking] = useState(true);

Responsive: No explicit breakpoint; inherited/container behavior only.

### ShopAvailabilityTab

[components/ShopAvailabilityTab.tsx:64](../components/ShopAvailabilityTab.tsx#L64)

Sizes/geometry/type: `max-w-2xl`, `text-2xl`, `text-[#888]`, `text-sm`, `rounded-3xl`, `p-6`, `text-base`, `gap-4`, `rounded-xl`, `p-4`, `gap-3`, `w-10`, `h-5`, `rounded-full`, `w-4`, `h-4`, `w-[90px]`, `gap-2`, `text-[11px]`, `text-[#666]`, `text-white`, `rounded-lg`, `px-2`, `py-1.5`, `text-[#555]`, `text-[10px]`, `text-brand-yellow`, `text-[12px]`, `pl-[52px]`, `hover:text-[#888]`, `text-xs`, `hover:text-brand-red`, `w-full`, `text-black`, `py-3`, `text-center`, `px-3`, `py-2.5`, `min-w-[140px]`, `px-5`, `gap-1.5`, `hover:text-brand-yellow`, `text-[#444]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/ShopAvailabilityTab.tsx:76](../components/ShopAvailabilityTab.tsx#L76) — const [hours, setHours] = useState<WeeklyHours>(DEFAULT_HOURS);
- [components/ShopAvailabilityTab.tsx:77](../components/ShopAvailabilityTab.tsx#L77) — const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
- [components/ShopAvailabilityTab.tsx:78](../components/ShopAvailabilityTab.tsx#L78) — const [newClosureDate, setNewClosureDate] = useState('');
- [components/ShopAvailabilityTab.tsx:79](../components/ShopAvailabilityTab.tsx#L79) — const [newClosureReason, setNewClosureReason] = useState('');
- [components/ShopAvailabilityTab.tsx:80](../components/ShopAvailabilityTab.tsx#L80) — const [saving, setSaving] = useState(false);
- [components/ShopAvailabilityTab.tsx:81](../components/ShopAvailabilityTab.tsx#L81) — const [lastSaved, setLastSaved] = useState<number | null>(null);
- [components/ShopAvailabilityTab.tsx:260](../components/ShopAvailabilityTab.tsx#L260) — disabled={saving}
- [components/ShopAvailabilityTab.tsx:284](../components/ShopAvailabilityTab.tsx#L284) — <button onClick={addClosure} disabled={!newClosureDate}

Responsive: No explicit breakpoint; inherited/container behavior only.

### ShopPhotosTab

[components/ShopPhotosTab.tsx:15](../components/ShopPhotosTab.tsx#L15)

Sizes/geometry/type: `max-w-2xl`, `text-2xl`, `text-brand-text-secondary`, `text-sm`, `text-lg`, `text-xs`, `text-[#888]`, `text-[11px]`, `px-3`, `py-1.5`, `rounded-full`, `rounded-3xl`, `p-8`, `text-center`, `text-4xl`, `text-[#444]`, `text-brand-yellow`, `rounded-2xl`, `p-5`, `text-[12px]`, `gap-1.5`, `text-[#666]`, `text-brand-green`, `gap-2`, `rounded-[10px]`, `text-[10px]`, `text-[#333]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/ShopPhotosTab.tsx:18](../components/ShopPhotosTab.tsx#L18) — const [notified, setNotified] = useState(false);
- [components/ShopPhotosTab.tsx:19](../components/ShopPhotosTab.tsx#L19) — const [notifying, setNotifying] = useState(false);
- [components/ShopPhotosTab.tsx:66](../components/ShopPhotosTab.tsx#L66) — disabled={notified || notifying}

Responsive: No explicit breakpoint; inherited/container behavior only.

### ShopServicesTab

[components/ShopServicesTab.tsx:25](../components/ShopServicesTab.tsx#L25)

Sizes/geometry/type: `max-w-2xl`, `text-2xl`, `text-brand-text-secondary`, `text-sm`, `text-[12px]`, `text-[#888]`, `rounded-xl`, `p-5`, `gap-2`, `text-lg`, `text-brand-yellow`, `text-xs`, `max-w-sm`, `gap-3`, `text-[10px]`, `text-white`, `rounded-lg`, `px-3`, `py-2`, `w-20`, `px-4`, `p-4`, `min-w-[120px]`, `py-1.5`, `w-16`, `px-2`, `pl-6`, `pr-2`, `text-[11px]`, `text-brand-green`, `hover:text-white`, `text-base`, `w-9`, `h-5`, `rounded-full`, `w-4`, `h-4`, `w-8`, `h-8`, `text-[#555]`, `hover:text-brand-yellow`, `hover:text-brand-red`, `text-brand-red`, `w-full`, `py-3`, `pl-8`, `pr-4`, `sm:w-auto`, `text-black`, `px-6`, `rounded-[10px]`, `px-[14px]`, `py-[10px]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/ShopServicesTab.tsx:31](../components/ShopServicesTab.tsx#L31) — const [newServiceName, setNewServiceName] = useState('');
- [components/ShopServicesTab.tsx:32](../components/ShopServicesTab.tsx#L32) — const [newServicePrice, setNewServicePrice] = useState('');
- [components/ShopServicesTab.tsx:33](../components/ShopServicesTab.tsx#L33) — const [newServiceDuration, setNewServiceDuration] = useState('');
- [components/ShopServicesTab.tsx:34](../components/ShopServicesTab.tsx#L34) — const [addError, setAddError] = useState('');
- [components/ShopServicesTab.tsx:37](../components/ShopServicesTab.tsx#L37) — const [isSavingTitz, setIsSavingTitz] = useState(false);
- [components/ShopServicesTab.tsx:38](../components/ShopServicesTab.tsx#L38) — const [titzData, setTitzData] = useState({
- [components/ShopServicesTab.tsx:44](../components/ShopServicesTab.tsx#L44) — const [editingId, setEditingId] = useState<string | null>(null);
- [components/ShopServicesTab.tsx:45](../components/ShopServicesTab.tsx#L45) — const [editName, setEditName] = useState('');
- [components/ShopServicesTab.tsx:46](../components/ShopServicesTab.tsx#L46) — const [editPrice, setEditPrice] = useState('');
- [components/ShopServicesTab.tsx:47](../components/ShopServicesTab.tsx#L47) — const [editDuration, setEditDuration] = useState('');
- [components/ShopServicesTab.tsx:146](../components/ShopServicesTab.tsx#L146) — <button onClick={handleSaveTitzCut} disabled={isSavingTitz}
- [components/ShopServicesTab.tsx:237](../components/ShopServicesTab.tsx#L237) — disabled={!newServiceName || !newServicePrice || !newServiceDuration}

Responsive: [components/ShopServicesTab.tsx:218](../components/ShopServicesTab.tsx#L218) <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4">; [components/ShopServicesTab.tsx:219](../components/ShopServicesTab.tsx#L219) <div className="sm:col-span-6">; [components/ShopServicesTab.tsx:224](../components/ShopServicesTab.tsx#L224) <div className="sm:col-span-3">; [components/ShopServicesTab.tsx:229](../components/ShopServicesTab.tsx#L229) <div className="sm:col-span-3 relative">; [components/ShopServicesTab.tsx:238](../components/ShopServicesTab.tsx#L238) className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors mb-4">

### ShopSettingsTab

[components/ShopSettingsTab.tsx:32](../components/ShopSettingsTab.tsx#L32)

Sizes/geometry/type: `max-w-2xl`, `text-2xl`, `text-brand-text-secondary`, `text-sm`, `text-brand-red`, `rounded-xl`, `px-4`, `py-3`, `text-brand-green`, `rounded-3xl`, `p-6`, `text-lg`, `gap-6`, `w-24`, `h-24`, `rounded-2xl`, `w-full`, `h-full`, `text-3xl`, `text-white`, `gap-3`, `px-5`, `py-2.5`, `rounded-full`, `text-xs`, `text-[#888]`, `h-[140px]`, `text-4xl`, `gap-2`, `min-w-[120px]`, `placeholder:text-[#444]`, `h-[48px]`, `gap-4`, `text-black`, `px-6`, `text-[10px]`, `text-[#555]`, `text-[12px]`, `text-brand-yellow`, `text-[#aaa]`, `w-11`, `h-6`, `w-4`, `h-4`, `w-max`, `text-[13px]`
| Dimension/property | Exact value/source |
|---|---|
| borderRadius | '0.75rem' — [components/ShopSettingsTab.tsx:113](../components/ShopSettingsTab.tsx#L113) |
| padding | '2px' — [components/ShopSettingsTab.tsx:114](../components/ShopSettingsTab.tsx#L114) |
| borderRadius | '0.75rem' — [components/ShopSettingsTab.tsx:125](../components/ShopSettingsTab.tsx#L125) |
| borderRadius | 16 — [components/ShopSettingsTab.tsx:886](../components/ShopSettingsTab.tsx#L886) |
| padding | 24 — [components/ShopSettingsTab.tsx:887](../components/ShopSettingsTab.tsx#L887) |
| fontSize | 13 — [components/ShopSettingsTab.tsx:891](../components/ShopSettingsTab.tsx#L891) |
| fontSize | 14 — [components/ShopSettingsTab.tsx:909](../components/ShopSettingsTab.tsx#L909) |
| width | 44 — [components/ShopSettingsTab.tsx:918](../components/ShopSettingsTab.tsx#L918) |
| height | 24 — [components/ShopSettingsTab.tsx:919](../components/ShopSettingsTab.tsx#L919) |
| borderRadius | 12 — [components/ShopSettingsTab.tsx:920](../components/ShopSettingsTab.tsx#L920) |
| width | 20 — [components/ShopSettingsTab.tsx:934](../components/ShopSettingsTab.tsx#L934) |
| height | 20 — [components/ShopSettingsTab.tsx:935](../components/ShopSettingsTab.tsx#L935) |
| borderRadius | '50%' — [components/ShopSettingsTab.tsx:936](../components/ShopSettingsTab.tsx#L936) |
| fontSize | 13 — [components/ShopSettingsTab.tsx:948](../components/ShopSettingsTab.tsx#L948) |
| borderRadius | 10 — [components/ShopSettingsTab.tsx:967](../components/ShopSettingsTab.tsx#L967) |
| fontSize | 14 — [components/ShopSettingsTab.tsx:969](../components/ShopSettingsTab.tsx#L969) |
| padding | '10px 14px' — [components/ShopSettingsTab.tsx:970](../components/ShopSettingsTab.tsx#L970) |
| width | 100 — [components/ShopSettingsTab.tsx:971](../components/ShopSettingsTab.tsx#L971) |
| fontSize | 13 — [components/ShopSettingsTab.tsx:986](../components/ShopSettingsTab.tsx#L986) |
| padding | '10px 20px' — [components/ShopSettingsTab.tsx:987](../components/ShopSettingsTab.tsx#L987) |
| borderRadius | 10 — [components/ShopSettingsTab.tsx:988](../components/ShopSettingsTab.tsx#L988) |

Variants/state evidence:

- [components/ShopSettingsTab.tsx:36](../components/ShopSettingsTab.tsx#L36) — const [photoLoading, setPhotoLoading] = useState(false);
- [components/ShopSettingsTab.tsx:37](../components/ShopSettingsTab.tsx#L37) — const [logoLoading, setLogoLoading] = useState(false);
- [components/ShopSettingsTab.tsx:38](../components/ShopSettingsTab.tsx#L38) — const [savingGlobal, setSavingGlobal] = useState(false);
- [components/ShopSettingsTab.tsx:39](../components/ShopSettingsTab.tsx#L39) — const [savingSocial, setSavingSocial] = useState(false);
- [components/ShopSettingsTab.tsx:40](../components/ShopSettingsTab.tsx#L40) — const [deleting, setDeleting] = useState(false);
- [components/ShopSettingsTab.tsx:41](../components/ShopSettingsTab.tsx#L41) — const [errorMsg, setErrorMsg] = useState('');
- [components/ShopSettingsTab.tsx:42](../components/ShopSettingsTab.tsx#L42) — const [successMsg, setSuccessMsg] = useState('');
- [components/ShopSettingsTab.tsx:43](../components/ShopSettingsTab.tsx#L43) — const [localPhotoUrl, setLocalPhotoUrl] = useState('');
- [components/ShopSettingsTab.tsx:44](../components/ShopSettingsTab.tsx#L44) — const [localLogoUrl, setLocalLogoUrl] = useState('');
- [components/ShopSettingsTab.tsx:46](../components/ShopSettingsTab.tsx#L46) — const [formData, setFormData] = useState({
- [components/ShopSettingsTab.tsx:61](../components/ShopSettingsTab.tsx#L61) — const [phoneNumberInput, setPhoneNumberInput] = useState(initPhoneNumStr);
- [components/ShopSettingsTab.tsx:62](../components/ShopSettingsTab.tsx#L62) — const [phoneCode, setPhoneCode] = useState<any>(null);
- [components/ShopSettingsTab.tsx:64](../components/ShopSettingsTab.tsx#L64) — const [selectedCountry, setSelectedCountry] = useState<any>(null);
- [components/ShopSettingsTab.tsx:65](../components/ShopSettingsTab.tsx#L65) — const [selectedState, setSelectedState] = useState<any>(null);
- [components/ShopSettingsTab.tsx:66](../components/ShopSettingsTab.tsx#L66) — const [selectedCityOption, setSelectedCityOption] = useState<any>(null);
- [components/ShopSettingsTab.tsx:67](../components/ShopSettingsTab.tsx#L67) — const [csc, setCsc] = useState<any>(null);
- [components/ShopSettingsTab.tsx:152](../components/ShopSettingsTab.tsx#L152) — const [socialData, setSocialData] = useState({
- [components/ShopSettingsTab.tsx:158](../components/ShopSettingsTab.tsx#L158) — const [googleMapsUrl, setGoogleMapsUrl] = useState(shop?.googleMapsUrl || '');
- [components/ShopSettingsTab.tsx:159](../components/ShopSettingsTab.tsx#L159) — const [savingMaps, setSavingMaps] = useState(false);
- [components/ShopSettingsTab.tsx:160](../components/ShopSettingsTab.tsx#L160) — const [notifyInviteResponse, setNotifyInviteResponse] = useState(shop?.notifyInviteResponse !== false);
- [components/ShopSettingsTab.tsx:161](../components/ShopSettingsTab.tsx#L161) — const [notifyNewBooking, setNotifyNewBooking] = useState(shop?.notifyNewBooking !== false);
- [components/ShopSettingsTab.tsx:163](../components/ShopSettingsTab.tsx#L163) — const [rentsChairs, setRentsChairs] = useState<boolean>(shop?.rentsChairs ?? false);
- [components/ShopSettingsTab.tsx:164](../components/ShopSettingsTab.tsx#L164) — const [availableChairsForRent, setAvailableChairsForRent] = useState<number>(shop?.availableChairsForRent ?? 0);
- [components/ShopSettingsTab.tsx:165](../components/ShopSettingsTab.tsx#L165) — const [savingChairRental, setSavingChairRental] = useState(false);
- [components/ShopSettingsTab.tsx:555](../components/ShopSettingsTab.tsx#L555) — disabled={logoLoading}
- [components/ShopSettingsTab.tsx:593](../components/ShopSettingsTab.tsx#L593) — disabled={photoLoading}
- [components/ShopSettingsTab.tsx:790](../components/ShopSettingsTab.tsx#L790) — disabled={savingGlobal}
- [components/ShopSettingsTab.tsx:836](../components/ShopSettingsTab.tsx#L836) — disabled={savingSocial}
- [components/ShopSettingsTab.tsx:875](../components/ShopSettingsTab.tsx#L875) — disabled={savingMaps}
- [components/ShopSettingsTab.tsx:981](../components/ShopSettingsTab.tsx#L981) — disabled={savingChairRental}
- [components/ShopSettingsTab.tsx:1032](../components/ShopSettingsTab.tsx#L1032) — disabled={deleting}

Responsive: [components/ShopSettingsTab.tsx:626](../components/ShopSettingsTab.tsx#L626) <div className="flex-[0.8] sm:flex-[0.6] min-w-[120px]">; [components/ShopSettingsTab.tsx:649](../components/ShopSettingsTab.tsx#L649) <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">; [components/ShopSettingsTab.tsx:704](../components/ShopSettingsTab.tsx#L704) <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">; [components/ShopSettingsTab.tsx:727](../components/ShopSettingsTab.tsx#L727) <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">; [components/ShopSettingsTab.tsx:750](../components/ShopSettingsTab.tsx#L750) <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

### ShopTeamTab

[components/ShopTeamTab.tsx:14](../components/ShopTeamTab.tsx#L14)

Sizes/geometry/type: `max-w-2xl`, `text-2xl`, `rounded-3xl`, `p-6`, `text-lg`, `text-xs`, `text-[#888]`, `gap-3`, `rounded-xl`, `px-4`, `py-3`, `text-white`, `text-sm`, `text-black`, `px-6`, `text-brand-red`, `p-3`, `rounded-2xl`, `p-5`, `gap-4`, `w-12`, `h-12`, `min-w-0`, `text-base`, `text-brand-yellow`, `gap-1`, `text-[10px]`, `px-2`, `py-0.5`, `rounded-md`, `text-[#555]`, `text-brand-green`, `text-brand-orange`, `py-2.5`, `hover:text-white`, `p-4`, `px-2.5`, `py-1`, `gap-3.5`, `w-11`, `h-11`, `w-full`, `h-full`, `gap-2`, `text-[15px]`, `text-[#666]`, `text-[11px]`, `pt-4`, `py-2`, `rounded-lg`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/ShopTeamTab.tsx:17](../components/ShopTeamTab.tsx#L17) — const [inviteCode, setInviteCode] = useState('');
- [components/ShopTeamTab.tsx:18](../components/ShopTeamTab.tsx#L18) — const [loading, setLoading] = useState(false);
- [components/ShopTeamTab.tsx:19](../components/ShopTeamTab.tsx#L19) — const [errorMsg, setErrorMsg] = useState('');
- [components/ShopTeamTab.tsx:20](../components/ShopTeamTab.tsx#L20) — const [foundBarber, setFoundBarber] = useState<any>(null);
- [components/ShopTeamTab.tsx:21](../components/ShopTeamTab.tsx#L21) — const [searchAttempts, setSearchAttempts] = useState(0);
- [components/ShopTeamTab.tsx:22](../components/ShopTeamTab.tsx#L22) — const [searchBlockedUntil, setSearchBlockedUntil] = useState<number | null>(null);
- [components/ShopTeamTab.tsx:23](../components/ShopTeamTab.tsx#L23) — const [pendingInvites, setPendingInvites] = useState<any[]>([]);
- [components/ShopTeamTab.tsx:24](../components/ShopTeamTab.tsx#L24) — const [activeBarbers, setActiveBarbers] = useState<any[]>([]);
- [components/ShopTeamTab.tsx:25](../components/ShopTeamTab.tsx#L25) — const [barberUsers, setBarberUsers] = useState<Record<string, any>>({});
- [components/ShopTeamTab.tsx:26](../components/ShopTeamTab.tsx#L26) — const [barberSchedules, setBarberSchedules] = useState<Record<string, any>>({});
- [components/ShopTeamTab.tsx:27](../components/ShopTeamTab.tsx#L27) — const [removeConfirmId, setRemoveConfirmId] = useState<string | null>(null);
- [components/ShopTeamTab.tsx:28](../components/ShopTeamTab.tsx#L28) — const [removing, setRemoving] = useState(false);
- [components/ShopTeamTab.tsx:275](../components/ShopTeamTab.tsx#L275) — disabled={loading || !inviteCode}
- [components/ShopTeamTab.tsx:334](../components/ShopTeamTab.tsx#L334) — disabled={loading}
- [components/ShopTeamTab.tsx:448](../components/ShopTeamTab.tsx#L448) — disabled={removing}

Responsive: No explicit breakpoint; inherited/container behavior only.

### ShopTimePicker

[components/ShopTimePicker.tsx:128](../components/ShopTimePicker.tsx#L128)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|
| padding | '40px 0' — [components/ShopTimePicker.tsx:291](../components/ShopTimePicker.tsx#L291) |
| fontSize | 13 — [components/ShopTimePicker.tsx:291](../components/ShopTimePicker.tsx#L291) |
| padding | '32px 24px' — [components/ShopTimePicker.tsx:305](../components/ShopTimePicker.tsx#L305) |
| borderRadius | 16 — [components/ShopTimePicker.tsx:308](../components/ShopTimePicker.tsx#L308) |
| fontSize | 36 — [components/ShopTimePicker.tsx:311](../components/ShopTimePicker.tsx#L311) |
| fontSize | 15 — [components/ShopTimePicker.tsx:312](../components/ShopTimePicker.tsx#L312) |
| fontSize | 12 — [components/ShopTimePicker.tsx:315](../components/ShopTimePicker.tsx#L315) |
| lineHeight | 1.6 — [components/ShopTimePicker.tsx:315](../components/ShopTimePicker.tsx#L315) |
| width | '100%' — [components/ShopTimePicker.tsx:324](../components/ShopTimePicker.tsx#L324) |
| gap | 6 — [components/ShopTimePicker.tsx:330](../components/ShopTimePicker.tsx#L330) |
| fontSize | 11 — [components/ShopTimePicker.tsx:331](../components/ShopTimePicker.tsx#L331) |
| borderRadius | 99 — [components/ShopTimePicker.tsx:336](../components/ShopTimePicker.tsx#L336) |
| padding | '5px 12px' — [components/ShopTimePicker.tsx:337](../components/ShopTimePicker.tsx#L337) |
| borderRadius | 8 — [components/ShopTimePicker.tsx:359](../components/ShopTimePicker.tsx#L359) |
| padding | '6px 14px' — [components/ShopTimePicker.tsx:360](../components/ShopTimePicker.tsx#L360) |
| fontSize | 14 — [components/ShopTimePicker.tsx:362](../components/ShopTimePicker.tsx#L362) |
| fontSize | 11 — [components/ShopTimePicker.tsx:369](../components/ShopTimePicker.tsx#L369) |
| borderRadius | 8 — [components/ShopTimePicker.tsx:378](../components/ShopTimePicker.tsx#L378) |
| padding | '6px 14px' — [components/ShopTimePicker.tsx:379](../components/ShopTimePicker.tsx#L379) |
| fontSize | 14 — [components/ShopTimePicker.tsx:381](../components/ShopTimePicker.tsx#L381) |
| gap | 6 — [components/ShopTimePicker.tsx:393](../components/ShopTimePicker.tsx#L393) |
| paddingBottom | 8 — [components/ShopTimePicker.tsx:395](../components/ShopTimePicker.tsx#L395) |
| minWidth | 60 — [components/ShopTimePicker.tsx:407](../components/ShopTimePicker.tsx#L407) |
| padding | '8px 10px' — [components/ShopTimePicker.tsx:408](../components/ShopTimePicker.tsx#L408) |
| borderRadius | 10 — [components/ShopTimePicker.tsx:409](../components/ShopTimePicker.tsx#L409) |
| fontSize | 11 — [components/ShopTimePicker.tsx:416](../components/ShopTimePicker.tsx#L416) |
| fontSize | 8 — [components/ShopTimePicker.tsx:423](../components/ShopTimePicker.tsx#L423) |
| padding | '28px 0' — [components/ShopTimePicker.tsx:435](../components/ShopTimePicker.tsx#L435) |
| fontSize | 13 — [components/ShopTimePicker.tsx:437](../components/ShopTimePicker.tsx#L437) |
| fontSize | 11 — [components/ShopTimePicker.tsx:441](../components/ShopTimePicker.tsx#L441) |
| gap | 8 — [components/ShopTimePicker.tsx:447](../components/ShopTimePicker.tsx#L447) |
| borderRadius | 10 — [components/ShopTimePicker.tsx:495](../components/ShopTimePicker.tsx#L495) |
| padding | '11px 8px' — [components/ShopTimePicker.tsx:496](../components/ShopTimePicker.tsx#L496) |
| fontSize | 14 — [components/ShopTimePicker.tsx:504](../components/ShopTimePicker.tsx#L504) |
| fontSize | 10 — [components/ShopTimePicker.tsx:505](../components/ShopTimePicker.tsx#L505) |
| fontSize | 9 — [components/ShopTimePicker.tsx:507](../components/ShopTimePicker.tsx#L507) |
| fontSize | 9 — [components/ShopTimePicker.tsx:512](../components/ShopTimePicker.tsx#L512) |
| padding | 24 — [components/ShopTimePicker.tsx:520](../components/ShopTimePicker.tsx#L520) |
| fontSize | 12 — [components/ShopTimePicker.tsx:520](../components/ShopTimePicker.tsx#L520) |
| gap | 14 — [components/ShopTimePicker.tsx:528](../components/ShopTimePicker.tsx#L528) |
| gap | 5 — [components/ShopTimePicker.tsx:538](../components/ShopTimePicker.tsx#L538) |
| fontSize | 10 — [components/ShopTimePicker.tsx:538](../components/ShopTimePicker.tsx#L538) |
| width | 8 — [components/ShopTimePicker.tsx:539](../components/ShopTimePicker.tsx#L539) |
| height | 8 — [components/ShopTimePicker.tsx:539](../components/ShopTimePicker.tsx#L539) |
| borderRadius | 2 — [components/ShopTimePicker.tsx:539](../components/ShopTimePicker.tsx#L539) |

Variants/state evidence:

- [components/ShopTimePicker.tsx:136](../components/ShopTimePicker.tsx#L136) — const [schedules, setSchedules] = useState<Record<string, any>>({});
- [components/ShopTimePicker.tsx:137](../components/ShopTimePicker.tsx#L137) — const [bookingsByBarber, setBookingsByBarber] = useState<Record<string, any[]>>({});
- [components/ShopTimePicker.tsx:138](../components/ShopTimePicker.tsx#L138) — const [loading, setLoading] = useState(true);
- [components/ShopTimePicker.tsx:139](../components/ShopTimePicker.tsx#L139) — const [weekOffset, setWeekOffset] = useState(0);
- [components/ShopTimePicker.tsx:140](../components/ShopTimePicker.tsx#L140) — const [activeDay, setActiveDay] = useState<string>('');
- [components/ShopTimePicker.tsx:354](../components/ShopTimePicker.tsx#L354) — disabled={weekOffset <= 0}
- [components/ShopTimePicker.tsx:490](../components/ShopTimePicker.tsx#L490) — disabled={!slot.available}

Responsive: No explicit breakpoint; inherited/container behavior only.

### BarberCardSkeleton

[components/skeletons.tsx:3](../components/skeletons.tsx#L3)

Sizes/geometry/type: `rounded-3xl`, `h-[180px]`, `w-12`, `h-12`, `rounded-full`, `p-5`, `h-6`, `w-32`, `rounded-md`, `h-3`, `w-20`, `h-4`, `w-16`, `gap-1.5`, `h-5`, `w-24`, `pt-4`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### BookingRowSkeleton

[components/skeletons.tsx:34](../components/skeletons.tsx#L34)

Sizes/geometry/type: `rounded-2xl`, `p-5`, `h-5`, `w-32`, `rounded-md`, `h-4`, `w-24`, `h-3`, `w-20`, `h-8`, `w-16`, `rounded-lg`, `pt-4`, `h-6`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### StatCardSkeleton

[components/skeletons.tsx:53](../components/skeletons.tsx#L53)

Sizes/geometry/type: `rounded-2xl`, `p-6`, `h-4`, `w-24`, `rounded-md`, `h-8`, `w-16`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### BarberProfileSkeleton

[components/skeletons.tsx:62](../components/skeletons.tsx#L62)

Sizes/geometry/type: `max-w-[1000px]`, `px-4`, `md:px-6`, `py-6`, `md:py-10`, `gap-6`, `md:gap-10`, `w-full`, `md:w-1/3`, `rounded-3xl`, `h-8`, `w-48`, `rounded-xl`, `h-4`, `w-32`, `rounded-lg`, `w-2/3`, `h-10`, `h-24`, `rounded-2xl`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/skeletons.tsx:64](../components/skeletons.tsx#L64) <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-6 md:py-10">; [components/skeletons.tsx:65](../components/skeletons.tsx#L65) <div className="flex flex-col md:flex-row gap-6 md:gap-10">; [components/skeletons.tsx:66](../components/skeletons.tsx#L66) <div className="w-full md:w-1/3">

### SmartTimePicker

[components/SmartTimePicker.tsx:145](../components/SmartTimePicker.tsx#L145)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|
| padding | '40px 0' — [components/SmartTimePicker.tsx:239](../components/SmartTimePicker.tsx#L239) |
| width | 28 — [components/SmartTimePicker.tsx:241](../components/SmartTimePicker.tsx#L241) |
| height | 28 — [components/SmartTimePicker.tsx:242](../components/SmartTimePicker.tsx#L242) |
| borderRadius | '50%' — [components/SmartTimePicker.tsx:245](../components/SmartTimePicker.tsx#L245) |
| fontSize | 12 — [components/SmartTimePicker.tsx:249](../components/SmartTimePicker.tsx#L249) |
| padding | '32px 24px' — [components/SmartTimePicker.tsx:259](../components/SmartTimePicker.tsx#L259) |
| borderRadius | 16 — [components/SmartTimePicker.tsx:262](../components/SmartTimePicker.tsx#L262) |
| fontSize | 36 — [components/SmartTimePicker.tsx:265](../components/SmartTimePicker.tsx#L265) |
| fontSize | 15 — [components/SmartTimePicker.tsx:266](../components/SmartTimePicker.tsx#L266) |
| fontSize | 12 — [components/SmartTimePicker.tsx:269](../components/SmartTimePicker.tsx#L269) |
| lineHeight | 1.6 — [components/SmartTimePicker.tsx:269](../components/SmartTimePicker.tsx#L269) |
| fontSize | 13 — [components/SmartTimePicker.tsx:278](../components/SmartTimePicker.tsx#L278) |
| borderRadius | 99 — [components/SmartTimePicker.tsx:282](../components/SmartTimePicker.tsx#L282) |
| padding | '8px 20px' — [components/SmartTimePicker.tsx:283](../components/SmartTimePicker.tsx#L283) |
| width | '100%' — [components/SmartTimePicker.tsx:294](../components/SmartTimePicker.tsx#L294) |
| gap | 6 — [components/SmartTimePicker.tsx:300](../components/SmartTimePicker.tsx#L300) |
| fontSize | 11 — [components/SmartTimePicker.tsx:301](../components/SmartTimePicker.tsx#L301) |
| borderRadius | 99 — [components/SmartTimePicker.tsx:306](../components/SmartTimePicker.tsx#L306) |
| padding | '5px 12px' — [components/SmartTimePicker.tsx:307](../components/SmartTimePicker.tsx#L307) |
| borderRadius | 8 — [components/SmartTimePicker.tsx:329](../components/SmartTimePicker.tsx#L329) |
| padding | '6px 14px' — [components/SmartTimePicker.tsx:330](../components/SmartTimePicker.tsx#L330) |
| fontSize | 14 — [components/SmartTimePicker.tsx:332](../components/SmartTimePicker.tsx#L332) |
| fontSize | 11 — [components/SmartTimePicker.tsx:339](../components/SmartTimePicker.tsx#L339) |
| borderRadius | 8 — [components/SmartTimePicker.tsx:348](../components/SmartTimePicker.tsx#L348) |
| padding | '6px 14px' — [components/SmartTimePicker.tsx:349](../components/SmartTimePicker.tsx#L349) |
| fontSize | 14 — [components/SmartTimePicker.tsx:351](../components/SmartTimePicker.tsx#L351) |
| gap | 6 — [components/SmartTimePicker.tsx:363](../components/SmartTimePicker.tsx#L363) |
| paddingBottom | 8 — [components/SmartTimePicker.tsx:365](../components/SmartTimePicker.tsx#L365) |
| minWidth | 60 — [components/SmartTimePicker.tsx:377](../components/SmartTimePicker.tsx#L377) |
| padding | '8px 10px' — [components/SmartTimePicker.tsx:378](../components/SmartTimePicker.tsx#L378) |
| borderRadius | 10 — [components/SmartTimePicker.tsx:379](../components/SmartTimePicker.tsx#L379) |
| fontSize | 11 — [components/SmartTimePicker.tsx:386](../components/SmartTimePicker.tsx#L386) |
| fontSize | 8 — [components/SmartTimePicker.tsx:393](../components/SmartTimePicker.tsx#L393) |
| padding | '28px 0' — [components/SmartTimePicker.tsx:405](../components/SmartTimePicker.tsx#L405) |
| fontSize | 13 — [components/SmartTimePicker.tsx:407](../components/SmartTimePicker.tsx#L407) |
| fontSize | 11 — [components/SmartTimePicker.tsx:411](../components/SmartTimePicker.tsx#L411) |
| gap | 8 — [components/SmartTimePicker.tsx:417](../components/SmartTimePicker.tsx#L417) |
| borderRadius | 10 — [components/SmartTimePicker.tsx:458](../components/SmartTimePicker.tsx#L458) |
| padding | '11px 8px' — [components/SmartTimePicker.tsx:459](../components/SmartTimePicker.tsx#L459) |
| fontSize | 14 — [components/SmartTimePicker.tsx:467](../components/SmartTimePicker.tsx#L467) |
| fontSize | 10 — [components/SmartTimePicker.tsx:468](../components/SmartTimePicker.tsx#L468) |
| fontSize | 9 — [components/SmartTimePicker.tsx:470](../components/SmartTimePicker.tsx#L470) |
| padding | 24 — [components/SmartTimePicker.tsx:478](../components/SmartTimePicker.tsx#L478) |
| fontSize | 12 — [components/SmartTimePicker.tsx:478](../components/SmartTimePicker.tsx#L478) |
| gap | 14 — [components/SmartTimePicker.tsx:486](../components/SmartTimePicker.tsx#L486) |
| gap | 5 — [components/SmartTimePicker.tsx:496](../components/SmartTimePicker.tsx#L496) |
| fontSize | 10 — [components/SmartTimePicker.tsx:496](../components/SmartTimePicker.tsx#L496) |
| width | 8 — [components/SmartTimePicker.tsx:497](../components/SmartTimePicker.tsx#L497) |
| height | 8 — [components/SmartTimePicker.tsx:497](../components/SmartTimePicker.tsx#L497) |
| borderRadius | 2 — [components/SmartTimePicker.tsx:497](../components/SmartTimePicker.tsx#L497) |

Variants/state evidence:

- [components/SmartTimePicker.tsx:153](../components/SmartTimePicker.tsx#L153) — const [schedule, setSchedule] = useState<any>(null);
- [components/SmartTimePicker.tsx:154](../components/SmartTimePicker.tsx#L154) — const [bookings, setBookings] = useState<any[]>([]);
- [components/SmartTimePicker.tsx:155](../components/SmartTimePicker.tsx#L155) — const [loading, setLoading] = useState(true);
- [components/SmartTimePicker.tsx:156](../components/SmartTimePicker.tsx#L156) — const [weekOffset, setWeekOffset] = useState(0);
- [components/SmartTimePicker.tsx:157](../components/SmartTimePicker.tsx#L157) — const [activeDay, setActiveDay] = useState<string>('');
- [components/SmartTimePicker.tsx:324](../components/SmartTimePicker.tsx#L324) — disabled={weekOffset <= 0}
- [components/SmartTimePicker.tsx:453](../components/SmartTimePicker.tsx#L453) — disabled={!slot.available}

Responsive: No explicit breakpoint; inherited/container behavior only.

### SuspendedBookingBanner

[components/SuspendedBookingBanner.tsx:9](../components/SuspendedBookingBanner.tsx#L9)

Sizes/geometry/type: `w-full`, `rounded-2xl`, `p-6`, `text-center`, `text-3xl`, `text-lg`, `text-gray-900`, `text-sm`, `text-gray-600`, `text-gray-500`, `px-6`, `py-2`, `text-white`, `rounded-full`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### AmbientBackground

[components/titiza/ambient-background.tsx:1](../components/titiza/ambient-background.tsx#L1)

Sizes/geometry/type: `size-[42vw]`, `rounded-full`, `size-[38vw]`, `size-[34vw]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### BeautyProfileCard

[components/titiza/beauty-profile-card.tsx:107](../components/titiza/beauty-profile-card.tsx#L107)

Sizes/geometry/type: `rounded-3xl`, `p-8`, `sm:p-10`, `h-px`, `text-center`, `size-14`, `rounded-2xl`, `size-7`, `text-gold`, `text-3xl`, `text-foreground`, `sm:text-4xl`, `max-w-xl`, `text-pretty`, `text-muted-foreground`, `gap-4`, `gap-2`, `rounded-full`, `px-8`, `py-4`, `text-sm`, `text-primary-foreground`, `gap-1.5`, `px-3`, `py-1.5`, `text-gold-soft/80`, `hover:text-gold-soft`, `size-4`, `min-h-0`, `pt-8`, `w-px`, `gap-5`, `pb-8`, `last:pb-0`, `size-12`, `size-5`, `pt-1`, `text-left`, `text-xs`, `text-gold-muted`, `text-base`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/titiza/beauty-profile-card.tsx:108](../components/titiza/beauty-profile-card.tsx#L108) — const [open, setOpen] = useState(false)
- [components/titiza/beauty-profile-card.tsx:147](../components/titiza/beauty-profile-card.tsx#L147) — aria-expanded={open}

Responsive: [components/titiza/beauty-profile-card.tsx:112](../components/titiza/beauty-profile-card.tsx#L112) className="animate-titiza-fade-up titiza-glass relative overflow-hidden rounded-3xl p-8 sm:p-10"; [components/titiza/beauty-profile-card.tsx:123](../components/titiza/beauty-profile-card.tsx#L123) <h2 className="font-serif text-3xl font-light text-foreground sm:text-4xl">

### CategoryGrid

[components/titiza/category-grid.tsx:47](../components/titiza/category-grid.tsx#L47)

Sizes/geometry/type: `w-full`, `gap-3`, `sm:gap-4`, `rounded-2xl`, `px-4`, `py-7`, `text-center`, `text-sm`, `text-foreground/90`, `h-8`, `w-8`, `text-gold-soft`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/titiza/category-grid.tsx:62](../components/titiza/category-grid.tsx#L62) — const [expanded, setExpanded] = useState(false)
- [components/titiza/category-grid.tsx:74](../components/titiza/category-grid.tsx#L74) — const [focusIndex, setFocusIndex] = useState(0)
- [components/titiza/category-grid.tsx:76](../components/titiza/category-grid.tsx#L76) — const [cols, setCols] = useState(2)
- [components/titiza/category-grid.tsx:147](../components/titiza/category-grid.tsx#L147) — aria-pressed={catId ? isSelected : undefined}
- [components/titiza/category-grid.tsx:148](../components/titiza/category-grid.tsx#L148) — aria-expanded={isMore ? expanded : undefined}
- [components/titiza/category-grid.tsx:149](../components/titiza/category-grid.tsx#L149) — disabled={locked && !isSelected}

Responsive: [components/titiza/category-grid.tsx:79](../components/titiza/category-grid.tsx#L79) const mq = window.matchMedia('(min-width: 640px)'); [components/titiza/category-grid.tsx:131](../components/titiza/category-grid.tsx#L131) className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"

### CategoryIcon

[components/titiza/category-icons.tsx:179](../components/titiza/category-icons.tsx#L179)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### FeatureCards

[components/titiza/feature-cards.tsx:69](../components/titiza/feature-cards.tsx#L69)

Sizes/geometry/type: `gap-5`, `rounded-3xl`, `p-7`, `size-32`, `rounded-full`, `size-12`, `rounded-2xl`, `size-6`, `text-gold`, `text-2xl`, `text-foreground`, `text-sm`, `text-muted-foreground`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/titiza/feature-cards.tsx:71](../components/titiza/feature-cards.tsx#L71) <div className="grid gap-5 sm:grid-cols-3">

### OrbitLabels

[components/titiza/orbit-labels.tsx:26](../components/titiza/orbit-labels.tsx#L26)

Sizes/geometry/type: `rounded-full`, `px-3`, `py-1`, `text-[11px]`, `text-gold-soft/90`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/titiza/orbit-labels.tsx:27](../components/titiza/orbit-labels.tsx#L27) — const [active, setActive] = useState<number | null>(null)

Responsive: [components/titiza/orbit-labels.tsx:30](../components/titiza/orbit-labels.tsx#L30) const media = window.matchMedia('(prefers-reduced-motion: reduce)')

### PathAnalysis

[components/titiza/path-analysis.tsx:25](../components/titiza/path-analysis.tsx#L25)

Sizes/geometry/type: `w-full`, `max-w-md`, `text-center`, `text-4xl`, `text-foreground`, `text-2xl`, `text-muted-foreground`, `text-base`, `rounded-2xl`, `px-6`, `py-8`, `text-sm`, `rounded-full`, `px-8`, `py-3`, `text-gold-soft/90`, `hover:text-gold-soft`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/titiza/path-analysis.tsx:30](../components/titiza/path-analysis.tsx#L30) — const [beat, setBeat] = useState<Beat>('ack')
- [components/titiza/path-analysis.tsx:31](../components/titiza/path-analysis.tsx#L31) — const [exitLineShown, setExitLineShown] = useState(false)

Responsive: No explicit breakpoint; inherited/container behavior only.

### PathDirect

[components/titiza/path-direct.tsx:23](../components/titiza/path-direct.tsx#L23)

Sizes/geometry/type: `w-full`, `max-w-md`, `text-center`, `rounded-2xl`, `px-6`, `py-8`, `text-2xl`, `text-foreground`, `text-sm`, `text-muted-foreground`, `rounded-full`, `px-8`, `py-3`, `text-gold-soft/90`, `hover:text-gold-soft`, `text-gold-soft/80`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### TitizaCoreScene

[components/titiza/titiza-core-scene.tsx:207](../components/titiza/titiza-core-scene.tsx#L207)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|
| width | '100%' — [components/titiza/titiza-core-scene.tsx:795](../components/titiza/titiza-core-scene.tsx#L795) |
| height | '100%' — [components/titiza/titiza-core-scene.tsx:795](../components/titiza/titiza-core-scene.tsx#L795) |

Variants/state evidence:

- [components/titiza/titiza-core-scene.tsx:532](../components/titiza/titiza-core-scene.tsx#L532) — if (rect.width === 0 || rect.height === 0) return

Responsive: [components/titiza/titiza-core-scene.tsx:230](../components/titiza/titiza-core-scene.tsx#L230) const prefersReduced = window.matchMedia(

### TitizaCore

[components/titiza/titiza-core.tsx:46](../components/titiza/titiza-core.tsx#L46)

Sizes/geometry/type: `w-full`, `max-w-[720px]`, `size-[70%]`, `rounded-full`, `size-[40%]`, `h-10`, `w-[55%]`, `rounded-[50%]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### TitizaDecisionFlow

[components/titiza/titiza-decision-flow.tsx:29](../components/titiza/titiza-decision-flow.tsx#L29)

Sizes/geometry/type: `text-center`, `w-full`, `max-w-[280px]`, `sm:max-w-[320px]`, `max-w-xl`, `text-3xl`, `text-foreground`, `sm:text-4xl`, `text-sm`, `text-muted-foreground`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/titiza/titiza-decision-flow.tsx:38](../components/titiza/titiza-decision-flow.tsx#L38) — const [anchored, setAnchored] = useState(false)
- [components/titiza/titiza-decision-flow.tsx:39](../components/titiza/titiza-decision-flow.tsx#L39) — const [reducedMotion, setReducedMotion] = useState(false)
- [components/titiza/titiza-decision-flow.tsx:43](../components/titiza/titiza-decision-flow.tsx#L43) — const [line1Shown, setLine1Shown] = useState(false)
- [components/titiza/titiza-decision-flow.tsx:44](../components/titiza/titiza-decision-flow.tsx#L44) — const [seedShown, setSeedShown] = useState(false)
- [components/titiza/titiza-decision-flow.tsx:46](../components/titiza/titiza-decision-flow.tsx#L46) — const [tilesShown, setTilesShown] = useState(false)
- [components/titiza/titiza-decision-flow.tsx:47](../components/titiza/titiza-decision-flow.tsx#L47) — const [selectedId, setSelectedId] = useState<string | null>(null)
- [components/titiza/titiza-decision-flow.tsx:52](../components/titiza/titiza-decision-flow.tsx#L52) — const [stage, setStage] = useState<'choosing' | 'thinking' | 'revealed'>(

Responsive: [components/titiza/titiza-decision-flow.tsx:83](../components/titiza/titiza-decision-flow.tsx#L83) const prefersReduced = window.matchMedia(; [components/titiza/titiza-decision-flow.tsx:129](../components/titiza/titiza-decision-flow.tsx#L129) className="w-full max-w-[280px] sm:max-w-[320px]"; [components/titiza/titiza-decision-flow.tsx:149](../components/titiza/titiza-decision-flow.tsx#L149) <h2 className="animate-titiza-fade-in font-serif text-3xl font-light text-foreground sm:text-4xl">

### TitizaHero

[components/titiza/titiza-hero.tsx:18](../components/titiza/titiza-hero.tsx#L18)

Sizes/geometry/type: `text-center`, `text-xs`, `text-muted-foreground`, `text-6xl`, `text-foreground`, `sm:text-7xl`, `md:text-8xl`, `text-balance`, `text-base`, `sm:text-lg`, `w-full`, `max-w-xl`, `text-3xl`, `sm:text-4xl`, `rounded-full`, `px-8`, `py-3`, `text-sm`, `text-gold-soft/90`, `hover:text-gold-soft`, `max-w-md`, `text-pretty`, `gap-3`, `gap-2`, `rounded-xl`, `px-4`, `py-4`, `size-1.5`, `text-foreground/90`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/titiza/titiza-hero.tsx:20](../components/titiza/titiza-hero.tsx#L20) — mode = 'dashboard',
- [components/titiza/titiza-hero.tsx:24](../components/titiza/titiza-hero.tsx#L24) — const isGenesis = mode === 'genesis'
- [components/titiza/titiza-hero.tsx:32](../components/titiza/titiza-hero.tsx#L32) — const [line1Shown, setLine1Shown] = useState(!isGenesis)
- [components/titiza/titiza-hero.tsx:33](../components/titiza/titiza-hero.tsx#L33) — const [line2Shown, setLine2Shown] = useState(!isGenesis && !isReturning)
- [components/titiza/titiza-hero.tsx:34](../components/titiza/titiza-hero.tsx#L34) — const [ctaShown, setCtaShown] = useState(false)

Responsive: [components/titiza/titiza-hero.tsx:75](../components/titiza/titiza-hero.tsx#L75) <h1 className="font-serif text-6xl font-light tracking-tight text-foreground sm:text-7xl md:text-8xl">; [components/titiza/titiza-hero.tsx:78](../components/titiza/titiza-hero.tsx#L78) <p className="mt-4 text-balance text-base font-light tracking-wide text-muted-foreground sm:text-lg">; [components/titiza/titiza-hero.tsx:97](../components/titiza/titiza-hero.tsx#L97) <p className="animate-titiza-fade-in font-serif text-3xl font-light text-foreground sm:text-4xl">; [components/titiza/titiza-hero.tsx:102](../components/titiza/titiza-hero.tsx#L102) <p className="mt-2 animate-titiza-fade-in font-serif text-3xl font-light text-foreground sm:text-4xl">; [components/titiza/titiza-hero.tsx:127](../components/titiza/titiza-hero.tsx#L127) className="mt-5 max-w-md animate-titiza-fade-up text-pretty text-base font-light leading-relaxed text-muted-foreground sm:text-lg"; [components/titiza/titiza-hero.tsx:141](../components/titiza/titiza-hero.tsx#L141) <ul className="mt-5 grid gap-3 sm:grid-cols-3">

### AnalysisCardsOrbit

[components/titiza-film/analysis-cards-orbit.tsx:37](../components/titiza-film/analysis-cards-orbit.tsx#L37)

Sizes/geometry/type: `rounded-full`, `px-3`, `py-1.5`, `text-[11px]`, `text-foreground/90`, `sm:text-xs`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/titiza-film/analysis-cards-orbit.tsx:76](../components/titiza-film/analysis-cards-orbit.tsx#L76) className="absolute left-1/2 whitespace-nowrap rounded-full border border-gold/30 bg-card/80 px-3 py-1.5 text-[11px] font-medium tracking-wide text-foreground/90 backdrop-blur-sm sm:text-xs"

### BeforeAfterSwap

[components/titiza-film/before-after-swap.tsx:41](../components/titiza-film/before-after-swap.tsx#L41)

Sizes/geometry/type: `w-40`, `sm:w-48`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/titiza-film/before-after-swap.tsx:48](../components/titiza-film/before-after-swap.tsx#L48) — mode === 'swap'
- [components/titiza-film/before-after-swap.tsx:57](../components/titiza-film/before-after-swap.tsx#L57) — {mode === 'single' ? (

Responsive: [components/titiza-film/before-after-swap.tsx:54](../components/titiza-film/before-after-swap.tsx#L54) className="relative aspect-[4/5] w-40 sm:w-48"

### ChatInputShell

[components/titiza-film/chat-input-shell.tsx:50](../components/titiza-film/chat-input-shell.tsx#L50)

Sizes/geometry/type: `w-full`, `max-w-md`, `min-h-[1px]`, `gap-3`, `max-w-[80%]`, `rounded-2xl`, `rounded-br-md`, `px-4`, `py-2.5`, `text-sm`, `text-foreground`, `max-w-[85%]`, `text-balance`, `text-lg`, `sm:text-xl`, `gap-2`, `rounded-full`, `px-3`, `py-1.5`, `text-xs`, `text-muted-foreground`, `sm:text-[13px]`, `py-3`, `size-8`, `text-gold-soft`, `text-gold-soft/70`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/titiza-film/chat-input-shell.tsx:107](../components/titiza-film/chat-input-shell.tsx#L107) <p className="max-w-[85%] text-balance font-serif text-lg font-light leading-snug text-foreground sm:text-xl">; [components/titiza-film/chat-input-shell.tsx:121](../components/titiza-film/chat-input-shell.tsx#L121) className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm sm:text-[13px]"

### ConversationStrip

[components/titiza-film/conversation-strip.tsx:17](../components/titiza-film/conversation-strip.tsx#L17)

Sizes/geometry/type: `px-6`, `pt-5`, `sm:pt-7`, `max-w-full`, `gap-3`, `rounded-full`, `px-4`, `py-1.5`, `text-[11px]`, `sm:text-xs`, `text-muted-foreground/70`, `size-1`, `text-foreground/60`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/titiza-film/conversation-strip.tsx:21](../components/titiza-film/conversation-strip.tsx#L21) className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-6 pt-5 transition-opacity duration-500 sm:pt-7"; [components/titiza-film/conversation-strip.tsx:24](../components/titiza-film/conversation-strip.tsx#L24) <div className="flex max-w-full items-center gap-3 rounded-full border border-border bg-card/40 px-4 py-1.5 text-[11px] backdrop-blur-sm sm:text-xs">

### FilmSequencer

[components/titiza-film/film-sequencer.tsx:483](../components/titiza-film/film-sequencer.tsx#L483)

Sizes/geometry/type: `text-white`, `w-[70vmin]`, `max-w-[460px]`, `px-6`, `gap-6`, `pb-[12vh]`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/titiza-film/film-sequencer.tsx:484](../components/titiza-film/film-sequencer.tsx#L484) — const [elapsed, setElapsed] = useState(0)

Responsive: No explicit breakpoint; inherited/container behavior only.

### IntroTitle

[components/titiza-film/intro-title.tsx:28](../components/titiza-film/intro-title.tsx#L28)

Sizes/geometry/type: `px-6`, `text-center`, `text-xs`, `text-white/70`, `sm:text-sm`, `text-6xl`, `text-white`, `sm:text-7xl`, `md:text-8xl`, `text-3xl`, `sm:text-4xl`, `text-gold`, `text-muted-foreground`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/titiza-film/intro-title.tsx:52](../components/titiza-film/intro-title.tsx#L52) <p className="text-xs font-medium uppercase tracking-[0.4em] text-white/70 sm:text-sm">; [components/titiza-film/intro-title.tsx:56](../components/titiza-film/intro-title.tsx#L56) <p className="mt-4 font-serif text-6xl font-light tracking-tight text-white sm:text-7xl md:text-8xl">; [components/titiza-film/intro-title.tsx:64](../components/titiza-film/intro-title.tsx#L64) <p className="font-serif text-3xl font-light tracking-wide text-white sm:text-4xl">; [components/titiza-film/intro-title.tsx:71](../components/titiza-film/intro-title.tsx#L71) <p className="font-serif text-6xl font-light tracking-tight text-gold sm:text-7xl md:text-8xl">; [components/titiza-film/intro-title.tsx:75](../components/titiza-film/intro-title.tsx#L75) <p className="mt-5 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground sm:text-sm">

### LaunchDateCard

[components/titiza-film/launch-date-card.tsx:39](../components/titiza-film/launch-date-card.tsx#L39)

Sizes/geometry/type: `gap-5`, `px-6`, `text-center`, `text-5xl`, `text-white`, `sm:text-6xl`, `md:text-7xl`, `text-2xl`, `text-white/90`, `sm:text-3xl`, `text-lg`, `text-white/70`, `sm:text-xl`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/titiza-film/launch-date-card.tsx:63](../components/titiza-film/launch-date-card.tsx#L63) className="font-serif text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl"; [components/titiza-film/launch-date-card.tsx:69](../components/titiza-film/launch-date-card.tsx#L69) className="font-serif text-2xl font-light tracking-wide text-white/90 sm:text-3xl"; [components/titiza-film/launch-date-card.tsx:75](../components/titiza-film/launch-date-card.tsx#L75) className="font-serif text-lg font-light tracking-wide text-white/70 sm:text-xl"

### OrbDialogue

[components/titiza-film/orb-dialogue.tsx:17](../components/titiza-film/orb-dialogue.tsx#L17)

Sizes/geometry/type: `text-balance`, `px-2`, `text-center`, `text-3xl`, `text-foreground`, `sm:text-4xl`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/titiza-film/orb-dialogue.tsx:24](../components/titiza-film/orb-dialogue.tsx#L24) className="text-balance px-2 text-center font-serif text-3xl font-light leading-tight text-foreground sm:text-4xl"

### ProfessionalCard

[components/titiza-film/professional-card.tsx:25](../components/titiza-film/professional-card.tsx#L25)

Sizes/geometry/type: `w-full`, `max-w-sm`, `rounded-2xl`, `p-5`, `text-left`, `gap-4`, `size-12`, `rounded-full`, `min-w-0`, `text-xl`, `text-foreground`, `text-xs`, `text-gold-muted`, `gap-1`, `text-sm`, `text-muted-foreground`, `text-gold-soft`, `px-6`, `py-3`, `text-gold-soft/90`, `text-center`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: No explicit breakpoint; inherited/container behavior only.

### TypingLines

[components/titiza-film/typing-lines.tsx:24](../components/titiza-film/typing-lines.tsx#L24)

Sizes/geometry/type: `gap-2`, `text-xs`, `text-muted-foreground`, `sm:text-sm`, `size-1`, `rounded-full`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/titiza-film/typing-lines.tsx:32](../components/titiza-film/typing-lines.tsx#L32) <ul className="flex flex-col items-center gap-2 font-mono text-xs text-muted-foreground sm:text-sm">

### VerticalMontage

[components/titiza-film/vertical-montage.tsx:24](../components/titiza-film/vertical-montage.tsx#L24)

Sizes/geometry/type: `min-h-[1.4em]`, `text-center`, `text-4xl`, `text-foreground`, `sm:text-5xl`
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

Not established / not found.

Responsive: [components/titiza-film/vertical-montage.tsx:50](../components/titiza-film/vertical-montage.tsx#L50) className="absolute whitespace-nowrap text-center font-serif text-4xl font-light tracking-tight text-foreground sm:text-5xl"

### TopNav

[components/TopNav.tsx:12](../components/TopNav.tsx#L12)

Sizes/geometry/type: `w-full`, `px-6`, `py-4`, `gap-8`, `text-sm`, `text-[#888580]`, `gap-3`, `gap-4`, `pl-4`, `hover:text-[#F0EDE8]`, `hover:text-red-500`, `text-[#F0EDE8]`, `hover:text-[#888580]`, `px-4`, `py-2`, `rounded-full`, `text-[#0A0A0A]`, `py-2.5`, `text-xs`
| Dimension/property | Exact value/source |
|---|---|
| fontSize | '9px' — [components/TopNav.tsx:89](../components/TopNav.tsx#L89) |
| padding | '2px 6px' — [components/TopNav.tsx:89](../components/TopNav.tsx#L89) |
| borderRadius | '99px' — [components/TopNav.tsx:89](../components/TopNav.tsx#L89) |
| gap | 5 — [components/TopNav.tsx:112](../components/TopNav.tsx#L112) |
| padding | '6px 10px 6px 8px' — [components/TopNav.tsx:113](../components/TopNav.tsx#L113) |
| borderRadius | 10 — [components/TopNav.tsx:114](../components/TopNav.tsx#L114) |
| fontSize | 16 — [components/TopNav.tsx:131](../components/TopNav.tsx#L131) |
| lineHeight | 1 — [components/TopNav.tsx:131](../components/TopNav.tsx#L131) |
| fontSize | 11 — [components/TopNav.tsx:138](../components/TopNav.tsx#L138) |
| strokeWidth | 2.5 — [components/TopNav.tsx:154](../components/TopNav.tsx#L154) |
| width | 210 — [components/TopNav.tsx:172](../components/TopNav.tsx#L172) |
| borderRadius | 18 — [components/TopNav.tsx:177](../components/TopNav.tsx#L177) |
| padding | 8 — [components/TopNav.tsx:178](../components/TopNav.tsx#L178) |
| height | 1 — [components/TopNav.tsx:191](../components/TopNav.tsx#L191) |
| gap | 12 — [components/TopNav.tsx:204](../components/TopNav.tsx#L204) |
| padding | '11px 12px' — [components/TopNav.tsx:205](../components/TopNav.tsx#L205) |
| borderRadius | 12 — [components/TopNav.tsx:206](../components/TopNav.tsx#L206) |
| fontSize | 22 — [components/TopNav.tsx:230](../components/TopNav.tsx#L230) |
| fontSize | 13 — [components/TopNav.tsx:234](../components/TopNav.tsx#L234) |
| fontSize | 10 — [components/TopNav.tsx:243](../components/TopNav.tsx#L243) |
| width | 22 — [components/TopNav.tsx:256](../components/TopNav.tsx#L256) |
| height | 22 — [components/TopNav.tsx:257](../components/TopNav.tsx#L257) |
| borderRadius | '50%' — [components/TopNav.tsx:258](../components/TopNav.tsx#L258) |
| minWidth | 200 — [components/TopNav.tsx:291](../components/TopNav.tsx#L291) |
| borderRadius | '99px' — [components/TopNav.tsx:331](../components/TopNav.tsx#L331) |
| padding | '6px 16px' — [components/TopNav.tsx:332](../components/TopNav.tsx#L332) |
| fontSize | '12px' — [components/TopNav.tsx:333](../components/TopNav.tsx#L333) |
| padding | '4px' — [components/TopNav.tsx:351](../components/TopNav.tsx#L351) |
| paddingTop | '105px' — [components/TopNav.tsx:415](../components/TopNav.tsx#L415) |
| paddingLeft | '24px' — [components/TopNav.tsx:416](../components/TopNav.tsx#L416) |
| paddingRight | '24px' — [components/TopNav.tsx:417](../components/TopNav.tsx#L417) |
| paddingBottom | 'env(safe-area-inset-bottom, 24px)' — [components/TopNav.tsx:418](../components/TopNav.tsx#L418) |
| fontSize | '24px' — [components/TopNav.tsx:436](../components/TopNav.tsx#L436) |
| padding | '16px 0' — [components/TopNav.tsx:440](../components/TopNav.tsx#L440) |
| gap | '12px' — [components/TopNav.tsx:450](../components/TopNav.tsx#L450) |
| borderRadius | '99px' — [components/TopNav.tsx:459](../components/TopNav.tsx#L459) |
| padding | '14px' — [components/TopNav.tsx:460](../components/TopNav.tsx#L460) |
| fontSize | '15px' — [components/TopNav.tsx:461](../components/TopNav.tsx#L461) |
| borderRadius | '99px' — [components/TopNav.tsx:477](../components/TopNav.tsx#L477) |
| padding | '14px' — [components/TopNav.tsx:478](../components/TopNav.tsx#L478) |
| fontSize | '15px' — [components/TopNav.tsx:479](../components/TopNav.tsx#L479) |
| borderRadius | '99px' — [components/TopNav.tsx:497](../components/TopNav.tsx#L497) |
| padding | '14px' — [components/TopNav.tsx:498](../components/TopNav.tsx#L498) |
| fontSize | '15px' — [components/TopNav.tsx:499](../components/TopNav.tsx#L499) |
| fontSize | '15px' — [components/TopNav.tsx:511](../components/TopNav.tsx#L511) |
| padding | '14px' — [components/TopNav.tsx:514](../components/TopNav.tsx#L514) |
| borderRadius | '12px' — [components/TopNav.tsx:515](../components/TopNav.tsx#L515) |
| width | '100%' — [components/TopNav.tsx:516](../components/TopNav.tsx#L516) |
| gap | 4 — [components/TopNav.tsx:534](../components/TopNav.tsx#L534) |
| padding | '8px 0' — [components/TopNav.tsx:535](../components/TopNav.tsx#L535) |
| paddingTop | 16 — [components/TopNav.tsx:538](../components/TopNav.tsx#L538) |
| gap | 12 — [components/TopNav.tsx:554](../components/TopNav.tsx#L554) |
| padding | '10px 12px' — [components/TopNav.tsx:555](../components/TopNav.tsx#L555) |
| borderRadius | 12 — [components/TopNav.tsx:556](../components/TopNav.tsx#L556) |
| fontSize | 22 — [components/TopNav.tsx:567](../components/TopNav.tsx#L567) |
| fontSize | 13 — [components/TopNav.tsx:570](../components/TopNav.tsx#L570) |
| fontSize | 10 — [components/TopNav.tsx:577](../components/TopNav.tsx#L577) |
| width | 20 — [components/TopNav.tsx:589](../components/TopNav.tsx#L589) |
| height | 20 — [components/TopNav.tsx:590](../components/TopNav.tsx#L590) |
| borderRadius | '50%' — [components/TopNav.tsx:591](../components/TopNav.tsx#L591) |

Variants/state evidence:

- [components/TopNav.tsx:17](../components/TopNav.tsx#L17) — const [menuOpen, setMenuOpen] = useState(false);
- [components/TopNav.tsx:18](../components/TopNav.tsx#L18) — const [showLangMenu, setShowLangMenu] = useState(false);

Responsive: [components/TopNav.tsx:85](../components/TopNav.tsx#L85) <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">; [components/TopNav.tsx:103](../components/TopNav.tsx#L103) className="hidden md:block"; [components/TopNav.tsx:291](../components/TopNav.tsx#L291) <div className="hidden md:flex items-center gap-4" style={{ minWidth: 200 }} />; [components/TopNav.tsx:293](../components/TopNav.tsx#L293) <div className="hidden md:flex items-center gap-4 border-l border-[#1E1E1E] pl-4">; [components/TopNav.tsx:307](../components/TopNav.tsx#L307) <div className="hidden md:flex items-center gap-4">

### VerifyEmailGate

[components/VerifyEmailGate.tsx:27](../components/VerifyEmailGate.tsx#L27)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|
| minHeight | '100vh' — [components/VerifyEmailGate.tsx:104](../components/VerifyEmailGate.tsx#L104) |
| padding | '20px' — [components/VerifyEmailGate.tsx:110](../components/VerifyEmailGate.tsx#L110) |
| borderRadius | '20px' — [components/VerifyEmailGate.tsx:115](../components/VerifyEmailGate.tsx#L115) |
| padding | '40px' — [components/VerifyEmailGate.tsx:116](../components/VerifyEmailGate.tsx#L116) |
| maxWidth | '400px' — [components/VerifyEmailGate.tsx:117](../components/VerifyEmailGate.tsx#L117) |
| width | '100%' — [components/VerifyEmailGate.tsx:118](../components/VerifyEmailGate.tsx#L118) |
| fontSize | '48px' — [components/VerifyEmailGate.tsx:121](../components/VerifyEmailGate.tsx#L121) |
| fontSize | '20px' — [components/VerifyEmailGate.tsx:125](../components/VerifyEmailGate.tsx#L125) |
| fontSize | '13px' — [components/VerifyEmailGate.tsx:128](../components/VerifyEmailGate.tsx#L128) |
| lineHeight | '1.7' — [components/VerifyEmailGate.tsx:128](../components/VerifyEmailGate.tsx#L128) |
| borderRadius | '99px' — [components/VerifyEmailGate.tsx:142](../components/VerifyEmailGate.tsx#L142) |
| padding | '12px 20px' — [components/VerifyEmailGate.tsx:143](../components/VerifyEmailGate.tsx#L143) |
| fontSize | '13px' — [components/VerifyEmailGate.tsx:144](../components/VerifyEmailGate.tsx#L144) |
| fontSize | '20px' — [components/VerifyEmailGate.tsx:155](../components/VerifyEmailGate.tsx#L155) |
| fontSize | '13px' — [components/VerifyEmailGate.tsx:158](../components/VerifyEmailGate.tsx#L158) |
| lineHeight | '1.7' — [components/VerifyEmailGate.tsx:158](../components/VerifyEmailGate.tsx#L158) |
| fontSize | '11px' — [components/VerifyEmailGate.tsx:166](../components/VerifyEmailGate.tsx#L166) |
| borderRadius | '99px' — [components/VerifyEmailGate.tsx:177](../components/VerifyEmailGate.tsx#L177) |
| padding | '10px 20px' — [components/VerifyEmailGate.tsx:178](../components/VerifyEmailGate.tsx#L178) |
| fontSize | '12px' — [components/VerifyEmailGate.tsx:179](../components/VerifyEmailGate.tsx#L179) |
| width | '100%' — [components/VerifyEmailGate.tsx:184](../components/VerifyEmailGate.tsx#L184) |
| fontSize | '11px' — [components/VerifyEmailGate.tsx:192](../components/VerifyEmailGate.tsx#L192) |
| fontSize | '11px' — [components/VerifyEmailGate.tsx:197](../components/VerifyEmailGate.tsx#L197) |
| fontSize | '11px' — [components/VerifyEmailGate.tsx:204](../components/VerifyEmailGate.tsx#L204) |

Variants/state evidence:

- [components/VerifyEmailGate.tsx:27](../components/VerifyEmailGate.tsx#L27) — export function VerifyEmailGate({ onVerified, email, mode = 'default' }: VerifyEmailGateProps) {
- [components/VerifyEmailGate.tsx:29](../components/VerifyEmailGate.tsx#L29) — const [cooldown, setCooldown] = useState(0);
- [components/VerifyEmailGate.tsx:30](../components/VerifyEmailGate.tsx#L30) — const [resendError, setResendError] = useState('');
- [components/VerifyEmailGate.tsx:31](../components/VerifyEmailGate.tsx#L31) — const [resendOk, setResendOk] = useState(false);
- [components/VerifyEmailGate.tsx:123](../components/VerifyEmailGate.tsx#L123) — {mode === 'login-hint' ? (
- [components/VerifyEmailGate.tsx:172](../components/VerifyEmailGate.tsx#L172) — disabled={cooldown > 0}

Responsive: No explicit breakpoint; inherited/container behavior only.

### Wordmark

[components/Wordmark.tsx:1](../components/Wordmark.tsx#L1)

Sizes/geometry/type: Inline/dynamic dimensions; below.
| Dimension/property | Exact value/source |
|---|---|


Variants/state evidence:

- [components/Wordmark.tsx:1](../components/Wordmark.tsx#L1) — export function Wordmark({ height = 28 }: { height?: number }) {

Responsive: No explicit breakpoint; inherited/container behavior only.

## Parallel implementations (preserved)

- Buttons: landing/auth/booking/admin pages,ConfirmDialog,cookie,Titiza,film.
- Servicecards/forms: barber services page vsShopServicesTab,profiles vsbookingtiles.
- Providercards:landing/discovery/favorites/shopteam/film.
- Booking/statuscards:client/professional/shop/admin/overview.
- Pagination:discoveryfunctions/localdashboard/admin.
- Calendars:AvailabilityGrid/ShopAvailabilityTab/SmartTimePicker/ShopTimePicker.
- Empty/loaders:namedexports+inline branches.
- Confirmation:sharedDialog+delete/reauth/team/admin.

No consolidation performed.

## Local named JSX functions (not shared count)


| Local component | Source/scope |
|---|---|
| StatusBadge | [app/admin/(protected)/barbers/page.tsx:64](../app/admin/(protected)/barbers/page.tsx#L64) |
| StatusBadge | [app/admin/(protected)/barbers/[id]/page.tsx:79](../app/admin/(protected)/barbers/[id]/page.tsx#L79) |
| BookingStatusBadge | [app/admin/(protected)/barbers/[id]/page.tsx:114](../app/admin/(protected)/barbers/[id]/page.tsx#L114) |
| StarRating | [app/admin/(protected)/barbers/[id]/page.tsx:141](../app/admin/(protected)/barbers/[id]/page.tsx#L141) |
| StatusBadge | [app/admin/(protected)/bookings/page.tsx:83](../app/admin/(protected)/bookings/page.tsx#L83) |
| StatCard | [app/admin/(protected)/bookings/page.tsx:96](../app/admin/(protected)/bookings/page.tsx#L96) |
| AdminSidebar | [app/admin/(protected)/layout.tsx:10](../app/admin/(protected)/layout.tsx#L10) |
| StatusBadge | [app/admin/(protected)/page.tsx:69](../app/admin/(protected)/page.tsx#L69) |
| StarRating | [app/admin/(protected)/reviews/page.tsx:33](../app/admin/(protected)/reviews/page.tsx#L33) |
| StatusBadge | [app/admin/(protected)/shops/page.tsx:43](../app/admin/(protected)/shops/page.tsx#L43) |
| StatusBadge | [app/admin/(protected)/shops/[id]/page.tsx:73](../app/admin/(protected)/shops/[id]/page.tsx#L73) |
| BookingStatusBadge | [app/admin/(protected)/shops/[id]/page.tsx:86](../app/admin/(protected)/shops/[id]/page.tsx#L86) |
| HighlightedText | [app/barber/[barberId]/BarberProfileClient.tsx:113](../app/barber/[barberId]/BarberProfileClient.tsx#L113) |
| Pagination | [app/barbers/BarbersClient.tsx:133](../app/barbers/BarbersClient.tsx#L133) |
| SimpleMessage | [app/challenge/page.tsx:423](../app/challenge/page.tsx#L423) |
| PreVotingScreen | [app/challenge/page.tsx:444](../app/challenge/page.tsx#L444) |
| SubmissionGrid | [app/challenge/page.tsx:888](../app/challenge/page.tsx#L888) |
| Leaderboard | [app/challenge/page.tsx:1029](../app/challenge/page.tsx#L1029) |
| LeaderboardCard | [app/challenge/page.tsx:1101](../app/challenge/page.tsx#L1101) |
| Pagination | [app/shops/page.tsx:120](../app/shops/page.tsx#L120) |
| RejectionBanner | [components/ChallengeSubmissionTab.tsx:171](../components/ChallengeSubmissionTab.tsx#L171) |
| LoadingScreen | [components/RouteGuard.tsx:40](../components/RouteGuard.tsx#L40) |
| ScanFaceIcon | [components/titiza/beauty-profile-card.tsx:11](../components/titiza/beauty-profile-card.tsx#L11) |
| ChevronDownIcon | [components/titiza/beauty-profile-card.tsx:29](../components/titiza/beauty-profile-card.tsx#L29) |
| MapPinIcon | [components/titiza/beauty-profile-card.tsx:41](../components/titiza/beauty-profile-card.tsx#L41) |
| UploadCloudIcon | [components/titiza/beauty-profile-card.tsx:54](../components/titiza/beauty-profile-card.tsx#L54) |
| SparklesIcon | [components/titiza/beauty-profile-card.tsx:68](../components/titiza/beauty-profile-card.tsx#L68) |
| MoreGlyph | [components/titiza/category-grid.tsx:32](../components/titiza/category-grid.tsx#L32) |
| Svg | [components/titiza/category-icons.tsx:16](../components/titiza/category-icons.tsx#L16) |
| ShieldCheckIcon | [components/titiza/feature-cards.tsx:7](../components/titiza/feature-cards.tsx#L7) |
| MessagesSquareIcon | [components/titiza/feature-cards.tsx:20](../components/titiza/feature-cards.tsx#L20) |
| RouteIcon | [components/titiza/feature-cards.tsx:33](../components/titiza/feature-cards.tsx#L33) |
| CoreFallback | [components/titiza/titiza-core.tsx:38](../components/titiza/titiza-core.tsx#L38) |
| Frame | [components/titiza-film/before-after-swap.tsx:19](../components/titiza-film/before-after-swap.tsx#L19) |


ErrorBoundary class/sectionfallback/retry: [components/ErrorBoundary.tsx:1](../components/ErrorBoundary.tsx#L1). Full props/imports/JSX/styles: [source inventory](evidence/source-inventory.json); [state evidence](evidence/states-and-overlays.md).

## Exact prop interfaces and JSX arrow components

### components/AvailabilityGrid.tsx — AvailabilityGridProps

```tsx
export interface AvailabilityGridProps {
  mode?: 'barber' | 'shop' | 'client';
  barberId?: string;
  totalDuration?: number; // In minutes, used for client mode
  initialData?: {
    weeklyHours?: any;
    blockedDates?: string[];
    bufferMins?: number;
  } | null;
  onSave?: (scheduleData: {
    weeklyHours: any;
    blockedDates: any[];
    bufferMins: number;
  }) => Promise<void>;
  onSlotSelect?: (date: string, time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}
```
### components/BarberPortfolioTab.tsx — BarberPortfolioTabProps

```tsx
interface BarberPortfolioTabProps {
  profile: any;
  mutateProfile: () => void;
}
```
### components/BarberSettingsTab.tsx — BarberSettingsTabProps

```tsx
interface BarberSettingsTabProps {
  profile: any;
  mutateProfile: () => void;
}
```
### components/ChallengeLocationGate.tsx — Props

```tsx
interface Props {
  country: string | undefined | null;
  settingsHref: string;
  children: React.ReactNode;
}
```
### components/ChallengePaymentTab.tsx — Props

```tsx
interface Props {
  mode: Mode;
}
```
### components/ChallengeSubmissionTab.tsx — Props

```tsx
interface Props {
  mode: Mode;
}
```
### components/ComingSoon.tsx — ComingSoonProps

```tsx
interface ComingSoonProps {
  icon: string;
  title: string;
  body: string;
  showNotify?: boolean;
  featureKey?: string;
}
```
### components/ConfirmDialog.tsx — ConfirmDialogProps

```tsx
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```
### components/CountdownTimer.tsx — CountdownTimerProps

```tsx
interface CountdownTimerProps {
  targetMs: number;
  className?: string;
}
```
### components/DeleteAccountButton.tsx — DeleteAccountButtonProps

```tsx
interface DeleteAccountButtonProps {
  role: 'client' | 'professional';
}
```
### components/ErrorBoundary.tsx — Props

```tsx
interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  section?: string;
}
```
### components/PasswordInput.tsx — PasswordInputProps

```tsx
interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Tailwind className — used by login/signup pages */
  className?: string;
  /** Inline style — used by admin login page */
  style?: React.CSSProperties;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
}
```
### components/ShopAvailabilityTab.tsx — ShopAvailabilityTabProps

```tsx
interface ShopAvailabilityTabProps {
  schedule: any;
  mutateSchedule: () => void;
}
```
### components/ShopPhotosTab.tsx — ShopPhotosTabProps

```tsx
interface ShopPhotosTabProps {
  shop: any;
  mutateShop: () => void;
}
```
### components/ShopServicesTab.tsx — ShopServicesTabProps

```tsx
interface ShopServicesTabProps {
  services: any[];
  mutateServices: () => void;
  shop: any;
  mutateShop: () => void;
}
```
### components/ShopSettingsTab.tsx — ShopSettingsTabProps

```tsx
interface ShopSettingsTabProps {
  shop: any;
  mutateShop: () => void;
}
```
### components/ShopTimePicker.tsx — ShopTimePickerProps

```tsx
export interface ShopTimePickerProps {
  barberIds: string[];
  totalDuration: number;
  bufferMinutes?: number;
  selectedDate?: string;
  selectedTime?: string;
  onSelect: (
    date: string,
    time: string,
    endTime: string,
    availableBarberIds: string[]
  ) => void;
}
```
### components/SmartTimePicker.tsx — SmartTimePickerProps

```tsx
export interface SmartTimePickerProps {
  barberId: string;
  /** Total service duration in minutes */
  totalDuration: number;
  /** Override cleanup buffer — fetched from schedule if not provided */
  bufferMinutes?: number;
  selectedDate?: string;
  selectedTime?: string;
  onSelect: (date: string, time: string, endTime: string) => void;
}
```
### components/SuspendedBookingBanner.tsx — Props

```tsx
interface Props {
  endDate?: string
}
```
### components/titiza/beauty-profile-card.tsx — IconProps

```tsx
type IconProps = { className?: string; strokeWidth?: number }
```
### components/titiza/category-grid.tsx — CategoryGridProps

```tsx
interface CategoryGridProps {
  selectedId: string | null
  /** When true, tiles are non-interactive (e.g. during the thinking moment). */
  locked?: boolean
  onSelect: (categoryId: string) => void
}
```
### components/titiza/category-icons.tsx — IconProps

```tsx
type IconProps = SVGProps<SVGSVGElement>
```
- Arrow-function JSX component HairIcon — [components/titiza/category-icons.tsx:33](../components/titiza/category-icons.tsx#L33)
- Arrow-function JSX component SkinIcon — [components/titiza/category-icons.tsx:42](../components/titiza/category-icons.tsx#L42)
- Arrow-function JSX component NailsIcon — [components/titiza/category-icons.tsx:49](../components/titiza/category-icons.tsx#L49)
- Arrow-function JSX component DentalIcon — [components/titiza/category-icons.tsx:58](../components/titiza/category-icons.tsx#L58)
- Arrow-function JSX component FitnessIcon — [components/titiza/category-icons.tsx:64](../components/titiza/category-icons.tsx#L64)
- Arrow-function JSX component MakeupIcon — [components/titiza/category-icons.tsx:70](../components/titiza/category-icons.tsx#L70)
- Arrow-function JSX component TattooIcon — [components/titiza/category-icons.tsx:77](../components/titiza/category-icons.tsx#L77)
- Arrow-function JSX component BrowsLashesIcon — [components/titiza/category-icons.tsx:86](../components/titiza/category-icons.tsx#L86)
- Arrow-function JSX component WaxingIcon — [components/titiza/category-icons.tsx:94](../components/titiza/category-icons.tsx#L94)
- Arrow-function JSX component MassageIcon — [components/titiza/category-icons.tsx:102](../components/titiza/category-icons.tsx#L102)
- Arrow-function JSX component MentalHealthIcon — [components/titiza/category-icons.tsx:111](../components/titiza/category-icons.tsx#L111)
- Arrow-function JSX component MedicalAestheticsIcon — [components/titiza/category-icons.tsx:119](../components/titiza/category-icons.tsx#L119)
- Arrow-function JSX component AltMedicineIcon — [components/titiza/category-icons.tsx:130](../components/titiza/category-icons.tsx#L130)
- Arrow-function JSX component PodiatryIcon — [components/titiza/category-icons.tsx:137](../components/titiza/category-icons.tsx#L137)
- Arrow-function JSX component BridalEventsIcon — [components/titiza/category-icons.tsx:144](../components/titiza/category-icons.tsx#L144)
- Arrow-function JSX component FallbackIcon — [components/titiza/category-icons.tsx:153](../components/titiza/category-icons.tsx#L153)
### components/titiza/feature-cards.tsx — IconProps

```tsx
type IconProps = { className?: string; strokeWidth?: number }
```
### components/titiza/path-analysis.tsx — PathAnalysisProps

```tsx
interface PathAnalysisProps {
  /** Localized category label, e.g. "Hair". */
  categoryName: string
  reducedMotion: boolean
  apiRef: MutableRefObject<TitizaCoreApi | null>
}
```
### components/titiza/path-direct.tsx — PathDirectProps

```tsx
interface PathDirectProps {
  /** Localized category label, e.g. "Skin & Facial". */
  categoryName: string
  apiRef: MutableRefObject<TitizaCoreApi | null>
}
```
### components/titiza/titiza-core-scene.tsx — TitizaCoreSceneProps

```tsx
type TitizaCoreSceneProps = {
  /** Play the one-time birth animation. When false the orb mounts already alive. */
  genesis?: boolean
  /** Fires once, when the orb has fully resolved into its resting state. */
  onGenesisComplete?: () => void
  /** Populated by the scene with imperative reaction triggers. */
  apiRef?: MutableRefObject<TitizaCoreApi | null>
  /**
   * Held presence state (additive; default 'idle' is a no-op that preserves
   * the original resting behavior exactly):
   *   - 'thinking' — a continuous low-amplitude energy loop that HOLDS while
   *      active (distinct from reactPulse(), which is a single decaying shot).
   *   - 'bright'   — glow held at an elevated level (~reactEyeContact
   *      magnitude) while active; releases smoothly only when returned to
   *      'idle'.
   */
  sustainedState?: 'idle' | 'thinking' | 'bright'
  /**
   * Increment-to-fire, one-shot ring pulse. Each time this number changes to a
   * new value the scene spawns one expanding ring (same visual as the genesis
   * ring) plus a brief glow tick. `undefined` / unchanged = no-op.
   */
  ringTrigger?: number
}
```
### components/titiza/titiza-core.tsx — TitizaCoreProps

```tsx
type TitizaCoreProps = {
  /** Play the one-time birth animation (first-visit only). */
  genesis?: boolean
  /** Fires once when the orb has fully resolved into its resting state. */
  onGenesisComplete?: () => void
  /** Populated by the scene with imperative reaction triggers. */
  apiRef?: MutableRefObject<TitizaCoreApi | null>
  /** Held presence state — 'idle' (default), 'thinking', or 'bright'. */
  sustainedState?: 'idle' | 'thinking' | 'bright'
  /** Increment-to-fire, one-shot ring pulse. Unchanged/undefined = no-op. */
  ringTrigger?: number
}
```
### components/titiza/titiza-decision-flow.tsx — TitizaDecisionFlowProps

```tsx
interface TitizaDecisionFlowProps {
  /** First name for future personalized beats; unused copy in CP1. */
  userName?: string
}
```
### components/titiza/titiza-hero.tsx — TitizaHeroProps

```tsx
interface TitizaHeroProps {
  userName?: string
  /** 'genesis' plays the first-meeting birth + greeting; 'dashboard' is resting. */
  mode?: Mode
  /** True only when the user has met Titiza before (repeat visit). */
  isReturning?: boolean
  /** Called by the "Let's Begin" CTA (genesis path only). */
  onBegin?: () => void
}
```
### components/titiza-film/analysis-cards-orbit.tsx — AnalysisCardsOrbitProps

```tsx
type AnalysisCardsOrbitProps = {
  chips: string[]
  /** Milliseconds between consecutive chips STARTING their sequence. */
  startStagger: number
  /** Fade-in duration for each chip. */
  appearDuration: number
  /** Still pause after a chip appears, before it begins travelling. */
  pause: number
  /** Travel duration from the outer ring to the orb center. */
  travelDuration: number
  /** Vertical center the chips converge on, in vh (matches the anchored orb). */
  centerYVh: number
  /** Scene-relative elapsed time in ms. */
  elapsed: number
}
```
### components/titiza-film/before-after-swap.tsx — BeforeAfterSwapProps

```tsx
type BeforeAfterSwapProps = {
  mode: 'single' | 'swap'
  /** Scene-relative elapsed time in ms. */
  elapsed: number
  /** For 'swap': scene-relative offset at which the cross-fade begins. */
  swapAt?: number
  /** Cross-fade duration in ms (mode 'swap'). */
  swapDuration?: number
}
```
### components/titiza-film/chat-input-shell.tsx — ChatInputShellProps

```tsx
type ChatInputShellProps = {
  placeholder: string
  chips: string[]
  query: string
  replyLines: string[]
  /** View-relative elapsed time in ms (the chat view mounts at its own offset). */
  elapsed: number
  /** Offset at which the suggested prompt chips begin appearing. */
  chipsAt: number
  /** Stagger between consecutive chip reveals. */
  chipStagger: number
  /** Offset at which the query starts typing character by character. */
  typeStartAt: number
  /** How long the query takes to finish typing. */
  typeDuration: number
  /** Offset at which the finished query lifts into the user bubble (send). */
  sendAt: number
  /** Offset at which Titiza's reply starts revealing, sentence by sentence. */
  replyStartAt: number
  /**
   * Gap (ms) AFTER each reply sentence before the next appears — one entry per
   * sentence (the last is unused for reveal, but keeps the array aligned). Sized
   * per sentence so each honors the reading-time floor before the next lands.
   */
  replyHolds: number[]
}
```
### components/titiza-film/conversation-strip.tsx — ConversationStripProps

```tsx
type ConversationStripProps = {
  userLine: string
  titizaLine: string
  /** Overall layer opacity, driven by the sequencer (fades at the card). */
  opacity: number
}
```
### components/titiza-film/intro-title.tsx — IntroTitleProps

```tsx
type IntroTitleProps = {
  variant: 'intro' | 'timeskip' | 'end'
  /** Primary line (verbatim from the timeline). */
  primary: string
  /** Optional secondary line (verbatim from the timeline). */
  secondary?: string
  /** Scene-relative elapsed time in ms. */
  elapsed: number
  /** Total scene duration in ms (fade-out anchors to the end). */
  duration: number
  /** Fade-in duration in ms. */
  fadeIn: number
  /** Fade-out duration in ms (0 = hard cut at scene end). */
  fadeOut: number
}
```
### components/titiza-film/launch-date-card.tsx — LaunchDateCardProps

```tsx
type LaunchDateCardProps = {
  line1: string
  line2: string
  line3: string
  /** Scene-relative elapsed time in ms. */
  elapsed: number
  /** Total scene duration in ms (the final fade anchors to the end). */
  duration: number
  /** Scene-relative offset at which each line begins fading in. */
  line1At: number
  line2At: number
  line3At: number
  /** Per-line fade-in duration in ms. */
  lineFade: number
  /** Slow whole-composition fade-out duration in ms. */
  finalFadeOut: number
}
```
### components/titiza-film/orb-dialogue.tsx — OrbDialogueProps

```tsx
type OrbDialogueProps = {
  lines: string[]
  /** Milliseconds each line is held before advancing. */
  hold: number
  /** Scene-relative elapsed time in ms. */
  elapsed: number
}
```
### components/titiza-film/professional-card.tsx — ProfessionalCardProps

```tsx
type ProfessionalCardProps = {
  name: string
  role?: string
  meta: string
  rating: string
  button: string
  /** Scene-relative elapsed time in ms. */
  elapsed: number
  /** Scene-relative offset at which the button shows a pressed state. */
  pressAt?: number
  /** Scene-relative offset at which the confirmation line appears. */
  confirmAt?: number
  /** Confirmation copy shown at `confirmAt` (verbatim). */
  confirmText?: string
}
```
### components/titiza-film/typing-lines.tsx — TypingLinesProps

```tsx
type TypingLinesProps = {
  lines: string[]
  /** Scene-relative offset (ms) at which the first line appears. */
  startAt: number
  /** Milliseconds between consecutive line reveals. */
  stagger: number
  /** Scene-relative elapsed time in ms. */
  elapsed: number
  /**
   * Per-row fade+rise duration in ms. Configurable so a scene can tighten its
   * own reveal without silently changing other scenes that reuse this component
   * (default preserves the original 500ms).
   */
  revealDuration?: number
}
```
### components/titiza-film/vertical-montage.tsx — VerticalMontageProps

```tsx
type VerticalMontageProps = {
  words: string[]
  /** How long each word stays fully/at-all present, in ms. */
  visibleDuration: number
  /** Overlap between consecutive words, in ms (the cross-fade window). */
  overlap: number
  /** Scene-relative elapsed time in ms. */
  elapsed: number
}
```
### components/VerifyEmailGate.tsx — VerifyEmailGateProps

```tsx
interface VerifyEmailGateProps {
  /**
   * Called the instant auth.currentUser.emailVerified flips true.
   * The parent decides where to route (onboarding vs dashboard).
   */
  onVerified: () => void;
  /** Email to display in the copy. Falls back to auth.currentUser.email. */
  email?: string;
  /**
   * 'default'    — signed-in but unverified user: auto-detect + resend.
   * 'login-hint' — re-signup case where no user is signed in: static
   *                "you're already signed up, log in to continue" message
   *                (no auto-detect / resend, since there's no currentUser).
   */
  mode?: 'default' | 'login-hint';
}
```
