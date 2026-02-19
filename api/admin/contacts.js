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
  if (req.method !== 'GET') {
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
    const col = db.collection('contacts');

    const items = await col
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        contacts: items.map(c => ({
          _id: String(c._id),
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          subject: c.subject,
          message: c.message,
          status: c.status || 'new',
          createdAt: c.createdAt
        }))
      })
    );
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to fetch contacts' }));
  }
};

