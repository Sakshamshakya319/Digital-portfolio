import express from 'express';
import User from '../models/User.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// Initialize admin user (run once)
router.post('/init-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ username: 'sakshamshakya94' });
    if (existingAdmin) {
      return res.status(200).json({ message: 'Admin user already exists' });
    }

    const adminUser = new User({
      username: 'sakshamshakya94',
      password: 'nrt*gam1apt0AZX-gdx',
      role: 'admin'
    });

    await adminUser.save();
    
    res.json({ message: 'Admin user created successfully' });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(200).json({ message: 'Admin user already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
