const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
  
  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions
  });
});

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  
  // Check if transaction belongs to the user
  if (transaction.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this transaction');
  }
  
  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, description, date, tags } = req.body;
  
  // Validation
  if (!type || !category || !amount) {
    res.status(400);
    throw new Error('Please provide type, category and amount');
  }
  
  const transaction = await Transaction.create({
    type,
    category,
    amount,
    description,
    date: date || Date.now(),
    tags,
    userId: req.user._id
  });
  
  res.status(201).json({
    success: true,
    data: transaction
  });
});

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  let transaction = await Transaction.findById(req.params.id);
  
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  
  // Check if transaction belongs to the user
  if (transaction.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this transaction');
  }
  
  transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: transaction
  });
});

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  
  if (!transaction) {
    res.status(404);
    throw new Error('Transaction not found');
  }
  
  // Check if transaction belongs to the user
  if (transaction.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this transaction');
  }
  
  await transaction.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};