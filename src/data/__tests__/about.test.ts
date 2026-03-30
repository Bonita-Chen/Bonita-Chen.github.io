import { describe, expect, it } from 'vitest';

import { aboutAvatarPath, aboutMarkdown } from '../about';

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('contains the intro section', () => {
    expect(aboutMarkdown).toContain('# Intro');
    expect(aboutMarkdown).toContain('University of Minnesota, Twin Cities');
    expect(aboutMarkdown).toContain('Heller-Hurwicz Economics Institute');
    expect(aboutMarkdown).toContain('Goat Consulting');
  });

  it('contains the simplified three-paragraph intro', () => {
    expect(aboutMarkdown).toContain(
      'intersection of data, policy, and human behavior',
    );
    expect(aboutMarkdown).toContain('~2.5M records');
    expect(aboutMarkdown).toContain('photography, exploring new cities');
  });

  it('contains valid markdown links', () => {
    // Check for markdown link format [text](url)
    const linkRegex = /\[.+?\]\(.+?\)/g;
    const links = aboutMarkdown.match(linkRegex);

    expect(links).not.toBeNull();
    expect(links!.length).toBeGreaterThan(2);
  });

  it('contains the expected single intro header', () => {
    // Check for markdown headers
    const headerRegex = /^#+ .+$/gm;
    const headers = aboutMarkdown.match(headerRegex);

    expect(headers).not.toBeNull();
    expect(headers).toEqual(['# Intro']);
  });

  it('exports the current about avatar path', () => {
    expect(aboutAvatarPath).toBe('/images/portrait-baojia.svg');
  });
});
