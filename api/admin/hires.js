const { verify } = require('jsonwebtoken');
const { getAdminDatabase } = require('../firebase-admin');

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

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const admin = requireAdmin(req);
    if (!admin) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    try {
      const db = getAdminDatabase();
      const hiresRef = db.ref('hires');

      const snapshot = await hiresRef.once('value');
      const hiresData = snapshot.val() || {};

      const items = Object.entries(hiresData).map(([id, hire]) => ({
        _id: id,
        fullName: hire.fullName,
        email: hire.email,
        phone: hire.phone,
        company: hire.company,
        projectType: hire.projectType,
        budget: hire.budget,
        timeline: hire.timeline,
        description: hire.description,
        status: hire.status || 'new',
        createdAt: hire.createdAt
      }));

      // Sort by createdAt descending
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ hires: items.slice(0, 100) }));
    } catch (e) {
      console.error('Error fetching hire requests:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to fetch hire requests' }));
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
        res.end(JSON.stringify({ error: 'Hire request ID is required' }));
        return;
      }

      const db = getAdminDatabase();
      const hireRef = db.ref(`hires/${id}`);

      const snapshot = await hireRef.once('value');
      if (!snapshot.exists()) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Hire request not found' }));
        return;
      }

      await hireRef.remove();

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      console.error('Error deleting hire request:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to delete hire request' }));
    }
    return;
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Method not allowed' }));
};
