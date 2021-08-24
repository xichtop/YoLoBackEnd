var sql = require("mssql");
var async = require('async');
var config = require("../config/config");
var { SendMail } = require('../mail/mailer');

class OrderController {
    // [GET] 

    //User
    async getAllByUserId(req, res) {

        var query = `select * from Orders Where Email = '${req.params.email}' Order By OrderId DESC`;
        var query2 = `select * from OrderDetails`;
        var query3 = `select * from Products`;
        var orders = [];
        var orderDetails = [];
        var productList = [];
        try {
            let pool = await sql.connect(config)
            let result1 = await pool.request()
                .query(query)
            let result2 = await pool.request()
                .query(query2)
            let result3 = await pool.request()
                .query(query3)
            orders = result1.recordsets[0];
            orderDetails = result2.recordsets[0];
            productList = result3.recordsets[0];
        } catch (err) {

        }
        var temp = [];
        orders.forEach(order => {
            var products = orderDetails.filter(function (e) {
                return e.OrderId === order.OrderId;
            });
            var tempProducts = [];
            products.forEach(product => {
                var currentProduct = productList.find(producttemp => producttemp.ProductId === product.ProductId);
                tempProducts.push({
                    ...product,
                    URLPicture: currentProduct.URLPicture,
                    Title: currentProduct.Title,
                })
            })
            var newOrder = {
                ...order,
                products: tempProducts,
            }
            temp.push(newOrder);
        })
        res.json(temp);
    }

    async getAllByUserIdAndStatus(req, res) {

        var query = `select * from Orders Where Email = '${req.params.email}' And Status = '${req.params.status}' Order By OrderId DESC`;
        var query2 = `select * from OrderDetails`;
        var query3 = `select * from Products`;
        var orders = [];
        var orderDetails = [];
        var productList = [];
        try {
            let pool = await sql.connect(config)
            let result1 = await pool.request()
                .query(query)
            let result2 = await pool.request()
                .query(query2)
            let result3 = await pool.request()
                .query(query3)
            orders = result1.recordsets[0];
            orderDetails = result2.recordsets[0];
            productList = result3.recordsets[0];
        } catch (err) {

        }
        var temp = [];
        orders.forEach(order => {
            var products = orderDetails.filter(function (e) {
                return e.OrderId === order.OrderId;
            });
            var tempProducts = [];
            products.forEach(product => {
                var currentProduct = productList.find(producttemp => producttemp.ProductId === product.ProductId);
                tempProducts.push({
                    ...product,
                    URLPicture: currentProduct.URLPicture,
                    Title: currentProduct.Title,
                })
            })
            var newOrder = {
                ...order,
                products: tempProducts,
            }
            temp.push(newOrder);
        })
        res.json(temp);
    }

    async addItem(req, res) {
        const { products, email, shipping, payment, status, total, discountId } = req.body;
        var queryTop = `select top(1) OrderId from Orders order by OrderId DESC`;
        var OrderId = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(queryTop)
            OrderId = result.recordsets[0][0].OrderId;
            sql.close();
        } catch (err) {
        }
        OrderId += 1;
        var OrderQuery = `insert into Orders (ShippingMethodId, PaymentMethodId, Email, OrderDate, Status, Total) VALUES('${shipping}', '${payment}', '${email}', getDate(), '${status}', ${total})`;
        var listQuery = [];
        listQuery.push(OrderQuery);
        products.forEach(product => {
            var query = `insert into OrderDetails (OrderId, ProductId, Quantity, Color, Size) values ('${OrderId}', '${product.ProductId}', '${product.Quantity}', '${product.Color}', '${product.Size}')`;
            var query2 = `update Products set Quantity = Quantity - ${product.Quantity} where ProductId = '${product.ProductId}'`
            listQuery.push(query);
            listQuery.push(query2);
        })
        if (discountId !== '') {
            var query = `update Discount set Quantity = Quantity - 1 where DiscountId = '${discountId}'`;
            listQuery.push(query);
        }
        const pool = new sql.ConnectionPool(config)
        pool.connect(err => {
            if (err) console.log(err)
            const transaction = new sql.Transaction(pool)
            const request = new sql.Request(transaction)
            transaction.begin(err => {
                if (err) return console.log(err)
                async.eachSeries(listQuery, function (query, callback) {
                    request.query(query, (err, result) => {
                        if (err) {
                            callback(err)
                        } else {
                            callback()
                        }
                    })
                }, function (err) {
                    if (err) {
                        transaction.rollback()
                        res.json({ successful: false, message: "Đã xảy ra lỗi!" });
                        console.log(err)
                    } else {
                        console.log('success!')
                        const subject = 'Đặt Hàng thành công!';
                        const body = "Đơn hàng của bạn đã được tiếp nhận.";
                        SendMail(email, subject, body);
                        res.json({ successful: true, message: "Thành công!" });
                        transaction.commit()
                    }
                })
            })
        })

    }

    //User and Admin

    async update(req, res) {
        const orderId = req.params.orderid
        const query = `UPDATE Orders SET Status = 'Canceled' WHERE OrderId = '${orderId}'`;
        var status = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            status = result;
        } catch (err) {

        }
        if (status != 0) {
            console.log('thành công!');
            res.json({ successful: true, message: 'Hủy thành công!', status: status });
        }
        else {
            console.log('thất bại!');
            res.json({ successful: false, message: 'Hủy thất bại!', status: status });
        }
    }

    //Admin

    async getAll(req, res) {
        var query = "Select * From Orders Order By OrderId DESC"
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {

        }
    }

    async getItem(req, res) {
        const orderId = req.params.orderid
        var query1 = `Select * From Orders Where OrderId = ${orderId}`;
        var query2 = `Select * From OrderDetails Where OrderId = ${orderId}`;
        var query3 = `Select * From Products`;
        let order = {};
        let orderDetails = [];
        let products = [];
        try {
            let pool = await sql.connect(config)
            let result1 = await pool.request()
                .query(query1)
            let result2 = await pool.request()
                .query(query2)
            let result3 = await pool.request()
                .query(query3)
            order = result1.recordsets[0][0];
            orderDetails = result2.recordsets[0];
            products = result3.recordsets[0];
        } catch (err) {

        }
        var newProducts = [];
        orderDetails.forEach(detail => {
            const newProduct = products.find(product => product.ProductId === detail.ProductId);
            newProducts.push({ 
                ...detail,
                URLPicture: newProduct.URLPicture,
                Title: newProduct.Title,
            });
        })
        const newOrder = {
            ...order,
            products: newProducts,
        }
        res.json(newOrder);
    }

    async confirm(req, res) {
        const orderId = req.params.orderid
        const query = `UPDATE Orders SET Status = 'Confirmed' WHERE OrderId = '${orderId}'`;
        var status = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            status = result;
        } catch (err) {

        }
        if (status != 0) {
            console.log('thành công!');
            res.json({ successful: true, message: 'Xác nhận thành công!', status: status });
        }
        else {
            console.log('thất bại!');
            res.json({ successful: false, message: 'Xác nhận thất bại!', status: status });
        }
    }


}

module.exports = new OrderController();