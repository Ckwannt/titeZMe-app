'use client'

import { Cormorant_Garamond } from 'next/font/google'
import { FilmSequencer } from '@/components/titiza-film/film-sequencer'

// Cormorant Garamond, exposed as --font-titiza-serif so Tailwind's `font-serif`
// utility resolves to it on this route (same variable the /dashboard/client/
// titiza route uses). Unauthenticated, no providers — just the film.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-titiza-serif',
})

export default function TitizaFilmPreviewPage() {
  return (
    <div className={cormorant.variable}>
      <FilmSequencer />
    </div>
  )
}
