import type { EditableInterestEntry } from './types';
import type { AdminStore } from './useAdminStore';
import { triggerDownload } from './utils';

interface InterestsTabProps {
  store: AdminStore;
}

export default function InterestsTab({ store }: InterestsTabProps) {
  const {
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
    copyToClipboard,
  } = store;

  return (
    <div className="admin-workspace admin-blog-studio">
      {/* Interest sidebar */}
      <aside className="admin-post-sidebar">
        <div className="admin-panel-header">
          <div>
            <h3>Interest Tracks</h3>
            <p>{interests.length} editable tracks for the gantt timeline.</p>
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
              <small>Since {interest.start}</small>
            </button>
          ))}
        </div>
      </aside>

      {/* Interest editor */}
      <div className="admin-blog-editor">
        {selectedInterest ? (
          <>
            {/* Interest metadata */}
            <section className="admin-panel-card">
              <div className="admin-panel-header">
                <div>
                  <h3>Selected Interest</h3>
                  <p>
                    Edit the timeline label, dates, color, and summary used by
                    the interests gantt.
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
                    onChange={(e) =>
                      updateInterest(selectedInterest.id, (i) => ({
                        ...i,
                        name: e.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Slug
                  <input
                    value={selectedInterest.slug}
                    onChange={(e) =>
                      updateInterest(selectedInterest.id, (i) => ({
                        ...i,
                        slug:
                          e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/^-+|-+$/g, '') || i.slug,
                      }))
                    }
                  />
                </label>
                <label>
                  Icon
                  <input
                    value={selectedInterest.icon}
                    onChange={(e) =>
                      updateInterest(selectedInterest.id, (i) => ({
                        ...i,
                        icon: e.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Accent Color
                  <input
                    type="color"
                    value={selectedInterest.accent}
                    onChange={(e) =>
                      updateInterest(selectedInterest.id, (i) => ({
                        ...i,
                        accent: e.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  Start Date
                  <input
                    type="date"
                    value={selectedInterest.start}
                    onChange={(e) =>
                      updateInterest(selectedInterest.id, (i) => ({
                        ...i,
                        start: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="admin-form-grid-wide">
                  Track Label
                  <input
                    value={selectedInterest.trackLabel}
                    onChange={(e) =>
                      updateInterest(selectedInterest.id, (i) => ({
                        ...i,
                        trackLabel: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="admin-form-grid-wide">
                  Summary
                  <textarea
                    rows={3}
                    value={selectedInterest.summary}
                    onChange={(e) =>
                      updateInterest(selectedInterest.id, (i) => ({
                        ...i,
                        summary: e.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className="admin-stack">
                <p className="admin-helper-text">
                  <strong>Timeline:</strong> {selectedInterest.start} → Now
                </p>
                <div
                  style={{
                    height: '18px',
                    borderRadius: '4px',
                    background: `linear-gradient(135deg, ${selectedInterest.accent}, color-mix(in srgb, ${selectedInterest.accent} 54%, white))`,
                    width: '100%',
                  }}
                />
              </div>
            </section>

            {/* Timeline Preview */}
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
                  <div className="admin-interest-preview-row" key={interest.id}>
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
                      Since {interest.start}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Interest Entries */}
            <section className="admin-panel-card">
              <div className="admin-panel-header">
                <div>
                  <h3>Interest Entries</h3>
                  <p>
                    Courses, events, projects, and blog links that appear under
                    this interest.
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
                            onChange={(e) =>
                              updateInterestEntry(
                                selectedInterest.id,
                                entry.id,
                                (cur) => ({
                                  ...cur,
                                  type: e.target
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
                            onChange={(e) =>
                              updateInterestEntry(
                                selectedInterest.id,
                                entry.id,
                                (cur) => ({
                                  ...cur,
                                  date: e.target.value,
                                }),
                              )
                            }
                          />
                        </label>
                        <button
                          type="button"
                          className="admin-text-button admin-text-button--danger"
                          onClick={() =>
                            removeInterestEntry(selectedInterest.id, entry.id)
                          }
                        >
                          Delete
                        </button>
                      </div>

                      <label>
                        Title
                        <input
                          value={entry.title}
                          onChange={(e) =>
                            updateInterestEntry(
                              selectedInterest.id,
                              entry.id,
                              (cur) => ({ ...cur, title: e.target.value }),
                            )
                          }
                        />
                      </label>

                      <label>
                        Description
                        <textarea
                          rows={3}
                          value={entry.description}
                          onChange={(e) =>
                            updateInterestEntry(
                              selectedInterest.id,
                              entry.id,
                              (cur) => ({
                                ...cur,
                                description: e.target.value,
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
                            onChange={(e) =>
                              updateInterestEntry(
                                selectedInterest.id,
                                entry.id,
                                (cur) => ({
                                  ...cur,
                                  tags: e.target.value
                                    .split(',')
                                    .map((t) => t.trim())
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
                            onChange={(e) =>
                              updateInterestEntry(
                                selectedInterest.id,
                                entry.id,
                                (cur) => ({ ...cur, href: e.target.value }),
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

            {/* Interest Export */}
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
  );
}
