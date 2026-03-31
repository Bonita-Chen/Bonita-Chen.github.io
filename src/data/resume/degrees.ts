export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
  startDate?: string;
  endDate?: string;
  subtitleSuffix?: string;
  description?: string;
  achievements?: string[];
}

const degrees: Degree[] = [
  {
    school: 'University of Minnesota, Twin Cities',
    degree: 'B.S. Economics & Minor in Statistics',
    link: 'https://twin-cities.umn.edu/',
    year: 2026,
    startDate: '2024-09-01',
    endDate: '2026-05-01',
    subtitleSuffix: 'GPA: 3.85 / 4.0',
    achievements: [
      "Dean's List (Fall '24 & Spring '25)",
      'Edward G. Clark Jr. Scholarship ($2,000)',
      'Mooty Internship Scholarship ($500)',
      'Department of Economics Paper Competition — 2nd Place, Senior Capstone Award ($500)',
    ],
  },
];

export default degrees;
