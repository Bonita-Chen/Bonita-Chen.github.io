import type { Degree as DegreeType } from '@/data/resume/degrees';

interface DegreeProps {
  data: DegreeType;
}

export default function Degree({ data }: DegreeProps) {
  return (
    <article className="degree-container">
      <header className="resume-item-header">
        <h4 className="degree resume-item-title">{data.degree}</h4>
        <p className="resume-item-date">
          <time dateTime={String(data.year)}>{data.year}</time>
        </p>
      </header>
      <p className="school resume-item-subtitle">
        <a href={data.link}>{data.school}</a>
      </p>
    </article>
  );
}
