const express = require('express');
const router = express.Router();

const billRoutes = require('./billRoutes');
const categoryRoutes = require('./categoryRoutes');
const userRoutes = require('./userRoutes');

router.use('/bills', billRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);

module.exports = router;