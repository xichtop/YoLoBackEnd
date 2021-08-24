const express = require('express');
const router = express.Router();
const ShippingController = require('../app/controllers/ShippingController');

router.use('/',  ShippingController.index);

module.exports = router;