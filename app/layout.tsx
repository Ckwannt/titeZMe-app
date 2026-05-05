import type {Metadata} from 'next';
import { Nunito } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { TopNav } from '@/components/TopNav';
import Providers from '@/lib/query-provider';
import { AuthProvider } from '@/lib/auth-context';
import { RouteGuard } from '@/components/RouteGuard';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' });

export const metadata: Metadata = {
  title: 'titeZMe',
  description: 'Barber shop booking platform',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="font-sans antialiased selection:bg-brand-yellow selection:text-brand-bg flex flex-col min-h-screen" suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            <TopNav />
            <main className="flex-1 overflow-x-hidden">
              <RouteGuard>
                {children}
              </RouteGuard>
            </main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#181818',
                  color: '#ffffff',
                  border: '1px solid #2a2a2a',
                  fontFamily: 'Nunito, sans-serif',
                  fontSize: '13px',
                },
                success: {
                  iconTheme: {
                    primary: '#F5C518',
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
