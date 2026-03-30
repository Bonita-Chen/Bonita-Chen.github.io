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
      screen.getByText(/Economics & Statistics at the/i),
    ).toBeInTheDocument();
    expect(screen.getByText('University of Minnesota')).toHaveClass(
      'hero-highlight',
    );
  });

  it('displays hero chips for credentials', () => {
    render(<Hero />);

    expect(screen.getByText(/UMN Twin Cities/)).toBeInTheDocument();
    expect(screen.getByText(/Data & Research/)).toBeInTheDocument();
    expect(screen.getByText(/Minneapolis, MN/)).toBeInTheDocument();
  });

  it('renders CTA buttons with correct links', () => {
    render(<Hero />);

    const aboutButton = screen.getByRole('link', { name: /about me/i });
    expect(aboutButton).toHaveAttribute('href', '/about');
    expect(aboutButton).toHaveClass('button-primary');

    const resumeButton = screen.getByRole('link', { name: /view resume/i });
    expect(resumeButton).toHaveAttribute('href', '/resume');
    expect(resumeButton).toHaveClass('button-secondary');
  });

  it('has decorative background elements', () => {
    render(<Hero />);

    const bg = document.querySelector('.hero-bg');
    expect(bg).toBeInTheDocument();
    expect(bg).toHaveAttribute('aria-hidden', 'true');
  });
});
