import { describe, expect, it } from 'vitest';

import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';
import { metadata as aboutMetadata } from '../about/page';
import { metadata as adminMetadata } from '../admin/page';
import { metadata as blogsMetadata } from '../blogs/page';
import { metadata as contactMetadata } from '../contact/page';
import { metadata as interestsMetadata } from '../interests/page';
import { metadata as notFoundMetadata } from '../not-found';
import { metadata as projectsMetadata } from '../projects/page';
import { metadata as resumeMetadata } from '../resume/page';

describe('page metadata', () => {
  it.each([
    ['about', aboutMetadata, `${SITE_URL}/about/`],
    ['admin', adminMetadata, `${SITE_URL}/admin/`],
    ['blogs', blogsMetadata, `${SITE_URL}/blogs/`],
    ['contact', contactMetadata, `${SITE_URL}/contact/`],
    ['interests', interestsMetadata, `${SITE_URL}/interests/`],
    ['projects', projectsMetadata, `${SITE_URL}/projects/`],
    ['resume', resumeMetadata, `${SITE_URL}/resume/`],
  ])('sets page-specific open graph metadata for %s', (_, metadata, url) => {
    expect(metadata.openGraph?.url).toBe(url);
    expect(metadata.openGraph?.description).toBe(metadata.description);
    expect(metadata.openGraph?.title).toBe(
      `${metadata.title} | ${AUTHOR_NAME}`,
    );
  });

  it.each([
    ['about', aboutMetadata],
    ['admin', adminMetadata],
    ['blogs', blogsMetadata],
    ['contact', contactMetadata],
    ['interests', interestsMetadata],
    ['projects', projectsMetadata],
    ['resume', resumeMetadata],
  ])('sets page-specific twitter metadata for %s', (_, metadata) => {
    expect(metadata.twitter?.description).toBe(metadata.description);
    expect(metadata.twitter?.title).toBe(`${metadata.title} | ${AUTHOR_NAME}`);
  });

  it('overrides 404 share metadata without inventing a canonical url', () => {
    expect(notFoundMetadata.openGraph?.url).toBeUndefined();
    expect(notFoundMetadata.openGraph?.description).toBe(
      notFoundMetadata.description,
    );
    expect(notFoundMetadata.openGraph?.title).toBe(
      `${notFoundMetadata.title} | ${AUTHOR_NAME}`,
    );
    expect(notFoundMetadata.twitter?.description).toBe(
      notFoundMetadata.description,
    );
    expect(notFoundMetadata.twitter?.title).toBe(
      `${notFoundMetadata.title} | ${AUTHOR_NAME}`,
    );
  });

  it('does not expose an rss alternate for blogs', () => {
    expect(blogsMetadata.alternates).toBeUndefined();
  });
});
