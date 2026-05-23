const Job = require('../models/Job');

// @route   GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const { status, company, role, search } = req.query;
    
    // Build query object dynamically
    let query = { user: req.user._id };
    if (status) query.status = status;
    if (company) query.company = new RegExp(company, 'i'); // case-insensitive
    if (role) query.role = new RegExp(role, 'i');
    if (search) {
      query.$or = [
        { company: new RegExp(search, 'i') },
        { role: new RegExp(search, 'i') },
        { notes: new RegExp(search, 'i') }
      ];
    }

    const jobs = await Job.find(query).sort({ dateApplied: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    // req.user._id comes from the auth middleware
    const job = await Job.create({ ...req.body, user: req.user._id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route   PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Authorization check: make sure this job belongs to the logged-in user
    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,      // return the updated document, not the old one
      runValidators: true // re-run schema validators on update
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route   GET /api/jobs/stats  (for dashboard)
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Job.countDocuments({ user: userId });
    
    // MongoDB aggregation: group by status and count each
    const byStatus = await Job.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Applications per month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const byMonth = await Job.aggregate([
      { $match: { user: userId, dateApplied: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$dateApplied' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Follow-up reminders due in next 7 days
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const followUps = await Job.find({
      user: userId,
      followUpDate: { $gte: today, $lte: nextWeek }
    }).select('company role followUpDate');

    // Response rate = (Screening + Interview + Offer + Rejected) / Total
    const responded = byStatus
      .filter(s => ['Screening', 'Interview', 'Offer', 'Rejected'].includes(s._id))
      .reduce((sum, s) => sum + s.count, 0);

    res.json({
      total,
      responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
      byStatus,
      byMonth,
      followUps
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob, getStats };