const express = require('express');
const router = express.Router();
const OrderController = require('../app/controllers/OrderController');
const verifyToken = require('../middleware/verifyToken');

//User add new item
router.use('/add', verifyToken, OrderController.addItem);

//Admin get all item
router.use('/getall', verifyToken, OrderController.getAll);

//Admin get item by id
router.use('/getitem/:orderid', verifyToken, OrderController.getItem);

// Admin update to canceled
router.use('/update/admin/:orderid/:employeeid', verifyToken, OrderController.updateAdmin);

// Admin deliver
router.use('/deliver/admin/:orderid/:employeeid', verifyToken, OrderController.deliver);

// User update to canceled
router.use('/update/:orderid', verifyToken, OrderController.update);

// Admin confirm
router.use('/confirm/:orderid/:employeeid', verifyToken, OrderController.confirm);

// User get all by email and status
router.use('/all/:email/:status', verifyToken, OrderController.getAllByUserIdAndStatus);

// User get all by email
router.use('/all/:email', verifyToken, OrderController.getAllByUserId);

//Admin chart
router.use('/statistic/:month/:year', verifyToken, OrderController.getStatisticByMonthAndYear);

//Admin chart
router.use('/statistic/:year', verifyToken, OrderController.getStatisticByYear);


//============================================================
router.use('/additemsupership', OrderController.addItemSuperShip);


module.exports = router;