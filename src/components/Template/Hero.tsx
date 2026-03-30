import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div
          className="hero-avatar hero-avatar--emoji fade-in"
          aria-hidden="true"
        >
          <span className="hero-avatar-emoji">🫐</span>
        </div>

        <h1 className="hero-title fade-in stagger-1">
          <span className="hero-name">
            Bonita <em>Chen</em>
          </span>
        </h1>

        <p className="hero-tagline fade-in stagger-2">
          Economics &amp; Statistics at the{' '}
          <span className="hero-highlight">University of Minnesota</span>.
          Passionate about data, research, and bridging analytics with
          real-world impact.
        </p>

        <div className="hero-chips fade-in stagger-3">
          <span className="hero-chip">
            🎓 UMN Twin Cities
            <span className="hero-chip-tooltip">
              B.S. Economics &amp; Minor in Statistics
              <br />
              GPA: 3.85 / 4.0 · Expected May 2026
            </span>
          </span>
          <span className="hero-chip">
            📊 Data &amp; Research
            <span className="hero-chip-tooltip">
              Research Assistant @ Heller-Hurwicz Institute
              <br />
              Python · Stata · R · Power BI pipelines
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
