import type { Degree as DegreeType } from '@/data/resume/degrees';
import { formatDateRange } from '@/lib/dates';

interface DegreeProps {
  data: DegreeType;
}

export default function Degree({ data }: DegreeProps) {
  return (
    <article className="degree-container resume-item">
      <header className="resume-item-header">
        <h4 className="degree resume-item-title">{data.degree}</h4>
        <p className="daterange">
          {formatDateRange(data.startDate, data.endDate, data.year)}
        </p>
      </header>
      <p className="school resume-item-subtitle">
        <a href={data.link}>{data.school}</a>
        {data.subtitleSuffix ? <> · {data.subtitleSuffix}</> : null}
      </p>
      {data.description ? (
        <p className="resume-item-desc degree-description">
          {data.description}
        </p>
      ) : null}
      {data.achievements?.length ? (
        <div className="resume-item-desc">
          <ul className="degree-achievements">
            {data.achievements.map((achievement) => (
              <li key={achievement}>{achievement}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
