const express = require('express');
const router = express.Router();
const productvariantsController = require('../app/controllers/ProductVariantsController');

router.use('/:ProductId', productvariantsController.getById);

router.use('/', productvariantsController.index);

module.exports = router;