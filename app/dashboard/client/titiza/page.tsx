'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Cormorant_Garamond } from 'next/font/google';
import { useAuth } from '@/lib/auth-context';
import { markTitizaMet, touchTitizaVisit } from '@/lib/titiza-utils';
import { isTitizaPhase2Enabled } from '@/lib/titiza-phase2-flag';
import { AmbientBackground } from '@/components/titiza/ambient-background';
import { TitizaHero } from '@/components/titiza/titiza-hero';
import { TitizaDecisionFlow } from '@/components/titiza/titiza-decision-flow';
import { BeautyProfileCard } from '@/components/titiza/beauty-profile-card';
import { FeatureCards } from '@/components/titiza/feature-cards';

// Cormorant Garamond is scoped to this route only, exposed as its own CSS
// variable. Nunito remains the app-wide font (see app/layout.tsx).
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-titiza-serif',
});

// 'phase2' is the flagged decision surface; when the flag is off, flagged
// users never enter it and the flow behaves exactly as Phase 1 ('dashboard').
type Phase = 'loading' | 'genesis' | 'dashboard' | 'phase2';

export default function ClientTitizaPage() {
  const { appUser, user } = useAuth();
  const firstName = appUser?.firstName?.trim() || 'there';

  const [phase, setPhase] = useState<Phase>('loading');
  // Captured once, on the first decision: was this a returning user on load?
  // Stays false for the whole genesis → Let's Begin → dashboard flow, so the
  // greeting reads "Hi" (not "Welcome back") right after a first meeting.
  const isReturningRef = useRef(false);
  const decidedRef = useRef(false);

  useEffect(() => {
    if (decidedRef.current) return;
    if (!appUser) return; // wait until the user document is available
    decidedRef.current = true;

    const hasMet = !!appUser.titiza?.hasMet;
    const phase2 = isTitizaPhase2Enabled(user?.uid);
    if (hasMet) {
      isReturningRef.current = true;
      // Flagged users land on the Phase 2 decision surface; everyone else keeps
      // the Phase 1 dashboard block (behavior unchanged when the flag is off).
      setPhase(phase2 ? 'phase2' : 'dashboard');
      if (user?.uid) touchTitizaVisit(user.uid); // bump lastVisitAt (once)
    } else {
      setPhase('genesis');
    }
  }, [appUser, user]);

  const handleBegin = useCallback(() => {
    if (user?.uid) markTitizaMet(user.uid);
    // Behind the flag, "Let's Begin" transitions into the decision flow instead
    // of the Phase 1 dashboard block. In-place cross-fade — no route change.
    setPhase(isTitizaPhase2Enabled(user?.uid) ? 'phase2' : 'dashboard');
  }, [user]);

  const showDashboard = phase === 'dashboard';
  const showPhase2 = phase === 'phase2';

  return (
    <div className={`${cormorant.variable} relative min-h-full overflow-hidden`}>
      <AmbientBackground />

      {phase !== 'loading' && (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-20 px-6 pb-28 pt-16 sm:gap-24 sm:pt-24">
          {showPhase2 ? (
            <TitizaDecisionFlow userName={firstName} />
          ) : (
            <>
              <TitizaHero
                userName={firstName}
                mode={showDashboard ? 'dashboard' : 'genesis'}
                isReturning={isReturningRef.current}
                onBegin={handleBegin}
              />

              {showDashboard && (
                <div className="flex flex-col gap-20 animate-titiza-fade-in sm:gap-24">
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
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
