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
    // Try to use service account from environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://sakshamshakya-14df5-default-rtdb.firebaseio.com"
      });
      console.log('Firebase Admin initialized with service account');
      return app;
    }

    // Try to load from file (for local development)
    try {
      const serviceAccount = require('../sakshamshakya-14df5-firebase-adminsdk.json');
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://sakshamshakya-14df5-default-rtdb.firebaseio.com"
      });
      console.log('Firebase Admin initialized from local file');
      return app;
    } catch (fileError) {
      // File doesn't exist, use database URL only (limited functionality)
      console.warn('No service account found, using database URL only');
      app = admin.initializeApp({
        databaseURL: "https://sakshamshakya-14df5-default-rtdb.firebaseio.com"
      });
      return app;
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

function getAdminDatabase() {
  const app = getAdminApp();
  return admin.database(app);
}

function getAdminAuth() {
  const app = getAdminApp();
  return admin.auth(app);
}

module.exports = {
  getAdminApp,
  getAdminDatabase,
  getAdminAuth
};
