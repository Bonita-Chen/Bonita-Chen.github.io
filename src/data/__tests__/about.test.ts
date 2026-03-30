import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '../about';

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

  it('contains the right now section', () => {
    expect(aboutMarkdown).toContain('# Right Now');
    expect(aboutMarkdown).toContain('2.5 million administrative records');
  });

  it('contains the values section', () => {
    expect(aboutMarkdown).toContain('# What I Care About');
    expect(aboutMarkdown).toContain('Thoughtful ambition');
  });

  it('contains the outside-the-resume section', () => {
    expect(aboutMarkdown).toContain('# Outside the Resume');
    expect(aboutMarkdown).toContain('Photography');
    expect(aboutMarkdown).toContain('Minneapolis');
  });

  it('contains the blueberry notes section', () => {
    expect(aboutMarkdown).toContain('# Blueberry Notes');
    expect(aboutMarkdown).toContain('blueberry emoji');
  });

  it('contains the looking ahead section', () => {
    expect(aboutMarkdown).toContain('# Looking Ahead');
    expect(aboutMarkdown).toContain('research teams');
  });

  it('contains valid markdown links', () => {
    // Check for markdown link format [text](url)
    const linkRegex = /\[.+?\]\(.+?\)/g;
    const links = aboutMarkdown.match(linkRegex);

    expect(links).not.toBeNull();
    expect(links!.length).toBeGreaterThan(2);
  });

  it('contains properly formatted headers', () => {
    // Check for markdown headers
    const headerRegex = /^#+ .+$/gm;
    const headers = aboutMarkdown.match(headerRegex);

    expect(headers).not.toBeNull();
    expect(headers!.length).toBeGreaterThan(5);
  });
});
