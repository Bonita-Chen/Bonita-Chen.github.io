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

/**
 * Category colors with pre-computed text contrast.
 * Uses CSS custom properties defined in tailwind.css for runtime styling,
 * with textColor pre-computed from the hex values for accessibility.
 *
 * Hex values from tailwind.css @theme block:
 * --color-skill-1: #6968b3, --color-skill-2: #37b1f5, --color-skill-3: #40494e
 * --color-skill-4: #515dd4, --color-skill-5: #e47272, --color-skill-6: #cc7b94
 */
const CATEGORY_COLORS: { color: string; textColor: 'dark' | 'light' }[] = [
  { color: 'var(--color-skill-1)', textColor: 'dark' },
  { color: 'var(--color-skill-2)', textColor: 'dark' },
  { color: 'var(--color-skill-3)', textColor: 'light' },
  { color: 'var(--color-skill-4)', textColor: 'light' },
  { color: 'var(--color-skill-5)', textColor: 'dark' },
  { color: 'var(--color-skill-6)', textColor: 'light' },
];

// Fallback colors for categories beyond the predefined set (with pre-computed contrast)
const FALLBACK_COLORS: { color: string; textColor: 'dark' | 'light' }[] = [
  { color: '#82b2e3', textColor: 'dark' },
  { color: '#516f91', textColor: 'light' },
  { color: '#d0e3f7', textColor: 'dark' },
  { color: '#6d89ab', textColor: 'light' },
  { color: '#304f75', textColor: 'light' },
];

/**
 * Build categories from skills with type-safe color assignment.
 * Logs a warning in development if there are more categories than colors.
 */
function buildCategories(skillsList: Skill[]): Category[] {
  const uniqueCategories = Array.from(
    new Set(skillsList.flatMap(({ category }) => category)),
  ).sort();

  const allColors = [...CATEGORY_COLORS, ...FALLBACK_COLORS];

  if (
    process.env.NODE_ENV === 'development' &&
    uniqueCategories.length > allColors.length
  ) {
    console.warn(
      `[skills.ts] Warning: ${uniqueCategories.length} categories but only ${allColors.length} colors defined`,
    );
  }

  return uniqueCategories.map((category, index) => {
    const colorConfig = allColors[index] ?? {
      color: '#888888',
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
