'use client';

import { useMemo, useState } from 'react';

import type { Category, Skill } from '@/data/resume/skills';

import CategoryButton from './Skills/CategoryButton';
import SkillTag from './Skills/SkillTag';

interface SkillsProps {
  skills: Skill[];
  categories: Category[];
}

function sortSkills(list: Skill[]) {
  return [...list].sort((a, b) => {
    if (a.competency !== b.competency) {
      return b.competency - a.competency;
    }

    return a.title.localeCompare(b.title);
  });
}

export default function Skills({ skills, categories }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const groupedSkills = useMemo(() => {
    if (activeCategory !== 'All') {
      return [
        {
          name: activeCategory,
          skills: sortSkills(
            skills.filter((skill) => skill.category.includes(activeCategory)),
          ),
        },
      ];
    }

    return categories
      .map((category) => ({
        name: category.name,
        skills: sortSkills(
          skills.filter((skill) => skill.category.includes(category.name)),
        ),
      }))
      .filter((group) => group.skills.length > 0);
  }, [activeCategory, categories, skills]);

  function handleCategoryClick(label: string) {
    setActiveCategory((current) =>
      current === label || (label === 'All' && current === 'All')
        ? 'All'
        : label,
    );
  }

  return (
    <div className="skills">
      <div className="link-to" id="skills" />
      <div className="title">
        <h3>Skills</h3>
      </div>

      <div className="skill-button-container" aria-label="Skill categories">
        <CategoryButton
          label="All"
          isActive={activeCategory === 'All'}
          handleClick={handleCategoryClick}
        />
        {categories.map((category) => (
          <CategoryButton
            key={category.name}
            label={category.name}
            isActive={activeCategory === category.name}
            handleClick={handleCategoryClick}
          />
        ))}
      </div>

      <div className="skill-groups">
        {groupedSkills.map((group) => (
          <section className="skill-group" key={group.name}>
            <h4 className="skill-group-title">{group.name}</h4>
            <div className="skill-tags">
              {group.skills.map((skill) => (
                <SkillTag key={`${group.name}-${skill.title}`} data={skill} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
