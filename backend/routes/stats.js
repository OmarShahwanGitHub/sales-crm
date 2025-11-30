const express = require('express');
const {
  getDashboardStats,
  getAllAgentsStats,
  getAgentStats
} = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/dashboard', getDashboardStats);
router.get('/agents', getAllAgentsStats);
router.get('/agents/:id', getAgentStats);

module.exports = router;
