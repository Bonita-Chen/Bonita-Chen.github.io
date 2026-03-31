import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Education from '../../Resume/Education';
import Degree from '../../Resume/Education/Degree';

const mockDegrees = [
  {
    school: 'Stanford University',
    degree: 'M.S. Computer Science',
    link: 'https://stanford.edu',
    year: 2020,
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
});

describe('Degree', () => {
  const mockDegree = {
    school: 'Stanford University',
    degree: 'M.S. Computer Science',
    link: 'https://stanford.edu',
    year: 2020,
    startDate: '2018-09-01',
    endDate: '2020-06-01',
    subtitleSuffix: 'GPA: 4.0 / 4.0',
    description: 'Research focus in systems and machine learning.',
  };

  it('renders degree title', () => {
    render(<Degree data={mockDegree} />);

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'M.S. Computer Science',
    );
  });

  it('renders school name with link', () => {
    render(<Degree data={mockDegree} />);

    const link = screen.getByRole('link', { name: /stanford/i });
    expect(link).toHaveAttribute('href', 'https://stanford.edu');
  });

  it('renders subtitle suffix text outside the school link', () => {
    render(<Degree data={mockDegree} />);

    expect(screen.getByText(/gpa: 4.0 \/ 4.0/i)).toBeInTheDocument();
  });

  it('displays the formatted date range', () => {
    render(<Degree data={mockDegree} />);

    expect(screen.getByText(/sep/i)).toBeInTheDocument();
    expect(screen.getByText(/jun 2020/i)).toBeInTheDocument();
  });

  it('renders the description when present', () => {
    render(<Degree data={mockDegree} />);

    expect(
      screen.getByText(/research focus in systems and machine learning/i),
    ).toBeInTheDocument();
  });

  it('renders as article element', () => {
    render(<Degree data={mockDegree} />);

    const article = document.querySelector('article.degree-container');
    expect(article).toBeInTheDocument();
  });
});
