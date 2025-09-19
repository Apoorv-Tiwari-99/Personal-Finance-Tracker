const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Food', 'Rent', 'Shopping', 'Transportation', 'Entertainment', 'Healthcare', 'Education', 'Utilities', 'Other']
  },
  monthlyLimit: {
    type: Number,
    required: [true, 'Please add a monthly limit'],
    min: [0, 'Monthly limit cannot be negative']
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
  }
}, {
  timestamps: true
});

// Ensure one budget per category per month per user
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);