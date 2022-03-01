var sql = require("mssql");
var async = require('async');
var config = require("../config/config");

class QuantitybysizeController {
    // [GET] /products
    async index(req, res) {
        var query = `select * from ProductSizes`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }

    // [GET] /products/:ProductId
    async getById(req, res) {
        var query = `select * from ProductSizes where ProductId = '${req.params.ProductId}'`;
        try {
            let pool = await sql.connect(config)
            let result = await pool.request()
                .query(query)
            res.json(result.recordsets[0]);
        } catch (err) {
    
        }
    }

    async update(req, res) {
        const { ProductId, sizes } = req.body;
        var listQuery = [];
        var query = `DELETE FROM ProductSizes WHERE ProductId = '${ProductId}'`;
        listQuery.push(query);
        sizes.map(size => {
            var query = `INSERT INTO ProductSizes (ProductId, Size) Values ('${ProductId}', '${size}')`;
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

module.exports = new QuantitybysizeController();