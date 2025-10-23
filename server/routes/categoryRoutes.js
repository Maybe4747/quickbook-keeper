const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById
} = require('../controllers/categoryController');

const { protect } = require('../middleware/authMiddleware');

// All routes will be protected
router.route('/').get(protect, getCategories).post(protect, createCategory);
router.route('/:id').get(protect, getCategoryById).put(protect, updateCategory).delete(protect, deleteCategory);

module.exports = router;