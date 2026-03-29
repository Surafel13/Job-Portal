const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  industry: { type: String },
  website: { type: String },
  location: { type: String },
  logoUrl: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
