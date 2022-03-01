const express = require('express');
const router = express.Router();
const ShippingController = require('../app/controllers/ShippingController');
const verifyToken = require('../middleware/verifyToken');

router.use('/', verifyToken, ShippingController.index);

module.exports = router;