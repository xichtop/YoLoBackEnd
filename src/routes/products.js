const express = require('express');
const router = express.Router();
const productsController = require('../app/controllers/ProductsController');
const verifyToken = require('../middleware/verifyToken');

router.use('/updatestatus', verifyToken, productsController.updateStatus);

router.use('/updatequantity', verifyToken, productsController.updateQuantity);

router.use('/update', verifyToken, productsController.update);

router.use('/getall', verifyToken, productsController.getAll);

router.use('/getaccessory', productsController.getAccessory);

router.use('/getquantity/:id',productsController.getQuantity);

router.use('/additem', verifyToken, productsController.addItem);

router.use('/:id',productsController.getById);

router.use('/', productsController.index);

module.exports = router;