const express = require('express');
const router = express.Router();
const {
  getBills,
  createBill,
  updateBill,
  deleteBill,
  getBillById,
  getBillsSummary,
  getRecentBills,
} = require('../controllers/billController');

const { protect } = require('../middleware/authMiddleware');

// All routes will be protected
router.route('/').get(protect, getBills).post(protect, createBill);
router.route('/summary').get(protect, getBillsSummary);
router.route('/recent').get(protect, getRecentBills);
router.route('/:id').get(protect, getBillById).put(protect, updateBill).delete(protect, deleteBill);

module.exports = router;
