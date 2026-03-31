import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from '../../Template/Footer';

describe('Footer', () => {
  it('renders the footer landmark', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders the copyright line with Bonita Chen', () => {
    render(<Footer />);

    expect(screen.getByText(/© 2026 Bonita Chen/i)).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  it('renders source attribution links', () => {
    render(<Footer />);

    expect(
      screen.getByRole('link', { name: /Michael D'Angelo's personal-site/i }),
    ).toHaveAttribute('href', 'https://github.com/mldangelo/personal-site');
    expect(
      screen.getByRole('link', { name: /Leo Leung's leo-leung04.github.io/i }),
    ).toHaveAttribute(
      'href',
      'https://github.com/leo-leung04/leo-leung04.github.io',
    );
  });

  it('renders mirrored footer navigation', () => {
    render(<Footer />);

    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about',
    );
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'href',
      '/resume',
    );
  });

  it('renders footer connect icons including email', () => {
    render(<Footer />);

    expect(
      screen.getByRole('link', { name: /linkedin \(opens in new tab\)/i }),
    ).toHaveAttribute('href', 'https://www.linkedin.com/in/baojia-bonita-chen');
    expect(
      screen.getByRole('link', { name: /github \(opens in new tab\)/i }),
    ).toHaveAttribute('href', 'https://github.com/Bonita-Chen');
    expect(
      screen.getByRole('link', { name: /^send an email$/i }),
    ).toHaveAttribute('href', 'mailto:bonitachen910@gmail.com');
  });
});
