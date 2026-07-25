const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getJobs, createJob, updateJob, deleteJob, getStats } = require('../controllers/jobController');

// /api/jobs/stats must come BEFORE /api/jobs/:id
// otherwise Express would try to find a job with id="stats"
router.get('/stats', protect, getStats);

router.route('/')
  .get(protect, getJobs)
  .post(protect, createJob);

router.route('/:id')
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;