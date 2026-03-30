import type { Metadata } from 'next';

import { AUTHOR_NAME, SITE_URL, SOCIAL_IMAGE, TWITTER_HANDLE } from './utils';

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: `/${string}`;
}

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  const absoluteUrl = path ? new URL(path, SITE_URL).toString() : undefined;
  const pageTitle = `${title} | ${AUTHOR_NAME}`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: AUTHOR_NAME,
      title: pageTitle,
      description,
      ...(absoluteUrl ? { url: absoluteUrl } : {}),
      images: [
        {
          url: SOCIAL_IMAGE,
          width: 1200,
          height: 630,
          alt: AUTHOR_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [SOCIAL_IMAGE],
      ...(TWITTER_HANDLE
        ? {
            site: TWITTER_HANDLE,
            creator: TWITTER_HANDLE,
          }
        : {}),
    },
  };
}
