import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import Image from '../models/Image.js';

const router = express.Router();

// Configure storage for memory
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Upload single image
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const image = new Image({
      name: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype
    });

    await image.save();

    // Generate absolute URL for the uploaded image
    const backendBase =
      process.env.BACKEND_URL ||
      `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${backendBase}/api/upload/image/${image._id}`;
    
    res.status(200).json({
      message: 'Image uploaded successfully',
      url: imageUrl,
      id: image._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

// Get image by ID (public)
router.get('/image/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const w = parseInt(req.query.w, 10) || 400;
    const h = parseInt(req.query.h, 10) || 250;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#e5e7eb"/></svg>`;
      res.set('Content-Type', 'image/svg+xml');
      return res.status(200).send(svg);
    }

    const image = await Image.findById(id);
    if (!image || !image.data) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#e5e7eb"/></svg>`;
      res.set('Content-Type', 'image/svg+xml');
      return res.status(200).send(svg);
    }

    res.set('Content-Type', image.contentType || 'application/octet-stream');
    res.send(image.data);
  } catch (error) {
    const w = parseInt(req.query.w, 10) || 400;
    const h = parseInt(req.query.h, 10) || 250;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#e5e7eb"/></svg>`;
    res.set('Content-Type', 'image/svg+xml');
    res.status(200).send(svg);
  }
});

router.get('/placeholder/:w/:h', async (req, res) => {
  const w = parseInt(req.params.w, 10) || 400;
  const h = parseInt(req.params.h, 10) || 250;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#e5e7eb"/></svg>`;
  res.set('Content-Type', 'image/svg+xml');
  res.status(200).send(svg);
});

// Delete image by ID
router.delete('/image/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
});

export default router;
