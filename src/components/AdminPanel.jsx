import React, { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);

  const [tab, setTab] = useState('create');

  const [blogTitle, setBlogTitle] = useState('');
  const [blogMeta, setBlogMeta] = useState('');
  const [blogCategory, setBlogCategory] = useState('Next.js');
  const [blogReadTime, setBlogReadTime] = useState('5 min');
  const [blogDate, setBlogDate] = useState('');
  const [blogKeywords, setBlogKeywords] = useState('');
  const [blogImageUrl, setBlogImageUrl] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [blogMessage, setBlogMessage] = useState('');
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ]
  };
  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'blockquote',
    'code-block',
    'link'
  ];

  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  function loadBlogs() {
    setBlogsLoading(true);
    fetch('/api/blogs')
      .then(r => r.json())
      .then(data => {
        setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      })
      .catch(() => {
        setBlogs([]);
      })
      .finally(() => setBlogsLoading(false));
  }

  function loadContacts() {
    setContactsLoading(true);
    fetch('/api/admin/contacts')
      .then(r => r.json())
      .then(data => {
        setContacts(Array.isArray(data.contacts) ? data.contacts : []);
      })
      .catch(() => {
        setContacts([]);
      })
      .finally(() => setContactsLoading(false));
  }

  useEffect(() => {
    if (isLoggedIn) {
      if (tab === 'blogs') {
        loadBlogs();
      }
      if (tab === 'contacts') {
        loadContacts();
      }
    }
  }, [isLoggedIn, tab]);

  const recentContacts = useMemo(
    () => contacts.slice(0, 5),
    [contacts]
  );

  async function handleLogin(e) {
    e.preventDefault();
    setBusy(true);
    setLoginError('');
    if (!email || !password) {
      setLoginError('Please enter both email and password.');
      setBusy(false);
      return;
    }
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        data = {};
      }
      const status = res.status;
      const errMsg = data && data.error ? data.error : '';
      if (status === 401) {
        setLoginError('Invalid admin credentials');
        setIsLoggedIn(false);
        return;
      }
      if (status >= 500 || status === 404) {
        setLoginError(
          errMsg ||
            'Admin server is not reachable. Make sure API routes are running (e.g. on Vercel).'
        );
        setIsLoggedIn(false);
        return;
      }
      if (!res.ok || !data || !data.ok) {
        setLoginError(
          data && data.error
            ? data.error
            : 'Invalid admin credentials'
        );
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      setLoginError('');
    } catch (err) {
      setLoginError(
        'Unable to reach admin server. Please check API deployment.'
      );
      setIsLoggedIn(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateBlog(e) {
    e.preventDefault();
    setBusy(true);
    setBlogMessage('');
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: blogTitle,
          meta: blogMeta,
          category: blogCategory,
          readTime: blogReadTime,
          date: blogDate,
          keywords: blogKeywords,
          imageUrl: blogImageUrl,
          content: blogContent
        })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setBlogMessage(data.error || 'Failed to create blog');
        return;
      }
      setBlogMessage('Blog published successfully.');
      setBlogTitle('');
      setBlogMeta('');
      setBlogKeywords('');
       setBlogImageUrl('');
       setBlogContent('');
       setShowPreview(false);
      if (tab === 'blogs') {
        loadBlogs();
      }
    } catch (err) {
      setBlogMessage('Network error while creating blog');
    } finally {
      setBusy(false);
    }
  }

  async function handleSeed() {
    setBusy(true);
    setBlogMessage('');
    try {
      const res = await fetch('/api/admin/seed-blogs', {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setBlogMessage(data.error || 'Failed to seed blogs');
        return;
      }
      if (data.skipped) {
        setBlogMessage('Seed skipped: blogs already exist.');
      } else {
        setBlogMessage(
          `Seeded ${data.seeded || 0} sample blog posts.`
        );
      }
      if (tab === 'blogs') {
        loadBlogs();
      }
    } catch (err) {
      setBlogMessage('Network error while seeding blogs');
    } finally {
      setBusy(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="admin-wrap">
        <div className="admin-card">
          <div className="admin-head">
            <div className="admin-tag">Secure Area</div>
            <h2 className="admin-title">Admin Login</h2>
            <p className="admin-sub">
              Sign in with your admin credentials to manage blogs and
              contact queries.
            </p>
          </div>
          <form className="admin-form" onSubmit={handleLogin}>
            <div className="fg">
              <label className="fl" htmlFor="adminEmail">
                Admin Email
              </label>
              <input
                id="adminEmail"
                className="fi"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="fg">
              <label className="fl" htmlFor="adminPassword">
                Password
              </label>
              <div className="pw-wrap">
                <input
                  id="adminPassword"
                  className="fi"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {loginError && (
              <div className="admin-error">{loginError}</div>
            )}
            <button
              type="submit"
              className="fsub"
              disabled={busy}
            >
              {busy ? 'Signing in…' : 'Sign In'}
            </button>
            <div className="admin-hint">
              Hint: Uses the admin credentials you configured in the
              environment.
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="admin-card">
        <div className="admin-head">
          <div className="admin-tag on">Admin Panel</div>
          <h2 className="admin-title">Dashboard</h2>
          <p className="admin-sub">
            Publish blogs, view all posts, and review contact messages
            submitted from your portfolio.
          </p>
          <div className="admin-tabs">
            <button
              type="button"
              className={`ad-tab${
                tab === 'create' ? ' on' : ''
              }`}
              onClick={() => setTab('create')}
            >
              ✍️ New Blog
            </button>
            <button
              type="button"
              className={`ad-tab${tab === 'blogs' ? ' on' : ''}`}
              onClick={() => setTab('blogs')}
            >
              📚 All Blogs
            </button>
            <button
              type="button"
              className={`ad-tab${
                tab === 'contacts' ? ' on' : ''
              }`}
              onClick={() => setTab('contacts')}
            >
              📬 Contact Messages
            </button>
          </div>
        </div>

        {tab === 'create' && (
          <form className="admin-form" onSubmit={handleCreateBlog}>
            <div className="fg">
              <label className="fl" htmlFor="blogTitle">
                Title
              </label>
              <input
                id="blogTitle"
                className="fi"
                type="text"
                placeholder="Blog title"
                value={blogTitle}
                onChange={e => setBlogTitle(e.target.value)}
                required
              />
            </div>
            <div className="fg">
              <label className="fl" htmlFor="blogMeta">
                Short Description
              </label>
              <textarea
                id="blogMeta"
                className="fta"
                placeholder="One or two lines that describe this article…"
                value={blogMeta}
                onChange={e => setBlogMeta(e.target.value)}
                required
              />
            </div>
            <div className="fg">
              <label className="fl" htmlFor="blogImageUrl">
                Cover Image URL (from imgbb)
              </label>
              <input
                id="blogImageUrl"
                className="fi"
                type="url"
                placeholder="https://i.ibb.co/your-image-link"
                value={blogImageUrl}
                onChange={e => setBlogImageUrl(e.target.value)}
              />
            </div>
            <div className="fr">
              <div className="fg">
                <label className="fl" htmlFor="blogCategory">
                  Category
                </label>
                <select
                  id="blogCategory"
                  className="fi"
                  value={blogCategory}
                  onChange={e => setBlogCategory(e.target.value)}
                >
                  <option>Next.js</option>
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Career</option>
                  <option>Life</option>
                </select>
              </div>
              <div className="fg">
                <label className="fl" htmlFor="blogReadTime">
                  Read Time
                </label>
                <input
                  id="blogReadTime"
                  className="fi"
                  type="text"
                  value={blogReadTime}
                  onChange={e => setBlogReadTime(e.target.value)}
                />
              </div>
            </div>
            <div className="fr">
              <div className="fg">
                <label className="fl" htmlFor="blogDate">
                  Date
                </label>
                <input
                  id="blogDate"
                  className="fi"
                  type="date"
                  value={blogDate}
                  onChange={e => setBlogDate(e.target.value)}
                />
              </div>
              <div className="fg">
                <label className="fl" htmlFor="blogKeywords">
                  Keywords (comma separated)
                </label>
                <input
                  id="blogKeywords"
                  className="fi"
                  type="text"
                  placeholder="Next.js, MongoDB, Career…"
                  value={blogKeywords}
                  onChange={e => setBlogKeywords(e.target.value)}
                />
              </div>
            </div>
            <div className="fg">
              <label className="fl" htmlFor="blogContent">
                Article Content
              </label>
              <div className="admin-quill">
                <ReactQuill
                  id="blogContent"
                  theme="snow"
                  value={blogContent}
                  onChange={setBlogContent}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
            </div>
            {blogMessage && (
              <div className="admin-info">{blogMessage}</div>
            )}
            <div className="admin-actions">
              <button
                type="submit"
                className="fsub"
                disabled={busy}
              >
                {busy ? 'Publishing…' : 'Publish Blog'}
              </button>
              <button
                type="button"
                className="btn-g"
                onClick={() => setShowPreview(v => !v)}
                disabled={busy}
              >
                {showPreview ? 'Hide Preview' : 'Preview Draft'}
              </button>
              <button
                type="button"
                className="btn-g"
                onClick={handleSeed}
                disabled={busy}
              >
                Seed Sample Blogs
              </button>
            </div>
            {showPreview && (
              <div className="admin-preview">
                <div className="admin-preview-head">
                  <div className="admin-preview-tag">
                    {blogCategory || 'Category'} · {blogReadTime || 'Read time'}
                  </div>
                  <h3 className="admin-preview-title">
                    {blogTitle || 'Blog title'}
                  </h3>
                  <div className="admin-preview-meta">
                    <span>{blogDate || 'Date'}</span>
                    <span>{blogKeywords || 'Keywords'}</span>
                  </div>
                </div>
                {blogImageUrl && (
                  <div className="admin-preview-image">
                    <img src={blogImageUrl} alt={blogTitle} />
                  </div>
                )}
                <div className="admin-preview-body">
                  {blogContent ? (
                    <div
                      className="admin-preview-html"
                      dangerouslySetInnerHTML={{ __html: blogContent }}
                    />
                  ) : (
                    <p>{blogMeta || 'Start writing your article above.'}</p>
                  )}
                </div>
              </div>
            )}
            {recentContacts.length > 0 && (
              <div className="admin-side">
                <div className="admin-side-title">
                  Latest Contact Messages
                </div>
                <ul className="admin-side-list">
                  {recentContacts.map(c => (
                    <li key={c._id} className="admin-side-item">
                      <div className="asi-h">
                        <span className="asi-n">
                          {c.firstName} {c.lastName}
                        </span>
                        <span className="asi-e">{c.email}</span>
                      </div>
                      <div className="asi-s">
                        {c.subject || 'No subject'}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        )}

        {tab === 'blogs' && (
          <div className="admin-table">
            {blogsLoading ? (
              <div className="admin-info">Loading blogs…</div>
            ) : blogs.length === 0 ? (
              <div className="admin-info">
                No blogs found. Use “Seed Sample Blogs” or create a new
                article.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Read Time</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((b, i) => (
                    <tr key={b._id || i}>
                      <td>{String(i + 1).padStart(2, '0')}</td>
                      <td>{b.title}</td>
                      <td>{b.category}</td>
                      <td>{b.readTime}</td>
                      <td>{b.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'contacts' && (
          <div className="admin-table">
            {contactsLoading ? (
              <div className="admin-info">Loading messages…</div>
            ) : contacts.length === 0 ? (
              <div className="admin-info">
                No contact form submissions yet.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(c => (
                    <tr key={c._id}>
                      <td>
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleString()
                          : ''}
                      </td>
                      <td>
                        {c.firstName} {c.lastName}
                      </td>
                      <td>{c.email}</td>
                      <td>{c.subject || '—'}</td>
                      <td>{c.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

