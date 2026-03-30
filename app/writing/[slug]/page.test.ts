import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';

import { generateMetadata } from './page';

describe('writing alias metadata', () => {
  it('reuses the blogs canonical URL for posts', async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'goat-consulting-amazon-analytics' }),
    });

    expect(metadata.openGraph?.url).toBe(
      `${SITE_URL}/blogs/goat-consulting-amazon-analytics/`,
    );
  });
});
