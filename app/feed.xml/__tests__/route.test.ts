import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';

import { GET } from '../route';

describe('feed.xml route', () => {
  it('uses canonical trailing-slash links for blog pages', async () => {
    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain(`${SITE_URL}/blogs/`);
    expect(xml).toContain(
      `${SITE_URL}/blogs/goat-consulting-amazon-analytics/`,
    );
    expect(xml).toContain(
      `${SITE_URL}/blogs/building-data-pipelines-for-2-5m-records/`,
    );
    expect(xml).toContain(
      `${SITE_URL}/blogs/finding-balance-school-work-self/`,
    );
  });

  it('keeps the feed self link file-like', async () => {
    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain(`${SITE_URL}/feed.xml`);
    expect(xml).not.toContain(`${SITE_URL}/feed.xml/`);
  });
});
