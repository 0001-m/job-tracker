const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  dateApplied: { type: Date, default: Date.now },
  jobUrl: { type: String, trim: true },
  platform: {
    type: String,
    enum: ['LinkedIn', 'Naukri', 'Indeed', 'AngelList', 'Company Website', 'Referral', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  contactPerson: { type: String, trim: true },
  notes: { type: String },
  followUpDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);