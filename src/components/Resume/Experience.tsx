import type { Position } from '@/data/resume/work';

import { formatDateRange } from '@/lib/dates';

interface ExperienceProps {
  data: Position[];
}

/**
 * Extract the city/location portion from subtitleSuffix for the date column.
 * If it contains " · ", take the last segment (the city).
 */
function getLocation(suffix?: string) {
  if (!suffix) return null;
  if (suffix.includes('·')) return suffix.split('·').pop()?.trim() ?? null;
  return suffix;
}

/**
 * Extract any supplementary info (everything before the last " · " segment).
 * e.g. "Carlson School of Management · Minneapolis, MN" → "Carlson School of Management"
 * e.g. "Global Headquarters · Minneapolis, MN" → "Global Headquarters"
 * If there's no " · ", there's no extra info (it's just a location).
 */
function getExtraInfo(suffix?: string) {
  if (!suffix || !suffix.includes('·')) return null;
  const parts = suffix.split('·');
  if (parts.length <= 1) return null;
  return parts
    .slice(0, -1)
    .map((s) => s.trim())
    .join(' · ');
}

export default function Experience({ data }: ExperienceProps) {
  return (
    <div className="experience">
      <div className="link-to" id="experience" />
      <div className="title">
        <h3>Experience</h3>
      </div>
      <div className="exp-timeline">
        {data.map((job) => {
          const location = getLocation(job.subtitleSuffix);
          const extraInfo = getExtraInfo(job.subtitleSuffix);

          return (
            <div
              className="exp-entry"
              key={`${job.name}-${job.position}-${job.startDate}`}
            >
              <div className="exp-date-col">
                <span className="exp-date">
                  {formatDateRange(job.startDate, job.endDate)}
                </span>
                {location && <span className="exp-location">{location}</span>}
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
                  {job.url ? (
                    <a href={job.url}>{job.name}</a>
                  ) : (
                    <span>{job.name}</span>
                  )}
                </p>
                {(extraInfo || job.supervisorName) && (
                  <p className="exp-meta">
                    {extraInfo && job.subtitleUrl ? (
                      <a href={job.subtitleUrl}>{extraInfo}</a>
                    ) : (
                      extraInfo
                    )}
                    {extraInfo && job.supervisorName && ' · '}
                    {job.supervisorName && (
                      <>
                        {'Supervisor: '}
                        {job.supervisorUrl ? (
                          <a href={job.supervisorUrl}>{job.supervisorName}</a>
                        ) : (
                          job.supervisorName
                        )}
                      </>
                    )}
                  </p>
                )}
                {job.highlights?.length ? (
                  <ul className="exp-highlights">
                    {job.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
