const express = require('express');
const router = express.Router();
const PayMentController = require('../app/controllers/PayMentController');

router.use('/',  PayMentController.index);

module.exports = router;