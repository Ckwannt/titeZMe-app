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
import { LaunchDateCard } from './launch-date-card'
import { content, type Locale, type LocaleContent } from './content'

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
      replyHolds: number[]
    }
  | { type: 'photo'; at?: number; until?: number }
  | { type: 'beforeAfter'; at?: number; until?: number; swapAt: number }
  | { type: 'montage'; at?: number; until?: number; words: string[]; visibleDuration: number; overlap: number }
  | {
      type: 'launch'
      at?: number
      until?: number
      line1: string
      line2: string
      line3: string
      line1At: number
      line2At: number
      line3At: number
      lineFade: number
      finalFadeOut: number
    }

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
/*  THE TIMELINE — structure/timing/counts are SHARED across locales; only the */
/*  text is swapped, read from `content[locale]` (see content.ts).             */
/* -------------------------------------------------------------------------- */

function buildScenes(c: LocaleContent): Scene[] {
  return [
  {
    id: 's1',
    title: 'Black Screen',
    duration: 3000,
    orb: false,
    views: [
      // fadeOut 400 (V3): softens the cut from the intro card into s2's birth.
      { type: 'title', variant: 'intro', primary: c.s1.primary, secondary: c.s1.secondary, fadeIn: 600, fadeOut: 400 },
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
        lines: c.s2.lines,
      },
    ],
  },
  {
    // Inserted between the birth (s2) and the beauty-profile check (s3).
    // Simulated chat: the user asks, Titiza replies, and the orb reacts at the
    // send moment (ring + brighten), not when the reply begins.
    id: 's2b',
    title: 'First Conversation',
    // 1300ms lead (300ms delay + 900ms transform + 100ms breath) before the
    // chat mounts, + the conversation (now paced to the reading-time floor).
    duration: 10600,
    orb: true,
    orbEvents: [
      // TASK 4 — bubble settles (chat mount 1300 + sendAt 2550 + 300ms lift =
      // 4150), the orb stays still for 200ms, THEN a single subtle warm pulse
      // (ring only) at 4350 — after which the reply begins.
      { at: 4350, kind: 'ring' },
      // TASK 3/CHANGE 4 — the orb brightens slightly WHILE each reply sentence
      // appears (reveal scene times 4400 / 5300 / 7300 / 9500), easing back
      // between. Kept subtle (the 'bright' state, not a ring).
      { at: 4400, kind: 'state', value: 'bright' },
      { at: 4650, kind: 'state', value: 'idle' },
      { at: 5300, kind: 'state', value: 'bright' },
      { at: 5550, kind: 'state', value: 'idle' },
      { at: 7300, kind: 'state', value: 'bright' },
      { at: 7550, kind: 'state', value: 'idle' },
      { at: 9500, kind: 'state', value: 'bright' },
      { at: 9750, kind: 'state', value: 'idle' },
    ],
    views: [
      {
        type: 'chat',
        // Waits for the orb's 900ms anchor transform (which starts 300ms into
        // this scene, completing at 1200) to finish before anything fades in.
        at: 1300,
        placeholder: c.s2b.placeholder,
        chips: c.s2b.chips,
        query: c.s2b.query,
        replyLines: c.s2b.reply,
        // View-relative offsets: input rises at 0, chips at 250 (150ms stagger),
        // query types 1400–2300, +250ms pause → send 2550, settle 2850, +200ms
        // still, pulse 3050, reply from 3100. Per-sentence reply holds honor the
        // reading floor (~180ms/word, 900 min): 900 / 2000 / 2200 / 900.
        chipsAt: 250,
        chipStagger: 150,
        typeStartAt: 1400,
        typeDuration: 900,
        sendAt: 2550,
        replyStartAt: 3100,
        replyHolds: [900, 2000, 2200, 900],
      },
    ],
  },
  {
    id: 's3',
    title: 'Learning About You',
    duration: 8000,
    orb: true,
    views: [
      {
        type: 'typing',
        at: 0,
        until: 4000,
        // TASK 1 — each row now holds ~900ms (the reading-time floor) as the
        // newest line before the next appears, raised from V2's 250ms.
        stagger: 900,
        revealDuration: 250,
        lines: c.s3.typing,
      },
      {
        // hold 1900 clears the floor for both lines (7w→1260, 3w→900).
        type: 'dialogue',
        at: 4200,
        hold: 1900,
        lines: c.s3.dialogue,
      },
    ],
  },
  {
    id: 's4',
    title: 'Finding the Right Analyst',
    // TASK 8 — search idle tightened again (stagger 650, only a 400ms gap after
    // the last line before the card). 'thinking' → 'idle' at the card = the orb
    // glow stabilizing/calming when the professional is found (TASK 3).
    duration: 6500,
    orb: true,
    orbEvents: [
      { at: 0, kind: 'state', value: 'thinking' },
      { at: 3000, kind: 'state', value: 'idle' },
    ],
    views: [
      {
        type: 'typing',
        at: 0,
        until: 3000,
        stagger: 650,
        lines: c.s4.typing,
      },
      {
        type: 'card',
        at: 3000,
        name: c.s4.card.name,
        role: c.s4.card.role,
        meta: c.s4.card.meta,
        rating: c.s4.card.rating,
        button: c.s4.card.button,
        pressAt: 2400, // scene ~5400ms
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
      { type: 'title', variant: 'timeskip', primary: c.s5.primary, fadeIn: 250, fadeOut: 250 },
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
        chips: c.s6.chips,
      },
      {
        type: 'dialogue',
        at: 3700,
        hold: 1200,
        lines: c.s6.dialogue,
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
        lines: [c.s7.ask],
      },
      { type: 'photo', at: 1400 },
      {
        type: 'typing',
        at: 2400,
        stagger: 900,
        lines: c.s7.typing,
      },
    ],
  },
  {
    id: 's8',
    title: 'Recommendation',
    // Swap completes at ~2100 (mount 900 + 1200 cross-fade); TASK 10 holds the
    // final result untouched for 1500ms (V2 was ~1400) before the dialogue.
    duration: 6100,
    orb: true,
    views: [
      { type: 'beforeAfter', at: 900, swapAt: 0 },
      { type: 'dialogue', at: 3600, hold: 2500, lines: [c.s8.line] },
    ],
  },
  {
    id: 's9',
    title: 'Finding the Right Barber',
    // TASK 8 — search idle tightened further (stagger 600, card 300ms after the
    // last line); + a 1000ms hold after "Booked." (TASK 12). Dialogue hold 1300
    // already clears the floor (7w→1260), so TASK 1 leaves it.
    duration: 9100,
    orb: true,
    orbEvents: [
      { at: 2800, kind: 'state', value: 'thinking' },
      { at: 6100, kind: 'state', value: 'idle' },
    ],
    views: [
      {
        type: 'dialogue',
        at: 0,
        until: 2800,
        hold: 1300,
        lines: c.s9.dialogue,
      },
      {
        type: 'typing',
        at: 2800,
        until: 6100,
        stagger: 600,
        lines: c.s9.typing,
      },
      {
        type: 'card',
        at: 6100,
        name: c.s9.card.name,
        meta: c.s9.card.meta,
        rating: c.s9.card.rating,
        button: c.s9.card.button,
        pressAt: 1600, // scene ~7700ms
        confirmAt: 2000, // scene ~8100ms ("Booked."), then +1000ms hold to 9100
        confirmText: c.s9.booked,
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
        words: c.s10.words,
      },
    ],
  },
  {
    id: 's11',
    title: 'Final Message',
    // TASK 11 — the orb holds ALONE for 1000ms (nothing else on screen) before
    // line 1; line 1 (subtle breathing only) → line 2 at 2100 (orb brightens) →
    // ~1200ms → fade to black (handled by the end card). hold 1100 clears the
    // reading floor (both lines 6w → 1080ms), raised from V2's 900.
    duration: 3400,
    orb: true,
    orbEvents: [
      // No brightening until the second line lands (1000 lead + 1100 hold = 2100).
      { at: 2100, kind: 'ring' },
      { at: 2100, kind: 'state', value: 'bright' },
    ],
    views: [
      {
        type: 'dialogue',
        at: 1000,
        hold: 1100,
        lines: c.s11.lines,
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
        primary: c.end.primary,
        secondary: c.end.secondary,
        fadeIn: 400,
        fadeOut: 400,
      },
    ],
  },
  {
    // Closing chapter, appended after the end card (which fades itself to black
    // via its own fadeOut). Opens on ~1000ms of pure black (line1At), then three
    // lines cascade in and hold, then a slow whole-composition fade to black.
    id: 'launch',
    title: 'Launch Date',
    // 1000 black + line cascade + 2500 hold-together + 1800 slow fade-out.
    duration: 7800,
    orb: false,
    views: [
      {
        type: 'launch',
        line1: c.launch.line1,
        line2: c.launch.line2,
        line3: c.launch.line3,
        line1At: 1000, // ~1000ms of black first
        line2At: 2500, // ~500ms after line 1 has held ~1000ms
        line3At: 3000, // same ~500ms cadence after line 2
        lineFade: 500,
        finalFadeOut: 1800, // slower than the film's other fades (this is the close)
      },
    ],
  },
  ]
}

/** Is a view active at the given scene-relative time? */
function viewActive(view: View, sceneElapsed: number, sceneDuration: number) {
  const start = view.at ?? 0
  const end = view.until ?? sceneDuration
  return sceneElapsed >= start && sceneElapsed < end
}

export function FilmSequencer({ locale = 'en' }: { locale?: Locale } = {}) {
  const [elapsed, setElapsed] = useState(0)

  // The active locale's copy. Structure/timing are shared; only text differs.
  const c = content[locale]

  // Scenes for this locale: identical shape/timing/counts, text from `content`.
  const scenes = useMemo(() => buildScenes(c), [c])

  // Cumulative scene start offsets + total runtime (data-derived).
  const { starts, total } = useMemo(() => {
    const s: number[] = []
    let acc = 0
    for (const scene of scenes) {
      s.push(acc)
      acc += scene.duration
    }
    return { starts: s, total: acc }
  }, [scenes])

  // Absolute times of every ring event, ascending. ringTrigger is simply how
  // many have passed — monotonic, so each crossing advances it by exactly one.
  const ringTimes = useMemo(() => {
    const times: number[] = []
    scenes.forEach((scene, i) => {
      scene.orbEvents?.forEach((ev) => {
        if (ev.kind === 'ring') times.push(starts[i] + ev.at)
      })
    })
    return times.sort((a, b) => a - b)
  }, [scenes, starts])

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
  for (let i = 0; i < scenes.length; i++) {
    if (elapsed >= starts[i]) sceneIndex = i
  }
  const scene = scenes[sceneIndex]
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
  // Starts 300ms after s2's birth dialogue resolves (i.e. 300ms into s2b — V3
  // raised this from V2's 250ms), then the wrapper runs its 900ms transform,
  // completing at 1200ms; the chat view (at 1300) waits for it to finish.
  const anchorStart = starts[scenes.findIndex((s) => s.id === 's2b')] + 300
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
                  replyHolds={v.replyHolds}
                />
              )
            }
            return null
          })}
        </div>
      )}

      {/* Conversation strip — continuity cue across s3 and s4. Text mirrors the
          chat: the user's query + Titiza's closing reply (localized via content). */}
      {stripOpacity > 0 && (
        <ConversationStrip
          userLine={c.s2b.query}
          titizaLine={c.s2b.reply[c.s2b.reply.length - 1]}
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

      {/* Closing launch-date chapter (full-screen, after the end card). */}
      {activeViews.map((v, i) =>
        v.type === 'launch' ? (
          <LaunchDateCard
            key={`launch-${i}`}
            line1={v.line1}
            line2={v.line2}
            line3={v.line3}
            elapsed={local(v)}
            duration={scene.duration}
            line1At={v.line1At}
            line2At={v.line2At}
            line3At={v.line3At}
            lineFade={v.lineFade}
            finalFadeOut={v.finalFadeOut}
          />
        ) : null,
      )}
    </div>
  )
}
