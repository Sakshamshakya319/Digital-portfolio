const admin = require('firebase-admin');

let app;

function getAdminApp() {
  if (app) {
    return app;
  }

  // Check if already initialized
  if (admin.apps.length > 0) {
    app = admin.apps[0];
    return app;
  }

  try {
    const databaseURL = "https://sakshamshakya-14df5-default-rtdb.firebaseio.com";

    // Try to use service account from environment variable (Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL
        });
        return app;
      } catch (parseError) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', parseError.message);
      }
    }

    // Try to load from file (for local development)
    if (process.env.NODE_ENV !== 'production') {
      try {
        const serviceAccount = require('../sakshamshakya-14df5-firebase-adminsdk.json');
        app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL
        });
        return app;
      } catch (fileError) {
        console.error('Failed to load service account from file:', fileError.message);
      }
    }

    // Fallback: Initialize without credentials (will fail for write operations)
    console.warn('No service account found, initializing with database URL only');
    app = admin.initializeApp({
      databaseURL
    });
    return app;
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw new Error('Failed to initialize Firebase Admin SDK');
  }
}

function getAdminDatabase() {
  try {
    const app = getAdminApp();
    return admin.database(app);
  } catch (error) {
    console.error('Error getting database:', error);
    throw error;
  }
}

function getAdminAuth() {
  try {
    const app = getAdminApp();
    return admin.auth(app);
  } catch (error) {
    console.error('Error getting auth:', error);
    throw error;
  }
}

module.exports = {
  getAdminApp,
  getAdminDatabase,
  getAdminAuth
};
