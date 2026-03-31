export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
  startDate?: string;
  endDate?: string;
}

const degrees: Degree[] = [
  {
    school: 'University of Minnesota, Twin Cities',
    degree: 'B.S. Economics, Minor in Statistics (GPA: 3.85 / 4.0)',
    link: 'https://twin-cities.umn.edu/',
    year: 2026,
    startDate: '2024-09-01',
    endDate: '2026-05-01',
  },
];

export default degrees;
