const express = require('express');
const router = express.Router();
const employeeController = require('../app/controllers/employeeController');

router.use('/login', employeeController.login);

module.exports = router;