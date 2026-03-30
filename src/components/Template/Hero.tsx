import Link from 'next/link';

import ThemePortrait from './ThemePortrait';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-avatar">
          <ThemePortrait width={160} height={160} priority />
        </div>

        <h1 className="hero-title">
          <span className="hero-name">Bonita Chen</span>
        </h1>

        <p className="hero-tagline">
          Economics and statistics student building at the intersection of{' '}
          <a
            href="https://cla.umn.edu/heller-hurwicz"
            className="hero-highlight"
          >
            research
          </a>
          ,{' '}
          <a href="https://goatconsulting.com/" className="hero-highlight">
            analytics
          </a>{' '}
          , and calm, thoughtful storytelling.
          <br />I care about turning messy questions into work other people can
          actually use.
        </p>

        <div className="hero-chips">
          <span className="hero-chip">
            UMN Twin Cities
            <span className="hero-chip-tooltip">
              B.S. Economics, Minor in Statistics
              <br />
              GPA 3.85 / 4.0
            </span>
          </span>
          <span className="hero-chip">
            Research + Analytics
            <span className="hero-chip-tooltip">
              Research Assistant at HHEI
              <br />
              Marketing Analytics Intern at Goat Consulting
            </span>
          </span>
          <span className="hero-chip">
            Minneapolis, MN
            <span className="hero-chip-tooltip">
              Based between campus research, consulting work, and city photo
              walks
            </span>
          </span>
        </div>

        <div className="hero-cta">
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
