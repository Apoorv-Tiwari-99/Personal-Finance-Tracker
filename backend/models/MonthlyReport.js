const mongoose = require('mongoose');

const monthlyReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  totalSpent: {
    type: Number,
    required: true,
    default: 0
  },
  topCategory: {
    category: String,
    amount: Number
  },
  overbudgetCategories: [{
    category: String,
    budgeted: Number,
    spent: Number
  }]
}, {
  timestamps: true
});

// Ensure one report per user per month
monthlyReportSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyReport', monthlyReportSchema);