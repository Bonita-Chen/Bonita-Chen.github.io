import type { Position } from '@/data/resume/work';

import Job from './Experience/Job';

interface ExperienceProps {
  data: Position[];
}

type Side = 'left' | 'right';

/**
 * Assign sides intelligently: overlapping roles go on opposite sides,
 * sequential roles alternate naturally. Sorted newest-first (top to bottom).
 */
function assignSides(
  positions: Position[],
): { position: Position; side: Side }[] {
  const sorted = [...positions].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  const result: { position: Position; side: Side }[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      result.push({ position: sorted[i], side: 'left' });
      continue;
    }

    const prev = result[i - 1];
    const prevEnd = prev.position.endDate
      ? new Date(prev.position.endDate)
      : new Date();
    const currStart = new Date(sorted[i].startDate);

    // Overlapping: place on opposite side
    const overlaps = currStart < prevEnd;
    const side: Side = overlaps
      ? prev.side === 'left'
        ? 'right'
        : 'left'
      : prev.side === 'left'
        ? 'right'
        : 'left';

    result.push({ position: sorted[i], side });
  }

  return result;
}

export default function Experience({ data }: ExperienceProps) {
  const items = assignSides(data);

  return (
    <div className="experience">
      <div className="link-to" id="experience" />
      <div className="title">
        <h3>Experience</h3>
      </div>
      <div className="timeline">
        <div className="timeline-line" aria-hidden="true" />
        {items.map(({ position: job, side }) => (
          <div
            className={`timeline-item timeline-item--${side}`}
            key={`${job.name}-${job.position}-${job.startDate}`}
          >
            <div className="timeline-node" aria-hidden="true" />
            <div className="timeline-card">
              <Job data={job} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
