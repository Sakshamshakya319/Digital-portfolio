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
  // Set timeout headers for Vercel
  res.setHeader('Cache-Control', 'no-cache');
  
  if (req.method === 'GET') {
    try {
      const db = getAdminDatabase();
      const projectsRef = db.ref('projects');

      const url = new URL(req.url || '', 'http://localhost');
      const id = url.searchParams.get('id');
      const slug = url.searchParams.get('slug');

      if (id || slug) {
        // Get single project with timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 8000)
        );
        
        const dataPromise = projectsRef.once('value');
        const snapshot = await Promise.race([dataPromise, timeoutPromise]);
        
        const allProjects = snapshot.val() || {};
        
        let doc = null;
        if (id) {
          doc = allProjects[id];
          if (doc) doc._id = id;
        } else {
          // Find by slug
          for (const [key, value] of Object.entries(allProjects)) {
            if (value.slug === slug) {
              doc = { ...value, _id: key };
              break;
            }
          }
        }

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
              _id: doc._id,
              slug: doc.slug || '',
              title: doc.title || '',
              summary: doc.summary || '',
              type: doc.type || '',
              category: doc.category || '',
              status: doc.status || '',
              date: doc.date || '',
              tags: Array.isArray(doc.tags) ? doc.tags.join(', ') : doc.tags || '',
              imageUrl: doc.imageUrl || '',
              liveUrl: doc.liveUrl || '',
              githubUrl: doc.githubUrl || '',
              body: doc.body || ''
            }
          })
        );
        return;
      }

      // Get all projects with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 8000)
      );
      
      const dataPromise = projectsRef.once('value');
      const snapshot = await Promise.race([dataPromise, timeoutPromise]);
      
      const projectsData = snapshot.val() || {};
      
      const projects = Object.entries(projectsData).map(([id, project]) => ({
        _id: id,
        slug: project.slug || '',
        title: project.title || '',
        summary: project.summary || '',
        type: project.type || '',
        category: project.category || '',
        status: project.status || '',
        date: project.date || '',
        tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
        imageUrl: project.imageUrl || '',
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        body: project.body || '',
        createdAt: project.createdAt || 0
      }));

      // Sort by date descending
      projects.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ projects: projects.slice(0, 50) }));
    } catch (e) {
      console.error('Error fetching projects:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ 
        error: 'Failed to fetch projects',
        message: e.message 
      }));
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

      const db = getAdminDatabase();
      const projectsRef = db.ref('projects');

      // Check for existing slug
      const baseSlug = createSlug(title);
      let slug = baseSlug;
      let suffix = 1;
      
      const snapshot = await projectsRef.once('value');
      const existingProjects = snapshot.val() || {};
      
      while (Object.values(existingProjects).some(p => p.slug === slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
        if (suffix > 50) break;
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
        createdAt: Date.now(),
        createdBy: admin.sub
      };

      const newProjectRef = await projectsRef.push(doc);

      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, id: newProjectRef.key }));
    } catch (e) {
      console.error('Error creating project:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to create project' }));
    }
    return;
  }

  if (req.method === 'PUT') {
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
        id,
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

      if (!id) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Project ID is required' }));
        return;
      }

      if (!title || !summary) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Title and summary are required' }));
        return;
      }

      const db = getAdminDatabase();
      const projectRef = db.ref(`projects/${id}`);

      const snapshot = await projectRef.once('value');
      if (!snapshot.exists()) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Project not found' }));
        return;
      }

      const existingProject = snapshot.val();

      const tagArray = Array.isArray(tags)
        ? tags
        : typeof tags === 'string' && tags.trim()
        ? tags.split(',').map(t => t.trim())
        : [];

      const updatedDoc = {
        ...existingProject,
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
        updatedAt: Date.now(),
        updatedBy: admin.sub
      };

      await projectRef.set(updatedDoc);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, id }));
    } catch (e) {
      console.error('Error updating project:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to update project' }));
    }
    return;
  }

  if (req.method === 'DELETE') {
    const admin = requireAdmin(req);
    if (!admin) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    try {
      const url = new URL(req.url || '', 'http://localhost');
      const id = url.searchParams.get('id');

      if (!id) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Project ID is required' }));
        return;
      }

      const db = getAdminDatabase();
      const projectRef = db.ref(`projects/${id}`);

      const snapshot = await projectRef.once('value');
      if (!snapshot.exists()) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Project not found' }));
        return;
      }

      await projectRef.remove();

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      console.error('Error deleting project:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to delete project' }));
    }
    return;
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Method not allowed' }));
};
