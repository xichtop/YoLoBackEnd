const express = require('express');
const router = express.Router();
const categoriesController = require('../app/controllers/CategoriesController');
const verifyToken = require('../middleware/verifyToken');

router.use('/statistic/:month/:year', verifyToken, categoriesController.getQuantityByMonthAndYear);

router.use('/statistic/:year', verifyToken, categoriesController.getQuantityByYear);

router.use('/:id', categoriesController.getProductById);

router.use('/', categoriesController.index);

module.exports = router;