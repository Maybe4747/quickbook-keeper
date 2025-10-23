const express = require('express');
const router = express.Router();
const {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetById
} = require('../controllers/budgetController');

const { protect } = require('../middleware/authMiddleware');

// All routes will be protected
router.route('/').get(protect, getBudgets).post(protect, createBudget);
router.route('/:id').get(protect, getBudgetById).put(protect, updateBudget).delete(protect, deleteBudget);

module.exports = router;