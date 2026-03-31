import type { Metadata } from 'next';

import AdminStudio from '@/components/Admin/AdminStudio';
import PageWrapper from '@/components/Template/PageWrapper';
import { aboutCards, aboutMarkdown } from '@/data/about';
import { editableFiles, githubRepoSlug, repoBranch } from '@/data/admin';
import { blogCollections, blogTagLabels } from '@/data/blogs';
import interests from '@/data/interests';
import { createPageMetadata } from '@/lib/metadata';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = createPageMetadata({
  title: 'Admin',
  description:
    'Visual admin studio for Bonita Chen’s personal site, including avatar crop, blog editing, and interests timeline updates.',
  path: '/admin/',
});

export default function AdminPage() {
  const posts = getAllPosts();

  return (
    <PageWrapper mainClassName="page-main--wide">
      <section className="admin-page">
        <header className="admin-header">
          <h1 className="page-title">Admin</h1>
          <p className="page-subtitle">
            A visual editing studio that stays faithful to the site design while
            keeping the workflow safe for static GitHub Pages.
          </p>
        </header>

        <AdminStudio
          initialAboutMarkdown={aboutMarkdown}
          initialAboutCards={aboutCards}
          initialPosts={posts}
          initialCollections={blogCollections}
          initialTagLabels={blogTagLabels}
          initialInterests={interests}
          editableFiles={editableFiles}
          githubRepoSlug={githubRepoSlug}
          repoBranch={repoBranch}
        />
      </section>
    </PageWrapper>
  );
}
