const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  note: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);