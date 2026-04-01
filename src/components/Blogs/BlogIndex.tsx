'use client';

import Image from 'next/image';
import Link from 'next/link';

import { blogTagLabels } from '@/data/blogs';
import { useFilterToggle } from '@/hooks/useFilterToggle';
import type { Post } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

interface BlogIndexProps {
  posts: Post[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  const { active: activeTag, toggle, isActive } = useFilterToggle('all');

  const availableTags = Object.keys(blogTagLabels).filter((tag) =>
    posts.some((post) => post.tags.includes(tag)),
  );

  const filteredPosts = posts.filter((post) => {
    const tagMatch = activeTag === 'all' || post.tags.includes(activeTag);
    return tagMatch;
  });

  return (
    <div className="blogs-shell">
      <div className="blogs-tags" role="tablist" aria-label="Blog tags">
        <button
          type="button"
          className={`blogs-filter ${isActive('all') ? 'active' : ''}`}
          onClick={() => toggle('all')}
        >
          All
        </button>
        {availableTags.map((tag) => (
          <button
            type="button"
            key={tag}
            className={`blogs-filter ${isActive(tag) ? 'active' : ''}`}
            onClick={() => toggle(tag)}
          >
            {blogTagLabels[tag as keyof typeof blogTagLabels]}
          </button>
        ))}
      </div>

      <div className="blogs-list">
        {filteredPosts.map((post) => {
          return (
            <Link
              href={`/blogs/${post.slug}`}
              className="blog-item"
              key={post.slug}
            >
              <div className="blog-item-inner">
                <div className="blog-thumb">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={220}
                      height={150}
                      sizes="(max-width: 736px) 100vw, 220px"
                    />
                  ) : (
                    <div className="blog-thumb-placeholder" aria-hidden="true">
                      {post.icon || '✦'}
                    </div>
                  )}
                </div>

                <div className="blog-body">
                  <div className="blog-meta">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    {post.tags.map((tag) => (
                      <span className="blog-tag-inline" key={tag}>
                        {blogTagLabels[tag as keyof typeof blogTagLabels] ||
                          tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="blog-title">{post.title}</h2>
                  <p className="blog-desc">{post.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="blogs-empty">
          No posts match this combination yet. Try another tag or collection.
        </div>
      ) : null}
    </div>
  );
}
