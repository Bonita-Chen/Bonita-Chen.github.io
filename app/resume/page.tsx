import type { Metadata } from 'next';

import Courses from '@/components/Resume/Courses';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import References from '@/components/Resume/References';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import PageWrapper from '@/components/Template/PageWrapper';
import courses from '@/data/resume/courses';
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
          <p className="resume-summary">
            Economics student with hands-on experience in research pipelines,
            dashboarding, public-interest analysis, and client-facing strategy
            work. I&apos;m especially interested in roles where rigorous
            analysis and clear communication reinforce each other.
          </p>
        </header>

        <div className="fade-in stagger-1">
          <ResumeNav />
        </div>

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

          <section id="courses" className="resume-section fade-in stagger-5">
            <Courses data={courses} />
          </section>

          <section id="references" className="resume-section fade-in stagger-6">
            <References />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}
