const express = require('express');
const {
  getCallLogs,
  getCallLogsByClient,
  getCallLog,
  createCallLog,
  updateCallLog,
  deleteCallLog
} = require('../controllers/callLogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
  .get(getCallLogs)
  .post(createCallLog);

router.get('/client/:clientId', getCallLogsByClient);

router.route('/:id')
  .get(getCallLog)
  .put(updateCallLog)
  .delete(deleteCallLog);

module.exports = router;
