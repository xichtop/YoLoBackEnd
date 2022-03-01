const express = require('express');
const router = express.Router();
const reviewsController = require('../app/controllers/ReviewsController');
const verifyToken = require('../middleware/verifyToken');

router.use('/add', verifyToken, reviewsController.addItem);

router.use('/:ProductId', reviewsController.getById);

router.use('/', reviewsController.index);

module.exports = router;