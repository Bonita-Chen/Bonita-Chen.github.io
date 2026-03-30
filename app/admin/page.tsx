import type { Metadata } from 'next';

import PageWrapper from '@/components/Template/PageWrapper';
import { editableFiles, githubRepoSlug, repoBranch } from '@/data/admin';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Admin',
  description:
    'GitHub-native editing entry point for Baojia Chen’s personal site content.',
  path: '/admin/',
});

const repoConfigured = Boolean(githubRepoSlug);

function getEditUrl(path: string) {
  const normalizedPath = path.replace(/^\//, '');

  if (normalizedPath.endsWith('/')) {
    return `https://github.com/${githubRepoSlug}/tree/${repoBranch}/${normalizedPath}`;
  }

  return `https://github.com/${githubRepoSlug}/edit/${repoBranch}/${normalizedPath}`;
}

export default function AdminPage() {
  return (
    <PageWrapper>
      <section className="admin-page">
        <header className="admin-header">
          <h1 className="page-title">Admin</h1>
          <p className="page-subtitle">
            A GitHub-native editing entrance for updating site content without
            exposing passwords or secrets in the browser.
          </p>
        </header>

        <div className="admin-panel">
          <p className="admin-note">
            This route is designed for the pure GitHub Pages workflow. You log
            in with GitHub, edit the matching source file in the browser, then
            commit the change and let GitHub Pages redeploy. No browser-side
            password matching or exposed secrets required.
          </p>

          {!repoConfigured ? (
            <div className="admin-warning">
              Set <code>NEXT_PUBLIC_GITHUB_REPO_SLUG</code> or update{' '}
              <code>package.json</code> if you move the site to a different
              repository.
            </div>
          ) : (
            <p className="admin-note">
              Editing repository: <code>{githubRepoSlug}</code> on branch{' '}
              <code>{repoBranch}</code>.
            </p>
          )}

          <div className="admin-grid">
            {editableFiles.map((file) => (
              <article className="admin-card" key={file.path}>
                <h2>{file.title}</h2>
                <p>{file.description}</p>
                {repoConfigured ? (
                  <a
                    href={getEditUrl(file.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in GitHub
                  </a>
                ) : (
                  <span className="admin-card-disabled">
                    Waiting for repo slug
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
