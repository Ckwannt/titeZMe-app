import type {Metadata} from 'next';
import { Nunito } from 'next/font/google';
import { TopNav } from '@/components/TopNav';
import { AuthProvider } from '@/lib/auth-context';
import { RouteGuard } from '@/components/RouteGuard';
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
        <AuthProvider>
          <TopNav />
          <main className="flex-1 overflow-x-hidden">
            <RouteGuard>
              {children}
            </RouteGuard>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
