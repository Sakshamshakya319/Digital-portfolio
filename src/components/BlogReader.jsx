import React, { useEffect, useState } from 'react';

export default function BlogReader({ blogId, onClose }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (!blogId) return;
    
    setLoading(true);
    setError('');
    
    fetch(`/api/blogs?id=${blogId}`)
      .then(res => res.json())
      .then(data => {
        if (data.blog) {
          setBlog(data.blog);
          setLikes(data.blog.likes || 0);
        } else {
          setError('Blog not found');
        }
      })
      .catch(() => {
        setError('Failed to load blog');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [blogId]);

  async function handleLike() {
    if (!blog) return;
    
    try {
      const res = await fetch('/api/blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: blog._id })
      });
      const data = await res.json();
      if (data.ok && typeof data.likes === 'number') {
        setLikes(data.likes);
      }
    } catch (e) {
      // Silent fail
    }
  }

  async function handleShare() {
    if (!blog) return;
    
    const slug = blog.slug || blog._id;
    const url = `${window.location.origin}/blog/${slug}`;
    const title = blog.title || 'Blog';
    const text = blog.meta || title;
    
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        setShareMessage('Blog shared.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareMessage('Link copied to clipboard.');
      } else {
        setShareMessage(url);
      }
    } catch (e) {
      // User cancelled share
    }
    
    if (shareMessage) return;
    
    if (!navigator.share && !navigator.clipboard) return;
    
    setTimeout(() => {
      setShareMessage('');
    }, 3500);
  }

  if (loading) {
    return (
      <div className="blog-reader-wrap">
        <div className="blog-reader-full">
          <button className="reader-back" onClick={onClose}>
            ← Back to Blogs
          </button>
          <div className="blog-reader-info">Loading blog...</div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-reader-wrap">
        <div className="blog-reader-full">
          <button className="reader-back" onClick={onClose}>
            ← Back to Blogs
          </button>
          <div className="blog-reader-error">{error || 'Blog not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-reader-wrap">
      <div className="blog-reader-full">
        <button className="reader-back" onClick={onClose}>
          ← Back to Blogs
        </button>
        
        <div className="blog-reader-head">
          <div className="blog-reader-eyebrow">
            {blog.category} · {blog.readTime}
          </div>
          <h1 className="blog-reader-title">{blog.title}</h1>
          <div className="blog-reader-meta">
            <span>{blog.date}</span>
            {blog.keywords && <span>Keywords: {blog.keywords}</span>}
          </div>
        </div>

        {blog.imageUrl && (
          <div className="blog-reader-image">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="blog-reader-body">
          {blog.meta && (
            <p style={{ 
              fontSize: '1.15rem', 
              color: 'var(--tx)', 
              fontWeight: '500',
              marginBottom: '2rem',
              lineHeight: '1.7'
            }}>
              {blog.meta}
            </p>
          )}
          
          {blog.body ? (
            <div
              className="blog-reader-html"
              dangerouslySetInnerHTML={{ __html: blog.body }}
            />
          ) : (
            <p>No content available.</p>
          )}
        </div>

        <div className="blog-reader-actions">
          <button
            type="button"
            className="blog-btn like"
            onClick={handleLike}
          >
            ❤ Like ({likes})
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
            onClick={onClose}
          >
            Close
          </button>
          {shareMessage && (
            <div className="blog-share-hint">{shareMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}
