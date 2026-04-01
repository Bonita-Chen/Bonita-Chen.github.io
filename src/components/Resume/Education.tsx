import type { Degree } from '@/data/resume/degrees';
import { formatDateRange } from '@/lib/dates';

interface EducationProps {
  data: Degree[];
}

export default function Education({ data }: EducationProps) {
  return (
    <div className="education">
      <div className="link-to" id="education" />
      <div className="title">
        <h3>Education</h3>
      </div>
      <div className="exp-timeline">
        {data.map((degree) => (
          <div className="exp-entry" key={degree.school}>
            <div className="exp-date-col">
              <span className="exp-date">
                {formatDateRange(degree.startDate, degree.endDate, degree.year)}
              </span>
            </div>
            <div className="exp-dot-col" aria-hidden="true">
              <span className="exp-dot" />
            </div>
            <div
              className="exp-detail-col"
              data-date={formatDateRange(
                degree.startDate,
                degree.endDate,
                degree.year,
              )}
            >
              <h4 className="exp-position">{degree.degree}</h4>
              <p className="exp-company">
                <a href={degree.link}>{degree.school}</a>
                {degree.subtitleSuffix && (
                  <>
                    {' · '}
                    {degree.subtitleUrl ? (
                      <a href={degree.subtitleUrl}>{degree.subtitleSuffix}</a>
                    ) : (
                      degree.subtitleSuffix
                    )}
                  </>
                )}
              </p>
              {degree.description && (
                <p className="exp-description">{degree.description}</p>
              )}
              {degree.achievements?.length ? (
                <ul className="exp-highlights">
                  {degree.achievements.map((a) => (
                    <li key={a}>{a}</li>
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
