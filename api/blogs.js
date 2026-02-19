const { MongoClient, ObjectId } = require('mongodb');
const { verify } = require('jsonwebtoken');

const uri = process.env.MONGODB_URI;
const jwtSecret = process.env.ADMIN_JWT_SECRET || 'change-me-in-env';

let client;
let clientPromise;

function getClient() {
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

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
      await getClient();
      const dbClient = client;
      const db = dbClient.db('portfolio');
      const col = db.collection('blogs');

      const url = new URL(req.url || '', 'http://localhost');
      const id = url.searchParams.get('id');
      const slug = url.searchParams.get('slug');

      if (id || slug) {
        const query = id
          ? { _id: new ObjectId(id) }
          : { slug };
        const doc = await col.findOne(query);
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
              _id: String(doc._id),
              slug: doc.slug || '',
              title: doc.title || '',
              meta: doc.meta || '',
              category: doc.category || 'General',
              readTime: doc.readTime || '5 min',
              date: doc.date || '2025',
              keywords: Array.isArray(doc.keywords)
                ? doc.keywords.join(', ')
                : '',
              imageUrl: doc.imageUrl || '',
              likes: doc.likes || 0,
              body: doc.body || ''
            }
          })
        );
        return;
      }

      const blogs = await col
        .find({})
        .sort({ date: -1 })
        .limit(50)
        .toArray();

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          blogs: blogs.map(b => ({
            _id: String(b._id),
            slug: b.slug || '',
            title: b.title || '',
            meta: b.meta || '',
            category: b.category || 'General',
            readTime: b.readTime || '5 min',
            date: b.date || '2025',
            keywords: Array.isArray(b.keywords)
              ? b.keywords.join(', ')
              : '',
            imageUrl: b.imageUrl || '',
            likes: b.likes || 0
          }))
        })
      );
    } catch (e) {
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

      await getClient();
      const dbClient = client;
      const db = dbClient.db('portfolio');
      const col = db.collection('blogs');

      const baseSlug = createSlug(title);
      let slug = baseSlug;
      let suffix = 1;
      while (await col.findOne({ slug })) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
        if (suffix > 50) {
          break;
        }
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
        createdAt: new Date(),
        createdBy: admin.sub
      };

      const result = await col.insertOne(doc);

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, id: String(result.insertedId) }));
    } catch (e) {
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

      await getClient();
      const dbClient = client;
      const db = dbClient.db('portfolio');
      const col = db.collection('blogs');

      const filter = id
        ? { _id: new ObjectId(id) }
        : { slug };

      const result = await col.findOneAndUpdate(
        filter,
        { $inc: { likes: 1 } },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Blog not found' }));
        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          ok: true,
          likes: result.value.likes || 0
        })
      );
    } catch (e) {
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
