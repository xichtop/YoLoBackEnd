var sql = require("mssql");
var async = require('async');
var config = require("../config/config");

class ProductVariantsController {
    // [GET] /ProductVariants
    async index(req, res) {
        var query = `select * from ProductVariants`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }

    // [GET] /productvariants/:Productid
    async getById(req, res) {
        var query = `select * from ProductVariants where ProductId = '${req.params.ProductId}'`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }

    async checkColor(req, res) {
        const { color, productId } = req.body;
        var result = null;
        var query = `SELECT * FROM OrderDetails WHERE ProductId = '${productId}' AND Color = '${color}'`;
        try {
            let pool = await sql.connect(config)
            result = await pool.request()
                .query(query)
        } catch (err) {

        }
        if(result.recordsets[0].length === 0) {
            res.send({ successful: false, message: "Đã xảy ra lỗi!" });
        } else {
            res.send({ successful: true, message: "OK!" });
        }
    }

    async checkSize(req, res) {
        const { size, productId } = req.body;
        var result = null;
        var query = `SELECT * FROM OrderDetails WHERE ProductId = '${productId}' AND Size = '${size}'`;
        try {
            let pool = await sql.connect(config)
            result = await pool.request()
                .query(query)
        } catch (err) {

        }
        if(result.recordsets[0].length === 0) {
            res.send({ successful: false, message: "Đã xảy ra lỗi!" });
        } else {
            res.send({ successful: true, message: "OK!" });
        }
    }

    async update(req, res) {
        const { ProductId, colors } = req.body;
        var listQuery = [];
        var query = `DELETE FROM ProductVariants WHERE ProductId = '${ProductId}'`;
        listQuery.push(query);
        colors.map(color => {
            var query = `INSERT INTO ProductVariants (ProductId, Color, URLPicture) Values ('${ProductId}', '${color.English}', '${color.URLPicture}')`;
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

module.exports = new ProductVariantsController();