'use client';

import Image from 'next/image';
import Link from 'next/link';
import { startTransition, useState } from 'react';

import { blogCollections, blogTagLabels } from '@/data/blogs';
import type { Post } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

interface BlogIndexProps {
  posts: Post[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  const [activeCollection, setActiveCollection] = useState('all');
  const [activeTag, setActiveTag] = useState('all');

  const collectionCounts = Object.fromEntries(
    blogCollections.map((collection) => [
      collection.slug,
      posts.filter((post) => post.collection === collection.slug).length,
    ]),
  );

  const availableTags = Object.keys(blogTagLabels).filter((tag) =>
    posts.some((post) => post.tags.includes(tag)),
  );

  const filteredPosts = posts.filter((post) => {
    const collectionMatch =
      activeCollection === 'all' || post.collection === activeCollection;
    const tagMatch = activeTag === 'all' || post.tags.includes(activeTag);
    return collectionMatch && tagMatch;
  });

  return (
    <div className="blogs-shell">
      <div
        className="blogs-collections"
        role="tablist"
        aria-label="Blog collections"
      >
        <button
          type="button"
          className={`blogs-chip ${activeCollection === 'all' ? 'active' : ''}`}
          onClick={() => startTransition(() => setActiveCollection('all'))}
        >
          All Posts
          <span className="blogs-chip-count">{posts.length}</span>
        </button>
        {blogCollections.map((collection) => (
          <button
            type="button"
            key={collection.slug}
            className={`blogs-chip ${activeCollection === collection.slug ? 'active' : ''}`}
            onClick={() =>
              startTransition(() => setActiveCollection(collection.slug))
            }
            title={collection.description}
          >
            <span aria-hidden="true">{collection.emoji}</span>
            {collection.label}
            <span className="blogs-chip-count">
              {collectionCounts[collection.slug] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="blogs-tags" role="tablist" aria-label="Blog tags">
        <button
          type="button"
          className={`blogs-filter ${activeTag === 'all' ? 'active' : ''}`}
          onClick={() => startTransition(() => setActiveTag('all'))}
        >
          All
        </button>
        {availableTags.map((tag) => (
          <button
            type="button"
            key={tag}
            className={`blogs-filter ${activeTag === tag ? 'active' : ''}`}
            onClick={() => startTransition(() => setActiveTag(tag))}
          >
            {blogTagLabels[tag as keyof typeof blogTagLabels]}
          </button>
        ))}
      </div>

      <div className="blogs-list">
        {filteredPosts.map((post) => {
          const collection = blogCollections.find(
            (item) => item.slug === post.collection,
          );

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
                        {blogTagLabels[tag as keyof typeof blogTagLabels] || tag}
                      </span>
                    ))}
                    {collection ? (
                      <span className="blog-collection-badge">
                        {collection.label}
                      </span>
                    ) : null}
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
