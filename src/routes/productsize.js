const express = require('express');
const router = express.Router();
const productSizeController = require('../app/controllers/ProductSizeController');
const verifyToken = require('../middleware/verifyToken');

router.use('/update', verifyToken, productSizeController.update);

module.exports = router;