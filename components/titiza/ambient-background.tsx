export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base deep gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_-10%,oklch(0.24_0.03_75)_0%,oklch(0.16_0.008_60)_55%,oklch(0.12_0.006_55)_100%)]" />

      {/* Drifting gold aurora blobs */}
      <div className="absolute -left-[10%] top-[8%] size-[42vw] rounded-full bg-gold/8 blur-[120px] animate-titiza-drift" />
      <div
        className="absolute -right-[8%] top-[35%] size-[38vw] rounded-full bg-gold-soft/8 blur-[130px] animate-titiza-drift"
        style={{ animationDelay: '4s', animationDuration: '26s' }}
      />
      <div
        className="absolute bottom-[2%] left-1/3 size-[34vw] rounded-full bg-gold-muted/6 blur-[120px] animate-titiza-drift"
        style={{ animationDelay: '8s', animationDuration: '30s' }}
      />

      {/* Fine grid to suggest a technological space */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(oklch(0.85_0.09_85)_1px,transparent_1px),linear-gradient(90deg,oklch(0.85_0.09_85)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_50%,transparent_55%,oklch(0.1_0.006_55/0.7)_100%)]" />
    </div>
  )
}
