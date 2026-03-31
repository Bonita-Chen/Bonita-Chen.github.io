export interface BlogCollection {
  slug: string;
  label: string;
  emoji: string;
  description: string;
}

export const blogCollections: BlogCollection[] = [];

export const blogTagLabels = {
  work: '💼 Work',
  academics: '📚 Academics',
  life: '🫐 Life',
  other: '✦ Other',
} as const;

export type BlogTag = keyof typeof blogTagLabels;
