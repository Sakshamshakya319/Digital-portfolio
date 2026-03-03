import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase configuration - uses environment variables in production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCSaDnxYwhdJt6wpQ2l8bEp8E3U8drApkk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sakshamshakya-14df5.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://sakshamshakya-14df5-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sakshamshakya-14df5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sakshamshakya-14df5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "558927534415",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:558927534415:web:0408087f45cb454d124d3a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;
