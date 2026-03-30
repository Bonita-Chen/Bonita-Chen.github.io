import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from '../../Template/Footer';

describe('Footer', () => {
  it('renders the footer with correct structure', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays the name and role', () => {
    render(<Footer />);

    expect(screen.getByText('Baojia Chen')).toBeInTheDocument();
    expect(
      screen.getByText('Economics + Statistics student at UMN Twin Cities'),
    ).toBeInTheDocument();
  });

  it('displays the site copyright and template credit', () => {
    render(<Footer />);

    expect(screen.getByText(/© 2026 Baojia Chen/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /personal-site template/i }),
    ).toHaveAttribute('href', 'https://github.com/mldangelo/personal-site');
  });

  it('renders navigation links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about',
    );
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute(
      'href',
      '/resume',
    );
    expect(screen.getByRole('link', { name: /blogs/i })).toHaveAttribute(
      'href',
      '/blogs',
    );
    expect(screen.getByRole('link', { name: /interests/i })).toHaveAttribute(
      'href',
      '/interests',
    );
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute(
      'href',
      '/projects',
    );
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute(
      'href',
      '/contact',
    );
    expect(screen.getByRole('link', { name: /admin/i })).toHaveAttribute(
      'href',
      '/admin',
    );
  });

  it('renders contact icons section', () => {
    render(<Footer />);

    // Contact icons are rendered via ContactIcons component
    const socialSection = document.querySelector('.footer-social');
    expect(socialSection).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
  });

  it('has link to home from avatar', () => {
    render(<Footer />);

    const avatarLink = document.querySelector('.footer-avatar');
    expect(avatarLink).toHaveAttribute('href', '/');
  });
});
