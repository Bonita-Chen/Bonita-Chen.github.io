import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import PageWrapper from '@/components/Template/PageWrapper';
import interests from '@/data/interests';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Interests',
  description:
    'Recent interests, progress timelines, and related projects by Baojia Chen.',
  path: '/interests/',
});

function startOfMonth(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, count: number) {
  return new Date(date.getFullYear(), date.getMonth() + count, 1);
}

function monthDiff(start: Date, end: Date) {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth()
  );
}

function monthLabel(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short' });
}

const now = startOfMonth(new Date());
const timelineStart = interests.reduce(
  (earliest, interest) => {
    const start = startOfMonth(interest.start);
    return start < earliest ? start : earliest;
  },
  startOfMonth(interests[0]?.start || now),
);

const projectedEnds = interests.map((interest) => {
  if (interest.ongoing) {
    return addMonths(now, 8);
  }
  return addMonths(
    startOfMonth(interest.start),
    Math.max((interest.targetMonths || 1) - 1, 0),
  );
});

const timelineEnd = addMonths(
  projectedEnds.reduce((latest, date) => (date > latest ? date : latest), now),
  2,
);

const monthTotal = monthDiff(timelineStart, timelineEnd) + 1;
const timelineMonths = Array.from({ length: monthTotal }, (_, index) =>
  addMonths(timelineStart, index),
);

function getProgress(
  interestStart: string,
  targetMonths?: number,
  ongoing?: boolean,
) {
  if (ongoing || !targetMonths) {
    return null;
  }

  const elapsed = Math.max(monthDiff(startOfMonth(interestStart), now) + 1, 0);
  return Math.min(100, Math.round((elapsed / targetMonths) * 100));
}

function getTrackStyle(
  interestStart: string,
  accent: string,
  targetMonths?: number,
  ongoing?: boolean,
) {
  const start = startOfMonth(interestStart);
  const left = (monthDiff(timelineStart, start) / monthTotal) * 100;
  const span = ongoing
    ? monthDiff(start, timelineEnd) + 1
    : Math.max(targetMonths || 1, 1);
  const width = (span / monthTotal) * 100;

  return {
    '--interest-left': `${left}%`,
    '--interest-width': `${width}%`,
    '--interest-accent': accent,
  } as CSSProperties;
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
      <Link href={href} className="interest-entry interest-entry--link">
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
        <header className="interests-header">
          <h1 className="page-title">Interests</h1>
          <p className="page-subtitle">
            A timeline of what I&apos;ve been investing attention in lately.
          </p>
          <p className="interests-note">
            The percentages below are estimated from elapsed months versus the
            planned duration for each interest area. Ongoing interests stay
            open-ended by design.
          </p>
        </header>

        <section
          className="interests-timeline"
          aria-label="Interest progress timeline"
        >
          <div className="interests-timeline-header">
            <div className="interests-timeline-label">Interest</div>
            <div className="interests-timeline-months">
              {timelineMonths.map((month) => (
                <div className="interests-month" key={month.toISOString()}>
                  <span>{monthLabel(month)}</span>
                  <small>{String(month.getFullYear()).slice(-2)}</small>
                </div>
              ))}
            </div>
            <div className="interests-timeline-progress">Progress</div>
          </div>

          <div className="interests-timeline-rows">
            {interests.map((interest) => {
              const progress = getProgress(
                interest.start,
                interest.targetMonths,
                interest.ongoing,
              );

              return (
                <div className="interests-row" key={interest.slug}>
                  <a href={`#${interest.slug}`} className="interests-row-link">
                    <span aria-hidden="true">{interest.icon}</span>
                    {interest.name}
                  </a>
                  <div
                    className="interests-track"
                    style={getTrackStyle(
                      interest.start,
                      interest.accent,
                      interest.targetMonths,
                      interest.ongoing,
                    )}
                  >
                    <span className="interests-bar">{interest.trackLabel}</span>
                  </div>
                  <div className="interests-progress">
                    {interest.ongoing ? 'Ongoing' : `${progress}%`}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

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
