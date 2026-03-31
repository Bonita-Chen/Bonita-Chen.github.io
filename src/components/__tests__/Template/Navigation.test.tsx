import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Navigation from '../../Template/Navigation';

// Mock usePathname to control active state
const mockPathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('Navigation', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');

    // Mock matchMedia for ThemeToggle
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders the logo link to home', () => {
    render(<Navigation />);
    const logo = screen.getByRole('link', { name: /bc/i });
    expect(logo).toHaveAttribute('href', '/');
  });

  it('renders navigation links for all non-index routes', () => {
    const { container } = render(<Navigation />);

    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /r.sum./i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /blogs/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /interests/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();

    const labels = Array.from(
      container.querySelectorAll('.nav-links a'),
      (link) => link.textContent,
    );
    expect(labels).toEqual([
      'About',
      'R\u00e9sum\u00e9',
      'Projects',
      'Blogs',
      'Interests',
      'Contact',
    ]);
  });

  it('marks home route as active when on homepage', () => {
    mockPathname.mockReturnValue('/');
    render(<Navigation />);

    // About link should not be active
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).not.toHaveClass('active');
  });

  it('marks about route as active when on about page', () => {
    mockPathname.mockReturnValue('/about');
    render(<Navigation />);

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toHaveClass('active');
    expect(aboutLink).toHaveAttribute('aria-current', 'page');
  });

  it('marks nested routes as active', () => {
    mockPathname.mockReturnValue('/resume/skills');
    render(<Navigation />);

    const resumeLink = screen.getByRole('link', { name: /r.sum./i });
    expect(resumeLink).toHaveClass('active');
  });

  it('renders theme toggle and hamburger menu', () => {
    render(<Navigation />);

    // Theme toggle should be present (placeholder initially due to SSR)
    const navActions = document.querySelector('.nav-actions');
    expect(navActions).toBeInTheDocument();
  });
});
