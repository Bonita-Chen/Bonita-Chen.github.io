import type { Metadata } from 'next';

import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import PageWrapper from '@/components/Template/PageWrapper';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Resume',
  description:
    'Baojia Chen’s resume covering research, analytics, education, and selected technical skills.',
  path: '/resume/',
});

export default function ResumePage() {
  return (
    <PageWrapper>
      <section className="resume-page">
        <header className="resume-header fade-in">
          <h1 className="resume-title">Resume</h1>
        </header>

        <ResumeNav />

        <div className="resume-content">
          <section id="experience" className="resume-section fade-in stagger-2">
            <Experience data={work} />
          </section>

          <section id="education" className="resume-section fade-in stagger-3">
            <Education data={degrees} />
          </section>

          <section id="skills" className="resume-section fade-in stagger-4">
            <Skills skills={skills} categories={categories} />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}
