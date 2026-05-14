export type OpenStatus = {
  label: string
  color: string
  isOpen: boolean
  state: 'open' | 'opens_soon' | 'closed' | 'no_schedule'
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
 * Covers the main cities titeZMe operates in.
 */
export function getTimezoneFromLocation(city?: string, country?: string): string {
  const c = (city || '').toLowerCase()
  const co = (country || '').toLowerCase()

  if (co.includes('spain') || co.includes('españa') ||
      c.includes('madrid') || c.includes('barcelona'))
    return 'Europe/Madrid'

  if (co.includes('morocco') || co.includes('maroc') ||
      c.includes('casablanca') || c.includes('marrakesh') || c.includes('rabat'))
    return 'Africa/Casablanca'

  if (co.includes('france') || c.includes('paris'))
    return 'Europe/Paris'

  if (co.includes('uk') || co.includes('united kingdom') || co.includes('england') || c.includes('london'))
    return 'Europe/London'

  if (co.includes('netherlands') || c.includes('amsterdam'))
    return 'Europe/Amsterdam'

  if (co.includes('germany') || c.includes('berlin'))
    return 'Europe/Berlin'

  if (co.includes('algeria') || c.includes('algiers'))
    return 'Africa/Algiers'

  if (co.includes('tunisia') || c.includes('tunis'))
    return 'Africa/Tunis'

  if (co.includes('uae') || co.includes('emirates') || c.includes('dubai'))
    return 'Asia/Dubai'

  if (co.includes('saudi') || c.includes('riyadh'))
    return 'Asia/Riyadh'

  if (co.includes('usa') || co.includes('united states'))
    return 'America/New_York'

  // Default: Europe/Madrid (most titeZMe barbers)
  return 'Europe/Madrid'
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
