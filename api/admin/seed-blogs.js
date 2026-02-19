const { MongoClient } = require('mongodb');
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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const admin = requireAdmin(req);
  if (!admin) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  try {
    await getClient();
    const dbClient = client;
    const db = dbClient.db('portfolio');
    const col = db.collection('blogs');

    const existing = await col.countDocuments({});
    if (existing > 0) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, skipped: true }));
      return;
    }

    const now = new Date();
    function slug(t) {
      const base = String(t || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      if (!base) {
        return String(Date.now());
      }
      return base;
    }

    const docs = [
      {
        title:
          'Mastering Next.js App Router — A Student’s Real-World Guide',
        meta:
          'From pages to app directory — what I learned building production apps at LPU.',
        category: 'Next.js',
        readTime: '7 min',
        date: '2025-01-10',
        keywords: ['Next.js', 'App Router', 'React', 'LPU'],
        imageUrl: '',
        body:
          'Next.js App Router changes how pages are structured and rendered in real projects. In this article, I walk through how I migrated from the pages router, how layouts simplify shared UI, and which patterns helped me keep my portfolio fast, secure, and easy to maintain.\n\nYou will see how server components reduce client-side JavaScript, how loading states work out of the box, and why deploying to Vercel makes the entire flow feel seamless for a student developer.',
        likes: 0,
        slug: slug(
          'Mastering Next.js App Router — A Student’s Real-World Guide'
        ),
        createdAt: now,
        createdBy: admin.sub
      },
      {
        title:
          'How I Visited Parliament as an NSS Achiever — And What It Taught Me',
        meta:
          'Beyond code — lessons from being recognised as an NSS achiever at national level.',
        category: 'Career',
        readTime: '5 min',
        date: '2024-12-01',
        keywords: ['NSS', 'India', 'Career', 'Student Life'],
        imageUrl: '',
        body:
          'Visiting the Parliament of India as an NSS achiever was a milestone that reshaped how I look at responsibility as a developer. In this story, I share the journey from campus activities to national recognition, and how those experiences influence the way I build software today.\n\nYou will read about leadership, community work, and why empathy is just as important as technical skill in any engineering career.',
        likes: 0,
        slug: slug(
          'How I Visited Parliament as an NSS Achiever — And What It Taught Me'
        ),
        createdAt: now,
        createdBy: admin.sub
      },
      {
        title:
          'Building Production REST APIs with Node.js, Express & MongoDB',
        meta:
          'Patterns I use when designing APIs for real users — from validation to deployment.',
        category: 'Backend',
        readTime: '8 min',
        date: '2024-10-15',
        keywords: ['Node.js', 'Express', 'MongoDB', 'REST'],
        imageUrl: '',
        body:
          'Designing REST APIs that are reliable in production requires more than just routing. This guide walks through layered architecture, validation strategies, and patterns for error handling, logging, and security when building with Node.js, Express, and MongoDB.\n\nI also cover how I structure controllers, services, and data access so that features like authentication and rate limiting remain easy to extend.',
        likes: 0,
        slug: slug(
          'Building Production REST APIs with Node.js, Express & MongoDB'
        ),
        createdAt: now,
        createdBy: admin.sub
      },
      {
        title:
          'I Built and Published Socio.io — Here’s What I Learned',
        meta:
          'From idea to published extension — a practical roadmap for student developers.',
        category: 'Frontend',
        readTime: '11 min',
        date: '2024-08-20',
        keywords: ['Browser Extension', 'JavaScript', 'Publishing'],
        imageUrl: '',
        body:
          'Socio.io started as a small idea to improve how people interact with social platforms, and ended as a published browser extension used by real users. In this article I break down the steps: validating the idea, designing the UX, building the MVP, and finally submitting and maintaining the extension.\n\nAlong the way, I highlight the tools, mistakes, and lessons that any student developer can reuse for their own product.',
        likes: 0,
        slug: slug('I Built and Published Socio.io — Here’s What I Learned'),
        createdAt: now,
        createdBy: admin.sub
      }
    ];

    await col.insertMany(docs);

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, seeded: docs.length }));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to seed blogs' }));
  }
};
