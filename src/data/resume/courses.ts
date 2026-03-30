export interface Course {
  title: string;
  number: string;
  link: string;
  university: string;
}

const courses: Course[] = [
  {
    title: 'Applied Econometrics',
    number: 'ECON',
    link: 'https://twin-cities.umn.edu/',
    university: 'UMN',
  },
  {
    title: 'Causal Inference for Applied Research',
    number: 'ECON',
    link: 'https://twin-cities.umn.edu/',
    university: 'UMN',
  },
  {
    title: 'Time Series and Forecasting',
    number: 'ECON',
    link: 'https://twin-cities.umn.edu/',
    university: 'UMN',
  },
  {
    title: 'Probability and Statistical Inference',
    number: 'STAT',
    link: 'https://twin-cities.umn.edu/',
    university: 'UMN',
  },
  {
    title: 'Regression and Data Analysis',
    number: 'STAT',
    link: 'https://twin-cities.umn.edu/',
    university: 'UMN',
  },
  {
    title: 'Public Health Data Challenge Studio',
    number: 'SPH',
    link: 'https://twin-cities.umn.edu/',
    university: 'UMN',
  },
  {
    title: 'Corporate Finance and Valuation',
    number: 'FINA',
    link: 'https://twin-cities.umn.edu/',
    university: 'UMN',
  },
  {
    title: 'Business Communication for Analytics',
    number: 'BA',
    link: 'https://twin-cities.umn.edu/',
    university: 'UMN',
  },
];

export default courses;
