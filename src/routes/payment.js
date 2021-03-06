const express = require('express');
const router = express.Router();
const PayMentController = require('../app/controllers/PayMentController');
const verifyToken = require('../middleware/verifyToken');

router.use('/', verifyToken, PayMentController.index);

module.exports = router;