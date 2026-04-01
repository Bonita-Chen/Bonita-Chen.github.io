'use client';

import type { CSSProperties } from 'react';
import { useCallback, useRef, useState } from 'react';

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

function formatDuration(startStr: string) {
  const start = startOfMonth(startStr);
  const now = startOfMonth(new Date());
  const totalMonths = Math.max(monthDiff(start, now) + 1, 1);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months} mo`;
  if (months === 0) return `${years} yr`;
  return `${years} yr ${months} mo`;
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

function generateMonthMarkers(earliest: Date, latest: Date) {
  const markers: { date: Date; label: string }[] = [];
  const current = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
  while (current <= latest) {
    markers.push({
      date: new Date(current),
      label: current.toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
    });
    current.setMonth(current.getMonth() + 1);
  }
  return markers;
}

interface InterestTimelineProps {
  interests: Interest[];
}

const MIN_LABEL_WIDTH = 140;
const MAX_LABEL_WIDTH = 320;
const DEFAULT_LABEL_WIDTH = 180;

export default function InterestTimeline({ interests }: InterestTimelineProps) {
  const [labelWidth, setLabelWidth] = useState(DEFAULT_LABEL_WIDTH);
  const dragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setLabelWidth(Math.min(MAX_LABEL_WIDTH, Math.max(MIN_LABEL_WIDTH, x)));
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Compute timeline range
  const now = startOfMonth(new Date());
  const earliest = interests.reduce((min, i) => {
    const d = startOfMonth(i.start);
    return d < min ? d : min;
  }, now);
  const latest = now;
  const totalMonths = monthDiff(earliest, latest) + 1;
  const markers = generateMonthMarkers(earliest, latest);

  function getBarStyle(interest: Interest): CSSProperties {
    const start = startOfMonth(interest.start);
    const offsetMonths = monthDiff(earliest, start);
    const spanMonths = monthDiff(start, latest) + 1;
    const leftPercent = (offsetMonths / totalMonths) * 100;
    const widthPercent = (spanMonths / totalMonths) * 100;
    const palette = getBarPalette(interest.accent);

    return {
      left: `${leftPercent}%`,
      width: `${widthPercent}%`,
      background: `linear-gradient(90deg, ${palette.start} 0%, ${palette.mid} 50%, ${palette.end} 100%)`,
    };
  }

  return (
    <div
      className="gantt-container"
      ref={containerRef}
      style={{ '--gantt-label-width': `${labelWidth}px` } as CSSProperties}
      aria-label="Interest duration timeline"
    >
      {/* Header row with month markers */}
      <div className="gantt-header">
        <div className="gantt-label-col" />
        <div
          className="gantt-divider"
          role="separator"
          aria-label="Resize label column"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
        <div className="gantt-timeline-col">
          <div className="gantt-markers">
            {markers.map((m, i) => (
              <span
                key={m.label}
                className="gantt-marker"
                style={{
                  left: `${(i / totalMonths) * 100}%`,
                  width: `${(1 / totalMonths) * 100}%`,
                }}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Interest rows */}
      {interests.map((interest) => {
        const palette = getBarPalette(interest.accent);
        return (
          <a
            key={interest.slug}
            href={`#${interest.slug}`}
            className="gantt-row"
          >
            <div className="gantt-label-col">
              <span className="gantt-icon" aria-hidden="true">
                {interest.icon}
              </span>
              <span className="gantt-name">{interest.name}</span>
            </div>
            <div className="gantt-divider-spacer" />
            <div className="gantt-timeline-col">
              <div className="gantt-track">
                <div className="gantt-bar" style={getBarStyle(interest)}>
                  <span
                    className="gantt-duration"
                    style={
                      {
                        '--bar-end': palette.end,
                      } as CSSProperties
                    }
                  >
                    {formatDuration(interest.start)}
                  </span>
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
