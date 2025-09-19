const express = require('express');
const {
  generateMonthlyReport,
  getMonthlyReports,
  getMonthlyReport
} = require('../controllers/reportController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getMonthlyReports);

router
  .route('/:id')
  .get(getMonthlyReport);

router.post('/generate', generateMonthlyReport);

module.exports = router;