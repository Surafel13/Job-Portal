const express = require('express');
const Job = require('../models/Job');
const { verifyToken, checkRole } = require('../middleware/auth');

const router = express.Router();

// Get all jobs with optional filtering (protected, logged-in only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { title, location, type, company, experience, salary } = req.query;
    const query = { status: 'active' };

    if (title)      query.title      = { $regex: title,      $options: 'i' };
    if (location)   query.location   = { $regex: location,   $options: 'i' };
    if (company)    query.company    = { $regex: company,    $options: 'i' };
    if (type)       query.type       = { $regex: type,       $options: 'i' };
    if (experience) query.experience = { $regex: experience, $options: 'i' };
    if (salary)     query.salary     = { $regex: salary,     $options: 'i' };

    const jobs = await Job.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get jobs created by current company
router.get('/my-jobs', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'company') return res.status(403).json({ message: 'Access denied' });
  try {
    const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a job (admin or company)
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'company') return res.status(403).json({ message: 'Access denied' });
  try {
    const { title, description, company, location, type, salary, experience, applicants, responsibilities, requirements } = req.body;
    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: 'title, description, company, and location are required.' });
    }
    const newJob = new Job({
      title, description, company, location,
      type:            type            || 'Full-time',
      salary:          salary          || '',
      experience:      experience      || '',
      applicants:      applicants      || '0',
      responsibilities:responsibilities || [],
      requirements:    requirements    || [],
      createdBy: req.user.id
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a job
router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'company') return res.status(403).json({ message: 'Access denied' });
  try {
    const { title, description, company, location, type, salary, experience, applicants, responsibilities, requirements, status } = req.body;
    if (!title && !description && !status) {
      return res.status(400).json({ message: 'Missing update fields.' });
    }
    
    // Check ownership
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    if (req.user.role === 'company' && job.createdBy.toString() !== req.user.id) {
       return res.status(403).json({ message: 'You can only edit your own jobs.' });
    }
    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { title, description, company, location, type, salary, experience, applicants, responsibilities, requirements, status },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email role');
    if (!updated) return res.status(404).json({ message: 'Job not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a job
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'company') return res.status(403).json({ message: 'Access denied' });
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found.' });
    if (req.user.role === 'company' && job.createdBy.toString() !== req.user.id) {
       return res.status(403).json({ message: 'You can only delete your own jobs.' });
    }
    await Job.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Job not found.' });
    res.json({ message: 'Job deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const User = require('../models/User');

// Save/Unsave job (protected)
router.post('/save/:jobId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;
    
    // Check if already saved
    const index = user.savedJobs.indexOf(jobId);
    if (index > -1) {
      // Unsave
      user.savedJobs.splice(index, 1);
      await user.save();
      return res.json({ message: 'Job removed from saved list', saved: false });
    } else {
      // Save
      user.savedJobs.push(jobId);
      await user.save();
      res.json({ message: 'Job saved successfully', saved: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all saved jobs (protected)
router.get('/saved', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedJobs');
    res.json(user.savedJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get related jobs (protected)
router.get('/related/:id', verifyToken, async (req, res) => {
  try {
    const currentJob = await Job.findById(req.params.id);
    if (!currentJob) return res.status(404).json({ message: 'Job not found' });

    // Find jobs with same company or similar title, excluding current one
    const relatedJobs = await Job.find({
      _id: { $ne: currentJob._id },
      $or: [
        { company: currentJob.company },
        { title: { $regex: currentJob.title.split(' ')[0], $options: 'i' } }
      ]
    })
    .limit(5)
    .populate('createdBy', 'name email role');

    res.json(relatedJobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single job by ID (protected)
router.get('/:id', verifyToken, async (req, res) => {


  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email role');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
