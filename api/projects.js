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
      const col = db.collection('projects');

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
          res.end(JSON.stringify({ error: 'Project not found' }));
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            project: {
              _id: String(doc._id),
              slug: doc.slug || '',
              title: doc.title || '',
              summary: doc.summary || '',
              type: doc.type || '',
              category: doc.category || '',
              status: doc.status || '',
              date: doc.date || '',
              tags: Array.isArray(doc.tags) ? doc.tags.join(', ') : '',
              imageUrl: doc.imageUrl || '',
              liveUrl: doc.liveUrl || '',
              githubUrl: doc.githubUrl || '',
              body: doc.body || ''
            }
          })
        );
        return;
      }

      const projects = await col
        .find({})
        .sort({ date: -1, createdAt: -1 })
        .limit(50)
        .toArray();

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          projects: projects.map(p => ({
            _id: String(p._id),
            slug: p.slug || '',
            title: p.title || '',
            summary: p.summary || '',
            type: p.type || '',
            category: p.category || '',
            status: p.status || '',
            date: p.date || '',
            tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
            imageUrl: p.imageUrl || '',
            liveUrl: p.liveUrl || '',
            githubUrl: p.githubUrl || '',
            body: p.body || ''
          }))
        })
      );
    } catch (e) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to fetch projects' }));
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
        summary,
        type,
        category,
        status,
        date,
        tags,
        imageUrl,
        liveUrl,
        githubUrl,
        body: projectBody
      } = body || {};

      if (!title || !summary) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Title and summary are required' }));
        return;
      }

      await getClient();
      const dbClient = client;
      const db = dbClient.db('portfolio');
      const col = db.collection('projects');

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

      const tagArray = Array.isArray(tags)
        ? tags
        : typeof tags === 'string' && tags.trim()
        ? tags.split(',').map(t => t.trim())
        : [];

      const doc = {
        title,
        summary,
        type: type || '',
        category: category || '',
        status: status || 'Completed',
        date: date || new Date().toISOString().slice(0, 10),
        tags: tagArray,
        imageUrl: imageUrl || '',
        liveUrl: liveUrl || '',
        githubUrl: githubUrl || '',
        body: projectBody || '',
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
      res.end(JSON.stringify({ error: 'Failed to create project' }));
    }
    return;
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Method not allowed' }));
};

