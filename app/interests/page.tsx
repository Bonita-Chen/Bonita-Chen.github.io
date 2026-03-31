import type { Metadata } from 'next';
import Link from 'next/link';

import InterestTimeline from '@/components/Interests/InterestTimeline';
import PageWrapper from '@/components/Template/PageWrapper';
import interests from '@/data/interests';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Interests',
  description:
    'Recent interests, progress timelines, and related projects by Bonita Chen.',
  path: '/interests/',
});

function startOfMonth(value: string) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthDiff(start: Date, end: Date) {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth()
  );
}

function getProgress(
  interestStart: string,
  targetMonths?: number,
  ongoing?: boolean,
) {
  if (ongoing || !targetMonths) {
    return null;
  }
  const now = new Date();
  const nowMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const elapsed = Math.max(
    monthDiff(startOfMonth(interestStart), nowMonth) + 1,
    0,
  );
  return Math.min(100, Math.round((elapsed / targetMonths) * 100));
}

function appendFrom(url: string): string {
  if (!url.startsWith('/')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}from=interests`;
}

function InterestEntryCard({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return <article className="interest-entry">{children}</article>;
  }

  if (href.startsWith('/')) {
    return (
      <Link
        href={appendFrom(href)}
        className="interest-entry interest-entry--link"
      >
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className="interest-entry interest-entry--link">
      {children}
    </a>
  );
}

export default function InterestsPage() {
  return (
    <PageWrapper mainClassName="page-main--wide">
      <section className="interests-page">
        <header className="interests-header fade-in">
          <h1 className="page-title">
            <em>Interests</em>
          </h1>
          <p className="interests-note">
            The percentages below are estimated from elapsed months versus the
            planned duration for each interest area. Ongoing interests stay
            open-ended by design.
          </p>
        </header>

        <InterestTimeline interests={interests} />

        <div className="interests-details">
          {interests.map((interest) => {
            const progress = getProgress(
              interest.start,
              interest.targetMonths,
              interest.ongoing,
            );

            return (
              <section
                className="interest-detail"
                id={interest.slug}
                key={interest.slug}
              >
                <div className="interest-detail-header">
                  <div>
                    <p className="interest-detail-kicker">Interest</p>
                    <h2 className="interest-detail-title">
                      <span aria-hidden="true">{interest.icon}</span>
                      {interest.name}
                    </h2>
                    <p className="interest-detail-summary">
                      {interest.summary}
                    </p>
                  </div>
                  <div className="interest-detail-stat">
                    <span>Estimated Progress</span>
                    <strong>
                      {interest.ongoing ? 'Open-ended' : `${progress}%`}
                    </strong>
                    <small>
                      {interest.ongoing
                        ? 'No fixed finish date'
                        : `Target: ${interest.targetMonths} months`}
                    </small>
                  </div>
                </div>

                <div className="interest-entry-list">
                  {interest.entries.map((entry) => (
                    <InterestEntryCard
                      href={entry.href}
                      key={`${interest.slug}-${entry.title}`}
                    >
                      <div className="interest-entry-meta">
                        <span className="interest-entry-type">
                          {entry.type}
                        </span>
                        <time dateTime={entry.date}>{entry.date}</time>
                      </div>
                      <h3 className="interest-entry-title">{entry.title}</h3>
                      <p className="interest-entry-description">
                        {entry.description}
                      </p>
                      <div className="interest-entry-tags">
                        {entry.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </InterestEntryCard>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </PageWrapper>
  );
}
