const { verify } = require('jsonwebtoken');
const { getAdminDatabase } = require('./firebase-admin');

const jwtSecret = process.env.ADMIN_JWT_SECRET || 'change-me-in-env';

function getTokenFromCookie(req) {
  const header = req.headers.cookie || '';
  const parts = header.split(';').map(v => v.trim());
  const cookie = parts.find(v => v.startsWith('admin_token='));
  if (!cookie) return null;
  return cookie.substring('admin_token='.length);
}

function requireAdmin(req) {
  try {
    const token = getTokenFromCookie(req);
    if (!token) return null;
    const decoded = verify(token, jwtSecret);
    if (!decoded || decoded.role !== 'admin') return null;
    return decoded;
  } catch (e) {
    return null;
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 1e6) {
        req.destroy();
        reject(new Error('Body too large'));
      }
    });
    req.on('end', () => {
      try {
        const json = data ? JSON.parse(data) : {};
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function createSlug(title) {
  const base = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!base) {
    return String(Date.now());
  }
  return base;
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = getAdminDatabase();
      const blogsRef = db.ref('blogs');

      const url = new URL(req.url || '', 'http://localhost');
      const id = url.searchParams.get('id');
      const slug = url.searchParams.get('slug');

      if (id || slug) {
        const snapshot = await blogsRef.once('value');
        const allBlogs = snapshot.val() || {};
        
        let doc = null;
        if (id) {
          doc = allBlogs[id];
          if (doc) doc._id = id;
        } else {
          // Find by slug
          for (const [key, value] of Object.entries(allBlogs)) {
            if (value.slug === slug) {
              doc = { ...value, _id: key };
              break;
            }
          }
        }

        if (!doc) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Blog not found' }));
          return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            blog: {
              _id: doc._id,
              slug: doc.slug || '',
              title: doc.title || '',
              meta: doc.meta || '',
              category: doc.category || 'General',
              readTime: doc.readTime || '5 min',
              date: doc.date || '2025',
              keywords: Array.isArray(doc.keywords)
                ? doc.keywords.join(', ')
                : doc.keywords || '',
              imageUrl: doc.imageUrl || '',
              likes: doc.likes || 0,
              body: doc.body || ''
            }
          })
        );
        return;
      }

      // Get all blogs
      const snapshot = await blogsRef.once('value');
      const blogsData = snapshot.val() || {};
      
      const blogs = Object.entries(blogsData).map(([id, blog]) => ({
        _id: id,
        slug: blog.slug || '',
        title: blog.title || '',
        meta: blog.meta || '',
        category: blog.category || 'General',
        readTime: blog.readTime || '5 min',
        date: blog.date || '2025',
        keywords: Array.isArray(blog.keywords)
          ? blog.keywords.join(', ')
          : blog.keywords || '',
        imageUrl: blog.imageUrl || '',
        likes: blog.likes || 0,
        body: blog.body || '',
        createdAt: blog.createdAt || 0
      }));

      // Sort by date descending
      blogs.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ blogs: blogs.slice(0, 50) }));
    } catch (e) {
      console.error('Error fetching blogs:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to fetch blogs' }));
    }
    return;
  }

  if (req.method === 'POST') {
    const admin = requireAdmin(req);
    if (!admin) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    try {
      const body = await readBody(req);
      const {
        title,
        meta,
        category,
        readTime,
        date,
        keywords,
        content,
        imageUrl
      } = body || {};

      if (!title || !meta) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Title and meta are required' }));
        return;
      }

      const db = getAdminDatabase();
      const blogsRef = db.ref('blogs');

      // Check for existing slug
      const baseSlug = createSlug(title);
      let slug = baseSlug;
      let suffix = 1;
      
      const snapshot = await blogsRef.once('value');
      const existingBlogs = snapshot.val() || {};
      
      while (Object.values(existingBlogs).some(b => b.slug === slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
        if (suffix > 50) break;
      }

      const doc = {
        title,
        meta,
        category: category || 'General',
        readTime: readTime || '5 min',
        date: date || new Date().toISOString().slice(0, 10),
        keywords: Array.isArray(keywords)
          ? keywords
          : typeof keywords === 'string' && keywords.trim()
          ? keywords.split(',').map(k => k.trim())
          : [],
        imageUrl: imageUrl || '',
        body: content || '',
        likes: 0,
        slug,
        createdAt: Date.now(),
        createdBy: admin.sub
      };

      const newBlogRef = await blogsRef.push(doc);

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, id: newBlogRef.key }));
    } catch (e) {
      console.error('Error creating blog:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to create blog' }));
    }
    return;
  }

  if (req.method === 'PATCH') {
    try {
      const body = await readBody(req);
      const { id, slug } = body || {};
      if (!id && !slug) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing blog identifier' }));
        return;
      }

      const db = getAdminDatabase();
      const blogsRef = db.ref('blogs');

      let blogId = id;
      if (!blogId && slug) {
        // Find by slug
        const snapshot = await blogsRef.once('value');
        const allBlogs = snapshot.val() || {};
        for (const [key, value] of Object.entries(allBlogs)) {
          if (value.slug === slug) {
            blogId = key;
            break;
          }
        }
      }

      if (!blogId) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Blog not found' }));
        return;
      }

      const blogRef = db.ref(`blogs/${blogId}`);
      const snapshot = await blogRef.once('value');
      const blog = snapshot.val();

      if (!blog) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Blog not found' }));
        return;
      }

      const newLikes = (blog.likes || 0) + 1;
      await blogRef.update({ likes: newLikes });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, likes: newLikes }));
    } catch (e) {
      console.error('Error updating likes:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to update likes' }));
    }
    return;
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Method not allowed' }));
};
