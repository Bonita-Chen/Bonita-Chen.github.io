import type { AdminStore } from './useAdminStore';
import {
  buildPostMarkdown,
  triggerDataUrlDownload,
  triggerDownload,
} from './utils';

interface BlogsTabProps {
  store: AdminStore;
}

export default function BlogsTab({ store }: BlogsTabProps) {
  const {
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
    copyToClipboard,
    flash,
  } = store;

  return (
    <div className="admin-workspace admin-blog-studio">
      {/* Post sidebar */}
      <aside className="admin-post-sidebar">
        <div className="admin-panel-header">
          <div>
            <h3>Posts</h3>
            <p>{posts.length} drafts in this local studio.</p>
          </div>
          <button type="button" className="admin-mini-button" onClick={addPost}>
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

      {/* Post editor */}
      <div className="admin-blog-editor">
        {selectedPost ? (
          <>
            {/* Metadata */}
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
                    onChange={(e) =>
                      updatePost(selectedPost.id, (p) => ({
                        ...p,
                        title: e.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Slug
                  <input
                    value={selectedPost.slug}
                    onChange={(e) =>
                      updatePost(selectedPost.id, (p) => ({
                        ...p,
                        slug:
                          e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '') || p.slug,
                      }))
                    }
                  />
                </label>
                <label>
                  Date
                  <input
                    type="date"
                    value={selectedPost.date}
                    onChange={(e) =>
                      updatePost(selectedPost.id, (p) => ({
                        ...p,
                        date: e.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Icon
                  <input
                    value={selectedPost.icon}
                    onChange={(e) =>
                      updatePost(selectedPost.id, (p) => ({
                        ...p,
                        icon: e.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Collection
                  <select
                    value={selectedPost.collection}
                    onChange={(e) =>
                      updatePost(selectedPost.id, (p) => ({
                        ...p,
                        collection: e.target.value,
                      }))
                    }
                  >
                    <option value="">None</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-form-grid-wide">
                  Description
                  <textarea
                    rows={3}
                    value={selectedPost.description}
                    onChange={(e) =>
                      updatePost(selectedPost.id, (p) => ({
                        ...p,
                        description: e.target.value,
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
                    onChange={(e) =>
                      updatePost(selectedPost.id, (p) => ({
                        ...p,
                        featured: e.target.checked,
                      }))
                    }
                  />
                  Featured
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedPost.draft}
                    onChange={(e) =>
                      updatePost(selectedPost.id, (p) => ({
                        ...p,
                        draft: e.target.checked,
                      }))
                    }
                  />
                  Draft
                </label>
              </div>
            </section>

            {/* Cover Image */}
            <section className="admin-panel-card">
              <div className="admin-panel-header">
                <div>
                  <h3>Cover Image</h3>
                  <p>
                    Upload a replacement cover or point the post to a new path.
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
                      onChange={(e) =>
                        updatePost(selectedPost.id, (p) => ({
                          ...p,
                          image: e.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="admin-file-input">
                    <span>Upload Cover</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCoverUpload(e.target.files)}
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
                          : flash('Upload a cover before downloading it.')
                      }
                    >
                      Download Cover
                    </button>
                    <button
                      type="button"
                      className="admin-text-button admin-text-button--danger"
                      onClick={() =>
                        updatePost(selectedPost.id, (p) => ({
                          ...p,
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

            {/* Tags */}
            <section className="admin-panel-card">
              <div className="admin-panel-header">
                <div>
                  <h3>Tags</h3>
                  <p>
                    Attach existing tags to this post, then edit the global tag
                    labels below.
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
                        updatePost(selectedPost.id, (p) => ({
                          ...p,
                          tags: p.tags.filter((t) => t !== tag),
                        }))
                      }
                    >
                      {tags.find((item) => item.slug === tag)?.label || tag} ×
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
                        updatePost(selectedPost.id, (p) => ({
                          ...p,
                          tags: [...p.tags, tag.slug],
                        }))
                      }
                    >
                      + {tag.label}
                    </button>
                  ))}
              </div>
            </section>

            {/* Tag & Collection Managers */}
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
                            onChange={(e) =>
                              updateTagField(tag.id, 'slug', e.target.value)
                            }
                          />
                        </label>
                        <label className="admin-grow">
                          Label
                          <input
                            value={tag.label}
                            onChange={(e) =>
                              updateTagField(tag.id, 'label', e.target.value)
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
                    <p>Update blog collections, emojis, and descriptions.</p>
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
                            onChange={(e) =>
                              updateCollectionField(
                                collection.id,
                                'emoji',
                                e.target.value,
                              )
                            }
                          />
                        </label>
                        <label className="admin-grow">
                          Label
                          <input
                            value={collection.label}
                            onChange={(e) =>
                              updateCollectionField(
                                collection.id,
                                'label',
                                e.target.value,
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
                            onChange={(e) =>
                              updateCollectionField(
                                collection.id,
                                'slug',
                                e.target.value,
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
                          onChange={(e) =>
                            updateCollectionField(
                              collection.id,
                              'description',
                              e.target.value,
                            )
                          }
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Inline Images */}
            <section className="admin-panel-card">
              <div className="admin-panel-header">
                <div>
                  <h3>Inline Images</h3>
                  <p>
                    Upload images, edit alt text, then insert markdown into the
                    post body.
                  </p>
                </div>
                <label className="admin-file-input">
                  <span>Add Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleInlineImageUpload(e.target.files)}
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
                            onChange={(e) =>
                              updatePost(selectedPost.id, (p) => ({
                                ...p,
                                inlineImages: p.inlineImages.map((img) =>
                                  img.id === asset.id
                                    ? { ...img, alt: e.target.value }
                                    : img,
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
                              triggerDataUrlDownload(asset.name, asset.preview)
                            }
                          >
                            Download File
                          </button>
                          <button
                            type="button"
                            className="admin-text-button admin-text-button--danger"
                            onClick={() =>
                              updatePost(selectedPost.id, (p) => ({
                                ...p,
                                inlineImages: p.inlineImages.filter(
                                  (img) => img.id !== asset.id,
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

            {/* Markdown Body */}
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
                onChange={(e) =>
                  updatePost(selectedPost.id, (p) => ({
                    ...p,
                    content: e.target.value,
                  }))
                }
              />
            </section>

            {/* Post Export */}
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
  );
}
