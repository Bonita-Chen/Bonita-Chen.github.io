import type { InterestEntry } from '@/data/interests';

export type EditableFileLink = {
  title: string;
  description: string;
  path: string;
};

export type EditableCard = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

export type EditableTag = {
  id: string;
  slug: string;
  label: string;
};

export type EditableCollection = {
  id: string;
  slug: string;
  label: string;
  emoji: string;
  description: string;
};

export type EditableAsset = {
  id: string;
  name: string;
  alt: string;
  mimeType: string;
  preview: string;
  suggestedPath: string;
};

export type EditablePost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  collection: string;
  image: string;
  icon: string;
  featured: boolean;
  draft: boolean;
  content: string;
  coverAsset: EditableAsset | null;
  inlineImages: EditableAsset[];
};

export type EditableInterestEntry = InterestEntry & {
  id: string;
  href: string;
};

export type EditableInterest = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  summary: string;
  trackLabel: string;
  start: string;
  accent: string;
  entries: EditableInterestEntry[];
};

export type AvatarDraft = {
  source: string;
  output: string;
  fileName: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
};

export type AdminTab = 'about' | 'blogs' | 'interests' | 'handoff';
