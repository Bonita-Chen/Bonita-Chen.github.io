import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import EmailLink from '../../Contact/EmailLink';

describe('EmailLink', () => {
  it('renders the email domain', () => {
    render(<EmailLink />);

    expect(screen.getByText('@gmail.com')).toBeInTheDocument();
  });

  it('renders as a link element', () => {
    render(<EmailLink />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'mailto:bonitachen910@gmail.com');
  });

  it('renders the mailbox prefix as visible text', () => {
    render(<EmailLink />);

    expect(screen.getByText('bonitachen910')).toBeInTheDocument();
  });
});
