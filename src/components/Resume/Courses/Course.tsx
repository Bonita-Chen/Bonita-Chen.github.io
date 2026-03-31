import type { Course as CourseType } from '@/data/resume/courses';

interface CourseProps {
  data: CourseType;
}

export default function Course({ data }: CourseProps) {
  return (
    <li className="course-container">
      <div className="course-card">
        <h4 className="course-number">{data.number}:</h4>
        <p className="course-name">{data.title}</p>
      </div>
    </li>
  );
}
