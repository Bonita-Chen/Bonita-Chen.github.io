import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import type { Project } from '@/data/projects';
import { PROJECT_IMAGE } from '@/lib/utils';

interface CellProps {
  data: Project;
}

export default function Cell({ data }: CellProps) {
  const {
    slug,
    title,
    subtitle,
    link,
    image,
    emoji,
    date,
    desc,
    tech,
    featured,
  } = data;

  const hasImage = Boolean(image);
  const detailHref = `/projects/${slug}`;

  const cardContent = (
    <>
      {hasImage ? (
        <div className="project-card-image">
          <Image
            src={image || ''}
            alt={title}
            width={PROJECT_IMAGE.width}
            height={PROJECT_IMAGE.height}
            sizes="(max-width: 600px) 100vw, 50vw"
          />
          <div className="project-card-overlay" />
        </div>
      ) : (
        <div className="project-card-art" aria-hidden="true">
          <span className="project-card-emoji">{emoji || '✦'}</span>
          <span className="project-card-art-label">{title}</span>
        </div>
      )}

      <div className="project-card-content">
        <header className="project-card-header">
          <h3 className="project-card-title">{title}</h3>
          {subtitle && <p className="project-card-subtitle">{subtitle}</p>}
        </header>

        <p className="project-card-desc">{desc}</p>

        {tech && tech.length > 0 && (
          <div className="project-card-tech">
            {tech.map((t) => (
              <span key={t} className="tech-tag">
                {t}
              </span>
            ))}
          </div>
        )}

        <time className="project-card-date" dateTime={date}>
          {dayjs(date).format('YYYY')}
        </time>
      </div>
    </>
  );

  if (link) {
    return (
      <article
        className={`project-card ${featured ? 'project-card--featured' : ''}`}
      >
        <a
          href={link}
          className="project-card-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {cardContent}
        </a>
      </article>
    );
  }

  return (
    <article
      className={`project-card ${featured ? 'project-card--featured' : ''}`}
    >
      <Link href={detailHref} className="project-card-link">
        {cardContent}
      </Link>
    </article>
  );
}
