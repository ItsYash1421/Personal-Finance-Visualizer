const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive']
  },
  category: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique budget per category per month
budgetSchema.index({ category: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema); 