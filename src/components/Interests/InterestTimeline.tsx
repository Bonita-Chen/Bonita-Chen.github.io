'use client';

import type { CSSProperties } from 'react';

import type { Interest } from '@/data/interests';

function startOfMonth(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthDiff(start: Date, end: Date) {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth()
  );
}

function formatMonthYear(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getProgress(
  interestStart: string,
  targetMonths?: number,
  ongoing?: boolean,
) {
  if (ongoing || !targetMonths) return null;
  const now = new Date();
  const nowMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const elapsed = Math.max(
    monthDiff(startOfMonth(interestStart), nowMonth) + 1,
    0,
  );
  return Math.min(100, Math.round((elapsed / targetMonths) * 100));
}

function getBarPalette(accent?: string) {
  const a = (accent || '#43638C').trim().toUpperCase();
  switch (a) {
    case '#DDE7F3':
      return { start: '#F3F8FD', mid: '#DDE7F3', end: '#C6D6E8' };
    case '#ADD1F3':
      return { start: '#D8EBFB', mid: '#ADD1F3', end: '#82A9CF' };
    case '#7189A5':
      return { start: '#95ACC6', mid: '#7189A5', end: '#5E7897' };
    case '#223C5B':
      return { start: '#425F86', mid: '#223C5B', end: '#16283D' };
    default:
      return { start: '#6785AA', mid: '#43638C', end: '#2E496D' };
  }
}

interface InterestTimelineProps {
  interests: Interest[];
}

export default function InterestTimeline({ interests }: InterestTimelineProps) {
  return (
    <div
      className="interest-progress-grid"
      aria-label="Interest progress overview"
    >
      {interests.map((interest) => {
        const progress = getProgress(
          interest.start,
          interest.targetMonths,
          interest.ongoing,
        );
        const palette = getBarPalette(interest.accent);

        return (
          <a
            key={interest.slug}
            href={`#${interest.slug}`}
            className="interest-progress-card"
            style={
              {
                '--bar-start': palette.start,
                '--bar-mid': palette.mid,
                '--bar-end': palette.end,
              } as CSSProperties
            }
          >
            <div className="interest-progress-top">
              <div className="interest-progress-name">
                <span className="interest-progress-icon" aria-hidden="true">
                  {interest.icon}
                </span>
                <span className="interest-progress-label">{interest.name}</span>
              </div>
              <span className="interest-progress-value">
                {interest.ongoing ? 'Ongoing' : `${progress}%`}
              </span>
            </div>

            <div className="interest-progress-track">
              <div
                className={`interest-progress-fill${interest.ongoing ? ' interest-progress-fill--ongoing' : ''}`}
                style={{ width: interest.ongoing ? '100%' : `${progress}%` }}
              />
            </div>

            <div className="interest-progress-meta">
              <span>Started {formatMonthYear(interest.start)}</span>
              <span>
                {interest.ongoing
                  ? 'No end date'
                  : `Target: ${interest.targetMonths} months`}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
