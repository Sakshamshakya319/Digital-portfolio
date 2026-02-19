const { sign } = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    if (!adminEmail || !adminPassword) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error:
            'Admin credentials are not configured on the server. Set ADMIN_EMAIL and ADMIN_PASSWORD env vars.'
        })
      );
      return;
    }

    await getClient();
    const body = await readBody(req);
    const { email, password } = body;

    if (email !== adminEmail || password !== adminPassword) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
      return;
    }

    const token = sign(
      { sub: adminEmail, role: 'admin' },
      jwtSecret,
      { expiresIn: '2h' }
    );

    const cookie = [
      `admin_token=${token}`,
      'HttpOnly',
      'Path=/',
      'SameSite=Lax',
      'Secure'
    ].join('; ');

    res.statusCode = 200;
    res.setHeader('Set-Cookie', cookie);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Login failed' }));
  }
};
