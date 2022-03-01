var sql = require("mssql");
var async = require('async');
var config = require("../config/config");

class ProductsController {

    async getAccessory(req, res) {
        var query1 = `select * from Products Where Status = 'On' AND ( CategoryId = 'VI' Or CategoryId = 'BL' Or CategoryId = 'GI')`;
        var query2 = `select * from ProductVariants`;
        var query3 = `select * from ProductSizes`;
        var products, colors, sizes, temp = [];
        try {
            let pool = await sql.connect(config)
            let result1 = await pool.request()
                .query(query1)
            let result2 = await pool.request()
                .query(query2)
            let result3 = await pool.request()
                .query(query3)
            products = result1.recordsets[0];
            colors = result2.recordsets[0];
            sizes = result3.recordsets[0];
        } catch (err) {

        }
        products.map(product => {
            var newcolors = [];
            var newsizes = [];
            colors.map(color => {
                if (color.ProductId.trim() === product.ProductId.trim()) {
                    newcolors.push({
                        Color: color.Color,
                        URLPicture: color.URLPicture,
                    })
                }
            })
            sizes.map(size => {
                if (size.ProductId.trim() === product.ProductId.trim()) {
                    newsizes.push(size.Size);
                }
            })
            sizes.sort();
            const newProduct =
            {
                ...product,
                colors: newcolors,
                sizes: newsizes
            };
            temp.push(newProduct);
        })
        res.json(temp);
    }

    async index(req, res) {
        var query1 = `select * from Products Where Status = 'On' AND ( CategoryId = 'AT' Or CategoryId = 'SM' Or CategoryId = 'QJ')`;
        var query2 = `select * from ProductVariants`;
        var query3 = `select * from ProductSizes`;
        var products, colors, sizes, temp = [];
        try {
            let pool = await sql.connect(config)
            let result1 = await pool.request()
                .query(query1)
            let result2 = await pool.request()
                .query(query2)
            let result3 = await pool.request()
                .query(query3)
            products = result1.recordsets[0];
            colors = result2.recordsets[0];
            sizes = result3.recordsets[0];
        } catch (err) {

        }
        products.map(product => {
            var newcolors = [];
            var newsizes = [];
            colors.map(color => {
                if (color.ProductId.trim() === product.ProductId.trim()) {
                    newcolors.push({
                        Color: color.Color,
                        URLPicture: color.URLPicture,
                    })
                }
            })
            sizes.map(size => {
                if (size.ProductId.trim() === product.ProductId.trim()) {
                    newsizes.push(size.Size);
                }
            })
            sizes.sort();
            const newProduct =
            {
                ...product,
                colors: newcolors,
                sizes: newsizes
            };
            temp.push(newProduct);
        })
        res.json(temp);
    }

    // [GET] /products/:id
    async getById(req, res) {
        var query = `select * from Products where ProductId = '${req.params.id}'`; // and Status = 'On'
        var query2 = `select * from ProductVariants where ProductId = '${req.params.id}'`;
        var query3 = `select * from ProductSizes where ProductId = '${req.params.id}'`;
        var products, colors, sizes = [];
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            let result2 = await pool.request()
                .query(query2)
            let result3 = await pool.request()
                .query(query3)
            products = result.recordsets[0];
            colors = result2.recordsets[0];
            sizes = result3.recordsets[0];
        } catch (err) {

        }
        if (products.length === 0) {
            res.json({ successful: false, message: 'Mã Sản Phẩm không tồn tại!' })
        }
        var product = products[0];
        var newColors = [];
        var newSizes = [];
        colors.map(color => {
            if (color.ProductId.trim() === product.ProductId.trim()) {
                newColors.push({
                    Color: color.Color,
                    URLPicture: color.URLPicture,
                })
            }
        })
        sizes.map(size => {
            if (size.ProductId.trim() === product.ProductId.trim()) {
                newSizes.push(size.Size);
            }
        })
        var newProduct = {...product,
                            colors: newColors,
                            sizes: newSizes};
        res.json(newProduct);
    }

    async getQuantity(req, res) {
        const ProductId = req.params.id;
        const query = `Select Quantity from Products Where ProductId = '${ProductId}'`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.send(result.recordsets[0][0]);
        } catch (err) {

        }
    }

    //admin

    // User update account
    async update(req, res) {
        const { ProductId, Description, URLPicture, UnitPrice, Title, Material, Style, OldPrice } = req.body;
        const query = `UPDATE Products SET Description = N'${Description}', URLPicture = '${URLPicture}', UnitPrice = ${UnitPrice}, Title = N'${Title}', OldPrice = ${OldPrice}, Material = N'${Material}', Style = N'${Style}' WHERE ProductId = '${ProductId}'`;
        var status = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            status = result;
        } catch (err) {
            console.log('Error when update product', err);
        }
        if (status != 0) {
            res.json({ successful: true, message: 'Chỉnh sửa sản phẩm thành công!', status: status });
        }
        else {
            res.json({ successful: false, message: 'Chỉnh sửa sản phẩm thất bại!', status: status });
        }
    }

    async getAll(req, res) {
        var query1 = `select * from Products`;
        var query2 = `select * from ProductVariants`;
        var query3 = `select * from ProductSizes`;
        var products, colors, sizes, temp = [];
        try {
            let pool = await sql.connect(config)
            let result1 = await pool.request()
                .query(query1)
            let result2 = await pool.request()
                .query(query2)
            let result3 = await pool.request()
                .query(query3)
            products = result1.recordsets[0];
            colors = result2.recordsets[0];
            sizes = result3.recordsets[0];
        } catch (err) {

        }
        products.map(product => {
            var newcolors = [];
            var newsizes = [];
            colors.map(color => {
                if (color.ProductId.trim() === product.ProductId.trim()) {
                    newcolors.push({
                        Color: color.Color,
                        URLPicture: color.URLPicture,
                    })
                }
            })
            sizes.map(size => {
                if (size.ProductId.trim() === product.ProductId.trim()) {
                    newsizes.push(size.Size);
                }
            })
            sizes.sort();
            const newProduct =
            {
                ...product,
                colors: newcolors,
                sizes: newsizes
            };
            temp.push(newProduct);
        })
        res.json(temp);
    }

    async updateStatus(req, res) {
        const { ProductId, newStatus } = req.body;
        const query = `UPDATE Products SET Status = '${newStatus}' WHERE ProductId = '${ProductId}'`;
        var status = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            status = result;
        } catch (err) {
            console.log(err);
        }
        if (status != 0) {
            res.send({ successful: true, message: 'Cập nhật sản phẩm thành công!', status: status });
        }
        else {
            res.send({ successful: false, message: 'Cập nhật sản phẩm thất bại!', status: status });
        }
    }

    async updateQuantity(req, res) {
        const { productId, quantity } = req.body;
        console.log(quantity);
        const query = `UPDATE Products SET Quantity = Quantity + ${quantity} WHERE ProductId = '${productId}'`;
        var status = 0;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            status = result;
        } catch (err) {
            console.log(err);
        }
        if (status != 0) {
            res.send({ successful: true, message: 'Cập nhật sản phẩm thành công!', status: status });
        }
        else {
            res.send({ successful: false, message: 'Cập nhật sản phẩm thất bại!', status: status });
        }
    }

    async addItem(req, res) {
        const { ProductId, Description, CategoryId, CollectionId, FormId, URLPicture, UnitPrice, Title, Material, Style, Quantity, OldPrice, colors, sizes } = req.body;
        var ProductQuery = `INSERT INTO Products 
                (ProductId, Description, CategoryId, URLPicture, Vote, UnitPrice, Sold, Title, Quantity, CreatedDate, Status, OldPrice, Material, CollectionId, FormId, Style) 
                VALUES('${ProductId}', N'${Description}', '${CategoryId}', '${URLPicture}', 5, ${UnitPrice}, 0, N'${Title}', ${Quantity}, getDate(), 'On', ${OldPrice}, N'${Material}', '${CollectionId}', '${FormId}', N'${Style}')`;
        var listQuery = [];
        listQuery.push(ProductQuery);
        colors.forEach(color => {
            var query = `insert into ProductVariants (ProductId, Color, URLPicture) 
                        values ('${ProductId}', '${color.English}', '${color.URLPicture}')`;
            listQuery.push(query);
        })
        sizes.forEach(size => {
            var query = `insert into ProductSizes (ProductId, Size) values ('${ProductId}', '${size}')`;
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
                        res.send({ successful: false, message: "Đã xảy ra lỗi!" });
                        console.log(err)
                    } else {
                        console.log('success!')
                        res.send({ successful: true, message: "Thành công!" });
                        transaction.commit()
                    }
                })
            })
        })
    }
}

module.exports = new ProductsController();
