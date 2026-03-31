import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ResumeNav from '../../Resume/ResumeNav';

describe('ResumeNav', () => {
  it('renders navigation element', () => {
    render(<ResumeNav />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('renders links to all resume sections', () => {
    render(<ResumeNav />);

    expect(
      screen.getByRole('link', { name: /professional experience/i }),
    ).toHaveAttribute('href', '#experience');
    expect(screen.getByRole('link', { name: /education/i })).toHaveAttribute(
      'href',
      '#education',
    );
    expect(screen.getByRole('link', { name: /skills/i })).toHaveAttribute(
      'href',
      '#skills',
    );
  });

  it('renders 3 navigation links', () => {
    render(<ResumeNav />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBe(3);
  });

  it('has correct CSS class', () => {
    render(<ResumeNav />);

    const nav = document.querySelector('.resume-nav');
    expect(nav).toBeInTheDocument();
  });

  it('experience link is active by default', () => {
    render(<ResumeNav />);

    const experienceLink = screen.getByRole('link', {
      name: /professional experience/i,
    });
    expect(experienceLink).toHaveClass('active');
  });
});
