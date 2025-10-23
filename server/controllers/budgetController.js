const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ userId: req.user._id });
  
  res.status(200).json({
    success: true,
    count: budgets.length,
    data: budgets
  });
});

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
const getBudgetById = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);
  
  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }
  
  // Check if budget belongs to the user
  if (budget.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this budget');
  }
  
  res.status(200).json({
    success: true,
    data: budget
  });
});

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
const createBudget = asyncHandler(async (req, res) => {
  const { category, amount, period, startDate, endDate, description } = req.body;
  
  // Validation
  if (!category || !amount || !period || !startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide category, amount, period, start date and end date');
  }
  
  // Check if budget already exists for this category and period
  const budgetExists = await Budget.findOne({
    category,
    userId: req.user._id
  });
  
  if (budgetExists) {
    res.status(400);
    throw new Error('Budget already exists for this category');
  }
  
  const budget = await Budget.create({
    category,
    amount,
    period,
    startDate,
    endDate,
    description,
    userId: req.user._id
  });
  
  res.status(201).json({
    success: true,
    data: budget
  });
});

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = asyncHandler(async (req, res) => {
  let budget = await Budget.findById(req.params.id);
  
  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }
  
  // Check if budget belongs to the user
  if (budget.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this budget');
  }
  
  budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: budget
  });
});

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findById(req.params.id);
  
  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }
  
  // Check if budget belongs to the user
  if (budget.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this budget');
  }
  
  await budget.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget
};