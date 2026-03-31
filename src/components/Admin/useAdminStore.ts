import { useEffect, useRef, useState } from 'react';

import type { BlogCollection } from '@/data/blogs';
import type { Interest } from '@/data/interests';
import type { Post } from '@/lib/posts';
import { PORTRAIT_IMAGE } from '@/lib/utils';

import type {
  AdminTab,
  AvatarDraft,
  EditableAsset,
  EditableCard,
  EditableCollection,
  EditableInterest,
  EditableInterestEntry,
  EditablePost,
  EditableTag,
} from './types';
import {
  buildAboutModuleSource,
  buildBlogsDataSource,
  buildInterestsDataSource,
  createId,
  extractExtension,
  readFileAsDataUrl,
  STORAGE_KEY,
  slugify,
  splitAboutIntro,
  toSeedCards,
  toSeedCollections,
  toSeedInterests,
  toSeedPosts,
  toSeedTags,
} from './utils';

interface AdminStoreInit {
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
}

export function useAdminStore({
  initialAboutMarkdown,
  initialAboutCards,
  initialPosts,
  initialCollections,
  initialTagLabels,
  initialInterests,
}: AdminStoreInit) {
  const initialParagraphs = splitAboutIntro(initialAboutMarkdown);
  const initialCards = toSeedCards(initialAboutCards);
  const initialCollectionsDraft = toSeedCollections(initialCollections);
  const initialTagsDraft = toSeedTags(initialTagLabels);
  const initialPostsDraft = toSeedPosts(initialPosts);
  const initialInterestsDraft = toSeedInterests(initialInterests);

  const [activeTab, setActiveTab] = useState<AdminTab>('about');
  const [aboutParagraphs, setAboutParagraphs] =
    useState<string[]>(initialParagraphs);
  const [aboutCards, setAboutCards] = useState<EditableCard[]>(initialCards);
  const [collections, setCollections] = useState<EditableCollection[]>(
    initialCollectionsDraft,
  );
  const [tags, setTags] = useState<EditableTag[]>(initialTagsDraft);
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
    fileName: 'portrait-bonita.png',
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const [flashMessage, setFlashMessage] = useState('');

  const contentRef = useRef<HTMLTextAreaElement>(null);

  // ── Persistence ──

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved) as {
        activeTab?: AdminTab;
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

      if (parsed.activeTab) setActiveTab(parsed.activeTab);
      if (parsed.aboutParagraphs?.length)
        setAboutParagraphs(parsed.aboutParagraphs);
      if (parsed.aboutCards?.length) setAboutCards(parsed.aboutCards);
      if (parsed.collections?.length) setCollections(parsed.collections);
      if (parsed.tags?.length) setTags(parsed.tags);
      if (parsed.posts?.length) setPosts(parsed.posts);
      if (parsed.selectedPostId) setSelectedPostId(parsed.selectedPostId);
      if (parsed.interests?.length) setInterests(parsed.interests);
      if (parsed.selectedInterestId)
        setSelectedInterestId(parsed.selectedInterestId);
      if (parsed.avatarDraft) setAvatarDraft(parsed.avatarDraft);
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

  // ── Flash auto-dismiss ──

  useEffect(() => {
    if (!flashMessage) return;
    const timeoutId = window.setTimeout(() => setFlashMessage(''), 2800);
    return () => window.clearTimeout(timeoutId);
  }, [flashMessage]);

  // ── Avatar canvas crop ──

  useEffect(() => {
    if (!avatarDraft.source || typeof window === 'undefined') return;

    let isCancelled = false;
    const image = new window.Image();

    image.onload = () => {
      if (isCancelled) return;

      const size = 512;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

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

  // ── Selection sync ──

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

  // ── Derived state ──

  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;
  const selectedInterest =
    interests.find((interest) => interest.id === selectedInterestId) || null;
  const aboutModuleSource = buildAboutModuleSource(
    aboutParagraphs,
    aboutCards,
    avatarDraft.output ? '/images/portrait-bonita.png' : PORTRAIT_IMAGE,
  );
  const blogsDataSource = buildBlogsDataSource(collections, tags);
  const interestsDataSource = buildInterestsDataSource(interests);

  // ── Actions ──

  function flash(message: string) {
    setFlashMessage(message);
  }

  async function copyToClipboard(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      flash(`${label} copied.`);
    } catch {
      flash(`Unable to copy ${label.toLowerCase()}.`);
    }
  }

  function resetStudio() {
    const confirmed = window.confirm(
      'Reset the admin studio to the repository content and remove local draft data?',
    );
    if (!confirmed) return;

    window.localStorage.removeItem(STORAGE_KEY);
    setActiveTab('about');
    setAboutParagraphs(initialParagraphs);
    setAboutCards(initialCards);
    setCollections(initialCollectionsDraft);
    setTags(initialTagsDraft);
    setPosts(initialPostsDraft);
    setSelectedPostId(initialPostsDraft[0]?.id || '');
    setInterests(initialInterestsDraft);
    setSelectedInterestId(initialInterestsDraft[0]?.id || '');
    setAvatarDraft({
      source: '',
      output: '',
      fileName: 'portrait-bonita.png',
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
    flash('Studio reset to repository content.');
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

  function removeParagraph(index: number) {
    setAboutParagraphs((current) => current.filter((_, i) => i !== index));
  }

  function updateParagraph(index: number, value: string) {
    setAboutParagraphs((current) =>
      current.map((p, i) => (i === index ? value : p)),
    );
  }

  function updateAboutCard(
    cardId: string,
    field: 'emoji' | 'title' | 'description',
    value: string,
  ) {
    setAboutCards((current) =>
      current.map((card) =>
        card.id === cardId ? { ...card, [field]: value } : card,
      ),
    );
  }

  function removeAboutCard(cardId: string) {
    setAboutCards((current) => current.filter((card) => card.id !== cardId));
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
    if (!file) return;

    const preview = await readFileAsDataUrl(file);
    setAvatarDraft({
      source: preview,
      output: preview,
      fileName: `portrait-bonita${extractExtension(file.name)}`,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });
    flash('Avatar uploaded. Adjust the crop and export when ready.');
  }

  async function handleCoverUpload(files: FileList | null) {
    if (!selectedPost) return;
    const file = files?.[0];
    if (!file) return;

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
    flash('Cover uploaded for the selected post.');
  }

  async function handleInlineImageUpload(files: FileList | null) {
    if (!selectedPost || !files?.length) return;

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
    flash(
      `${uploads.length} inline image${uploads.length > 1 ? 's' : ''} added.`,
    );
  }

  function insertImageMarkdown(asset: EditableAsset) {
    if (!selectedPost) return;

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

      return { ...post, content: nextContent };
    });
    flash('Markdown image snippet inserted into the post body.');
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
    flash('New blog draft created.');
  }

  function deleteSelectedPost() {
    if (!selectedPost) return;
    const confirmed = window.confirm(
      `Delete "${selectedPost.title}" from the local admin draft?`,
    );
    if (!confirmed) return;

    setPosts((current) =>
      current.filter((post) => post.id !== selectedPost.id),
    );
    flash('Selected blog draft removed from the admin studio.');
  }

  function addTag() {
    const nextTag: EditableTag = {
      id: createId('tag'),
      slug: `new-tag-${tags.length + 1}`,
      label: 'New Tag',
    };
    setTags((current) => [...current, nextTag]);
    flash('Tag added.');
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
    flash('Collection added.');
  }

  function updateTagField(
    tagId: string,
    field: 'slug' | 'label',
    value: string,
  ) {
    setTags((current) => {
      const existing = current.find((tag) => tag.id === tagId);
      if (!existing) return current;

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
      const existing = current.find((c) => c.id === collectionId);
      if (!existing) return current;

      if (field === 'slug') {
        const nextSlug = slugify(value) || existing.slug;
        setPosts((postList) =>
          postList.map((post) => ({
            ...post,
            collection:
              post.collection === existing.slug ? nextSlug : post.collection,
          })),
        );
        return current.map((c) =>
          c.id === collectionId ? { ...c, slug: nextSlug } : c,
        );
      }

      return current.map((c) =>
        c.id === collectionId ? { ...c, [field]: value } : c,
      );
    });
  }

  function removeTag(tagId: string) {
    const existing = tags.find((tag) => tag.id === tagId);
    if (!existing) return;

    setTags((current) => current.filter((tag) => tag.id !== tagId));
    setPosts((current) =>
      current.map((post) => ({
        ...post,
        tags: post.tags.filter((tag) => tag !== existing.slug),
      })),
    );
  }

  function removeCollection(collectionId: string) {
    const existing = collections.find((c) => c.id === collectionId);
    if (!existing) return;

    setCollections((current) => current.filter((c) => c.id !== collectionId));
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
    flash('New interest track created.');
  }

  function deleteSelectedInterest() {
    if (!selectedInterest) return;
    const confirmed = window.confirm(
      `Delete "${selectedInterest.name}" from the local admin draft?`,
    );
    if (!confirmed) return;

    setInterests((current) =>
      current.filter((interest) => interest.id !== selectedInterest.id),
    );
    flash('Selected interest removed from the admin studio.');
  }

  function addInterestEntry() {
    if (!selectedInterest) return;

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
    flash('Interest entry added.');
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

  return {
    // Tab
    activeTab,
    setActiveTab,

    // Flash
    flashMessage,
    flash,

    // About
    aboutParagraphs,
    aboutCards,
    aboutModuleSource,
    avatarDraft,
    setAvatarDraft,
    addParagraph,
    removeParagraph,
    updateParagraph,
    addAboutCard,
    updateAboutCard,
    removeAboutCard,
    handleAvatarUpload,
    copyToClipboard,

    // Blogs
    posts,
    tags,
    collections,
    selectedPost,
    selectedPostId,
    setSelectedPostId,
    blogsDataSource,
    contentRef,
    updatePost,
    addPost,
    deleteSelectedPost,
    addTag,
    addCollection,
    updateTagField,
    updateCollectionField,
    removeTag,
    removeCollection,
    handleCoverUpload,
    handleInlineImageUpload,
    insertImageMarkdown,

    // Interests
    interests,
    selectedInterest,
    selectedInterestId,
    setSelectedInterestId,
    interestsDataSource,
    updateInterest,
    addInterest,
    deleteSelectedInterest,
    addInterestEntry,
    updateInterestEntry,
    removeInterestEntry,

    // Global
    resetStudio,
  };
}

export type AdminStore = ReturnType<typeof useAdminStore>;
