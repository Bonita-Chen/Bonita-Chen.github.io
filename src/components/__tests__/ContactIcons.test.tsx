import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ContactIcons from '../Contact/ContactIcons';

describe('ContactIcons', () => {
  it('renders contact icons', () => {
    render(<ContactIcons />);

    const linkedInLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedInLink).toBeInTheDocument();
    expect(linkedInLink).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/baojia-bonita-chen',
    );

    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/Bonita-Chen',
    );

    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:bonitachen910@gmail.com');

    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute(
      'href',
      'https://www.instagram.com/bonita_chen_?igsh=MTJrcTV1ZTE4ZTR6dQ%3D%3D&utm_source=qr',
    );
  });

  it('has correct number of contact links', () => {
    render(<ContactIcons />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });
});
