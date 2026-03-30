import type { Metadata } from 'next';
import Link from 'next/link';

import { PersonSchema } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  description:
    'Baojia Chen is an economics and statistics student at UMN Twin Cities, sharing projects, blogs, interests, and research-oriented work.',
};

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <PageWrapper>
      <PersonSchema />
      <Hero />

      <section className="home-section">
        <h2 className="section-title">
          <span className="section-title-text">
            What I&apos;m Building Toward
          </span>
        </h2>
        <ul className="impact-list">
          <li>
            <strong>Research fluency:</strong> building pipelines and empirical
            workflows that stay reproducible even when the data is messy.
          </li>
          <li>
            <strong>Analytical communication:</strong> translating results into
            dashboards, slides, and writing that teammates can act on quickly.
          </li>
          <li>
            <strong>Long-form curiosity:</strong> documenting what I&apos;m
            learning through blogs, interest timelines, and project snapshots.
          </li>
        </ul>
      </section>

      <section className="home-section">
        <h2 className="section-title">
          <span className="section-title-text">Explore the Site</span>
        </h2>
        <div className="work-grid">
          <Link href="/blogs" className="work-card">
            <h3 className="work-card-title">Blogs</h3>
            <p className="work-card-desc">
              Writing on internships, academics, life in Minneapolis, and the
              small systems behind bigger career decisions.
            </p>
            <span className="work-card-link">Browse posts</span>
          </Link>
          <Link href="/interests" className="work-card">
            <h3 className="work-card-title">Interests</h3>
            <p className="work-card-desc">
              A timeline-style view of the topics I&apos;m actively exploring,
              from causal inference to photography.
            </p>
            <span className="work-card-link">See the timeline</span>
          </Link>
          <Link href="/projects" className="work-card">
            <h3 className="work-card-title">Projects</h3>
            <p className="work-card-desc">
              Research, data visualization, and strategy work spanning public
              health, healthcare, and business analytics.
            </p>
            <span className="work-card-link">View projects</span>
          </Link>
        </div>
      </section>

      <section className="home-cta">
        <p>Recent writing</p>
        <div className="work-grid">
          {recentPosts.map((post) => (
            <Link
              href={`/blogs/${post.slug}`}
              className="work-card"
              key={post.slug}
            >
              <h3 className="work-card-title">{post.title}</h3>
              <p className="work-card-desc">{post.description}</p>
              <span className="work-card-link">Read more</span>
            </Link>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
