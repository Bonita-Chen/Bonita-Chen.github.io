import { render, screen, waitFor } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import AboutContent from '../Sections';

function getActualSectionTitles(markdown: string) {
  return Array.from(markdown.matchAll(/^# (.+)$/gm))
    .map((match) => match[1])
    .filter((title) => title !== 'Intro');
}

describe('AboutContent', () => {
  it('renders intro copy without an Intro heading', () => {
    render(
      <AboutContent
        markdown={`# Intro

Hello from the intro.

# Right Now

- Built a thing.`}
      />,
    );

    expect(screen.getByText('Hello from the intro.')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Intro' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Right Now' }),
    ).toBeInTheDocument();
  });

  it('assigns section variants for compact and links sections', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# I Like

- Running

# Websites from People I Admire

- [Example](https://example.com)`}
      />,
    );

    const sections = container.querySelectorAll('.about-section');

    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveClass('about-section--compact');
    expect(sections[1]).toHaveClass('about-section--links');
  });

  it('adds stable heading ids for deep links', () => {
    render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# Right Now

- Built a thing.

# Blueberry Notes

- Went somewhere.`}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Right Now' })).toHaveAttribute(
      'id',
      'right-now',
    );
    expect(
      screen.getByRole('heading', { name: 'Blueberry Notes' }),
    ).toHaveAttribute('id', 'blueberry-notes');
  });

  it('renders section navigation and self-links for the real about markdown', () => {
    const sectionTitles = getActualSectionTitles(aboutMarkdown);
    render(<AboutContent markdown={aboutMarkdown} />);

    expect(sectionTitles).toHaveLength(0);
    expect(
      screen.queryByRole('navigation', { name: 'About sections' }),
    ).not.toBeInTheDocument();
  });

  it('renders matching hash links and heading ids into static markup', () => {
    const html = renderToStaticMarkup(
      <AboutContent markdown={aboutMarkdown} />,
    );

    expect(html).toContain('class="about-intro"');
    expect(html).not.toContain('href="#right-now"');
    expect(html).not.toContain('id="right-now"');
  });

  it('supports same-page hash navigation from section links', async () => {
    window.history.replaceState({}, '', '/about/');

    render(<AboutContent markdown={aboutMarkdown} />);

    expect(
      screen.queryByRole('navigation', { name: 'About sections' }),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(window.location.hash).toBe('');
    });
  });
});
