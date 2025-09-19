const express = require('express');
const {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} = require('../controllers/expenseController');

const { protect } = require('../middleware/auth');
const { validateExpense } = require('../middleware/validation');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getExpenses)
  .post(validateExpense, createExpense);

router
  .route('/:id')
  .get(getExpense)
  .put(validateExpense, updateExpense)
  .delete(deleteExpense);

router.get('/stats/summary', getExpenseSummary);

module.exports = router;