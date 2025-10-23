const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  
  res.status(200).json(
    successResponse(categories.map(category => ({
      _id: category._id,
      name: category.name,
      type: category.type,
      createdAt: category.createdAt
    })), '获取分类成功')
  );
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  res.status(200).json(
    successResponse({
      _id: category._id,
      name: category.name,
      type: category.type,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }, '获取分类成功')
  );
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
const createCategory = asyncHandler(async (req, res) => {
  const { name, type } = req.body;
  
  // Validation
  if (!name || !type) {
    res.status(400);
    throw new Error('Please provide name and type');
  }
  
  const categoryExists = await Category.findOne({
    name,
    type
  });
  
  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }
  
  const category = await Category.create({
    name,
    type
  });
  
  res.status(201).json(
    successResponse({
      _id: category._id,
      name: category.name,
      type: category.type,
      createdAt: category.createdAt
    }, '分类创建成功')
  );
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const { name, type } = req.body;
  
  let category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, type },
    { new: true, runValidators: true }
  );
  
  res.status(200).json(
    successResponse({
      _id: category._id,
      name: category.name,
      type: category.type,
      updatedAt: category.updatedAt
    }, '分类更新成功')
  );
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  await Category.findByIdAndDelete(req.params.id);
  
  res.status(200).json(
    successResponse(null, '分类删除成功')
  );
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};