import type { CSSProperties } from 'react';

import type { Position } from '@/data/resume/work';

import Job from './Experience/Job';

interface ExperienceProps {
  data: Position[];
}

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

type Column = 'left' | 'right';

interface PlacedItem {
  position: Position;
  column: Column;
  rowStart: number;
  rowEnd: number;
}

interface Marker {
  label: string;
  row: number;
  isNow?: boolean;
  isBottom?: boolean;
}

function layoutTimeline(positions: Position[]) {
  const now = startOfMonth(new Date());

  let earliest = now;
  for (const pos of positions) {
    const s = startOfMonth(pos.startDate);
    if (s < earliest) earliest = s;
  }
  const totalMonths = monthDiff(earliest, now) + 1;

  // Sort: earliest start first, longest duration first for same start
  const sorted = [...positions].sort((a, b) => {
    const diff =
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    if (diff !== 0) return diff;
    const aDur =
      (a.endDate ? new Date(a.endDate).getTime() : Date.now()) -
      new Date(a.startDate).getTime();
    const bDur =
      (b.endDate ? new Date(b.endDate).getTime() : Date.now()) -
      new Date(b.startDate).getTime();
    return bDur - aDur;
  });

  // Greedy two-column assignment
  const colEnds: [Date | null, Date | null] = [null, null];
  const items: PlacedItem[] = [];

  for (const pos of sorted) {
    const start = startOfMonth(pos.startDate);
    const end = pos.endDate ? startOfMonth(pos.endDate) : now;

    let colIdx = 0;
    if (colEnds[0] !== null && start < colEnds[0]) colIdx = 1;
    colEnds[colIdx] = end;

    const endOffset = monthDiff(end, now);
    const startOffset = monthDiff(start, now);

    items.push({
      position: pos,
      column: colIdx === 0 ? 'left' : 'right',
      rowStart: endOffset + 1,
      rowEnd: startOffset + 2,
    });
  }

  // Year markers at each January within the range
  const markers: Marker[] = [{ label: 'Now', row: 1, isNow: true }];
  for (
    let year = earliest.getFullYear() + 1;
    year <= now.getFullYear() + 1;
    year++
  ) {
    const jan = new Date(year, 0, 1);
    if (jan > earliest && jan <= now) {
      const offset = monthDiff(jan, now);
      markers.push({ label: String(year), row: offset + 1 });
    }
  }
  // Starting year at the bottom
  markers.push({
    label: String(earliest.getFullYear()),
    row: totalMonths,
    isBottom: true,
  });

  // Sort items newest-first for mobile DOM order
  items.sort(
    (a, b) =>
      new Date(b.position.startDate).getTime() -
      new Date(a.position.startDate).getTime(),
  );

  return { items, markers, totalMonths };
}

export default function Experience({ data }: ExperienceProps) {
  const { items, markers, totalMonths } = layoutTimeline(data);

  return (
    <div className="experience">
      <div className="link-to" id="experience" />
      <div className="title">
        <h3>Experience</h3>
      </div>
      <div
        className="exp-timeline"
        style={{ '--exp-rows': totalMonths } as CSSProperties}
      >
        {/* Center axis line */}
        <div
          className="exp-axis"
          aria-hidden="true"
          style={{ gridRow: `1 / ${totalMonths + 1}` }}
        />

        {/* Year / Now markers */}
        {markers.map((m) => (
          <div
            key={m.label}
            className={`exp-marker${m.isNow ? ' exp-marker--now' : ''}${m.isBottom ? ' exp-marker--bottom' : ''}`}
            style={{ gridRow: m.row }}
            aria-hidden="true"
          >
            <span className="exp-marker-label">{m.label}</span>
          </div>
        ))}

        {/* Position cards */}
        {items.map(({ position: job, column, rowStart, rowEnd }) => (
          <div
            className={`exp-item exp-item--${column}`}
            key={`${job.name}-${job.position}-${job.startDate}`}
            style={{ gridRow: `${rowStart} / ${rowEnd}` }}
          >
            <Job data={job} />
          </div>
        ))}
      </div>
    </div>
  );
}
