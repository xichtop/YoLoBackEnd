
const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const verifyToken = require('../middleware/verifyToken');

router.use('/login', userController.login);

router.use('/register', userController.register);


//User

router.use('/update', verifyToken, userController.update);

router.use('/get/:id', verifyToken, userController.getById);

//Admin
router.use('/getall', verifyToken, userController.getAll);

router.use('/updatestatus', verifyToken, userController.updateStatus);


module.exports = router;