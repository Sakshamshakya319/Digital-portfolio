import React, { useEffect, useMemo, useState } from 'react';
import BlogReader from './BlogReader.jsx';

const categories = ['all', 'Next.js', 'Career', 'Backend', 'Frontend'];

export default function BlogTable() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [activeBlogId, setActiveBlogId] = useState(null);

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
        setActiveBlogId(match._id);
      }
      window.__initialBlogSlug = '';
    }
  }, [blogs]);

  function openBlog(blogId) {
    setActiveBlogId(blogId);
  }

  function closeBlog() {
    setActiveBlogId(null);
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
      {activeBlogId ? (
        <BlogReader blogId={activeBlogId} onClose={closeBlog} />
      ) : (
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
                  <div className="br-m">Check Firebase connection or API route.</div>
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
                  onClick={() => openBlog(b._id)}
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
        </>
      )}
    </>
  );
}
