import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

// Import routes
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';
import projectRoutes from './routes/project.js';
import educationRoutes from './routes/education.js';
import contactRoutes from './routes/contact.js';
import skillRoutes from './routes/skill.js';
import uploadRoutes from './routes/upload.js';

// Import WebSocket service
import notificationWebSocketService from './services/notificationWebSocket.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable');
  process.exit(1);
}
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Initialize WebSocket service
notificationWebSocketService.initialize(server);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false
}));

const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  'https://www.sakshamshakya.tech',
  'https://sakshamshakya.tech',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    const withoutWww = origin.replace('://www.', '://');
    const withWww = origin.includes('://www.') ? origin : origin.replace('://', '://www.');
    if (allowedOrigins.has(withoutWww) || allowedOrigins.has(withWww)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Trust proxy for correct IP detection
app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make WebSocket service available to routes
app.locals.notificationService = notificationWebSocketService;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/upload', uploadRoutes);

// Root route
app.get('/', (req, res) => {
  res.redirect('/api/health');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Portfolio API is running successfully'
  });
});

// WebSocket stats endpoint
app.get('/api/notifications/stats', (req, res) => {
  const stats = notificationWebSocketService.getStats();
  res.json({
    ...stats,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint for admin
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    proxy: 'Vite proxy is configured correctly'
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}/ws/notifications`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  notificationWebSocketService.cleanup();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  notificationWebSocketService.cleanup();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
