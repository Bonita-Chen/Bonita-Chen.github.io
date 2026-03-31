import Markdown from 'markdown-to-jsx';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import BackLink from '@/components/Template/BackLink';
import PageWrapper from '@/components/Template/PageWrapper';
import {
  getAllProjects,
  getProjectBySlug,
  getProjectSlugs,
} from '@/lib/projects';
import { AUTHOR_NAME, formatDate, PORTRAIT_IMAGE, SITE_URL } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const slugs = getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const url = `${SITE_URL}/projects/${project.slug}/`;

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.description,
      url,
      authors: [AUTHOR_NAME],
      images: [
        {
          url: project.image || PORTRAIT_IMAGE,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [project.image || PORTRAIT_IMAGE],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <PageWrapper>
      <article className="project-detail">
        <header className="project-detail-header">
          <BackLink
            defaultHref="/projects"
            defaultLabel={'\u2190 Back to Projects'}
            className="project-detail-back"
          />

          <div className="project-detail-meta">
            <time className="project-detail-date" dateTime={project.date}>
              {formatDate(project.date)}
            </time>
          </div>

          <h1 className="project-detail-title">{project.title}</h1>

          {project.subtitle ? (
            <p className="project-detail-subtitle">{project.subtitle}</p>
          ) : null}

          <p className="project-detail-desc">{project.description}</p>

          {project.tech.length > 0 ? (
            <div className="project-detail-tech">
              {project.tech.map((t) => (
                <span className="tech-tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {project.image ? (
          <div className="project-detail-cover">
            <Image
              src={project.image}
              alt={project.title}
              width={1200}
              height={720}
              priority
            />
          </div>
        ) : null}

        {project.images.length > 0 ? (
          <div className="project-detail-gallery">
            {project.images.map((src) => (
              <div className="project-detail-gallery-item" key={src}>
                <Image
                  src={src}
                  alt={`${project.title} screenshot`}
                  width={800}
                  height={500}
                  loading="lazy"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            ))}
          </div>
        ) : null}

        {project.pdf ? (
          <div className="project-detail-pdf">
            <a
              href={project.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail-pdf-link"
            >
              View PDF Document &rarr;
            </a>
          </div>
        ) : null}

        {project.content.trim() ? (
          <div className="project-detail-content prose">
            <Markdown
              options={{
                overrides: {
                  img: {
                    component: ({
                      alt,
                      src,
                    }: {
                      alt?: string;
                      src?: string;
                    }) => (
                      <Image
                        src={src || ''}
                        alt={alt || ''}
                        width={1200}
                        height={720}
                        loading="lazy"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    ),
                  },
                },
              }}
            >
              {project.content}
            </Markdown>
          </div>
        ) : null}

        {project.link ? (
          <div className="project-detail-external">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-detail-external-link"
            >
              View External Project &rarr;
            </a>
          </div>
        ) : null}

        <nav className="project-detail-nav" aria-label="Project navigation">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="project-detail-nav-link project-detail-nav-link--prev"
            >
              <span className="project-detail-nav-label">&larr; Previous</span>
              <span className="project-detail-nav-title">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="project-detail-nav-link project-detail-nav-link--next"
            >
              <span className="project-detail-nav-label">Next &rarr;</span>
              <span className="project-detail-nav-title">
                {nextProject.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </PageWrapper>
  );
}
