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
      const contactsRef = db.ref('contacts');

      const snapshot = await contactsRef.once('value');
      const contactsData = snapshot.val() || {};

      const items = Object.entries(contactsData).map(([id, contact]) => ({
        _id: id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        status: contact.status || 'new',
        createdAt: contact.createdAt
      }));

      // Sort by createdAt descending
      items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ contacts: items.slice(0, 100) }));
    } catch (e) {
      console.error('Error fetching contacts:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to fetch contacts' }));
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
        res.end(JSON.stringify({ error: 'Contact ID is required' }));
        return;
      }

      const db = getAdminDatabase();
      const contactRef = db.ref(`contacts/${id}`);

      const snapshot = await contactRef.once('value');
      if (!snapshot.exists()) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Contact not found' }));
        return;
      }

      await contactRef.remove();

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      console.error('Error deleting contact:', e);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to delete contact' }));
    }
    return;
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Method not allowed' }));
};
