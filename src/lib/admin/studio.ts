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

export type EditableInterestEntry = {
  id: string;
  type: 'Course' | 'Event' | 'Project' | 'Blog';
  title: string;
  description: string;
  date: string;
  tags: string[];
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
  targetMonths?: number;
  ongoing: boolean;
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

export type AdminSavePayload = {
  aboutParagraphs: string[];
  aboutCards: EditableCard[];
  collections: EditableCollection[];
  tags: EditableTag[];
  posts: EditablePost[];
  interests: EditableInterest[];
  avatarDraft: AvatarDraft;
  avatarPath: string;
  originalPostSlugs: string[];
};

export const FIXED_AVATAR_OUTPUT_PATH = '/images/portrait-baojia.png';

function buildAboutMarkdown(paragraphs: string[]) {
  return `# Intro\n\n${paragraphs.join('\n\n')}\n`;
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
    ...(interest.targetMonths ? { targetMonths: interest.targetMonths } : {}),
    ...(interest.ongoing ? { ongoing: true } : {}),
    accent: interest.accent,
    entries: interest.entries.map(({ id: _id, href, ...entry }) => ({
      ...entry,
      ...(href ? { href } : {}),
    })),
  }));

  return `export interface InterestEntry {\n  type: 'Course' | 'Event' | 'Project' | 'Blog';\n  title: string;\n  description: string;\n  date: string;\n  tags: string[];\n  href?: string;\n}\n\nexport interface Interest {\n  slug: string;\n  name: string;\n  icon: string;\n  summary: string;\n  trackLabel: string;\n  start: string;\n  targetMonths?: number;\n  ongoing?: boolean;\n  accent: string;\n  entries: InterestEntry[];\n}\n\nconst interests: Interest[] = ${JSON.stringify(interestExports, null, 2)};\n\nexport default interests;\n`;
}
