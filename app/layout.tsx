import type {Metadata} from 'next';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://tite-z-me-app.vercel.app'),
  title: {
    default: 'titeZMe — Find Your Perfect Barber',
    template: '%s — titeZMe',
  },
  description: 'Find top-rated barbers near you. Real availability. Book in 30 seconds. Cash only.',
  keywords: ['barber', 'barbershop', 'haircut', 'fade', 'booking', 'hair'],
  openGraph: {
    type: 'website',
    siteName: 'titeZMe',
    images: ['/wordmark.png'],
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
