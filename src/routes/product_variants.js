const express = require('express');
const router = express.Router();
const productvariantsController = require('../app/controllers/ProductVariantsController');
const verifyToken = require('../middleware/verifyToken');

router.use('/update', verifyToken, productvariantsController.update);

router.use('/checkcolor', verifyToken, productvariantsController.checkColor);

router.use('/checksize', verifyToken, productvariantsController.checkSize);

module.exports = router;