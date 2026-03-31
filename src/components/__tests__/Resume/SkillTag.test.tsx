import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkillTag from '../../Resume/Skills/SkillTag';

describe('SkillTag', () => {
  it('renders the skill title', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('uses the shared template tag class', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag');
    expect(tag).toBeInTheDocument();
    expect(tag).not.toHaveClass('skill-tag--lg');
    expect(tag).not.toHaveClass('skill-tag--md');
    expect(tag).not.toHaveClass('skill-tag--sm');
  });

  it('renders an inner name span for grouped sorting assertions', () => {
    const skill = {
      title: 'JavaScript',
      competency: 4,
      category: ['Languages'],
    };

    render(<SkillTag data={skill} />);

    expect(document.querySelector('.skill-tag-name')).toHaveTextContent(
      'JavaScript',
    );
  });

  it('includes the proficiency tooltip text', () => {
    const skill = { title: 'Ruby', competency: 3, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    expect(document.querySelector('.skill-tag')).toHaveAttribute(
      'title',
      'Ruby: 3 out of 5',
    );
  });

  it('includes an accessible aria-label', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    expect(screen.getByLabelText('Python: proficiency 5 out of 5')).toBe(
      document.querySelector('.skill-tag'),
    );
  });
});
