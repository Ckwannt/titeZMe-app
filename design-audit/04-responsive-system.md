# titeZMe — Responsive system

Audit date: 2026-10-01 (Europe/Madrid). Existing implementation only. Source occurrences do not establish live data, runtime reachability or design intent. No production code changed.

## Exact breakpoints


| Definition | Value | Actual technical change |
|---|---|---|
| Tailwind sm | 40rem;640px at16px root | Titiza tiles2→3cols/JS keyboard stride; feature/learning cards3cols, padding/headings scale; film width grows. |
| Tailwind md | 48rem;768px at16px root | Desktop nav/mobile controls replacement; dashboard sidebar row shell/bottombar hidden; cookie card/overlay composition; search/profile grid/type/padding. |
| Tailwind lg | 64rem;1024px at16px root | Landing hero column→row; multi-column grids/heading sizes. |
| Tailwind xl | 80rem;1280px at16px root | Framework definition; actual uses listed below, not assumed. |
| Tailwind2xl | 96rem;1536px at16px root | Framework definition; actual uses listed below, not assumed. |
| .show-mobile-only | min-width768px | display:none!important. |
| .hidden-mobile | max-width767px | display:none!important. |
| for-shops CSS | max-width768px inclusive | Gutters48→20,hero160px48px100px→140px20px80px; hide video/showposter; comparison/how grids1col,statsgap80→40,WhatsApp28→20px; chair/pricing sections change. |
| Admin users CSS | min-width768px | Local desktop grid rule. |
| useIsMobile | constant768,max-width767,innerWidth&lt;768 | Initial undefined/false; effect only change listener, no initial apply. Consumers not proved by hook existence. |
| CategoryGrid JS | min-width640px | Initial apply/listener, keyboardstride3/2. |


Installed Tailwind rem defaults, no custom override found. Exactly768px overlaps for-shops mobile CSS/Tailwindmd. [Embedded rules](evidence/embedded-css.md).

## Recomposition/stacking/scaling/replacement


| Area | Actual behavior/source |
|---|---|
| TopNav | Desktop centered links/lang hidden belowmd; mobile full-screen drawer/hamburger/native auth. [components/TopNav.tsx:1](../components/TopNav.tsx#L1) |
| Client shell | Stack/row; horizontallyscrollable links belowmd,vertical220px sidebar atmd; mobile60px bottomnav, desktop deletion hidden mobile. [app/dashboard/client/layout.tsx:1](../app/dashboard/client/layout.tsx#L1) |
| Professional/shop | Separate bottomnav/More versus sidebar; content max-height/scroll/padding. [app/dashboard/barber/layout.tsx:1](../app/dashboard/barber/layout.tsx#L1); [app/dashboard/shop/layout.tsx:1](../app/dashboard/shop/layout.tsx#L1) |
| Cookie | Full-width bottom card/sheet versus floating bottom-left card/centered modal atmd. [components/CookieBanner.tsx:1](../components/CookieBanner.tsx#L1) |
| Landing | Stack→row lg;grid expansions;60→88px heading atmd; linebreak hiding. [app/LandingPageClient.tsx:1](../app/LandingPageClient.tsx#L1) |
| Discovery/profiles | Same content with column/padding/type changes; sign-out blur is auth-conditioned, not viewport. |
| for-shops | Video replaced by CSSposter&lt;=768px. [app/for-shops/page.tsx:1](../app/for-shops/page.tsx#L1) |
| Titiza | Grid2→3 with JSnavigation; square maxwidth core, perspective resize andDPRcap2. |
| Films | Same scene structure fixed viewport;70vmin≤460px orb,anchor-26vh/.72scale;px6/pb12vh,sm sizes. [components/titiza-film/film-sequencer.tsx:1](../components/titiza-film/film-sequencer.tsx#L1) |
| Calendars | Numeric dimensions/overflow/layout classes; no separate invented mobilecalendar. [components/AvailabilityGrid.tsx:1](../components/AvailabilityGrid.tsx#L1); [components/SmartTimePicker.tsx:1](../components/SmartTimePicker.tsx#L1); [components/ShopTimePicker.tsx:1](../components/ShopTimePicker.tsx#L1) |


## Every responsive utility


| Variant | Occurrences |
|---|---|
| `lg:bg-gradient-to-r` | [app/challenge/page.tsx:616](../app/challenge/page.tsx#L616) |
| `lg:block` | [app/shop/[shopId]/page.tsx:339](../app/shop/[shopId]/page.tsx#L339) |
| `lg:flex` | [app/barber/[barberId]/BarberProfileClient.tsx:714](../app/barber/[barberId]/BarberProfileClient.tsx#L714); [app/shop/[shopId]/page.tsx:688](../app/shop/[shopId]/page.tsx#L688) |
| `lg:flex-row` | [app/LandingPageClient.tsx:81](../app/LandingPageClient.tsx#L81) |
| `lg:from-transparent` | [app/challenge/page.tsx:616](../app/challenge/page.tsx#L616) |
| `lg:gap-20` | [app/challenge/page.tsx:498](../app/challenge/page.tsx#L498); [app/how-it-works/page.tsx:14](../app/how-it-works/page.tsx#L14); [app/LandingPageClient.tsx:158](../app/LandingPageClient.tsx#L158) |
| `lg:gap-24` | [app/contact/page.tsx:79](../app/contact/page.tsx#L79) |
| `lg:gap-8` | [app/challenge/page.tsx:583](../app/challenge/page.tsx#L583); [app/challenge/page.tsx:769](../app/challenge/page.tsx#L769); [app/LandingPageClient.tsx:178](../app/LandingPageClient.tsx#L178); [app/LandingPageClient.tsx:229](../app/LandingPageClient.tsx#L229) |
| `lg:grid` | [app/challenge/page.tsx:498](../app/challenge/page.tsx#L498); [app/challenge/page.tsx:606](../app/challenge/page.tsx#L606) |
| `lg:grid-cols-[1.2fr_1fr]` | [app/LandingPageClient.tsx:178](../app/LandingPageClient.tsx#L178); [app/LandingPageClient.tsx:229](../app/LandingPageClient.tsx#L229) |
| `lg:grid-cols-2` | [app/challenge/page.tsx:498](../app/challenge/page.tsx#L498); [app/challenge/page.tsx:606](../app/challenge/page.tsx#L606); [app/challenge/page.tsx:674](../app/challenge/page.tsx#L674); [app/challenge/page.tsx:726](../app/challenge/page.tsx#L726) |
| `lg:grid-cols-3` | [app/barbers/BarbersClient.tsx:430](../app/barbers/BarbersClient.tsx#L430); [app/barbers/BarbersClient.tsx:460](../app/barbers/BarbersClient.tsx#L460); [app/challenge/page.tsx:769](../app/challenge/page.tsx#L769); [app/challenge/page.tsx:821](../app/challenge/page.tsx#L821); [app/challenge/page.tsx:912](../app/challenge/page.tsx#L912); [app/challenge/page.tsx:936](../app/challenge/page.tsx#L936); [app/challenge/page.tsx:1063](../app/challenge/page.tsx#L1063); [app/challenge/page.tsx:1080](../app/challenge/page.tsx#L1080); [app/shop/[shopId]/page.tsx:514](../app/shop/[shopId]/page.tsx#L514); [app/shops/page.tsx:402](../app/shops/page.tsx#L402); [app/shops/page.tsx:430](../app/shops/page.tsx#L430); [components/BarberPortfolioTab.tsx:147](../components/BarberPortfolioTab.tsx#L147) |
| `lg:grid-cols-4` | [app/dashboard/barber/page.tsx:554](../app/dashboard/barber/page.tsx#L554); [app/dashboard/shop/bookings/page.tsx:209](../app/dashboard/shop/bookings/page.tsx#L209); [app/dashboard/shop/earnings/page.tsx:177](../app/dashboard/shop/earnings/page.tsx#L177); [app/dashboard/shop/page.tsx:361](../app/dashboard/shop/page.tsx#L361); [app/dashboard/shop/page.tsx:389](../app/dashboard/shop/page.tsx#L389); [app/LandingPageClient.tsx:283](../app/LandingPageClient.tsx#L283) |
| `lg:hidden` | [app/barber/[barberId]/BarberProfileClient.tsx:842](../app/barber/[barberId]/BarberProfileClient.tsx#L842); [app/challenge/page.tsx:618](../app/challenge/page.tsx#L618) |
| `lg:max-w-[440px]` | [components/ChallengeHomepageBox.tsx:103](../components/ChallengeHomepageBox.tsx#L103) |
| `lg:mb-0` | [app/challenge/page.tsx:520](../app/challenge/page.tsx#L520) |
| `lg:mt-0` | [components/ChallengeHomepageBox.tsx:103](../components/ChallengeHomepageBox.tsx#L103) |
| `lg:order-first` | [app/challenge/page.tsx:501](../app/challenge/page.tsx#L501) |
| `lg:order-last` | [app/challenge/page.tsx:520](../app/challenge/page.tsx#L520) |
| `lg:p-8` | [app/challenge/page.tsx:583](../app/challenge/page.tsx#L583); [app/challenge/page.tsx:675](../app/challenge/page.tsx#L675); [app/challenge/page.tsx:683](../app/challenge/page.tsx#L683); [app/challenge/page.tsx:694](../app/challenge/page.tsx#L694); [app/challenge/page.tsx:702](../app/challenge/page.tsx#L702); [app/challenge/page.tsx:707](../app/challenge/page.tsx#L707) |
| `lg:pb-0` | [app/barber/[barberId]/BarberProfileClient.tsx:441](../app/barber/[barberId]/BarberProfileClient.tsx#L441) |
| `lg:px-12` | [app/challenge/page.tsx:627](../app/challenge/page.tsx#L627) |
| `lg:py-20` | [app/challenge/page.tsx:627](../app/challenge/page.tsx#L627) |
| `lg:py-28` | [app/challenge/page.tsx:571](../app/challenge/page.tsx#L571); [app/challenge/page.tsx:661](../app/challenge/page.tsx#L661); [app/challenge/page.tsx:717](../app/challenge/page.tsx#L717); [app/challenge/page.tsx:767](../app/challenge/page.tsx#L767); [app/challenge/page.tsx:812](../app/challenge/page.tsx#L812) |
| `lg:py-32` | [app/challenge/page.tsx:486](../app/challenge/page.tsx#L486); [app/challenge/page.tsx:840](../app/challenge/page.tsx#L840) |
| `lg:text-3xl` | [app/challenge/page.tsx:576](../app/challenge/page.tsx#L576) |
| `lg:text-5xl` | [app/challenge/page.tsx:585](../app/challenge/page.tsx#L585); [app/challenge/page.tsx:631](../app/challenge/page.tsx#L631); [app/challenge/page.tsx:666](../app/challenge/page.tsx#L666); [app/challenge/page.tsx:722](../app/challenge/page.tsx#L722); [app/challenge/page.tsx:818](../app/challenge/page.tsx#L818) |
| `lg:text-6xl` | [app/challenge/page.tsx:502](../app/challenge/page.tsx#L502) |
| `lg:text-7xl` | [app/challenge/page.tsx:523](../app/challenge/page.tsx#L523); [app/challenge/page.tsx:848](../app/challenge/page.tsx#L848) |
| `lg:text-9xl` | [app/challenge/page.tsx:833](../app/challenge/page.tsx#L833) |
| `lg:text-lg` | [app/challenge/page.tsx:634](../app/challenge/page.tsx#L634) |
| `lg:text-xl` | [app/challenge/page.tsx:589](../app/challenge/page.tsx#L589) |
| `lg:to-black` | [app/challenge/page.tsx:616](../app/challenge/page.tsx#L616) |
| `md:block` | [app/dashboard/barber/layout.tsx:202](../app/dashboard/barber/layout.tsx#L202); [app/dashboard/barber/layout.tsx:229](../app/dashboard/barber/layout.tsx#L229); [app/dashboard/client/layout.tsx:90](../app/dashboard/client/layout.tsx#L90); [app/dashboard/shop/layout.tsx:141](../app/dashboard/shop/layout.tsx#L141); [app/LandingPageClient.tsx:91](../app/LandingPageClient.tsx#L91); [components/TopNav.tsx:103](../components/TopNav.tsx#L103) |
| `md:border` | [components/CookieBanner.tsx:51](../components/CookieBanner.tsx#L51); [components/CookieBanner.tsx:82](../components/CookieBanner.tsx#L82) |
| `md:border-r` | [app/dashboard/barber/layout.tsx:135](../app/dashboard/barber/layout.tsx#L135); [app/dashboard/client/layout.tsx:49](../app/dashboard/client/layout.tsx#L49); [app/dashboard/shop/layout.tsx:104](../app/dashboard/shop/layout.tsx#L104) |
| `md:bottom-6` | [components/CookieBanner.tsx:51](../components/CookieBanner.tsx#L51) |
| `md:col-span-2` | [app/dashboard/barber/create-shop/page.tsx:280](../app/dashboard/barber/create-shop/page.tsx#L280); [app/dashboard/barber/create-shop/page.tsx:307](../app/dashboard/barber/create-shop/page.tsx#L307) |
| `md:flex` | [components/TopNav.tsx:85](../components/TopNav.tsx#L85); [components/TopNav.tsx:291](../components/TopNav.tsx#L291); [components/TopNav.tsx:293](../components/TopNav.tsx#L293); [components/TopNav.tsx:307](../components/TopNav.tsx#L307) |
| `md:flex-col` | [app/dashboard/barber/layout.tsx:183](../app/dashboard/barber/layout.tsx#L183); [app/dashboard/client/layout.tsx:71](../app/dashboard/client/layout.tsx#L71); [app/dashboard/shop/layout.tsx:124](../app/dashboard/shop/layout.tsx#L124) |
| `md:flex-none` | [components/BarberInvitesTab.tsx:184](../components/BarberInvitesTab.tsx#L184); [components/BarberInvitesTab.tsx:191](../components/BarberInvitesTab.tsx#L191) |
| `md:flex-row` | [app/dashboard/barber/layout.tsx:133](../app/dashboard/barber/layout.tsx#L133); [app/dashboard/barber/page.tsx:462](../app/dashboard/barber/page.tsx#L462); [app/dashboard/client/layout.tsx:48](../app/dashboard/client/layout.tsx#L48); [app/dashboard/shop/layout.tsx:102](../app/dashboard/shop/layout.tsx#L102); [app/dashboard/shop/page.tsx:376](../app/dashboard/shop/page.tsx#L376); [components/BarberInvitesTab.tsx:172](../components/BarberInvitesTab.tsx#L172); [components/Footer.tsx:11](../components/Footer.tsx#L11); [components/skeletons.tsx:65](../components/skeletons.tsx#L65) |
| `md:gap-10` | [components/skeletons.tsx:65](../components/skeletons.tsx#L65) |
| `md:gap-12` | [app/LandingPageClient.tsx:112](../app/LandingPageClient.tsx#L112) |
| `md:grid-cols-[1.2fr_1fr]` | [app/contact/page.tsx:79](../app/contact/page.tsx#L79) |
| `md:grid-cols-2` | [app/dashboard/barber/create-shop/page.tsx:279](../app/dashboard/barber/create-shop/page.tsx#L279) |
| `md:grid-cols-3` | [app/how-it-works/page.tsx:14](../app/how-it-works/page.tsx#L14); [app/LandingPageClient.tsx:158](../app/LandingPageClient.tsx#L158); [components/BarberPortfolioTab.tsx:103](../components/BarberPortfolioTab.tsx#L103) |
| `md:h-[260px]` | [app/shop/[shopId]/page.tsx:416](../app/shop/[shopId]/page.tsx#L416) |
| `md:h-20` | [app/shop/[shopId]/page.tsx:428](../app/shop/[shopId]/page.tsx#L428) |
| `md:hidden` | [app/dashboard/barber/layout.tsx:275](../app/dashboard/barber/layout.tsx#L275); [app/dashboard/client/layout.tsx:100](../app/dashboard/client/layout.tsx#L100); [app/dashboard/shop/layout.tsx:155](../app/dashboard/shop/layout.tsx#L155); [components/BarberSettingsTab.tsx:435](../components/BarberSettingsTab.tsx#L435) |
| `md:items-center` | [components/BarberInvitesTab.tsx:172](../components/BarberInvitesTab.tsx#L172); [components/CookieBanner.tsx:81](../components/CookieBanner.tsx#L81) |
| `md:items-start` | [components/Footer.tsx:12](../components/Footer.tsx#L12) |
| `md:justify-center` | [components/CookieBanner.tsx:81](../components/CookieBanner.tsx#L81) |
| `md:left-6` | [components/CookieBanner.tsx:51](../components/CookieBanner.tsx#L51) |
| `md:max-w-md` | [app/LandingPageClient.tsx:112](../app/LandingPageClient.tsx#L112); [components/CookieBanner.tsx:82](../components/CookieBanner.tsx#L82) |
| `md:max-w-sm` | [components/CookieBanner.tsx:51](../components/CookieBanner.tsx#L51) |
| `md:mt-20` | [app/signup/page.tsx:262](../app/signup/page.tsx#L262) |
| `md:mt-24` | [app/login/page.tsx:218](../app/login/page.tsx#L218) |
| `md:mt-6` | [app/dashboard/barber/layout.tsx:202](../app/dashboard/barber/layout.tsx#L202) |
| `md:overflow-visible` | [app/dashboard/barber/layout.tsx:183](../app/dashboard/barber/layout.tsx#L183); [app/dashboard/client/layout.tsx:71](../app/dashboard/client/layout.tsx#L71); [app/dashboard/shop/layout.tsx:124](../app/dashboard/shop/layout.tsx#L124) |
| `md:p-10` | [app/contact/page.tsx:80](../app/contact/page.tsx#L80); [components/ChallengePaymentTab.tsx:146](../components/ChallengePaymentTab.tsx#L146); [components/ChallengePaymentTab.tsx:154](../components/ChallengePaymentTab.tsx#L154); [components/ChallengePaymentTab.tsx:172](../components/ChallengePaymentTab.tsx#L172); [components/ChallengePaymentTab.tsx:194](../components/ChallengePaymentTab.tsx#L194); [components/ChallengePaymentTab.tsx:217](../components/ChallengePaymentTab.tsx#L217); [components/ChallengePaymentTab.tsx:248](../components/ChallengePaymentTab.tsx#L248); [components/ChallengeSubmissionTab.tsx:492](../components/ChallengeSubmissionTab.tsx#L492); [components/ChallengeSubmissionTab.tsx:500](../components/ChallengeSubmissionTab.tsx#L500); [components/ChallengeSubmissionTab.tsx:516](../components/ChallengeSubmissionTab.tsx#L516); [components/ChallengeSubmissionTab.tsx:529](../components/ChallengeSubmissionTab.tsx#L529); [components/ChallengeSubmissionTab.tsx:557](../components/ChallengeSubmissionTab.tsx#L557); [components/ChallengeSubmissionTab.tsx:738](../components/ChallengeSubmissionTab.tsx#L738) |
| `md:p-8` | [app/dashboard/barber/availability/page.tsx:11](../app/dashboard/barber/availability/page.tsx#L11); [app/dashboard/barber/bookings/page.tsx:227](../app/dashboard/barber/bookings/page.tsx#L227); [app/dashboard/barber/invites/page.tsx:6](../app/dashboard/barber/invites/page.tsx#L6); [app/dashboard/barber/page.tsx:445](../app/dashboard/barber/page.tsx#L445); [app/dashboard/barber/portfolio/page.tsx:18](../app/dashboard/barber/portfolio/page.tsx#L18); [app/dashboard/barber/services/page.tsx:136](../app/dashboard/barber/services/page.tsx#L136); [app/dashboard/client/badges/page.tsx:9](../app/dashboard/client/badges/page.tsx#L9); [app/dashboard/client/bookings/page.tsx:161](../app/dashboard/client/bookings/page.tsx#L161); [app/dashboard/client/favorites/page.tsx:50](../app/dashboard/client/favorites/page.tsx#L50); [app/dashboard/client/gift-a-cut/page.tsx:9](../app/dashboard/client/gift-a-cut/page.tsx#L9); [app/dashboard/client/messages/page.tsx:9](../app/dashboard/client/messages/page.tsx#L9); [app/dashboard/client/my-look/page.tsx:9](../app/dashboard/client/my-look/page.tsx#L9); [app/dashboard/client/reviews/page.tsx:88](../app/dashboard/client/reviews/page.tsx#L88); [app/dashboard/client/settings/page.tsx:234](../app/dashboard/client/settings/page.tsx#L234); [app/dashboard/shop/availability/page.tsx:22](../app/dashboard/shop/availability/page.tsx#L22); [app/dashboard/shop/bookings/page.tsx:197](../app/dashboard/shop/bookings/page.tsx#L197); [app/dashboard/shop/earnings/page.tsx:161](../app/dashboard/shop/earnings/page.tsx#L161); [app/dashboard/shop/page.tsx:359](../app/dashboard/shop/page.tsx#L359); [app/dashboard/shop/page.tsx:373](../app/dashboard/shop/page.tsx#L373); [app/dashboard/shop/photos/page.tsx:16](../app/dashboard/shop/photos/page.tsx#L16); [app/dashboard/shop/reviews/page.tsx:131](../app/dashboard/shop/reviews/page.tsx#L131); [app/dashboard/shop/services/page.tsx:22](../app/dashboard/shop/services/page.tsx#L22); [app/dashboard/shop/team/page.tsx:4](../app/dashboard/shop/team/page.tsx#L4); [app/LandingPageClient.tsx:207](../app/LandingPageClient.tsx#L207); [app/LandingPageClient.tsx:211](../app/LandingPageClient.tsx#L211); [app/LandingPageClient.tsx:215](../app/LandingPageClient.tsx#L215); [app/LandingPageClient.tsx:219](../app/LandingPageClient.tsx#L219); [app/LandingPageClient.tsx:258](../app/LandingPageClient.tsx#L258); [app/LandingPageClient.tsx:262](../app/LandingPageClient.tsx#L262); [app/LandingPageClient.tsx:266](../app/LandingPageClient.tsx#L266); [app/LandingPageClient.tsx:270](../app/LandingPageClient.tsx#L270); [app/onboarding/client/page.tsx:183](../app/onboarding/client/page.tsx#L183); [app/onboarding/professional/page.tsx:440](../app/onboarding/professional/page.tsx#L440); [components/CookieBanner.tsx:82](../components/CookieBanner.tsx#L82) |
| `md:pb-0` | [app/dashboard/barber/layout.tsx:183](../app/dashboard/barber/layout.tsx#L183); [app/dashboard/barber/layout.tsx:270](../app/dashboard/barber/layout.tsx#L270); [app/dashboard/client/layout.tsx:71](../app/dashboard/client/layout.tsx#L71); [app/dashboard/client/layout.tsx:95](../app/dashboard/client/layout.tsx#L95); [app/dashboard/shop/layout.tsx:124](../app/dashboard/shop/layout.tsx#L124); [app/dashboard/shop/layout.tsx:150](../app/dashboard/shop/layout.tsx#L150) |
| `md:pb-8` | [app/dashboard/barber/page.tsx:445](../app/dashboard/barber/page.tsx#L445) |
| `md:pt-12` | [app/shop/[shopId]/page.tsx:440](../app/shop/[shopId]/page.tsx#L440) |
| `md:pt-24` | [app/LandingPageClient.tsx:77](../app/LandingPageClient.tsx#L77) |
| `md:px-10` | [app/dashboard/barber/bookings/page.tsx:227](../app/dashboard/barber/bookings/page.tsx#L227); [app/dashboard/barber/page.tsx:445](../app/dashboard/barber/page.tsx#L445); [app/dashboard/client/badges/page.tsx:9](../app/dashboard/client/badges/page.tsx#L9); [app/dashboard/client/bookings/page.tsx:161](../app/dashboard/client/bookings/page.tsx#L161); [app/dashboard/client/favorites/page.tsx:50](../app/dashboard/client/favorites/page.tsx#L50); [app/dashboard/client/gift-a-cut/page.tsx:9](../app/dashboard/client/gift-a-cut/page.tsx#L9); [app/dashboard/client/messages/page.tsx:9](../app/dashboard/client/messages/page.tsx#L9); [app/dashboard/client/my-look/page.tsx:9](../app/dashboard/client/my-look/page.tsx#L9); [app/dashboard/client/reviews/page.tsx:88](../app/dashboard/client/reviews/page.tsx#L88); [app/dashboard/client/settings/page.tsx:234](../app/dashboard/client/settings/page.tsx#L234); [app/dashboard/shop/bookings/page.tsx:197](../app/dashboard/shop/bookings/page.tsx#L197); [app/dashboard/shop/earnings/page.tsx:161](../app/dashboard/shop/earnings/page.tsx#L161); [app/dashboard/shop/page.tsx:359](../app/dashboard/shop/page.tsx#L359); [app/dashboard/shop/page.tsx:373](../app/dashboard/shop/page.tsx#L373); [app/dashboard/shop/reviews/page.tsx:131](../app/dashboard/shop/reviews/page.tsx#L131) |
| `md:px-6` | [components/skeletons.tsx:64](../components/skeletons.tsx#L64) |
| `md:py-10` | [components/skeletons.tsx:64](../components/skeletons.tsx#L64) |
| `md:py-16` | [app/book/shop/[shopId]/page.tsx:418](../app/book/shop/[shopId]/page.tsx#L418); [app/book/[barberId]/page.tsx:446](../app/book/[barberId]/page.tsx#L446) |
| `md:py-20` | [app/review/[bookingId]/page.tsx:121](../app/review/[bookingId]/page.tsx#L121) |
| `md:rounded-2xl` | [components/CookieBanner.tsx:51](../components/CookieBanner.tsx#L51); [components/CookieBanner.tsx:82](../components/CookieBanner.tsx#L82) |
| `md:text-[88px]` | [app/LandingPageClient.tsx:90](../app/LandingPageClient.tsx#L90) |
| `md:text-2xl` | [app/challenge/page.tsx:1056](../app/challenge/page.tsx#L1056); [components/CookieBanner.tsx:83](../components/CookieBanner.tsx#L83) |
| `md:text-3xl` | [app/LandingPageClient.tsx:220](../app/LandingPageClient.tsx#L220); [app/LandingPageClient.tsx:271](../app/LandingPageClient.tsx#L271); [components/ChallengeHomepageBox.tsx:140](../components/ChallengeHomepageBox.tsx#L140) |
| `md:text-4xl` | [app/challenge/page.tsx:431](../app/challenge/page.tsx#L431); [components/ChallengeHomepageBox.tsx:132](../components/ChallengeHomepageBox.tsx#L132) |
| `md:text-5xl` | [app/barbers/BarbersClient.tsx:344](../app/barbers/BarbersClient.tsx#L344); [app/challenge/page.tsx:269](../app/challenge/page.tsx#L269); [app/how-it-works/page.tsx:11](../app/how-it-works/page.tsx#L11); [app/LandingPageClient.tsx:143](../app/LandingPageClient.tsx#L143); [app/LandingPageClient.tsx:156](../app/LandingPageClient.tsx#L156); [app/LandingPageClient.tsx:208](../app/LandingPageClient.tsx#L208); [app/LandingPageClient.tsx:212](../app/LandingPageClient.tsx#L212); [app/LandingPageClient.tsx:216](../app/LandingPageClient.tsx#L216); [app/LandingPageClient.tsx:259](../app/LandingPageClient.tsx#L259); [app/LandingPageClient.tsx:263](../app/LandingPageClient.tsx#L263); [app/LandingPageClient.tsx:267](../app/LandingPageClient.tsx#L267); [app/LandingPageClient.tsx:282](../app/LandingPageClient.tsx#L282); [app/privacy/page.tsx:9](../app/privacy/page.tsx#L9); [app/shops/page.tsx:313](../app/shops/page.tsx#L313); [app/terms/challenge/page.tsx:29](../app/terms/challenge/page.tsx#L29); [app/terms/page.tsx:9](../app/terms/page.tsx#L9) |
| `md:text-6xl` | [app/LandingPageClient.tsx:181](../app/LandingPageClient.tsx#L181); [app/LandingPageClient.tsx:232](../app/LandingPageClient.tsx#L232) |
| `md:text-7xl` | [app/contact/page.tsx:72](../app/contact/page.tsx#L72); [app/LandingPageClient.tsx:312](../app/LandingPageClient.tsx#L312); [components/titiza-film/launch-date-card.tsx:63](../components/titiza-film/launch-date-card.tsx#L63) |
| `md:text-8xl` | [components/titiza/titiza-hero.tsx:75](../components/titiza/titiza-hero.tsx#L75); [components/titiza-film/intro-title.tsx:56](../components/titiza-film/intro-title.tsx#L56); [components/titiza-film/intro-title.tsx:71](../components/titiza-film/intro-title.tsx#L71) |
| `md:text-base` | [app/challenge/page.tsx:272](../app/challenge/page.tsx#L272) |
| `md:text-lg` | [components/CookieBanner.tsx:52](../components/CookieBanner.tsx#L52) |
| `md:text-sm` | [components/CookieBanner.tsx:53](../components/CookieBanner.tsx#L53); [components/CookieBanner.tsx:89](../components/CookieBanner.tsx#L89); [components/CookieBanner.tsx:99](../components/CookieBanner.tsx#L99); [components/CookieBanner.tsx:112](../components/CookieBanner.tsx#L112) |
| `md:w-[220px]` | [app/dashboard/barber/layout.tsx:135](../app/dashboard/barber/layout.tsx#L135); [app/dashboard/client/layout.tsx:49](../app/dashboard/client/layout.tsx#L49); [app/dashboard/shop/layout.tsx:104](../app/dashboard/shop/layout.tsx#L104) |
| `md:w-1/3` | [components/skeletons.tsx:66](../components/skeletons.tsx#L66) |
| `md:w-20` | [app/shop/[shopId]/page.tsx:428](../app/shop/[shopId]/page.tsx#L428) |
| `md:w-auto` | [components/BarberInvitesTab.tsx:180](../components/BarberInvitesTab.tsx#L180) |
| `md:w-full` | [components/CookieBanner.tsx:51](../components/CookieBanner.tsx#L51) |
| `sm:block` | [app/dashboard/barber/bookings/page.tsx:277](../app/dashboard/barber/bookings/page.tsx#L277); [app/dashboard/shop/page.tsx:622](../app/dashboard/shop/page.tsx#L622) |
| `sm:col-span-3` | [components/ShopServicesTab.tsx:224](../components/ShopServicesTab.tsx#L224); [components/ShopServicesTab.tsx:229](../components/ShopServicesTab.tsx#L229) |
| `sm:col-span-6` | [components/ShopServicesTab.tsx:219](../components/ShopServicesTab.tsx#L219) |
| `sm:flex-[0.6]` | [components/BarberSettingsTab.tsx:578](../components/BarberSettingsTab.tsx#L578); [components/ShopSettingsTab.tsx:626](../components/ShopSettingsTab.tsx#L626) |
| `sm:flex-nowrap` | [app/dashboard/barber/bookings/page.tsx:271](../app/dashboard/barber/bookings/page.tsx#L271); [app/dashboard/shop/page.tsx:593](../app/dashboard/shop/page.tsx#L593) |
| `sm:flex-row` | [app/barbers/BarbersClient.tsx:364](../app/barbers/BarbersClient.tsx#L364); [app/dashboard/barber/page.tsx:726](../app/dashboard/barber/page.tsx#L726); [app/dashboard/barber/services/page.tsx:148](../app/dashboard/barber/services/page.tsx#L148); [app/dashboard/shop/bookings/page.tsx:198](../app/dashboard/shop/bookings/page.tsx#L198); [app/dashboard/shop/reviews/page.tsx:163](../app/dashboard/shop/reviews/page.tsx#L163); [app/not-found.tsx:13](../app/not-found.tsx#L13); [app/shops/page.tsx:333](../app/shops/page.tsx#L333); [components/BarberSettingsTab.tsx:860](../components/BarberSettingsTab.tsx#L860) |
| `sm:gap-24` | [app/dashboard/client/titiza/page.tsx:70](../app/dashboard/client/titiza/page.tsx#L70); [app/dashboard/client/titiza/page.tsx:83](../app/dashboard/client/titiza/page.tsx#L83) |
| `sm:gap-4` | [components/titiza/category-grid.tsx:131](../components/titiza/category-grid.tsx#L131) |
| `sm:gap-6` | [app/dashboard/shop/page.tsx:606](../app/dashboard/shop/page.tsx#L606) |
| `sm:gap-8` | [components/Footer.tsx:19](../components/Footer.tsx#L19) |
| `sm:grid-cols-12` | [components/ShopServicesTab.tsx:218](../components/ShopServicesTab.tsx#L218) |
| `sm:grid-cols-2` | [app/barbers/BarbersClient.tsx:430](../app/barbers/BarbersClient.tsx#L430); [app/barbers/BarbersClient.tsx:460](../app/barbers/BarbersClient.tsx#L460); [app/book/shop/[shopId]/page.tsx:556](../app/book/shop/[shopId]/page.tsx#L556); [app/challenge/page.tsx:912](../app/challenge/page.tsx#L912); [app/challenge/page.tsx:936](../app/challenge/page.tsx#L936); [app/challenge/page.tsx:1063](../app/challenge/page.tsx#L1063); [app/challenge/page.tsx:1080](../app/challenge/page.tsx#L1080); [app/dashboard/barber/page.tsx:554](../app/dashboard/barber/page.tsx#L554); [app/dashboard/client/favorites/page.tsx:66](../app/dashboard/client/favorites/page.tsx#L66); [app/dashboard/shop/page.tsx:361](../app/dashboard/shop/page.tsx#L361); [app/dashboard/shop/page.tsx:389](../app/dashboard/shop/page.tsx#L389); [app/dashboard/shop/page.tsx:631](../app/dashboard/shop/page.tsx#L631); [app/LandingPageClient.tsx:283](../app/LandingPageClient.tsx#L283); [app/onboarding/professional/page.tsx:603](../app/onboarding/professional/page.tsx#L603); [app/onboarding/professional/page.tsx:796](../app/onboarding/professional/page.tsx#L796); [app/shop/[shopId]/page.tsx:514](../app/shop/[shopId]/page.tsx#L514); [app/shops/page.tsx:402](../app/shops/page.tsx#L402); [app/shops/page.tsx:430](../app/shops/page.tsx#L430); [components/BarberPortfolioTab.tsx:147](../components/BarberPortfolioTab.tsx#L147); [components/BarberSettingsTab.tsx:552](../components/BarberSettingsTab.tsx#L552); [components/BarberSettingsTab.tsx:697](../components/BarberSettingsTab.tsx#L697); [components/BarberSettingsTab.tsx:723](../components/BarberSettingsTab.tsx#L723); [components/ShopSettingsTab.tsx:704](../components/ShopSettingsTab.tsx#L704); [components/ShopSettingsTab.tsx:727](../components/ShopSettingsTab.tsx#L727); [components/ShopSettingsTab.tsx:750](../components/ShopSettingsTab.tsx#L750) |
| `sm:grid-cols-3` | [components/BarberSettingsTab.tsx:601](../components/BarberSettingsTab.tsx#L601); [components/ShopSettingsTab.tsx:649](../components/ShopSettingsTab.tsx#L649); [components/titiza/category-grid.tsx:131](../components/titiza/category-grid.tsx#L131); [components/titiza/feature-cards.tsx:71](../components/titiza/feature-cards.tsx#L71); [components/titiza/titiza-hero.tsx:141](../components/titiza/titiza-hero.tsx#L141) |
| `sm:grid-cols-4` | [app/barber/[barberId]/BarberProfileClient.tsx:575](../app/barber/[barberId]/BarberProfileClient.tsx#L575); [app/dashboard/barber/bookings/page.tsx:233](../app/dashboard/barber/bookings/page.tsx#L233); [components/ChallengeSubmissionTab.tsx:799](../components/ChallengeSubmissionTab.tsx#L799); [components/ChallengeSubmissionTab.tsx:831](../components/ChallengeSubmissionTab.tsx#L831) |
| `sm:items-center` | [app/dashboard/barber/page.tsx:726](../app/dashboard/barber/page.tsx#L726); [app/dashboard/barber/services/page.tsx:148](../app/dashboard/barber/services/page.tsx#L148) |
| `sm:justify-between` | [app/dashboard/barber/services/page.tsx:148](../app/dashboard/barber/services/page.tsx#L148) |
| `sm:justify-end` | [app/dashboard/shop/page.tsx:606](../app/dashboard/shop/page.tsx#L606) |
| `sm:max-w-[320px]` | [components/titiza/titiza-decision-flow.tsx:129](../components/titiza/titiza-decision-flow.tsx#L129) |
| `sm:max-w-md` | [app/challenge/page.tsx:340](../app/challenge/page.tsx#L340) |
| `sm:max-w-sm` | [app/barbers/BarbersClient.tsx:402](../app/barbers/BarbersClient.tsx#L402); [app/shops/page.tsx:372](../app/shops/page.tsx#L372) |
| `sm:mt-0` | [app/dashboard/barber/bookings/page.tsx:281](../app/dashboard/barber/bookings/page.tsx#L281); [app/dashboard/barber/bookings/page.tsx:287](../app/dashboard/barber/bookings/page.tsx#L287); [app/dashboard/shop/page.tsx:606](../app/dashboard/shop/page.tsx#L606) |
| `sm:order-none` | [app/dashboard/shop/page.tsx:606](../app/dashboard/shop/page.tsx#L606) |
| `sm:p-10` | [components/titiza/beauty-profile-card.tsx:112](../components/titiza/beauty-profile-card.tsx#L112) |
| `sm:p-3` | [components/AvailabilityGrid.tsx:443](../components/AvailabilityGrid.tsx#L443) |
| `sm:pt-24` | [app/dashboard/client/titiza/page.tsx:70](../app/dashboard/client/titiza/page.tsx#L70) |
| `sm:pt-7` | [components/titiza-film/conversation-strip.tsx:21](../components/titiza-film/conversation-strip.tsx#L21) |
| `sm:text-[13px]` | [components/titiza-film/chat-input-shell.tsx:121](../components/titiza-film/chat-input-shell.tsx#L121) |
| `sm:text-3xl` | [components/titiza-film/launch-date-card.tsx:69](../components/titiza-film/launch-date-card.tsx#L69) |
| `sm:text-4xl` | [components/titiza/beauty-profile-card.tsx:123](../components/titiza/beauty-profile-card.tsx#L123); [components/titiza/titiza-decision-flow.tsx:149](../components/titiza/titiza-decision-flow.tsx#L149); [components/titiza/titiza-hero.tsx:97](../components/titiza/titiza-hero.tsx#L97); [components/titiza/titiza-hero.tsx:102](../components/titiza/titiza-hero.tsx#L102); [components/titiza-film/intro-title.tsx:64](../components/titiza-film/intro-title.tsx#L64); [components/titiza-film/orb-dialogue.tsx:24](../components/titiza-film/orb-dialogue.tsx#L24) |
| `sm:text-5xl` | [components/titiza-film/vertical-montage.tsx:50](../components/titiza-film/vertical-montage.tsx#L50) |
| `sm:text-6xl` | [components/titiza-film/launch-date-card.tsx:63](../components/titiza-film/launch-date-card.tsx#L63) |
| `sm:text-7xl` | [components/titiza/titiza-hero.tsx:75](../components/titiza/titiza-hero.tsx#L75); [components/titiza-film/intro-title.tsx:56](../components/titiza-film/intro-title.tsx#L56); [components/titiza-film/intro-title.tsx:71](../components/titiza-film/intro-title.tsx#L71) |
| `sm:text-base` | [components/AvailabilityGrid.tsx:447](../components/AvailabilityGrid.tsx#L447) |
| `sm:text-lg` | [components/titiza/titiza-hero.tsx:78](../components/titiza/titiza-hero.tsx#L78); [components/titiza/titiza-hero.tsx:127](../components/titiza/titiza-hero.tsx#L127) |
| `sm:text-sm` | [components/titiza-film/intro-title.tsx:52](../components/titiza-film/intro-title.tsx#L52); [components/titiza-film/intro-title.tsx:75](../components/titiza-film/intro-title.tsx#L75); [components/titiza-film/typing-lines.tsx:32](../components/titiza-film/typing-lines.tsx#L32) |
| `sm:text-xl` | [components/titiza-film/chat-input-shell.tsx:107](../components/titiza-film/chat-input-shell.tsx#L107); [components/titiza-film/launch-date-card.tsx:75](../components/titiza-film/launch-date-card.tsx#L75) |
| `sm:text-xs` | [components/AvailabilityGrid.tsx:465](../components/AvailabilityGrid.tsx#L465); [components/titiza-film/analysis-cards-orbit.tsx:76](../components/titiza-film/analysis-cards-orbit.tsx#L76); [components/titiza-film/conversation-strip.tsx:24](../components/titiza-film/conversation-strip.tsx#L24) |
| `sm:w-48` | [components/titiza-film/before-after-swap.tsx:54](../components/titiza-film/before-after-swap.tsx#L54) |
| `sm:w-auto` | [app/dashboard/barber/bookings/page.tsx:281](../app/dashboard/barber/bookings/page.tsx#L281); [app/dashboard/barber/bookings/page.tsx:287](../app/dashboard/barber/bookings/page.tsx#L287); [app/dashboard/shop/page.tsx:606](../app/dashboard/shop/page.tsx#L606); [components/ChallengePaymentTab.tsx:183](../components/ChallengePaymentTab.tsx#L183); [components/ChallengePaymentTab.tsx:205](../components/ChallengePaymentTab.tsx#L205); [components/ChallengePaymentTab.tsx:225](../components/ChallengePaymentTab.tsx#L225); [components/ChallengePaymentTab.tsx:386](../components/ChallengePaymentTab.tsx#L386); [components/ChallengeSubmissionTab.tsx:599](../components/ChallengeSubmissionTab.tsx#L599); [components/ChallengeSubmissionTab.tsx:976](../components/ChallengeSubmissionTab.tsx#L976); [components/ShopServicesTab.tsx:238](../components/ShopServicesTab.tsx#L238) |


Media/clamp/JS width checks: [responsive ledger](evidence/responsive.md). Captures verify390×844/1440×1000 only, not intermediate widths.
