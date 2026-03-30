import type { Metadata } from 'next';

import BlogIndex from '@/components/Blogs/BlogIndex';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = createPageMetadata({
  title: 'Blogs',
  description:
    'Blogs by Baojia Chen on career, life, academics, and data-driven work.',
  path: '/blogs/',
});

export default function BlogsPage() {
  const posts = getAllPosts();

  return (
    <PageWrapper mainClassName="page-main--wide">
      <article className="blogs-page">
        <header className="blogs-header fade-in">
          <h1 className="page-title">Blogs</h1>
          <p className="page-subtitle">
            Writing on career, life, academics, and the systems behind the work.
          </p>
        </header>

        <div className="fade-in stagger-1">
          <BlogIndex posts={posts} />
        </div>
      </article>
    </PageWrapper>
  );
}
