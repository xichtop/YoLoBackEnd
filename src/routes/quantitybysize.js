const express = require('express');
const router = express.Router();
const quantitybysizeController = require('../app/controllers/QuantitybysizeController');

router.use('/:ProductId', quantitybysizeController.getById);

router.use('/', quantitybysizeController.index);

module.exports = router;