import packageJson from '../../package.json';

function extractRepoSlug(repositoryUrl?: string) {
  if (!repositoryUrl) {
    return '';
  }

  const cleaned = repositoryUrl
    .replace(/^git\+/, '')
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/\.git$/, '');

  const match = cleaned.match(/github\.com\/([^/]+\/[^/]+)$/);
  return match?.[1] || '';
}

const repositoryUrl =
  typeof packageJson.repository === 'string'
    ? packageJson.repository
    : packageJson.repository?.url;

export const repoBranch =
  process.env.NEXT_PUBLIC_GITHUB_REPO_BRANCH?.trim() || 'main';

export const githubRepoSlug =
  process.env.NEXT_PUBLIC_GITHUB_REPO_SLUG?.trim() ||
  process.env.GITHUB_REPOSITORY?.trim() ||
  extractRepoSlug(repositoryUrl);

export const githubRepoWriteToken =
  process.env.GITHUB_REPO_WRITE_TOKEN?.trim() || '';

export const adminAllowedLogins = (
  process.env.GITHUB_ADMIN_LOGINS?.split(',') || []
)
  .map((login) => login.trim().toLowerCase())
  .filter(Boolean);

export const onlineAdminSaveConfigured = Boolean(
  githubRepoSlug &&
    githubRepoWriteToken &&
    process.env.AUTH_SECRET?.trim() &&
    process.env.AUTH_GITHUB_ID?.trim() &&
    process.env.AUTH_GITHUB_SECRET?.trim(),
);

export const editableFiles = [
  {
    title: 'Homepage Hero',
    description: 'Hero intro, homepage chips, and primary call-to-action text.',
    path: 'src/components/Template/Hero.tsx',
  },
  {
    title: 'About',
    description: 'Bio, narrative sections, and personal notes.',
    path: 'src/data/about.ts',
  },
  {
    title: 'Resume Experience',
    description: 'Internships, research, and work highlights.',
    path: 'src/data/resume/work.ts',
  },
  {
    title: 'Education & Skills',
    description: 'Education, selected courses, and skill tags.',
    path: 'src/data/resume/skills.ts',
  },
  {
    title: 'Courses',
    description: 'Selected coursework shown on the resume page.',
    path: 'src/data/resume/courses.ts',
  },
  {
    title: 'Projects',
    description: 'Project cards and descriptions shown on the site.',
    path: 'src/data/projects.ts',
  },
  {
    title: 'Interests Timeline',
    description: 'Interest tracks, progress durations, and related milestones.',
    path: 'src/data/interests.ts',
  },
  {
    title: 'Contact Links',
    description: 'LinkedIn, email, and other contact destinations.',
    path: 'src/data/contact.ts',
  },
  {
    title: 'Footer & Copyright',
    description: 'Footer wording, credits, and persistent site links.',
    path: 'src/components/Template/Footer.tsx',
  },
  {
    title: 'Blogs',
    description: 'Markdown posts under the blog content folder.',
    path: 'content/blogs/',
  },
] as const;
