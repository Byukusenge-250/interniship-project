const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-dev-key';

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided.' });
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found.' });
    if (user.status === 'suspended') return res.status(403).json({ message: 'Account suspended. Contact admin.' });
    
    req.user = user;
    req.auth = decoded; // Store token payload (includes verified status)
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  next();
};

const requireTeacher = (req, res, next) => {
  if (!['teacher', 'admin'].includes(req.user.role)) return res.status(403).json({ message: 'Teacher access required.' });
  next();
};

const requireVerifiedStudent = (req, res, next) => {
  if (req.user.role === 'student' && !req.auth.verified) {
    return res.status(403).json({ message: 'Student verification required.', needsVerification: true });
  }
  next();
};

const generateToken = (userId, payload = {}) => jwt.sign({ userId, ...payload }, JWT_SECRET, { expiresIn: '7d' });

module.exports = { authenticate, requireAdmin, requireTeacher, requireVerifiedStudent, generateToken };
