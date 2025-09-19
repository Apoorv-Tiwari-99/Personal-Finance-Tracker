const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Food', 'Rent', 'Shopping', 'Transportation', 'Entertainment', 'Healthcare', 'Education', 'Utilities', 'Other']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date'],
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add a payment method'],
    enum: ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other']
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot be more than 200 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);