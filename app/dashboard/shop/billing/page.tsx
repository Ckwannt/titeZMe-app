'use client';

import { useLang } from "@/lib/i18n/LangContext";

export default function ShopBillingPage() {
  const { t } = useLang();
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-1">
        {t('shopDash.navBilling')}
      </h1>
      <p className="text-[#888] text-sm mb-8">
        {t('shop.manageSubscription')}
      </p>
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
        <p className="text-[#888] text-sm">
          {t('shop.subscriptionComingSoon')}
        </p>
      </div>
    </div>
  );
}
