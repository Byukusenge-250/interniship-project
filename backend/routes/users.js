const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const { authenticate, requireAdmin } = require('../middleware/auth');

// GET all users (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    // Attach project count to each user
    const usersWithCounts = await Promise.all(users.map(async (u) => {
      const projectCount = await Project.countDocuments({ userId: u._id });
      return { ...u.toJSON(), projectCount };
    }));

    res.json({ users: usersWithCounts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// GET stats (admin only)
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const teachers = await User.countDocuments({ role: 'teacher' });
    const admins = await User.countDocuments({ role: 'admin' });
    const suspended = await User.countDocuments({ status: 'suspended' });
    const totalProjects = await Project.countDocuments();
    const pendingProjects = await Project.countDocuments({ status: 'pending' });
    const approvedProjects = await Project.countDocuments({ status: 'approved' });

    res.json({ totalUsers, students, teachers, admins, suspended, totalProjects, pendingProjects, approvedProjects });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats.' });
  }
});

// PATCH change user role (admin only)
router.patch('/:id/role', authenticate, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: `Role updated to ${role}`, user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role.' });
  }
});

// PATCH suspend/activate user (admin only)
router.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot suspend yourself.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: `User ${status}`, user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

// DELETE user (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself.' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    // Also delete their projects
    await Project.deleteMany({ userId: req.params.id });
    res.json({ message: 'User and their projects deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});

module.exports = router;
