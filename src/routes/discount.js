const express = require('express');
const router = express.Router();
const DiscountController = require('../app/controllers/DiscountController');
const verifyToken = require('../middleware/verifyToken');

router.use('/add', verifyToken, DiscountController.addItem);

router.use('/update', verifyToken, DiscountController.update);

router.use('/all', verifyToken, DiscountController.index);

router.use('/:id', verifyToken, DiscountController.getById);

module.exports = router;