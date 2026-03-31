import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { emailContact } from '@/data/contact';
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
    expect(links).toHaveLength(3);
  });

  it('can render the email contact when explicitly provided', () => {
    expect(emailContact).toBeDefined();
    render(<ContactIcons items={emailContact ? [emailContact] : []} />);

    expect(
      screen.getByRole('link', { name: /send an email/i }),
    ).toHaveAttribute('href', 'mailto:bonitachen910@gmail.com');
  });
});
