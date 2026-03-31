import dayjs from 'dayjs';

import type { Degree as DegreeType } from '@/data/resume/degrees';

interface DegreeProps {
  data: DegreeType;
}

function formatDateRange(startDate?: string, endDate?: string, year?: number) {
  if (!startDate || !endDate) {
    return String(year ?? '');
  }

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (start.year() === end.year()) {
    return `${start.format('MMM')} – ${end.format('MMM YYYY')}`;
  }

  return `${start.format('MMM YYYY')} – ${end.format('MMM YYYY')}`;
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
    </article>
  );
}
