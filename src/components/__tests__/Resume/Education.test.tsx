import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Education from '../../Resume/Education';

const mockDegrees = [
  {
    school: 'Stanford University',
    degree: 'M.S. Computer Science',
    link: 'https://stanford.edu',
    year: 2020,
    startDate: '2018-09-01',
    endDate: '2020-06-01',
    subtitleSuffix: 'GPA: 4.0 / 4.0',
    description: 'Research focus in systems and machine learning.',
    achievements: ['\u2018Dean\u2019s List', 'Graduate Fellowship'],
  },
  {
    school: 'MIT',
    degree: 'B.S. Computer Science',
    link: 'https://mit.edu',
    year: 2016,
  },
];

describe('Education', () => {
  it('renders the education section with title', () => {
    render(<Education data={mockDegrees} />);

    expect(
      screen.getByRole('heading', { name: /education/i }),
    ).toBeInTheDocument();
  });

  it('renders all degrees', () => {
    render(<Education data={mockDegrees} />);

    expect(screen.getByText('M.S. Computer Science')).toBeInTheDocument();
    expect(screen.getByText('B.S. Computer Science')).toBeInTheDocument();
  });

  it('renders school links', () => {
    render(<Education data={mockDegrees} />);

    const stanfordLink = screen.getByRole('link', { name: /stanford/i });
    expect(stanfordLink).toHaveAttribute('href', 'https://stanford.edu');

    const mitLink = screen.getByRole('link', { name: /mit/i });
    expect(mitLink).toHaveAttribute('href', 'https://mit.edu');
  });

  it('has anchor link for navigation', () => {
    render(<Education data={mockDegrees} />);

    const anchor = document.getElementById('education');
    expect(anchor).toBeInTheDocument();
  });

  it('renders subtitle suffix', () => {
    render(<Education data={mockDegrees} />);

    expect(screen.getByText(/gpa: 4.0 \/ 4.0/i)).toBeInTheDocument();
  });

  it('renders description when present', () => {
    render(<Education data={mockDegrees} />);

    expect(
      screen.getByText(/research focus in systems and machine learning/i),
    ).toBeInTheDocument();
  });

  it('renders achievements as bullet items', () => {
    render(<Education data={mockDegrees} />);

    expect(screen.getByText(/Dean\u2019s List/)).toBeInTheDocument();
    expect(screen.getByText('Graduate Fellowship')).toBeInTheDocument();
  });

  it('renders date range', () => {
    render(<Education data={mockDegrees} />);

    expect(screen.getByText(/Sep 2018 – Jun 2020/)).toBeInTheDocument();
  });
});
