const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authenticate } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, accessCode } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required.' });

    const allowed = ['student', 'teacher'];
    const userRole = allowed.includes(role) ? role : 'student';

    // Verify teacher access code
    if (userRole === 'teacher' && accessCode !== 'teacher12') {
      return res.status(403).json({ message: 'Invalid teacher access code.' });
    }

    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered.' });

    const user = await User.create({ name, email, password, role: userRole });
    const token = generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join('. ') });
    }
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended. Contact admin.' });
    }

    // Role-based 2-Step Verification
    if (user.role === 'teacher') {
      return res.json({
        needs2SV: true,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }

    if (user.role === 'student') {
      return res.json({
        needsStudentVerification: true,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
      });
    }

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/verify-teacher', async (req, res) => {
  try {
    const { userId, code } = req.body;
    const expectedCode = process.env.TEACHER_2SV_CODE || '2025';

    if (code !== expectedCode) {
      return res.status(401).json({ message: 'Invalid verification code.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/verify-student', async (req, res) => {
  try {
    const { userId, code } = req.body;
    const expectedCode = process.env.STUDENT_ACCESS_CODE || 'SJITC';

    if (code !== expectedCode) {
      return res.status(401).json({ message: 'Invalid access code.' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const token = generateToken(user._id, { verified: true });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
