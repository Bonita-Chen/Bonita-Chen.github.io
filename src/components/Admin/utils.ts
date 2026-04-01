import type { BlogCollection } from '@/data/blogs';
import type { Interest } from '@/data/interests';
import type { Post } from '@/lib/posts';

import type {
  EditableCard,
  EditableCollection,
  EditableInterest,
  EditablePost,
  EditableTag,
} from './types';

export const STORAGE_KEY = 'bonita-admin-studio-v1';

export function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match?.[1] || '.png';
}

export function splitAboutIntro(markdown: string) {
  return markdown
    .replace(/^# Intro\s*/u, '')
    .trim()
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function buildAboutMarkdown(paragraphs: string[]) {
  return `# Intro\n\n${paragraphs.join('\n\n')}\n`;
}

export function toSeedPosts(initialPosts: Post[]): EditablePost[] {
  return initialPosts.map((post) => ({
    id: post.slug,
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    tags: [...post.tags],
    collection: post.collection || '',
    image: post.image || '',
    icon: post.icon || '✦',
    featured: Boolean(post.featured),
    draft: Boolean(post.draft),
    content: post.content,
    coverAsset: null,
    inlineImages: [],
  }));
}

export function toSeedInterests(
  initialInterests: Interest[],
): EditableInterest[] {
  return initialInterests.map((interest) => ({
    id: interest.slug,
    slug: interest.slug,
    name: interest.name,
    icon: interest.icon,
    summary: interest.summary,
    trackLabel: interest.trackLabel,
    start: interest.start,
    accent: interest.accent,
    entries: interest.entries.map((entry) => ({
      ...entry,
      id: createId('interest-entry'),
      href: entry.href || '',
    })),
  }));
}

export function toSeedCollections(
  initialCollections: BlogCollection[],
): EditableCollection[] {
  return initialCollections.map((collection) => ({
    id: collection.slug,
    ...collection,
  }));
}

export function toSeedTags(
  initialTagLabels: Record<string, string>,
): EditableTag[] {
  return Object.entries(initialTagLabels).map(([slug, label]) => ({
    id: slug,
    slug,
    label,
  }));
}

export function toSeedCards(
  initialCards: ReadonlyArray<{
    title: string;
    emoji: string;
    description: string;
  }>,
): EditableCard[] {
  return initialCards.map((card, index) => ({
    id: `card-${index + 1}`,
    ...card,
  }));
}

export async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export function triggerDownload(
  filename: string,
  content: string,
  mimeType: string,
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function triggerDataUrlDownload(filename: string, dataUrl: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function yamlString(value: string) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function buildPostMarkdown(post: EditablePost) {
  const lines = [
    '---',
    `title: ${yamlString(post.title)}`,
    `date: ${yamlString(post.date)}`,
    `description: ${yamlString(post.description)}`,
  ];

  if (post.tags.length > 0) {
    lines.push('tags:');
    for (const tag of post.tags) {
      lines.push(`  - ${yamlString(tag)}`);
    }
  }

  if (post.collection) {
    lines.push(`collection: ${yamlString(post.collection)}`);
  }

  const coverPath = post.coverAsset?.suggestedPath || post.image;
  if (coverPath) {
    lines.push(`image: ${yamlString(coverPath)}`);
  }

  if (post.icon) {
    lines.push(`icon: ${yamlString(post.icon)}`);
  }

  if (post.featured) {
    lines.push('featured: true');
  }

  if (post.draft) {
    lines.push('draft: true');
  }

  lines.push('---', '', post.content.trim(), '');

  return lines.join('\n');
}

export function buildAboutModuleSource(
  paragraphs: string[],
  cards: EditableCard[],
  avatarPath: string,
) {
  const cardExports = cards.map(({ emoji, title, description }) => ({
    emoji,
    title,
    description,
  }));

  return `export const aboutMarkdown = ${JSON.stringify(buildAboutMarkdown(paragraphs))};\n\nexport const aboutCards = ${JSON.stringify(cardExports, null, 2)} as const;\n\nexport const aboutAvatarPath = ${JSON.stringify(avatarPath)};\n`;
}

export function buildBlogsDataSource(
  collections: EditableCollection[],
  tags: EditableTag[],
) {
  const collectionExports = collections.map(
    ({ slug, label, emoji, description }) => ({
      slug,
      label,
      emoji,
      description,
    }),
  );

  const tagObject = Object.fromEntries(
    tags.map((tag) => [tag.slug, tag.label]),
  );

  return `export interface BlogCollection {\n  slug: string;\n  label: string;\n  emoji: string;\n  description: string;\n}\n\nexport const blogCollections: BlogCollection[] = ${JSON.stringify(collectionExports, null, 2)};\n\nexport const blogTagLabels = ${JSON.stringify(tagObject, null, 2)} as const;\n\nexport type BlogTag = keyof typeof blogTagLabels;\n`;
}

export function buildInterestsDataSource(interests: EditableInterest[]) {
  const interestExports = interests.map((interest) => ({
    slug: interest.slug,
    name: interest.name,
    icon: interest.icon,
    summary: interest.summary,
    trackLabel: interest.trackLabel,
    start: interest.start,
    accent: interest.accent,
    entries: interest.entries.map(({ id: _id, href, ...entry }) => ({
      ...entry,
      ...(href ? { href } : {}),
    })),
  }));

  return `export interface InterestEntry {\n  type: 'Course' | 'Event' | 'Project' | 'Blog';\n  title: string;\n  description: string;\n  date: string;\n  tags: string[];\n  href?: string;\n}\n\nexport interface Interest {\n  slug: string;\n  name: string;\n  icon: string;\n  summary: string;\n  trackLabel: string;\n  start: string;\n  accent: string;\n  entries: InterestEntry[];\n}\n\nconst interests: Interest[] = ${JSON.stringify(interestExports, null, 2)};\n\nexport default interests;\n`;
}
