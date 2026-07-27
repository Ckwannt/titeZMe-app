/**
 * Titiza film — locale-keyed on-screen COPY only.
 *
 * This module holds nothing but the literal text strings rendered in the film.
 * Every numeric/timing/structural field (durations, offsets, orbEvents, item
 * order, and crucially item COUNTS) lives in film-sequencer.tsx's buildScenes()
 * and is SHARED across locales — only the text below differs. `en` and `es`
 * therefore MUST have identical shape and identical array lengths per field
 * (e.g. s6.chips = 7, s7.typing = 7), since the animation cadence is keyed to
 * the count.
 *
 * Not localized here: each scene's internal `title` label (e.g. 'Black Screen')
 * — those are never rendered on screen, so they stay shared in buildScenes().
 */

export type Locale = 'en' | 'es'

type CardContent = {
  name: string
  role?: string
  meta: string
  rating: string
  button: string
}

export type LocaleContent = {
  s1: { primary: string; secondary: string }
  s2: { lines: string[] }
  s2b: { placeholder: string; chips: string[]; query: string; reply: string[] }
  s3: { typing: string[]; dialogue: string[] }
  s4: { typing: string[]; card: CardContent }
  s5: { primary: string }
  s6: { chips: string[]; dialogue: string[] }
  s7: { ask: string; typing: string[] }
  s8: { line: string }
  s9: { dialogue: string[]; typing: string[]; card: CardContent; booked: string }
  s10: { words: string[] }
  s11: { lines: string[] }
  end: { primary: string; secondary: string }
  launch: { line1: string; line2: string; line3: string }
}

const en: LocaleContent = {
  s1: { primary: 'Introducing', secondary: 'Titiza' },
  s2: {
    lines: [
      'Hello there.',
      "I'm Titiza.",
      'Before I can help you...',
      'I need to understand you.',
    ],
  },
  s2b: {
    placeholder: 'What would you like to improve today?',
    chips: [
      'Help me find a haircut that suits me',
      'Why is my hair falling out?',
      'Build my skincare routine',
      'Recommend products for my skin',
    ],
    query: 'I want a haircut',
    reply: [
      'Absolutely.',
      'Before I recommend a haircut, I need to understand your hair.',
      'The best way to do that is with a professional hair analysis.',
      "Let's start there.",
    ],
  },
  s3: {
    typing: [
      'Checking your Beauty Profile...',
      'Hair... No Professional Analysis',
      'Goals... Unknown',
      'Progress... Unknown',
      'Routine... Unknown',
    ],
    dialogue: ["I don't know enough about your hair.", "Let's change that."],
  },
  s4: {
    typing: [
      'Searching nearby certified hair analysts...',
      'Checking certifications...',
      'Checking language...',
      'Checking availability...',
      'Checking reviews...',
    ],
    card: {
      name: 'Dr. Sarah',
      role: 'Hair Analyst',
      meta: '2.3 km · English',
      rating: '★★★★★ · Tomorrow 10:30',
      button: 'Book Analysis',
    },
  },
  s5: { primary: 'A few days later.' },
  s6: {
    chips: [
      'Hair Density',
      'Hair Thickness',
      'Hairline',
      'Scalp Health',
      'Hair Type',
      'Lifestyle Notes',
      'Professional Recommendations',
    ],
    dialogue: ['Now I understand your hair.', "Let's see what's possible."],
  },
  s7: {
    ask: 'Show me how your hair looks today.',
    typing: [
      'Comparing...',
      'Professional Analysis',
      "Today's Hair",
      'Face Shape',
      'Hair Density',
      'Your Goals',
      'Current Style',
    ],
  },
  s8: { line: 'I like this one.' },
  s9: {
    dialogue: ['Great choice.', "Now let's find someone who can create it."],
    typing: [
      'Searching...',
      'Specialists in this hairstyle',
      'English speaking',
      'Near your location',
      'Available tomorrow',
      'Highly rated',
    ],
    card: {
      name: 'Alex Barber Studio',
      meta: '1.8 km · English',
      rating: '★★★★★ · Tomorrow 15:00',
      button: 'Book Appointment',
    },
    booked: 'Booked.',
  },
  s10: { words: ['Hair', 'Skin & Facial', 'Dental', 'Nails', 'Fitness', 'More...'] },
  s11: { lines: ['The more I know about you...', 'The better I can help you.'] },
  end: { primary: 'Titiza', secondary: 'Your Personal Beauty Intelligence' },
  launch: {
    line1: 'The journey begins.',
    line2: '17 September 2026',
    line3: 'Madrid, Spain',
  },
}

const es: LocaleContent = {
  s1: { primary: 'Presentamos', secondary: 'Titiza' },
  s2: {
    lines: [
      'Hola, Ibrahim.',
      'Soy Titiza.',
      'Antes de poder ayudarte...',
      'necesito conocerte.',
    ],
  },
  s2b: {
    placeholder: '¿Qué te gustaría mejorar hoy?',
    chips: [
      'Ayúdame a encontrar el corte que me favorezca',
      '¿Por qué se me está cayendo el pelo?',
      'Crea mi rutina de cuidado de la piel',
      'Recomiéndame productos para mi piel',
    ],
    query: 'Quiero un corte de pelo',
    reply: [
      'Claro.',
      'Antes de recomendarte un corte, necesito conocer tu cabello.',
      'La mejor forma de hacerlo es con un análisis capilar profesional.',
      'Empecemos por ahí.',
    ],
  },
  s3: {
    typing: [
      'Comprobando tu perfil de belleza...',
      'Cabello... Sin análisis profesional',
      'Objetivos... Sin datos',
      'Progreso... Sin datos',
      'Rutina... Sin datos',
    ],
    dialogue: ['Todavía no conozco tu cabello.', 'Vamos a cambiar eso.'],
  },
  s4: {
    typing: [
      'Buscando especialistas certificados en análisis capilar...',
      'Comprobando certificaciones...',
      'Comprobando idioma...',
      'Comprobando disponibilidad...',
      'Comprobando valoraciones...',
    ],
    card: {
      name: 'Dra. Sarah',
      role: 'Especialista en análisis capilar',
      meta: '2,3 km · Español e Inglés',
      rating: '★★★★★ · Mañana 10:30',
      button: 'Reservar análisis',
    },
  },
  s5: { primary: 'Unos días después...' },
  s6: {
    chips: [
      'Densidad capilar',
      'Grosor capilar',
      'Línea capilar',
      'Salud del cuero cabelludo',
      'Tipo de cabello',
      'Notas de estilo de vida',
      'Recomendaciones del especialista',
    ],
    dialogue: ['Ahora conozco tu cabello.', 'Veamos qué podemos conseguir.'],
  },
  s7: {
    ask: 'Muéstrame cómo luce tu cabello hoy.',
    typing: [
      'Comparando...',
      'Análisis profesional',
      'Cabello actual',
      'Forma del rostro',
      'Densidad capilar',
      'Tus objetivos',
      'Estilo actual',
    ],
  },
  s8: { line: 'Me gusta este.' },
  s9: {
    dialogue: ['Buena elección.', 'Ahora encontremos al profesional adecuado.'],
    typing: [
      'Buscando...',
      'Especialistas en este estilo',
      'Hablan tu idioma',
      'Disponibles mañana',
      'Cerca de ti',
      'Mejor valorados',
    ],
    card: {
      name: 'Alex Barber Studio',
      meta: '1,8 km · Español e Inglés',
      rating: '★★★★★ · Mañana 15:00',
      button: 'Reservar cita',
    },
    booked: 'Reservado.',
  },
  s10: { words: ['Cabello', 'Piel y Rostro', 'Dental', 'Uñas', 'Fitness', 'Y mucho más...'] },
  s11: { lines: ['Cuanto más te conozco...', 'mejor puedo ayudarte.'] },
  end: { primary: 'Titiza', secondary: 'Tu inteligencia personal para la belleza' },
  launch: {
    line1: 'El viaje comienza.',
    line2: '17 de septiembre de 2026',
    line3: 'Madrid, España',
  },
}

export const content: Record<Locale, LocaleContent> = { en, es }
