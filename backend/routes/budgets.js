const express = require('express');
const {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetAlerts
} = require('../controllers/budgetController');

const { protect } = require('../middleware/auth');
const { validateBudget } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

// Specific routes should come before parameterized routes
router.get('/alerts', getBudgetAlerts);

router
  .route('/')
  .get(getBudgets)
  .post(validateBudget, createBudget);

router
  .route('/:id')
  .get(getBudget)
  .put(validateBudget, updateBudget)
  .delete(deleteBudget);

module.exports = router;