const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');
const { verifyToken: auth } = require('../middleware/auth');
const Job = require('../models/Job');

const router = express.Router();

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf' && ext !== '.docx' && ext !== '.doc') {
      return cb(new Error('Only PDF and DOC/DOCX allowed'));
    }
    cb(null, true);
  }
});

router.post('/apply/:jobId', auth, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'CV is required' });
    }
    const application = new Application({
      user: req.user.id,
      job: req.params.jobId,
      cvPath: req.file.path
    });
    await application.save();

    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicants: 1 } });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).populate('job');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/job/:jobId', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'company') return res.status(403).json({ message: 'Access denied' });
  try {
    const applications = await Application.find({ job: req.params.jobId }).populate('user', '-password');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/company-applications', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'company') return res.status(403).json({ message: 'Access denied' });
  try {
    const jobs = await Job.find({ createdBy: req.user.id }).select('_id');
    const jobIds = jobs.map(j => j._id);
    const applications = await Application.find({ job: { $in: jobIds } }).populate('user', '-password').populate('job', 'title').sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'company') return res.status(403).json({ message: 'Access denied' });
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
