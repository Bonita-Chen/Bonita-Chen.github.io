export interface BlogCollection {
  slug: string;
  label: string;
  emoji: string;
  description: string;
}

export const blogCollections: BlogCollection[] = [
  {
    slug: 'intern-diaries',
    label: 'Intern Diaries',
    emoji: '📓',
    description:
      'Lessons from internships, transitions, and early-career learning.',
  },
  {
    slug: 'data-notes',
    label: 'Data Notes',
    emoji: '📊',
    description:
      'Reflections on research workflows, dashboards, and analytical craft.',
  },
  {
    slug: 'living-notes',
    label: 'Living Notes',
    emoji: '🫐',
    description: 'Writing on balance, place, and the quieter side of ambition.',
  },
  {
    slug: 'public-health-equity',
    label: 'Public Health Equity',
    emoji: '🏥',
    description:
      'Projects and essays connected to health, fairness, and applied evidence.',
  },
];

export const blogTagLabels = {
  career: 'Career',
  life: 'Life',
  academics: 'Academics',
  tech: 'Tech',
  reflection: 'Reflection',
} as const;

export type BlogTag = keyof typeof blogTagLabels;
