'use client';

import type { CSSProperties } from 'react';
import { useRef, useState } from 'react';

import type { Interest } from '@/data/interests';

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

function getProgress(
  interestStart: string,
  now: Date,
  targetMonths?: number,
  ongoing?: boolean,
) {
  if (ongoing || !targetMonths) {
    return null;
  }
  const elapsed = Math.max(monthDiff(startOfMonth(interestStart), now) + 1, 0);
  return Math.min(100, Math.round((elapsed / targetMonths) * 100));
}

interface InterestTimelineProps {
  interests: Interest[];
}

export default function InterestTimeline({ interests }: InterestTimelineProps) {
  const [hoveredRange, setHoveredRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);

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
    projectedEnds.reduce(
      (latest, date) => (date > latest ? date : latest),
      now,
    ),
    2,
  );

  const monthTotal = monthDiff(timelineStart, timelineEnd) + 1;
  const timelineMonths = Array.from({ length: monthTotal }, (_, index) =>
    addMonths(timelineStart, index),
  );

  function getBarStyle(
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

  function getBarRange(
    interestStart: string,
    targetMonths?: number,
    ongoing?: boolean,
  ) {
    const start = startOfMonth(interestStart);
    const startIndex = monthDiff(timelineStart, start);
    const span = ongoing
      ? monthDiff(start, timelineEnd) + 1
      : Math.max(targetMonths || 1, 1);
    return { start: startIndex, end: startIndex + span - 1 };
  }

  /* Drag-to-scroll handlers for the middle timeline */
  function handlePointerDown(e: React.PointerEvent) {
    const el = scrollRef.current;
    if (!el) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartLeft.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - dragStartX.current;
    scrollRef.current.scrollLeft = scrollStartLeft.current - dx;
  }

  function handlePointerUp(e: React.PointerEvent) {
    setIsDragging(false);
    scrollRef.current?.releasePointerCapture(e.pointerId);
  }

  return (
    <section
      className="gantt-layout"
      aria-label="Interest progress timeline"
      style={{ '--month-count': monthTotal } as CSSProperties}
    >
      {/* LEFT COLUMN — labels */}
      <div className="gantt-col gantt-col-left">
        <div className="gantt-col-header">Interest</div>
        {interests.map((interest) => (
          <a
            key={interest.slug}
            href={`#${interest.slug}`}
            className="gantt-label"
          >
            <span aria-hidden="true">{interest.icon}</span>
            {interest.name}
          </a>
        ))}
      </div>

      {/* MIDDLE COLUMN — scrollable timeline */}
      <div
        ref={scrollRef}
        className={`gantt-col gantt-col-timeline${isDragging ? ' gantt-col-timeline--dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="gantt-timeline-inner">
          {/* Month header */}
          <div className="gantt-months">
            {timelineMonths.map((month, index) => {
              const isHighlighted =
                hoveredRange !== null &&
                index >= hoveredRange.start &&
                index <= hoveredRange.end;
              const isJanuary = month.getMonth() === 0;
              const showLabel =
                monthTotal <= 18 || isJanuary || index % 3 === 0;
              return (
                <div
                  className={`gantt-month${isHighlighted ? ' gantt-month--active' : ''}${isJanuary ? ' gantt-month--jan' : ''}`}
                  key={month.toISOString()}
                >
                  <span>{showLabel ? monthLabel(month) : ''}</span>
                  <small>
                    {isJanuary || index === 0
                      ? String(month.getFullYear())
                      : showLabel
                        ? `'${String(month.getFullYear()).slice(-2)}`
                        : ''}
                  </small>
                </div>
              );
            })}
          </div>

          {/* Track rows */}
          {interests.map((interest) => {
            const range = getBarRange(
              interest.start,
              interest.targetMonths,
              interest.ongoing,
            );
            return (
              <div
                className="gantt-track"
                key={interest.slug}
                style={getBarStyle(
                  interest.start,
                  interest.accent,
                  interest.targetMonths,
                  interest.ongoing,
                )}
                onMouseEnter={() => setHoveredRange(range)}
                onMouseLeave={() => setHoveredRange(null)}
              >
                <span className="gantt-bar">{interest.trackLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN — progress */}
      <div className="gantt-col gantt-col-right">
        <div className="gantt-col-header">Done</div>
        {interests.map((interest) => {
          const progress = getProgress(
            interest.start,
            now,
            interest.targetMonths,
            interest.ongoing,
          );
          return (
            <div className="gantt-progress" key={interest.slug}>
              {interest.ongoing ? '∞' : `${progress}%`}
            </div>
          );
        })}
      </div>
    </section>
  );
}
