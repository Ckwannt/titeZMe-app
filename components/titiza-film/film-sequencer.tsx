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
      fadeIn: number
      fadeOut: number
    }
  | { type: 'dialogue'; at?: number; until?: number; lines: string[]; hold: number }
  | {
      type: 'typing'
      at?: number
      until?: number
      lines: string[]
      stagger: number
      revealDuration?: number
    }
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
  | {
      type: 'orbit'
      at?: number
      until?: number
      chips: string[]
      startStagger: number
      appearDuration: number
      pause: number
      travelDuration: number
      centerYVh: number
    }
  | {
      type: 'chat'
      at?: number
      until?: number
      placeholder: string
      chips: string[]
      query: string
      replyLines: string[]
      chipsAt: number
      chipStagger: number
      typeStartAt: number
      typeDuration: number
      sendAt: number
      replyStartAt: number
      replyHold: number
    }
  | { type: 'photo'; at?: number; until?: number }
  | { type: 'beforeAfter'; at?: number; until?: number; swapAt: number }
  | { type: 'montage'; at?: number; until?: number; words: string[]; visibleDuration: number; overlap: number }

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
    views: [
      { type: 'title', variant: 'intro', primary: 'Introducing', secondary: 'Titiza', fadeIn: 600, fadeOut: 0 },
    ],
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
    // ~1200ms lead (the orb's anchor transform settles, then a 50ms breath)
    // before the chat view mounts, + the conversation itself.
    duration: 7600,
    orb: true,
    orbEvents: [
      // CHANGE 3 — a single SUBTLE pulse (ring only, no sustained brighten) the
      // instant the user's line settles into the bubble (chat mount 1200 +
      // sendAt 2550 + 300ms bubble lift = 4050).
      { at: 4050, kind: 'ring' },
      // CHANGE 4 — the orb brightens slightly WHILE each reply sentence appears
      // (reply i at 1200 + 3100 + i*500), easing back to idle between them.
      { at: 4300, kind: 'state', value: 'bright' },
      { at: 4550, kind: 'state', value: 'idle' },
      { at: 4800, kind: 'state', value: 'bright' },
      { at: 5050, kind: 'state', value: 'idle' },
      { at: 5300, kind: 'state', value: 'bright' },
      { at: 5550, kind: 'state', value: 'idle' },
      { at: 5800, kind: 'state', value: 'bright' },
      { at: 6050, kind: 'state', value: 'idle' },
    ],
    views: [
      {
        type: 'chat',
        // Waits for the orb's 900ms anchor transform (which starts 250ms into
        // this scene) to fully complete before anything fades in (frozen #4).
        at: 1200,
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
        // View-relative offsets: input rises in at 0, chips 250ms later (staggered
        // 150ms), query types 1400–2300, +250ms pause → send 2550, reply from
        // 3100 (250ms fade + 250ms pause per sentence).
        chipsAt: 250,
        chipStagger: 150,
        typeStartAt: 1400,
        typeDuration: 900,
        sendAt: 2550,
        replyStartAt: 3100,
        replyHold: 500,
      },
    ],
  },
  {
    id: 's3',
    title: 'Learning About You',
    duration: 5600,
    orb: true,
    views: [
      {
        type: 'typing',
        at: 0,
        until: 1500,
        // Each row appears separately, 250ms apart, each rising in over 250ms.
        stagger: 250,
        revealDuration: 250,
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
        at: 1700,
        hold: 1900,
        lines: ["I don't know enough about your hair.", "Let's change that."],
      },
    ],
  },
  {
    id: 's4',
    title: 'Finding the Right Analyst',
    // ~25% shorter than the original 10000 — every step kept, pauses tightened.
    duration: 7500,
    orb: true,
    orbEvents: [
      { at: 0, kind: 'state', value: 'thinking' },
      { at: 3600, kind: 'state', value: 'idle' },
    ],
    views: [
      {
        type: 'typing',
        at: 0,
        until: 3400,
        stagger: 700,
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
        at: 3600,
        name: 'Dr. Sarah',
        role: 'Hair Analyst',
        meta: '2.3 km · English',
        rating: '★★★★★ · Tomorrow 10:30',
        button: 'Book Analysis',
        pressAt: 2400, // scene ~6000ms
      },
    ],
  },
  {
    id: 's5',
    title: 'Time Skip',
    // Fade to black 250 + hold 900 + fade out 250.
    duration: 1400,
    orb: true, // stays mounted (covered by the black title) to avoid a remount
    views: [
      { type: 'title', variant: 'timeskip', primary: 'A few days later.', fadeIn: 250, fadeOut: 250 },
    ],
  },
  {
    id: 's6',
    title: 'Titiza Learns',
    duration: 6200,
    orb: true,
    // One ring pulse per chip absorption. Arrival = start (i*350) + appear 250
    // + pause 200 + travel 800 = i*350 + 1250.
    orbEvents: [
      { at: 1250, kind: 'ring' },
      { at: 1600, kind: 'ring' },
      { at: 1950, kind: 'ring' },
      { at: 2300, kind: 'ring' },
      { at: 2650, kind: 'ring' },
      { at: 3000, kind: 'ring' },
      { at: 3350, kind: 'ring' },
    ],
    views: [
      {
        type: 'orbit',
        at: 0,
        until: 3600,
        startStagger: 350,
        appearDuration: 250,
        pause: 200,
        travelDuration: 800,
        centerYVh: 24, // converge on the anchored orb (translateY -26vh from center)
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
        at: 3700,
        hold: 1200,
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
    // Swap completes at ~2100 (mount 900 + 1200 cross-fade); the result then
    // holds untouched for 1400ms before the dialogue — satisfying the ≥1200ms
    // still-hold — and again after it, before s9.
    duration: 6000,
    orb: true,
    views: [
      { type: 'beforeAfter', at: 900, swapAt: 0 },
      { type: 'dialogue', at: 3500, hold: 2500, lines: ['I like this one.'] },
    ],
  },
  {
    id: 's9',
    title: 'Finding the Right Barber',
    // Search pacing tightened (every line kept), + a 1000ms hold after "Booked."
    duration: 9600,
    orb: true,
    orbEvents: [
      { at: 2800, kind: 'state', value: 'thinking' },
      { at: 6600, kind: 'state', value: 'idle' },
    ],
    views: [
      {
        type: 'dialogue',
        at: 0,
        until: 2800,
        hold: 1300,
        lines: ['Great choice.', "Now let's find someone who can create it."],
      },
      {
        type: 'typing',
        at: 2800,
        until: 6600,
        stagger: 650,
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
        at: 6600,
        name: 'Alex Barber Studio',
        meta: '1.8 km · English',
        rating: '★★★★★ · Tomorrow 15:00',
        button: 'Book Appointment',
        pressAt: 1600, // scene ~8200ms
        confirmAt: 2000, // scene ~8600ms ("Booked."), then +1000ms hold to 9600
        confirmText: 'Booked.',
      },
    ],
  },
  {
    id: 's10',
    title: 'More Than Hair',
    duration: 5200,
    orb: true,
    views: [
      {
        type: 'montage',
        at: 0,
        // Each word is visible ~950ms and overlaps the next by 150ms (step 800),
        // so the sequence reads continuous rather than as discrete steps.
        visibleDuration: 950,
        overlap: 150,
        words: ['Hair', 'Skin & Facial', 'Dental', 'Nails', 'Fitness', 'More...'],
      },
    ],
  },
  {
    id: 's11',
    title: 'Final Message',
    // Line 1 (subtle breathing only) → 900ms → line 2 (orb brightens) → 1200ms
    // → fade to black (handled by the end card that follows).
    duration: 2400,
    orb: true,
    orbEvents: [
      // No brightening until the second line arrives.
      { at: 900, kind: 'ring' },
      { at: 900, kind: 'state', value: 'bright' },
    ],
    views: [
      {
        type: 'dialogue',
        at: 0,
        hold: 900,
        lines: ['The more I know about you...', 'The better I can help you.'],
      },
    ],
  },
  {
    id: 'end',
    title: 'End Card',
    // Fade in 400 + hold 2000 + fade out 400.
    duration: 2800,
    orb: false,
    views: [
      {
        type: 'title',
        variant: 'end',
        primary: 'Titiza',
        secondary: 'Your Personal Beauty Intelligence',
        fadeIn: 400,
        fadeOut: 400,
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

  // Orb anchoring — once the birth greeting (s2) ends, the orb's WRAPPING
  // container animates to a smaller top-center position and HOLDS there for
  // every remaining scene (s2b → end). Purely a layout transform on the wrapper;
  // the orb component itself is untouched. `anchored` flips true at the s2/s2b
  // boundary and never flips back.
  // Starts ~250ms after s2's birth dialogue resolves (i.e. 250ms into s2b), then
  // the wrapper runs its 900ms transform; the chat view (at 1200) waits for it.
  const anchorStart = starts[SCENES.findIndex((s) => s.id === 's2b')] + 250
  const anchored = elapsed >= anchorStart

  // Conversation strip — a continuity cue spanning the beauty-profile check
  // (s3) and the analyst search (s4), fading out as the Dr. Sarah card appears
  // (s4 @ 3600ms). Additive: the s3/s4 scene data itself is untouched.
  const CARD_APPEARS_AT = 3600
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
      {/* Shared, eased keyframes for the film's small entrance motions. Scoped
          here (inside components/titiza-film) rather than globals.css. */}
      <style>{`
        @keyframes filmFadeUp8 { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes filmFadeUp6 { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes filmInputIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes filmBubbleIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes filmChipIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes filmCardIn { from { opacity: 0; transform: scale(0.97); box-shadow: 0 0 0 rgba(0,0,0,0); } to { opacity: 1; transform: scale(1); box-shadow: 0 24px 60px -24px rgba(0,0,0,0.55); } }
      `}</style>

      {/* Orb layer — mounted continuously across s2–s11 (stable key) so the
          birth plays once and the WebGL context is never re-created. */}
      {scene.orb && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-[70vmin] max-w-[460px]"
            style={{
              transition: 'transform 900ms cubic-bezier(0.4, 0, 0.2, 1)',
              transform: anchored
                ? 'translateY(-26vh) scale(0.72)'
                : 'translateY(0) scale(1)',
              willChange: 'transform',
            }}
          >
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
            startStagger={v.startStagger}
            appearDuration={v.appearDuration}
            pause={v.pause}
            travelDuration={v.travelDuration}
            centerYVh={v.centerYVh}
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
            <VerticalMontage
              words={v.words}
              visibleDuration={v.visibleDuration}
              overlap={v.overlap}
              elapsed={local(v)}
            />
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
                <TypingLines
                  key={i}
                  lines={v.lines}
                  startAt={0}
                  stagger={v.stagger}
                  elapsed={e}
                  revealDuration={v.revealDuration}
                />
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
                  chipsAt={v.chipsAt}
                  chipStagger={v.chipStagger}
                  typeStartAt={v.typeStartAt}
                  typeDuration={v.typeDuration}
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
            elapsed={local(v)}
            duration={scene.duration}
            fadeIn={v.fadeIn}
            fadeOut={v.fadeOut}
          />
        ) : null,
      )}
    </div>
  )
}
