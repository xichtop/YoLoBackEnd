var sql = require("mssql");
var async = require('async');
var config = require("../config/config");
var { SendMail } = require('../mail/mailer');
var axios = require("axios");
class OrderController {
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
        const { products, email, shipping, payment, status, total, discountId, shiptype } = req.body;
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
        var OrderQuery = `insert into Orders (ShippingMethodId, PaymentMethodId, Email, OrderDate, Status, Total, ShipType) 
                        VALUES('${shipping}', '${payment}', '${email}', getDate(), '${status}', ${total}, N'${shiptype}')`;
        var listQuery = [];
        listQuery.push(OrderQuery);
        products.forEach(product => {
            var query = `insert into OrderDetails (OrderId, ProductId, Quantity, Color, Size, Review) values ('${OrderId}', '${product.ProductId}', '${product.Quantity}', '${product.Color}', '${product.Size}', 0)`;
            var query2 = `update Products set Quantity = Quantity - ${product.Quantity} where ProductId = '${product.ProductId}'`
            var query3 = `update Products set Sold = Sold + ${product.Quantity} where ProductId = '${product.ProductId}'`
            listQuery.push(query);
            listQuery.push(query2);
            listQuery.push(query3);
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
        const orderId = req.params.orderid;

        var query1 = `select * from OrderDetails Where OrderId = '${orderId}'`;
        var orderDetails = [];
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query1)
            orderDetails = result.recordsets[0];
        } catch (err) {

        }
        var listQuery = [];
        const queryUpdate = `UPDATE Orders SET Status = 'Canceled' WHERE OrderId = '${orderId}'`;
        listQuery.push(queryUpdate);
        orderDetails.forEach(order => {
            const query = `UPDATE Products SET Quantity = Quantity + ${order.Quantity} WHERE ProductId = '${order.ProductId}'`;
            listQuery.push(query);
        })
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
                        res.json({ successful: true, message: "Hủy Thành công!" });
                        transaction.commit()
                    }
                })
            })
        })
    }

    async updateAdmin(req, res) {
        const orderId = req.params.orderid;
        const employeeId = req.params.employeeid;
        var query = `select * from OrderDetails Where OrderId = '${orderId}'`;
        var orderDetails = [];
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            orderDetails = result.recordsets[0];
        } catch (err) {

        }
        var listQuery = [];
        const queryUpdate = `UPDATE Orders SET Status = 'Canceled', EmployeeId = '${employeeId}' WHERE OrderId = '${orderId}'`;
        listQuery.push(queryUpdate);
        orderDetails.forEach(order => {
            const query = `UPDATE Products SET Quantity = Quantity + ${order.Quantity} WHERE ProductId = '${order.ProductId}'`;
            listQuery.push(query);
        })
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
                        res.json({ successful: true, message: "Hủy Thành công!" });
                        transaction.commit()
                    }
                })
            })
        })
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

    //Admin confirm order
    async confirm(req, res) {
        const orderId = req.params.orderid;
        const employeeId = req.params.employeeid;
        const query = `UPDATE Orders SET Status = 'Confirmed', EmployeeId = '${employeeId}' WHERE OrderId = '${orderId}'`;
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

    async deliver(req, res) {
        const orderId = req.params.orderid;
        const employeeId = req.params.employeeid;
        const query = `UPDATE Orders SET Status = 'Delivered', EmployeeId = '${employeeId}' WHERE OrderId = '${orderId}'`;
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
            res.json({ successful: true, message: 'Giao hàng thành công!', status: status });
        }
        else {
            console.log('thất bại!');
            res.json({ successful: false, message: 'Giao hàng thất bại!', status: status });
        }
    }

    async getStatisticByYear(req, res) {

        var query = `select Month(OrderDate) AS Month, sum(Total) as Total from Orders 
                    where Year(OrderDate) = ${req.params.year} and Status = 'Delivered' Group by Month(OrderDate)`
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {

        }
    }

    async getStatisticByMonthAndYear(req, res) {

        var query = `select Day(OrderDate) AS Day, sum(Total) as Total from Orders 
                    where Month(OrderDate) = ${req.params.month} and Year(OrderDate) = ${req.params.year} and Status = 'Delivered'
                    Group by Day(OrderDate)`
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {

        }
    }

    async addItemSuperShip(req, res) {
        const { OrderId, COD, GoodName, GoodWeight, GoodSize, GoodType } = req.body;

        console.log(req.body);

        const queryOrder = `Select Orders.*, Users.FullName, Users.Phone from Orders 
                        Left Join Users On Orders.Email = Users.Email
                        Where OrderId = '${OrderId}'`;

        var order = '';
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(queryOrder)
            order = result.recordsets[0][0];
        } catch (err) {
            console.log(err);
        }

        const addItem = async () => {
            const data = {
                StoreId: 'CH001',
                RecieverPhone: order.Phone,
                RecieverName: order.FullName,
                ProvinceCode: '79',
                DistrictCode: '769',
                WardCode: '26845',
                AddressDetail: 'Hẻm 69 Trương Văn Hải',
                Picture: 'https://storage.googleapis.com/cdn.nhanh.vn/store/7136/ps/20210415/15042021050423_1.jpg',
                COD: COD,
                ShipType: order.ShipType,
                GoodName: GoodName,
                GoodWeight: GoodWeight,
                GoodSize: GoodSize,
                GoodType: GoodType
            }
            try {
                return await axios.post('http://172.20.10.3:3001/deliveries/add', data)
            } catch (error) {
                console.error(error)
            }
        }

        const result = await addItem();
        console.log(result);
        if (result.data.successful === true) {
            console.log('thành công!');
            res.json({ successful: true, message: 'Giao hàng thành công!' });
        }
        else {
            console.log('thất bại!');
            res.json({ successful: false, message: 'Giao hàng thất bại!' });
        }
    }

}

module.exports = new OrderController();