'use client';

import { useEffect, useRef, useState } from 'react';

import type { BlogCollection } from '@/data/blogs';
import type { Interest, InterestEntry } from '@/data/interests';
import type { Post } from '@/lib/posts';
import { PORTRAIT_IMAGE } from '@/lib/utils';

type EditableFileLink = {
  title: string;
  description: string;
  path: string;
};

type EditableCard = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

type EditableTag = {
  id: string;
  slug: string;
  label: string;
};

type EditableCollection = {
  id: string;
  slug: string;
  label: string;
  emoji: string;
  description: string;
};

type EditableAsset = {
  id: string;
  name: string;
  alt: string;
  mimeType: string;
  preview: string;
  suggestedPath: string;
};

type EditablePost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  collection: string;
  image: string;
  icon: string;
  featured: boolean;
  draft: boolean;
  content: string;
  coverAsset: EditableAsset | null;
  inlineImages: EditableAsset[];
};

type EditableInterestEntry = InterestEntry & {
  id: string;
  href: string;
};

type EditableInterest = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  summary: string;
  trackLabel: string;
  start: string;
  targetMonths?: number;
  ongoing: boolean;
  accent: string;
  entries: EditableInterestEntry[];
};

type AvatarDraft = {
  source: string;
  output: string;
  fileName: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
};

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

const STORAGE_KEY = 'bonita-admin-studio-v1';

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match?.[1] || '.png';
}

function splitAboutIntro(markdown: string) {
  return markdown
    .replace(/^# Intro\s*/u, '')
    .trim()
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function buildAboutMarkdown(paragraphs: string[]) {
  return `# Intro\n\n${paragraphs.join('\n\n')}\n`;
}

function toSeedPosts(initialPosts: Post[]): EditablePost[] {
  return initialPosts.map((post) => ({
    id: post.slug,
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    tags: [...post.tags],
    collection: post.collection || '',
    image: post.image || '',
    icon: post.icon || '✦',
    featured: Boolean(post.featured),
    draft: Boolean(post.draft),
    content: post.content,
    coverAsset: null,
    inlineImages: [],
  }));
}

function toSeedInterests(initialInterests: Interest[]): EditableInterest[] {
  return initialInterests.map((interest) => ({
    id: interest.slug,
    slug: interest.slug,
    name: interest.name,
    icon: interest.icon,
    summary: interest.summary,
    trackLabel: interest.trackLabel,
    start: interest.start,
    targetMonths: interest.targetMonths,
    ongoing: Boolean(interest.ongoing),
    accent: interest.accent,
    entries: interest.entries.map((entry) => ({
      ...entry,
      id: createId('interest-entry'),
      href: entry.href || '',
    })),
  }));
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function triggerDataUrlDownload(filename: string, dataUrl: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function yamlString(value: string) {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function buildPostMarkdown(post: EditablePost) {
  const lines = [
    '---',
    `title: ${yamlString(post.title)}`,
    `date: ${yamlString(post.date)}`,
    `description: ${yamlString(post.description)}`,
  ];

  if (post.tags.length > 0) {
    lines.push('tags:');
    for (const tag of post.tags) {
      lines.push(`  - ${yamlString(tag)}`);
    }
  }

  if (post.collection) {
    lines.push(`collection: ${yamlString(post.collection)}`);
  }

  const coverPath = post.coverAsset?.suggestedPath || post.image;
  if (coverPath) {
    lines.push(`image: ${yamlString(coverPath)}`);
  }

  if (post.icon) {
    lines.push(`icon: ${yamlString(post.icon)}`);
  }

  if (post.featured) {
    lines.push('featured: true');
  }

  if (post.draft) {
    lines.push('draft: true');
  }

  lines.push('---', '', post.content.trim(), '');

  return lines.join('\n');
}

function buildAboutModuleSource(
  paragraphs: string[],
  cards: EditableCard[],
  avatarPath: string,
) {
  const cardExports = cards.map(({ emoji, title, description }) => ({
    emoji,
    title,
    description,
  }));

  return `export const aboutMarkdown = ${JSON.stringify(buildAboutMarkdown(paragraphs))};\n\nexport const aboutCards = ${JSON.stringify(cardExports, null, 2)} as const;\n\nexport const aboutAvatarPath = ${JSON.stringify(avatarPath)};\n`;
}

function buildBlogsDataSource(
  collections: EditableCollection[],
  tags: EditableTag[],
) {
  const collectionExports = collections.map(
    ({ slug, label, emoji, description }) => ({
      slug,
      label,
      emoji,
      description,
    }),
  );

  const tagObject = Object.fromEntries(
    tags.map((tag) => [tag.slug, tag.label]),
  );

  return `export interface BlogCollection {\n  slug: string;\n  label: string;\n  emoji: string;\n  description: string;\n}\n\nexport const blogCollections: BlogCollection[] = ${JSON.stringify(collectionExports, null, 2)};\n\nexport const blogTagLabels = ${JSON.stringify(tagObject, null, 2)} as const;\n\nexport type BlogTag = keyof typeof blogTagLabels;\n`;
}

function buildInterestsDataSource(interests: EditableInterest[]) {
  const interestExports = interests.map((interest) => ({
    slug: interest.slug,
    name: interest.name,
    icon: interest.icon,
    summary: interest.summary,
    trackLabel: interest.trackLabel,
    start: interest.start,
    ...(interest.targetMonths ? { targetMonths: interest.targetMonths } : {}),
    ...(interest.ongoing ? { ongoing: true } : {}),
    accent: interest.accent,
    entries: interest.entries.map(({ id: _id, href, ...entry }) => ({
      ...entry,
      ...(href ? { href } : {}),
    })),
  }));

  return `export interface InterestEntry {\n  type: 'Course' | 'Event' | 'Project' | 'Blog';\n  title: string;\n  description: string;\n  date: string;\n  tags: string[];\n  href?: string;\n}\n\nexport interface Interest {\n  slug: string;\n  name: string;\n  icon: string;\n  summary: string;\n  trackLabel: string;\n  start: string;\n  targetMonths?: number;\n  ongoing?: boolean;\n  accent: string;\n  entries: InterestEntry[];\n}\n\nconst interests: Interest[] = ${JSON.stringify(interestExports, null, 2)};\n\nexport default interests;\n`;
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
  const initialParagraphs = splitAboutIntro(initialAboutMarkdown);
  const initialCards = initialAboutCards.map((card, index) => ({
    id: `card-${index + 1}`,
    ...card,
  }));
  const initialCollectionsDraft = initialCollections.map((collection) => ({
    id: collection.slug,
    ...collection,
  }));
  const initialTags = Object.entries(initialTagLabels).map(([slug, label]) => ({
    id: slug,
    slug,
    label,
  }));
  const initialPostsDraft = toSeedPosts(initialPosts);
  const initialInterestsDraft = toSeedInterests(initialInterests);

  const [activeTab, setActiveTab] = useState<
    'about' | 'blogs' | 'interests' | 'handoff'
  >('about');
  const [aboutParagraphs, setAboutParagraphs] =
    useState<string[]>(initialParagraphs);
  const [aboutCards, setAboutCards] = useState<EditableCard[]>(initialCards);
  const [collections, setCollections] = useState<EditableCollection[]>(
    initialCollectionsDraft,
  );
  const [tags, setTags] = useState<EditableTag[]>(initialTags);
  const [posts, setPosts] = useState<EditablePost[]>(initialPostsDraft);
  const [selectedPostId, setSelectedPostId] = useState(
    initialPostsDraft[0]?.id || '',
  );
  const [interests, setInterests] = useState<EditableInterest[]>(
    initialInterestsDraft,
  );
  const [selectedInterestId, setSelectedInterestId] = useState(
    initialInterestsDraft[0]?.id || '',
  );
  const [avatarDraft, setAvatarDraft] = useState<AvatarDraft>({
    source: '',
    output: '',
    fileName: 'portrait-baojia.png',
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const [flashMessage, setFlashMessage] = useState('');

  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved) as {
        activeTab?: 'about' | 'blogs' | 'interests' | 'handoff';
        aboutParagraphs?: string[];
        aboutCards?: EditableCard[];
        collections?: EditableCollection[];
        tags?: EditableTag[];
        posts?: EditablePost[];
        selectedPostId?: string;
        interests?: EditableInterest[];
        selectedInterestId?: string;
        avatarDraft?: AvatarDraft;
      };

      if (parsed.activeTab) {
        setActiveTab(parsed.activeTab);
      }
      if (parsed.aboutParagraphs?.length) {
        setAboutParagraphs(parsed.aboutParagraphs);
      }
      if (parsed.aboutCards?.length) {
        setAboutCards(parsed.aboutCards);
      }
      if (parsed.collections?.length) {
        setCollections(parsed.collections);
      }
      if (parsed.tags?.length) {
        setTags(parsed.tags);
      }
      if (parsed.posts?.length) {
        setPosts(parsed.posts);
      }
      if (parsed.selectedPostId) {
        setSelectedPostId(parsed.selectedPostId);
      }
      if (parsed.interests?.length) {
        setInterests(parsed.interests);
      }
      if (parsed.selectedInterestId) {
        setSelectedInterestId(parsed.selectedInterestId);
      }
      if (parsed.avatarDraft) {
        setAvatarDraft(parsed.avatarDraft);
      }
    } catch {
      setFlashMessage('Saved draft could not be restored. Starting fresh.');
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          activeTab,
          aboutParagraphs,
          aboutCards,
          collections,
          tags,
          posts,
          selectedPostId,
          interests,
          selectedInterestId,
          avatarDraft,
        }),
      );
    } catch {
      setFlashMessage(
        'Draft too large for local storage. Export before refresh.',
      );
    }
  }, [
    activeTab,
    aboutParagraphs,
    aboutCards,
    collections,
    tags,
    posts,
    selectedPostId,
    interests,
    selectedInterestId,
    avatarDraft,
  ]);

  useEffect(() => {
    if (!flashMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setFlashMessage(''), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [flashMessage]);

  useEffect(() => {
    if (!avatarDraft.source || typeof window === 'undefined') {
      return;
    }

    let isCancelled = false;
    const image = new window.Image();

    image.onload = () => {
      if (isCancelled) {
        return;
      }

      const size = 512;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        return;
      }

      canvas.width = size;
      canvas.height = size;

      const baseScale = Math.max(size / image.width, size / image.height);
      const scale = baseScale * avatarDraft.zoom;
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const drawX = (size - drawWidth) / 2 + avatarDraft.offsetX;
      const drawY = (size - drawHeight) / 2 + avatarDraft.offsetY;

      context.clearRect(0, 0, size, size);
      context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

      const output = canvas.toDataURL('image/png');
      setAvatarDraft((current) =>
        current.source === avatarDraft.source &&
        current.zoom === avatarDraft.zoom &&
        current.offsetX === avatarDraft.offsetX &&
        current.offsetY === avatarDraft.offsetY
          ? { ...current, output }
          : current,
      );
    };

    image.src = avatarDraft.source;

    return () => {
      isCancelled = true;
    };
  }, [
    avatarDraft.source,
    avatarDraft.zoom,
    avatarDraft.offsetX,
    avatarDraft.offsetY,
  ]);

  useEffect(() => {
    if (!posts.some((post) => post.id === selectedPostId) && posts.length > 0) {
      setSelectedPostId(posts[0].id);
    }
  }, [posts, selectedPostId]);

  useEffect(() => {
    if (
      !interests.some((interest) => interest.id === selectedInterestId) &&
      interests.length > 0
    ) {
      setSelectedInterestId(interests[0].id);
    }
  }, [interests, selectedInterestId]);

  const repoConfigured = Boolean(githubRepoSlug);
  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;
  const selectedInterest =
    interests.find((interest) => interest.id === selectedInterestId) || null;
  const aboutModuleSource = buildAboutModuleSource(
    aboutParagraphs,
    aboutCards,
    avatarDraft.output ? '/images/portrait-baojia.png' : PORTRAIT_IMAGE,
  );
  const blogsDataSource = buildBlogsDataSource(collections, tags);
  const interestsDataSource = buildInterestsDataSource(interests);

  async function copyToClipboard(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setFlashMessage(`${label} copied.`);
    } catch {
      setFlashMessage(`Unable to copy ${label.toLowerCase()}.`);
    }
  }

  function resetStudio() {
    const confirmed = window.confirm(
      'Reset the admin studio to the repository content and remove local draft data?',
    );

    if (!confirmed) {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
    setActiveTab('about');
    setAboutParagraphs(initialParagraphs);
    setAboutCards(initialCards);
    setCollections(initialCollectionsDraft);
    setTags(initialTags);
    setPosts(initialPostsDraft);
    setSelectedPostId(initialPostsDraft[0]?.id || '');
    setInterests(initialInterestsDraft);
    setSelectedInterestId(initialInterestsDraft[0]?.id || '');
    setAvatarDraft({
      source: '',
      output: '',
      fileName: 'portrait-baojia.png',
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
    setFlashMessage('Studio reset to repository content.');
  }

  function updatePost(
    postId: string,
    updater: (post: EditablePost) => EditablePost,
  ) {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? updater(post) : post)),
    );
  }

  function addParagraph() {
    setAboutParagraphs((current) => [...current, '']);
  }

  function addAboutCard() {
    setAboutCards((current) => [
      ...current,
      {
        id: createId('card'),
        emoji: '✨',
        title: 'New Card',
        description: 'Describe the new about highlight here.',
      },
    ]);
  }

  async function handleAvatarUpload(files: FileList | null) {
    const file = files?.[0];
    if (!file) {
      return;
    }

    const preview = await readFileAsDataUrl(file);
    setAvatarDraft({
      source: preview,
      output: preview,
      fileName: `portrait-baojia${extractExtension(file.name)}`,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
    setFlashMessage('Avatar uploaded. Adjust the crop and export when ready.');
  }

  async function handleCoverUpload(files: FileList | null) {
    if (!selectedPost) {
      return;
    }

    const file = files?.[0];
    if (!file) {
      return;
    }

    const preview = await readFileAsDataUrl(file);
    const extension = extractExtension(file.name);
    const suggestedPath = `/images/blogs/${selectedPost.slug || 'new-post'}-cover${extension}`;

    updatePost(selectedPost.id, (post) => ({
      ...post,
      image: suggestedPath,
      coverAsset: {
        id: createId('cover'),
        name: file.name,
        alt: post.title,
        mimeType: file.type || 'image/png',
        preview,
        suggestedPath,
      },
    }));

    setFlashMessage('Cover uploaded for the selected post.');
  }

  async function handleInlineImageUpload(files: FileList | null) {
    if (!selectedPost || !files?.length) {
      return;
    }

    const uploads = await Promise.all(
      Array.from(files).map(async (file) => {
        const preview = await readFileAsDataUrl(file);
        const extension = extractExtension(file.name);
        const baseName =
          slugify(file.name.replace(/\.[a-z0-9]+$/iu, '')) || 'image';

        return {
          id: createId('asset'),
          name: file.name,
          alt: selectedPost.title,
          mimeType: file.type || 'image/png',
          preview,
          suggestedPath: `/images/blogs/${selectedPost.slug || 'new-post'}-${baseName}${extension}`,
        } satisfies EditableAsset;
      }),
    );

    updatePost(selectedPost.id, (post) => ({
      ...post,
      inlineImages: [...post.inlineImages, ...uploads],
    }));

    setFlashMessage(
      `${uploads.length} inline image${uploads.length > 1 ? 's' : ''} added.`,
    );
  }

  function insertImageMarkdown(asset: EditableAsset) {
    if (!selectedPost) {
      return;
    }

    const snippet = `\n![${asset.alt || selectedPost.title}](${asset.suggestedPath})\n`;

    updatePost(selectedPost.id, (post) => {
      const textarea = contentRef.current;

      if (!textarea) {
        return {
          ...post,
          content: `${post.content.trimEnd()}\n${snippet}`,
        };
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const nextContent =
        post.content.slice(0, start) + snippet + post.content.slice(end);

      window.requestAnimationFrame(() => {
        textarea.focus();
        const cursor = start + snippet.length;
        textarea.setSelectionRange(cursor, cursor);
      });

      return {
        ...post,
        content: nextContent,
      };
    });

    setFlashMessage('Markdown image snippet inserted into the post body.');
  }

  function addPost() {
    const nextIndex = posts.length + 1;
    const nextPost: EditablePost = {
      id: createId('post'),
      slug: `new-post-${nextIndex}`,
      title: `New Post ${nextIndex}`,
      date: new Date().toISOString().slice(0, 10),
      description: 'Write a short summary for this post.',
      tags: [],
      collection: '',
      image: '',
      icon: '✦',
      featured: false,
      draft: true,
      content: 'Write here...',
      coverAsset: null,
      inlineImages: [],
    };

    setPosts((current) => [nextPost, ...current]);
    setSelectedPostId(nextPost.id);
    setActiveTab('blogs');
    setFlashMessage('New blog draft created.');
  }

  function deleteSelectedPost() {
    if (!selectedPost) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${selectedPost.title}" from the local admin draft?`,
    );

    if (!confirmed) {
      return;
    }

    setPosts((current) =>
      current.filter((post) => post.id !== selectedPost.id),
    );
    setFlashMessage('Selected blog draft removed from the admin studio.');
  }

  function addTag() {
    const nextTag: EditableTag = {
      id: createId('tag'),
      slug: `new-tag-${tags.length + 1}`,
      label: 'New Tag',
    };

    setTags((current) => [...current, nextTag]);
    setFlashMessage('Tag added.');
  }

  function addCollection() {
    const nextCollection: EditableCollection = {
      id: createId('collection'),
      slug: `new-collection-${collections.length + 1}`,
      label: 'New Collection',
      emoji: '🗂️',
      description: 'Describe this collection.',
    };

    setCollections((current) => [...current, nextCollection]);
    setFlashMessage('Collection added.');
  }

  function updateTagField(
    tagId: string,
    field: 'slug' | 'label',
    value: string,
  ) {
    setTags((current) => {
      const existing = current.find((tag) => tag.id === tagId);
      if (!existing) {
        return current;
      }

      if (field === 'slug') {
        const nextSlug = slugify(value) || existing.slug;
        setPosts((postList) =>
          postList.map((post) => ({
            ...post,
            tags: post.tags.map((tag) =>
              tag === existing.slug ? nextSlug : tag,
            ),
          })),
        );

        return current.map((tag) =>
          tag.id === tagId ? { ...tag, slug: nextSlug } : tag,
        );
      }

      return current.map((tag) =>
        tag.id === tagId ? { ...tag, label: value } : tag,
      );
    });
  }

  function updateCollectionField(
    collectionId: string,
    field: 'slug' | 'label' | 'emoji' | 'description',
    value: string,
  ) {
    setCollections((current) => {
      const existing = current.find(
        (collection) => collection.id === collectionId,
      );
      if (!existing) {
        return current;
      }

      if (field === 'slug') {
        const nextSlug = slugify(value) || existing.slug;
        setPosts((postList) =>
          postList.map((post) => ({
            ...post,
            collection:
              post.collection === existing.slug ? nextSlug : post.collection,
          })),
        );

        return current.map((collection) =>
          collection.id === collectionId
            ? { ...collection, slug: nextSlug }
            : collection,
        );
      }

      return current.map((collection) =>
        collection.id === collectionId
          ? { ...collection, [field]: value }
          : collection,
      );
    });
  }

  function removeTag(tagId: string) {
    const existing = tags.find((tag) => tag.id === tagId);
    if (!existing) {
      return;
    }

    setTags((current) => current.filter((tag) => tag.id !== tagId));
    setPosts((current) =>
      current.map((post) => ({
        ...post,
        tags: post.tags.filter((tag) => tag !== existing.slug),
      })),
    );
  }

  function removeCollection(collectionId: string) {
    const existing = collections.find(
      (collection) => collection.id === collectionId,
    );
    if (!existing) {
      return;
    }

    setCollections((current) =>
      current.filter((collection) => collection.id !== collectionId),
    );
    setPosts((current) =>
      current.map((post) => ({
        ...post,
        collection: post.collection === existing.slug ? '' : post.collection,
      })),
    );
  }

  function updateInterest(
    interestId: string,
    updater: (interest: EditableInterest) => EditableInterest,
  ) {
    setInterests((current) =>
      current.map((interest) =>
        interest.id === interestId ? updater(interest) : interest,
      ),
    );
  }

  function addInterest() {
    const nextIndex = interests.length + 1;
    const nextInterest: EditableInterest = {
      id: createId('interest'),
      slug: `new-interest-${nextIndex}`,
      name: `New Interest ${nextIndex}`,
      icon: '✨',
      summary: 'Describe what this interest means to you.',
      trackLabel: 'Learning Track',
      start: new Date().toISOString().slice(0, 10),
      targetMonths: 6,
      ongoing: false,
      accent: '#43638C',
      entries: [],
    };

    setInterests((current) => [...current, nextInterest]);
    setSelectedInterestId(nextInterest.id);
    setActiveTab('interests');
    setFlashMessage('New interest track created.');
  }

  function deleteSelectedInterest() {
    if (!selectedInterest) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${selectedInterest.name}" from the local admin draft?`,
    );

    if (!confirmed) {
      return;
    }

    setInterests((current) =>
      current.filter((interest) => interest.id !== selectedInterest.id),
    );
    setFlashMessage('Selected interest removed from the admin studio.');
  }

  function addInterestEntry() {
    if (!selectedInterest) {
      return;
    }

    updateInterest(selectedInterest.id, (interest) => ({
      ...interest,
      entries: [
        ...interest.entries,
        {
          id: createId('interest-entry'),
          type: 'Project',
          title: 'New Entry',
          description: 'Describe the course, event, project, or blog.',
          date: new Date().toISOString().slice(0, 10),
          tags: ['Tag'],
          href: '',
        },
      ],
    }));
    setFlashMessage('Interest entry added.');
  }

  function updateInterestEntry(
    interestId: string,
    entryId: string,
    updater: (entry: EditableInterestEntry) => EditableInterestEntry,
  ) {
    updateInterest(interestId, (interest) => ({
      ...interest,
      entries: interest.entries.map((entry) =>
        entry.id === entryId ? updater(entry) : entry,
      ),
    }));
  }

  function removeInterestEntry(interestId: string, entryId: string) {
    updateInterest(interestId, (interest) => ({
      ...interest,
      entries: interest.entries.filter((entry) => entry.id !== entryId),
    }));
  }

  function getEstimatedInterestProgress(interest: EditableInterest) {
    if (interest.ongoing || !interest.targetMonths) {
      return 'Ongoing';
    }

    const start = new Date(`${interest.start}T12:00:00`);
    const now = new Date();
    const elapsedMonths =
      (now.getFullYear() - start.getFullYear()) * 12 +
      now.getMonth() -
      start.getMonth() +
      1;

    return `${Math.min(
      100,
      Math.max(0, Math.round((elapsedMonths / interest.targetMonths) * 100)),
    )}%`;
  }

  function exportSnapshot() {
    triggerDownload(
      'bonita-admin-studio.json',
      JSON.stringify(
        {
          aboutParagraphs,
          aboutCards,
          collections,
          tags,
          posts,
          interests,
          avatarDraft,
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
          Static mode: you can add, delete, and edit here first, then export the
          real files back into the repository.
        </p>
        {flashMessage ? <p className="admin-flash">{flashMessage}</p> : null}
      </div>

      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'blogs' ? 'active' : ''}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blogs
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'interests' ? 'active' : ''}`}
          onClick={() => setActiveTab('interests')}
        >
          Interests
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'handoff' ? 'active' : ''}`}
          onClick={() => setActiveTab('handoff')}
        >
          GitHub Handoff
        </button>
      </div>

      {activeTab === 'about' ? (
        <div className="admin-workspace admin-workspace--split">
          <div className="admin-column">
            <section className="admin-panel-card">
              <div className="admin-panel-header">
                <div>
                  <h3>Avatar</h3>
                  <p>
                    Upload a portrait, adjust the crop, and export a square
                    file.
                  </p>
                </div>
              </div>

              <div className="admin-avatar-grid">
                <div className="admin-avatar-card">
                  <label className="admin-file-input">
                    <span>Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        handleAvatarUpload(event.target.files)
                      }
                    />
                  </label>

                  <div className="admin-avatar-preview-shell">
                    <div
                      className="admin-avatar-preview admin-avatar-preview--source"
                      style={{
                        backgroundImage: `url(${avatarDraft.source || PORTRAIT_IMAGE})`,
                      }}
                    />
                    <p className="admin-helper-text">
                      Source preview. If you do not upload a new file, the site
                      keeps using the current portrait asset.
                    </p>
                  </div>

                  <div className="admin-range-group">
                    <label>
                      Zoom
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={avatarDraft.zoom}
                        onChange={(event) =>
                          setAvatarDraft((current) => ({
                            ...current,
                            zoom: Number(event.target.value),
                          }))
                        }
                      />
                    </label>
                    <label>
                      Horizontal
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={avatarDraft.offsetX}
                        onChange={(event) =>
                          setAvatarDraft((current) => ({
                            ...current,
                            offsetX: Number(event.target.value),
                          }))
                        }
                      />
                    </label>
                    <label>
                      Vertical
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={avatarDraft.offsetY}
                        onChange={(event) =>
                          setAvatarDraft((current) => ({
                            ...current,
                            offsetY: Number(event.target.value),
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="admin-avatar-card">
                  <div className="admin-avatar-preview-shell">
                    <div
                      className="admin-avatar-preview admin-avatar-preview--cropped"
                      style={{
                        backgroundImage: `url(${avatarDraft.output || PORTRAIT_IMAGE})`,
                      }}
                    />
                    <p className="admin-helper-text">
                      Cropped output preview. Suggested path:{' '}
                      <code>/public/images/portrait-baojia.png</code>
                    </p>
                  </div>

                  <div className="admin-inline-actions">
                    <button
                      type="button"
                      className="admin-action-button"
                      onClick={() =>
                        avatarDraft.output
                          ? triggerDataUrlDownload(
                              avatarDraft.fileName.replace(
                                /\.[a-z0-9]+$/iu,
                                '.png',
                              ),
                              avatarDraft.output,
                            )
                          : setFlashMessage(
                              'Upload an avatar before exporting.',
                            )
                      }
                    >
                      Download Cropped Avatar
                    </button>
                    <button
                      type="button"
                      className="admin-action-button admin-action-button--ghost"
                      onClick={() =>
                        copyToClipboard(
                          'About module source',
                          buildAboutModuleSource(
                            aboutParagraphs,
                            aboutCards,
                            avatarDraft.output
                              ? '/images/portrait-baojia.png'
                              : PORTRAIT_IMAGE,
                          ),
                        )
                      }
                    >
                      Copy About Source
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="admin-panel-card">
              <div className="admin-panel-header">
                <div>
                  <h3>Intro Paragraphs</h3>
                  <p>
                    Edit the main About text as paragraph blocks instead of raw
                    code.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-mini-button"
                  onClick={addParagraph}
                >
                  Add Paragraph
                </button>
              </div>

              <div className="admin-stack">
                {aboutParagraphs.map((paragraph, index) => (
                  <div
                    className="admin-block-editor"
                    key={`paragraph-${index + 1}`}
                  >
                    <div className="admin-block-header">
                      <strong>Paragraph {index + 1}</strong>
                      {aboutParagraphs.length > 1 ? (
                        <button
                          type="button"
                          className="admin-text-button"
                          onClick={() =>
                            setAboutParagraphs((current) =>
                              current.filter(
                                (_, currentIndex) => currentIndex !== index,
                              ),
                            )
                          }
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                    <textarea
                      value={paragraph}
                      onChange={(event) =>
                        setAboutParagraphs((current) =>
                          current.map((currentParagraph, currentIndex) =>
                            currentIndex === index
                              ? event.target.value
                              : currentParagraph,
                          ),
                        )
                      }
                      rows={5}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-panel-card">
              <div className="admin-panel-header">
                <div>
                  <h3>About Cards</h3>
                  <p>
                    Change the icon, title, or description for each summary
                    card, then add or remove as needed.
                  </p>
                </div>
                <button
                  type="button"
                  className="admin-mini-button"
                  onClick={addAboutCard}
                >
                  Add Card
                </button>
              </div>

              <div className="admin-stack">
                {aboutCards.map((card) => (
                  <div className="admin-card-editor" key={card.id}>
                    <div className="admin-card-editor-row">
                      <label>
                        Icon
                        <input
                          value={card.emoji}
                          onChange={(event) =>
                            setAboutCards((current) =>
                              current.map((currentCard) =>
                                currentCard.id === card.id
                                  ? {
                                      ...currentCard,
                                      emoji: event.target.value,
                                    }
                                  : currentCard,
                              ),
                            )
                          }
                        />
                      </label>
                      <label className="admin-grow">
                        Title
                        <input
                          value={card.title}
                          onChange={(event) =>
                            setAboutCards((current) =>
                              current.map((currentCard) =>
                                currentCard.id === card.id
                                  ? {
                                      ...currentCard,
                                      title: event.target.value,
                                    }
                                  : currentCard,
                              ),
                            )
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="admin-text-button admin-text-button--danger"
                        onClick={() =>
                          setAboutCards((current) =>
                            current.filter(
                              (currentCard) => currentCard.id !== card.id,
                            ),
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                    <label>
                      Description
                      <textarea
                        value={card.description}
                        rows={3}
                        onChange={(event) =>
                          setAboutCards((current) =>
                            current.map((currentCard) =>
                              currentCard.id === card.id
                                ? {
                                    ...currentCard,
                                    description: event.target.value,
                                  }
                                : currentCard,
                            ),
                          )
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="admin-column">
            <section className="admin-panel-card">
              <div className="admin-panel-header">
                <div>
                  <h3>About Preview</h3>
                  <p>Quick visual check before you export the source file.</p>
                </div>
              </div>

              <div className="admin-about-preview">
                <div
                  className="admin-about-preview-avatar"
                  style={{
                    backgroundImage: `url(${avatarDraft.output || PORTRAIT_IMAGE})`,
                  }}
                />
                <div className="admin-about-preview-copy">
                  {aboutParagraphs.map((paragraph, index) => (
                    <p key={`preview-paragraph-${index + 1}`}>{paragraph}</p>
                  ))}
                </div>
                <div className="admin-about-preview-grid">
                  {aboutCards.map((card) => (
                    <article className="admin-about-preview-card" key={card.id}>
                      <h4>
                        <span>{card.emoji}</span> {card.title}
                      </h4>
                      <p>{card.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="admin-panel-card">
              <div className="admin-panel-header">
                <div>
                  <h3>Export</h3>
                  <p>
                    Generate the real files you will commit into the repository.
                  </p>
                </div>
              </div>

              <div className="admin-export-list">
                <button
                  type="button"
                  className="admin-action-button"
                  onClick={() =>
                    triggerDownload(
                      'about.ts',
                      aboutModuleSource,
                      'text/plain;charset=utf-8',
                    )
                  }
                >
                  Download about.ts
                </button>
                <button
                  type="button"
                  className="admin-action-button admin-action-button--ghost"
                  onClick={() =>
                    copyToClipboard('About module source', aboutModuleSource)
                  }
                >
                  Copy about.ts
                </button>
                <button
                  type="button"
                  className="admin-action-button admin-action-button--ghost"
                  onClick={() =>
                    triggerDownload(
                      'blogs.ts',
                      blogsDataSource,
                      'text/plain;charset=utf-8',
                    )
                  }
                >
                  Download blogs.ts
                </button>
              </div>
            </section>
          </div>
        </div>
      ) : null}

      {activeTab === 'blogs' ? (
        <div className="admin-workspace admin-blog-studio">
          <aside className="admin-post-sidebar">
            <div className="admin-panel-header">
              <div>
                <h3>Posts</h3>
                <p>{posts.length} drafts in this local studio.</p>
              </div>
              <button
                type="button"
                className="admin-mini-button"
                onClick={addPost}
              >
                Add Post
              </button>
            </div>

            <div className="admin-post-list">
              {posts.map((post) => (
                <button
                  type="button"
                  key={post.id}
                  className={`admin-post-list-item ${selectedPostId === post.id ? 'active' : ''}`}
                  onClick={() => setSelectedPostId(post.id)}
                >
                  <strong>{post.title}</strong>
                  <span>{post.date}</span>
                  <small>{post.tags.join(', ') || 'No tags yet'}</small>
                </button>
              ))}
            </div>
          </aside>

          <div className="admin-blog-editor">
            {selectedPost ? (
              <>
                <section className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3>Selected Post</h3>
                      <p>Edit metadata, cover art, tags, and markdown body.</p>
                    </div>
                    <button
                      type="button"
                      className="admin-text-button admin-text-button--danger"
                      onClick={deleteSelectedPost}
                    >
                      Delete Post
                    </button>
                  </div>

                  <div className="admin-form-grid">
                    <label className="admin-form-grid-wide">
                      Title
                      <input
                        value={selectedPost.title}
                        onChange={(event) =>
                          updatePost(selectedPost.id, (post) => ({
                            ...post,
                            title: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Slug
                      <input
                        value={selectedPost.slug}
                        onChange={(event) =>
                          updatePost(selectedPost.id, (post) => ({
                            ...post,
                            slug: slugify(event.target.value) || post.slug,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Date
                      <input
                        type="date"
                        value={selectedPost.date}
                        onChange={(event) =>
                          updatePost(selectedPost.id, (post) => ({
                            ...post,
                            date: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Icon
                      <input
                        value={selectedPost.icon}
                        onChange={(event) =>
                          updatePost(selectedPost.id, (post) => ({
                            ...post,
                            icon: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Collection
                      <select
                        value={selectedPost.collection}
                        onChange={(event) =>
                          updatePost(selectedPost.id, (post) => ({
                            ...post,
                            collection: event.target.value,
                          }))
                        }
                      >
                        <option value="">None</option>
                        {collections.map((collection) => (
                          <option key={collection.id} value={collection.slug}>
                            {collection.emoji} {collection.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-form-grid-wide">
                      Description
                      <textarea
                        rows={3}
                        value={selectedPost.description}
                        onChange={(event) =>
                          updatePost(selectedPost.id, (post) => ({
                            ...post,
                            description: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div className="admin-check-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedPost.featured}
                        onChange={(event) =>
                          updatePost(selectedPost.id, (post) => ({
                            ...post,
                            featured: event.target.checked,
                          }))
                        }
                      />
                      Featured
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedPost.draft}
                        onChange={(event) =>
                          updatePost(selectedPost.id, (post) => ({
                            ...post,
                            draft: event.target.checked,
                          }))
                        }
                      />
                      Draft
                    </label>
                  </div>
                </section>

                <section className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3>Cover Image</h3>
                      <p>
                        Upload a replacement cover or point the post to a new
                        path.
                      </p>
                    </div>
                  </div>

                  <div className="admin-cover-grid">
                    <div className="admin-cover-preview-shell">
                      <div
                        className="admin-cover-preview"
                        style={{
                          backgroundImage: `url(${selectedPost.coverAsset?.preview || selectedPost.image || 'none'})`,
                        }}
                      />
                      <p className="admin-helper-text">
                        Suggested cover path:{' '}
                        <code>
                          {selectedPost.coverAsset?.suggestedPath ||
                            selectedPost.image ||
                            '/images/blogs/your-cover.png'}
                        </code>
                      </p>
                    </div>
                    <div className="admin-stack">
                      <label>
                        Image Path
                        <input
                          value={selectedPost.image}
                          onChange={(event) =>
                            updatePost(selectedPost.id, (post) => ({
                              ...post,
                              image: event.target.value,
                            }))
                          }
                        />
                      </label>

                      <label className="admin-file-input">
                        <span>Upload Cover</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            handleCoverUpload(event.target.files)
                          }
                        />
                      </label>

                      <div className="admin-inline-actions">
                        <button
                          type="button"
                          className="admin-action-button admin-action-button--ghost"
                          onClick={() =>
                            selectedPost.coverAsset
                              ? triggerDataUrlDownload(
                                  selectedPost.coverAsset.name,
                                  selectedPost.coverAsset.preview,
                                )
                              : setFlashMessage(
                                  'Upload a cover before downloading it.',
                                )
                          }
                        >
                          Download Cover
                        </button>
                        <button
                          type="button"
                          className="admin-text-button admin-text-button--danger"
                          onClick={() =>
                            updatePost(selectedPost.id, (post) => ({
                              ...post,
                              image: '',
                              coverAsset: null,
                            }))
                          }
                        >
                          Clear Cover
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3>Tags</h3>
                      <p>
                        Attach existing tags to this post, then edit the global
                        tag labels below.
                      </p>
                    </div>
                  </div>

                  <div className="admin-tag-pill-row">
                    {selectedPost.tags.length > 0 ? (
                      selectedPost.tags.map((tag) => (
                        <button
                          type="button"
                          className="admin-tag-pill admin-tag-pill--active"
                          key={`${selectedPost.id}-${tag}`}
                          onClick={() =>
                            updatePost(selectedPost.id, (post) => ({
                              ...post,
                              tags: post.tags.filter(
                                (currentTag) => currentTag !== tag,
                              ),
                            }))
                          }
                        >
                          {tags.find((item) => item.slug === tag)?.label || tag}{' '}
                          ×
                        </button>
                      ))
                    ) : (
                      <p className="admin-helper-text">No tags selected yet.</p>
                    )}
                  </div>

                  <div className="admin-tag-pill-row">
                    {tags
                      .filter((tag) => !selectedPost.tags.includes(tag.slug))
                      .map((tag) => (
                        <button
                          type="button"
                          className="admin-tag-pill"
                          key={tag.id}
                          onClick={() =>
                            updatePost(selectedPost.id, (post) => ({
                              ...post,
                              tags: [...post.tags, tag.slug],
                            }))
                          }
                        >
                          + {tag.label}
                        </button>
                      ))}
                  </div>
                </section>

                <div className="admin-manager-grid">
                  <section className="admin-panel-card">
                    <div className="admin-panel-header">
                      <div>
                        <h3>Tag Manager</h3>
                        <p>Add, rename, or remove tag labels.</p>
                      </div>
                      <button
                        type="button"
                        className="admin-mini-button"
                        onClick={addTag}
                      >
                        Add Tag
                      </button>
                    </div>

                    <div className="admin-stack">
                      {tags.map((tag) => (
                        <div className="admin-card-editor" key={tag.id}>
                          <div className="admin-card-editor-row">
                            <label className="admin-grow">
                              Slug
                              <input
                                value={tag.slug}
                                onChange={(event) =>
                                  updateTagField(
                                    tag.id,
                                    'slug',
                                    event.target.value,
                                  )
                                }
                              />
                            </label>
                            <label className="admin-grow">
                              Label
                              <input
                                value={tag.label}
                                onChange={(event) =>
                                  updateTagField(
                                    tag.id,
                                    'label',
                                    event.target.value,
                                  )
                                }
                              />
                            </label>
                            <button
                              type="button"
                              className="admin-text-button admin-text-button--danger"
                              onClick={() => removeTag(tag.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="admin-panel-card">
                    <div className="admin-panel-header">
                      <div>
                        <h3>Collection Manager</h3>
                        <p>
                          Update blog collections, emojis, and descriptions.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="admin-mini-button"
                        onClick={addCollection}
                      >
                        Add Collection
                      </button>
                    </div>

                    <div className="admin-stack">
                      {collections.map((collection) => (
                        <div className="admin-card-editor" key={collection.id}>
                          <div className="admin-card-editor-row">
                            <label>
                              Emoji
                              <input
                                value={collection.emoji}
                                onChange={(event) =>
                                  updateCollectionField(
                                    collection.id,
                                    'emoji',
                                    event.target.value,
                                  )
                                }
                              />
                            </label>
                            <label className="admin-grow">
                              Label
                              <input
                                value={collection.label}
                                onChange={(event) =>
                                  updateCollectionField(
                                    collection.id,
                                    'label',
                                    event.target.value,
                                  )
                                }
                              />
                            </label>
                            <button
                              type="button"
                              className="admin-text-button admin-text-button--danger"
                              onClick={() => removeCollection(collection.id)}
                            >
                              Delete
                            </button>
                          </div>
                          <div className="admin-card-editor-row">
                            <label className="admin-grow">
                              Slug
                              <input
                                value={collection.slug}
                                onChange={(event) =>
                                  updateCollectionField(
                                    collection.id,
                                    'slug',
                                    event.target.value,
                                  )
                                }
                              />
                            </label>
                          </div>
                          <label>
                            Description
                            <textarea
                              rows={3}
                              value={collection.description}
                              onChange={(event) =>
                                updateCollectionField(
                                  collection.id,
                                  'description',
                                  event.target.value,
                                )
                              }
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <section className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3>Inline Images</h3>
                      <p>
                        Upload images, edit alt text, then insert markdown into
                        the post body.
                      </p>
                    </div>
                    <label className="admin-file-input">
                      <span>Add Images</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(event) =>
                          handleInlineImageUpload(event.target.files)
                        }
                      />
                    </label>
                  </div>

                  <div className="admin-stack">
                    {selectedPost.inlineImages.length > 0 ? (
                      selectedPost.inlineImages.map((asset) => (
                        <div className="admin-asset-card" key={asset.id}>
                          <div
                            className="admin-asset-thumb"
                            style={{ backgroundImage: `url(${asset.preview})` }}
                          />
                          <div className="admin-asset-body">
                            <strong>{asset.name}</strong>
                            <p>
                              Suggested path: <code>{asset.suggestedPath}</code>
                            </p>
                            <label>
                              Alt Text
                              <input
                                value={asset.alt}
                                onChange={(event) =>
                                  updatePost(selectedPost.id, (post) => ({
                                    ...post,
                                    inlineImages: post.inlineImages.map(
                                      (image) =>
                                        image.id === asset.id
                                          ? {
                                              ...image,
                                              alt: event.target.value,
                                            }
                                          : image,
                                    ),
                                  }))
                                }
                              />
                            </label>
                            <div className="admin-inline-actions">
                              <button
                                type="button"
                                className="admin-action-button admin-action-button--ghost"
                                onClick={() => insertImageMarkdown(asset)}
                              >
                                Insert Markdown
                              </button>
                              <button
                                type="button"
                                className="admin-action-button admin-action-button--ghost"
                                onClick={() =>
                                  triggerDataUrlDownload(
                                    asset.name,
                                    asset.preview,
                                  )
                                }
                              >
                                Download File
                              </button>
                              <button
                                type="button"
                                className="admin-text-button admin-text-button--danger"
                                onClick={() =>
                                  updatePost(selectedPost.id, (post) => ({
                                    ...post,
                                    inlineImages: post.inlineImages.filter(
                                      (image) => image.id !== asset.id,
                                    ),
                                  }))
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="admin-helper-text">
                        No inline assets yet. Upload images to prepare blog
                        insertions.
                      </p>
                    )}
                  </div>
                </section>

                <section className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3>Markdown Body</h3>
                      <p>Write the full post content here.</p>
                    </div>
                  </div>

                  <textarea
                    ref={contentRef}
                    className="admin-content-textarea"
                    value={selectedPost.content}
                    rows={18}
                    onChange={(event) =>
                      updatePost(selectedPost.id, (post) => ({
                        ...post,
                        content: event.target.value,
                      }))
                    }
                  />
                </section>

                <section className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3>Post Export</h3>
                      <p>
                        Generate a markdown file for the selected blog post or
                        export the updated tag and collection config.
                      </p>
                    </div>
                  </div>

                  <div className="admin-export-list">
                    <button
                      type="button"
                      className="admin-action-button"
                      onClick={() =>
                        triggerDownload(
                          `${selectedPost.slug || 'post'}.md`,
                          buildPostMarkdown(selectedPost),
                          'text/plain;charset=utf-8',
                        )
                      }
                    >
                      Download Markdown
                    </button>
                    <button
                      type="button"
                      className="admin-action-button admin-action-button--ghost"
                      onClick={() =>
                        copyToClipboard(
                          'Post markdown',
                          buildPostMarkdown(selectedPost),
                        )
                      }
                    >
                      Copy Markdown
                    </button>
                    <button
                      type="button"
                      className="admin-action-button admin-action-button--ghost"
                      onClick={() =>
                        triggerDownload(
                          'blogs.ts',
                          blogsDataSource,
                          'text/plain;charset=utf-8',
                        )
                      }
                    >
                      Download blogs.ts
                    </button>
                    <button
                      type="button"
                      className="admin-action-button admin-action-button--ghost"
                      onClick={() =>
                        copyToClipboard('blogs.ts source', blogsDataSource)
                      }
                    >
                      Copy blogs.ts
                    </button>
                  </div>
                </section>
              </>
            ) : (
              <section className="admin-panel-card">
                <h3>No post selected</h3>
                <p>Create a new post to start editing.</p>
              </section>
            )}
          </div>
        </div>
      ) : null}

      {activeTab === 'interests' ? (
        <div className="admin-workspace admin-blog-studio">
          <aside className="admin-post-sidebar">
            <div className="admin-panel-header">
              <div>
                <h3>Interest Tracks</h3>
                <p>
                  {interests.length} editable tracks for the gantt timeline.
                </p>
              </div>
              <button
                type="button"
                className="admin-mini-button"
                onClick={addInterest}
              >
                Add Interest
              </button>
            </div>

            <div className="admin-post-list">
              {interests.map((interest) => (
                <button
                  type="button"
                  key={interest.id}
                  className={`admin-post-list-item ${selectedInterestId === interest.id ? 'active' : ''}`}
                  onClick={() => setSelectedInterestId(interest.id)}
                >
                  <strong>
                    {interest.icon} {interest.name}
                  </strong>
                  <span>{interest.trackLabel}</span>
                  <small>{getEstimatedInterestProgress(interest)}</small>
                </button>
              ))}
            </div>
          </aside>

          <div className="admin-blog-editor">
            {selectedInterest ? (
              <>
                <section className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3>Selected Interest</h3>
                      <p>
                        Edit the timeline label, dates, color, and summary used
                        by the interests gantt.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="admin-text-button admin-text-button--danger"
                      onClick={deleteSelectedInterest}
                    >
                      Delete Interest
                    </button>
                  </div>

                  <div className="admin-form-grid">
                    <label>
                      Name
                      <input
                        value={selectedInterest.name}
                        onChange={(event) =>
                          updateInterest(selectedInterest.id, (interest) => ({
                            ...interest,
                            name: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Slug
                      <input
                        value={selectedInterest.slug}
                        onChange={(event) =>
                          updateInterest(selectedInterest.id, (interest) => ({
                            ...interest,
                            slug: slugify(event.target.value) || interest.slug,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Icon
                      <input
                        value={selectedInterest.icon}
                        onChange={(event) =>
                          updateInterest(selectedInterest.id, (interest) => ({
                            ...interest,
                            icon: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Accent Color
                      <input
                        type="color"
                        value={selectedInterest.accent}
                        onChange={(event) =>
                          updateInterest(selectedInterest.id, (interest) => ({
                            ...interest,
                            accent: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Start Date
                      <input
                        type="date"
                        value={selectedInterest.start}
                        onChange={(event) =>
                          updateInterest(selectedInterest.id, (interest) => ({
                            ...interest,
                            start: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      Target Months
                      <input
                        type="number"
                        min="1"
                        value={selectedInterest.targetMonths || ''}
                        disabled={selectedInterest.ongoing}
                        onChange={(event) =>
                          updateInterest(selectedInterest.id, (interest) => ({
                            ...interest,
                            targetMonths: event.target.value
                              ? Number(event.target.value)
                              : undefined,
                          }))
                        }
                      />
                    </label>
                    <label className="admin-form-grid-wide">
                      Track Label
                      <input
                        value={selectedInterest.trackLabel}
                        onChange={(event) =>
                          updateInterest(selectedInterest.id, (interest) => ({
                            ...interest,
                            trackLabel: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="admin-form-grid-wide">
                      Summary
                      <textarea
                        rows={3}
                        value={selectedInterest.summary}
                        onChange={(event) =>
                          updateInterest(selectedInterest.id, (interest) => ({
                            ...interest,
                            summary: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div className="admin-check-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedInterest.ongoing}
                        onChange={(event) =>
                          updateInterest(selectedInterest.id, (interest) => ({
                            ...interest,
                            ongoing: event.target.checked,
                            targetMonths: event.target.checked
                              ? undefined
                              : interest.targetMonths || 6,
                          }))
                        }
                      />
                      Ongoing
                    </label>
                    <p className="admin-helper-text">
                      Estimated progress:{' '}
                      {getEstimatedInterestProgress(selectedInterest)}
                    </p>
                  </div>
                </section>

                <section className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3>Timeline Preview</h3>
                      <p>
                        Quick check for ordering, labels, and current progress
                        percentages.
                      </p>
                    </div>
                  </div>

                  <div className="admin-interest-preview-list">
                    {interests.map((interest) => (
                      <div
                        className="admin-interest-preview-row"
                        key={interest.id}
                      >
                        <div className="admin-interest-preview-name">
                          <span
                            className="admin-interest-swatch"
                            style={{ backgroundColor: interest.accent }}
                          />
                          <span>
                            {interest.icon} {interest.name}
                          </span>
                        </div>
                        <div className="admin-interest-preview-track">
                          {interest.trackLabel}
                        </div>
                        <div className="admin-interest-preview-progress">
                          {getEstimatedInterestProgress(interest)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3>Interest Entries</h3>
                      <p>
                        Courses, events, projects, and blog links that appear
                        under this interest.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="admin-mini-button"
                      onClick={addInterestEntry}
                    >
                      Add Entry
                    </button>
                  </div>

                  <div className="admin-stack">
                    {selectedInterest.entries.length > 0 ? (
                      selectedInterest.entries.map((entry) => (
                        <div className="admin-card-editor" key={entry.id}>
                          <div className="admin-card-editor-row">
                            <label>
                              Type
                              <select
                                value={entry.type}
                                onChange={(event) =>
                                  updateInterestEntry(
                                    selectedInterest.id,
                                    entry.id,
                                    (currentEntry) => ({
                                      ...currentEntry,
                                      type: event.target
                                        .value as EditableInterestEntry['type'],
                                    }),
                                  )
                                }
                              >
                                <option value="Course">Course</option>
                                <option value="Event">Event</option>
                                <option value="Project">Project</option>
                                <option value="Blog">Blog</option>
                              </select>
                            </label>
                            <label>
                              Date
                              <input
                                type="date"
                                value={entry.date}
                                onChange={(event) =>
                                  updateInterestEntry(
                                    selectedInterest.id,
                                    entry.id,
                                    (currentEntry) => ({
                                      ...currentEntry,
                                      date: event.target.value,
                                    }),
                                  )
                                }
                              />
                            </label>
                            <button
                              type="button"
                              className="admin-text-button admin-text-button--danger"
                              onClick={() =>
                                removeInterestEntry(
                                  selectedInterest.id,
                                  entry.id,
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>

                          <label>
                            Title
                            <input
                              value={entry.title}
                              onChange={(event) =>
                                updateInterestEntry(
                                  selectedInterest.id,
                                  entry.id,
                                  (currentEntry) => ({
                                    ...currentEntry,
                                    title: event.target.value,
                                  }),
                                )
                              }
                            />
                          </label>

                          <label>
                            Description
                            <textarea
                              rows={3}
                              value={entry.description}
                              onChange={(event) =>
                                updateInterestEntry(
                                  selectedInterest.id,
                                  entry.id,
                                  (currentEntry) => ({
                                    ...currentEntry,
                                    description: event.target.value,
                                  }),
                                )
                              }
                            />
                          </label>

                          <div className="admin-card-editor-row">
                            <label className="admin-grow">
                              Tags
                              <input
                                value={entry.tags.join(', ')}
                                onChange={(event) =>
                                  updateInterestEntry(
                                    selectedInterest.id,
                                    entry.id,
                                    (currentEntry) => ({
                                      ...currentEntry,
                                      tags: event.target.value
                                        .split(',')
                                        .map((tag) => tag.trim())
                                        .filter(Boolean),
                                    }),
                                  )
                                }
                              />
                            </label>
                            <label className="admin-grow">
                              Link
                              <input
                                value={entry.href}
                                placeholder="/blogs/post-slug/ or https://..."
                                onChange={(event) =>
                                  updateInterestEntry(
                                    selectedInterest.id,
                                    entry.id,
                                    (currentEntry) => ({
                                      ...currentEntry,
                                      href: event.target.value,
                                    }),
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="admin-helper-text">
                        No entries yet. Add a course, event, project, or blog to
                        populate this interest section.
                      </p>
                    )}
                  </div>
                </section>

                <section className="admin-panel-card">
                  <div className="admin-panel-header">
                    <div>
                      <h3>Interest Export</h3>
                      <p>
                        Download or copy the updated <code>interests.ts</code>{' '}
                        source for the repository.
                      </p>
                    </div>
                  </div>

                  <div className="admin-export-list">
                    <button
                      type="button"
                      className="admin-action-button"
                      onClick={() =>
                        triggerDownload(
                          'interests.ts',
                          interestsDataSource,
                          'text/plain;charset=utf-8',
                        )
                      }
                    >
                      Download interests.ts
                    </button>
                    <button
                      type="button"
                      className="admin-action-button admin-action-button--ghost"
                      onClick={() =>
                        copyToClipboard('Interests source', interestsDataSource)
                      }
                    >
                      Copy interests.ts
                    </button>
                  </div>
                </section>
              </>
            ) : (
              <section className="admin-panel-card">
                <h3>No interest selected</h3>
                <p>Create a new interest track to start editing.</p>
              </section>
            )}
          </div>
        </div>
      ) : null}

      {activeTab === 'handoff' ? (
        <div className="admin-workspace admin-handoff">
          <section className="admin-panel-card">
            <div className="admin-panel-header">
              <div>
                <h3>GitHub Handoff</h3>
                <p>
                  Use these links after exporting files or images. Text files
                  can open directly in GitHub; images should be uploaded through
                  the repository web UI.
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
                <code>public/images/portrait-baojia.png</code> and{' '}
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
                  <span className="admin-card-disabled">
                    Waiting for repo slug
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
