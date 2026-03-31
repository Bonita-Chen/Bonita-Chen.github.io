import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

export interface ProjectFrontmatter {
  title: string;
  subtitle?: string;
  date: string;
  description: string;
  tech?: string[];
  featured?: boolean;
  emoji?: string;
  link?: string;
  image?: string;
  images?: string[];
  pdf?: string;
}

export interface ProjectDetail {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  description: string;
  tech: string[];
  featured?: boolean;
  emoji?: string;
  link?: string;
  image?: string;
  images: string[];
  pdf?: string;
  content: string;
}

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export function getProjectSlugs(): string[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(projectsDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

export function getProjectBySlug(slug: string): ProjectDetail | null {
  const fullPath = path.join(projectsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const fm = data as ProjectFrontmatter;

  return {
    slug,
    title: fm.title,
    subtitle: fm.subtitle,
    date: fm.date,
    description: fm.description,
    tech: fm.tech ?? [],
    featured: fm.featured,
    emoji: fm.emoji,
    link: fm.link,
    image: fm.image,
    images: fm.images ?? [],
    pdf: fm.pdf,
    content,
  };
}

export function getAllProjects(): ProjectDetail[] {
  const slugs = getProjectSlugs();
  return slugs
    .map((slug) => getProjectBySlug(slug))
    .filter((p): p is ProjectDetail => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
