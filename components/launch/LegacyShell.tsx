'use client';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next";
import { CookieBanner } from '@/components/CookieBanner';
import Providers from '@/lib/query-provider';
import { AuthProvider } from '@/lib/auth-context';
import { ConditionalNav } from '@/components/ConditionalNav';
import { Toaster } from 'react-hot-toast';
import { OfflineBanner } from '@/components/OfflineBanner';
import { LangProvider } from '@/lib/i18n/LangContext';
import { PresenceTracker } from '@/components/PresenceTracker';

export default function LegacyShell({ children }: { children: React.ReactNode }) {
  return (
        <Providers>
          <AuthProvider>
            <PresenceTracker />
            <LangProvider>
            <OfflineBanner />
            <ConditionalNav>
              {children}
            </ConditionalNav>
            <CookieBanner />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#111111',
                  color: '#F0EDE8',
                  border: '1px solid #1E1E1E',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '13px',
                },
                success: {
                  iconTheme: {
                    primary: '#FFD600',
                    secondary: '#0a0a0a',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
            <SpeedInsights />
            <Analytics />
            </LangProvider>
          </AuthProvider>
        </Providers>
  );
}
