import type { Course as CourseType } from '@/data/resume/courses';

import Course from './Courses/Course';

interface CoursesProps {
  data: CourseType[];
}

function getRows(courses: CourseType[]) {
  return [...courses]
    .sort((a, b) => {
      const uni = a.university.localeCompare(b.university);
      if (uni !== 0) return uni;
      return a.number.localeCompare(b.number);
    })
    .map((course) => (
      <Course
        data={course}
        key={`${course.university}-${course.number}-${course.title}`}
      />
    ));
}

export default function Courses({ data }: CoursesProps) {
  return (
    <div className="courses">
      <div className="link-to" id="courses" />
      <div className="title">
        <h3>Selected Courses</h3>
      </div>
      <ul className="course-list">{getRows(data)}</ul>
    </div>
  );
}
