const express = require('express');
const router = express.Router();
const OrderController = require('../app/controllers/OrderController');
const verifyToken = require('../middleware/verifyToken');

//User add new item
router.use('/add', verifyToken, OrderController.addItem);

//Admin get all item
router.use('/getall', OrderController.getAll);

//Admin get item by id
router.use('/getitem/:orderid', OrderController.getItem);

// User update to canceled
router.use('/update/:orderid', OrderController.update);

// Admin canceld
router.use('/update/:orderid', OrderController.update);

// Admin confirm
router.use('/confirm/:orderid', OrderController.confirm);

// User get all by email and status
router.use('/all/:email/:status', OrderController.getAllByUserIdAndStatus);

// User get all by email
router.use('/all/:email', OrderController.getAllByUserId);


// router.use('/',  OrderController.index);

module.exports = router;