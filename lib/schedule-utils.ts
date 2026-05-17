export type OpenStatus = {
  label: string
  color: string
  isOpen: boolean
  state: 'open' | 'opens_soon' | 'closed' | 'no_schedule'
}

/**
 * Single source of truth for the Firestore schedule document ID.
 * Every file must use this instead of hardcoding `${uid}_shard_0`.
 */
export function getScheduleDocId(uid: string): string {
  return `${uid}_shard_0`
}

/**
 * Get local date string in YYYY-MM-DD
 * using the BARBER's timezone, not UTC.
 * Falls back to viewer's local time
 * if barber timezone unknown.
 */
export function getLocalDateString(timezone?: string): string {
  try {
    if (timezone) {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      return formatter.format(now)
    }
  } catch (e) {
    // fallback if timezone is invalid
  }
  const now = new Date()
  return `${now.getFullYear()}-` +
    `${String(now.getMonth() + 1).padStart(2, '0')}-` +
    `${String(now.getDate()).padStart(2, '0')}`
}

/**
 * Get current hour string HH:00
 * using the BARBER's timezone.
 */
export function getLocalHourString(timezone?: string): string {
  try {
    if (timezone) {
      const now = new Date()
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone,
        hour: '2-digit',
        hour12: false
      })
      const hour = formatter.format(now).split(':')[0]
      return `${hour.padStart(2, '0')}:00`
    }
  } catch (e) {
    // fallback
  }
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:00`
}

/**
 * Derive IANA timezone from city and country.
 * Covers all major regions titeZMe operates in.
 * Falls back to the browser's local timezone so clients in the same
 * timezone as the barber always get the right result.
 */
export function getTimezoneFromLocation(city?: string, country?: string): string {
  const c = (city || '').toLowerCase()
  const co = (country || '').toLowerCase()

  // ── Europe ────────────────────────────────────────────────────────────────
  if (co.includes('spain') || co.includes('españa') ||
      c.includes('madrid') || c.includes('barcelona') ||
      c.includes('seville') || c.includes('sevilla') ||
      c.includes('valencia') || c.includes('bilbao') ||
      c.includes('malaga') || c.includes('zaragoza'))
    return 'Europe/Madrid'

  if (co.includes('france') ||
      c.includes('paris') || c.includes('lyon') ||
      c.includes('marseille') || c.includes('bordeaux') ||
      c.includes('toulouse') || c.includes('nice') ||
      c.includes('strasbourg') || c.includes('nantes'))
    return 'Europe/Paris'

  if (co.includes('united kingdom') || co.includes('uk') ||
      co.includes('england') || co.includes('scotland') ||
      co.includes('wales') || co.includes('britain') ||
      c.includes('london') || c.includes('manchester') ||
      c.includes('birmingham') || c.includes('glasgow') ||
      c.includes('liverpool') || c.includes('edinburgh') ||
      c.includes('bristol') || c.includes('leeds'))
    return 'Europe/London'

  if (co.includes('netherlands') || co.includes('holland') ||
      c.includes('amsterdam') || c.includes('rotterdam') ||
      c.includes('the hague') || c.includes('utrecht'))
    return 'Europe/Amsterdam'

  if (co.includes('germany') || co.includes('deutschland') ||
      c.includes('berlin') || c.includes('munich') ||
      c.includes('münchen') || c.includes('hamburg') ||
      c.includes('cologne') || c.includes('köln') ||
      c.includes('frankfurt') || c.includes('düsseldorf'))
    return 'Europe/Berlin'

  if (co.includes('italy') || co.includes('italia') ||
      c.includes('rome') || c.includes('roma') ||
      c.includes('milan') || c.includes('milano') ||
      c.includes('naples') || c.includes('napoli') ||
      c.includes('turin') || c.includes('torino'))
    return 'Europe/Rome'

  if (co.includes('belgium') || co.includes('belgique') ||
      c.includes('brussels') || c.includes('bruxelles') ||
      c.includes('antwerp') || c.includes('liège'))
    return 'Europe/Brussels'

  if (co.includes('sweden') || co.includes('sverige') ||
      c.includes('stockholm') || c.includes('gothenburg') ||
      c.includes('malmö'))
    return 'Europe/Stockholm'

  if (co.includes('norway') || co.includes('norge') ||
      c.includes('oslo') || c.includes('bergen'))
    return 'Europe/Oslo'

  if (co.includes('denmark') || co.includes('danmark') ||
      c.includes('copenhagen') || c.includes('københavn') ||
      c.includes('aarhus'))
    return 'Europe/Copenhagen'

  if (co.includes('switzerland') || co.includes('schweiz') ||
      c.includes('zurich') || c.includes('zürich') ||
      c.includes('geneva') || c.includes('genève') ||
      c.includes('bern') || c.includes('basel'))
    return 'Europe/Zurich'

  if (co.includes('portugal') ||
      c.includes('lisbon') || c.includes('lisboa') ||
      c.includes('porto'))
    return 'Europe/Lisbon'

  if (co.includes('austria') || co.includes('österreich') ||
      c.includes('vienna') || c.includes('wien'))
    return 'Europe/Vienna'

  if (co.includes('poland') || co.includes('polska') ||
      c.includes('warsaw') || c.includes('warszawa') ||
      c.includes('krakow') || c.includes('kraków'))
    return 'Europe/Warsaw'

  if (co.includes('greece') || co.includes('hellas') ||
      c.includes('athens') || c.includes('athina') ||
      c.includes('thessaloniki'))
    return 'Europe/Athens'

  if (co.includes('turkey') || co.includes('türkiye') ||
      c.includes('istanbul') || c.includes('ankara'))
    return 'Europe/Istanbul'

  // ── North Africa ──────────────────────────────────────────────────────────
  if (co.includes('morocco') || co.includes('maroc') ||
      co.includes('marrocco') ||
      c.includes('casablanca') || c.includes('marrakesh') ||
      c.includes('marrakech') || c.includes('rabat') ||
      c.includes('tangier') || c.includes('tanger') ||
      c.includes('fes') || c.includes('fez') ||
      c.includes('agadir') || c.includes('meknes') ||
      c.includes('oujda') || c.includes('kenitra'))
    return 'Africa/Casablanca'

  if (co.includes('algeria') || co.includes('algérie') ||
      c.includes('algiers') || c.includes('alger') ||
      c.includes('oran') || c.includes('constantine') ||
      c.includes('annaba'))
    return 'Africa/Algiers'

  if (co.includes('tunisia') || co.includes('tunisie') ||
      c.includes('tunis') || c.includes('sfax') ||
      c.includes('sousse'))
    return 'Africa/Tunis'

  if (co.includes('egypt') || co.includes('égypte') ||
      c.includes('cairo') || c.includes('le caire') ||
      c.includes('alexandria') || c.includes('alexandrie'))
    return 'Africa/Cairo'

  if (co.includes('libya') || co.includes('libye') ||
      c.includes('tripoli') || c.includes('benghazi'))
    return 'Africa/Tripoli'

  // ── Middle East ───────────────────────────────────────────────────────────
  if (co.includes('uae') || co.includes('emirates') ||
      co.includes('united arab') ||
      c.includes('dubai') || c.includes('abu dhabi') ||
      c.includes('sharjah') || c.includes('ajman'))
    return 'Asia/Dubai'

  if (co.includes('saudi') || co.includes('arabia') ||
      c.includes('riyadh') || c.includes('jeddah') ||
      c.includes('mecca') || c.includes('medina') ||
      c.includes('dammam'))
    return 'Asia/Riyadh'

  if (co.includes('qatar') ||
      c.includes('doha'))
    return 'Asia/Qatar'

  if (co.includes('kuwait') ||
      c.includes('kuwait city'))
    return 'Asia/Kuwait'

  if (co.includes('bahrain') ||
      c.includes('manama'))
    return 'Asia/Bahrain'

  if (co.includes('jordan') || co.includes('jordanie') ||
      c.includes('amman'))
    return 'Asia/Amman'

  if (co.includes('lebanon') || co.includes('liban') ||
      c.includes('beirut') || c.includes('beyrouth'))
    return 'Asia/Beirut'

  if (co.includes('israel') || co.includes('palestine') ||
      c.includes('tel aviv') || c.includes('jerusalem') ||
      c.includes('ramallah') || c.includes('gaza'))
    return 'Asia/Jerusalem'

  // ── Americas ──────────────────────────────────────────────────────────────
  if (co.includes('united states') || co.includes('usa') ||
      co.includes('u.s.a') ||
      c.includes('new york') || c.includes('miami') ||
      c.includes('boston') || c.includes('washington') ||
      c.includes('philadelphia') || c.includes('atlanta'))
    return 'America/New_York'

  if (c.includes('chicago') || c.includes('houston') ||
      c.includes('dallas') || c.includes('austin') ||
      c.includes('minneapolis'))
    return 'America/Chicago'

  if (c.includes('los angeles') || c.includes('san francisco') ||
      c.includes('seattle') || c.includes('portland') ||
      c.includes('las vegas') || c.includes('san diego'))
    return 'America/Los_Angeles'

  if (co.includes('canada') ||
      c.includes('toronto') || c.includes('ottawa') ||
      c.includes('montreal') || c.includes('calgary') ||
      c.includes('edmonton') || c.includes('winnipeg'))
    return 'America/Toronto'

  if (c.includes('vancouver'))
    return 'America/Vancouver'

  // ── Default: browser timezone ─────────────────────────────────────────────
  // Works perfectly when client is in the same timezone as the barber.
  // Better than hardcoding Madrid for international users.
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'Europe/Paris'
  }
}

/**
 * MAIN FUNCTION — Calculate open/closed status.
 * Uses barber's local timezone, not UTC.
 * Cached for 60 seconds per barber.
 */

const statusCache = new Map<string, { result: OpenStatus; timestamp: number }>()

export function getOpenStatus(
  availableSlots: Record<string, string[]> | null | undefined,
  city?: string,
  country?: string,
  barberId?: string
): OpenStatus {
  // Check cache (1 minute)
  if (barberId) {
    const cached = statusCache.get(barberId)
    if (cached && Date.now() - cached.timestamp < 60000) {
      return cached.result
    }
  }

  if (!availableSlots || Object.keys(availableSlots).length === 0) {
    return { label: 'Schedule not set', color: 'text-[#555]', isOpen: false, state: 'no_schedule' }
  }

  const timezone = getTimezoneFromLocation(city, country)
  const todayDate = getLocalDateString(timezone)
  const nowStr = getLocalHourString(timezone)
  const nowHour = parseInt(nowStr.split(':')[0])

  const todaySlots = availableSlots[todayDate] || []

  if (todaySlots.length === 0) {
    // Check if there are future slots this week to show next open time
    const futureDates = Object.keys(availableSlots).filter(d => d > todayDate).sort()

    if (futureDates.length > 0) {
      const nextDate = futureDates[0]
      const nextSlots = availableSlots[nextDate]
      if (nextSlots && nextSlots.length > 0) {
        const nextDateObj = new Date(nextDate + 'T12:00:00')
        const dayName = nextDateObj.toLocaleDateString('en-US', { weekday: 'short' })
        const result: OpenStatus = {
          label: `🔴 Closed · Opens ${dayName} ${nextSlots[0]}`,
          color: 'text-[#ef4444]',
          isOpen: false,
          state: 'closed'
        }
        if (barberId) statusCache.set(barberId, { result, timestamp: Date.now() })
        return result
      }
    }

    const result: OpenStatus = {
      label: '🔴 Closed today',
      color: 'text-[#ef4444]',
      isOpen: false,
      state: 'closed'
    }
    if (barberId) statusCache.set(barberId, { result, timestamp: Date.now() })
    return result
  }

  // Check if open RIGHT NOW
  if (todaySlots.includes(nowStr)) {
    const lastHour = parseInt(todaySlots[todaySlots.length - 1]) + 1
    const closeStr = `${String(lastHour).padStart(2, '0')}:00`
    const result: OpenStatus = {
      label: `🟢 Open now · Closes ${closeStr}`,
      color: 'text-[#22c55e]',
      isOpen: true,
      state: 'open'
    }
    if (barberId) statusCache.set(barberId, { result, timestamp: Date.now() })
    return result
  }

  // Check if opening soon (within 3 hours)
  const firstHour = parseInt(todaySlots[0])
  const hoursUntilOpen = firstHour - nowHour

  if (nowHour < firstHour) {
    if (hoursUntilOpen <= 3) {
      const result: OpenStatus = {
        label: `🟡 Opens in ${hoursUntilOpen}h · at ${todaySlots[0]}`,
        color: 'text-[#F5C518]',
        isOpen: false,
        state: 'opens_soon'
      }
      if (barberId) statusCache.set(barberId, { result, timestamp: Date.now() })
      return result
    }
    const result: OpenStatus = {
      label: `🔴 Closed · Opens at ${todaySlots[0]}`,
      color: 'text-[#ef4444]',
      isOpen: false,
      state: 'closed'
    }
    if (barberId) statusCache.set(barberId, { result, timestamp: Date.now() })
    return result
  }

  // Past all slots for today — check tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowDate = `${tomorrow.getFullYear()}-` +
    `${String(tomorrow.getMonth() + 1).padStart(2, '0')}-` +
    `${String(tomorrow.getDate()).padStart(2, '0')}`

  const tomorrowSlots = availableSlots[tomorrowDate] || []

  if (tomorrowSlots.length > 0) {
    const result: OpenStatus = {
      label: `🔴 Closed · Opens tomorrow ${tomorrowSlots[0]}`,
      color: 'text-[#ef4444]',
      isOpen: false,
      state: 'closed'
    }
    if (barberId) statusCache.set(barberId, { result, timestamp: Date.now() })
    return result
  }

  const result: OpenStatus = {
    label: '🔴 Closed for today',
    color: 'text-[#ef4444]',
    isOpen: false,
    state: 'closed'
  }
  if (barberId) statusCache.set(barberId, { result, timestamp: Date.now() })
  return result
}
