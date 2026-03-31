import type { EditableFileLink } from './types';

interface HandoffTabProps {
  editableFiles: readonly EditableFileLink[];
  githubRepoSlug: string;
  repoBranch: string;
}

export default function HandoffTab({
  editableFiles,
  githubRepoSlug,
  repoBranch,
}: HandoffTabProps) {
  const repoConfigured = Boolean(githubRepoSlug);

  return (
    <div className="admin-workspace admin-handoff">
      <section className="admin-panel-card">
        <div className="admin-panel-header">
          <div>
            <h3>GitHub Handoff</h3>
            <p>
              Use these links to move your admin draft back into the real
              repository files for GitHub Pages deployment.
            </p>
          </div>
        </div>

        <div className="admin-handoff-meta">
          <p>
            Repository:{' '}
            {repoConfigured ? (
              <code>{githubRepoSlug}</code>
            ) : (
              <span>Repository slug not configured yet.</span>
            )}
          </p>
          <p>
            Branch: <code>{repoBranch}</code>
          </p>
          <p>
            Recommended binary upload targets:{' '}
            <code>public/images/portrait-bonita.png</code> and{' '}
            <code>public/images/blogs/</code>
          </p>
        </div>
      </section>

      <div className="admin-grid">
        {editableFiles.map((file) => (
          <article className="admin-card" key={file.path}>
            <h2>{file.title}</h2>
            <p>{file.description}</p>
            {repoConfigured ? (
              <a
                href={
                  file.path.endsWith('/')
                    ? `https://github.com/${githubRepoSlug}/tree/${repoBranch}/${file.path}`
                    : `https://github.com/${githubRepoSlug}/edit/${repoBranch}/${file.path}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in GitHub
              </a>
            ) : (
              <span className="admin-card-disabled">Waiting for repo slug</span>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
