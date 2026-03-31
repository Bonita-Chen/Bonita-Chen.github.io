import type { Metadata } from 'next';

import BlogIndex from '@/components/Blogs/BlogIndex';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = createPageMetadata({
  title: 'Blogs',
  description:
    'Blogs by Baojia Chen on work, academics, life, and everything around them.',
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
            Writing on work, academics, life, and the ideas around them.
          </p>
        </header>

        <div className="fade-in stagger-1">
          <BlogIndex posts={posts} />
        </div>
      </article>
    </PageWrapper>
  );
}
