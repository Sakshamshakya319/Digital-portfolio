import React, { useEffect, useState } from 'react';

export default function FeaturedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (res.ok && Array.isArray(data.blogs)) {
          // Get first 2 blogs
          setBlogs(data.blogs.slice(0, 2));
        }
      } catch (e) {
        console.error('Failed to load blogs:', e);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  function handleBlogClick(blog) {
    // Navigate to blogs page and open this blog
    window.__initialBlogSlug = blog.slug || blog._id;
    const event = new Event('click');
    const link = document.querySelector('[data-pg="blogs"]');
    if (link) link.dispatchEvent(event);
  }

  if (loading) {
    return (
      <div className="blog-duo">
        <div className="blog-mini">
          <div className="bm-cat">Loading...</div>
          <h3 className="bm-title">Fetching Blog Posts</h3>
          <p className="bm-exc">Loading latest posts from database...</p>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="blog-duo">
        <div className="blog-mini">
          <div className="bm-cat">No Posts</div>
          <h3 className="bm-title">No Blog Posts Yet</h3>
          <p className="bm-exc">
            Blog posts will appear here once they are published.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-duo">
      {blogs.map((blog, index) => (
        <div
          key={blog._id || index}
          className="blog-mini"
          onClick={() => handleBlogClick(blog)}
        >
          <div className="bm-cat">
            {blog.category} · {blog.readTime}
          </div>
          <h3 className="bm-title">{blog.title}</h3>
          <p className="bm-exc">
            {blog.meta || 'No description available'}
          </p>
          <div className="bm-meta">
            {blog.date} · {blog.keywords || 'Blog'}
          </div>
        </div>
      ))}
    </div>
  );
}
