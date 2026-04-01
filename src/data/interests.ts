export interface InterestEntry {
  type: 'Course' | 'Event' | 'Project' | 'Blog';
  title: string;
  description: string;
  date: string;
  tags: string[];
  href?: string;
}

export interface Interest {
  slug: string;
  name: string;
  icon: string;
  summary: string;
  trackLabel: string;
  start: string;
  accent: string;
  entries: InterestEntry[];
}

const interests: Interest[] = [
  {
    slug: 'econ-writing',
    name: 'Econ Writing',
    icon: '✍️',
    summary:
      'Writing helps me test whether I truly understand an analysis, a result, or a professional lesson well enough to share it clearly.',
    trackLabel: 'Research & Writing',
    start: '2025-04-01',
    accent: '#223C5B',
    entries: [
      {
        type: 'Project',
        title: 'Senior Capstone Paper Competition',
        description:
          'Produced an empirical paper that earned second place in the Department of Economics undergraduate paper competition.',
        date: '2025-12-01',
        tags: ['Capstone', 'Economics', 'Award'],
      },
      {
        type: 'Event',
        title: 'College Fed Challenge 2025',
        description:
          'Connected GDP trend analysis, time-series reasoning, and policy communication in a judged presentation setting.',
        date: '2025-10-01',
        tags: ['Macroeconomics', 'Presentation', 'Forecasting'],
        href: '/projects/college-fed-challenge-gdp-projections/',
      },
      {
        type: 'Blog',
        title: 'Building Data Pipelines for 2.5M Records',
        description:
          'Turned the behind-the-scenes work of cleaning and standardizing administrative data into a readable public note.',
        date: '2026-02-28',
        tags: ['Blogs', 'Data Notes', 'Research'],
        href: '/blogs/building-data-pipelines-for-2-5m-records/',
      },
    ],
  },
  {
    slug: 'data-visualization',
    name: 'Data Visualization',
    icon: '📊',
    summary:
      'I like building visuals that make other people feel oriented quickly, especially when the underlying data is complicated.',
    trackLabel: 'Viz Journey',
    start: '2025-06-01',
    accent: '#43638C',
    entries: [
      {
        type: 'Project',
        title: 'Power BI Dashboards at Bio-Techne',
        description:
          'Designed AR dashboards that scaled from U.S. reporting to EMEA coverage and made self-serve monitoring easier.',
        date: '2025-08-01',
        tags: ['Power BI', 'DAX', 'Reporting'],
        href: '/projects/power-bi-ar-dashboards/',
      },
      {
        type: 'Project',
        title: 'BMI Equity Analysis Visuals',
        description:
          'Used R and ggplot2 to make public-health findings understandable in both competition and blog formats.',
        date: '2024-11-01',
        tags: ['R', 'ggplot2', 'Public Health'],
        href: '/blogs/redefining-bmi-standards-health-equity/',
      },
      {
        type: 'Blog',
        title: 'Power BI from Zero to EMEA',
        description:
          'Wrote about the challenge of scaling a dashboard beyond a single team or geography.',
        date: '2026-01-22',
        tags: ['Blogs', 'Dashboards', 'Career'],
        href: '/blogs/power-bi-emea-dashboards/',
      },
    ],
  },
];

export default interests;
