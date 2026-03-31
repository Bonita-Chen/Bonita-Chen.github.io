import Markdown from 'markdown-to-jsx';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleSchema } from '@/components/Schema';
import BackLink from '@/components/Template/BackLink';
import PageWrapper from '@/components/Template/PageWrapper';
import { blogTagLabels } from '@/data/blogs';
import { getAllPosts, getPostBySlug, getPostSlugs } from '@/lib/posts';
import { AUTHOR_NAME, formatDate, PORTRAIT_IMAGE, SITE_URL } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `${SITE_URL}/blogs/${post.slug}/`;

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      authors: [AUTHOR_NAME],
      images: [
        {
          url: post.image || PORTRAIT_IMAGE,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image || PORTRAIT_IMAGE],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <PageWrapper>
      <ArticleSchema post={post} />
      <article className="post-page">
        <header className="post-header">
          <BackLink
            defaultHref="/blogs"
            defaultLabel={'\u2190 Back to Blogs'}
            className="post-back-link"
          />
          <div className="post-date-row">
            <time className="post-date" dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          </div>
          <h1 className="post-title">{post.title}</h1>
          <p className="post-description">{post.description}</p>
          {post.tags.length > 0 ? (
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span className="blog-badge" key={tag}>
                  {blogTagLabels[tag as keyof typeof blogTagLabels] || tag}
                </span>
              ))}
            </div>
          ) : null}
          {post.image ? (
            <div className="post-cover">
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={720}
                priority
              />
            </div>
          ) : null}
        </header>
        <div className="post-content prose">
          <Markdown
            options={{
              overrides: {
                img: {
                  component: ({ alt, src }: { alt?: string; src?: string }) => (
                    <Image
                      src={src || ''}
                      alt={alt || ''}
                      width={1200}
                      height={720}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: 'auto',
                      }}
                    />
                  ),
                },
              },
            }}
          >
            {post.content}
          </Markdown>
        </div>

        <nav className="post-nav" aria-label="Post navigation">
          {prevPost ? (
            <Link
              href={`/blogs/${prevPost.slug}`}
              className="post-nav-link post-nav-link--prev"
            >
              <span className="post-nav-label">&larr; Previous</span>
              <span className="post-nav-title">{prevPost.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextPost ? (
            <Link
              href={`/blogs/${nextPost.slug}`}
              className="post-nav-link post-nav-link--next"
            >
              <span className="post-nav-label">Next &rarr;</span>
              <span className="post-nav-title">{nextPost.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </PageWrapper>
  );
}
