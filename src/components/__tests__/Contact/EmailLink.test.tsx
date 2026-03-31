import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EmailLink from '../../Contact/EmailLink';

describe('EmailLink', () => {
  it('renders as an icon link', () => {
    render(<EmailLink />);

    const link = screen.getByRole('link', { name: /send an email/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'mailto:bonitachen910@gmail.com');
  });

  it('renders an svg icon inside the link', () => {
    render(<EmailLink />);

    const link = screen.getByRole('link', { name: /send an email/i });
    expect(link.querySelector('svg')).toBeInTheDocument();
  });
});
