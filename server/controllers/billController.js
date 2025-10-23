const asyncHandler = require('express-async-handler');
const Bill = require('../models/Bill');
const Category = require('../models/Category');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
const getBills = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type, categoryId, startDate, endDate, keyword } = req.query;
  
  // Build filter object
  const filter = { userId: req.user._id };
  
  if (type) {
    filter.type = type;
  }
  
  if (categoryId) {
    filter.categoryId = categoryId;
  }
  
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }
  
  if (keyword) {
    filter.note = { $regex: keyword, $options: 'i' };
  }
  
  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Get bills with category population
  const bills = await Bill.find(filter)
    .populate('categoryId', 'name type')
    .sort({ date: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  // Get total count for pagination
  const total = await Bill.countDocuments(filter);
  
  // Calculate stats for the filtered results
  const stats = await Bill.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
        totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
      }
    }
  ]);
  
  const { totalIncome = 0, totalExpense = 0 } = stats[0] || {};
  
  res.status(200).json(
    successResponse({
      list: bills.map(bill => ({
        _id: bill._id,
        amount: bill.amount,
        type: bill.type,
        categoryId: bill.categoryId._id,
        category: bill.categoryId,
        date: bill.date,
        note: bill.note,
        createdAt: bill.createdAt
      })),
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total
      },
      stats: {
        totalIncome,
        totalExpense
      }
    }, '获取账单成功')
  );
});

// @desc    Get bill by ID
// @route   GET /api/bills/:id
// @access  Private
const getBillById = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id).populate('categoryId', 'name type');
  
  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }
  
  // Check if bill belongs to the user
  if (bill.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to access this bill');
  }
  
  res.status(200).json(
    successResponse({
      _id: bill._id,
      amount: bill.amount,
      type: bill.type,
      categoryId: bill.categoryId._id,
      date: bill.date,
      note: bill.note,
      createdAt: bill.createdAt
    }, '获取账单成功')
  );
});

// @desc    Create new bill
// @route   POST /api/bills
// @access  Private
const createBill = asyncHandler(async (req, res) => {
  const { amount, type, categoryId, date, note } = req.body;
  
  // Validation
  if (!amount || !type || !categoryId || !date) {
    res.status(400);
    throw new Error('Please provide amount, type, categoryId and date');
  }
  
  // Verify category exists and belongs to user
  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(400);
    throw new Error('Category not found');
  }
  
  const bill = await Bill.create({
    amount,
    type,
    categoryId,
    date,
    note,
    userId: req.user._id
  });
  
  // Populate category data for response
  await bill.populate('categoryId', 'name type');
  
  res.status(201).json(
    successResponse({
      _id: bill._id,
      amount: bill.amount,
      type: bill.type,
      categoryId: bill.categoryId._id,
      date: bill.date,
      note: bill.note,
      createdAt: bill.createdAt
    }, '账单创建成功')
  );
});

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Private
const updateBill = asyncHandler(async (req, res) => {
  const { amount, type, categoryId, date, note } = req.body;
  
  let bill = await Bill.findById(req.params.id);
  
  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }
  
  // Check if bill belongs to the user
  if (bill.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this bill');
  }
  
  // Verify category exists
  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(400);
      throw new Error('Category not found');
    }
  }
  
  bill = await Bill.findByIdAndUpdate(
    req.params.id,
    { amount, type, categoryId, date, note },
    { new: true, runValidators: true }
  ).populate('categoryId', 'name type');
  
  res.status(200).json(
    successResponse({
      _id: bill._id,
      amount: bill.amount,
      type: bill.type,
      categoryId: bill.categoryId._id,
      date: bill.date,
      note: bill.note,
      createdAt: bill.createdAt
    }, '账单更新成功')
  );
});

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private
const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  
  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }
  
  // Check if bill belongs to the user
  if (bill.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this bill');
  }
  
  await Bill.findByIdAndDelete(req.params.id);
  
  res.status(200).json(
    successResponse(null, '账单删除成功')
  );
});

// @desc    Get bills summary
// @route   GET /api/bills/summary
// @access  Private
const getBillsSummary = asyncHandler(async (req, res) => {
  const result = await Bill.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
        totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
      }
    }
  ]);
  
  const { totalIncome = 0, totalExpense = 0 } = result[0] || {};
  const balance = totalIncome - totalExpense;
  
  res.status(200).json(
    successResponse({
      expense: totalExpense,
      income: totalIncome,
      balance
    }, '获取账单摘要成功')
  );
});

// @desc    Get recent bills
// @route   GET /api/bills/recent
// @access  Private
const getRecentBills = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  
  const bills = await Bill.find({ userId: req.user._id })
    .populate('categoryId', 'name type')
    .sort({ date: -1, createdAt: -1 })
    .limit(parseInt(limit));
  
  res.status(200).json(
    successResponse(bills.map(bill => ({
      _id: bill._id,
      amount: bill.amount,
      type: bill.type,
      categoryId: bill.categoryId._id,
      category: bill.categoryId,
      date: bill.date,
      note: bill.note,
      createdAt: bill.createdAt
    })), '获取最近账单成功')
  );
});

module.exports = {
  getBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
  getBillsSummary,
  getRecentBills
};