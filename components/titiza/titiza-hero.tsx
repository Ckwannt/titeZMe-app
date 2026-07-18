import { TitizaCore } from './titiza-core'

export function TitizaHero({ userName = 'there' }: { userName?: string }) {
  return (
    <section className="flex flex-col items-center text-center">
      {/* Above the assistant */}
      <div className="animate-titiza-fade-up">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-muted-foreground">
          titeZMe
        </p>
        <h1 className="font-serif text-6xl font-light tracking-tight text-foreground sm:text-7xl md:text-8xl">
          <span className="titiza-shimmer-text">Titiza</span>
        </h1>
        <p className="mt-4 text-balance text-base font-light tracking-wide text-muted-foreground sm:text-lg">
          Beauty Intelligence, built around you.
        </p>
      </div>

      {/* The presence */}
      <div
        className="mt-6 w-full animate-titiza-fade-up animate-titiza-float"
        style={{ animationDelay: '0.15s' }}
      >
        <TitizaCore />
      </div>

      {/* Below the assistant — Titiza speaks, line by line */}
      <div className="-mt-4 flex max-w-xl flex-col items-center">
        <p
          className="animate-titiza-fade-up font-serif text-3xl font-light text-foreground sm:text-4xl"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          Hi, {userName}.
        </p>
        <p
          className="mt-2 animate-titiza-fade-up font-serif text-3xl font-light text-foreground sm:text-4xl"
          style={{ animationDelay: '1.1s', animationFillMode: 'both' }}
        >
          {"I'm Titiza."}
        </p>
        <p
          className="mt-5 max-w-md animate-titiza-fade-up text-pretty text-base font-light leading-relaxed text-muted-foreground sm:text-lg"
          style={{ animationDelay: '2s', animationFillMode: 'both' }}
        >
          I grow with every professional beauty analysis and every conversation
          we have.
        </p>

        {/* Learning-from cards */}
        <div
          className="mt-10 w-full animate-titiza-fade-up"
          style={{ animationDelay: '2.7s', animationFillMode: 'both' }}
        >
          <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Learning from
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              'Professional Beauty Analyses',
              'Your Beauty Profile',
              'Our Conversations',
            ].map((item) => (
              <li
                key={item}
                className="flex items-center justify-center gap-2 rounded-xl border border-gold/15 bg-card/60 px-4 py-4 text-center backdrop-blur-sm transition-colors hover:border-gold/35"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]"
                />
                <span className="text-sm font-light text-foreground/90">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
            Every recommendation becomes more personal over time.
          </p>
        </div>
      </div>
    </section>
  )
}
