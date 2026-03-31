type GitHubTreeEntry = {
  path: string;
  mode: '100644';
  type: 'blob';
  sha: string | null;
};

export type GitHubCommitChange =
  | {
      path: string;
      content: string;
      encoding?: 'utf-8';
    }
  | {
      path: string;
      content: string;
      encoding: 'base64';
    }
  | {
      path: string;
      delete: true;
    };

type GitHubApiCommitResult = {
  sha: string;
  url: string;
};

function parseRepoSlug(repoSlug: string) {
  const [owner, repo] = repoSlug.split('/');
  if (!owner || !repo) {
    throw new Error(`Invalid GitHub repository slug: "${repoSlug}"`);
  }
  return { owner, repo };
}

async function githubFetch<T>(
  repoSlug: string,
  token: string,
  path: string,
  init?: RequestInit,
) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `GitHub API ${response.status} ${response.statusText}: ${errorText}`,
    );
  }

  return (await response.json()) as T;
}

async function createBlob(
  repoSlug: string,
  token: string,
  content: string,
  encoding: 'utf-8' | 'base64',
) {
  const { owner, repo } = parseRepoSlug(repoSlug);
  const result = await githubFetch<{ sha: string }>(
    repoSlug,
    token,
    `/repos/${owner}/${repo}/git/blobs`,
    {
      method: 'POST',
      body: JSON.stringify({ content, encoding }),
    },
  );

  return result.sha;
}

export async function commitGitHubChanges({
  repoSlug,
  branch,
  token,
  message,
  changes,
}: {
  repoSlug: string;
  branch: string;
  token: string;
  message: string;
  changes: GitHubCommitChange[];
}) {
  const dedupedChanges = new Map<string, GitHubCommitChange>();
  for (const change of changes) {
    dedupedChanges.set(change.path, change);
  }

  const finalChanges = Array.from(dedupedChanges.values());
  if (finalChanges.length === 0) {
    throw new Error('No repository changes were provided.');
  }

  const { owner, repo } = parseRepoSlug(repoSlug);
  const ref = await githubFetch<{ object: { sha: string } }>(
    repoSlug,
    token,
    `/repos/${owner}/${repo}/git/ref/heads/${branch}`,
  );
  const headSha = ref.object.sha;

  const headCommit = await githubFetch<{ tree: { sha: string } }>(
    repoSlug,
    token,
    `/repos/${owner}/${repo}/git/commits/${headSha}`,
  );

  const tree: GitHubTreeEntry[] = [];
  for (const change of finalChanges) {
    if ('delete' in change) {
      tree.push({
        path: change.path,
        mode: '100644',
        type: 'blob',
        sha: null,
      });
      continue;
    }

    const blobSha = await createBlob(
      repoSlug,
      token,
      change.content,
      change.encoding || 'utf-8',
    );

    tree.push({
      path: change.path,
      mode: '100644',
      type: 'blob',
      sha: blobSha,
    });
  }

  const createdTree = await githubFetch<{ sha: string }>(
    repoSlug,
    token,
    `/repos/${owner}/${repo}/git/trees`,
    {
      method: 'POST',
      body: JSON.stringify({
        base_tree: headCommit.tree.sha,
        tree,
      }),
    },
  );

  const commit = await githubFetch<GitHubApiCommitResult>(
    repoSlug,
    token,
    `/repos/${owner}/${repo}/git/commits`,
    {
      method: 'POST',
      body: JSON.stringify({
        message,
        tree: createdTree.sha,
        parents: [headSha],
      }),
    },
  );

  await githubFetch(
    repoSlug,
    token,
    `/repos/${owner}/${repo}/git/refs/heads/${branch}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        sha: commit.sha,
        force: false,
      }),
    },
  );

  return {
    commit,
    changedPaths: finalChanges.map((change) => change.path),
  };
}
