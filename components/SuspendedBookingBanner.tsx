'use client'
import { useLang } from '@/lib/i18n/LangContext'
import Link from 'next/link'

interface Props {
  endDate?: string
}

export default function SuspendedBookingBanner({ endDate }: Props) {
  const { t } = useLang()
  return (
    <div className="w-full rounded-2xl border border-orange-200 bg-orange-50 p-6 text-center">
      <div className="text-3xl mb-3">🏆</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {t('challenge.suspendedTitle')}
      </h3>
      <p className="text-sm text-gray-600 mb-1">
        {t('challenge.suspendedBody')}
        {endDate
          ? <span className="font-semibold text-gray-900"> {endDate}.</span>
          : <span className="text-gray-500"> {t('challenge.suspendedDate')}</span>
        }
      </p>
      <Link
        href="/challenge"
        className="inline-block mt-4 px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition"
      >
        {t('challenge.suspendedCta')}
      </Link>
    </div>
  )
}
