'use client'

/**
 * FilmSequencer — the Titiza intro film orchestrator.
 *
 * The ENTIRE film is expressed as data in the `SCENES` array below: scene
 * durations, every line of copy (verbatim), each reveal offset, and the orb's
 * timed events. This component is a thin, generic interpreter of that data:
 *
 *   - a single `elapsed` clock (requestAnimationFrame) drives everything;
 *   - the active scene + scene-relative time are derived from cumulative
 *     durations;
 *   - `ringTrigger` = how many ring-event times have elapsed (monotonic, so
 *     each crossing fires exactly one orb ring pulse);
 *   - `sustainedState` = the latest orb state event reached in the scene.
 *
 * The only production import in this folder is TitizaCore (+ its types).
 */

import { useEffect, useMemo, useState } from 'react'
import { TitizaCore } from '@/components/titiza/titiza-core'
import { IntroTitle } from './intro-title'
import { OrbDialogue } from './orb-dialogue'
import { TypingLines } from './typing-lines'
import { ProfessionalCard } from './professional-card'
import { AnalysisCardsOrbit } from './analysis-cards-orbit'
import { BeforeAfterSwap } from './before-after-swap'
import { VerticalMontage } from './vertical-montage'
import { ChatInputShell } from './chat-input-shell'
import { ConversationStrip } from './conversation-strip'

type OrbState = 'idle' | 'thinking' | 'bright'

type OrbEvent =
  | { at: number; kind: 'ring' }
  | { at: number; kind: 'state'; value: OrbState }

/** All offsets are scene-relative ms; `at`/`until` gate a view's lifetime. */
type View =
  | {
      type: 'title'
      at?: number
      until?: number
      variant: 'intro' | 'timeskip' | 'end'
      primary: string
      secondary?: string
    }
  | { type: 'dialogue'; at?: number; until?: number; lines: string[]; hold: number }
  | { type: 'typing'; at?: number; until?: number; lines: string[]; stagger: number }
  | {
      type: 'card'
      at?: number
      until?: number
      name: string
      role?: string
      meta: string
      rating: string
      button: string
      pressAt?: number
      confirmAt?: number
      confirmText?: string
    }
  | { type: 'orbit'; at?: number; until?: number; chips: string[]; interval: number; travel: number }
  | {
      type: 'chat'
      at?: number
      until?: number
      placeholder: string
      chips: string[]
      query: string
      replyLines: string[]
      typeAt: number
      sendAt: number
      replyStartAt: number
      replyHold: number
    }
  | { type: 'photo'; at?: number; until?: number }
  | { type: 'beforeAfter'; at?: number; until?: number; swapAt: number }
  | { type: 'montage'; at?: number; until?: number; words: string[]; interval: number }

type Scene = {
  id: string
  title: string
  duration: number
  /** Whether the orb is mounted for this scene. Kept continuously true across
   *  s2–s11 so the WebGL context (and the one-time birth) is never re-created. */
  orb: boolean
  orbEvents?: OrbEvent[]
  views: View[]
}

/* -------------------------------------------------------------------------- */
/*  THE TIMELINE — copy is final and verbatim; do not paraphrase.              */
/* -------------------------------------------------------------------------- */

const SCENES: Scene[] = [
  {
    id: 's1',
    title: 'Black Screen',
    duration: 3000,
    orb: false,
    views: [{ type: 'title', variant: 'intro', primary: 'Introducing', secondary: 'Titiza' }],
  },
  {
    id: 's2',
    title: 'The Birth of Titiza',
    duration: 11000,
    orb: true,
    orbEvents: [
      { at: 7500, kind: 'ring' },
      { at: 7500, kind: 'state', value: 'bright' },
      { at: 9000, kind: 'state', value: 'idle' },
    ],
    views: [
      {
        type: 'dialogue',
        at: 0,
        hold: 2500,
        lines: [
          'Hello there.',
          "I'm Titiza.",
          'Before I can help you...',
          'I need to understand you.',
        ],
      },
    ],
  },
  {
    // Inserted between the birth (s2) and the beauty-profile check (s3).
    // Simulated chat: the user asks, Titiza replies, and the orb reacts at the
    // send moment (ring + brighten), not when the reply begins.
    id: 's2b',
    title: 'First Conversation',
    duration: 11000,
    orb: true,
    orbEvents: [
      { at: 3600, kind: 'ring' }, // the instant the user's line becomes a bubble
      { at: 3600, kind: 'state', value: 'bright' },
      { at: 5100, kind: 'state', value: 'idle' },
    ],
    views: [
      {
        type: 'chat',
        at: 0,
        placeholder: 'What would you like to improve today?',
        chips: [
          'Help me find a haircut that suits me',
          'Why is my hair falling out?',
          'Build my skincare routine',
          'Recommend products for my skin',
        ],
        query: 'I want a haircut',
        replyLines: [
          'Absolutely.',
          'Before I recommend a haircut, I need to understand your hair.',
          'The best way to do that is with a professional hair analysis.',
          "Let's start there.",
        ],
        typeAt: 2200,
        sendAt: 3600,
        replyStartAt: 4300,
        replyHold: 1450,
      },
    ],
  },
  {
    id: 's3',
    title: 'Learning About You',
    duration: 10000,
    orb: true,
    views: [
      {
        type: 'typing',
        at: 0,
        until: 6000,
        stagger: 1200,
        lines: [
          'Checking your Beauty Profile...',
          'Hair... No Professional Analysis',
          'Goals... Unknown',
          'Progress... Unknown',
          'Routine... Unknown',
        ],
      },
      {
        type: 'dialogue',
        at: 6200,
        hold: 1900,
        lines: ["I don't know enough about your hair.", "Let's change that."],
      },
    ],
  },
  {
    id: 's4',
    title: 'Finding the Right Analyst',
    duration: 10000,
    orb: true,
    orbEvents: [
      { at: 0, kind: 'state', value: 'thinking' },
      { at: 5200, kind: 'state', value: 'idle' },
    ],
    views: [
      {
        type: 'typing',
        at: 0,
        until: 5000,
        stagger: 1000,
        lines: [
          'Searching nearby certified hair analysts...',
          'Checking certifications...',
          'Checking language...',
          'Checking availability...',
          'Checking reviews...',
        ],
      },
      {
        type: 'card',
        at: 5200,
        name: 'Dr. Sarah',
        role: 'Hair Analyst',
        meta: '2.3 km · English',
        rating: '★★★★★ · Tomorrow 10:30',
        button: 'Book Analysis',
        pressAt: 3300, // scene ~8500ms
      },
    ],
  },
  {
    id: 's5',
    title: 'Time Skip',
    duration: 2000,
    orb: true, // stays mounted (covered by the black title) to avoid a remount
    views: [{ type: 'title', variant: 'timeskip', primary: 'A few days later.' }],
  },
  {
    id: 's6',
    title: 'Titiza Learns',
    duration: 12000,
    orb: true,
    // One ring pulse per chip arrival (departure i*1300 + travel 2000).
    orbEvents: [
      { at: 2000, kind: 'ring' },
      { at: 3300, kind: 'ring' },
      { at: 4600, kind: 'ring' },
      { at: 5900, kind: 'ring' },
      { at: 7200, kind: 'ring' },
      { at: 8500, kind: 'ring' },
      { at: 9800, kind: 'ring' },
    ],
    views: [
      {
        type: 'orbit',
        at: 0,
        until: 9800,
        interval: 1300,
        travel: 2000,
        chips: [
          'Hair Density',
          'Hair Thickness',
          'Hairline',
          'Scalp Health',
          'Hair Type',
          'Lifestyle Notes',
          'Professional Recommendations',
        ],
      },
      {
        type: 'dialogue',
        at: 9800,
        hold: 1100,
        lines: ['Now I understand your hair.', "Let's see what's possible."],
      },
    ],
  },
  {
    id: 's7',
    title: 'Upload Today\'s Hair',
    duration: 9000,
    orb: true,
    views: [
      {
        type: 'dialogue',
        at: 0,
        until: 2400,
        hold: 2400,
        lines: ['Show me how your hair looks today.'],
      },
      { type: 'photo', at: 1400 },
      {
        type: 'typing',
        at: 2400,
        stagger: 900,
        lines: [
          'Comparing...',
          'Professional Analysis',
          "Today's Hair",
          'Face Shape',
          'Hair Density',
          'Your Goals',
          'Current Style',
        ],
      },
    ],
  },
  {
    id: 's8',
    title: 'Recommendation',
    duration: 8000,
    orb: true,
    views: [
      { type: 'beforeAfter', at: 900, swapAt: 0 },
      { type: 'dialogue', at: 3500, hold: 3500, lines: ['I like this one.'] },
    ],
  },
  {
    id: 's9',
    title: 'Finding the Right Barber',
    duration: 11000,
    orb: true,
    orbEvents: [
      { at: 3400, kind: 'state', value: 'thinking' },
      { at: 8600, kind: 'state', value: 'idle' },
    ],
    views: [
      {
        type: 'dialogue',
        at: 0,
        until: 3400,
        hold: 1600,
        lines: ['Great choice.', "Now let's find someone who can create it."],
      },
      {
        type: 'typing',
        at: 3400,
        until: 8600,
        stagger: 850,
        lines: [
          'Searching...',
          'Specialists in this hairstyle',
          'English speaking',
          'Near your location',
          'Available tomorrow',
          'Highly rated',
        ],
      },
      {
        type: 'card',
        at: 8600,
        name: 'Alex Barber Studio',
        meta: '1.8 km · English',
        rating: '★★★★★ · Tomorrow 15:00',
        button: 'Book Appointment',
        pressAt: 1600, // scene ~10200ms
        confirmAt: 2000, // scene ~10600ms
        confirmText: 'Booked.',
      },
    ],
  },
  {
    id: 's10',
    title: 'More Than Hair',
    duration: 7000,
    orb: true,
    views: [
      {
        type: 'montage',
        at: 0,
        interval: 900,
        words: ['Hair', 'Skin & Facial', 'Dental', 'Nails', 'Fitness', 'More...'],
      },
    ],
  },
  {
    id: 's11',
    title: 'Final Message',
    duration: 9000,
    orb: true,
    orbEvents: [
      { at: 2600, kind: 'ring' },
      { at: 2600, kind: 'state', value: 'bright' },
    ],
    views: [
      {
        type: 'dialogue',
        at: 0,
        hold: 2600,
        lines: ['The more I know about you...', 'The better I can help you.'],
      },
    ],
  },
  {
    id: 'end',
    title: 'End Card',
    duration: 4000,
    orb: false,
    views: [
      {
        type: 'title',
        variant: 'end',
        primary: 'Titiza',
        secondary: 'Your Personal Beauty Intelligence',
      },
    ],
  },
]

/** Is a view active at the given scene-relative time? */
function viewActive(view: View, sceneElapsed: number, sceneDuration: number) {
  const start = view.at ?? 0
  const end = view.until ?? sceneDuration
  return sceneElapsed >= start && sceneElapsed < end
}

export function FilmSequencer() {
  const [elapsed, setElapsed] = useState(0)

  // Cumulative scene start offsets + total runtime (data-derived, stable).
  const { starts, total } = useMemo(() => {
    const s: number[] = []
    let acc = 0
    for (const scene of SCENES) {
      s.push(acc)
      acc += scene.duration
    }
    return { starts: s, total: acc }
  }, [])

  // Absolute times of every ring event, ascending. ringTrigger is simply how
  // many have passed — monotonic, so each crossing advances it by exactly one.
  const ringTimes = useMemo(() => {
    const times: number[] = []
    SCENES.forEach((scene, i) => {
      scene.orbEvents?.forEach((ev) => {
        if (ev.kind === 'ring') times.push(starts[i] + ev.at)
      })
    })
    return times.sort((a, b) => a - b)
  }, [starts])

  // Single rAF clock for the whole film.
  useEffect(() => {
    let raf = 0
    const startTs = performance.now()
    const tick = (now: number) => {
      const e = now - startTs
      setElapsed(e >= total ? total : e)
      if (e < total) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [total])

  // Resolve the active scene + scene-relative time.
  let sceneIndex = 0
  for (let i = 0; i < SCENES.length; i++) {
    if (elapsed >= starts[i]) sceneIndex = i
  }
  const scene = SCENES[sceneIndex]
  const sceneElapsed = elapsed - starts[sceneIndex]

  // Orb state for this moment: latest state event reached, else 'idle'.
  let sustainedState: OrbState = 'idle'
  if (scene.orbEvents) {
    for (const ev of scene.orbEvents) {
      if (ev.kind === 'state' && sceneElapsed >= ev.at) sustainedState = ev.value
    }
  }

  const ringTrigger = ringTimes.reduce((n, t) => (t <= elapsed ? n + 1 : n), 0)

  const activeViews = scene.views.filter((v) =>
    viewActive(v, sceneElapsed, scene.duration),
  )

  // Views that stack in the lower content zone (everything except full-screen
  // title cards, the inset orbit layer, and the centered montage).
  const stackViews = activeViews.filter(
    (v) => v.type !== 'title' && v.type !== 'orbit' && v.type !== 'montage',
  )

  const local = (v: View) => sceneElapsed - (v.at ?? 0)

  // Conversation strip — a continuity cue spanning the beauty-profile check
  // (s3) and the analyst search (s4), fading out as the Dr. Sarah card appears
  // (s4 @ 5200ms). Additive: the s3/s4 scene data itself is untouched.
  const CARD_APPEARS_AT = 5200
  let stripOpacity = 0
  if (scene.id === 's3') {
    stripOpacity = 1
  } else if (scene.id === 's4') {
    stripOpacity =
      sceneElapsed < CARD_APPEARS_AT - 400
        ? 1
        : Math.max(0, (CARD_APPEARS_AT - sceneElapsed) / 400)
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black text-white">
      {/* Orb layer — mounted continuously across s2–s11 (stable key) so the
          birth plays once and the WebGL context is never re-created. */}
      {scene.orb && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[70vmin] max-w-[460px]">
            <TitizaCore
              key="film-orb"
              genesis
              sustainedState={sustainedState}
              ringTrigger={ringTrigger}
            />
          </div>
        </div>
      )}

      {/* Inset layer — chips converging on the orb center (s6). */}
      {activeViews.map((v, i) =>
        v.type === 'orbit' ? (
          <AnalysisCardsOrbit
            key={`orbit-${i}`}
            chips={v.chips}
            interval={v.interval}
            travel={v.travel}
            elapsed={local(v)}
          />
        ) : null,
      )}

      {/* Centered layer — the vertical word montage (s10). */}
      {activeViews.map((v, i) =>
        v.type === 'montage' ? (
          <div
            key={`montage-${i}`}
            className="absolute inset-0 z-10 flex items-center justify-center px-6"
          >
            <VerticalMontage words={v.words} interval={v.interval} elapsed={local(v)} />
          </div>
        ) : null,
      )}

      {/* Lower content stack — dialogue, checklists, cards, placeholders. */}
      {stackViews.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-6 px-6 pb-[12vh]">
          {stackViews.map((v, i) => {
            const e = local(v)
            if (v.type === 'dialogue') {
              return <OrbDialogue key={i} lines={v.lines} hold={v.hold} elapsed={e} />
            }
            if (v.type === 'typing') {
              return (
                <TypingLines key={i} lines={v.lines} startAt={0} stagger={v.stagger} elapsed={e} />
              )
            }
            if (v.type === 'card') {
              return (
                <ProfessionalCard
                  key={i}
                  name={v.name}
                  role={v.role}
                  meta={v.meta}
                  rating={v.rating}
                  button={v.button}
                  elapsed={e}
                  pressAt={v.pressAt}
                  confirmAt={v.confirmAt}
                  confirmText={v.confirmText}
                />
              )
            }
            if (v.type === 'photo') {
              return <BeforeAfterSwap key={i} mode="single" elapsed={e} />
            }
            if (v.type === 'beforeAfter') {
              return <BeforeAfterSwap key={i} mode="swap" swapAt={v.swapAt} elapsed={e} />
            }
            if (v.type === 'chat') {
              return (
                <ChatInputShell
                  key={i}
                  placeholder={v.placeholder}
                  chips={v.chips}
                  query={v.query}
                  replyLines={v.replyLines}
                  elapsed={e}
                  typeAt={v.typeAt}
                  sendAt={v.sendAt}
                  replyStartAt={v.replyStartAt}
                  replyHold={v.replyHold}
                />
              )
            }
            return null
          })}
        </div>
      )}

      {/* Conversation strip — continuity cue across s3 and s4. */}
      {stripOpacity > 0 && (
        <ConversationStrip
          userLine="I want a haircut"
          titizaLine="Let's start there."
          opacity={stripOpacity}
        />
      )}

      {/* Full-screen title cards (s1, s5, end). */}
      {activeViews.map((v, i) =>
        v.type === 'title' ? (
          <IntroTitle
            key={`title-${i}`}
            variant={v.variant}
            primary={v.primary}
            secondary={v.secondary}
          />
        ) : null,
      )}
    </div>
  )
}
