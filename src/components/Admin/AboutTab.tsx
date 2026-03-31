import { PORTRAIT_IMAGE } from '@/lib/utils';

import type { AdminStore } from './useAdminStore';
import {
  buildAboutModuleSource,
  triggerDataUrlDownload,
  triggerDownload,
} from './utils';

interface AboutTabProps {
  store: AdminStore;
}

export default function AboutTab({ store }: AboutTabProps) {
  const {
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
    flash,
  } = store;

  return (
    <div className="admin-workspace admin-workspace--split">
      <div className="admin-column">
        {/* Avatar */}
        <section className="admin-panel-card">
          <div className="admin-panel-header">
            <div>
              <h3>Avatar</h3>
              <p>
                Upload a portrait, adjust the crop, and export a square file.
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
                  onChange={(e) => handleAvatarUpload(e.target.files)}
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
                    onChange={(e) =>
                      setAvatarDraft((cur) => ({
                        ...cur,
                        zoom: Number(e.target.value),
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
                    onChange={(e) =>
                      setAvatarDraft((cur) => ({
                        ...cur,
                        offsetX: Number(e.target.value),
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
                    onChange={(e) =>
                      setAvatarDraft((cur) => ({
                        ...cur,
                        offsetY: Number(e.target.value),
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
                  <code>/public/images/portrait-bonita.png</code>
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
                      : flash('Upload an avatar before exporting.')
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
                          ? '/images/portrait-bonita.png'
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

        {/* Intro Paragraphs */}
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
                      onClick={() => removeParagraph(index)}
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
                <textarea
                  value={paragraph}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  rows={5}
                />
              </div>
            ))}
          </div>
        </section>

        {/* About Cards */}
        <section className="admin-panel-card">
          <div className="admin-panel-header">
            <div>
              <h3>About Cards</h3>
              <p>
                Change the icon, title, or description for each summary card,
                then add or remove as needed.
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
                      onChange={(e) =>
                        updateAboutCard(card.id, 'emoji', e.target.value)
                      }
                    />
                  </label>
                  <label className="admin-grow">
                    Title
                    <input
                      value={card.title}
                      onChange={(e) =>
                        updateAboutCard(card.id, 'title', e.target.value)
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="admin-text-button admin-text-button--danger"
                    onClick={() => removeAboutCard(card.id)}
                  >
                    Delete
                  </button>
                </div>
                <label>
                  Description
                  <textarea
                    value={card.description}
                    rows={3}
                    onChange={(e) =>
                      updateAboutCard(card.id, 'description', e.target.value)
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="admin-column">
        {/* Preview */}
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

        {/* Export */}
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
                  store.blogsDataSource,
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
  );
}
