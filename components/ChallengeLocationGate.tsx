'use client';

import React from 'react';
import { useLang } from '@/lib/i18n/LangContext';

function isSpain(country: string | undefined | null): boolean {
  if (!country) return false;
  const n = country.trim().toLowerCase();
  return (
    n === 'es' ||
    n === 'spain' ||
    n === 'españa' ||
    n === 'espana'
  );
}

function getCountryDisplay(country: string): string {
  if (country.trim().length > 2) return country.trim();
  const map: Record<string, string> = {
    fr: 'France', gb: 'United Kingdom', de: 'Germany',
    it: 'Italy', pt: 'Portugal', nl: 'Netherlands',
    be: 'Belgium', ma: 'Morocco', dz: 'Algeria',
    tn: 'Tunisia', us: 'United States', ca: 'Canada',
    se: 'Sweden', no: 'Norway', dk: 'Denmark',
    ch: 'Switzerland', at: 'Austria', pl: 'Poland',
    ro: 'Romania', tr: 'Turkey', sa: 'Saudi Arabia',
    ae: 'United Arab Emirates', sn: 'Senegal',
    ci: "Côte d'Ivoire", cm: 'Cameroon', gn: 'Guinea',
    ml: 'Mali', bf: 'Burkina Faso', ne: 'Niger',
  };
  return map[country.trim().toLowerCase()] || country.toUpperCase();
}

interface Props {
  country: string | undefined | null;
  children: React.ReactNode;
}

export default function ChallengeLocationGate({ country, children }: Props) {
  const { t } = useLang();

  if (isSpain(country)) {
    return <>{children}</>;
  }

  if (country) {
    const displayName = getCountryDisplay(country);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="text-6xl mb-6">🌍</div>
        <h2 className="text-2xl font-bold text-white mb-3">
          {t('challenge.locationGate.comingSoonPrefix')}
          {displayName}
          {t('challenge.locationGate.comingSoonSuffix')}
        </h2>
        <p className="text-[#888] text-sm max-w-sm leading-relaxed">
          {t('challenge.locationGate.comingSoonBody')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="text-6xl mb-6">📍</div>
      <h2 className="text-2xl font-bold text-white mb-3">
        {t('challenge.locationGate.noCountryTitle')}
      </h2>
      <p className="text-[#888] text-sm max-w-sm leading-relaxed">
        {t('challenge.locationGate.noCountryBody')}
      </p>
    </div>
  );
}
