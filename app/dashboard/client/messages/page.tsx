'use client';

import { useLang } from '@/lib/i18n/LangContext';
import { ComingSoon } from '@/components/ComingSoon';

export default function ClientMessagesPage() {
  const { t } = useLang();
  return (
    <div className="p-6 md:p-8 md:px-10">
      <div className="animate-fadeUp max-w-[800px]">
        <h2 className="text-2xl font-black mb-6">{t('clientDash.messagesTitle')}</h2>
        <ComingSoon
          icon="💬"
          title={t('clientDash.messagesTitle')}
          body={t('clientDash.messagesBody')}
          showNotify
          featureKey="messages"
        />
      </div>
    </div>
  );
}
