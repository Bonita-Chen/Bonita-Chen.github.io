import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Footer from '../../Template/Footer';

describe('Footer', () => {
  it('renders the footer landmark', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders the copyright line with Baojia Chen', () => {
    render(<Footer />);

    expect(screen.getByText(/© 2026 Baojia Chen/i)).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
  });

  it('links to the upstream personal-site template', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: 'personal-site' })).toHaveAttribute(
      'href',
      'https://github.com/mldangelo/personal-site',
    );
  });

  it('mentions the design adaptation credit', () => {
    render(<Footer />);

    expect(screen.getByText(/Visual design adapted by/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Jingcheng Liang' }),
    ).toHaveAttribute(
      'href',
      'https://github.com/leo-leung04/leo-leung04.github.io',
    );
  });
});
