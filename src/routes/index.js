const productsRouter = require('./products');
const productvariantsRouter = require('./product_variants');
const quantitybysizeRouter = require('./quantitybysize');
const categoriesRouter = require('./categories');
const userRouter = require('./user');
const discountRouter = require('./discount');
const shipppingRouter = require('./shipping');
const paymentRouter = require('./payment');
const orderRouter = require('./order');

function route(app) {

    app.use('/categories/', categoriesRouter);
    app.use('/products/', productsRouter);
    app.use('/productvariants/', productvariantsRouter);
    app.use('/quantitybysize/', quantitybysizeRouter);
    app.use('/discount/', discountRouter);
    app.use('/shipping/', shipppingRouter);
    app.use('/payment/', paymentRouter);
    app.use('/order/', orderRouter);
    app.use('/user/', userRouter);
}

module.exports = route;
