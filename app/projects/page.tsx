import type { Metadata } from 'next';

import Cell from '@/components/Projects/Cell';
import PageWrapper from '@/components/Template/PageWrapper';
import data from '@/data/projects';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Projects',
  description:
    'Selected research, analytics, and strategy projects by Baojia Chen.',
  path: '/projects/',
});

export default function ProjectsPage() {
  const featuredProjects = data.filter((p) => p.featured);
  const otherProjects = data.filter((p) => !p.featured);

  return (
    <PageWrapper mainClassName="page-main--wide">
      <section className="projects-page">
        <header className="projects-header fade-in">
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            Research, dashboards, strategy work, and student-led experiments
          </p>
        </header>

        {featuredProjects.length > 0 && (
          <section className="projects-featured fade-in stagger-1">
            <h2 className="projects-section-title">Featured Work</h2>
            <div className="projects-grid projects-grid--featured">
              {featuredProjects.map((project) => (
                <Cell data={project} key={project.title} />
              ))}
            </div>
          </section>
        )}

        {otherProjects.length > 0 && (
          <section className="projects-other fade-in stagger-2">
            <h2 className="projects-section-title">More Explorations</h2>
            <div className="projects-grid">
              {otherProjects.map((project) => (
                <Cell data={project} key={project.title} />
              ))}
            </div>
          </section>
        )}
      </section>
    </PageWrapper>
  );
}
