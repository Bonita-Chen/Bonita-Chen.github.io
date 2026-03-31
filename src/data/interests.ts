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
  targetMonths?: number;
  ongoing?: boolean;
  accent: string;
  entries: InterestEntry[];
}

const interests: Interest[] = [
  {
    slug: 'causal-inference',
    name: 'Causal Inference',
    icon: '📐',
    summary:
      'I’m drawn to methods that help explain not just what happened, but what might have happened otherwise.',
    trackLabel: 'Causal Methods',
    start: '2025-04-01',
    targetMonths: 12,
    accent: '#223C5B',
    entries: [
      {
        type: 'Course',
        title: 'Applied Causal Inference',
        description:
          'Studied difference-in-differences, IV, and design choices for real-world policy questions.',
        date: '2025-05-01',
        tags: ['DiD', 'IV', 'Applied Econ'],
      },
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
    targetMonths: 12,
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
  {
    slug: 'econ-writing',
    name: 'Econ Writing',
    icon: '✍️',
    summary:
      'Writing helps me test whether I truly understand an analysis, a result, or a professional lesson well enough to share it clearly.',
    trackLabel: 'Research & Writing',
    start: '2025-09-01',
    targetMonths: 9,
    accent: '#7189A5',
    entries: [
      {
        type: 'Project',
        title: 'Healthcare AI Adoption Working Notes',
        description:
          'Documented sources, timing rules, and research assumptions so future analysis stays interpretable and reproducible.',
        date: '2026-03-01',
        tags: ['Research', 'Documentation', 'Healthcare'],
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
      {
        type: 'Blog',
        title: 'Finding Balance: School, Work, and Self',
        description:
          'Used personal writing to think more honestly about pace, ambition, and sustainability.',
        date: '2026-02-10',
        tags: ['Reflection', 'Life', 'Writing'],
        href: '/blogs/finding-balance-school-work-self/',
      },
    ],
  },
  {
    slug: 'photography',
    name: 'Photography',
    icon: '📸',
    summary:
      'Photography is the non-spreadsheet version of attention for me: noticing light, texture, timing, and small changes in a place.',
    trackLabel: 'Creative Exploration',
    start: '2025-10-01',
    targetMonths: 12,
    accent: '#ADD1F3',
    entries: [
      {
        type: 'Blog',
        title: 'Minneapolis in Autumn — A Photo Diary',
        description:
          'Collected a few favorite views from around campus and the city during peak fall color.',
        date: '2025-10-30',
        tags: ['Photo Diary', 'Life', 'Minneapolis'],
        href: '/blogs/minneapolis-autumn-photo-diary/',
      },
      {
        type: 'Course',
        title: 'Composition and Lighting Self-Study',
        description:
          'Worked through framing, contrast, and post-processing basics with a more deliberate practice routine.',
        date: '2025-11-01',
        tags: ['Composition', 'Lighting', 'Practice'],
      },
    ],
  },
  {
    slug: 'fitness',
    name: 'Fitness',
    icon: '🏋️',
    summary:
      'Fitness is one of the main ways I keep energy and discipline steady when everything else gets busy.',
    trackLabel: 'Ongoing',
    start: '2025-01-01',
    ongoing: true,
    accent: '#DDE7F3',
    entries: [
      {
        type: 'Event',
        title: 'Consistent Training Routine',
        description:
          'Maintaining a regular mix of strength and cardio as an open-ended practice rather than a fixed-finish project.',
        date: '2026-03-01',
        tags: ['Routine', 'Health', 'Ongoing'],
      },
    ],
  },
];

export default interests;
