'use client';

import { Cormorant_Garamond } from 'next/font/google';
import { useAuth } from '@/lib/auth-context';
import { AmbientBackground } from '@/components/titiza/ambient-background';
import { TitizaHero } from '@/components/titiza/titiza-hero';
import { BeautyProfileCard } from '@/components/titiza/beauty-profile-card';
import { FeatureCards } from '@/components/titiza/feature-cards';

// Cormorant Garamond is scoped to this route only, exposed as its own CSS
// variable. Nunito remains the app-wide font (see app/layout.tsx).
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-titiza-serif',
});

export default function ClientTitizaPage() {
  const { appUser } = useAuth();
  const firstName = appUser?.firstName?.trim() || 'there';

  return (
    <div className={`${cormorant.variable} relative min-h-full overflow-hidden`}>
      <AmbientBackground />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-20 px-6 pb-28 pt-16 sm:gap-24 sm:pt-24">
        <TitizaHero userName={firstName} />

        <BeautyProfileCard />

        <section className="flex flex-col gap-8">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold-muted">
              The Titiza Experience
            </p>
          </div>
          <FeatureCards />
        </section>
      </div>
    </div>
  );
}
