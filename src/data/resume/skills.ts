export interface Skill {
  title: string;
  competency: number;
  category: string[];
}

export interface Category {
  name: string;
  color: string;
  /** Pre-computed text color for contrast - 'dark' for light backgrounds, 'light' for dark */
  textColor: 'dark' | 'light';
}

const skills: Skill[] = [
  {
    title: 'Python',
    competency: 5,
    category: ['Programming', 'Research'],
  },
  {
    title: 'R',
    competency: 4,
    category: ['Programming', 'Research'],
  },
  {
    title: 'Stata',
    competency: 4,
    category: ['Programming', 'Research'],
  },
  {
    title: 'Julia',
    competency: 3,
    category: ['Programming'],
  },
  {
    title: 'SQL',
    competency: 3,
    category: ['Programming', 'Analytics'],
  },
  {
    title: 'Git',
    competency: 4,
    category: ['Programming'],
  },
  {
    title: 'Power BI',
    competency: 5,
    category: ['Analytics', 'Visualization'],
  },
  {
    title: 'DAX',
    competency: 4,
    category: ['Analytics', 'Visualization'],
  },
  {
    title: 'Dashboard Design',
    competency: 4,
    category: ['Visualization'],
  },
  {
    title: 'ggplot2',
    competency: 4,
    category: ['Visualization', 'Research'],
  },
  {
    title: 'Matplotlib',
    competency: 4,
    category: ['Visualization'],
  },
  {
    title: 'Pandas',
    competency: 5,
    category: ['Programming', 'Analytics'],
  },
  {
    title: 'Data Cleaning',
    competency: 5,
    category: ['Analytics', 'Research'],
  },
  {
    title: 'Entity Resolution',
    competency: 4,
    category: ['Analytics', 'Research'],
  },
  {
    title: 'Causal Inference',
    competency: 4,
    category: ['Research'],
  },
  {
    title: 'Time Series Analysis',
    competency: 4,
    category: ['Research'],
  },
  {
    title: 'Financial Statement Analysis',
    competency: 3,
    category: ['Business'],
  },
  {
    title: 'Market Research',
    competency: 4,
    category: ['Business'],
  },
  {
    title: 'Presentation Design',
    competency: 4,
    category: ['Business', 'Visualization'],
  },
  {
    title: 'LaTeX',
    competency: 4,
    category: ['Programming'],
  },
].map((skill) => ({ ...skill, category: skill.category.sort() }));

const CATEGORY_CONFIG: Record<
  string,
  { color: string; textColor: 'dark' | 'light' }
> = {
  Analytics: { color: 'var(--color-skill-4)', textColor: 'light' },
  Business: { color: 'var(--color-skill-3)', textColor: 'light' },
  Programming: { color: 'var(--color-skill-6)', textColor: 'light' },
  Research: { color: 'var(--color-skill-4)', textColor: 'light' },
  Visualization: { color: 'var(--color-skill-3)', textColor: 'light' },
};

// Fallback colors for categories beyond the predefined set (with pre-computed contrast)
const FALLBACK_COLORS: { color: string; textColor: 'dark' | 'light' }[] = [
  { color: '#88a6c8', textColor: 'dark' },
  { color: '#5d7797', textColor: 'light' },
  { color: '#9bb6d3', textColor: 'dark' },
  { color: '#43638c', textColor: 'light' },
  { color: '#223c5b', textColor: 'light' },
];

/**
 * Build categories from skills with type-safe color assignment.
 * Logs a warning in development if there are more categories than colors.
 */
function buildCategories(skillsList: Skill[]): Category[] {
  const uniqueCategories = Array.from(
    new Set(skillsList.flatMap(({ category }) => category)),
  ).sort();
  let fallbackIndex = 0;

  if (
    process.env.NODE_ENV === 'development' &&
    uniqueCategories.length >
      Object.keys(CATEGORY_CONFIG).length + FALLBACK_COLORS.length
  ) {
    console.warn(
      `[skills.ts] Warning: ${uniqueCategories.length} categories but only ${
        Object.keys(CATEGORY_CONFIG).length + FALLBACK_COLORS.length
      } colors defined`,
    );
  }

  return uniqueCategories.map((category) => {
    const colorConfig = CATEGORY_CONFIG[category] ??
      FALLBACK_COLORS[fallbackIndex++] ?? {
        color: '#5d7797',
        textColor: 'light' as const,
      };
    return {
      name: category,
      color: colorConfig.color,
      textColor: colorConfig.textColor,
    };
  });
}

const categories: Category[] = buildCategories(skills);

export { categories, skills };
