import type { Position } from '@/data/resume/work';
import { formatDateRange } from '@/lib/dates';

import JobSummary from './JobSummary';

interface JobProps {
  data: Position;
}

export default function Job({ data }: JobProps) {
  const {
    name,
    position,
    url,
    startDate,
    endDate,
    subtitleSuffix,
    supervisorName,
    supervisorUrl,
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
        {supervisorName ? (
          <>
            {' · Supervisor: '}
            {supervisorUrl ? (
              <a href={supervisorUrl}>{supervisorName}</a>
            ) : (
              supervisorName
            )}
          </>
        ) : null}
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
