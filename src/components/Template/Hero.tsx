import Link from 'next/link';

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
        </h1>

        <p className="hero-tagline fade-in stagger-2">
          Economics B.S. &amp; Statistics minor at the{' '}
          <span className="hero-highlight">
            University of Minnesota, Twin Cities
          </span>
          . Passionate about bridging analytics with real-world impact.
        </p>

        <div className="hero-chips fade-in stagger-3">
          <span className="hero-chip">
            🎓 UMN Twin Cities
            <span className="hero-chip-tooltip">
              Economics B.S. &amp; Statistics minor
              <br />
              Graduating in May, 2026
            </span>
          </span>
          <span className="hero-chip">
            📊 Research &amp; Internship
            <span className="hero-chip-tooltip">
              Research @ Heller-Hurwicz Economics Institute
              <br />
              Internships @ Goat Consulting &amp; Bio-Techne
            </span>
          </span>
          <span className="hero-chip">
            📍 Minneapolis, MN
            <span className="hero-chip-tooltip">
              Based in Minneapolis since 2024
              <br />
              Open to opportunities nationwide
            </span>
          </span>
        </div>

        <div className="hero-cta fade-in stagger-4">
          <Link href="/about" className="button button-primary">
            About Me
          </Link>
          <Link href="/resume" className="button button-secondary">
            View Resume
          </Link>
        </div>
      </div>

      <div className="hero-bg" aria-hidden="true">
        <div className="hero-gradient" />
      </div>
    </section>
  );
}
