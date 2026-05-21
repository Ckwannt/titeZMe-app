import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CookieBanner } from '@/components/CookieBanner';
import Providers from '@/lib/query-provider';
import { AuthProvider } from '@/lib/auth-context';
import { ConditionalNav } from '@/components/ConditionalNav';
import { Toaster } from 'react-hot-toast';
import { OfflineBanner } from '@/components/OfflineBanner';
import './globals.css';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
};

export const metadata: Metadata = {
  title: {
    default: 'titeZMe — Book Your Barber',
    template: '%s | titeZMe',
  },
  description: 'Find and book the best barbers near you. titeZMe connects you with top barbers and barbershops.',
  metadataBase: new URL('https://titezme.com'),
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome', url: '/web-app-manifest-192x192.png' },
      { rel: 'android-chrome', url: '/web-app-manifest-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'titeZMe — Book Your Barber',
    description: 'Find and book the best barbers near you.',
    url: 'https://titezme.com',
    siteName: 'titeZMe',
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'titeZMe — Book Your Barber',
    description: 'Find and book the best barbers near you.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="font-sans antialiased text-[#F0EDE8] bg-[#0A0A0A] selection:bg-[#FFD600] selection:text-[#0A0A0A] flex flex-col min-h-screen" suppressHydrationWarning>
        <Providers>
          <AuthProvider>
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
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
