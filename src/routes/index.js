const productsRouter = require('./products');
const productvariantsRouter = require('./product_variants');
const productsizeRouter = require('./productsize');
const categoriesRouter = require('./categories');
const userRouter = require('./user');
const employeeRouter = require('./employee');
const discountRouter = require('./discount');
const shipppingRouter = require('./shipping');
const paymentRouter = require('./payment');
const orderRouter = require('./order');
const reviewRouter = require('./review');

function route(app) {

    app.use('/categories/', categoriesRouter);
    app.use('/products/', productsRouter);
    app.use('/productvariants/', productvariantsRouter);
    app.use('/productsize/', productsizeRouter);
    app.use('/discount/', discountRouter);
    app.use('/shipping/', shipppingRouter);
    app.use('/payment/', paymentRouter);
    app.use('/order/', orderRouter);
    app.use('/employee/', employeeRouter);
    app.use('/user/', userRouter);
    app.use('/reviews/', reviewRouter);
}

module.exports = route;
