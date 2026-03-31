import type { Metadata } from 'next';

import AboutContent from '@/components/About/Sections';
import PageWrapper from '@/components/Template/PageWrapper';
import { aboutCards, aboutMarkdown } from '@/data/about';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'About',
  description:
    'Learn more about Bonita Chen, an economics and statistics student working across research, analytics, and reflective writing.',
  path: '/about/',
});

export default function AboutPage() {
  return (
    <PageWrapper>
      <section className="about-page">
        <header className="about-header fade-in">
          <h1 className="page-title">
            <em>About</em>
          </h1>
        </header>
        <div className="fade-in stagger-1">
          <AboutContent markdown={aboutMarkdown} />
        </div>
        {aboutCards.length > 0 ? (
          <div className="about-grid fade-in stagger-2">
            {aboutCards.map((card) => (
              <article className="about-card" key={card.title}>
                <h3>
                  {card.emoji} {card.title}
                </h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </PageWrapper>
  );
}
