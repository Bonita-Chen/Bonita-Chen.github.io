import Markdown from 'markdown-to-jsx';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleSchema } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { blogTagLabels } from '@/data/blogs';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';
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

  return (
    <PageWrapper>
      <ArticleSchema post={post} />
      <article className="post-page">
        <header className="post-header">
          <Link href="/blogs" className="post-back-link">
            ← Back to Blogs
          </Link>
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
      </article>
    </PageWrapper>
  );
}
