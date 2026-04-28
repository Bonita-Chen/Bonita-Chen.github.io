import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Hero from '../../Template/Hero';

describe('Hero', () => {
  it('renders the hero section', () => {
    render(<Hero />);

    const heroSection = document.querySelector('.hero');
    expect(heroSection).toBeInTheDocument();
  });

  it('displays the name as heading', () => {
    render(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Bonita Chen');
  });

  it('renders the updated template tagline', () => {
    render(<Hero />);

    expect(
      screen.getByText(/Economics B\.S\. & Statistics minor at the/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText('University of Minnesota, Twin Cities'),
    ).toHaveClass('hero-highlight');
    expect(screen.getByText(/real-world impact/i)).toBeInTheDocument();
  });

  it('displays hero chips for credentials', () => {
    render(<Hero />);

    expect(screen.getByText(/UMN Twin Cities/)).toBeInTheDocument();
    expect(screen.getByText(/Open to Full-Time Roles/)).toBeInTheDocument();
    expect(screen.getByText(/Minneapolis, MN/)).toBeInTheDocument();
  });

  it('renders a circular portrait image', () => {
    render(<Hero />);

    const portrait = screen.getByAltText(/bonita chen/i);
    expect(portrait).toBeInTheDocument();
    expect(portrait).toHaveAttribute('src', '/images/me.jpg');
  });

  it('renders CTA buttons with correct links', () => {
    render(<Hero />);

    const aboutButton = screen.getByRole('link', { name: /about me/i });
    expect(aboutButton).toHaveAttribute('href', '/about');
    expect(aboutButton).toHaveClass('button-primary');

    const resumeButton = screen.getByRole('link', { name: /view r.sum./i });
    expect(resumeButton).toHaveAttribute('href', '/resume');
    expect(resumeButton).toHaveClass('button-secondary');
  });

  it('renders inline social icons beside the name', () => {
    render(<Hero />);

    const inlineSocial = document.querySelector('.hero-inline-social');
    expect(inlineSocial).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /instagram/i }),
    ).toBeInTheDocument();
  });

  it('has decorative background elements', () => {
    render(<Hero />);

    const bg = document.querySelector('.hero-bg');
    expect(bg).toBeInTheDocument();
    expect(bg).toHaveAttribute('aria-hidden', 'true');
  });
});
