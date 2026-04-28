import Link from 'next/link';

import ContactIcons from '@/components/Contact/ContactIcons';
import { heroContacts } from '@/data/contact';

import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <ThemePortrait
          width={140}
          height={140}
          priority
          className="hero-avatar fade-in"
        />

        <h1 className="hero-title fade-in stagger-1">
          <span className="hero-name">
            Bonita <em>Chen</em>
          </span>
          <ContactIcons
            items={heroContacts}
            className="hero-inline-social"
            ariaLabel="Hero social links"
          />
        </h1>

        <p className="hero-tagline fade-in stagger-2">
          Economics B.S. &amp; Statistics minor at the{' '}
          <span className="hero-highlight">
            University of Minnesota, Twin Cities
          </span>
          . Passionate about bridging analytics with real-world impact.
        </p>

        <p className="hero-facts fade-in stagger-3">
          <span>🚀 Open to Full-Time Roles</span>
          <span className="hero-facts-dot" aria-hidden="true">
            ·
          </span>
          <span>📅 Earliest start: Monday, July 13, 2026</span>
          <span className="hero-facts-dot" aria-hidden="true">
            ·
          </span>
          <span>🛂 F-1 STEM OPT</span>
        </p>

        <p className="hero-location fade-in stagger-3">
          <span>📍 Based in Twin Cities</span>
          <span className="hero-facts-dot" aria-hidden="true">
            ·
          </span>
          <span>✈️ Willing to relocate</span>
        </p>

        <div className="hero-cta fade-in stagger-4">
          <Link href="/about" className="button button-primary">
            About Me
          </Link>
          <Link href="/resume" className="button button-secondary">
            View Résumé
          </Link>
        </div>
      </div>

      <div className="hero-bg" aria-hidden="true">
        <div className="hero-gradient" />
      </div>
    </section>
  );
}
