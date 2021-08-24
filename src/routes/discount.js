const express = require('express');
const router = express.Router();
const DiscountController = require('../app/controllers/DiscountController');

router.use('/:id', DiscountController.getById);

router.use('/',  DiscountController.index);

module.exports = router;