'use client';

import type { BlogCollection } from '@/data/blogs';
import type { Interest } from '@/data/interests';
import type { Post } from '@/lib/posts';

import AboutTab from './AboutTab';
import BlogsTab from './BlogsTab';
import HandoffTab from './HandoffTab';
import InterestsTab from './InterestsTab';
import type { EditableFileLink } from './types';
import { useAdminStore } from './useAdminStore';
import { triggerDownload } from './utils';

interface AdminStudioProps {
  initialAboutMarkdown: string;
  initialAboutCards: ReadonlyArray<{
    title: string;
    emoji: string;
    description: string;
  }>;
  initialPosts: Post[];
  initialCollections: BlogCollection[];
  initialTagLabels: Record<string, string>;
  initialInterests: Interest[];
  editableFiles: readonly EditableFileLink[];
  githubRepoSlug: string;
  repoBranch: string;
}

export default function AdminStudio({
  initialAboutMarkdown,
  initialAboutCards,
  initialPosts,
  initialCollections,
  initialTagLabels,
  initialInterests,
  editableFiles,
  githubRepoSlug,
  repoBranch,
}: AdminStudioProps) {
  const store = useAdminStore({
    initialAboutMarkdown,
    initialAboutCards,
    initialPosts,
    initialCollections,
    initialTagLabels,
    initialInterests,
  });

  const { activeTab, setActiveTab, flashMessage, resetStudio } = store;

  function exportSnapshot() {
    triggerDownload(
      'bonita-admin-studio.json',
      JSON.stringify(
        {
          aboutParagraphs: store.aboutParagraphs,
          aboutCards: store.aboutCards,
          collections: store.collections,
          tags: store.tags,
          posts: store.posts,
          interests: store.interests,
          avatarDraft: store.avatarDraft,
        },
        null,
        2,
      ),
      'application/json;charset=utf-8',
    );
  }

  return (
    <div className="admin-studio">
      <div className="admin-studio-header">
        <div>
          <h2>Admin Studio</h2>
          <p>
            Edit About, Blogs, and Interests with image upload, avatar crop,
            blog cover replacement, tag management, and gantt timeline updates.
          </p>
        </div>
        <div className="admin-studio-actions">
          <button
            type="button"
            className="admin-action-button admin-action-button--ghost"
            onClick={resetStudio}
          >
            Reset Draft
          </button>
          <button
            type="button"
            className="admin-action-button"
            onClick={exportSnapshot}
          >
            Download Snapshot
          </button>
        </div>
      </div>

      <div className="admin-status-row">
        <p className="admin-status-pill">
          Draft mode only. This studio saves changes in your browser and helps
          you export or hand off the real repository files for GitHub Pages.
        </p>
        {flashMessage ? <p className="admin-flash">{flashMessage}</p> : null}
      </div>

      <div className="admin-tabs">
        {(['about', 'blogs', 'interests', 'handoff'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'handoff'
              ? 'GitHub Handoff'
              : tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'about' && <AboutTab store={store} />}
      {activeTab === 'blogs' && <BlogsTab store={store} />}
      {activeTab === 'interests' && <InterestsTab store={store} />}
      {activeTab === 'handoff' && (
        <HandoffTab
          editableFiles={editableFiles}
          githubRepoSlug={githubRepoSlug}
          repoBranch={repoBranch}
        />
      )}
    </div>
  );
}
