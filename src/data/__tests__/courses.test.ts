import { describe, expect, it } from 'vitest';

import courses from '../resume/courses';

describe('courses data', () => {
  it('exports an array of courses', () => {
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThan(0);
  });

  it('each course has required properties', () => {
    for (const course of courses) {
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('number');
      expect(course).toHaveProperty('link');
      expect(course).toHaveProperty('university');

      expect(typeof course.title).toBe('string');
      expect(typeof course.number).toBe('string');
      expect(typeof course.link).toBe('string');
      expect(typeof course.university).toBe('string');
    }
  });

  it('course numbers are non-empty', () => {
    for (const course of courses) {
      expect(course.number.trim().length).toBeGreaterThan(0);
    }
  });

  it('course titles are non-empty', () => {
    for (const course of courses) {
      expect(course.title.trim().length).toBeGreaterThan(0);
    }
  });

  it('links are valid URLs', () => {
    const urlRegex = /^https?:\/\/.+/;

    for (const course of courses) {
      expect(course.link).toMatch(urlRegex);
    }
  });

  it('has unique course titles', () => {
    const titles = courses.map((c) => c.title);
    const uniqueTitles = new Set(titles);

    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('course title and number combinations are unique', () => {
    const identifiers = courses.map(
      (course) => `${course.number}:${course.title}`,
    );
    const uniqueIdentifiers = new Set(identifiers);

    expect(uniqueIdentifiers.size).toBe(identifiers.length);
  });

  it('all courses have valid university names', () => {
    for (const course of courses) {
      expect(course.university.trim().length).toBeGreaterThan(0);
    }
  });
});
