'use client';

import { useMemo } from 'react';

import type { Category, Skill } from '@/data/resume/skills';
import { useFilterToggle } from '@/hooks/useFilterToggle';

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
  const { active, toggle, isActive } = useFilterToggle('All');

  const groupedSkills = useMemo(() => {
    if (active !== 'All') {
      return [
        {
          name: active,
          skills: sortSkills(
            skills.filter((skill) => skill.category.includes(active)),
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
  }, [active, categories, skills]);

  return (
    <div className="skills">
      <div className="link-to" id="skills" />
      <div className="title">
        <h3>Skills</h3>
      </div>

      <div className="skill-button-container" aria-label="Skill categories">
        <CategoryButton
          label="All"
          isActive={isActive('All')}
          handleClick={toggle}
        />
        {categories.map((category) => (
          <CategoryButton
            key={category.name}
            label={category.name}
            isActive={isActive(category.name)}
            handleClick={toggle}
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
