const express = require('express');
const router = express.Router();
const categoriesController = require('../app/controllers/CategoriesController');

router.use('/:id', categoriesController.getById);

router.use('/', categoriesController.index);

module.exports = router;