import { describe, expect, it } from 'vitest';

import { aboutAvatarPath, aboutMarkdown } from '../about';

describe('about data', () => {
  it('exports aboutMarkdown as a string', () => {
    expect(typeof aboutMarkdown).toBe('string');
    expect(aboutMarkdown.length).toBeGreaterThan(0);
  });

  it('contains the intro section', () => {
    expect(aboutMarkdown).toContain('# Intro');
    expect(aboutMarkdown).toContain('University of Minnesota');
    expect(aboutMarkdown).toContain('graduating May 2026');
  });

  it('contains the updated builder-pattern intro', () => {
    expect(aboutMarkdown).toContain('messy or inefficient problem');
    expect(aboutMarkdown).toContain('Goat Consulting');
    expect(aboutMarkdown).toContain('Heller-Hurwicz Economics Institute');
    expect(aboutMarkdown).toContain('Bio-Techne');
  });

  it('contains no additional section headings', () => {
    const headerRegex = /^#+ .+$/gm;
    const headers = aboutMarkdown.match(headerRegex);

    expect(headers).not.toBeNull();
    expect(headers).toEqual(['# Intro']);
  });

  it('exports the current about avatar path', () => {
    expect(aboutAvatarPath).toBe('/images/me.jpg');
  });
});
