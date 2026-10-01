# Data and routing

Exact source occurrences; comments may disagree with behavior. Static occurrences do not prove runtime reachability. Values are not normalized.

| Source | Exact source |
|---|---|
| [app/about/page.tsx:229](../../app/about/page.tsx#L229) |           &lt;a href="/barbers" style={{ |
| [app/about/page.tsx:241](../../app/about/page.tsx#L241) |           &lt;a href="/onboarding/professional" style={{ |
| [app/admin/(protected)/barbers/page.tsx:24](../../app/admin/(protected)/barbers/page.tsx#L24) |   isLive: boolean; |
| [app/admin/(protected)/barbers/page.tsx:64](../../app/admin/(protected)/barbers/page.tsx#L64) | function StatusBadge({ status, isLive }: { status: string; isLive: boolean }) { |
| [app/admin/(protected)/barbers/page.tsx:71](../../app/admin/(protected)/barbers/page.tsx#L71) |   if (status === 'approved' && isLive) |
| [app/admin/(protected)/barbers/page.tsx:77](../../app/admin/(protected)/barbers/page.tsx#L77) |   if (status === 'approved' && !isLive) |
| [app/admin/(protected)/barbers/page.tsx:130](../../app/admin/(protected)/barbers/page.tsx#L130) |         const snap = await getDocs(collection(db, 'professionalProfiles')); |
| [app/admin/(protected)/barbers/page.tsx:138](../../app/admin/(protected)/barbers/page.tsx#L138) |               const userSnap = await getDoc(doc(db, 'users', profileDoc.id)); |
| [app/admin/(protected)/barbers/page.tsx:150](../../app/admin/(protected)/barbers/page.tsx#L150) |               // Fall back based on isLive for barbers created before approvalStatus was added |
| [app/admin/(protected)/barbers/page.tsx:151](../../app/admin/(protected)/barbers/page.tsx#L151) |               approvalStatus: (data.approvalStatus as string) \|\| (data.isLive ? 'approved' : 'pending'), |
| [app/admin/(protected)/barbers/page.tsx:152](../../app/admin/(protected)/barbers/page.tsx#L152) |               isLive: Boolean(data.isLive), |
| [app/admin/(protected)/barbers/page.tsx:175](../../app/admin/(protected)/barbers/page.tsx#L175) |           live: enriched.filter((b) =&gt; b.isLive).length, |
| [app/admin/(protected)/barbers/page.tsx:198](../../app/admin/(protected)/barbers/page.tsx#L198) |     else if (tab === 'live') list = list.filter((b) =&gt; b.isLive); |
| [app/admin/(protected)/barbers/page.tsx:234](../../app/admin/(protected)/barbers/page.tsx#L234) |     router.replace(`/admin/barbers?tab=${t}`, { scroll: false }); |
| [app/admin/(protected)/barbers/page.tsx:313](../../app/admin/(protected)/barbers/page.tsx#L313) |               onClick={() =&gt; router.push(`/admin/barbers/${barber.id}`)} |
| [app/admin/(protected)/barbers/page.tsx:396](../../app/admin/(protected)/barbers/page.tsx#L396) |                   isLive={barber.isLive} |
| [app/admin/(protected)/barbers/page.tsx:402](../../app/admin/(protected)/barbers/page.tsx#L402) |                 href={`/admin/barbers/${barber.id}`} |
| [app/admin/(protected)/barbers/[id]/page.tsx:31](../../app/admin/(protected)/barbers/[id]/page.tsx#L31) |   isLive?: boolean; |
| [app/admin/(protected)/barbers/[id]/page.tsx:79](../../app/admin/(protected)/barbers/[id]/page.tsx#L79) | function StatusBadge({ status, isLive }: { status?: string; isLive?: boolean }) { |
| [app/admin/(protected)/barbers/[id]/page.tsx:87](../../app/admin/(protected)/barbers/[id]/page.tsx#L87) |   if (s === 'approved' && isLive) |
| [app/admin/(protected)/barbers/[id]/page.tsx:93](../../app/admin/(protected)/barbers/[id]/page.tsx#L93) |   if (s === 'approved' && !isLive) |
| [app/admin/(protected)/barbers/[id]/page.tsx:182](../../app/admin/(protected)/barbers/[id]/page.tsx#L182) |         getDoc(doc(db, 'professionalProfiles', id)), |
| [app/admin/(protected)/barbers/[id]/page.tsx:183](../../app/admin/(protected)/barbers/[id]/page.tsx#L183) |         getDoc(doc(db, 'users', id)), |
| [app/admin/(protected)/barbers/[id]/page.tsx:186](../../app/admin/(protected)/barbers/[id]/page.tsx#L186) |             collection(db, 'bookings'), |
| [app/admin/(protected)/barbers/[id]/page.tsx:187](../../app/admin/(protected)/barbers/[id]/page.tsx#L187) |             where('barberId', '==', id), |
| [app/admin/(protected)/barbers/[id]/page.tsx:194](../../app/admin/(protected)/barbers/[id]/page.tsx#L194) |             collection(db, 'reviews'), |
| [app/admin/(protected)/barbers/[id]/page.tsx:195](../../app/admin/(protected)/barbers/[id]/page.tsx#L195) |             where('providerId', '==', id), |
| [app/admin/(protected)/barbers/[id]/page.tsx:236](../../app/admin/(protected)/barbers/[id]/page.tsx#L236) |       await updateDoc(doc(db, 'professionalProfiles', id), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:238](../../app/admin/(protected)/barbers/[id]/page.tsx#L238) |         isLive: true, |
| [app/admin/(protected)/barbers/[id]/page.tsx:242](../../app/admin/(protected)/barbers/[id]/page.tsx#L242) |       await addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:250](../../app/admin/(protected)/barbers/[id]/page.tsx#L250) |       await addDoc(collection(db, 'adminLogs'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:257](../../app/admin/(protected)/barbers/[id]/page.tsx#L257) |       router.push('/admin/barbers'); |
| [app/admin/(protected)/barbers/[id]/page.tsx:270](../../app/admin/(protected)/barbers/[id]/page.tsx#L270) |       await updateDoc(doc(db, 'professionalProfiles', id), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:272](../../app/admin/(protected)/barbers/[id]/page.tsx#L272) |         isLive: false, |
| [app/admin/(protected)/barbers/[id]/page.tsx:276](../../app/admin/(protected)/barbers/[id]/page.tsx#L276) |       await addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:283](../../app/admin/(protected)/barbers/[id]/page.tsx#L283) |       await addDoc(collection(db, 'adminLogs'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:291](../../app/admin/(protected)/barbers/[id]/page.tsx#L291) |       router.push('/admin/barbers'); |
| [app/admin/(protected)/barbers/[id]/page.tsx:304](../../app/admin/(protected)/barbers/[id]/page.tsx#L304) |       await updateDoc(doc(db, 'professionalProfiles', id), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:306](../../app/admin/(protected)/barbers/[id]/page.tsx#L306) |         isLive: false, |
| [app/admin/(protected)/barbers/[id]/page.tsx:310](../../app/admin/(protected)/barbers/[id]/page.tsx#L310) |         addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:317](../../app/admin/(protected)/barbers/[id]/page.tsx#L317) |         addDoc(collection(db, 'adminLogs'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:331](../../app/admin/(protected)/barbers/[id]/page.tsx#L331) |           collection(db, 'bookings'), |
| [app/admin/(protected)/barbers/[id]/page.tsx:332](../../app/admin/(protected)/barbers/[id]/page.tsx#L332) |           where('barberId', '==', id), |
| [app/admin/(protected)/barbers/[id]/page.tsx:333](../../app/admin/(protected)/barbers/[id]/page.tsx#L333) |           where('status', 'in', ['pending', 'confirmed']) |
| [app/admin/(protected)/barbers/[id]/page.tsx:342](../../app/admin/(protected)/barbers/[id]/page.tsx#L342) |               doc(collection(db, 'notifications')), |
| [app/admin/(protected)/barbers/[id]/page.tsx:375](../../app/admin/(protected)/barbers/[id]/page.tsx#L375) |       await updateDoc(doc(db, 'professionalProfiles', id), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:377](../../app/admin/(protected)/barbers/[id]/page.tsx#L377) |         isLive: true, |
| [app/admin/(protected)/barbers/[id]/page.tsx:380](../../app/admin/(protected)/barbers/[id]/page.tsx#L380) |         addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:387](../../app/admin/(protected)/barbers/[id]/page.tsx#L387) |         addDoc(collection(db, 'adminLogs'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:408](../../app/admin/(protected)/barbers/[id]/page.tsx#L408) |       await updateDoc(doc(db, 'professionalProfiles', id), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:411](../../app/admin/(protected)/barbers/[id]/page.tsx#L411) |       await addDoc(collection(db, 'adminLogs'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:431](../../app/admin/(protected)/barbers/[id]/page.tsx#L431) |       await updateDoc(doc(db, 'professionalProfiles', id), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:435](../../app/admin/(protected)/barbers/[id]/page.tsx#L435) |       await addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:443](../../app/admin/(protected)/barbers/[id]/page.tsx#L443) |       await addDoc(collection(db, 'adminLogs'), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:462](../../app/admin/(protected)/barbers/[id]/page.tsx#L462) |         query(collection(db, 'reviews'), where('providerId', '==', barberId)) |
| [app/admin/(protected)/barbers/[id]/page.tsx:472](../../app/admin/(protected)/barbers/[id]/page.tsx#L472) |       await updateDoc(doc(db, 'professionalProfiles', barberId), { |
| [app/admin/(protected)/barbers/[id]/page.tsx:485](../../app/admin/(protected)/barbers/[id]/page.tsx#L485) |       await deleteDoc(doc(db, 'reviews', reviewId)); |
| [app/admin/(protected)/barbers/[id]/page.tsx:518](../../app/admin/(protected)/barbers/[id]/page.tsx#L518) |           href="/admin/barbers" |
| [app/admin/(protected)/barbers/[id]/page.tsx:592](../../app/admin/(protected)/barbers/[id]/page.tsx#L592) |               &lt;StatusBadge status={status} isLive={profile.isLive} /&gt; |
| [app/admin/(protected)/barbers/[id]/page.tsx:796](../../app/admin/(protected)/barbers/[id]/page.tsx#L796) |               &lt;StatusBadge status={status} isLive={profile.isLive} /&gt; |
| [app/admin/(protected)/bookings/page.tsx:124](../../app/admin/(protected)/bookings/page.tsx#L124) |       query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(FETCH_LIMIT)), |
| [app/admin/(protected)/bookings/page.tsx:142](../../app/admin/(protected)/bookings/page.tsx#L142) |               const userSnap = await getDoc(doc(db, 'users', uid)); |
| [app/admin/(protected)/bookings/page.tsx:208](../../app/admin/(protected)/bookings/page.tsx#L208) |       await updateDoc(doc(db, 'bookings', bookingId), { |
| [app/admin/(protected)/bookings/page.tsx:224](../../app/admin/(protected)/bookings/page.tsx#L224) |           addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/bookings/page.tsx:236](../../app/admin/(protected)/bookings/page.tsx#L236) |           addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/challenge/page.tsx:94](../../app/admin/(protected)/challenge/page.tsx#L94) |         const snap = await getDoc(doc(db, 'siteConfig', 'challenge')); |
| [app/admin/(protected)/challenge/page.tsx:134](../../app/admin/(protected)/challenge/page.tsx#L134) |         collection(db, 'challengeSubmissions'), |
| [app/admin/(protected)/challenge/page.tsx:135](../../app/admin/(protected)/challenge/page.tsx#L135) |         where('status', '==', statusFilter), |
| [app/admin/(protected)/challenge/page.tsx:175](../../app/admin/(protected)/challenge/page.tsx#L175) |       await updateDoc(doc(db, 'challengeSubmissions', submission.id), { |
| [app/admin/(protected)/challenge/page.tsx:183](../../app/admin/(protected)/challenge/page.tsx#L183) |       await addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/challenge/page.tsx:192](../../app/admin/(protected)/challenge/page.tsx#L192) |         await updateDoc(doc(db, 'users', submission.userId), { |
| [app/admin/(protected)/challenge/page.tsx:198](../../app/admin/(protected)/challenge/page.tsx#L198) |       await addDoc(collection(db, 'adminLogs'), { |
| [app/admin/(protected)/challenge/page.tsx:225](../../app/admin/(protected)/challenge/page.tsx#L225) |       await updateDoc(doc(db, 'challengeSubmissions', submission.id), { |
| [app/admin/(protected)/challenge/page.tsx:233](../../app/admin/(protected)/challenge/page.tsx#L233) |       await addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/challenge/page.tsx:242](../../app/admin/(protected)/challenge/page.tsx#L242) |         await updateDoc(doc(db, 'users', submission.userId), { |
| [app/admin/(protected)/challenge/page.tsx:248](../../app/admin/(protected)/challenge/page.tsx#L248) |       await addDoc(collection(db, 'adminLogs'), { |
| [app/admin/(protected)/challenge/page.tsx:273](../../app/admin/(protected)/challenge/page.tsx#L273) |           collection(db, 'challengeVotes'), |
| [app/admin/(protected)/challenge/page.tsx:274](../../app/admin/(protected)/challenge/page.tsx#L274) |           where('submissionId', '==', sub.id) |
| [app/admin/(protected)/challenge/page.tsx:279](../../app/admin/(protected)/challenge/page.tsx#L279) |         batch.update(doc(db, 'users', voteDoc.data().voterUid), { |
| [app/admin/(protected)/challenge/page.tsx:285](../../app/admin/(protected)/challenge/page.tsx#L285) |       batch.delete(doc(db, 'challengeSubmissions', sub.id)); |
| [app/admin/(protected)/challenge/page.tsx:298](../../app/admin/(protected)/challenge/page.tsx#L298) |     router.replace(`/admin/challenge?${params.toString()}`); |
| [app/admin/(protected)/challenge/page.tsx:326](../../app/admin/(protected)/challenge/page.tsx#L326) |         doc(db, 'siteConfig', 'challenge'), |
| [app/admin/(protected)/challenge/page.tsx:486](../../app/admin/(protected)/challenge/page.tsx#L486) |                   router.replace(`/admin/challenge?tab=submissions&status=${status}`); |
| [app/admin/(protected)/clients/page.tsx:73](../../app/admin/(protected)/clients/page.tsx#L73) |           getDocs(query(collection(db, 'users'), where('role', '==', 'client'))), |
| [app/admin/(protected)/clients/page.tsx:74](../../app/admin/(protected)/clients/page.tsx#L74) |           getDocs(collection(db, 'bookings')), |
| [app/admin/(protected)/clients/page.tsx:135](../../app/admin/(protected)/clients/page.tsx#L135) |             collection(db, 'bookings'), |
| [app/admin/(protected)/clients/page.tsx:136](../../app/admin/(protected)/clients/page.tsx#L136) |             where('clientId', '==', newId), |
| [app/admin/(protected)/clients/page.tsx:153](../../app/admin/(protected)/clients/page.tsx#L153) |               const userSnap = await getDoc(doc(db, 'users', bid)); |
| [app/admin/(protected)/clients/page.tsx:188](../../app/admin/(protected)/clients/page.tsx#L188) |       await updateDoc(doc(db, 'users', clientId), { |
| [app/admin/(protected)/clients/page.tsx:209](../../app/admin/(protected)/clients/page.tsx#L209) |         query(collection(db, 'bookings'), where('clientId', '==', clientId)) |
| [app/admin/(protected)/clients/page.tsx:219](../../app/admin/(protected)/clients/page.tsx#L219) |       batch.delete(doc(db, 'users', clientId)); |
| [app/admin/(protected)/fake-data/page.tsx:15](../../app/admin/(protected)/fake-data/page.tsx#L15) |         const snap = await getDoc(doc(db, 'siteConfig', 'global')); |
| [app/admin/(protected)/fake-data/page.tsx:36](../../app/admin/(protected)/fake-data/page.tsx#L36) |       await setDoc(doc(db, 'siteConfig', 'global'), { showFakeUIData: next }, { merge: true }); |
| [app/admin/(protected)/featured/page.tsx:59](../../app/admin/(protected)/featured/page.tsx#L59) |       query(collection(db, 'professionalProfiles'), where('isFeatured', '==', true)) |
| [app/admin/(protected)/featured/page.tsx:67](../../app/admin/(protected)/featured/page.tsx#L67) |           const userSnap = await getDoc(doc(db, 'users', d.id)); |
| [app/admin/(protected)/featured/page.tsx:92](../../app/admin/(protected)/featured/page.tsx#L92) |       query(collection(db, 'businesses'), where('isFeatured', '==', true)) |
| [app/admin/(protected)/featured/page.tsx:115](../../app/admin/(protected)/featured/page.tsx#L115) |       batch.update(doc(db, 'professionalProfiles', b.id), { isFeatured: false, featuredUntil: null }); |
| [app/admin/(protected)/featured/page.tsx:118](../../app/admin/(protected)/featured/page.tsx#L118) |       batch.update(doc(db, 'businesses', s.id), { isFeatured: false, featuredUntil: null }); |
| [app/admin/(protected)/featured/page.tsx:140](../../app/admin/(protected)/featured/page.tsx#L140) |           getDocs(query(collection(db, 'professionalProfiles'), where('isLive', '==', true))), |
| [app/admin/(protected)/featured/page.tsx:142](../../app/admin/(protected)/featured/page.tsx#L142) |           getDocs(query(collection(db, 'businesses'), where('status', '==', 'active'))), |
| [app/admin/(protected)/featured/page.tsx:158](../../app/admin/(protected)/featured/page.tsx#L158) |               const userSnap = await getDoc(doc(db, 'users', d.id)); |
| [app/admin/(protected)/featured/page.tsx:230](../../app/admin/(protected)/featured/page.tsx#L230) |       await updateDoc(doc(db, 'professionalProfiles', barber.id), { |
| [app/admin/(protected)/featured/page.tsx:250](../../app/admin/(protected)/featured/page.tsx#L250) |       await updateDoc(doc(db, 'professionalProfiles', barberId), { |
| [app/admin/(protected)/featured/page.tsx:268](../../app/admin/(protected)/featured/page.tsx#L268) |       await updateDoc(doc(db, 'businesses', shop.id), { |
| [app/admin/(protected)/featured/page.tsx:288](../../app/admin/(protected)/featured/page.tsx#L288) |       await updateDoc(doc(db, 'businesses', shopId), { |
| [app/admin/(protected)/layout.tsx:40](../../app/admin/(protected)/layout.tsx#L40) |       router.replace('/admin/login'); |
| [app/admin/(protected)/layout.tsx:88](../../app/admin/(protected)/layout.tsx#L88) |               href={link.href} |
| [app/admin/(protected)/messages/page.tsx:11](../../app/admin/(protected)/messages/page.tsx#L11) |   role: string; |
| [app/admin/(protected)/messages/page.tsx:38](../../app/admin/(protected)/messages/page.tsx#L38) |         const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc')); |
| [app/admin/(protected)/messages/page.tsx:46](../../app/admin/(protected)/messages/page.tsx#L46) |             role: data.role \|\| '', |
| [app/admin/(protected)/messages/page.tsx:66](../../app/admin/(protected)/messages/page.tsx#L66) |       await updateDoc(doc(db, 'contactMessages', id), { read: true }); |
| [app/admin/(protected)/messages/page.tsx:75](../../app/admin/(protected)/messages/page.tsx#L75) |       await deleteDoc(doc(db, 'contactMessages', id)); |
| [app/admin/(protected)/page.tsx:23](../../app/admin/(protected)/page.tsx#L23) |     const snap = await getDocs(collection(db, 'professionalProfiles')); |
| [app/admin/(protected)/page.tsx:30](../../app/admin/(protected)/page.tsx#L30) |         const status = data.isLive ? 'approved' : 'pending'; |
| [app/admin/(protected)/page.tsx:31](../../app/admin/(protected)/page.tsx#L31) |         batch.update(doc(db, 'professionalProfiles', d.id), { approvalStatus: status }); |
| [app/admin/(protected)/page.tsx:137](../../app/admin/(protected)/page.tsx#L137) |       query(collection(db, 'professionalProfiles'), where('approvalStatus', '==', 'pending')), |
| [app/admin/(protected)/page.tsx:141](../../app/admin/(protected)/page.tsx#L141) |       query(collection(db, 'professionalProfiles'), where('isLive', '==', true)), |
| [app/admin/(protected)/page.tsx:145](../../app/admin/(protected)/page.tsx#L145) |       query(collection(db, 'businesses'), where('status', '==', 'active')), |
| [app/admin/(protected)/page.tsx:149](../../app/admin/(protected)/page.tsx#L149) |       query(collection(db, 'professionalProfiles'), where('approvalStatus', '==', 'suspended')), |
| [app/admin/(protected)/page.tsx:153](../../app/admin/(protected)/page.tsx#L153) |       query(collection(db, 'professionalProfiles'), where('experienceLocked', '==', true)), |
| [app/admin/(protected)/page.tsx:161](../../app/admin/(protected)/page.tsx#L161) |       query(collection(db, 'users'), where('lastSeenAt', '&gt;=', fiveMinutesAgo)), |
| [app/admin/(protected)/page.tsx:175](../../app/admin/(protected)/page.tsx#L175) |           getDocs(query(collection(db, 'users'), where('role', '==', 'client'))), |
| [app/admin/(protected)/page.tsx:176](../../app/admin/(protected)/page.tsx#L176) |           getDocs(query(collection(db, 'bookings'), where('date', '==', todayStr))), |
| [app/admin/(protected)/page.tsx:179](../../app/admin/(protected)/page.tsx#L179) |               collection(db, 'bookings'), |
| [app/admin/(protected)/page.tsx:180](../../app/admin/(protected)/page.tsx#L180) |               where('date', '&gt;=', monthStr), |
| [app/admin/(protected)/page.tsx:181](../../app/admin/(protected)/page.tsx#L181) |               where('date', '&lt;', monthStr + '-99') |
| [app/admin/(protected)/page.tsx:184](../../app/admin/(protected)/page.tsx#L184) |           getDocs(collection(db, 'bookings')), |
| [app/admin/(protected)/page.tsx:186](../../app/admin/(protected)/page.tsx#L186) |             query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(8)) |
| [app/admin/(protected)/page.tsx:370](../../app/admin/(protected)/page.tsx#L370) |                       href="/admin/barbers?tab=pending" |
| [app/admin/(protected)/page.tsx:402](../../app/admin/(protected)/page.tsx#L402) |                       href="/admin/barbers?tab=suspended" |
| [app/admin/(protected)/page.tsx:434](../../app/admin/(protected)/page.tsx#L434) |                       href="/admin/barbers?tab=experience_pending" |
| [app/admin/(protected)/reviews/page.tsx:67](../../app/admin/(protected)/reviews/page.tsx#L67) |           query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(FETCH_LIMIT)) |
| [app/admin/(protected)/reviews/page.tsx:92](../../app/admin/(protected)/reviews/page.tsx#L92) |               const profileSnap = await getDoc(doc(db, 'professionalProfiles', pid)); |
| [app/admin/(protected)/reviews/page.tsx:100](../../app/admin/(protected)/reviews/page.tsx#L100) |               const userSnap = await getDoc(doc(db, 'users', pid)); |
| [app/admin/(protected)/reviews/page.tsx:147](../../app/admin/(protected)/reviews/page.tsx#L147) |         query(collection(db, 'reviews'), where('providerId', '==', barberId)) |
| [app/admin/(protected)/reviews/page.tsx:157](../../app/admin/(protected)/reviews/page.tsx#L157) |       await updateDoc(doc(db, 'professionalProfiles', barberId), { |
| [app/admin/(protected)/reviews/page.tsx:170](../../app/admin/(protected)/reviews/page.tsx#L170) |       await deleteDoc(doc(db, 'reviews', reviewId)); |
| [app/admin/(protected)/reviews/page.tsx:191](../../app/admin/(protected)/reviews/page.tsx#L191) |       await updateDoc(doc(db, 'reviews', reviewId), { isFlagged: newFlagged }); |
| [app/admin/(protected)/settings/page.tsx:15](../../app/admin/(protected)/settings/page.tsx#L15) |         const snap = await getDoc(doc(db, 'siteConfig', 'global')); |
| [app/admin/(protected)/settings/page.tsx:35](../../app/admin/(protected)/settings/page.tsx#L35) |         doc(db, 'siteConfig', 'global'), |
| [app/admin/(protected)/shops/page.tsx:91](../../app/admin/(protected)/shops/page.tsx#L91) |           getDocs(collection(db, 'businesses')), |
| [app/admin/(protected)/shops/page.tsx:92](../../app/admin/(protected)/shops/page.tsx#L92) |           getDocs(collection(db, 'professionalProfiles')), |
| [app/admin/(protected)/shops/page.tsx:112](../../app/admin/(protected)/shops/page.tsx#L112) |                 const userSnap = await getDoc(doc(db, 'users', ownerId)); |
| [app/admin/(protected)/shops/page.tsx:251](../../app/admin/(protected)/shops/page.tsx#L251) |               onClick={() =&gt; router.push(`/admin/shops/${shop.id}`)} |
| [app/admin/(protected)/shops/page.tsx:315](../../app/admin/(protected)/shops/page.tsx#L315) |                 href={`/admin/shops/${shop.id}`} |
| [app/admin/(protected)/shops/[id]/page.tsx:65](../../app/admin/(protected)/shops/[id]/page.tsx#L65) |   isLive?: boolean; |
| [app/admin/(protected)/shops/[id]/page.tsx:114](../../app/admin/(protected)/shops/[id]/page.tsx#L114) |       const shopSnap = await getDoc(doc(db, 'businesses', id)); |
| [app/admin/(protected)/shops/[id]/page.tsx:125](../../app/admin/(protected)/shops/[id]/page.tsx#L125) |         ownerId ? getDoc(doc(db, 'users', ownerId)) : Promise.resolve(null), |
| [app/admin/(protected)/shops/[id]/page.tsx:128](../../app/admin/(protected)/shops/[id]/page.tsx#L128) |             collection(db, 'bookings'), |
| [app/admin/(protected)/shops/[id]/page.tsx:129](../../app/admin/(protected)/shops/[id]/page.tsx#L129) |             where('shopId', '==', id), |
| [app/admin/(protected)/shops/[id]/page.tsx:134](../../app/admin/(protected)/shops/[id]/page.tsx#L134) |         getDocs(query(collection(db, 'professionalProfiles'), where('businessId', '==', id))), |
| [app/admin/(protected)/shops/[id]/page.tsx:152](../../app/admin/(protected)/shops/[id]/page.tsx#L152) |           isLive: Boolean(bd.isLive), |
| [app/admin/(protected)/shops/[id]/page.tsx:177](../../app/admin/(protected)/shops/[id]/page.tsx#L177) |       await updateDoc(doc(db, 'businesses', id), { |
| [app/admin/(protected)/shops/[id]/page.tsx:183](../../app/admin/(protected)/shops/[id]/page.tsx#L183) |         await addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/shops/[id]/page.tsx:191](../../app/admin/(protected)/shops/[id]/page.tsx#L191) |       await addDoc(collection(db, 'adminLogs'), { |
| [app/admin/(protected)/shops/[id]/page.tsx:198](../../app/admin/(protected)/shops/[id]/page.tsx#L198) |       router.push('/admin/shops'); |
| [app/admin/(protected)/shops/[id]/page.tsx:211](../../app/admin/(protected)/shops/[id]/page.tsx#L211) |       await updateDoc(doc(db, 'businesses', id), { |
| [app/admin/(protected)/shops/[id]/page.tsx:217](../../app/admin/(protected)/shops/[id]/page.tsx#L217) |         await addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/shops/[id]/page.tsx:225](../../app/admin/(protected)/shops/[id]/page.tsx#L225) |       await addDoc(collection(db, 'adminLogs'), { |
| [app/admin/(protected)/shops/[id]/page.tsx:233](../../app/admin/(protected)/shops/[id]/page.tsx#L233) |       router.push('/admin/shops'); |
| [app/admin/(protected)/shops/[id]/page.tsx:246](../../app/admin/(protected)/shops/[id]/page.tsx#L246) |       await updateDoc(doc(db, 'businesses', id), { |
| [app/admin/(protected)/shops/[id]/page.tsx:251](../../app/admin/(protected)/shops/[id]/page.tsx#L251) |         await addDoc(collection(db, 'notifications'), { |
| [app/admin/(protected)/shops/[id]/page.tsx:272](../../app/admin/(protected)/shops/[id]/page.tsx#L272) |       await updateDoc(doc(db, 'businesses', id), { status: 'active' }); |
| [app/admin/(protected)/shops/[id]/page.tsx:300](../../app/admin/(protected)/shops/[id]/page.tsx#L300) |         &lt;Link href="/admin/shops" style={{ fontSize: 13, color: '#555', textDecoration: 'none', fontWeight: 700 }}&gt; |
| [app/admin/(protected)/shops/[id]/page.tsx:348](../../app/admin/(protected)/shops/[id]/page.tsx#L348) |                     {b.isLive !== undefined && ( |
| [app/admin/(protected)/shops/[id]/page.tsx:352](../../app/admin/(protected)/shops/[id]/page.tsx#L352) |                           color: b.isLive ? '#22C55E' : '#555', |
| [app/admin/(protected)/shops/[id]/page.tsx:356](../../app/admin/(protected)/shops/[id]/page.tsx#L356) |                         {b.isLive ? '● Live' : '○ Offline'} |
| [app/admin/(protected)/team/page.tsx:55](../../app/admin/(protected)/team/page.tsx#L55) |       const snap = await getDocs(collection(db, 'adminUsers')); |
| [app/admin/(protected)/team/page.tsx:72](../../app/admin/(protected)/team/page.tsx#L72) |       await deleteDoc(doc(db, 'adminUsers', adminId)); |
| [app/admin/(protected)/team/page.tsx:73](../../app/admin/(protected)/team/page.tsx#L73) |       await setDoc(doc(db, 'users', adminId), { isAdmin: false, role: 'client' }, { merge: true }); |
| [app/admin/(protected)/team/page.tsx:106](../../app/admin/(protected)/team/page.tsx#L106) |         role: 'admin', |
| [app/admin/(protected)/team/page.tsx:112](../../app/admin/(protected)/team/page.tsx#L112) |         isOnboarded: true, |
| [app/admin/(protected)/team/page.tsx:117](../../app/admin/(protected)/team/page.tsx#L117) |         setDoc(doc(db, 'users', uid), adminDoc), |
| [app/admin/(protected)/team/page.tsx:118](../../app/admin/(protected)/team/page.tsx#L118) |         setDoc(doc(db, 'adminUsers', uid), adminDoc), |
| [app/admin/(protected)/users/page.tsx:19](../../app/admin/(protected)/users/page.tsx#L19) |       collection(db, 'users'), |
| [app/admin/(protected)/users/page.tsx:25](../../app/admin/(protected)/users/page.tsx#L25) |           if (role === 'client') clients++; |
| [app/admin/(protected)/users/page.tsx:26](../../app/admin/(protected)/users/page.tsx#L26) |           else if (role === 'professional') barbers++; |
| [app/admin/login/page.tsx:33](../../app/admin/login/page.tsx#L33) |       const ref = doc(db, 'users', uid); |
| [app/admin/login/page.tsx:49](../../app/admin/login/page.tsx#L49) |       const isAdminUser = userData?.isAdmin === true \|\| userData?.role === 'admin'; |
| [app/admin/login/page.tsx:56](../../app/admin/login/page.tsx#L56) |           ', role: ' + userData?.role + |
| [app/admin/login/page.tsx:68](../../app/admin/login/page.tsx#L68) |       router.replace('/admin'); |
| [app/admin/login/page.tsx:205](../../app/admin/login/page.tsx#L205) |           &lt;a href="/login" style={{ color: '#555', textDecoration: 'none' }}&gt; |
| [app/api/admin/upload-reference-photo/route.ts:35](../../app/api/admin/upload-reference-photo/route.ts#L35) |     const userDoc = await adminDb.collection('users').doc(decoded.uid).get(); |
| [app/api/admin/upload-reference-photo/route.ts:37](../../app/api/admin/upload-reference-photo/route.ts#L37) |     const isAdmin = data?.isAdmin === true \|\| data?.role === 'admin'; |
| [app/api/delete-account/route.ts:20](../../app/api/delete-account/route.ts#L20) |     const userDoc = await db.collection('users').doc(uid).get(); |
| [app/api/delete-account/route.ts:21](../../app/api/delete-account/route.ts#L21) |     const ownsShop = userDoc.exists && userDoc.data()?.ownsShop === true; |
| [app/api/delete-account/route.ts:27](../../app/api/delete-account/route.ts#L27) |         db.collection('professionalProfiles').where('businessId', '==', uid).get(), |
| [app/api/delete-account/route.ts:29](../../app/api/delete-account/route.ts#L29) |         db.collection('invites').where('shopId', '==', uid).get(), |
| [app/api/delete-account/route.ts:31](../../app/api/delete-account/route.ts#L31) |         db.collection('invites').where('barberId', '==', uid).get(), |
| [app/api/delete-account/route.ts:33](../../app/api/delete-account/route.ts#L33) |         db.collection('services').where('providerId', '==', uid).where('providerType', '==', 'shop').get(), |
| [app/api/delete-account/route.ts:35](../../app/api/delete-account/route.ts#L35) |         db.collection('services').where('providerId', '==', uid).where('providerType', '==', 'barber').get(), |
| [app/api/delete-account/route.ts:44](../../app/api/delete-account/route.ts#L44) |     if (ownsShop) { |
| [app/api/delete-account/route.ts:45](../../app/api/delete-account/route.ts#L45) |       batch.delete(db.collection('businesses').doc(uid)); |
| [app/api/delete-account/route.ts:60](../../app/api/delete-account/route.ts#L60) |     // 7. Delete professionalProfiles/{uid} |
| [app/api/delete-account/route.ts:61](../../app/api/delete-account/route.ts#L61) |     batch.delete(db.collection('professionalProfiles').doc(uid)); |
| [app/api/delete-account/route.ts:64](../../app/api/delete-account/route.ts#L64) |     batch.delete(db.collection('users').doc(uid)); |
| [app/barber/[barberId]/BarberProfileClient.tsx:31](../../app/barber/[barberId]/BarberProfileClient.tsx#L31) |   isSolo?: boolean; |
| [app/barber/[barberId]/BarberProfileClient.tsx:42](../../app/barber/[barberId]/BarberProfileClient.tsx#L42) |   isLive?: boolean; |
| [app/barber/[barberId]/BarberProfileClient.tsx:43](../../app/barber/[barberId]/BarberProfileClient.tsx#L43) |   isOnboarded?: boolean; |
| [app/barber/[barberId]/BarberProfileClient.tsx:47](../../app/barber/[barberId]/BarberProfileClient.tsx#L47) |   ownsShop?: boolean; |
| [app/barber/[barberId]/BarberProfileClient.tsx:186](../../app/barber/[barberId]/BarberProfileClient.tsx#L186) |       const pSnap = await getDoc(doc(db, 'professionalProfiles', barberId)); |
| [app/barber/[barberId]/BarberProfileClient.tsx:192](../../app/barber/[barberId]/BarberProfileClient.tsx#L192) |         const shopSnap = await getDoc(doc(db, 'businesses', profile.businessId)); |
| [app/barber/[barberId]/BarberProfileClient.tsx:205](../../app/barber/[barberId]/BarberProfileClient.tsx#L205) |       doc(db, 'schedules', getScheduleDocId(barberId)), |
| [app/barber/[barberId]/BarberProfileClient.tsx:222](../../app/barber/[barberId]/BarberProfileClient.tsx#L222) |       collection(db, 'services'), |
| [app/barber/[barberId]/BarberProfileClient.tsx:223](../../app/barber/[barberId]/BarberProfileClient.tsx#L223) |       where('providerId', '==', providerId), |
| [app/barber/[barberId]/BarberProfileClient.tsx:224](../../app/barber/[barberId]/BarberProfileClient.tsx#L224) |       where('providerType', '==', providerType), |
| [app/barber/[barberId]/BarberProfileClient.tsx:225](../../app/barber/[barberId]/BarberProfileClient.tsx#L225) |       where('isActive', '==', true), |
| [app/barber/[barberId]/BarberProfileClient.tsx:240](../../app/barber/[barberId]/BarberProfileClient.tsx#L240) |       collection(db, 'reviews'), |
| [app/barber/[barberId]/BarberProfileClient.tsx:241](../../app/barber/[barberId]/BarberProfileClient.tsx#L241) |       where('providerId', '==', barberId), |
| [app/barber/[barberId]/BarberProfileClient.tsx:253](../../app/barber/[barberId]/BarberProfileClient.tsx#L253) |               const uSnap = await getDoc(doc(db, 'users', r.clientId!)); |
| [app/barber/[barberId]/BarberProfileClient.tsx:331](../../app/barber/[barberId]/BarberProfileClient.tsx#L331) |     if (!user) { router.push(`/login?redirect=/barber/${barberId}`); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:333](../../app/barber/[barberId]/BarberProfileClient.tsx#L333) |     if (appUser?.role === 'admin') { toast.error(t('profile.adminCannotBook')); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:335](../../app/barber/[barberId]/BarberProfileClient.tsx#L335) |     if (!appUser?.isOnboarded) { |
| [app/barber/[barberId]/BarberProfileClient.tsx:336](../../app/barber/[barberId]/BarberProfileClient.tsx#L336) |       router.push(appUser?.role === 'professional' ? '/onboarding/professional' : '/onboarding/client'); |
| [app/barber/[barberId]/BarberProfileClient.tsx:339](../../app/barber/[barberId]/BarberProfileClient.tsx#L339) |     if (!profile?.isLive) { toast.error(t('profile.notAcceptingBookings')); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:342](../../app/barber/[barberId]/BarberProfileClient.tsx#L342) |     router.push(`/book/${barberId}?${qs.toString()}`); |
| [app/barber/[barberId]/BarberProfileClient.tsx:346](../../app/barber/[barberId]/BarberProfileClient.tsx#L346) |     if (!user) { router.push('/login'); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:347](../../app/barber/[barberId]/BarberProfileClient.tsx#L347) |     if (appUser?.role === 'admin') { toast.error(t('profile.adminCannotSave')); return; } |
| [app/barber/[barberId]/BarberProfileClient.tsx:354](../../app/barber/[barberId]/BarberProfileClient.tsx#L354) |         await updateDoc(doc(db, 'users', user.uid), { favoriteBarbers: arrayRemove(barberId) }); |
| [app/barber/[barberId]/BarberProfileClient.tsx:357](../../app/barber/[barberId]/BarberProfileClient.tsx#L357) |         await updateDoc(doc(db, 'users', user.uid), { favoriteBarbers: arrayUnion(barberId) }); |
| [app/barber/[barberId]/BarberProfileClient.tsx:388](../../app/barber/[barberId]/BarberProfileClient.tsx#L388) |           &lt;Link href="/barbers" className="bg-brand-yellow text-black font-black px-6 py-3 rounded-full"&gt;{t('profile.findBarbers')}&lt;/Link&gt; |
| [app/barber/[barberId]/BarberProfileClient.tsx:425](../../app/barber/[barberId]/BarberProfileClient.tsx#L425) |                 onClick={() =&gt; router.push('/barbers')} |
| [app/barber/[barberId]/BarberProfileClient.tsx:444](../../app/barber/[barberId]/BarberProfileClient.tsx#L444) |             &lt;Link href="/" className="hover:text-white transition-colors"&gt;{t('nav.home')}&lt;/Link&gt; |
| [app/barber/[barberId]/BarberProfileClient.tsx:446](../../app/barber/[barberId]/BarberProfileClient.tsx#L446) |             &lt;Link href="/barbers" className="hover:text-white transition-colors"&gt;{t('nav.barbers')}&lt;/Link&gt; |
| [app/barber/[barberId]/BarberProfileClient.tsx:480](../../app/barber/[barberId]/BarberProfileClient.tsx#L480) |                       &lt;a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#E1306C] transition-colors text-lg" title="Instagram"&gt;📸&lt;/a&gt; |
| [app/barber/[barberId]/BarberProfileClient.tsx:483](../../app/barber/[barberId]/BarberProfileClient.tsx#L483) |                       &lt;a href={`https://tiktok.com/@${profile.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-white transition-colors text-lg" title="TikTok"&gt;🎵&lt;/a&gt; |
| [app/barber/[barberId]/BarberProfileClient.tsx:486](../../app/barber/[barberId]/BarberProfileClient.tsx#L486) |                       &lt;a href={`https://facebook.com/${profile.facebook}`} target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#1877F2] transition-colors text-lg" title="Facebook"&gt;👤&lt;/a&gt; |
| [app/barber/[barberId]/BarberProfileClient.tsx:496](../../app/barber/[barberId]/BarberProfileClient.tsx#L496) |                         &lt;a href={shop.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:underline text-xs"&gt;Get directions&lt;/a&gt; |
| [app/barber/[barberId]/BarberProfileClient.tsx:498](../../app/barber/[barberId]/BarberProfileClient.tsx#L498) |                       &lt;Link href={`/shop/${profile.businessId}`} className="text-[#666] hover:text-white text-xs transition-colors"&gt;· 🏪 {shop.name}&lt;/Link&gt; |
| [app/barber/[barberId]/BarberProfileClient.tsx:680](../../app/barber/[barberId]/BarberProfileClient.tsx#L680) |                       {isChallengeModeOn ? null : &lt;button onClick={() =&gt; handleBooking()} disabled={!profile.isLive} title={!profile.isLive ? t('profile.notAcceptingBookings') : undefined} className={`px-4 py-2 rounded-xl text-xs font-black transition-opacity ${!profile.isLive ? 'bg-[#2a2a2a] text-[#555] cursor-not-allowed' : 'bg-brand-yellow text-[#0a0a0a] hover:opacity-90'}`}&gt;{t('profile.book')}&lt;/button&gt;} |
| [app/barber/[barberId]/BarberProfileClient.tsx:700](../../app/barber/[barberId]/BarberProfileClient.tsx#L700) |                       {isChallengeModeOn ? null : &lt;button onClick={() =&gt; handleBooking(s.id)} disabled={!profile.isLive} title={!profile.isLive ? t('profile.notAcceptingBookings') : undefined} |
| [app/barber/[barberId]/BarberProfileClient.tsx:701](../../app/barber/[barberId]/BarberProfileClient.tsx#L701) |                         className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${!profile.isLive ? 'bg-[#1a1a1a] text-[#555] border border-[#2a2a2a] cursor-not-allowed' : 'bg-[#1a1a1a] text-white border border-[#333] group-hover:bg-brand-yellow group-hover:text-[#0a0a0a] group-hover:border-brand-yellow'}`} |
| [app/barber/[barberId]/BarberProfileClient.tsx:722](../../app/barber/[barberId]/BarberProfileClient.tsx#L722) |               {isChallengeModeOn ? null : &lt;button onClick={() =&gt; handleBooking()} disabled={!profile.isLive} title={!profile.isLive ? t('profile.notAcceptingBookings') : undefined} |
| [app/barber/[barberId]/BarberProfileClient.tsx:723](../../app/barber/[barberId]/BarberProfileClient.tsx#L723) |                 className={`w-full font-black py-3 rounded-full mb-2 text-sm transition-opacity ${!profile.isLive ? 'bg-[#2a2a2a] text-[#555] cursor-not-allowed' : 'bg-brand-yellow text-[#0a0a0a] hover:opacity-90'}`} |
| [app/barber/[barberId]/BarberProfileClient.tsx:769](../../app/barber/[barberId]/BarberProfileClient.tsx#L769) |                       isChallengeModeOn ? null : &lt;button key={slot} onClick={() =&gt; handleBooking()} disabled={!profile.isLive} |
| [app/barber/[barberId]/BarberProfileClient.tsx:770](../../app/barber/[barberId]/BarberProfileClient.tsx#L770) |                         className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${!profile.isLive ? 'bg-[#1a1a1a] border border-[#333] text-[#555] cursor-not-allowed' : 'bg-[#0f2010] border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/20'}`} |
| [app/barber/[barberId]/BarberProfileClient.tsx:845](../../app/barber/[barberId]/BarberProfileClient.tsx#L845) |           disabled={!profile?.isLive} |
| [app/barber/[barberId]/page.tsx:14](../../app/barber/[barberId]/page.tsx#L14) |       .collection('professionalProfiles') |
| [app/barber/[barberId]/page.tsx:15](../../app/barber/[barberId]/page.tsx#L15) |       .where('isLive', '==', true) |
| [app/barber/[barberId]/page.tsx:33](../../app/barber/[barberId]/page.tsx#L33) |       adminDb.collection('professionalProfiles').doc(barberId).get(), |
| [app/barber/[barberId]/page.tsx:34](../../app/barber/[barberId]/page.tsx#L34) |       adminDb.collection('users').doc(barberId).get(), |
| [app/barber/[barberId]/page.tsx:91](../../app/barber/[barberId]/page.tsx#L91) |         isLive: true, |
| [app/barber/[barberId]/page.tsx:92](../../app/barber/[barberId]/page.tsx#L92) |         isSolo: true, |
| [app/barber/[barberId]/page.tsx:93](../../app/barber/[barberId]/page.tsx#L93) |         isOnboarded: true, |
| [app/barber/[barberId]/page.tsx:135](../../app/barber/[barberId]/page.tsx#L135) |       adminDb.collection('professionalProfiles').doc(barberId).get(), |
| [app/barber/[barberId]/page.tsx:136](../../app/barber/[barberId]/page.tsx#L136) |       adminDb.collection('users').doc(barberId).get(), |
| [app/barber/[barberId]/page.tsx:137](../../app/barber/[barberId]/page.tsx#L137) |       adminDb.collection('schedules').doc(getScheduleDocId(barberId)).get(), |
| [app/barber/[barberId]/page.tsx:149](../../app/barber/[barberId]/page.tsx#L149) |     // Heal: if professionalProfiles is missing public display fields, copy them |
| [app/barber/[barberId]/page.tsx:164](../../app/barber/[barberId]/page.tsx#L164) |             .collection('professionalProfiles') |
| [app/barber/[barberId]/page.tsx:165](../../app/barber/[barberId]/page.tsx#L165) |             .doc(barberId) |
| [app/barber/[barberId]/page.tsx:168](../../app/barber/[barberId]/page.tsx#L168) |           console.log('[heal] professionalProfiles healed for:', barberId, healData); |
| [app/barber/[barberId]/page.tsx:187](../../app/barber/[barberId]/page.tsx#L187) |       const shopDoc = await adminDb.collection('businesses').doc((profileData as any).businessId).get(); |
| [app/barber/[barberId]/page.tsx:193](../../app/barber/[barberId]/page.tsx#L193) |       adminDb.collection('services') |
| [app/barber/[barberId]/page.tsx:194](../../app/barber/[barberId]/page.tsx#L194) |         .where('providerId', '==', barberId) |
| [app/barber/[barberId]/page.tsx:195](../../app/barber/[barberId]/page.tsx#L195) |         .where('isActive', '==', true) |
| [app/barber/[barberId]/page.tsx:197](../../app/barber/[barberId]/page.tsx#L197) |       adminDb.collection('reviews') |
| [app/barber/[barberId]/page.tsx:198](../../app/barber/[barberId]/page.tsx#L198) |         .where('providerId', '==', barberId) |
| [app/barber/[barberId]/page.tsx:212](../../app/barber/[barberId]/page.tsx#L212) |             const clientDoc = await adminDb.collection('users').doc(rev.clientId).get(); |
| [app/barbers/BarbersClient.tsx:70](../../app/barbers/BarbersClient.tsx#L70) |           'isLive:true AND ' + |
| [app/barbers/BarbersClient.tsx:72](../../app/barbers/BarbersClient.tsx#L72) |           'isSolo:true', |
| [app/barbers/BarbersClient.tsx:77](../../app/barbers/BarbersClient.tsx#L77) |       collection(db, 'professionalProfiles'), |
| [app/barbers/BarbersClient.tsx:78](../../app/barbers/BarbersClient.tsx#L78) |       where('isFeatured', '==', true), |
| [app/barbers/BarbersClient.tsx:486](../../app/barbers/BarbersClient.tsx#L486) |                       &lt;Link href={`/barber/${b.id}`} |
| [app/barbers/BarbersClient.tsx:562](../../app/barbers/BarbersClient.tsx#L562) |                           &lt;a href="/signup" style={{ |
| [app/barbers/BarbersClient.tsx:566](../../app/barbers/BarbersClient.tsx#L566) |                           &lt;a href="/login" style={{ |
| [app/book/shop/[shopId]/page.tsx:51](../../app/book/shop/[shopId]/page.tsx#L51) |   isLive?: boolean; |
| [app/book/shop/[shopId]/page.tsx:117](../../app/book/shop/[shopId]/page.tsx#L117) |       router.replace(`/login?redirect=/book/shop/${shopId}`); |
| [app/book/shop/[shopId]/page.tsx:120](../../app/book/shop/[shopId]/page.tsx#L120) |     if (appUser?.role === 'admin') { |
| [app/book/shop/[shopId]/page.tsx:122](../../app/book/shop/[shopId]/page.tsx#L122) |       router.replace('/'); |
| [app/book/shop/[shopId]/page.tsx:125](../../app/book/shop/[shopId]/page.tsx#L125) |     if (appUser && !appUser.isOnboarded) { |
| [app/book/shop/[shopId]/page.tsx:126](../../app/book/shop/[shopId]/page.tsx#L126) |       router.replace(appUser?.role === 'professional' ? '/onboarding/professional' : '/onboarding/client'); |
| [app/book/shop/[shopId]/page.tsx:140](../../app/book/shop/[shopId]/page.tsx#L140) |         const shopSnap = await getDoc(doc(db, 'businesses', shopId)); |
| [app/book/shop/[shopId]/page.tsx:147](../../app/book/shop/[shopId]/page.tsx#L147) |           collection(db, 'professionalProfiles'), |
| [app/book/shop/[shopId]/page.tsx:148](../../app/book/shop/[shopId]/page.tsx#L148) |           where('businessId', '==', shopId), |
| [app/book/shop/[shopId]/page.tsx:149](../../app/book/shop/[shopId]/page.tsx#L149) |           where('isLive', '==', true), |
| [app/book/shop/[shopId]/page.tsx:155](../../app/book/shop/[shopId]/page.tsx#L155) |           rawBarbers.map(b =&gt; getDoc(doc(db, 'users', b.id))) |
| [app/book/shop/[shopId]/page.tsx:171](../../app/book/shop/[shopId]/page.tsx#L171) |             isLive: b.isLive, |
| [app/book/shop/[shopId]/page.tsx:177](../../app/book/shop/[shopId]/page.tsx#L177) |           collection(db, 'services'), |
| [app/book/shop/[shopId]/page.tsx:178](../../app/book/shop/[shopId]/page.tsx#L178) |           where('providerId', '==', shopId), |
| [app/book/shop/[shopId]/page.tsx:179](../../app/book/shop/[shopId]/page.tsx#L179) |           where('providerType', '==', 'shop'), |
| [app/book/shop/[shopId]/page.tsx:255](../../app/book/shop/[shopId]/page.tsx#L255) |         collection(db, 'bookings'), |
| [app/book/shop/[shopId]/page.tsx:256](../../app/book/shop/[shopId]/page.tsx#L256) |         where('clientId', '==', user.uid), |
| [app/book/shop/[shopId]/page.tsx:257](../../app/book/shop/[shopId]/page.tsx#L257) |         where('createdAt', '&gt;', oneHourAgo), |
| [app/book/shop/[shopId]/page.tsx:274](../../app/book/shop/[shopId]/page.tsx#L274) |         collection(db, 'bookings'), |
| [app/book/shop/[shopId]/page.tsx:275](../../app/book/shop/[shopId]/page.tsx#L275) |         where('clientId', '==', user.uid), |
| [app/book/shop/[shopId]/page.tsx:276](../../app/book/shop/[shopId]/page.tsx#L276) |         where('barberId', '==', selectedBarberId), |
| [app/book/shop/[shopId]/page.tsx:277](../../app/book/shop/[shopId]/page.tsx#L277) |         where('date', '==', selectedDate), |
| [app/book/shop/[shopId]/page.tsx:278](../../app/book/shop/[shopId]/page.tsx#L278) |         where('startTime', '==', selectedTime), |
| [app/book/shop/[shopId]/page.tsx:279](../../app/book/shop/[shopId]/page.tsx#L279) |         where('status', 'in', ['pending', 'confirmed']), |
| [app/book/shop/[shopId]/page.tsx:287](../../app/book/shop/[shopId]/page.tsx#L287) |       const lockDocRef = doc(db, 'bookingLocks', `${selectedBarberId}_${selectedDate}`); |
| [app/book/shop/[shopId]/page.tsx:288](../../app/book/shop/[shopId]/page.tsx#L288) |       const newBookingId = doc(collection(db, 'bookings')).id; |
| [app/book/shop/[shopId]/page.tsx:318](../../app/book/shop/[shopId]/page.tsx#L318) |         const bookingRef = doc(db, 'bookings', newBookingId); |
| [app/book/shop/[shopId]/page.tsx:334](../../app/book/shop/[shopId]/page.tsx#L334) |           paymentMethod: 'cash', |
| [app/book/shop/[shopId]/page.tsx:343](../../app/book/shop/[shopId]/page.tsx#L343) |         await addDoc(collection(db, 'notifications'), notificationSchema.parse({ |
| [app/book/shop/[shopId]/page.tsx:350](../../app/book/shop/[shopId]/page.tsx#L350) |         updateDoc(doc(db, 'users', selectedBarberId), { unreadCount: increment(1) }).catch(console.error); |
| [app/book/shop/[shopId]/page.tsx:352](../../app/book/shop/[shopId]/page.tsx#L352) |         await addDoc(collection(db, 'notifications'), notificationSchema.parse({ |
| [app/book/shop/[shopId]/page.tsx:359](../../app/book/shop/[shopId]/page.tsx#L359) |         updateDoc(doc(db, 'users', user.uid), { unreadCount: increment(1) }).catch(console.error); |
| [app/book/shop/[shopId]/page.tsx:366](../../app/book/shop/[shopId]/page.tsx#L366) |       router.push(appUser?.role === 'professional' ? '/dashboard/barber/bookings' : '/dashboard/client'); |
| [app/book/[barberId]/page.tsx:58](../../app/book/[barberId]/page.tsx#L58) |       const pSnap = await getDoc(doc(db, 'professionalProfiles', barberId)); |
| [app/book/[barberId]/page.tsx:61](../../app/book/[barberId]/page.tsx#L61) |       const uSnap = await getDoc(doc(db, 'users', barberId)); |
| [app/book/[barberId]/page.tsx:71](../../app/book/[barberId]/page.tsx#L71) |       !profile.isLive \|\| |
| [app/book/[barberId]/page.tsx:74](../../app/book/[barberId]/page.tsx#L74) |       router.replace('/barbers'); |
| [app/book/[barberId]/page.tsx:89](../../app/book/[barberId]/page.tsx#L89) |       router.replace('/login'); |
| [app/book/[barberId]/page.tsx:100](../../app/book/[barberId]/page.tsx#L100) |       const qSvc = query(collection(db, 'services'), where('providerId', '==', providerId), where('providerType', '==', pType)); |
| [app/book/[barberId]/page.tsx:150](../../app/book/[barberId]/page.tsx#L150) |         collection(db, 'bookings'), |
| [app/book/[barberId]/page.tsx:151](../../app/book/[barberId]/page.tsx#L151) |         where('clientId', '==', user.uid), |
| [app/book/[barberId]/page.tsx:152](../../app/book/[barberId]/page.tsx#L152) |         where('createdAt', '&gt;', oneHourAgo) |
| [app/book/[barberId]/page.tsx:170](../../app/book/[barberId]/page.tsx#L170) |         collection(db, 'bookings'), |
| [app/book/[barberId]/page.tsx:171](../../app/book/[barberId]/page.tsx#L171) |         where('clientId', '==', user.uid), |
| [app/book/[barberId]/page.tsx:172](../../app/book/[barberId]/page.tsx#L172) |         where('barberId', '==', barberId), |
| [app/book/[barberId]/page.tsx:173](../../app/book/[barberId]/page.tsx#L173) |         where('date', '==', selectedDate), |
| [app/book/[barberId]/page.tsx:174](../../app/book/[barberId]/page.tsx#L174) |         where('startTime', '==', selectedTime), |
| [app/book/[barberId]/page.tsx:175](../../app/book/[barberId]/page.tsx#L175) |         where('status', 'in', ['pending', 'confirmed']) |
| [app/book/[barberId]/page.tsx:189](../../app/book/[barberId]/page.tsx#L189) |         collection(db, 'bookings'), |
| [app/book/[barberId]/page.tsx:190](../../app/book/[barberId]/page.tsx#L190) |         where('clientId', '==', user.uid), |
| [app/book/[barberId]/page.tsx:191](../../app/book/[barberId]/page.tsx#L191) |         where('date',     '==', selectedDate), |
| [app/book/[barberId]/page.tsx:192](../../app/book/[barberId]/page.tsx#L192) |         where('status',   'in', ['pending', 'confirmed']) |
| [app/book/[barberId]/page.tsx:217](../../app/book/[barberId]/page.tsx#L217) |       const lockDocRef = doc(db, 'bookingLocks', `${barberId}_${selectedDate}`); |
| [app/book/[barberId]/page.tsx:218](../../app/book/[barberId]/page.tsx#L218) |       const newBookingId = doc(collection(db, 'bookings')).id;  |
| [app/book/[barberId]/page.tsx:246](../../app/book/[barberId]/page.tsx#L246) |         const bookingRef = doc(db, 'bookings', newBookingId); |
| [app/book/[barberId]/page.tsx:269](../../app/book/[barberId]/page.tsx#L269) |           paymentMethod: 'cash', |
| [app/book/[barberId]/page.tsx:306](../../app/book/[barberId]/page.tsx#L306) |       await addDoc(collection(db, 'notifications'), notificationSchema.parse({ |
| [app/book/[barberId]/page.tsx:313](../../app/book/[barberId]/page.tsx#L313) |       updateDoc(doc(db, 'users', barberId), { unreadCount: increment(1) }).catch(console.error); |
| [app/book/[barberId]/page.tsx:315](../../app/book/[barberId]/page.tsx#L315) |       await addDoc(collection(db, 'notifications'), notificationSchema.parse({ |
| [app/book/[barberId]/page.tsx:322](../../app/book/[barberId]/page.tsx#L322) |       updateDoc(doc(db, 'users', user.uid), { unreadCount: increment(1) }).catch(console.error); |
| [app/book/[barberId]/page.tsx:330](../../app/book/[barberId]/page.tsx#L330) |     router.push('/dashboard/client'); |
| [app/book/[barberId]/page.tsx:385](../../app/book/[barberId]/page.tsx#L385) |             href="/dashboard/client" |
| [app/challenge/page.tsx:35](../../app/challenge/page.tsx#L35) |       const snap = await getDoc(doc(db, 'siteConfig', 'challenge')); |
| [app/challenge/page.tsx:116](../../app/challenge/page.tsx#L116) |         collection(db, 'challengeSubmissions'), |
| [app/challenge/page.tsx:117](../../app/challenge/page.tsx#L117) |         where('type', '==', 'barber'), |
| [app/challenge/page.tsx:118](../../app/challenge/page.tsx#L118) |         where('status', '==', 'approved'), |
| [app/challenge/page.tsx:133](../../app/challenge/page.tsx#L133) |         collection(db, 'challengeSubmissions'), |
| [app/challenge/page.tsx:134](../../app/challenge/page.tsx#L134) |         where('type', '==', 'shop'), |
| [app/challenge/page.tsx:135](../../app/challenge/page.tsx#L135) |         where('status', '==', 'approved'), |
| [app/challenge/page.tsx:182](../../app/challenge/page.tsx#L182) |       router.push('/signup?next=/challenge'); |
| [app/challenge/page.tsx:196](../../app/challenge/page.tsx#L196) |       await setDoc(doc(db, 'challengeVotes', `${user.uid}_${type}`), { |
| [app/challenge/page.tsx:299](../../app/challenge/page.tsx#L299) |               href="/signup" |
| [app/challenge/page.tsx:434](../../app/challenge/page.tsx#L434) |           href="/" |
| [app/challenge/page.tsx:552](../../app/challenge/page.tsx#L552) |                   href="/dashboard/barber/challenge" |
| [app/challenge/page.tsx:558](../../app/challenge/page.tsx#L558) |                   href="/dashboard/shop/challenge" |
| [app/challenge/page.tsx:863](../../app/challenge/page.tsx#L863) |               href="/dashboard/barber/challenge" |
| [app/challenge/page.tsx:869](../../app/challenge/page.tsx#L869) |               href="/dashboard/shop/challenge" |
| [app/cities/page.tsx:19](../../app/cities/page.tsx#L19) |             collection(db, 'professionalProfiles'), |
| [app/cities/page.tsx:20](../../app/cities/page.tsx#L20) |             where('isLive', '==', true) |
| [app/cities/page.tsx:124](../../app/cities/page.tsx#L124) |                   href={`/barbers?city=${encodeURIComponent(city.city)}`} |
| [app/contact/page.tsx:12](../../app/contact/page.tsx#L12) |   role: 'client', |
| [app/contact/page.tsx:34](../../app/contact/page.tsx#L34) |       role: f.role === 'client' && appUser?.role === 'professional' ? 'professional' : f.role, |
| [app/contact/page.tsx:49](../../app/contact/page.tsx#L49) |       await addDoc(collection(db, 'contactMessages'), { |
| [app/contact/page.tsx:52](../../app/contact/page.tsx#L52) |         role: form.role, |
| [app/contact/page.tsx:124](../../app/contact/page.tsx#L124) |                       onChange={e =&gt; setForm(f =&gt; ({ ...f, role: e.target.value }))} |
| [app/contact/page.tsx:200](../../app/contact/page.tsx#L200) |                   &lt;a href="mailto:hello@titezme.com" className="text-lg font-black text-brand-yellow hover:underline"&gt;hello@titezme.com&lt;/a&gt; |
| [app/cookies/page.tsx:168](../../app/cookies/page.tsx#L168) |             &lt;a href="/privacy" style={{ color: '#F5C518', textDecoration: 'none' }}&gt;Privacy Policy&lt;/a&gt;. |
| [app/dashboard/barber/bookings/page.tsx:70](../../app/dashboard/barber/bookings/page.tsx#L70) |     queryFn: async () =&gt; { const s = await getDoc(doc(db, 'professionalProfiles', user!.uid)); return s.exists() ? s.data() : null; }, |
| [app/dashboard/barber/bookings/page.tsx:76](../../app/dashboard/barber/bookings/page.tsx#L76) |     const q = query(collection(db, 'bookings'), where('barberId', '==', user.uid), orderBy('createdAt', 'desc')); |
| [app/dashboard/barber/bookings/page.tsx:90](../../app/dashboard/barber/bookings/page.tsx#L90) |             updateDoc(doc(db, 'bookings', booking.id), { |
| [app/dashboard/barber/bookings/page.tsx:100](../../app/dashboard/barber/bookings/page.tsx#L100) |               addDoc(collection(db, 'notifications'), { |
| [app/dashboard/barber/bookings/page.tsx:108](../../app/dashboard/barber/bookings/page.tsx#L108) |             updateDoc(doc(db, 'users', booking.clientId), { unreadCount: increment(1) }).catch(console.error); |
| [app/dashboard/barber/bookings/page.tsx:168](../../app/dashboard/barber/bookings/page.tsx#L168) |         batch.update(doc(db, 'bookings', id), { |
| [app/dashboard/barber/bookings/page.tsx:174](../../app/dashboard/barber/bookings/page.tsx#L174) |         batch.update(doc(db, 'bookings', id), bookingUpdateSchema.parse({ status, updatedAt: timeNow })); |
| [app/dashboard/barber/bookings/page.tsx:184](../../app/dashboard/barber/bookings/page.tsx#L184) |         updateDoc(doc(db, 'professionalProfiles', user.uid), { |
| [app/dashboard/barber/bookings/page.tsx:212](../../app/dashboard/barber/bookings/page.tsx#L212) |         await addDoc(collection(db, 'notifications'), notificationSchema.parse({ userId: booking.clientId, message, read: false, linkTo, createdAt: Date.now() })); |
| [app/dashboard/barber/bookings/page.tsx:213](../../app/dashboard/barber/bookings/page.tsx#L213) |         updateDoc(doc(db, 'users', booking.clientId), { unreadCount: increment(1) }).catch(console.error); |
| [app/dashboard/barber/create-shop/page.tsx:104](../../app/dashboard/barber/create-shop/page.tsx#L104) |   if (!user \|\| appUser?.role !== 'professional') { |
| [app/dashboard/barber/create-shop/page.tsx:105](../../app/dashboard/barber/create-shop/page.tsx#L105) |     router.replace('/'); |
| [app/dashboard/barber/create-shop/page.tsx:109](../../app/dashboard/barber/create-shop/page.tsx#L109) |   if (appUser?.ownsShop) { |
| [app/dashboard/barber/create-shop/page.tsx:110](../../app/dashboard/barber/create-shop/page.tsx#L110) |     router.replace('/dashboard/shop'); |
| [app/dashboard/barber/create-shop/page.tsx:125](../../app/dashboard/barber/create-shop/page.tsx#L125) |       const shopRef = doc(db, 'businesses', user.uid); |
| [app/dashboard/barber/create-shop/page.tsx:150](../../app/dashboard/barber/create-shop/page.tsx#L150) |       const userRef = doc(db, 'users', user.uid); |
| [app/dashboard/barber/create-shop/page.tsx:152](../../app/dashboard/barber/create-shop/page.tsx#L152) |               ownsShop: true |
| [app/dashboard/barber/create-shop/page.tsx:155](../../app/dashboard/barber/create-shop/page.tsx#L155) |       const profileRef = doc(db, 'professionalProfiles', user.uid); |
| [app/dashboard/barber/create-shop/page.tsx:161](../../app/dashboard/barber/create-shop/page.tsx#L161) |       router.push('/dashboard/shop'); |
| [app/dashboard/barber/create-shop/page.tsx:177](../../app/dashboard/barber/create-shop/page.tsx#L177) |           &lt;Link href="/dashboard/barber" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#888] hover:text-white transition-colors"&gt; |
| [app/dashboard/barber/layout.tsx:34](../../app/dashboard/barber/layout.tsx#L34) |       collection(db, 'notifications'), |
| [app/dashboard/barber/layout.tsx:35](../../app/dashboard/barber/layout.tsx#L35) |       where('userId', '==', user.uid), |
| [app/dashboard/barber/layout.tsx:36](../../app/dashboard/barber/layout.tsx#L36) |       where('type', 'in', ['challenge_approved', 'challenge_rejected']), |
| [app/dashboard/barber/layout.tsx:37](../../app/dashboard/barber/layout.tsx#L37) |       where('read', '==', false) |
| [app/dashboard/barber/layout.tsx:50](../../app/dashboard/barber/layout.tsx#L50) |       const snap = await getDoc(doc(db, 'professionalProfiles', user!.uid)); |
| [app/dashboard/barber/layout.tsx:59](../../app/dashboard/barber/layout.tsx#L59) |       const snap = await getDoc(doc(db, 'schedules', `${user!.uid}_shard_0`)); |
| [app/dashboard/barber/layout.tsx:69](../../app/dashboard/barber/layout.tsx#L69) |       const q = query(collection(db, 'services'), where("providerId", "==", user!.uid)); |
| [app/dashboard/barber/layout.tsx:105](../../app/dashboard/barber/layout.tsx#L105) |   const saveLiveStatus = async (isLive: boolean) =&gt; { |
| [app/dashboard/barber/layout.tsx:108](../../app/dashboard/barber/layout.tsx#L108) |       await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ isLive })); |
| [app/dashboard/barber/layout.tsx:110](../../app/dashboard/barber/layout.tsx#L110) |       setToastMessage(isLive ? t('barberLayout.nowAcceptingBookings') : t('barberLayout.bookingsPaused')); |
| [app/dashboard/barber/layout.tsx:148](../../app/dashboard/barber/layout.tsx#L148) |             {profile?.isLive ? ( |
| [app/dashboard/barber/layout.tsx:187](../../app/dashboard/barber/layout.tsx#L187) |               href={l.href} |
| [app/dashboard/barber/layout.tsx:204](../../app/dashboard/barber/layout.tsx#L204) |           {appUser?.ownsShop ? ( |
| [app/dashboard/barber/layout.tsx:206](../../app/dashboard/barber/layout.tsx#L206) |               href="/dashboard/shop" |
| [app/dashboard/barber/layout.tsx:213](../../app/dashboard/barber/layout.tsx#L213) |               href="/dashboard/barber/create-shop" |
| [app/dashboard/barber/layout.tsx:220](../../app/dashboard/barber/layout.tsx#L220) |               href={`/shop/${profile?.businessId}`} |
| [app/dashboard/barber/layout.tsx:240](../../app/dashboard/barber/layout.tsx#L240) |                 &lt;Link key={i} href={item.path} |
| [app/dashboard/barber/layout.tsx:253](../../app/dashboard/barber/layout.tsx#L253) |               &lt;input type="checkbox" checked={profile?.isLive \|\| false} onChange={e =&gt; saveLiveStatus(e.target.checked)} className="peer sr-only" /&gt; |
| [app/dashboard/barber/layout.tsx:260](../../app/dashboard/barber/layout.tsx#L260) |             href="/dashboard/client" |
| [app/dashboard/barber/layout.tsx:285](../../app/dashboard/barber/layout.tsx#L285) |             href={item.href} |
| [app/dashboard/barber/page.tsx:74](../../app/dashboard/barber/page.tsx#L74) |       router.replace('/login'); |
| [app/dashboard/barber/page.tsx:81](../../app/dashboard/barber/page.tsx#L81) |       const snap = await getDoc(doc(db, 'professionalProfiles', user!.uid)); |
| [app/dashboard/barber/page.tsx:90](../../app/dashboard/barber/page.tsx#L90) |       const snap = await getDoc(doc(db, 'schedules', `${user!.uid}_shard_0`)); |
| [app/dashboard/barber/page.tsx:99](../../app/dashboard/barber/page.tsx#L99) |       const q = query(collection(db, 'services'), where("providerId", "==", user!.uid)); |
| [app/dashboard/barber/page.tsx:109](../../app/dashboard/barber/page.tsx#L109) |       collection(db, 'bookings'), |
| [app/dashboard/barber/page.tsx:110](../../app/dashboard/barber/page.tsx#L110) |       where('barberId', '==', user.uid), |
| [app/dashboard/barber/page.tsx:124](../../app/dashboard/barber/page.tsx#L124) |       collection(db, 'bookings'), |
| [app/dashboard/barber/page.tsx:125](../../app/dashboard/barber/page.tsx#L125) |       where('clientId', '==', user.uid), |
| [app/dashboard/barber/page.tsx:126](../../app/dashboard/barber/page.tsx#L126) |       where('status', 'in', ['pending', 'confirmed']), |
| [app/dashboard/barber/page.tsx:143](../../app/dashboard/barber/page.tsx#L143) |       collection(db, 'notifications'), |
| [app/dashboard/barber/page.tsx:144](../../app/dashboard/barber/page.tsx#L144) |       where('userId', '==', user.uid), |
| [app/dashboard/barber/page.tsx:161](../../app/dashboard/barber/page.tsx#L161) |       batch.update(doc(db, 'bookings', id), bookingUpdateSchema.parse({ status, updatedAt: timeNow })); |
| [app/dashboard/barber/page.tsx:180](../../app/dashboard/barber/page.tsx#L180) |         await addDoc(collection(db, 'notifications'), notificationSchema.parse({ |
| [app/dashboard/barber/page.tsx:187](../../app/dashboard/barber/page.tsx#L187) |         updateDoc(doc(db, 'users', booking.clientId), { unreadCount: increment(1) }).catch(console.error); |
| [app/dashboard/barber/page.tsx:232](../../app/dashboard/barber/page.tsx#L232) |       await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { blockedDates: arrayUnion(...items) }); |
| [app/dashboard/barber/page.tsx:234](../../app/dashboard/barber/page.tsx#L234) |         await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { recurringBlocked: arrayUnion(...recurringDays) }); |
| [app/dashboard/barber/page.tsx:253](../../app/dashboard/barber/page.tsx#L253) |       await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { blockedDates: arrayRemove(rawItem) }); |
| [app/dashboard/barber/page.tsx:266](../../app/dashboard/barber/page.tsx#L266) |       await updateDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { recurringBlocked: arrayRemove(day) }); |
| [app/dashboard/barber/page.tsx:352](../../app/dashboard/barber/page.tsx#L352) |     updateDoc(doc(db, 'professionalProfiles', user.uid), { profileCompletedAt: Date.now() }).catch(console.error); |
| [app/dashboard/barber/page.tsx:403](../../app/dashboard/barber/page.tsx#L403) |               &lt;Link key={l.href} href={l.href} className="text-[13px] font-bold text-brand-yellow hover:underline"&gt;{l.label}&lt;/Link&gt; |
| [app/dashboard/barber/page.tsx:416](../../app/dashboard/barber/page.tsx#L416) |         await updateDoc(doc(db, 'professionalProfiles', user.uid), { |
| [app/dashboard/barber/page.tsx:454](../../app/dashboard/barber/page.tsx#L454) |             href="/dashboard/barber/availability" |
| [app/dashboard/barber/page.tsx:469](../../app/dashboard/barber/page.tsx#L469) |             href={`/barber/${user?.uid}`} |
| [app/dashboard/barber/page.tsx:533](../../app/dashboard/barber/page.tsx#L533) |                 href={tabPaths[item.tab] \|\| '/dashboard/barber/settings'} |
| [app/dashboard/barber/page.tsx:589](../../app/dashboard/barber/page.tsx#L589) |           &lt;Link href="/dashboard/barber/services" style={{ color: '#F5C518', fontSize: '11px', fontWeight: 800, textDecoration: 'none' }}&gt;{t('barberDash.addServicesLink')}&lt;/Link&gt; |
| [app/dashboard/barber/page.tsx:691](../../app/dashboard/barber/page.tsx#L691) |             href="/dashboard/client" |
| [app/dashboard/barber/portfolio/page.tsx:14](../../app/dashboard/barber/portfolio/page.tsx#L14) |     queryFn: async () =&gt; { const s = await getDoc(doc(db, 'professionalProfiles', user!.uid)); return s.exists() ? s.data() : null; }, |
| [app/dashboard/barber/services/page.tsx:52](../../app/dashboard/barber/services/page.tsx#L52) |     queryFn: async () =&gt; { const s = await getDoc(doc(db, 'professionalProfiles', user!.uid)); const d = s.exists() ? s.data() : null; if (d?.titeZMeCut) setTitzData({ duration: d.titeZMeCut.durationMinutes?.toString() \|\| '45', price: d.titeZMeCut.price?.toString() \|\| '20' }); return d; }, |
| [app/dashboard/barber/services/page.tsx:58](../../app/dashboard/barber/services/page.tsx#L58) |     queryFn: async () =&gt; { const q = query(collection(db, 'services'), where('providerId', '==', user!.uid)); const snap = await getDocs(q); return snap.docs.map(d =&gt; ({ id: d.id, ...d.data() } as any)); }, |
| [app/dashboard/barber/services/page.tsx:71](../../app/dashboard/barber/services/page.tsx#L71) |     try { await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ titeZMeCut: { durationMinutes: parseInt(titzData.duration) \|\| 45, price: parseFloat(titzData.price) \|\| 20, currency: serviceCurrency } })); mutateProfile(); } catch (e) { console.error(e); } |
| [app/dashboard/barber/services/page.tsx:81](../../app/dashboard/barber/services/page.tsx#L81) |         () =&gt; setDoc(doc(collection(db, 'services')), { providerId: user.uid, providerType: 'barber', name: sanitizeText(newServiceName, 100), duration: parseInt(newServiceDuration) \|\| 30, price: parseFloat(newServicePrice), description: sanitizeText(newServiceDescription, 150), isActive: true, sortOrder: (services as any[]).length }), |
| [app/dashboard/barber/services/page.tsx:92](../../app/dashboard/barber/services/page.tsx#L92) |     try { await updateDoc(doc(db, 'services', svcId), { name: sanitizeText(editSvcData.name, 100), duration: parseInt(editSvcData.duration) \|\| 30, price: parseFloat(editSvcData.price) \|\| 0, description: sanitizeText(editSvcData.description, 150), updatedAt: Date.now() }); setEditingServiceId(null); toast(t('barberDash.serviceUpdated')); mutateServices(); } catch (e) { console.error(e); } finally { setSavingService(false); } |
| [app/dashboard/barber/services/page.tsx:101](../../app/dashboard/barber/services/page.tsx#L101) |       await updateDoc(doc(db, 'services', svcId), { isActive: !currentIsActive }); |
| [app/dashboard/barber/services/page.tsx:119](../../app/dashboard/barber/services/page.tsx#L119) |     batch.update(doc(db, 'services', sorted[idx].id), { sortOrder: swapIdx }); |
| [app/dashboard/barber/services/page.tsx:120](../../app/dashboard/barber/services/page.tsx#L120) |     batch.update(doc(db, 'services', sorted[swapIdx].id), { sortOrder: idx }); |
| [app/dashboard/barber/services/page.tsx:126](../../app/dashboard/barber/services/page.tsx#L126) |     try { await updateDoc(doc(db, 'professionalProfiles', user.uid), { currency: newCurrency }); mutateProfile(); toast(t('barberDash.currencyUpdated').replace('{currency}', newCurrency)); } catch (e) { console.error(e); } |
| [app/dashboard/barber/services/page.tsx:233](../../app/dashboard/barber/services/page.tsx#L233) |           await safeFirestore(() =&gt; deleteDoc(doc(db, 'services', confirmDelete!)), { successMessage: t('barberDash.serviceDeleted'), errorMessage: t('barberDash.failedDeleteService') }); |
| [app/dashboard/barber/settings/page.tsx:14](../../app/dashboard/barber/settings/page.tsx#L14) |     queryFn: async () =&gt; { const s = await getDoc(doc(db, 'professionalProfiles', user!.uid)); return s.exists() ? s.data() : null; }, |
| [app/dashboard/client/bookings/page.tsx:42](../../app/dashboard/client/bookings/page.tsx#L42) |       collection(db, 'bookings'), |
| [app/dashboard/client/bookings/page.tsx:43](../../app/dashboard/client/bookings/page.tsx#L43) |       where('clientId', '==', user.uid), |
| [app/dashboard/client/bookings/page.tsx:56](../../app/dashboard/client/bookings/page.tsx#L56) |                 const bProfile = await getDoc(doc(db, 'users', b.barberId)); |
| [app/dashboard/client/bookings/page.tsx:70](../../app/dashboard/client/bookings/page.tsx#L70) |                 const svc = await getDoc(doc(db, 'services', b.serviceId)); |
| [app/dashboard/client/bookings/page.tsx:84](../../app/dashboard/client/bookings/page.tsx#L84) |                 const shopSnap = await getDoc(doc(db, 'businesses', b.shopId)); |
| [app/dashboard/client/bookings/page.tsx:126](../../app/dashboard/client/bookings/page.tsx#L126) |       await updateDoc(doc(db, 'bookings', bId), bookingUpdateSchema.parse({ status: 'cancelled_by_client', updatedAt: timeNow })); |
| [app/dashboard/client/bookings/page.tsx:167](../../app/dashboard/client/bookings/page.tsx#L167) |               {t('clientDash.noUpcomingBookings')} &lt;Link href="/barbers" className="text-brand-yellow font-bold no-underline"&gt;{t('emptyStates.findABarber')}&lt;/Link&gt; · &lt;Link href="/shops" className="text-brand-yellow font-bold no-underline"&gt;{t('clientDash.findABarbershop')}&lt;/Link&gt; |
| [app/dashboard/client/bookings/page.tsx:218](../../app/dashboard/client/bookings/page.tsx#L218) |                         href={b.shopGoogleMapsUrl} |
| [app/dashboard/client/bookings/page.tsx:249](../../app/dashboard/client/bookings/page.tsx#L249) |                           onClick={() =&gt; router.push(`/review/${b.id}`)} |
| [app/dashboard/client/bookings/page.tsx:299](../../app/dashboard/client/bookings/page.tsx#L299) |                        : &lt;button onClick={() =&gt; router.push(`/review/${b.id}`)} className="text-[10px] font-extrabold text-brand-yellow hover:underline"&gt;{t('clientDash.leaveReview')}&lt;/button&gt; |
| [app/dashboard/client/favorites/page.tsx:21](../../app/dashboard/client/favorites/page.tsx#L21) |   isLive?: boolean; |
| [app/dashboard/client/favorites/page.tsx:36](../../app/dashboard/client/favorites/page.tsx#L36) |         favoriteIds.map(id =&gt; getDoc(doc(db, 'professionalProfiles', id))) |
| [app/dashboard/client/favorites/page.tsx:59](../../app/dashboard/client/favorites/page.tsx#L59) |               href="/barbers" |
| [app/dashboard/client/favorites/page.tsx:68](../../app/dashboard/client/favorites/page.tsx#L68) |               const unavailable = b.isLive === false \|\| (b.approvalStatus && b.approvalStatus !== 'approved'); |
| [app/dashboard/client/favorites/page.tsx:116](../../app/dashboard/client/favorites/page.tsx#L116) |                       href={`/barber/${b.id}`} |
| [app/dashboard/client/layout.tsx:20](../../app/dashboard/client/layout.tsx#L20) |       router.replace('/login'); |
| [app/dashboard/client/layout.tsx:23](../../app/dashboard/client/layout.tsx#L23) |     if (appUser?.role === 'professional') { |
| [app/dashboard/client/layout.tsx:24](../../app/dashboard/client/layout.tsx#L24) |       router.replace('/dashboard/barber'); |
| [app/dashboard/client/layout.tsx:27](../../app/dashboard/client/layout.tsx#L27) |     if (appUser?.role !== 'client') { |
| [app/dashboard/client/layout.tsx:28](../../app/dashboard/client/layout.tsx#L28) |       router.replace('/login'); |
| [app/dashboard/client/layout.tsx:75](../../app/dashboard/client/layout.tsx#L75) |               href={l.href} |
| [app/dashboard/client/layout.tsx:110](../../app/dashboard/client/layout.tsx#L110) |             href={item.href} |
| [app/dashboard/client/page.tsx:10](../../app/dashboard/client/page.tsx#L10) |     router.replace('/dashboard/client/bookings'); |
| [app/dashboard/client/reviews/page.tsx:45](../../app/dashboard/client/reviews/page.tsx#L45) |         collection(db, 'reviews'), |
| [app/dashboard/client/reviews/page.tsx:46](../../app/dashboard/client/reviews/page.tsx#L46) |         where('clientId', '==', user.uid) |
| [app/dashboard/client/reviews/page.tsx:53](../../app/dashboard/client/reviews/page.tsx#L53) |             const s = await getDoc(doc(db, 'businesses', r.providerId)); |
| [app/dashboard/client/reviews/page.tsx:62](../../app/dashboard/client/reviews/page.tsx#L62) |             const p = await getDoc(doc(db, 'professionalProfiles', r.providerId)); |
| [app/dashboard/client/settings/page.tsx:186](../../app/dashboard/client/settings/page.tsx#L186) |       await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse(updateData)); |
| [app/dashboard/client/settings/page.tsx:220](../../app/dashboard/client/settings/page.tsx#L220) |       await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse({ photoUrl: url })); |
| [app/dashboard/shop/availability/page.tsx:15](../../app/dashboard/shop/availability/page.tsx#L15) |       const s = await getDoc(doc(db, 'schedules', `${user!.uid}_shard_0`)); |
| [app/dashboard/shop/bookings/page.tsx:71](../../app/dashboard/shop/bookings/page.tsx#L71) |     if (!loading && !user) router.replace('/login'); |
| [app/dashboard/shop/bookings/page.tsx:77](../../app/dashboard/shop/bookings/page.tsx#L77) |     getDoc(doc(db, 'businesses', user.uid)).then(s =&gt; { |
| [app/dashboard/shop/bookings/page.tsx:85](../../app/dashboard/shop/bookings/page.tsx#L85) |     const q = query(collection(db, 'bookings'), where('shopId', '==', user.uid)); |
| [app/dashboard/shop/bookings/page.tsx:93](../../app/dashboard/shop/bookings/page.tsx#L93) |           const uSnap = await getDoc(doc(db, 'users', b.barberId)); |
| [app/dashboard/shop/bookings/page.tsx:101](../../app/dashboard/shop/bookings/page.tsx#L101) |           const cSnap = await getDoc(doc(db, 'users', b.clientId)); |
| [app/dashboard/shop/bookings/page.tsx:187](../../app/dashboard/shop/bookings/page.tsx#L187) |       await updateDoc(doc(db, 'bookings', bookingId), bookingUpdateSchema.parse({ status: newStatus, updatedAt: Date.now() })); |
| [app/dashboard/shop/challenge/page.tsx:15](../../app/dashboard/shop/challenge/page.tsx#L15) |     queryFn: () =&gt; getDoc(doc(db, 'businesses', user!.uid)), |
| [app/dashboard/shop/earnings/page.tsx:66](../../app/dashboard/shop/earnings/page.tsx#L66) |     if (!loading && !user) router.replace('/login'); |
| [app/dashboard/shop/earnings/page.tsx:72](../../app/dashboard/shop/earnings/page.tsx#L72) |     getDoc(doc(db, 'businesses', user.uid)).then(s =&gt; { |
| [app/dashboard/shop/earnings/page.tsx:80](../../app/dashboard/shop/earnings/page.tsx#L80) |     const q = query(collection(db, 'bookings'), where('shopId', '==', user.uid)); |
| [app/dashboard/shop/earnings/page.tsx:90](../../app/dashboard/shop/earnings/page.tsx#L90) |     const q = query(collection(db, 'professionalProfiles'), where('businessId', '==', user.uid)); |
| [app/dashboard/shop/earnings/page.tsx:97](../../app/dashboard/shop/earnings/page.tsx#L97) |         const uSnap = await getDoc(doc(db, 'users', b.userId \|\| b.id)); |
| [app/dashboard/shop/layout.tsx:24](../../app/dashboard/shop/layout.tsx#L24) |       collection(db, 'notifications'), |
| [app/dashboard/shop/layout.tsx:25](../../app/dashboard/shop/layout.tsx#L25) |       where('userId', '==', user.uid), |
| [app/dashboard/shop/layout.tsx:26](../../app/dashboard/shop/layout.tsx#L26) |       where('type', 'in', ['challenge_approved', 'challenge_rejected']), |
| [app/dashboard/shop/layout.tsx:27](../../app/dashboard/shop/layout.tsx#L27) |       where('read', '==', false) |
| [app/dashboard/shop/layout.tsx:40](../../app/dashboard/shop/layout.tsx#L40) |       router.replace('/login'); |
| [app/dashboard/shop/layout.tsx:43](../../app/dashboard/shop/layout.tsx#L43) |     if (!appUser?.ownsShop) { |
| [app/dashboard/shop/layout.tsx:44](../../app/dashboard/shop/layout.tsx#L44) |       router.replace( |
| [app/dashboard/shop/layout.tsx:45](../../app/dashboard/shop/layout.tsx#L45) |         appUser?.role === 'client' |
| [app/dashboard/shop/layout.tsx:54](../../app/dashboard/shop/layout.tsx#L54) |     queryFn: async () =&gt; { const s = await getDoc(doc(db, 'businesses', user!.uid)); return s.exists() ? s.data() : null; }, |
| [app/dashboard/shop/layout.tsx:60](../../app/dashboard/shop/layout.tsx#L60) |     queryFn: async () =&gt; { const s = await getDoc(doc(db, 'schedules', `${user!.uid}_shard_0`)); return s.exists() ? s.data() : null; }, |
| [app/dashboard/shop/layout.tsx:126](../../app/dashboard/shop/layout.tsx#L126) |             &lt;Link key={l.href} href={l.href} |
| [app/dashboard/shop/layout.tsx:140](../../app/dashboard/shop/layout.tsx#L140) |         {appUser?.role === 'professional' && ( |
| [app/dashboard/shop/layout.tsx:142](../../app/dashboard/shop/layout.tsx#L142) |             &lt;Link href="/dashboard/barber" className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-bold text-[#888] hover:bg-[#1a1a1a] hover:text-white transition-colors"&gt; |
| [app/dashboard/shop/layout.tsx:163](../../app/dashboard/shop/layout.tsx#L163) |           &lt;Link key={item.href} href={item.href} |
| [app/dashboard/shop/page.tsx:151](../../app/dashboard/shop/page.tsx#L151) |     if (!loading && !user) router.replace("/login"); |
| [app/dashboard/shop/page.tsx:157](../../app/dashboard/shop/page.tsx#L157) |     getDoc(doc(db, "businesses", user.uid)).then((snap) =&gt; { |
| [app/dashboard/shop/page.tsx:165](../../app/dashboard/shop/page.tsx#L165) |     const q = query(collection(db, "professionalProfiles"), where("businessId", "==", user.uid)); |
| [app/dashboard/shop/page.tsx:175](../../app/dashboard/shop/page.tsx#L175) |     const q = query(collection(db, "bookings"), where("shopId", "==", user.uid)); |
| [app/dashboard/shop/page.tsx:186](../../app/dashboard/shop/page.tsx#L186) |       collection(db, "invites"), |
| [app/dashboard/shop/page.tsx:187](../../app/dashboard/shop/page.tsx#L187) |       where("shopId", "==", user.uid), |
| [app/dashboard/shop/page.tsx:188](../../app/dashboard/shop/page.tsx#L188) |       where("status", "==", "pending") |
| [app/dashboard/shop/page.tsx:205](../../app/dashboard/shop/page.tsx#L205) |           const snap = await getDoc(doc(db, "schedules", `${b.id}_shard_0`)); |
| [app/dashboard/shop/page.tsx:216](../../app/dashboard/shop/page.tsx#L216) |         collection(db, "services"), |
| [app/dashboard/shop/page.tsx:217](../../app/dashboard/shop/page.tsx#L217) |         where("providerId", "==", user.uid), |
| [app/dashboard/shop/page.tsx:218](../../app/dashboard/shop/page.tsx#L218) |         where("providerType", "==", "shop") |
| [app/dashboard/shop/page.tsx:437](../../app/dashboard/shop/page.tsx#L437) |           onClick={() =&gt; router.push("/dashboard/shop/team")} |
| [app/dashboard/shop/page.tsx:443](../../app/dashboard/shop/page.tsx#L443) |           href={`/shop/${user?.uid}`} |
| [app/dashboard/shop/page.tsx:451](../../app/dashboard/shop/page.tsx#L451) |           onClick={() =&gt; router.push("/dashboard/shop/availability")} |
| [app/dashboard/shop/page.tsx:485](../../app/dashboard/shop/page.tsx#L485) |             &lt;Link href="/dashboard/shop/team" className="text-[#F5C518] hover:underline"&gt; |
| [app/dashboard/shop/page.tsx:548](../../app/dashboard/shop/page.tsx#L548) |                   href={item.href} |
| [app/dashboard/shop/page.tsx:569](../../app/dashboard/shop/page.tsx#L569) |             &lt;Link href="/dashboard/shop/team" className="text-[#F5C518] hover:underline"&gt; |
| [app/dashboard/shop/page.tsx:645](../../app/dashboard/shop/page.tsx#L645) |                           href={`/barber/${b.id}`} |
| [app/dashboard/shop/photos/page.tsx:12](../../app/dashboard/shop/photos/page.tsx#L12) |     queryFn: async () =&gt; { const s = await getDoc(doc(db, 'businesses', user!.uid)); return s.exists() ? s.data() : null; }, |
| [app/dashboard/shop/reviews/page.tsx:37](../../app/dashboard/shop/reviews/page.tsx#L37) |     if (!loading && !user) router.replace('/login'); |
| [app/dashboard/shop/reviews/page.tsx:43](../../app/dashboard/shop/reviews/page.tsx#L43) |     const q = query(collection(db, 'professionalProfiles'), where('businessId', '==', user.uid)); |
| [app/dashboard/shop/reviews/page.tsx:49](../../app/dashboard/shop/reviews/page.tsx#L49) |         const uSnap = await getDoc(doc(db, 'users', b.userId \|\| b.id)); |
| [app/dashboard/shop/reviews/page.tsx:68](../../app/dashboard/shop/reviews/page.tsx#L68) |           collection(db, 'reviews'), |
| [app/dashboard/shop/reviews/page.tsx:69](../../app/dashboard/shop/reviews/page.tsx#L69) |           where('providerType', '==', 'shop'), |
| [app/dashboard/shop/reviews/page.tsx:70](../../app/dashboard/shop/reviews/page.tsx#L70) |           where('providerId', '==', user.uid) |
| [app/dashboard/shop/reviews/page.tsx:78](../../app/dashboard/shop/reviews/page.tsx#L78) |             getDocs(query(collection(db, 'reviews'), where('providerId', '==', b.id))) |
| [app/dashboard/shop/services/page.tsx:12](../../app/dashboard/shop/services/page.tsx#L12) |     queryFn: async () =&gt; { const s = await getDoc(doc(db, 'businesses', user!.uid)); return s.exists() ? s.data() : null; }, |
| [app/dashboard/shop/services/page.tsx:17](../../app/dashboard/shop/services/page.tsx#L17) |     queryFn: async () =&gt; { const q = query(collection(db, 'services'), where('providerId', '==', user!.uid), where('providerType', '==', 'shop')); const snap = await getDocs(q); return snap.docs.map(d =&gt; ({ id: d.id, ...d.data() } as any)); }, |
| [app/dashboard/shop/settings/page.tsx:12](../../app/dashboard/shop/settings/page.tsx#L12) |     queryFn: async () =&gt; { const s = await getDoc(doc(db, 'businesses', user!.uid)); return s.exists() ? s.data() : null; }, |
| [app/for-barbers/page.tsx:45](../../app/for-barbers/page.tsx#L45) |         &lt;a href="/onboarding/professional" style={{ |
| [app/for-barbers/page.tsx:245](../../app/for-barbers/page.tsx#L245) |         &lt;a href="/onboarding/professional" style={{ |
| [app/for-shops/page.tsx:460](../../app/for-shops/page.tsx#L460) |         href="https://wa.me/34692736281" |
| [app/for-shops/page.tsx:516](../../app/for-shops/page.tsx#L516) |               &lt;a href="/dashboard/barber" style={{ |
| [app/for-shops/page.tsx:817](../../app/for-shops/page.tsx#L817) |                 &lt;a href="/dashboard/barber" className="chair-btn"&gt; |
| [app/for-shops/page.tsx:1049](../../app/for-shops/page.tsx#L1049) |               &lt;a href="/dashboard/barber" style={{ |
| [app/for-shops/page.tsx:1169](../../app/for-shops/page.tsx#L1169) |               &lt;a href="/dashboard/barber" style={{ |
| [app/forgot-password/page.tsx:62](../../app/forgot-password/page.tsx#L62) |               href="/login" |
| [app/forgot-password/page.tsx:169](../../app/forgot-password/page.tsx#L169) |               href="/login" |
| [app/how-it-works/page.tsx:74](../../app/how-it-works/page.tsx#L74) |           &lt;Link href="/#browse-barbers" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90 inline-block"&gt; |
| [app/LandingPageClient.tsx:101](../../app/LandingPageClient.tsx#L101) |               &lt;Link href="/barbers" |
| [app/LandingPageClient.tsx:105](../../app/LandingPageClient.tsx#L105) |               &lt;Link href="/shops" |
| [app/LandingPageClient.tsx:198](../../app/LandingPageClient.tsx#L198) |               &lt;Link href="/signup" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90"&gt; |
| [app/LandingPageClient.tsx:201](../../app/LandingPageClient.tsx#L201) |               &lt;Link href="/how-it-works" className="border border-[#2a2a2a] text-white font-bold px-8 py-4 rounded-full hover:bg-[#1a1a1a] transition-colors"&gt; |
| [app/LandingPageClient.tsx:249](../../app/LandingPageClient.tsx#L249) |               &lt;Link href="/signup" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90"&gt; |
| [app/LandingPageClient.tsx:252](../../app/LandingPageClient.tsx#L252) |               &lt;Link href="/how-it-works" className="border border-[#2a2a2a] text-white font-bold px-8 py-4 rounded-full hover:bg-[#1a1a1a] transition-colors"&gt; |
| [app/LandingPageClient.tsx:285](../../app/LandingPageClient.tsx#L285) |               const isLive = city.barbers &gt; 0 \|\| city.shops &gt; 0; |
| [app/LandingPageClient.tsx:286](../../app/LandingPageClient.tsx#L286) |               const isFirst = i === 0 && isLive; |
| [app/LandingPageClient.tsx:288](../../app/LandingPageClient.tsx#L288) |                 &lt;div key={city.city} className={`p-6 rounded-3xl border transition-colors ${isLive ? 'bg-[#111] border-[#2a2a2a] hover:border-brand-yellow/50' : 'bg-[#0f0f0f] border-[#1a1a1a] opacity-60'}`}&gt; |
| [app/LandingPageClient.tsx:292](../../app/LandingPageClient.tsx#L292) |                     {isLive |
| [app/LandingPageClient.tsx:296](../../app/LandingPageClient.tsx#L296) |                   {isLive ? ( |
| [app/LandingPageClient.tsx:297](../../app/LandingPageClient.tsx#L297) |                     &lt;Link href="/barbers" className="text-sm font-black text-brand-yellow"&gt;{t('buttons.explore')}&lt;/Link&gt; |
| [app/login/page.tsx:34](../../app/login/page.tsx#L34) |         const snap = await getDoc(doc(db, 'aggregations', 'stats')); |
| [app/login/page.tsx:50](../../app/login/page.tsx#L50) |     return &lt;VerifyEmailGate onVerified={() =&gt; router.push(verifyDest)} /&gt;; |
| [app/login/page.tsx:55](../../app/login/page.tsx#L55) |     if (!user.emailVerified && appUser?.role !== 'admin') { |
| [app/login/page.tsx:56](../../app/login/page.tsx#L56) |       const dest = appUser?.isOnboarded |
| [app/login/page.tsx:57](../../app/login/page.tsx#L57) |         ? (appUser?.role === 'professional' ? '/dashboard/barber' : '/dashboard/client') |
| [app/login/page.tsx:58](../../app/login/page.tsx#L58) |         : (appUser?.role === 'professional' ? '/onboarding/professional' : '/onboarding/client'); |
| [app/login/page.tsx:59](../../app/login/page.tsx#L59) |       return &lt;VerifyEmailGate onVerified={() =&gt; router.push(dest)} /&gt;; |
| [app/login/page.tsx:61](../../app/login/page.tsx#L61) |     router.replace('/'); |
| [app/login/page.tsx:74](../../app/login/page.tsx#L74) |       let userDoc = await getDoc(doc(db, 'users', user.uid)); |
| [app/login/page.tsx:77](../../app/login/page.tsx#L77) |         userDoc = await getDoc(doc(db, 'users', user.uid)); |
| [app/login/page.tsx:93](../../app/login/page.tsx#L93) |       if (userData.role !== 'admin' && !user.emailVerified) { |
| [app/login/page.tsx:95](../../app/login/page.tsx#L95) |           userData.isOnboarded |
| [app/login/page.tsx:96](../../app/login/page.tsx#L96) |             ? (userData.role === 'professional' ? '/dashboard/barber' : '/dashboard/client') |
| [app/login/page.tsx:97](../../app/login/page.tsx#L97) |             : (userData.role === 'professional' ? '/onboarding/professional' : '/onboarding/client') |
| [app/login/page.tsx:105](../../app/login/page.tsx#L105) |         router.replace(redirectTo); |
| [app/login/page.tsx:109](../../app/login/page.tsx#L109) |       if (userData.role === 'admin') { |
| [app/login/page.tsx:110](../../app/login/page.tsx#L110) |         router.replace('/admin'); |
| [app/login/page.tsx:111](../../app/login/page.tsx#L111) |       } else if (userData.role === 'professional') { |
| [app/login/page.tsx:112](../../app/login/page.tsx#L112) |         router.replace(userData.isOnboarded ? '/dashboard/barber' : '/onboarding/professional'); |
| [app/login/page.tsx:114](../../app/login/page.tsx#L114) |         router.replace(userData.isOnboarded ? '/dashboard/client' : '/onboarding/client'); |
| [app/login/page.tsx:143](../../app/login/page.tsx#L143) |       const docRef = doc(db, 'users', userCredential.user.uid); |
| [app/login/page.tsx:149](../../app/login/page.tsx#L149) |         if (udata.role === 'admin' \|\| udata.isAdmin === true) { |
| [app/login/page.tsx:162](../../app/login/page.tsx#L162) |             udata.isOnboarded |
| [app/login/page.tsx:163](../../app/login/page.tsx#L163) |               ? (udata.role === 'professional' ? '/dashboard/barber' : '/dashboard/client') |
| [app/login/page.tsx:164](../../app/login/page.tsx#L164) |               : (udata.role === 'professional' ? '/onboarding/professional' : '/onboarding/client') |
| [app/login/page.tsx:173](../../app/login/page.tsx#L173) |           router.replace(redirectTo); |
| [app/login/page.tsx:177](../../app/login/page.tsx#L177) |         if (udata.role === 'client') { |
| [app/login/page.tsx:178](../../app/login/page.tsx#L178) |           if (udata.isOnboarded) router.push('/dashboard/client'); |
| [app/login/page.tsx:179](../../app/login/page.tsx#L179) |           else router.push('/onboarding/client'); |
| [app/login/page.tsx:181](../../app/login/page.tsx#L181) |         else if (udata.role === 'professional') { |
| [app/login/page.tsx:182](../../app/login/page.tsx#L182) |           if (udata.isOnboarded) { |
| [app/login/page.tsx:183](../../app/login/page.tsx#L183) |             router.push('/dashboard/barber'); |
| [app/login/page.tsx:185](../../app/login/page.tsx#L185) |             router.push('/onboarding/professional'); |
| [app/login/page.tsx:188](../../app/login/page.tsx#L188) |         else router.push('/'); |
| [app/login/page.tsx:190](../../app/login/page.tsx#L190) |         router.push('/'); |
| [app/login/page.tsx:351](../../app/login/page.tsx#L351) |             href="/forgot-password" |
| [app/login/page.tsx:379](../../app/login/page.tsx#L379) |                 href="/signup" |
| [app/login/page.tsx:433](../../app/login/page.tsx#L433) |             href="/terms" |
| [app/login/page.tsx:445](../../app/login/page.tsx#L445) |             href="/privacy" |
| [app/login/page.tsx:459](../../app/login/page.tsx#L459) |           {t('headings.newHere')} &lt;Link href="/signup" className="text-white font-extrabold hover:text-brand-yellow transition-colors"&gt;{t('buttons.createAccount')}&lt;/Link&gt; |
| [app/not-found.tsx:15](../../app/not-found.tsx#L15) |           href="/"  |
| [app/not-found.tsx:21](../../app/not-found.tsx#L21) |           href="/"  |
| [app/onboarding/client/page.tsx:32](../../app/onboarding/client/page.tsx#L32) |         track('onboarding_abandoned', { step: 1, role: 'client' }); |
| [app/onboarding/client/page.tsx:153](../../app/onboarding/client/page.tsx#L153) |       const userRef = doc(db, 'users', user.uid); |
| [app/onboarding/client/page.tsx:163](../../app/onboarding/client/page.tsx#L163) |               isOnboarded: true |
| [app/onboarding/client/page.tsx:166](../../app/onboarding/client/page.tsx#L166) |       // Reload so that AuthContext fetches the updated isOnboarded state |
| [app/onboarding/client/page.tsx:172](../../app/onboarding/client/page.tsx#L172) |         role: 'client', |
| [app/onboarding/professional/page.tsx:38](../../app/onboarding/professional/page.tsx#L38) |         track('onboarding_abandoned', { step: stepRef.current, role: 'professional' }); |
| [app/onboarding/professional/page.tsx:83](../../app/onboarding/professional/page.tsx#L83) |         await setDoc(doc(db, 'onboardingDrafts', user.uid), { |
| [app/onboarding/professional/page.tsx:140](../../app/onboarding/professional/page.tsx#L140) |         const draftSnap = await getDoc(doc(db, 'onboardingDrafts', user.uid)); |
| [app/onboarding/professional/page.tsx:258](../../app/onboarding/professional/page.tsx#L258) |       const profileRef = doc(db, 'professionalProfiles', user.uid); |
| [app/onboarding/professional/page.tsx:269](../../app/onboarding/professional/page.tsx#L269) |         existingProfile?.isLive ?? false; |
| [app/onboarding/professional/page.tsx:272](../../app/onboarding/professional/page.tsx#L272) |       const userRef = doc(db, 'users', user.uid); |
| [app/onboarding/professional/page.tsx:275](../../app/onboarding/professional/page.tsx#L275) |                   role: 'professional' |
| [app/onboarding/professional/page.tsx:288](../../app/onboarding/professional/page.tsx#L288) |           const q = query(collection(db, 'professionalProfiles'), where('professionalCode', '==', uniqueCode)); |
| [app/onboarding/professional/page.tsx:319](../../app/onboarding/professional/page.tsx#L319) |         isLive: false, |
| [app/onboarding/professional/page.tsx:320](../../app/onboarding/professional/page.tsx#L320) |         isOnboarded: true, |
| [app/onboarding/professional/page.tsx:337](../../app/onboarding/professional/page.tsx#L337) |             isLive: existingIsLive, |
| [app/onboarding/professional/page.tsx:351](../../app/onboarding/professional/page.tsx#L351) |       const scheduleRef = doc(db, 'schedules', `${user.uid}_shard_0`); |
| [app/onboarding/professional/page.tsx:373](../../app/onboarding/professional/page.tsx#L373) |         query(collection(db, 'services'), |
| [app/onboarding/professional/page.tsx:374](../../app/onboarding/professional/page.tsx#L374) |         where('providerId', '==', user.uid)) |
| [app/onboarding/professional/page.tsx:379](../../app/onboarding/professional/page.tsx#L379) |           const newServiceRef = doc(collection(db, 'services')); |
| [app/onboarding/professional/page.tsx:401](../../app/onboarding/professional/page.tsx#L401) |           isOnboarded: true, |
| [app/onboarding/professional/page.tsx:414](../../app/onboarding/professional/page.tsx#L414) |         await deleteDoc(doc(db, 'onboardingDrafts', user.uid)); |
| [app/onboarding/professional/page.tsx:424](../../app/onboarding/professional/page.tsx#L424) |         role: 'professional', |
| [app/onboarding/professional/page.tsx:876](../../app/onboarding/professional/page.tsx#L876) |               track('onboarding_step_completed', { step, role: 'professional' }); |
| [app/page.tsx:16](../../app/page.tsx#L16) |       collection(db, 'professionalProfiles'), |
| [app/page.tsx:17](../../app/page.tsx#L17) |       where('isLive', '==', true), |
| [app/page.tsx:18](../../app/page.tsx#L18) |       where('isSolo', '==', true), |
| [app/page.tsx:19](../../app/page.tsx#L19) |       where('approvalStatus', '==', 'approved'), |
| [app/page.tsx:28](../../app/page.tsx#L28) |       profiles.map((p: any) =&gt; getDoc(doc(db, 'schedules', getScheduleDocId(p.id)))) |
| [app/page.tsx:60](../../app/page.tsx#L60) |       Promise.allSettled(selectedIds.map(id =&gt; getDoc(doc(db, 'users', id)))), |
| [app/page.tsx:63](../../app/page.tsx#L63) |             collection(db, 'services'), |
| [app/page.tsx:64](../../app/page.tsx#L64) |             where('providerId', 'in', selectedIds.slice(0, 10)), |
| [app/page.tsx:65](../../app/page.tsx#L65) |             where('providerType', '==', 'barber'), |
| [app/page.tsx:66](../../app/page.tsx#L66) |             where('isActive', '==', true), |
| [app/page.tsx:130](../../app/page.tsx#L130) |       getDocs(query(collection(db, 'businesses'), where('status', '==', 'active'), limit(100))), |
| [app/page.tsx:131](../../app/page.tsx#L131) |       getDocs(query(collection(db, 'professionalProfiles'), where('isLive', '==', true), limit(200))), |
| [app/page.tsx:157](../../app/page.tsx#L157) |     const configSnap = await getDoc(doc(db, 'siteConfig', 'global')); |
| [app/privacy/page.tsx:111](../../app/privacy/page.tsx#L111) |               &lt;p&gt;To exercise these rights, contact us at: &lt;a href="mailto:privacy@titezme.com" className="text-[#FFD600] font-bold hover:underline"&gt;privacy@titezme.com&lt;/a&gt;&lt;br/&gt;We will respond within 30 days.&lt;/p&gt; |
| [app/privacy/page.tsx:163](../../app/privacy/page.tsx#L163) |                 Email: &lt;a href="mailto:privacy@titezme.com" className="text-[#FFD600] hover:underline"&gt;privacy@titezme.com&lt;/a&gt;&lt;br/&gt; |
| [app/review/[bookingId]/page.tsx:28](../../app/review/[bookingId]/page.tsx#L28) |       router.replace('/login'); |
| [app/review/[bookingId]/page.tsx:34](../../app/review/[bookingId]/page.tsx#L34) |         const bSnap = await getDoc(doc(db, 'bookings', bookingId)); |
| [app/review/[bookingId]/page.tsx:39](../../app/review/[bookingId]/page.tsx#L39) |               router.push('/dashboard/client'); |
| [app/review/[bookingId]/page.tsx:44](../../app/review/[bookingId]/page.tsx#L44) |            const qR = query(collection(db, 'reviews'), where('bookingId', '==', bookingId)); |
| [app/review/[bookingId]/page.tsx:48](../../app/review/[bookingId]/page.tsx#L48) |               router.push('/dashboard/client'); |
| [app/review/[bookingId]/page.tsx:52](../../app/review/[bookingId]/page.tsx#L52) |            const barberSnap = await getDoc(doc(db, 'users', bData.barberId)); |
| [app/review/[bookingId]/page.tsx:55](../../app/review/[bookingId]/page.tsx#L55) |            router.push('/dashboard/client'); |
| [app/review/[bookingId]/page.tsx:71](../../app/review/[bookingId]/page.tsx#L71) |       const existingReviewSnap = await getDoc(doc(db, 'reviews', reviewId)); |
| [app/review/[bookingId]/page.tsx:74](../../app/review/[bookingId]/page.tsx#L74) |          router.push('/dashboard/client'); |
| [app/review/[bookingId]/page.tsx:79](../../app/review/[bookingId]/page.tsx#L79) |       const newReviewRef = doc(db, 'reviews', reviewId); |
| [app/review/[bookingId]/page.tsx:91](../../app/review/[bookingId]/page.tsx#L91) |       await updateDoc(doc(db, 'bookings', bookingId), { hasReview: true }); |
| [app/review/[bookingId]/page.tsx:100](../../app/review/[bookingId]/page.tsx#L100) |       await addDoc(collection(db, 'notifications'), notificationSchema.parse({ |
| [app/review/[bookingId]/page.tsx:107](../../app/review/[bookingId]/page.tsx#L107) |       updateDoc(doc(db, 'users', booking.barberId), { unreadCount: increment(1) }).catch(console.error); |
| [app/review/[bookingId]/page.tsx:113](../../app/review/[bookingId]/page.tsx#L113) |     router.push('/dashboard/client'); |
| [app/review/[bookingId]/page.tsx:159](../../app/review/[bookingId]/page.tsx#L159) |        &lt;button onClick={() =&gt; router.push('/dashboard/client')} className="mt-5 text-[#888] font-bold text-sm hover:text-white transition-colors"&gt;{t('review.skipForNow')}&lt;/button&gt; |
| [app/shop/[shopId]/page.tsx:55](../../app/shop/[shopId]/page.tsx#L55) |   isLive?: boolean; |
| [app/shop/[shopId]/page.tsx:141](../../app/shop/[shopId]/page.tsx#L141) |     const unsub = onSnapshot(doc(db, 'businesses', shopId), snap =&gt; { |
| [app/shop/[shopId]/page.tsx:150](../../app/shop/[shopId]/page.tsx#L150) |       collection(db, 'professionalProfiles'), |
| [app/shop/[shopId]/page.tsx:151](../../app/shop/[shopId]/page.tsx#L151) |       where('businessId', '==', shopId), |
| [app/shop/[shopId]/page.tsx:152](../../app/shop/[shopId]/page.tsx#L152) |       where('isLive', '==', true), |
| [app/shop/[shopId]/page.tsx:162](../../app/shop/[shopId]/page.tsx#L162) |     const unsub = onSnapshot(doc(db, 'schedules', `${shopId}_shard_0`), snap =&gt; { |
| [app/shop/[shopId]/page.tsx:198](../../app/shop/[shopId]/page.tsx#L198) |         collection(db, 'services'), |
| [app/shop/[shopId]/page.tsx:199](../../app/shop/[shopId]/page.tsx#L199) |         where('providerId', '==', shopId), |
| [app/shop/[shopId]/page.tsx:200](../../app/shop/[shopId]/page.tsx#L200) |         where('providerType', '==', 'shop'), |
| [app/shop/[shopId]/page.tsx:201](../../app/shop/[shopId]/page.tsx#L201) |         where('isActive', '==', true), |
| [app/shop/[shopId]/page.tsx:220](../../app/shop/[shopId]/page.tsx#L220) |         Promise.all(barberIds.map(id =&gt; getDoc(doc(db, 'users', id)))), |
| [app/shop/[shopId]/page.tsx:221](../../app/shop/[shopId]/page.tsx#L221) |         Promise.all(barberIds.map(id =&gt; getDoc(doc(db, 'schedules', `${id}_shard_0`)))), |
| [app/shop/[shopId]/page.tsx:244](../../app/shop/[shopId]/page.tsx#L244) |     isLive: b.isLive, |
| [app/shop/[shopId]/page.tsx:296](../../app/shop/[shopId]/page.tsx#L296) |       router.push(`/login?redirect=/shop/${shopId}`); |
| [app/shop/[shopId]/page.tsx:299](../../app/shop/[shopId]/page.tsx#L299) |     if (appUser?.role === 'admin') { |
| [app/shop/[shopId]/page.tsx:303](../../app/shop/[shopId]/page.tsx#L303) |     if (!appUser?.isOnboarded) { |
| [app/shop/[shopId]/page.tsx:304](../../app/shop/[shopId]/page.tsx#L304) |       router.push( |
| [app/shop/[shopId]/page.tsx:305](../../app/shop/[shopId]/page.tsx#L305) |         appUser?.role === 'professional' |
| [app/shop/[shopId]/page.tsx:314](../../app/shop/[shopId]/page.tsx#L314) |     router.push(url); |
| [app/shop/[shopId]/page.tsx:355](../../app/shop/[shopId]/page.tsx#L355) |           &lt;Link href="/shops" className="bg-brand-yellow text-black font-black px-6 py-3 rounded-full"&gt;{t('profile.browseShops')}&lt;/Link&gt; |
| [app/shop/[shopId]/page.tsx:368](../../app/shop/[shopId]/page.tsx#L368) |           &lt;Link href="/shops" className="bg-brand-yellow text-black font-black px-6 py-3 rounded-full"&gt;{t('profile.browseOtherShops')}&lt;/Link&gt; |
| [app/shop/[shopId]/page.tsx:399](../../app/shop/[shopId]/page.tsx#L399) |             &lt;Link href="/" className="hover:text-white transition-colors"&gt;{t('nav.home')}&lt;/Link&gt; |
| [app/shop/[shopId]/page.tsx:401](../../app/shop/[shopId]/page.tsx#L401) |             &lt;Link href="/shops" className="hover:text-white transition-colors"&gt;{t('nav.shops')}&lt;/Link&gt; |
| [app/shop/[shopId]/page.tsx:456](../../app/shop/[shopId]/page.tsx#L456) |                   &lt;a href={mapsUrl} target="_blank" rel="noopener noreferrer" |
| [app/shop/[shopId]/page.tsx:479](../../app/shop/[shopId]/page.tsx#L479) |                   &lt;a href={`https://instagram.com/${shop.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" |
| [app/shop/[shopId]/page.tsx:485](../../app/shop/[shopId]/page.tsx#L485) |                   &lt;a href={`https://tiktok.com/@${shop.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" |
| [app/shop/[shopId]/page.tsx:491](../../app/shop/[shopId]/page.tsx#L491) |                   &lt;a href={`https://facebook.com/${shop.facebook}`} target="_blank" rel="noopener noreferrer" |
| [app/shop/[shopId]/page.tsx:518](../../app/shop/[shopId]/page.tsx#L518) |                     const isAvailable = (b.availableToday ?? false) && (b.isLive ?? false); |
| [app/shop/[shopId]/page.tsx:523](../../app/shop/[shopId]/page.tsx#L523) |                       &lt;Link href={`/barber/${b.id}`} key={b.id} |
| [app/shop/[shopId]/page.tsx:708](../../app/shop/[shopId]/page.tsx#L708) |                 &lt;a href={`tel:${shop.contactPhone}`} |
| [app/shop/[shopId]/page.tsx:736](../../app/shop/[shopId]/page.tsx#L736) |                     &lt;a href={`tel:${shop.contactPhone}`} className="text-xs font-bold text-white hover:text-brand-yellow transition-colors"&gt; |
| [app/shop/[shopId]/page.tsx:776](../../app/shop/[shopId]/page.tsx#L776) |               &lt;a href={mapsUrl} target="_blank" rel="noopener noreferrer" |
| [app/shops/page.tsx:69](../../app/shops/page.tsx#L69) |     collection(db, 'businesses'), |
| [app/shops/page.tsx:70](../../app/shops/page.tsx#L70) |     where('status', '==', 'active'), |
| [app/shops/page.tsx:81](../../app/shops/page.tsx#L81) |     Promise.all(ids.map(id =&gt; getDoc(doc(db, 'schedules', `${id}_shard_0`)))), |
| [app/shops/page.tsx:83](../../app/shops/page.tsx#L83) |       collection(db, 'services'), |
| [app/shops/page.tsx:84](../../app/shops/page.tsx#L84) |       where('providerId', '==', id), |
| [app/shops/page.tsx:85](../../app/shops/page.tsx#L85) |       where('providerType', '==', 'shop'), |
| [app/shops/page.tsx:86](../../app/shops/page.tsx#L86) |       where('isActive', '==', true), |
| [app/shops/page.tsx:420](../../app/shops/page.tsx#L420) |             &lt;Link href="/signup" |
| [app/shops/page.tsx:453](../../app/shops/page.tsx#L453) |                       &lt;Link href={`/shop/${s.id}`} |
| [app/shops/page.tsx:528](../../app/shops/page.tsx#L528) |                           &lt;a href="/signup" style={{ |
| [app/shops/page.tsx:532](../../app/shops/page.tsx#L532) |                           &lt;a href="/login" style={{ |
| [app/signup/page.tsx:62](../../app/signup/page.tsx#L62) |     router.replace('/'); // if already logged in, go home |
| [app/signup/page.tsx:71](../../app/signup/page.tsx#L71) |           if (role === 'professional') { |
| [app/signup/page.tsx:72](../../app/signup/page.tsx#L72) |             router.push('/onboarding/professional'); |
| [app/signup/page.tsx:74](../../app/signup/page.tsx#L74) |             router.push('/onboarding/client'); |
| [app/signup/page.tsx:118](../../app/signup/page.tsx#L118) |       const userDocRef = doc(db, 'users', user.uid); |
| [app/signup/page.tsx:125](../../app/signup/page.tsx#L125) |         setTimeout(() =&gt; { router.replace('/login'); }, 2000); |
| [app/signup/page.tsx:136](../../app/signup/page.tsx#L136) |         role: role, |
| [app/signup/page.tsx:137](../../app/signup/page.tsx#L137) |         isOnboarded: false, |
| [app/signup/page.tsx:142](../../app/signup/page.tsx#L142) |       if (role === 'professional') { |
| [app/signup/page.tsx:143](../../app/signup/page.tsx#L143) |         router.replace('/onboarding/professional'); |
| [app/signup/page.tsx:145](../../app/signup/page.tsx#L145) |         router.replace('/onboarding/client'); |
| [app/signup/page.tsx:150](../../app/signup/page.tsx#L150) |         setTimeout(() =&gt; { router.replace('/login'); }, 2000); |
| [app/signup/page.tsx:201](../../app/signup/page.tsx#L201) |         role: role, |
| [app/signup/page.tsx:205](../../app/signup/page.tsx#L205) |         isOnboarded: false, |
| [app/signup/page.tsx:206](../../app/signup/page.tsx#L206) |         ownsShop: false |
| [app/signup/page.tsx:208](../../app/signup/page.tsx#L208) |       await setDoc(doc(db, 'users', newUser.uid), userSchema.parse(userData)); |
| [app/signup/page.tsx:283](../../app/signup/page.tsx#L283) |                 role === r.id |
| [app/signup/page.tsx:568](../../app/signup/page.tsx#L568) |                 href="/login" |
| [app/signup/page.tsx:633](../../app/signup/page.tsx#L633) |               href="/terms" |
| [app/signup/page.tsx:642](../../app/signup/page.tsx#L642) |               href="/privacy" |
| [app/signup/page.tsx:662](../../app/signup/page.tsx#L662) |           {t('headings.alreadyHaveAccount')} &lt;Link href="/login" className="text-white font-extrabold hover:text-brand-yellow transition-colors"&gt;{t('nav.login')}&lt;/Link&gt; |
| [app/terms/challenge/page.tsx:42](../../app/terms/challenge/page.tsx#L42) |                 Contact: &lt;a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline"&gt;support@titezme.com&lt;/a&gt; |
| [app/terms/challenge/page.tsx:45](../../app/terms/challenge/page.tsx#L45) |               &lt;p&gt;By participating in the Challenge you agree to be bound by these Rules, by the titeZMe &lt;a href="/terms" className="text-[#FFD600] hover:underline"&gt;Terms of Service&lt;/a&gt;, and by the titeZMe &lt;a href="/privacy" className="text-[#FFD600] hover:underline"&gt;Privacy Policy&lt;/a&gt;. Where there is any conflict between general Terms of Service and these Challenge Rules, these Challenge Rules prevail for matters specifically related to the Challenge.&lt;/p&gt; |
| [app/terms/challenge/page.tsx:139](../../app/terms/challenge/page.tsx#L139) |                 &lt;li&gt;Promotional material for competing businesses or unrelated commercial activity.&lt;/li&gt; |
| [app/terms/challenge/page.tsx:219](../../app/terms/challenge/page.tsx#L219) |               &lt;p className="mb-4"&gt;The collection and processing of personal data in connection with the Challenge is governed by the titeZMe &lt;a href="/privacy" className="text-[#FFD600] hover:underline"&gt;Privacy Policy&lt;/a&gt; and by the European General Data Protection Regulation (GDPR). Participants have the rights described in our Privacy Policy, including the rights of access, rectification, erasure, and objection.&lt;/p&gt; |
| [app/terms/challenge/page.tsx:228](../../app/terms/challenge/page.tsx#L228) |               &lt;p&gt;For data-related requests, contact: &lt;a href="mailto:privacy@titezme.com" className="text-[#FFD600] hover:underline"&gt;privacy@titezme.com&lt;/a&gt;.&lt;/p&gt; |
| [app/terms/challenge/page.tsx:250](../../app/terms/challenge/page.tsx#L250) |               &lt;p&gt;Before initiating any legal proceedings, participants are encouraged to contact the Organizer at &lt;a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline"&gt;support@titezme.com&lt;/a&gt; so a good-faith resolution can be attempted.&lt;/p&gt; |
| [app/terms/challenge/page.tsx:263](../../app/terms/challenge/page.tsx#L263) |                 Email: &lt;a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline"&gt;support@titezme.com&lt;/a&gt;&lt;br/&gt; |
| [app/terms/page.tsx:149](../../app/terms/page.tsx#L149) |                 Email: &lt;a href="mailto:support@titezme.com" className="text-[#FFD600] hover:underline"&gt;support@titezme.com&lt;/a&gt;&lt;br/&gt; |
| [components/AdminGuard.tsx:51](../../components/AdminGuard.tsx#L51) |         router.replace('/admin/login'); |
| [components/AdminGuard.tsx:66](../../components/AdminGuard.tsx#L66) |         const snap = await getDoc(doc(db, 'users', uid)); |
| [components/AdminGuard.tsx:69](../../components/AdminGuard.tsx#L69) |           router.replace('/admin/login'); |
| [components/AdminGuard.tsx:75](../../components/AdminGuard.tsx#L75) |         const isAdminUser = data?.isAdmin === true \|\| data?.role === 'admin'; |
| [components/AdminGuard.tsx:78](../../components/AdminGuard.tsx#L78) |           router.replace('/'); |
| [components/AdminGuard.tsx:96](../../components/AdminGuard.tsx#L96) |         router.replace('/admin/login'); |
| [components/AvailabilityGrid.tsx:62](../../components/AvailabilityGrid.tsx#L62) |     const unsubSchedule = onSnapshot(doc(db, 'schedules', `${uid}_shard_0`), (docSnap) =&gt; { |
| [components/AvailabilityGrid.tsx:86](../../components/AvailabilityGrid.tsx#L86) |         collection(db, 'bookings'),  |
| [components/AvailabilityGrid.tsx:87](../../components/AvailabilityGrid.tsx#L87) |         where('barberId', '==', uid), |
| [components/AvailabilityGrid.tsx:88](../../components/AvailabilityGrid.tsx#L88) |         where('status', 'in', ['pending', 'confirmed']) |
| [components/AvailabilityGrid.tsx:184](../../components/AvailabilityGrid.tsx#L184) |         doc(db, 'schedules', `${uid}_shard_0`), |
| [components/BarberInvitesTab.tsx:24](../../components/BarberInvitesTab.tsx#L24) |     getDoc(doc(db, 'professionalProfiles', user.uid)).then(snap =&gt; { |
| [components/BarberInvitesTab.tsx:31](../../components/BarberInvitesTab.tsx#L31) |     const q = query(collection(db, 'invites'), where('barberId', '==', user.uid)); |
| [components/BarberInvitesTab.tsx:46](../../components/BarberInvitesTab.tsx#L46) |       batch.update(doc(db, 'invites', invite.id), { status: 'accepted', respondedAt: currentTime }); |
| [components/BarberInvitesTab.tsx:47](../../components/BarberInvitesTab.tsx#L47) |       batch.update(doc(db, 'professionalProfiles', user.uid), { businessId: invite.shopId }); |
| [components/BarberInvitesTab.tsx:48](../../components/BarberInvitesTab.tsx#L48) |       const notifRef = doc(collection(db, 'notifications')); |
| [components/BarberInvitesTab.tsx:55](../../components/BarberInvitesTab.tsx#L55) |       batch.update(doc(db, 'users', invite.shopId), { unreadCount: increment(1) }); |
| [components/BarberInvitesTab.tsx:71](../../components/BarberInvitesTab.tsx#L71) |         batch.update(doc(db, 'professionalProfiles', user.uid), { isSolo: false }); |
| [components/BarberInvitesTab.tsx:83](../../components/BarberInvitesTab.tsx#L83) |     const bSnap = await getDocs(query(collection(db, 'professionalProfiles'), where('userId', '==', user.uid))); |
| [components/BarberInvitesTab.tsx:100](../../components/BarberInvitesTab.tsx#L100) |       batch.update(doc(db, 'invites', invite.id), { status: 'declined', respondedAt: currentTime }); |
| [components/BarberInvitesTab.tsx:101](../../components/BarberInvitesTab.tsx#L101) |       const notifRef = doc(collection(db, 'notifications')); |
| [components/BarberInvitesTab.tsx:103](../../components/BarberInvitesTab.tsx#L103) |       batch.update(doc(db, 'users', invite.shopId), { unreadCount: increment(1) }); |
| [components/BarberInvitesTab.tsx:127](../../components/BarberInvitesTab.tsx#L127) |   if (appUser?.ownsShop) { |
| [components/BarberInvitesTab.tsx:136](../../components/BarberInvitesTab.tsx#L136) |           onClick={() =&gt; router.push('/dashboard/shop')} |
| [components/BarberPortfolioTab.tsx:33](../../components/BarberPortfolioTab.tsx#L33) |       await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ photos: newPhotos })); |
| [components/BarberPortfolioTab.tsx:46](../../components/BarberPortfolioTab.tsx#L46) |       await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ videos: newVideos })); |
| [components/BarberPortfolioTab.tsx:56](../../components/BarberPortfolioTab.tsx#L56) |       await addDoc(collection(db, 'featureRequests'), { |
| [components/BarberSettingsTab.tsx:202](../../components/BarberSettingsTab.tsx#L202) |   const [isSolo, setIsSolo] = useState&lt;boolean&gt;(profile?.isSolo ?? true); |
| [components/BarberSettingsTab.tsx:216](../../components/BarberSettingsTab.tsx#L216) |     setIsSolo(profile?.isSolo ?? true); |
| [components/BarberSettingsTab.tsx:254](../../components/BarberSettingsTab.tsx#L254) |             await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse({ photoUrl: downloadURL })); |
| [components/BarberSettingsTab.tsx:255](../../components/BarberSettingsTab.tsx#L255) |             await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ profilePhotoUrl: downloadURL })); |
| [components/BarberSettingsTab.tsx:286](../../components/BarberSettingsTab.tsx#L286) |       await updateDoc(doc(db, 'users', user.uid), userUpdateSchema.parse({ |
| [components/BarberSettingsTab.tsx:296](../../components/BarberSettingsTab.tsx#L296) |       await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ |
| [components/BarberSettingsTab.tsx:320](../../components/BarberSettingsTab.tsx#L320) |       await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ |
| [components/BarberSettingsTab.tsx:340](../../components/BarberSettingsTab.tsx#L340) |       await updateDoc(doc(db, 'professionalProfiles', user.uid), { specialties, vibes: vibe, clientele }); |
| [components/BarberSettingsTab.tsx:356](../../components/BarberSettingsTab.tsx#L356) |       await updateDoc(doc(db, 'professionalProfiles', user.uid), professionalProfileUpdateSchema.parse({ |
| [components/BarberSettingsTab.tsx:377](../../components/BarberSettingsTab.tsx#L377) |       await updateDoc(doc(db, 'professionalProfiles', user.uid), { hasEquipment, lookingForChair }); |
| [components/BarberSettingsTab.tsx:393](../../components/BarberSettingsTab.tsx#L393) |     try { await updateDoc(doc(db, 'users', user.uid), { notifyEmail: val }); } catch (e) { console.error(e); } |
| [components/BarberSettingsTab.tsx:398](../../components/BarberSettingsTab.tsx#L398) |     try { await updateDoc(doc(db, 'users', user.uid), { notifyCancel: val }); } catch (e) { console.error(e); } |
| [components/BarberSettingsTab.tsx:403](../../components/BarberSettingsTab.tsx#L403) |     try { await updateDoc(doc(db, 'professionalProfiles', user.uid), { showPhone: val }); } catch (e) { console.error(e); } |
| [components/BarberSettingsTab.tsx:436](../../components/BarberSettingsTab.tsx#L436) |         {appUser?.ownsShop ? ( |
| [components/BarberSettingsTab.tsx:438](../../components/BarberSettingsTab.tsx#L438) |             href="/dashboard/shop" |
| [components/BarberSettingsTab.tsx:464](../../components/BarberSettingsTab.tsx#L464) |             href={`/shop/${profile.shopId}`} |
| [components/BarberSettingsTab.tsx:490](../../components/BarberSettingsTab.tsx#L490) |             href="/dashboard/barber/create-shop" |
| [components/BarberSettingsTab.tsx:882](../../components/BarberSettingsTab.tsx#L882) |                       collection(db, 'bookings'), |
| [components/BarberSettingsTab.tsx:883](../../components/BarberSettingsTab.tsx#L883) |                       where('barberId', '==', user!.uid), |
| [components/BarberSettingsTab.tsx:884](../../components/BarberSettingsTab.tsx#L884) |                       where('status', 'in', ['pending', 'confirmed']) |
| [components/BarberSettingsTab.tsx:899](../../components/BarberSettingsTab.tsx#L899) |                       batch.set(doc(collection(db, 'notifications')), { |
| [components/BarberSettingsTab.tsx:910](../../components/BarberSettingsTab.tsx#L910) |                       doc(db, 'businesses', currentShopId), |
| [components/BarberSettingsTab.tsx:915](../../components/BarberSettingsTab.tsx#L915) |                     batch.set(doc(collection(db, 'notifications')), { |
| [components/BarberSettingsTab.tsx:925](../../components/BarberSettingsTab.tsx#L925) |                   batch.update(doc(db, 'professionalProfiles', user!.uid), { |
| [components/BarberSettingsTab.tsx:927](../../components/BarberSettingsTab.tsx#L927) |                     isSolo: true, |
| [components/BarberSettingsTab.tsx:961](../../components/BarberSettingsTab.tsx#L961) |               checked={isSolo} |
| [components/BarberSettingsTab.tsx:972](../../components/BarberSettingsTab.tsx#L972) |                       collection(db, 'bookings'), |
| [components/BarberSettingsTab.tsx:973](../../components/BarberSettingsTab.tsx#L973) |                       where('barberId', '==', user.uid), |
| [components/BarberSettingsTab.tsx:974](../../components/BarberSettingsTab.tsx#L974) |                       where('bookingContext', '==', 'solo'), |
| [components/BarberSettingsTab.tsx:975](../../components/BarberSettingsTab.tsx#L975) |                       where('status', 'in', ['pending', 'confirmed']) |
| [components/BarberSettingsTab.tsx:990](../../components/BarberSettingsTab.tsx#L990) |                       await updateDoc(doc(db, 'professionalProfiles', user.uid), { isSolo: false }); |
| [components/BarberSettingsTab.tsx:1008](../../components/BarberSettingsTab.tsx#L1008) |                     await updateDoc(doc(db, 'professionalProfiles', user.uid), { isSolo: true }); |
| [components/BarberSettingsTab.tsx:1026](../../components/BarberSettingsTab.tsx#L1026) |       {isSolo && ( |
| [components/ChallengeHomepageBox.tsx:23](../../components/ChallengeHomepageBox.tsx#L23) |       const snap = await getDoc(doc(db, 'siteConfig', 'challenge')); |
| [components/ChallengeHomepageBox.tsx:34](../../components/ChallengeHomepageBox.tsx#L34) |           collection(db, 'challengeSubmissions'), |
| [components/ChallengeHomepageBox.tsx:35](../../components/ChallengeHomepageBox.tsx#L35) |           where('type', '==', 'barber'), |
| [components/ChallengeHomepageBox.tsx:36](../../components/ChallengeHomepageBox.tsx#L36) |           where('status', '==', 'approved'), |
| [components/ChallengeHomepageBox.tsx:39](../../components/ChallengeHomepageBox.tsx#L39) |           collection(db, 'challengeSubmissions'), |
| [components/ChallengeHomepageBox.tsx:40](../../components/ChallengeHomepageBox.tsx#L40) |           where('type', '==', 'shop'), |
| [components/ChallengeHomepageBox.tsx:41](../../components/ChallengeHomepageBox.tsx#L41) |           where('status', '==', 'approved'), |
| [components/ChallengeHomepageBox.tsx:89](../../components/ChallengeHomepageBox.tsx#L89) |     if (appUser.role === 'professional' && !appUser.ownsShop) { |
| [components/ChallengeHomepageBox.tsx:92](../../components/ChallengeHomepageBox.tsx#L92) |     if (appUser.ownsShop) { |
| [components/ChallengeHomepageBox.tsx:159](../../components/ChallengeHomepageBox.tsx#L159) |             href={cta.href} |
| [components/ChallengeHomepageBox.tsx:166](../../components/ChallengeHomepageBox.tsx#L166) |             href="/terms/challenge" |
| [components/ChallengeLocationGate.tsx:81](../../components/ChallengeLocationGate.tsx#L81) |         href={settingsHref} |
| [components/ChallengePaymentTab.tsx:49](../../components/ChallengePaymentTab.tsx#L49) |           getDoc(doc(db, 'siteConfig', 'challenge')), |
| [components/ChallengePaymentTab.tsx:50](../../components/ChallengePaymentTab.tsx#L50) |           getDoc(doc(db, 'challengeSubmissions', `${user.uid}_${mode}`)), |
| [components/ChallengePaymentTab.tsx:78](../../components/ChallengePaymentTab.tsx#L78) |       router.replace(`/dashboard/${mode}/challenge`); |
| [components/ChallengePaymentTab.tsx:82](../../components/ChallengePaymentTab.tsx#L82) |       router.replace(`/dashboard/${mode}/challenge`); |
| [components/ChallengePaymentTab.tsx:114](../../components/ChallengePaymentTab.tsx#L114) |       const fresh = await getDoc(doc(db, 'challengeSubmissions', submission.id)); |
| [components/ChallengePaymentTab.tsx:133](../../components/ChallengePaymentTab.tsx#L133) |       await updateDoc(doc(db, 'challengeSubmissions', submission.id), update); |
| [components/ChallengePaymentTab.tsx:134](../../components/ChallengePaymentTab.tsx#L134) |       router.push(`/dashboard/${mode}/challenge`); |
| [components/ChallengePaymentTab.tsx:163](../../components/ChallengePaymentTab.tsx#L163) |   // Redirecting cases — render nothing while router.replace fires |
| [components/ChallengePaymentTab.tsx:182](../../components/ChallengePaymentTab.tsx#L182) |             onClick={() =&gt; router.push(`/dashboard/${mode}/challenge`)} |
| [components/ChallengePaymentTab.tsx:204](../../components/ChallengePaymentTab.tsx#L204) |             onClick={() =&gt; router.push(`/dashboard/${mode}/challenge`)} |
| [components/ChallengePaymentTab.tsx:224](../../components/ChallengePaymentTab.tsx#L224) |             onClick={() =&gt; router.push(`/dashboard/${mode}/challenge`)} |
| [components/ChallengePaymentTab.tsx:397](../../components/ChallengePaymentTab.tsx#L397) |         onClick={() =&gt; router.push(`/dashboard/${mode}/challenge`)} |
| [components/ChallengeSubmissionTab.tsx:227](../../components/ChallengeSubmissionTab.tsx#L227) |   const dualEligible = appUser?.role === 'professional' && appUser?.ownsShop === true; |
| [components/ChallengeSubmissionTab.tsx:252](../../components/ChallengeSubmissionTab.tsx#L252) |         const snap = await getDoc(doc(db, 'siteConfig', 'challenge')); |
| [components/ChallengeSubmissionTab.tsx:274](../../components/ChallengeSubmissionTab.tsx#L274) |         const snap = await getDoc(doc(db, 'challengeSubmissions', `${uid}_${m}`)); |
| [components/ChallengeSubmissionTab.tsx:425](../../components/ChallengeSubmissionTab.tsx#L425) |         const profileSnap = await getDoc(doc(db, 'professionalProfiles', user.uid)); |
| [components/ChallengeSubmissionTab.tsx:432](../../components/ChallengeSubmissionTab.tsx#L432) |         const shopSnap = await getDoc(doc(db, 'businesses', user.uid)); |
| [components/ChallengeSubmissionTab.tsx:445](../../components/ChallengeSubmissionTab.tsx#L445) |       const docRef = doc(db, 'challengeSubmissions', docId); |
| [components/ChallengeSubmissionTab.tsx:480](../../components/ChallengeSubmissionTab.tsx#L480) |       router.push(`/dashboard/${submitMode}/challenge/payment`); |
| [components/ChallengeSubmissionTab.tsx:598](../../components/ChallengeSubmissionTab.tsx#L598) |                 onClick={() =&gt; router.push(`/dashboard/${submitMode}/challenge/payment`)} |
| [components/ChallengeSubmissionTab.tsx:653](../../components/ChallengeSubmissionTab.tsx#L653) |                   onClick={() =&gt; router.push(`/dashboard/${submitMode}`)} |
| [components/ChallengeSubmissionTab.tsx:674](../../components/ChallengeSubmissionTab.tsx#L674) |                   href={url} |
| [components/ChallengeSubmissionTab.tsx:811](../../components/ChallengeSubmissionTab.tsx#L811) |                     href={url} |
| [components/ChallengeSubmissionTab.tsx:957](../../components/ChallengeSubmissionTab.tsx#L957) |             &lt;a href="/terms/challenge" target="_blank" rel="noreferrer" className="text-brand-yellow font-bold hover:underline"&gt; |
| [components/ComingSoon.tsx:28](../../components/ComingSoon.tsx#L28) |       await addDoc(collection(db, 'featureRequests'), { |
| [components/DeleteAccountButton.tsx:17](../../components/DeleteAccountButton.tsx#L17) |   role: 'client' \| 'professional'; |
| [components/DeleteAccountButton.tsx:65](../../components/DeleteAccountButton.tsx#L65) |       if (appUser.role === 'client') { |
| [components/DeleteAccountButton.tsx:67](../../components/DeleteAccountButton.tsx#L67) |       } else if (appUser.role === 'professional') { |
| [components/DeleteAccountButton.tsx:68](../../components/DeleteAccountButton.tsx#L68) |         const profileSnap = await getDoc(doc(db, 'professionalProfiles', user.uid)); |
| [components/DeleteAccountButton.tsx:81](../../components/DeleteAccountButton.tsx#L81) |       router.replace('/'); |
| [components/DeleteAccountButton.tsx:168](../../components/DeleteAccountButton.tsx#L168) |               {role === 'client' ? 'Delete your account?' : 'Delete your professional account?'} |
| [components/DeleteAccountButton.tsx:181](../../components/DeleteAccountButton.tsx#L181) |               {role === 'client' ? clientMessage : barberMessage} |
| [components/EmptyStates.tsx:21](../../components/EmptyStates.tsx#L21) |         href="/"  |
| [components/Footer.tsx:20](../../components/Footer.tsx#L20) |              &lt;Link href="/about" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors"&gt;{t('footer.about')}&lt;/Link&gt; |
| [components/Footer.tsx:21](../../components/Footer.tsx#L21) |              &lt;Link href="/for-barbers" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors"&gt;{t('footer.forBarbers')}&lt;/Link&gt; |
| [components/Footer.tsx:22](../../components/Footer.tsx#L22) |              &lt;Link href="/for-shops" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors"&gt;{t('footer.forShops')}&lt;/Link&gt; |
| [components/Footer.tsx:23](../../components/Footer.tsx#L23) |              &lt;Link href="/cities" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors"&gt;{t('footer.cities')}&lt;/Link&gt; |
| [components/Footer.tsx:24](../../components/Footer.tsx#L24) |              &lt;Link href="/privacy" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors"&gt;{t('footer.privacy')}&lt;/Link&gt; |
| [components/Footer.tsx:25](../../components/Footer.tsx#L25) |              &lt;Link href="/terms" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors"&gt;{t('footer.terms')}&lt;/Link&gt; |
| [components/Footer.tsx:26](../../components/Footer.tsx#L26) |              &lt;Link href="/contact" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors"&gt;{t('footer.contact')}&lt;/Link&gt; |
| [components/Footer.tsx:27](../../components/Footer.tsx#L27) |              &lt;Link href="/cookies" className="text-xs font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors"&gt;{t('footer.cookieSettings')}&lt;/Link&gt; |
| [components/Footer.tsx:31](../../components/Footer.tsx#L31) |              &lt;a href="https://www.instagram.com/titezme.es/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}&gt; |
| [components/Footer.tsx:38](../../components/Footer.tsx#L38) |              &lt;a href="https://www.tiktok.com/@titezme" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'color 0.15s' }}&gt; |
| [components/NotificationBell.tsx:29](../../components/NotificationBell.tsx#L29) |       collection(db, 'notifications'), |
| [components/NotificationBell.tsx:30](../../components/NotificationBell.tsx#L30) |       where('userId', '==', user.uid), |
| [components/NotificationBell.tsx:31](../../components/NotificationBell.tsx#L31) |       where('read', '==', false) |
| [components/NotificationBell.tsx:47](../../components/NotificationBell.tsx#L47) |       updateDoc(doc(db, 'users', user.uid), { unreadCount: 0 }).catch(console.error); |
| [components/NotificationBell.tsx:55](../../components/NotificationBell.tsx#L55) |     if (n.linkTo) router.push(n.linkTo); |
| [components/NotificationBell.tsx:57](../../components/NotificationBell.tsx#L57) |     updateDoc(doc(db, 'notifications', n.id), notificationUpdateSchema.parse({ read: true })).catch(e =&gt; { |
| [components/PresenceTracker.tsx:16](../../components/PresenceTracker.tsx#L16) |         await updateDoc(doc(db, 'users', user.uid), { |
| [components/RouteGuard.tsx:8](../../components/RouteGuard.tsx#L8) | const PUBLIC_ROUTES = [ |
| [components/RouteGuard.tsx:29](../../components/RouteGuard.tsx#L29) | const PUBLIC_PREFIXES = [ |
| [components/RouteGuard.tsx:35](../../components/RouteGuard.tsx#L35) |   if (PUBLIC_ROUTES.includes(path)) return true; |
| [components/RouteGuard.tsx:36](../../components/RouteGuard.tsx#L36) |   if (PUBLIC_PREFIXES.some(prefix =&gt; path.startsWith(prefix))) return true; |
| [components/RouteGuard.tsx:91](../../components/RouteGuard.tsx#L91) |       router.replace(`/login?redirect=${encodeURIComponent(pathname)}`); |
| [components/RouteGuard.tsx:99](../../components/RouteGuard.tsx#L99) |     if (!user.emailVerified && appUser?.role !== 'admin') { |
| [components/RouteGuard.tsx:102](../../components/RouteGuard.tsx#L102) |       router.replace('/login'); |
| [components/RouteGuard.tsx:107](../../components/RouteGuard.tsx#L107) |     if (appUser && !appUser.isOnboarded && |
| [components/RouteGuard.tsx:108](../../components/RouteGuard.tsx#L108) |         appUser.role !== 'admin' && |
| [components/RouteGuard.tsx:113](../../components/RouteGuard.tsx#L113) |       if (appUser.role === 'client') { |
| [components/RouteGuard.tsx:114](../../components/RouteGuard.tsx#L114) |         router.replace('/onboarding/client'); |
| [components/RouteGuard.tsx:115](../../components/RouteGuard.tsx#L115) |       } else if (appUser.role === 'professional') { |
| [components/RouteGuard.tsx:116](../../components/RouteGuard.tsx#L116) |         router.replace('/onboarding/professional'); |
| [components/RouteGuard.tsx:124](../../components/RouteGuard.tsx#L124) |     // users who slipped through with isOnboarded: true but are missing |
| [components/RouteGuard.tsx:127](../../components/RouteGuard.tsx#L127) |       appUser?.isOnboarded === true && |
| [components/RouteGuard.tsx:128](../../components/RouteGuard.tsx#L128) |       appUser.role !== 'admin' && |
| [components/RouteGuard.tsx:132](../../components/RouteGuard.tsx#L132) |       const redirectPath = appUser.role === 'professional' |
| [components/RouteGuard.tsx:135](../../components/RouteGuard.tsx#L135) |       router.replace(redirectPath); |
| [components/ShopAvailabilityTab.tsx:119](../../components/ShopAvailabilityTab.tsx#L119) |       await setDoc(doc(db, 'schedules', `${user.uid}_shard_0`), { |
| [components/ShopPhotosTab.tsx:25](../../components/ShopPhotosTab.tsx#L25) |       await addDoc(collection(db, 'featureRequests'), { |
| [components/ShopServicesTab.tsx:57](../../components/ShopServicesTab.tsx#L57) |       await addDoc(collection(db, 'services'), serviceSchema.parse({ |
| [components/ShopServicesTab.tsx:73](../../components/ShopServicesTab.tsx#L73) |     try { await deleteDoc(doc(db, 'services', id)); mutateServices(); } catch (e) { console.error(e); } |
| [components/ShopServicesTab.tsx:77](../../components/ShopServicesTab.tsx#L77) |     try { await updateDoc(doc(db, 'services', id), { isActive: !current }); mutateServices(); } catch (e) { console.error(e); } |
| [components/ShopServicesTab.tsx:87](../../components/ShopServicesTab.tsx#L87) |       await updateDoc(doc(db, 'services', id), { name: editName, price: Number(editPrice), durationMinutes: Number(editDuration) }); |
| [components/ShopServicesTab.tsx:97](../../components/ShopServicesTab.tsx#L97) |       await updateDoc(doc(db, 'businesses', user.uid), businessUpdateSchema.parse({ |
| [components/ShopSettingsTab.tsx:203](../../components/ShopSettingsTab.tsx#L203) |             await updateDoc(doc(db, 'businesses', user.uid), businessUpdateSchema.parse({ coverPhotoUrl: downloadURL })); |
| [components/ShopSettingsTab.tsx:255](../../components/ShopSettingsTab.tsx#L255) |             await updateDoc(doc(db, 'businesses', user.uid), businessUpdateSchema.parse({ logoUrl: downloadURL })); |
| [components/ShopSettingsTab.tsx:280](../../components/ShopSettingsTab.tsx#L280) |     await updateDoc(doc(db, 'businesses', user.uid), { coverPhotoUrl: deleteField() }); |
| [components/ShopSettingsTab.tsx:293](../../components/ShopSettingsTab.tsx#L293) |     await updateDoc(doc(db, 'businesses', user.uid), { logoUrl: deleteField() }); |
| [components/ShopSettingsTab.tsx:314](../../components/ShopSettingsTab.tsx#L314) |       await updateDoc(doc(db, 'businesses', user.uid), businessUpdateSchema.parse({ |
| [components/ShopSettingsTab.tsx:346](../../components/ShopSettingsTab.tsx#L346) |       await updateDoc(doc(db, 'businesses', user.uid), businessUpdateSchema.parse({ |
| [components/ShopSettingsTab.tsx:365](../../components/ShopSettingsTab.tsx#L365) |       await updateDoc(doc(db, 'businesses', user.uid), businessUpdateSchema.parse({ googleMapsUrl: sanitizeUrl(googleMapsUrl) })); |
| [components/ShopSettingsTab.tsx:380](../../components/ShopSettingsTab.tsx#L380) |       await updateDoc(doc(db, 'businesses', user.uid), { |
| [components/ShopSettingsTab.tsx:402](../../components/ShopSettingsTab.tsx#L402) |       await updateDoc(doc(db, 'users', user.uid), { [field]: value }); |
| [components/ShopSettingsTab.tsx:422](../../components/ShopSettingsTab.tsx#L422) |       const barbersSnap = await getDocs(query(collection(db, 'professionalProfiles'), where('businessId', '==', user?.uid))); |
| [components/ShopSettingsTab.tsx:427](../../components/ShopSettingsTab.tsx#L427) |         const notifRef = doc( |
| [components/ShopSettingsTab.tsx:428](../../components/ShopSettingsTab.tsx#L428) |           collection(db, 'notifications') |
| [components/ShopSettingsTab.tsx:440](../../components/ShopSettingsTab.tsx#L440) |       const servicesSnap = await getDocs(query(collection(db, 'services'), where('providerId', '==', user?.uid), where('providerType', '==', 'shop'))); |
| [components/ShopSettingsTab.tsx:444](../../components/ShopSettingsTab.tsx#L444) |       const invitesSnap = await getDocs(query(collection(db, 'invites'), where('shopId', '==', user?.uid))); |
| [components/ShopSettingsTab.tsx:450](../../components/ShopSettingsTab.tsx#L450) |           collection(db, 'bookings'), |
| [components/ShopSettingsTab.tsx:451](../../components/ShopSettingsTab.tsx#L451) |           where('shopId', '==', user!.uid), |
| [components/ShopSettingsTab.tsx:452](../../components/ShopSettingsTab.tsx#L452) |           where('status', 'in', ['pending', 'confirmed']) |
| [components/ShopSettingsTab.tsx:462](../../components/ShopSettingsTab.tsx#L462) |         const notifRef = doc(collection(db, 'notifications')); |
| [components/ShopSettingsTab.tsx:476](../../components/ShopSettingsTab.tsx#L476) |           collection(db, 'bookings'), |
| [components/ShopSettingsTab.tsx:477](../../components/ShopSettingsTab.tsx#L477) |           where('shopId', '==', user!.uid), |
| [components/ShopSettingsTab.tsx:478](../../components/ShopSettingsTab.tsx#L478) |           where('status', 'in', [ |
| [components/ShopSettingsTab.tsx:495](../../components/ShopSettingsTab.tsx#L495) |       batch.delete(doc(db, 'schedules', `${user!.uid}_shard_0`)); |
| [components/ShopSettingsTab.tsx:498](../../components/ShopSettingsTab.tsx#L498) |       batch.delete(doc(db, 'businesses', user!.uid)); |
| [components/ShopSettingsTab.tsx:501](../../components/ShopSettingsTab.tsx#L501) |       batch.update(doc(db, 'users', user!.uid), { ownsShop: false }); |
| [components/ShopSettingsTab.tsx:502](../../components/ShopSettingsTab.tsx#L502) |       batch.update(doc(db, 'professionalProfiles', user!.uid), { ownsBusiness: false, businessId: null }); |
| [components/ShopSettingsTab.tsx:506](../../components/ShopSettingsTab.tsx#L506) |       router.push('/dashboard/barber'); |
| [components/ShopSettingsTab.tsx:853](../../components/ShopSettingsTab.tsx#L853) |               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([shop.address.street, shop.address.buildingNumber, shop.address.city, shop.address.country].filter(Boolean).join(' '))}`} |
| [components/ShopTeamTab.tsx:36](../../components/ShopTeamTab.tsx#L36) |       collection(db, 'invites'), |
| [components/ShopTeamTab.tsx:37](../../components/ShopTeamTab.tsx#L37) |       where('shopId', '==', user.uid), |
| [components/ShopTeamTab.tsx:38](../../components/ShopTeamTab.tsx#L38) |       where('status', '==', 'pending') |
| [components/ShopTeamTab.tsx:43](../../components/ShopTeamTab.tsx#L43) |         const bSnap = await getDoc(doc(db, 'users', inv.barberId)); |
| [components/ShopTeamTab.tsx:59](../../components/ShopTeamTab.tsx#L59) |     const q = query(collection(db, 'professionalProfiles'), where('businessId', '==', user.uid)); |
| [components/ShopTeamTab.tsx:76](../../components/ShopTeamTab.tsx#L76) |         const uSnap = await getDoc(doc(db, 'users', barberId)); |
| [components/ShopTeamTab.tsx:79](../../components/ShopTeamTab.tsx#L79) |         const sSnap = await getDoc(doc(db, 'schedules', `${barberId}_shard_0`)); |
| [components/ShopTeamTab.tsx:122](../../components/ShopTeamTab.tsx#L122) |       const q = query(collection(db, 'professionalProfiles'), where('professionalCode', '==', normalised)); |
| [components/ShopTeamTab.tsx:133](../../components/ShopTeamTab.tsx#L133) |       const bUserSnap = await getDoc(doc(db, 'users', targetUid)); |
| [components/ShopTeamTab.tsx:158](../../components/ShopTeamTab.tsx#L158) |         collection(db, 'invites'), |
| [components/ShopTeamTab.tsx:159](../../components/ShopTeamTab.tsx#L159) |         where('shopId', '==', user.uid), |
| [components/ShopTeamTab.tsx:160](../../components/ShopTeamTab.tsx#L160) |         where('barberId', '==', foundBarber.userId), |
| [components/ShopTeamTab.tsx:161](../../components/ShopTeamTab.tsx#L161) |         where('status', '==', 'pending') |
| [components/ShopTeamTab.tsx:175](../../components/ShopTeamTab.tsx#L175) |       const businessSnap = await getDoc(doc(db, 'businesses', user.uid)); |
| [components/ShopTeamTab.tsx:179](../../components/ShopTeamTab.tsx#L179) |       await addDoc(collection(db, 'invites'), inviteSchema.parse({ |
| [components/ShopTeamTab.tsx:187](../../components/ShopTeamTab.tsx#L187) |       await addDoc(collection(db, 'notifications'), notificationSchema.parse({ |
| [components/ShopTeamTab.tsx:194](../../components/ShopTeamTab.tsx#L194) |       updateDoc(doc(db, 'users', foundBarber.userId), { unreadCount: increment(1) }).catch(console.error); |
| [components/ShopTeamTab.tsx:208](../../components/ShopTeamTab.tsx#L208) |       await setDoc(doc(db, 'invites', inviteId), inviteUpdateSchema.parse({ status: 'cancelled', respondedAt: Date.now() }), { merge: true }); |
| [components/ShopTeamTab.tsx:219](../../components/ShopTeamTab.tsx#L219) |       await updateDoc(doc(db, 'professionalProfiles', barberId), { |
| [components/ShopTeamTab.tsx:223](../../components/ShopTeamTab.tsx#L223) |       const invQ = query(collection(db, 'invites'), where('shopId', '==', user.uid), where('barberId', '==', barberId)); |
| [components/ShopTeamTab.tsx:225](../../components/ShopTeamTab.tsx#L225) |       await Promise.all(invSnap.docs.map(d =&gt; deleteDoc(doc(db, 'invites', d.id)))); |
| [components/ShopTeamTab.tsx:427](../../components/ShopTeamTab.tsx#L427) |                     &lt;Link href={`/barber/${barberId}`} className="text-[11px] font-bold text-brand-yellow hover:underline"&gt; |
| [components/ShopTimePicker.tsx:154](../../components/ShopTimePicker.tsx#L154) |         doc(db, 'schedules', getScheduleDocId(bid)), |
| [components/ShopTimePicker.tsx:184](../../components/ShopTimePicker.tsx#L184) |           collection(db, 'bookings'), |
| [components/ShopTimePicker.tsx:185](../../components/ShopTimePicker.tsx#L185) |           where('barberId', '==', bid), |
| [components/ShopTimePicker.tsx:186](../../components/ShopTimePicker.tsx#L186) |           where('date', '&gt;=', startDate), |
| [components/ShopTimePicker.tsx:187](../../components/ShopTimePicker.tsx#L187) |           where('date', '&lt;=', endDate), |
| [components/ShopTimePicker.tsx:188](../../components/ShopTimePicker.tsx#L188) |           where('status', 'in', ['pending', 'confirmed']) |
| [components/SmartTimePicker.tsx:169](../../components/SmartTimePicker.tsx#L169) |       doc(db, 'schedules', getScheduleDocId(barberId)), |
| [components/SmartTimePicker.tsx:191](../../components/SmartTimePicker.tsx#L191) |         collection(db, 'bookings'), |
| [components/SmartTimePicker.tsx:192](../../components/SmartTimePicker.tsx#L192) |         where('barberId', '==', barberId), |
| [components/SmartTimePicker.tsx:193](../../components/SmartTimePicker.tsx#L193) |         where('date', '&gt;=', startDate), |
| [components/SmartTimePicker.tsx:194](../../components/SmartTimePicker.tsx#L194) |         where('date', '&lt;=', endDate), |
| [components/SmartTimePicker.tsx:195](../../components/SmartTimePicker.tsx#L195) |         where('status', 'in', ['pending', 'confirmed']) |
| [components/SmartTimePicker.tsx:274](../../components/SmartTimePicker.tsx#L274) |           href="/barbers" |
| [components/SuspendedBookingBanner.tsx:25](../../components/SuspendedBookingBanner.tsx#L25) |         href="/challenge" |
| [components/titiza-film/content.ts:89](../../components/titiza-film/content.ts#L89) |       role: 'Hair Analyst', |
| [components/titiza-film/content.ts:195](../../components/titiza-film/content.ts#L195) |       role: 'Especialista en análisis capilar', |
| [components/titiza-film/film-sequencer.tsx:265](../../components/titiza-film/film-sequencer.tsx#L265) |         role: c.s4.card.role, |
| [components/TopNav.tsx:23](../../components/TopNav.tsx#L23) |     router.push('/login'); |
| [components/TopNav.tsx:79](../../components/TopNav.tsx#L79) |           &lt;Link href="/" className="flex items-center"&gt; |
| [components/TopNav.tsx:86](../../components/TopNav.tsx#L86) |           &lt;Link href="/" className={getLinkClass('/')}&gt;{t('nav.home')}&lt;/Link&gt; |
| [components/TopNav.tsx:91](../../components/TopNav.tsx#L91) |           &lt;Link href="/barbers" className={getLinkClass('/barbers')}&gt;{t('nav.barbers')}&lt;/Link&gt; |
| [components/TopNav.tsx:92](../../components/TopNav.tsx#L92) |           &lt;Link href="/shops" className={getLinkClass('/shops')}&gt;{t('nav.shops')}&lt;/Link&gt; |
| [components/TopNav.tsx:93](../../components/TopNav.tsx#L93) |           &lt;Link href="/challenge" className={getLinkClass('/challenge')}&gt;{t('nav.challenge')}&lt;/Link&gt; |
| [components/TopNav.tsx:296](../../components/TopNav.tsx#L296) |                 {appUser?.role === 'client' && &lt;Link href="/dashboard/client" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors mr-4"&gt;{t('nav.dashboard')}&lt;/Link&gt;} |
| [components/TopNav.tsx:297](../../components/TopNav.tsx#L297) |                 {appUser?.role === 'professional' && &lt;Link href="/dashboard/barber" className="text-sm font-bold text-[#888580] hover:text-[#F0EDE8] transition-colors mr-4"&gt;{t('nav.dashboard')}&lt;/Link&gt;} |
| [components/TopNav.tsx:308](../../components/TopNav.tsx#L308) |               &lt;Link href="/login" className="text-sm font-bold text-[#F0EDE8] hover:text-[#888580] transition-colors border border-[#1E1E1E] px-4 py-2 rounded-full"&gt; |
| [components/TopNav.tsx:311](../../components/TopNav.tsx#L311) |               &lt;Link href="/signup" className="text-sm font-bold bg-[#FFD600] text-[#0A0A0A] px-4 py-2 rounded-full hover:opacity-90 transition-opacity"&gt; |
| [components/TopNav.tsx:325](../../components/TopNav.tsx#L325) |               href="/login" |
| [components/TopNav.tsx:433](../../components/TopNav.tsx#L433) |               href={link.href} |
| [components/TopNav.tsx:454](../../components/TopNav.tsx#L454) |                   href="/signup" |
| [components/TopNav.tsx:471](../../components/TopNav.tsx#L471) |                   href="/login" |
| [components/TopNav.tsx:492](../../components/TopNav.tsx#L492) |                   href={appUser?.role === 'professional' ? '/dashboard/barber' : '/dashboard/client'} |
| [components/VerifyEmailGate.tsx:137](../../components/VerifyEmailGate.tsx#L137) |               href="/login" |
| [components/VerifyEmailGate.tsx:203](../../components/VerifyEmailGate.tsx#L203) |               href="/login" |
| [functions/src/index.ts:18](../../functions/src/index.ts#L18) | const ALGOLIA_SHOP_INDEX = 'businesses'; |
| [functions/src/index.ts:20](../../functions/src/index.ts#L20) | const ALGOLIA_CHALLENGE_SHOPS_INDEX = 'challenge_businesses'; |
| [functions/src/index.ts:36](../../functions/src/index.ts#L36) |     .collection('professionalProfiles') |
| [functions/src/index.ts:37](../../functions/src/index.ts#L37) |     .doc(professionalId); |
| [functions/src/index.ts:44](../../functions/src/index.ts#L44) |     !profile.isLive \|\| |
| [functions/src/index.ts:62](../../functions/src/index.ts#L62) |     .collection('users') |
| [functions/src/index.ts:63](../../functions/src/index.ts#L63) |     .doc(professionalId) |
| [functions/src/index.ts:71](../../functions/src/index.ts#L71) |     .collection('services') |
| [functions/src/index.ts:72](../../functions/src/index.ts#L72) |     .where('providerId', '==', professionalId) |
| [functions/src/index.ts:87](../../functions/src/index.ts#L87) |     .collection('schedules') |
| [functions/src/index.ts:88](../../functions/src/index.ts#L88) |     .doc(`${professionalId}_shard_0`) |
| [functions/src/index.ts:123](../../functions/src/index.ts#L123) |     isLive:           profile.isLive, |
| [functions/src/index.ts:125](../../functions/src/index.ts#L125) |     isSolo:           profile.businessId == null, |
| [functions/src/index.ts:143](../../functions/src/index.ts#L143) |     document: 'professionalProfiles/{professionalId}', |
| [functions/src/index.ts:174](../../functions/src/index.ts#L174) |         .collection('professionalProfiles') |
| [functions/src/index.ts:175](../../functions/src/index.ts#L175) |         .where('isFake', '==', true) |
| [functions/src/index.ts:176](../../functions/src/index.ts#L176) |         .where('isVisible', '==', true) |
| [functions/src/index.ts:177](../../functions/src/index.ts#L177) |         .where('city', '==', city) |
| [functions/src/index.ts:183](../../functions/src/index.ts#L183) |           .collection('professionalProfiles') |
| [functions/src/index.ts:184](../../functions/src/index.ts#L184) |           .where('isFake', '==', true) |
| [functions/src/index.ts:185](../../functions/src/index.ts#L185) |           .where('isVisible', '==', true) |
| [functions/src/index.ts:215](../../functions/src/index.ts#L215) |       const profileRef = db.collection('professionalProfiles').doc(barberId); |
| [functions/src/index.ts:220](../../functions/src/index.ts#L220) |         const businessRef = db.collection('businesses').doc(after.shopId); |
| [functions/src/index.ts:229](../../functions/src/index.ts#L229) |       const aggRef = db.collection('aggregations').doc(aggId); |
| [functions/src/index.ts:246](../../functions/src/index.ts#L246) |         const notificationRef = db.collection('notifications').doc(); |
| [functions/src/index.ts:274](../../functions/src/index.ts#L274) |     const profileRef = db.collection('professionalProfiles').doc(barberId); |
| [functions/src/index.ts:307](../../functions/src/index.ts#L307) |     const oldNotifications = await db.collection('notifications') |
| [functions/src/index.ts:308](../../functions/src/index.ts#L308) |       .where('createdAt', '&lt;', Timestamp.fromMillis(thirtyDaysAgo)) |
| [functions/src/index.ts:314](../../functions/src/index.ts#L314) |     const oldInvites = await db.collection('invites') |
| [functions/src/index.ts:315](../../functions/src/index.ts#L315) |       .where('status', '==', 'pending') |
| [functions/src/index.ts:316](../../functions/src/index.ts#L316) |       .where('createdAt', '&lt;', fourteenDaysAgo) |
| [functions/src/index.ts:334](../../functions/src/index.ts#L334) |     const userRef = db.collection('users').doc(uid); |
| [functions/src/index.ts:335](../../functions/src/index.ts#L335) |     const profileRef = db.collection('professionalProfiles').doc(uid); |
| [functions/src/index.ts:336](../../functions/src/index.ts#L336) |     const businessRef = db.collection('businesses').doc(uid); |
| [functions/src/index.ts:337](../../functions/src/index.ts#L337) |     const scheduleRef = db.collection('schedules').doc(`${uid}_shard_0`); |
| [functions/src/index.ts:353](../../functions/src/index.ts#L353) |       .collection('bookings') |
| [functions/src/index.ts:354](../../functions/src/index.ts#L354) |       .where('barberId', '==', uid) |
| [functions/src/index.ts:355](../../functions/src/index.ts#L355) |       .where('status', 'in', ['pending', 'confirmed']) |
| [functions/src/index.ts:369](../../functions/src/index.ts#L369) |         const notifRef = db.collection('notifications').doc(); |
| [functions/src/index.ts:418](../../functions/src/index.ts#L418) |     const profileSnap = await db.collection('professionalProfiles').doc(professionalId).get(); |
| [functions/src/index.ts:538](../../functions/src/index.ts#L538) |     const submissionRef = db.collection('challengeSubmissions').doc(submissionId); |
| [functions/src/index.ts:539](../../functions/src/index.ts#L539) |     const userRef = db.collection('users').doc(voterUid); |
| [functions/src/index.ts:564](../../functions/src/index.ts#L564) |   // barbersCount is now derived by querying professionalProfiles |
| [functions/src/index.ts:567](../../functions/src/index.ts#L567) |     .collection('professionalProfiles') |
| [functions/src/index.ts:568](../../functions/src/index.ts#L568) |     .where('businessId', '==', businessId) |
| [functions/src/index.ts:593](../../functions/src/index.ts#L593) |     document: 'businesses/{businessId}', |
| [functions/src/index.ts:640](../../functions/src/index.ts#L640) |     const configRef = db.collection('siteConfig').doc('challenge'); |
| [hooks/useChallengeConfig.ts:27](../../hooks/useChallengeConfig.ts#L27) |       const snap = await getDoc(doc(db, 'siteConfig', 'challenge')) |
| [hooks/useShowFakeUIData.ts:11](../../hooks/useShowFakeUIData.ts#L11) |       const snap = await getDoc(doc(db, 'siteConfig', 'global')); |
| [lib/auth-context.tsx:16](../../lib/auth-context.tsx#L16) |   role: 'client' \| 'professional' \| 'admin'; |
| [lib/auth-context.tsx:19](../../lib/auth-context.tsx#L19) |   isOnboarded: boolean; |
| [lib/auth-context.tsx:21](../../lib/auth-context.tsx#L21) |   ownsShop?: boolean; |
| [lib/auth-context.tsx:31](../../lib/auth-context.tsx#L31) |   isLive?: boolean; |
| [lib/auth-context.tsx:38](../../lib/auth-context.tsx#L38) |   isSolo?: boolean; |
| [lib/auth-context.tsx:82](../../lib/auth-context.tsx#L82) |         const docRef = doc(db, 'users', user.uid); |
| [lib/auth-context.tsx:99](../../lib/auth-context.tsx#L99) |           const docRef = doc(db, 'users', firebaseUser.uid); |
| [lib/auth-context.tsx:112](../../lib/auth-context.tsx#L112) |             if (userData.role === 'professional' && !userData.isOnboarded) { |
| [lib/auth-context.tsx:113](../../lib/auth-context.tsx#L113) |               const profileRef = doc(db, 'professionalProfiles', firebaseUser.uid); |
| [lib/auth-context.tsx:118](../../lib/auth-context.tsx#L118) |                   await updateDoc(docRef, userUpdateSchema.parse({ isOnboarded: true })); |
| [lib/auth-context.tsx:119](../../lib/auth-context.tsx#L119) |                   userData.isOnboarded = true; |
| [lib/auth-context.tsx:130](../../lib/auth-context.tsx#L130) |               userData.role === 'professional' && |
| [lib/auth-context.tsx:131](../../lib/auth-context.tsx#L131) |               userData.isOnboarded === true && |
| [lib/auth-context.tsx:134](../../lib/auth-context.tsx#L134) |               const profileRef = doc(db, 'professionalProfiles', firebaseUser.uid); |
| [lib/auth-context.tsx:161](../../lib/auth-context.tsx#L161) |               role: 'client', // Default fallback |
| [lib/auth-context.tsx:164](../../lib/auth-context.tsx#L164) |               isOnboarded: false, |
| [lib/auth-context.tsx:165](../../lib/auth-context.tsx#L165) |               ownsShop: false |
| [lib/booking-lock-utils.ts:15](../../lib/booking-lock-utils.ts#L15) |   const lockDocRef = doc(db, 'bookingLocks', `${booking.barberId}_${booking.date}`); |
| [lib/delete-account.ts:125](../../lib/delete-account.ts#L125) |     collection(db, 'bookings'), |
| [lib/delete-account.ts:126](../../lib/delete-account.ts#L126) |     where('clientId', '==', uid), |
| [lib/delete-account.ts:127](../../lib/delete-account.ts#L127) |     where('status', 'in', ['pending', 'confirmed']) |
| [lib/delete-account.ts:137](../../lib/delete-account.ts#L137) |     const notifRef = doc(collection(db, 'notifications')); |
| [lib/delete-account.ts:150](../../lib/delete-account.ts#L150) |     collection(db, 'bookings'), |
| [lib/delete-account.ts:151](../../lib/delete-account.ts#L151) |     where('clientId', '==', uid), |
| [lib/delete-account.ts:152](../../lib/delete-account.ts#L152) |     where('status', 'in', PAST_STATUSES) |
| [lib/delete-account.ts:164](../../lib/delete-account.ts#L164) |     collection(db, 'reviews'), |
| [lib/delete-account.ts:165](../../lib/delete-account.ts#L165) |     where('clientId', '==', uid) |
| [lib/delete-account.ts:177](../../lib/delete-account.ts#L177) |     collection(db, 'notifications'), |
| [lib/delete-account.ts:178](../../lib/delete-account.ts#L178) |     where('userId', '==', uid) |
| [lib/delete-account.ts:186](../../lib/delete-account.ts#L186) |   await mgr.delete(doc(db, 'users', uid)); |
| [lib/delete-account.ts:210](../../lib/delete-account.ts#L210) |  *  10. Delete professionalProfiles/{uid}. |
| [lib/delete-account.ts:218](../../lib/delete-account.ts#L218) |   const profileSnap = await getDoc(doc(db, 'professionalProfiles', uid)); |
| [lib/delete-account.ts:224](../../lib/delete-account.ts#L224) |     collection(db, 'bookings'), |
| [lib/delete-account.ts:225](../../lib/delete-account.ts#L225) |     where('barberId', '==', uid), |
| [lib/delete-account.ts:226](../../lib/delete-account.ts#L226) |     where('status', 'in', ['pending', 'confirmed']) |
| [lib/delete-account.ts:236](../../lib/delete-account.ts#L236) |     const notifRef = doc(collection(db, 'notifications')); |
| [lib/delete-account.ts:249](../../lib/delete-account.ts#L249) |     collection(db, 'bookings'), |
| [lib/delete-account.ts:250](../../lib/delete-account.ts#L250) |     where('barberId', '==', uid), |
| [lib/delete-account.ts:251](../../lib/delete-account.ts#L251) |     where('status', 'in', PAST_STATUSES) |
| [lib/delete-account.ts:263](../../lib/delete-account.ts#L263) |     collection(db, 'reviews'), |
| [lib/delete-account.ts:264](../../lib/delete-account.ts#L264) |     where('providerId', '==', uid) |
| [lib/delete-account.ts:272](../../lib/delete-account.ts#L272) |     collection(db, 'reviews'), |
| [lib/delete-account.ts:273](../../lib/delete-account.ts#L273) |     where('clientId', '==', uid) |
| [lib/delete-account.ts:287](../../lib/delete-account.ts#L287) |     const businessSnap = await getDoc(doc(db, 'businesses', businessId)); |
| [lib/delete-account.ts:291](../../lib/delete-account.ts#L291) |       const notifRef = doc(collection(db, 'notifications')); |
| [lib/delete-account.ts:304](../../lib/delete-account.ts#L304) |     collection(db, 'services'), |
| [lib/delete-account.ts:305](../../lib/delete-account.ts#L305) |     where('providerId', '==', uid) |
| [lib/delete-account.ts:313](../../lib/delete-account.ts#L313) |   await mgr.delete(doc(db, 'schedules', `${uid}_shard_0`)); |
| [lib/delete-account.ts:317](../../lib/delete-account.ts#L317) |     collection(db, 'notifications'), |
| [lib/delete-account.ts:318](../../lib/delete-account.ts#L318) |     where('userId', '==', uid) |
| [lib/delete-account.ts:325](../../lib/delete-account.ts#L325) |   await mgr.delete(doc(db, 'professionalProfiles', uid)); |
| [lib/delete-account.ts:328](../../lib/delete-account.ts#L328) |   await mgr.delete(doc(db, 'users', uid)); |
| [lib/delete-account.ts:344](../../lib/delete-account.ts#L344) |  *      professionalProfiles by businessId). Their personal totalCuts stays intact. |
| [lib/delete-account.ts:350](../../lib/delete-account.ts#L350) |  *   5. Delete businesses/{shopId}. |
| [lib/delete-account.ts:364](../../lib/delete-account.ts#L364) |     collection(db, 'professionalProfiles'), |
| [lib/delete-account.ts:365](../../lib/delete-account.ts#L365) |     where('businessId', '==', shopId) |
| [lib/delete-account.ts:370](../../lib/delete-account.ts#L370) |   //    firestore.rules the owner may only clear businessId (not isSolo). |
| [lib/delete-account.ts:375](../../lib/delete-account.ts#L375) |     await mgr.update(doc(db, 'professionalProfiles', barberId), { |
| [lib/delete-account.ts:379](../../lib/delete-account.ts#L379) |     const notifRef = doc(collection(db, 'notifications')); |
| [lib/delete-account.ts:391](../../lib/delete-account.ts#L391) |     collection(db, 'bookings'), |
| [lib/delete-account.ts:392](../../lib/delete-account.ts#L392) |     where('shopId', '==', shopId), |
| [lib/delete-account.ts:393](../../lib/delete-account.ts#L393) |     where('status', 'in', ['pending', 'confirmed']) |
| [lib/delete-account.ts:403](../../lib/delete-account.ts#L403) |     const notifRef = doc(collection(db, 'notifications')); |
| [lib/delete-account.ts:417](../../lib/delete-account.ts#L417) |     collection(db, 'bookings'), |
| [lib/delete-account.ts:418](../../lib/delete-account.ts#L418) |     where('shopId', '==', shopId), |
| [lib/delete-account.ts:419](../../lib/delete-account.ts#L419) |     where('status', 'in', PAST_STATUSES) |
| [lib/delete-account.ts:431](../../lib/delete-account.ts#L431) |     collection(db, 'services'), |
| [lib/delete-account.ts:432](../../lib/delete-account.ts#L432) |     where('providerId', '==', shopId) |
| [lib/delete-account.ts:439](../../lib/delete-account.ts#L439) |   await mgr.delete(doc(db, 'businesses', shopId)); |
| [lib/fakeDataGenerator.ts:217](../../lib/fakeDataGenerator.ts#L217) |   role: 'professional'; |
| [lib/fakeDataGenerator.ts:224](../../lib/fakeDataGenerator.ts#L224) |   isLive: true; |
| [lib/fakeDataGenerator.ts:225](../../lib/fakeDataGenerator.ts#L225) |   isSolo: true; |
| [lib/fakeDataGenerator.ts:283](../../lib/fakeDataGenerator.ts#L283) |       role: 'professional', |
| [lib/fakeDataGenerator.ts:290](../../lib/fakeDataGenerator.ts#L290) |       isLive: true, |
| [lib/fakeDataGenerator.ts:291](../../lib/fakeDataGenerator.ts#L291) |       isSolo: true, |
| [lib/fakeUIData.ts:19](../../lib/fakeUIData.ts#L19) |     "isLive": true, |
| [lib/fakeUIData.ts:20](../../lib/fakeUIData.ts#L20) |     "isSolo": true, |
| [lib/fakeUIData.ts:114](../../lib/fakeUIData.ts#L114) |     "isLive": true, |
| [lib/fakeUIData.ts:115](../../lib/fakeUIData.ts#L115) |     "isSolo": true, |
| [lib/fakeUIData.ts:222](../../lib/fakeUIData.ts#L222) |     "isLive": true, |
| [lib/fakeUIData.ts:223](../../lib/fakeUIData.ts#L223) |     "isSolo": true, |
| [lib/fakeUIData.ts:318](../../lib/fakeUIData.ts#L318) |     "isLive": true, |
| [lib/fakeUIData.ts:319](../../lib/fakeUIData.ts#L319) |     "isSolo": true, |
| [lib/fakeUIData.ts:415](../../lib/fakeUIData.ts#L415) |     "isLive": true, |
| [lib/fakeUIData.ts:416](../../lib/fakeUIData.ts#L416) |     "isSolo": true, |
| [lib/fakeUIData.ts:515](../../lib/fakeUIData.ts#L515) |     "isLive": true, |
| [lib/fakeUIData.ts:516](../../lib/fakeUIData.ts#L516) |     "isSolo": true, |
| [lib/fakeUIData.ts:628](../../lib/fakeUIData.ts#L628) |     "isLive": true, |
| [lib/fakeUIData.ts:629](../../lib/fakeUIData.ts#L629) |     "isSolo": true, |
| [lib/fakeUIData.ts:718](../../lib/fakeUIData.ts#L718) |     "isLive": true, |
| [lib/fakeUIData.ts:719](../../lib/fakeUIData.ts#L719) |     "isSolo": true, |
| [lib/fakeUIData.ts:837](../../lib/fakeUIData.ts#L837) |     "isLive": true, |
| [lib/fakeUIData.ts:838](../../lib/fakeUIData.ts#L838) |     "isSolo": true, |
| [lib/fakeUIData.ts:936](../../lib/fakeUIData.ts#L936) |     "isLive": true, |
| [lib/fakeUIData.ts:937](../../lib/fakeUIData.ts#L937) |     "isSolo": true, |
| [lib/fakeUIData.ts:1031](../../lib/fakeUIData.ts#L1031) |     "isLive": true, |
| [lib/fakeUIData.ts:1032](../../lib/fakeUIData.ts#L1032) |     "isSolo": true, |
| [lib/fakeUIData.ts:1121](../../lib/fakeUIData.ts#L1121) |     "isLive": true, |
| [lib/fakeUIData.ts:1122](../../lib/fakeUIData.ts#L1122) |     "isSolo": true, |
| [lib/fakeUIData.ts:1220](../../lib/fakeUIData.ts#L1220) |     "isLive": true, |
| [lib/fakeUIData.ts:1221](../../lib/fakeUIData.ts#L1221) |     "isSolo": true, |
| [lib/fakeUIData.ts:1303](../../lib/fakeUIData.ts#L1303) |     "isLive": true, |
| [lib/fakeUIData.ts:1304](../../lib/fakeUIData.ts#L1304) |     "isSolo": true, |
| [lib/fakeUIData.ts:1391](../../lib/fakeUIData.ts#L1391) |     "isLive": true, |
| [lib/fakeUIData.ts:1392](../../lib/fakeUIData.ts#L1392) |     "isSolo": true, |
| [lib/fakeUIData.ts:1479](../../lib/fakeUIData.ts#L1479) |     "isLive": true, |
| [lib/fakeUIData.ts:1480](../../lib/fakeUIData.ts#L1480) |     "isSolo": true, |
| [lib/fakeUIData.ts:1573](../../lib/fakeUIData.ts#L1573) |     "isLive": true, |
| [lib/fakeUIData.ts:1574](../../lib/fakeUIData.ts#L1574) |     "isSolo": true, |
| [lib/fakeUIData.ts:1679](../../lib/fakeUIData.ts#L1679) |     "isLive": true, |
| [lib/fakeUIData.ts:1680](../../lib/fakeUIData.ts#L1680) |     "isSolo": true, |
| [lib/fakeUIData.ts:1773](../../lib/fakeUIData.ts#L1773) |     "isLive": true, |
| [lib/fakeUIData.ts:1774](../../lib/fakeUIData.ts#L1774) |     "isSolo": true, |
| [lib/fakeUIData.ts:1879](../../lib/fakeUIData.ts#L1879) |     "isLive": true, |
| [lib/fakeUIData.ts:1880](../../lib/fakeUIData.ts#L1880) |     "isSolo": true, |
| [lib/fakeUIData.ts:1981](../../lib/fakeUIData.ts#L1981) |     "isLive": true, |
| [lib/fakeUIData.ts:1982](../../lib/fakeUIData.ts#L1982) |     "isSolo": true, |
| [lib/fakeUIData.ts:2082](../../lib/fakeUIData.ts#L2082) |     "isLive": true, |
| [lib/fakeUIData.ts:2083](../../lib/fakeUIData.ts#L2083) |     "isSolo": true, |
| [lib/fakeUIData.ts:2196](../../lib/fakeUIData.ts#L2196) |     "isLive": true, |
| [lib/fakeUIData.ts:2197](../../lib/fakeUIData.ts#L2197) |     "isSolo": true, |
| [lib/fakeUIData.ts:2298](../../lib/fakeUIData.ts#L2298) |     "isLive": true, |
| [lib/fakeUIData.ts:2299](../../lib/fakeUIData.ts#L2299) |     "isSolo": true, |
| [lib/fakeUIData.ts:2415](../../lib/fakeUIData.ts#L2415) |     "isLive": true, |
| [lib/fakeUIData.ts:2416](../../lib/fakeUIData.ts#L2416) |     "isSolo": true, |
| [lib/fakeUIData.ts:2498](../../lib/fakeUIData.ts#L2498) |     "isLive": true, |
| [lib/fakeUIData.ts:2499](../../lib/fakeUIData.ts#L2499) |     "isSolo": true, |
| [lib/fakeUIData.ts:2597](../../lib/fakeUIData.ts#L2597) |     "isLive": true, |
| [lib/fakeUIData.ts:2598](../../lib/fakeUIData.ts#L2598) |     "isSolo": true, |
| [lib/fakeUIData.ts:2704](../../lib/fakeUIData.ts#L2704) |     "isLive": true, |
| [lib/fakeUIData.ts:2705](../../lib/fakeUIData.ts#L2705) |     "isSolo": true, |
| [lib/fakeUIData.ts:2801](../../lib/fakeUIData.ts#L2801) |     "isLive": true, |
| [lib/fakeUIData.ts:2802](../../lib/fakeUIData.ts#L2802) |     "isSolo": true, |
| [lib/fakeUIData.ts:2906](../../lib/fakeUIData.ts#L2906) |     "isLive": true, |
| [lib/fakeUIData.ts:2907](../../lib/fakeUIData.ts#L2907) |     "isSolo": true, |
| [lib/fakeUIData.ts:3025](../../lib/fakeUIData.ts#L3025) |     "isLive": true, |
| [lib/fakeUIData.ts:3026](../../lib/fakeUIData.ts#L3026) |     "isSolo": true, |
| [lib/fakeUIData.ts:3138](../../lib/fakeUIData.ts#L3138) |     "isLive": true, |
| [lib/fakeUIData.ts:3139](../../lib/fakeUIData.ts#L3139) |     "isSolo": true, |
| [lib/fakeUIData.ts:3240](../../lib/fakeUIData.ts#L3240) |     "isLive": true, |
| [lib/fakeUIData.ts:3241](../../lib/fakeUIData.ts#L3241) |     "isSolo": true, |
| [lib/fakeUIData.ts:3333](../../lib/fakeUIData.ts#L3333) |     "isLive": true, |
| [lib/fakeUIData.ts:3334](../../lib/fakeUIData.ts#L3334) |     "isSolo": true, |
| [lib/fakeUIData.ts:3446](../../lib/fakeUIData.ts#L3446) |     "isLive": true, |
| [lib/fakeUIData.ts:3447](../../lib/fakeUIData.ts#L3447) |     "isSolo": true, |
| [lib/fakeUIData.ts:3570](../../lib/fakeUIData.ts#L3570) |     "isLive": true, |
| [lib/fakeUIData.ts:3571](../../lib/fakeUIData.ts#L3571) |     "isSolo": true, |
| [lib/fakeUIData.ts:3665](../../lib/fakeUIData.ts#L3665) |     "isLive": true, |
| [lib/fakeUIData.ts:3666](../../lib/fakeUIData.ts#L3666) |     "isSolo": true, |
| [lib/fakeUIData.ts:3771](../../lib/fakeUIData.ts#L3771) |     "isLive": true, |
| [lib/fakeUIData.ts:3772](../../lib/fakeUIData.ts#L3772) |     "isSolo": true, |
| [lib/fakeUIData.ts:3890](../../lib/fakeUIData.ts#L3890) |     "isLive": true, |
| [lib/fakeUIData.ts:3891](../../lib/fakeUIData.ts#L3891) |     "isSolo": true, |
| [lib/fakeUIData.ts:3984](../../lib/fakeUIData.ts#L3984) |     "isLive": true, |
| [lib/fakeUIData.ts:3985](../../lib/fakeUIData.ts#L3985) |     "isSolo": true, |
| [lib/fakeUIData.ts:4084](../../lib/fakeUIData.ts#L4084) |     "isLive": true, |
| [lib/fakeUIData.ts:4085](../../lib/fakeUIData.ts#L4085) |     "isSolo": true, |
| [lib/fakeUIData.ts:4196](../../lib/fakeUIData.ts#L4196) |     "isLive": true, |
| [lib/fakeUIData.ts:4197](../../lib/fakeUIData.ts#L4197) |     "isSolo": true, |
| [lib/fakeUIData.ts:4311](../../lib/fakeUIData.ts#L4311) |     "isLive": true, |
| [lib/fakeUIData.ts:4312](../../lib/fakeUIData.ts#L4312) |     "isSolo": true, |
| [lib/fakeUIData.ts:4435](../../lib/fakeUIData.ts#L4435) |     "isLive": true, |
| [lib/fakeUIData.ts:4436](../../lib/fakeUIData.ts#L4436) |     "isSolo": true, |
| [lib/fakeUIData.ts:4554](../../lib/fakeUIData.ts#L4554) |     "isLive": true, |
| [lib/fakeUIData.ts:4555](../../lib/fakeUIData.ts#L4555) |     "isSolo": true, |
| [lib/fakeUIData.ts:4678](../../lib/fakeUIData.ts#L4678) |     "isLive": true, |
| [lib/fakeUIData.ts:4679](../../lib/fakeUIData.ts#L4679) |     "isSolo": true, |
| [lib/fakeUIData.ts:4797](../../lib/fakeUIData.ts#L4797) |     "isLive": true, |
| [lib/fakeUIData.ts:4798](../../lib/fakeUIData.ts#L4798) |     "isSolo": true, |
| [lib/fakeUIData.ts:4899](../../lib/fakeUIData.ts#L4899) |     "isLive": true, |
| [lib/fakeUIData.ts:4900](../../lib/fakeUIData.ts#L4900) |     "isSolo": true, |
| [lib/fakeUIData.ts:4995](../../lib/fakeUIData.ts#L4995) |     "isLive": true, |
| [lib/fakeUIData.ts:4996](../../lib/fakeUIData.ts#L4996) |     "isSolo": true, |
| [lib/fakeUIData.ts:5100](../../lib/fakeUIData.ts#L5100) |     "isLive": true, |
| [lib/fakeUIData.ts:5101](../../lib/fakeUIData.ts#L5101) |     "isSolo": true, |
| [lib/fakeUIData.ts:5206](../../lib/fakeUIData.ts#L5206) |     "isLive": true, |
| [lib/fakeUIData.ts:5207](../../lib/fakeUIData.ts#L5207) |     "isSolo": true, |
| [lib/fakeUIData.ts:5296](../../lib/fakeUIData.ts#L5296) |     "isLive": true, |
| [lib/fakeUIData.ts:5297](../../lib/fakeUIData.ts#L5297) |     "isSolo": true, |
| [lib/fakeUIData.ts:5402](../../lib/fakeUIData.ts#L5402) |     "isLive": true, |
| [lib/fakeUIData.ts:5403](../../lib/fakeUIData.ts#L5403) |     "isSolo": true, |
| [lib/fakeUIData.ts:5516](../../lib/fakeUIData.ts#L5516) |     "isLive": true, |
| [lib/fakeUIData.ts:5517](../../lib/fakeUIData.ts#L5517) |     "isSolo": true, |
| [lib/fakeUIData.ts:5621](../../lib/fakeUIData.ts#L5621) |     "isLive": true, |
| [lib/fakeUIData.ts:5622](../../lib/fakeUIData.ts#L5622) |     "isSolo": true, |
| [lib/fakeUIData.ts:5733](../../lib/fakeUIData.ts#L5733) |     "isLive": true, |
| [lib/fakeUIData.ts:5734](../../lib/fakeUIData.ts#L5734) |     "isSolo": true, |
| [lib/fakeUIData.ts:5845](../../lib/fakeUIData.ts#L5845) |     "isLive": true, |
| [lib/fakeUIData.ts:5846](../../lib/fakeUIData.ts#L5846) |     "isSolo": true, |
| [lib/fakeUIData.ts:5969](../../lib/fakeUIData.ts#L5969) |     "isLive": true, |
| [lib/fakeUIData.ts:5970](../../lib/fakeUIData.ts#L5970) |     "isSolo": true, |
| [lib/fakeUIData.ts:6076](../../lib/fakeUIData.ts#L6076) |     "isLive": true, |
| [lib/fakeUIData.ts:6077](../../lib/fakeUIData.ts#L6077) |     "isSolo": true, |
| [lib/fakeUIData.ts:6172](../../lib/fakeUIData.ts#L6172) |     "isLive": true, |
| [lib/fakeUIData.ts:6173](../../lib/fakeUIData.ts#L6173) |     "isSolo": true, |
| [lib/fakeUIData.ts:6256](../../lib/fakeUIData.ts#L6256) |     "isLive": true, |
| [lib/fakeUIData.ts:6257](../../lib/fakeUIData.ts#L6257) |     "isSolo": true, |
| [lib/fakeUIData.ts:6357](../../lib/fakeUIData.ts#L6357) |     "isLive": true, |
| [lib/fakeUIData.ts:6358](../../lib/fakeUIData.ts#L6358) |     "isSolo": true, |
| [lib/fakeUIData.ts:6460](../../lib/fakeUIData.ts#L6460) |     "isLive": true, |
| [lib/fakeUIData.ts:6461](../../lib/fakeUIData.ts#L6461) |     "isSolo": true, |
| [lib/fakeUIData.ts:6567](../../lib/fakeUIData.ts#L6567) |     "isLive": true, |
| [lib/fakeUIData.ts:6568](../../lib/fakeUIData.ts#L6568) |     "isSolo": true, |
| [lib/fakeUIData.ts:6651](../../lib/fakeUIData.ts#L6651) |     "isLive": true, |
| [lib/fakeUIData.ts:6652](../../lib/fakeUIData.ts#L6652) |     "isSolo": true, |
| [lib/fakeUIData.ts:6765](../../lib/fakeUIData.ts#L6765) |     "isLive": true, |
| [lib/fakeUIData.ts:6766](../../lib/fakeUIData.ts#L6766) |     "isSolo": true, |
| [lib/fakeUIData.ts:6870](../../lib/fakeUIData.ts#L6870) |     "isLive": true, |
| [lib/fakeUIData.ts:6871](../../lib/fakeUIData.ts#L6871) |     "isSolo": true, |
| [lib/fakeUIData.ts:6982](../../lib/fakeUIData.ts#L6982) |     "isLive": true, |
| [lib/fakeUIData.ts:6983](../../lib/fakeUIData.ts#L6983) |     "isSolo": true, |
| [lib/fakeUIData.ts:7095](../../lib/fakeUIData.ts#L7095) |     "isLive": true, |
| [lib/fakeUIData.ts:7096](../../lib/fakeUIData.ts#L7096) |     "isSolo": true, |
| [lib/fakeUIData.ts:7213](../../lib/fakeUIData.ts#L7213) |     "isLive": true, |
| [lib/fakeUIData.ts:7214](../../lib/fakeUIData.ts#L7214) |     "isSolo": true, |
| [lib/fakeUIData.ts:7331](../../lib/fakeUIData.ts#L7331) |     "isLive": true, |
| [lib/fakeUIData.ts:7332](../../lib/fakeUIData.ts#L7332) |     "isSolo": true, |
| [lib/fakeUIData.ts:7424](../../lib/fakeUIData.ts#L7424) |     "isLive": true, |
| [lib/fakeUIData.ts:7425](../../lib/fakeUIData.ts#L7425) |     "isSolo": true, |
| [lib/fakeUIData.ts:7523](../../lib/fakeUIData.ts#L7523) |     "isLive": true, |
| [lib/fakeUIData.ts:7524](../../lib/fakeUIData.ts#L7524) |     "isSolo": true, |
| [lib/fakeUIData.ts:7612](../../lib/fakeUIData.ts#L7612) |     "isLive": true, |
| [lib/fakeUIData.ts:7613](../../lib/fakeUIData.ts#L7613) |     "isSolo": true, |
| [lib/fakeUIData.ts:7736](../../lib/fakeUIData.ts#L7736) |     "isLive": true, |
| [lib/fakeUIData.ts:7737](../../lib/fakeUIData.ts#L7737) |     "isSolo": true, |
| [lib/fakeUIData.ts:7843](../../lib/fakeUIData.ts#L7843) |     "isLive": true, |
| [lib/fakeUIData.ts:7844](../../lib/fakeUIData.ts#L7844) |     "isSolo": true, |
| [lib/fakeUIData.ts:7961](../../lib/fakeUIData.ts#L7961) |     "isLive": true, |
| [lib/fakeUIData.ts:7962](../../lib/fakeUIData.ts#L7962) |     "isSolo": true, |
| [lib/fakeUIData.ts:8069](../../lib/fakeUIData.ts#L8069) |     "isLive": true, |
| [lib/fakeUIData.ts:8070](../../lib/fakeUIData.ts#L8070) |     "isSolo": true, |
| [lib/fakeUIData.ts:8188](../../lib/fakeUIData.ts#L8188) |     "isLive": true, |
| [lib/fakeUIData.ts:8189](../../lib/fakeUIData.ts#L8189) |     "isSolo": true, |
| [lib/fakeUIData.ts:8282](../../lib/fakeUIData.ts#L8282) |     "isLive": true, |
| [lib/fakeUIData.ts:8283](../../lib/fakeUIData.ts#L8283) |     "isSolo": true, |
| [lib/fakeUIData.ts:8396](../../lib/fakeUIData.ts#L8396) |     "isLive": true, |
| [lib/fakeUIData.ts:8397](../../lib/fakeUIData.ts#L8397) |     "isSolo": true, |
| [lib/fakeUIData.ts:8486](../../lib/fakeUIData.ts#L8486) |     "isLive": true, |
| [lib/fakeUIData.ts:8487](../../lib/fakeUIData.ts#L8487) |     "isSolo": true, |
| [lib/fakeUIData.ts:8599](../../lib/fakeUIData.ts#L8599) |     "isLive": true, |
| [lib/fakeUIData.ts:8600](../../lib/fakeUIData.ts#L8600) |     "isSolo": true, |
| [lib/fakeUIData.ts:8714](../../lib/fakeUIData.ts#L8714) |     "isLive": true, |
| [lib/fakeUIData.ts:8715](../../lib/fakeUIData.ts#L8715) |     "isSolo": true, |
| [lib/fakeUIData.ts:8828](../../lib/fakeUIData.ts#L8828) |     "isLive": true, |
| [lib/fakeUIData.ts:8829](../../lib/fakeUIData.ts#L8829) |     "isSolo": true, |
| [lib/fakeUIData.ts:8941](../../lib/fakeUIData.ts#L8941) |     "isLive": true, |
| [lib/fakeUIData.ts:8942](../../lib/fakeUIData.ts#L8942) |     "isSolo": true, |
| [lib/fakeUIData.ts:9048](../../lib/fakeUIData.ts#L9048) |     "isLive": true, |
| [lib/fakeUIData.ts:9049](../../lib/fakeUIData.ts#L9049) |     "isSolo": true, |
| [lib/fakeUIData.ts:9137](../../lib/fakeUIData.ts#L9137) |     "isLive": true, |
| [lib/fakeUIData.ts:9138](../../lib/fakeUIData.ts#L9138) |     "isSolo": true, |
| [lib/fakeUIData.ts:9254](../../lib/fakeUIData.ts#L9254) |     "isLive": true, |
| [lib/fakeUIData.ts:9255](../../lib/fakeUIData.ts#L9255) |     "isSolo": true, |
| [lib/fakeUIData.ts:9347](../../lib/fakeUIData.ts#L9347) |     "isLive": true, |
| [lib/fakeUIData.ts:9348](../../lib/fakeUIData.ts#L9348) |     "isSolo": true, |
| [lib/fakeUIData.ts:9453](../../lib/fakeUIData.ts#L9453) |     "isLive": true, |
| [lib/fakeUIData.ts:9454](../../lib/fakeUIData.ts#L9454) |     "isSolo": true, |
| [lib/fakeUIData.ts:9556](../../lib/fakeUIData.ts#L9556) |     "isLive": true, |
| [lib/fakeUIData.ts:9557](../../lib/fakeUIData.ts#L9557) |     "isSolo": true, |
| [lib/fakeUIData.ts:9657](../../lib/fakeUIData.ts#L9657) |     "isLive": true, |
| [lib/fakeUIData.ts:9658](../../lib/fakeUIData.ts#L9658) |     "isSolo": true, |
| [lib/fakeUIData.ts:9753](../../lib/fakeUIData.ts#L9753) |     "isLive": true, |
| [lib/fakeUIData.ts:9754](../../lib/fakeUIData.ts#L9754) |     "isSolo": true, |
| [lib/fakeUIData.ts:9847](../../lib/fakeUIData.ts#L9847) |     "isLive": true, |
| [lib/fakeUIData.ts:9848](../../lib/fakeUIData.ts#L9848) |     "isSolo": true, |
| [lib/fakeUIData.ts:9931](../../lib/fakeUIData.ts#L9931) |     "isLive": true, |
| [lib/fakeUIData.ts:9932](../../lib/fakeUIData.ts#L9932) |     "isSolo": true, |
| [lib/fakeUIData.ts:10038](../../lib/fakeUIData.ts#L10038) |     "isLive": true, |
| [lib/fakeUIData.ts:10039](../../lib/fakeUIData.ts#L10039) |     "isSolo": true, |
| [lib/fakeUIData.ts:10145](../../lib/fakeUIData.ts#L10145) |     "isLive": true, |
| [lib/fakeUIData.ts:10146](../../lib/fakeUIData.ts#L10146) |     "isSolo": true, |
| [lib/fakeUIData.ts:10268](../../lib/fakeUIData.ts#L10268) |     "isLive": true, |
| [lib/fakeUIData.ts:10269](../../lib/fakeUIData.ts#L10269) |     "isSolo": true, |
| [lib/fakeUIData.ts:10375](../../lib/fakeUIData.ts#L10375) |     "isLive": true, |
| [lib/fakeUIData.ts:10376](../../lib/fakeUIData.ts#L10376) |     "isSolo": true, |
| [lib/profile-complete.ts:19](../../lib/profile-complete.ts#L19) |   // Professionals: isOnboarded flag on the users doc is the sole routing gate. |
| [lib/profile-complete.ts:20](../../lib/profile-complete.ts#L20) |   // phone/city/country live authoritatively on professionalProfiles, not users, |
| [lib/profile-complete.ts:22](../../lib/profile-complete.ts#L22) |   if (user.role === 'professional') { |
| [lib/profile-complete.ts:23](../../lib/profile-complete.ts#L23) |     return user.isOnboarded === true; |
| [lib/profile-complete.ts:36](../../lib/profile-complete.ts#L36) |   if (user?.role === 'professional' && PROFESSIONAL_DEFAULTS.includes(user?.city)) { |
| [lib/schemas.ts:6](../../lib/schemas.ts#L6) |   role: z.enum(['client', 'professional', 'admin']).optional(), |
| [lib/schemas.ts:9](../../lib/schemas.ts#L9) |   isOnboarded: z.boolean().optional(), |
| [lib/schemas.ts:14](../../lib/schemas.ts#L14) |   ownsShop: z.boolean().optional(), |
| [lib/schemas.ts:37](../../lib/schemas.ts#L37) |   isLive: z.boolean(), |
| [lib/titiza-utils.ts:46](../../lib/titiza-utils.ts#L46) |     const ref = doc(db, 'users', uid); |
| [lib/titiza-utils.ts:82](../../lib/titiza-utils.ts#L82) |     await updateDoc(doc(db, 'users', uid), { |
| [lib/types.ts:13](../../lib/types.ts#L13) |   isLive: boolean; |
| [lib/types.ts:56](../../lib/types.ts#L56) |   role: 'client' \| 'professional' \| 'admin'; |
| [lib/types.ts:65](../../lib/types.ts#L65) |   isOnboarded: boolean; |
| [lib/types.ts:66](../../lib/types.ts#L66) |   ownsShop: boolean; |
| [lib/types.ts:155](../../lib/types.ts#L155) |   paymentMethod?: 'cash'; |
| [lib/types.ts:232](../../lib/types.ts#L232) |   role: 'admin'; |
