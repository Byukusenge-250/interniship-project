const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { authenticate, requireTeacher, requireVerifiedStudent } = require('../middleware/auth');

router.get('/', authenticate, requireVerifiedStudent, async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (req.user.role === 'student') {
      filter.$or = [{ status: 'approved' }, { userId: req.user._id }];
    }

    if (category && category !== 'all') filter.category = category;
    if (status && ['teacher','admin'].includes(req.user.role)) filter.status = status;
    if (search) {
      filter.$and = [{ $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]}];
    }

    const projects = await Project.find(filter).populate('userId', 'name email role').sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects.' });
  }
});

router.get('/my', authenticate, requireVerifiedStudent, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects.' });
  }
});

// Get single project by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('userId', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project.' });
  }
});

router.post('/', authenticate, requireVerifiedStudent, async (req, res) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, imageUrl, category } = req.body;
    if (!title || !description) return res.status(400).json({ message: 'Title and description required.' });

    const techArray = Array.isArray(technologies)
      ? technologies
      : (technologies || '').split(',').map(t => t.trim()).filter(Boolean);

    const project = await Project.create({
      title, description,
      technologies: techArray,
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      imageUrl: imageUrl || '',
      category: category || 'other',
      userId: req.user._id,
      status: ['teacher','admin'].includes(req.user.role) ? 'approved' : 'pending'
    });

    await project.populate('userId', 'name email role');
    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project.' });
  }
});

router.patch('/:id/status', authenticate, requireTeacher, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending','approved','rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    const project = await Project.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('userId', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: `Project ${status}`, project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

// Admin can edit any project
router.put('/:id', authenticate, requireTeacher, async (req, res) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, category } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (technologies !== undefined) {
      update.technologies = Array.isArray(technologies)
        ? technologies
        : (technologies || '').split(',').map(t => t.trim()).filter(Boolean);
    }
    if (githubUrl !== undefined) update.githubUrl = githubUrl;
    if (liveUrl !== undefined) update.liveUrl = liveUrl;
    if (category !== undefined) update.category = category;

    const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true }).populate('userId', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project updated', project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project.' });
  }
});

router.delete('/:id', authenticate, requireTeacher, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    res.json({ message: 'Project deleted', projectId: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project.' });
  }
});

module.exports = router;
