import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

export interface PostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags?: string[] | string;
  collection?: string;
  image?: string;
  icon?: string;
  featured?: boolean;
  draft?: boolean;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  collection?: string;
  image?: string;
  icon?: string;
  featured?: boolean;
  content: string;
  draft?: boolean;
}

const postsDirectory = path.join(process.cwd(), 'content/blogs');

function normalizeTags(tags: PostFrontmatter['tags']): string[] {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean);
  }

  if (typeof tags === 'string') {
    return [tags.trim().toLowerCase()].filter(Boolean);
  }

  return [];
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const frontmatter = data as PostFrontmatter;

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.description,
    tags: normalizeTags(frontmatter.tags),
    collection: frontmatter.collection,
    image: frontmatter.image,
    icon: frontmatter.icon,
    featured: frontmatter.featured,
    content,
    draft: frontmatter.draft,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .filter((post) => !post.draft || process.env.NODE_ENV === 'development')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}
