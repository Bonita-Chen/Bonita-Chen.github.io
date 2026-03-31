import dayjs from 'dayjs';

import type { Degree as DegreeType } from '@/data/resume/degrees';

interface DegreeProps {
  data: DegreeType;
}

export default function Degree({ data }: DegreeProps) {
  const dateLabel =
    data.startDate && data.endDate
      ? `${dayjs(data.startDate).format('MMMM YYYY')} – ${dayjs(data.endDate).format('MMMM YYYY')}`
      : String(data.year);

  return (
    <article className="degree-container">
      <header className="resume-item-header">
        <h4 className="degree resume-item-title">{data.degree}</h4>
        <p className="daterange">{dateLabel}</p>
      </header>
      <p className="school resume-item-subtitle">
        <a href={data.link}>{data.school}</a>
      </p>
    </article>
  );
}
