const express = require('express');
const Company = require('../models/Company');
const { verifyToken: auth } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('user', '-password');
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const { password, contactEmail, ...companyData } = req.body;
    
    // Check if user already exists
    let existingUser = await User.findOne({ email: contactEmail });
    if (existingUser) return res.status(400).json({ message: 'User with this email already exists' });

    // Create Company User Account
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'company123', salt);
    
    const companyUser = new User({
      name: companyData.name,
      email: contactEmail,
      password: hashedPassword,
      role: 'company'
    });
    await companyUser.save();

    // Create Company Profile
    const company = new Company({
      ...companyData,
      contactEmail,
      user: companyUser._id // linking optional but good
    });
    await company.save();

    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
