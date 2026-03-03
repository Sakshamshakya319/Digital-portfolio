import React, { useEffect, useMemo, useState } from 'react';

const categories = ['all', 'fullstack', 'frontend', 'backend', 'extension'];

export default function ProjectTable() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) {
          throw new Error('Failed to load projects');
        }
        const data = await res.json();
        if (!cancelled) {
          setProjects(Array.isArray(data.projects) ? data.projects : []);
          setError('');
        }
      } catch (e) {
        if (!cancelled) {
          setError('Unable to load projects right now.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!projects.length) {
      return;
    }
    const slug = window.__initialProjectSlug;
    if (slug) {
      const match = projects.find(p => p.slug === slug);
      if (match) {
        openProject(match);
      }
      window.__initialProjectSlug = '';
    }
  }, [projects]);

  function openProject(p) {
    setActiveProject(p);
  }

  function closeProject() {
    setActiveProject(null);
  }

  async function handleShare() {
    if (!activeProject) {
      return;
    }
    const slug = activeProject.slug || activeProject._id;
    const url = `${window.location.origin}/project/${slug}`;
    const title = activeProject.title || 'Project';
    const text = activeProject.summary || title;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setShareMessage('Project shared.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareMessage('Link copied to clipboard.');
      } else {
        setShareMessage(url);
      }
    } catch (e) {
      setShareMessage('');
    }
    if (shareMessage) {
      return;
    }
    if (!navigator.share && !navigator.clipboard) {
      return;
    }
    setTimeout(() => {
      setShareMessage('');
    }, 3500);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(p => {
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      if (!q) {
        return true;
      }
      const keywords = [
        p.title || '',
        p.summary || '',
        p.category || '',
        p.tags || ''
      ]
        .join(' ')
        .toLowerCase();
      return keywords.includes(q);
    });
  }, [projects, activeCategory, query]);

  return (
    <>
      <div className="bc">
        <div className="srch-wrap">
          <span className="srch-ic">🔍</span>
          <input
            className="srch"
            type="text"
            placeholder="Search projects..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            className={`fb${activeCategory === cat ? ' on' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="btab">
        <div className="bth">
          <div>#</div>
          <div>Project</div>
          <div>Status</div>
          <div>→</div>
        </div>
        {loading && (
          <div className="brow">
            <div className="br-n">..</div>
            <div>
              <div className="br-cat">Loading</div>
              <div className="br-t">Fetching projects from database...</div>
              <div className="br-m">Please wait</div>
            </div>
            <div className="br-rd">...</div>
            <div className="br-ar">→</div>
          </div>
        )}
        {error && !loading && (
          <div className="brow">
            <div className="br-n">!!</div>
            <div>
              <div className="br-cat">Error</div>
              <div className="br-t">{error}</div>
              <div className="br-m">Check Firebase connection or API route.</div>
            </div>
            <div className="br-rd">Now</div>
            <div className="br-ar">→</div>
          </div>
        )}
        {!loading &&
          !error &&
          filtered.map((p, index) => (
            <div
              key={p._id || p.slug || p.title || index}
              className="brow"
              onClick={() => openProject(p)}
            >
              <div className="br-n">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="br-cat">
                  {p.type || p.category} · {p.date}
                </div>
                <div className="br-t">{p.title}</div>
                <div className="br-m">{p.summary}</div>
              </div>
              <div className="br-rd">{p.status || 'Completed'}</div>
              <div className="br-ar">→</div>
            </div>
          ))}
        {!loading && !error && filtered.length === 0 && (
          <div className="brow">
            <div className="br-n">--</div>
            <div>
              <div className="br-cat">No results</div>
              <div className="br-t">No projects match your search.</div>
              <div className="br-m">Try another keyword or category.</div>
            </div>
            <div className="br-rd">Now</div>
            <div className="br-ar">→</div>
          </div>
        )}
      </div>
      {activeProject && (
        <div className="modal-overlay" onClick={closeProject}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={closeProject}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="blog-reader">
              <div className="blog-reader-head">
                <div className="blog-reader-eyebrow">
                  {activeProject.type || activeProject.category} · {activeProject.date}
                </div>
                <h3 className="blog-reader-title">
                  {activeProject.title}
                </h3>
                <div className="blog-reader-meta">
                  <span>{activeProject.status || 'Completed'}</span>
                  {activeProject.tags && (
                    <span>{activeProject.tags}</span>
                  )}
                </div>
              </div>
              {activeProject.imageUrl && (
                <div className="blog-reader-image">
                  <img
                    src={activeProject.imageUrl}
                    alt={activeProject.title}
                  />
                </div>
              )}
              <div className="blog-reader-body">
                {(activeProject.body || activeProject.summary || '')
                  .split(/\n{2,}/)
                  .filter(Boolean)
                  .map((p, idx) => (
                    <p key={String(idx)}>{p}</p>
                  ))}
              </div>
              <div className="blog-reader-actions">
                {activeProject.liveUrl && (
                  <a
                    className="blog-btn"
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ↗ Live Demo
                  </a>
                )}
                {activeProject.githubUrl && (
                  <a
                    className="blog-btn"
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    ⌥ GitHub
                  </a>
                )}
                <button
                  type="button"
                  className="blog-btn share"
                  onClick={handleShare}
                >
                  ↗ Share
                </button>
                <button
                  type="button"
                  className="blog-btn ghost"
                  onClick={closeProject}
                >
                  Close
                </button>
                {shareMessage && (
                  <div className="blog-share-hint">
                    {shareMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
