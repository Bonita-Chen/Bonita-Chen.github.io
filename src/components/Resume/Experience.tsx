import type { Position } from '@/data/resume/work';

import { formatDateRange } from '@/lib/dates';

interface ExperienceProps {
  data: Position[];
}

export default function Experience({ data }: ExperienceProps) {
  return (
    <div className="experience">
      <div className="link-to" id="experience" />
      <div className="title">
        <h3>Experience</h3>
      </div>
      <div className="exp-timeline">
        {data.map((job) => (
          <div
            className="exp-entry"
            key={`${job.name}-${job.position}-${job.startDate}`}
          >
            <div className="exp-date-col">
              <span className="exp-date">
                {formatDateRange(job.startDate, job.endDate)}
              </span>
              {job.subtitleSuffix && (
                <span className="exp-location">
                  {/* Extract just the city from subtitleSuffix */}
                  {job.subtitleSuffix.includes('·')
                    ? job.subtitleSuffix.split('·').pop()?.trim()
                    : job.subtitleSuffix}
                </span>
              )}
            </div>
            <div className="exp-dot-col" aria-hidden="true">
              <span className="exp-dot" />
            </div>
            <div
              className="exp-detail-col"
              data-date={formatDateRange(job.startDate, job.endDate)}
            >
              <h4 className="exp-position">{job.position}</h4>
              <p className="exp-company">
                <a href={job.url}>{job.name}</a>
                {job.supervisorName && (
                  <>
                    {' · Supervisor: '}
                    {job.supervisorUrl ? (
                      <a href={job.supervisorUrl}>{job.supervisorName}</a>
                    ) : (
                      job.supervisorName
                    )}
                  </>
                )}
              </p>
              {job.highlights?.length ? (
                <ul className="exp-highlights">
                  {job.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
