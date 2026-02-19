import React, { useEffect, useMemo, useState } from 'react';

const categories = ['all', 'Next.js', 'Career', 'Backend', 'Frontend'];

export default function BlogTable() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [activeBlog, setActiveBlog] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [likeBusy, setLikeBusy] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/blogs');
        if (!res.ok) {
          throw new Error('Failed to load blogs');
        }
        const data = await res.json();
        if (!cancelled) {
          setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
          setError('');
        }
      } catch (e) {
        if (!cancelled) {
          setError('Unable to load blog posts right now.');
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
    if (!blogs.length) {
      return;
    }
    const slug = window.__initialBlogSlug;
    if (slug) {
      const match = blogs.find(b => b.slug === slug);
      if (match) {
        openBlog(match);
      }
      window.__initialBlogSlug = '';
    }
  }, [blogs]);

  async function openBlog(b) {
    setDetailError('');
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/blogs?id=${encodeURIComponent(b._id)}`);
      if (!res.ok) {
        throw new Error('Failed to load blog');
      }
      const data = await res.json();
      const blog = data && data.blog ? data.blog : b;
      setActiveBlog(blog);
    } catch (e) {
      setDetailError('Unable to open this article right now.');
    } finally {
      setDetailLoading(false);
    }
  }

  function closeBlog() {
    setActiveBlog(null);
    setDetailError('');
  }

  async function handleLike() {
    if (!activeBlog || likeBusy) {
      return;
    }
    setLikeBusy(true);
    try {
      const res = await fetch('/api/blogs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: activeBlog._id })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return;
      }
      const nextLikes = data.likes || 0;
      setActiveBlog(prev =>
        prev ? { ...prev, likes: nextLikes } : prev
      );
      setBlogs(prev =>
        prev.map(b =>
          b._id === activeBlog._id ? { ...b, likes: nextLikes } : b
        )
      );
    } catch (e) {
    } finally {
      setLikeBusy(false);
    }
  }

  async function handleShare() {
    if (!activeBlog) {
      return;
    }
    const slug = activeBlog.slug || activeBlog._id;
    const url = `${window.location.origin}/blog/${slug}`;
    const title = activeBlog.title || 'Blog post';
    const text = activeBlog.meta || title;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setShareMessage('Article shared.');
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
    return blogs.filter(b => {
      if (activeCategory !== 'all' && b.category !== activeCategory) {
        return false;
      }
      if (!q) {
        return true;
      }
      const keywords = [
        b.title || '',
        b.meta || '',
        b.category || '',
        b.keywords || ''
      ]
        .join(' ')
        .toLowerCase();
      return keywords.includes(q);
    });
  }, [blogs, activeCategory, query]);

  return (
    <>
      <div className="bc">
        <div className="srch-wrap">
          <span className="srch-ic">🔍</span>
          <input
            className="srch"
            type="text"
            placeholder="Search articles..."
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
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>
      <div className="btab">
        <div className="bth">
          <div>#</div>
          <div>Article</div>
          <div>Date</div>
          <div>→</div>
        </div>
        {loading && (
          <div className="brow">
            <div className="br-n">..</div>
            <div>
              <div className="br-cat">Loading</div>
              <div className="br-t">Fetching latest posts from database...</div>
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
              <div className="br-m">Check MongoDB connection or API route.</div>
            </div>
            <div className="br-rd">Now</div>
            <div className="br-ar">→</div>
          </div>
        )}
        {!loading &&
          !error &&
          filtered.map((b, index) => (
            <div
              key={b._id || b.slug || b.title || index}
              className="brow"
              onClick={() => openBlog(b)}
            >
              <div className="br-n">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="br-cat">
                  {b.category} · {b.readTime}
                </div>
                <div className="br-t">{b.title}</div>
                <div className="br-m">{b.meta}</div>
              </div>
              <div className="br-rd">{b.date}</div>
              <div className="br-ar">→</div>
            </div>
          ))}
        {!loading && !error && filtered.length === 0 && (
          <div className="brow">
            <div className="br-n">--</div>
            <div>
              <div className="br-cat">No results</div>
              <div className="br-t">No blog posts match your search.</div>
              <div className="br-m">Try another keyword or category.</div>
            </div>
            <div className="br-rd">Now</div>
            <div className="br-ar">→</div>
          </div>
        )}
      </div>
      {(detailLoading || activeBlog || detailError) && (
        <div className="blog-reader">
          {detailLoading && !activeBlog && (
            <div className="blog-reader-info">
              Loading article…
            </div>
          )}
          {detailError && !detailLoading && !activeBlog && (
            <div className="blog-reader-error">
              {detailError}
            </div>
          )}
          {activeBlog && (
            <>
              <div className="blog-reader-head">
                <div className="blog-reader-eyebrow">
                  {activeBlog.category} · {activeBlog.readTime}
                </div>
                <h3 className="blog-reader-title">
                  {activeBlog.title}
                </h3>
                <div className="blog-reader-meta">
                  <span>{activeBlog.date}</span>
                  <span>
                    {activeBlog.likes || 0} likes
                  </span>
                </div>
              </div>
              {activeBlog.imageUrl && (
                <div className="blog-reader-image">
                  <img
                    src={activeBlog.imageUrl}
                    alt={activeBlog.title}
                  />
                </div>
              )}
              <div className="blog-reader-body">
                {(activeBlog.body || activeBlog.meta || '')
                  .split(/\n{2,}/)
                  .filter(Boolean)
                  .map((p, idx) => (
                    <p key={String(idx)}>{p}</p>
                  ))}
              </div>
              <div className="blog-reader-actions">
                <button
                  type="button"
                  className="blog-btn like"
                  onClick={handleLike}
                  disabled={likeBusy}
                >
                  {likeBusy ? 'Liking…' : '♥ Like'}
                </button>
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
                  onClick={closeBlog}
                >
                  Close
                </button>
                {shareMessage && (
                  <div className="blog-share-hint">
                    {shareMessage}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

