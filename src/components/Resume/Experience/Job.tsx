import dayjs from 'dayjs';

import type { Position } from '@/data/resume/work';

import JobSummary from './JobSummary';

interface JobProps {
  data: Position;
}

function formatDateRange(startDate: string, endDate?: string) {
  const start = dayjs(startDate);

  if (!endDate) {
    return `${start.format('MMM YYYY')} – Present`;
  }

  const end = dayjs(endDate);

  if (start.year() === end.year()) {
    return `${start.format('MMM')} – ${end.format('MMM YYYY')}`;
  }

  return `${start.format('MMM YYYY')} – ${end.format('MMM YYYY')}`;
}

export default function Job({ data }: JobProps) {
  const {
    name,
    position,
    url,
    startDate,
    endDate,
    subtitleSuffix,
    summary,
    highlights,
  } = data;

  return (
    <article className="jobs-container resume-item">
      <header className="resume-item-header">
        <h4 className="resume-item-title">{position}</h4>
        <p className="daterange">{formatDateRange(startDate, endDate)}</p>
      </header>
      <p className="resume-item-subtitle role">
        <a href={url}>{name}</a>
        {subtitleSuffix ? <> · {subtitleSuffix}</> : null}
      </p>
      {summary && !highlights?.length ? <JobSummary summary={summary} /> : null}
      {highlights?.length ? (
        <div className="resume-item-desc">
          <ul className="points">
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
