import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface ChallengeConfig {
  submissionsOpenAt: number
  submissionsCloseAt: number
  votingOpenAt: number
  votingCloseAt: number
  eventDate: string
  feeBarber: number
  feeShop: number
  prizeBarberValue: number
  prizeShopValue: number
  showHomepageBox: boolean
  challengeMode: boolean
  challengeModeEndDate: string
  publicLeaderboardEnabled: boolean
  ibanText: string
  accountHolderName: string
}

export function useChallengeConfig() {
  return useQuery({
    queryKey: ['siteConfig', 'challenge'],
    queryFn: async (): Promise<ChallengeConfig> => {
      const snap = await getDoc(doc(db, 'siteConfig', 'challenge'))
      if (!snap.exists()) {
        return {
          submissionsOpenAt: 0,
          submissionsCloseAt: 0,
          votingOpenAt: 0,
          votingCloseAt: 0,
          eventDate: '2026-09-17T20:00:00+02:00',
          feeBarber: 49,
          feeShop: 99,
          prizeBarberValue: 15000,
          prizeShopValue: 100000,
          showHomepageBox: true,
          challengeMode: false,
          challengeModeEndDate: '',
          publicLeaderboardEnabled: false,
          ibanText: '',
          accountHolderName: '',
        }
      }
      const d = snap.data()
      return {
        submissionsOpenAt: d.submissionsOpenAt ?? 0,
        submissionsCloseAt: d.submissionsCloseAt ?? 0,
        votingOpenAt: d.votingOpenAt ?? 0,
        votingCloseAt: d.votingCloseAt ?? 0,
        eventDate: d.eventDate ?? '2026-09-17T20:00:00+02:00',
        feeBarber: d.feeBarber ?? 49,
        feeShop: d.feeShop ?? 99,
        prizeBarberValue: d.prizeBarberValue ?? 15000,
        prizeShopValue: d.prizeShopValue ?? 100000,
        showHomepageBox: d.showHomepageBox ?? true,
        challengeMode: d.challengeMode ?? false,
        challengeModeEndDate: d.challengeModeEndDate ?? '',
        publicLeaderboardEnabled: d.publicLeaderboardEnabled ?? false,
        ibanText: d.ibanText ?? '',
        accountHolderName: d.accountHolderName ?? '',
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  })
}
