# States and secondary interfaces

Exact source occurrences; comments may disagree with behavior. Static occurrences do not prove runtime reachability. Values are not normalized.

| Source | Exact source |
|---|---|
| [app/admin/(protected)/barbers/page.tsx:3](../../app/admin/(protected)/barbers/page.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [app/admin/(protected)/barbers/page.tsx:105](../../app/admin/(protected)/barbers/page.tsx#L105) |   const [barbers, setBarbers] = useState&lt;EnrichedBarber[]&gt;([]); |
| [app/admin/(protected)/barbers/page.tsx:106](../../app/admin/(protected)/barbers/page.tsx#L106) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/barbers/page.tsx:108](../../app/admin/(protected)/barbers/page.tsx#L108) |   const [tab, setTab] = useState&lt;Tab&gt;(() =&gt; { |
| [app/admin/(protected)/barbers/page.tsx:113](../../app/admin/(protected)/barbers/page.tsx#L113) |   const [search, setSearch] = useState(''); |
| [app/admin/(protected)/barbers/page.tsx:114](../../app/admin/(protected)/barbers/page.tsx#L114) |   const [page, setPage] = useState(1); |
| [app/admin/(protected)/barbers/page.tsx:115](../../app/admin/(protected)/barbers/page.tsx#L115) |   const [counts, setCounts] = useState&lt;Counts&gt;({ |
| [app/admin/(protected)/barbers/page.tsx:146](../../app/admin/(protected)/barbers/page.tsx#L146) |               // user doc not found — skip enrichment |
| [app/admin/(protected)/barbers/page.tsx:184](../../app/admin/(protected)/barbers/page.tsx#L184) |         console.error('Barbers fetch error:', err); |
| [app/admin/(protected)/barbers/page.tsx:281](../../app/admin/(protected)/barbers/page.tsx#L281) |           placeholder="Search by name or city…" |
| [app/admin/(protected)/barbers/page.tsx:302](../../app/admin/(protected)/barbers/page.tsx#L302) |       {loading ? ( |
| [app/admin/(protected)/barbers/page.tsx:434](../../app/admin/(protected)/barbers/page.tsx#L434) |             disabled={page === 1} |
| [app/admin/(protected)/barbers/page.tsx:453](../../app/admin/(protected)/barbers/page.tsx#L453) |             disabled={page === totalPages} |
| [app/admin/(protected)/barbers/[id]/page.tsx:3](../../app/admin/(protected)/barbers/[id]/page.tsx#L3) | import { useState, useEffect, use } from 'react'; |
| [app/admin/(protected)/barbers/[id]/page.tsx:169](../../app/admin/(protected)/barbers/[id]/page.tsx#L169) |   const [profile, setProfile] = useState&lt;ProfessionalProfile \| null&gt;(null); |
| [app/admin/(protected)/barbers/[id]/page.tsx:170](../../app/admin/(protected)/barbers/[id]/page.tsx#L170) |   const [userData, setUserData] = useState&lt;UserData \| null&gt;(null); |
| [app/admin/(protected)/barbers/[id]/page.tsx:171](../../app/admin/(protected)/barbers/[id]/page.tsx#L171) |   const [bookings, setBookings] = useState&lt;BookingItem[]&gt;([]); |
| [app/admin/(protected)/barbers/[id]/page.tsx:172](../../app/admin/(protected)/barbers/[id]/page.tsx#L172) |   const [reviews, setReviews] = useState&lt;ReviewItem[]&gt;([]); |
| [app/admin/(protected)/barbers/[id]/page.tsx:173](../../app/admin/(protected)/barbers/[id]/page.tsx#L173) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/barbers/[id]/page.tsx:174](../../app/admin/(protected)/barbers/[id]/page.tsx#L174) |   const [rejectionReason, setRejectionReason] = useState(''); |
| [app/admin/(protected)/barbers/[id]/page.tsx:175](../../app/admin/(protected)/barbers/[id]/page.tsx#L175) |   const [showRejectForm, setShowRejectForm] = useState(false); |
| [app/admin/(protected)/barbers/[id]/page.tsx:176](../../app/admin/(protected)/barbers/[id]/page.tsx#L176) |   const [saving, setSaving] = useState(false); |
| [app/admin/(protected)/barbers/[id]/page.tsx:221](../../app/admin/(protected)/barbers/[id]/page.tsx#L221) |       console.error('Barber detail fetch error:', err); |
| [app/admin/(protected)/barbers/[id]/page.tsx:259](../../app/admin/(protected)/barbers/[id]/page.tsx#L259) |       console.error('Approve error:', err); |
| [app/admin/(protected)/barbers/[id]/page.tsx:260](../../app/admin/(protected)/barbers/[id]/page.tsx#L260) |       toast.error('Failed to approve'); |
| [app/admin/(protected)/barbers/[id]/page.tsx:293](../../app/admin/(protected)/barbers/[id]/page.tsx#L293) |       console.error('Reject error:', err); |
| [app/admin/(protected)/barbers/[id]/page.tsx:294](../../app/admin/(protected)/barbers/[id]/page.tsx#L294) |       toast.error('Failed to reject'); |
| [app/admin/(protected)/barbers/[id]/page.tsx:336](../../app/admin/(protected)/barbers/[id]/page.tsx#L336) |         if (!activeBookings.empty) { |
| [app/admin/(protected)/barbers/[id]/page.tsx:358](../../app/admin/(protected)/barbers/[id]/page.tsx#L358) |         console.error('Failed to notify clients:', notifErr); |
| [app/admin/(protected)/barbers/[id]/page.tsx:364](../../app/admin/(protected)/barbers/[id]/page.tsx#L364) |       console.error('Suspend error:', err); |
| [app/admin/(protected)/barbers/[id]/page.tsx:365](../../app/admin/(protected)/barbers/[id]/page.tsx#L365) |       toast.error('Failed to suspend'); |
| [app/admin/(protected)/barbers/[id]/page.tsx:397](../../app/admin/(protected)/barbers/[id]/page.tsx#L397) |       console.error('Reactivate error:', err); |
| [app/admin/(protected)/barbers/[id]/page.tsx:398](../../app/admin/(protected)/barbers/[id]/page.tsx#L398) |       toast.error('Failed to reactivate'); |
| [app/admin/(protected)/barbers/[id]/page.tsx:420](../../app/admin/(protected)/barbers/[id]/page.tsx#L420) |       console.error('Verify experience error:', err); |
| [app/admin/(protected)/barbers/[id]/page.tsx:421](../../app/admin/(protected)/barbers/[id]/page.tsx#L421) |       toast.error('Failed to verify experience'); |
| [app/admin/(protected)/barbers/[id]/page.tsx:452](../../app/admin/(protected)/barbers/[id]/page.tsx#L452) |       console.error('Reject experience error:', err); |
| [app/admin/(protected)/barbers/[id]/page.tsx:453](../../app/admin/(protected)/barbers/[id]/page.tsx#L453) |       toast.error('Failed to reject experience'); |
| [app/admin/(protected)/barbers/[id]/page.tsx:479](../../app/admin/(protected)/barbers/[id]/page.tsx#L479) |       console.error('Rating recalc error:', err); |
| [app/admin/(protected)/barbers/[id]/page.tsx:491](../../app/admin/(protected)/barbers/[id]/page.tsx#L491) |       console.error('Delete review error:', err); |
| [app/admin/(protected)/barbers/[id]/page.tsx:492](../../app/admin/(protected)/barbers/[id]/page.tsx#L492) |       toast.error('Failed to delete review'); |
| [app/admin/(protected)/barbers/[id]/page.tsx:496](../../app/admin/(protected)/barbers/[id]/page.tsx#L496) |   if (loading) { |
| [app/admin/(protected)/barbers/[id]/page.tsx:505](../../app/admin/(protected)/barbers/[id]/page.tsx#L505) |         Barber profile not found. |
| [app/admin/(protected)/barbers/[id]/page.tsx:805](../../app/admin/(protected)/barbers/[id]/page.tsx#L805) |                     disabled={saving} |
| [app/admin/(protected)/barbers/[id]/page.tsx:813](../../app/admin/(protected)/barbers/[id]/page.tsx#L813) |                     disabled={saving} |
| [app/admin/(protected)/barbers/[id]/page.tsx:820](../../app/admin/(protected)/barbers/[id]/page.tsx#L820) |                 {showRejectForm && ( |
| [app/admin/(protected)/barbers/[id]/page.tsx:823](../../app/admin/(protected)/barbers/[id]/page.tsx#L823) |                       placeholder="Reason for rejection…" |
| [app/admin/(protected)/barbers/[id]/page.tsx:842](../../app/admin/(protected)/barbers/[id]/page.tsx#L842) |                       disabled={saving \|\| !rejectionReason.trim()} |
| [app/admin/(protected)/barbers/[id]/page.tsx:893](../../app/admin/(protected)/barbers/[id]/page.tsx#L893) |                   disabled={saving} |
| [app/admin/(protected)/barbers/[id]/page.tsx:915](../../app/admin/(protected)/barbers/[id]/page.tsx#L915) |                   disabled={saving} |
| [app/admin/(protected)/barbers/[id]/page.tsx:952](../../app/admin/(protected)/barbers/[id]/page.tsx#L952) |                   disabled={saving} |
| [app/admin/(protected)/barbers/[id]/page.tsx:1028](../../app/admin/(protected)/barbers/[id]/page.tsx#L1028) |                       disabled={saving} |
| [app/admin/(protected)/barbers/[id]/page.tsx:1038](../../app/admin/(protected)/barbers/[id]/page.tsx#L1038) |                       disabled={saving} |
| [app/admin/(protected)/bookings/page.tsx:3](../../app/admin/(protected)/bookings/page.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [app/admin/(protected)/bookings/page.tsx:108](../../app/admin/(protected)/bookings/page.tsx#L108) |   const [bookings, setBookings] = useState&lt;BookingRow[]&gt;([]); |
| [app/admin/(protected)/bookings/page.tsx:109](../../app/admin/(protected)/bookings/page.tsx#L109) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/bookings/page.tsx:110](../../app/admin/(protected)/bookings/page.tsx#L110) |   const [statusFilter, setStatusFilter] = useState&lt;StatusFilter&gt;('all'); |
| [app/admin/(protected)/bookings/page.tsx:111](../../app/admin/(protected)/bookings/page.tsx#L111) |   const [timeFilter, setTimeFilter] = useState&lt;TimeFilter&gt;('all'); |
| [app/admin/(protected)/bookings/page.tsx:112](../../app/admin/(protected)/bookings/page.tsx#L112) |   const [search, setSearch] = useState(''); |
| [app/admin/(protected)/bookings/page.tsx:113](../../app/admin/(protected)/bookings/page.tsx#L113) |   const [page, setPage] = useState(1); |
| [app/admin/(protected)/bookings/page.tsx:114](../../app/admin/(protected)/bookings/page.tsx#L114) |   const [cancelConfirmId, setCancelConfirmId] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/bookings/page.tsx:115](../../app/admin/(protected)/bookings/page.tsx#L115) |   const [cancelling, setCancelling] = useState(false); |
| [app/admin/(protected)/bookings/page.tsx:161](../../app/admin/(protected)/bookings/page.tsx#L161) |         console.error('Admin bookings listener error:', err); |
| [app/admin/(protected)/bookings/page.tsx:253](../../app/admin/(protected)/bookings/page.tsx#L253) |       console.error('Cancel error:', err); |
| [app/admin/(protected)/bookings/page.tsx:254](../../app/admin/(protected)/bookings/page.tsx#L254) |       toast.error('Failed to cancel booking'); |
| [app/admin/(protected)/bookings/page.tsx:376](../../app/admin/(protected)/bookings/page.tsx#L376) |           placeholder="Search client, barber, service…" |
| [app/admin/(protected)/bookings/page.tsx:397](../../app/admin/(protected)/bookings/page.tsx#L397) |       {loading ? ( |
| [app/admin/(protected)/bookings/page.tsx:511](../../app/admin/(protected)/bookings/page.tsx#L511) |                       disabled={cancelling} |
| [app/admin/(protected)/bookings/page.tsx:539](../../app/admin/(protected)/bookings/page.tsx#L539) |             disabled={page === 1} |
| [app/admin/(protected)/bookings/page.tsx:556](../../app/admin/(protected)/bookings/page.tsx#L556) |             disabled={page === totalPages} |
| [app/admin/(protected)/challenge/page.tsx:3](../../app/admin/(protected)/challenge/page.tsx#L3) | import { useState, useEffect, useCallback } from 'react'; |
| [app/admin/(protected)/challenge/page.tsx:41](../../app/admin/(protected)/challenge/page.tsx#L41) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/challenge/page.tsx:42](../../app/admin/(protected)/challenge/page.tsx#L42) |   const [saving, setSaving] = useState(false); |
| [app/admin/(protected)/challenge/page.tsx:44](../../app/admin/(protected)/challenge/page.tsx#L44) |   const [submissionsOpenAt, setSubmissionsOpenAt] = useState&lt;number&gt;( |
| [app/admin/(protected)/challenge/page.tsx:47](../../app/admin/(protected)/challenge/page.tsx#L47) |   const [submissionsCloseAt, setSubmissionsCloseAt] = useState&lt;number&gt;( |
| [app/admin/(protected)/challenge/page.tsx:50](../../app/admin/(protected)/challenge/page.tsx#L50) |   const [votingOpenAt, setVotingOpenAt] = useState&lt;number&gt;( |
| [app/admin/(protected)/challenge/page.tsx:53](../../app/admin/(protected)/challenge/page.tsx#L53) |   const [votingCloseAt, setVotingCloseAt] = useState&lt;number&gt;( |
| [app/admin/(protected)/challenge/page.tsx:56](../../app/admin/(protected)/challenge/page.tsx#L56) |   const [ibanText, setIbanText] = useState(''); |
| [app/admin/(protected)/challenge/page.tsx:57](../../app/admin/(protected)/challenge/page.tsx#L57) |   const [accountHolderName, setAccountHolderName] = useState(''); |
| [app/admin/(protected)/challenge/page.tsx:58](../../app/admin/(protected)/challenge/page.tsx#L58) |   const [referencePhotos, setReferencePhotos] = useState&lt;string[]&gt;([]); |
| [app/admin/(protected)/challenge/page.tsx:59](../../app/admin/(protected)/challenge/page.tsx#L59) |   const [referencePhotoLabels, setReferencePhotoLabels] = useState&lt;string[]&gt;([ |
| [app/admin/(protected)/challenge/page.tsx:62](../../app/admin/(protected)/challenge/page.tsx#L62) |   const [fakeBarberCount, setFakeBarberCount] = useState(0); |
| [app/admin/(protected)/challenge/page.tsx:63](../../app/admin/(protected)/challenge/page.tsx#L63) |   const [fakeShopCount, setFakeShopCount] = useState(0); |
| [app/admin/(protected)/challenge/page.tsx:64](../../app/admin/(protected)/challenge/page.tsx#L64) |   const [publicLeaderboardEnabled, setPublicLeaderboardEnabled] = useState(false); |
| [app/admin/(protected)/challenge/page.tsx:65](../../app/admin/(protected)/challenge/page.tsx#L65) |   const [feeBarber, setFeeBarber] = useState(19); |
| [app/admin/(protected)/challenge/page.tsx:66](../../app/admin/(protected)/challenge/page.tsx#L66) |   const [feeShop, setFeeShop] = useState(49); |
| [app/admin/(protected)/challenge/page.tsx:67](../../app/admin/(protected)/challenge/page.tsx#L67) |   const [ivaRate, setIvaRate] = useState(21); |
| [app/admin/(protected)/challenge/page.tsx:68](../../app/admin/(protected)/challenge/page.tsx#L68) |   const [prizeBarberValue, setPrizeBarberValue] = useState(12000); |
| [app/admin/(protected)/challenge/page.tsx:69](../../app/admin/(protected)/challenge/page.tsx#L69) |   const [prizeShopValue, setPrizeShopValue] = useState(100000); |
| [app/admin/(protected)/challenge/page.tsx:70](../../app/admin/(protected)/challenge/page.tsx#L70) |   const [eventDate, setEventDate] = useState('2026-09-17T20:00:00+02:00'); |
| [app/admin/(protected)/challenge/page.tsx:71](../../app/admin/(protected)/challenge/page.tsx#L71) |   const [showHomepageBox, setShowHomepageBox] = useState(true); |
| [app/admin/(protected)/challenge/page.tsx:72](../../app/admin/(protected)/challenge/page.tsx#L72) |   const [challengeMode, setChallengeMode] = useState(false); |
| [app/admin/(protected)/challenge/page.tsx:73](../../app/admin/(protected)/challenge/page.tsx#L73) |   const [challengeModeEndDate, setChallengeModeEndDate] = useState(''); |
| [app/admin/(protected)/challenge/page.tsx:75](../../app/admin/(protected)/challenge/page.tsx#L75) |   const [uploadingLabel, setUploadingLabel] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/challenge/page.tsx:78](../../app/admin/(protected)/challenge/page.tsx#L78) |   const [submissions, setSubmissions] = useState&lt;(ChallengeSubmission & { id: string })[]&gt;([]); |
| [app/admin/(protected)/challenge/page.tsx:79](../../app/admin/(protected)/challenge/page.tsx#L79) |   const [statusFilter, setStatusFilter] = useState&lt;ChallengeSubmission['status']&gt;( |
| [app/admin/(protected)/challenge/page.tsx:82](../../app/admin/(protected)/challenge/page.tsx#L82) |   const [loadingList, setLoadingList] = useState(false); |
| [app/admin/(protected)/challenge/page.tsx:83](../../app/admin/(protected)/challenge/page.tsx#L83) |   const [lastCursor, setLastCursor] = useState&lt;QueryDocumentSnapshot&lt;DocumentData&gt; \| null&gt;(null); |
| [app/admin/(protected)/challenge/page.tsx:84](../../app/admin/(protected)/challenge/page.tsx#L84) |   const [hasMore, setHasMore] = useState(true); |
| [app/admin/(protected)/challenge/page.tsx:85](../../app/admin/(protected)/challenge/page.tsx#L85) |   const [expandedId, setExpandedId] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/challenge/page.tsx:86](../../app/admin/(protected)/challenge/page.tsx#L86) |   const [showRejectFor, setShowRejectFor] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/challenge/page.tsx:87](../../app/admin/(protected)/challenge/page.tsx#L87) |   const [rejectionReasonInput, setRejectionReasonInput] = useState(''); |
| [app/admin/(protected)/challenge/page.tsx:88](../../app/admin/(protected)/challenge/page.tsx#L88) |   const [actioning, setActioning] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/challenge/page.tsx:115](../../app/admin/(protected)/challenge/page.tsx#L115) |           setShowHomepageBox(d.showHomepageBox ?? true); |
| [app/admin/(protected)/challenge/page.tsx:120](../../app/admin/(protected)/challenge/page.tsx#L120) |         console.error('Failed to load challenge settings:', e); |
| [app/admin/(protected)/challenge/page.tsx:121](../../app/admin/(protected)/challenge/page.tsx#L121) |         toast.error('Failed to load challenge settings.'); |
| [app/admin/(protected)/challenge/page.tsx:130](../../app/admin/(protected)/challenge/page.tsx#L130) |     if (loadingList) return; |
| [app/admin/(protected)/challenge/page.tsx:153](../../app/admin/(protected)/challenge/page.tsx#L153) |       toast.error(msg); |
| [app/admin/(protected)/challenge/page.tsx:157](../../app/admin/(protected)/challenge/page.tsx#L157) |   }, [statusFilter, lastCursor, loadingList]); |
| [app/admin/(protected)/challenge/page.tsx:209](../../app/admin/(protected)/challenge/page.tsx#L209) |       toast.error(msg); |
| [app/admin/(protected)/challenge/page.tsx:219](../../app/admin/(protected)/challenge/page.tsx#L219) |       toast.error('Please provide a reason.'); |
| [app/admin/(protected)/challenge/page.tsx:262](../../app/admin/(protected)/challenge/page.tsx#L262) |       toast.error(msg); |
| [app/admin/(protected)/challenge/page.tsx:290](../../app/admin/(protected)/challenge/page.tsx#L290) |       console.error('Failed to delete submission:', err); |
| [app/admin/(protected)/challenge/page.tsx:303](../../app/admin/(protected)/challenge/page.tsx#L303) |       toast.error('Submissions open date must be before submissions close date.'); |
| [app/admin/(protected)/challenge/page.tsx:307](../../app/admin/(protected)/challenge/page.tsx#L307) |       toast.error('Voting open date must be before voting close date.'); |
| [app/admin/(protected)/challenge/page.tsx:311](../../app/admin/(protected)/challenge/page.tsx#L311) |       toast.error('Submissions must close on or before voting opens.'); |
| [app/admin/(protected)/challenge/page.tsx:315](../../app/admin/(protected)/challenge/page.tsx#L315) |       toast.error('Fees and prize values must be 0 or greater.'); |
| [app/admin/(protected)/challenge/page.tsx:319](../../app/admin/(protected)/challenge/page.tsx#L319) |       toast.error('Fake counter values must be 0 or greater.'); |
| [app/admin/(protected)/challenge/page.tsx:345](../../app/admin/(protected)/challenge/page.tsx#L345) |           showHomepageBox, |
| [app/admin/(protected)/challenge/page.tsx:353](../../app/admin/(protected)/challenge/page.tsx#L353) |       console.error(e); |
| [app/admin/(protected)/challenge/page.tsx:354](../../app/admin/(protected)/challenge/page.tsx#L354) |       toast.error('Failed to save challenge settings.'); |
| [app/admin/(protected)/challenge/page.tsx:362](../../app/admin/(protected)/challenge/page.tsx#L362) |       toast.error('File must be an image.'); |
| [app/admin/(protected)/challenge/page.tsx:366](../../app/admin/(protected)/challenge/page.tsx#L366) |       toast.error('Image must be under 5MB.'); |
| [app/admin/(protected)/challenge/page.tsx:369](../../app/admin/(protected)/challenge/page.tsx#L369) |     setUploadingLabel(label); |
| [app/admin/(protected)/challenge/page.tsx:373](../../app/admin/(protected)/challenge/page.tsx#L373) |         toast.error('Not authenticated.'); |
| [app/admin/(protected)/challenge/page.tsx:374](../../app/admin/(protected)/challenge/page.tsx#L374) |         setUploadingLabel(null); |
| [app/admin/(protected)/challenge/page.tsx:387](../../app/admin/(protected)/challenge/page.tsx#L387) |         toast.error(json?.error \|\| 'Upload failed.'); |
| [app/admin/(protected)/challenge/page.tsx:397](../../app/admin/(protected)/challenge/page.tsx#L397) |       console.error(e); |
| [app/admin/(protected)/challenge/page.tsx:398](../../app/admin/(protected)/challenge/page.tsx#L398) |       toast.error(e?.message \|\| 'Upload failed.'); |
| [app/admin/(protected)/challenge/page.tsx:400](../../app/admin/(protected)/challenge/page.tsx#L400) |       setUploadingLabel(null); |
| [app/admin/(protected)/challenge/page.tsx:508](../../app/admin/(protected)/challenge/page.tsx#L508) |           {loadingList && submissions.length === 0 && ( |
| [app/admin/(protected)/challenge/page.tsx:513](../../app/admin/(protected)/challenge/page.tsx#L513) |           {!loadingList && submissions.length === 0 && ( |
| [app/admin/(protected)/challenge/page.tsx:538](../../app/admin/(protected)/challenge/page.tsx#L538) |                   src={sub.submitterAvatarUrl \|\| '/placeholder-avatar.png'} |
| [app/admin/(protected)/challenge/page.tsx:671](../../app/admin/(protected)/challenge/page.tsx#L671) |                         disabled={actioning === sub.id} |
| [app/admin/(protected)/challenge/page.tsx:709](../../app/admin/(protected)/challenge/page.tsx#L709) |                   {showRejectFor === sub.id && ( |
| [app/admin/(protected)/challenge/page.tsx:717](../../app/admin/(protected)/challenge/page.tsx#L717) |                         placeholder="e.g. Payment not received, photo quality too low, etc." |
| [app/admin/(protected)/challenge/page.tsx:736](../../app/admin/(protected)/challenge/page.tsx#L736) |                           disabled={!rejectionReasonInput.trim() \|\| actioning === sub.id} |
| [app/admin/(protected)/challenge/page.tsx:801](../../app/admin/(protected)/challenge/page.tsx#L801) |                 disabled={loadingList} |
| [app/admin/(protected)/challenge/page.tsx:810](../../app/admin/(protected)/challenge/page.tsx#L810) |                   cursor: loadingList ? 'not-allowed' : 'pointer', |
| [app/admin/(protected)/challenge/page.tsx:814](../../app/admin/(protected)/challenge/page.tsx#L814) |                 {loadingList ? 'Loading...' : 'Load more'} |
| [app/admin/(protected)/challenge/page.tsx:822](../../app/admin/(protected)/challenge/page.tsx#L822) |         loading ? ( |
| [app/admin/(protected)/challenge/page.tsx:900](../../app/admin/(protected)/challenge/page.tsx#L900) |                   placeholder="ES00 0000 0000 0000 0000 0000" |
| [app/admin/(protected)/challenge/page.tsx:911](../../app/admin/(protected)/challenge/page.tsx#L911) |                   placeholder="Ibrahim Mellouli" |
| [app/admin/(protected)/challenge/page.tsx:1009](../../app/admin/(protected)/challenge/page.tsx#L1009) |                   onClick={() =&gt; setShowHomepageBox(!showHomepageBox)} |
| [app/admin/(protected)/challenge/page.tsx:1010](../../app/admin/(protected)/challenge/page.tsx#L1010) |                   className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${showHomepageBox ? 'bg-black' : 'bg-gray-300'}`} |
| [app/admin/(protected)/challenge/page.tsx:1012](../../app/admin/(protected)/challenge/page.tsx#L1012) |                   &lt;span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${showHomepageBox ? 'translate-x-6' : 'translate-x-1'}`} /&gt; |
| [app/admin/(protected)/challenge/page.tsx:1045](../../app/admin/(protected)/challenge/page.tsx#L1045) |                   placeholder="e.g. July 1, 2026" |
| [app/admin/(protected)/challenge/page.tsx:1057](../../app/admin/(protected)/challenge/page.tsx#L1057) |                   const uploading = uploadingLabel === label; |
| [app/admin/(protected)/challenge/page.tsx:1078](../../app/admin/(protected)/challenge/page.tsx#L1078) |                         disabled={uploading} |
| [app/admin/(protected)/challenge/page.tsx:1086](../../app/admin/(protected)/challenge/page.tsx#L1086) |                       {uploading && &lt;div style={{ fontSize: 11, color: '#F5C518', marginTop: 6 }}&gt;Uploading…&lt;/div&gt;} |
| [app/admin/(protected)/challenge/page.tsx:1104](../../app/admin/(protected)/challenge/page.tsx#L1104) |                 disabled={saving} |
| [app/admin/(protected)/clients/page.tsx:3](../../app/admin/(protected)/clients/page.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [app/admin/(protected)/clients/page.tsx:55](../../app/admin/(protected)/clients/page.tsx#L55) |   const [clients, setClients] = useState&lt;ClientRow[]&gt;([]); |
| [app/admin/(protected)/clients/page.tsx:56](../../app/admin/(protected)/clients/page.tsx#L56) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/clients/page.tsx:57](../../app/admin/(protected)/clients/page.tsx#L57) |   const [search, setSearch] = useState(''); |
| [app/admin/(protected)/clients/page.tsx:58](../../app/admin/(protected)/clients/page.tsx#L58) |   const [page, setPage] = useState(1); |
| [app/admin/(protected)/clients/page.tsx:59](../../app/admin/(protected)/clients/page.tsx#L59) |   const [expandedId, setExpandedId] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/clients/page.tsx:60](../../app/admin/(protected)/clients/page.tsx#L60) |   const [expandedBookings, setExpandedBookings] = useState&lt;Record&lt;string, ClientBooking[]&gt;&gt;({}); |
| [app/admin/(protected)/clients/page.tsx:61](../../app/admin/(protected)/clients/page.tsx#L61) |   const [loadingBookings, setLoadingBookings] = useState&lt;Record&lt;string, boolean&gt;&gt;({}); |
| [app/admin/(protected)/clients/page.tsx:62](../../app/admin/(protected)/clients/page.tsx#L62) |   const [suspendingId, setSuspendingId] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/clients/page.tsx:63](../../app/admin/(protected)/clients/page.tsx#L63) |   const [deleteConfirmId, setDeleteConfirmId] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/clients/page.tsx:64](../../app/admin/(protected)/clients/page.tsx#L64) |   const [deletingId, setDeletingId] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/clients/page.tsx:104](../../app/admin/(protected)/clients/page.tsx#L104) |         console.error('Clients fetch error:', err); |
| [app/admin/(protected)/clients/page.tsx:178](../../app/admin/(protected)/clients/page.tsx#L178) |         console.error('Client bookings fetch error:', err); |
| [app/admin/(protected)/clients/page.tsx:197](../../app/admin/(protected)/clients/page.tsx#L197) |       console.error('Suspend error:', err); |
| [app/admin/(protected)/clients/page.tsx:198](../../app/admin/(protected)/clients/page.tsx#L198) |       toast.error('Failed to update client'); |
| [app/admin/(protected)/clients/page.tsx:226](../../app/admin/(protected)/clients/page.tsx#L226) |       console.error('Delete error:', err); |
| [app/admin/(protected)/clients/page.tsx:227](../../app/admin/(protected)/clients/page.tsx#L227) |       toast.error('Failed to delete client'); |
| [app/admin/(protected)/clients/page.tsx:240](../../app/admin/(protected)/clients/page.tsx#L240) |           {loading ? '…' : `${clients.length} total`} |
| [app/admin/(protected)/clients/page.tsx:248](../../app/admin/(protected)/clients/page.tsx#L248) |           placeholder="Search by name or email…" |
| [app/admin/(protected)/clients/page.tsx:266](../../app/admin/(protected)/clients/page.tsx#L266) |       {!loading && paginated.length &gt; 0 && ( |
| [app/admin/(protected)/clients/page.tsx:285](../../app/admin/(protected)/clients/page.tsx#L285) |       {loading ? ( |
| [app/admin/(protected)/clients/page.tsx:416](../../app/admin/(protected)/clients/page.tsx#L416) |                     {loadingBookings[client.id] ? ( |
| [app/admin/(protected)/clients/page.tsx:465](../../app/admin/(protected)/clients/page.tsx#L465) |                       disabled={suspendingId === client.id} |
| [app/admin/(protected)/clients/page.tsx:527](../../app/admin/(protected)/clients/page.tsx#L527) |                         disabled={deletingId === client.id} |
| [app/admin/(protected)/clients/page.tsx:556](../../app/admin/(protected)/clients/page.tsx#L556) |             disabled={page === 1} |
| [app/admin/(protected)/clients/page.tsx:573](../../app/admin/(protected)/clients/page.tsx#L573) |             disabled={page === totalPages} |
| [app/admin/(protected)/fake-data/page.tsx:3](../../app/admin/(protected)/fake-data/page.tsx#L3) | import { useEffect, useState } from 'react'; |
| [app/admin/(protected)/fake-data/page.tsx:8](../../app/admin/(protected)/fake-data/page.tsx#L8) |   const [enabled, setEnabled] = useState&lt;boolean \| null&gt;(null); |
| [app/admin/(protected)/fake-data/page.tsx:9](../../app/admin/(protected)/fake-data/page.tsx#L9) |   const [saving, setSaving] = useState(false); |
| [app/admin/(protected)/fake-data/page.tsx:10](../../app/admin/(protected)/fake-data/page.tsx#L10) |   const [errorMsg, setErrorMsg] = useState(''); |
| [app/admin/(protected)/fake-data/page.tsx:20](../../app/admin/(protected)/fake-data/page.tsx#L20) |         const val = (snap.data() as { showFakeUIData?: boolean }).showFakeUIData; |
| [app/admin/(protected)/fake-data/page.tsx:23](../../app/admin/(protected)/fake-data/page.tsx#L23) |         console.error(err); |
| [app/admin/(protected)/fake-data/page.tsx:36](../../app/admin/(protected)/fake-data/page.tsx#L36) |       await setDoc(doc(db, 'siteConfig', 'global'), { showFakeUIData: next }, { merge: true }); |
| [app/admin/(protected)/fake-data/page.tsx:39](../../app/admin/(protected)/fake-data/page.tsx#L39) |       console.error(err); |
| [app/admin/(protected)/fake-data/page.tsx:58](../../app/admin/(protected)/fake-data/page.tsx#L58) |       {errorMsg && ( |
| [app/admin/(protected)/fake-data/page.tsx:71](../../app/admin/(protected)/fake-data/page.tsx#L71) |           {errorMsg} |
| [app/admin/(protected)/fake-data/page.tsx:90](../../app/admin/(protected)/fake-data/page.tsx#L90) |             disabled={enabled === null \|\| saving} |
| [app/admin/(protected)/featured/page.tsx:3](../../app/admin/(protected)/featured/page.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [app/admin/(protected)/featured/page.tsx:46](../../app/admin/(protected)/featured/page.tsx#L46) |   const [featuredBarbers, setFeaturedBarbers] = useState&lt;FeaturedBarber[]&gt;([]); |
| [app/admin/(protected)/featured/page.tsx:47](../../app/admin/(protected)/featured/page.tsx#L47) |   const [allBarbers, setAllBarbers] = useState&lt;FeaturedBarber[]&gt;([]); |
| [app/admin/(protected)/featured/page.tsx:48](../../app/admin/(protected)/featured/page.tsx#L48) |   const [featuredShops, setFeaturedShops] = useState&lt;FeaturedShop[]&gt;([]); |
| [app/admin/(protected)/featured/page.tsx:49](../../app/admin/(protected)/featured/page.tsx#L49) |   const [allShops, setAllShops] = useState&lt;FeaturedShop[]&gt;([]); |
| [app/admin/(protected)/featured/page.tsx:50](../../app/admin/(protected)/featured/page.tsx#L50) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/featured/page.tsx:51](../../app/admin/(protected)/featured/page.tsx#L51) |   const [showBarberSearch, setShowBarberSearch] = useState(false); |
| [app/admin/(protected)/featured/page.tsx:52](../../app/admin/(protected)/featured/page.tsx#L52) |   const [showShopSearch, setShowShopSearch] = useState(false); |
| [app/admin/(protected)/featured/page.tsx:53](../../app/admin/(protected)/featured/page.tsx#L53) |   const [barberSearchQuery, setBarberSearchQuery] = useState(''); |
| [app/admin/(protected)/featured/page.tsx:54](../../app/admin/(protected)/featured/page.tsx#L54) |   const [shopSearchQuery, setShopSearchQuery] = useState(''); |
| [app/admin/(protected)/featured/page.tsx:55](../../app/admin/(protected)/featured/page.tsx#L55) |   const [savingId, setSavingId] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/featured/page.tsx:191](../../app/admin/(protected)/featured/page.tsx#L191) |         console.error('Featured load error:', err); |
| [app/admin/(protected)/featured/page.tsx:240](../../app/admin/(protected)/featured/page.tsx#L240) |       console.error('Add featured barber error:', err); |
| [app/admin/(protected)/featured/page.tsx:241](../../app/admin/(protected)/featured/page.tsx#L241) |       toast.error('Failed to feature barber'); |
| [app/admin/(protected)/featured/page.tsx:257](../../app/admin/(protected)/featured/page.tsx#L257) |       console.error('Remove featured barber error:', err); |
| [app/admin/(protected)/featured/page.tsx:258](../../app/admin/(protected)/featured/page.tsx#L258) |       toast.error('Failed to remove'); |
| [app/admin/(protected)/featured/page.tsx:278](../../app/admin/(protected)/featured/page.tsx#L278) |       console.error('Add featured shop error:', err); |
| [app/admin/(protected)/featured/page.tsx:279](../../app/admin/(protected)/featured/page.tsx#L279) |       toast.error('Failed to feature shop'); |
| [app/admin/(protected)/featured/page.tsx:295](../../app/admin/(protected)/featured/page.tsx#L295) |       console.error('Remove featured shop error:', err); |
| [app/admin/(protected)/featured/page.tsx:296](../../app/admin/(protected)/featured/page.tsx#L296) |       toast.error('Failed to remove'); |
| [app/admin/(protected)/featured/page.tsx:302](../../app/admin/(protected)/featured/page.tsx#L302) |   if (loading) { |
| [app/admin/(protected)/featured/page.tsx:324](../../app/admin/(protected)/featured/page.tsx#L324) |               background: showBarberSearch ? '#1a1200' : '#111', |
| [app/admin/(protected)/featured/page.tsx:325](../../app/admin/(protected)/featured/page.tsx#L325) |               border: `1px solid ${showBarberSearch ? '#F5C518' : '#2a2a2a'}`, |
| [app/admin/(protected)/featured/page.tsx:330](../../app/admin/(protected)/featured/page.tsx#L330) |               color: showBarberSearch ? '#F5C518' : '#888', |
| [app/admin/(protected)/featured/page.tsx:334](../../app/admin/(protected)/featured/page.tsx#L334) |             {showBarberSearch ? '✕ Cancel' : '+ Add featured barber'} |
| [app/admin/(protected)/featured/page.tsx:339](../../app/admin/(protected)/featured/page.tsx#L339) |         {showBarberSearch && ( |
| [app/admin/(protected)/featured/page.tsx:343](../../app/admin/(protected)/featured/page.tsx#L343) |               placeholder="Search live barbers by name or city…" |
| [app/admin/(protected)/featured/page.tsx:378](../../app/admin/(protected)/featured/page.tsx#L378) |                     disabled={savingId === b.id} |
| [app/admin/(protected)/featured/page.tsx:468](../../app/admin/(protected)/featured/page.tsx#L468) |                   disabled={savingId === b.id} |
| [app/admin/(protected)/featured/page.tsx:498](../../app/admin/(protected)/featured/page.tsx#L498) |               background: showShopSearch ? '#1a1200' : '#111', |
| [app/admin/(protected)/featured/page.tsx:499](../../app/admin/(protected)/featured/page.tsx#L499) |               border: `1px solid ${showShopSearch ? '#F5C518' : '#2a2a2a'}`, |
| [app/admin/(protected)/featured/page.tsx:504](../../app/admin/(protected)/featured/page.tsx#L504) |               color: showShopSearch ? '#F5C518' : '#888', |
| [app/admin/(protected)/featured/page.tsx:508](../../app/admin/(protected)/featured/page.tsx#L508) |             {showShopSearch ? '✕ Cancel' : '+ Add featured shop'} |
| [app/admin/(protected)/featured/page.tsx:513](../../app/admin/(protected)/featured/page.tsx#L513) |         {showShopSearch && ( |
| [app/admin/(protected)/featured/page.tsx:517](../../app/admin/(protected)/featured/page.tsx#L517) |               placeholder="Search active shops by name or city…" |
| [app/admin/(protected)/featured/page.tsx:552](../../app/admin/(protected)/featured/page.tsx#L552) |                     disabled={savingId === s.id} |
| [app/admin/(protected)/featured/page.tsx:624](../../app/admin/(protected)/featured/page.tsx#L624) |                   disabled={savingId === s.id} |
| [app/admin/(protected)/layout.tsx:42](../../app/admin/(protected)/layout.tsx#L42) |       console.error(e); |
| [app/admin/(protected)/messages/page.tsx:3](../../app/admin/(protected)/messages/page.tsx#L3) | import { useEffect, useState } from 'react'; |
| [app/admin/(protected)/messages/page.tsx:32](../../app/admin/(protected)/messages/page.tsx#L32) |   const [messages, setMessages] = useState&lt;ContactMessage[]&gt;([]); |
| [app/admin/(protected)/messages/page.tsx:33](../../app/admin/(protected)/messages/page.tsx#L33) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/messages/page.tsx:56](../../app/admin/(protected)/messages/page.tsx#L56) |         console.error('Failed to load contact messages:', err); |
| [app/admin/(protected)/messages/page.tsx:69](../../app/admin/(protected)/messages/page.tsx#L69) |       console.error('Failed to mark as read:', err); |
| [app/admin/(protected)/messages/page.tsx:78](../../app/admin/(protected)/messages/page.tsx#L78) |       console.error('Failed to delete message:', err); |
| [app/admin/(protected)/messages/page.tsx:98](../../app/admin/(protected)/messages/page.tsx#L98) |       {loading ? ( |
| [app/admin/(protected)/page.tsx:3](../../app/admin/(protected)/page.tsx#L3) | import { useState, useEffect } from 'react'; |
| [app/admin/(protected)/page.tsx:38](../../app/admin/(protected)/page.tsx#L38) |     console.error('Migration migrateApprovalStatus failed:', err); |
| [app/admin/(protected)/page.tsx:113](../../app/admin/(protected)/page.tsx#L113) |   const [stats, setStats] = useState&lt;Stats&gt;({ |
| [app/admin/(protected)/page.tsx:125](../../app/admin/(protected)/page.tsx#L125) |   const [recentActivity, setRecentActivity] = useState&lt;ActivityItem[]&gt;([]); |
| [app/admin/(protected)/page.tsx:126](../../app/admin/(protected)/page.tsx#L126) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/page.tsx:129](../../app/admin/(protected)/page.tsx#L129) |     // Run migration first (no-op if already done or localStorage flag set) |
| [app/admin/(protected)/page.tsx:204](../../app/admin/(protected)/page.tsx#L204) |         console.error('Admin overview fetch error:', err); |
| [app/admin/(protected)/page.tsx:300](../../app/admin/(protected)/page.tsx#L300) |       {loading ? ( |
| [app/admin/(protected)/reviews/page.tsx:3](../../app/admin/(protected)/reviews/page.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [app/admin/(protected)/reviews/page.tsx:54](../../app/admin/(protected)/reviews/page.tsx#L54) |   const [reviews, setReviews] = useState&lt;ReviewRow[]&gt;([]); |
| [app/admin/(protected)/reviews/page.tsx:55](../../app/admin/(protected)/reviews/page.tsx#L55) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/reviews/page.tsx:56](../../app/admin/(protected)/reviews/page.tsx#L56) |   const [ratingFilter, setRatingFilter] = useState&lt;0 \| 1 \| 2 \| 3 \| 4 \| 5&gt;(0); |
| [app/admin/(protected)/reviews/page.tsx:57](../../app/admin/(protected)/reviews/page.tsx#L57) |   const [showFlagged, setShowFlagged] = useState(false); |
| [app/admin/(protected)/reviews/page.tsx:58](../../app/admin/(protected)/reviews/page.tsx#L58) |   const [page, setPage] = useState(1); |
| [app/admin/(protected)/reviews/page.tsx:59](../../app/admin/(protected)/reviews/page.tsx#L59) |   const [deleteConfirmId, setDeleteConfirmId] = useState&lt;string \| null&gt;(null); |
| [app/admin/(protected)/reviews/page.tsx:60](../../app/admin/(protected)/reviews/page.tsx#L60) |   const [deleting, setDeleting] = useState(false); |
| [app/admin/(protected)/reviews/page.tsx:118](../../app/admin/(protected)/reviews/page.tsx#L118) |         console.error('Reviews fetch error:', err); |
| [app/admin/(protected)/reviews/page.tsx:130](../../app/admin/(protected)/reviews/page.tsx#L130) |     if (showFlagged) { |
| [app/admin/(protected)/reviews/page.tsx:139](../../app/admin/(protected)/reviews/page.tsx#L139) |   }, [reviews, showFlagged, ratingFilter]); |
| [app/admin/(protected)/reviews/page.tsx:162](../../app/admin/(protected)/reviews/page.tsx#L162) |       console.error('Rating recalc error:', err); |
| [app/admin/(protected)/reviews/page.tsx:178](../../app/admin/(protected)/reviews/page.tsx#L178) |       console.error('Delete review error:', err); |
| [app/admin/(protected)/reviews/page.tsx:179](../../app/admin/(protected)/reviews/page.tsx#L179) |       toast.error('Failed to delete review'); |
| [app/admin/(protected)/reviews/page.tsx:197](../../app/admin/(protected)/reviews/page.tsx#L197) |       console.error('Flag error:', err); |
| [app/admin/(protected)/reviews/page.tsx:198](../../app/admin/(protected)/reviews/page.tsx#L198) |       toast.error('Failed to update flag'); |
| [app/admin/(protected)/reviews/page.tsx:209](../../app/admin/(protected)/reviews/page.tsx#L209) |           {loading ? '…' : `${reviews.length} total`} |
| [app/admin/(protected)/reviews/page.tsx:241](../../app/admin/(protected)/reviews/page.tsx#L241) |             background: showFlagged ? '#1a0f00' : '#111', |
| [app/admin/(protected)/reviews/page.tsx:242](../../app/admin/(protected)/reviews/page.tsx#L242) |             border: `1px solid ${showFlagged ? '#E8491D' : '#1e1e1e'}`, |
| [app/admin/(protected)/reviews/page.tsx:247](../../app/admin/(protected)/reviews/page.tsx#L247) |             color: showFlagged ? '#E8491D' : '#555', |
| [app/admin/(protected)/reviews/page.tsx:256](../../app/admin/(protected)/reviews/page.tsx#L256) |       {loading ? ( |
| [app/admin/(protected)/reviews/page.tsx:371](../../app/admin/(protected)/reviews/page.tsx#L371) |                       disabled={deleting} |
| [app/admin/(protected)/reviews/page.tsx:399](../../app/admin/(protected)/reviews/page.tsx#L399) |             disabled={page === 1} |
| [app/admin/(protected)/reviews/page.tsx:416](../../app/admin/(protected)/reviews/page.tsx#L416) |             disabled={page === totalPages} |
| [app/admin/(protected)/settings/page.tsx:3](../../app/admin/(protected)/settings/page.tsx#L3) | import { useState, useEffect } from 'react'; |
| [app/admin/(protected)/settings/page.tsx:8](../../app/admin/(protected)/settings/page.tsx#L8) |   const [hideFeaturedSection, setHideFeaturedSection] = useState(false); |
| [app/admin/(protected)/settings/page.tsx:9](../../app/admin/(protected)/settings/page.tsx#L9) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/settings/page.tsx:10](../../app/admin/(protected)/settings/page.tsx#L10) |   const [saving, setSaving] = useState(false); |
| [app/admin/(protected)/settings/page.tsx:20](../../app/admin/(protected)/settings/page.tsx#L20) |         console.error('Failed to load site config:', err); |
| [app/admin/(protected)/settings/page.tsx:40](../../app/admin/(protected)/settings/page.tsx#L40) |       console.error('Failed to update site config:', err); |
| [app/admin/(protected)/settings/page.tsx:58](../../app/admin/(protected)/settings/page.tsx#L58) |       {loading ? ( |
| [app/admin/(protected)/settings/page.tsx:95](../../app/admin/(protected)/settings/page.tsx#L95) |               disabled={saving} |
| [app/admin/(protected)/shops/page.tsx:3](../../app/admin/(protected)/shops/page.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [app/admin/(protected)/shops/page.tsx:77](../../app/admin/(protected)/shops/page.tsx#L77) |   const [shops, setShops] = useState&lt;EnrichedShop[]&gt;([]); |
| [app/admin/(protected)/shops/page.tsx:78](../../app/admin/(protected)/shops/page.tsx#L78) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/shops/page.tsx:79](../../app/admin/(protected)/shops/page.tsx#L79) |   const [tab, setTab] = useState&lt;Tab&gt;('pending'); |
| [app/admin/(protected)/shops/page.tsx:80](../../app/admin/(protected)/shops/page.tsx#L80) |   const [search, setSearch] = useState(''); |
| [app/admin/(protected)/shops/page.tsx:81](../../app/admin/(protected)/shops/page.tsx#L81) |   const [page, setPage] = useState(1); |
| [app/admin/(protected)/shops/page.tsx:82](../../app/admin/(protected)/shops/page.tsx#L82) |   const [counts, setCounts] = useState&lt;Counts&gt;({ pending: 0, active: 0, suspended: 0, all: 0 }); |
| [app/admin/(protected)/shops/page.tsx:118](../../app/admin/(protected)/shops/page.tsx#L118) |                 // user not found |
| [app/admin/(protected)/shops/page.tsx:144](../../app/admin/(protected)/shops/page.tsx#L144) |         console.error('Shops fetch error:', err); |
| [app/admin/(protected)/shops/page.tsx:224](../../app/admin/(protected)/shops/page.tsx#L224) |           placeholder="Search by name, owner, or city…" |
| [app/admin/(protected)/shops/page.tsx:242](../../app/admin/(protected)/shops/page.tsx#L242) |       {loading ? ( |
| [app/admin/(protected)/shops/page.tsx:340](../../app/admin/(protected)/shops/page.tsx#L340) |             disabled={page === 1} |
| [app/admin/(protected)/shops/page.tsx:357](../../app/admin/(protected)/shops/page.tsx#L357) |             disabled={page === totalPages} |
| [app/admin/(protected)/shops/[id]/page.tsx:3](../../app/admin/(protected)/shops/[id]/page.tsx#L3) | import { useState, useEffect, use } from 'react'; |
| [app/admin/(protected)/shops/[id]/page.tsx:102](../../app/admin/(protected)/shops/[id]/page.tsx#L102) |   const [shop, setShop] = useState&lt;ShopData \| null&gt;(null); |
| [app/admin/(protected)/shops/[id]/page.tsx:103](../../app/admin/(protected)/shops/[id]/page.tsx#L103) |   const [owner, setOwner] = useState&lt;OwnerData \| null&gt;(null); |
| [app/admin/(protected)/shops/[id]/page.tsx:104](../../app/admin/(protected)/shops/[id]/page.tsx#L104) |   const [bookings, setBookings] = useState&lt;BookingItem[]&gt;([]); |
| [app/admin/(protected)/shops/[id]/page.tsx:105](../../app/admin/(protected)/shops/[id]/page.tsx#L105) |   const [teamBarbers, setTeamBarbers] = useState&lt;BarberItem[]&gt;([]); |
| [app/admin/(protected)/shops/[id]/page.tsx:106](../../app/admin/(protected)/shops/[id]/page.tsx#L106) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/shops/[id]/page.tsx:107](../../app/admin/(protected)/shops/[id]/page.tsx#L107) |   const [rejectionReason, setRejectionReason] = useState(''); |
| [app/admin/(protected)/shops/[id]/page.tsx:108](../../app/admin/(protected)/shops/[id]/page.tsx#L108) |   const [showRejectForm, setShowRejectForm] = useState(false); |
| [app/admin/(protected)/shops/[id]/page.tsx:109](../../app/admin/(protected)/shops/[id]/page.tsx#L109) |   const [saving, setSaving] = useState(false); |
| [app/admin/(protected)/shops/[id]/page.tsx:162](../../app/admin/(protected)/shops/[id]/page.tsx#L162) |       console.error('Shop detail fetch error:', err); |
| [app/admin/(protected)/shops/[id]/page.tsx:200](../../app/admin/(protected)/shops/[id]/page.tsx#L200) |       console.error('Approve error:', err); |
| [app/admin/(protected)/shops/[id]/page.tsx:201](../../app/admin/(protected)/shops/[id]/page.tsx#L201) |       toast.error('Failed to approve'); |
| [app/admin/(protected)/shops/[id]/page.tsx:235](../../app/admin/(protected)/shops/[id]/page.tsx#L235) |       console.error('Reject error:', err); |
| [app/admin/(protected)/shops/[id]/page.tsx:236](../../app/admin/(protected)/shops/[id]/page.tsx#L236) |       toast.error('Failed to reject'); |
| [app/admin/(protected)/shops/[id]/page.tsx:262](../../app/admin/(protected)/shops/[id]/page.tsx#L262) |       console.error('Suspend error:', err); |
| [app/admin/(protected)/shops/[id]/page.tsx:263](../../app/admin/(protected)/shops/[id]/page.tsx#L263) |       toast.error('Failed to suspend'); |
| [app/admin/(protected)/shops/[id]/page.tsx:276](../../app/admin/(protected)/shops/[id]/page.tsx#L276) |       console.error('Reactivate error:', err); |
| [app/admin/(protected)/shops/[id]/page.tsx:277](../../app/admin/(protected)/shops/[id]/page.tsx#L277) |       toast.error('Failed to reactivate'); |
| [app/admin/(protected)/shops/[id]/page.tsx:283](../../app/admin/(protected)/shops/[id]/page.tsx#L283) |   if (loading) { |
| [app/admin/(protected)/shops/[id]/page.tsx:288](../../app/admin/(protected)/shops/[id]/page.tsx#L288) |     return &lt;div style={{ color: '#EF4444', fontSize: 14, padding: 20 }}&gt;Shop not found.&lt;/div&gt;; |
| [app/admin/(protected)/shops/[id]/page.tsx:417](../../app/admin/(protected)/shops/[id]/page.tsx#L417) |                     disabled={saving} |
| [app/admin/(protected)/shops/[id]/page.tsx:425](../../app/admin/(protected)/shops/[id]/page.tsx#L425) |                     disabled={saving} |
| [app/admin/(protected)/shops/[id]/page.tsx:432](../../app/admin/(protected)/shops/[id]/page.tsx#L432) |                 {showRejectForm && ( |
| [app/admin/(protected)/shops/[id]/page.tsx:435](../../app/admin/(protected)/shops/[id]/page.tsx#L435) |                       placeholder="Reason for rejection…" |
| [app/admin/(protected)/shops/[id]/page.tsx:454](../../app/admin/(protected)/shops/[id]/page.tsx#L454) |                       disabled={saving \|\| !rejectionReason.trim()} |
| [app/admin/(protected)/shops/[id]/page.tsx:485](../../app/admin/(protected)/shops/[id]/page.tsx#L485) |                   disabled={saving} |
| [app/admin/(protected)/shops/[id]/page.tsx:500](../../app/admin/(protected)/shops/[id]/page.tsx#L500) |                   disabled={saving} |
| [app/admin/(protected)/shops/[id]/page.tsx:520](../../app/admin/(protected)/shops/[id]/page.tsx#L520) |                   disabled={saving} |
| [app/admin/(protected)/team/page.tsx:3](../../app/admin/(protected)/team/page.tsx#L3) | import { useState, useEffect } from 'react'; |
| [app/admin/(protected)/team/page.tsx:37](../../app/admin/(protected)/team/page.tsx#L37) |   const [admins, setAdmins] = useState&lt;any[]&gt;([]); |
| [app/admin/(protected)/team/page.tsx:38](../../app/admin/(protected)/team/page.tsx#L38) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/team/page.tsx:41](../../app/admin/(protected)/team/page.tsx#L41) |   const [firstName, setFirstName] = useState(''); |
| [app/admin/(protected)/team/page.tsx:42](../../app/admin/(protected)/team/page.tsx#L42) |   const [lastName, setLastName] = useState(''); |
| [app/admin/(protected)/team/page.tsx:43](../../app/admin/(protected)/team/page.tsx#L43) |   const [email, setEmail] = useState(''); |
| [app/admin/(protected)/team/page.tsx:44](../../app/admin/(protected)/team/page.tsx#L44) |   const [tempPassword, setTempPassword] = useState(''); |
| [app/admin/(protected)/team/page.tsx:45](../../app/admin/(protected)/team/page.tsx#L45) |   const [perms, setPerms] = useState&lt;AdminPermissions&gt;({ ...DEFAULT_PERMS }); |
| [app/admin/(protected)/team/page.tsx:46](../../app/admin/(protected)/team/page.tsx#L46) |   const [creating, setCreating] = useState(false); |
| [app/admin/(protected)/team/page.tsx:47](../../app/admin/(protected)/team/page.tsx#L47) |   const [showForm, setShowForm] = useState(false); |
| [app/admin/(protected)/team/page.tsx:48](../../app/admin/(protected)/team/page.tsx#L48) |   const [createdCreds, setCreatedCreds] = useState&lt;{ email: string; password: string } \| null&gt;(null); |
| [app/admin/(protected)/team/page.tsx:58](../../app/admin/(protected)/team/page.tsx#L58) |       console.error(e); |
| [app/admin/(protected)/team/page.tsx:67](../../app/admin/(protected)/team/page.tsx#L67) |       toast.error("You can't remove yourself."); |
| [app/admin/(protected)/team/page.tsx:77](../../app/admin/(protected)/team/page.tsx#L77) |       toast.error('Failed to remove admin.'); |
| [app/admin/(protected)/team/page.tsx:78](../../app/admin/(protected)/team/page.tsx#L78) |       console.error(e); |
| [app/admin/(protected)/team/page.tsx:84](../../app/admin/(protected)/team/page.tsx#L84) |       toast.error('Fill in all fields.'); |
| [app/admin/(protected)/team/page.tsx:88](../../app/admin/(protected)/team/page.tsx#L88) |       toast.error('Password must be at least 8 characters.'); |
| [app/admin/(protected)/team/page.tsx:132](../../app/admin/(protected)/team/page.tsx#L132) |           // Wrong password or network error — AdminGuard will catch the |
| [app/admin/(protected)/team/page.tsx:134](../../app/admin/(protected)/team/page.tsx#L134) |           toast.error('Could not re-authenticate. Please log in again.'); |
| [app/admin/(protected)/team/page.tsx:148](../../app/admin/(protected)/team/page.tsx#L148) |       toast.error(msg); |
| [app/admin/(protected)/team/page.tsx:149](../../app/admin/(protected)/team/page.tsx#L149) |       console.error(e); |
| [app/admin/(protected)/team/page.tsx:193](../../app/admin/(protected)/team/page.tsx#L193) |         {loading ? ( |
| [app/admin/(protected)/team/page.tsx:230](../../app/admin/(protected)/team/page.tsx#L230) |       {!showForm ? ( |
| [app/admin/(protected)/team/page.tsx:242](../../app/admin/(protected)/team/page.tsx#L242) |               { placeholder: 'First name', value: firstName, set: setFirstName }, |
| [app/admin/(protected)/team/page.tsx:243](../../app/admin/(protected)/team/page.tsx#L243) |               { placeholder: 'Last name', value: lastName, set: setLastName }, |
| [app/admin/(protected)/team/page.tsx:245](../../app/admin/(protected)/team/page.tsx#L245) |               &lt;input key={f.placeholder} placeholder={f.placeholder} value={f.value} onChange={e =&gt; f.set(e.target.value)} |
| [app/admin/(protected)/team/page.tsx:250](../../app/admin/(protected)/team/page.tsx#L250) |             { placeholder: 'Email address', value: email, set: setEmail, type: 'email' }, |
| [app/admin/(protected)/team/page.tsx:251](../../app/admin/(protected)/team/page.tsx#L251) |             { placeholder: 'Temporary password (min 8 chars)', value: tempPassword, set: setTempPassword, type: 'text' }, |
| [app/admin/(protected)/team/page.tsx:253](../../app/admin/(protected)/team/page.tsx#L253) |             &lt;input key={f.placeholder} type={f.type} placeholder={f.placeholder} value={f.value} onChange={e =&gt; f.set(e.target.value)} |
| [app/admin/(protected)/team/page.tsx:270](../../app/admin/(protected)/team/page.tsx#L270) |             &lt;button onClick={handleCreate} disabled={creating} |
| [app/admin/(protected)/users/page.tsx:3](../../app/admin/(protected)/users/page.tsx#L3) | import { useEffect, useState } from 'react'; |
| [app/admin/(protected)/users/page.tsx:14](../../app/admin/(protected)/users/page.tsx#L14) |   const [stats, setStats] = useState&lt;UserStats&gt;({ total: 0, clients: 0, barbers: 0 }); |
| [app/admin/(protected)/users/page.tsx:15](../../app/admin/(protected)/users/page.tsx#L15) |   const [loading, setLoading] = useState(true); |
| [app/admin/(protected)/users/page.tsx:32](../../app/admin/(protected)/users/page.tsx#L32) |         console.error('Users counter listener error:', err); |
| [app/admin/(protected)/users/page.tsx:75](../../app/admin/(protected)/users/page.tsx#L75) |       {loading ? ( |
| [app/admin/login/page.tsx:3](../../app/admin/login/page.tsx#L3) | import { useState } from 'react'; |
| [app/admin/login/page.tsx:12](../../app/admin/login/page.tsx#L12) |   const [email, setEmail] = useState(''); |
| [app/admin/login/page.tsx:13](../../app/admin/login/page.tsx#L13) |   const [password, setPassword] = useState(''); |
| [app/admin/login/page.tsx:14](../../app/admin/login/page.tsx#L14) |   const [loading, setLoading] = useState(false); |
| [app/admin/login/page.tsx:15](../../app/admin/login/page.tsx#L15) |   const [error, setError] = useState(''); |
| [app/admin/login/page.tsx:38](../../app/admin/login/page.tsx#L38) |         console.error('[AdminLogin] ERROR: users/' + uid + ' document does not exist in Firestore'); |
| [app/admin/login/page.tsx:41](../../app/admin/login/page.tsx#L41) |           'User document not found. Make sure a Firestore document exists at users/' + |
| [app/admin/login/page.tsx:64](../../app/admin/login/page.tsx#L64) |       // FIX: always clear loading before navigating so if AdminGuard briefly |
| [app/admin/login/page.tsx:71](../../app/admin/login/page.tsx#L71) |       console.error('Admin login failed'); |
| [app/admin/login/page.tsx:89](../../app/admin/login/page.tsx#L89) |         setError('Error [' + (code \|\| 'unknown') + ']: ' + (err?.message \|\| 'An unexpected error occurred.')); |
| [app/admin/login/page.tsx:151](../../app/admin/login/page.tsx#L151) |             placeholder="Admin email" |
| [app/admin/login/page.tsx:160](../../app/admin/login/page.tsx#L160) |             placeholder="Password" |
| [app/admin/login/page.tsx:168](../../app/admin/login/page.tsx#L168) |           {error && ( |
| [app/admin/login/page.tsx:178](../../app/admin/login/page.tsx#L178) |               {error} |
| [app/admin/login/page.tsx:184](../../app/admin/login/page.tsx#L184) |             disabled={loading} |
| [app/admin/login/page.tsx:186](../../app/admin/login/page.tsx#L186) |               background: loading ? '#2a2000' : '#F5C518', |
| [app/admin/login/page.tsx:187](../../app/admin/login/page.tsx#L187) |               color: loading ? '#F5C518' : '#0a0a0a', |
| [app/admin/login/page.tsx:193](../../app/admin/login/page.tsx#L193) |               cursor: loading ? 'not-allowed' : 'pointer', |
| [app/admin/login/page.tsx:199](../../app/admin/login/page.tsx#L199) |             {loading ? 'Signing in...' : 'Sign in →'} |
| [app/api/admin/upload-reference-photo/route.ts:13](../../app/api/admin/upload-reference-photo/route.ts#L13) |       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); |
| [app/api/admin/upload-reference-photo/route.ts:17](../../app/api/admin/upload-reference-photo/route.ts#L17) |       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); |
| [app/api/admin/upload-reference-photo/route.ts:24](../../app/api/admin/upload-reference-photo/route.ts#L24) |       return NextResponse.json({ error: 'Admin SDK not initialized' }, { status: 500 }); |
| [app/api/admin/upload-reference-photo/route.ts:32](../../app/api/admin/upload-reference-photo/route.ts#L32) |       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); |
| [app/api/admin/upload-reference-photo/route.ts:39](../../app/api/admin/upload-reference-photo/route.ts#L39) |       return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); |
| [app/api/admin/upload-reference-photo/route.ts:47](../../app/api/admin/upload-reference-photo/route.ts#L47) |       return NextResponse.json({ error: 'Missing file' }, { status: 400 }); |
| [app/api/admin/upload-reference-photo/route.ts:51](../../app/api/admin/upload-reference-photo/route.ts#L51) |       return NextResponse.json({ error: 'Invalid label' }, { status: 400 }); |
| [app/api/admin/upload-reference-photo/route.ts:57](../../app/api/admin/upload-reference-photo/route.ts#L57) |       return NextResponse.json({ error: 'File must be an image' }, { status: 400 }); |
| [app/api/admin/upload-reference-photo/route.ts:61](../../app/api/admin/upload-reference-photo/route.ts#L61) |       return NextResponse.json({ error: 'Empty file' }, { status: 400 }); |
| [app/api/admin/upload-reference-photo/route.ts:64](../../app/api/admin/upload-reference-photo/route.ts#L64) |       return NextResponse.json({ error: 'File exceeds 5MB' }, { status: 400 }); |
| [app/api/admin/upload-reference-photo/route.ts:90](../../app/api/admin/upload-reference-photo/route.ts#L90) |     console.error('upload-reference-photo error:', err); |
| [app/api/admin/upload-reference-photo/route.ts:91](../../app/api/admin/upload-reference-photo/route.ts#L91) |     return NextResponse.json({ error: err?.message \|\| 'Upload failed' }, { status: 500 }); |
| [app/api/delete-account/route.ts:12](../../app/api/delete-account/route.ts#L12) |       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); |
| [app/api/delete-account/route.ts:73](../../app/api/delete-account/route.ts#L73) |     console.error('Delete API Error:', err); |
| [app/api/delete-account/route.ts:74](../../app/api/delete-account/route.ts#L74) |     return NextResponse.json({ error: err.message }, { status: 500 }); |
| [app/barber/[barberId]/BarberProfileClient.tsx:3](../../app/barber/[barberId]/BarberProfileClient.tsx#L3) | import { useState, useEffect, useRef } from 'react'; |
| [app/barber/[barberId]/BarberProfileClient.tsx:14](../../app/barber/[barberId]/BarberProfileClient.tsx#L14) | import { BarberProfileSkeleton } from '@/components/skeletons'; |
| [app/barber/[barberId]/BarberProfileClient.tsx:154](../../app/barber/[barberId]/BarberProfileClient.tsx#L154) |   const [lightboxPhoto, setLightboxPhoto] = useState&lt;string \| null&gt;(null); |
| [app/barber/[barberId]/BarberProfileClient.tsx:155](../../app/barber/[barberId]/BarberProfileClient.tsx#L155) |   const [showFakeModal, setShowFakeModal] = useState(false); |
| [app/barber/[barberId]/BarberProfileClient.tsx:156](../../app/barber/[barberId]/BarberProfileClient.tsx#L156) |   const [bookingContext, setBookingContext] = useState&lt;'solo' \| 'shop'&gt;('solo'); |
| [app/barber/[barberId]/BarberProfileClient.tsx:157](../../app/barber/[barberId]/BarberProfileClient.tsx#L157) |   const [visibleReviews, setVisibleReviews] = useState(5); |
| [app/barber/[barberId]/BarberProfileClient.tsx:159](../../app/barber/[barberId]/BarberProfileClient.tsx#L159) |   const [schedule, setSchedule] = useState&lt;{ availableSlots?: Record&lt;string, string[]&gt; } \| null&gt;( |
| [app/barber/[barberId]/BarberProfileClient.tsx:162](../../app/barber/[barberId]/BarberProfileClient.tsx#L162) |   const [isSaving, setIsSaving] = useState(false); |
| [app/barber/[barberId]/BarberProfileClient.tsx:163](../../app/barber/[barberId]/BarberProfileClient.tsx#L163) |   const [copied, setCopied] = useState(false); |
| [app/barber/[barberId]/BarberProfileClient.tsx:164](../../app/barber/[barberId]/BarberProfileClient.tsx#L164) |   const [optimisticFav, setOptimisticFav] = useState&lt;boolean \| null&gt;(null); |
| [app/barber/[barberId]/BarberProfileClient.tsx:166](../../app/barber/[barberId]/BarberProfileClient.tsx#L166) |   const [services, setServices] = useState&lt;ServiceDoc[]&gt;(initialData?.services \|\| []); |
| [app/barber/[barberId]/BarberProfileClient.tsx:167](../../app/barber/[barberId]/BarberProfileClient.tsx#L167) |   const [reviews, setReviews] = useState&lt;ReviewDoc[]&gt;(initialData?.reviews \|\| []); |
| [app/barber/[barberId]/BarberProfileClient.tsx:168](../../app/barber/[barberId]/BarberProfileClient.tsx#L168) |   const [mounted, setMounted] = useState(false); |
| [app/barber/[barberId]/BarberProfileClient.tsx:169](../../app/barber/[barberId]/BarberProfileClient.tsx#L169) |   const [weekDays, setWeekDays] = useState&lt;Array&lt;{ |
| [app/barber/[barberId]/BarberProfileClient.tsx:330](../../app/barber/[barberId]/BarberProfileClient.tsx#L330) |     if (profile?.isFake) { setShowFakeModal(true); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:332](../../app/barber/[barberId]/BarberProfileClient.tsx#L332) |     if (!appUser?.role) { toast.error(t('profile.pleaseLogin')); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:333](../../app/barber/[barberId]/BarberProfileClient.tsx#L333) |     if (appUser?.role === 'admin') { toast.error(t('profile.adminCannotBook')); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:334](../../app/barber/[barberId]/BarberProfileClient.tsx#L334) |     if (appUser?.uid === barberId) { toast.error(t('profile.cannotBookSelf')); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:339](../../app/barber/[barberId]/BarberProfileClient.tsx#L339) |     if (!profile?.isLive) { toast.error(t('profile.notAcceptingBookings')); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:347](../../app/barber/[barberId]/BarberProfileClient.tsx#L347) |     if (appUser?.role === 'admin') { toast.error(t('profile.adminCannotSave')); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:364](../../app/barber/[barberId]/BarberProfileClient.tsx#L364) |       toast.error(t('profile.failedToUpdate')); |
| [app/barber/[barberId]/BarberProfileClient.tsx:365](../../app/barber/[barberId]/BarberProfileClient.tsx#L365) |       console.error(e); |
| [app/barber/[barberId]/BarberProfileClient.tsx:379](../../app/barber/[barberId]/BarberProfileClient.tsx#L379) |   if (isLoading) return &lt;BarberProfileSkeleton /&gt;; |
| [app/barber/[barberId]/BarberProfileClient.tsx:399](../../app/barber/[barberId]/BarberProfileClient.tsx#L399) |       {lightboxPhoto && ( |
| [app/barber/[barberId]/BarberProfileClient.tsx:403](../../app/barber/[barberId]/BarberProfileClient.tsx#L403) |             &lt;Image src={lightboxPhoto} alt="Portfolio" fill className="object-contain" referrerPolicy="no-referrer" /&gt; |
| [app/barber/[barberId]/BarberProfileClient.tsx:408](../../app/barber/[barberId]/BarberProfileClient.tsx#L408) |       {showFakeModal && ( |
| [app/barber/[barberId]/BarberProfileClient.tsx:411](../../app/barber/[barberId]/BarberProfileClient.tsx#L411) |           onClick={() =&gt; setShowFakeModal(false)} |
| [app/barber/[barberId]/BarberProfileClient.tsx:431](../../app/barber/[barberId]/BarberProfileClient.tsx#L431) |                 onClick={() =&gt; setShowFakeModal(false)} |
| [app/barber/[barberId]/BarberProfileClient.tsx:680](../../app/barber/[barberId]/BarberProfileClient.tsx#L680) |                       {isChallengeModeOn ? null : &lt;button onClick={() =&gt; handleBooking()} disabled={!profile.isLive} title={!profile.isLive ? t('profile.notAcceptingBookings') : undefined} className={`px-4 py-2 rounded-xl text-xs font-black transition-opacity ${!profile.isLive ? 'bg-[#2a2a2a] text-[#555] cursor-not-allowed' : 'bg-brand-yellow text-[#0a0a0a] hover:opacity-90'}`}&gt;{t('profile.book')}&lt;/button&gt;} |
| [app/barber/[barberId]/BarberProfileClient.tsx:700](../../app/barber/[barberId]/BarberProfileClient.tsx#L700) |                       {isChallengeModeOn ? null : &lt;button onClick={() =&gt; handleBooking(s.id)} disabled={!profile.isLive} title={!profile.isLive ? t('profile.notAcceptingBookings') : undefined} |
| [app/barber/[barberId]/BarberProfileClient.tsx:722](../../app/barber/[barberId]/BarberProfileClient.tsx#L722) |               {isChallengeModeOn ? null : &lt;button onClick={() =&gt; handleBooking()} disabled={!profile.isLive} title={!profile.isLive ? t('profile.notAcceptingBookings') : undefined} |
| [app/barber/[barberId]/BarberProfileClient.tsx:727](../../app/barber/[barberId]/BarberProfileClient.tsx#L727) |               &lt;button onClick={handleToggleFav} disabled={isSaving} |
| [app/barber/[barberId]/BarberProfileClient.tsx:769](../../app/barber/[barberId]/BarberProfileClient.tsx#L769) |                       isChallengeModeOn ? null : &lt;button key={slot} onClick={() =&gt; handleBooking()} disabled={!profile.isLive} |
| [app/barber/[barberId]/BarberProfileClient.tsx:845](../../app/barber/[barberId]/BarberProfileClient.tsx#L845) |           disabled={!profile?.isLive} |
| [app/barber/[barberId]/page.tsx:37](../../app/barber/[barberId]/page.tsx#L37) |     if (!profileDoc.exists) return { title: 'Barber not found' }; |
| [app/barber/[barberId]/page.tsx:170](../../app/barber/[barberId]/page.tsx#L170) |           console.error('[heal] FAILED for:', barberId, healErr); |
| [app/barber/[barberId]/page.tsx:237](../../app/barber/[barberId]/page.tsx#L237) |     console.error('BarberProfilePage server error:', err); |
| [app/barber/[barberId]/page.tsx:238](../../app/barber/[barberId]/page.tsx#L238) |     // Fall back to client-side fetching on error |
| [app/barbers/BarbersClient.tsx:3](../../app/barbers/BarbersClient.tsx#L3) | import { useState, useMemo, useEffect } from 'react'; |
| [app/barbers/BarbersClient.tsx:146](../../app/barbers/BarbersClient.tsx#L146) |       &lt;button onClick={() =&gt; onChange(page - 1)} disabled={page === 1} |
| [app/barbers/BarbersClient.tsx:164](../../app/barbers/BarbersClient.tsx#L164) |       &lt;button onClick={() =&gt; onChange(page + 1)} disabled={page === totalPages} |
| [app/barbers/BarbersClient.tsx:180](../../app/barbers/BarbersClient.tsx#L180) |   const showFakes = useShowFakeUIData(); |
| [app/barbers/BarbersClient.tsx:181](../../app/barbers/BarbersClient.tsx#L181) |   const [countryCode, setCountryCode] = useState(''); |
| [app/barbers/BarbersClient.tsx:182](../../app/barbers/BarbersClient.tsx#L182) |   const [countryName, setCountryName] = useState(''); |
| [app/barbers/BarbersClient.tsx:183](../../app/barbers/BarbersClient.tsx#L183) |   const [selectedState, setSelectedState] = useState(''); |
| [app/barbers/BarbersClient.tsx:184](../../app/barbers/BarbersClient.tsx#L184) |   const [selectedCity, setSelectedCity] = useState(''); |
| [app/barbers/BarbersClient.tsx:187](../../app/barbers/BarbersClient.tsx#L187) |   const [activeFilter, setActiveFilter] = useState&lt;{ city: string; state: string; country: string; countryDisplay?: string } \| null&gt;(null); |
| [app/barbers/BarbersClient.tsx:188](../../app/barbers/BarbersClient.tsx#L188) |   const [geoCity, setGeoCity] = useState(''); |
| [app/barbers/BarbersClient.tsx:189](../../app/barbers/BarbersClient.tsx#L189) |   const [geoCountry, setGeoCountry] = useState(''); |
| [app/barbers/BarbersClient.tsx:190](../../app/barbers/BarbersClient.tsx#L190) |   const [geoApplied, setGeoApplied] = useState(false); |
| [app/barbers/BarbersClient.tsx:191](../../app/barbers/BarbersClient.tsx#L191) |   const [csc, setCsc] = useState&lt;any&gt;(null); |
| [app/barbers/BarbersClient.tsx:244](../../app/barbers/BarbersClient.tsx#L244) |     // If server returned empty (e.g. Admin SDK not configured), fetch client-side. |
| [app/barbers/BarbersClient.tsx:250](../../app/barbers/BarbersClient.tsx#L250) |   const [nameSearch, setNameSearch] = useState(''); |
| [app/barbers/BarbersClient.tsx:252](../../app/barbers/BarbersClient.tsx#L252) |   const [page, setPage] = useState(1); |
| [app/barbers/BarbersClient.tsx:253](../../app/barbers/BarbersClient.tsx#L253) |   const [copied, setCopied] = useState(false); |
| [app/barbers/BarbersClient.tsx:269](../../app/barbers/BarbersClient.tsx#L269) |     const visibleFakeCount = showFakes |
| [app/barbers/BarbersClient.tsx:276](../../app/barbers/BarbersClient.tsx#L276) |   }, [allBarbers, showFakes]); |
| [app/barbers/BarbersClient.tsx:379](../../app/barbers/BarbersClient.tsx#L379) |               disabled={!countryCode} |
| [app/barbers/BarbersClient.tsx:387](../../app/barbers/BarbersClient.tsx#L387) |               disabled={!countryCode} |
| [app/barbers/BarbersClient.tsx:394](../../app/barbers/BarbersClient.tsx#L394) |             &lt;button onClick={handleSearch} disabled={false} |
| [app/barbers/BarbersClient.tsx:401](../../app/barbers/BarbersClient.tsx#L401) |             placeholder={t('forms.searchByBarberName')} |
| [app/barbers/BarbersClient.tsx:402](../../app/barbers/BarbersClient.tsx#L402) |             className="w-full sm:max-w-sm bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-[#444]" |
| [app/barbers/BarbersClient.tsx:441](../../app/barbers/BarbersClient.tsx#L441) |                   ? t('emptyStates.noBarbersCity').replace('{city}', activeFilter.city) |
| [app/barbers/BarbersClient.tsx:442](../../app/barbers/BarbersClient.tsx#L442) |                   : t('emptyStates.noBarbersCountry').replace('{country}', activeFilter.countryDisplay \|\| activeFilter.country) |
| [app/barbers/BarbersClient.tsx:443](../../app/barbers/BarbersClient.tsx#L443) |                 : t('emptyStates.noBarbersFound')} |
| [app/barbers/BarbersClient.tsx:446](../../app/barbers/BarbersClient.tsx#L446) |               {activeFilter ? t('emptyStates.shareWithBarber') : t('emptyStates.checkBackSoon')} |
| [app/barbers/BarbersClient.tsx:468](../../app/barbers/BarbersClient.tsx#L468) |                 const showOverlay = applyBlur && paged.indexOf(b) === firstBlurredIndex; |
| [app/barbers/BarbersClient.tsx:544](../../app/barbers/BarbersClient.tsx#L544) |                     {showOverlay && ( |
| [app/book/shop/[shopId]/page.tsx:3](../../app/book/shop/[shopId]/page.tsx#L3) | import { useState, useEffect } from 'react'; |
| [app/book/shop/[shopId]/page.tsx:96](../../app/book/shop/[shopId]/page.tsx#L96) |   const [step, setStep] = useState&lt;1 \| 2 \| 3 \| 4&gt;(1); |
| [app/book/shop/[shopId]/page.tsx:98](../../app/book/shop/[shopId]/page.tsx#L98) |   const [shop, setShop] = useState&lt;ShopData \| null&gt;(null); |
| [app/book/shop/[shopId]/page.tsx:99](../../app/book/shop/[shopId]/page.tsx#L99) |   const [barbers, setBarbers] = useState&lt;BarberData[]&gt;([]); |
| [app/book/shop/[shopId]/page.tsx:100](../../app/book/shop/[shopId]/page.tsx#L100) |   const [services, setServices] = useState&lt;ServiceData[]&gt;([]); |
| [app/book/shop/[shopId]/page.tsx:101](../../app/book/shop/[shopId]/page.tsx#L101) |   const [loading, setLoading] = useState(true); |
| [app/book/shop/[shopId]/page.tsx:103](../../app/book/shop/[shopId]/page.tsx#L103) |   const [selectedServiceIds, setSelectedServiceIds] = useState&lt;string[]&gt;([]); |
| [app/book/shop/[shopId]/page.tsx:104](../../app/book/shop/[shopId]/page.tsx#L104) |   const [selectedDate, setSelectedDate] = useState&lt;string&gt;(''); |
| [app/book/shop/[shopId]/page.tsx:105](../../app/book/shop/[shopId]/page.tsx#L105) |   const [selectedTime, setSelectedTime] = useState&lt;string&gt;(''); |
| [app/book/shop/[shopId]/page.tsx:106](../../app/book/shop/[shopId]/page.tsx#L106) |   const [selectedEndTime, setSelectedEndTime] = useState&lt;string&gt;(''); |
| [app/book/shop/[shopId]/page.tsx:107](../../app/book/shop/[shopId]/page.tsx#L107) |   const [availableBarberIds, setAvailableBarberIds] = useState&lt;string[]&gt;([]); |
| [app/book/shop/[shopId]/page.tsx:108](../../app/book/shop/[shopId]/page.tsx#L108) |   const [selectedBarberId, setSelectedBarberId] = useState&lt;string&gt;(''); |
| [app/book/shop/[shopId]/page.tsx:110](../../app/book/shop/[shopId]/page.tsx#L110) |   const [confirming, setConfirming] = useState(false); |
| [app/book/shop/[shopId]/page.tsx:111](../../app/book/shop/[shopId]/page.tsx#L111) |   const [bookingError, setBookingError] = useState&lt;string&gt;(''); |
| [app/book/shop/[shopId]/page.tsx:112](../../app/book/shop/[shopId]/page.tsx#L112) |   const [honeypot, setHoneypot] = useState(''); |
| [app/book/shop/[shopId]/page.tsx:121](../../app/book/shop/[shopId]/page.tsx#L121) |       toast.error(t('profile.adminCannotBook')); |
| [app/book/shop/[shopId]/page.tsx:222](../../app/book/shop/[shopId]/page.tsx#L222) |         console.error('Shop booking load error:', err); |
| [app/book/shop/[shopId]/page.tsx:260](../../app/book/shop/[shopId]/page.tsx#L260) |         setBookingError(t('errors.tooManyBookingAttempts')); |
| [app/book/shop/[shopId]/page.tsx:281](../../app/book/shop/[shopId]/page.tsx#L281) |       if (!dupSnap.empty) { |
| [app/book/shop/[shopId]/page.tsx:350](../../app/book/shop/[shopId]/page.tsx#L350) |         updateDoc(doc(db, 'users', selectedBarberId), { unreadCount: increment(1) }).catch(console.error); |
| [app/book/shop/[shopId]/page.tsx:359](../../app/book/shop/[shopId]/page.tsx#L359) |         updateDoc(doc(db, 'users', user.uid), { unreadCount: increment(1) }).catch(console.error); |
| [app/book/shop/[shopId]/page.tsx:361](../../app/book/shop/[shopId]/page.tsx#L361) |         console.error('Post-booking notifications failed:', notifErr); |
| [app/book/shop/[shopId]/page.tsx:368](../../app/book/shop/[shopId]/page.tsx#L368) |       console.error(e); |
| [app/book/shop/[shopId]/page.tsx:382](../../app/book/shop/[shopId]/page.tsx#L382) |   if (loading \|\| !user) { |
| [app/book/shop/[shopId]/page.tsx:385](../../app/book/shop/[shopId]/page.tsx#L385) |         &lt;div className="text-[#666] text-sm font-bold animate-pulse"&gt;{t('booking.loadingShop')}&lt;/div&gt; |
| [app/book/shop/[shopId]/page.tsx:443](../../app/book/shop/[shopId]/page.tsx#L443) |                 &lt;div className="text-[#555] text-sm font-bold"&gt;{t('emptyStates.noServicesAdded')}&lt;/div&gt; |
| [app/book/shop/[shopId]/page.tsx:476](../../app/book/shop/[shopId]/page.tsx#L476) |                 disabled={selectedServiceIds.length === 0} |
| [app/book/shop/[shopId]/page.tsx:531](../../app/book/shop/[shopId]/page.tsx#L531) |                 disabled={!selectedDate \|\| !selectedTime} |
| [app/book/shop/[shopId]/page.tsx:627](../../app/book/shop/[shopId]/page.tsx#L627) |                 disabled={!selectedBarberId} |
| [app/book/shop/[shopId]/page.tsx:730](../../app/book/shop/[shopId]/page.tsx#L730) |               disabled={confirming} |
| [app/book/shop/[shopId]/page.tsx:743](../../app/book/shop/[shopId]/page.tsx#L743) |               disabled={confirming} |
| [app/book/[barberId]/page.tsx:3](../../app/book/[barberId]/page.tsx#L3) | import { useState, useEffect, use } from 'react'; |
| [app/book/[barberId]/page.tsx:7](../../app/book/[barberId]/page.tsx#L7) | import { BarberProfileSkeleton } from '@/components/skeletons'; |
| [app/book/[barberId]/page.tsx:46](../../app/book/[barberId]/page.tsx#L46) |   const [step, setStep] = useState(1); |
| [app/book/[barberId]/page.tsx:47](../../app/book/[barberId]/page.tsx#L47) |   const [bookingContext, setBookingContext] = useState&lt;'solo'\|'shop'&gt;('solo'); |
| [app/book/[barberId]/page.tsx:48](../../app/book/[barberId]/page.tsx#L48) |   const [selectedServices, setSelectedServices] = useState&lt;any[]&gt;([]); |
| [app/book/[barberId]/page.tsx:49](../../app/book/[barberId]/page.tsx#L49) |   const [selectedDate, setSelectedDate] = useState&lt;string&gt;(''); |
| [app/book/[barberId]/page.tsx:50](../../app/book/[barberId]/page.tsx#L50) |   const [selectedTime, setSelectedTime] = useState&lt;string&gt;(''); |
| [app/book/[barberId]/page.tsx:51](../../app/book/[barberId]/page.tsx#L51) |   const [selectedEndTime, setSelectedEndTime] = useState&lt;string&gt;(''); |
| [app/book/[barberId]/page.tsx:52](../../app/book/[barberId]/page.tsx#L52) |   const [isSubmitting, setIsSubmitting] = useState(false); |
| [app/book/[barberId]/page.tsx:53](../../app/book/[barberId]/page.tsx#L53) |   const [honeypot, setHoneypot] = useState(''); |
| [app/book/[barberId]/page.tsx:55](../../app/book/[barberId]/page.tsx#L55) |   const { data: profile, isLoading: loadingProfile } = useQuery({ |
| [app/book/[barberId]/page.tsx:68](../../app/book/[barberId]/page.tsx#L68) |     if (loadingProfile) return; |
| [app/book/[barberId]/page.tsx:76](../../app/book/[barberId]/page.tsx#L76) |   }, [profile, loadingProfile]); |
| [app/book/[barberId]/page.tsx:93](../../app/book/[barberId]/page.tsx#L93) | const { data: services = [], isLoading: loadingServices } = useQuery({ |
| [app/book/[barberId]/page.tsx:118](../../app/book/[barberId]/page.tsx#L118) |   const loading = loadingProfile \|\| (step &gt;= 2 && loadingServices); |
| [app/book/[barberId]/page.tsx:141](../../app/book/[barberId]/page.tsx#L141) |       toast.error(t('errors.cannotBookOwn')); |
| [app/book/[barberId]/page.tsx:156](../../app/book/[barberId]/page.tsx#L156) |         toast.error(t('errors.tooManyBookingAttempts')); |
| [app/book/[barberId]/page.tsx:163](../../app/book/[barberId]/page.tsx#L163) |         toast.error(t('booking.noInternetBooking')); |
| [app/book/[barberId]/page.tsx:178](../../app/book/[barberId]/page.tsx#L178) |       if (!existing.empty) { |
| [app/book/[barberId]/page.tsx:179](../../app/book/[barberId]/page.tsx#L179) |         toast.error(t('booking.alreadyHaveBooking')); |
| [app/book/[barberId]/page.tsx:195](../../app/book/[barberId]/page.tsx#L195) |       if (!clientDaySnap.empty) { |
| [app/book/[barberId]/page.tsx:210](../../app/book/[barberId]/page.tsx#L210) |             toast.error(t('booking.bookingOverlap')); |
| [app/book/[barberId]/page.tsx:277](../../app/book/[barberId]/page.tsx#L277) |       console.error(e); |
| [app/book/[barberId]/page.tsx:279](../../app/book/[barberId]/page.tsx#L279) |          toast.error(t('booking.slotTaken')); |
| [app/book/[barberId]/page.tsx:294](../../app/book/[barberId]/page.tsx#L294) |              return t('errors.connectionError'); |
| [app/book/[barberId]/page.tsx:298](../../app/book/[barberId]/page.tsx#L298) |          toast.error(getBookingError(e)); |
| [app/book/[barberId]/page.tsx:313](../../app/book/[barberId]/page.tsx#L313) |       updateDoc(doc(db, 'users', barberId), { unreadCount: increment(1) }).catch(console.error); |
| [app/book/[barberId]/page.tsx:322](../../app/book/[barberId]/page.tsx#L322) |       updateDoc(doc(db, 'users', user.uid), { unreadCount: increment(1) }).catch(console.error); |
| [app/book/[barberId]/page.tsx:324](../../app/book/[barberId]/page.tsx#L324) |       // Booking was created — do not surface this error |
| [app/book/[barberId]/page.tsx:325](../../app/book/[barberId]/page.tsx#L325) |       console.error('Post-booking notifications failed:', notifErr); |
| [app/book/[barberId]/page.tsx:334](../../app/book/[barberId]/page.tsx#L334) |   if (loading) return &lt;BarberProfileSkeleton /&gt;; |
| [app/book/[barberId]/page.tsx:505](../../app/book/[barberId]/page.tsx#L505) |                disabled={selectedServices.length === 0} |
| [app/book/[barberId]/page.tsx:557](../../app/book/[barberId]/page.tsx#L557) |                disabled={!selectedDate \|\| !selectedTime} |
| [app/book/[barberId]/page.tsx:652](../../app/book/[barberId]/page.tsx#L652) |              disabled={isSubmitting} |
| [app/book/[barberId]/page.tsx:658](../../app/book/[barberId]/page.tsx#L658) |              disabled={isSubmitting} |
| [app/challenge/page.tsx:3](../../app/challenge/page.tsx#L3) | import { useState, useEffect, useCallback } from 'react'; |
| [app/challenge/page.tsx:41](../../app/challenge/page.tsx#L41) |   const [barberHits, setBarberHits] = useState&lt;any[]&gt;([]); |
| [app/challenge/page.tsx:42](../../app/challenge/page.tsx#L42) |   const [shopHits, setShopHits] = useState&lt;any[]&gt;([]); |
| [app/challenge/page.tsx:43](../../app/challenge/page.tsx#L43) |   const [searching, setSearching] = useState(false); |
| [app/challenge/page.tsx:45](../../app/challenge/page.tsx#L45) |   const [nameSearch, setNameSearch] = useState(''); |
| [app/challenge/page.tsx:48](../../app/challenge/page.tsx#L48) |   const [justVotedBarber, setJustVotedBarber] = useState&lt;string \| null&gt;(null); |
| [app/challenge/page.tsx:49](../../app/challenge/page.tsx#L49) |   const [justVotedShop, setJustVotedShop] = useState&lt;string \| null&gt;(null); |
| [app/challenge/page.tsx:50](../../app/challenge/page.tsx#L50) |   const [voting, setVoting] = useState&lt;string \| null&gt;(null); |
| [app/challenge/page.tsx:52](../../app/challenge/page.tsx#L52) |   const [verifyingEmail, setVerifyingEmail] = useState(false); |
| [app/challenge/page.tsx:54](../../app/challenge/page.tsx#L54) |   const [verifiedTick, setVerifiedTick] = useState(0); |
| [app/challenge/page.tsx:96](../../app/challenge/page.tsx#L96) |       ? 'loading' |
| [app/challenge/page.tsx:157](../../app/challenge/page.tsx#L157) |       toast.error(t('challenge.public.toastVerifySendFail')); |
| [app/challenge/page.tsx:171](../../app/challenge/page.tsx#L171) |         toast.error(t('challenge.public.toastVerifyStill')); |
| [app/challenge/page.tsx:174](../../app/challenge/page.tsx#L174) |       toast.error(t('challenge.public.toastVerifyRefreshFail')); |
| [app/challenge/page.tsx:187](../../app/challenge/page.tsx#L187) |       toast.error(t('challenge.public.toastNeedVerify')); |
| [app/challenge/page.tsx:191](../../app/challenge/page.tsx#L191) |       toast.error(t('challenge.public.toastNotOpen')); |
| [app/challenge/page.tsx:207](../../app/challenge/page.tsx#L207) |         toast.error(t('challenge.public.toastVoteClosedOrDup')); |
| [app/challenge/page.tsx:209](../../app/challenge/page.tsx#L209) |         toast.error(t('challenge.public.toastVoteFail')); |
| [app/challenge/page.tsx:218](../../app/challenge/page.tsx#L218) |   if (settingsLoading \|\| phase === 'loading') { |
| [app/challenge/page.tsx:221](../../app/challenge/page.tsx#L221) |         {t('challenge.public.loading')} |
| [app/challenge/page.tsx:326](../../app/challenge/page.tsx#L326) |                 disabled={verifyingEmail} |
| [app/challenge/page.tsx:339](../../app/challenge/page.tsx#L339) |               placeholder={t('challenge.public.searchPlaceholder')} |
| [app/challenge/page.tsx:340](../../app/challenge/page.tsx#L340) |               className="w-full sm:max-w-md bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-[#444]" |
| [app/challenge/page.tsx:355](../../app/challenge/page.tsx#L355) |               loading={lbBarberLoading} |
| [app/challenge/page.tsx:367](../../app/challenge/page.tsx#L367) |               loading={lbShopLoading} |
| [app/challenge/page.tsx:928](../../app/challenge/page.tsx#L928) |             ? t('challenge.public.emptyBarbers') |
| [app/challenge/page.tsx:929](../../app/challenge/page.tsx#L929) |             : t('challenge.public.emptyShops')} |
| [app/challenge/page.tsx:1013](../../app/challenge/page.tsx#L1013) |                   disabled={!canVote \|\| voting === hit.objectID} |
| [app/challenge/page.tsx:1032](../../app/challenge/page.tsx#L1032) |   loading, |
| [app/challenge/page.tsx:1043](../../app/challenge/page.tsx#L1043) |   loading: boolean; |
| [app/challenge/page.tsx:1062](../../app/challenge/page.tsx#L1062) |       {loading && ( |
| [app/challenge/page.tsx:1073](../../app/challenge/page.tsx#L1073) |       {!loading && data.length === 0 && ( |
| [app/challenge/page.tsx:1075](../../app/challenge/page.tsx#L1075) |           {type === 'barber' ? t('challenge.public.emptyBarbers') : t('challenge.public.emptyShops')} |
| [app/challenge/page.tsx:1079](../../app/challenge/page.tsx#L1079) |       {!loading && data.length &gt; 0 && ( |
| [app/challenge/page.tsx:1208](../../app/challenge/page.tsx#L1208) |             disabled={!canVote \|\| voting === submission.id} |
| [app/cities/page.tsx:3](../../app/cities/page.tsx#L3) | import { useState, useEffect } from 'react'; |
| [app/cities/page.tsx:9](../../app/cities/page.tsx#L9) |   const [barbers, setBarbers] = useState&lt;any[]&gt;([]); |
| [app/cities/page.tsx:10](../../app/cities/page.tsx#L10) |   const [loading, setLoading] = useState(true); |
| [app/cities/page.tsx:25](../../app/cities/page.tsx#L25) |         console.error(err); |
| [app/cities/page.tsx:84](../../app/cities/page.tsx#L84) |         {loading ? ( |
| [app/contact/page.tsx:3](../../app/contact/page.tsx#L3) | import { useEffect, useState } from 'react'; |
| [app/contact/page.tsx:21](../../app/contact/page.tsx#L21) |   const [form, setForm] = useState(INITIAL_FORM); |
| [app/contact/page.tsx:22](../../app/contact/page.tsx#L22) |   const [prefilled, setPrefilled] = useState(false); |
| [app/contact/page.tsx:38](../../app/contact/page.tsx#L38) |   const [isSubmitted, setIsSubmitted] = useState(false); |
| [app/contact/page.tsx:39](../../app/contact/page.tsx#L39) |   const [isSending, setIsSending] = useState(false); |
| [app/contact/page.tsx:40](../../app/contact/page.tsx#L40) |   const [error, setError] = useState(''); |
| [app/contact/page.tsx:61](../../app/contact/page.tsx#L61) |       console.error('Contact form error:', err); |
| [app/contact/page.tsx:62](../../app/contact/page.tsx#L62) |       setError(t('contactPage.errorGeneric')); |
| [app/contact/page.tsx:104](../../app/contact/page.tsx#L104) |                       className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-gray-600" |
| [app/contact/page.tsx:105](../../app/contact/page.tsx#L105) |                       placeholder={t('contactPage.namePlaceholder')} |
| [app/contact/page.tsx:115](../../app/contact/page.tsx#L115) |                       className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-gray-600" |
| [app/contact/page.tsx:116](../../app/contact/page.tsx#L116) |                       placeholder={t('contactPage.emailPlaceholder')} |
| [app/contact/page.tsx:162](../../app/contact/page.tsx#L162) |                       className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-gray-600 resize-none" |
| [app/contact/page.tsx:163](../../app/contact/page.tsx#L163) |                       placeholder={t('contactPage.messagePlaceholder')} |
| [app/contact/page.tsx:180](../../app/contact/page.tsx#L180) |                     disabled={isSending} |
| [app/contact/page.tsx:185](../../app/contact/page.tsx#L185) |                   {error && ( |
| [app/contact/page.tsx:186](../../app/contact/page.tsx#L186) |                     &lt;p style={{ color: '#E8491D', fontSize: 13 }}&gt;{error}&lt;/p&gt; |
| [app/cookies/page.tsx:3](../../app/cookies/page.tsx#L3) | import { useState, useEffect } from 'react' |
| [app/cookies/page.tsx:6](../../app/cookies/page.tsx#L6) |   const [analyticsEnabled, setAnalyticsEnabled] = useState(true) |
| [app/cookies/page.tsx:7](../../app/cookies/page.tsx#L7) |   const [saved, setSaved] = useState(false) |
| [app/dashboard/barber/billing/page.tsx:17](../../app/dashboard/barber/billing/page.tsx#L17) |           {t('shop.subscriptionComingSoon')} |
| [app/dashboard/barber/bookings/page.tsx:3](../../app/dashboard/barber/bookings/page.tsx#L3) | import { useState, useEffect } from "react"; |
| [app/dashboard/barber/bookings/page.tsx:12](../../app/dashboard/barber/bookings/page.tsx#L12) | import { ConfirmDialog } from '@/components/ConfirmDialog'; |
| [app/dashboard/barber/bookings/page.tsx:59](../../app/dashboard/barber/bookings/page.tsx#L59) |   const [bookings, setBookings] = useState&lt;any[]&gt;([]); |
| [app/dashboard/barber/bookings/page.tsx:60](../../app/dashboard/barber/bookings/page.tsx#L60) |   const [bookingsTab, setBookingsTab] = useState('today'); |
| [app/dashboard/barber/bookings/page.tsx:61](../../app/dashboard/barber/bookings/page.tsx#L61) |   const [bookingsStatusFilter, setBookingsStatusFilter] = useState('all'); |
| [app/dashboard/barber/bookings/page.tsx:62](../../app/dashboard/barber/bookings/page.tsx#L62) |   const [bookingsSearch, setBookingsSearch] = useState(''); |
| [app/dashboard/barber/bookings/page.tsx:63](../../app/dashboard/barber/bookings/page.tsx#L63) |   const [currentPage, setCurrentPage] = useState(1); |
| [app/dashboard/barber/bookings/page.tsx:64](../../app/dashboard/barber/bookings/page.tsx#L64) |   const [confirmDecline, setConfirmDecline] = useState&lt;string \| null&gt;(null); |
| [app/dashboard/barber/bookings/page.tsx:65](../../app/dashboard/barber/bookings/page.tsx#L65) |   const [completing, setCompleting] = useState&lt;string \| null&gt;(null); |
| [app/dashboard/barber/bookings/page.tsx:108](../../app/dashboard/barber/bookings/page.tsx#L108) |             updateDoc(doc(db, 'users', booking.clientId), { unreadCount: increment(1) }).catch(console.error); |
| [app/dashboard/barber/bookings/page.tsx:187](../../app/dashboard/barber/bookings/page.tsx#L187) |         }).catch(e =&gt; console.error('Response time update failed:', e)); |
| [app/dashboard/barber/bookings/page.tsx:213](../../app/dashboard/barber/bookings/page.tsx#L213) |         updateDoc(doc(db, 'users', booking.clientId), { unreadCount: increment(1) }).catch(console.error); |
| [app/dashboard/barber/bookings/page.tsx:215](../../app/dashboard/barber/bookings/page.tsx#L215) |     } catch (e) { console.error(e); } |
| [app/dashboard/barber/bookings/page.tsx:265](../../app/dashboard/barber/bookings/page.tsx#L265) |       &lt;input value={bookingsSearch} onChange={e =&gt; setBookingsSearch(e.target.value)} placeholder={t('bookings.searchByClient')} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-full px-4 py-2 text-[12px] text-white outline-none focus:border-brand-yellow transition-colors placeholder:text-[#444] mb-4" /&gt; |
| [app/dashboard/barber/bookings/page.tsx:290](../../app/dashboard/barber/bookings/page.tsx#L290) |                   disabled={completing === b.id} |
| [app/dashboard/barber/bookings/page.tsx:313](../../app/dashboard/barber/bookings/page.tsx#L313) |               disabled={currentPage === 1} |
| [app/dashboard/barber/bookings/page.tsx:332](../../app/dashboard/barber/bookings/page.tsx#L332) |               disabled={currentPage === totalPages} |
| [app/dashboard/barber/bookings/page.tsx:340](../../app/dashboard/barber/bookings/page.tsx#L340) |       &lt;ConfirmDialog |
| [app/dashboard/barber/challenge/page.tsx:8](../../app/dashboard/barber/challenge/page.tsx#L8) |   const { appUser, loading } = useAuth(); |
| [app/dashboard/barber/challenge/page.tsx:10](../../app/dashboard/barber/challenge/page.tsx#L10) |   if (loading) { |
| [app/dashboard/barber/create-shop/page.tsx:3](../../app/dashboard/barber/create-shop/page.tsx#L3) | import { useState, useMemo, useEffect } from 'react'; |
| [app/dashboard/barber/create-shop/page.tsx:18](../../app/dashboard/barber/create-shop/page.tsx#L18) |   const { user, appUser, loading } = useAuth(); |
| [app/dashboard/barber/create-shop/page.tsx:21](../../app/dashboard/barber/create-shop/page.tsx#L21) |   const [name, setName] = useState(''); |
| [app/dashboard/barber/create-shop/page.tsx:23](../../app/dashboard/barber/create-shop/page.tsx#L23) |   const [phoneCode, setPhoneCode] = useState&lt;any&gt;(null); |
| [app/dashboard/barber/create-shop/page.tsx:24](../../app/dashboard/barber/create-shop/page.tsx#L24) |   const [phoneNumberInput, setPhoneNumberInput] = useState(""); |
| [app/dashboard/barber/create-shop/page.tsx:26](../../app/dashboard/barber/create-shop/page.tsx#L26) |   const [selectedCountry, setSelectedCountry] = useState&lt;any&gt;(null); |
| [app/dashboard/barber/create-shop/page.tsx:27](../../app/dashboard/barber/create-shop/page.tsx#L27) |   const [selectedState, setSelectedState] = useState&lt;any&gt;(null); |
| [app/dashboard/barber/create-shop/page.tsx:28](../../app/dashboard/barber/create-shop/page.tsx#L28) |   const [selectedCityOption, setSelectedCityOption] = useState&lt;any&gt;(null); |
| [app/dashboard/barber/create-shop/page.tsx:30](../../app/dashboard/barber/create-shop/page.tsx#L30) |   const [street, setStreet] = useState(''); |
| [app/dashboard/barber/create-shop/page.tsx:31](../../app/dashboard/barber/create-shop/page.tsx#L31) |   const [buildingNumber, setBuildingNumber] = useState(''); |
| [app/dashboard/barber/create-shop/page.tsx:32](../../app/dashboard/barber/create-shop/page.tsx#L32) |   const [postalCode, setPostalCode] = useState(''); |
| [app/dashboard/barber/create-shop/page.tsx:33](../../app/dashboard/barber/create-shop/page.tsx#L33) |   const [floor, setFloor] = useState(''); |
| [app/dashboard/barber/create-shop/page.tsx:35](../../app/dashboard/barber/create-shop/page.tsx#L35) |   const [description, setDescription] = useState(''); |
| [app/dashboard/barber/create-shop/page.tsx:36](../../app/dashboard/barber/create-shop/page.tsx#L36) |   const [isSubmitting, setIsSubmitting] = useState(false); |
| [app/dashboard/barber/create-shop/page.tsx:37](../../app/dashboard/barber/create-shop/page.tsx#L37) |   const [errorStatus, setErrorStatus] = useState(''); |
| [app/dashboard/barber/create-shop/page.tsx:38](../../app/dashboard/barber/create-shop/page.tsx#L38) |   const [csc, setCsc] = useState&lt;any&gt;(null); |
| [app/dashboard/barber/create-shop/page.tsx:90](../../app/dashboard/barber/create-shop/page.tsx#L90) |     placeholder: (base: any) =&gt; ({ |
| [app/dashboard/barber/create-shop/page.tsx:102](../../app/dashboard/barber/create-shop/page.tsx#L102) |   if (loading) return null; |
| [app/dashboard/barber/create-shop/page.tsx:117](../../app/dashboard/barber/create-shop/page.tsx#L117) |       setErrorStatus(t('errors.fillRequiredFields')); |
| [app/dashboard/barber/create-shop/page.tsx:163](../../app/dashboard/barber/create-shop/page.tsx#L163) |       console.error("Error creating shop", err); |
| [app/dashboard/barber/create-shop/page.tsx:164](../../app/dashboard/barber/create-shop/page.tsx#L164) |       setErrorStatus(err.message \|\| t('errors.failedCreateShop')); |
| [app/dashboard/barber/create-shop/page.tsx:194](../../app/dashboard/barber/create-shop/page.tsx#L194) |               placeholder={t('forms.shopNamePlaceholder')} |
| [app/dashboard/barber/create-shop/page.tsx:207](../../app/dashboard/barber/create-shop/page.tsx#L207) |                   placeholder={t('forms.codePlaceholder')} |
| [app/dashboard/barber/create-shop/page.tsx:217](../../app/dashboard/barber/create-shop/page.tsx#L217) |                   className="w-full bg-[#0a0a0a] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]" |
| [app/dashboard/barber/create-shop/page.tsx:218](../../app/dashboard/barber/create-shop/page.tsx#L218) |                   placeholder={t('forms.phonePlaceholder')} |
| [app/dashboard/barber/create-shop/page.tsx:236](../../app/dashboard/barber/create-shop/page.tsx#L236) |                 placeholder={t('forms.countryPlaceholder')} |
| [app/dashboard/barber/create-shop/page.tsx:257](../../app/dashboard/barber/create-shop/page.tsx#L257) |                 placeholder="Region..." |
| [app/dashboard/barber/create-shop/page.tsx:274](../../app/dashboard/barber/create-shop/page.tsx#L274) |                 placeholder={t('forms.cityPlaceholder')} |
| [app/dashboard/barber/create-shop/page.tsx:286](../../app/dashboard/barber/create-shop/page.tsx#L286) |                 placeholder={t('forms.streetPlaceholder2')} |
| [app/dashboard/barber/create-shop/page.tsx:295](../../app/dashboard/barber/create-shop/page.tsx#L295) |                 placeholder={t('forms.buildingPlaceholder2')} |
| [app/dashboard/barber/create-shop/page.tsx:304](../../app/dashboard/barber/create-shop/page.tsx#L304) |                 placeholder={t('forms.postalPlaceholder')} |
| [app/dashboard/barber/create-shop/page.tsx:312](../../app/dashboard/barber/create-shop/page.tsx#L312) |                 placeholder={t('forms.floorPlaceholder2')} |
| [app/dashboard/barber/create-shop/page.tsx:323](../../app/dashboard/barber/create-shop/page.tsx#L323) |               placeholder={t('settings.autoGeneratedLink')} |
| [app/dashboard/barber/create-shop/page.tsx:334](../../app/dashboard/barber/create-shop/page.tsx#L334) |               placeholder={t('forms.shopDescPlaceholder2')} |
| [app/dashboard/barber/create-shop/page.tsx:338](../../app/dashboard/barber/create-shop/page.tsx#L338) |           {errorStatus && ( |
| [app/dashboard/barber/create-shop/page.tsx:340](../../app/dashboard/barber/create-shop/page.tsx#L340) |               {errorStatus} |
| [app/dashboard/barber/create-shop/page.tsx:346](../../app/dashboard/barber/create-shop/page.tsx#L346) |             disabled={isSubmitting} |
| [app/dashboard/barber/layout.tsx:3](../../app/dashboard/barber/layout.tsx#L3) | import { useState, useEffect } from "react"; |
| [app/dashboard/barber/layout.tsx:27](../../app/dashboard/barber/layout.tsx#L27) |   const [copiedCode, setCopiedCode] = useState(false); |
| [app/dashboard/barber/layout.tsx:28](../../app/dashboard/barber/layout.tsx#L28) |   const [toastMessage, setToastMessage] = useState(''); |
| [app/dashboard/barber/layout.tsx:29](../../app/dashboard/barber/layout.tsx#L29) |   const [challengeUnread, setChallengeUnread] = useState(0); |
| [app/dashboard/barber/layout.tsx:112](../../app/dashboard/barber/layout.tsx#L112) |     } catch(e) { console.error(e); } |
| [app/dashboard/barber/page.tsx:3](../../app/dashboard/barber/page.tsx#L3) | import { useState, useEffect } from "react"; |
| [app/dashboard/barber/page.tsx:52](../../app/dashboard/barber/page.tsx#L52) |   const { user, appUser, loading } = useAuth(); |
| [app/dashboard/barber/page.tsx:58](../../app/dashboard/barber/page.tsx#L58) |   const [now, setNow] = useState(new Date()); |
| [app/dashboard/barber/page.tsx:59](../../app/dashboard/barber/page.tsx#L59) |   const [recentNotifs, setRecentNotifs] = useState&lt;(Notification & { id: string })[]&gt;([]); |
| [app/dashboard/barber/page.tsx:60](../../app/dashboard/barber/page.tsx#L60) |   const [bookings, setBookings] = useState&lt;(Booking & { id: string })[]&gt;([]); |
| [app/dashboard/barber/page.tsx:61](../../app/dashboard/barber/page.tsx#L61) |   const [myAppointments, setMyAppointments] = useState&lt;any[]&gt;([]); |
| [app/dashboard/barber/page.tsx:62](../../app/dashboard/barber/page.tsx#L62) |   const [blockModalOpen, setBlockModalOpen] = useState(false); |
| [app/dashboard/barber/page.tsx:63](../../app/dashboard/barber/page.tsx#L63) |   const [blockFrom, setBlockFrom] = useState(''); |
| [app/dashboard/barber/page.tsx:64](../../app/dashboard/barber/page.tsx#L64) |   const [blockTo, setBlockTo] = useState(''); |
| [app/dashboard/barber/page.tsx:65](../../app/dashboard/barber/page.tsx#L65) |   const [blockReason, setBlockReason] = useState&lt;string \| null&gt;(null); |
| [app/dashboard/barber/page.tsx:66](../../app/dashboard/barber/page.tsx#L66) |   const [blockRecurring, setBlockRecurring] = useState(false); |
| [app/dashboard/barber/page.tsx:67](../../app/dashboard/barber/page.tsx#L67) |   const [recurringDays, setRecurringDays] = useState&lt;string[]&gt;([]); |
| [app/dashboard/barber/page.tsx:68](../../app/dashboard/barber/page.tsx#L68) |   const [blockLoading, setBlockLoading] = useState(false); |
| [app/dashboard/barber/page.tsx:69](../../app/dashboard/barber/page.tsx#L69) |   const [rangeError, setRangeError] = useState(''); |
| [app/dashboard/barber/page.tsx:70](../../app/dashboard/barber/page.tsx#L70) |   const [toastMessage, setToastMessage] = useState(''); |
| [app/dashboard/barber/page.tsx:73](../../app/dashboard/barber/page.tsx#L73) |     if (!loading && !user) { |
| [app/dashboard/barber/page.tsx:76](../../app/dashboard/barber/page.tsx#L76) |   }, [user, loading, router]); |
| [app/dashboard/barber/page.tsx:187](../../app/dashboard/barber/page.tsx#L187) |         updateDoc(doc(db, 'users', booking.clientId), { unreadCount: increment(1) }).catch(console.error); |
| [app/dashboard/barber/page.tsx:189](../../app/dashboard/barber/page.tsx#L189) |     } catch (e: any) { console.error('Error updating status', e); } |
| [app/dashboard/barber/page.tsx:192](../../app/dashboard/barber/page.tsx#L192) |   const closeBlockModal = () =&gt; { |
| [app/dashboard/barber/page.tsx:193](../../app/dashboard/barber/page.tsx#L193) |     setBlockModalOpen(false); |
| [app/dashboard/barber/page.tsx:240](../../app/dashboard/barber/page.tsx#L240) |       closeBlockModal(); |
| [app/dashboard/barber/page.tsx:294](../../app/dashboard/barber/page.tsx#L294) |   const showRate = totalFinished &gt; 0 ? Math.round((totalCompleted / totalFinished) * 100) : 100; |
| [app/dashboard/barber/page.tsx:352](../../app/dashboard/barber/page.tsx#L352) |     updateDoc(doc(db, 'professionalProfiles', user.uid), { profileCompletedAt: Date.now() }).catch(console.error); |
| [app/dashboard/barber/page.tsx:423](../../app/dashboard/barber/page.tsx#L423) |       } catch (e) { console.error(e); } |
| [app/dashboard/barber/page.tsx:475](../../app/dashboard/barber/page.tsx#L475) |           &lt;button onClick={() =&gt; setBlockModalOpen(true)} className="bg-brand-orange text-white px-7 py-3 rounded-full font-black text-sm transition-all hover:opacity-90 hover:-translate-y-px"&gt; |
| [app/dashboard/barber/page.tsx:509](../../app/dashboard/barber/page.tsx#L509) |                   &lt;button onClick={() =&gt; setBlockModalOpen(true)} className="text-[11px] text-[#555] hover:text-white transition-colors text-left mt-0.5"&gt; |
| [app/dashboard/barber/page.tsx:575](../../app/dashboard/barber/page.tsx#L575) |           &lt;div className="text-[28px] font-black leading-none text-brand-green"&gt;{showRate}%&lt;/div&gt; |
| [app/dashboard/barber/page.tsx:576](../../app/dashboard/barber/page.tsx#L576) |           &lt;div className="text-xs text-brand-text-secondary font-bold"&gt;{t('barberDash.showRate')}&lt;/div&gt; |
| [app/dashboard/barber/page.tsx:583](../../app/dashboard/barber/page.tsx#L583) |       {/* Services empty state */} |
| [app/dashboard/barber/page.tsx:779](../../app/dashboard/barber/page.tsx#L779) |       {/* Reviews empty state */} |
| [app/dashboard/barber/page.tsx:806](../../app/dashboard/barber/page.tsx#L806) |       {/* Block time off modal */} |
| [app/dashboard/barber/page.tsx:807](../../app/dashboard/barber/page.tsx#L807) |       {blockModalOpen && ( |
| [app/dashboard/barber/page.tsx:810](../../app/dashboard/barber/page.tsx#L810) |             &lt;h3 className="text-lg font-black mb-1"&gt;{t('barberDash.blockTimeOffModal')}&lt;/h3&gt; |
| [app/dashboard/barber/page.tsx:811](../../app/dashboard/barber/page.tsx#L811) |             &lt;p className="text-xs text-[#888] font-bold mb-5"&gt;{t('barberDash.blockTimeOffModalDesc')}&lt;/p&gt; |
| [app/dashboard/barber/page.tsx:869](../../app/dashboard/barber/page.tsx#L869) |                 &lt;button onClick={handleBlockDay} disabled={!blockFrom \|\| blockLoading} |
| [app/dashboard/barber/page.tsx:908](../../app/dashboard/barber/page.tsx#L908) |             &lt;button onClick={closeBlockModal} disabled={blockLoading} |
| [app/dashboard/barber/services/page.tsx:3](../../app/dashboard/barber/services/page.tsx#L3) | import { useState, useEffect } from "react"; |
| [app/dashboard/barber/services/page.tsx:11](../../app/dashboard/barber/services/page.tsx#L11) | import { ConfirmDialog } from '@/components/ConfirmDialog'; |
| [app/dashboard/barber/services/page.tsx:36](../../app/dashboard/barber/services/page.tsx#L36) |   const [newServiceName, setNewServiceName] = useState(''); |
| [app/dashboard/barber/services/page.tsx:37](../../app/dashboard/barber/services/page.tsx#L37) |   const [newServicePrice, setNewServicePrice] = useState(''); |
| [app/dashboard/barber/services/page.tsx:38](../../app/dashboard/barber/services/page.tsx#L38) |   const [newServiceDuration, setNewServiceDuration] = useState(''); |
| [app/dashboard/barber/services/page.tsx:39](../../app/dashboard/barber/services/page.tsx#L39) |   const [newServiceDescription, setNewServiceDescription] = useState(''); |
| [app/dashboard/barber/services/page.tsx:40](../../app/dashboard/barber/services/page.tsx#L40) |   const [titzData, setTitzData] = useState({ duration: '45', price: '20' }); |
| [app/dashboard/barber/services/page.tsx:41](../../app/dashboard/barber/services/page.tsx#L41) |   const [isSavingTitz, setIsSavingTitz] = useState(false); |
| [app/dashboard/barber/services/page.tsx:42](../../app/dashboard/barber/services/page.tsx#L42) |   const [editingServiceId, setEditingServiceId] = useState&lt;string \| null&gt;(null); |
| [app/dashboard/barber/services/page.tsx:43](../../app/dashboard/barber/services/page.tsx#L43) |   const [editSvcData, setEditSvcData] = useState({ name: '', duration: '', price: '', description: '' }); |
| [app/dashboard/barber/services/page.tsx:44](../../app/dashboard/barber/services/page.tsx#L44) |   const [serviceCurrency, setServiceCurrency] = useState('EUR'); |
| [app/dashboard/barber/services/page.tsx:45](../../app/dashboard/barber/services/page.tsx#L45) |   const [toastMessage, setToastMessage] = useState(''); |
| [app/dashboard/barber/services/page.tsx:46](../../app/dashboard/barber/services/page.tsx#L46) |   const [confirmDelete, setConfirmDelete] = useState&lt;string \| null&gt;(null); |
| [app/dashboard/barber/services/page.tsx:47](../../app/dashboard/barber/services/page.tsx#L47) |   const [addingService, setAddingService] = useState(false); |
| [app/dashboard/barber/services/page.tsx:48](../../app/dashboard/barber/services/page.tsx#L48) |   const [savingService, setSavingService] = useState(false); |
| [app/dashboard/barber/services/page.tsx:71](../../app/dashboard/barber/services/page.tsx#L71) |     try { await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ titeZMeCut: { durationMinutes: parseInt(titzData.duration) \|\| 45, price: parseFloat(titzData.price) \|\| 20, currency: serviceCurrency } })); mutateProfile(); } catch (e) { console.error(e); } |
| [app/dashboard/barber/services/page.tsx:82](../../app/dashboard/barber/services/page.tsx#L82) |         { successMessage: t('barberDash.serviceAdded'), errorMessage: t('barberDash.failedAddService') } |
| [app/dashboard/barber/services/page.tsx:92](../../app/dashboard/barber/services/page.tsx#L92) |     try { await updateDoc(doc(db, 'services', svcId), { name: sanitizeText(editSvcData.name, 100), duration: parseInt(editSvcData.duration) \|\| 30, price: parseFloat(editSvcData.price) \|\| 0, description: sanitizeText(editSvcData.description, 150), updatedAt: Date.now() }); setEditingServiceId(null); toast(t('barberDash.serviceUpdated')); mutateServices(); } catch (e) { console.error(e); } finally { setSavingService(false); } |
| [app/dashboard/barber/services/page.tsx:108](../../app/dashboard/barber/services/page.tsx#L108) |       console.error(e); |
| [app/dashboard/barber/services/page.tsx:126](../../app/dashboard/barber/services/page.tsx#L126) |     try { await updateDoc(doc(db, 'professionalProfiles', user.uid), { currency: newCurrency }); mutateProfile(); toast(t('barberDash.currencyUpdated').replace('{currency}', newCurrency)); } catch (e) { console.error(e); } |
| [app/dashboard/barber/services/page.tsx:142](../../app/dashboard/barber/services/page.tsx#L142) |             ? t('emptyStates.noServicesAdded') |
| [app/dashboard/barber/services/page.tsx:162](../../app/dashboard/barber/services/page.tsx#L162) |             &lt;button onClick={saveTitzCut} disabled={isSavingTitz} className="text-[10px] font-black bg-brand-yellow text-[#0a0a0a] px-3 py-2 rounded-xl ml-1 disabled:opacity-50 hover:opacity-90"&gt;{isSavingTitz ? '...' : t('buttons.save')}&lt;/button&gt; |
| [app/dashboard/barber/services/page.tsx:171](../../app/dashboard/barber/services/page.tsx#L171) |                 &lt;input value={editSvcData.name} onChange={e =&gt; setEditSvcData(p =&gt; ({ ...p, name: e.target.value }))} className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-yellow" placeholder={t('barberLayout.serviceNameInputPlaceholder')} /&gt; |
| [app/dashboard/barber/services/page.tsx:172](../../app/dashboard/barber/services/page.tsx#L172) |                 &lt;input value={editSvcData.duration} onChange={e =&gt; setEditSvcData(p =&gt; ({ ...p, duration: e.target.value }))} className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-yellow" type="number" placeholder={t('forms.minPlaceholder')} /&gt; |
| [app/dashboard/barber/services/page.tsx:173](../../app/dashboard/barber/services/page.tsx#L173) |                 &lt;input value={editSvcData.price} onChange={e =&gt; setEditSvcData(p =&gt; ({ ...p, price: e.target.value }))} className="bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-yellow" type="number" placeholder={t('forms.pricePlaceholder')} /&gt; |
| [app/dashboard/barber/services/page.tsx:175](../../app/dashboard/barber/services/page.tsx#L175) |               &lt;textarea value={editSvcData.description} onChange={e =&gt; setEditSvcData(p =&gt; ({ ...p, description: e.target.value }))} maxLength={150} rows={2} placeholder={t('barberLayout.descOptional')} className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-brand-yellow resize-none mb-3" /&gt; |
| [app/dashboard/barber/services/page.tsx:178](../../app/dashboard/barber/services/page.tsx#L178) |                 &lt;button onClick={() =&gt; saveEditService(svc.id)} disabled={savingService} className="bg-brand-yellow text-[#0a0a0a] text-xs font-black px-4 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-60"&gt;{savingService ? t('settings.saving') : t('buttons.save')}&lt;/button&gt; |
| [app/dashboard/barber/services/page.tsx:184](../../app/dashboard/barber/services/page.tsx#L184) |                 &lt;button onClick={() =&gt; moveService(svc.id, 'up')} disabled={idx === 0} className="text-[#444] hover:text-[#888] text-xs leading-none disabled:opacity-20"&gt;↑&lt;/button&gt; |
| [app/dashboard/barber/services/page.tsx:185](../../app/dashboard/barber/services/page.tsx#L185) |                 &lt;button onClick={() =&gt; moveService(svc.id, 'down')} disabled={idx === sortedServices.length - 1} className="text-[#444] hover:text-[#888] text-xs leading-none disabled:opacity-20"&gt;↓&lt;/button&gt; |
| [app/dashboard/barber/services/page.tsx:213](../../app/dashboard/barber/services/page.tsx#L213) |           &lt;div&gt;&lt;label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5"&gt;{t('barberLayout.nameLabel')}&lt;/label&gt;&lt;input value={newServiceName} onChange={e =&gt; setNewServiceName(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" placeholder={t('barberDash.servicePlaceholder')} /&gt;&lt;/div&gt; |
| [app/dashboard/barber/services/page.tsx:214](../../app/dashboard/barber/services/page.tsx#L214) |           &lt;div&gt;&lt;label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5"&gt;{t('onboarding.mins')}&lt;/label&gt;&lt;input value={newServiceDuration} onChange={e =&gt; setNewServiceDuration(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" placeholder="30" /&gt;&lt;/div&gt; |
| [app/dashboard/barber/services/page.tsx:215](../../app/dashboard/barber/services/page.tsx#L215) |           &lt;div&gt;&lt;label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5"&gt;{t('barberLayout.priceLabel')} {svcSym}&lt;/label&gt;&lt;input value={newServicePrice} onChange={e =&gt; setNewServicePrice(e.target.value)} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow" type="number" placeholder="0" /&gt;&lt;/div&gt; |
| [app/dashboard/barber/services/page.tsx:217](../../app/dashboard/barber/services/page.tsx#L217) |         &lt;div className="mb-2"&gt;&lt;label className="text-[10px] font-extrabold text-brand-text-secondary block mb-1.5"&gt;{t('barberLayout.descOptional')}&lt;/label&gt;&lt;textarea value={newServiceDescription} onChange={e =&gt; setNewServiceDescription(e.target.value)} maxLength={150} rows={2} placeholder={t('barberLayout.serviceDescPlaceholder')} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-2 text-white text-sm outline-none transition-colors focus:border-brand-yellow resize-none" /&gt;&lt;div className="text-[10px] text-[#444] text-right mt-0.5"&gt;{newServiceDescription.length}/150&lt;/div&gt;&lt;/div&gt; |
| [app/dashboard/barber/services/page.tsx:219](../../app/dashboard/barber/services/page.tsx#L219) |         &lt;button onClick={addService} disabled={addingService} className="bg-brand-yellow text-[#0a0a0a] w-full mt-2 px-7 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90 disabled:opacity-60"&gt;{addingService ? t('barberLayout.adding') : t('buttons.addService')}&lt;/button&gt; |
| [app/dashboard/barber/services/page.tsx:220](../../app/dashboard/barber/services/page.tsx#L220) |         &lt;div className="mt-4"&gt;&lt;div className="text-[10px] text-[#555] font-bold mb-2"&gt;{t('barberLayout.quickAdd')}&lt;/div&gt;&lt;div className="flex flex-wrap gap-2"&gt;{QUICK_CHIPS.map(chip =&gt; { const exists = (services as any[]).some((s: any) =&gt; s.name.toLowerCase() === chip.name.toLowerCase()); return (&lt;button key={chip.name} disabled={exists} onClick={() =&gt; { setNewServiceName(chip.name); setNewServiceDuration(String(chip.duration)); setNewServicePrice(''); document.getElementById('add-service-form')?.scrollIntoView({ behavior: 'smooth' }); }} className={`inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-3 py-1 border transition-colors ${exists ? 'border-[#1e1e1e] text-[#444] bg-[#111] cursor-not-allowed' : 'bg-[#141414] border-dashed border-[#2a2a2a] text-[#666] hover:border-brand-yellow hover:text-brand-yellow cursor-pointer'}`}&gt;{exists ? '✓' : '+'} {chip.name}&lt;/button&gt;); })}&lt;/div&gt;&lt;/div&gt; |
| [app/dashboard/barber/services/page.tsx:224](../../app/dashboard/barber/services/page.tsx#L224) |       &lt;ConfirmDialog |
| [app/dashboard/barber/services/page.tsx:233](../../app/dashboard/barber/services/page.tsx#L233) |           await safeFirestore(() =&gt; deleteDoc(doc(db, 'services', confirmDelete!)), { successMessage: t('barberDash.serviceDeleted'), errorMessage: t('barberDash.failedDeleteService') }); |
| [app/dashboard/client/badges/page.tsx:4](../../app/dashboard/client/badges/page.tsx#L4) | import { ComingSoon } from '@/components/ComingSoon'; |
| [app/dashboard/client/badges/page.tsx:12](../../app/dashboard/client/badges/page.tsx#L12) |         &lt;ComingSoon |
| [app/dashboard/client/badges/page.tsx:16](../../app/dashboard/client/badges/page.tsx#L16) |           showNotify |
| [app/dashboard/client/bookings/page.tsx:3](../../app/dashboard/client/bookings/page.tsx#L3) | import { useState, useEffect, useRef } from 'react'; |
| [app/dashboard/client/bookings/page.tsx:12](../../app/dashboard/client/bookings/page.tsx#L12) | import { ConfirmDialog } from '@/components/ConfirmDialog'; |
| [app/dashboard/client/bookings/page.tsx:32](../../app/dashboard/client/bookings/page.tsx#L32) |   const [bookings, setBookings] = useState&lt;any[]&gt;([]); |
| [app/dashboard/client/bookings/page.tsx:33](../../app/dashboard/client/bookings/page.tsx#L33) |   const [fetching, setFetching] = useState(true); |
| [app/dashboard/client/bookings/page.tsx:34](../../app/dashboard/client/bookings/page.tsx#L34) |   const [confirmCancel, setConfirmCancel] = useState&lt;string \| null&gt;(null); |
| [app/dashboard/client/bookings/page.tsx:62](../../app/dashboard/client/bookings/page.tsx#L62) |                 console.error('Failed to enrich barber name:', e); |
| [app/dashboard/client/bookings/page.tsx:73](../../app/dashboard/client/bookings/page.tsx#L73) |                 console.error('Failed to enrich service name:', e); |
| [app/dashboard/client/bookings/page.tsx:106](../../app/dashboard/client/bookings/page.tsx#L106) |         console.error('Client bookings listener error:', err); |
| [app/dashboard/client/bookings/page.tsx:119](../../app/dashboard/client/bookings/page.tsx#L119) |       toast.error(t('clientDash.cannotCancelSoon')); |
| [app/dashboard/client/bookings/page.tsx:122](../../app/dashboard/client/bookings/page.tsx#L122) |     const loadingToast = toast.loading(t('clientDash.cancellingAppt')); |
| [app/dashboard/client/bookings/page.tsx:138](../../app/dashboard/client/bookings/page.tsx#L138) |       toast.success(t('clientDash.apptCancelled'), { id: loadingToast }); |
| [app/dashboard/client/bookings/page.tsx:140](../../app/dashboard/client/bookings/page.tsx#L140) |       console.error(e); |
| [app/dashboard/client/bookings/page.tsx:141](../../app/dashboard/client/bookings/page.tsx#L141) |       toast.error(t('clientDash.failedToCancel'), { id: loadingToast }); |
| [app/dashboard/client/bookings/page.tsx:145](../../app/dashboard/client/bookings/page.tsx#L145) |   if (fetching) return &lt;div className="p-10 text-center animate-pulse text-brand-text-secondary"&gt;{t('misc.loading')}&lt;/div&gt;; |
| [app/dashboard/client/bookings/page.tsx:167](../../app/dashboard/client/bookings/page.tsx#L167) |               {t('clientDash.noUpcomingBookings')} &lt;Link href="/barbers" className="text-brand-yellow font-bold no-underline"&gt;{t('emptyStates.findABarber')}&lt;/Link&gt; · &lt;Link href="/shops" className="text-brand-yellow font-bold no-underline"&gt;{t('clientDash.findABarbershop')}&lt;/Link&gt; |
| [app/dashboard/client/bookings/page.tsx:307](../../app/dashboard/client/bookings/page.tsx#L307) |       &lt;ConfirmDialog |
| [app/dashboard/client/favorites/page.tsx:46](../../app/dashboard/client/favorites/page.tsx#L46) |     return &lt;div className="p-10 text-center animate-pulse text-brand-text-secondary"&gt;{t('misc.loading')}&lt;/div&gt;; |
| [app/dashboard/client/favorites/page.tsx:62](../../app/dashboard/client/favorites/page.tsx#L62) |               {t('emptyStates.findABarber')} |
| [app/dashboard/client/gift-a-cut/page.tsx:4](../../app/dashboard/client/gift-a-cut/page.tsx#L4) | import { ComingSoon } from '@/components/ComingSoon'; |
| [app/dashboard/client/gift-a-cut/page.tsx:12](../../app/dashboard/client/gift-a-cut/page.tsx#L12) |         &lt;ComingSoon |
| [app/dashboard/client/gift-a-cut/page.tsx:16](../../app/dashboard/client/gift-a-cut/page.tsx#L16) |           showNotify |
| [app/dashboard/client/layout.tsx:12](../../app/dashboard/client/layout.tsx#L12) |   const { user, appUser, loading } = useAuth(); |
| [app/dashboard/client/layout.tsx:18](../../app/dashboard/client/layout.tsx#L18) |     if (loading) return; |
| [app/dashboard/client/layout.tsx:30](../../app/dashboard/client/layout.tsx#L30) |   }, [user, appUser, loading, router]); |
| [app/dashboard/client/messages/page.tsx:4](../../app/dashboard/client/messages/page.tsx#L4) | import { ComingSoon } from '@/components/ComingSoon'; |
| [app/dashboard/client/messages/page.tsx:12](../../app/dashboard/client/messages/page.tsx#L12) |         &lt;ComingSoon |
| [app/dashboard/client/messages/page.tsx:16](../../app/dashboard/client/messages/page.tsx#L16) |           showNotify |
| [app/dashboard/client/my-look/page.tsx:4](../../app/dashboard/client/my-look/page.tsx#L4) | import { ComingSoon } from '@/components/ComingSoon'; |
| [app/dashboard/client/my-look/page.tsx:12](../../app/dashboard/client/my-look/page.tsx#L12) |         &lt;ComingSoon |
| [app/dashboard/client/my-look/page.tsx:16](../../app/dashboard/client/my-look/page.tsx#L16) |           showNotify |
| [app/dashboard/client/reviews/page.tsx:3](../../app/dashboard/client/reviews/page.tsx#L3) | import { useState } from 'react'; |
| [app/dashboard/client/reviews/page.tsx:38](../../app/dashboard/client/reviews/page.tsx#L38) |   const [visibleCount, setVisibleCount] = useState(10); |
| [app/dashboard/client/reviews/page.tsx:84](../../app/dashboard/client/reviews/page.tsx#L84) |     return &lt;div className="p-10 text-center animate-pulse text-brand-text-secondary"&gt;{t('misc.loading')}&lt;/div&gt;; |
| [app/dashboard/client/settings/page.tsx:3](../../app/dashboard/client/settings/page.tsx#L3) | import { useState, useEffect, useMemo, useRef } from 'react'; |
| [app/dashboard/client/settings/page.tsx:15](../../app/dashboard/client/settings/page.tsx#L15) |     loading: () =&gt; ( |
| [app/dashboard/client/settings/page.tsx:30](../../app/dashboard/client/settings/page.tsx#L30) |   const { user, appUser, loading, refreshUser } = useAuth(); |
| [app/dashboard/client/settings/page.tsx:33](../../app/dashboard/client/settings/page.tsx#L33) |   const [firstName, setFirstName] = useState(''); |
| [app/dashboard/client/settings/page.tsx:34](../../app/dashboard/client/settings/page.tsx#L34) |   const [lastName, setLastName] = useState(''); |
| [app/dashboard/client/settings/page.tsx:35](../../app/dashboard/client/settings/page.tsx#L35) |   const [selectedCountry, setSelectedCountry] = useState&lt;any&gt;(null); |
| [app/dashboard/client/settings/page.tsx:36](../../app/dashboard/client/settings/page.tsx#L36) |   const [selectedState, setSelectedState] = useState&lt;any&gt;(null); |
| [app/dashboard/client/settings/page.tsx:37](../../app/dashboard/client/settings/page.tsx#L37) |   const [selectedCityOption, setSelectedCityOption] = useState&lt;any&gt;(null); |
| [app/dashboard/client/settings/page.tsx:38](../../app/dashboard/client/settings/page.tsx#L38) |   const [phoneCode, setPhoneCode] = useState&lt;any&gt;(null); |
| [app/dashboard/client/settings/page.tsx:39](../../app/dashboard/client/settings/page.tsx#L39) |   const [phoneNumberInput, setPhoneNumberInput] = useState(''); |
| [app/dashboard/client/settings/page.tsx:40](../../app/dashboard/client/settings/page.tsx#L40) |   const [selectedLanguages, setSelectedLanguages] = useState&lt;any&gt;([]); |
| [app/dashboard/client/settings/page.tsx:42](../../app/dashboard/client/settings/page.tsx#L42) |   const [isSubmitting, setIsSubmitting] = useState(false); |
| [app/dashboard/client/settings/page.tsx:43](../../app/dashboard/client/settings/page.tsx#L43) |   const [isUploading, setIsUploading] = useState(false); |
| [app/dashboard/client/settings/page.tsx:44](../../app/dashboard/client/settings/page.tsx#L44) |   const [errorMsg, setErrorMsg] = useState(''); |
| [app/dashboard/client/settings/page.tsx:45](../../app/dashboard/client/settings/page.tsx#L45) |   const [csc, setCsc] = useState&lt;any&gt;(null); |
| [app/dashboard/client/settings/page.tsx:46](../../app/dashboard/client/settings/page.tsx#L46) |   const [languageOptions, setLanguageOptions] = useState&lt;{value: string; label: string}[]&gt;([]); |
| [app/dashboard/client/settings/page.tsx:151](../../app/dashboard/client/settings/page.tsx#L151) |     placeholder: (base: any) =&gt; ({ |
| [app/dashboard/client/settings/page.tsx:190](../../app/dashboard/client/settings/page.tsx#L190) |       console.error(err); |
| [app/dashboard/client/settings/page.tsx:191](../../app/dashboard/client/settings/page.tsx#L191) |       toast.error(t('settings.failedToSave')); |
| [app/dashboard/client/settings/page.tsx:203](../../app/dashboard/client/settings/page.tsx#L203) |       toast.error(t('settings.invalidImageClient')); |
| [app/dashboard/client/settings/page.tsx:207](../../app/dashboard/client/settings/page.tsx#L207) |       toast.error(t('settings.fileSizeLimit')); |
| [app/dashboard/client/settings/page.tsx:211](../../app/dashboard/client/settings/page.tsx#L211) |     setIsUploading(true); |
| [app/dashboard/client/settings/page.tsx:212](../../app/dashboard/client/settings/page.tsx#L212) |     const toastId = toast.loading(t('settings.uploadingPhoto')); |
| [app/dashboard/client/settings/page.tsx:224](../../app/dashboard/client/settings/page.tsx#L224) |       console.error(err); |
| [app/dashboard/client/settings/page.tsx:225](../../app/dashboard/client/settings/page.tsx#L225) |       toast.error(t('errors.uploadFailed'), { id: toastId }); |
| [app/dashboard/client/settings/page.tsx:227](../../app/dashboard/client/settings/page.tsx#L227) |       setIsUploading(false); |
| [app/dashboard/client/settings/page.tsx:231](../../app/dashboard/client/settings/page.tsx#L231) |   if (loading) return &lt;div className="p-10 text-center animate-pulse text-brand-text-secondary"&gt;{t('misc.loading')}&lt;/div&gt;; |
| [app/dashboard/client/settings/page.tsx:282](../../app/dashboard/client/settings/page.tsx#L282) |                   className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]"  |
| [app/dashboard/client/settings/page.tsx:292](../../app/dashboard/client/settings/page.tsx#L292) |                   className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]"  |
| [app/dashboard/client/settings/page.tsx:318](../../app/dashboard/client/settings/page.tsx#L318) |                     placeholder={t('forms.codePlaceholder')} |
| [app/dashboard/client/settings/page.tsx:328](../../app/dashboard/client/settings/page.tsx#L328) |                     className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]" |
| [app/dashboard/client/settings/page.tsx:329](../../app/dashboard/client/settings/page.tsx#L329) |                     placeholder={t('forms.phonePlaceholder')} |
| [app/dashboard/client/settings/page.tsx:359](../../app/dashboard/client/settings/page.tsx#L359) |                     placeholder={t('forms.countryPlaceholder')} |
| [app/dashboard/client/settings/page.tsx:390](../../app/dashboard/client/settings/page.tsx#L390) |                     placeholder="Region..." |
| [app/dashboard/client/settings/page.tsx:417](../../app/dashboard/client/settings/page.tsx#L417) |                     placeholder={t('forms.cityPlaceholder')} |
| [app/dashboard/client/settings/page.tsx:442](../../app/dashboard/client/settings/page.tsx#L442) |                   placeholder={t('misc.selectLanguages')} |
| [app/dashboard/client/settings/page.tsx:446](../../app/dashboard/client/settings/page.tsx#L446) |             {errorMsg && ( |
| [app/dashboard/client/settings/page.tsx:448](../../app/dashboard/client/settings/page.tsx#L448) |                 {errorMsg} |
| [app/dashboard/client/settings/page.tsx:454](../../app/dashboard/client/settings/page.tsx#L454) |               disabled={isSubmitting} |
| [app/dashboard/client/titiza/page.tsx:3](../../app/dashboard/client/titiza/page.tsx#L3) | import { useCallback, useEffect, useRef, useState } from 'react'; |
| [app/dashboard/client/titiza/page.tsx:24](../../app/dashboard/client/titiza/page.tsx#L24) | type Phase = 'loading' \| 'genesis' \| 'dashboard' \| 'phase2'; |
| [app/dashboard/client/titiza/page.tsx:30](../../app/dashboard/client/titiza/page.tsx#L30) |   const [phase, setPhase] = useState&lt;Phase&gt;('loading'); |
| [app/dashboard/client/titiza/page.tsx:62](../../app/dashboard/client/titiza/page.tsx#L62) |   const showDashboard = phase === 'dashboard'; |
| [app/dashboard/client/titiza/page.tsx:63](../../app/dashboard/client/titiza/page.tsx#L63) |   const showPhase2 = phase === 'phase2'; |
| [app/dashboard/client/titiza/page.tsx:69](../../app/dashboard/client/titiza/page.tsx#L69) |       {phase !== 'loading' && ( |
| [app/dashboard/client/titiza/page.tsx:71](../../app/dashboard/client/titiza/page.tsx#L71) |           {showPhase2 ? ( |
| [app/dashboard/client/titiza/page.tsx:77](../../app/dashboard/client/titiza/page.tsx#L77) |                 mode={showDashboard ? 'dashboard' : 'genesis'} |
| [app/dashboard/client/titiza/page.tsx:82](../../app/dashboard/client/titiza/page.tsx#L82) |               {showDashboard && ( |
| [app/dashboard/shop/billing/page.tsx:17](../../app/dashboard/shop/billing/page.tsx#L17) |           {t('shop.subscriptionComingSoon')} |
| [app/dashboard/shop/bookings/page.tsx:3](../../app/dashboard/shop/bookings/page.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [app/dashboard/shop/bookings/page.tsx:57](../../app/dashboard/shop/bookings/page.tsx#L57) |   const { user, loading } = useAuth(); |
| [app/dashboard/shop/bookings/page.tsx:61](../../app/dashboard/shop/bookings/page.tsx#L61) |   const [bookings, setBookings] = useState&lt;any[]&gt;([]); |
| [app/dashboard/shop/bookings/page.tsx:62](../../app/dashboard/shop/bookings/page.tsx#L62) |   const [barberFilter, setBarberFilter] = useState('all'); |
| [app/dashboard/shop/bookings/page.tsx:63](../../app/dashboard/shop/bookings/page.tsx#L63) |   const [timeFilter, setTimeFilter] = useState('month'); |
| [app/dashboard/shop/bookings/page.tsx:64](../../app/dashboard/shop/bookings/page.tsx#L64) |   const [statusFilter, setStatusFilter] = useState('all'); |
| [app/dashboard/shop/bookings/page.tsx:65](../../app/dashboard/shop/bookings/page.tsx#L65) |   const [search, setSearch] = useState(''); |
| [app/dashboard/shop/bookings/page.tsx:66](../../app/dashboard/shop/bookings/page.tsx#L66) |   const [shopCurrency, setShopCurrency] = useState('EUR'); |
| [app/dashboard/shop/bookings/page.tsx:67](../../app/dashboard/shop/bookings/page.tsx#L67) |   const [currentPage, setCurrentPage] = useState(1); |
| [app/dashboard/shop/bookings/page.tsx:71](../../app/dashboard/shop/bookings/page.tsx#L71) |     if (!loading && !user) router.replace('/login'); |
| [app/dashboard/shop/bookings/page.tsx:72](../../app/dashboard/shop/bookings/page.tsx#L72) |   }, [user, loading, router]); |
| [app/dashboard/shop/bookings/page.tsx:185](../../app/dashboard/shop/bookings/page.tsx#L185) |     const loadingToast = toast.loading(t('shop.updatingBooking')); |
| [app/dashboard/shop/bookings/page.tsx:188](../../app/dashboard/shop/bookings/page.tsx#L188) |       toast.success(t('shop.bookingUpdated'), { id: loadingToast }); |
| [app/dashboard/shop/bookings/page.tsx:190](../../app/dashboard/shop/bookings/page.tsx#L190) |       toast.error(t('shop.failedUpdate'), { id: loadingToast }); |
| [app/dashboard/shop/bookings/page.tsx:194](../../app/dashboard/shop/bookings/page.tsx#L194) |   if (loading) return &lt;div className="p-10 text-center animate-pulse text-[#555]"&gt;{t('misc.loading')}&lt;/div&gt;; |
| [app/dashboard/shop/bookings/page.tsx:228](../../app/dashboard/shop/bookings/page.tsx#L228) |           placeholder={t('shop.searchFilter')} |
| [app/dashboard/shop/bookings/page.tsx:328](../../app/dashboard/shop/bookings/page.tsx#L328) |             &lt;button onClick={() =&gt; setCurrentPage(p =&gt; Math.max(1, p - 1))} disabled={currentPage === 1} |
| [app/dashboard/shop/bookings/page.tsx:341](../../app/dashboard/shop/bookings/page.tsx#L341) |             &lt;button onClick={() =&gt; setCurrentPage(p =&gt; Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} |
| [app/dashboard/shop/challenge/page.tsx:11](../../app/dashboard/shop/challenge/page.tsx#L11) |   const { user, loading: authLoading } = useAuth(); |
| [app/dashboard/shop/earnings/page.tsx:3](../../app/dashboard/shop/earnings/page.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [app/dashboard/shop/earnings/page.tsx:36](../../app/dashboard/shop/earnings/page.tsx#L36) |   const { user, loading } = useAuth(); |
| [app/dashboard/shop/earnings/page.tsx:40](../../app/dashboard/shop/earnings/page.tsx#L40) |   const [bookings, setBookings] = useState&lt;any[]&gt;([]); |
| [app/dashboard/shop/earnings/page.tsx:41](../../app/dashboard/shop/earnings/page.tsx#L41) |   const [barbers, setBarbers] = useState&lt;any[]&gt;([]); |
| [app/dashboard/shop/earnings/page.tsx:42](../../app/dashboard/shop/earnings/page.tsx#L42) |   const [barberNames, setBarberNames] = useState&lt;Record&lt;string, string&gt;&gt;({}); |
| [app/dashboard/shop/earnings/page.tsx:43](../../app/dashboard/shop/earnings/page.tsx#L43) |   const [shopCurrency, setShopCurrency] = useState('EUR'); |
| [app/dashboard/shop/earnings/page.tsx:61](../../app/dashboard/shop/earnings/page.tsx#L61) |   const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value); |
| [app/dashboard/shop/earnings/page.tsx:66](../../app/dashboard/shop/earnings/page.tsx#L66) |     if (!loading && !user) router.replace('/login'); |
| [app/dashboard/shop/earnings/page.tsx:67](../../app/dashboard/shop/earnings/page.tsx#L67) |   }, [user, loading, router]); |
| [app/dashboard/shop/earnings/page.tsx:158](../../app/dashboard/shop/earnings/page.tsx#L158) |   if (loading) return &lt;div className="p-10 text-center animate-pulse text-[#555]"&gt;{t('misc.loading')}&lt;/div&gt;; |
| [app/dashboard/shop/layout.tsx:3](../../app/dashboard/shop/layout.tsx#L3) | import { useState, useEffect } from "react"; |
| [app/dashboard/shop/layout.tsx:14](../../app/dashboard/shop/layout.tsx#L14) |   const { user, appUser, loading } = useAuth(); |
| [app/dashboard/shop/layout.tsx:18](../../app/dashboard/shop/layout.tsx#L18) |   const [toastMessage, setToastMessage] = useState(''); |
| [app/dashboard/shop/layout.tsx:19](../../app/dashboard/shop/layout.tsx#L19) |   const [challengeUnread, setChallengeUnread] = useState(0); |
| [app/dashboard/shop/layout.tsx:38](../../app/dashboard/shop/layout.tsx#L38) |     if (loading) return; |
| [app/dashboard/shop/layout.tsx:50](../../app/dashboard/shop/layout.tsx#L50) |   }, [user, appUser, loading, router]); |
| [app/dashboard/shop/page.tsx:3](../../app/dashboard/shop/page.tsx#L3) | import { useState, useEffect } from "react"; |
| [app/dashboard/shop/page.tsx:136](../../app/dashboard/shop/page.tsx#L136) |   const { user, loading } = useAuth(); |
| [app/dashboard/shop/page.tsx:141](../../app/dashboard/shop/page.tsx#L141) |   const [shop, setShop] = useState&lt;ShopData \| null&gt;(null); |
| [app/dashboard/shop/page.tsx:142](../../app/dashboard/shop/page.tsx#L142) |   const [barbers, setBarbers] = useState&lt;ProfessionalProfile[]&gt;([]); |
| [app/dashboard/shop/page.tsx:143](../../app/dashboard/shop/page.tsx#L143) |   const [bookings, setBookings] = useState&lt;Booking[]&gt;([]); |
| [app/dashboard/shop/page.tsx:144](../../app/dashboard/shop/page.tsx#L144) |   const [invites, setInvites] = useState&lt;Invite[]&gt;([]); |
| [app/dashboard/shop/page.tsx:145](../../app/dashboard/shop/page.tsx#L145) |   const [schedules, setSchedules] = useState&lt;Record&lt;string, BarberSchedule&gt;&gt;({}); |
| [app/dashboard/shop/page.tsx:146](../../app/dashboard/shop/page.tsx#L146) |   const [services, setServices] = useState&lt;unknown[]&gt;([]); |
| [app/dashboard/shop/page.tsx:147](../../app/dashboard/shop/page.tsx#L147) |   const [expandedBarber, setExpandedBarber] = useState&lt;string \| null&gt;(null); |
| [app/dashboard/shop/page.tsx:151](../../app/dashboard/shop/page.tsx#L151) |     if (!loading && !user) router.replace("/login"); |
| [app/dashboard/shop/page.tsx:152](../../app/dashboard/shop/page.tsx#L152) |   }, [user, loading, router]); |
| [app/dashboard/shop/page.tsx:357](../../app/dashboard/shop/page.tsx#L357) |   if (loading \|\| (!shop && user)) { |
| [app/dashboard/shop/reviews/page.tsx:3](../../app/dashboard/shop/reviews/page.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [app/dashboard/shop/reviews/page.tsx:24](../../app/dashboard/shop/reviews/page.tsx#L24) |   const { user, loading } = useAuth(); |
| [app/dashboard/shop/reviews/page.tsx:28](../../app/dashboard/shop/reviews/page.tsx#L28) |   const [barbers, setBarbers] = useState&lt;any[]&gt;([]); |
| [app/dashboard/shop/reviews/page.tsx:29](../../app/dashboard/shop/reviews/page.tsx#L29) |   const [barberNames, setBarberNames] = useState&lt;Record&lt;string, string&gt;&gt;({}); |
| [app/dashboard/shop/reviews/page.tsx:30](../../app/dashboard/shop/reviews/page.tsx#L30) |   const [reviews, setReviews] = useState&lt;any[]&gt;([]); |
| [app/dashboard/shop/reviews/page.tsx:31](../../app/dashboard/shop/reviews/page.tsx#L31) |   const [fetching, setFetching] = useState(true); |
| [app/dashboard/shop/reviews/page.tsx:32](../../app/dashboard/shop/reviews/page.tsx#L32) |   const [barberFilter, setBarberFilter] = useState('all'); |
| [app/dashboard/shop/reviews/page.tsx:33](../../app/dashboard/shop/reviews/page.tsx#L33) |   const [starFilter, setStarFilter] = useState(0); // 0 = all |
| [app/dashboard/shop/reviews/page.tsx:34](../../app/dashboard/shop/reviews/page.tsx#L34) |   const [visibleCount, setVisibleCount] = useState(10); |
| [app/dashboard/shop/reviews/page.tsx:37](../../app/dashboard/shop/reviews/page.tsx#L37) |     if (!loading && !user) router.replace('/login'); |
| [app/dashboard/shop/reviews/page.tsx:38](../../app/dashboard/shop/reviews/page.tsx#L38) |   }, [user, loading, router]); |
| [app/dashboard/shop/reviews/page.tsx:91](../../app/dashboard/shop/reviews/page.tsx#L91) |         console.error(e); |
| [app/dashboard/shop/reviews/page.tsx:128](../../app/dashboard/shop/reviews/page.tsx#L128) |   if (loading \|\| fetching) return &lt;div className="p-10 text-center animate-pulse text-[#555]"&gt;{t('shopDash.loadingReviews')}&lt;/div&gt;; |
| [app/for-shops/page.tsx:3](../../app/for-shops/page.tsx#L3) | import { useEffect, useState } from 'react' |
| [app/for-shops/page.tsx:31](../../app/for-shops/page.tsx#L31) |   const [openFaq, setOpenFaq] = useState&lt;number \| null&gt;(null) |
| [app/forgot-password/page.tsx:3](../../app/forgot-password/page.tsx#L3) | import { useState } from 'react'; |
| [app/forgot-password/page.tsx:9](../../app/forgot-password/page.tsx#L9) |   const [email, setEmail] = useState(''); |
| [app/forgot-password/page.tsx:10](../../app/forgot-password/page.tsx#L10) |   const [sent, setSent] = useState(false); |
| [app/forgot-password/page.tsx:11](../../app/forgot-password/page.tsx#L11) |   const [loading, setLoading] = useState(false); |
| [app/forgot-password/page.tsx:12](../../app/forgot-password/page.tsx#L12) |   const [error, setError] = useState(''); |
| [app/forgot-password/page.tsx:17](../../app/forgot-password/page.tsx#L17) |       setError(t('errors.pleaseEnterEmail')); |
| [app/forgot-password/page.tsx:34](../../app/forgot-password/page.tsx#L34) |         setError(t('errors.somethingWentWrong')); |
| [app/forgot-password/page.tsx:97](../../app/forgot-password/page.tsx#L97) |                 placeholder={t('forms.emailAddressPlaceholder')} |
| [app/forgot-password/page.tsx:100](../../app/forgot-password/page.tsx#L100) |                 onKeyDown={e =&gt; e.key === 'Enter' && !loading && handleReset()} |
| [app/forgot-password/page.tsx:101](../../app/forgot-password/page.tsx#L101) |                 disabled={loading} |
| [app/forgot-password/page.tsx:116](../../app/forgot-password/page.tsx#L116) |               {error && ( |
| [app/forgot-password/page.tsx:125](../../app/forgot-password/page.tsx#L125) |                   {error} |
| [app/forgot-password/page.tsx:131](../../app/forgot-password/page.tsx#L131) |                 disabled={loading} |
| [app/forgot-password/page.tsx:133](../../app/forgot-password/page.tsx#L133) |                   background: loading ? '#2a2000' : '#F5C518', |
| [app/forgot-password/page.tsx:134](../../app/forgot-password/page.tsx#L134) |                   color: loading ? '#F5C518' : '#0a0a0a', |
| [app/forgot-password/page.tsx:140](../../app/forgot-password/page.tsx#L140) |                   cursor: loading ? 'not-allowed' : 'pointer', |
| [app/forgot-password/page.tsx:145](../../app/forgot-password/page.tsx#L145) |                 {loading ? t('forms.sending') : t('forms.sendResetLink')} |
| [app/layout.tsx:89](../../app/layout.tsx#L89) |                 error: { |
| [app/login/page.tsx:3](../../app/login/page.tsx#L3) | import { useState, useEffect } from 'react'; |
| [app/login/page.tsx:18](../../app/login/page.tsx#L18) |   const { user, appUser, loading } = useAuth(); |
| [app/login/page.tsx:19](../../app/login/page.tsx#L19) |   const [email, setEmail] = useState(''); |
| [app/login/page.tsx:20](../../app/login/page.tsx#L20) |   const [password, setPassword] = useState(''); |
| [app/login/page.tsx:21](../../app/login/page.tsx#L21) |   const [errorStatus, setErrorStatus] = useState(''); |
| [app/login/page.tsx:22](../../app/login/page.tsx#L22) |   const [isSubmitting, setIsSubmitting] = useState(false); |
| [app/login/page.tsx:23](../../app/login/page.tsx#L23) |   const [googleSubmitting, setGoogleSubmitting] = useState(false); |
| [app/login/page.tsx:24](../../app/login/page.tsx#L24) |   const [rememberMe, setRememberMe] = useState(true); |
| [app/login/page.tsx:25](../../app/login/page.tsx#L25) |   const [barberCount, setBarberCount] = useState&lt;number \| null&gt;(null); |
| [app/login/page.tsx:26](../../app/login/page.tsx#L26) |   const [showSignUpLink, setShowSignUpLink] = useState(false); |
| [app/login/page.tsx:27](../../app/login/page.tsx#L27) |   const [showVerifyGate, setShowVerifyGate] = useState(false); |
| [app/login/page.tsx:28](../../app/login/page.tsx#L28) |   const [verifyDest, setVerifyDest] = useState('/'); |
| [app/login/page.tsx:45](../../app/login/page.tsx#L45) |   if (loading) return null; |
| [app/login/page.tsx:49](../../app/login/page.tsx#L49) |   if (showVerifyGate) { |
| [app/login/page.tsx:83](../../app/login/page.tsx#L83) |         setErrorStatus(t('errors.noAccountFound')); |
| [app/login/page.tsx:116](../../app/login/page.tsx#L116) |     } catch (error: any) { |
| [app/login/page.tsx:117](../../app/login/page.tsx#L117) |       if (error.code === 'auth/account-exists-with-different-credential') { |
| [app/login/page.tsx:118](../../app/login/page.tsx#L118) |         setErrorStatus(t('errors.accountExistsWithEmail')); |
| [app/login/page.tsx:121](../../app/login/page.tsx#L121) |       if (error.code === 'auth/network-request-failed') { |
| [app/login/page.tsx:122](../../app/login/page.tsx#L122) |         setErrorStatus(t('errors.connectionError')); |
| [app/login/page.tsx:125](../../app/login/page.tsx#L125) |       if (error.code !== 'auth/popup-closed-by-user') { |
| [app/login/page.tsx:126](../../app/login/page.tsx#L126) |         setErrorStatus(t('errors.googleSignInFailed')); |
| [app/login/page.tsx:152](../../app/login/page.tsx#L152) |           setErrorStatus(t('errors.adminAccountError')); |
| [app/login/page.tsx:193](../../app/login/page.tsx#L193) |       console.error(err); |
| [app/login/page.tsx:200](../../app/login/page.tsx#L200) |             return t('errors.invalidCredentials'); |
| [app/login/page.tsx:202](../../app/login/page.tsx#L202) |             return t('errors.tooManyAttempts'); |
| [app/login/page.tsx:204](../../app/login/page.tsx#L204) |             return t('errors.accountDisabled'); |
| [app/login/page.tsx:206](../../app/login/page.tsx#L206) |             return t('errors.connectionError'); |
| [app/login/page.tsx:208](../../app/login/page.tsx#L208) |             return t('errors.somethingWentWrong'); |
| [app/login/page.tsx:242](../../app/login/page.tsx#L242) |         disabled={googleSubmitting} |
| [app/login/page.tsx:285](../../app/login/page.tsx#L285) |             placeholder={t('forms.emailPlaceholder')} |
| [app/login/page.tsx:295](../../app/login/page.tsx#L295) |             placeholder={t('forms.passwordPlaceholder')} |
| [app/login/page.tsx:364](../../app/login/page.tsx#L364) |         {errorStatus && ( |
| [app/login/page.tsx:376](../../app/login/page.tsx#L376) |             {errorStatus} |
| [app/login/page.tsx:377](../../app/login/page.tsx#L377) |             {showSignUpLink && ( |
| [app/login/page.tsx:392](../../app/login/page.tsx#L392) |             {!showSignUpLink && ( |
| [app/login/page.tsx:417](../../app/login/page.tsx#L417) |           disabled={isSubmitting} |
| [app/onboarding/client/page.tsx:3](../../app/onboarding/client/page.tsx#L3) | import { useState, useMemo, useEffect, useRef } from 'react'; |
| [app/onboarding/client/page.tsx:20](../../app/onboarding/client/page.tsx#L20) |   const [isSubmitting, setIsSubmitting] = useState(false); |
| [app/onboarding/client/page.tsx:21](../../app/onboarding/client/page.tsx#L21) |   const [submitAttempted, setSubmitAttempted] = useState(false); |
| [app/onboarding/client/page.tsx:22](../../app/onboarding/client/page.tsx#L22) |   const [errorMsg, setErrorMsg] = useState(''); |
| [app/onboarding/client/page.tsx:39](../../app/onboarding/client/page.tsx#L39) |   const [firstName, setFirstName] = useState(appUser?.firstName \|\| ''); |
| [app/onboarding/client/page.tsx:40](../../app/onboarding/client/page.tsx#L40) |   const [lastName, setLastName] = useState(appUser?.lastName \|\| ''); |
| [app/onboarding/client/page.tsx:42](../../app/onboarding/client/page.tsx#L42) |   const [selectedCountry, setSelectedCountry] = useState&lt;any&gt;(null); |
| [app/onboarding/client/page.tsx:43](../../app/onboarding/client/page.tsx#L43) |   const [selectedState, setSelectedState] = useState&lt;any&gt;(null); |
| [app/onboarding/client/page.tsx:44](../../app/onboarding/client/page.tsx#L44) |   const [selectedCityOption, setSelectedCityOption] = useState&lt;any&gt;(null); |
| [app/onboarding/client/page.tsx:45](../../app/onboarding/client/page.tsx#L45) |   const [phoneCode, setPhoneCode] = useState&lt;any&gt;(null); |
| [app/onboarding/client/page.tsx:46](../../app/onboarding/client/page.tsx#L46) |   const [phoneNumberInput, setPhoneNumberInput] = useState(""); |
| [app/onboarding/client/page.tsx:47](../../app/onboarding/client/page.tsx#L47) |   const [selectedLanguages, setSelectedLanguages] = useState&lt;any&gt;([]); |
| [app/onboarding/client/page.tsx:48](../../app/onboarding/client/page.tsx#L48) |   const [csc, setCsc] = useState&lt;any&gt;(null); |
| [app/onboarding/client/page.tsx:49](../../app/onboarding/client/page.tsx#L49) |   const [languageOptions, setLanguageOptions] = useState&lt;{value: string; label: string}[]&gt;([]); |
| [app/onboarding/client/page.tsx:51](../../app/onboarding/client/page.tsx#L51) |   // Pre-fill names once appUser resolves (initial useState fires before context loads) |
| [app/onboarding/client/page.tsx:127](../../app/onboarding/client/page.tsx#L127) |     placeholder: (base: any) =&gt; ({ |
| [app/onboarding/client/page.tsx:176](../../app/onboarding/client/page.tsx#L176) |       console.error(err); |
| [app/onboarding/client/page.tsx:201](../../app/onboarding/client/page.tsx#L201) |               placeholder="First name" |
| [app/onboarding/client/page.tsx:226](../../app/onboarding/client/page.tsx#L226) |               placeholder="Last name" |
| [app/onboarding/client/page.tsx:268](../../app/onboarding/client/page.tsx#L268) |                 placeholder="Code" |
| [app/onboarding/client/page.tsx:277](../../app/onboarding/client/page.tsx#L277) |                 className={`w-full bg-[#141414] border-[1.5px] ${submitAttempted && !phoneNumberInput ? 'border-brand-red' : 'border-[#2a2a2a]'} rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]`}  |
| [app/onboarding/client/page.tsx:278](../../app/onboarding/client/page.tsx#L278) |                 placeholder="600 000 000"  |
| [app/onboarding/client/page.tsx:311](../../app/onboarding/client/page.tsx#L311) |                 placeholder="Country..." |
| [app/onboarding/client/page.tsx:345](../../app/onboarding/client/page.tsx#L345) |                 placeholder="Region..." |
| [app/onboarding/client/page.tsx:372](../../app/onboarding/client/page.tsx#L372) |                 placeholder="City..." |
| [app/onboarding/client/page.tsx:400](../../app/onboarding/client/page.tsx#L400) |               placeholder="Select languages..." |
| [app/onboarding/client/page.tsx:404](../../app/onboarding/client/page.tsx#L404) |         {errorMsg && ( |
| [app/onboarding/client/page.tsx:406](../../app/onboarding/client/page.tsx#L406) |             {errorMsg} |
| [app/onboarding/client/page.tsx:412](../../app/onboarding/client/page.tsx#L412) |           disabled={isSubmitting} |
| [app/onboarding/professional/page.tsx:3](../../app/onboarding/professional/page.tsx#L3) | import { useState, useMemo, useEffect, useRef } from "react"; |
| [app/onboarding/professional/page.tsx:23](../../app/onboarding/professional/page.tsx#L23) |   const [step, setStep] = useState(1); |
| [app/onboarding/professional/page.tsx:25](../../app/onboarding/professional/page.tsx#L25) |   const [isSubmitting, setIsSubmitting] = useState(false); |
| [app/onboarding/professional/page.tsx:26](../../app/onboarding/professional/page.tsx#L26) |   const [errorMsg, setErrorMsg] = useState(''); |
| [app/onboarding/professional/page.tsx:47](../../app/onboarding/professional/page.tsx#L47) |   const [firstName, setFirstName] = useState(appUser?.firstName \|\| ''); |
| [app/onboarding/professional/page.tsx:48](../../app/onboarding/professional/page.tsx#L48) |   const [lastName, setLastName] = useState(appUser?.lastName \|\| ''); |
| [app/onboarding/professional/page.tsx:49](../../app/onboarding/professional/page.tsx#L49) |   const [bio, setBio] = useState(""); |
| [app/onboarding/professional/page.tsx:50](../../app/onboarding/professional/page.tsx#L50) |   const [selectedCountry, setSelectedCountry] = useState&lt;any&gt;(null); |
| [app/onboarding/professional/page.tsx:51](../../app/onboarding/professional/page.tsx#L51) |   const [selectedState, setSelectedState] = useState&lt;any&gt;(null); |
| [app/onboarding/professional/page.tsx:52](../../app/onboarding/professional/page.tsx#L52) |   const [selectedCityOption, setSelectedCityOption] = useState&lt;any&gt;(null); |
| [app/onboarding/professional/page.tsx:53](../../app/onboarding/professional/page.tsx#L53) |   const [phoneCode, setPhoneCode] = useState&lt;any&gt;(null); |
| [app/onboarding/professional/page.tsx:54](../../app/onboarding/professional/page.tsx#L54) |   const [phoneNumberInput, setPhoneNumberInput] = useState(""); |
| [app/onboarding/professional/page.tsx:55](../../app/onboarding/professional/page.tsx#L55) |   const [selectedLanguages, setSelectedLanguages] = useState&lt;any&gt;([]); |
| [app/onboarding/professional/page.tsx:58](../../app/onboarding/professional/page.tsx#L58) |   const [offersServices, setOffersServices] = useState(false); |
| [app/onboarding/professional/page.tsx:59](../../app/onboarding/professional/page.tsx#L59) |   const [partOfBusiness, setPartOfBusiness] = useState(false); |
| [app/onboarding/professional/page.tsx:61](../../app/onboarding/professional/page.tsx#L61) |   const [createBusinessNow, setCreateBusinessNow] = useState&lt;boolean \| null&gt;(null); |
| [app/onboarding/professional/page.tsx:64](../../app/onboarding/professional/page.tsx#L64) |   const [selectedProfession, setSelectedProfession] = useState&lt;string&gt;(''); |
| [app/onboarding/professional/page.tsx:67](../../app/onboarding/professional/page.tsx#L67) |   const [vibe, setVibe] = useState&lt;string[]&gt;([]); |
| [app/onboarding/professional/page.tsx:68](../../app/onboarding/professional/page.tsx#L68) |   const [days, setDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]); |
| [app/onboarding/professional/page.tsx:69](../../app/onboarding/professional/page.tsx#L69) |   const [specialty, setSpecialty] = useState&lt;string[]&gt;([]); |
| [app/onboarding/professional/page.tsx:70](../../app/onboarding/professional/page.tsx#L70) |   const [clientele, setClientele] = useState&lt;string[]&gt;([]); |
| [app/onboarding/professional/page.tsx:72](../../app/onboarding/professional/page.tsx#L72) |   const [servicesData, setServicesData] = useState([ |
| [app/onboarding/professional/page.tsx:76](../../app/onboarding/professional/page.tsx#L76) |   const [titzData, setTitzData] = useState({ duration: "45", price: "20" }); |
| [app/onboarding/professional/page.tsx:77](../../app/onboarding/professional/page.tsx#L77) |   const [csc, setCsc] = useState&lt;any&gt;(null); |
| [app/onboarding/professional/page.tsx:78](../../app/onboarding/professional/page.tsx#L78) |   const [languageOptions, setLanguageOptions] = useState&lt;{value: string; label: string}[]&gt;([]); |
| [app/onboarding/professional/page.tsx:95](../../app/onboarding/professional/page.tsx#L95) |         console.error('Draft autosave failed:', err); |
| [app/onboarding/professional/page.tsx:129](../../app/onboarding/professional/page.tsx#L129) |   // Pre-fill names once appUser resolves (initial useState fires before context loads) |
| [app/onboarding/professional/page.tsx:165](../../app/onboarding/professional/page.tsx#L165) |         console.error('Draft load failed:', err); |
| [app/onboarding/professional/page.tsx:247](../../app/onboarding/professional/page.tsx#L247) |     placeholder: (base: any) =&gt; ({ |
| [app/onboarding/professional/page.tsx:290](../../app/onboarding/professional/page.tsx#L290) |           if (qs.empty) { |
| [app/onboarding/professional/page.tsx:346](../../app/onboarding/professional/page.tsx#L346) |         console.error('Barber onboarding failed'); |
| [app/onboarding/professional/page.tsx:376](../../app/onboarding/professional/page.tsx#L376) |       if (existingServicesSnap.empty) { |
| [app/onboarding/professional/page.tsx:416](../../app/onboarding/professional/page.tsx#L416) |         console.error('Draft cleanup failed (non-blocking):', err); |
| [app/onboarding/professional/page.tsx:431](../../app/onboarding/professional/page.tsx#L431) |       console.error(err); |
| [app/onboarding/professional/page.tsx:466](../../app/onboarding/professional/page.tsx#L466) |                 placeholder="First name" |
| [app/onboarding/professional/page.tsx:488](../../app/onboarding/professional/page.tsx#L488) |                 placeholder="Last name" |
| [app/onboarding/professional/page.tsx:514](../../app/onboarding/professional/page.tsx#L514) |                   placeholder="Code" |
| [app/onboarding/professional/page.tsx:524](../../app/onboarding/professional/page.tsx#L524) |                   className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[52px]" |
| [app/onboarding/professional/page.tsx:525](../../app/onboarding/professional/page.tsx#L525) |                   placeholder="600 000 000"  |
| [app/onboarding/professional/page.tsx:542](../../app/onboarding/professional/page.tsx#L542) |                 placeholder="Country..." |
| [app/onboarding/professional/page.tsx:560](../../app/onboarding/professional/page.tsx#L560) |                 placeholder="Region..." |
| [app/onboarding/professional/page.tsx:575](../../app/onboarding/professional/page.tsx#L575) |                 placeholder="City..." |
| [app/onboarding/professional/page.tsx:581](../../app/onboarding/professional/page.tsx#L581) |             &lt;textarea value={bio} onChange={e =&gt; setBio(e.target.value)} maxLength={2000} className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] resize-y" rows={3} placeholder="Tell clients who you are, your style, your experience..." /&gt; |
| [app/onboarding/professional/page.tsx:591](../../app/onboarding/professional/page.tsx#L591) |               placeholder="Select languages..." |
| [app/onboarding/professional/page.tsx:842](../../app/onboarding/professional/page.tsx#L842) |           {errorMsg && ( |
| [app/onboarding/professional/page.tsx:844](../../app/onboarding/professional/page.tsx#L844) |               {errorMsg} |
| [app/onboarding/professional/page.tsx:856](../../app/onboarding/professional/page.tsx#L856) |               disabled={isSubmitting} |
| [app/onboarding/professional/page.tsx:873](../../app/onboarding/professional/page.tsx#L873) |             disabled={(step === 2 && !offersServices && !partOfBusiness) \|\| (step === 3 && !selectedProfession) \|\| (step === 6 && createBusinessNow === null)} |
| [app/page.tsx:99](../../app/page.tsx#L99) |     console.error('[fetchFeaturedBarbers]', err); |
| [app/privacy/page.tsx:80](../../app/privacy/page.tsx#L80) |                 &lt;li&gt;Sentry — error monitoring&lt;/li&gt; |
| [app/review/[bookingId]/page.tsx:3](../../app/review/[bookingId]/page.tsx#L3) | import { useState, useEffect, use } from 'react'; |
| [app/review/[bookingId]/page.tsx:20](../../app/review/[bookingId]/page.tsx#L20) |   const [booking, setBooking] = useState&lt;any&gt;(null); |
| [app/review/[bookingId]/page.tsx:21](../../app/review/[bookingId]/page.tsx#L21) |   const [rating, setRating] = useState(0); |
| [app/review/[bookingId]/page.tsx:22](../../app/review/[bookingId]/page.tsx#L22) |   const [comment, setComment] = useState(""); |
| [app/review/[bookingId]/page.tsx:23](../../app/review/[bookingId]/page.tsx#L23) |   const [loading, setLoading] = useState(true); |
| [app/review/[bookingId]/page.tsx:24](../../app/review/[bookingId]/page.tsx#L24) |   const [isSubmitting, setIsSubmitting] = useState(false); |
| [app/review/[bookingId]/page.tsx:38](../../app/review/[bookingId]/page.tsx#L38) |               toast.error(t('errors.canOnlyReviewOwn')); |
| [app/review/[bookingId]/page.tsx:46](../../app/review/[bookingId]/page.tsx#L46) |            if (!rSnap.empty) { |
| [app/review/[bookingId]/page.tsx:47](../../app/review/[bookingId]/page.tsx#L47) |               toast.error(t('errors.alreadyReviewed')); |
| [app/review/[bookingId]/page.tsx:58](../../app/review/[bookingId]/page.tsx#L58) |         console.error(e); |
| [app/review/[bookingId]/page.tsx:73](../../app/review/[bookingId]/page.tsx#L73) |          toast.error(t('errors.alreadyReviewed')); |
| [app/review/[bookingId]/page.tsx:93](../../app/review/[bookingId]/page.tsx#L93) |       toast.error(t('errors.failedSubmitReview') + ' ' + e.message); |
| [app/review/[bookingId]/page.tsx:107](../../app/review/[bookingId]/page.tsx#L107) |       updateDoc(doc(db, 'users', booking.barberId), { unreadCount: increment(1) }).catch(console.error); |
| [app/review/[bookingId]/page.tsx:109](../../app/review/[bookingId]/page.tsx#L109) |       console.error('Review notification failed:', notifErr); |
| [app/review/[bookingId]/page.tsx:117](../../app/review/[bookingId]/page.tsx#L117) |   if (loading) return &lt;div className="p-20 text-center text-brand-text-secondary animate-pulse"&gt;{t('misc.loading')}&lt;/div&gt;; |
| [app/review/[bookingId]/page.tsx:147](../../app/review/[bookingId]/page.tsx#L147) |            placeholder={t('review.commentPlaceholder')} |
| [app/review/[bookingId]/page.tsx:154](../../app/review/[bookingId]/page.tsx#L154) |          disabled={rating === 0 \|\| isSubmitting} |
| [app/shop/[shopId]/page.tsx:3](../../app/shop/[shopId]/page.tsx#L3) | import { useState, useEffect } from 'react'; |
| [app/shop/[shopId]/page.tsx:128](../../app/shop/[shopId]/page.tsx#L128) |   const [lightboxPhoto, setLightboxPhoto] = useState&lt;string \| null&gt;(null); |
| [app/shop/[shopId]/page.tsx:129](../../app/shop/[shopId]/page.tsx#L129) |   const [copied, setCopied] = useState(false); |
| [app/shop/[shopId]/page.tsx:130](../../app/shop/[shopId]/page.tsx#L130) |   const [expandDesc, setExpandDesc] = useState(false); |
| [app/shop/[shopId]/page.tsx:133](../../app/shop/[shopId]/page.tsx#L133) |   const [shop, setShop] = useState&lt;ShopData \| null \| undefined&gt;(undefined); |
| [app/shop/[shopId]/page.tsx:135](../../app/shop/[shopId]/page.tsx#L135) |   const [barberDocs, setBarberDocs] = useState&lt;any[]&gt;([]); |
| [app/shop/[shopId]/page.tsx:137](../../app/shop/[shopId]/page.tsx#L137) |   const [schedule, setSchedule] = useState&lt;{ availableSlots?: Record&lt;string, string[]&gt; } \| null&gt;(null); |
| [app/shop/[shopId]/page.tsx:300](../../app/shop/[shopId]/page.tsx#L300) |       toast.error(t('profile.adminCannotBook')); |
| [app/shop/[shopId]/page.tsx:367](../../app/shop/[shopId]/page.tsx#L367) |           &lt;p className="text-[#888] text-sm mb-6"&gt;{t('emptyStates.checkBackSoon')}&lt;/p&gt; |
| [app/shop/[shopId]/page.tsx:383](../../app/shop/[shopId]/page.tsx#L383) |       {lightboxPhoto && ( |
| [app/shop/[shopId]/page.tsx:390](../../app/shop/[shopId]/page.tsx#L390) |             &lt;Image src={lightboxPhoto} alt="Shop photo" fill className="object-contain" referrerPolicy="no-referrer" /&gt; |
| [app/shop/[shopId]/page.tsx:470](../../app/shop/[shopId]/page.tsx#L470) |                       {expandDesc ? t('profile.showLess') : t('profile.readMore')} |
| [app/shop/[shopId]/page.tsx:511](../../app/shop/[shopId]/page.tsx#L511) |                   &lt;div className="text-[#444] text-xs mt-1"&gt;{t('emptyStates.checkBackSoon')}&lt;/div&gt; |
| [app/shops/page.tsx:3](../../app/shops/page.tsx#L3) | import { useState, useMemo, useEffect } from 'react'; |
| [app/shops/page.tsx:133](../../app/shops/page.tsx#L133) |       &lt;button onClick={() =&gt; onChange(page - 1)} disabled={page === 1} |
| [app/shops/page.tsx:151](../../app/shops/page.tsx#L151) |       &lt;button onClick={() =&gt; onChange(page + 1)} disabled={page === totalPages} |
| [app/shops/page.tsx:166](../../app/shops/page.tsx#L166) |   const showFakes = useShowFakeUIData(); |
| [app/shops/page.tsx:167](../../app/shops/page.tsx#L167) |   const [countryCode, setCountryCode] = useState(''); |
| [app/shops/page.tsx:168](../../app/shops/page.tsx#L168) |   const [countryName, setCountryName] = useState(''); |
| [app/shops/page.tsx:169](../../app/shops/page.tsx#L169) |   const [selectedState, setSelectedState] = useState(''); |
| [app/shops/page.tsx:170](../../app/shops/page.tsx#L170) |   const [selectedCity, setSelectedCity] = useState(''); |
| [app/shops/page.tsx:171](../../app/shops/page.tsx#L171) |   const [activeFilter, setActiveFilter] = useState&lt;{ city: string; state: string; country: string } \| null&gt;(null); |
| [app/shops/page.tsx:172](../../app/shops/page.tsx#L172) |   const [nameSearch, setNameSearch] = useState(''); |
| [app/shops/page.tsx:174](../../app/shops/page.tsx#L174) |   const [page, setPage] = useState(1); |
| [app/shops/page.tsx:175](../../app/shops/page.tsx#L175) |   const [geoApplied, setGeoApplied] = useState(false); |
| [app/shops/page.tsx:176](../../app/shops/page.tsx#L176) |   const [geoCity, setGeoCity] = useState(''); |
| [app/shops/page.tsx:177](../../app/shops/page.tsx#L177) |   const [csc, setCsc] = useState&lt;any&gt;(null); |
| [app/shops/page.tsx:246](../../app/shops/page.tsx#L246) |     const visibleFakeCount = showFakes |
| [app/shops/page.tsx:253](../../app/shops/page.tsx#L253) |   }, [allShops, showFakes]); |
| [app/shops/page.tsx:349](../../app/shops/page.tsx#L349) |               disabled={!countryCode} |
| [app/shops/page.tsx:357](../../app/shops/page.tsx#L357) |               disabled={!countryCode} |
| [app/shops/page.tsx:364](../../app/shops/page.tsx#L364) |             &lt;button onClick={handleSearch} disabled={false} |
| [app/shops/page.tsx:371](../../app/shops/page.tsx#L371) |             placeholder={t('forms.searchByShopName')} |
| [app/shops/page.tsx:372](../../app/shops/page.tsx#L372) |             className="w-full sm:max-w-sm bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-[#444]" |
| [app/shops/page.tsx:413](../../app/shops/page.tsx#L413) |                   ? t('emptyStates.noShopsCity').replace('{city}', activeFilter.city) |
| [app/shops/page.tsx:414](../../app/shops/page.tsx#L414) |                   : t('emptyStates.noShopsCountry').replace('{country}', activeFilter.country) |
| [app/shops/page.tsx:415](../../app/shops/page.tsx#L415) |                 : t('emptyStates.noShopsFound')} |
| [app/shops/page.tsx:418](../../app/shops/page.tsx#L418) |               {activeFilter ? t('emptyStates.ownAShop') : t('emptyStates.checkBackSoon')} |
| [app/shops/page.tsx:438](../../app/shops/page.tsx#L438) |                 const showOverlay = applyBlur && paged.indexOf(s) === firstBlurredIndex; |
| [app/shops/page.tsx:510](../../app/shops/page.tsx#L510) |                     {showOverlay && ( |
| [app/signup/page.tsx:3](../../app/signup/page.tsx#L3) | import { useState, useEffect } from 'react'; |
| [app/signup/page.tsx:32](../../app/signup/page.tsx#L32) |   const { user, loading } = useAuth(); |
| [app/signup/page.tsx:33](../../app/signup/page.tsx#L33) |   const [role, setRole] = useState&lt;'client' \| 'professional'&gt;('client'); |
| [app/signup/page.tsx:34](../../app/signup/page.tsx#L34) |   const [firstName, setFirstName] = useState(''); |
| [app/signup/page.tsx:35](../../app/signup/page.tsx#L35) |   const [lastName, setLastName] = useState(''); |
| [app/signup/page.tsx:36](../../app/signup/page.tsx#L36) |   const [email, setEmail] = useState(''); |
| [app/signup/page.tsx:37](../../app/signup/page.tsx#L37) |   const [password, setPassword] = useState(''); |
| [app/signup/page.tsx:38](../../app/signup/page.tsx#L38) |   const [confirmPassword, setConfirmPassword] = useState(''); |
| [app/signup/page.tsx:39](../../app/signup/page.tsx#L39) |   const [passwordMatch, setPasswordMatch] = useState&lt;boolean \| null&gt;(null); |
| [app/signup/page.tsx:40](../../app/signup/page.tsx#L40) |   const [errorStatus, setErrorStatus] = useState(''); |
| [app/signup/page.tsx:41](../../app/signup/page.tsx#L41) |   const [showLoginLink, setShowLoginLink] = useState(false); |
| [app/signup/page.tsx:42](../../app/signup/page.tsx#L42) |   const [isSubmitting, setIsSubmitting] = useState(false); |
| [app/signup/page.tsx:43](../../app/signup/page.tsx#L43) |   const [submitAttempted, setSubmitAttempted] = useState(false); |
| [app/signup/page.tsx:44](../../app/signup/page.tsx#L44) |   const [honeypot, setHoneypot] = useState(''); |
| [app/signup/page.tsx:45](../../app/signup/page.tsx#L45) |   const [emailVerified, setEmailVerified] = useState(false); |
| [app/signup/page.tsx:46](../../app/signup/page.tsx#L46) |   const [emailError, setEmailError] = useState(''); |
| [app/signup/page.tsx:47](../../app/signup/page.tsx#L47) |   const [firstNameValid, setFirstNameValid] = useState&lt;boolean \| null&gt;(null); |
| [app/signup/page.tsx:48](../../app/signup/page.tsx#L48) |   const [emailValid, setEmailValid] = useState&lt;boolean \| null&gt;(null); |
| [app/signup/page.tsx:49](../../app/signup/page.tsx#L49) |   const [termsAccepted, setTermsAccepted] = useState(false); |
| [app/signup/page.tsx:50](../../app/signup/page.tsx#L50) |   const [googleSubmitting, setGoogleSubmitting] = useState(false); |
| [app/signup/page.tsx:60](../../app/signup/page.tsx#L60) |   if (loading) return null; |
| [app/signup/page.tsx:84](../../app/signup/page.tsx#L84) |     if (!emailRegex.test(value)) return t('errors.invalidEmail'); |
| [app/signup/page.tsx:124](../../app/signup/page.tsx#L124) |         setErrorStatus(t('errors.accountAlreadyExists')); |
| [app/signup/page.tsx:147](../../app/signup/page.tsx#L147) |     } catch (error: any) { |
| [app/signup/page.tsx:148](../../app/signup/page.tsx#L148) |       if (error.code === 'auth/account-exists-with-different-credential') { |
| [app/signup/page.tsx:149](../../app/signup/page.tsx#L149) |         setErrorStatus(t('errors.accountExistsWithEmail')); |
| [app/signup/page.tsx:153](../../app/signup/page.tsx#L153) |       if (error.code === 'auth/network-request-failed') { |
| [app/signup/page.tsx:154](../../app/signup/page.tsx#L154) |         setErrorStatus(t('errors.connectionError')); |
| [app/signup/page.tsx:157](../../app/signup/page.tsx#L157) |       if (error.code !== 'auth/popup-closed-by-user') { |
| [app/signup/page.tsx:158](../../app/signup/page.tsx#L158) |         setErrorStatus(t('errors.googleSignInFailed')); |
| [app/signup/page.tsx:178](../../app/signup/page.tsx#L178) |       setErrorStatus(t('errors.pleaseConfirmPassword')); |
| [app/signup/page.tsx:182](../../app/signup/page.tsx#L182) |       setErrorStatus(t('errors.passwordsNoMatch')); |
| [app/signup/page.tsx:218](../../app/signup/page.tsx#L218) |       console.error("Signup validation or save error:", err); |
| [app/signup/page.tsx:240](../../app/signup/page.tsx#L240) |             return t('errors.emailInUseTryLogin'); |
| [app/signup/page.tsx:242](../../app/signup/page.tsx#L242) |             return t('errors.passwordTooWeak'); |
| [app/signup/page.tsx:244](../../app/signup/page.tsx#L244) |             return t('errors.invalidCredentials'); |
| [app/signup/page.tsx:246](../../app/signup/page.tsx#L246) |             return t('errors.signUpDisabled'); |
| [app/signup/page.tsx:248](../../app/signup/page.tsx#L248) |             return t('errors.tooManyAttempts'); |
| [app/signup/page.tsx:250](../../app/signup/page.tsx#L250) |             return t('errors.connectionError'); |
| [app/signup/page.tsx:252](../../app/signup/page.tsx#L252) |             return t('errors.somethingWentWrong'); |
| [app/signup/page.tsx:307](../../app/signup/page.tsx#L307) |         disabled={googleSubmitting} |
| [app/signup/page.tsx:379](../../app/signup/page.tsx#L379) |               placeholder={t('forms.firstNamePlaceholder')} |
| [app/signup/page.tsx:381](../../app/signup/page.tsx#L381) |             {submitAttempted && !firstName && &lt;span className="text-brand-red text-xs mt-1 block"&gt;{t('errors.fieldRequired')}&lt;/span&gt;} |
| [app/signup/page.tsx:389](../../app/signup/page.tsx#L389) |               placeholder={t('forms.lastNamePlaceholder')} |
| [app/signup/page.tsx:391](../../app/signup/page.tsx#L391) |             {submitAttempted && !lastName && &lt;span className="text-brand-red text-xs mt-1 block"&gt;{t('errors.fieldRequired')}&lt;/span&gt;} |
| [app/signup/page.tsx:420](../../app/signup/page.tsx#L420) |               placeholder={t('forms.emailPlaceholder')} |
| [app/signup/page.tsx:442](../../app/signup/page.tsx#L442) |           {submitAttempted && !email && &lt;span className="text-brand-red text-xs mt-1 block"&gt;{t('errors.fieldRequired')}&lt;/span&gt;} |
| [app/signup/page.tsx:451](../../app/signup/page.tsx#L451) |             placeholder={t('forms.passwordPlaceholder')} |
| [app/signup/page.tsx:491](../../app/signup/page.tsx#L491) |           {submitAttempted && !password && &lt;span className="text-brand-red text-xs mt-1 block"&gt;{t('errors.fieldRequired')}&lt;/span&gt;} |
| [app/signup/page.tsx:494](../../app/signup/page.tsx#L494) |               {t('errors.passwordTooShort')} ({password.length}/8) |
| [app/signup/page.tsx:499](../../app/signup/page.tsx#L499) |               {t('errors.passwordTooCommon')} |
| [app/signup/page.tsx:527](../../app/signup/page.tsx#L527) |               placeholder={t('forms.confirmPasswordPlaceholder')} |
| [app/signup/page.tsx:558](../../app/signup/page.tsx#L558) |               {t('errors.passwordsNoMatch')} |
| [app/signup/page.tsx:563](../../app/signup/page.tsx#L563) |         {errorStatus && ( |
| [app/signup/page.tsx:565](../../app/signup/page.tsx#L565) |             {errorStatus} |
| [app/signup/page.tsx:566](../../app/signup/page.tsx#L566) |             {showLoginLink && ( |
| [app/signup/page.tsx:580](../../app/signup/page.tsx#L580) |             {!showLoginLink && ( |
| [app/signup/page.tsx:655](../../app/signup/page.tsx#L655) |           disabled={isSubmitting \|\| !!emailError \|\| email.length === 0 \|\| password.length &lt; 8 \|\| firstName.length === 0 \|\| lastName.length === 0 \|\| isCommonPassword(password) \|\| getPasswordStrength(password).score &lt; 2 \|\| !termsAccepted} |
| [components/AdminGuard.tsx:3](../../components/AdminGuard.tsx#L3) | import React, { useState, useEffect, createContext, useContext } from 'react'; |
| [components/AdminGuard.tsx:37](../../components/AdminGuard.tsx#L37) |   const { user, loading } = useAuth(); |
| [components/AdminGuard.tsx:39](../../components/AdminGuard.tsx#L39) |   const [adminData, setAdminData] = useState&lt;AdminData \| null&gt;(null); |
| [components/AdminGuard.tsx:40](../../components/AdminGuard.tsx#L40) |   const [checking, setChecking] = useState(true); |
| [components/AdminGuard.tsx:43](../../components/AdminGuard.tsx#L43) |     if (loading) return; |
| [components/AdminGuard.tsx:95](../../components/AdminGuard.tsx#L95) |         console.error('Admin check failed:', err); |
| [components/AdminGuard.tsx:103](../../components/AdminGuard.tsx#L103) |   }, [user, loading, router]); |
| [components/AdminGuard.tsx:105](../../components/AdminGuard.tsx#L105) |   if (loading \|\| checking) { |
| [components/AvailabilityGrid.tsx:3](../../components/AvailabilityGrid.tsx#L3) | import React, { useState, useEffect, useRef, useCallback } from 'react'; |
| [components/AvailabilityGrid.tsx:34](../../components/AvailabilityGrid.tsx#L34) |   const [currentWeekStart, setCurrentWeekStart] = useState&lt;Date&gt;(startOfWeek(new Date(), { weekStartsOn: 1 })); |
| [components/AvailabilityGrid.tsx:35](../../components/AvailabilityGrid.tsx#L35) |   const [availableSlots, setAvailableSlots] = useState&lt;Record&lt;string, string[]&gt;&gt;({}); |
| [components/AvailabilityGrid.tsx:36](../../components/AvailabilityGrid.tsx#L36) |   const [bookings, setBookings] = useState&lt;any[]&gt;([]); |
| [components/AvailabilityGrid.tsx:37](../../components/AvailabilityGrid.tsx#L37) |   const [isDragging, setIsDragging] = useState(false); |
| [components/AvailabilityGrid.tsx:38](../../components/AvailabilityGrid.tsx#L38) |   const [dragAction, setDragAction] = useState&lt;'add' \| 'remove' \| null&gt;(null); |
| [components/AvailabilityGrid.tsx:39](../../components/AvailabilityGrid.tsx#L39) |   const [loading, setLoading] = useState(true); |
| [components/AvailabilityGrid.tsx:40](../../components/AvailabilityGrid.tsx#L40) |   const [saving, setSaving] = useState(false); |
| [components/AvailabilityGrid.tsx:41](../../components/AvailabilityGrid.tsx#L41) |   const [lastSaved, setLastSaved] = useState&lt;Date \| null&gt;(null); |
| [components/AvailabilityGrid.tsx:42](../../components/AvailabilityGrid.tsx#L42) |   const [bufferMinutes, setBufferMinutes] = useState(10); |
| [components/AvailabilityGrid.tsx:43](../../components/AvailabilityGrid.tsx#L43) |   const [blockedDates, setBlockedDates] = useState&lt;string[]&gt;([]); |
| [components/AvailabilityGrid.tsx:44](../../components/AvailabilityGrid.tsx#L44) |   const [recurringBlocked, setRecurringBlocked] = useState&lt;string[]&gt;([]); |
| [components/AvailabilityGrid.tsx:45](../../components/AvailabilityGrid.tsx#L45) |   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); |
| [components/AvailabilityGrid.tsx:46](../../components/AvailabilityGrid.tsx#L46) |   const [autoSavedMsg, setAutoSavedMsg] = useState(''); |
| [components/AvailabilityGrid.tsx:78](../../components/AvailabilityGrid.tsx#L78) |       console.error(err); |
| [components/AvailabilityGrid.tsx:188](../../components/AvailabilityGrid.tsx#L188) |       { successMessage: t('success.scheduleSaved'), errorMessage: t('errors.failedSaveSchedule') } |
| [components/AvailabilityGrid.tsx:202](../../components/AvailabilityGrid.tsx#L202) |   // from the first render when availableSlots was still empty. |
| [components/AvailabilityGrid.tsx:230](../../components/AvailabilityGrid.tsx#L230) |     if (!confirm(t('errors.clearWeekConfirm'))) return; |
| [components/AvailabilityGrid.tsx:327](../../components/AvailabilityGrid.tsx#L327) |       toast.error("Not enough consecutive time for this service starting here. Try another slot."); |
| [components/AvailabilityGrid.tsx:336](../../components/AvailabilityGrid.tsx#L336) |   if (loading) { |
| [components/AvailabilityGrid.tsx:337](../../components/AvailabilityGrid.tsx#L337) |     return &lt;div className="text-brand-text-secondary animate-pulse text-sm"&gt;{t('misc.loadingCalendar')}&lt;/div&gt;; |
| [components/AvailabilityGrid.tsx:486](../../components/AvailabilityGrid.tsx#L486) |                                onMouseDown={() =&gt; toast.error(t('errors.dayAlreadyBlocked'))} |
| [components/AvailabilityGrid.tsx:577](../../components/AvailabilityGrid.tsx#L577) |               disabled={saving} |
| [components/BarberInvitesTab.tsx:3](../../components/BarberInvitesTab.tsx#L3) | import { useState, useEffect } from 'react'; |
| [components/BarberInvitesTab.tsx:14](../../components/BarberInvitesTab.tsx#L14) |   const [invites, setInvites] = useState&lt;any[]&gt;([]); |
| [components/BarberInvitesTab.tsx:15](../../components/BarberInvitesTab.tsx#L15) |   const [actionLoading, setActionLoading] = useState&lt;string \| null&gt;(null); |
| [components/BarberInvitesTab.tsx:16](../../components/BarberInvitesTab.tsx#L16) |   const [showWarningModal, setShowWarningModal] = useState&lt;any&gt;(null); |
| [components/BarberInvitesTab.tsx:17](../../components/BarberInvitesTab.tsx#L17) |   const [showSoloModal, setShowSoloModal] = useState&lt;any&gt;(null); |
| [components/BarberInvitesTab.tsx:18](../../components/BarberInvitesTab.tsx#L18) |   const [barberCode, setBarberCode] = useState(''); |
| [components/BarberInvitesTab.tsx:19](../../components/BarberInvitesTab.tsx#L19) |   const [codeCopied, setCodeCopied] = useState(false); |
| [components/BarberInvitesTab.tsx:57](../../components/BarberInvitesTab.tsx#L57) |       setShowWarningModal(null); |
| [components/BarberInvitesTab.tsx:58](../../components/BarberInvitesTab.tsx#L58) |       setShowSoloModal(invite); |
| [components/BarberInvitesTab.tsx:60](../../components/BarberInvitesTab.tsx#L60) |       console.error('Failed to accept', e); |
| [components/BarberInvitesTab.tsx:66](../../components/BarberInvitesTab.tsx#L66) |     if (!user \|\| !showSoloModal) return; |
| [components/BarberInvitesTab.tsx:67](../../components/BarberInvitesTab.tsx#L67) |     setActionLoading(showSoloModal.id); |
| [components/BarberInvitesTab.tsx:74](../../components/BarberInvitesTab.tsx#L74) |       setShowSoloModal(null); |
| [components/BarberInvitesTab.tsx:76](../../components/BarberInvitesTab.tsx#L76) |       console.error(e); |
| [components/BarberInvitesTab.tsx:84](../../components/BarberInvitesTab.tsx#L84) |     if (!bSnap.empty) { |
| [components/BarberInvitesTab.tsx:87](../../components/BarberInvitesTab.tsx#L87) |         setShowWarningModal(invite); |
| [components/BarberInvitesTab.tsx:106](../../components/BarberInvitesTab.tsx#L106) |       console.error('Failed to decline', e); |
| [components/BarberInvitesTab.tsx:183](../../components/BarberInvitesTab.tsx#L183) |                     disabled={actionLoading === inv.id} |
| [components/BarberInvitesTab.tsx:190](../../components/BarberInvitesTab.tsx#L190) |                     disabled={actionLoading === inv.id} |
| [components/BarberInvitesTab.tsx:227](../../components/BarberInvitesTab.tsx#L227) |           {t('emptyStates.noInvitesYet')} |
| [components/BarberInvitesTab.tsx:231](../../components/BarberInvitesTab.tsx#L231) |       {/* Modals — unchanged */} |
| [components/BarberInvitesTab.tsx:232](../../components/BarberInvitesTab.tsx#L232) |       {showWarningModal && ( |
| [components/BarberInvitesTab.tsx:235](../../components/BarberInvitesTab.tsx#L235) |             &lt;h2 className="text-xl font-black text-white mb-2"&gt;{t('modals.changeShopTitle')}&lt;/h2&gt; |
| [components/BarberInvitesTab.tsx:237](../../components/BarberInvitesTab.tsx#L237) |               {t('modals.changeShopDesc')} |
| [components/BarberInvitesTab.tsx:240](../../components/BarberInvitesTab.tsx#L240) |               &lt;button disabled={actionLoading === showWarningModal.id} onClick={() =&gt; setShowWarningModal(null)} className="flex-1 bg-[#2a2a2a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#333] disabled:opacity-50"&gt;{t('buttons.cancel')}&lt;/button&gt; |
| [components/BarberInvitesTab.tsx:241](../../components/BarberInvitesTab.tsx#L241) |               &lt;button disabled={actionLoading === showWarningModal.id} onClick={() =&gt; processAccept(showWarningModal)} className="flex-[1.5] bg-brand-green text-black py-3 rounded-xl font-bold text-sm hover:bg-green-500 disabled:opacity-50"&gt; |
| [components/BarberInvitesTab.tsx:242](../../components/BarberInvitesTab.tsx#L242) |                 {actionLoading === showWarningModal.id ? t('settings.accepting') : t('buttons.linkNewShop')} |
| [components/BarberInvitesTab.tsx:249](../../components/BarberInvitesTab.tsx#L249) |       {showSoloModal && ( |
| [components/BarberInvitesTab.tsx:252](../../components/BarberInvitesTab.tsx#L252) |             &lt;h2 className="text-xl font-black text-white mb-2"&gt;{t('modals.soloBookingsTitle')}&lt;/h2&gt; |
| [components/BarberInvitesTab.tsx:254](../../components/BarberInvitesTab.tsx#L254) |               {t('settings.joinedShopSoloQuestion').replace('{shopName}', showSoloModal.shopName)} |
| [components/BarberInvitesTab.tsx:257](../../components/BarberInvitesTab.tsx#L257) |               &lt;button disabled={actionLoading === showSoloModal.id} onClick={() =&gt; handleKeepSolo(true)} className="w-full bg-brand-yellow text-black py-3 rounded-xl font-bold text-sm hover:bg-yellow-500 disabled:opacity-50"&gt;{t('buttons.keepSoloBookings')}&lt;/button&gt; |
| [components/BarberInvitesTab.tsx:258](../../components/BarberInvitesTab.tsx#L258) |               &lt;button disabled={actionLoading === showSoloModal.id} onClick={() =&gt; handleKeepSolo(false)} className="w-full bg-[#2a2a2a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#333] disabled:opacity-50"&gt;{t('buttons.shopBookingsOnly')}&lt;/button&gt; |
| [components/BarberPortfolioTab.tsx:3](../../components/BarberPortfolioTab.tsx#L3) | import { useState } from 'react'; |
| [components/BarberPortfolioTab.tsx:21](../../components/BarberPortfolioTab.tsx#L21) |   const [notifyPhotoDone, setNotifyPhotoDone] = useState(false); |
| [components/BarberPortfolioTab.tsx:22](../../components/BarberPortfolioTab.tsx#L22) |   const [notifyVideoDone, setNotifyVideoDone] = useState(false); |
| [components/BarberPortfolioTab.tsx:32](../../components/BarberPortfolioTab.tsx#L32) |       await deleteObject(fileRef).catch(console.error); |
| [components/BarberPortfolioTab.tsx:36](../../components/BarberPortfolioTab.tsx#L36) |       console.error(e); |
| [components/BarberPortfolioTab.tsx:45](../../components/BarberPortfolioTab.tsx#L45) |       await deleteObject(fileRef).catch(console.error); |
| [components/BarberPortfolioTab.tsx:49](../../components/BarberPortfolioTab.tsx#L49) |       console.error(e); |
| [components/BarberPortfolioTab.tsx:66](../../components/BarberPortfolioTab.tsx#L66) |       console.error(e); |
| [components/BarberPortfolioTab.tsx:90](../../components/BarberPortfolioTab.tsx#L90) |             &lt;div className="text-[#888] mb-3"&gt;{t('emptyStates.noPhotosYet')}&lt;/div&gt; |
| [components/BarberPortfolioTab.tsx:92](../../components/BarberPortfolioTab.tsx#L92) |               {t('emptyStates.portfolioComingSoon')} |
| [components/BarberPortfolioTab.tsx:96](../../components/BarberPortfolioTab.tsx#L96) |               disabled={notifyPhotoDone} |
| [components/BarberPortfolioTab.tsx:134](../../components/BarberPortfolioTab.tsx#L134) |             &lt;div className="text-[#888] mb-3"&gt;{t('emptyStates.noVideosYet')}&lt;/div&gt; |
| [components/BarberPortfolioTab.tsx:136](../../components/BarberPortfolioTab.tsx#L136) |               {t('emptyStates.portfolioComingSoon')} |
| [components/BarberPortfolioTab.tsx:140](../../components/BarberPortfolioTab.tsx#L140) |               disabled={notifyVideoDone} |
| [components/BarberSettingsTab.tsx:3](../../components/BarberSettingsTab.tsx#L3) | import { useState, useMemo, useEffect } from 'react'; |
| [components/BarberSettingsTab.tsx:15](../../components/BarberSettingsTab.tsx#L15) |     loading: () =&gt; ( |
| [components/BarberSettingsTab.tsx:39](../../components/BarberSettingsTab.tsx#L39) |   const [photoLoading, setPhotoLoading] = useState(false); |
| [components/BarberSettingsTab.tsx:40](../../components/BarberSettingsTab.tsx#L40) |   const [localPhotoUrl, setLocalPhotoUrl] = useState(''); |
| [components/BarberSettingsTab.tsx:41](../../components/BarberSettingsTab.tsx#L41) |   const [savingGlobal, setSavingGlobal] = useState(false); |
| [components/BarberSettingsTab.tsx:42](../../components/BarberSettingsTab.tsx#L42) |   const [savingSocial, setSavingSocial] = useState(false); |
| [components/BarberSettingsTab.tsx:43](../../components/BarberSettingsTab.tsx#L43) |   const [errorMsg, setErrorMsg] = useState(''); |
| [components/BarberSettingsTab.tsx:44](../../components/BarberSettingsTab.tsx#L44) |   const [successMsg, setSuccessMsg] = useState(''); |
| [components/BarberSettingsTab.tsx:46](../../components/BarberSettingsTab.tsx#L46) |   const [formData, setFormData] = useState({ |
| [components/BarberSettingsTab.tsx:56](../../components/BarberSettingsTab.tsx#L56) |   const [phoneNumberInput, setPhoneNumberInput] = useState(initPhoneNumStr); |
| [components/BarberSettingsTab.tsx:57](../../components/BarberSettingsTab.tsx#L57) |   const [phoneCode, setPhoneCode] = useState&lt;any&gt;(null); |
| [components/BarberSettingsTab.tsx:58](../../components/BarberSettingsTab.tsx#L58) |   const [csc, setCsc] = useState&lt;any&gt;(null); |
| [components/BarberSettingsTab.tsx:59](../../components/BarberSettingsTab.tsx#L59) |   const [languageOptions, setLanguageOptions] = useState&lt;{value: string; label: string}[]&gt;([]); |
| [components/BarberSettingsTab.tsx:61](../../components/BarberSettingsTab.tsx#L61) |   const [selectedCountry, setSelectedCountry] = useState&lt;any&gt;(null); |
| [components/BarberSettingsTab.tsx:62](../../components/BarberSettingsTab.tsx#L62) |   const [selectedState, setSelectedState] = useState&lt;any&gt;(null); |
| [components/BarberSettingsTab.tsx:63](../../components/BarberSettingsTab.tsx#L63) |   const [selectedCityOption, setSelectedCityOption] = useState&lt;any&gt;(null); |
| [components/BarberSettingsTab.tsx:64](../../components/BarberSettingsTab.tsx#L64) |   const [selectedLanguages, setSelectedLanguages] = useState&lt;any&gt;([]); |
| [components/BarberSettingsTab.tsx:167](../../components/BarberSettingsTab.tsx#L167) |     placeholder: (base: any) =&gt; ({ |
| [components/BarberSettingsTab.tsx:173](../../components/BarberSettingsTab.tsx#L173) |   const [socialData, setSocialData] = useState({ |
| [components/BarberSettingsTab.tsx:180](../../components/BarberSettingsTab.tsx#L180) |   const [experienceStartYear, setExperienceStartYear] = useState&lt;string&gt;( |
| [components/BarberSettingsTab.tsx:183](../../components/BarberSettingsTab.tsx#L183) |   const [dateOfBirth, setDateOfBirth] = useState&lt;string&gt;(profile?.dateOfBirth ?? ''); |
| [components/BarberSettingsTab.tsx:184](../../components/BarberSettingsTab.tsx#L184) |   const [savingExperience, setSavingExperience] = useState(false); |
| [components/BarberSettingsTab.tsx:187](../../components/BarberSettingsTab.tsx#L187) |   const [specialties, setSpecialties] = useState&lt;string[]&gt;(profile?.specialties \|\| []); |
| [components/BarberSettingsTab.tsx:188](../../components/BarberSettingsTab.tsx#L188) |   const [vibe, setVibe] = useState&lt;string[]&gt;(profile?.vibes \|\| []); |
| [components/BarberSettingsTab.tsx:189](../../components/BarberSettingsTab.tsx#L189) |   const [clientele, setClientele] = useState&lt;string[]&gt;(profile?.clientele \|\| []); |
| [components/BarberSettingsTab.tsx:190](../../components/BarberSettingsTab.tsx#L190) |   const [savingProfile, setSavingProfile] = useState(false); |
| [components/BarberSettingsTab.tsx:193](../../components/BarberSettingsTab.tsx#L193) |   const [notifyEmail, setNotifyEmail] = useState(profile?.notifyEmail !== false); |
| [components/BarberSettingsTab.tsx:194](../../components/BarberSettingsTab.tsx#L194) |   const [notifyCancel, setNotifyCancel] = useState(profile?.notifyCancel !== false); |
| [components/BarberSettingsTab.tsx:195](../../components/BarberSettingsTab.tsx#L195) |   const [showPhone, setShowPhone] = useState(profile?.showPhone === true); |
| [components/BarberSettingsTab.tsx:196](../../components/BarberSettingsTab.tsx#L196) |   const [pwResetSent, setPwResetSent] = useState(false); |
| [components/BarberSettingsTab.tsx:199](../../components/BarberSettingsTab.tsx#L199) |   const [hasEquipment, setHasEquipment] = useState&lt;boolean&gt;(profile?.hasEquipment ?? false); |
| [components/BarberSettingsTab.tsx:200](../../components/BarberSettingsTab.tsx#L200) |   const [lookingForChair, setLookingForChair] = useState&lt;boolean&gt;(profile?.lookingForChair ?? false); |
| [components/BarberSettingsTab.tsx:201](../../components/BarberSettingsTab.tsx#L201) |   const [savingSetup, setSavingSetup] = useState(false); |
| [components/BarberSettingsTab.tsx:202](../../components/BarberSettingsTab.tsx#L202) |   const [isSolo, setIsSolo] = useState&lt;boolean&gt;(profile?.isSolo ?? true); |
| [components/BarberSettingsTab.tsx:203](../../components/BarberSettingsTab.tsx#L203) |   const [savingIsSolo, setSavingIsSolo] = useState(false); |
| [components/BarberSettingsTab.tsx:211](../../components/BarberSettingsTab.tsx#L211) |     setShowPhone(profile?.showPhone === true); |
| [components/BarberSettingsTab.tsx:224](../../components/BarberSettingsTab.tsx#L224) |       setErrorMsg(t('errors.invalidImageType')); |
| [components/BarberSettingsTab.tsx:246](../../components/BarberSettingsTab.tsx#L246) |         (error) =&gt; { |
| [components/BarberSettingsTab.tsx:248](../../components/BarberSettingsTab.tsx#L248) |           setErrorMsg(t('errors.uploadFailed')); |
| [components/BarberSettingsTab.tsx:249](../../components/BarberSettingsTab.tsx#L249) |           console.error("Upload Error:", error); |
| [components/BarberSettingsTab.tsx:261](../../components/BarberSettingsTab.tsx#L261) |              console.error("Database Update Error:", err); |
| [components/BarberSettingsTab.tsx:262](../../components/BarberSettingsTab.tsx#L262) |              setErrorMsg(t('errors.failedUpdatePhoto')); |
| [components/BarberSettingsTab.tsx:267](../../components/BarberSettingsTab.tsx#L267) |     } catch (error) { |
| [components/BarberSettingsTab.tsx:268](../../components/BarberSettingsTab.tsx#L268) |       console.error(error); |
| [components/BarberSettingsTab.tsx:269](../../components/BarberSettingsTab.tsx#L269) |       setErrorMsg(t('errors.imageCompressionFailed')); |
| [components/BarberSettingsTab.tsx:308](../../components/BarberSettingsTab.tsx#L308) |       console.error(e); |
| [components/BarberSettingsTab.tsx:309](../../components/BarberSettingsTab.tsx#L309) |       setErrorMsg(t('errors.failedSavePersonalInfo')); |
| [components/BarberSettingsTab.tsx:329](../../components/BarberSettingsTab.tsx#L329) |       console.error(e); |
| [components/BarberSettingsTab.tsx:330](../../components/BarberSettingsTab.tsx#L330) |       setErrorMsg(t('errors.failedSaveSocialLinks')); |
| [components/BarberSettingsTab.tsx:344](../../components/BarberSettingsTab.tsx#L344) |     } catch (e) { console.error(e); setErrorMsg(t('errors.failedSaveBarberProfile')); } |
| [components/BarberSettingsTab.tsx:365](../../components/BarberSettingsTab.tsx#L365) |       console.error(e); |
| [components/BarberSettingsTab.tsx:366](../../components/BarberSettingsTab.tsx#L366) |       setErrorMsg(t('errors.failedSaveExperience')); |
| [components/BarberSettingsTab.tsx:382](../../components/BarberSettingsTab.tsx#L382) |       console.error(e); |
| [components/BarberSettingsTab.tsx:383](../../components/BarberSettingsTab.tsx#L383) |       setErrorMsg(t('errors.failedSaveBarberProfile')); |
| [components/BarberSettingsTab.tsx:393](../../components/BarberSettingsTab.tsx#L393) |     try { await updateDoc(doc(db, 'users', user.uid), { notifyEmail: val }); } catch (e) { console.error(e); } |
| [components/BarberSettingsTab.tsx:398](../../components/BarberSettingsTab.tsx#L398) |     try { await updateDoc(doc(db, 'users', user.uid), { notifyCancel: val }); } catch (e) { console.error(e); } |
| [components/BarberSettingsTab.tsx:403](../../components/BarberSettingsTab.tsx#L403) |     try { await updateDoc(doc(db, 'professionalProfiles', user.uid), { showPhone: val }); } catch (e) { console.error(e); } |
| [components/BarberSettingsTab.tsx:413](../../components/BarberSettingsTab.tsx#L413) |     } catch (e) { console.error(e); setErrorMsg(t('errors.failedSendReset')); } |
| [components/BarberSettingsTab.tsx:423](../../components/BarberSettingsTab.tsx#L423) |       {errorMsg && ( |
| [components/BarberSettingsTab.tsx:425](../../components/BarberSettingsTab.tsx#L425) |           {errorMsg} |
| [components/BarberSettingsTab.tsx:534](../../components/BarberSettingsTab.tsx#L534) |               {photoLoading ? t('settings.uploading') : t('buttons.uploadNewPhoto')} |
| [components/BarberSettingsTab.tsx:540](../../components/BarberSettingsTab.tsx#L540) |                 disabled={photoLoading} |
| [components/BarberSettingsTab.tsx:584](../../components/BarberSettingsTab.tsx#L584) |                 placeholder="Code" |
| [components/BarberSettingsTab.tsx:594](../../components/BarberSettingsTab.tsx#L594) |                 className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[48px]" |
| [components/BarberSettingsTab.tsx:595](../../components/BarberSettingsTab.tsx#L595) |                 placeholder="600 000 000"  |
| [components/BarberSettingsTab.tsx:613](../../components/BarberSettingsTab.tsx#L613) |               placeholder="Country..." |
| [components/BarberSettingsTab.tsx:634](../../components/BarberSettingsTab.tsx#L634) |               placeholder="Region..." |
| [components/BarberSettingsTab.tsx:651](../../components/BarberSettingsTab.tsx#L651) |               placeholder="City..." |
| [components/BarberSettingsTab.tsx:663](../../components/BarberSettingsTab.tsx#L663) |             placeholder="Tell your clients a bit about yourself..." |
| [components/BarberSettingsTab.tsx:675](../../components/BarberSettingsTab.tsx#L675) |               placeholder="Select languages..." |
| [components/BarberSettingsTab.tsx:681](../../components/BarberSettingsTab.tsx#L681) |           disabled={savingGlobal} |
| [components/BarberSettingsTab.tsx:741](../../components/BarberSettingsTab.tsx#L741) |                   placeholder={t('forms.experienceYearPlaceholder')} |
| [components/BarberSettingsTab.tsx:751](../../components/BarberSettingsTab.tsx#L751) |               disabled={savingExperience \|\| !experienceStartYear \|\| !dateOfBirth} |
| [components/BarberSettingsTab.tsx:803](../../components/BarberSettingsTab.tsx#L803) |         &lt;button onClick={handleSaveBarberProfile} disabled={savingProfile} |
| [components/BarberSettingsTab.tsx:820](../../components/BarberSettingsTab.tsx#L820) |             placeholder="@your_username" |
| [components/BarberSettingsTab.tsx:831](../../components/BarberSettingsTab.tsx#L831) |             placeholder="your.profile.name" |
| [components/BarberSettingsTab.tsx:842](../../components/BarberSettingsTab.tsx#L842) |             placeholder="@your_username" |
| [components/BarberSettingsTab.tsx:848](../../components/BarberSettingsTab.tsx#L848) |           disabled={savingSocial} |
| [components/BarberSettingsTab.tsx:867](../../components/BarberSettingsTab.tsx#L867) |                 if (!confirm(t('errors.leaveShopConfirm'))) return; |
| [components/BarberSettingsTab.tsx:934](../../components/BarberSettingsTab.tsx#L934) |                   console.error('Failed to leave shop', e); |
| [components/BarberSettingsTab.tsx:962](../../components/BarberSettingsTab.tsx#L962) |               disabled={savingIsSolo} |
| [components/BarberSettingsTab.tsx:981](../../components/BarberSettingsTab.tsx#L981) |                       t('errors.stopSoloConfirm').replace('{n}', String(count)) |
| [components/BarberSettingsTab.tsx:993](../../components/BarberSettingsTab.tsx#L993) |                       console.error(err); |
| [components/BarberSettingsTab.tsx:1000](../../components/BarberSettingsTab.tsx#L1000) |                     console.error(err); |
| [components/BarberSettingsTab.tsx:1011](../../components/BarberSettingsTab.tsx#L1011) |                     console.error(err); |
| [components/BarberSettingsTab.tsx:1150](../../components/BarberSettingsTab.tsx#L1150) |             disabled={savingSetup} |
| [components/BarberSettingsTab.tsx:1191](../../components/BarberSettingsTab.tsx#L1191) |             &lt;div className="text-sm font-bold text-white"&gt;{t('settings.showPhone')}&lt;/div&gt; |
| [components/BarberSettingsTab.tsx:1192](../../components/BarberSettingsTab.tsx#L1192) |             &lt;div className="text-xs text-[#555] mt-0.5"&gt;{t('settings.showPhoneDesc')}&lt;/div&gt; |
| [components/BarberSettingsTab.tsx:1195](../../components/BarberSettingsTab.tsx#L1195) |             &lt;input type="checkbox" checked={showPhone} onChange={e =&gt; handleToggleShowPhone(e.target.checked)} className="peer sr-only" /&gt; |
| [components/BarberSettingsTab.tsx:1210](../../components/BarberSettingsTab.tsx#L1210) |         &lt;button onClick={handlePasswordReset} disabled={pwResetSent} |
| [components/ChallengeHomepageBox.tsx:17](../../components/ChallengeHomepageBox.tsx#L17) |   const { user, appUser, loading: authLoading } = useAuth(); |
| [components/ChallengeHomepageBox.tsx:52](../../components/ChallengeHomepageBox.tsx#L52) |   if (!settings?.showHomepageBox) { |
| [components/ChallengeHomepageBox.tsx:73](../../components/ChallengeHomepageBox.tsx#L73) |           {t('landing.challenge.votingComingSoon') ?? ''} |
| [components/ChallengePaymentTab.tsx:3](../../components/ChallengePaymentTab.tsx#L3) | import { useState, useEffect, useCallback } from 'react'; |
| [components/ChallengePaymentTab.tsx:26](../../components/ChallengePaymentTab.tsx#L26) |   const { user, loading: authLoading } = useAuth(); |
| [components/ChallengePaymentTab.tsx:30](../../components/ChallengePaymentTab.tsx#L30) |   const [settings, setSettings] = useState&lt;ChallengeSettingsData \| null&gt;(null); |
| [components/ChallengePaymentTab.tsx:31](../../components/ChallengePaymentTab.tsx#L31) |   const [submission, setSubmission] = useState&lt;LoadedSubmission \| null&gt;(null); |
| [components/ChallengePaymentTab.tsx:32](../../components/ChallengePaymentTab.tsx#L32) |   const [loading, setLoading] = useState(true); |
| [components/ChallengePaymentTab.tsx:33](../../components/ChallengePaymentTab.tsx#L33) |   const [declaredAmount, setDeclaredAmount] = useState(''); |
| [components/ChallengePaymentTab.tsx:34](../../components/ChallengePaymentTab.tsx#L34) |   const [declaredReference, setDeclaredReference] = useState(''); |
| [components/ChallengePaymentTab.tsx:35](../../components/ChallengePaymentTab.tsx#L35) |   const [submitting, setSubmitting] = useState(false); |
| [components/ChallengePaymentTab.tsx:36](../../components/ChallengePaymentTab.tsx#L36) |   const [errorMsg, setErrorMsg] = useState&lt;string \| null&gt;(null); |
| [components/ChallengePaymentTab.tsx:63](../../components/ChallengePaymentTab.tsx#L63) |         console.error('Failed to load payment data', e); |
| [components/ChallengePaymentTab.tsx:75](../../components/ChallengePaymentTab.tsx#L75) |     if (loading) return; |
| [components/ChallengePaymentTab.tsx:84](../../components/ChallengePaymentTab.tsx#L84) |   }, [loading, user, submission, mode, router]); |
| [components/ChallengePaymentTab.tsx:92](../../components/ChallengePaymentTab.tsx#L92) |       toast.error(t('challenge.payment.toastCopyFail')); |
| [components/ChallengePaymentTab.tsx:136](../../components/ChallengePaymentTab.tsx#L136) |       console.error('Confirm payment failed', e); |
| [components/ChallengePaymentTab.tsx:144](../../components/ChallengePaymentTab.tsx#L144) |   if (loading \|\| authLoading) { |
| [components/ChallengePaymentTab.tsx:147](../../components/ChallengePaymentTab.tsx#L147) |         &lt;div className="text-[#666] text-sm"&gt;{t('challenge.public.loading')}&lt;/div&gt; |
| [components/ChallengePaymentTab.tsx:254](../../components/ChallengePaymentTab.tsx#L254) |       {errorMsg && ( |
| [components/ChallengePaymentTab.tsx:256](../../components/ChallengePaymentTab.tsx#L256) |           {errorMsg} |
| [components/ChallengePaymentTab.tsx:351](../../components/ChallengePaymentTab.tsx#L351) |             className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-3 text-sm text-white placeholder-[#555] focus:border-brand-yellow focus:outline-none transition-colors" |
| [components/ChallengePaymentTab.tsx:352](../../components/ChallengePaymentTab.tsx#L352) |             placeholder={typeof totalAmount === 'number' ? String(totalAmount) : '0.00'} |
| [components/ChallengePaymentTab.tsx:372](../../components/ChallengePaymentTab.tsx#L372) |             className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-3 text-sm font-mono text-white placeholder-[#555] focus:border-brand-yellow focus:outline-none transition-colors" |
| [components/ChallengePaymentTab.tsx:373](../../components/ChallengePaymentTab.tsx#L373) |             placeholder={buildPaymentReference(submission)} |
| [components/ChallengePaymentTab.tsx:385](../../components/ChallengePaymentTab.tsx#L385) |         disabled={!canSubmit} |
| [components/ChallengeSubmissionTab.tsx:3](../../components/ChallengeSubmissionTab.tsx#L3) | import { useState, useEffect, useCallback, useRef } from 'react'; |
| [components/ChallengeSubmissionTab.tsx:31](../../components/ChallengeSubmissionTab.tsx#L31) |   uploading: boolean; |
| [components/ChallengeSubmissionTab.tsx:35](../../components/ChallengeSubmissionTab.tsx#L35) |   { file: null, url: null, uploading: false }, |
| [components/ChallengeSubmissionTab.tsx:36](../../components/ChallengeSubmissionTab.tsx#L36) |   { file: null, url: null, uploading: false }, |
| [components/ChallengeSubmissionTab.tsx:37](../../components/ChallengeSubmissionTab.tsx#L37) |   { file: null, url: null, uploading: false }, |
| [components/ChallengeSubmissionTab.tsx:38](../../components/ChallengeSubmissionTab.tsx#L38) |   { file: null, url: null, uploading: false }, |
| [components/ChallengeSubmissionTab.tsx:69](../../components/ChallengeSubmissionTab.tsx#L69) |     video.onerror = () =&gt; { |
| [components/ChallengeSubmissionTab.tsx:179](../../components/ChallengeSubmissionTab.tsx#L179) |   const [expanded, setExpanded] = useState(false); |
| [components/ChallengeSubmissionTab.tsx:199](../../components/ChallengeSubmissionTab.tsx#L199) |                   {expanded ? t('challenge.submission.showLess') : t('challenge.submission.readFull')} |
| [components/ChallengeSubmissionTab.tsx:229](../../components/ChallengeSubmissionTab.tsx#L229) |   const [submitMode, setSubmitMode] = useState&lt;Mode&gt;(mode); |
| [components/ChallengeSubmissionTab.tsx:230](../../components/ChallengeSubmissionTab.tsx#L230) |   const [settings, setSettings] = useState&lt;ChallengeSettingsData \| null&gt;(null); |
| [components/ChallengeSubmissionTab.tsx:232](../../components/ChallengeSubmissionTab.tsx#L232) |     useState&lt;(ChallengeSubmissionData & { id: string }) \| null&gt;(null); |
| [components/ChallengeSubmissionTab.tsx:233](../../components/ChallengeSubmissionTab.tsx#L233) |   const [loading, setLoading] = useState(true); |
| [components/ChallengeSubmissionTab.tsx:235](../../components/ChallengeSubmissionTab.tsx#L235) |   const [photos, setPhotos] = useState&lt;PhotoSlot[]&gt;(EMPTY_SLOTS); |
| [components/ChallengeSubmissionTab.tsx:236](../../components/ChallengeSubmissionTab.tsx#L236) |   const [videoFile, setVideoFile] = useState&lt;File \| null&gt;(null); |
| [components/ChallengeSubmissionTab.tsx:237](../../components/ChallengeSubmissionTab.tsx#L237) |   const [videoUrl, setVideoUrl] = useState&lt;string \| null&gt;(null); |
| [components/ChallengeSubmissionTab.tsx:238](../../components/ChallengeSubmissionTab.tsx#L238) |   const [videoUploading, setVideoUploading] = useState(false); |
| [components/ChallengeSubmissionTab.tsx:239](../../components/ChallengeSubmissionTab.tsx#L239) |   const [description, setDescription] = useState(''); |
| [components/ChallengeSubmissionTab.tsx:240](../../components/ChallengeSubmissionTab.tsx#L240) |   const [termsAccepted, setTermsAccepted] = useState(false); |
| [components/ChallengeSubmissionTab.tsx:241](../../components/ChallengeSubmissionTab.tsx#L241) |   const [submitting, setSubmitting] = useState(false); |
| [components/ChallengeSubmissionTab.tsx:242](../../components/ChallengeSubmissionTab.tsx#L242) |   const [errorMsg, setErrorMsg] = useState&lt;string \| null&gt;(null); |
| [components/ChallengeSubmissionTab.tsx:261](../../components/ChallengeSubmissionTab.tsx#L261) |         console.error('Failed to load challenge settings', e); |
| [components/ChallengeSubmissionTab.tsx:283](../../components/ChallengeSubmissionTab.tsx#L283) |               uploading: false, |
| [components/ChallengeSubmissionTab.tsx:286](../../components/ChallengeSubmissionTab.tsx#L286) |               slots[i] = { file: null, url: u, uploading: false }; |
| [components/ChallengeSubmissionTab.tsx:300](../../components/ChallengeSubmissionTab.tsx#L300) |         console.error('Failed to load existing submission', e); |
| [components/ChallengeSubmissionTab.tsx:330](../../components/ChallengeSubmissionTab.tsx#L330) |       next[slotIndex] = { ...next[slotIndex], file, uploading: true }; |
| [components/ChallengeSubmissionTab.tsx:337](../../components/ChallengeSubmissionTab.tsx#L337) |         next[slotIndex] = { file: null, url, uploading: false }; |
| [components/ChallengeSubmissionTab.tsx:341](../../components/ChallengeSubmissionTab.tsx#L341) |       console.error(e); |
| [components/ChallengeSubmissionTab.tsx:350](../../components/ChallengeSubmissionTab.tsx#L350) |         next[slotIndex] = { file: null, url: null, uploading: false }; |
| [components/ChallengeSubmissionTab.tsx:360](../../components/ChallengeSubmissionTab.tsx#L360) |       next[slotIndex] = { file: null, url: null, uploading: false }; |
| [components/ChallengeSubmissionTab.tsx:370](../../components/ChallengeSubmissionTab.tsx#L370) |     setVideoUploading(true); |
| [components/ChallengeSubmissionTab.tsx:375](../../components/ChallengeSubmissionTab.tsx#L375) |       console.error(e); |
| [components/ChallengeSubmissionTab.tsx:390](../../components/ChallengeSubmissionTab.tsx#L390) |       setVideoUploading(false); |
| [components/ChallengeSubmissionTab.tsx:482](../../components/ChallengeSubmissionTab.tsx#L482) |       console.error('Submission failed', e); |
| [components/ChallengeSubmissionTab.tsx:490](../../components/ChallengeSubmissionTab.tsx#L490) |   if (loading) { |
| [components/ChallengeSubmissionTab.tsx:493](../../components/ChallengeSubmissionTab.tsx#L493) |         &lt;div className="text-[#666] text-sm"&gt;{t('challenge.submission.loading')}&lt;/div&gt; |
| [components/ChallengeSubmissionTab.tsx:552](../../components/ChallengeSubmissionTab.tsx#L552) |         toast.error(t('challenge.payment.toastCopyFail')); |
| [components/ChallengeSubmissionTab.tsx:714](../../components/ChallengeSubmissionTab.tsx#L714) |   const anyUploading = photos.some(p =&gt; p.uploading) \|\| videoUploading; |
| [components/ChallengeSubmissionTab.tsx:715](../../components/ChallengeSubmissionTab.tsx#L715) |   const canSubmit = photoUrlsCount &gt;= 1 && termsAccepted && !submitting && !anyUploading; |
| [components/ChallengeSubmissionTab.tsx:733](../../components/ChallengeSubmissionTab.tsx#L733) |       console.error('Download failed:', err); |
| [components/ChallengeSubmissionTab.tsx:851](../../components/ChallengeSubmissionTab.tsx#L851) |               {slot.uploading ? ( |
| [components/ChallengeSubmissionTab.tsx:853](../../components/ChallengeSubmissionTab.tsx#L853) |                   {t('challenge.submission.uploading')} |
| [components/ChallengeSubmissionTab.tsx:900](../../components/ChallengeSubmissionTab.tsx#L900) |           {videoUploading ? ( |
| [components/ChallengeSubmissionTab.tsx:902](../../components/ChallengeSubmissionTab.tsx#L902) |               {t('challenge.submission.uploading')} |
| [components/ChallengeSubmissionTab.tsx:938](../../components/ChallengeSubmissionTab.tsx#L938) |           className="w-full bg-[#111] border border-[#2a2a2a] rounded-[16px] p-4 text-sm text-white placeholder-[#555] focus:border-brand-yellow focus:outline-none transition-colors resize-none" |
| [components/ChallengeSubmissionTab.tsx:939](../../components/ChallengeSubmissionTab.tsx#L939) |           placeholder={t('challenge.submission.notesPlaceholder')} |
| [components/ChallengeSubmissionTab.tsx:965](../../components/ChallengeSubmissionTab.tsx#L965) |       {errorMsg && ( |
| [components/ChallengeSubmissionTab.tsx:967](../../components/ChallengeSubmissionTab.tsx#L967) |           {errorMsg} |
| [components/ChallengeSubmissionTab.tsx:975](../../components/ChallengeSubmissionTab.tsx#L975) |         disabled={!canSubmit} |
| [components/ComingSoon.tsx:3](../../components/ComingSoon.tsx#L3) | import { useState } from 'react'; |
| [components/ComingSoon.tsx:10](../../components/ComingSoon.tsx#L10) | interface ComingSoonProps { |
| [components/ComingSoon.tsx:14](../../components/ComingSoon.tsx#L14) |   showNotify?: boolean; |
| [components/ComingSoon.tsx:18](../../components/ComingSoon.tsx#L18) | export function ComingSoon({ icon, title, body, showNotify = false, featureKey }: ComingSoonProps) { |
| [components/ComingSoon.tsx:21](../../components/ComingSoon.tsx#L21) |   const [done, setDone] = useState(false); |
| [components/ComingSoon.tsx:22](../../components/ComingSoon.tsx#L22) |   const [sending, setSending] = useState(false); |
| [components/ComingSoon.tsx:37](../../components/ComingSoon.tsx#L37) |       console.error(e); |
| [components/ComingSoon.tsx:48](../../components/ComingSoon.tsx#L48) |       {showNotify && ( |
| [components/ComingSoon.tsx:51](../../components/ComingSoon.tsx#L51) |           disabled={done \|\| sending} |
| [components/ConditionalNav.tsx:38](../../components/ConditionalNav.tsx#L38) |   const showFooter = FOOTER_ROUTES.includes(pathname) \|\| |
| [components/ConditionalNav.tsx:50](../../components/ConditionalNav.tsx#L50) |       {showFooter && &lt;Footer /&gt;} |
| [components/ConfirmDialog.tsx:3](../../components/ConfirmDialog.tsx#L3) | interface ConfirmDialogProps { |
| [components/ConfirmDialog.tsx:14](../../components/ConfirmDialog.tsx#L14) | export function ConfirmDialog({ |
| [components/ConfirmDialog.tsx:23](../../components/ConfirmDialog.tsx#L23) | }: ConfirmDialogProps) { |
| [components/CookieBanner.tsx:3](../../components/CookieBanner.tsx#L3) | import { useState, useEffect } from 'react'; |
| [components/CookieBanner.tsx:14](../../components/CookieBanner.tsx#L14) |   const [isVisible, setIsVisible] = useState(false); |
| [components/CookieBanner.tsx:15](../../components/CookieBanner.tsx#L15) |   const [showModal, setShowModal] = useState(false); |
| [components/CookieBanner.tsx:16](../../components/CookieBanner.tsx#L16) |   const [settings, setSettings] = useState&lt;CookieSettings&gt;({ |
| [components/CookieBanner.tsx:32](../../components/CookieBanner.tsx#L32) |     setShowModal(false); |
| [components/CookieBanner.tsx:71](../../components/CookieBanner.tsx#L71) |               onClick={() =&gt; setShowModal(true)} |
| [components/CookieBanner.tsx:80](../../components/CookieBanner.tsx#L80) |       {showModal && ( |
| [components/CountdownTimer.tsx:3](../../components/CountdownTimer.tsx#L3) | import { useEffect, useState } from 'react'; |
| [components/CountdownTimer.tsx:11](../../components/CountdownTimer.tsx#L11) |   const [now, setNow] = useState&lt;number&gt;(() =&gt; Date.now()); |
| [components/DeleteAccountButton.tsx:3](../../components/DeleteAccountButton.tsx#L3) | import { useState } from 'react'; |
| [components/DeleteAccountButton.tsx:50](../../components/DeleteAccountButton.tsx#L50) |   const [showConfirm, setShowConfirm] = useState(false); |
| [components/DeleteAccountButton.tsx:51](../../components/DeleteAccountButton.tsx#L51) |   const [showReauth, setShowReauth] = useState(false); |
| [components/DeleteAccountButton.tsx:52](../../components/DeleteAccountButton.tsx#L52) |   const [deleting, setDeleting] = useState(false); |
| [components/DeleteAccountButton.tsx:53](../../components/DeleteAccountButton.tsx#L53) |   const [reauthPassword, setReauthPassword] = useState(''); |
| [components/DeleteAccountButton.tsx:54](../../components/DeleteAccountButton.tsx#L54) |   const [error, setError] = useState(''); |
| [components/DeleteAccountButton.tsx:87](../../components/DeleteAccountButton.tsx#L87) |         console.error('Delete account error:', err); |
| [components/DeleteAccountButton.tsx:105](../../components/DeleteAccountButton.tsx#L105) |       console.error('Reauth error:', err); |
| [components/DeleteAccountButton.tsx:136](../../components/DeleteAccountButton.tsx#L136) |       {showConfirm && ( |
| [components/DeleteAccountButton.tsx:184](../../components/DeleteAccountButton.tsx#L184) |             {error && ( |
| [components/DeleteAccountButton.tsx:197](../../components/DeleteAccountButton.tsx#L197) |                 {error} |
| [components/DeleteAccountButton.tsx:204](../../components/DeleteAccountButton.tsx#L204) |                 disabled={deleting} |
| [components/DeleteAccountButton.tsx:226](../../components/DeleteAccountButton.tsx#L226) |                 disabled={deleting} |
| [components/DeleteAccountButton.tsx:248](../../components/DeleteAccountButton.tsx#L248) |       {showReauth && ( |
| [components/DeleteAccountButton.tsx:294](../../components/DeleteAccountButton.tsx#L294) |             {error && ( |
| [components/DeleteAccountButton.tsx:307](../../components/DeleteAccountButton.tsx#L307) |                 {error} |
| [components/DeleteAccountButton.tsx:314](../../components/DeleteAccountButton.tsx#L314) |                 disabled={deleting} |
| [components/DeleteAccountButton.tsx:345](../../components/DeleteAccountButton.tsx#L345) |                   placeholder="Your password" |
| [components/DeleteAccountButton.tsx:369](../../components/DeleteAccountButton.tsx#L369) |                   disabled={deleting \|\| !reauthPassword} |
| [components/ErrorBoundary.tsx:13](../../components/ErrorBoundary.tsx#L13) |   error?: Error; |
| [components/ErrorBoundary.tsx:22](../../components/ErrorBoundary.tsx#L22) |   static getDerivedStateFromError(error: Error): State { |
| [components/ErrorBoundary.tsx:23](../../components/ErrorBoundary.tsx#L23) |     return { hasError: true, error }; |
| [components/ErrorBoundary.tsx:26](../../components/ErrorBoundary.tsx#L26) |   componentDidCatch(error: Error, info: React.ErrorInfo) { |
| [components/ErrorBoundary.tsx:27](../../components/ErrorBoundary.tsx#L27) |     console.error(`Error in ${this.props.section \|\| 'component'}:`, error, info); |
| [components/Footer.tsx:50](../../components/Footer.tsx#L50) |          {t('footer.appComingSoon')} |
| [components/NotificationBell.tsx:3](../../components/NotificationBell.tsx#L3) | import { useState, useEffect } from 'react'; |
| [components/NotificationBell.tsx:13](../../components/NotificationBell.tsx#L13) |   const [notifications, setNotifications] = useState&lt;any[]&gt;([]); |
| [components/NotificationBell.tsx:14](../../components/NotificationBell.tsx#L14) |   const [showDropdown, setShowDropdown] = useState(false); |
| [components/NotificationBell.tsx:18](../../components/NotificationBell.tsx#L18) |   const [localUnreadCount, setLocalUnreadCount] = useState(appUser?.unreadCount \|\| 0); |
| [components/NotificationBell.tsx:27](../../components/NotificationBell.tsx#L27) |     if (!user \|\| !showDropdown) return; |
| [components/NotificationBell.tsx:39](../../components/NotificationBell.tsx#L39) |   }, [user, showDropdown]); |
| [components/NotificationBell.tsx:42](../../components/NotificationBell.tsx#L42) |     const opening = !showDropdown; |
| [components/NotificationBell.tsx:47](../../components/NotificationBell.tsx#L47) |       updateDoc(doc(db, 'users', user.uid), { unreadCount: 0 }).catch(console.error); |
| [components/NotificationBell.tsx:58](../../components/NotificationBell.tsx#L58) |       console.error(e); |
| [components/NotificationBell.tsx:80](../../components/NotificationBell.tsx#L80) |       {showDropdown && ( |
| [components/OfflineBanner.tsx:3](../../components/OfflineBanner.tsx#L3) | import { useState, useEffect } from 'react'; |
| [components/OfflineBanner.tsx:8](../../components/OfflineBanner.tsx#L8) |   const [isOnline, setIsOnline] = useState(true); |
| [components/OfflineBanner.tsx:9](../../components/OfflineBanner.tsx#L9) |   const [wasOffline, setWasOffline] = useState(false); |
| [components/OfflineBanner.tsx:10](../../components/OfflineBanner.tsx#L10) |   const [showBackOnline, setShowBackOnline] = useState(false); |
| [components/OfflineBanner.tsx:42](../../components/OfflineBanner.tsx#L42) |   if (isOnline && !showBackOnline) return null; |
| [components/PasswordInput.tsx:3](../../components/PasswordInput.tsx#L3) | import { useState } from 'react'; |
| [components/PasswordInput.tsx:8](../../components/PasswordInput.tsx#L8) |   placeholder?: string; |
| [components/PasswordInput.tsx:21](../../components/PasswordInput.tsx#L21) |   placeholder = 'Password', |
| [components/PasswordInput.tsx:28](../../components/PasswordInput.tsx#L28) |   const [show, setShow] = useState(false); |
| [components/PasswordInput.tsx:36](../../components/PasswordInput.tsx#L36) |         placeholder={placeholder} |
| [components/RouteGuard.tsx:3](../../components/RouteGuard.tsx#L3) | import { useEffect, useState } from 'react'; |
| [components/RouteGuard.tsx:71](../../components/RouteGuard.tsx#L71) |   const { user, appUser, loading } = useAuth(); |
| [components/RouteGuard.tsx:74](../../components/RouteGuard.tsx#L74) |   const [authorized, setAuthorized] = useState(false); |
| [components/RouteGuard.tsx:75](../../components/RouteGuard.tsx#L75) |   const [checking, setChecking] = useState(true); |
| [components/RouteGuard.tsx:78](../../components/RouteGuard.tsx#L78) |     if (loading) return; |
| [components/RouteGuard.tsx:143](../../components/RouteGuard.tsx#L143) |   }, [user, appUser, loading, pathname, router]); |
| [components/RouteGuard.tsx:145](../../components/RouteGuard.tsx#L145) |   if (loading \|\| checking) return &lt;LoadingScreen /&gt;; |
| [components/ShopAvailabilityTab.tsx:3](../../components/ShopAvailabilityTab.tsx#L3) | import { useState, useEffect } from 'react'; |
| [components/ShopAvailabilityTab.tsx:76](../../components/ShopAvailabilityTab.tsx#L76) |   const [hours, setHours] = useState&lt;WeeklyHours&gt;(DEFAULT_HOURS); |
| [components/ShopAvailabilityTab.tsx:77](../../components/ShopAvailabilityTab.tsx#L77) |   const [blockedDates, setBlockedDates] = useState&lt;BlockedDate[]&gt;([]); |
| [components/ShopAvailabilityTab.tsx:78](../../components/ShopAvailabilityTab.tsx#L78) |   const [newClosureDate, setNewClosureDate] = useState(''); |
| [components/ShopAvailabilityTab.tsx:79](../../components/ShopAvailabilityTab.tsx#L79) |   const [newClosureReason, setNewClosureReason] = useState(''); |
| [components/ShopAvailabilityTab.tsx:80](../../components/ShopAvailabilityTab.tsx#L80) |   const [saving, setSaving] = useState(false); |
| [components/ShopAvailabilityTab.tsx:81](../../components/ShopAvailabilityTab.tsx#L81) |   const [lastSaved, setLastSaved] = useState&lt;number \| null&gt;(null); |
| [components/ShopAvailabilityTab.tsx:129](../../components/ShopAvailabilityTab.tsx#L129) |       console.error(e); |
| [components/ShopAvailabilityTab.tsx:130](../../components/ShopAvailabilityTab.tsx#L130) |       toast.error('Failed to save hours.'); |
| [components/ShopAvailabilityTab.tsx:139](../../components/ShopAvailabilityTab.tsx#L139) |       toast.error('Date already added'); |
| [components/ShopAvailabilityTab.tsx:260](../../components/ShopAvailabilityTab.tsx#L260) |           disabled={saving} |
| [components/ShopAvailabilityTab.tsx:281](../../components/ShopAvailabilityTab.tsx#L281) |           &lt;input type="text" placeholder={t('forms.reason')} value={newClosureReason} |
| [components/ShopAvailabilityTab.tsx:284](../../components/ShopAvailabilityTab.tsx#L284) |           &lt;button onClick={addClosure} disabled={!newClosureDate} |
| [components/ShopAvailabilityTab.tsx:291](../../components/ShopAvailabilityTab.tsx#L291) |           &lt;div className="text-[#555] text-xs"&gt;{t('emptyStates.noSpecialClosures')}&lt;/div&gt; |
| [components/ShopPhotosTab.tsx:3](../../components/ShopPhotosTab.tsx#L3) | import { useState } from 'react'; |
| [components/ShopPhotosTab.tsx:18](../../components/ShopPhotosTab.tsx#L18) |   const [notified, setNotified] = useState(false); |
| [components/ShopPhotosTab.tsx:19](../../components/ShopPhotosTab.tsx#L19) |   const [notifying, setNotifying] = useState(false); |
| [components/ShopPhotosTab.tsx:34](../../components/ShopPhotosTab.tsx#L34) |       console.error(e); |
| [components/ShopPhotosTab.tsx:59](../../components/ShopPhotosTab.tsx#L59) |           &lt;p className="text-sm font-bold text-[#888] mb-1"&gt;{t('shop.photosComingSoonDesc')}&lt;/p&gt; |
| [components/ShopPhotosTab.tsx:66](../../components/ShopPhotosTab.tsx#L66) |             disabled={notified \|\| notifying} |
| [components/ShopPhotosTab.tsx:87](../../components/ShopPhotosTab.tsx#L87) |           &lt;p className="text-[11px] text-[#444] italic"&gt;{t('shop.videosComingSoonDesc')}&lt;/p&gt; |
| [components/ShopServicesTab.tsx:4](../../components/ShopServicesTab.tsx#L4) | import { useState } from 'react'; |
| [components/ShopServicesTab.tsx:31](../../components/ShopServicesTab.tsx#L31) |   const [newServiceName, setNewServiceName] = useState(''); |
| [components/ShopServicesTab.tsx:32](../../components/ShopServicesTab.tsx#L32) |   const [newServicePrice, setNewServicePrice] = useState(''); |
| [components/ShopServicesTab.tsx:33](../../components/ShopServicesTab.tsx#L33) |   const [newServiceDuration, setNewServiceDuration] = useState(''); |
| [components/ShopServicesTab.tsx:34](../../components/ShopServicesTab.tsx#L34) |   const [addError, setAddError] = useState(''); |
| [components/ShopServicesTab.tsx:37](../../components/ShopServicesTab.tsx#L37) |   const [isSavingTitz, setIsSavingTitz] = useState(false); |
| [components/ShopServicesTab.tsx:38](../../components/ShopServicesTab.tsx#L38) |   const [titzData, setTitzData] = useState({ |
| [components/ShopServicesTab.tsx:44](../../components/ShopServicesTab.tsx#L44) |   const [editingId, setEditingId] = useState&lt;string \| null&gt;(null); |
| [components/ShopServicesTab.tsx:45](../../components/ShopServicesTab.tsx#L45) |   const [editName, setEditName] = useState(''); |
| [components/ShopServicesTab.tsx:46](../../components/ShopServicesTab.tsx#L46) |   const [editPrice, setEditPrice] = useState(''); |
| [components/ShopServicesTab.tsx:47](../../components/ShopServicesTab.tsx#L47) |   const [editDuration, setEditDuration] = useState(''); |
| [components/ShopServicesTab.tsx:69](../../components/ShopServicesTab.tsx#L69) |     } catch (e) { console.error(e); } |
| [components/ShopServicesTab.tsx:73](../../components/ShopServicesTab.tsx#L73) |     try { await deleteDoc(doc(db, 'services', id)); mutateServices(); } catch (e) { console.error(e); } |
| [components/ShopServicesTab.tsx:77](../../components/ShopServicesTab.tsx#L77) |     try { await updateDoc(doc(db, 'services', id), { isActive: !current }); mutateServices(); } catch (e) { console.error(e); } |
| [components/ShopServicesTab.tsx:89](../../components/ShopServicesTab.tsx#L89) |     } catch (e) { console.error(e); } |
| [components/ShopServicesTab.tsx:101](../../components/ShopServicesTab.tsx#L101) |     } catch (e) { console.error(e); } |
| [components/ShopServicesTab.tsx:146](../../components/ShopServicesTab.tsx#L146) |           &lt;button onClick={handleSaveTitzCut} disabled={isSavingTitz} |
| [components/ShopServicesTab.tsx:157](../../components/ShopServicesTab.tsx#L157) |           &lt;div className="text-brand-text-secondary text-sm"&gt;{t('emptyStates.noRegularServices')}&lt;/div&gt; |
| [components/ShopServicesTab.tsx:170](../../components/ShopServicesTab.tsx#L170) |                       className="w-16 bg-[#0a0a0a] border border-[#2a2a2a] text-white rounded-lg px-2 py-1.5 text-sm" placeholder="Min" /&gt; |
| [components/ShopServicesTab.tsx:220](../../components/ShopServicesTab.tsx#L220) |             &lt;input type="text" placeholder={t('forms.serviceNamePlaceholder')} value={newServiceName} |
| [components/ShopServicesTab.tsx:225](../../components/ShopServicesTab.tsx#L225) |             &lt;input type="number" placeholder={t('forms.minPlaceholder')} value={newServiceDuration} |
| [components/ShopServicesTab.tsx:231](../../components/ShopServicesTab.tsx#L231) |             &lt;input type="number" placeholder={t('forms.pricePlaceholder')} value={newServicePrice} |
| [components/ShopServicesTab.tsx:237](../../components/ShopServicesTab.tsx#L237) |           disabled={!newServiceName \|\| !newServicePrice \|\| !newServiceDuration} |
| [components/ShopSettingsTab.tsx:3](../../components/ShopSettingsTab.tsx#L3) | import { useState, useMemo, useEffect } from 'react'; |
| [components/ShopSettingsTab.tsx:14](../../components/ShopSettingsTab.tsx#L14) |     loading: () =&gt; ( |
| [components/ShopSettingsTab.tsx:36](../../components/ShopSettingsTab.tsx#L36) |   const [photoLoading, setPhotoLoading] = useState(false); |
| [components/ShopSettingsTab.tsx:37](../../components/ShopSettingsTab.tsx#L37) |   const [logoLoading, setLogoLoading] = useState(false); |
| [components/ShopSettingsTab.tsx:38](../../components/ShopSettingsTab.tsx#L38) |   const [savingGlobal, setSavingGlobal] = useState(false); |
| [components/ShopSettingsTab.tsx:39](../../components/ShopSettingsTab.tsx#L39) |   const [savingSocial, setSavingSocial] = useState(false); |
| [components/ShopSettingsTab.tsx:40](../../components/ShopSettingsTab.tsx#L40) |   const [deleting, setDeleting] = useState(false); |
| [components/ShopSettingsTab.tsx:41](../../components/ShopSettingsTab.tsx#L41) |   const [errorMsg, setErrorMsg] = useState(''); |
| [components/ShopSettingsTab.tsx:42](../../components/ShopSettingsTab.tsx#L42) |   const [successMsg, setSuccessMsg] = useState(''); |
| [components/ShopSettingsTab.tsx:43](../../components/ShopSettingsTab.tsx#L43) |   const [localPhotoUrl, setLocalPhotoUrl] = useState(''); |
| [components/ShopSettingsTab.tsx:44](../../components/ShopSettingsTab.tsx#L44) |   const [localLogoUrl, setLocalLogoUrl] = useState(''); |
| [components/ShopSettingsTab.tsx:46](../../components/ShopSettingsTab.tsx#L46) |   const [formData, setFormData] = useState({ |
| [components/ShopSettingsTab.tsx:61](../../components/ShopSettingsTab.tsx#L61) |   const [phoneNumberInput, setPhoneNumberInput] = useState(initPhoneNumStr); |
| [components/ShopSettingsTab.tsx:62](../../components/ShopSettingsTab.tsx#L62) |   const [phoneCode, setPhoneCode] = useState&lt;any&gt;(null); |
| [components/ShopSettingsTab.tsx:64](../../components/ShopSettingsTab.tsx#L64) |   const [selectedCountry, setSelectedCountry] = useState&lt;any&gt;(null); |
| [components/ShopSettingsTab.tsx:65](../../components/ShopSettingsTab.tsx#L65) |   const [selectedState, setSelectedState] = useState&lt;any&gt;(null); |
| [components/ShopSettingsTab.tsx:66](../../components/ShopSettingsTab.tsx#L66) |   const [selectedCityOption, setSelectedCityOption] = useState&lt;any&gt;(null); |
| [components/ShopSettingsTab.tsx:67](../../components/ShopSettingsTab.tsx#L67) |   const [csc, setCsc] = useState&lt;any&gt;(null); |
| [components/ShopSettingsTab.tsx:146](../../components/ShopSettingsTab.tsx#L146) |     placeholder: (base: any) =&gt; ({ |
| [components/ShopSettingsTab.tsx:152](../../components/ShopSettingsTab.tsx#L152) |   const [socialData, setSocialData] = useState({ |
| [components/ShopSettingsTab.tsx:158](../../components/ShopSettingsTab.tsx#L158) |   const [googleMapsUrl, setGoogleMapsUrl] = useState(shop?.googleMapsUrl \|\| ''); |
| [components/ShopSettingsTab.tsx:159](../../components/ShopSettingsTab.tsx#L159) |   const [savingMaps, setSavingMaps] = useState(false); |
| [components/ShopSettingsTab.tsx:160](../../components/ShopSettingsTab.tsx#L160) |   const [notifyInviteResponse, setNotifyInviteResponse] = useState(shop?.notifyInviteResponse !== false); |
| [components/ShopSettingsTab.tsx:161](../../components/ShopSettingsTab.tsx#L161) |   const [notifyNewBooking, setNotifyNewBooking] = useState(shop?.notifyNewBooking !== false); |
| [components/ShopSettingsTab.tsx:163](../../components/ShopSettingsTab.tsx#L163) |   const [rentsChairs, setRentsChairs] = useState&lt;boolean&gt;(shop?.rentsChairs ?? false); |
| [components/ShopSettingsTab.tsx:164](../../components/ShopSettingsTab.tsx#L164) |   const [availableChairsForRent, setAvailableChairsForRent] = useState&lt;number&gt;(shop?.availableChairsForRent ?? 0); |
| [components/ShopSettingsTab.tsx:165](../../components/ShopSettingsTab.tsx#L165) |   const [savingChairRental, setSavingChairRental] = useState(false); |
| [components/ShopSettingsTab.tsx:173](../../components/ShopSettingsTab.tsx#L173) |       setErrorMsg(t('errors.invalidImageType')); |
| [components/ShopSettingsTab.tsx:195](../../components/ShopSettingsTab.tsx#L195) |         (error) =&gt; { |
| [components/ShopSettingsTab.tsx:197](../../components/ShopSettingsTab.tsx#L197) |           setErrorMsg(t('errors.uploadFailed')); |
| [components/ShopSettingsTab.tsx:198](../../components/ShopSettingsTab.tsx#L198) |           console.error("Upload Error:", error); |
| [components/ShopSettingsTab.tsx:208](../../components/ShopSettingsTab.tsx#L208) |              console.error("Database Update Error:", err); |
| [components/ShopSettingsTab.tsx:209](../../components/ShopSettingsTab.tsx#L209) |              setErrorMsg(t('errors.failedUpdatePhoto')); |
| [components/ShopSettingsTab.tsx:214](../../components/ShopSettingsTab.tsx#L214) |     } catch (error) { |
| [components/ShopSettingsTab.tsx:215](../../components/ShopSettingsTab.tsx#L215) |       console.error(error); |
| [components/ShopSettingsTab.tsx:216](../../components/ShopSettingsTab.tsx#L216) |       setErrorMsg(t('errors.imageCompressionFailed')); |
| [components/ShopSettingsTab.tsx:226](../../components/ShopSettingsTab.tsx#L226) |       setErrorMsg(t('errors.invalidImageType')); |
| [components/ShopSettingsTab.tsx:247](../../components/ShopSettingsTab.tsx#L247) |         (error) =&gt; { |
| [components/ShopSettingsTab.tsx:249](../../components/ShopSettingsTab.tsx#L249) |           setErrorMsg(t('errors.uploadFailed')); |
| [components/ShopSettingsTab.tsx:250](../../components/ShopSettingsTab.tsx#L250) |           console.error("Logo Upload Error:", error); |
| [components/ShopSettingsTab.tsx:260](../../components/ShopSettingsTab.tsx#L260) |             console.error("Logo DB Update Error:", err); |
| [components/ShopSettingsTab.tsx:261](../../components/ShopSettingsTab.tsx#L261) |             setErrorMsg(t('errors.failedUpdatePhoto')); |
| [components/ShopSettingsTab.tsx:266](../../components/ShopSettingsTab.tsx#L266) |     } catch (error) { |
| [components/ShopSettingsTab.tsx:267](../../components/ShopSettingsTab.tsx#L267) |       console.error(error); |
| [components/ShopSettingsTab.tsx:268](../../components/ShopSettingsTab.tsx#L268) |       setErrorMsg(t('errors.imageCompressionFailed')); |
| [components/ShopSettingsTab.tsx:302](../../components/ShopSettingsTab.tsx#L302) |       setErrorMsg(t('errors.fillRequiredFields')); |
| [components/ShopSettingsTab.tsx:334](../../components/ShopSettingsTab.tsx#L334) |       console.error(e); |
| [components/ShopSettingsTab.tsx:335](../../components/ShopSettingsTab.tsx#L335) |       setErrorMsg(t('errors.failedSaveShopInfo')); |
| [components/ShopSettingsTab.tsx:354](../../components/ShopSettingsTab.tsx#L354) |       console.error(e); |
| [components/ShopSettingsTab.tsx:355](../../components/ShopSettingsTab.tsx#L355) |       setErrorMsg(t('errors.failedSaveSocialLinks')); |
| [components/ShopSettingsTab.tsx:369](../../components/ShopSettingsTab.tsx#L369) |       console.error(e); |
| [components/ShopSettingsTab.tsx:370](../../components/ShopSettingsTab.tsx#L370) |       setErrorMsg(t('errors.failedSaveMapsLink')); |
| [components/ShopSettingsTab.tsx:391](../../components/ShopSettingsTab.tsx#L391) |       console.error(e); |
| [components/ShopSettingsTab.tsx:404](../../components/ShopSettingsTab.tsx#L404) |       console.error(e); |
| [components/ShopSettingsTab.tsx:409](../../components/ShopSettingsTab.tsx#L409) |     if(!confirm(t('errors.deleteShopConfirm'))) return; |
| [components/ShopSettingsTab.tsx:508](../../components/ShopSettingsTab.tsx#L508) |       console.error(e); |
| [components/ShopSettingsTab.tsx:509](../../components/ShopSettingsTab.tsx#L509) |       setErrorMsg(t('errors.deleteShopFailed')); |
| [components/ShopSettingsTab.tsx:522](../../components/ShopSettingsTab.tsx#L522) |       {errorMsg && ( |
| [components/ShopSettingsTab.tsx:524](../../components/ShopSettingsTab.tsx#L524) |           {errorMsg} |
| [components/ShopSettingsTab.tsx:549](../../components/ShopSettingsTab.tsx#L549) |                 {logoLoading ? t('settings.uploading') : t('settings.uploadLogo')} |
| [components/ShopSettingsTab.tsx:555](../../components/ShopSettingsTab.tsx#L555) |                   disabled={logoLoading} |
| [components/ShopSettingsTab.tsx:587](../../components/ShopSettingsTab.tsx#L587) |             {photoLoading ? t('settings.uploading') : t('settings.uploadCover')} |
| [components/ShopSettingsTab.tsx:593](../../components/ShopSettingsTab.tsx#L593) |               disabled={photoLoading} |
| [components/ShopSettingsTab.tsx:632](../../components/ShopSettingsTab.tsx#L632) |                 placeholder="Code" |
| [components/ShopSettingsTab.tsx:642](../../components/ShopSettingsTab.tsx#L642) |                 className="w-full bg-[#141414] border-[1.5px] border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors focus:border-brand-yellow placeholder:text-[#444] h-[48px]" |
| [components/ShopSettingsTab.tsx:643](../../components/ShopSettingsTab.tsx#L643) |                 placeholder="600 000 000"  |
| [components/ShopSettingsTab.tsx:661](../../components/ShopSettingsTab.tsx#L661) |               placeholder="Country..." |
| [components/ShopSettingsTab.tsx:682](../../components/ShopSettingsTab.tsx#L682) |               placeholder="Region..." |
| [components/ShopSettingsTab.tsx:699](../../components/ShopSettingsTab.tsx#L699) |               placeholder="City..." |
| [components/ShopSettingsTab.tsx:712](../../components/ShopSettingsTab.tsx#L712) |               placeholder="Calle Mayor" |
| [components/ShopSettingsTab.tsx:722](../../components/ShopSettingsTab.tsx#L722) |               placeholder="12" |
| [components/ShopSettingsTab.tsx:735](../../components/ShopSettingsTab.tsx#L735) |               placeholder="28013" |
| [components/ShopSettingsTab.tsx:745](../../components/ShopSettingsTab.tsx#L745) |               placeholder="2º B" |
| [components/ShopSettingsTab.tsx:760](../../components/ShopSettingsTab.tsx#L760) |               placeholder={t('forms.chairsPlaceholder')} |
| [components/ShopSettingsTab.tsx:772](../../components/ShopSettingsTab.tsx#L772) |               placeholder={t('forms.yearEstablishedPlaceholder')} |
| [components/ShopSettingsTab.tsx:784](../../components/ShopSettingsTab.tsx#L784) |             placeholder="Tell clients about your shop..." |
| [components/ShopSettingsTab.tsx:790](../../components/ShopSettingsTab.tsx#L790) |           disabled={savingGlobal} |
| [components/ShopSettingsTab.tsx:808](../../components/ShopSettingsTab.tsx#L808) |             placeholder="@your_username" |
| [components/ShopSettingsTab.tsx:819](../../components/ShopSettingsTab.tsx#L819) |             placeholder="your.profile.name" |
| [components/ShopSettingsTab.tsx:830](../../components/ShopSettingsTab.tsx#L830) |             placeholder="@your_username" |
| [components/ShopSettingsTab.tsx:836](../../components/ShopSettingsTab.tsx#L836) |           disabled={savingSocial} |
| [components/ShopSettingsTab.tsx:870](../../components/ShopSettingsTab.tsx#L870) |             placeholder="https://maps.google.com/..." |
| [components/ShopSettingsTab.tsx:875](../../components/ShopSettingsTab.tsx#L875) |           disabled={savingMaps} |
| [components/ShopSettingsTab.tsx:981](../../components/ShopSettingsTab.tsx#L981) |           disabled={savingChairRental} |
| [components/ShopSettingsTab.tsx:1032](../../components/ShopSettingsTab.tsx#L1032) |              disabled={deleting} |
| [components/ShopTeamTab.tsx:3](../../components/ShopTeamTab.tsx#L3) | import { useState, useEffect } from 'react'; |
| [components/ShopTeamTab.tsx:17](../../components/ShopTeamTab.tsx#L17) |   const [inviteCode, setInviteCode] = useState(''); |
| [components/ShopTeamTab.tsx:18](../../components/ShopTeamTab.tsx#L18) |   const [loading, setLoading] = useState(false); |
| [components/ShopTeamTab.tsx:19](../../components/ShopTeamTab.tsx#L19) |   const [errorMsg, setErrorMsg] = useState(''); |
| [components/ShopTeamTab.tsx:20](../../components/ShopTeamTab.tsx#L20) |   const [foundBarber, setFoundBarber] = useState&lt;any&gt;(null); |
| [components/ShopTeamTab.tsx:21](../../components/ShopTeamTab.tsx#L21) |   const [searchAttempts, setSearchAttempts] = useState(0); |
| [components/ShopTeamTab.tsx:22](../../components/ShopTeamTab.tsx#L22) |   const [searchBlockedUntil, setSearchBlockedUntil] = useState&lt;number \| null&gt;(null); |
| [components/ShopTeamTab.tsx:23](../../components/ShopTeamTab.tsx#L23) |   const [pendingInvites, setPendingInvites] = useState&lt;any[]&gt;([]); |
| [components/ShopTeamTab.tsx:24](../../components/ShopTeamTab.tsx#L24) |   const [activeBarbers, setActiveBarbers] = useState&lt;any[]&gt;([]); |
| [components/ShopTeamTab.tsx:25](../../components/ShopTeamTab.tsx#L25) |   const [barberUsers, setBarberUsers] = useState&lt;Record&lt;string, any&gt;&gt;({}); |
| [components/ShopTeamTab.tsx:26](../../components/ShopTeamTab.tsx#L26) |   const [barberSchedules, setBarberSchedules] = useState&lt;Record&lt;string, any&gt;&gt;({}); |
| [components/ShopTeamTab.tsx:27](../../components/ShopTeamTab.tsx#L27) |   const [removeConfirmId, setRemoveConfirmId] = useState&lt;string \| null&gt;(null); |
| [components/ShopTeamTab.tsx:28](../../components/ShopTeamTab.tsx#L28) |   const [removing, setRemoving] = useState(false); |
| [components/ShopTeamTab.tsx:95](../../components/ShopTeamTab.tsx#L95) |       toast.error(t('settings.tooManySearches').replace('{n}', String(secondsLeft))); |
| [components/ShopTeamTab.tsx:103](../../components/ShopTeamTab.tsx#L103) |       setErrorMsg(t('errors.barberCodeFormat')); |
| [components/ShopTeamTab.tsx:113](../../components/ShopTeamTab.tsx#L113) |       toast.error(t('settings.tooManySearches').replace('{n}', '300')); |
| [components/ShopTeamTab.tsx:125](../../components/ShopTeamTab.tsx#L125) |       if (snap.empty) { |
| [components/ShopTeamTab.tsx:126](../../components/ShopTeamTab.tsx#L126) |         setErrorMsg(t('errors.noBarberFound')); |
| [components/ShopTeamTab.tsx:143](../../components/ShopTeamTab.tsx#L143) |       console.error('handleSearch error:', err); |
| [components/ShopTeamTab.tsx:164](../../components/ShopTeamTab.tsx#L164) |       if (!inviteSnap.empty) { |
| [components/ShopTeamTab.tsx:165](../../components/ShopTeamTab.tsx#L165) |         setErrorMsg(t('errors.inviteAlreadySent')); |
| [components/ShopTeamTab.tsx:170](../../components/ShopTeamTab.tsx#L170) |         setErrorMsg(t('errors.barberAlreadyOnTeam')); |
| [components/ShopTeamTab.tsx:194](../../components/ShopTeamTab.tsx#L194) |       updateDoc(doc(db, 'users', foundBarber.userId), { unreadCount: increment(1) }).catch(console.error); |
| [components/ShopTeamTab.tsx:200](../../components/ShopTeamTab.tsx#L200) |       console.error(e); |
| [components/ShopTeamTab.tsx:210](../../components/ShopTeamTab.tsx#L210) |       console.error(e); |
| [components/ShopTeamTab.tsx:229](../../components/ShopTeamTab.tsx#L229) |       console.error(e); |
| [components/ShopTeamTab.tsx:230](../../components/ShopTeamTab.tsx#L230) |       toast.error(t('errors.failedRemoveBarber')); |
| [components/ShopTeamTab.tsx:267](../../components/ShopTeamTab.tsx#L267) |             placeholder="TZB-XXXXXX" |
| [components/ShopTeamTab.tsx:275](../../components/ShopTeamTab.tsx#L275) |             disabled={loading \|\| !inviteCode} |
| [components/ShopTeamTab.tsx:278](../../components/ShopTeamTab.tsx#L278) |             {loading ? '...' : t('buttons.search')} |
| [components/ShopTeamTab.tsx:282](../../components/ShopTeamTab.tsx#L282) |         {errorMsg && ( |
| [components/ShopTeamTab.tsx:284](../../components/ShopTeamTab.tsx#L284) |             {errorMsg} |
| [components/ShopTeamTab.tsx:321](../../components/ShopTeamTab.tsx#L321) |                   {t('errors.alreadyOnTeam').replace('{name}', foundBarber.name)} |
| [components/ShopTeamTab.tsx:326](../../components/ShopTeamTab.tsx#L326) |                   {t('errors.barberInAnotherShop').replace('{name}', foundBarber.name)} |
| [components/ShopTeamTab.tsx:334](../../components/ShopTeamTab.tsx#L334) |                     disabled={loading} |
| [components/ShopTeamTab.tsx:337](../../components/ShopTeamTab.tsx#L337) |                     {loading ? t('forms.sending') : t('buttons.sendInvite')} |
| [components/ShopTeamTab.tsx:355](../../components/ShopTeamTab.tsx#L355) |         &lt;div className="text-[#555] text-sm mb-8"&gt;{t('emptyStates.noPendingInvites')}&lt;/div&gt; |
| [components/ShopTeamTab.tsx:380](../../components/ShopTeamTab.tsx#L380) |         &lt;div className="text-[#555] text-sm"&gt;{t('emptyStates.noBarbers')}&lt;/div&gt; |
| [components/ShopTeamTab.tsx:448](../../components/ShopTeamTab.tsx#L448) |                         disabled={removing} |
| [components/ShopTimePicker.tsx:3](../../components/ShopTimePicker.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [components/ShopTimePicker.tsx:136](../../components/ShopTimePicker.tsx#L136) |   const [schedules, setSchedules] = useState&lt;Record&lt;string, any&gt;&gt;({}); |
| [components/ShopTimePicker.tsx:137](../../components/ShopTimePicker.tsx#L137) |   const [bookingsByBarber, setBookingsByBarber] = useState&lt;Record&lt;string, any[]&gt;&gt;({}); |
| [components/ShopTimePicker.tsx:138](../../components/ShopTimePicker.tsx#L138) |   const [loading, setLoading] = useState(true); |
| [components/ShopTimePicker.tsx:139](../../components/ShopTimePicker.tsx#L139) |   const [weekOffset, setWeekOffset] = useState(0); |
| [components/ShopTimePicker.tsx:140](../../components/ShopTimePicker.tsx#L140) |   const [activeDay, setActiveDay] = useState&lt;string&gt;(''); |
| [components/ShopTimePicker.tsx:161](../../components/ShopTimePicker.tsx#L161) |           console.error(`ShopTimePicker schedule error for ${bid}:`, err); |
| [components/ShopTimePicker.tsx:196](../../components/ShopTimePicker.tsx#L196) |         (err) =&gt; console.error(`ShopTimePicker bookings error for ${bid}:`, err) |
| [components/ShopTimePicker.tsx:289](../../components/ShopTimePicker.tsx#L289) |   if (loading) { |
| [components/ShopTimePicker.tsx:354](../../components/ShopTimePicker.tsx#L354) |           disabled={weekOffset &lt;= 0} |
| [components/ShopTimePicker.tsx:490](../../components/ShopTimePicker.tsx#L490) |                   disabled={!slot.available} |
| [components/skeletons.tsx:3](../../components/skeletons.tsx#L3) | export function BarberCardSkeleton() { |
| [components/skeletons.tsx:34](../../components/skeletons.tsx#L34) | export function BookingRowSkeleton() { |
| [components/skeletons.tsx:53](../../components/skeletons.tsx#L53) | export function StatCardSkeleton() { |
| [components/skeletons.tsx:62](../../components/skeletons.tsx#L62) | export function BarberProfileSkeleton() { |
| [components/SmartTimePicker.tsx:3](../../components/SmartTimePicker.tsx#L3) | import { useState, useEffect, useMemo } from 'react'; |
| [components/SmartTimePicker.tsx:153](../../components/SmartTimePicker.tsx#L153) |   const [schedule, setSchedule] = useState&lt;any&gt;(null); |
| [components/SmartTimePicker.tsx:154](../../components/SmartTimePicker.tsx#L154) |   const [bookings, setBookings] = useState&lt;any[]&gt;([]); |
| [components/SmartTimePicker.tsx:155](../../components/SmartTimePicker.tsx#L155) |   const [loading, setLoading] = useState(true); |
| [components/SmartTimePicker.tsx:156](../../components/SmartTimePicker.tsx#L156) |   const [weekOffset, setWeekOffset] = useState(0); |
| [components/SmartTimePicker.tsx:157](../../components/SmartTimePicker.tsx#L157) |   const [activeDay, setActiveDay] = useState&lt;string&gt;(''); |
| [components/SmartTimePicker.tsx:175](../../components/SmartTimePicker.tsx#L175) |         console.error('SmartTimePicker schedule error:', err); |
| [components/SmartTimePicker.tsx:198](../../components/SmartTimePicker.tsx#L198) |       (err) =&gt; console.error('SmartTimePicker bookings error:', err) |
| [components/SmartTimePicker.tsx:237](../../components/SmartTimePicker.tsx#L237) |   if (loading) { |
| [components/SmartTimePicker.tsx:324](../../components/SmartTimePicker.tsx#L324) |           disabled={weekOffset &lt;= 0} |
| [components/SmartTimePicker.tsx:453](../../components/SmartTimePicker.tsx#L453) |                   disabled={!slot.available} |
| [components/titiza/beauty-profile-card.tsx:3](../../components/titiza/beauty-profile-card.tsx#L3) | import { useState } from 'react' |
| [components/titiza/beauty-profile-card.tsx:108](../../components/titiza/beauty-profile-card.tsx#L108) |   const [open, setOpen] = useState(false) |
| [components/titiza/beauty-profile-card.tsx:147](../../components/titiza/beauty-profile-card.tsx#L147) |             aria-expanded={open} |
| [components/titiza/category-grid.tsx:15](../../components/titiza/category-grid.tsx#L15) | import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react' |
| [components/titiza/category-grid.tsx:62](../../components/titiza/category-grid.tsx#L62) |   const [expanded, setExpanded] = useState(false) |
| [components/titiza/category-grid.tsx:74](../../components/titiza/category-grid.tsx#L74) |   const [focusIndex, setFocusIndex] = useState(0) |
| [components/titiza/category-grid.tsx:76](../../components/titiza/category-grid.tsx#L76) |   const [cols, setCols] = useState(2) |
| [components/titiza/category-grid.tsx:148](../../components/titiza/category-grid.tsx#L148) |             aria-expanded={isMore ? expanded : undefined} |
| [components/titiza/category-grid.tsx:149](../../components/titiza/category-grid.tsx#L149) |             disabled={locked && !isSelected} |
| [components/titiza/orbit-labels.tsx:3](../../components/titiza/orbit-labels.tsx#L3) | import { useEffect, useState } from 'react' |
| [components/titiza/orbit-labels.tsx:27](../../components/titiza/orbit-labels.tsx#L27) |   const [active, setActive] = useState&lt;number \| null&gt;(null) |
| [components/titiza/path-analysis.tsx:9](../../components/titiza/path-analysis.tsx#L9) |  * (on CTA) §7.1a exit beat → no-op placeholder (Frozen Decision #6: the real |
| [components/titiza/path-analysis.tsx:13](../../components/titiza/path-analysis.tsx#L13) | import { useEffect, useRef, useState, type MutableRefObject } from 'react' |
| [components/titiza/path-analysis.tsx:30](../../components/titiza/path-analysis.tsx#L30) |   const [beat, setBeat] = useState&lt;Beat&gt;('ack') |
| [components/titiza/path-analysis.tsx:31](../../components/titiza/path-analysis.tsx#L31) |   const [exitLineShown, setExitLineShown] = useState(false) |
| [components/titiza/path-analysis.tsx:54](../../components/titiza/path-analysis.tsx#L54) |     // §7.1a exit beat, then the no-op placeholder — NOT a real/fake route. |
| [components/titiza/path-analysis.tsx:66](../../components/titiza/path-analysis.tsx#L66) |             `[Titiza Phase 2] Path A CTA "Start Your ${categoryName} Analysis" — no-op placeholder; destination tracked separately.`, |
| [components/titiza/path-direct.tsx:8](../../components/titiza/path-direct.tsx#L8) |  * Both actions are inert placeholders (Frozen Decision #6): "Explore |
| [components/titiza/path-direct.tsx:37](../../components/titiza/path-direct.tsx#L37) |       `[Titiza Phase 2] Path B "Explore Professionals" (${categoryName}) — no-op placeholder; destination tracked separately.`, |
| [components/titiza/path-direct.tsx:44](../../components/titiza/path-direct.tsx#L44) |       `[Titiza Phase 2] Path B "Notify me when this launches" (${categoryName}) — no-op placeholder; no persistence yet (Technical Notes §4).`, |
| [components/titiza/titiza-core-scene.tsx:62](../../components/titiza/titiza-core-scene.tsx#L62) |    * Held presence state (additive; default 'idle' is a no-op that preserves |
| [components/titiza/titiza-core-scene.tsx:74](../../components/titiza/titiza-core-scene.tsx#L74) |    * ring) plus a brief glow tick. `undefined` / unchanged = no-op. |
| [components/titiza/titiza-core-scene.tsx:216](../../components/titiza/titiza-core-scene.tsx#L216) |   // effect, whose dependency array is intentionally empty. |
| [components/titiza/titiza-core-scene.tsx:219](../../components/titiza/titiza-core-scene.tsx#L219) |   // Live mirrors of the additive props so the empty-dep scene effect can read |
| [components/titiza/titiza-core.tsx:22](../../components/titiza/titiza-core.tsx#L22) |   loading: () =&gt; &lt;CoreFallback /&gt;, |
| [components/titiza/titiza-core.tsx:34](../../components/titiza/titiza-core.tsx#L34) |   /** Increment-to-fire, one-shot ring pulse. Unchanged/undefined = no-op. */ |
| [components/titiza/titiza-decision-flow.tsx:16](../../components/titiza/titiza-decision-flow.tsx#L16) | import { useEffect, useRef, useState } from 'react' |
| [components/titiza/titiza-decision-flow.tsx:38](../../components/titiza/titiza-decision-flow.tsx#L38) |   const [anchored, setAnchored] = useState(false) |
| [components/titiza/titiza-decision-flow.tsx:39](../../components/titiza/titiza-decision-flow.tsx#L39) |   const [reducedMotion, setReducedMotion] = useState(false) |
| [components/titiza/titiza-decision-flow.tsx:43](../../components/titiza/titiza-decision-flow.tsx#L43) |   const [line1Shown, setLine1Shown] = useState(false) |
| [components/titiza/titiza-decision-flow.tsx:44](../../components/titiza/titiza-decision-flow.tsx#L44) |   const [seedShown, setSeedShown] = useState(false) |
| [components/titiza/titiza-decision-flow.tsx:46](../../components/titiza/titiza-decision-flow.tsx#L46) |   const [tilesShown, setTilesShown] = useState(false) |
| [components/titiza/titiza-decision-flow.tsx:47](../../components/titiza/titiza-decision-flow.tsx#L47) |   const [selectedId, setSelectedId] = useState&lt;string \| null&gt;(null) |
| [components/titiza/titiza-decision-flow.tsx:52](../../components/titiza/titiza-decision-flow.tsx#L52) |   const [stage, setStage] = useState&lt;'choosing' \| 'thinking' \| 'revealed'&gt;( |
| [components/titiza/titiza-hero.tsx:3](../../components/titiza/titiza-hero.tsx#L3) | import { useEffect, useRef, useState } from 'react' |
| [components/titiza/titiza-hero.tsx:32](../../components/titiza/titiza-hero.tsx#L32) |   const [line1Shown, setLine1Shown] = useState(!isGenesis) |
| [components/titiza/titiza-hero.tsx:33](../../components/titiza/titiza-hero.tsx#L33) |   const [line2Shown, setLine2Shown] = useState(!isGenesis && !isReturning) |
| [components/titiza/titiza-hero.tsx:34](../../components/titiza/titiza-hero.tsx#L34) |   const [ctaShown, setCtaShown] = useState(false) |
| [components/titiza-film/before-after-swap.tsx:4](../../components/titiza-film/before-after-swap.tsx#L4) |  * BeforeAfterSwap — neutral placeholder frames used for the "today's hair" |
| [components/titiza-film/before-after-swap.tsx:7](../../components/titiza-film/before-after-swap.tsx#L7) |  * No real imagery — deliberately abstract placeholder panels. |
| [components/titiza-film/chat-input-shell.tsx:20](../../components/titiza-film/chat-input-shell.tsx#L20) |   placeholder: string |
| [components/titiza-film/chat-input-shell.tsx:51](../../components/titiza-film/chat-input-shell.tsx#L51) |   placeholder, |
| [components/titiza-film/chat-input-shell.tsx:74](../../components/titiza-film/chat-input-shell.tsx#L74) |   const showChips = elapsed &lt; typeStartAt |
| [components/titiza-film/chat-input-shell.tsx:115](../../components/titiza-film/chat-input-shell.tsx#L115) |       {showChips && ( |
| [components/titiza-film/chat-input-shell.tsx:139](../../components/titiza-film/chat-input-shell.tsx#L139) |           {typing ? typedText : placeholder} |
| [components/titiza-film/content.ts:29](../../components/titiza-film/content.ts#L29) |   s2b: { placeholder: string; chips: string[]; query: string; reply: string[] } |
| [components/titiza-film/content.ts:54](../../components/titiza-film/content.ts#L54) |     placeholder: 'What would you like to improve today?', |
| [components/titiza-film/content.ts:160](../../components/titiza-film/content.ts#L160) |     placeholder: '¿Qué te gustaría mejorar hoy?', |
| [components/titiza-film/film-sequencer.tsx:20](../../components/titiza-film/film-sequencer.tsx#L20) | import { useEffect, useMemo, useState } from 'react' |
| [components/titiza-film/film-sequencer.tsx:89](../../components/titiza-film/film-sequencer.tsx#L89) |       placeholder: string |
| [components/titiza-film/film-sequencer.tsx:198](../../components/titiza-film/film-sequencer.tsx#L198) |         placeholder: c.s2b.placeholder, |
| [components/titiza-film/film-sequencer.tsx:484](../../components/titiza-film/film-sequencer.tsx#L484) |   const [elapsed, setElapsed] = useState(0) |
| [components/titiza-film/film-sequencer.tsx:653](../../components/titiza-film/film-sequencer.tsx#L653) |       {/* Lower content stack — dialogue, checklists, cards, placeholders. */} |
| [components/titiza-film/film-sequencer.tsx:699](../../components/titiza-film/film-sequencer.tsx#L699) |                   placeholder={v.placeholder} |
| [components/TopNav.tsx:3](../../components/TopNav.tsx#L3) | import { useState, useEffect, useRef } from 'react'; |
| [components/TopNav.tsx:17](../../components/TopNav.tsx#L17) |   const [menuOpen, setMenuOpen] = useState(false); |
| [components/TopNav.tsx:18](../../components/TopNav.tsx#L18) |   const [showLangMenu, setShowLangMenu] = useState(false); |
| [components/TopNav.tsx:32](../../components/TopNav.tsx#L32) |   // Close drawer on route change |
| [components/TopNav.tsx:48](../../components/TopNav.tsx#L48) |   // Lock body scroll when drawer is open |
| [components/TopNav.tsx:115](../../components/TopNav.tsx#L115) |                 background: showLangMenu |
| [components/TopNav.tsx:118](../../components/TopNav.tsx#L118) |                 border: showLangMenu |
| [components/TopNav.tsx:122](../../components/TopNav.tsx#L122) |                 boxShadow: showLangMenu |
| [components/TopNav.tsx:140](../../components/TopNav.tsx#L140) |                 color: showLangMenu ? '#F5C518' : '#aaa', |
| [components/TopNav.tsx:153](../../components/TopNav.tsx#L153) |                   stroke: showLangMenu ? '#F5C518' : '#444', |
| [components/TopNav.tsx:157](../../components/TopNav.tsx#L157) |                   transform: showLangMenu |
| [components/TopNav.tsx:167](../../components/TopNav.tsx#L167) |             {showLangMenu && ( |
| [components/VerifyEmailGate.tsx:3](../../components/VerifyEmailGate.tsx#L3) | import { useState, useEffect, useRef } from 'react'; |
| [components/VerifyEmailGate.tsx:29](../../components/VerifyEmailGate.tsx#L29) |   const [cooldown, setCooldown] = useState(0); |
| [components/VerifyEmailGate.tsx:30](../../components/VerifyEmailGate.tsx#L30) |   const [resendError, setResendError] = useState(''); |
| [components/VerifyEmailGate.tsx:31](../../components/VerifyEmailGate.tsx#L31) |   const [resendOk, setResendOk] = useState(false); |
| [components/VerifyEmailGate.tsx:172](../../components/VerifyEmailGate.tsx#L172) |               disabled={cooldown &gt; 0} |
| [functions/src/index.ts:181](../../functions/src/index.ts#L181) |       if (fakeQuery.empty) { |
| [functions/src/index.ts:190](../../functions/src/index.ts#L190) |       if (!fakeQuery.empty) { |
| [functions/src/index.ts:349](../../functions/src/index.ts#L349) |     // returns empty and this block is a no-op. |
| [functions/src/index.ts:358](../../functions/src/index.ts#L358) |     if (!activeBookings.empty) { |
| [functions/src/index.ts:531](../../functions/src/index.ts#L531) |       console.error( |
| [functions/src/index.ts:547](../../functions/src/index.ts#L547) |       console.error(`Unknown challenge vote type: ${type}`); |
| [hooks/use-mobile.ts:6](../../hooks/use-mobile.ts#L6) |   const [isMobile, setIsMobile] = React.useState&lt;boolean \| undefined&gt;(undefined) |
| [hooks/useChallengeConfig.ts:15](../../hooks/useChallengeConfig.ts#L15) |   showHomepageBox: boolean |
| [hooks/useChallengeConfig.ts:39](../../hooks/useChallengeConfig.ts#L39) |           showHomepageBox: true, |
| [hooks/useChallengeConfig.ts:58](../../hooks/useChallengeConfig.ts#L58) |         showHomepageBox: d.showHomepageBox ?? true, |
| [hooks/useDebounce.ts:1](../../hooks/useDebounce.ts#L1) | import { useState, useEffect } from 'react'; |
| [hooks/useDebounce.ts:4](../../hooks/useDebounce.ts#L4) |   const [debouncedValue, setDebouncedValue] = useState&lt;T&gt;(value); |
| [hooks/useShowFakeUIData.ts:9](../../hooks/useShowFakeUIData.ts#L9) |     queryKey: ['siteConfig_showFakeUIData'], |
| [hooks/useShowFakeUIData.ts:13](../../hooks/useShowFakeUIData.ts#L13) |       const val = (snap.data() as { showFakeUIData?: boolean }).showFakeUIData; |
| [lib/auth-context.tsx:3](../../lib/auth-context.tsx#L3) | import React, { createContext, useContext, useEffect, useState } from 'react'; |
| [lib/auth-context.tsx:58](../../lib/auth-context.tsx#L58) |   loading: boolean; |
| [lib/auth-context.tsx:59](../../lib/auth-context.tsx#L59) |   /** Alias for loading — true until Firebase Auth confirms identity */ |
| [lib/auth-context.tsx:68](../../lib/auth-context.tsx#L68) |   loading: true, |
| [lib/auth-context.tsx:75](../../lib/auth-context.tsx#L75) |   const [user, setUser] = useState&lt;FirebaseUser \| null&gt;(null); |
| [lib/auth-context.tsx:76](../../lib/auth-context.tsx#L76) |   const [appUser, setAppUser] = useState&lt;AppUser \| null&gt;(null); |
| [lib/auth-context.tsx:77](../../lib/auth-context.tsx#L77) |   const [loading, setLoading] = useState(true); |
| [lib/auth-context.tsx:87](../../lib/auth-context.tsx#L87) |       } catch (error) { |
| [lib/auth-context.tsx:88](../../lib/auth-context.tsx#L88) |         console.error("Error refreshing user", error); |
| [lib/auth-context.tsx:103](../../lib/auth-context.tsx#L103) |             console.warn('User document not found, retrying in 1s...'); |
| [lib/auth-context.tsx:121](../../lib/auth-context.tsx#L121) |                   console.error("Failed to heal profile", e); |
| [lib/auth-context.tsx:148](../../lib/auth-context.tsx#L148) |                     console.error("Failed to heal phone/city/country from professionalProfile", e); |
| [lib/auth-context.tsx:156](../../lib/auth-context.tsx#L156) |             console.warn('User document not found in Firestore after retry'); |
| [lib/auth-context.tsx:168](../../lib/auth-context.tsx#L168) |         } catch (error) { |
| [lib/auth-context.tsx:169](../../lib/auth-context.tsx#L169) |           console.error("Error fetching user role", error); |
| [lib/auth-context.tsx:176](../../lib/auth-context.tsx#L176) |     }, (error) =&gt; { |
| [lib/auth-context.tsx:177](../../lib/auth-context.tsx#L177) |       console.error(error); |
| [lib/auth-context.tsx:189](../../lib/auth-context.tsx#L189) |     &lt;AuthContext.Provider value={{ user, appUser, loading, authLoading: loading, logout, refreshUser }}&gt; |
| [lib/booking-lock-utils.ts:32](../../lib/booking-lock-utils.ts#L32) |     console.error('Failed to clean booking lock:', e); |
| [lib/delete-account.ts:10](../../lib/delete-account.ts#L10) | //   * Firebase Auth is deleted LAST so a `requires-recent-login` error |
| [lib/delete-account.ts:311](../../lib/delete-account.ts#L311) |   // 8. Delete schedule (no-op if absent — batch.delete on a non-existent doc |
| [lib/delete-account.ts:445](../../lib/delete-account.ts#L445) |   //    inside deleteBarberAccount is a no-op because the shop no longer |
| [lib/firebase-helpers.ts:3](../../lib/firebase-helpers.ts#L3) | function getFirestoreErrorMessage(error: any): string { |
| [lib/firebase-helpers.ts:4](../../lib/firebase-helpers.ts#L4) |   switch (error?.code) { |
| [lib/firebase-helpers.ts:16](../../lib/firebase-helpers.ts#L16) |       return 'Network error. Check your connection.'; |
| [lib/firebase-helpers.ts:31](../../lib/firebase-helpers.ts#L31) |     errorMessage?: string; |
| [lib/firebase-helpers.ts:42](../../lib/firebase-helpers.ts#L42) |     } catch (error: any) { |
| [lib/firebase-helpers.ts:43](../../lib/firebase-helpers.ts#L43) |       const isRetryable = RETRYABLE_CODES.includes(error?.code); |
| [lib/firebase-helpers.ts:47](../../lib/firebase-helpers.ts#L47) |         const message = options?.errorMessage ?? getFirestoreErrorMessage(error); |
| [lib/firebase-helpers.ts:48](../../lib/firebase-helpers.ts#L48) |         toast.error(message); |
| [lib/firebase-helpers.ts:49](../../lib/firebase-helpers.ts#L49) |         console.error('Firestore write failed after retries:', error); |
| [lib/firebase-helpers.ts:63](../../lib/firebase-helpers.ts#L63) |     errorMessage?: string; |
| [lib/firebase-helpers.ts:65](../../lib/firebase-helpers.ts#L65) |     loadingToastId?: string; |
| [lib/firebase-helpers.ts:71](../../lib/firebase-helpers.ts#L71) |       if (options.loadingToastId) { |
| [lib/firebase-helpers.ts:72](../../lib/firebase-helpers.ts#L72) |         toast.success(options.successMessage, { id: options.loadingToastId }); |
| [lib/firebase-helpers.ts:78](../../lib/firebase-helpers.ts#L78) |   } catch (error: any) { |
| [lib/firebase-helpers.ts:79](../../lib/firebase-helpers.ts#L79) |     const message = options?.errorMessage ?? getFirestoreErrorMessage(error); |
| [lib/firebase-helpers.ts:81](../../lib/firebase-helpers.ts#L81) |       if (options?.loadingToastId) { |
| [lib/firebase-helpers.ts:82](../../lib/firebase-helpers.ts#L82) |         toast.error(message, { id: options.loadingToastId }); |
| [lib/firebase-helpers.ts:84](../../lib/firebase-helpers.ts#L84) |         toast.error(message); |
| [lib/firebase-helpers.ts:87](../../lib/firebase-helpers.ts#L87) |     console.error('Firestore error:', { |
| [lib/firebase-helpers.ts:88](../../lib/firebase-helpers.ts#L88) |       code: error?.code, |
| [lib/firebase-helpers.ts:89](../../lib/firebase-helpers.ts#L89) |       message: error?.message, |
| [lib/i18n/LangContext.tsx:3](../../lib/i18n/LangContext.tsx#L3) | import React, { createContext, useContext, useState } from 'react'; |
| [lib/i18n/LangContext.tsx:31](../../lib/i18n/LangContext.tsx#L31) |   const [lang, setLangState] = useState&lt;Language&gt;(() =&gt; { |
| [lib/i18n/translations.ts:346](../../lib/i18n/translations.ts#L346) |       appComingSoon: 'iOS & Android app coming soon', |
| [lib/i18n/translations.ts:388](../../lib/i18n/translations.ts#L388) |       chairSub: 'Independent barbers rent your chair. We send them clients. Your chair is never empty.', |
| [lib/i18n/translations.ts:564](../../lib/i18n/translations.ts#L564) |       errorGeneric: 'Something went wrong. Please try again.', |
| [lib/i18n/translations.ts:758](../../lib/i18n/translations.ts#L758) |     errors: { |
| [lib/i18n/translations.ts:762](../../lib/i18n/translations.ts#L762) |       connectionError: 'Connection error. Check your internet and try again.', |
| [lib/i18n/translations.ts:1009](../../lib/i18n/translations.ts#L1009) |         votingComingSoon: 'Voting opens soon — stay tuned 👀', |
| [lib/i18n/translations.ts:1020](../../lib/i18n/translations.ts#L1020) |         loading: 'Loading…', |
| [lib/i18n/translations.ts:1049](../../lib/i18n/translations.ts#L1049) |         emptyBarbers: 'No barber submissions yet.', |
| [lib/i18n/translations.ts:1050](../../lib/i18n/translations.ts#L1050) |         emptyShops: 'No barbershop submissions yet.', |
| [lib/i18n/translations.ts:1193](../../lib/i18n/translations.ts#L1193) |         loading: 'Loading…', |
| [lib/i18n/translations.ts:1225](../../lib/i18n/translations.ts#L1225) |         uploading: 'Uploading…', |
| [lib/i18n/translations.ts:1240](../../lib/i18n/translations.ts#L1240) |         showLess: 'Show less', |
| [lib/i18n/translations.ts:1285](../../lib/i18n/translations.ts#L1285) |         errRefEmpty: 'Reference cannot be empty.', |
| [lib/i18n/translations.ts:1286](../../lib/i18n/translations.ts#L1286) |         errNotFound: 'Submission not found. Please refresh.', |
| [lib/i18n/translations.ts:1326](../../lib/i18n/translations.ts#L1326) |     modals: { |
| [lib/i18n/translations.ts:1330](../../lib/i18n/translations.ts#L1330) |       errorTitle: 'Something went wrong here', |
| [lib/i18n/translations.ts:1357](../../lib/i18n/translations.ts#L1357) |     emptyStates: { |
| [lib/i18n/translations.ts:1374](../../lib/i18n/translations.ts#L1374) |       portfolioComingSoon: "We're working on the best way to host your portfolio. This feature will be available very soon.", |
| [lib/i18n/translations.ts:1376](../../lib/i18n/translations.ts#L1376) |       shopPhotosComingSoon: "We're building the best way to showcase your shop.", |
| [lib/i18n/translations.ts:1406](../../lib/i18n/translations.ts#L1406) |       loading: 'Loading...', |
| [lib/i18n/translations.ts:1450](../../lib/i18n/translations.ts#L1450) |       loadingCalendar: 'Loading calendar...', |
| [lib/i18n/translations.ts:1489](../../lib/i18n/translations.ts#L1489) |       loadingShop: 'Loading shop...', |
| [lib/i18n/translations.ts:1490](../../lib/i18n/translations.ts#L1490) |       shopNotFound: 'Shop not found', |
| [lib/i18n/translations.ts:1518](../../lib/i18n/translations.ts#L1518) |       barberNotFound: 'Barber not found', |
| [lib/i18n/translations.ts:1570](../../lib/i18n/translations.ts#L1570) |       showLess: 'Show less', |
| [lib/i18n/translations.ts:1596](../../lib/i18n/translations.ts#L1596) |       shopNotFound: 'Shop not found', |
| [lib/i18n/translations.ts:1666](../../lib/i18n/translations.ts#L1666) |       showRate: 'Show rate', |
| [lib/i18n/translations.ts:1682](../../lib/i18n/translations.ts#L1682) |       blockTimeOffModal: 'Block time off', |
| [lib/i18n/translations.ts:1683](../../lib/i18n/translations.ts#L1683) |       blockTimeOffModalDesc: 'Clients cannot book you on blocked days.', |
| [lib/i18n/translations.ts:1803](../../lib/i18n/translations.ts#L1803) |       uploading: 'Uploading...', |
| [lib/i18n/translations.ts:1815](../../lib/i18n/translations.ts#L1815) |       showPhone: 'Show my phone number on my public profile', |
| [lib/i18n/translations.ts:1816](../../lib/i18n/translations.ts#L1816) |       showPhoneDesc: "When off, clients won't see your phone on your profile page.", |
| [lib/i18n/translations.ts:1849](../../lib/i18n/translations.ts#L1849) |       uploadingPhoto: 'Uploading photo...', |
| [lib/i18n/translations.ts:1923](../../lib/i18n/translations.ts#L1923) |       subscriptionComingSoon: 'Subscription management coming soon.', |
| [lib/i18n/translations.ts:1928](../../lib/i18n/translations.ts#L1928) |       photosComingSoonDesc: "We're building the best way to showcase your shop.", |
| [lib/i18n/translations.ts:1936](../../lib/i18n/translations.ts#L1936) |       videosComingSoonDesc: 'Action shots are great for engagement. Coming soon.', |
| [lib/i18n/translations.ts:1981](../../lib/i18n/translations.ts#L1981) |       loadingReviews: 'Loading reviews...', |
| [lib/i18n/translations.ts:2425](../../lib/i18n/translations.ts#L2425) |       appComingSoon: 'Application iOS & Android bientôt disponible', |
| [lib/i18n/translations.ts:2643](../../lib/i18n/translations.ts#L2643) |       errorGeneric: 'Une erreur est survenue. Veuillez réessayer.', |
| [lib/i18n/translations.ts:2837](../../lib/i18n/translations.ts#L2837) |     errors: { |
| [lib/i18n/translations.ts:3088](../../lib/i18n/translations.ts#L3088) |         votingComingSoon: 'Le vote ouvre bientôt — restez connectés 👀', |
| [lib/i18n/translations.ts:3099](../../lib/i18n/translations.ts#L3099) |         loading: 'Chargement…', |
| [lib/i18n/translations.ts:3128](../../lib/i18n/translations.ts#L3128) |         emptyBarbers: 'Aucune candidature de barbier pour l\'instant.', |
| [lib/i18n/translations.ts:3129](../../lib/i18n/translations.ts#L3129) |         emptyShops: 'Aucune candidature de barbershop pour l\'instant.', |
| [lib/i18n/translations.ts:3272](../../lib/i18n/translations.ts#L3272) |         loading: 'Chargement…', |
| [lib/i18n/translations.ts:3304](../../lib/i18n/translations.ts#L3304) |         uploading: 'Envoi en cours…', |
| [lib/i18n/translations.ts:3319](../../lib/i18n/translations.ts#L3319) |         showLess: 'Voir moins', |
| [lib/i18n/translations.ts:3405](../../lib/i18n/translations.ts#L3405) |     modals: { |
| [lib/i18n/translations.ts:3409](../../lib/i18n/translations.ts#L3409) |       errorTitle: 'Une erreur s\'est produite ici', |
| [lib/i18n/translations.ts:3436](../../lib/i18n/translations.ts#L3436) |     emptyStates: { |
| [lib/i18n/translations.ts:3453](../../lib/i18n/translations.ts#L3453) |       portfolioComingSoon: 'Nous travaillons sur la meilleure façon d\'héberger votre portfolio. Cette fonctionnalité sera disponible très bientôt.', |
| [lib/i18n/translations.ts:3455](../../lib/i18n/translations.ts#L3455) |       shopPhotosComingSoon: 'Nous construisons la meilleure façon de présenter votre salon.', |
| [lib/i18n/translations.ts:3485](../../lib/i18n/translations.ts#L3485) |       loading: 'Chargement...', |
| [lib/i18n/translations.ts:3529](../../lib/i18n/translations.ts#L3529) |       loadingCalendar: 'Chargement du calendrier...', |
| [lib/i18n/translations.ts:3568](../../lib/i18n/translations.ts#L3568) |       loadingShop: 'Chargement du salon...', |
| [lib/i18n/translations.ts:3649](../../lib/i18n/translations.ts#L3649) |       showLess: 'Voir moins', |
| [lib/i18n/translations.ts:3745](../../lib/i18n/translations.ts#L3745) |       showRate: 'Taux de présence', |
| [lib/i18n/translations.ts:3761](../../lib/i18n/translations.ts#L3761) |       blockTimeOffModal: 'Bloquer du temps', |
| [lib/i18n/translations.ts:3762](../../lib/i18n/translations.ts#L3762) |       blockTimeOffModalDesc: 'Les clients ne peuvent pas vous réserver les jours bloqués.', |
| [lib/i18n/translations.ts:3882](../../lib/i18n/translations.ts#L3882) |       uploading: 'Chargement...', |
| [lib/i18n/translations.ts:3894](../../lib/i18n/translations.ts#L3894) |       showPhone: 'Afficher mon numéro sur mon profil public', |
| [lib/i18n/translations.ts:3895](../../lib/i18n/translations.ts#L3895) |       showPhoneDesc: 'Quand désactivé, les clients ne verront pas votre numéro sur votre profil.', |
| [lib/i18n/translations.ts:3928](../../lib/i18n/translations.ts#L3928) |       uploadingPhoto: 'Téléchargement de la photo...', |
| [lib/i18n/translations.ts:4002](../../lib/i18n/translations.ts#L4002) |       subscriptionComingSoon: 'La gestion des abonnements arrive bientôt.', |
| [lib/i18n/translations.ts:4007](../../lib/i18n/translations.ts#L4007) |       photosComingSoonDesc: 'Nous construisons la meilleure façon de présenter votre salon.', |
| [lib/i18n/translations.ts:4015](../../lib/i18n/translations.ts#L4015) |       videosComingSoonDesc: 'Les vidéos en action sont parfaites pour l\'engagement. Bientôt disponible.', |
| [lib/i18n/translations.ts:4060](../../lib/i18n/translations.ts#L4060) |       loadingReviews: 'Chargement des avis...', |
| [lib/i18n/translations.ts:4504](../../lib/i18n/translations.ts#L4504) |       appComingSoon: 'App iOS y Android próximamente', |
| [lib/i18n/translations.ts:4711](../../lib/i18n/translations.ts#L4711) |       subjectBug: 'Reportar un error', |
| [lib/i18n/translations.ts:4722](../../lib/i18n/translations.ts#L4722) |       errorGeneric: 'Algo salió mal. Por favor, inténtalo de nuevo.', |
| [lib/i18n/translations.ts:4916](../../lib/i18n/translations.ts#L4916) |     errors: { |
| [lib/i18n/translations.ts:5167](../../lib/i18n/translations.ts#L5167) |         votingComingSoon: 'La votación abre pronto — ¡estate atento! 👀', |
| [lib/i18n/translations.ts:5178](../../lib/i18n/translations.ts#L5178) |         loading: 'Cargando…', |
| [lib/i18n/translations.ts:5207](../../lib/i18n/translations.ts#L5207) |         emptyBarbers: 'Aún no hay candidaturas de barberos.', |
| [lib/i18n/translations.ts:5208](../../lib/i18n/translations.ts#L5208) |         emptyShops: 'Aún no hay candidaturas de barberías.', |
| [lib/i18n/translations.ts:5351](../../lib/i18n/translations.ts#L5351) |         loading: 'Cargando…', |
| [lib/i18n/translations.ts:5383](../../lib/i18n/translations.ts#L5383) |         uploading: 'Subiendo…', |
| [lib/i18n/translations.ts:5398](../../lib/i18n/translations.ts#L5398) |         showLess: 'Ver menos', |
| [lib/i18n/translations.ts:5484](../../lib/i18n/translations.ts#L5484) |     modals: { |
| [lib/i18n/translations.ts:5488](../../lib/i18n/translations.ts#L5488) |       errorTitle: 'Algo salió mal aquí', |
| [lib/i18n/translations.ts:5515](../../lib/i18n/translations.ts#L5515) |     emptyStates: { |
| [lib/i18n/translations.ts:5532](../../lib/i18n/translations.ts#L5532) |       portfolioComingSoon: 'Estamos trabajando en la mejor manera de alojar tu portfolio. Esta función estará disponible muy pronto.', |
| [lib/i18n/translations.ts:5534](../../lib/i18n/translations.ts#L5534) |       shopPhotosComingSoon: 'Estamos creando la mejor manera de mostrar tu barbería.', |
| [lib/i18n/translations.ts:5564](../../lib/i18n/translations.ts#L5564) |       loading: 'Cargando...', |
| [lib/i18n/translations.ts:5608](../../lib/i18n/translations.ts#L5608) |       loadingCalendar: 'Cargando el calendario...', |
| [lib/i18n/translations.ts:5647](../../lib/i18n/translations.ts#L5647) |       loadingShop: 'Cargando el local...', |
| [lib/i18n/translations.ts:5728](../../lib/i18n/translations.ts#L5728) |       showLess: 'Ver menos', |
| [lib/i18n/translations.ts:5824](../../lib/i18n/translations.ts#L5824) |       showRate: 'Tasa de asistencia', |
| [lib/i18n/translations.ts:5840](../../lib/i18n/translations.ts#L5840) |       blockTimeOffModal: 'Bloquear tiempo libre', |
| [lib/i18n/translations.ts:5841](../../lib/i18n/translations.ts#L5841) |       blockTimeOffModalDesc: 'Los clientes no pueden reservarte en los días bloqueados.', |
| [lib/i18n/translations.ts:5961](../../lib/i18n/translations.ts#L5961) |       uploading: 'Subiendo...', |
| [lib/i18n/translations.ts:5973](../../lib/i18n/translations.ts#L5973) |       showPhone: 'Mostrar mi número en mi perfil público', |
| [lib/i18n/translations.ts:5974](../../lib/i18n/translations.ts#L5974) |       showPhoneDesc: 'Cuando está desactivado, los clientes no verán tu número en tu perfil.', |
| [lib/i18n/translations.ts:6007](../../lib/i18n/translations.ts#L6007) |       uploadingPhoto: 'Subiendo foto...', |
| [lib/i18n/translations.ts:6081](../../lib/i18n/translations.ts#L6081) |       subscriptionComingSoon: 'La gestión de suscripciones llegará pronto.', |
| [lib/i18n/translations.ts:6086](../../lib/i18n/translations.ts#L6086) |       photosComingSoonDesc: 'Estamos construyendo la mejor manera de mostrar tu local.', |
| [lib/i18n/translations.ts:6094](../../lib/i18n/translations.ts#L6094) |       videosComingSoonDesc: 'Las tomas en acción son geniales para el engagement. Próximamente.', |
| [lib/i18n/translations.ts:6139](../../lib/i18n/translations.ts#L6139) |       loadingReviews: 'Cargando reseñas...', |
| [lib/languages.ts:37](../../lib/languages.ts#L37) |     console.error('iso-639-1 load failed:', e); |
| [lib/languages.ts:57](../../lib/languages.ts#L57) |     console.error('Language options failed:', e); |
| [lib/schemas.ts:56](../../lib/schemas.ts#L56) |   showPhone: z.boolean().optional(), |
| [lib/schemas.ts:273](../../lib/schemas.ts#L273) |   showHomepageBox: z.boolean().optional(), |
| [lib/titiza-utils.ts:68](../../lib/titiza-utils.ts#L68) |   } catch (error) { |
| [lib/titiza-utils.ts:71](../../lib/titiza-utils.ts#L71) |     console.error('markTitizaMet failed:', error); |
| [lib/titiza-utils.ts:85](../../lib/titiza-utils.ts#L85) |   } catch (error) { |
| [lib/titiza-utils.ts:86](../../lib/titiza-utils.ts#L86) |     console.error('touchTitizaVisit failed:', error); |
| [lib/toast.ts:20](../../lib/toast.ts#L20) |   error: (message: string, options?: { id?: string }) =&gt; |
| [lib/toast.ts:21](../../lib/toast.ts#L21) |     hotToast.error(message, { |
| [lib/toast.ts:36](../../lib/toast.ts#L36) |   loading: (message: string, options?: { id?: string }) =&gt; |
| [lib/toast.ts:37](../../lib/toast.ts#L37) |     hotToast.loading(message, { |
| [lib/types.ts:32](../../lib/types.ts#L32) |   showPhone?: boolean; |
| [lib/types.ts:288](../../lib/types.ts#L288) |   showHomepageBox?: boolean; |
