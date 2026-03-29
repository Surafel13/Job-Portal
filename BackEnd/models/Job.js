const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:           { type: String, required: true },
  description:     { type: String, required: true },
  company:         { type: String, required: true },
  location:        { type: String, required: true },
  type:            { type: String, default: 'Full-time' },
  salary:          { type: String, default: '' },
  experience:      { type: String, default: '' },
  applicants:      { type: String, default: '0' },
  responsibilities:{ type: [String], default: [] },
  requirements:    { type: [String], default: [] },
  status:          { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt:       { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
