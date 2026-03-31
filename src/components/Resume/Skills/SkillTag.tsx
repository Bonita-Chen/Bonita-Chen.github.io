import type { Skill } from '@/data/resume/skills';
import { MAX_COMPETENCY } from '@/lib/utils';

interface SkillTagProps {
  data: Skill;
}

export default function SkillTag({ data }: SkillTagProps) {
  const { competency, title } = data;

  return (
    <span
      className="skill-tag"
      title={`${title}: ${competency} out of ${MAX_COMPETENCY}`}
      aria-label={`${title}: proficiency ${competency} out of ${MAX_COMPETENCY}`}
    >
      <span className="skill-tag-name">{title}</span>
    </span>
  );
}
