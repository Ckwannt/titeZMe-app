import Image from 'next/image';
import MobileNavigation from './MobileNavigation';
import WaitlistForm from './WaitlistForm';
import TextScaling from './TextScaling';
import styles from './launch.module.css';

const categories = ['Hair', 'Skin', 'Dental', 'Body', 'Wellness', 'Products', 'Professionals'];
const links = ['Watch the film', 'Meet titiZa', 'For professionals', 'Our vision'];

function DecorativeLayer({ name, width, height, className }: { name: string; width: number; height: number; className: string }) {
  return <Image className={className} src={`/launch/corrected/${name}.png`} width={width} height={height} sizes="(max-width: 1100px) 28vw, 14vw" alt="" />;
}

export default function LaunchHomepage() {
  return <main className={styles.page}>
    <TextScaling />
    <a className={styles.skipLink} href="#launch-title">Skip to content</a>
    <div className={styles.desktopScene} aria-hidden="true">
      <Image src="/launch/scene/desktop-clean-reconstruction.webp" alt="" width={1672} height={941} sizes="100vw" priority />
      <div className={styles.desktopDecorations}>
      <DecorativeLayer name="note-better-desktop-extract" width={155} height={263} className={styles.betterNote} />
      <DecorativeLayer name="photo-comb-desktop-extract" width={170} height={223} className={styles.combPhoto} />
      <DecorativeLayer name="photo-bottle-desktop-extract" width={213} height={229} className={styles.bottlePhoto} />
      <DecorativeLayer name="photo-flowers-desktop-extract" width={198} height={200} className={styles.flowerPhoto} />
      <DecorativeLayer name="note-real-desktop-extract" width={163} height={209} className={styles.realNote} />
      <div className={styles.bookSpines}>
        {['HAIR', 'SKIN', 'DENTAL', 'BODY', 'WELLNESS'].map(label => <span key={label}>{label}</span>)}
      </div>
      </div>
    </div>
    <div className={styles.mobileScene} aria-hidden="true">
      <Image className={styles.mobilePlate} src="/launch/scene/mobile-clean-reconstruction.webp" alt="" width={1031} height={1525} sizes="(max-width: 1100px) 100vw, 1px" />
      <Image className={styles.mobileRestoration} src="/launch/corrected/mobile-approved-foreground-refined.webp" alt="" width={704} height={574} loading="eager" unoptimized />
      <DecorativeLayer name="note-better-mobile-extract" width={154} height={241} className={styles.betterNote} />
      <DecorativeLayer name="photo-comb-mobile-extract" width={153} height={180} className={styles.combPhoto} />
      <DecorativeLayer name="photo-bottle-mobile-extract" width={180} height={181} className={styles.bottlePhoto} />
    </div>
    <header className={styles.header}>
      <Image className={styles.wordmark} src="/launch/wordmark-extract.png" width={214} height={55} alt="titeZMe" priority />
      <nav className={styles.desktopNavigation} aria-label="Main navigation" aria-description="These destinations are not yet available.">
        {links.map(label => <span key={label} aria-disabled="true" title="Coming soon">{label}</span>)}
      </nav>
      <p className={styles.statement}>A more intelligent<br />beauty &amp; wellness<br />world.</p>
      <MobileNavigation />
    </header>
    <section className={styles.introduction} aria-labelledby="launch-title">
      <Image className={styles.passionNote} src="/launch/passion-ink-extract.png" width={210} height={123} alt="Same passion. Different people. Better choices." sizes="(max-width: 1100px) 30vw, 13vw" />
      <h1 id="launch-title" tabIndex={-1}>Beauty has<br />a <em>brain now.</em></h1>
      <p>Understand what suits you. Discover beauty and wellness professionals with the expertise you need.</p>
    </section>
    <WaitlistForm />
    <ul className={styles.categories} aria-label="Beauty and wellness categories">
      {categories.map(label => <li key={label}><Image src={`/launch/icons/${label.toLowerCase()}.svg`} alt="" width={34} height={36} /><span>{label}</span></li>)}
    </ul>
    <footer className={styles.footer}>
      <div><p>General inquiries</p><a href="mailto:hello@titezme.com">hello@titezme.com</a></div>
      <span className={styles.ornament} aria-hidden="true"><i />Z<i /></span>
      <div><p>Professionals &amp; businesses</p><a href="mailto:operations@titezme.com">operations@titezme.com</a></div>
    </footer>
  </main>;
}
