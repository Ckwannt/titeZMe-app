'use client'

import { Cormorant_Garamond } from 'next/font/google'
import { FilmSequencer } from '@/components/titiza-film/film-sequencer'

// Spanish (Spain) cut of the Titiza film. Same component, same timing — only
// the copy differs (locale="es"). Cormorant Garamond exposed as
// --font-titiza-serif so Tailwind's `font-serif` resolves on this route.
// Unauthenticated, no providers — just the film.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-titiza-serif',
})

export default function TitizaFilmEsPreviewPage() {
  return (
    <div className={cormorant.variable}>
      <FilmSequencer locale="es" />
    </div>
  )
}
