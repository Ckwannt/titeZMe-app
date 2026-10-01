const fs=require('fs'),ts=require('typescript'),path=require('path');
const out='design-audit',e=JSON.parse(fs.readFileSync(out+'/evidence/source-inventory.json','utf8')),rs=e.records;
const src=(f,l=1)=>'['+f+':'+l+'](../'+f+'#L'+l+')';
const esc=s=>String(s).replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('|','\\|').replaceAll('\n',' ');
const table=(h,rows)=>'\n| '+h.join(' | ')+' |\n|'+h.map(()=>'---').join('|')+'|\n'+rows.map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n')+'\n';
const put=(f,title,sections)=>fs.writeFileSync(out+'/'+f,'# titeZMe — '+title+'\n\nAudit date: 2026-10-01 (Europe/Madrid). Existing implementation only. Source occurrences do not establish live data, runtime reachability or design intent. No production code changed.\n\n'+sections.join('\n\n')+'\n');
const get=f=>rs.find(r=>r.file===f),find=(f,re)=>get(f)?.lines.find(l=>re.test(l.text))?.line||1,cite=(f,re)=>src(f,find(f,re));
const refs=a=>[...new Set(a.map(([f,l])=>src(f,l)))].join('; ');
const uses=name=>rs.filter(r=>r.jsx.some(j=>j.tag===name)).map(r=>src(r.file,r.jsx.find(j=>j.tag===name).line)).join('; ');
const tokens=new Map();
for(const r of rs)for(const c of r.classes)for(let v of c.value.replace(/["'\x60{}]/g,' ').split(/\s+/)){v=v.replace(/[,;]$/,'');if(!v||!/[a-z]/i.test(v))continue;if(!tokens.has(v))tokens.set(v,[]);tokens.get(v).push([r.file,c.line]);}
const tokenRows=re=>[...tokens].filter(([v])=>re.test(v)).sort(([a],[b])=>a.localeCompare(b)).map(([v,a])=>['\x60'+v+'\x60',refs(a)]);
const pages=rs.filter(r=>/\/page\.tsx$/.test(r.file));
const css=fs.readFileSync('app/globals.css','utf8'),theme=fs.readFileSync('node_modules/tailwindcss/theme.css','utf8');
const defs=[...theme.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m=>({name:m[1],value:m[2].trim()}));
const colors=new Map();
for(const r of rs)for(const l of r.lines)for(const m of l.text.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|oklch\([^)]*\)|0x[0-9a-fA-F]{6}\b/g)){if(!colors.has(m[0]))colors.set(m[0],[]);colors.get(m[0]).push([r.file,l.line]);}
const comps=rs.filter(r=>r.file.startsWith('components/')).flatMap(r=>r.funcs.filter(f=>f.exported&&/^[A-Z]/.test(f.name)&&/<[a-zA-Z]/.test(f.text)).map(f=>({r,f})));


const purpose={
'/':'Public landing hero, metrics, challenge box, city/acquisition sections.','/about':'Company narrative/acquisition.','/barbers':'Location/name discovery, cards, pagination, signed-out blur.','/shops':'Location/name search, shop cards/pagination/signed-out blur.','/barber/[barberId]':'Provider identity/services/reviews/portfolio/lightbox/availability/book CTA.','/shop/[shopId]':'Shop/team/services/photos/lightbox/location/book CTA.',
'/book/[barberId]':'Context/services/date-time/cash review and booking confirmation.','/book/shop/[shopId]':'Services/time/available barber/cash review and confirmation.','/signup':'Role choice/email-password/Google registration/verification.','/login':'Login/remember-me/Google/email verification/redirect.','/forgot-password':'Reset request/sent/error/loading.','/onboarding/client':'Names/phone/location/languages.','/onboarding/professional':'Professional details/profession/services/schedule/business branching.','/review/[bookingId]':'Booking-authorized rating/comment.',
'/challenge':'Campaign, dated participation/voting/search/leaderboards.','/terms/challenge':'Rules/fees/bank transfer/dates.','/contact':'Contact form/audience/subject/success/error/direct contact.','/cookies':'Cookie policy.','/privacy':'Privacy policy.','/terms':'Terms.','/cities':'City counts/live/coming-soon.','/how-it-works':'Three-step cash booking/FAQ.','/for-barbers':'Acquisition/benefits/setup/FAQ.','/for-shops':'Video/poster hero/comparison/chair demo/pricing/FAQ/WhatsApp.',
'/dashboard/client':'Redirect-only to bookings; renders null.','/dashboard/client/bookings':'Bookings/status/filter/cancel confirmation.','/dashboard/client/favorites':'Saved barber cards/removal/empty.','/dashboard/client/reviews':'Review history/empty.','/dashboard/client/settings':'Account/profile/location/languages/photo/deletion.','/dashboard/client/titiza':'First meeting/returning/phase-two decision/placeholder path exits.','/dashboard/client/messages':'ComingSoon placeholder; notify implemented.','/dashboard/client/my-look':'ComingSoon placeholder; not implemented Beauty Profile record.','/dashboard/client/gift-a-cut':'ComingSoon placeholder; notify implemented.','/dashboard/client/badges':'ComingSoon placeholder; notify implemented.',
'/dashboard/barber':'Overview/approval/suspension/completion/blocked-time modal/bookings/earnings.','/dashboard/barber/availability':'Weekly editing/blocked/buffer/autosave.','/dashboard/barber/bookings':'Time/status/name/actions/cancel/auto-expiry/pagination.','/dashboard/barber/services':'CRUD/active/presets/titeZMe Cut/delete dialog.','/dashboard/barber/settings':'Professional profile/location/languages/bio/specialty/vibe/account.','/dashboard/barber/portfolio':'Existing media removal; additions coming-soon.','/dashboard/barber/invites':'Accept/decline invitations/connection.','/dashboard/barber/create-shop':'Business creation/location/phone/address/description.','/dashboard/barber/billing':'Subscription coming-soon; no checkout.','/dashboard/barber/challenge':'Spain-gated submission/media/review/status.','/dashboard/barber/challenge/payment':'Bank transfer/reference/payment declaration.',
'/dashboard/shop':'Overview/team/bookings/invites/schedules/expanded barber.','/dashboard/shop/team':'Code search/invites/member/remove confirm.','/dashboard/shop/services':'CRUD/presets/active/edit/titeZMe Cut.','/dashboard/shop/settings':'Business/profile/location.','/dashboard/shop/photos':'Gallery/upload/removal.','/dashboard/shop/availability':'Opening hours/breaks/closures/holidays/save.','/dashboard/shop/bookings':'Time/barber/status/name/actions/CSV.','/dashboard/shop/reviews':'Ratings/list/empty.','/dashboard/shop/earnings':'Month totals/barber table/daily chart/tooltip.','/dashboard/shop/billing':'Subscription coming-soon.','/dashboard/shop/challenge':'Spain-gated submission/media/review/status.','/dashboard/shop/challenge/payment':'Bank-transfer instructions/payment declaration.',
'/admin/login':'Admin authentication/denied/error/loading.','/admin':'Statistics/activity.','/admin/users':'Counts/management links.','/admin/clients':'Search/pagination/expanded bookings/suspend/delete.','/admin/barbers':'Approval/live tabs/search/counts/pagination.','/admin/barbers/[id]':'Profile/reviews/bookings/moderation.','/admin/shops':'Status/search/counts/pagination.','/admin/shops/[id]':'Business/owner/team/bookings/moderation.','/admin/bookings':'Time/status/search/cancel/pagination.','/admin/reviews':'Rating/flagged filters/delete/pagination.','/admin/messages':'Contact inbox/handling.','/admin/team':'Creation/permissions/created credentials.','/admin/featured':'Search/add/remove featured professionals/businesses.','/admin/settings':'Global featured-section setting.','/admin/fake-data':'Fake UI toggle/save/error.','/admin/challenge':'Dates/fees/reference uploads/submission/payment/rejection moderation.',
'/preview/titiza-film':'English scripted film; simulated chat/recommendation/booking.','/preview/titiza-film-es':'Spanish scripted film; shared timing/structure.'
};
put('01-product-map.md','Product map',[
'## Architecture\n\n'+pages.length+' page modules; redirect-only/placeholders included; route groups omitted from URLs. Root Query/Auth/Language providers, presence tracker, conditional nav/RouteGuard, cookie/toast/telemetry: '+src('app/layout.tsx')+'. Admin own guard/sidebar; client/professional/shop independent shells. Implementation roles client/professional/admin and collections professionalProfiles/businesses differ from supplied guidance. Algolia professionals search, direct/real-time Firestore, React Query and Admin SDK coexist.',
'## Every route\n\nResponsive column is page-local; non-admin shell additionally inherits TopNav. Exact state declarations do not imply rendered screenshot coverage.',
table(['Route/source','Purpose / intended user','Primary components','Responsive','States/status'],pages.map(r=>{
const route='/'+r.file.replace(/^app\//,'').replace(/\/?page\.tsx$/,'').split('/').filter(x=>!/^\(.*\)$/.test(x)).join('/');
const user=route.startsWith('/admin')?'administrator':route.startsWith('/dashboard/shop')?'professional/business owner':route.startsWith('/dashboard/barber')?'professional':route.startsWith('/dashboard/client')?'client':route.startsWith('/book/')?'verified signed-in client':route.startsWith('/onboarding/')?'signed-in onboarding user':route.startsWith('/review/')?'booking client':'visitor, subject to guard';
const comps=[...new Set(r.jsx.filter(j=>/^[A-Z]/.test(j.tag)&&!['Image','Link','Suspense'].includes(j.tag)).map(j=>j.tag))];
const responsive=r.lines.filter(l=>/@media|(?:sm|md|lg|xl|2xl):/.test(l.text));
const state=r.lines.filter(l=>/const \[.*useState|ComingSoon|subscriptionComingSoon|if \(loading|router.replace/.test(l.text));
return [route+' — '+src(r.file),(purpose[route]||'Not established / not found.')+' User:'+user,comps.join(', ')||'Inline/native body; inherited shell.',responsive.length?responsive.slice(0,6).map(l=>src(r.file,l.line)+' '+l.text.trim()).join('; '):'No local breakpoint found; shell/container may respond.',(r.lines.some(l=>/ComingSoon|subscriptionComingSoon/.test(l.text))?'PLACEHOLDER. ':'')+(state.map(l=>src(r.file,l.line)+' '+l.text.trim()).slice(0,12).join('; ')||'Static; additional variants not established.')];
})),
'## Access\n\n'+src('components/RouteGuard.tsx')+' exact public list/prefixes; protected anonymous redirect to login, email verification/onboarding/profile gates. /challenge and /terms/challenge absent from public list despite anonymous campaign branches. Unknown routes can redirect before custom404. '+src('components/AdminGuard.tsx')+' checks role/isAdmin/permissions. No legitimate authenticated test account established.',
'## Secondary interfaces',
table(['Interface','Implementation'],[
['Navigation','TopNav full-screen mobile drawer/language dropdown/scroll lock; dashboard bottom bars/More; admin sidebar. '+src('components/TopNav.tsx')],
['Cookies','Consent card/customize sheet/modal/switches. '+src('components/CookieBanner.tsx')],
['Notifications','Badge/unread dropdown/empty; opening resets Firestore unreadCount. '+src('components/NotificationBell.tsx')],
['Confirmation','ConfirmDialog plus separate delete/reauth/team/admin cancel/reject/delete overlays. '+src('components/ConfirmDialog.tsx')+'; '+src('components/DeleteAccountButton.tsx')],
['Calendar/booking','Weekly drag/autosave; opening-hours/closure forms; time/date/context/service/cash summary; overview blocked-time modal.'],
['Media','Provider/shop lightboxes; gallery/portfolio/removal; challenge reference/upload preview.'],
['Loading','RouteGuard/AdminGuard spinners/skeletons/local query/pulse placeholders. No app/loading.tsx found.'],
['Errors','app/not-found.tsx, ErrorBoundary retry, forms/toasts. No app/error.tsx or global-error.tsx.'],
['Empty','EmptyStates plus separate inline discovery/favorites/reviews/bookings/team/admin bodies.'],
['Titiza','More expansion/selection/dimming/locked thinking; analysis/direct panels; phase-one expandable timeline.'],
['Challenge','Spain gate/rejection/upload/phase/status/payment/moderation expansions.']
]),
'Full secondary-state/data source: [states](evidence/states-and-overlays.md), [data/routing](evidence/data-and-routing.md).',
'## Missing/incomplete\n\n- Standalone service details: **Not implemented.** Embedded rows/tiles exist.\n- Online service checkout: **Not implemented.** cash payloads; separate challenge bank-transfer UI exists.\n- Persisted/editable Beauty Profile/analysis destination: **Not implemented.** Informational/inert/no-op.\n- Live Titiza chat/backend/real recommendation result: **Not implemented.** Scripted film exists.\n- Messages/My Look/gifts/badges/billing: placeholders.\n- Portfolio additions: coming-soon; existing removal retained.\n- Mentioned API cleanup: **Not established / not found.**',
'## Non-page endpoints',
table(['Source','Role'],e.allFiles.filter(f=>/app\/api\/.*route\.ts$|app\/(robots|sitemap)\.ts$|middleware\.ts$|functions\/src\/index\.ts$/.test(f)).map(f=>[src(f),f.includes('delete-account')?'Account-deletion API':f.includes('upload-reference')?'Admin reference upload API':f==='middleware.ts'?'Page rate limiting':f.includes('functions/')?'Firestore/Algolia supporting triggers':'Metadata endpoint'])),
'Complete repository inventory: [files](evidence/repository-files.md).'
]);

put('02-design-tokens.md','Design tokens / spacing / geometry / layout',[
'## Styling implementation\n\nTailwind4.0.9 @import, global @theme brand/Titiza tokens, :root gold, defaults/arbitrary utility values, inline styles and embedded CSS coexist. No app-owned semantic spacing/radius scale beyond framework defaults found.',
'## Explicit global colors',
table(['Token','Exact value','Definition/global scope','Uses'],[...css.matchAll(/(--(?:color-[\w-]+|gold(?:-soft|-muted)?)):\s*([^;]+);/g)].map(m=>{const l=css.slice(0,m.index).split('\n').length,n=m[1],short=n.replace('--color-','');const a=rs.flatMap(r=>r.lines.filter(x=>x.text.includes('var('+n+')')||new RegExp('\\b(?:bg|text|border|ring|from|via|to)-'+short+'(?:\\b|/)').test(x.text)).map(x=>[r.file,x.line]));return[n,m[2],src('app/globals.css',l)+(n.startsWith('--gold')?' :root':' @theme'),refs(a)||'Not established / not found.'];})),
'## Color roles observed',
table(['Role','Existing values and contexts'],[
['Background','#0A0A0A brand, #050505 landing, black film, OKLCH Titiza radial base. '+src('app/LandingPageClient.tsx')+'; '+src('components/titiza/ambient-background.tsx')],
['Surfaces','#111/#111111/#181818/#141414/#1a1a1a/#1A1A1B; translucent OKLCH card/glass. '+src('components/skeletons.tsx')],
['Primary text','#FFFFFF/#fff/white versus #F0EDE8 body/nav/toast; OKLCH foreground. '+src('app/layout.tsx')],
['Secondary text','#888888/#888/#888580/#666/#555/#444444/#444 plus framework gray. '+src('components/ConfirmDialog.tsx')],
['Borders','#1E1E1E/#2A2A2A/#333; alpha variants and OKLCH12%.'],
['Accent','#F5C518 versus #FFD600; #E8491D; OKLCH gold; Three #e8c47a/#f7e6b4.'],
['Success','#22C55E/#0f2010 badge; separate WhatsApp #25D366.'],
['Warning','Yellow/orange pending maps differ by role; #1a1500/#1a0800 surfaces.'],
['Error','#EF4444/#1a0808/toast/framework red.'],
['Information','#60a5fa confirmed shop-booking/#0a1628; framework blue utilities.'],
['Gradients','Titiza glass/shimmer/aurora/grid/vignette, initials, for-shops hero; exact full declarations in ledger.'],
['Glow','OKLCH/rgba shadows, bloom blur90/60/120/130px, additive Three particles.'],
['Transparency','/alpha utilities,rgba,OKLCH slash alpha,separate opacity all coexist.']
]),
'## Every authored color literal\n\nPreserves exact spelling/case/shorthand; equivalent values not asserted visually distinct. Source contexts/comments/uses in [colors ledger](evidence/colors.md); a literal occurrence alone does not establish an active global token.',
table(['Exact literal','All source occurrences'],[...colors].sort(([a],[b])=>a.localeCompare(b)).map(([v,a])=>['\x60'+v+'\x60',refs(a)])),
'## Used default color utilities\n\nDefinitions from installed Tailwind theme; suffix alpha preserved.',
table(['Authored utility','Underlying definition','Uses'],[...tokens].filter(([v])=>/(?:^|:)(?:bg|text|border(?:-[tblrxy])?|ring|from|via|to|fill|stroke)-(?:black|white|transparent|current|gray-\d+|yellow-\d+|green-\d+|red-\d+|blue-\d+|orange-\d+|amber-\d+|emerald-\d+|purple-\d+|indigo-\d+|slate-\d+|zinc-\d+)(?:\/[\w.[\]%-]+)?$/.test(v)).map(([v,a])=>{const n=v.split(':').pop().replace(/^(?:bg|text|border(?:-[tblrxy])?|ring|from|via|to|fill|stroke)-/,'').split('/')[0],d=defs.find(d=>d.name==='--color-'+n);return[v,d?d.name+'='+d.value:n==='transparent'?'transparent':n==='current'?'currentColor':'Not established / not found.',refs(a)];})),
'## Spacing/geometry/layout\n\n--spacing:0.25rem; p6=1.5rem,p8=2rem,p5=1.25rem. Inline28px/arbitrary48px bypass scale. Landing1200px/profile1000px/placeholders800px/Titiza3xl; for-shops gutters48→20px. A consistent semantic application spacing scale: **Not established / not found.**\n\nPills full/99px; cards xl12px/2xl16px/3xl24px/inline20px. Border1/2px/dashed/booking-left4px. Shadows/blur/opacity/stacking not centralized. Flex/column-row/grid/inline repeat-minmax/scroll shells coexist.',
table(['Framework geometry token','Exact installed definition'],defs.filter(d=>/--spacing$|--radius-|--blur-|--shadow-|--container-/.test(d.name)).map(d=>[d.name,d.value])),
'## Spacing/dimensions',table(['Utility','Occurrences'],tokenRows(/(?:^|:)-?(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy]|w|h|size|min-w|max-w|min-h|max-h|inset(?:-[xy])?|top|bottom|left|right)-/)),
'## Radius/borders/shadows/blur/opacity/z-index',table(['Utility','Occurrences'],tokenRows(/(?:^|:)(?:rounded(?:-[\w]+)?|border(?:-[\w]+)?|shadow|blur|backdrop-blur|opacity|z|ring(?:-[\w]+)?)(?:-|$)/)),
'## Layout/alignment',table(['Utility','Occurrences'],tokenRows(/(?:^|:)(?:flex|grid|grid-cols|grid-rows|col-span|row-span|items|justify|content|self|place-items|order|overflow|object|aspect)(?:-|$)/)),
'Inline/context declarations: [spacing-geometry-layout](evidence/spacing-geometry-layout.md). Full authored CSS: [embedded-css](evidence/embedded-css.md).'
]);
put('03-typography.md','Typography',[
'## Fonts loaded versus used',
table(['Family/source','Weights/styles','Loading/application'],[
['Nunito/next-font-google','Weight option omitted: variable Google defaults; no italic requested; inline800/900.','--font-nunito variable on html; no --font-sans binding. Body font-sans computes system stack in screenshots. Inline Wordmark/dialog/toast/marketing/admin request Nunito. '+src('app/layout.tsx')+'; '+src('components/Wordmark.tsx')],
['Cormorant Garamond/next-font-google','Explicit300/400/500/600; no italic requested.','Only protected Titiza route loads --font-titiza-serif. '+src('app/dashboard/client/titiza/page.tsx')],
['System sans','ui-sans-serif/system-ui/sans-serif + Apple Color Emoji/Segoe UI Emoji/Segoe UI Symbol/Noto Color Emoji.','Tailwind default/runtime body; exact selected OS face: Not established / not found.'],
['Serif fallback','ui-serif/Georgia/Times New Roman/serif.','Global --font-serif; public film lacks route-scoped Cormorant variable.'],
['Mono fallback','ui-monospace/SFMono-Regular/Menlo/Monaco/Consolas/Liberation Mono/Courier New/monospace.','font-mono labels/timeline/numbers; no downloaded mono face.'],
['Emoji','OS emoji fallbacks.','Icons/flags; platform-dependent.']
]),
'## Roles; no explicit unified typography system',
table(['Role','Existing styling'],[
['Landing h1','6xl→md88px/black/leading.95/tracking-tight. '+cite('app/LandingPageClient.tsx',/text-6xl md:text/)],
['Discovery','4xl→md5xl black. '+cite('app/shops/page.tsx',/text-4xl md:text-5xl/)],
['Auth','Login32px/signup28px black. '+cite('app/login/page.tsx',/text-\[32px\]/)+'; '+cite('app/signup/page.tsx',/text-\[28px\]/)],
['Dashboard/admin','2xlblack,billingbold;admin28px/900.'],
['Titiza','Seriflight:title6xl→sm7xl→md8xl,greeting3xl→sm4xl. '+src('components/titiza/titiza-hero.tsx')],
['Body','sm/base/lg/inline13px; marketplacebold/Titizalight, leading-relaxed/1.6.'],
['Labels','10/11/12pxuppercase,bold/extrabold/medium,tracking-widest/.2/.3/.35em.'],
['Buttons','Marketplaceblack/extrabold13/15px,Titizasmmediumuppercase/.2–.25em. No common Button API.'],
['Navigation','TopNav14pxbold,sidebar13pxbold,mobile10px.'],
['Statistics','Landing32pxblack,decorative180px,local chart ticks.'],
['Inputs','Global16px!important overrides smaller input declarations. '+cite('app/globals.css',/font-size: 16px/)],
['Transform/style','Local italic ComingSoon/uppercase/truncate/line-clamp; no common semantic definitions.']
]),
'## Default exact typography values',table(['Token','Installed definition'],defs.filter(d=>/--text-(?:xs|sm|base|lg|xl|[2-9]xl)(?:--line-height)?$|--font-weight-|--tracking-|--leading-/.test(d.name)).map(d=>[d.name,d.value])),
'## Authored typography utilities',table(['Utility','Occurrences'],tokenRows(/(?:^|:)(?:text-(?:xs|sm|base|lg|xl|[2-9]xl|\[(?:\d|clamp))|font-(?:sans|serif|mono|thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[)|leading-|tracking-|uppercase$|lowercase$|capitalize$|normal-case$|italic$|not-italic$)/)),
'All inline type/heading/label/button/statistics context: [typography ledger](evidence/typography.md). Font downloads are build assets, not checked-in approved brand assets.'
]);

put('04-responsive-system.md','Responsive system',[
'## Exact breakpoints',
table(['Definition','Value','Actual technical change'],[
['Tailwind sm','40rem;640px at16px root','Titiza tiles2→3cols/JS keyboard stride; feature/learning cards3cols, padding/headings scale; film width grows.'],
['Tailwind md','48rem;768px at16px root','Desktop nav/mobile controls replacement; dashboard sidebar row shell/bottombar hidden; cookie card/overlay composition; search/profile grid/type/padding.'],
['Tailwind lg','64rem;1024px at16px root','Landing hero column→row; multi-column grids/heading sizes.'],
['Tailwind xl','80rem;1280px at16px root','Framework definition; actual uses listed below, not assumed.'],
['Tailwind2xl','96rem;1536px at16px root','Framework definition; actual uses listed below, not assumed.'],
['.show-mobile-only','min-width768px','display:none!important.'],
['.hidden-mobile','max-width767px','display:none!important.'],
['for-shops CSS','max-width768px inclusive','Gutters48→20,hero160px48px100px→140px20px80px; hide video/showposter; comparison/how grids1col,statsgap80→40,WhatsApp28→20px; chair/pricing sections change.'],
['Admin users CSS','min-width768px','Local desktop grid rule.'],
['useIsMobile','constant768,max-width767,innerWidth<768','Initial undefined/false; effect only change listener, no initial apply. Consumers not proved by hook existence.'],
['CategoryGrid JS','min-width640px','Initial apply/listener, keyboardstride3/2.']
]),
'Installed Tailwind rem defaults, no custom override found. Exactly768px overlaps for-shops mobile CSS/Tailwindmd. [Embedded rules](evidence/embedded-css.md).',
'## Recomposition/stacking/scaling/replacement',
table(['Area','Actual behavior/source'],[
['TopNav','Desktop centered links/lang hidden belowmd; mobile full-screen drawer/hamburger/native auth. '+src('components/TopNav.tsx')],
['Client shell','Stack/row; horizontallyscrollable links belowmd,vertical220px sidebar atmd; mobile60px bottomnav, desktop deletion hidden mobile. '+src('app/dashboard/client/layout.tsx')],
['Professional/shop','Separate bottomnav/More versus sidebar; content max-height/scroll/padding. '+src('app/dashboard/barber/layout.tsx')+'; '+src('app/dashboard/shop/layout.tsx')],
['Cookie','Full-width bottom card/sheet versus floating bottom-left card/centered modal atmd. '+src('components/CookieBanner.tsx')],
['Landing','Stack→row lg;grid expansions;60→88px heading atmd; linebreak hiding. '+src('app/LandingPageClient.tsx')],
['Discovery/profiles','Same content with column/padding/type changes; sign-out blur is auth-conditioned, not viewport.'],
['for-shops','Video replaced by CSSposter<=768px. '+src('app/for-shops/page.tsx')],
['Titiza','Grid2→3 with JSnavigation; square maxwidth core, perspective resize andDPRcap2.'],
['Films','Same scene structure fixed viewport;70vmin≤460px orb,anchor-26vh/.72scale;px6/pb12vh,sm sizes. '+src('components/titiza-film/film-sequencer.tsx')],
['Calendars','Numeric dimensions/overflow/layout classes; no separate invented mobilecalendar. '+src('components/AvailabilityGrid.tsx')+'; '+src('components/SmartTimePicker.tsx')+'; '+src('components/ShopTimePicker.tsx')]
]),
'## Every responsive utility',table(['Variant','Occurrences'],tokenRows(/^(?:sm|md|lg|xl|2xl|max-\w+|min-\w+):/)),
'Media/clamp/JS width checks: [responsive ledger](evidence/responsive.md). Captures verify390×844/1440×1000 only, not intermediate widths.'
]);
const desc={
AvailabilityGrid:'mode barber/shop/client,weeklydrag/buffer/blocked/autosave/loading/saving.',BarberInvitesTab:'Invitesaccept/decline/connection.',BarberPortfolioTab:'Existingmedia removal,coming-soon additions.',BarberSettingsTab:'Profile/location/language/bio/specialty/vibe.',
ChallengeHomepageBox:'Config/phase/countdown/CTA.',ChallengeLocationGate:'Spaineligibility/child body.',ChallengePaymentTab:'barber/shop role,fee/reference/IBAN/declaration/status.',ChallengeSubmissionTab:'barber/shop role,upload/validation/phase/rejection/edit/status.',
ComingSoon:'Emoji/title/body/optionalnotify/sending/done.',ConfirmDialog:'Open/closed/title/message/labels/configurablecolor.',CookieBanner:'Consentcard/Customize/switches/localpersist.',CountdownTimer:'Target/date/segments.',
DeleteAccountButton:'client/professional,confirm/reauth/Google/password/deleting/error.',EmptySearch:'Optionalcity/noresults.',EmptyClientBookings:'Nobookings/discoverylink.',EmptyBarberBookings:'Noappointments.',EmptyFavourites:'Nofavorites.',
Footer:'Legal/acquisition/cookies.',NotificationBell:'Badge/unread/empty;open writes count.',OfflineBanner:'Online/offline.',PasswordInput:'Controlledvalue/style/class/show-hide/required/autocomplete.',
ShopAvailabilityTab:'Hours/breaks/copy/holiday/closures/save.',ShopPhotosTab:'Gallery/upload/remove.',ShopServicesTab:'CRUD/edit/active/presets/titeZMeCut.',ShopSettingsTab:'Business/location/profile.',ShopTeamTab:'Code/throttle/invites/team/remove.',
ShopTimePicker:'Date/week/time/shopunion/availablebarbers.',SmartTimePicker:'Date/week/time/durationfit.',
BarberCardSkeleton:'Card/photo/textloader.',BookingRowSkeleton:'Bookingloader.',StatCardSkeleton:'Statsloader.',BarberProfileSkeleton:'Responsiveprofile/servicesloader.',
SuspendedBookingBanner:'Suspended/challengerestriction.',VerifyEmailGate:'Verify/resend/cooldown/detect/destination.',Wordmark:'SVGtext;heightdefault28.',
AmbientBackground:'Fixedaurora/grid/vignette.',BeautyProfileCard:'InertprimaryCTA+expandtimeline.',CategoryGrid:'Five+More/expand/selected/dim/lock/keyboard.',CategoryIcon:'CategorySVG.',
FeatureCards:'Threehoverglowcards.',OrbitLabels:'Fivetimedlabels/reducedsuppression.',PathAnalysis:'ack/invite/card/exit/no-op.',PathDirect:'Explore/Notifybothno-op.',
TitizaCore:'Dynamicfallback/genesis/heldstate/ring/bloom.',TitizaCoreScene:'Threeorb/shell/particle/ring/idle/bright/thinking.',TitizaDecisionFlow:'Anchor/greeting/choice/thinking/paths.',TitizaHero:'genesis/dashboard/first/returning/Begin.',
AnalysisCardsOrbit:'Filmchips/converge.',BeforeAfterSwap:'Single/swapneutralframes.',ChatInputShell:'Scriptedquery/send/reply.',ConversationStrip:'Filmcontinuity.',FilmSequencer:'Locale/sharedtimeline/orbreactions.',IntroTitle:'intro/timeskip/endfades.',LaunchDateCard:'Cascade/hold/fade.',OrbDialogue:'Timedlines.',ProfessionalCard:'Simulatedpressed/confirmed.',TypingLines:'Checklist/reveal.',VerticalMontage:'Timedwords.',TopNav:'Auth/role/active/language/drawer/marquee.'
};
let inventory=['## Counting convention\n\n'+rs.filter(r=>r.file.startsWith('components/')&&r.file.endsWith('.tsx')).length+' TSX files; '+comps.length+' exported JSX function components including guards/wrappers, plus ErrorBoundary class. PresenceTracker has no visual body. Not all are reused in multiple routes. No common general Button/Card/Input/Badge API found.',
'## Summary',table(['Component/source','Variants/states','JSX consumers'],comps.map(({r,f})=>[f.name+' — '+src(r.file,f.line),desc[f.name]||'Guard/wrapper; exact props/state below.',uses(f.name)||'No direct JSX consumer found; dynamic/export use requires separate check.']))];
for(const {r,f}of comps){
const within=x=>x.line>=f.line&&x.line<f.line+f.text.split(/\r?\n/).length;
const state=r.lines.filter(within).filter(l=>/useState|interface .*Props|type .*Props|disabled=|aria-pressed|aria-expanded|mode =|height =/.test(l.text));
const responsive=r.lines.filter(within).filter(l=>/@media|matchMedia|(?:sm|md|lg|xl|2xl):/.test(l.text));
const size=[...new Set(r.classes.filter(within).flatMap(c=>c.value.replace(/["'\x60{}]/g,' ').split(/\s+/)).filter(v=>/(?:^|:)(?:w|h|size|max-w|min-w|max-h|min-h|p[xytrblse]?|gap|rounded|text)-/.test(v)))];
inventory.push('### '+f.name+'\n\n'+src(r.file,f.line)+'\n\nSizes/geometry/type: '+(size.map(v=>'\x60'+v+'\x60').join(', ')||'Inline/dynamic dimensions; below.')+table(['Dimension/property','Exact value/source'],r.styles.filter(within).filter(x=>/width|height|Width|Height|borderRadius|padding|fontSize|gap/.test(x.name)).map(x=>[x.name,x.value+' — '+src(r.file,x.line)]))+'\nVariants/state evidence:\n\n'+(state.map(l=>'- '+src(r.file,l.line)+' — '+l.text.trim()).join('\n')||'Not established / not found.')+'\n\nResponsive: '+(responsive.map(l=>src(r.file,l.line)+' '+l.text.trim()).join('; ')||'No explicit breakpoint; inherited/container behavior only.'));
}
inventory.push('## Parallel implementations (preserved)\n\n- Buttons: landing/auth/booking/admin pages,ConfirmDialog,cookie,Titiza,film.\n- Servicecards/forms: barber services page vsShopServicesTab,profiles vsbookingtiles.\n- Providercards:landing/discovery/favorites/shopteam/film.\n- Booking/statuscards:client/professional/shop/admin/overview.\n- Pagination:discoveryfunctions/localdashboard/admin.\n- Calendars:AvailabilityGrid/ShopAvailabilityTab/SmartTimePicker/ShopTimePicker.\n- Empty/loaders:namedexports+inline branches.\n- Confirmation:sharedDialog+delete/reauth/team/admin.\n\nNo consolidation performed.',
'## Local named JSX functions (not shared count)',table(['Local component','Source/scope'],rs.flatMap(r=>r.funcs.filter(f=>!f.exported&&/^[A-Z]/.test(f.name)&&/<[a-zA-Z]/.test(f.text)).map(f=>[f.name,src(r.file,f.line)]))),
'ErrorBoundary class/sectionfallback/retry: '+src('components/ErrorBoundary.tsx')+'. Full props/imports/JSX/styles: [source inventory](evidence/source-inventory.json); [state evidence](evidence/states-and-overlays.md).');
put('05-component-inventory.md','Component inventory',inventory);

put('06-imagery-iconography.md','Imagery and iconography',[
'## Imagery / origins',
table(['Category','Existing implementation'],[
['Local graphics','Six visual files:campaignPNG/favicon/Apple/manifestPNGs/ICO. Asset inventory includes dimensions/hashes.'],
['Logos','Wordmark inlineSVGtext;public/wordmark.png absent. Other textual variants in404/footer/admin. '+src('components/Wordmark.tsx')],
['Provider/profile','Firestore/Storage/Google photoUrl/profilePhotoUrl/photos; NextImage fixed/fill and contain/cover vary. '+src('app/barber/[barberId]/BarberProfileClient.tsx')+'; '+src('app/shop/[shopId]/page.tsx')],
['Fake provider','Frozen fixtures use randomuser.me portraits/remote shop imagery; config defaults on unlessfalse. '+src('lib/fakeUIData.ts')+'; '+src('hooks/useShowFakeUIData.ts')],
['Marketing','for-shops remote Storagevideo/mobileCSSposter; challengereferenceconfiguration/media.'],
['Service','Name/price/durationrows; separate servicephotography: Not established / not found.'],
['Illustrations/placeholders','Emoji/initialavatars/skeletons/neutralfilmframes. BeforeAfterSwap has no realphoto.'],
['Generated','Programmaticfixtures; AIbitmap provenance: Not established / not found.'],
['Background/texture','CSSgradient/grid/vignette/glass;64pxgrid/.04opacity; no texturefile.'],
['Decoration','ProceduralThreeorb/SVGpaths/rings/points; no proprietarymodel.'],
['Video','Remote userportfolio/challenge/marketing; no localvideo.']
]),
'## Iconography\n\nNo lucide-react/react-icons dependency found; comments mention conversion from lucide but current icons are inlineSVG. Outlined/filled SVG, emoji and textlogo coexist; no shared size/stroke token.',
table(['Treatment','Values / source'],[
['Eye','18×18/viewBox24,fillnone/currentColorstroke2/roundcaps. '+src('components/PasswordInput.tsx')],
['Titiza SVG','Base24×24/defaultstroke2;callsites1.5/size4,5,6,7. '+src('components/titiza/beauty-profile-card.tsx')+'; '+src('components/titiza/feature-cards.tsx')],
['Categories','h8/w8=32px;More filledcircles r1.4. '+src('components/titiza/category-icons.tsx')+'; '+src('components/titiza/category-grid.tsx')],
['Nav','Languagechevron8×6/stroke2.5;hamburger20×20/stroke2. '+src('components/TopNav.tsx')],
['Google','18×18multicolorfilledSVGpaths. '+src('app/signup/page.tsx')],
['Wordmark','viewBox200×40;text32/weight800;defaultheight28/call24;tite/Me#F5C518,Z#E8491D. '+src('components/Wordmark.tsx')],
['Emoji','Bell15px;emptysearch/calendar/scissors/heart5xl;roles/flags/status/location/cash;OSvariation.']
]),
'Every SVG/emoji/icon/image/URL context: [imagery-icons](evidence/imagery-icons.md). No assets asserted approved brandstyle. [Full asset/remote inventory](11-asset-inventory.md).'
]);
put('07-titiza.md','Titiza',[
'## Production interface\n\nProtected /dashboard/client/titiza phases loading/genesis/dashboard/phase2. First meeting appUser.titiza.hasMet; markTitizaMet/touchTitizaVisit write usermarkers. Route-scopedCormorant300/400/500/600. '+src('app/dashboard/client/titiza/page.tsx')+'; '+src('lib/titiza-utils.ts')+'.',
'Comments say defaultOFF; actual TEMP_ENABLE_GLOBALLY:boolean=true bypasses UID/env gating ('+cite('lib/titiza-phase2-flag.ts',/TEMP_ENABLE_GLOBALLY: boolean/)+'). Return/Begin enterphase2. Phase-one dashboard/BeautyProfileCard/FeatureCards remain alternate branches but are bypassed afterBegin under checked-in flag.',
'## Orb implementation / exact values',
table(['Layer','Implementation'],[
['Wrapper/fallback','Dynamicssr:false scene;fallbacksize40gold/20blur2xl/breathe;aspect-squaremax720px.'],
['Bloom','70%gold/25blur90px;40%gold-soft/30blur60pxdelay1.5s;reflectionbottom6%,h40px,w55%,gold/15blur-xl.'],
['Renderer','RawThreeantialias/alpha/high-performance,transparentclear,DPR≤2,perspective42°,near.1/far100,cameraZ6;resize.'],
['Palette/lights','GOLD#e8c47a,GOLD_BRIGHT#f7e6b4,rim#8a6a2a;whiteambient.7,key2.5,rim1.2,directional1.4.'],
['Core','Icosahedron(1,4),metalness.92,roughness.22,emissive.65;scale.55+sin(t*.7)*.028;innerglowadditive.'],
['Shells','radius1.3/intensity1.7/displace.09/opacity.9;radius1.55/intensity.9/displace.05/speed-.4/opacity.5;customFresnel/additiveshader.'],
['Glint/wire','Circle.32/32segments,pos(-.55,.7,1.15),opacity.3;wireicosahedronscale1.85/opacity.06.'],
['Rings','Aradius1.95/tube.012/opacity.4/speed.16/tilt[π/2.3,.4,0];Bradius2.45/tube.008/opacity.22/speed-.1/tilt[π/3.2,-.5,.3].'],
['Stream','900points,radii.6–3.6,speed.12+random*.22,size.026,opacity.7,inflow/outerrespawn/additive.'],
['Dust','10points,radius2–2.7,size.03,opacity.55,speed.025(.01reduced).'],
['Birth','140points,size.05,target1.2–1.9;0–.8seed,.8–1.8spawn,1.8–2.8converge,2.8–4.5resolve/spring/ring;reduced1.5s.'],
['Reactions','8sheartbeat;1.2striggerring scale1+p*2.4,opacity(1-p)*.5;glow.13(.06reduced),damp6/release.5;pulsedamp9;thinking sin(t*4)scale.03/emissive.25.'],
['Pointer','Globalpointermove;rotationX-.25/Y.35damp1.6;positionX.22/Y.16damp1.4. Orb notclickable.'],
['Labels','Fivepercent-positioned labels;initial1800ms/show2600/pause1400/transition1000ease-out;skippedreducedmotion.']
]),
'Sources: '+src('components/titiza/titiza-core.tsx')+'; '+src('components/titiza/titiza-core-scene.tsx')+'; '+src('components/titiza/orbit-labels.tsx')+'. Exact shader/equations retained in source inventory.',
'## Ambient CSS / glass\n\n'+src('components/titiza/ambient-background.tsx')+':radial120%90%at50%-10%,OKLCH(.24 .03 75)→(.16 .008 60)→(.12 .006 55);blobs42/38/34vw blur120/130/120px alpha8/8/6%,22/26/30sdelay0/4/8;grid64pxopacity.04;vignettetransparent55%→OKLCH(.1 .006 55/.7).\n\n'+src('app/globals.css')+':glass160°OKLCH(.28 .012 70/45%)→(.19 .01 65/35%),backdropblur20px/saturate120%,border12%;hoverlift-6px,border28%,shadow0 30px80px-40pxgold/35%,500mscubic(.16,1,.3,1). Exact syntax in token/CSSledger.',
'## Interaction\n\nBirthcompletion+1000msHi/+2700ImTitiza/+3500Begin(normal≈5.5/7.2/8s). Phase2anchor18vh→0 in700mscubic(.65,0,.35,1);question1200/seed1500/tiles1800. Fivecategories+More,expand/select/dimothers30%/lockthinking;arrows/Home/End. Branchcategory.titizaEntryMode.\n\nThinking1000msfirst/600later/0reduced,brighten/pulse. PathAnalysisinvites2200/2800/card4200;Start exits/logsno-op1200ms(0reduced). PathDirectExplore/Notifylogno-op. BeautyProfileCardprimarynohandler,expandworks. ActualpersistedBeautyProfile/livechat/realresults:**Not implemented.**',
'## Public film interfaces\n\nEnglish/Spanish share FilmSequencer timeline,content.ts copy. rAF/performance clock scenes/orbreactions:greeting/chat/profilecheck/analyst/timeskip/chips/photo-checklist/before-after/barber-booking/montage/end/launch. ChatInputShell scripted query/send/reply,notliveconversation. ProfessionalCard timedpressed/confirmed,tabIndex-1/nonavigation. BeforeAfterSwapneutralframes,norealphoto.\n\nFixedinset0/z100/black;orb70vmincapped460px,anchor-26vh/scale.72/900mscubic(.4,0,.2,1);px6/pb12vh. Film font-serif lacks route-scopedCormorant and usesfallback. Captures are explicitly simulations.',
'## All related files\n\n'+e.allFiles.filter(f=>/titiza|professions/.test(f)).map(f=>'- '+src(f)).join('\n'),
'No checked-in Titiza image/model/video asset. Protected visual screenshots access-limited; [screenshot index](12-screenshot-index.md).'
]);
put('08-motion.md','Motion',[
'## Implementations\n\nCSS/Tailwind,Three.js rAF,separatefilmperformance/rAF clock;for-shopsIntersectionObserver scroll reveal;Recharts charts. NoFramerMotion/GSAP orroute-transitionorchestratorfound.',
table(['Motion','Duration/easing/delay','Trigger/source'],[
['fadeUp','400mseaseboth,16px→0','Mount/global.'],['fadeIn','400mseaseboth,opacity0→1','Mount/overlay.'],
['Pulsecollision','.6sease token versus for-shops scale1→1.03/3sease-in-outinfinite','Loading/CTA,samekeyframename.'],
['Marquee','20slinearinfinite,X0→-50%','TopNav.'],['Spinner','800mslinearinfinite','RouteGuard/AdminGuard.'],
['Language','300msall ease,chevron350mscubic(.34,1.2,.64,1)/stroke300ms/langDropIn','Toggle.'],
['Button','Default150mscubic(.4,0,.2,1)unlesslocaloverride','Hover/color/opacity/transform.'],
['Cookie','fadeUp/fadeIn400ms','Consent/customize.'],
['Float','7sease-in-outinfinite,0→-14px','Titizawrapper.'],
['Breathe','6sease-in-out,opacity.55→.9/scale1→1.06','Bloom,seconddelay1.5s.'],
['Drift','22/26/30sease-in-out,delays0/4/8s','Aurora.'],['Shimmer','8slinear,-200→200%','Title.'],
['Titizafade-up','1scubic(.16,1,.3,1),24px;delay.45/.55+i*.12/tiles i*60ms','Cards.'],
['Titizafade-in','600msease-out;Begin500override','Greeting/crossfade.'],
['Glass','500mscubic(.16,1,.3,1)transform,border/shadowease','Hoverlift6px.'],
['Timeline','500mscubic(.16,1,.3,1)','grid0fr→1fr/opacity/margin.'],
['Category','500ms','Selectopacity30/100/border/shadow.'],
['Anchor','700mscubic(.65,0,.35,1),nonereduced','Decisionframe.'],
['Orb','4.5/1.5sbirth,8sheartbeat,1.2ring,damp6/.5/9','Continuousscene.'],
['Labels','1sease-out,1.8initial/2.6visible/1.4pause','Timers.'],
['Filmanchor','900mscubic(.4,0,.2,1),300msintoconversationscene','Elapsed.'],
['Filmcard/button','300mscubic(.4,0,.2,1),buttondelay120,transition200','Mount/pressed.'],
['Before-after','1200defaultcrossfade,initialfade600','Elapsed.'],
['Launch','500linesat1000/2500/3000,finalfade1800','Finalscene.'],
['For-shops','FAQheight/opacity300msease,pulse3s,localreveals','Observer/FAQ.']
]),
'Full motion/hover/timer/easing/source occurrence: [motion ledger](evidence/motion.md); [full CSS](evidence/embedded-css.md); [framework defaults](evidence/framework-theme.css). No timings normalized.',
'## Film exact timeline declarations (milliseconds)',table(['Source','Scene/timing/event'],get('components/titiza-film/film-sequencer.tsx').lines.filter(l=>/^\s*(id:|title:|duration:|fadeIn:|fadeOut:|hold:|stagger:|revealDuration:|pressAt:|confirmAt:|swapAt:|startStagger:|appearDuration:|pause:|travelDuration:|chipsAt:|chipStagger:|typeStartAt:|typeDuration:|sendAt:|replyStartAt:|replyHolds:|visibleDuration:|overlap:|line\dAt:|lineFade:|finalFadeOut:)|\{ at:/.test(l.text)).map(l=>[src('components/titiza-film/film-sequencer.tsx',l.line),l.text.trim()])),
'## Reducedmotion\n\nGlobalrule disablesTitizafloat/breathe/drift/fade-up/shimmer,notfade-in. OrbitLabels suppressescycling;DecisionFlow/PathAnalysisshortendelays. Three suppressespulse/thinking/slowsdust,butotherrotation/breathing/pointerequationscontinue. Greetings still+1/2.7/3.5saftershortbirth. Filmhasnoreducedmotionbranch/pause. Marquee/spinner/for-shopsglobalsuppression:**Not established / not found.**'
]);

put('09-accessibility.md','Accessibility implementation',[
'## Existing implementation',
table(['Area','Evidence'],[
['Semantics','Native buttons/links/forms/input/select/headings/main/footer coexist with div wrappers. html lang=en static.'],
['Focus','Auth/form localfocusstyles;Titiza ring2/goldalpha/offset2;PathAnalysis/DirecttabIndex-1/focusonmount.'],
['Keyboard','Categoryrovingarrows/Home/End,stride2/3;nativebuttonkeys,localEnterhandlers,namedpasswordtoggle.'],
['ARIA','Categorygrouplabel/pressed/expanded;politemessages/path;timelineexpanded;decorativehidden;coresr-only.'],
['Alt','NextImage data-dependent/genericProfile/Barberalt;CSSposternone; exactledger.'],
['Forms','Visiblelabels/somehtmlFor-id/othersseparatedivtext. Visualpresencealone doesnotproveassociation.'],
['Hit targets','Pagination44×44,bell36×36,eye18px/padding0,cookieswitch48×24,Titizatilespy28/px16. No uniformminimumtoken.'],
['Contrast','Color/alphastylingevidenced;noenforcedcontrastcheckfound; no blanketWCAGclaim.'],
['Motion','Partialreducedmotionasdescribedinmotionreport.']
]),
'## Objective gaps; no corrective changes\n\n- ConfirmDialog lacks dialog/aria-modal/labelledby,focus trap/Escape/restoration ('+src('components/ConfirmDialog.tsx')+').\n- Cookie overlay lacks dialog/trap/Escape;preference/analyticsswitcheslackaccessible names/state ('+src('components/CookieBanner.tsx')+').\n- Notification emoji-only button noexplicitlabel/expanded ('+src('components/NotificationBell.tsx')+').\n- PasswordInput noid/aria-invalid/describedbyprop,eye18px/padding0 ('+src('components/PasswordInput.tsx')+').\n- Mobilelanguageoptionsclickabledivswithoutkeyboardbuttonsemantics ('+src('components/TopNav.tsx')+').\n- html lang=en remainsfortranslation ('+src('app/layout.tsx')+').\n- Filmhasnopause/skip/reducedmotioncontroller;orbpartlycontinuous ('+src('components/titiza-film/film-sequencer.tsx')+').\n- WordmarkSVGlabelbutnoroleimg/title ('+src('components/Wordmark.tsx')+').\n- Undefinedbrand-primaryinempty/404:no measuredcontrastconclusion.\n\nCompleteauthenticatedkeyboard/screenreader/contrastassessmentnotperformed. Beyondsource/capturedfocus:**Not established / not found.**',
'Every semantic/focus/ARIA/alt/label/interaction occurrence: [accessibility ledger](evidence/accessibility.md).'
]);
put('10-visual-inconsistencies.md','Objective inconsistencies',[
'No subjective recommendations. Equivalent spellings preserved, not claimed visually distinct.',
table(['Finding','Exact discrepancy/source'],[
['Version','Guidance15.3.1;package next/override/eslint-config15.3.6;React18.3.1/uuid11.0.3retained.'],
['Middleware','Guideabsent;middleware.tsratelimitsrequests. '+src('middleware.ts')],
['Roles/data','barber/barbers/barbershopsdocumented;professional/admin/professionalProfiles/businessesimplemented. '+src('lib/auth-context.tsx')+'; '+src('lib/types.ts')],
['Fonts','Nunito loadedvariable,bodyfont-sanssystemconfirmed;inlineseparate. '+src('app/layout.tsx')],
['Serifscope','ProtectedCormorantversusfilmfallback. '+src('app/dashboard/client/titiza/page.tsx')+'; '+src('app/preview/titiza-film/page.tsx')],
['Yellow/gold','#F5C518/#FFD600/OKLCHgold/#e8c47a/#f7e6b4 inbrand/nav/cookie/orb.'],
['Dark/text','#111/#111111/#141414/#181818/#1a1a1a/#1A1A1B;#888/#888888/#888580;white/#F0EDE8.'],
['Undefinedtoken','brand-primaryreferences/no--color-brand-primary. '+src('components/EmptyStates.tsx')+'; '+src('app/not-found.tsx')],
['Radii','Guide16;cardSkeleton24/booking16/ComingSoon24/for-shopscompare20. '+src('components/skeletons.tsx')+'; '+src('components/ComingSoon.tsx')+'; '+src('app/for-shops/page.tsx')],
['Buttons','Cookie12pxversusfull/99pxpills;Titizaoutlinedmediumuppercaseversusfilledblackweight.Independentimplementations.'],
['Statusmeaning','Barberconfirmedyellow/pendingorange;shopconfirmedblue#60a5fa/pendingyellow. '+src('app/dashboard/barber/bookings/page.tsx',40)+'; '+src('app/dashboard/shop/bookings/page.tsx',19)],
['Inputoverride','Global16!importantversuslocal13/14px. '+src('app/globals.css',74)],
['Headings','Login32/signup28/admin28/marketplacescales/billingboldvsblack;typeledger.'],
['Spacing','1200/1000/800px/3xlcontainers;48→20guttersversuscommon24;dialog28versusp6/p8.'],
['Icon','Eye18stroke2/chevron8×6stroke2.5/Titizabase24stroke1.5/category32/emoji.'],
['Gradients','ExistingTitiza/avatar/hero gradients despiteguideprohibitiononnewgradients.'],
['Logo','public/wordmark.pngabsent;inlineSVGtextversus404textlogo. '+src('components/Wordmark.tsx')],
['Motion','pulse.6stokenversusfor-shops3sscalekeyframenamecollision. '+src('app/globals.css')+'; '+src('app/for-shops/page.tsx')],
['Breakpoint','for-shopsmax768inclusiveoverlapsTailwindmdmin768;globalsmax767.'],
['Stacking','z40/50/100/110/999/9998/9999/no sharedlevels. '+src('components/TopNav.tsx')+'; '+src('components/CookieBanner.tsx')+'; '+src('components/ConfirmDialog.tsx')],
['Titizaflag','CommentsOFF/TEMP_ENABLE_GLOBALLY=true. '+src('lib/titiza-phase2-flag.ts')],
['CTAimplementation','BeautyProfileCardprimaryinert,pathsno-op,filmpressed/bookedtimedsimulation.'],
['Publicchallenge','Anonymoussourcebranchesversusguardabsenceofchallenge/terms. '+src('app/challenge/page.tsx')+'; '+src('components/RouteGuard.tsx')],
['404','Custombodyexists;unknownanonymousURLcanredirectbeforebody;captureactualURL.'],
['Imageerror','Shoplisting Invalid src randomuser.me hostname notconfigured;fixtureorigin/configmismatch,preserved.'],
['Fakedefault','showFakeUIData trueunlessfalse;notinjectedbyaudit. '+src('hooks/useShowFakeUIData.ts')],
['README','AIStudio/GEMINI_API_KEYversusNext/Firebase/Algolia/no liveTitizaAPI. '+src('README.md')],
['Count','Guide21generated-pagebaseline,current75pagemodules;buildcountseparate.']
]),
'Exactvariations: [tokens](02-design-tokens.md),[typography](03-typography.md),[components](05-component-inventory.md),[responsive](04-responsive-system.md),[motion](08-motion.md).'
]);
const assets=JSON.parse(fs.readFileSync(out+'/evidence/assets.json','utf8')),urls=new Map();
for(const r of rs)for(const l of r.lines)for(const m of l.text.matchAll(/https?:\/\/[^"' \x60<>)}]+/g)){if(!/randomuser|unsplash|firebasestorage|googleusercontent|images|pexels|cloudinary|storage|portrait|\.png|\.jpg|\.jpeg|\.mp4/i.test(m[0]))continue;if(!urls.has(m[0]))urls.set(m[0],[]);urls.get(m[0]).push([r.file,l.line]);}
const dup=[...new Set(assets.map(a=>a.sha256))].map(h=>assets.filter(a=>a.sha256===h)).filter(a=>a.length>1);
put('11-asset-inventory.md','Asset inventory',[
'## Local visual files\n\n'+assets.length+' found outside generated/dependency/Git/audit output. None deleted.',
table(['Category/file','Format/dimensions','Bytes/SHA256'],assets.map(a=>{const b=fs.readFileSync(a.file);return[(a.file.includes('ckwant')?'Campaign':'Icons/manifest')+' — '+src(a.file),a.format+' '+(a.format==='png'?b.readUInt32BE(16)+'×'+b.readUInt32BE(20):'ICOcontainer'),a.bytes+';'+a.sha256];})),
'## Duplicate evidence\n\n'+(dup.length?dup.map(g=>'- '+g.map(a=>a.file).join(', ')).join('\n'):'No identical local SHA256 pairs.')+'\n\nMultiple favicon/manifest resolutions are relatedversions,notassertedidentical. RepeatedremoteURL/photoUrl/profilePhotoUrlusesbelow.',
'## Categories without bundled assets\n\n- Logo:inlineSVG;public/wordmark.png **Not established / not found.**\n- Titiza:proceduralThree/GLSL/TSX/CSS/films;no bitmap/model/video.\n- Photography/provider:remoteURLs/Firestore/Storage.\n- Illustrations/backgrounds/textures:emoji/SVG/CSS/grid/shapes,no texturefile.\n- Video:remote marketing/user/challenge,no localmp4/webm/mov.\n- Animation:sourceCSS/TSX/rAF,no GIF/Lottie.\n- Fonts:next/fontdownloads/systemfallback,no checked-inwoff/ttf/otf.\n- Misc:site.webmanifestlinksPNG;Googleverificationhtmlnotimagery.',
'## Remote visual origins\n\nNo remote media downloaded. Dynamicliveuploads notenumerable fromrepository. Actualcontents/provenance/rights: **Not established / not found.**',
table(['URLasauthored','Uses'],[...urls].map(([u,a])=>['\x60'+u+'\x60',refs(a)])),
'Dynamicfieldcategories:photoUrl/profilePhotoUrl/photos/videos/referencePhotos. Allimage/iconcontext:[imageryledger](evidence/imagery-icons.md).'
]);
let embedded='# Full authored CSS / embedded styles\n\n## app/globals.css\n\n\x60\x60\x60css\n'+css+'\n\x60\x60\x60\n';
for(const r of rs.filter(r=>r.file.endsWith('tsx'))){const s=r.lines.map(l=>l.text).join('\n'),ast=ts.createSourceFile(r.file,s,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);function visit(n){if(ts.isJsxElement(n)&&n.openingElement.tagName.getText(ast)==='style')embedded+='\n## '+r.file+':'+(ast.getLineAndCharacterOfPosition(n.getStart(ast)).line+1)+'\n\n\x60\x60\x60tsx\n'+n.getText(ast)+'\n\x60\x60\x60\n';ts.forEachChild(n,visit);}visit(ast);}
fs.writeFileSync(out+'/evidence/embedded-css.md',embedded);fs.writeFileSync(out+'/evidence/framework-theme.css',theme);
fs.writeFileSync(out+'/evidence/audit-metrics.json',JSON.stringify({routeCount:pages.length,componentTSXFiles:rs.filter(r=>r.file.startsWith('components/')&&r.file.endsWith('.tsx')).length,exportedJSXFunctions:comps.length,authoredColorSpellings:colors.size,assetCount:assets.length},null,2));
console.log('Reports01–11 written',pages.length,comps.length,colors.size);

fs.writeFileSync(out+'/'+"06-imagery-iconography.md","# titeZMe — Imagery and iconography\n\nAudit date: 2026-10-01. Existing implementation only; media origin is not an approval of brand style.\n\n## Imagery\n\n| Category | Existing implementation and origin |\n|---|---|\n| Bundled graphics | Six visual files in public: campaign PNG, favicon, Apple touch icon and manifest PNGs/ICO. See [asset inventory](11-asset-inventory.md) for paths, dimensions and hashes. |\n| Logo | [Wordmark](../components/Wordmark.tsx#L1) renders inline SVG text. public/wordmark.png was not found. Other text-only logo treatments occur in the footer, admin and 404 interfaces. |\n| Provider/profile photography | Firestore user/profile fields and Firebase Storage/Google URLs supply photoUrl, profilePhotoUrl and photo arrays. [Barber profile](../app/barber/[barberId]/BarberProfileClient.tsx), [shop profile](../app/shop/[shopId]/page.tsx) and dashboard galleries use Next Image with different fill, contain and cover treatments. |\n| Fake provider imagery | [Frozen fixtures](../lib/fakeUIData.ts) use randomuser.me portraits and remote shop imagery. [Configuration hook](../hooks/useShowFakeUIData.ts) defaults to displaying fixtures unless explicitly false. This is an existing UI fixture mechanism, not verified provider evidence. |\n| Marketing photography/video | [For-shops](../app/for-shops/page.tsx) uses a remote Firebase Storage video and a CSS mobile poster. Challenge reference media comes from configuration. |\n| Service imagery | Text/price/duration rows and tiles exist. A separate service-photography system: **Not established / not found.** |\n| Illustrations/placeholders | Emoji, initial avatars and skeleton shapes; [BeforeAfterSwap](../components/titiza-film/before-after-swap.tsx) uses neutral abstract panels, with no real before/after photography. |\n| Generated imagery | Fixture data is generated programmatically. AI-generated bitmap provenance: **Not established / not found.** |\n| Backgrounds/textures | CSS gradients, glass, vignette and a 64px grid at 0.04 opacity. No bundled texture file found. |\n| Decorative graphics | Procedural Three.js orb, shells, points and rings; inline SVG utility/category icons. No proprietary orb model file found. |\n| User video | Portfolio and challenge videos are referenced by remote data. Their complete live inventory is not established by the repository. |\n\n## Iconography\n\nNo icon-library dependency such as lucide-react/react-icons was found in package.json. Titiza comments mention conversion from lucide-react; current rendering uses local inline SVG. Emoji, SVG, filled circles and SVG text coexist. No single shared icon size or stroke token is established.\n\n| Treatment | Existing values and source |\n|---|---|\n| Password eye | 18×18; viewBox 0 0 24 24; fill none; currentColor stroke width 2; round caps/joins. [PasswordInput](../components/PasswordInput.tsx#L75). |\n| Titiza utility symbols | Base 24×24; default stroke 2, call-site override 1.5; sizes 16/20/24/28px. [BeautyProfileCard](../components/titiza/beauty-profile-card.tsx), [FeatureCards](../components/titiza/feature-cards.tsx). |\n| Category glyphs | 32px grid icons; local category definitions; More uses filled circles of radius 1.4. [CategoryIcon](../components/titiza/category-icons.tsx), [CategoryGrid](../components/titiza/category-grid.tsx). |\n| Navigation | Language chevron 8×6 with 2.5 stroke; hamburger 20×20 with 2 stroke. [TopNav](../components/TopNav.tsx). |\n| Google mark | Filled, multicolor 18×18 SVG paths. [Signup](../app/signup/page.tsx). |\n| Wordmark | viewBox 200×40, text size 32, weight 800; height prop default 28 and navigation call 24. tite/Me #F5C518; Z #E8491D. [Source](../components/Wordmark.tsx). |\n| Emoji UI | Bell 15px; search/calendar/scissors/heart empty-state icons use text-5xl. Roles, language flags, cash/location and status symbols use different local sizes. Platform font rendering varies. |\n\nEvery SVG, emoji, image and URL occurrence is retained in the [imagery/icon ledger](evidence/imagery-icons.md). Remote source URLs are listed in the [asset inventory](11-asset-inventory.md).\n");

fs.writeFileSync(out+'/'+"07-titiza.md","# titeZMe — Titiza\n\nAudit date: 2026-10-01. Protected implementation and public film simulations are recorded separately.\n\n## Production interface and access\n\n[/dashboard/client/titiza](../app/dashboard/client/titiza/page.tsx) uses loading, genesis, dashboard and phase2 states. The client layout and RouteGuard require authentication/profile access. appUser.titiza.hasMet selects first versus returning meeting; [markTitizaMet/touchTitizaVisit](../lib/titiza-utils.ts) write user visit markers. Cormorant Garamond weights 300/400/500/600 are loaded only on this route.\n\n[Feature-flag comments](../lib/titiza-phase2-flag.ts) say phase two defaults OFF. The actual TEMP_ENABLE_GLOBALLY boolean is true and bypasses environment/UID gating. Returning users and Begin therefore enter phase2. Phase-one dashboard/BeautyProfileCard/FeatureCards still exist as alternate branches, but are bypassed after Begin with this checked-in flag.\n\n## Procedural orb: exact implementation\n\n[TitizaCore](../components/titiza/titiza-core.tsx) dynamically imports the scene with SSR disabled. Its loading fallback is a 160px gold/20 circle, blur-2xl, breathing. The wrapper is aspect-square, full width, max 720px.\n\n| Layer | Existing values |\n|---|---|\n| Bloom/reflection | 70% gold/25 circle, blur 90px; 40% gold-soft/30 circle, blur 60px, delay 1.5s. Reflection bottom 6%, height 40px, width 55%, gold/15, blur-xl. |\n| Renderer/camera | Raw Three.js WebGLRenderer, antialias/alpha enabled, high-performance preference, transparent clear; DPR capped at 2. Perspective 42°, near 0.1/far 100, camera z=6; resize updates camera and canvas. |\n| Palette/lights | GOLD #e8c47a; GOLD_BRIGHT #f7e6b4; rim #8a6a2a. White ambient 0.7, key 2.5, rim 1.2, directional 1.4. |\n| Core | IcosahedronGeometry(1,4), metalness .92, roughness .22, emissive intensity .65. Heart scale .55 + sin(t×.7)×.028; inner sphere uses additive glow. |\n| Energy shells | Radius 1.3 / intensity 1.7 / displacement .09 / opacity .9. Second: radius 1.55 / intensity .9 / displacement .05 / speed −.4 / opacity .5. Custom Fresnel/additive shaders. |\n| Glint/wire | Circle radius .32, 32 segments, position(−.55,.7,1.15), opacity .3. Wire icosahedron scale 1.85, opacity .06. |\n| Orbital rings | A: radius1.95, tube .012, opacity .4, speed .16, tilt[π/2.3,.4,0]. B: radius2.45, tube .008, opacity .22, speed −.1, tilt[π/3.2,−.5,.3]. |\n| Particle stream | 900 points; radius .6–3.6; speed .12 + random×.22; size .026; opacity .7; additive blending; inward flow and outward respawn. |\n| Ambient dust | 10 points; radius 2–2.7; size .03; opacity .55; speed .025, reduced to .01 under reduced motion. |\n| Genesis | 140 particles, size .05, target radius1.2–1.9. 0–.8s seed; .8–1.8s spawn; 1.8–2.8s converge; 2.8–4.5s resolve/spring/ring. Reduced sequence 1.5s. |\n| Reactions | Heartbeat every 8s; trigger ring 1.2s with scale1+p×2.4 and opacity(1−p)×.5. Glow target .13 (.06 reduced), damping6/release.5; pulse damping9. Thinking sin(t×4) adds .03 scale and .25 emissive. |\n| Pointer tracking | Global pointermove; rotation X −.25 / Y .35, damp1.6; position X .22 / Y .16, damp1.4. Orb itself has no click action. |\n\nAll equations, shaders, geometry and material values remain in [TitizaCoreScene](../components/titiza/titiza-core-scene.tsx) and the [source inventory](evidence/source-inventory.json).\n\n[OrbitLabels](../components/titiza/orbit-labels.tsx) positions Hair Profile, Beauty Profile, Professional Analysis, Recommendations and Verified Data by explicit percentages. Initial delay1800ms, visible2600ms, pause1400ms, transition1000ms ease-out. Label cycling is skipped under reduced motion.\n\n## Ambient CSS, glass and colors\n\n[AmbientBackground](../components/titiza/ambient-background.tsx) uses a radial base (120% 90% at 50% −10%) with OKLCH stops (.24 .03 75), (.16 .008 60), (.12 .006 55). Three blobs: 42/38/34vw, blur120/130/120px, alpha8/8/6%, duration22/26/30s, delay0/4/8s. Fine grid64px, opacity .04. Vignette is transparent to55%, then OKLCH(.1 .006 55/.7).\n\n[Global CSS](../app/globals.css) defines glass gradient160° from OKLCH(.28 .012 70/45%) to(.19 .01 65/35%), backdrop blur20px/saturate120%, border alpha12%. Hover lifts6px, border alpha28%, shadow0 30px 80px −40px gold/35%, with500ms transform cubic-bezier(.16,1,.3,1). Exact authored color syntax is preserved in [tokens](02-design-tokens.md) and [full CSS](evidence/embedded-css.md).\n\n## Interactive choreography and unfinished exits\n\n[TitizaHero](../components/titiza/titiza-hero.tsx) adds greetings at +1000ms/+2700ms and Begin at +3500ms after birth completion (normal approximately5.5/7.2/8s).\n\n[DecisionFlow](../components/titiza/titiza-decision-flow.tsx) moves the wrapper18vh→0 in700ms cubic-bezier(.65,0,.35,1). Question1200ms, seed1500ms, tiles1800ms. [CategoryGrid](../components/titiza/category-grid.tsx) starts five categories plus More; expansion occurs in place. Selection dims others to30%, locks the grid during thinking, and supports arrows/Home/End. Branching uses category.titizaEntryMode from [professions](../lib/professions.ts).\n\nThinking holds1000ms first selection,600ms later,0 reduced. [PathAnalysis](../components/titiza/path-analysis.tsx) reveals invitations2200/2800ms and card4200ms; Start exits and logs a no-op after1200ms (0 reduced). [PathDirect](../components/titiza/path-direct.tsx) Explore and Notify log no-ops. [BeautyProfileCard](../components/titiza/beauty-profile-card.tsx) primary booking CTA has no handler; the information timeline expands.\n\nPersisted/editable Beauty Profile, working analysis destination, live chat backend and real recommendation results: **Not implemented.**\n\n## Public film interfaces\n\nEnglish/Spanish preview routes use [FilmSequencer](../components/titiza-film/film-sequencer.tsx) and locale copy from [content.ts](../components/titiza-film/content.ts). Structure/timing is shared. A requestAnimationFrame/performance clock drives greeting, chat, profile-check, analyst, time-skip, analysis chips, checklist/photo, before/after, barber/booking, montage, end and launch-date scenes.\n\nChatInputShell simulates query/send/replies. ProfessionalCard pressed/confirmed states derive from elapsed time, with tabIndex −1 and no navigation. BeforeAfterSwap renders neutral shapes, not real photographs.\n\nFilm uses fixed inset0/z100/black; orb70vmin capped460px; anchor translateY(−26vh)scale(.72) in900ms cubic-bezier(.4,0,.2,1); contentpx6/pb12vh. Films do not load the protected route's Cormorant variable; font-serif falls back. Captures explicitly identify scripted simulation.\n\nAll related files are listed in the [repository inventory](evidence/repository-files.md), under components/titiza, components/titiza-film, lib/titiza*, lib/professions and Titiza page/preview routes. No bundled Titiza bitmap/model/video asset found. [Screenshot coverage](12-screenshot-index.md).\n");

put('08-motion.md','Motion',[
'## Implementations\n\nExisting motion uses CSS keyframes/transitions, Tailwind utilities, raw Three.js requestAnimationFrame and a separate film performance clock. For-shops scroll reveals use IntersectionObserver. Recharts provides chart presentation. No Framer Motion/GSAP dependency or route-level page-transition orchestrator found.',
table(['Motion','Duration / easing / delay','Trigger / source'],[
['fadeUp','400ms ease both; translateY16px→0','Mount class; globals.css.'],
['fadeIn','400ms ease both; opacity0→1','Mount/overlay; globals.css.'],
['Pulse name collision','--animate-pulse: .6s ease; for-shops pulse scales1→1.03 with3s ease-in-out infinite','Skeleton/loading versus marketing CTA; same keyframe name.'],
['Marquee','20s linear infinite; X0→−50%','TopNav ticker; globals.css.'],
['Access spinner','800ms linear infinite','RouteGuard spin and AdminGuard ag-spin.'],
['Language menu','300ms all ease; chevron350ms cubic(.34,1.2,.64,1), stroke300ms; local langDropIn','TopNav toggle.'],
['Regular button/link','Default150ms cubic(.4,0,.2,1), unless overridden','Local hover/color/opacity/transform utilities.'],
['Cookie banner/modal','fadeUp/fadeIn400ms','Consent mount/Customize.'],
['Titiza float','7s ease-in-out infinite; Y0→−14px','Hero wrapper.'],
['Titiza breathe','6s ease-in-out infinite; opacity.55→.9, scale1→1.06','Bloom/fallback; second delay1.5s.'],
['Titiza drift','22/26/30s ease-in-out infinite; delays0/4/8s','Ambient aurora blobs.'],
['Titiza shimmer','8s linear infinite; position−200→200%','Text gradient.'],
['Titiza fade-up','1s cubic(.16,1,.3,1); Y24px→0; delays.45s/.55+i×.12s/tile i×60ms','Cards and tiles mounting.'],
['Titiza fade-in','600ms ease-out both; Begin500ms override','Greeting/phase crossfade.'],
['Glass hover','500ms transform cubic(.16,1,.3,1), border/shadow ease','6px lift/glow.'],
['Beauty Profile timeline','500ms cubic(.16,1,.3,1)','Grid0fr→1fr, opacity/margin.'],
['Category selection','500ms','Opacity30/100 and selected border/shadow.'],
['Decision anchor','700ms cubic(.65,0,.35,1); none reduced','Next animation frame wrapper travel.'],
['Orb','4.5s normal/1.5s reduced birth;8s heartbeat;1.2s trigger ring; damping6/.5/9','Continuous Three.js loop; detailed equations in Titiza report.'],
['Orbit labels','1000ms ease-out;1800ms initial,2600ms visible,1400ms pause','Timer cycle; suppressed for reduced motion.'],
['Film anchor','900ms cubic(.4,0,.2,1); starts300ms into conversation scene','Elapsed timeline.'],
['Film card/button','300ms cubic(.4,0,.2,1), button delay120ms, transition200ms','Mount and simulated pressed state.'],
['Before/after','1200ms default crossfade; initial fade600ms','Elapsed swap of neutral panels.'],
['Launch card','500ms lines at1000/2500/3000ms; final fade1800ms','Final scene.'],
['For-shops','FAQ max-height/opacity300ms ease; CTA pulse3s; other local reveal values','Observer/FAQ/CTA; embedded CSS.']
]),
'## Full exact source evidence\n\nEvery motion/hover/duration/easing/delay/keyframe/timer occurrence is in [motion evidence](evidence/motion.md). Multiline authored CSS: [embedded CSS](evidence/embedded-css.md). Installed framework defaults: [theme snapshot](evidence/framework-theme.css). Values remain separate; no timing normalization.',
'## Film scene/event timeline (milliseconds)',
table(['Source','Exact authored timing / event'],get('components/titiza-film/film-sequencer.tsx').lines.filter(l=>/^\s*(id:|title:|duration:|fadeIn:|fadeOut:|hold:|stagger:|revealDuration:|pressAt:|confirmAt:|swapAt:|startStagger:|appearDuration:|pause:|travelDuration:|chipsAt:|chipStagger:|typeStartAt:|typeDuration:|sendAt:|replyStartAt:|replyHolds:|visibleDuration:|overlap:|line\dAt:|lineFade:|finalFadeOut:)|\{ at:/.test(l.text)).map(l=>[src('components/titiza-film/film-sequencer.tsx',l.line),l.text.trim()])),
'## Reduced-motion implementation\n\nThe global reduce rule disables Titiza float/breathe/drift/fade-up/shimmer, but omits fade-in. OrbitLabels suppresses cycling. DecisionFlow and PathAnalysis shorten staged delays. Three.js suppresses quick pulse/thinking and slows dust, while several ongoing rotation/breathing/pointer equations continue. Greeting still adds1/2.7/3.5s after shortened birth. Film has no reduced-motion branch or pause controller. Global marquee/spinner/for-shops suppression: **Not established / not found.**'
]);
put('09-accessibility.md','Accessibility implementation',[
'## Existing evidence',
table(['Area','Implementation'],[
['Semantics','Native buttons, links, forms, inputs, selects, headings, main and footer coexist with generic div wrappers. Root html lang=en is static.'],
['Focus','Auth/forms have local focus styling. Titiza CTAs/tiles use ring2, gold alpha and offset2. PathAnalysis/PathDirect tabIndex−1 containers receive focus on mount.'],
['Keyboard','CategoryGrid supports roving tabindex, arrows/Home/End and responsive2/3 column stride. Native button activation and some Enter handlers exist. Password toggle is a named button.'],
['ARIA','Category group label/pressed/expanded; polite messages/path regions; timeline expanded; decorative layers hidden; core screen-reader-only description.'],
['Image alt','Next Image data-dependent and generic Profile/Barber alternatives. CSS background poster has no alt node. Exact declarations are preserved in ledger.'],
['Form labels','Visible labels and some htmlFor/id associations; other labels are separate text/divs. Visible text alone does not prove association.'],
['Interactive dimensions','Pagination44×44px; bell36×36px; eye18px/no padding; cookie switch48×24px; Titiza tile padding28px vertically/16px horizontally. No shared minimum target token.'],
['Contrast-related styling','Color/alpha choices are evidenced; no contrast enforcement found. No blanket WCAG pass/fail is claimed.'],
['Reduced motion','Partial CSS/JS coverage detailed in the motion report.']
]),
'## Objective implementation gaps (separate from redesign)\n\n- ConfirmDialog lacks dialog/aria-modal/labelledby, focus trap, Escape handling and focus restoration: '+src('components/ConfirmDialog.tsx')+'.\n- Cookie customization lacks dialog semantics/trap/Escape. Preference/analytics switches lack explicit accessible names/switch states: '+src('components/CookieBanner.tsx')+'.\n- Notification bell is emoji-only without explicit aria-label/expanded association: '+src('components/NotificationBell.tsx')+'.\n- PasswordInput accepts no id/aria-invalid/aria-describedby prop; eye SVG18px with padding0: '+src('components/PasswordInput.tsx')+'.\n- TopNav mobile language options are clickable divs without button keyboard semantics: '+src('components/TopNav.tsx')+'.\n- Root html lang remains en after language selection: '+src('app/layout.tsx')+'.\n- Film lacks pause/skip/reduced-motion controller; orb equations are only partly suppressed: '+src('components/titiza-film/film-sequencer.tsx')+'.\n- Wordmark SVG has aria-label, but no explicit role=img/title: '+src('components/Wordmark.tsx')+'.\n- Empty/404 components reference undefined brand-primary; no measured contrast conclusion.\n\nA complete authenticated keyboard/screen-reader/contrast assessment was not performed. Behavior beyond source and captured focus: **Not established / not found.**',
'Every semantic/focus/ARIA/alt/label/interaction occurrence: [accessibility ledger](evidence/accessibility.md).'
]);
const clearDescriptions={
AvailabilityGrid:'Weekly availability editor; barber/shop/client modes, drag selection, buffer/blocked dates, loading/saving/autosave.',
BarberInvitesTab:'Invitation acceptance/decline and connection state.',BarberPortfolioTab:'Existing media removal; additions use coming-soon notification.',BarberSettingsTab:'Profile, location, languages, biography, specialty and vibe.',
ChallengeHomepageBox:'Configuration, phase, countdown and CTA.',ChallengeLocationGate:'Spain eligibility or child content.',ChallengePaymentTab:'Barber/shop role, fee, reference, IBAN, declaration and status.',ChallengeSubmissionTab:'Barber/shop role, uploads, validation, phase, rejection, editing and status.',
ComingSoon:'Emoji/title/body, optional notify, sending/done.',ConfirmDialog:'Open/closed, labels/title/message and confirm color.',CookieBanner:'Consent card, Customize, switches and local persistence.',CountdownTimer:'Target/date segments.',
DeleteAccountButton:'Client/professional, confirmation, reauthentication, Google/password, deleting/error.',EmptySearch:'Optional city; no results.',EmptyClientBookings:'No bookings; discovery link.',EmptyBarberBookings:'No appointments.',EmptyFavourites:'No favorites.',
Footer:'Legal/acquisition/cookie links.',NotificationBell:'Badge, unread dropdown, empty state; opening writes count.',OfflineBanner:'Online/offline banner.',PasswordInput:'Controlled value/style, show/hide, required/autocomplete.',
ShopAvailabilityTab:'Opening hours, breaks, copy weekdays, holidays, closures and saving.',ShopPhotosTab:'Gallery/upload/removal.',ShopServicesTab:'CRUD, editing, active status, presets and titeZMe Cut.',ShopSettingsTab:'Business/location/profile.',ShopTeamTab:'Code search, throttling, invitations, team and removal.',
ShopTimePicker:'Date/week/time and shop union/available barber selection.',SmartTimePicker:'Date/week/time and duration-fit slots.',
BarberCardSkeleton:'Card/photo/text loader.',BookingRowSkeleton:'Booking loader.',StatCardSkeleton:'Stats loader.',BarberProfileSkeleton:'Responsive profile/services loader.',
SuspendedBookingBanner:'Suspension/challenge restriction.',VerifyEmailGate:'Verification, resend, cooldown, detection and destination.',Wordmark:'SVG text; default height28.',
AmbientBackground:'Fixed aurora/grid/vignette.',BeautyProfileCard:'Inert primary CTA and expandable timeline.',CategoryGrid:'Five plus More, expansion, selection/dimming/locking and keyboard.',CategoryIcon:'Category SVG.',
FeatureCards:'Three hover/glow cards.',OrbitLabels:'Five timed labels with reduced-motion suppression.',PathAnalysis:'Acknowledgment, invitation, card and no-op exit.',PathDirect:'Explore/Notify both no-op.',
TitizaCore:'Dynamic fallback, genesis/held-state/ring/bloom.',TitizaCoreScene:'Three.js orb, shells, particles, rings, idle/bright/thinking.',TitizaDecisionFlow:'Anchor, greeting, choice, thinking and paths.',TitizaHero:'Genesis/dashboard, first/returning and Begin.',
AnalysisCardsOrbit:'Film chips/convergence.',BeforeAfterSwap:'Single/swap neutral frames.',ChatInputShell:'Scripted query/send/reply.',ConversationStrip:'Film continuity cue.',FilmSequencer:'Locale/shared timeline/orb reactions.',IntroTitle:'Intro/time-skip/end fades.',LaunchDateCard:'Cascade/hold/fade.',OrbDialogue:'Timed lines.',ProfessionalCard:'Simulated pressed/confirmed states.',TypingLines:'Checklist/reveal.',VerticalMontage:'Timed words.',TopNav:'Auth/role/active route/language/drawer/marquee.'
};
let invText=fs.readFileSync(out+'/05-component-inventory.md','utf8');
for(const name of Object.keys(clearDescriptions))if(desc[name])invText=invText.replace(desc[name],clearDescriptions[name]);
invText+='\n## Exact prop interfaces and JSX arrow components\n\n';
for(const r of rs.filter(r=>r.file.startsWith('components/')&&r.file.endsWith('tsx'))){const s=r.lines.map(l=>l.text).join('\n'),ast=ts.createSourceFile(r.file,s,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);for(const n of ast.statements){if((ts.isInterfaceDeclaration(n)||ts.isTypeAliasDeclaration(n))&&/Props$/.test(n.name.text))invText+='### '+r.file+' — '+n.name.text+'\n\n\x60\x60\x60tsx\n'+n.getText(ast)+'\n\x60\x60\x60\n';if(ts.isVariableStatement(n))for(const d of n.declarationList.declarations){if(/^[A-Z]/.test(d.name.getText(ast))&&d.initializer&&(ts.isArrowFunction(d.initializer)||ts.isFunctionExpression(d.initializer))&&/<[a-zA-Z]/.test(d.initializer.getText(ast)))invText+='- Arrow-function JSX component '+d.name.getText(ast)+' — '+src(r.file,ast.getLineAndCharacterOfPosition(d.getStart(ast)).line+1)+'\n';}}}
fs.writeFileSync(out+'/05-component-inventory.md',invText);

put('10-visual-inconsistencies.md','Objective inconsistencies',[
'These are implementation/documentation discrepancies and parallel treatments, without corrective recommendations. Equivalent literal spellings are preserved but are not called visually different.',
table(['Finding','Evidence / exact difference'],[
['Next.js version','Supplied instructions lock15.3.1; package.json has next15.3.6, override15.3.6 and eslint-config-next15.3.6. React18.3.1 and uuid11.0.3 remain exact. No package changed.'],
['Middleware','Instructions say no middleware; middleware.ts exists and rate-limits requests. '+src('middleware.ts')+'. No security applicability conclusion inferred.'],
['Role/data terminology','Guide says barber/barbers/barbershops; AppUser uses client/professional/admin; runtime code uses professionalProfiles/businesses with legacy fields also present. '+src('lib/auth-context.tsx')+'; '+src('lib/types.ts')],
['Font loading versus application','Nunito variable is declared, body font-sans remains the framework system stack; inline areas separately request Nunito. '+src('app/layout.tsx')],
['Titiza serif scope','Protected route loads Cormorant; public films use font-serif without that route variable. '+src('app/dashboard/client/titiza/page.tsx')+'; '+src('app/preview/titiza-film/page.tsx')],
['Parallel accent colors','#F5C518 brand, #FFD600 navigation/cookies/selection, OKLCH gold and #e8c47a/#f7e6b4 orb. Exact uses in token ledger.'],
['Dark/text variations','#111/#111111/#141414/#181818/#1a1a1a/#1A1A1B; #888/#888888 versus #888580; white versus #F0EDE8.'],
['Undefined brand-primary','Referenced in EmptyStates/404 with no --color-brand-primary definition. '+src('components/EmptyStates.tsx')+'; '+src('app/not-found.tsx')],
['Card radii','Guide16px; barber-card skeleton rounded-3xl24px, booking16px, ComingSoon24px, for-shops comparison20px. '+src('components/skeletons.tsx')+'; '+src('components/ComingSoon.tsx')+'; '+src('app/for-shops/page.tsx')],
['Independent button treatments','Cookie rounded-xl12px versus full/99px pills; Titiza outlined medium uppercase versus marketplace filled black-weight. No common Button variant API.'],
['Booking status meaning','Professional confirmed yellow/pending orange; shop confirmed blue#60a5fa/pending yellow. '+src('app/dashboard/barber/bookings/page.tsx',40)+'; '+src('app/dashboard/shop/bookings/page.tsx',19)],
['Input override','Global16px!important overrides local13/14px declared input sizes. '+src('app/globals.css',74)],
['Headings','Login32px/signup28px, admin28px, different marketplace scales and billing bold versus dashboard black. Typography source ledger.'],
['Spacing/container values','1200/1000/800px/max-w-3xl containers; for-shops48→20px gutters versus common24px; dialog28px padding versusp6/p8.'],
['Icon sizing/stroke','Eye18px/stroke2, chevron8×6/stroke2.5, Titiza24px base/call-site1.5 stroke, category32px and differently sized emoji.'],
['Existing gradients','Titiza/avatar/hero gradients are present despite guidance against adding gradients. All preserved.'],
['Logo source','Documented public/wordmark.png absent; inline SVG Wordmark and separate404 text logo. '+src('components/Wordmark.tsx')],
['Motion names','pulse .6s token versus for-shops3s scale animation/keyframe-name collision. '+src('app/globals.css')+'; '+src('app/for-shops/page.tsx')],
['Breakpoint boundary','for-shops max-width768px overlaps Tailwind md min-width768px; globals uses max-width767px for its mobile rule.'],
['Stacking','z40/50/100/110/999/9998/9999; no shared overlay-level token. '+src('components/TopNav.tsx')+'; '+src('components/CookieBanner.tsx')+'; '+src('components/ConfirmDialog.tsx')],
['Titiza gating','Comments default OFF versus TEMP_ENABLE_GLOBALLY=true. '+src('lib/titiza-phase2-flag.ts')],
['CTA capability','BeautyProfileCard primary CTA has no handler; phase-two paths log no-op; film pressed/booked states are timed simulations.'],
['Public challenge','Anonymous branches exist in campaign source, but challenge/terms-challenge are absent from guard public list. '+src('app/challenge/page.tsx')+'; '+src('components/RouteGuard.tsx')],
['Unknown-route behavior','Custom404 body exists; anonymous unknown URL can redirect before it is visible. Screenshot index records the actual URL/body rather than claiming404 coverage.'],
['Image configuration/runtime','Shop search threw Invalid src randomuser.me hostname not configured. Static fixture origins and current image configuration disagree. Configuration unchanged.'],
['Fake-data default','showFakeUIData defaults true unless false; existing fixture paths may render without audit injection. '+src('hooks/useShowFakeUIData.ts')],
['README','AI Studio/GEMINI_API_KEY guidance versus Next/Firebase/Algolia implementation; no live Titiza conversation API found. '+src('README.md')],
['Baseline count','Supplied21-generated-page baseline versus75 page modules; production generation count recorded separately.']
]),
'Full literal variations and sources: [tokens](02-design-tokens.md), [typography](03-typography.md), [components](05-component-inventory.md), [responsive](04-responsive-system.md), [motion](08-motion.md).'
]);
put('11-asset-inventory.md','Asset inventory',[
'## Local visual files\n\n'+assets.length+' visual files were found outside dependencies, generated build/Git metadata and audit output. No files deleted. Categories record use, not brand approval.',
table(['Category / file','Format / dimensions','Bytes / SHA-256'],assets.map(a=>{const b=fs.readFileSync(a.file);return[(a.file.includes('ckwant')?'Campaign':'Icons / manifest')+' — '+src(a.file),a.format+' '+(a.format==='png'?b.readUInt32BE(16)+'×'+b.readUInt32BE(20):'ICO container; frame sizes not summarized'),a.bytes+' bytes; '+a.sha256];})),
'## Duplicate evidence\n\n'+(dup.length?dup.map(g=>'- '+g.map(a=>a.file).join(', ')).join('\n'):'No identical SHA-256 pairs among the local files.')+'\n\nMultiple favicon/manifest resolutions are apparent related versions, not asserted identical files. Repeated remote URL/photoUrl/profilePhotoUrl uses are listed below.',
'## Categories without bundled files\n\n- titeZMe logo: inline SVG source; public/wordmark.png **Not established / not found.**\n- Titiza: procedural Three.js/GLSL/TSX/CSS and film source; no bundled bitmap/model/video.\n- Photography/provider imagery: remote URLs and Firestore/Storage fields.\n- Illustrations/backgrounds/textures: emoji/SVG/CSS grids/shapes; no texture file.\n- Video: remote marketing/user/challenge; no localmp4/webm/mov.\n- Animation: CSS/TSX/rAF source; no local GIF/Lottie.\n- Fonts: next/font downloads and system fallbacks; no checked-inwoff/ttf/otf.\n- Miscellaneous: site.webmanifest links PNG icons; Google verification HTML is not imagery.',
'## Remote visual origins\n\nNo remote media downloaded. Dynamic live upload URLs cannot be enumerated from the repository. Actual live contents, provenance and rights: **Not established / not found.**',
table(['URL as authored','All source uses'],[...urls].map(([u,a])=>['\x60'+u+'\x60',refs(a)])),
'Dynamic image/video fields include photoUrl/profilePhotoUrl/photos/videos/referencePhotos. All image/icon source contexts: [imagery ledger](evidence/imagery-icons.md).'
]);
// Add per-literal role/scope evidence without inventing global tokens.
let roles='\n## Literal role and scope index\n\nRole below comes from property/class context; ambiguous uses remain explicit. A repeated literal is not promoted to a new token.\n';
roles+=table(['Exact color','Observed styling contexts','Definition/use scope'],[...colors].sort(([a],[b])=>a.localeCompare(b)).map(([v,a])=>{
const contexts=new Set();
for(const [f,l]of a){const r=get(f);for(const p of r.styles.filter(p=>p.value.includes(v)))contexts.add(p.name);
const line=r.lines[l-1].text;for(const m of line.matchAll(/(?:^|[\s"'\x60])((?:[\w-]+:)*(?:bg|text|border(?:-[\w]+)?|ring|from|via|to|fill|stroke)-[^\s"'\x60]+)/g))if(m[1].includes(v))contexts.add(m[1]);
if(line.includes('--color-')||line.includes('--gold'))contexts.add('CSS token/custom-property definition');
if(/new THREE.Color|color:|emissive:/.test(line))contexts.add('Three/material or color declaration');
if(/gradient/.test(line))contexts.add('gradient');
}
return[v,[...contexts].join('; ')||'Multiline/local expression; exact occurrence ledger is authoritative.',a.some(([f])=>f==='app/globals.css')?'Includes globally defined CSS; other source uses remain local.':'Local source declarations/uses; no global token established.'];
}));
fs.appendFileSync(out+'/02-design-tokens.md',roles);
