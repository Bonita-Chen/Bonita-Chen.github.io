import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import {
  githubRepoSlug,
  githubRepoWriteToken,
  onlineAdminSaveConfigured,
  repoBranch,
} from '@/data/admin';
import {
  commitGitHubChanges,
  type GitHubCommitChange,
} from '@/lib/admin/github';
import {
  type AdminSavePayload,
  buildAboutModuleSource,
  buildBlogsDataSource,
  buildInterestsDataSource,
  buildPostMarkdown,
} from '@/lib/admin/studio';

export const runtime = 'nodejs';

function isAdminSavePayload(value: unknown): value is AdminSavePayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    Array.isArray(payload.aboutParagraphs) &&
    Array.isArray(payload.aboutCards) &&
    Array.isArray(payload.collections) &&
    Array.isArray(payload.tags) &&
    Array.isArray(payload.posts) &&
    Array.isArray(payload.interests) &&
    Array.isArray(payload.originalPostSlugs) &&
    typeof payload.avatarPath === 'string' &&
    typeof payload.avatarDraft === 'object' &&
    payload.avatarDraft !== null
  );
}

function dataUrlToBase64(dataUrl: string) {
  const match = dataUrl.match(/^data:.*?;base64,(.+)$/);
  if (!match) {
    throw new Error('Asset payload was not a valid base64 data URL.');
  }
  return match[1];
}

function normalizeSiteAssetPath(path: string) {
  const trimmed = path.trim().replace(/\\/g, '/');
  if (!trimmed.startsWith('/') || trimmed.includes('..')) {
    throw new Error(`Invalid asset path: ${path}`);
  }
  return trimmed;
}

function toRepoAssetPath(path: string) {
  const normalized = normalizeSiteAssetPath(path);
  return `public${normalized}`;
}

function toBlogMarkdownPath(slug: string) {
  return `content/blogs/${slug}.md`;
}

function collectAssetChanges(payload: AdminSavePayload) {
  const assetChanges: GitHubCommitChange[] = [];

  if (payload.avatarDraft.output) {
    assetChanges.push({
      path: toRepoAssetPath(payload.avatarPath),
      content: dataUrlToBase64(payload.avatarDraft.output),
      encoding: 'base64',
    });
  }

  for (const post of payload.posts) {
    if (post.coverAsset?.preview) {
      assetChanges.push({
        path: toRepoAssetPath(post.coverAsset.suggestedPath),
        content: dataUrlToBase64(post.coverAsset.preview),
        encoding: 'base64',
      });
    }

    for (const asset of post.inlineImages) {
      if (!asset.preview) {
        continue;
      }
      assetChanges.push({
        path: toRepoAssetPath(asset.suggestedPath),
        content: dataUrlToBase64(asset.preview),
        encoding: 'base64',
      });
    }
  }

  return assetChanges;
}

function collectPostChanges(payload: AdminSavePayload) {
  const changes: GitHubCommitChange[] = [];
  const liveSlugs = new Set(payload.posts.map((post) => post.slug));

  for (const originalSlug of payload.originalPostSlugs) {
    const retained = payload.posts.some(
      (post) => post.id === originalSlug || post.slug === originalSlug,
    );

    if (!retained) {
      changes.push({
        path: toBlogMarkdownPath(originalSlug),
        delete: true,
      });
    }
  }

  for (const post of payload.posts) {
    if (!post.slug.trim()) {
      continue;
    }

    if (
      payload.originalPostSlugs.includes(post.id) &&
      post.id !== post.slug &&
      !liveSlugs.has(post.id)
    ) {
      changes.push({
        path: toBlogMarkdownPath(post.id),
        delete: true,
      });
    }

    changes.push({
      path: toBlogMarkdownPath(post.slug),
      content: buildPostMarkdown(post),
    });
  }

  return changes;
}

export async function POST(request: Request) {
  if (!onlineAdminSaveConfigured || !githubRepoSlug || !githubRepoWriteToken) {
    return NextResponse.json(
      {
        error:
          'Online save is not configured yet. Add the GitHub auth and repository environment variables first.',
      },
      { status: 503 },
    );
  }

  const session = await auth();
  if (!session?.user?.login) {
    return NextResponse.json(
      { error: 'Please sign in with GitHub before saving.' },
      { status: 401 },
    );
  }

  if (!session.user.isAdmin) {
    return NextResponse.json(
      {
        error:
          'This GitHub account is not allowed to write to the admin save workflow.',
      },
      { status: 403 },
    );
  }

  const payload = (await request.json()) as unknown;
  if (!isAdminSavePayload(payload)) {
    return NextResponse.json(
      { error: 'The admin save payload was malformed.' },
      { status: 400 },
    );
  }

  const sourceChanges: GitHubCommitChange[] = [
    {
      path: 'src/data/about.ts',
      content: buildAboutModuleSource(
        payload.aboutParagraphs,
        payload.aboutCards,
        payload.avatarPath,
      ),
    },
    {
      path: 'src/data/blogs.ts',
      content: buildBlogsDataSource(payload.collections, payload.tags),
    },
    {
      path: 'src/data/interests.ts',
      content: buildInterestsDataSource(payload.interests),
    },
    ...collectPostChanges(payload),
    ...collectAssetChanges(payload),
  ];

  try {
    const result = await commitGitHubChanges({
      repoSlug: githubRepoSlug,
      branch: repoBranch,
      token: githubRepoWriteToken,
      message: `Admin studio update from @${session.user.login}`,
      changes: sourceChanges,
    });

    return NextResponse.json({
      ok: true,
      commitSha: result.commit.sha,
      commitUrl: result.commit.url,
      changedCount: result.changedPaths.length,
      changedPaths: result.changedPaths,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Saving to GitHub failed unexpectedly.',
      },
      { status: 500 },
    );
  }
}
